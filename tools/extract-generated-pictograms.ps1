param(
  [Parameter(Mandatory = $true)]
  [string]$SourceImage,
  [string]$OutputDir = "assets/icons/shipyard-illustrated"
)

Add-Type -AssemblyName System.Drawing

$fullOutput = Join-Path (Get-Location) $OutputDir
New-Item -ItemType Directory -Force -Path $fullOutput | Out-Null

$icons = @(
  @{ Key = "blockAssembly"; File = "block-assembly.png" },
  @{ Key = "weldingWork"; File = "welding-work.png" },
  @{ Key = "hullPainting"; File = "hull-painting.png" },
  @{ Key = "qualityInspection"; File = "quality-inspection.png" },
  @{ Key = "materialStorage"; File = "material-storage.png" },
  @{ Key = "shipDesign"; File = "ship-design.png" },
  @{ Key = "ncCutting"; File = "nc-cutting.png" },
  @{ Key = "curvedBlockProcessing"; File = "curved-block-processing.png" },
  @{ Key = "steelPlateCutting"; File = "steel-plate-cutting.png" },
  @{ Key = "scaffolding"; File = "scaffolding.png" },
  @{ Key = "engineInstallation"; File = "engine-installation.png" },
  @{ Key = "craneOperation"; File = "crane-operation.png" },
  @{ Key = "cabinAssembly"; File = "cabin-assembly.png" },
  @{ Key = "propellerInstallation"; File = "propeller-installation.png" },
  @{ Key = "electricalWork"; File = "electrical-work.png" },
  @{ Key = "upperModuleInstallation"; File = "upper-module-installation.png" },
  @{ Key = "materialTransport"; File = "material-transport.png" },
  @{ Key = "boardingWork"; File = "boarding-work.png" },
  @{ Key = "cutInspection"; File = "cut-inspection.png" },
  @{ Key = "curvedBlockInspection"; File = "curved-block-inspection.png" },
  @{ Key = "yardTransfer"; File = "yard-transfer.png" },
  @{ Key = "namingCeremony"; File = "naming-ceremony.png" },
  @{ Key = "gasCutting"; File = "gas-cutting.png" },
  @{ Key = "anchorInstallation"; File = "anchor-installation.png" },
  @{ Key = "hullGrinding"; File = "hull-grinding.png" },
  @{ Key = "insulationWork"; File = "insulation-work.png" },
  @{ Key = "wasteDisposal"; File = "waste-disposal.png" },
  @{ Key = "safetyTraining"; File = "safety-training.png" },
  @{ Key = "remoteInspection"; File = "remote-inspection.png" },
  @{ Key = "ecoPainting"; File = "eco-painting.png" },
  @{ Key = "launchPrep"; File = "launch-prep.png" },
  @{ Key = "launchInspection"; File = "launch-inspection.png" },
  @{ Key = "seaTrial"; File = "sea-trial.png" },
  @{ Key = "controlRoom"; File = "control-room.png" },
  @{ Key = "sonarInstallation"; File = "sonar-installation.png" },
  @{ Key = "blockTransport"; File = "block-transport.png" },
  @{ Key = "weldingRobot"; File = "welding-robot.png" },
  @{ Key = "smartLogistics"; File = "smart-logistics.png" },
  @{ Key = "environmentalProtection"; File = "environmental-protection.png" },
  @{ Key = "safetyGear"; File = "safety-gear.png" },
  @{ Key = "pressureTest"; File = "pressure-test.png" },
  @{ Key = "dpInstallation"; File = "dp-installation.png" },
  @{ Key = "dpInspection"; File = "dp-inspection.png" },
  @{ Key = "classSurvey"; File = "class-survey.png" },
  @{ Key = "demoCheck"; File = "demo-check.png" },
  @{ Key = "lcWork"; File = "lc-work.png" },
  @{ Key = "stInspection"; File = "st-inspection.png" },
  @{ Key = "dlWork"; File = "dl-work.png" }
)

$source = [System.Drawing.Image]::FromFile($SourceImage)
$cols = 8
$rows = 6
$x0 = 17
$pitchX = 207.1
$rowTops = @(13, 181, 347, 499, 648, 793)
$cropW = 185
$cropH = 86
$targetW = 220
$targetH = 104

try {
  for ($i = 0; $i -lt $icons.Count; $i++) {
    $col = $i % $cols
    $row = [Math]::Floor($i / $cols)
    $srcX = [Math]::Round($x0 + ($pitchX * $col))
    $srcY = $rowTops[$row]
    $dest = New-Object System.Drawing.Bitmap $targetW, $targetH
    $graphics = [System.Drawing.Graphics]::FromImage($dest)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle 0, 0, $targetW, $targetH), (New-Object System.Drawing.Rectangle $srcX, $srcY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.Dispose()
    $dest.Save((Join-Path $fullOutput $icons[$i].File), [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
  }

  Copy-Item -LiteralPath $SourceImage -Destination (Join-Path $fullOutput "source-sheet-with-labels.png") -Force

  $previewW = $cols * $targetW
  $previewH = $rows * $targetH
  $preview = New-Object System.Drawing.Bitmap $previewW, $previewH
  $previewGraphics = [System.Drawing.Graphics]::FromImage($preview)
  $previewGraphics.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))
  for ($i = 0; $i -lt $icons.Count; $i++) {
    $col = $i % $cols
    $row = [Math]::Floor($i / $cols)
    $iconImage = [System.Drawing.Image]::FromFile((Join-Path $fullOutput $icons[$i].File))
    $previewGraphics.DrawImage($iconImage, $col * $targetW, $row * $targetH, $targetW, $targetH)
    $iconImage.Dispose()
  }
  $previewGraphics.Dispose()
  $preview.Save((Join-Path $fullOutput "preview-no-text.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $preview.Dispose()
}
finally {
  $source.Dispose()
}

Write-Output "Extracted $($icons.Count) pictogram images to $fullOutput"
