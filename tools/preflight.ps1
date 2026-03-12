param(
    [string]$Root = ".",
    [string]$BaseUrl = "http://localhost:8080",
    [string]$OutputDir = "reports",
    [switch]$StartServer,
    [int]$ServerPort = 8080,
    [switch]$SkipLighthouse,
    [switch]$SkipLinks,
    [switch]$SkipHtmlValidate,
    [switch]$SkipEncodingGuard,
    [switch]$SkipSeoSync
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path $Root).Path
$reportDir = Join-Path $projectRoot $OutputDir
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
}

$serverProc = $null
$results = New-Object System.Collections.Generic.List[object]

function Add-Result {
    param(
        [string]$Name,
        [string]$Status,
        [string]$Details
    )
    $results.Add([pscustomobject]@{
        Check   = $Name
        Status  = $Status
        Details = $Details
    })
}

function Run-Step {
    param(
        [string]$Name,
        [scriptblock]$Action
    )
    try {
        & $Action
        if ($LASTEXITCODE -ne $null -and $LASTEXITCODE -ne 0) {
            throw "Exit code $LASTEXITCODE"
        }
        Add-Result -Name $Name -Status "PASS" -Details ""
    } catch {
        Add-Result -Name $Name -Status "FAIL" -Details $_.Exception.Message
    } finally {
        $global:LASTEXITCODE = 0
    }
}

try {
    if ($StartServer) {
        $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
        if (-not $pythonCmd) {
            throw "python not found. Install Python or run without -StartServer."
        }
        $serverProc = Start-Process -FilePath $pythonCmd.Source -ArgumentList "-m http.server $ServerPort" -WorkingDirectory $projectRoot -PassThru
        Start-Sleep -Seconds 2
        $BaseUrl = "http://localhost:$ServerPort"
        Write-Output "Local server started at $BaseUrl (PID: $($serverProc.Id))"
    }

    if (-not $SkipLighthouse) {
        $targets = @(
            @{ Name = "root"; Url = "$BaseUrl/" },
            @{ Name = "en"; Url = "$BaseUrl/en/index.html" },
            @{ Name = "ru"; Url = "$BaseUrl/ru/index.html" },
            @{ Name = "zh"; Url = "$BaseUrl/zh/index.html" }
        )

        foreach ($t in $targets) {
            $jsonPath = Join-Path $reportDir ("lh-" + $t.Name + "-desktop.json")
            $stepName = "Lighthouse " + $t.Name
            Run-Step -Name $stepName -Action {
                npx --yes lighthouse $t.Url --preset=desktop --output=json --output-path $jsonPath --quiet
            }
        }
    } else {
        Add-Result -Name "Lighthouse" -Status "SKIP" -Details "Skipped by flag."
    }

    if (-not $SkipLinks) {
        $linksOut = Join-Path $reportDir "broken-links.txt"
        Run-Step -Name "Broken links" -Action {
            npx --yes broken-link-checker "$BaseUrl/" -ro | Tee-Object -FilePath $linksOut
        }
    } else {
        Add-Result -Name "Broken links" -Status "SKIP" -Details "Skipped by flag."
    }

    if (-not $SkipHtmlValidate) {
        $htmlOut = Join-Path $reportDir "html-validate.txt"
        Run-Step -Name "HTML validate" -Action {
            Push-Location $projectRoot
            try {
                npx --yes html-validate "**/*.html" | Tee-Object -FilePath $htmlOut
            } finally {
                Pop-Location
            }
        }
    } else {
        Add-Result -Name "HTML validate" -Status "SKIP" -Details "Skipped by flag."
    }

    if (-not $SkipEncodingGuard) {
        $guardScript = Join-Path $projectRoot "tools\encoding-guard.ps1"
        Run-Step -Name "Encoding guard" -Action {
            powershell -ExecutionPolicy Bypass -File $guardScript -Root $projectRoot
        }
    } else {
        Add-Result -Name "Encoding guard" -Status "SKIP" -Details "Skipped by flag."
    }

    if (-not $SkipSeoSync) {
        $seoScript = Join-Path $projectRoot "tools\seo-sync-check.ps1"
        Run-Step -Name "SEO sync check" -Action {
            powershell -ExecutionPolicy Bypass -File $seoScript -Root $projectRoot
        }
    } else {
        Add-Result -Name "SEO sync check" -Status "SKIP" -Details "Skipped by flag."
    }
}
finally {
    if ($serverProc -and -not $serverProc.HasExited) {
        Stop-Process -Id $serverProc.Id -Force
        Write-Output "Stopped local server PID: $($serverProc.Id)"
    }
}

$summaryPath = Join-Path $reportDir "preflight-summary.txt"
$results | Format-Table -AutoSize | Tee-Object -FilePath $summaryPath

$failCount = @($results | Where-Object { $_.Status -eq "FAIL" }).Count
Write-Output ""
Write-Output "Summary saved: $summaryPath"
Write-Output "Reports folder: $reportDir"

if ($failCount -gt 0) {
    exit 1
}

exit 0
