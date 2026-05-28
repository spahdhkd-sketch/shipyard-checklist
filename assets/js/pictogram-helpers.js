(function attachPictogramHelpers(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardPictogramHelpers = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildPictogramHelpers() {
  const ICON_ALIASES = {
    load: "upperModuleInstallation",
    mounting: "blockAssembly",
    erection: "blockAssembly",
    painting: "hullPainting",
    launching: "launchPrep",
    outfitting: "electricalWork",
    cutting: "steelPlateCutting",
    welding: "weldingWork",
    goliathCrane: "craneOperation",
    weldingMachine: "weldingWork",
    grinder: "hullGrinding",
    airHose: "pressureTest",
    liftingJack: "yardTransfer",
    spanner: "qualityInspection",
    hammer: "steelPlateCutting",
    measuringTool: "cutInspection",
    drill: "ncCutting",
    paintGun: "hullPainting",
    pressureWasher: "pressureTest",
    height: "scaffolding",
    workAtHeights: "scaffolding",
    confined: "safetyGear",
    confinedSpace: "safetyGear",
    inspect: "qualityInspection",
    pressure: "pressureTest",
    fire: "safetyTraining",
    crushingHazard: "safetyTraining",
    fallingObjects: "safetyTraining",
    firePrevention: "safetyTraining",
    chemicalHandling: "wasteDisposal",
    heavyLifting: "upperModuleInstallation",
    hardHat: "safetyGear",
    safetyGlasses: "safetyGear",
    safetyGloves: "safetyGear",
    hearingProtection: "safetyGear",
    fallArrest: "safetyTraining",
    fireAlarm: "safetyTraining",
    W: "weldingWork",
    H: "scaffolding",
    M: "blockAssembly",
    C: "safetyGear",
  };

  function normalizeIconKey(id) {
    return ICON_ALIASES[id] || id;
  }

  function isSyncEnabled(options) {
    const value = options && options.syncConfigured;
    return typeof value === "function" ? Boolean(value()) : Boolean(value);
  }

  function pictogramLazyImageSrc(row, options = {}) {
    const id = String(row && row.id || "").trim();
    if (!id || !isSyncEnabled(options)) return "";
    const supabaseUrl = String(options.supabaseUrl || "").replace(/\/+$/, "");
    if (!supabaseUrl) return "";
    const version = encodeURIComponent(row.storagePath || row.updatedAt || row.id);
    return `${supabaseUrl}/functions/v1/pictogram-image?id=${encodeURIComponent(id)}&v=${version}`;
  }

  function lineIconName(id, fallbackIcon = "") {
    const key = normalizeIconKey(id);
    const text = `${id || ""} ${key || ""} ${fallbackIcon || ""}`.toLowerCase();
    const label = String(fallbackIcon || "");
    if (/demo/.test(text) || /DEMO/i.test(label)) return "checkCircle";
    if (/선주|선급|classsurvey/.test(text) || /선주|선급/.test(label)) return "award";
    if (/압력|pressure/.test(text) || /압력/.test(label)) return "gauge";
    if (/dp.*검사|dpinspection/.test(text) || /DP\s*검사/i.test(label)) return "clipboardCheck";
    if (/dp.*설치|dpinstallation/.test(text) || /DP\s*설치/i.test(label)) return "flame";
    if (/후행|post/.test(text) || /후행/.test(label)) return "pipe";
    if (/선행|pre/.test(text) || /선행/.test(label)) return "wrench";
    if (/탑재|mount|erection|load|anchor|blockassembly|uppermodule|engineinstallation|sonarinstallation/.test(text) || /탑재/.test(label)) return "anchor";
    if (/inspection|inspect|quality|검사/.test(text) || /검사/.test(label)) return "clipboardCheck";
    if (/welding|cutting|gas|fire|용접|절단/.test(text) || /용접|절단/.test(label)) return "flame";
    if (/tool|spanner|hammer|drill|grinder|설치|작업/.test(text) || /설치|작업/.test(label)) return "wrench";
    return "shieldCheck";
  }

  return {
    normalizeIconKey,
    pictogramLazyImageSrc,
    lineIconName,
  };
}));
