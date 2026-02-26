param(
    [ValidateSet("encode", "decode")]
    [string]$Mode = "encode",
    [string]$SourceDir = "",
    [string]$TargetDir = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-Utf8NoBomEncoding {
    return [System.Text.UTF8Encoding]::new($false)
}

function Convert-ToHtmlEntities {
    param([string]$Text)

    $sb = [System.Text.StringBuilder]::new()
    foreach ($ch in $Text.ToCharArray()) {
        $code = [int][char]$ch
        if ($code -gt 127) {
            [void]$sb.Append(("&#x{0:X};" -f $code))
        } else {
            [void]$sb.Append($ch)
        }
    }
    return $sb.ToString()
}

function Convert-FromHtmlEntities {
    param([string]$Text)

    $hexDecoded = [System.Text.RegularExpressions.Regex]::Replace(
        $Text,
        "&#x([0-9A-Fa-f]+);",
        {
            param($m)
            [char][Convert]::ToInt32($m.Groups[1].Value, 16)
        }
    )

    $decDecoded = [System.Text.RegularExpressions.Regex]::Replace(
        $hexDecoded,
        "&#([0-9]+);",
        {
            param($m)
            [char][int]$m.Groups[1].Value
        }
    )

    return $decDecoded
}

if ([string]::IsNullOrWhiteSpace($SourceDir)) {
    $SourceDir = if ($Mode -eq "encode") { "zh-src" } else { "zh" }
}

if ([string]::IsNullOrWhiteSpace($TargetDir)) {
    $TargetDir = if ($Mode -eq "encode") { "zh" } else { "zh-src" }
}

if (-not (Test-Path -Path $SourceDir -PathType Container)) {
    throw "Source directory not found: $SourceDir"
}

if (-not (Test-Path -Path $TargetDir -PathType Container)) {
    New-Item -Path $TargetDir -ItemType Directory | Out-Null
}

$utf8NoBom = Get-Utf8NoBomEncoding
$files = Get-ChildItem -Path $SourceDir -Filter *.html -File

foreach ($file in $files) {
    $srcPath = $file.FullName
    $dstPath = Join-Path $TargetDir $file.Name

    $raw = [System.IO.File]::ReadAllText($srcPath, $utf8NoBom)
    $out = if ($Mode -eq "encode") { Convert-ToHtmlEntities -Text $raw } else { Convert-FromHtmlEntities -Text $raw }

    [System.IO.File]::WriteAllText($dstPath, $out, $utf8NoBom)
    Write-Output ("[{0}] {1} -> {2}" -f $Mode, $srcPath, $dstPath)
}

