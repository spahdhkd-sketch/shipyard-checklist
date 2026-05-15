$ErrorActionPreference = 'Stop'

$root = Get-Location
$index = Join-Path $root 'index.html'
$backup = Join-Path $root 'index.original.html'

if (-not (Test-Path -LiteralPath $backup)) {
  Copy-Item -LiteralPath $index -Destination $backup
}

New-Item -ItemType Directory -Force -Path (Join-Path $root 'assets\css') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $root 'assets\js') | Out-Null

$text = [System.IO.File]::ReadAllText($backup, [System.Text.Encoding]::UTF8)
$styleMatch = [regex]::Match($text, '(?s)<style>\s*(.*?)\s*</style>')
if (-not $styleMatch.Success) { throw 'style block not found' }

$scriptMatches = [regex]::Matches($text, '(?s)<script(?![^>]*src=)[^>]*>\s*(.*?)\s*</script>')
if ($scriptMatches.Count -lt 1) { throw 'inline app script not found' }

$css = $styleMatch.Groups[1].Value
$appScript = $scriptMatches[$scriptMatches.Count - 1].Groups[1].Value

# Low-risk cleanup: remove styles tied to the unused renderHistoryDetail renderer.
$css = [regex]::Replace($css, '(?s)\s*\.history-detail-wrap\s*\{.*?\.history-check-mark\.missing\s*\{.*?\}\s*', "`r`n")
$css = [regex]::Replace($css, '(?s)\s*\.process-stack\s*\{.*?\.process-count\s*\{.*?\}\s*', "`r`n")
$css = [regex]::Replace($css, '(?s)\s*\.process-summary\s*\{.*?\.summary-ring-inner\s*\{.*?\}\s*', "`r`n")

# Low-risk JS cleanup and multi-page entry support.
$appScript = [regex]::Replace($appScript, '(?m)^\s*const APP_VERSION = "[^"]*";\s*\r?\n', '')
$appScript = [regex]::Replace($appScript, '(?s)\r?\n\s*function renderHistoryDetail\(row, cat\) \{.*?\r?\n\s*function renderInspectionRecord\(', "`r`n`r`n    function renderInspectionRecord(")
$appScript = $appScript -replace 'view: "dashboard",', 'view: initialView(),'

$helper = @'
    function initialView() {
      const view = document.body?.dataset?.initialView || "dashboard";
      return NAV.some((nav) => nav.id === view) ? view : "dashboard";
    }

    function pageForView(view) {
      return {
        dashboard: "index.html",
        check: "check.html",
        ships: "ships.html",
        history: "history.html",
        items: "items.html",
      }[view] || "index.html";
    }

    function currentPageName() {
      const page = location.pathname.split("/").pop() || "index.html";
      return page.toLowerCase();
    }

    function navigateToView(view) {
      const page = pageForView(view);
      if (currentPageName() !== page.toLowerCase()) {
        location.href = page;
        return true;
      }
      return false;
    }

'@
$appScript = $appScript -replace '    function boot\(\) \{', ($helper + '    function boot() {')

$changePattern = '(?s)    function changeView\(view, options = \{\}\) \{.*?\r?\n    function setSyncStatus\('
$changeReplacement = @'
    function changeView(view, options = {}) {
      if (view === "items" && !verifyAdmin()) return;
      if (navigateToView(view)) return;
      const changed = state.view !== view || state.selectedCategoryId || state.historyDetailId;
      state.view = view;
      if (view !== "check") state.selectedCategoryId = null;
      if (!["dashboard", "history"].includes(view)) state.historyDetailId = null;
      render();
      if (changed) {
        options.replace ? replaceRouteState() : pushRouteState();
      }
    }

    function setSyncStatus(
'@
$appScript = [regex]::Replace($appScript, $changePattern, $changeReplacement)

[System.IO.File]::WriteAllText((Join-Path $root 'assets\css\styles.css'), $css.Trim() + "`r`n", [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText((Join-Path $root 'assets\js\app.js'), $appScript.Trim() + "`r`n", [System.Text.Encoding]::UTF8)

$bodyMatch = [regex]::Match($text, '(?s)<body>\s*(.*?)\s*<script src="https://cdn\.jsdelivr\.net/npm/@supabase/supabase-js@2(?:\.\d+\.\d+)?"></script>\s*<script>')
if (-not $bodyMatch.Success) { throw 'body shell not found' }
$bodyShell = $bodyMatch.Groups[1].Value.Trim()

$titleMatch = [regex]::Match($text, '(?s)<title>(.*?)</title>')
$title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { 'Shipyard Safety Checklist' }

function Write-Page($file, $view, $title, $bodyShell) {
  $html = @"
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://psatbyktzladtymdygwh.supabase.co https://*.supabase.co; connect-src 'self' https://psatbyktzladtymdygwh.supabase.co https://*.supabase.co; base-uri 'none'; object-src 'none'" />
  <title>$title</title>
  <link rel="stylesheet" href="assets/css/styles.css" />
</head>
<body data-initial-view="$view">
$bodyShell
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.3" defer></script>
  <script src="assets/js/app.js" defer></script>
</body>
</html>
"@
  [System.IO.File]::WriteAllText((Join-Path $root $file), $html, [System.Text.Encoding]::UTF8)
}

Write-Page 'index.html' 'dashboard' $title $bodyShell
Write-Page 'check.html' 'check' $title $bodyShell
Write-Page 'history.html' 'history' $title $bodyShell
Write-Page 'ships.html' 'ships' $title $bodyShell
Write-Page 'items.html' 'items' $title $bodyShell
