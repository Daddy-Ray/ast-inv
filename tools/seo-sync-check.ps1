param(
    [string]$Root = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path $Root).Path
$utf8 = [System.Text.UTF8Encoding]::new($false)

$pairs = @(
    @{ Lang = "en"; Src = "en-src" },
    @{ Lang = "zh"; Src = "zh-src" },
    @{ Lang = "ru"; Src = "ru-src" }
)

$issues = New-Object System.Collections.Generic.List[string]

function Add-Issue {
    param([string]$Msg)
    $issues.Add($Msg)
}

function Read-Text {
    param([string]$FilePath)
    return [System.IO.File]::ReadAllText($FilePath, $utf8)
}

function Assert-SeoTags {
    param(
        [string]$FilePath,
        [string]$Lang,
        [string]$FileName
    )

    $text = Read-Text -FilePath $FilePath
    $canonical = "https://www.ast-inv.hk/$Lang/$FileName"
    $altEn = "https://www.ast-inv.hk/en/$FileName"
    $altZh = "https://www.ast-inv.hk/zh/$FileName"
    $altRu = "https://www.ast-inv.hk/ru/$FileName"
    $altDefault = "https://www.ast-inv.hk/index.html"

    $checks = @(
        @{ Label = "canonical"; Pattern = "<link\s+rel=`"canonical`"\s+href=`"$([regex]::Escape($canonical))`"\s*/?>" },
        @{ Label = "hreflang en"; Pattern = "<link\s+rel=`"alternate`"\s+hreflang=`"en`"\s+href=`"$([regex]::Escape($altEn))`"\s*/?>" },
        @{ Label = "hreflang zh-CN"; Pattern = "<link\s+rel=`"alternate`"\s+hreflang=`"zh-CN`"\s+href=`"$([regex]::Escape($altZh))`"\s*/?>" },
        @{ Label = "hreflang ru"; Pattern = "<link\s+rel=`"alternate`"\s+hreflang=`"ru`"\s+href=`"$([regex]::Escape($altRu))`"\s*/?>" },
        @{ Label = "hreflang x-default"; Pattern = "<link\s+rel=`"alternate`"\s+hreflang=`"x-default`"\s+href=`"$([regex]::Escape($altDefault))`"\s*/?>" }
    )

    foreach ($c in $checks) {
        if ($text -notmatch $c.Pattern) {
            Add-Issue "$FilePath => missing or incorrect $($c.Label)"
        }
    }
}

foreach ($p in $pairs) {
    $langDir = Join-Path $rootPath $p.Lang
    $srcDir = Join-Path $rootPath $p.Src

    if (-not (Test-Path $langDir)) {
        Add-Issue "Missing directory: $langDir"
        continue
    }
    if (-not (Test-Path $srcDir)) {
        Add-Issue "Missing directory: $srcDir"
        continue
    }

    $langFiles = Get-ChildItem -Path $langDir -File -Filter *.html | Select-Object -ExpandProperty Name
    $srcFiles = Get-ChildItem -Path $srcDir -File -Filter *.html | Select-Object -ExpandProperty Name

    foreach ($f in $langFiles) {
        $srcPath = Join-Path $srcDir $f
        if (-not (Test-Path $srcPath)) {
            Add-Issue "Missing src page: $srcPath"
            continue
        }
    }

    foreach ($f in $srcFiles) {
        $langPath = Join-Path $langDir $f
        if (-not (Test-Path $langPath)) {
            Add-Issue "Extra src page without live counterpart: $srcDir\$f"
            continue
        }
    }

    foreach ($f in $langFiles) {
        Assert-SeoTags -FilePath (Join-Path $langDir $f) -Lang $p.Lang -FileName $f
    }
    foreach ($f in $srcFiles) {
        Assert-SeoTags -FilePath (Join-Path $srcDir $f) -Lang $p.Lang -FileName $f
    }
}

if ($issues.Count -gt 0) {
    Write-Output "SEO sync check FAILED:"
    $issues | Sort-Object | ForEach-Object { Write-Output " - $_" }
    exit 1
}

Write-Output "SEO sync check PASSED: page parity and SEO tags are aligned."
exit 0
