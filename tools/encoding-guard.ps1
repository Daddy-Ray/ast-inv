param(
    [string]$Root = ".",
    [switch]$FixZhSrcFromZh
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path $Root).Path
$utf8 = [System.Text.UTF8Encoding]::new($false)
$replacementChar = [char]0xFFFD

# Keep patterns ASCII-only in source file to avoid parser issues.
$badRegexParts = @(
    [regex]::Escape([string]$replacementChar),
    "\?\/(h[1-6]|p|span|li|a|div)"
)
$badRegex = ($badRegexParts -join "|")

$allHtml = Get-ChildItem -Path $rootPath -Recurse -File -Include *.html
$badFiles = @()

foreach ($f in $allHtml) {
    $text = [System.IO.File]::ReadAllText($f.FullName, $utf8)
    if ($text -match $badRegex) {
        $badFiles += $f.FullName
    }
}

if ($FixZhSrcFromZh) {
    $zhDir = Join-Path $rootPath "zh"
    $zhSrcDir = Join-Path $rootPath "zh-src"
    if ((Test-Path $zhDir) -and (Test-Path $zhSrcDir)) {
        $zhFiles = Get-ChildItem -Path $zhDir -File -Filter *.html
        foreach ($zf in $zhFiles) {
            Copy-Item $zf.FullName (Join-Path $zhSrcDir $zf.Name) -Force
        }
        Write-Output "Synced zh -> zh-src for all html files."
    }
}

if ($badFiles.Count -gt 0) {
    Write-Output "Encoding guard FAILED. Possible mojibake detected:"
    $badFiles | Sort-Object | ForEach-Object { Write-Output " - $_" }
    exit 1
}

Write-Output "Encoding guard PASSED. No mojibake markers found."
