const STORAGE_PREFIX = "shipyardSafetyV1.";
    const ADMIN_PASSWORD = "gs2026";
    const APP_VERSION = "0.2-20260520";
    const SUPABASE_URL = "https://psatbyktzladtymdygwh.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYXRieWt0emxhZHR5bWR5Z3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODM1NjEsImV4cCI6MjA5NDA1OTU2MX0.tGbJ0Eg8lprH2UaCwlfHYfnrfaDDKvv3fjo4NhvgclQ";
    const SERVER_CLOCK_REFRESH_MS = 5 * 60 * 1000;
    const REMOTE_PULL_THROTTLE_MS = 60 * 1000;
    const SYNC_RETRY_DELAY_MS = 8 * 1000;
    const MAX_SYNC_ATTEMPTS = 5;
    const OLD_KEYS = {
      checklists: "checklists",
      ships: "ships",
      history: "history",
    };
    const COLORS = ["#1f6eb3", "#168a94", "#2e7d4f", "#a86616", "#8b5fbf", "#b8323b", "#5f6f82", "#c45d2d"];
    const RISKS = {
      high: { label: "위험", className: "risk-high" },
      medium: { label: "주의", className: "risk-medium" },
      low: { label: "정상", className: "risk-low" },
    };
    const NAV = [
      { id: "dashboard", label: "홈", icon: "home" },
      { id: "check", label: "작업 전 점검", icon: "noteCheck" },
      { id: "ships", label: "호선", icon: "ship" },
      { id: "history", label: "점검 이력", icon: "book" },
      { id: "items", label: "빠른 메뉴", icon: "menu" },
      { id: "pledge", label: "서약", icon: "noteCheck" },
      { id: "analytics", label: "통계", icon: "board" },
    ];
    const MOBILE_NAV_IDS = new Set(["dashboard", "check", "ships", "history", "items"]);
    const ADMIN_NAV_ITEM = { id: "manage", label: "관리", icon: "settings" };
    const PREVIEW_NAV_ITEMS = [];
    const PICTOGRAMS = [
      { key: "blockAssembly", label: "블록 조립" },
      { key: "weldingWork", label: "용접 작업" },
      { key: "hullPainting", label: "선체 도장" },
      { key: "qualityInspection", label: "품질 검사" },
      { key: "materialStorage", label: "자재 보관" },
      { key: "shipDesign", label: "선박 설계" },
      { key: "ncCutting", label: "NC 절단" },
      { key: "curvedBlockProcessing", label: "곡블록 가공" },
      { key: "steelPlateCutting", label: "철판 절단" },
      { key: "scaffolding", label: "비계 설치" },
      { key: "engineInstallation", label: "엔진 탑재" },
      { key: "craneOperation", label: "크레인 운전" },
      { key: "cabinAssembly", label: "선실 조립" },
      { key: "propellerInstallation", label: "프로펠러 설치" },
      { key: "electricalWork", label: "전장 작업" },
      { key: "upperModuleInstallation", label: "상부 탑재" },
      { key: "materialTransport", label: "자재 운반" },
      { key: "boardingWork", label: "승선 작업" },
      { key: "cutInspection", label: "절단 검사" },
      { key: "curvedBlockInspection", label: "곡블록 검사" },
      { key: "yardTransfer", label: "선대 이동" },
      { key: "namingCeremony", label: "명명식" },
      { key: "gasCutting", label: "가스 절단" },
      { key: "anchorInstallation", label: "선거 설치" },
      { key: "hullGrinding", label: "선체 연마" },
      { key: "insulationWork", label: "보온 시공" },
      { key: "wasteDisposal", label: "폐기물 처리" },
      { key: "safetyTraining", label: "안전 교육" },
      { key: "remoteInspection", label: "원격 검사" },
      { key: "ecoPainting", label: "친환경 도장" },
      { key: "launchPrep", label: "진수 준비" },
      { key: "launchInspection", label: "진수 점검" },
      { key: "seaTrial", label: "시운전" },
      { key: "controlRoom", label: "통합 관제" },
      { key: "sonarInstallation", label: "소나 탑재" },
      { key: "blockTransport", label: "블록 운송" },
      { key: "weldingRobot", label: "용접 로봇" },
      { key: "smartLogistics", label: "스마트 물류" },
      { key: "environmentalProtection", label: "환경 보호" },
      { key: "safetyGear", label: "보호 장구" },
      { key: "pressureTest", label: "압력 테스트" },
      { key: "dpInstallation", label: "DP 설치" },
      { key: "dpInspection", label: "DP 검사" },
      { key: "classSurvey", label: "선주선급검사" },
      { key: "demoCheck", label: "DEMO 체크" },
      { key: "lcWork", label: "L/C 작업" },
      { key: "stInspection", label: "S/T 검사" },
      { key: "dlWork", label: "D/L 작업" },
    ];
    const ILLUSTRATION_BASE = "assets/icons/shipyard/illustrations/";
    const illustration = (name) => `${ILLUSTRATION_BASE}${name}.png`;
    const PICTOGRAM_ASSETS = {
      blockAssembly: illustration("blockAssembly"),
      weldingWork: illustration("weldingWork"),
      hullPainting: illustration("hullPainting"),
      qualityInspection: illustration("qualityInspection"),
      materialStorage: illustration("materialStorage"),
      shipDesign: illustration("shipDesign"),
      ncCutting: illustration("ncCutting"),
      curvedBlockProcessing: illustration("curvedBlockProcessing"),
      steelPlateCutting: illustration("steelPlateCutting"),
      scaffolding: illustration("scaffolding"),
      engineInstallation: illustration("engineInstallation"),
      craneOperation: illustration("craneOperation"),
      cabinAssembly: illustration("cabinAssembly"),
      propellerInstallation: illustration("propellerInstallation"),
      electricalWork: illustration("electricalWork"),
      upperModuleInstallation: illustration("upperModuleInstallation"),
      materialTransport: illustration("materialTransport"),
      boardingWork: illustration("boardingWork"),
      cutInspection: illustration("cutInspection"),
      curvedBlockInspection: illustration("curvedBlockProcessing"),
      yardTransfer: illustration("yardTransfer"),
      namingCeremony: illustration("namingCeremony"),
      gasCutting: illustration("gasCutting"),
      anchorInstallation: illustration("anchorInstallation"),
      hullGrinding: illustration("gasCutting"),
      insulationWork: illustration("insulationWork"),
      wasteDisposal: illustration("wasteDisposal"),
      safetyTraining: illustration("safetyTraining"),
      remoteInspection: illustration("remoteInspection"),
      ecoPainting: illustration("ecoPainting"),
      launchPrep: illustration("yardTransfer"),
      launchInspection: illustration("namingCeremony"),
      seaTrial: illustration("yardTransfer"),
      controlRoom: illustration("controlRoom"),
      sonarInstallation: illustration("controlRoom"),
      blockTransport: illustration("materialTransport"),
      weldingRobot: illustration("weldingWork"),
      smartLogistics: illustration("materialTransport"),
      environmentalProtection: illustration("ecoPainting"),
      safetyGear: illustration("safetyTraining"),
      pressureTest: illustration("qualityInspection"),
      dpInstallation: illustration("controlRoom"),
      dpInspection: illustration("qualityInspection"),
      classSurvey: illustration("qualityInspection"),
      demoCheck: illustration("cutInspection"),
      lcWork: illustration("blockAssembly"),
      stInspection: illustration("qualityInspection"),
      dlWork: illustration("yardTransfer"),
      welding: illustration("weldingWork"),
      workAtHeights: illustration("scaffolding"),
      erection: illustration("blockAssembly"),
      confinedSpace: illustration("boardingWork"),
      confined: illustration("boardingWork"),
    };
    const BUILT_IN_PICTOGRAMS = PICTOGRAMS.map((icon, index) => ({
      id: icon.key,
      label: icon.label,
      src: PICTOGRAM_ASSETS[icon.key] || "",
      source: "builtIn",
      order: index + 1,
      deleted: false,
    }));
    const SHIP_TYPES = ["CNTR", "LNG", "LPG", "COT", "FSRU", "기타"];
    const TOOL_NATURES = ["선행", "후행", "선행/후행"];
    const MATERIAL_TYPES = [
      { id: "bolt", label: "볼트/너트", sub: "Bolts & Nuts", icon: "⌁", tone: "blue" },
      { id: "welding", label: "용접 소모품", sub: "Welding supply", icon: "▣", tone: "red" },
      { id: "pipe", label: "배관/피팅", sub: "Pipe & Fitting", icon: "∿", tone: "teal" },
      { id: "coating", label: "도장 자재", sub: "Coating supply", icon: "▥", tone: "purple" },
      { id: "structural", label: "구조재", sub: "Structural", icon: "⌙", tone: "orange" },
      { id: "other", label: "기타", sub: "Other", icon: "▭", tone: "slate" },
    ];
    const MATERIAL_UNITS = ["EA", "개", "박스", "매", "캔", "m", "kg"];
    const CHECKLIST_RULES = window.ChecklistRules;
    const ISSUE_MATERIAL_RULES = window.IssueMaterialRules;
    const ISSUE_PHOTO_BUCKET = "issue-photos";
    const ITEM_VISIBILITY_CONDITIONS = ["항상 표시", ...TOOL_NATURES];
    const DEFAULT_CATEGORY_NATURES = {
      mounting: "선행",
      pre_install: "선행",
      post_install: "후행",
      dp_install: "후행",
      dp_inspection: "후행",
      pressure_test: "선행/후행",
      owner_class: "후행",
      demo_check: "후행",
    };
    const SHIP_WORKFLOW_STAGES = ["mounting", "lc", "st", "cl", "dl"];
    const DEFAULT_PLEDGE_RULES = [
      "지정된 보호구를 반드시 착용합니다.",
      "작업 전 체크리스트를 성실히 이행합니다.",
      "불안전 요소 발견 시 즉시 보고합니다.",
      "동료의 안전을 함께 지킵니다.",
      "음주·약물 상태에서는 절대 작업하지 않습니다.",
    ];
    const SHIP_SORT_OPTIONS = [
      ["stage", "공정 상태순"],
      ["number", "호선 번호순"],
      ["lcDate", "L/C일 빠른순"],
      ["dlDate", "D/L일 빠른순"],
      ["recent", "최근 추가순"],
      ["saved", "저장된 순서"],
    ];
    const STAGE_META = {
      mounting: { stage: "mounting", label: "탑재", percent: 20, color: "#8F5E35", bg: "#F8F1E8" },
      lc: { stage: "lc", label: "L/C", percent: 45, color: "#1d4ed8", bg: "#eff6ff" },
      st: { stage: "st", label: "S/T", percent: 70, color: "#0f766e", bg: "#f0fdfa" },
      cl: { stage: "cl", label: "C/L", percent: 92, color: "#4F7A5C", bg: "#F1F6F2" },
      dl: { stage: "dl", label: "D/L", percent: 100, color: "#7e22ce", bg: "#faf5ff" },
    };
    const CATEGORY_STAGE_RULES = [
      { stage: "mounting", ids: ["mounting"], labels: ["탑재", "선행 설치"] },
      { stage: "lc", ids: ["lc"], labels: ["후행 설치", "DP설치", "DP 설치", "DP검사", "DP 검사", "압력테스트", "압력 테스트"] },
      { stage: "st", ids: ["st"], labels: ["선주선급", "선주 선급", "DEMO", "Demo", "demo"] },
    ];
    const REMOTE_TABLES = [
      {
        table: "safety_categories",
        key: "categories",
        toDb: (row) => ({
          id: row.id,
          label: row.label,
          icon: row.icon,
          color: row.color,
          require_tool_check: row.requireToolCheck !== false,
          tool_nature: normalizeToolNature(row.toolNature || defaultToolNatureForCategory(row)),
          tool_ids: sanitizeToolIds(row.toolIds),
          sort_order: row.order || 0,
        }),
        fromDb: (row) => ({
          id: row.id,
          label: row.label,
          icon: row.icon,
          color: row.color,
          requireToolCheck: row.require_tool_check !== false,
          toolNature: normalizeToolNature(row.tool_nature || defaultToolNatureForCategory(row)),
          toolIds: sanitizeToolIds(row.tool_ids),
          order: row.sort_order || 0,
        }),
      },
      {
        table: "safety_sections",
        key: "sections",
        toDb: (row) => ({ id: row.id, category_id: row.categoryId, title: row.title, sort_order: row.order || 0 }),
        fromDb: (row) => ({ id: row.id, categoryId: row.category_id, title: row.title, order: row.sort_order || 0 }),
      },
      {
        table: "safety_items",
        key: "items",
        toDb: (row) => ({
          id: row.id,
          category_id: row.categoryId,
          section_id: row.sectionId,
          text: row.text,
          risk: row.risk,
          required: Boolean(row.required),
          active: row.active !== false,
          tool_ids: sanitizeToolIds(row.toolIds),
          visibility_condition: normalizeVisibilityCondition(row.visibilityCondition),
          sort_order: row.order || 0,
        }),
        fromDb: (row) => ({
          id: row.id,
          categoryId: row.category_id,
          sectionId: row.section_id,
          text: row.text,
          risk: row.risk,
          required: Boolean(row.required),
          active: row.active !== false,
          toolIds: sanitizeToolIds(row.tool_ids),
          visibilityCondition: normalizeVisibilityCondition(row.visibility_condition),
          order: row.sort_order || 0,
        }),
      },
      {
        table: "safety_tools",
        key: "tools",
        toDb: (row) => ({
          id: row.id,
          category_id: row.categoryId || null,
          name: row.name,
          nature: normalizeToolNature(row.nature),
          deleted: Boolean(row.deleted),
          sort_order: row.order || 0,
        }),
        fromDb: (row) => ({
          id: row.id,
          categoryId: row.category_id,
          name: row.name,
          nature: normalizeToolNature(row.nature),
          deleted: Boolean(row.deleted),
          createdAt: row.created_at,
          order: row.sort_order || 0,
        }),
      },
      {
        table: "safety_pictograms",
        key: "pictograms",
        rows: (rows) => rows.filter((row) => row.source === "custom"),
        toDb: (row) => ({
          id: row.id,
          label: row.label,
          src: row.src,
          source: "custom",
          deleted: Boolean(row.deleted),
          sort_order: row.order || 0,
        }),
        fromDb: (row) => ({
          id: row.id,
          label: row.label,
          src: row.src,
          source: row.source || "custom",
          deleted: Boolean(row.deleted),
          order: row.sort_order || 0,
        }),
      },
      {
        table: "safety_ships",
        key: "ships",
        toDb: (row) => ({
          id: row.id,
          no: row.no,
          type: row.type || "",
          note: shipNotePayload(row),
          process_stage: row.processStage || "mounting",
          delivery_type: shipDeliveryType(row),
          delivery_date: shipDeliveryDate(row) || null,
          created_at: row.createdAt || serverNow().toISOString(),
          sort_order: row.order || 0,
        }),
        fromDb: (row) => {
          const meta = parseShipNote(row.note);
          const deliveryType = row.delivery_type || meta.deliveryType || "";
          const deliveryDate = row.delivery_date || meta.deliveryDate || "";
          return {
            id: row.id,
            no: row.no,
            type: row.type || "",
            note: meta.note || "",
            processStage: row.process_stage || "mounting",
            deliveryType,
            deliveryDate,
            lcDate: meta.lcDate || "",
            stDate: meta.stDate || "",
            clDate: meta.clDate || (deliveryType === "C/L" ? deliveryDate : ""),
            dlDate: meta.dlDate || (deliveryType === "D/L" ? deliveryDate : ""),
            createdAt: row.created_at,
            order: row.sort_order || 0,
          };
        },
      },
      {
        table: "safety_inspections",
        key: "inspections",
        toDb: (row) => ({
          id: row.id,
          category_id: row.categoryId,
          worker: row.worker,
          ship_no: row.shipNo,
          date: row.date,
          time: row.time,
          status: row.status,
          warnings: row.warnings || 0,
          completion: row.completion || 0,
          tools: Array.isArray(row.tools) ? row.tools : [],
          safety_pledge: row.safetyPledge || "",
          created_at: row.createdAt || serverNow().toISOString(),
        }),
        fromDb: (row) => ({
          id: row.id,
          categoryId: row.category_id,
          worker: row.worker,
          shipNo: row.ship_no,
          date: row.date,
          time: row.time,
          status: row.status,
          warnings: row.warnings || 0,
          completion: row.completion || 0,
          tools: Array.isArray(row.tools) ? row.tools : [],
          safetyPledge: row.safety_pledge || "",
          createdAt: row.created_at,
        }),
      },
      {
        table: "safety_inspection_items",
        key: "inspectionItems",
        toDb: (row) => ({
          id: row.id,
          inspection_id: row.inspectionId,
          item_id: row.itemId,
          checked: Boolean(row.checked),
          risk: row.risk,
          text: row.text,
          section_title: row.sectionTitle || "",
        }),
        fromDb: (row) => ({
          id: row.id,
          inspectionId: row.inspection_id,
          itemId: row.item_id,
          checked: Boolean(row.checked),
          risk: row.risk,
          text: row.text,
          sectionTitle: row.section_title || "",
        }),
      },
      {
        table: "workers",
        key: "workers",
        toDb: (row) => ({
          id: row.id,
          name: row.name,
          team: row.team || "",
          created_at: row.createdAt || serverNow().toISOString(),
          updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
        }),
        fromDb: (row) => ({
          id: row.id,
          name: row.name,
          team: row.team || "",
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }),
      },
      {
        table: "unsafe_issues",
        key: "unsafeIssues",
        toDb: (row) => ({
          id: row.id,
          ship_no: row.shipNo,
          content: row.content,
          worker_id: row.workerId || null,
          worker_name_snapshot: row.workerNameSnapshot || "",
          worker_team_snapshot: row.workerTeamSnapshot || "",
          status: row.status || ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0],
          admin_memo: row.adminMemo || "",
          created_at: row.createdAt || serverNow().toISOString(),
          updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
          completed_at: row.completedAt || null,
          status_history: Array.isArray(row.statusHistory) ? row.statusHistory : [],
        }),
        fromDb: (row) => ({
          id: row.id,
          shipNo: row.ship_no,
          content: row.content,
          workerId: row.worker_id || "",
          workerNameSnapshot: row.worker_name_snapshot || "",
          workerTeamSnapshot: row.worker_team_snapshot || "",
          status: row.status || ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0],
          adminMemo: row.admin_memo || "",
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          completedAt: row.completed_at || "",
          statusHistory: Array.isArray(row.status_history) ? row.status_history : [],
        }),
      },
      {
        table: "missing_materials",
        key: "missingMaterials",
        toDb: (row) => ({
          id: row.id,
          ship_no: row.shipNo,
          material_name: row.materialName,
          content: row.content,
          worker_id: row.workerId || null,
          worker_name_snapshot: row.workerNameSnapshot || "",
          worker_team_snapshot: row.workerTeamSnapshot || "",
          status: row.status || ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[0],
          admin_memo: row.adminMemo || "",
          created_at: row.createdAt || serverNow().toISOString(),
          updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
          completed_at: row.completedAt || null,
          status_history: Array.isArray(row.statusHistory) ? row.statusHistory : [],
        }),
        fromDb: (row) => ({
          id: row.id,
          shipNo: row.ship_no,
          materialName: row.material_name,
          content: row.content,
          workerId: row.worker_id || "",
          workerNameSnapshot: row.worker_name_snapshot || "",
          workerTeamSnapshot: row.worker_team_snapshot || "",
          status: row.status || ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[0],
          adminMemo: row.admin_memo || "",
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          completedAt: row.completed_at || "",
          statusHistory: Array.isArray(row.status_history) ? row.status_history : [],
        }),
      },
      {
        table: "issue_photos",
        key: "issuePhotos",
        toDb: (row) => ({
          id: row.id,
          target_type: row.targetType,
          target_id: row.targetId,
          storage_bucket: row.storageBucket || ISSUE_PHOTO_BUCKET,
          storage_path: row.storagePath,
          sort_order: row.sortOrder || 0,
          created_at: row.createdAt || serverNow().toISOString(),
        }),
        fromDb: (row) => ({
          id: row.id,
          targetType: row.target_type,
          targetId: row.target_id,
          storageBucket: row.storage_bucket || ISSUE_PHOTO_BUCKET,
          storagePath: row.storage_path,
          sortOrder: row.sort_order || 0,
          createdAt: row.created_at,
        }),
      },
    ];

    const starterCategories = [
      { id: "welding", label: "용접/절단 작업", icon: "welding", color: "#b8323b", toolNature: "선행/후행", order: 1 },
      { id: "height", label: "고소 작업", icon: "workAtHeights", color: "#a86616", toolNature: "선행", order: 2 },
      { id: "mounting", label: "탑재 작업", icon: "erection", color: "#1f6eb3", toolNature: "선행", order: 3 },
      { id: "confined", label: "밀폐 공간 작업", icon: "confinedSpace", color: "#2e7d4f", toolNature: "후행", order: 4 },
    ];

    const starterSections = [
      { id: "welding-pre", categoryId: "welding", title: "작업 전 준비", order: 1 },
      { id: "welding-zone", categoryId: "welding", title: "작업 구역 통제", order: 2 },
      { id: "welding-after", categoryId: "welding", title: "작업 후 확인", order: 3 },
      { id: "height-pre", categoryId: "height", title: "추락 방지", order: 1 },
      { id: "height-equipment", categoryId: "height", title: "장비 및 기상", order: 2 },
      { id: "mounting-lift", categoryId: "mounting", title: "인양 계획", order: 1 },
      { id: "mounting-zone", categoryId: "mounting", title: "배치 및 통제", order: 2 },
      { id: "confined-permit", categoryId: "confined", title: "출입 허가", order: 1 },
      { id: "confined-air", categoryId: "confined", title: "공기질 및 구조", order: 2 },
    ];

    const starterItems = [
      item("w1", "welding", "welding-pre", "보호구 착용 확인 (용접 마스크, 장갑, 앞치마)", "high", 1),
      item("w2", "welding", "welding-zone", "작업 구역 가연성 물질 제거 완료", "high", 2),
      item("w3", "welding", "welding-zone", "소화기 비치 및 작동 상태 확인", "high", 3),
      item("w4", "welding", "welding-pre", "용접기/절단기 전원 및 접지 상태 점검", "medium", 4),
      item("w5", "welding", "welding-pre", "환기 상태 확인 (가스 농도 측정)", "high", 5),
      item("w6", "welding", "welding-zone", "인근 작업자 대피 또는 방호판 설치", "medium", 6),
      item("w7", "welding", "welding-pre", "화기 작업 허가서 발급 확인", "high", 7),
      item("w8", "welding", "welding-after", "작업 후 잔불 처리 방법 숙지", "medium", 8),
      item("h1", "height", "height-pre", "안전대 및 구명줄 착용 상태 확인", "high", 1),
      item("h2", "height", "height-pre", "비계 설치 상태 및 잠금장치 점검", "high", 2),
      item("h3", "height", "height-equipment", "크레인 와이어 로프 마모·손상 여부 확인", "high", 3),
      item("h4", "height", "height-pre", "하부 작업 구역 출입 통제 조치", "high", 4),
      item("h5", "height", "height-equipment", "풍속 측정 및 작업 가능 여부 판단 (10m/s 이하)", "medium", 5),
      item("h6", "height", "height-pre", "작업 발판 폭 및 난간 설치 확인 (40cm 이상)", "medium", 6),
      item("h7", "height", "height-equipment", "신호수 배치 확인", "medium", 7),
      item("h8", "height", "height-equipment", "장비 정격 하중 초과 여부 확인", "high", 8),
      item("m1", "mounting", "mounting-lift", "탑재 블록 중량 및 무게중심 확인", "high", 1),
      item("m2", "mounting", "mounting-lift", "달기 구 용접 상태 및 강도 확인", "high", 2),
      item("m3", "mounting", "mounting-lift", "도크 바닥 지지 구조 하중 검토", "high", 3),
      item("m4", "mounting", "mounting-lift", "인양 신호 체계 확립 및 신호수 배치", "medium", 4),
      item("m5", "mounting", "mounting-zone", "인근 작업자 대피 완료 확인", "high", 5),
      item("m6", "mounting", "mounting-zone", "블록 위치 결정 후 고정 상태 확인", "medium", 6),
      item("m7", "mounting", "mounting-zone", "안전 통제선 및 출입 통제 설치", "medium", 7),
      item("c1", "confined", "confined-permit", "밀폐 공간 출입 허가서 발급 확인", "high", 1),
      item("c2", "confined", "confined-air", "산소 농도 측정 (18~23.5% 유지)", "high", 2),
      item("c3", "confined", "confined-air", "유해 가스 농도 측정 완료", "high", 3),
      item("c4", "confined", "confined-air", "환기 장치 설치 및 가동 확인", "high", 4),
      item("c5", "confined", "confined-permit", "감시인 배치 및 통신 수단 확보", "medium", 5),
      item("c6", "confined", "confined-air", "비상 탈출 경로 및 구조 장비 확인", "high", 6),
      item("c7", "confined", "confined-permit", "작업자 개인 보호구 착용 확인", "medium", 7),
    ];

    function item(id, categoryId, sectionId, text, risk, order, visibilityCondition = "항상 표시") {
      return { id, categoryId, sectionId, text, risk, required: risk === "high", active: true, visibilityCondition, order };
    }

    const $ = (id) => document.getElementById(id);
    const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[char]));
    const disabledReasonWrap = (html, reason, disabled) => {
      if (!disabled) return html;
      const safeReason = esc(reason);
      return `<span class="disabled-reason-wrap is-disabled" data-disabled-reason="${safeReason}" tabindex="0" role="button" aria-disabled="true" aria-label="${safeReason}">${html}</span>`;
    };
    const firstSpaceBreakHtml = (value = "") => {
      const text = String(value);
      const index = text.indexOf(" ");
      if (index < 0) return esc(text);
      return `${esc(text.slice(0, index))}<br>${esc(text.slice(index + 1))}`;
    };
    const KST_TIME_ZONE = "Asia/Seoul";
    const kstDateFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: KST_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const kstTimeFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: KST_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const kstRecordTimeFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: KST_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const kstWeekdayFormatter = new Intl.DateTimeFormat("ko-KR", {
      timeZone: KST_TIME_ZONE,
      weekday: "short",
    });
    const kstDateParts = (date) => {
      const parts = Object.fromEntries(kstDateFormatter.formatToParts(date).map((part) => [part.type, part.value]));
      return {
        year: Number(parts.year),
        month: Number(parts.month),
        day: Number(parts.day),
      };
    };
    const today = () => localDate(serverNow());
    const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;
    const pad2 = (value) => String(value).padStart(2, "0");
    const localDate = (date) => {
      const parts = kstDateParts(date);
      return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
    };
    const localTime = (date) => kstTimeFormatter.format(date);
    const recordTime = (date) => kstRecordTimeFormatter.format(date);
    const normalizeShipNo = (value) => {
      const raw = value.trim().toUpperCase().replace(/\s+/g, "");
      if (!raw) return "";
      return raw.startsWith("H") ? raw : `H${raw}`;
    };
    const normalizeSearchQuery = (value) => String(value || "").trim().toLowerCase();
    const searchableShipNo = (ship) => normalizeSearchQuery(ship?.no || "");
    const searchableToolText = (tool) => normalizeSearchQuery(`${tool?.name || ""} ${tool?.nature || ""}`);
    const byOrder = (a, b) => (a.order || 0) - (b.order || 0);
    const storeKey = (key) => STORAGE_PREFIX + key;
    const loadJson = (key, fallback) => {
      try {
        const value = localStorage.getItem(storeKey(key));
        return value ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    };
    const saveJson = (key, value) => {
      try {
        localStorage.setItem(storeKey(key), JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn("Local storage write failed", key, error);
        return false;
      }
    };
    function estimateLocalStorageKb() {
      let total = 0;
      try {
        for (let index = 0; index < localStorage.length; index += 1) {
          const key = localStorage.key(index);
          if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
          total += key.length + String(localStorage.getItem(key) || "").length;
        }
      } catch {
        return 0;
      }
      return Math.round((total * 2) / 1024);
    }

    function shouldWarnStorage() {
      return estimateLocalStorageKb() >= 4096;
    }

    function recordTimestamp(row) {
      const value = row?.updatedAt || row?.createdAt || row?.date || "";
      const time = Date.parse(value);
      return Number.isFinite(time) ? time : 0;
    }

    function mergeRemoteRecord(local, remote) {
      if (!local) return remote;
      if (!remote) return local;
      return recordTimestamp(remote) > recordTimestamp(local) ? remote : local;
    }

    function mergeRecordArrays(localRows, remoteRows) {
      const byId = new Map();
      (Array.isArray(localRows) ? localRows : []).forEach((row) => {
        if (row?.id) byId.set(row.id, row);
      });
      (Array.isArray(remoteRows) ? remoteRows : []).forEach((row) => {
        if (row?.id) byId.set(row.id, mergeRemoteRecord(byId.get(row.id), row));
      });
      return Array.from(byId.values()).sort((a, b) => recordTimestamp(b) - recordTimestamp(a));
    }

    function normalizePendingSyncQueue(value) {
      return (Array.isArray(value) ? value : [])
        .filter((job) => job && typeof job === "object" && ["rows", "full"].includes(job.type))
        .map((job) => ({
          id: job.id || uid("sync"),
          type: job.type,
          keys: Array.isArray(job.keys) ? [...new Set(job.keys.map(String))] : [],
          rowIdsByKey: job.rowIdsByKey && typeof job.rowIdsByKey === "object" ? job.rowIdsByKey : {},
          attempts: Math.max(0, Number(job.attempts) || 0),
          createdAt: job.createdAt || new Date().toISOString(),
          nextRetryAt: job.nextRetryAt || "",
        }))
        .filter((job) => job.type === "full" || job.keys.length);
    }

    const loadAdminMode = () => {
      try {
        return sessionStorage.getItem(storeKey("adminMode")) === "true";
      } catch {
        return false;
      }
    };
    const saveAdminMode = (enabled) => {
      try {
        if (enabled) {
          sessionStorage.setItem(storeKey("adminMode"), "true");
        } else {
          sessionStorage.removeItem(storeKey("adminMode"));
        }
      } catch {}
    };

    function createDraft(overrides = {}) {
      return {
        worker: "",
        shipNo: "",
        safetyPledge: "",
        pledgeChecks: {},
        pledgeSignature: "",
        checks: {},
        selectedToolIds: [],
        toolPrepComplete: false,
        ...overrides,
      };
    }

    function isSignatureImage(value) {
      return String(value || "").startsWith("data:image/png;base64,");
    }

    function signatureLabel(value = state.draft.pledgeSignature) {
      const raw = String(value || "");
      if (isSignatureImage(raw)) return "손가락 서명 완료";
      return raw.trim();
    }

    const PLEDGE_SIGNATURE_CACHE_KEY = "pledgeSignatureCache";

    function signatureCacheDateKey() {
      return today();
    }

    function normalizedWorkerName(workerName) {
      return String(workerName || "").trim();
    }

    function loadPledgeSignatureCache() {
      return loadJson(PLEDGE_SIGNATURE_CACHE_KEY, {});
    }

    function savePledgeSignatureCache(cache) {
      saveJson(PLEDGE_SIGNATURE_CACHE_KEY, cache && typeof cache === "object" ? cache : {});
    }

    function cachedPledgeSignatureForWorker(workerName) {
      const worker = normalizedWorkerName(workerName);
      if (!worker) return "";
      const cache = loadPledgeSignatureCache();
      const dayCache = cache[signatureCacheDateKey()];
      if (!dayCache || typeof dayCache !== "object") return "";
      return String(dayCache[worker] || "");
    }

    function savePledgeSignatureForWorker(workerName, signature) {
      const worker = normalizedWorkerName(workerName);
      const value = String(signature || "");
      if (!worker || !value) return;
      const cache = loadPledgeSignatureCache();
      const day = signatureCacheDateKey();
      cache[day] = cache[day] && typeof cache[day] === "object" ? cache[day] : {};
      cache[day][worker] = value;
      savePledgeSignatureCache(cache);
    }

    function preloadCachedPledgeSignature() {
      if (state.draft.pledgeSignature) return false;
      const cached = cachedPledgeSignatureForWorker(state.draft.worker);
      if (!cached) return false;
      state.draft.pledgeSignature = cached;
      saveJson("draft", state.draft);
      return true;
    }

    function createUnsafeDraft(overrides = {}) {
      return {
        step: 1,
        shipNo: "",
        content: "",
        workerId: "",
        photos: [],
        ...overrides,
      };
    }

    function createMaterialDraft(overrides = {}) {
      return {
        step: 1,
        shipNo: "",
        materialType: "",
        materialName: "",
        spec: "",
        quantity: "",
        unit: "EA",
        detail: "",
        content: "",
        workerId: "",
        ...overrides,
      };
    }

    function loadDraft() {
      const draft = loadJson("draft", null);
      return createDraft(draft && typeof draft === "object" ? draft : {});
    }

    function routeViews() {
      return [...NAV, { id: "unsafe" }, { id: "materials" }, { id: "manage" }, { id: "pledgeComplete" }, ...PREVIEW_NAV_ITEMS];
    }

    const initialAdminMode = loadAdminMode();
    const state = {
      view: initialView(),
      categories: loadJson("categories", []),
      sections: loadJson("sections", []),
      items: loadJson("items", []),
      tools: loadJson("tools", []),
      pictograms: loadJson("pictograms", []),
      ships: loadJson("ships", []),
      inspections: loadJson("inspections", []),
      inspectionItems: loadJson("inspectionItems", []),
      workers: loadJson("workers", []),
      unsafeIssues: loadJson("unsafeIssues", []),
      missingMaterials: loadJson("missingMaterials", []),
      issuePhotos: loadJson("issuePhotos", []),
      pendingPhotoUploads: loadJson("pendingPhotoUploads", []),
      monthlyWorkerRestDays: loadJson("monthlyWorkerRestDays", {
        useKoreanPublicHolidays: true,
        holidayData: {},
        customRestDays: [],
      }),
      selectedMonthlyWorkerMonth: "",
      monthlyRestDayPanelOpen: false,
      unsafePhotoFiles: [],
      selectedCategoryId: null,
      manageCategoryId: null,
      editCategoryId: null,
      editSectionId: null,
      editItemId: null,
      editToolId: null,
      toolAddOpen: false,
      categoryAddOpen: false,
      categoryToolAssignmentOpenIds: [],
      openAddItemSectionIds: [],
      categoryVisualOpen: false,
      draft: loadDraft(),
      historyScope: "all",
      historyFilter: "all",
      historyDetailId: null,
      selectedHistoryIds: [],
      toastTimer: null,
      syncMode: "offline",
      syncText: "로컬 저장",
      pendingSyncQueue: normalizePendingSyncQueue(loadJson("pendingSyncQueue", [])),
      syncRetryTimer: null,
      syncFlushInFlight: false,
      lastRemotePullAt: Number(loadJson("lastRemotePullAt", 0)) || 0,
      screenMode: localStorage.getItem(storeKey("screenMode")) || "desktop",
      shipSortMode: normalizeShipSortMode(loadJson("shipSortMode", "stage")),
      shipSearchQuery: "",
      toolSearchQuery: "",
      adminMode: initialAdminMode,
      adminEmail: initialAdminMode ? "비밀번호 인증" : "",
      scrollTimer: null,
      lastScrollY: 0,
      serverTimeOffsetMs: 0,
      serverClockSyncedAt: "",
      unsafeDraft: createUnsafeDraft(loadJson("unsafeDraft", {})),
      materialDraft: createMaterialDraft(loadJson("materialDraft", {})),
      unsafeFilters: loadJson("unsafeFilters", { shipNo: "", status: "", workerId: "", sort: "status" }),
      materialFilters: loadJson("materialFilters", { shipNo: "", status: "", workerId: "", materialName: "", sort: "status" }),
      manageTab: loadJson("manageTab", "workers"),
      unsafeDetailId: "",
      lastUnsafeIssueId: "",
      lastMaterialId: "",
      lastInspectionId: "",
      inspectionSubmitting: false,
      pledgeTemplateEditing: false,
    };
    let cachedSupabaseClient = null;

    function initialView() {
      const view = viewFromPathname() || document.body?.dataset?.initialView || "dashboard";
      return routeViews().some((nav) => nav.id === view) ? view : "dashboard";
    }

    function viewFromPathname() {
      const cleanPath = location.pathname.replace(/\/+$/, "").toLowerCase();
      const routeMap = {
        "/": "dashboard",
        "/checklist": "check",
        "/check": "check",
        "/history": "history",
        "/admin": "manage",
        "/manage": "manage",
        "/ships": "ships",
        "/items": "items",
        "/unsafe": "unsafe",
        "/materials": "materials",
        "/pledge": "pledge",
        "/analytics": "analytics",
      };
      return routeMap[cleanPath] || "";
    }

    function pageForView(view) {
      if (isRedesignPreviewPage()) return currentPageName();
      return {
        dashboard: "index.html",
        check: "check.html",
        ships: "ships.html",
        history: "history.html",
        items: "items.html",
        unsafe: "unsafe.html",
        materials: "materials.html",
        manage: "manage.html",
        pledge: "pledge.html",
        analytics: "analytics.html",
        pledgeComplete: currentPageName(),
      }[view] || "index.html";
    }

    function currentPageName() {
      const page = location.pathname.split("/").pop() || "index.html";
      return page.toLowerCase();
    }

    function isRedesignPreviewPage() {
      return ["redesign-preview.html", "redesign-v2.html"].includes(currentPageName());
    }

    function navigateToView(view) {
      const page = pageForView(view);
      if (currentPageName() !== page.toLowerCase()) {
        location.href = page;
        return true;
      }
      return false;
    }
    async function boot() {
      migrateIfNeeded();
      cleanupDeliveredShips(false);
      prepareInitialManageFilters();
      applyScreenMode();
      updateHeaderClock();
      render();
      replaceRouteState();
      setupScrollNav();
      setInterval(updateHeaderClock, 1000);
      setInterval(syncServerClock, SERVER_CLOCK_REFRESH_MS);
      setInterval(flushPendingSyncQueue, SYNC_RETRY_DELAY_MS);
      window.addEventListener("resize", applyScreenMode);
      window.addEventListener("online", flushPendingSyncQueue);
      window.addEventListener("popstate", restoreRouteState);
      setSyncStatus(isSyncConfigured() ? "동기화 대기" : "로컬 저장", isSyncConfigured() ? "pending" : "offline");
      if (isSyncConfigured()) {
        syncServerClock();
        pullRemote();
        flushPendingSyncQueue();
      }
    }

    function migrateIfNeeded() {
      if (!state.categories.length || !state.sections.length || !state.items.length) {
        const oldChecklists = readOldJson(OLD_KEYS.checklists, null);
        if (oldChecklists && typeof oldChecklists === "object") {
          migrateOldChecklists(oldChecklists);
        } else {
          state.categories = structuredClone(starterCategories);
          state.sections = structuredClone(starterSections);
          state.items = structuredClone(starterItems);
        }
      }

      if (!state.ships.length) {
        const oldShips = readOldJson(OLD_KEYS.ships, null);
        if (Array.isArray(oldShips)) {
          state.ships = oldShips.map((ship, index) => ({
            id: ship.id || uid("ship"),
            no: normalizeShipNo(ship.no || ship.shipNo || ""),
            type: ship.type || ship.name || "",
            note: ship.note || "",
            processStage: ship.processStage || "mounting",
            deliveryType: ship.deliveryType || "",
            deliveryDate: ship.deliveryDate || "",
            lcDate: ship.lcDate || "",
            stDate: ship.stDate || "",
            clDate: ship.clDate || (ship.deliveryType === "C/L" ? ship.deliveryDate || "" : ""),
            dlDate: ship.dlDate || (ship.deliveryType === "D/L" ? ship.deliveryDate || "" : ""),
            createdAt: ship.createdAt || serverNow().toISOString(),
            order: index + 1,
          })).filter((ship) => ship.no);
        }
      }

      if (!state.inspections.length) {
        const oldHistory = readOldJson(OLD_KEYS.history, null);
        if (Array.isArray(oldHistory)) {
          state.inspections = oldHistory.map((entry) => ({
            id: entry.id || uid("inspection"),
            categoryId: entry.type,
            worker: entry.worker || "",
            shipNo: entry.shipNo || "",
            safetyPledge: entry.safetyPledge || "",
            date: entry.date || today(),
            time: entry.time || "",
            status: entry.status || "미완료",
            warnings: Number(entry.warnings || 0),
            completion: entry.status === "완료" ? 100 : 0,
            createdAt: entry.createdAt || serverNow().toISOString(),
          }));
        }
      }

      normalizeDataShape();
      dedupeShips();
      persist();
    }

    function normalizeDataShape() {
      state.categories = state.categories.map((cat, index) => ({
        ...cat,
        order: cat.order || index + 1,
        requireToolCheck: cat.requireToolCheck !== false,
        toolNature: normalizeToolNature(cat.toolNature || defaultToolNatureForCategory(cat)),
        toolIds: sanitizeToolIds(cat.toolIds),
      }));
      state.items = state.items.map((row, index) => ({
        ...row,
        order: row.order || index + 1,
        toolIds: sanitizeToolIds(row.toolIds),
        visibilityCondition: normalizeVisibilityCondition(row.visibilityCondition || inferVisibilityFromToolIds(row)),
      }));
      dedupeChecklistItems();
      state.tools = (Array.isArray(state.tools) ? state.tools : []).map((tool, index) => ({
        ...tool,
        order: tool.order || index + 1,
        nature: normalizeToolNature(tool.nature),
        deleted: Boolean(tool.deleted),
      }));
      dedupeTools();
      const customPictograms = Array.isArray(state.pictograms) ? state.pictograms : [];
      state.pictograms = [
        ...BUILT_IN_PICTOGRAMS,
        ...customPictograms
          .filter((row) => row && row.source !== "builtIn")
          .map((row, index) => ({
            ...row,
            source: "custom",
            order: row.order || BUILT_IN_PICTOGRAMS.length + index + 1,
            deleted: Boolean(row.deleted),
          })),
      ];
      state.draft = createDraft(state.draft);
      state.workers = (Array.isArray(state.workers) ? state.workers : []).map((worker) => ({
        id: worker.id || uid("worker"),
        name: String(worker.name || "").trim(),
        team: String(worker.team || "").trim(),
        createdAt: worker.createdAt || serverNow().toISOString(),
        updatedAt: worker.updatedAt || worker.createdAt || serverNow().toISOString(),
      })).filter((worker) => worker.name);
      state.unsafeIssues = normalizeStatusRecords(state.unsafeIssues, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES);
      state.missingMaterials = normalizeStatusRecords(state.missingMaterials, ISSUE_MATERIAL_RULES.MATERIAL_STATUSES);
      state.issuePhotos = Array.isArray(state.issuePhotos) ? state.issuePhotos : [];
      state.pendingPhotoUploads = normalizePendingPhotoUploads(state.pendingPhotoUploads);
      state.unsafeDraft = createUnsafeDraft(state.unsafeDraft);
      state.materialDraft = createMaterialDraft(state.materialDraft);
      state.unsafeFilters = { shipNo: "", status: "", workerId: "", sort: "status", ...state.unsafeFilters };
      state.materialFilters = { shipNo: "", status: "", workerId: "", materialName: "", sort: "status", ...state.materialFilters };
      if (!["workers", "unsafe", "materials"].includes(state.manageTab)) state.manageTab = "workers";
    }

    function normalizeStatusRecords(records, statuses) {
      return (Array.isArray(records) ? records : []).map((record) => {
        const row = record && typeof record === "object" ? record : {};
        const status = statuses.includes(row.status) ? row.status : statuses[0];
        const createdAt = row.createdAt || row.updatedAt || serverNow().toISOString();
        const updatedAt = row.updatedAt || createdAt;
        const normalized = {
          ...row,
          status,
          adminMemo: String(row.adminMemo || "").trim(),
          createdAt,
          updatedAt,
          completedAt: row.completedAt || "",
        };
        return {
          ...normalized,
          statusHistory: ISSUE_MATERIAL_RULES.buildRecordTimeline(normalized, { initialStatus: statuses[0] }),
        };
      });
    }

    function normalizePendingPhotoUploads(records) {
      return (Array.isArray(records) ? records : [])
        .filter((row) => row && row.issueId)
        .map((row, index) => ({
          id: row.id || uid("pendingPhoto"),
          issueId: String(row.issueId || ""),
          fileName: String(row.fileName || `photo-${index + 1}.jpg`),
          fileType: String(row.fileType || "image/jpeg"),
          fileSize: Number(row.fileSize || 0),
          dataUrl: String(row.dataUrl || ""),
          status: row.status === "uploading" ? "failed" : String(row.status || "failed"),
          errorMessage: String(row.errorMessage || ""),
          createdAt: row.createdAt || serverNow().toISOString(),
          updatedAt: row.updatedAt || row.createdAt || serverNow().toISOString(),
        }));
    }

    function dedupeChecklistItems() {
      const seen = new Set();
      state.items = state.items.map((row) => {
        if (row.active === false) return row;
        const key = `${row.categoryId}::${String(row.text || "").trim().replace(/\s+/g, " ")}`;
        if (!String(row.text || "").trim() || seen.has(key)) return { ...row, active: false };
        seen.add(key);
        return row;
      });
    }

    function dedupeTools() {
      const keepers = new Map();
      const ranked = state.tools
        .map((tool, index) => ({ tool, index, key: normalizeToolName(tool.name) }))
        .filter(({ tool, key }) => key && tool.deleted !== true)
        .sort((a, b) => compareToolWrittenOrder(a.tool, b.tool) || a.index - b.index);
      ranked.forEach(({ tool, key }) => {
        if (!keepers.has(key)) keepers.set(key, tool.id);
      });
      state.tools = state.tools.map((tool) => {
        const key = normalizeToolName(tool.name);
        if (!key || tool.deleted === true) return tool;
        return keepers.get(key) === tool.id ? tool : { ...tool, deleted: true };
      });
    }

    function readOldJson(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    }

    function migrateOldChecklists(oldChecklists) {
      state.categories = [];
      state.sections = [];
      state.items = [];
      Object.entries(oldChecklists).forEach(([id, data], index) => {
        const categoryId = id || uid("cat");
        const sectionId = `${categoryId}_default`;
        state.categories.push({
          id: categoryId,
          label: data.label || "작업 유형",
          icon: data.icon || String(index + 1),
          color: data.color || COLORS[index % COLORS.length],
          requireToolCheck: true,
          toolNature: "선행",
          order: index + 1,
        });
        state.sections.push({
          id: sectionId,
          categoryId,
          title: "기본 점검",
          order: 1,
        });
        (data.items || []).forEach((sourceItem, itemIndex) => {
          state.items.push({
            id: sourceItem.id || uid("item"),
            categoryId,
            sectionId,
            text: sourceItem.text || "",
            risk: sourceItem.risk || "medium",
            required: (sourceItem.risk || "medium") === "high",
            active: true,
            toolIds: [],
            visibilityCondition: "항상 표시",
            order: itemIndex + 1,
          });
        });
      });
    }

    function dedupeShips() {
      const seen = new Set();
      state.ships = state.ships.filter((ship) => {
        const no = normalizeShipNo(ship.no);
        if (!no || seen.has(no)) return false;
        seen.add(no);
        ship.no = no;
        ship.processStage = SHIP_WORKFLOW_STAGES.includes(ship.processStage) ? ship.processStage : "mounting";
        ship.deliveryType = ship.deliveryType || "";
        ship.deliveryDate = ship.deliveryDate || "";
        ship.lcDate = ship.lcDate || "";
        ship.stDate = ship.stDate || "";
        ship.clDate = ship.clDate || (ship.deliveryType === "C/L" ? ship.deliveryDate : "");
        ship.dlDate = ship.dlDate || (ship.deliveryType === "D/L" ? ship.deliveryDate : "");
        return true;
      });
    }

    function persist() {
      saveJson("categories", state.categories);
      saveJson("sections", state.sections);
      saveJson("items", state.items);
      saveJson("tools", state.tools);
      saveJson("pictograms", state.pictograms.filter((row) => row.source !== "builtIn"));
      saveJson("ships", state.ships);
      saveJson("inspections", state.inspections);
      saveJson("inspectionItems", state.inspectionItems);
      saveJson("draft", state.draft);
      saveJson("workers", state.workers);
      saveJson("unsafeIssues", state.unsafeIssues);
      saveJson("missingMaterials", state.missingMaterials);
      saveJson("issuePhotos", state.issuePhotos);
      saveJson("pendingPhotoUploads", state.pendingPhotoUploads);
      saveJson("pendingSyncQueue", state.pendingSyncQueue);
      saveJson("lastRemotePullAt", state.lastRemotePullAt || 0);
      saveJson("unsafeDraft", state.unsafeDraft);
      saveJson("materialDraft", state.materialDraft);
      saveJson("unsafeFilters", state.unsafeFilters);
      saveJson("materialFilters", state.materialFilters);
      saveJson("manageTab", state.manageTab);
      if (shouldWarnStorage() && !state.storageWarningShown) {
        state.storageWarningShown = true;
        toast("저장 공간이 부족합니다. 오래된 이력과 사진을 정리해주세요.");
      }
    }

    function routeState() {
      return {
        app: "shipyardSafety",
        view: state.view,
        selectedCategoryId: state.selectedCategoryId,
        historyScope: state.historyScope,
        historyFilter: state.historyFilter,
        historyDetailId: state.historyDetailId,
      };
    }

    function pushRouteState() {
      history.pushState(routeState(), "", location.pathname + location.search);
    }

    function replaceRouteState() {
      history.replaceState(routeState(), "", location.pathname + location.search);
    }

    function normalizeHistoryScope(scope) {
      return ["all", "today", "delivery"].includes(scope) ? scope : "all";
    }

    function restoreRouteState(event) {
      const route = event.state;
      if (!route || route.app !== "shipyardSafety") {
        state.view = "dashboard";
        state.selectedCategoryId = null;
        state.historyDetailId = null;
        clearCompletionStateForView("dashboard");
        render();
        scrollScreenTop();
        replaceRouteState();
        return;
      }
      state.view = routeViews().some((nav) => nav.id === route.view) ? route.view : "dashboard";
      state.selectedCategoryId = route.selectedCategoryId || null;
      state.historyScope = normalizeHistoryScope(route.historyScope || "all");
      state.historyFilter = route.historyFilter || "all";
      state.historyDetailId = route.historyDetailId || null;
      if (state.view !== "check") state.selectedCategoryId = null;
      if (!["dashboard", "history"].includes(state.view)) state.historyDetailId = null;
      clearCompletionStateForView(state.view);
      render();
      scrollScreenTop();
    }

    function clearCompletionStateForView() {
      state.lastUnsafeIssueId = "";
      state.lastMaterialId = "";
    }

    let adminModulePromise = null;

    function loadAdminModule() {
      if (!adminModulePromise) adminModulePromise = import("./admin-v2.js");
      return adminModulePromise;
    }

    function changeView(view, options = {}) {
      if (navigateToView(view)) return;
      if (["manage", "pledge", "analytics"].includes(view)) {
        loadAdminModule().catch((error) => console.warn("Admin module preload failed", error));
      }
      const changed = state.view !== view || state.selectedCategoryId || state.historyDetailId;
      state.view = view;
      if (view !== "check") state.selectedCategoryId = null;
      if (!["dashboard", "history"].includes(view)) state.historyDetailId = null;
      clearCompletionStateForView(view);
      render();
      scrollScreenTop();
      if (changed) {
        options.replace ? replaceRouteState() : pushRouteState();
      }
    }

    function scrollScreenTop() {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        [document.scrollingElement, document.documentElement, document.body, document.querySelector(".main"), $("page")]
          .filter(Boolean)
          .forEach((node) => {
            node.scrollTop = 0;
            node.scrollLeft = 0;
          });
        const nav = $("mobileNav");
        if (nav) nav.classList.remove("hide-on-scroll");
        state.lastScrollY = 0;
      });
    }

    function setSyncStatus(text, mode) {
      state.syncText = text;
      state.syncMode = mode;
      [["syncBadge", "syncText"], ["mobileSyncBadge", "mobileSyncText"]].forEach(([badgeId, textId]) => {
        const badge = $(badgeId);
        const label = $(textId);
        const labelText = badgeId === "mobileSyncBadge" && text === "로컬 저장" ? "저장됨" : text;
        if (badge) badge.className = `${badgeId === "mobileSyncBadge" ? "sync-chip" : "sync-badge"} ${mode}`;
        if (label) label.textContent = labelText;
      });
    }

    function isNarrowViewport() {
      return window.matchMedia && window.matchMedia("(max-width: 920px)").matches;
    }

    function effectiveScreenMode() {
      if (state.adminMode) return state.screenMode === "mobile" ? "mobile" : "desktop";
      return isNarrowViewport() ? "mobile" : "desktop";
    }

    function applyScreenMode() {
      const isNarrow = isNarrowViewport();
      const mode = effectiveScreenMode();
      document.body.classList.toggle("admin-mode", state.adminMode);
      document.body.classList.toggle("screen-mobile", mode === "mobile");
      document.body.classList.toggle("screen-desktop", mode === "desktop");
      document.body.classList.toggle("preview-mobile", !isNarrow && mode === "mobile");
      document.body.classList.toggle("preview-desktop", isNarrow && mode === "desktop");
      updateScreenToggle();
    }

    function updateScreenToggle() {
      const effectiveMode = effectiveScreenMode();
      document.querySelectorAll("[data-screen-mode]").forEach((button) => {
        button.classList.toggle("active", button.dataset.screenMode === effectiveMode);
      });
    }

    function setScreenMode(mode) {
      if (!state.adminMode) return;
      state.screenMode = mode === "mobile" ? "mobile" : "desktop";
      localStorage.setItem(storeKey("screenMode"), state.screenMode);
      applyScreenMode();
    }

    function toast(message) {
      const node = $("toast");
      clearTimeout(state.toastTimer);
      node.textContent = message;
      node.classList.add("show");
      state.toastTimer = setTimeout(() => node.classList.remove("show"), 2600);
    }

    function setupScrollNav() {
      state.lastScrollY = window.scrollY || 0;
      window.addEventListener("scroll", () => {
        const nav = $("mobileNav");
        if (!nav) return;
        const currentY = window.scrollY || 0;
        if (currentY > state.lastScrollY && currentY > 24) {
          nav.classList.add("hide-on-scroll");
        }
        clearTimeout(state.scrollTimer);
        state.scrollTimer = setTimeout(() => {
          nav.classList.remove("hide-on-scroll");
        }, 180);
        state.lastScrollY = currentY;
      }, { passive: true });
    }

    function render() {
      renderNav();
      renderAppHeader();
      const page = $("page");
      page.innerHTML = {
        dashboard: renderDashboard,
        check: renderCheck,
        history: renderHistory,
        ships: renderShips,
        items: renderItems,
        unsafe: renderUnsafe,
        materials: renderMaterials,
        manage: renderManage,
        pledge: renderPledgeManager,
        analytics: renderAnalyticsDashboard,
        pledgeComplete: renderPledgeComplete,
      }[state.view]();
      setSyncStatus(state.syncText, state.syncMode);
      applyClientSearchFilters();
      setupSignaturePad();
      ensureRenderedAccessibility();
    }

    function ensureRenderedAccessibility() {
      const page = $("page");
      if (page && !page.querySelector("h1")) {
        const title = $("appbarTitle")?.textContent?.trim() || "조선소 안전 체크리스트";
        page.insertAdjacentHTML("afterbegin", `<h1 class="sr-only">${esc(title)}</h1>`);
      }
      document.querySelectorAll("img").forEach((image) => {
        if (!image.hasAttribute("alt")) {
          image.setAttribute("alt", "");
          image.setAttribute("aria-hidden", "true");
        }
      });
      document.querySelectorAll("input, select, textarea").forEach((control) => {
        if (control.type === "hidden") return;
        const id = control.id;
        const hasLabel = Boolean(id && document.querySelector(`label[for="${cssEscape(id)}"]`));
        if (hasLabel || control.hasAttribute("aria-label") || control.hasAttribute("aria-labelledby")) return;
        const placeholder = control.getAttribute("placeholder");
        const fallback = placeholder || control.name || control.id || "입력 필드";
        control.setAttribute("aria-label", fallback);
      });
    }

    function setupSignaturePad() {
      const canvas = document.getElementById("pledgeSignaturePad");
      if (!canvas) return;

      const pad = canvas.closest("[data-signature-pad]");
      const textInput = document.getElementById("pledgeSignatureText");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const cssWidth = Math.max(Math.floor(rect.width), 1);
      const cssHeight = Math.max(Math.floor(rect.height), 1);
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = Math.floor(cssWidth * ratio);
      canvas.height = Math.floor(cssHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#07162f";
      ctx.fillStyle = "#07162f";

      if (isSignatureImage(state.draft.pledgeSignature)) {
        pad?.classList.add("has-signature");
        const image = new Image();
        image.onload = () => {
          ctx.clearRect(0, 0, cssWidth, cssHeight);
          ctx.drawImage(image, 0, 0, cssWidth, cssHeight);
        };
        image.src = state.draft.pledgeSignature;
      } else {
        pad?.classList.remove("has-signature");
      }

      let isDrawing = false;
      let lastPoint = null;

      const pointFromEvent = (event) => {
        const bounds = canvas.getBoundingClientRect();
        return {
          x: Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width),
          y: Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height),
        };
      };

      const saveDrawnSignature = () => {
        state.draft.pledgeSignature = canvas.toDataURL("image/png");
        savePledgeSignatureForWorker(state.draft.worker, state.draft.pledgeSignature);
        if (textInput) textInput.value = "";
        pad?.classList.add("has-signature");
        saveJson("draft", state.draft);
        refreshCheckSubmitControls();
      };

      const startDrawing = (event) => {
        event.preventDefault();
        isDrawing = true;
        lastPoint = pointFromEvent(event);
        canvas.setPointerCapture?.(event.pointerId);
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 2, 0, Math.PI * 2);
        ctx.fill();
      };

      const draw = (event) => {
        if (!isDrawing || !lastPoint) return;
        event.preventDefault();
        const currentPoint = pointFromEvent(event);
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        lastPoint = currentPoint;
      };

      const stopDrawing = (event) => {
        if (!isDrawing) return;
        event.preventDefault();
        isDrawing = false;
        lastPoint = null;
        canvas.releasePointerCapture?.(event.pointerId);
        saveDrawnSignature();
      };

      canvas.addEventListener("pointerdown", startDrawing);
      canvas.addEventListener("pointermove", draw);
      canvas.addEventListener("pointerup", stopDrawing);
      canvas.addEventListener("pointercancel", stopDrawing);
      canvas.addEventListener("pointerleave", stopDrawing);
    }

    function applyClientSearchFilters() {
      applyShipSearchFilter();
      applyToolSearchFilter();
    }

    function applyShipSearchFilter() {
      const rows = Array.from(document.querySelectorAll("[data-ship-search-item]"));
      if (!rows.length) return;
      const query = normalizeSearchQuery(state.shipSearchQuery);
      let visibleCount = 0;
      rows.forEach((row) => {
        const matches = !query || (row.dataset.shipSearchText || "").includes(query);
        row.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      const counter = document.querySelector("[data-ship-search-count]");
      if (counter) counter.textContent = query ? `${visibleCount}/${rows.length}척` : `${rows.length}척`;
      const empty = document.querySelector("[data-ship-search-empty]");
      if (empty) empty.hidden = visibleCount > 0;
    }

    function applyToolSearchFilter() {
      const cards = Array.from(document.querySelectorAll("[data-tool-search-item]"));
      if (!cards.length) return;
      const query = normalizeSearchQuery(state.toolSearchQuery);
      let visibleCount = 0;
      cards.forEach((card) => {
        const matches = !query || (card.dataset.toolSearchText || "").includes(query);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      const counter = document.querySelector("[data-tool-search-count]");
      if (counter) counter.textContent = query ? `${visibleCount}/${cards.length}개` : `${cards.length}개`;
      const empty = document.querySelector("[data-tool-search-empty]");
      if (empty) empty.hidden = visibleCount > 0;
    }

    function renderAppHeader() {
      const titles = {
        dashboard: "홈",
        check: "점검 작성",
        history: "점검 이력",
        ships: "공정 보드",
        items: "항목 관리",
        unsafe: "불안전요소 등록",
        materials: "호선자재 누락",
        manage: "관리",
        pledge: "안전 서약",
        analytics: "통계",
        pledgeComplete: "서약 완료",
      };
      const title = $("appbarTitle");
      const headline = $("homeHeadline");
      const date = $("homeDateLabel");
      if (title) title.textContent = titles[state.view] || "홈";
      if (headline) {
        const showHomeHeadline = state.view === "dashboard";
        headline.style.display = showHomeHeadline ? "flex" : "none";
        headline.setAttribute("aria-hidden", showHomeHeadline ? "false" : "true");
      }
      if (date) date.textContent = formatKoreanDate(serverNow());
      updateHeaderClock();
    }

    function updateHeaderClock() {
      const time = $("phoneTime");
      const date = $("homeDateLabel");
      const version = $("homeVersionLabel");
      if (time) time.textContent = localTime(serverNow());
      if (date) date.textContent = formatKoreanDate(serverNow());
      if (version) version.textContent = appVersionLabel();
    }

    function appVersionLabel() {
      return `version ${String(APP_VERSION).split("-")[0]}`;
    }

    function formatKoreanDate(date) {
      const parts = kstDateParts(date);
      const weekday = kstWeekdayFormatter.format(date).replace("요일", "");
      return `${parts.year}.${pad2(parts.month)}.${pad2(parts.day)} (${weekday})`;
    }

    function serverNow() {
      return new Date(Date.now() + Number(state.serverTimeOffsetMs || 0));
    }

    async function syncServerClock() {
      state.serverTimeOffsetMs = 0;
      state.serverClockSyncedAt = "";
      updateHeaderClock();
    }

    function visibleNavItems() {
      if (isRedesignPreviewPage()) return [...NAV, ADMIN_NAV_ITEM, ...PREVIEW_NAV_ITEMS];
      return state.adminMode ? [...NAV, ADMIN_NAV_ITEM] : NAV;
    }

    function mobileNavItems() {
      return NAV.filter((nav) => MOBILE_NAV_IDS.has(nav.id));
    }

    function renderNavButtons(items) {
      const activeView = ["unsafe", "materials"].includes(state.view) ? "items" : state.view;
      return items.map((nav) => `
        <button class="nav-btn ${activeView === nav.id ? "active" : ""}" data-view="${nav.id}" type="button">
          <span class="nav-icon">${navIcon(nav.icon)}</span><span>${esc(nav.label)}</span>
        </button>`).join("");
    }

    function renderNav() {
      $("desktopNav").innerHTML = renderNavButtons(visibleNavItems());
      $("mobileNav").innerHTML = renderNavButtons(mobileNavItems());
      updateMobileAdminShortcut();
    }

    function navIcon(name) {
      const icons = {
        home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 4l8 7.5"></path><path d="M6.5 10.5V20h11v-9.5"></path><path d="M10 20v-6h4v6"></path></svg>`,
        board: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 8h10"></path><path d="M7 12h6"></path></svg>`,
        note: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7z"></path><path d="M15 3v5h5"></path><path d="M9 12h6"></path><path d="M9 16h5"></path></svg>`,
        book: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"></path><path d="M4 5.5v16"></path><path d="M8 7h8"></path><path d="M8 11h7"></path></svg>`,
        ship: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17h16l-2 3H6z"></path><path d="M6 17l1-7h10l1 7"></path><path d="M9 10V6h6v4"></path><path d="M3 21c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1"></path></svg>`,
        shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-2.8 8.4-7 10-4.2-1.6-7-5.5-7-10V6z"></path></svg>`,
        noteCheck: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7z"></path><path d="M15 3v5h5"></path><path d="M8.5 14l2.5 2.5 4.5-5"></path></svg>`,
        menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>`,
        settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.1 2.1-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.7V21h-3v-.6a1.8 1.8 0 0 0-1.1-1.7 1.8 1.8 0 0 0-2 .4l-.1.1-2.1-2.1.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.7-1.1H4v-3h.6a1.8 1.8 0 0 0 1.7-1.1 1.8 1.8 0 0 0-.4-2l-.1-.1 2.1-2.1.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1.1-1.7V3h3v.6a1.8 1.8 0 0 0 1.1 1.7 1.8 1.8 0 0 0 2-.4l.1-.1 2.1 2.1-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.7 1.1h.6v3h-.6a1.8 1.8 0 0 0-1.7 1.1z"></path></svg>`,
      };
      return icons[name] || icons.note;
    }

    function sectionHeading(id, title) {
      return `<h2 id="${esc(id)}" class="sr-only">${esc(title)}</h2>`;
    }

    function updateMobileAdminShortcut() {
      const shortcut = $("mobileAdminShortcut");
      if (!shortcut) return;
      shortcut.hidden = !(state.adminMode || isRedesignPreviewPage());
      shortcut.classList.toggle("active", state.view === "manage");
      shortcut.innerHTML = navIcon(ADMIN_NAV_ITEM.icon);
    }

    function pageHead(title, lead, actions = "") {
      return `<div class="page-head">
        <div>
          <div class="eyebrow">Safety checklist</div>
          <h1>${esc(title)}</h1>
          <p class="lead">${esc(lead)}</p>
        </div>
        <div class="toolbar">${actions}</div>
      </div>`;
    }

    function adminToggleButton() {
      return `<button class="toggle ${state.adminMode ? "active" : ""}" data-action="toggle-admin" type="button" aria-pressed="${state.adminMode ? "true" : "false"}">
        <span class="toggle-track"></span><span>수정 ${state.adminMode ? "ON" : "OFF"}</span>
      </button>`;
    }

    function dashboardModel() {
      const todayRows = state.inspections.filter((row) => inspectionActualDate(row) === today());
      const todayCount = todayRows.length;
      const todayDone = todayRows.filter((row) => row.status === "완료").length;
      const todayPending = Math.max(todayCount - todayDone, 0);
      const todayCompletion = todayCount ? Math.round(todayDone / todayCount * 100) : 0;
      const doneCount = state.inspections.filter((row) => row.status === "완료").length;
      const unsafeCount = unsafeReceivedCount();
      const completion = state.inspections.length ? Math.round(doneCount / state.inspections.length * 100) : 0;
      const latest = state.inspections.slice(0, 4);
      const deliverySoon = upcomingDeliveryShips().length;
      const openMaterials = state.missingMaterials.filter((row) => !row.completedAt).length;
      const activeShips = state.ships.filter(isWorkerVisibleShip).length;
      const now = serverNow();
      const weekStart = new Date(now);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - 6);
      const dateInLastWeek = (value) => {
        if (!value) return false;
        const date = new Date(String(value).includes("T") ? value : `${value}T00:00:00`);
        return !Number.isNaN(date.getTime()) && date >= weekStart && date <= now;
      };
      const weekInspections = state.inspections.filter((row) => dateInLastWeek(row.date || row.createdAt));
      const weekUnsafe = state.unsafeIssues.filter((row) => dateInLastWeek(row.createdAt));
      const weekMaterials = state.missingMaterials.filter((row) => dateInLastWeek(row.createdAt));
      const riskNg = weekInspections.filter((row) => Number(row.warnings || 0) > 0).length
        + weekUnsafe.filter((row) => row.status !== ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2]).length;
      const riskWarn = weekInspections.filter((row) => row.status !== "완료" && !Number(row.warnings || 0)).length
        + weekMaterials.filter((row) => row.status !== ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2]).length;
      const riskOk = weekInspections.filter((row) => row.status === "완료" && !Number(row.warnings || 0)).length;
      const riskTotal = Math.max(riskNg + riskWarn + riskOk, 1);
      const processStages = SHIP_WORKFLOW_STAGES.map((stage) => ({
        stage,
        info: shipStageInfo(stage),
        count: state.ships.filter((ship) => effectiveShipStage(ship).stage === stage).length,
      }));
      return {
        todayCount,
        todayDone,
        todayPending,
        todayCompletion,
        unsafeCount,
        completion,
        latest,
        deliverySoon,
        openMaterials,
        activeShips,
        riskNg,
        riskWarn,
        riskOk,
        riskTotal,
        processStages,
      };
    }

    function renderDashboard() {
      const {
        todayCount,
        todayDone,
        todayPending,
        todayCompletion,
        unsafeCount,
        completion,
        latest,
        deliverySoon,
        openMaterials,
        activeShips,
        riskNg,
        riskWarn,
        riskOk,
        riskTotal,
        processStages,
      } = dashboardModel();
      return `<h1 class="sr-only">조선소 안전 체크리스트</h1>
      <section class="ops-hero" aria-labelledby="dashboardQuickHeading">
        ${sectionHeading("dashboardQuickHeading", "현장 빠른 실행")}
        <div class="ops-hero-main">
          <div class="ops-quick-actions" aria-label="현장 빠른 실행">
            <button class="ops-quick-action primary" data-view="check" type="button">
              <span>${navIcon("noteCheck")}</span>
              <strong>작업 전 점검 시작</strong>
            </button>
            <button class="ops-quick-action danger" data-view="unsafe" type="button">
              <span>${navIcon("warning")}</span>
              <strong>불안전요소 등록</strong>
              <small>위험 발견 즉시 접수</small>
            </button>
            <button class="ops-quick-action violet" data-view="materials" type="button">
              <span>${navIcon("board")}</span>
              <strong>자재누락 등록</strong>
              <small>호선 기준으로 요청</small>
            </button>
          </div>
        </div>
        <div class="ops-today-panel">
          <div class="ops-today-head">
            <span>오늘 점검</span>
            <strong>${todayDone}/${todayCount || 0}</strong>
          </div>
          <div class="ops-progress" role="progressbar" aria-label="오늘 점검 완료율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${todayCompletion}">
            <span style="width:${todayCompletion}%"></span>
          </div>
          <div class="ops-today-grid">
            <div><span>대기</span><strong>${todayPending}</strong></div>
            <div><span>호선</span><strong>${activeShips}</strong></div>
            <div><span>완료율</span><strong>${completion}%</strong></div>
          </div>
        </div>
      </section>
      <section class="ops-status-grid" aria-labelledby="dashboardStatusHeading">
        ${sectionHeading("dashboardStatusHeading", "오늘 현장 상태")}
        ${statPill("오늘 점검", todayCount, "건", "#0f766e", "shield", "", "today")}
        ${statPill("불안전요소", unsafeCount, "건", "#dc2626", "warning", unsafeCount ? "즉시 확인" : "접수 없음", "unsafe")}
        ${statPill("누락 자재", openMaterials, "건", "#7c3aed", "board", "", "materials")}
        ${statPill("인도 예정", deliverySoon, "척", "#f97316", "clock", "7일 이내", "delivery")}
      </section>
      <section class="ops-grid" aria-labelledby="dashboardProcessHeading">
        ${sectionHeading("dashboardProcessHeading", "공정 현황")}
        <div class="panel panel-pad home-section ops-process-card ops-process-card-wide">
          <div class="section-title">공정 현황 <button class="btn-light" data-view="ships" type="button">보기</button></div>
          <div class="mini-process">
            ${processStages.map(({ info, count }) => `<div class="mini-stage" style="--dot:${esc(info.color)}">
              <span class="mini-stage-dot"></span>
              <div class="mini-stage-count">${count}</div>
              <div class="small muted">${esc(info.label)}</div>
            </div>`).join("")}
          </div>
        </div>
      </section>
      <section class="panel panel-pad" aria-labelledby="dashboardHistoryHeading">
        ${sectionHeading("dashboardHistoryHeading", "최근 점검 이력")}
        <div class="section-title">최근 점검 이력 <button class="btn-light" data-history-scope="all" type="button">전체 보기</button></div>
        ${latest.length ? renderHistoryTable(latest) : `<div class="empty">아직 점검 이력이 없습니다.</div>`}
      </section>`;
    }

    function metric(label, value, unit, color) {
      return `<div class="metric">
        <div class="metric-label">${esc(label)}</div>
        <div class="metric-value" style="color:${color}">${esc(value)}<span style="font-size:14px;margin-left:4px">${esc(unit)}</span></div>
      </div>`;
    }

    function unsafeReceivedStatus() {
      return ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0];
    }

    function markUnsafeReceivedEntry() {
      try {
        sessionStorage.setItem(storeKey("unsafeReceivedEntry"), "true");
      } catch {}
    }

    function consumeUnsafeReceivedEntry() {
      try {
        const marked = sessionStorage.getItem(storeKey("unsafeReceivedEntry")) === "true";
        sessionStorage.removeItem(storeKey("unsafeReceivedEntry"));
        return marked;
      } catch {
        return false;
      }
    }

    function setUnsafeStatusFilter(status) {
      state.unsafeFilters = { ...state.unsafeFilters, status };
      saveJson("unsafeFilters", state.unsafeFilters);
    }

    function resetMaterialShipFilter() {
      state.materialFilters = { ...state.materialFilters, shipNo: "" };
      saveJson("materialFilters", state.materialFilters);
    }

    function prepareInitialManageFilters() {
      if (state.view !== "manage") return;
      if (state.manageTab === "unsafe") setUnsafeStatusFilter(consumeUnsafeReceivedEntry() ? unsafeReceivedStatus() : "");
      if (state.manageTab === "materials") resetMaterialShipFilter();
    }

    function unsafeReceivedCount() {
      const received = unsafeReceivedStatus();
      return state.unsafeIssues.filter((row) => row.status === received).length;
    }

    function statPill(label, value, unit, color, icon = "board", foot = "", scope = "all") {
      const attrs = scope === "unsafe"
        ? `data-stat-scope="unsafe" data-view="unsafe"`
        : scope === "materials"
          ? `data-stat-scope="materials" data-view="materials"`
        : `data-stat-scope="${esc(scope)}" data-history-scope="${esc(scope)}"`;
      const alertClass = scope === "unsafe" && Number(value) > 0 ? " is-alert" : "";
      const focusClass = ["today", "unsafe"].includes(scope) ? " is-focus" : "";
      return `<button class="stat-pill${focusClass}${alertClass}" style="--stat:${color}" ${attrs} type="button">
        <span class="stat-icon">${statIcon(icon)}</span>
        <div class="stat-label small muted">${esc(label)}</div>
        <div class="stat-value" style="color:${color}">${esc(value)}<span class="stat-unit">${esc(unit)}</span></div>
        ${foot ? `<div class="stat-foot">${esc(foot)}</div>` : ""}
      </button>`;
    }

    function statIcon(name) {
      const icons = {
        shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"></path><path d="M9 12l2 2 4-5"></path></svg>`,
        warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z"></path><path d="M12 9v5"></path><path d="M12 17h.01"></path></svg>`,
        clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg>`,
        board: navIcon("board"),
      };
      return icons[name] || icons.board;
    }

    function progress(pct, color, attrs = "") {
      const value = Math.max(0, Math.min(100, Number(pct) || 0));
      return `<div class="progress" ${attrs} role="progressbar" aria-label="점검 완료율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><span style="--pct:${value}%;--bar:${esc(color)}"></span></div>`;
    }

    function normalizeIconKey(id) {
      return ({
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
      })[id] || id;
    }

    const LINE_ICONS = {
      anchor: `<circle cx="12" cy="5" r="3"></circle><path d="M12 22V8"></path><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>`,
      wrench: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"></path>`,
      pipe: `<path d="M7 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"></path><path d="M7 8h10"></path><path d="M7 16h10"></path><path d="M5 21h14"></path>`,
      flame: `<path d="M12 22a7 7 0 0 0 7-7c0-2.7-1.4-4.9-4.1-6.7.1 1.6-.4 2.9-1.7 4.1-.2-3-1.5-5.8-4.2-8.4C8.8 7 5 9.7 5 15a7 7 0 0 0 7 7z"></path><path d="M10 17c0-1.2.7-2.2 2-3 1.3.8 2 1.8 2 3a2 2 0 1 1-4 0z"></path>`,
      clipboardCheck: `<rect width="8" height="4" x="8" y="2" rx="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="m9 14 2 2 4-4"></path>`,
      gauge: `<path d="M12 14l4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path><path d="M12 14h.01"></path>`,
      award: `<circle cx="12" cy="8" r="6"></circle><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"></path>`,
      checkCircle: `<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>`,
      shieldCheck: `<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"></path><path d="m9 12 2 2 4-4"></path>`,
    };

    function lineIcon(name) {
      const icon = LINE_ICONS[name] || LINE_ICONS.shieldCheck;
      return `<svg class="line-icon line-icon-${esc(name)}" viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`;
    }

    function pictogramAssetSrc(id) {
      const key = normalizeIconKey(id);
      return PICTOGRAM_ASSETS[id] || PICTOGRAM_ASSETS[key] || "";
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

    function workVisual(id, fallbackIcon) {
      const src = pictogramAssetSrc(id);
      if (src) {
        return `<img class="pictogram-image" src="${esc(src)}" alt="" loading="lazy" decoding="async" aria-hidden="true" />`;
      }
      return lineIcon(lineIconName(id, fallbackIcon));
    }

    function categoryVisual(cat) {
      return workVisual(cat.icon || cat.id, cat.label || cat.icon || cat.id || "?");
    }

    function renderPictogramPicker(selected = "", targetId = "catIcon") {
      const activeKey = normalizeIconKey(selected);
      return `<div class="pictogram-picker">
        ${pictogramLibrary().map((icon) => `<button class="pictogram-btn ${activeKey === icon.id ? "active" : ""}" data-pick-icon="${esc(icon.id)}" data-pick-icon-target="${esc(targetId)}" type="button">
          ${workVisual(icon.id, icon.label)}
          <span>${esc(icon.label)}</span>
        </button>`).join("")}
      </div>`;
    }

    function moreToggle(attrs, expanded) {
      return `<button class="more-toggle" ${attrs} type="button" aria-expanded="${expanded ? "true" : "false"}">${expanded ? "------접기------" : "------+더보기------"}</button>`;
    }

    function workAccent(id, fallback) {
      return stageForCategory({ id, label: id })?.color || ({
        welding: "#0b66ff",
        height: "#0f9f6e",
        confined: "#dc2626",
      })[id] || fallback || "#0b66ff";
    }

    function categoryAccent(cat) {
      return stageForCategory(cat)?.color || workAccent(cat?.id, cat?.color);
    }

    function stageForCategory(cat = {}) {
      const id = String(cat.id || "").toLowerCase();
      const label = String(cat.label || "");
      const rule = CATEGORY_STAGE_RULES.find((entry) =>
        entry.ids.some((value) => id.includes(value.toLowerCase())) ||
        entry.labels.some((value) => label.toLowerCase().includes(value.toLowerCase()))
      );
      return rule ? shipStageInfo(rule.stage) : null;
    }

    function workLabel(cat) {
      return ({
        welding: "용접",
        height: "고소",
        mounting: "탑재",
        confined: "밀폐",
      })[cat.id] || cat.label;
    }

    function workerInitial(name) {
      return String(name || "?").trim().slice(0, 1) || "?";
    }

    function renderPledgeWorkerSelect() {
      const workers = state.workers;
      if (!workers.length) {
        return `<section class="pledge-flow-card">
          <div class="pledge-flow-title">작업자 선택</div>
          <label class="field">
            <span>작업자명</span>
            <input class="input" id="worker" value="${esc(state.draft.worker)}" placeholder="이름 입력" />
          </label>
        </section>`;
      }
      return `<section class="pledge-flow-card">
        <div class="pledge-flow-title">작업자 선택</div>
        <div class="pledge-worker-list">
          ${workers.map((worker) => {
            const selected = state.draft.worker === worker.name;
            return `<button class="pledge-worker-row ${selected ? "active" : ""}" data-select-pledge-worker="${esc(worker.id)}" type="button" aria-pressed="${selected ? "true" : "false"}">
              <span class="pledge-avatar">${esc(workerInitial(worker.name))}</span>
              <span><strong>${esc(worker.name)}</strong><em>${esc(worker.team || "소속 미지정")}</em></span>
            </button>`;
          }).join("")}
        </div>
      </section>`;
    }

    function renderPledgeShipSelect(ships) {
      return `<section class="pledge-flow-card">
        <div class="pledge-flow-title">오늘 작업 호선</div>
        <div class="pledge-ship-list">
          ${ships.map((ship) => {
            const stage = effectiveShipStage(ship);
            const selected = state.draft.shipNo === ship.no;
            return `<button class="pledge-ship-row ${selected ? "active" : ""}" data-select-pledge-ship="${esc(ship.no)}" type="button" aria-pressed="${selected ? "true" : "false"}">
              <span class="pledge-radio"></span>
              <span><strong>${esc(ship.no)}</strong><em>${esc(ship.type || "선종 미지정")} · D/L ${esc(shipDeliveryDate(ship) || "-")}</em></span>
              <b style="--stage:${esc(stage.color)}">${esc(stage.label)}</b>
            </button>`;
          }).join("")}
        </div>
      </section>`;
    }

    function renderSafetyPledgeChecklist() {
      const rules = pledgeRules();
      const checked = rules.filter((_, index) => state.draft.pledgeChecks[index]).length;
      const complete = checked === rules.length;
      const signature = state.draft.pledgeSignature || "";
      const drawnSignature = isSignatureImage(signature);
      return `<section class="pledge-flow-card">
        <div class="pledge-flow-title">작업 전 안전 서약서</div>
        <div class="pledge-flow-meta">${esc(state.draft.worker || "작업자 미선택")} 님 · ${esc(state.draft.shipNo || "호선 미선택")} · ${esc(today())}</div>
        <div class="pledge-rule-count">서약 항목 (${checked}/${rules.length})</div>
        <div class="pledge-rule-list">
          ${rules.map((rule, index) => {
            const isChecked = Boolean(state.draft.pledgeChecks[index]);
            return `<label class="pledge-rule-row ${isChecked ? "checked" : ""}">
              <input type="checkbox" data-pledge-rule="${index}" ${isChecked ? "checked" : ""} />
              <span>${esc(rule)}</span>
            </label>`;
          }).join("")}
        </div>
        ${complete ? `<div class="pledge-sign-panel">
          <div class="pledge-sign-head">
            <label for="pledgeSignaturePad">서명란</label>
            <button class="btn-light signature-clear-btn" data-action="clear-pledge-signature" type="button">지우기</button>
          </div>
          <p class="pledge-disclaimer">본 서명은 안전 서약 확인 목적이며 전자서명법상 공인 전자서명과 다릅니다.</p>
          <div class="signature-pad ${drawnSignature ? "has-signature" : ""}" data-signature-pad>
            <canvas id="pledgeSignaturePad" aria-label="손가락 서명 입력"></canvas>
            <span class="signature-pad-placeholder">손가락 또는 마우스로 서명</span>
          </div>
          <input class="input signature-text-input" id="pledgeSignatureText" value="${drawnSignature ? "" : esc(signature)}" placeholder="키보드로 이름 입력도 가능" autocomplete="off" />
        </div>` : `<div class="pledge-remaining">${rules.length - checked}개 항목 남음</div>`}
      </section>`;
    }

    function buildCheckSubmitState(cat, items, highMissing) {
      const pledgeRulesCount = pledgeRules().length;
      const pledgeChecked = pledgeRules().filter((_, index) => state.draft.pledgeChecks[index]).length;
      const missingHighItems = Array.isArray(highMissing)
        ? highMissing
        : items.filter((row) => row.risk === "high" && !state.draft.checks[row.id]);
      const canSubmit = Boolean(
        state.draft.worker.trim()
        && state.draft.shipNo
        && pledgeChecked === pledgeRulesCount
        && signatureLabel()
        && items.length
        && missingHighItems.length === 0
      );
      const submitMissingReasons = [
        state.draft.worker.trim() ? "" : "담당자명 미입력",
        state.draft.shipNo ? "" : "호선 미선택",
        pledgeChecked === pledgeRulesCount ? "" : `안전 서약 ${pledgeRulesCount - pledgeChecked}건 미확인`,
        signatureLabel() ? "" : "서명 미입력",
        items.length ? "" : "등록된 점검 항목 없음",
        missingHighItems.length ? `고위험 항목 ${missingHighItems.length}건 미확인` : "",
      ].filter(Boolean);
      return {
        canSubmit,
        disabledText: submitMissingReasons.length ? `제출할 수 없음: ${submitMissingReasons.join(", ")}` : "제출하기",
      };
    }

    function refreshCheckSubmitControls() {
      const button = document.querySelector("[data-action='submit-inspection']");
      if (!button) return;
      const cat = categoryById(state.selectedCategoryId);
      if (!cat) return;
      const items = filteredChecklistItems(cat.id);
      const highMissing = items.filter((row) => row.risk === "high" && !state.draft.checks[row.id]);
      const submitState = buildCheckSubmitState(cat, items, highMissing);
      button.disabled = !submitState.canSubmit;
      button.title = submitState.disabledText;
      button.setAttribute("aria-label", submitState.disabledText);
      const disabledWrap = button.closest("[data-disabled-reason]");
      if (disabledWrap) {
        if (submitState.canSubmit) {
          disabledWrap.removeAttribute("data-disabled-reason");
          disabledWrap.classList.remove("is-disabled");
          disabledWrap.removeAttribute("aria-disabled");
          disabledWrap.removeAttribute("aria-label");
          disabledWrap.removeAttribute("role");
          disabledWrap.removeAttribute("tabindex");
        } else {
          disabledWrap.setAttribute("data-disabled-reason", submitState.disabledText);
          disabledWrap.classList.add("is-disabled");
          disabledWrap.setAttribute("aria-disabled", "true");
          disabledWrap.setAttribute("aria-label", submitState.disabledText);
          disabledWrap.setAttribute("role", "button");
          disabledWrap.setAttribute("tabindex", "0");
        }
      }
    }

    function currentCheckRenderState() {
      const cat = categoryById(state.selectedCategoryId);
      if (!cat) return null;
      const items = filteredChecklistItems(cat.id);
      const checked = items.filter((row) => state.draft.checks[row.id]).length;
      const highMissing = items.filter((row) => row.risk === "high" && !state.draft.checks[row.id]);
      const pct = items.length ? Math.round(checked / items.length * 100) : 0;
      return { cat, items, checked, highMissing, pct };
    }

    function updateCheckItemDom(itemId, checked) {
      const input = document.querySelector(`[data-check-item="${cssEscape(itemId)}"]`);
      const row = input?.closest(".check-item");
      const model = currentCheckRenderState();
      if (!input || !row || !model) return false;
      input.checked = Boolean(checked);
      row.classList.toggle("checked", Boolean(checked));

      document.querySelectorAll("[data-check-progress]").forEach((node) => {
        const bar = node.querySelector("span");
        if (bar) bar.style.width = `${model.pct}%`;
        node.setAttribute("aria-valuenow", String(model.pct));
      });
      document.querySelectorAll("[data-check-percent]").forEach((node) => {
        node.textContent = `${model.pct}%`;
      });
      document.querySelectorAll("[data-check-count]").forEach((node) => {
        node.textContent = `${model.checked}/${model.items.length} 항목 확인됨`;
      });

      const item = model.items.find((entry) => entry.id === itemId);
      const sectionId = item?.sectionId || "";
      if (sectionId) {
        const sectionItems = model.items.filter((entry) => entry.sectionId === sectionId);
        const sectionChecked = sectionItems.filter((entry) => state.draft.checks[entry.id]).length;
        document.querySelectorAll(`[data-check-section-count="${cssEscape(sectionId)}"]`).forEach((node) => {
          node.textContent = `${sectionChecked}/${sectionItems.length}`;
        });
      }

      const riskHtml = badge(model.highMissing.length ? "high" : "low", model.highMissing.length ? `위험 ${model.highMissing.length}건 남음` : "위험 확인 완료");
      document.querySelectorAll("[data-high-missing-badge]").forEach((node) => {
        node.innerHTML = riskHtml;
      });
      document.querySelectorAll("[data-high-missing-notice]").forEach((node) => {
        const hasMissing = Boolean(model.highMissing.length);
        node.classList.toggle("danger", hasMissing);
        node.classList.toggle("good", !hasMissing);
        node.textContent = hasMissing
          ? `미확인 위험 항목 ${model.highMissing.length}건이 있습니다. 위험 항목은 모두 확인해야 제출할 수 있습니다.`
          : "고위험 항목이 모두 확인되었습니다.";
      });

      refreshCheckSubmitControls();
      return true;
    }

    function renderCheck() {
      if (!state.selectedCategoryId) {
        return `<section class="write-intro">
          <h1>어떤 작업을 점검할까요?</h1>
          <p>작업 유형을 선택하면 점검을 시작합니다.</p>
        </section>
        ${checkFlowSteps(1)}
        <div class="work-grid">
          ${state.categories.sort(byOrder).map((cat) => {
            return `<button class="work-card" style="--accent:${esc(categoryAccent(cat))}" data-select-category="${cat.id}" type="button">
              <span class="work-icon">${categoryVisual(cat)}</span>
              <div class="work-title">${esc(workLabel(cat))}</div>
              <span class="work-arrow">›</span>
            </button>`;
          }).join("")}
        </div>`;
      }

      const cat = categoryById(state.selectedCategoryId);
      if (!cat) {
        state.selectedCategoryId = null;
        return renderCheck();
      }
      if (visibleToolsForCategory(cat.id).length && !state.draft.toolPrepComplete) return renderToolPrep(cat);
      const items = filteredChecklistItems(cat.id);
      const checked = items.filter((row) => state.draft.checks[row.id]).length;
      const highMissing = items.filter((row) => row.risk === "high" && !state.draft.checks[row.id]);
      const pct = items.length ? Math.round(checked / items.length * 100) : 0;
      const selectableShips = visibleWorkerShips();
      preloadCachedPledgeSignature();
      const submitState = buildCheckSubmitState(cat, items, highMissing);
      const canSubmit = submitState.canSubmit;
      const submitDisabledText = submitState.disabledText;

      return `${pageHead(cat.label, "섹션별로 점검하고, 고위험 항목은 모두 확인해야 제출됩니다.", `<button class="btn-light" data-action="back-check-types" type="button">뒤로</button>`)}
      ${checkFlowSteps(3)}
      <div class="split">
        <div>
          <div class="mobile-check-status" aria-label="모바일 점검 작성 상태">
            <div class="mobile-check-progress">
              ${progress(pct, categoryAccent(cat), "data-check-progress")}
              <span class="mobile-check-percent" data-check-percent>${pct}%</span>
            </div>
            <span data-high-missing-badge>${badge(highMissing.length ? "high" : "low", highMissing.length ? `위험 ${highMissing.length}건 남음` : "위험 확인 완료")}</span>
          </div>
          <div class="pledge-flow-grid">
            ${renderPledgeWorkerSelect()}
            ${renderPledgeShipSelect(selectableShips)}
            ${renderSafetyPledgeChecklist()}
          </div>
          ${selectableShips.length ? "" : `<div class="notice danger" style="margin-bottom:12px">작업자에게 공개된 호선이 없습니다. 호선 관리에서 L/C일을 입력한 호선만 점검 목록에 표시됩니다.</div>`}
          ${highMissing.length ? `<div class="notice danger" data-high-missing-notice style="margin-bottom:12px">미확인 위험 항목 ${highMissing.length}건이 있습니다. 위험 항목은 모두 확인해야 제출할 수 있습니다.</div>` : `<div class="notice good" data-high-missing-notice style="margin-bottom:12px">고위험 항목이 모두 확인되었습니다.</div>`}
          ${renderChecklistSections(cat.id)}
          <div class="check-submit-bar">
            ${disabledReasonWrap(`<button class="btn check-submit-btn" data-action="submit-inspection" ${canSubmit ? "" : "disabled"} title="${esc(submitDisabledText)}" aria-label="${esc(submitDisabledText)}" type="button">제출하기</button>`, submitDisabledText, !canSubmit)}
          </div>
        </div>
        <aside class="panel panel-pad check-status-panel">
          <div class="section-title">작성 상태</div>
          ${progress(pct, categoryAccent(cat), "data-check-progress")}
          <div class="small muted" data-check-count style="margin-top:8px">${checked}/${items.length} 항목 확인됨</div>
          <div class="list" style="margin-top:16px">
            <span data-high-missing-badge>${badge(highMissing.length ? "high" : "low", highMissing.length ? `위험 ${highMissing.length}건 남음` : "위험 확인 완료")}</span>
            ${badge("medium", state.draft.worker.trim() ? "담당자 입력됨" : "담당자 필요")}
            ${badge("medium", state.draft.shipNo ? "호선 선택됨" : "호선 필요")}
          </div>
        </aside>
      </div>`;
    }

    function renderToolPrep(cat) {
      const tools = visibleToolsForCategory(cat.id);
      const selectedIds = new Set(sanitizeToolIds(state.draft.selectedToolIds));
      const selectedCount = tools.filter((tool) => selectedIds.has(tool.id)).length;
      const requireSelection = cat.requireToolCheck !== false;
      const continueDisabled = requireSelection && !selectedCount;
      const continueDisabledText = continueDisabled ? "다음 점검표로 이동할 수 없음: 공기구/준비물 선택 필요" : "다음 점검표로";
      return `${pageHead("사용 공기구와 준비물", "사용할 공기구와 준비물을 체크한 뒤 다음 점검표로 이동하세요.", `<button class="btn-light" data-action="back-check-types" type="button">뒤로</button>`)}
      ${checkFlowSteps(2)}
      <div class="panel panel-pad tool-prep-panel">
        <div class="section-title">
          <span>${esc(cat.label)}</span>
          <span class="small muted">${esc(normalizeToolNature(cat.toolNature))} 기준 · 선택 ${selectedCount}개</span>
        </div>
        <div class="tool-prep-grid">
          ${tools.map((tool) => {
            const checked = selectedIds.has(tool.id);
            return `<button class="tool-prep-card ${checked ? "checked" : ""}" data-tool-prep-toggle="${esc(tool.id)}" type="button" aria-pressed="${checked ? "true" : "false"}">
              <span class="tool-prep-check">${checked ? "✓" : ""}</span>
              <span class="tool-prep-name">${esc(tool.name)}</span>
              ${natureBadge(tool.nature)}
            </button>`;
          }).join("")}
        </div>
        ${requireSelection && !selectedCount ? `<div class="notice danger" style="margin-top:12px">최소 1개의 공기구/준비물을 선택해야 다음 점검표로 이동할 수 있습니다.</div>` : `<div class="notice good" style="margin-top:12px">선택한 공기구에 맞는 점검 항목만 다음 화면에 표시됩니다.</div>`}
        <div class="tool-prep-actions">
          <button class="btn-light" data-action="back-check-types" type="button">작업 유형 다시 선택</button>
          ${disabledReasonWrap(`<button class="btn" data-action="continue-tool-prep" ${continueDisabled ? "disabled" : ""} title="${esc(continueDisabledText)}" aria-label="${esc(continueDisabledText)}" type="button">다음 점검표로</button>`, continueDisabledText, continueDisabled)}
        </div>
      </div>`;
    }

    function checkFlowSteps(activeStep) {
      const steps = [
        [1, "작업 선택"],
        [2, "공기구 확인"],
        [3, "점검 제출"],
      ];
      return `<div class="check-flow-steps" aria-label="점검 작성 단계">
        ${steps.map(([step, label]) => `<div class="check-flow-step ${activeStep === step ? "active" : ""} ${activeStep > step ? "done" : ""}">
          <span>${step}</span><strong>${esc(label)}</strong>
        </div>`).join("")}
      </div>`;
    }

    function renderChecklistSections(categoryId) {
      const sections = sectionsFor(categoryId);
      const visibleItems = filteredChecklistItems(categoryId);
      if (!sections.length) return `<div class="empty empty-section-note">등록된 섹션이 없습니다.</div>`;
      return sections.map((section) => {
        const items = visibleItems.filter((row) => row.sectionId === section.id);
        return `<section class="check-section ${items.length ? "" : "check-section-empty"}" data-check-section="${esc(section.id)}">
          <div class="check-section-head">
            <span>${esc(section.title)}</span>
            <span class="small muted" data-check-section-count="${esc(section.id)}">${items.filter((row) => state.draft.checks[row.id]).length}/${items.length}</span>
          </div>
          ${items.length ? items.map((row) => `
            <label class="check-item ${state.draft.checks[row.id] ? "checked" : ""}" data-check-row="${esc(row.id)}">
              <input type="checkbox" data-check-item="${esc(row.id)}" ${state.draft.checks[row.id] ? "checked" : ""} />
              <span class="check-text">${esc(row.text)}${renderItemToolChips(row)}</span>
              ${badge(row.risk)}
            </label>`).join("") : `<div class="notice empty-section-note">이 섹션에는 항목이 없습니다.</div>`}
        </section>`;
      }).join("");
    }

    function renderHistory() {
      if (state.historyDetailId) {
        const detailRow = state.inspections.find((row) => row.id === state.historyDetailId);
        if (detailRow) return renderInspectionRecord(detailRow);
        state.historyDetailId = null;
      }
      state.historyScope = normalizeHistoryScope(state.historyScope);
      const scopeButtons = [
        ["all", "전체 이력"],
        ["today", "오늘 점검"],
        ["delivery", "인도 예정"],
      ];
      const filterButtons = [["all", "전체"], ...state.categories.sort(byOrder).map((cat) => [cat.id, cat.label])];
      const rows = filteredHistoryRows();
      const deliveryRows = upcomingDeliveryShips();
      const selectedCount = state.selectedHistoryIds.filter((id) => rows.some((row) => row.id === id)).length;
      const isDeliveryScope = state.historyScope === "delivery";
      const historyLead = {
        all: "제출된 점검 내역과 위험 경고 건수를 확인합니다.",
        today: "오늘 제출된 점검이 어떤 작업으로 진행되었는지 확인합니다.",
        delivery: "7일 이내 인도 예정인 호선을 확인합니다.",
      }[state.historyScope] || "제출된 점검 내역과 위험 경고 건수를 확인합니다.";

      return `${pageHead("기록", historyLead, `
        <button class="toggle ${state.adminMode ? "active" : ""}" data-action="toggle-admin" type="button" aria-pressed="${state.adminMode ? "true" : "false"}">
          <span class="toggle-track"></span><span>수정 ${state.adminMode ? "ON" : "OFF"}</span>
        </button>
        ${isDeliveryScope ? "" : `<button class="btn-danger" data-action="delete-selected-history" ${state.adminMode && selectedCount ? "" : "disabled"} type="button">선택 삭제 ${selectedCount ? `(${selectedCount})` : ""}</button>`}
        ${isDeliveryScope ? "" : `<button class="btn-danger" data-action="reset-history" type="button">이력 초기화</button>`}
      `)}
      <div class="segmented" style="margin-bottom:12px">
        ${scopeButtons.map(([id, label]) => `<button class="seg-btn ${state.historyScope === id ? "active" : ""}" data-history-scope="${id}" type="button">${esc(label)}</button>`).join("")}
      </div>
      ${isDeliveryScope ? "" : `<div class="segmented" style="margin-bottom:12px">
        ${filterButtons.map(([id, label]) => `<button class="seg-btn ${state.historyFilter === id ? "active" : ""}" data-history-filter="${id}" type="button">${esc(label)}</button>`).join("")}
      </div>`}
      ${isDeliveryScope ? "" : (state.adminMode ? `<div class="notice good" style="margin-bottom:12px">관리자 수정 모드가 켜져 있습니다.${state.adminEmail ? ` (${esc(state.adminEmail)})` : ""}</div>` : `<div class="notice" style="margin-bottom:12px">수정과 초기화는 관리자 이메일 로그인 후 사용할 수 있습니다.</div>`)}
      ${isDeliveryScope ? "" : renderHistoryPledgeStatus()}
      <div class="panel panel-pad">
        ${isDeliveryScope
          ? (deliveryRows.length ? renderDeliveryCards(deliveryRows) : `<div class="empty">7일 이내 인도 예정 호선이 없습니다.</div>`)
          : (rows.length ? renderHistoryTable(rows) : `<div class="empty">조건에 맞는 점검 이력이 없습니다.</div>`)}
      </div>`;
    }

    function renderHistoryPledgeStatus() {
      const rows = pledgeDashboardRows();
      const completed = rows.filter((row) => row.done).length;
      const pending = Math.max(rows.length - completed, 0);
      const rate = rows.length ? Math.round(completed / rows.length * 100) : 0;
      return `<section class="history-pledge-status" aria-label="오늘 작업자 점검 현황">
        <div class="history-pledge-head">
          <div>
            <strong>오늘 작업자 점검 현황</strong>
            <span>안전 서약 관리의 오늘 서약 현황 기준</span>
          </div>
          <button class="btn-light" data-view="pledge" type="button">상세 보기</button>
        </div>
        <div class="history-pledge-kpis">
          <div><strong>${completed}</strong><span>점검 완료</span></div>
          <div><strong>${pending}</strong><span>미점검</span></div>
          <div><strong>${rate}%</strong><span>완료율</span></div>
        </div>
      </section>`;
    }

    function filteredHistoryRows() {
      state.historyScope = normalizeHistoryScope(state.historyScope);
      let rows = state.inspections;
      if (state.historyScope === "today") rows = rows.filter((row) => row.date === today());
      if (state.historyFilter !== "all") rows = rows.filter((row) => row.categoryId === state.historyFilter);
      return rows;
    }

    function renderHistoryTable(rows) {
      const canSelect = state.view === "history" && state.adminMode;
      const displayRows = state.view === "dashboard" ? rows.slice(0, 4) : rows;
      return `<div class="history-grid">
        ${displayRows.map((row) => {
          const cat = categoryById(row.categoryId) || { label: row.categoryLabel || "(삭제된 유형)", icon: row.categoryIcon || "?", color: row.categoryColor || "#607084" };
          const risk = historyRisk(row);
          const completion = Math.max(0, Math.min(100, Number(row.completion) || 0));
          return `<article class="history-card" style="--accent:${esc(categoryAccent(cat))}" data-history-detail-card="${esc(row.id)}" role="button" tabindex="0" aria-label="${esc(cat.label)} 점검 상세내역 보기">
            <div class="history-card-main">
              <div class="history-card-top">
                <span class="history-card-icon">${categoryVisual(cat)}</span>
                <div class="history-card-actions">
                  ${canSelect ? `<input class="history-card-check" type="checkbox" aria-label="이력 선택" data-history-check="${row.id}" ${state.selectedHistoryIds.includes(row.id) ? "checked" : ""}>` : ""}
                  <button class="history-detail-btn" data-history-detail="${row.id}" aria-label="점검 기록 화면 보기" title="점검 기록" type="button">›</button>
                </div>
              </div>
              <div class="history-card-title">${firstSpaceBreakHtml(cat.label)}</div>
              <div class="history-card-summary">${esc(row.shipNo || "-")} · ${esc(shortHistoryDate(row))}</div>
              <div class="history-card-risk">
                <span class="history-completion-pill">완료율 ${esc(completion)}%</span>
                ${risk.label === "정상" ? "" : badge(risk.tone, risk.label)}
              </div>
              <div class="history-progress-track" role="progressbar" aria-label="점검 완료율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${completion}"><span style="width:${completion}%"></span></div>
            </div>
          </article>`;
        }).join("")}
      </div>`;
    }

    function historyRisk(row) {
      const warnings = Number(row.warnings) || 0;
      const completion = Number(row.completion) || 0;
      if (warnings > 0) return { tone: "medium", label: `주의 ${warnings}건` };
      if (completion >= 100 && row.status === "완료") return { tone: "low", label: "정상" };
      return { tone: "medium", label: "확인 필요" };
    }

    function shortHistoryDate(row) {
      const date = row.date ? row.date.replace(/^\d{4}-/, "").replace("-", ".") : "-";
      return `${date}${row.time ? ` ${row.time}` : ""}`;
    }

    function renderDeliveryCards(rows) {
      const displayRows = rows.slice(0, 4);
      return `<div class="history-grid">
        ${displayRows.map((ship) => {
          const info = effectiveShipStage(ship);
          return `<article class="history-card" style="--accent:#f97316">
            <div class="history-card-main">
              <div class="history-card-top">
                <span class="history-card-icon">${navIcon("ship")}</span>
                <div class="history-card-actions">
                  <button class="history-detail-btn" data-view="ships" aria-label="호선 관리로 이동" title="호선 관리" type="button">›</button>
                </div>
              </div>
              <div class="history-card-title">${esc(ship.no)}</div>
              <div class="history-card-summary">${esc(ship.type || "선종 미지정")} · ${esc(info.label)} · ${esc(shortDate(shipDeliveryDate(ship)))}</div>
              <div class="history-card-progress">${esc(deliveryDueText(shipDeliveryDate(ship)))}</div>
            </div>
          </article>`;
        }).join("")}
      </div>`;
    }

    function shortDate(value) {
      return value ? dateOnly(value).replace(/^\d{4}-/, "").replace("-", ".") : "-";
    }

    function deliveryDueText(value) {
      const diff = daysUntil(value);
      if (diff === 0) return "오늘 인도 예정";
      if (diff > 0) return `D-${diff}`;
      return `D+${Math.abs(diff)}`;
    }

    function renderInspectionRecord(row) {
      const cat = categoryById(row.categoryId) || { id: row.categoryId || "deleted", label: row.categoryLabel || "(삭제된 유형)", icon: row.categoryIcon || "?", color: row.categoryColor || "#607084" };
      const items = state.inspectionItems.filter((item) => item.inspectionId === row.id);
      const checkedCount = items.filter((item) => item.checked).length;
      const pct = Number(row.completion || (items.length ? Math.round(checkedCount / items.length * 100) : 0));
      const accent = categoryAccent(cat);
      return `${pageHead(`${cat.label} 점검 기록`, "제출 당시 점검 화면을 읽기 전용으로 확인합니다.", `<button class="btn-light" data-action="back-history-list" type="button">목록으로</button>`)}
      <div class="split">
        <div>
          <div class="panel panel-pad" style="margin-bottom:12px">
            <div class="form-row">
              <div class="field">
                <label>담당자명</label>
                <input class="input" value="${esc(row.worker || "-")}" readonly />
              </div>
              <div class="field">
                <label>호선 번호</label>
                <input class="input" value="${esc(row.shipNo || "-")}" readonly />
              </div>
              <div class="field">
                <label>점검 일시</label>
                <input class="input" value="${esc(`${row.date || "-"} ${row.time || ""}`.trim())}" readonly />
              </div>
              <div class="field safety-pledge-field">
                <label>안전다짐</label>
                <textarea class="textarea" readonly>${esc(row.safetyPledge || "-")}</textarea>
              </div>
            </div>
            ${row.signatureImage ? `<div class="signature-history">
              <span>서명 이미지</span>
              <img src="${esc(row.signatureImage)}" alt="서명 이미지" />
            </div>` : ""}
          </div>
          ${Array.isArray(row.tools) && row.tools.length ? `<div class="panel panel-pad" style="margin-bottom:12px">
            <div class="section-title">사용 공기구와 준비물</div>
            <div class="tool-history-list">${row.tools.map((tool) => `<span class="tool-history-chip">${esc(tool.name || tool.id || "-")}</span>`).join("")}</div>
          </div>` : ""}
          ${items.length ? renderInspectionRecordSections(items) : `<div class="empty">이 기록에는 제출 당시 항목별 체크 내역이 저장되어 있지 않습니다.</div>`}
        </div>
        <aside class="panel panel-pad">
          <div class="section-title">점검 결과</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
            <span class="work-icon" style="--accent:${esc(accent)};margin:0;flex:0 0 auto">${categoryVisual(cat)}</span>
            <div>
              <div style="font-size:18px;font-weight:900;color:#0f2440">${firstSpaceBreakHtml(cat.label)}</div>
              <div class="small muted">${esc(row.shipNo || "-")} · ${esc(row.worker || "-")}</div>
            </div>
          </div>
          ${progress(pct, accent)}
          <div class="small muted" style="margin-top:8px">${checkedCount}/${items.length} 항목 확인됨</div>
          <div class="list" style="margin-top:16px">
            ${statusBadge(row.status || "완료")}
            ${badge(Number(row.warnings || 0) ? "high" : "low", Number(row.warnings || 0) ? `위험 ${row.warnings}건 미확인` : "위험 확인 완료")}
            ${badge("medium", `완료율 ${pct}%`)}
          </div>
        </aside>
      </div>`;
    }

    function renderInspectionRecordSections(items) {
      const grouped = items.reduce((acc, item) => {
        const key = item.sectionTitle || "기본 점검";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
      return Object.entries(grouped).map(([sectionTitle, sectionItems]) => `
        <section class="check-section">
          <div class="check-section-head">
            <span>${esc(sectionTitle)}</span>
            <span class="small muted">${sectionItems.filter((item) => item.checked).length}/${sectionItems.length}</span>
          </div>
          ${sectionItems.map((item) => `
            <label class="check-item ${item.checked ? "checked" : ""}">
              <input type="checkbox" ${item.checked ? "checked" : ""} disabled />
              <span class="check-text">${firstSpaceBreakHtml(item.text)}</span>
              ${badge(item.risk)}
            </label>
          `).join("")}
        </section>
      `).join("");
    }

    function renderShips() {
      const ships = sortedShips();
      const grouped = SHIP_WORKFLOW_STAGES.map((stage) => ({
        stage,
        ships: state.ships.filter((ship) => effectiveShipStage(ship).stage === stage),
      }));
      return `${renderProcessBoard(grouped)}
      <div class="panel panel-pad" style="margin-bottom:14px">
        <div class="section-title">
          <span>호선 일괄 추가</span>
          <button class="toggle ${state.adminMode ? "active" : ""}" data-action="toggle-admin" type="button" aria-pressed="${state.adminMode ? "true" : "false"}">
            <span class="toggle-track"></span><span>수정 ${state.adminMode ? "ON" : "OFF"}</span>
          </button>
        </div>
        ${state.adminMode ? "" : `<div class="notice" style="margin-bottom:12px">호선 추가/삭제는 수정 모드를 ON으로 전환한 뒤 가능합니다.</div>`}
        <div class="grid-2">
          <div class="field">
            <label for="newShipNos">호선 번호</label>
            <textarea class="textarea" id="newShipNos" placeholder="한 줄에 하나씩 입력&#10;예) 1234&#10;H1235&#10;1236 LNG"></textarea>
          </div>
          <div class="list">
            <div class="field">
              <label for="newShipType">기본 선종</label>
              <select class="select" id="newShipType">${shipTypeOptions("")}</select>
            </div>
            <div class="field">
              <label for="newShipCustom">기타 선종</label>
              <input class="input" id="newShipCustom" placeholder="기타 선택 시 입력" />
            </div>
            <button class="btn" data-action="add-ship" ${state.adminMode ? "" : "disabled"} type="button">일괄 추가</button>
          </div>
        </div>
      </div>
      <div class="panel panel-pad">
        <div class="section-title">호선 정보 카드 <span class="small muted">${state.ships.length}척</span></div>
        <div class="ship-board-note">수정 모드에서 각 호선의 현재 공정 상태를 선택할 수 있습니다. L/C일이 입력된 호선만 작업자 점검 화면에 표시됩니다.</div>
        <div class="ship-sort-bar">
          <div class="field ship-search-field">
            <label for="shipSearch">호선번호 검색</label>
            <input class="input search-input" id="shipSearch" data-ship-search value="${esc(state.shipSearchQuery)}" placeholder="예) H3481" autocomplete="off" />
            <div class="small muted" data-ship-search-count>${ships.length}척</div>
          </div>
          <div class="field ship-sort-field">
            <label for="shipSortMode">정렬</label>
            <select class="select" id="shipSortMode" data-ship-sort-mode>
              ${shipSortOptions()}
            </select>
          </div>
          <button class="btn-light" data-action="save-ship-order" ${state.adminMode && state.ships.length ? "" : "disabled"} type="button">현재 순서 저장</button>
        </div>
        ${state.ships.length ? `<div class="list" data-ship-search-list>${ships.map(renderShipRow).join("")}</div><div class="empty" data-ship-search-empty hidden>검색 결과가 없습니다.</div>` : `<div class="empty">등록된 호선이 없습니다.</div>`}
      </div>`;
    }

    function renderProcessBoard(grouped) {
      const total = state.ships.length;
      const stages = grouped.map(({ stage, ships }) => ({ info: shipStageInfo(stage), ships }));
      return `<div class="panel panel-pad process-board">
        <div class="section-title">호선 공정 현황 <span class="small muted">총 ${total}척</span></div>
        <div class="ship-board-note">공정 상태는 호선 정보 카드 오른쪽의 상태 목록에서 수정합니다. 인도일 + 1개월이 지난 호선은 자동 삭제됩니다.</div>
        <div class="process-tabs">
          ${stages.map(({ info }) => `<div class="stage-tab" style="--stage:${esc(info.color)}">${esc(info.label)}</div>`).join("")}
        </div>
        <div class="process-lanes">
          ${stages.map(({ info, ships }) => {
            return `<div class="process-lane">
              <div class="process-lane-head"><span>${esc(info.label)}</span><span>${ships.length}</span></div>
              ${ships.slice(0, 5).map((ship) => `<span class="ship-chip" style="--chip:${esc(info.color)}">${navIcon("ship")}<strong>${esc(ship.no)}</strong><small>${esc(shipStageCardFoot(ship))}</small></span>`).join("")}
              ${ships.length > 5 ? `<span class="ship-tile" style="--chip:${esc(info.color)}">+${ships.length - 5}</span>` : `<button class="ship-tile add-ship-tile" style="--chip:${esc(info.color)}" data-action="focus-ship-add" type="button">+<small>호선 추가</small></button>`}
            </div>`;
          }).join("")}
        </div>
        <div class="process-legend">
          ${SHIP_WORKFLOW_STAGES.map((stage) => {
            const info = shipStageInfo(stage);
            return `<span><i class="legend-dot" style="--dot:${esc(info.color)}"></i>${esc(info.label)}</span>`;
          }).join("")}
        </div>
      </div>`;
    }

    function renderShipRow(ship) {
      const info = effectiveShipStage(ship);
      const deliveryType = shipDeliveryType(ship) || "인도";
      const deliveryDate = shipDeliveryDate(ship);
      return `<div class="item-row ship-card" style="--stage:${esc(info.color)}" data-ship-search-item data-ship-search-text="${esc(searchableShipNo(ship))}">
        <div class="ship-card-head">
          <div class="ship-identity">
            <div class="ship-card-title">${esc(ship.no)}</div>
            <div class="ship-card-sub">${esc(ship.type || "선종 미지정")} · ${isWorkerVisibleShip(ship) ? "작업자 공개" : "L/C일 입력 전 비공개"}</div>
          </div>
          ${shipStageField(ship)}
        </div>
        <div class="ship-card-body">
          <div class="ship-date-grid">
            ${shipDateField(ship, "lcDate", "L/C")}
            ${shipDateField(ship, "stDate", "S/T")}
            ${shipDateField(ship, "clDate", "C/L")}
            ${shipDateField(ship, "dlDate", "D/L")}
          </div>
          ${state.adminMode ? `<button class="btn-danger ship-delete-btn" data-delete-ship="${ship.id}" type="button">삭제</button>` : ""}
        </div>
      </div>`;
    }

    function shipStageField(ship) {
      const current = effectiveShipStage(ship).stage;
      return `<div class="ship-stage-field">
        <label for="processStage_${ship.id}">현재 상태</label>
        <select class="stage-select" id="processStage_${ship.id}" data-ship-stage-field data-ship-id="${ship.id}" style="--stage:${esc(shipStageInfo(current).color)};--stage-bg:${esc(shipStageInfo(current).bg)}" ${state.adminMode ? "" : "disabled"}>
          ${SHIP_WORKFLOW_STAGES.map((stage) => {
            const info = shipStageInfo(stage);
            return `<option value="${stage}" ${current === stage ? "selected" : ""}>${esc(info.label)}</option>`;
          }).join("")}
        </select>
      </div>`;
    }

    function shipDateField(ship, field, label) {
      const value = ship[field] || "";
      return `<div class="ship-date-field">
        <label for="${field}_${ship.id}">${label}</label>
        <input class="input" id="${field}_${ship.id}" type="date" data-ship-date-field="${field}" data-ship-id="${ship.id}" value="${esc(value)}" placeholder="미입력" ${state.adminMode ? "" : "disabled"} />
        ${value ? "" : `<span class="ship-date-empty">미입력</span>`}
      </div>`;
    }

    function shipStageCardFoot(ship) {
      const info = effectiveShipStage(ship);
      return info.label;
    }

    function renderItems() {
      if (!state.manageCategoryId) {
        return `${pageHead("항목 관리", "공기구를 등록하고, 작업 유형별로 작업자에게 보일 공기구를 지정합니다.", adminToggleButton())}
        <div class="panel panel-pad" style="margin-bottom:14px">
          <div class="section-title">공기구/준비물 관리</div>
          ${renderToolManager()}
        </div>
        <div class="panel panel-pad category-tool-assignment-panel" style="margin-bottom:14px">
          <div class="section-title">
            작업 유형별 공기구 지정
            <button class="btn" data-action="toggle-category-add" ${state.adminMode ? "" : "disabled"} type="button">${state.categoryAddOpen ? "추가 닫기" : "+ 작업 유형 추가"}</button>
          </div>
          <p class="section-help">작업자가 점검 메뉴에서 작업 유형을 선택했을 때 보일 공기구/준비물을 여기서 지정합니다.</p>
          ${state.adminMode ? "" : `<div class="notice" style="margin-bottom:12px">수정 모드를 켜면 작업 유형별 공기구를 지정할 수 있습니다.</div>`}
          ${state.categoryAddOpen ? `
          <div class="collapsible-panel category-add-panel">
          <div class="form-row">
            <div class="field">
              <label for="catLabel">작업 유형명</label>
              <input class="input" id="catLabel" placeholder="예) 도장 작업" />
            </div>
            <div class="field">
              <label for="catIcon">아이콘/픽토그램</label>
              <input class="input" id="catIcon" placeholder="예) erection 또는 P" />
            </div>
            <div class="field">
              <span class="field-label">색상</span>
              <div class="color-row">${COLORS.map((color, index) => `<button class="color-dot ${index === 0 ? "active" : ""}" style="--dot:${color}" data-pick-color="${color}" type="button" aria-label="색상 선택"></button>`).join("")}</div>
              <input type="hidden" id="catColor" value="${COLORS[0]}" />
            </div>
            <button class="btn" data-action="add-category" ${state.adminMode ? "" : "disabled"} type="button">추가</button>
            <button class="btn-light" data-action="cancel-category-add" type="button">취소</button>
          </div>
          ${renderPictogramPicker("erection")}
          </div>` : ""}
          ${renderCategoryToolAssignments()}
        </div>
        <div class="panel panel-pad" style="margin-bottom:14px">
          <div class="section-title">
            섹션/점검 항목 관리
          </div>
          <p class="section-help">점검 항목 추가/수정/삭제는 작업 유형을 선택해서 관리합니다.</p>
          ${state.adminMode ? "" : `<div class="notice" style="margin-bottom:12px">항목 수정은 상단 수정 버튼으로 관리자 로그인 후 가능합니다.</div>`}
        </div>
        <div class="category-grid">
          ${state.categories.sort(byOrder).map((cat) => {
            const editingCategory = state.editCategoryId === cat.id;
            return `
            <div class="category-card" style="--accent:${esc(categoryAccent(cat))}">
              <span class="category-icon">${categoryVisual(cat)}</span>
              ${editingCategory ? `
                <div class="field">
                  <label for="editCategoryLabel_${cat.id}">작업 유형명 수정</label>
                  <input class="input" id="editCategoryLabel_${cat.id}" value="${esc(cat.label)}" />
                </div>` : `<div class="item-name" style="font-weight:800" title="${esc(cat.label)}">${esc(cat.label)}</div>`}
              <div class="small muted" style="margin:6px 0 12px">${sectionsFor(cat.id).length}개 섹션 · ${activeItems(cat.id).length}개 항목 · ${esc(normalizeToolNature(cat.toolNature))}</div>
              <div class="item-actions manage-actions">
                ${editingCategory ? `
                  <button class="btn" data-save-category="${cat.id}" type="button">저장</button>
                  <button class="btn-light" data-action="cancel-edit-category" type="button">취소</button>` : `
                  <button class="btn-light" data-manage-category="${cat.id}" type="button">섹션/항목 관리</button>
                  <button class="btn-light" data-edit-category="${cat.id}" ${state.adminMode ? "" : "disabled"} type="button">수정</button>
                  <button class="btn-danger" data-delete-category="${cat.id}" ${state.adminMode ? "" : "disabled"} type="button">삭제</button>`}
              </div>
            </div>`;
          }).join("")}
        </div>`;
      }

      const cat = categoryById(state.manageCategoryId);
      if (!cat) {
        state.manageCategoryId = null;
        return renderItems();
      }
      const visualOpen = state.categoryVisualOpen === true;
      return `${pageHead(`${cat.label} 항목 관리`, "섹션별로 항목을 나누어 현장 점검 화면에 같은 구조로 표시합니다.", `<button class="btn-light" data-action="back-items" type="button">목록으로</button>${adminToggleButton()}`)}
      <div class="split">
        <div class="panel panel-pad">
          <div class="section-title">섹션 추가</div>
          <div class="form-row">
            <div class="field">
              <label for="newSectionTitle">섹션명</label>
              <input class="input" id="newSectionTitle" placeholder="예) 작업 전 준비" />
            </div>
            <button class="btn" data-action="add-section" ${state.adminMode ? "" : "disabled"} type="button">섹션 추가</button>
          </div>
        </div>
        <aside class="panel panel-pad">
          <div class="section-title">아이콘/픽토그램 수정</div>
          <div class="pictogram-current" style="--accent:${esc(categoryAccent(cat))}">
            <span class="category-icon">${categoryVisual(cat)}</span>
            <div>
              <div style="font-weight:900">${esc(cat.label)}</div>
              <div class="small muted">현재 값: ${esc(cat.icon || "-")}</div>
            </div>
          </div>
          ${moreToggle("data-toggle-category-visual", visualOpen)}
          ${visualOpen ? `<div class="collapsible-panel">
            <div class="field" style="margin-bottom:10px">
              <label for="editCatIcon">아이콘 값</label>
              <input class="input" id="editCatIcon" value="${esc(cat.icon || "")}" placeholder="예) erection 또는 P" ${state.adminMode ? "" : "disabled"} />
            </div>
            <div class="field" style="margin-bottom:10px">
              <label for="editCatToolNature">공기구 기준 성격</label>
              <select class="select" id="editCatToolNature" ${state.adminMode ? "" : "disabled"}>
                ${toolNatureOptions(cat.toolNature)}
              </select>
            </div>
            <button class="toggle ${cat.requireToolCheck !== false ? "active" : ""}" data-toggle-tool-check="${esc(cat.id)}" ${state.adminMode ? "" : "disabled"} type="button" aria-pressed="${cat.requireToolCheck !== false ? "true" : "false"}" style="width:100%;margin-bottom:10px">
              <span class="toggle-track"></span><span>공기구 체크 필수 ${cat.requireToolCheck !== false ? "ON" : "OFF"}</span>
            </button>
            ${renderPictogramPicker(cat.icon || "", "editCatIcon")}
            <button class="btn" data-action="save-category-icon" ${state.adminMode ? "" : "disabled"} type="button" style="width:100%;margin-top:10px">기준 저장</button>
            <div class="tool-admin-stack">
              <div>
                <div class="section-title" style="margin-top:16px">픽토그램 라이브러리 관리</div>
                ${renderPictogramLibraryManager()}
              </div>
            </div>
          </div>` : ""}
        </aside>
      </div>
      <div class="list" style="margin-top:14px">
        ${sectionsFor(cat.id).map((section) => renderSectionManager(cat, section)).join("") || `<div class="empty">섹션이 없습니다. 먼저 섹션을 추가하세요.</div>`}
      </div>`;
    }

    function renderUnsafe() {
      const detail = state.lastUnsafeIssueId ? state.unsafeIssues.find((row) => row.id === state.lastUnsafeIssueId) : null;
      if (detail) return renderUnsafeComplete(detail);
      const step = unsafeDraftStep();
      if (step === 1) return renderUnsafeShipStep();
      if (step === 2) return renderUnsafeContentStep();
      return renderUnsafeConfirmStep();
    }

    function unsafeDraftStep() {
      return Math.min(Math.max(Number(state.unsafeDraft.step) || 1, 1), 3);
    }

    function saveUnsafeDraft() {
      state.unsafeDraft.step = unsafeDraftStep();
      saveJson("unsafeDraft", state.unsafeDraft);
    }

    function unsafeStepReady(step = unsafeDraftStep()) {
      const draft = state.unsafeDraft;
      if (step === 1) return Boolean(draft.shipNo);
      if (step === 2) return Boolean(draft.shipNo && String(draft.content || "").trim() && draft.workerId);
      return Boolean(draft.shipNo && String(draft.content || "").trim() && draft.workerId);
    }

    function flowRequiredText(missing) {
      return missing.length ? `${missing.join(", ")}을(를) 입력하세요.` : "";
    }

    function unsafeMissingFields(step = unsafeDraftStep()) {
      const draft = state.unsafeDraft;
      const missing = [];
      if (step >= 1 && !draft.shipNo) missing.push("호선");
      if (step >= 2 && !String(draft.content || "").trim()) missing.push("내용");
      if (step >= 2 && !draft.workerId) missing.push("등록자");
      return missing;
    }

    function unsafeFlowShell(step, title, lead, body, footer = "") {
      const total = 3;
      const pct = Math.round(step / total * 100);
      return `<section class="material-flow unsafe-flow">
        <div class="material-flow-head">
          <div class="material-flow-kicker">불안전요소 등록 · STEP ${step} / ${total}</div>
          <div class="material-flow-title">
            ${step > 1 ? `<button class="material-back" data-unsafe-step-back type="button" aria-label="이전 단계">‹</button>` : ""}
            <h1>${esc(title)}</h1>
          </div>
          <p>${esc(lead)}</p>
          <div class="material-flow-progress" role="progressbar" aria-label="등록 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
        </div>
        <div class="material-flow-body">${body}</div>
        ${footer ? `<div class="material-flow-footer">${footer}</div>` : ""}
      </section>`;
    }

    function renderUnsafeShipStep() {
      const ships = selectableShips();
      const selected = ships.find((ship) => ship.no === state.unsafeDraft.shipNo);
      const selectedMeta = selected ? effectiveShipStage(selected) : null;
      const body = `${ships.length ? `<div class="field material-flow-field">
        <label for="unsafeShipNo">호선 선택 *</label>
        <select class="select" id="unsafeShipNo">
          ${visibleShipOptionsForIssues(state.unsafeDraft.shipNo)}
        </select>
      </div>
      ${selected ? `<div class="material-selected-note"><strong>${esc(selected.no)}</strong> ${esc(selected.type || "")} · ${esc(selectedMeta.label)} ${esc(selectedMeta.percent)}%</div>` : ""}` : `<div class="notice danger">작업자에게 공개된 호선이 없습니다. 호선 관리에서 L/C일을 입력하세요.</div>`}`;
      const label = selected ? `${selected.no} 선택 → 다음` : "호선 선택 후 다음";
      return unsafeFlowShell(1, "호선 선택", "불안전요소가 발생한 호선을 선택하세요", body, `<button class="material-flow-primary ${selected ? "" : "is-disabled"}" data-unsafe-next type="button" ${selected ? "" : "disabled"}>${esc(label)}</button>`);
    }

    function renderUnsafeContentStep() {
      reconcileUnsafePhotoDraft();
      const ready = unsafeStepReady(2);
      const selectedWorker = state.workers.find((worker) => worker.id === state.unsafeDraft.workerId);
      const photoNames = currentUnsafePhotoNames();
      const body = `<div class="field material-flow-field">
        <label for="unsafeContent"><span>불안전요소 내용 *</span><small>${String(state.unsafeDraft.content || "").length}/300</small></label>
        <textarea class="textarea" id="unsafeContent" maxlength="300" placeholder="예: 3번 탱크 상부 난간 미설치, 작업자 통행 위험">${esc(state.unsafeDraft.content || "")}</textarea>
      </div>
      <div class="field material-flow-field">
        <label for="unsafeWorkerId">등록자 선택 *</label>
        <select class="select" id="unsafeWorkerId">
          ${visibleWorkerOptions(state.unsafeDraft.workerId)}
        </select>
        ${selectedWorker ? `<div class="small muted material-selected-note">${esc(selectedWorker.name)} 님으로 접수됩니다.</div>` : ""}
      </div>
      <div class="field material-flow-field">
        <label for="unsafePhotos"><span>현장 사진 첨부</span><small>선택, 최대 3장</small></label>
        <input class="input" id="unsafePhotos" type="file" accept="image/*" multiple />
        <div class="small muted">${photoNames.length ? `${esc(photoNames.join(", "))}` : "사진 없이도 다음 단계로 진행할 수 있습니다."}</div>
      </div>`;
      return unsafeFlowShell(2, "내용 입력", `${state.unsafeDraft.shipNo || "선택한 호선"}에서 발견한 위험 요소를 적어주세요`, body, `<button class="material-flow-primary ${ready ? "" : "is-disabled"}" data-unsafe-next type="button" data-required-message="${esc(flowRequiredText(unsafeMissingFields(2)))}" ${ready ? "" : "disabled"}>다음 → 최종 확인</button>`);
    }

    function renderUnsafeConfirmStep() {
      reconcileUnsafePhotoDraft();
      const ship = state.ships.find((row) => row.no === state.unsafeDraft.shipNo);
      const worker = state.workers.find((row) => row.id === state.unsafeDraft.workerId);
      const ready = unsafeStepReady(4);
      const photoNames = currentUnsafePhotoNames();
      const body = `<div class="material-field-label">등록 내용 요약</div>
      <article class="material-confirm-card unsafe-confirm-card">
        <div class="material-confirm-head">
          <span class="material-type-icon tone-red">!</span>
          <span><strong>${esc(shortUnsafeTitle(state.unsafeDraft.content || "불안전요소"))}</strong><em>${esc(state.unsafeDraft.shipNo || "-")} · ${esc(worker ? worker.name : "-")}</em></span>
          <button class="btn-light" data-unsafe-edit-step="2" type="button">수정</button>
        </div>
        <dl class="material-confirm-list">
          <div><dt>호선</dt><dd><strong>${esc(state.unsafeDraft.shipNo || "-")}</strong><small>${ship ? `${esc(effectiveShipStage(ship).label)} · ${esc(effectiveShipStage(ship).percent)}%` : ""}</small></dd></div>
          <div><dt>등록자</dt><dd>${esc(worker ? worker.name : "-")}</dd></div>
          <div><dt>위험 내용</dt><dd>${esc(state.unsafeDraft.content || "-")}</dd></div>
          <div><dt>사진</dt><dd>${photoNames.length ? esc(`${photoNames.length}장 첨부`) : "없음"}</dd></div>
        </dl>
      </article>
      <div class="notice material-submit-note">제출 후 관리자 처리 화면의 불안전요소 목록에 즉시 접수됩니다.</div>`;
      const footer = `<button class="btn-light material-flow-secondary" data-unsafe-edit-step="2" type="button">수정하기</button>
        <button class="material-flow-primary ${ready ? "" : "is-disabled"}" data-action="submit-unsafe" type="button" ${ready ? "" : "disabled"}>${navIcon("warning")} 불안전요소 접수</button>`;
      return unsafeFlowShell(3, "최종 수정/확인", "등록 내용을 확인하고 필요하면 수정하세요", body, footer);
    }

    function renderMaterials() {
      const detail = state.lastMaterialId ? state.missingMaterials.find((row) => row.id === state.lastMaterialId) : null;
      if (detail) return renderMaterialComplete(detail);
      const step = materialDraftStep();
      if (step === 1) return renderMaterialShipStep();
      if (step === 2) return renderMaterialInfoStep();
      if (step === 3) return renderMaterialQuantityStep();
      return renderMaterialConfirmStep();
    }

    function materialDraftStep() {
      return Math.min(Math.max(Number(state.materialDraft.step) || 1, 1), 4);
    }

    function saveMaterialDraft() {
      state.materialDraft.step = materialDraftStep();
      saveJson("materialDraft", state.materialDraft);
    }

    function materialTypeMeta(typeId = state.materialDraft.materialType) {
      return MATERIAL_TYPES.find((row) => row.id === typeId) || MATERIAL_TYPES[MATERIAL_TYPES.length - 1];
    }

    function materialQuantityText(row = state.materialDraft) {
      const quantity = String(row.quantity || "").trim();
      if (!quantity) return "-";
      return `${quantity} ${String(row.unit || "EA").trim()}`.trim();
    }

    function isValidMaterialQuantity(value) {
      const text = String(value || "").trim();
      return Boolean(text && /^\d+(?:\.\d+)?$/.test(text) && Number(text) > 0);
    }

    function materialDraftContent(draft = state.materialDraft) {
      const lines = [
        materialQuantityText(draft) !== "-" ? `수량: ${materialQuantityText(draft)}` : "",
        String(draft.spec || "").trim() ? `규격: ${String(draft.spec).trim()}` : "",
        String(draft.detail || "").trim() ? `비고: ${String(draft.detail).trim()}` : "",
      ].filter(Boolean);
      return lines.join("\n") || String(draft.content || "").trim();
    }

    function materialStepReady(step = materialDraftStep()) {
      const draft = state.materialDraft;
      if (step === 1) return Boolean(draft.shipNo);
      if (step === 2) return Boolean(draft.shipNo && draft.materialType && String(draft.materialName || "").trim());
      if (step === 3) return Boolean(draft.shipNo && draft.materialType && String(draft.materialName || "").trim() && isValidMaterialQuantity(draft.quantity) && draft.workerId);
      return Boolean(draft.shipNo && draft.materialType && String(draft.materialName || "").trim() && isValidMaterialQuantity(draft.quantity) && draft.workerId);
    }

    function materialMissingFields(step = materialDraftStep()) {
      const draft = state.materialDraft;
      const missing = [];
      if (step >= 1 && !draft.shipNo) missing.push("호선");
      if (step >= 2 && !draft.materialType) missing.push("자재 분류");
      if (step >= 2 && !String(draft.materialName || "").trim()) missing.push("자재명");
      if (step >= 3 && !isValidMaterialQuantity(draft.quantity)) missing.push("수량");
      if (step >= 3 && !draft.workerId) missing.push("등록자");
      return missing;
    }

    function materialFlowShell(step, title, lead, body, footer = "") {
      const pct = Math.round(step / 4 * 100);
      return `<section class="material-flow">
        <div class="material-flow-head">
          <div class="material-flow-kicker">호선자재 누락 등록 · STEP ${step} / 4</div>
          <div class="material-flow-title">
            ${step > 1 ? `<button class="material-back" data-material-step-back type="button" aria-label="이전 단계">‹</button>` : ""}
            <h1>${esc(title)}</h1>
          </div>
          <p>${esc(lead)}</p>
          <div class="material-flow-progress" role="progressbar" aria-label="등록 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
        </div>
        <div class="material-flow-body">${body}</div>
        ${footer ? `<div class="material-flow-footer">${footer}</div>` : ""}
      </section>`;
    }

    function renderMaterialShipStep() {
      const ships = selectableShips();
      const selected = ships.find((ship) => ship.no === state.materialDraft.shipNo);
      const selectedMeta = selected ? effectiveShipStage(selected) : null;
      const body = `${ships.length ? `<div class="field material-flow-field">
        <label for="materialShipNo">호선 선택 *</label>
        <select class="select" id="materialShipNo">
          ${visibleShipOptionsForIssues(state.materialDraft.shipNo)}
        </select>
      </div>
      ${selected ? `<div class="material-selected-note"><strong>${esc(selected.no)}</strong> ${esc(selected.type || "")} · ${esc(selectedMeta.label)} ${esc(selectedMeta.percent)}%</div>` : ""}` : `<div class="notice danger">작업자에게 공개된 호선이 없습니다. 호선 관리에서 L/C일을 입력하세요.</div>`}`;
      const label = selected ? `${selected.no} 선택 → 다음` : "호선 선택 후 다음";
      return materialFlowShell(1, "호선 선택", "자재가 없는 호선을 선택하세요", body, `<button class="material-flow-primary ${selected ? "" : "is-disabled"}" data-material-next type="button" ${selected ? "" : "disabled"}>${esc(label)}</button>`);
    }

    function renderMaterialInfoStep() {
      const selectedType = materialTypeMeta();
      const ready = materialStepReady(2);
      const body = `<div class="material-field-label">자재 분류</div>
      <div class="material-type-grid">
        ${MATERIAL_TYPES.map((type) => {
          const active = type.id === state.materialDraft.materialType;
          return `<button class="material-type-card ${active ? "active" : ""} tone-${esc(type.tone)}" data-material-select-type="${esc(type.id)}" type="button" aria-pressed="${active ? "true" : "false"}">
            <span class="material-type-icon">${esc(type.icon)}</span>
            <span><strong>${esc(type.label)}</strong><em>${esc(type.sub)}</em></span>
            ${active ? `<b>✓</b>` : ""}
          </button>`;
        }).join("")}
      </div>
      <div class="field material-flow-field">
        <label for="materialName">자재명 *</label>
        <input class="input" id="materialName" value="${esc(state.materialDraft.materialName)}" placeholder="예: M20 볼트, 용접봉 7016 3.2mm..." />
      </div>
      <div class="field material-flow-field">
        <label for="materialSpec"><span>규격 / 사양</span><small>${esc(selectedType.label || "선택")}</small></label>
        <input class="input" id="materialSpec" value="${esc(state.materialDraft.spec || "")}" placeholder="예: SUS304, Φ20, 3.2mm, 600×40..." />
      </div>`;
      return materialFlowShell(2, "자재 정보", "어떤 자재가 없나요?", body, `<button class="material-flow-primary ${ready ? "" : "is-disabled"}" data-material-next type="button" data-required-message="${esc(flowRequiredText(materialMissingFields(2)))}" ${ready ? "" : "disabled"}>다음 → 수량 입력</button>`);
    }

    function renderMaterialQuantityStep() {
      const type = materialTypeMeta();
      const selectedWorker = state.workers.find((worker) => worker.id === state.materialDraft.workerId);
      const ready = materialStepReady(3);
      const body = `<div class="material-summary-pill">
        <span class="material-type-icon tone-${esc(type.tone)}">${esc(type.icon)}</span>
        <span><strong>${esc(state.materialDraft.materialName || "자재명")}</strong><em>${esc(state.materialDraft.spec || type.label)}</em></span>
        <small>${esc(type.label)}</small>
      </div>
      <div class="material-quantity-grid">
        <div class="field material-flow-field">
          <label for="materialQuantity">수량 *</label>
          <input class="input material-quantity-input" id="materialQuantity" inputmode="decimal" pattern="\\d+(\\.\\d+)?" value="${esc(state.materialDraft.quantity || "")}" placeholder="0" />
        </div>
        <div class="field material-flow-field">
          <label for="materialUnit">단위</label>
          <select class="select" id="materialUnit">${MATERIAL_UNITS.map((unit) => `<option value="${esc(unit)}" ${state.materialDraft.unit === unit ? "selected" : ""}>${esc(unit)}</option>`).join("")}</select>
        </div>
      </div>
      <div class="field material-flow-field">
        <label for="materialDetail"><span>상세 내용</span><small>${String(state.materialDraft.detail || "").length}/150</small></label>
        <textarea class="textarea" id="materialDetail" maxlength="150" placeholder="언제까지 필요한지, 위치나 상황을 적어주세요">${esc(state.materialDraft.detail || "")}</textarea>
      </div>
      <div class="field material-flow-field">
        <label for="materialWorkerId">등록자 선택 *</label>
        <select class="select" id="materialWorkerId">
          ${visibleWorkerOptions(state.materialDraft.workerId)}
        </select>
      </div>
      ${selectedWorker ? `<div class="small muted material-selected-note">${esc(selectedWorker.name)} 님으로 접수됩니다.</div>` : ""}`;
      return materialFlowShell(3, "수량 및 상세", `${state.materialDraft.materialName || "자재"} · ${state.materialDraft.shipNo || "호선"}`, body, `<button class="material-flow-primary ${ready ? "" : "is-disabled"}" data-material-next type="button" data-required-message="${esc(flowRequiredText(materialMissingFields(3)))}" ${ready ? "" : "disabled"}>다음 → 최종 확인</button>`);
    }

    function renderMaterialConfirmStep() {
      const type = materialTypeMeta();
      const ship = state.ships.find((row) => row.no === state.materialDraft.shipNo);
      const worker = state.workers.find((row) => row.id === state.materialDraft.workerId);
      const ready = materialStepReady(4);
      const body = `<div class="material-field-label">등록 내용 요약</div>
      <article class="material-confirm-card">
        <div class="material-confirm-head">
          <span class="material-type-icon tone-${esc(type.tone)}">${esc(type.icon)}</span>
          <span><strong>${esc(state.materialDraft.materialName || "-")}</strong><em>${esc(state.materialDraft.spec || "-")}</em></span>
          <button class="btn-light" data-material-edit-step="2" type="button">수정</button>
        </div>
        <dl class="material-confirm-list">
          <div><dt>호선</dt><dd><strong>${esc(state.materialDraft.shipNo || "-")}</strong><small>${ship ? `${esc(effectiveShipStage(ship).label)} · ${esc(effectiveShipStage(ship).percent)}%` : ""}</small></dd></div>
          <div><dt>분류</dt><dd>${esc(type.label)}</dd></div>
          <div><dt>수량</dt><dd class="accent">${esc(materialQuantityText())}</dd></div>
          <div><dt>등록자</dt><dd>${esc(worker ? worker.name : "-")}</dd></div>
          <div><dt>비고</dt><dd>${esc(state.materialDraft.detail || "-")}</dd></div>
        </dl>
      </article>
      <div class="notice material-submit-note">제출 후 관리자에게 자동 알림이 전송됩니다. 처리 결과는 호선자재 누락 탭에서 확인하세요.</div>`;
      const footer = `<button class="btn-light material-flow-secondary" data-material-edit-step="2" type="button">수정하기</button>
        <button class="material-flow-primary ${ready ? "" : "is-disabled"}" data-action="submit-material" type="button" ${ready ? "" : "disabled"}>${navIcon("board")} 누락 자재 등록</button>`;
      return materialFlowShell(4, "최종 확인", "등록 내용을 확인하고 제출하세요", body, footer);
    }

    function currentUnsafePhotoNames() {
      const files = Array.isArray(state.unsafePhotoFiles) ? state.unsafePhotoFiles : [];
      return files.length ? files.map((file) => file.name) : [];
    }

    function reconcileUnsafePhotoDraft() {
      const names = currentUnsafePhotoNames();
      if (!names.length && Array.isArray(state.unsafeDraft.photos) && state.unsafeDraft.photos.length) {
        state.unsafeDraft.photos = [];
        saveJson("unsafeDraft", state.unsafeDraft);
      }
    }

    function updateFlowNextControls() {
      syncUnsafeDraftFromDom();
      syncMaterialDraftFromDom();
      const unsafeNext = document.querySelector("[data-unsafe-next]");
      if (unsafeNext) {
        const ready = unsafeStepReady();
        unsafeNext.disabled = !ready;
        unsafeNext.classList.toggle("is-disabled", !ready);
        unsafeNext.dataset.requiredMessage = flowRequiredText(unsafeMissingFields());
      }
      const materialNext = document.querySelector("[data-material-next]");
      if (materialNext) {
        const ready = materialStepReady();
        materialNext.disabled = !ready;
        materialNext.classList.toggle("is-disabled", !ready);
        materialNext.dataset.requiredMessage = flowRequiredText(materialMissingFields());
      }
    }

    function syncUnsafeDraftFromDom() {
      const ship = $("unsafeShipNo");
      const content = $("unsafeContent");
      const worker = $("unsafeWorkerId");
      if (ship) state.unsafeDraft.shipNo = ship.value;
      if (content) state.unsafeDraft.content = content.value;
      if (worker) state.unsafeDraft.workerId = worker.value;
    }

    function syncMaterialDraftFromDom() {
      const ship = $("materialShipNo");
      const name = $("materialName");
      const spec = $("materialSpec");
      const quantity = $("materialQuantity");
      const unit = $("materialUnit");
      const detail = $("materialDetail");
      const worker = $("materialWorkerId");
      if (ship) state.materialDraft.shipNo = ship.value;
      if (name) state.materialDraft.materialName = name.value;
      if (spec) state.materialDraft.spec = spec.value;
      if (quantity) state.materialDraft.quantity = quantity.value;
      if (unit) state.materialDraft.unit = unit.value;
      if (detail) state.materialDraft.detail = detail.value;
      if (worker) state.materialDraft.workerId = worker.value;
    }

    function renderManage() {
      const tabs = [
        ["workers", "작업자"],
        ["unsafe", "불안전요소"],
        ["materials", "자재누락"],
      ];
      const previewAdmin = isRedesignPreviewPage();
      if (!state.adminMode && !previewAdmin && state.manageTab !== "unsafe") state.manageTab = "unsafe";
      const unsafeReadOnly = !state.adminMode && state.manageTab === "unsafe";
      if (!state.adminMode && !previewAdmin && !unsafeReadOnly) {
        return pageHead("관리", "관리자 모드에서 사용할 수 있습니다.", adminToggleButton())
          + `<div class="notice danger">관리자 모드가 필요합니다.</div>`;
      }
      const visibleTabs = state.adminMode || previewAdmin ? tabs : [["unsafe", "불안전요소"]];
      const unsafeOpen = state.unsafeIssues.filter((row) => row.status !== ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2]).length;
      const materialOpen = state.missingMaterials.filter((row) => row.status !== ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2]).length;
      const tabCounts = {
        workers: state.workers.length,
        unsafe: unsafeOpen,
        materials: materialOpen,
      };
      const lead = state.adminMode || previewAdmin ? "작업자와 접수 기록을 관리합니다." : "불안전요소 접수 현황을 확인합니다.";
      return `${pageHead("관리", lead, adminToggleButton())}
      ${state.adminMode || previewAdmin ? "" : `<div class="notice" style="margin-bottom:12px">목록은 볼 수 있고, 상태 변경과 삭제는 관리자 모드에서 사용할 수 있습니다.</div>`}
      <div class="manage-tabs" role="tablist" aria-label="관리 탭">
        ${visibleTabs.map(([id, label]) => `<button class="seg-btn ${state.manageTab === id ? "active" : ""}" data-manage-tab="${id}" type="button">${esc(label)} <span>${tabCounts[id]}</span></button>`).join("")}
      </div>
      <div class="manage-workspace">
        ${state.manageTab === "workers" ? renderWorkerManager() : ""}
        ${state.manageTab === "unsafe" ? renderUnsafeManager() : ""}
        ${state.manageTab === "materials" ? renderMaterialManager() : ""}
      </div>`;
    }

    function renderWorkerManager() {
      return `<section class="panel panel-pad">
        <div class="section-title">작업자 목록 <span class="small muted">${state.workers.length}명</span></div>
        <div class="form-row worker-form">
          <div class="field">
            <label for="workerName">이름</label>
            <input class="input" id="workerName" placeholder="예) 김민수" />
          </div>
          <div class="field">
            <label for="workerTeam">소속/팀</label>
            <input class="input" id="workerTeam" placeholder="예) 배관팀" />
          </div>
          <button class="btn" data-action="add-worker" type="button">추가</button>
        </div>
        <div class="list worker-list">
          ${state.workers.length ? state.workers.map(renderWorkerRow).join("") : `<div class="empty">등록된 작업자가 없습니다.</div>`}
        </div>
      </section>`;
    }

    function renderWorkerRow(worker) {
      return `<div class="item-row worker-row">
        <div class="item-main">
          <div class="item-name">${esc(worker.name)}</div>
          <div class="small muted">${esc(worker.team || "소속/팀 없음")}</div>
        </div>
        <div class="item-actions">
          <button class="btn-light" data-edit-worker="${esc(worker.id)}" type="button">수정</button>
          <button class="btn-danger" data-delete-worker="${esc(worker.id)}" type="button">삭제</button>
        </div>
      </div>`;
    }

    function shortRecordId(id) {
      const raw = String(id || "");
      const compact = raw.replace(/^[a-zA-Z_:-]+/, "").replace(/[^a-zA-Z0-9]/g, "");
      return (compact.slice(-4) || "0000").toUpperCase();
    }

    function shortUnsafeTitle(content) {
      const text = String(content || "").trim();
      if (!text) return "불안전요소";
      return text.length > 24 ? `${text.slice(0, 24)}...` : text;
    }

    function relativeRecordTime(value) {
      const time = value ? new Date(value).getTime() : NaN;
      if (!Number.isFinite(time)) return "-";
      const diff = Math.max(0, serverNow().getTime() - time);
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "이제";
      if (minutes < 60) return `${minutes}분 전`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}시간 전`;
      return `${Math.floor(hours / 24)}일 전`;
    }

    function shortRecordTime(value) {
      const date = value ? new Date(value) : null;
      if (!date || Number.isNaN(date.getTime())) return "-";
      return `${pad2(date.getHours())}:${pad2(date.getMinutes())} · ${relativeRecordTime(value)}`;
    }

    function shipStageForNo(shipNo) {
      const ship = state.ships.find((item) => item.no === shipNo);
      if (!ship) return "-";
      return shipStageInfo(ship.processStage || "mounting").label;
    }

    function statusChip(status) {
      const label = String(status || "-");
      const tone = /완료/.test(label) ? "done" : /조치|확인/.test(label) ? "working" : "new";
      return `<span class="status-chip ${tone}">${esc(label)}</span>`;
    }

    function materialQuantity(value) {
      const row = value && typeof value === "object" ? value : null;
      if (row && String(row.quantity || "").trim()) return `${String(row.quantity).trim()} ${String(row.unit || "EA").trim()}`.trim();
      const text = String(row ? row.content || "" : value || "");
      const match = text.match(/(\d+(?:\.\d+)?)\s*(EA|개|박스|매|캔|m|M|kg|KG)?/);
      return match ? `${match[1]} ${match[2] || ""}`.trim() : "-";
    }

    function renderUnsafeManager() {
      const detail = state.unsafeDetailId ? state.unsafeIssues.find((row) => row.id === state.unsafeDetailId) : null;
      if (state.unsafeDetailId) state.unsafeDetailId = "";
      const filtered = ISSUE_MATERIAL_RULES.filterRecords(state.unsafeIssues, state.unsafeFilters);
      const sorted = ISSUE_MATERIAL_RULES.sortRecords(filtered, state.unsafeFilters.sort, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES);
      const openCount = state.unsafeIssues.filter((row) => row.status !== ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2]).length;
      const selected = detail || sorted[0] || state.unsafeIssues[0] || null;
      return `<section class="admin-board unsafe-board">
        <div class="admin-board-top">
          <div>
            <h2>불안전요소 처리</h2>
            <p>${state.unsafeIssues.length}건 등록 · ${openCount}건 미확인</p>
          </div>
          <div class="admin-board-actions">
            <button class="btn-light" data-export-records="unsafe" type="button">내보내기</button>
            <button class="btn" data-view="unsafe" type="button">+ 신규</button>
          </div>
        </div>
        <div class="unsafe-split">
          <aside class="unsafe-list-panel">
            <div class="unsafe-list-head">
              <div><strong>전체 목록</strong><span>상태별</span></div>
              <button class="btn-light" data-record-filter="unsafe:status" value="" type="button">필터</button>
            </div>
            <div class="unsafe-list-table">
              <div class="unsafe-list-row unsafe-list-row-head"><span>호선</span><span>제목</span><span>상태</span></div>
              ${sorted.length ? sorted.map((row) => renderUnsafeQueueItem(row, selected && selected.id === row.id)).join("") : `<div class="empty">표시할 불안전요소가 없습니다.</div>`}
            </div>
          </aside>
          <article class="unsafe-detail-card">
            ${selected ? renderUnsafeProcessingDetail(selected) : `<div class="empty">처리할 항목이 없습니다.</div>`}
          </article>
        </div>
      </section>`;
    }

    function renderUnsafeQueueItem(row, active) {
      const pendingPhotoCount = pendingPhotoUploadsFor(row.id).length;
      return `<button class="unsafe-list-row ${active ? "active" : ""}" data-unsafe-record-detail="${esc(row.id)}" type="button">
        <span><strong>${esc(row.shipNo || "-")}</strong><em>${esc(relativeRecordTime(row.createdAt))}</em></span>
        <span><strong>${esc(shortUnsafeTitle(row.content))}</strong><em>${esc(row.workerNameSnapshot || "-")} · ${esc(shipStageForNo(row.shipNo))}${pendingPhotoCount ? ` · 사진 업로드 대기 ${pendingPhotoCount}장` : ""}</em></span>
        ${statusChip(row.status)}
      </button>`;
    }

    function renderUnsafeProcessingDetail(row) {
      const photos = unsafePhotosFor(row.id);
      const pendingPhotos = pendingPhotoUploadsFor(row.id);
      const token = `unsafe:${row.id}`;
      const canEdit = state.adminMode || isRedesignPreviewPage();
      return `<div class="unsafe-detail-shell">
        <div class="unsafe-detail-top">
          <div>
            <span class="record-id">Nº${esc(shortRecordId(row.id))} · ${esc(row.status || "미확인")}</span>
            <h3>${esc(shortUnsafeTitle(row.content))}</h3>
            <p>${esc(row.shipNo || "-")} · ${esc(formatDateTime(row.createdAt))} · ${esc(row.workerNameSnapshot || "-")} · ${esc(shipStageForNo(row.shipNo))}</p>
          </div>
          <div class="unsafe-detail-actions">
            <select class="select" data-record-status="${esc(token)}" data-current-status="${esc(row.status || "")}" ${canEdit ? "" : "disabled"}>
              ${ISSUE_MATERIAL_RULES.UNSAFE_STATUSES.map((status) => `<option value="${esc(status)}" ${row.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}
            </select>
            <button class="btn" data-save-record-status="${esc(token)}" disabled type="button">완료 처리</button>
          </div>
        </div>
        <div class="unsafe-photo-grid">
          ${[0, 1].map((index) => renderUnsafePhotoSlot(photos[index], index)).join("")}
        </div>
        ${renderPendingPhotoUploadPanel(row.id, pendingPhotos)}
        <div class="unsafe-detail-body">
          <span>내용</span>
          <p>${esc(row.content || "내용 없음")}</p>
          <div class="unsafe-meta-grid">
            <div><span>등록자</span><strong>${esc(row.workerNameSnapshot || "-")}</strong></div>
            <div><span>소속</span><strong>${esc(row.workerTeamSnapshot || "-")}</strong></div>
            <div><span>접수 시각</span><strong>${esc(shortRecordTime(row.createdAt))}</strong></div>
            <div><span>연관 점검</span><strong>${esc(row.shipNo || "-")} / ${esc(shipStageForNo(row.shipNo))}</strong></div>
          </div>
        </div>
        <div class="unsafe-history-panel">
          <div class="section-title">처리 이력</div>
          ${renderRecordTimeline(row, { initialStatus: ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0] })}
          <div class="unsafe-memo-row">
            <textarea class="textarea" data-record-memo="${esc(token)}" placeholder="처리 메모 입력 (예: 난간 보강 완료 - 14:00)" ${canEdit ? "" : "disabled"}>${esc(row.adminMemo || "")}</textarea>
            <button class="btn" data-save-record="${esc(token)}" ${canEdit ? "" : "disabled"} type="button">기록 추가</button>
          </div>
        </div>
      </div>`;
    }

    function renderUnsafePhotoSlot(photo, index) {
      const url = photo ? publicPhotoUrl(photo) : "";
      return `<figure class="unsafe-photo-slot ${url ? "" : "no-photo"}">
        ${url ? `<img src="${esc(url)}" alt="현장 사진 ${index + 1}" />` : `<div><strong>사진 없음</strong><span>첨부된 현장 사진이 없습니다</span></div>`}
      </figure>`;
    }

    function pendingPhotoUploadsFor(issueId) {
      return state.pendingPhotoUploads.filter((row) => row.issueId === issueId);
    }

    function renderPendingPhotoUploadPanel(issueId, rows = pendingPhotoUploadsFor(issueId)) {
      if (!rows.length) return "";
      const retryable = rows.some((row) => row.dataUrl);
      return `<div class="photo-retry-panel" role="status" aria-live="polite">
        <div>
          <strong>사진 업로드 대기</strong>
          <span>${rows.length}장 · 네트워크 복구 후 다시 전송할 수 있습니다.</span>
          ${rows.some((row) => !row.dataUrl) ? `<em>일부 파일은 다시 첨부가 필요합니다.</em>` : ""}
        </div>
        <button class="btn-light" data-action="retry-photo-upload" data-retry-photo-upload="${esc(issueId)}" ${retryable ? "" : "disabled"} type="button">재시도</button>
      </div>`;
    }

    function renderUnsafeGroup(group) {
      const collapsed = group.status === ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2];
      return `<section class="record-group">
        <div class="record-group-head">
          <strong>${esc(group.status)}</strong>
          <span class="small muted">${group.records.length}건</span>
        </div>
        ${collapsed ? `<details><summary>완료 기록 보기</summary>${group.records.map((row) => renderUnsafeRecordCard(row)).join("")}</details>` : group.records.map((row) => renderUnsafeRecordCard(row)).join("")}
      </section>`;
    }

    function renderMaterialManager() {
      const filtered = ISSUE_MATERIAL_RULES.filterRecords(state.missingMaterials, state.materialFilters);
      const sorted = ISSUE_MATERIAL_RULES.sortRecords(filtered, state.materialFilters.sort, ISSUE_MATERIAL_RULES.MATERIAL_STATUSES);
      const groups = ISSUE_MATERIAL_RULES.groupMaterialsByShip(sorted);
      const statuses = ISSUE_MATERIAL_RULES.MATERIAL_STATUSES;
      const received = state.missingMaterials.filter((row) => row.status === statuses[0]).length;
      const checking = state.missingMaterials.filter((row) => row.status === statuses[1]).length;
      const done = state.missingMaterials.filter((row) => row.status === statuses[2]).length;
      return `<section class="admin-board material-board">
        <div class="admin-board-top">
          <div>
            <h2>호선자재 누락 관리</h2>
            <p>${state.missingMaterials.length}건 등록 · ${checking}건 확인중 · ${done}건 완료</p>
          </div>
          <div class="admin-board-actions">
            <button class="btn-light" data-export-records="materials" type="button">내보내기</button>
            <button class="btn" data-view="materials" type="button">+ 신규 등록</button>
          </div>
        </div>
        <div class="material-kpi-grid">
          ${materialKpi("전체", state.missingMaterials.length, "건", "#0b1d3a", "")}
          ${materialKpi("접수", received, "건", "#dc2626", statuses[0])}
          ${materialKpi("확인중", checking, "건", "#d97706", statuses[1])}
          ${materialKpi("완료", done, "건", "#4F7A5C", statuses[2])}
        </div>
        <div class="material-layout">
          <aside class="material-filter-panel">
            <div class="section-title">호선별 필터</div>
            <button class="material-ship-filter ${state.materialFilters.shipNo ? "" : "active"}" data-record-filter="materials:shipNo" value="" type="button">
              <span>전체 호선</span><strong>${state.missingMaterials.length}</strong>
            </button>
            ${groups.map((group) => `<button class="material-ship-filter ${state.materialFilters.shipNo === group.shipNo ? "active" : ""}" data-record-filter="materials:shipNo" value="${esc(group.shipNo)}" type="button">
              <span><strong>${esc(group.shipNo)}</strong><em>${esc(shipStageForNo(group.shipNo))} · ${materialProgressForGroup(group)}%</em></span><strong>${group.records.length}</strong>
            </button>`).join("")}
          </aside>
          <section class="material-table-card">
            <div class="material-table-head">
              <div><strong>자재 누락 목록</strong><span>${filtered.length}건 표시 중</span></div>
              <div class="material-table-actions">
                <button class="btn-light" data-record-filter="materials:sort" value="${state.materialFilters.sort === "latest" ? "status" : "latest"}" type="button">정렬: ${state.materialFilters.sort === "latest" ? "상태순" : "최신순"}</button>
                <button class="btn-light" data-action="bulk-material-status" type="button">상태 일괄 변경</button>
              </div>
            </div>
            <div class="material-table">
              <div class="material-row material-row-head">
                <span></span><span>호선</span><span>자재명</span><span>수량</span><span>등록자</span><span>등록 시각</span><span>상태</span><span>액션</span>
              </div>
              ${sorted.length ? sorted.map(renderMaterialTableRow).join("") : `<div class="empty">표시할 자재 누락 기록이 없습니다.</div>`}
            </div>
          </section>
        </div>
      </section>`;
    }

    function materialKpi(label, value, unit, color, status) {
      const active = (state.materialFilters.status || "") === status;
      return `<button class="material-kpi ${active ? "active" : ""}" style="--kpi:${color}" data-record-filter="materials:status" value="${esc(status)}" type="button" aria-pressed="${active ? "true" : "false"}">
        <span>${esc(label)}</span>
        <strong>${esc(value)}</strong><em>${esc(unit)}</em>
      </button>`;
    }

    function materialProgressForGroup(group) {
      const doneStatus = ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2];
      return group.records.length ? Math.round(group.records.filter((row) => row.status === doneStatus).length / group.records.length * 100) : 0;
    }

    function renderMaterialTableRow(row) {
      const token = `materials:${row.id}`;
      return `<div class="material-row">
        <span><input type="checkbox" aria-label="자재 기록 선택" /></span>
        <span><strong>${esc(row.shipNo || "-")}</strong><em>${esc(shipStageForNo(row.shipNo))}</em></span>
        <span><strong>${esc(row.materialName || "-")}</strong><em>${esc(row.content || "내용 없음")}</em></span>
        <span><strong>${esc(materialQuantity(row))}</strong></span>
        <span>${esc(row.workerNameSnapshot || "-")}</span>
        <span>${esc(shortRecordTime(row.createdAt))}</span>
        <span><select class="select" data-record-status="${esc(token)}">${ISSUE_MATERIAL_RULES.MATERIAL_STATUSES.map((status) => `<option value="${esc(status)}" ${row.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}</select></span>
        <span class="material-row-actions">
          <textarea data-record-memo="${esc(token)}" hidden>${esc(row.adminMemo || "")}</textarea>
          <button class="btn-light" data-save-record="${esc(token)}" type="button">저장</button>
          <button class="btn" data-material-record-detail="${esc(row.id)}" type="button">상세 →</button>
        </span>
      </div>`;
    }

    function renderMaterialGroup(group) {
      const doneStatus = ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2];
      const openRows = group.records.filter((row) => row.status !== doneStatus);
      const doneRows = group.records.filter((row) => row.status === doneStatus);
      return `<section class="record-group">
        <div class="record-group-head">
          <strong>${esc(group.shipNo)}</strong>
          <span class="small muted">${group.records.length}건</span>
        </div>
        ${openRows.map((row) => renderMaterialRecordCard(row)).join("")}
        ${doneRows.length ? `<details><summary>완료 기록 ${doneRows.length}건 보기</summary>${doneRows.map((row) => renderMaterialRecordCard(row)).join("")}</details>` : ""}
      </section>`;
    }

    function pledgeDashboardRows() {
      const todayValue = today();
      const todayInspections = state.inspections.filter((row) => row.date === todayValue);
      const byWorker = new Map();
      todayInspections.forEach((row) => {
        const name = row.worker || "미지정";
        if (!byWorker.has(name)) byWorker.set(name, row);
      });
      const workerRows = state.workers.map((worker) => {
        const row = byWorker.get(worker.name);
        return {
          name: worker.name,
          team: worker.team || "-",
          shipNo: row ? row.shipNo || "-" : "-",
          time: row ? row.time || "-" : "-",
          done: Boolean(row && String(row.safetyPledge || "").trim()),
          pledge: row ? row.safetyPledge || "" : "",
        };
      });
      todayInspections.forEach((row) => {
        const name = row.worker || "미지정";
        if (workerRows.some((worker) => worker.name === name)) return;
        workerRows.push({
          name,
          team: "-",
          shipNo: row.shipNo || "-",
          time: row.time || "-",
          done: Boolean(String(row.safetyPledge || "").trim()),
          pledge: row.safetyPledge || "",
        });
      });
      return workerRows;
    }

    function pledgeWeekStats() {
      return Array.from({ length: 7 }, (_, index) => addDays(today(), index - 6)).map((date) => {
        const rows = state.inspections.filter((row) => row.date === date);
        const total = Math.max(state.workers.length, rows.length);
        const done = rows.filter((row) => String(row.safetyPledge || "").trim()).length;
        const pct = total ? Math.round(done / total * 100) : 0;
        return { date, total, done, pct };
      });
    }

    function pledgeKpi(label, value, unit, note, tone = "") {
      return `<div class="pledge-kpi ${tone}">
        <span>${esc(label)}</span>
        <strong>${esc(value)}<em>${esc(unit)}</em></strong>
        <small>${esc(note)}</small>
      </div>`;
    }

    function pledgeRules() {
      const rules = loadJson("pledgeRules", DEFAULT_PLEDGE_RULES);
      return Array.isArray(rules) && rules.length ? rules : DEFAULT_PLEDGE_RULES;
    }

    function renderPledgeManager() {
      const rows = pledgeDashboardRows();
      const completed = rows.filter((row) => row.done).length;
      const pending = Math.max(rows.length - completed, 0);
      const rate = rows.length ? Math.round(completed / rows.length * 100) : 0;
      const week = pledgeWeekStats();
      const weekTotal = week.reduce((sum, row) => sum + row.done, 0);
      const rules = pledgeRules();
      const editing = Boolean(state.pledgeTemplateEditing);
      return `<section class="admin-board pledge-board">
        <div class="admin-board-top">
          <div>
            <h2>안전 서약 관리</h2>
            <p>${today().replace(/-/g, ".")} · 오늘 서약 현황 실시간</p>
          </div>
          <div class="admin-board-actions">
            <button class="btn-light" data-export-records="pledge" type="button">내보내기</button>
            <button class="btn" data-action="edit-pledge-template" type="button">서약 양식 편집</button>
          </div>
        </div>
        <div class="pledge-kpi-grid">
          ${pledgeKpi("오늘 서약 완료", completed, "명", `전체 ${rows.length}명 중`, "done")}
          ${pledgeKpi("미완료", pending, "명", "알림 발송 가능", "warn")}
          ${pledgeKpi("완료율", rate, "%", "어제 대비 추적", "rate")}
          ${pledgeKpi("이번 주 누적", weekTotal, "건", "일 평균 " + (Math.round(weekTotal / 7 * 10) / 10) + "건", "total")}
        </div>
        <div class="pledge-layout">
          <section class="pledge-table-card">
            <div class="material-table-head">
              <div><strong>오늘 서약 현황</strong><span>${today().replace(/-/g, ".")} · ${rows.length}명</span></div>
              <button class="btn" disabled title="카카오톡 API 연결 후 활성화 예정" type="button">미완료자 알림 발송</button>
            </div>
            <div class="pledge-table">
              <div class="pledge-row pledge-row-head"><span>작업자</span><span>팀</span><span>호선</span><span>서약 시각</span><span>상태</span></div>
              ${rows.length ? rows.map((row) => `<div class="pledge-row">
                <span><strong>${esc(row.name)}</strong></span>
                <span>${esc(row.team)}</span>
                <span><strong>${esc(row.shipNo)}</strong></span>
                <span>${esc(row.time)}</span>
                <span>${statusChip(row.done ? "완료" : "미완료")}</span>
              </div>`).join("") : `<div class="empty">오늘 표시할 작업자 정보가 없습니다.</div>`}
            </div>
          </section>
          <aside class="pledge-side">
            <section class="pledge-preview-card">
              <div class="material-table-head">
                <div><strong>서약 양식 미리보기</strong></div>
                ${editing ? `<div class="material-table-actions"><button class="btn-light" data-action="cancel-pledge-template" type="button">취소</button><button class="btn" data-action="save-pledge-template" type="button">저장</button></div>` : `<button class="btn-light" data-action="edit-pledge-template" type="button">편집</button>`}
              </div>
              ${editing ? `<div class="pledge-editor">
                <label for="pledgeRulesInput">서약 수칙</label>
                <textarea class="textarea" id="pledgeRulesInput">${esc(rules.join("\n"))}</textarea>
                <p>각 줄이 서약서의 한 항목으로 저장됩니다.</p>
              </div>` : `<div class="pledge-paper">
                <h3>작업 전 안전 서약서</h3>
                <p>나 ________ (이)은 오늘 작업에 앞서 다음 안전 수칙을 준수할 것을 서약합니다.</p>
                <ol>
                  ${rules.map((rule) => `<li>${esc(rule)}</li>`).join("")}
                </ol>
                <div class="pledge-sign"><span>서명: ____________</span><span>날짜: ${esc(today())}</span></div>
              </div>`}
            </section>
            <section class="pledge-weekly-card">
              <strong>주간 서약 완료율</strong>
              <div class="pledge-bars">
                ${week.map((row) => `<div class="pledge-bar-row">
                  <span>${esc(row.date.slice(5).replace("-", "/"))}</span>
                  <i><b style="width:${Math.min(row.pct, 100)}%"></b></i>
                  <strong>${row.pct}%</strong>
                </div>`).join("")}
              </div>
            </section>
          </aside>
        </div>
      </section>`;
    }

    function completionIcon(name) {
      const icons = {
        check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7"></path></svg>`,
        warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 20H2z"></path><path d="M12 9v5"></path><path d="M12 17h.01"></path></svg>`,
        box: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z"></path><path d="m4 8.5 8 4.5 8-4.5"></path><path d="M12 13v7"></path></svg>`,
        shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-2.8 8.4-7 10-4.2-1.6-7-5.5-7-10V6z"></path></svg>`,
      };
      return icons[name] || icons.check;
    }

    function renderCompletionScreen({ type = "", icon = "check", title, message, stats = [], actions = [] }) {
      return `<section class="mobile-complete-screen ${esc(type)}">
        <div class="mobile-complete-visual">${completionIcon(icon)}</div>
        <h1>${esc(title)}</h1>
        <p>${esc(message)}</p>
        <div class="mobile-complete-stats">
          ${stats.map((item) => `<div>
            <strong class="${esc(item.tone || "")}">${esc(item.value)}</strong>
            <span>${esc(item.label)}</span>
          </div>`).join("")}
        </div>
        <div class="mobile-complete-actions ${actions.length === 1 ? "single" : ""}">
          ${actions.map((action) => `<button class="${action.primary ? "btn mobile-complete-primary" : "btn-light"}" ${action.view ? `data-view="${esc(action.view)}"` : ""} ${action.action ? `data-action="${esc(action.action)}"` : ""} type="button">${esc(action.label)}</button>`).join("")}
        </div>
      </section>`;
    }

    function renderPledgeComplete() {
      const row = state.inspections.find((item) => item.id === state.lastInspectionId) || state.inspections[0];
      if (!row) return `${pageHead("안전 서약 완료", "제출된 서약 정보가 없습니다.")}<button class="btn" data-view="dashboard" type="button">홈으로</button>`;
      const itemCount = state.inspectionItems.filter((item) => item.inspectionId === row.id).length;
      const checkedCount = state.inspectionItems.filter((item) => item.inspectionId === row.id && item.checked).length;
      const warnings = Number(row.warnings || 0);
      const pending = Math.max(Number(itemCount || 0) - checkedCount, 0);
      return renderCompletionScreen({
        type: "inspection",
        icon: "check",
        title: "점검이 제출되었습니다",
        message: `${row.shipNo || "-"} · ${row.categoryLabel || categoryById(row.categoryId)?.label || "작업"} 점검이 관리자에게 자동 보고됩니다.`,
        stats: [
          { value: checkedCount || 0, label: "완료", tone: "green" },
          { value: warnings, label: "NG", tone: warnings ? "pink" : "green" },
          { value: pending, label: "대기" },
        ],
        actions: [
          { label: "다른 점검", view: "check" },
          { label: "홈으로", view: "dashboard", primary: true },
        ],
      });
    }

    function analyticsPercent(part, total) {
      return total ? Math.round(part / total * 100) : 0;
    }

    function analyticsKpi(label, value, note, tone = "") {
      return `<div class="analytics-kpi ${tone}">
        <span>${esc(label)}</span>
        <strong>${esc(value)}</strong>
        <small>${esc(note)}</small>
      </div>`;
    }

    function monthKeyForDate(dateValue = today()) {
      return dateOnly(dateValue).slice(0, 7);
    }

    function monthKeyOffset(monthKey, offset) {
      const [year, month] = String(monthKey || monthKeyForDate()).split("-").map(Number);
      const date = new Date(year, (month || 1) - 1 + offset, 1);
      return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
    }

    function currentMonthRange(monthKey = state.selectedMonthlyWorkerMonth || monthKeyForDate()) {
      const currentMonth = monthKeyForDate();
      const safeMonth = String(monthKey || currentMonth) > currentMonth ? currentMonth : String(monthKey || currentMonth);
      const [year, month] = safeMonth.split("-").map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      const dates = Array.from({ length: lastDay }, (_, index) => `${safeMonth}-${pad2(index + 1)}`);
      return {
        monthKey: safeMonth,
        year,
        month,
        start: dates[0],
        end: dates[dates.length - 1],
        dates,
        daysInMonth: lastDay,
        isCurrentMonth: safeMonth === currentMonth,
        canGoNext: monthKeyOffset(safeMonth, 1) <= currentMonth,
      };
    }

    function monthlyWorkerRestDayState() {
      const source = state.monthlyWorkerRestDays && typeof state.monthlyWorkerRestDays === "object"
        ? state.monthlyWorkerRestDays
        : {};
      return {
        useKoreanPublicHolidays: source.useKoreanPublicHolidays !== false,
        holidayData: source.holidayData && typeof source.holidayData === "object" ? source.holidayData : {},
        customRestDays: Array.isArray(source.customRestDays) ? source.customRestDays.filter(Boolean) : [],
      };
    }

    function saveMonthlyWorkerRestDays(value = state.monthlyWorkerRestDays) {
      state.monthlyWorkerRestDays = {
        useKoreanPublicHolidays: value?.useKoreanPublicHolidays !== false,
        holidayData: value?.holidayData && typeof value.holidayData === "object" ? value.holidayData : {},
        customRestDays: Array.isArray(value?.customRestDays) ? [...new Set(value.customRestDays.filter(Boolean))].sort() : [],
      };
      saveJson("monthlyWorkerRestDays", state.monthlyWorkerRestDays);
    }

    function selectedMonthlyWorkerMonth() {
      const currentMonth = monthKeyForDate();
      if (!state.selectedMonthlyWorkerMonth || state.selectedMonthlyWorkerMonth > currentMonth) {
        state.selectedMonthlyWorkerMonth = currentMonth;
      }
      return state.selectedMonthlyWorkerMonth;
    }

    function koreanPublicHolidayInfo(date) {
      const restState = monthlyWorkerRestDayState();
      if (!restState.useKoreanPublicHolidays) return null;
      const monthKey = monthKeyForDate(date);
      const monthData = restState.holidayData?.[monthKey];
      const [year, month] = monthKey.split("-").map(Number);
      const previousMonthEnd = localDate(new Date(year, month - 1, 0));
      if (monthData?.updatedAt && dateOnly(monthData.updatedAt) <= previousMonthEnd && Array.isArray(monthData.days)) {
        const match = monthData.days.find((day) => day.date === date);
        if (match) return { date, name: match.name || "공휴일", type: match.type || "공휴일", source: monthData.source || "holidayData" };
      }
      const fallback = {
        "03-01": "3·1절",
        "07-17": "제헌절",
        "08-15": "광복절",
        "10-03": "개천절",
        "10-09": "한글날",
      };
      const name = fallback[String(date).slice(5, 10)];
      return name ? { date, name, type: "국경일", source: "fallback" } : null;
    }

    function isMonthlyRestDay(date) {
      const restState = monthlyWorkerRestDayState();
      if (restState.customRestDays.includes(date)) return { date, name: "현장 추가 휴무", type: "현장 휴무", source: "custom" };
      return koreanPublicHolidayInfo(date);
    }

    function monthlyInspectionDate(row) {
      if (row?.date) return dateOnly(row.date);
      const createdAt = row?.createdAt ? new Date(row.createdAt) : null;
      return createdAt && !Number.isNaN(createdAt.getTime()) ? localDate(createdAt) : "";
    }

    function monthlyWorkerRows(range = currentMonthRange()) {
      const byName = new Map();
      state.workers.forEach((worker) => {
        const name = String(worker.name || "").trim();
        if (!name) return;
        byName.set(normalizedWorkerName(name), { name, team: worker.team || "-", source: "workers" });
      });
      state.inspections.forEach((row) => {
        const actualDate = monthlyInspectionDate(row);
        if (!actualDate || actualDate < range.start || actualDate > range.end) return;
        const name = String(row.worker || "").trim();
        if (!name) return;
        const key = normalizedWorkerName(name);
        if (!byName.has(key)) byName.set(key, { name, team: "기록 기반", source: "history" });
      });
      return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }

    function workerDayInspectionStatus(workerName, date) {
      if (isMonthlyRestDay(date)) return "rest";
      if (date > today()) return "excluded";
      const key = normalizedWorkerName(workerName);
      const rows = state.inspections.filter((row) => normalizedWorkerName(row.worker || "") === key && monthlyInspectionDate(row) === date);
      if (rows.some((row) => row.status === "완료" && Number(row.completion || 0) >= 100)) return "done";
      if (rows.length) return "partial";
      return "missing";
    }

    function monthlyWorkerInspectionStats() {
      const range = currentMonthRange(selectedMonthlyWorkerMonth());
      const workers = monthlyWorkerRows(range).map((worker) => {
        const counts = { done: 0, partial: 0, missing: 0, rest: 0, excluded: 0, target: 0 };
        const dayStatuses = range.dates.map((date) => {
          const status = workerDayInspectionStatus(worker.name, date);
          counts[status] += 1;
          if (status !== "rest" && status !== "excluded") counts.target += 1;
          return { date, day: Number(date.slice(8, 10)), status };
        });
        const rate = counts.target ? Math.round(counts.done / counts.target * 100) : 0;
        return { ...worker, counts, dayStatuses, rate };
      });
      const totals = workers.reduce((sum, worker) => {
        sum.done += worker.counts.done;
        sum.partial += worker.counts.partial;
        sum.missing += worker.counts.missing;
        sum.rest += worker.counts.rest;
        sum.target += worker.counts.target;
        return sum;
      }, { done: 0, partial: 0, missing: 0, rest: 0, target: 0 });
      const todayValue = today();
      const todayOrMonthEnd = range.isCurrentMonth ? todayValue : range.end;
      const dueLabel = range.isCurrentMonth ? "오늘 미점검" : "월말 미점검";
      const dueMissing = workers.filter((worker) => workerDayInspectionStatus(worker.name, todayOrMonthEnd) === "missing").length;
      const attentionWorkers = workers
        .filter((worker) => worker.counts.missing >= 3)
        .sort((a, b) => b.counts.missing - a.counts.missing || a.rate - b.rate)
        .slice(0, 5);
      return {
        range,
        workers,
        totals,
        rate: totals.target ? Math.round(totals.done / totals.target * 100) : 0,
        dueLabel,
        dueMissing,
        attentionWorkers,
      };
    }

    function monthlyStatusLabel(status) {
      return {
        done: "완료",
        partial: "미완료",
        missing: "누락",
        rest: "휴무",
        excluded: "제외",
      }[status] || status;
    }

    function monthlyExportStatus(status) {
      if (status === "done") return "완료";
      if (status === "partial" || status === "missing") return "미완료";
      if (status === "rest") return "휴무";
      return "";
    }

    function renderWorkerHeatmapCell(status, day = "") {
      return `<span class="monthly-worker-cell ${esc(status)}" title="${esc(day ? `${day}일 ${monthlyStatusLabel(status)}` : monthlyStatusLabel(status))}" aria-label="${esc(monthlyStatusLabel(status))}">${esc(day)}</span>`;
    }

    function renderMonthlyRestDaySettings() {
      const stats = monthlyWorkerInspectionStats();
      const restState = monthlyWorkerRestDayState();
      const holidayRows = stats.range.dates.map((date) => koreanPublicHolidayInfo(date)).filter(Boolean);
      const customRows = restState.customRestDays.filter((date) => monthKeyForDate(date) === stats.range.monthKey);
      return `<div class="monthly-rest-panel">
        <div class="monthly-rest-options">
          <label class="monthly-rest-toggle">
            <input type="checkbox" data-monthly-public-holiday-mode ${restState.useKoreanPublicHolidays ? "checked" : ""} />
            <span>대한민국 국경일/공휴일/대체공휴일 자동 휴무 적용</span>
          </label>
          <div class="monthly-rest-add">
            <input class="input" type="date" data-monthly-custom-rest-date min="${esc(stats.range.start)}" max="${esc(stats.range.end)}" value="${esc(stats.range.start)}" />
            <button class="btn-light" data-action="add-monthly-rest-day" type="button">현장 휴무 추가</button>
          </div>
        </div>
        <div class="monthly-rest-lists">
          <div>
            <strong>자동 휴무</strong>
            ${holidayRows.length ? holidayRows.map((day) => `<span class="monthly-rest-chip">${esc(day.date.slice(5))} · ${esc(day.name)}</span>`).join("") : `<em>선택 월의 자동 휴무가 없습니다.</em>`}
          </div>
          <div>
            <strong>현장 추가 휴무</strong>
            ${customRows.length ? customRows.map((date) => `<span class="monthly-rest-chip custom">${esc(date.slice(5))}<button data-delete-monthly-rest-day="${esc(date)}" type="button" aria-label="${esc(date)} 휴무 삭제">×</button></span>`).join("") : `<em>추가된 현장 휴무가 없습니다.</em>`}
          </div>
        </div>
      </div>`;
    }

    function renderMonthlyWorkerAnalytics() {
      const stats = monthlyWorkerInspectionStats();
      const monthText = `${stats.range.year}년 ${stats.range.month}월`;
      const restOpen = state.monthlyRestDayPanelOpen;
      if (!stats.workers.length) {
        return `<section class="analytics-panel monthly-worker-analytics">
          <div class="monthly-worker-head">
            <div><strong>월간 작업자 점검 현황</strong><span>${monthText} · 작업자별 일일 점검 이행 현황</span></div>
            <div class="monthly-worker-toolbar">
              <button class="btn-light" data-monthly-worker-month="prev" type="button">이전 달</button>
              <button class="btn-light" data-monthly-worker-month="current" type="button">이번 달</button>
              <button class="btn-light" data-monthly-worker-month="next" ${stats.range.canGoNext ? "" : "disabled"} type="button">다음 달</button>
              <button class="btn-light" data-action="toggle-monthly-rest-settings" type="button">휴무 설정</button>
              <button class="btn" data-export-records="monthly-worker-analytics" type="button">월간 내보내기</button>
            </div>
          </div>
          <div class="empty">등록된 작업자가 없습니다. 관리 메뉴에서 작업자를 먼저 추가하세요.</div>
          ${restOpen ? renderMonthlyRestDaySettings() : ""}
        </section>`;
      }
      return `<section class="analytics-panel monthly-worker-analytics">
        <div class="monthly-worker-head">
          <div><strong>월간 작업자 점검 현황</strong><span>${monthText} · 작업자별 일일 점검 이행 현황</span></div>
          <div class="monthly-worker-toolbar">
            <button class="btn-light" data-monthly-worker-month="prev" type="button">이전 달</button>
            <button class="btn-light" data-monthly-worker-month="current" type="button">이번 달</button>
            <button class="btn-light" data-monthly-worker-month="next" ${stats.range.canGoNext ? "" : "disabled"} type="button">다음 달</button>
            <button class="btn-light" data-action="toggle-monthly-rest-settings" type="button">${restOpen ? "휴무 설정 닫기" : "휴무 설정"}</button>
            <button class="btn" data-export-records="monthly-worker-analytics" type="button">월간 내보내기</button>
          </div>
        </div>
        <div class="monthly-worker-kpis">
          ${analyticsKpi("월간 점검률", `${stats.rate}%`, `${stats.totals.done}/${stats.totals.target} 대상일 완료`, "done")}
          ${analyticsKpi(stats.dueLabel, `${stats.dueMissing}명`, `${stats.range.isCurrentMonth ? "오늘" : "월말"} 기준 누락`, "danger")}
          ${analyticsKpi("3일 이상 누락", `${stats.attentionWorkers.length}명`, "월간 누락일 3일 이상", "warn")}
          ${analyticsKpi("대상 작업자", `${stats.workers.length}명`, `휴무 ${stats.totals.rest}칸 제외`, "ship")}
        </div>
        <div class="monthly-worker-layout">
          <div class="monthly-worker-heatmap-wrap">
            <div class="monthly-worker-heatmap" style="--monthly-days:${stats.range.daysInMonth}">
              <div class="monthly-worker-row monthly-worker-row-head">
                <div class="monthly-worker-name">작업자</div>
                <div class="monthly-worker-days">${stats.range.dates.map((date) => `<span>${Number(date.slice(8, 10))}</span>`).join("")}</div>
                <div class="monthly-worker-rate">점검률</div>
              </div>
              ${stats.workers.map((worker) => `<div class="monthly-worker-row">
                <div class="monthly-worker-name"><strong>${esc(worker.name)}</strong><em>${esc(worker.team || "-")}</em></div>
                <div class="monthly-worker-days">${worker.dayStatuses.map((day) => renderWorkerHeatmapCell(day.status, day.day)).join("")}</div>
                <div class="monthly-worker-rate"><strong>${worker.rate}%</strong><span>${worker.counts.done}/${worker.counts.target}</span></div>
              </div>`).join("")}
            </div>
          </div>
          <aside class="monthly-worker-attention">
            <strong>주의 필요 작업자</strong>
            ${stats.attentionWorkers.length ? stats.attentionWorkers.map((worker) => {
              const recentMissing = worker.dayStatuses.filter((day) => day.status === "missing").slice(-3).map((day) => `${day.day}일`).join(", ");
              return `<article>
                <div><strong>${esc(worker.name)}</strong><span>${esc(worker.team || "-")}</span></div>
                <b>누락 ${worker.counts.missing}일</b>
                <em>최근 누락: ${esc(recentMissing || "-")}</em>
              </article>`;
            }).join("") : `<div class="empty">3일 이상 누락 작업자가 없습니다.</div>`}
            <div class="monthly-worker-legend">
              ${["done", "partial", "missing", "rest", "excluded"].map((status) => `<span>${renderWorkerHeatmapCell(status)} ${monthlyStatusLabel(status)}</span>`).join("")}
            </div>
          </aside>
        </div>
        ${restOpen ? renderMonthlyRestDaySettings() : ""}
      </section>`;
    }

    function renderAnalyticsDashboard() {
      const now = serverNow();
      const weekStart = new Date(now);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - 6);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayValue = localDate(yesterday);
      const dateInRange = (value) => {
        if (!value) return false;
        const date = new Date(String(value).includes("T") ? value : `${value}T00:00:00`);
        return !Number.isNaN(date.getTime()) && date >= weekStart && date <= now;
      };
      const deltaText = (current, previous) => {
        const diff = Number(current || 0) - Number(previous || 0);
        if (diff > 0) return `어제 대비 +${diff}건`;
        if (diff < 0) return `어제 대비 ${diff}건`;
        return "어제와 동일";
      };
      const todayRows = state.inspections.filter((row) => row.date === today());
      const todayDone = todayRows.filter((row) => row.status === "완료").length;
      const yesterdayDone = state.inspections.filter((row) => row.date === yesterdayValue && row.status === "완료").length;
      const unsafeOpen = state.unsafeIssues.filter((row) => row.status !== ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2]).length;
      const unsafeReceived = state.unsafeIssues.filter((row) => row.status === ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0]).length;
      const unsafeProcessing = state.unsafeIssues.filter((row) => row.status === ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[1]).length;
      const materialOpen = state.missingMaterials.filter((row) => row.status !== ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2]).length;
      const materialReceived = state.missingMaterials.filter((row) => row.status === ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[0]).length;
      const materialChecking = state.missingMaterials.filter((row) => row.status === ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[1]).length;
      const processRows = SHIP_WORKFLOW_STAGES.map((stage) => {
        const info = shipStageInfo(stage);
        const count = state.ships.filter((ship) => effectiveShipStage(ship).stage === stage).length;
        return { info, count };
      });
      const processTotal = Math.max(state.ships.length, 1);
      const weekInspections = state.inspections.filter((row) => dateInRange(row.date || row.createdAt));
      const weekUnsafe = state.unsafeIssues.filter((row) => dateInRange(row.createdAt));
      const weekMaterials = state.missingMaterials.filter((row) => dateInRange(row.createdAt));
      const riskNg = weekInspections.filter((row) => Number(row.warnings || 0) > 0).length
        + weekUnsafe.filter((row) => row.status !== ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2]).length;
      const riskWarn = weekInspections.filter((row) => row.status !== "완료" && !Number(row.warnings || 0)).length
        + weekMaterials.filter((row) => row.status !== ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2]).length;
      const riskOk = weekInspections.filter((row) => row.status === "완료" && !Number(row.warnings || 0)).length;
      const riskTotal = Math.max(riskNg + riskWarn + riskOk, 1);
      const activeProcessCount = processRows.filter(({ count }) => count > 0).length;
      const weeklyActivityCount = weekInspections.length + weekUnsafe.length + weekMaterials.length;
      const recent = [
        ...state.unsafeIssues.map((row) => ({ id: row.id, kind: "unsafe", type: "불안전요소 등록", shipNo: row.shipNo, content: row.content, worker: row.workerNameSnapshot, status: row.status, time: row.createdAt })),
        ...state.missingMaterials.map((row) => ({ id: row.id, kind: "materials", type: "자재누락", shipNo: row.shipNo, content: row.materialName || row.content, worker: row.workerNameSnapshot, status: row.status, time: row.createdAt })),
      ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 5);
      return `<section class="admin-board analytics-board">
        <div class="admin-board-top">
          <div>
            <h2>안전 관리 대시보드</h2>
            <p>${formatKoreanDate(serverNow())} · ${esc(state.syncText || "로컬 저장")}</p>
          </div>
          <div class="admin-board-actions">
            <button class="btn-light" data-export-records="analytics" type="button">데이터 내보내기</button>
            <button class="btn" data-view="check" type="button">새 점검</button>
          </div>
        </div>
        <div class="analytics-kpi-grid">
          ${analyticsKpi("오늘 점검 완료", todayDone, deltaText(todayDone, yesterdayDone), "done")}
          ${analyticsKpi("불안전요소 · 미확인", unsafeOpen, unsafeOpen ? `${unsafeReceived}건 접수 · ${unsafeProcessing}건 조치중` : "미확인 없음", "danger")}
          ${analyticsKpi("자재 누락", materialOpen, materialOpen ? `${materialReceived}건 접수 · ${materialChecking}건 확인중` : "미처리 없음", "warn")}
          ${analyticsKpi("호선 점검중", state.ships.length, `${activeProcessCount}/${SHIP_WORKFLOW_STAGES.length}단계 분포`, "ship")}
        </div>
        ${renderMonthlyWorkerAnalytics()}
        <div class="analytics-grid">
          <section class="analytics-panel">
            <div class="material-table-head">
              <div><strong>호선 공정 현황</strong><span>전체 ${state.ships.length}척 · ${SHIP_WORKFLOW_STAGES.length}단계 진행률</span></div>
              <button class="btn-light" data-view="ships" type="button">자세히 →</button>
            </div>
            <div class="analytics-process-list">
              ${processRows.map(({ info, count }) => `<div class="analytics-process-row" style="--stage:${info.color}">
                <span><i></i><strong>${esc(info.label)}</strong><em>${esc(info.stage === "mounting" ? "Mounting" : info.label)}</em></span>
                <b>${count}척</b>
                <div class="analytics-progress" role="progressbar" aria-label="${esc(info.label)} 공정 비율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${analyticsPercent(count, processTotal)}"><i style="width:${analyticsPercent(count, processTotal)}%"></i></div>
                <strong>${analyticsPercent(count, processTotal)}%</strong>
              </div>`).join("")}
            </div>
          </section>
          <section class="analytics-panel">
            <div class="material-table-head">
              <div><strong>위험도 분포</strong><span>최근 7일 점검 결과</span></div>
            </div>
            <div class="risk-bars">
              <div class="risk-row danger"><span>위험 · NG</span><i><b style="width:${analyticsPercent(riskNg, riskTotal)}%"></b></i><strong>${riskNg}건 · ${analyticsPercent(riskNg, riskTotal)}%</strong></div>
              <div class="risk-row warn"><span>주의 · Warn</span><i><b style="width:${analyticsPercent(riskWarn, riskTotal)}%"></b></i><strong>${riskWarn}건 · ${analyticsPercent(riskWarn, riskTotal)}%</strong></div>
              <div class="risk-row ok"><span>정상 · OK</span><i><b style="width:${analyticsPercent(riskOk, riskTotal)}%"></b></i><strong>${riskOk}건 · ${analyticsPercent(riskOk, riskTotal)}%</strong></div>
            </div>
            <div class="risk-summary">
              <div><span>주간 평균</span><strong>${(Math.round(weeklyActivityCount / 7 * 10) / 10).toFixed(1)}건/일</strong></div>
              <div><span>NG 비율</span><strong>${analyticsPercent(riskNg, riskTotal)}%</strong></div>
              <div><span>완료율</span><strong>${analyticsPercent(riskOk, riskTotal)}%</strong></div>
            </div>
          </section>
        </div>
        <section class="analytics-recent-card">
          <div class="material-table-head">
            <div><strong>최근 활동 · 불안전요소 등록 & 자재누락</strong><span>행을 선택하면 상세 화면으로 이동합니다</span></div>
            <div class="material-table-actions"><button class="btn-light" data-action="open-analytics-filters" type="button">필터</button><button class="btn" data-action="open-analytics-detail" type="button">상세 보기</button></div>
          </div>
          <div class="analytics-table">
            <div class="analytics-row analytics-row-head"><span>시각</span><span>호선</span><span>내용</span><span>작업자</span><span>상태</span></div>
            ${recent.length ? recent.map((row) => `<div class="analytics-row" data-analytics-record-kind="${esc(row.kind)}" data-analytics-record-id="${esc(row.id)}" role="button" tabindex="0" aria-label="${esc(row.shipNo || "-")} ${esc(row.type)} 상세 보기">
              <span>${esc(relativeRecordTime(row.time))}</span>
              <span><strong>${esc(row.shipNo || "-")}</strong></span>
              <span><strong>${esc(shortUnsafeTitle(row.content))}</strong><em>${esc(row.type)}</em></span>
              <span>${esc(row.worker || "-")}</span>
              <span>${statusChip(row.status)}</span>
            </div>`).join("") : `<div class="empty">최근 활동이 없습니다.</div>`}
          </div>
        </section>
      </section>`;
    }

    function renderRecordFilters(kind) {
      const filters = kind === "unsafe" ? state.unsafeFilters : state.materialFilters;
      const statuses = kind === "unsafe" ? ISSUE_MATERIAL_RULES.UNSAFE_STATUSES : ISSUE_MATERIAL_RULES.MATERIAL_STATUSES;
      return `<div class="record-filters">
        <select class="select" data-record-filter="${kind}:shipNo">
          <option value="">전체 호선</option>
          ${selectableShips().map((ship) => `<option value="${esc(ship.no)}" ${filters.shipNo === ship.no ? "selected" : ""}>${esc(ship.no)}</option>`).join("")}
        </select>
        <select class="select" data-record-filter="${kind}:status">
          <option value="">전체 상태</option>
          ${statuses.map((status) => `<option value="${esc(status)}" ${filters.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}
        </select>
        <select class="select" data-record-filter="${kind}:workerId">
          <option value="">전체 등록자</option>
          ${state.workers.map((worker) => `<option value="${esc(worker.id)}" ${filters.workerId === worker.id ? "selected" : ""}>${esc(worker.name)}</option>`).join("")}
        </select>
        ${kind === "materials" ? `<input class="input" data-record-filter="materials:materialName" value="${esc(filters.materialName)}" placeholder="자재명 필터" />` : ""}
        <select class="select" data-record-filter="${kind}:sort">
          <option value="status" ${filters.sort === "status" ? "selected" : ""}>상태 우선순</option>
          <option value="latest" ${filters.sort === "latest" ? "selected" : ""}>최신 등록순</option>
          <option value="shipNo" ${filters.sort === "shipNo" ? "selected" : ""}>호선 번호순</option>
          <option value="worker" ${filters.sort === "worker" ? "selected" : ""}>등록자순</option>
          ${kind === "materials" ? `<option value="materialName" ${filters.sort === "materialName" ? "selected" : ""}>자재명순</option>` : ""}
        </select>
      </div>`;
    }

    function renderAdminRecordControls(kind, row, statuses) {
      const disabled = state.adminMode || isRedesignPreviewPage() ? "" : "disabled";
      return `<div class="admin-record-controls">
        <select class="select" data-record-status="${kind}:${esc(row.id)}" ${disabled}>
          ${statuses.map((status) => `<option value="${esc(status)}" ${row.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}
        </select>
        <textarea class="textarea" data-record-memo="${kind}:${esc(row.id)}" placeholder="조치/메모" ${disabled}>${esc(row.adminMemo || "")}</textarea>
        <button class="btn-light" data-save-record="${kind}:${esc(row.id)}" ${disabled} type="button">저장</button>
        <button class="btn-danger" data-delete-record="${kind}:${esc(row.id)}" ${disabled} type="button">삭제</button>
      </div>`;
    }

    function renderRecordTimeline(row, options = {}) {
      const initialStatus = options.initialStatus || ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0];
      const timeline = ISSUE_MATERIAL_RULES.buildRecordTimeline(row, { initialStatus });
      const visible = options.compact ? timeline.slice(-3) : timeline;
      if (!visible.length) return "";
      return `<ol class="record-timeline ${options.compact ? "record-timeline-compact" : ""}">
        ${visible.map((entry) => `<li>
          <time class="record-timeline-time" datetime="${esc(entry.changedAt)}">${esc(formatDateTime(entry.changedAt))}</time>
          <div class="record-timeline-main">
            ${statusBadge(entry.status)}
            <span class="record-timeline-actor">${esc(entry.actor || "관리자")}</span>
          </div>
          ${entry.memo ? `<div class="record-timeline-note">${esc(entry.memo)}</div>` : ""}
        </li>`).join("")}
      </ol>`;
    }

    function unsafePhotosFor(id) {
      return state.issuePhotos
        .filter((item) => item.targetType === "unsafe_issue" && item.targetId === id)
        .sort((a, b) => (Number(a.sortOrder || 0) - Number(b.sortOrder || 0)) || String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
    }

    function renderUnsafeRecordCard(row) {
      const photo = unsafePhotosFor(row.id)[0];
      const photoUrl = photo ? publicPhotoUrl(photo) : "";
      const photoCount = unsafePhotosFor(row.id).length;
      const pendingPhotoCount = pendingPhotoUploadsFor(row.id).length;
      return `<article class="record-card clickable-record" data-unsafe-record-detail="${esc(row.id)}" tabindex="0" role="button" aria-label="${esc(row.shipNo)} 불안전요소 상세 보기">
        <div class="record-card-main">
          <div class="record-card-headline">
            ${photoUrl ? `<img class="record-thumb" src="${esc(photoUrl)}" alt="불안전요소 사진" />` : ""}
            <div>
              <strong>${esc(row.shipNo)}</strong>
              <span class="small muted">${esc(row.workerNameSnapshot)} · ${esc(formatDateTime(row.createdAt))}</span>
              ${photoCount > 1 ? `<span class="small muted">사진 ${photoCount}장</span>` : ""}
              ${pendingPhotoCount ? `<span class="small muted">사진 업로드 대기 ${pendingPhotoCount}장</span>` : ""}
            </div>
          </div>
          <p>${esc(row.content)}</p>
          ${row.adminMemo ? `<div class="small muted">메모: ${esc(row.adminMemo)}</div>` : ""}
          ${renderRecordTimeline(row, { compact: true, initialStatus: ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0] })}
        </div>
        ${renderAdminRecordControls("unsafe", row, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES)}
      </article>`;
    }

    function renderUnsafeDetail(row) {
      const photos = unsafePhotosFor(row.id);
      const pendingPhotos = pendingPhotoUploadsFor(row.id);
      const photoHtml = photos.length
        ? `<div class="unsafe-detail-photos">${photos.map((photo, index) => {
            const url = publicPhotoUrl(photo);
            return url ? `<figure><img class="unsafe-detail-photo" src="${esc(url)}" alt="불안전요소 사진 ${index + 1}" /><figcaption>사진 ${index + 1}</figcaption></figure>` : "";
          }).join("")}</div>`
        : pendingPhotos.length
          ? renderPendingPhotoUploadPanel(row.id, pendingPhotos)
          : `<div class="empty">첨부된 사진이 없습니다.</div>`;
      return `<section class="panel panel-pad unsafe-detail">
        <div class="detail-header">
          <button class="btn-light" data-action="back-unsafe-list" type="button">목록</button>
          ${badge("medium", row.status)}
        </div>
        <div class="section-title">불안전요소 상세 기록</div>
        <div class="detail-grid unsafe-detail-meta-grid">
          <div><span class="small muted">호선</span><strong>${esc(row.shipNo)}</strong></div>
          <div><span class="small muted">등록자</span><strong>${esc(row.workerNameSnapshot || "-")}</strong></div>
          <div class="unsafe-detail-date-meta"><span class="small muted">등록일시</span><strong>${esc(formatDateTime(row.createdAt))}</strong></div>
          <div class="unsafe-detail-photo-meta" aria-hidden="true"><span class="small muted">사진</span><strong>${photos.length ? `${photos.length}장` : "없음"}</strong></div>
        </div>
        <div class="field" style="margin-top:12px">
          <span class="field-label">내용</span>
          <div class="readonly-box">${esc(row.content)}</div>
        </div>
        <div class="field" style="margin-top:12px">
          <span class="field-label">첨부 사진</span>
          ${photoHtml}
          ${photos.length ? renderPendingPhotoUploadPanel(row.id, pendingPhotos) : ""}
        </div>
        ${row.adminMemo ? `<div class="field" style="margin-top:12px"><span class="field-label">현재 조치/메모</span><div class="readonly-box">${esc(row.adminMemo)}</div></div>` : ""}
        <div class="field" style="margin-top:12px">
          <span class="field-label">처리 이력</span>
          ${renderRecordTimeline(row, { initialStatus: ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0] })}
        </div>
        ${renderAdminRecordControls("unsafe", row, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES)}
      </section>`;
    }

    function renderMaterialRecordCard(row) {
      return `<article class="record-card">
        <div class="record-card-main">
          <strong>${esc(row.shipNo)} · ${esc(row.materialName)}</strong>
          <span class="small muted">${esc(row.workerNameSnapshot)} · ${esc(formatDateTime(row.createdAt))}</span>
          <p>${esc(row.content)}</p>
          ${row.adminMemo ? `<div class="small muted">메모: ${esc(row.adminMemo)}</div>` : ""}
          ${renderRecordTimeline(row, { compact: true, initialStatus: ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[0] })}
        </div>
        ${renderAdminRecordControls("materials", row, ISSUE_MATERIAL_RULES.MATERIAL_STATUSES)}
      </article>`;
    }

    function renderCompletionActions(type) {
      return `<div class="completion-actions">
        <button class="btn" data-action="${type === "unsafe" ? "new-unsafe" : "new-material"}" type="button">추가 등록</button>
        <button class="btn-light" data-action="${type === "unsafe" ? "view-unsafe-list" : "view-material-list"}" type="button">목록 보기</button>
        <button class="btn-light" data-view="dashboard" type="button">홈으로</button>
      </div>`;
    }

    function renderUnsafeComplete(row) {
      const photos = state.issuePhotos.filter((photo) => photo.targetType === "unsafe_issue" && photo.targetId === row.id);
      return renderCompletionScreen({
        type: "unsafe",
        icon: "warning",
        title: "신고가 접수되었습니다",
        message: `${row.shipNo || "-"} 불안전요소가 관리자에게 전달됐습니다. 처리 내역은 불안전요소 탭에서 확인하세요.`,
        stats: [
          { value: "위험", label: "위험도", tone: "pink" },
          { value: row.shipNo || "-", label: "호선" },
          { value: photos.length || 0, label: "사진" },
        ],
        actions: [
          { label: "목록 보기", action: "view-unsafe-list" },
          { label: "홈으로", view: "dashboard", primary: true },
        ],
      });
    }

    function renderMaterialComplete(row) {
      return renderCompletionScreen({
        type: "material",
        icon: "box",
        title: "자재 누락이 등록되었습니다",
        message: `${row.shipNo || "-"} · ${row.materialName || "-"} 누락 신청이 관리자에게 전달됐습니다.`,
        stats: [
          { value: row.shipNo || "-", label: "호선", tone: "orange" },
          { value: materialQuantity(row), label: "수량" },
          { value: row.status || "접수", label: "상태", tone: "green" },
        ],
        actions: [
          { label: "추가 등록", action: "new-material" },
          { label: "목록 보기", action: "view-material-list" },
          { label: "홈으로", view: "dashboard", primary: true },
        ],
      });
    }

    function renderSectionManager(cat, section) {
      const items = activeItems(cat.id).filter((row) => row.sectionId === section.id).sort(byOrder);
      const editingSection = state.editSectionId === section.id;
      const addOpen = state.openAddItemSectionIds.includes(section.id);
      return `<section class="section-card">
        <div class="section-card-head">
          ${editingSection ? `
            <div class="field section-card-info">
              <label for="editSectionTitle_${section.id}">섹션명 수정</label>
              <input class="input" id="editSectionTitle_${section.id}" value="${esc(section.title)}" />
            </div>
            <div class="item-actions manage-actions">
              <button class="btn" data-save-section="${section.id}" type="button">저장</button>
              <button class="btn-light" data-action="cancel-edit-section" type="button">취소</button>
            </div>` : `
            <div class="section-card-info">
              <div class="section-card-name" style="font-weight:800" title="${esc(section.title)}">${esc(section.title)}</div>
              <div class="small muted">${items.length}개 항목</div>
            </div>
            <div class="item-actions manage-actions">
              <button class="btn-light" data-edit-section="${section.id}" ${state.adminMode ? "" : "disabled"} type="button">수정</button>
              <button class="btn-danger" data-delete-section="${section.id}" ${state.adminMode ? "" : "disabled"} type="button">섹션 삭제</button>
            </div>`}
        </div>
        <div class="section-card-body">
          ${moreToggle(`data-toggle-add-item="${esc(section.id)}"`, addOpen)}
          ${addOpen ? `<div class="inline-form item-add-form">
            <div class="field">
              <label for="itemText_${section.id}">점검 항목</label>
              <input class="input" id="itemText_${section.id}" placeholder="점검 내용을 입력하세요" />
            </div>
            <div class="field">
              <label for="itemRisk_${section.id}">위험 등급</label>
              <select class="select" id="itemRisk_${section.id}">
                <option value="high">위험</option>
                <option value="medium" selected>주의</option>
                <option value="low">정상</option>
              </select>
            </div>
            <div class="field">
              <label for="itemRequired_${section.id}">필수 여부</label>
              <select class="select" id="itemRequired_${section.id}">
                <option value="auto">위험만 필수</option>
                <option value="yes">항상 필수</option>
                <option value="no">필수 아님</option>
              </select>
            </div>
            <div class="field">
              <label for="itemVisibility_${section.id}">표시 조건</label>
              <select class="select" id="itemVisibility_${section.id}">
                ${visibilityConditionOptions("항상 표시")}
              </select>
            </div>
            ${renderItemToolPicker({ groupId: `add_${section.id}`, categoryId: cat.id, selectedIds: [] })}
            <button class="btn" data-add-item="${section.id}" ${state.adminMode ? "" : "disabled"} type="button">항목 추가</button>
          </div>` : ""}
          <div class="list">
            ${items.map((row) => state.adminMode ? renderEditableItemRow(row) : `<div class="item-row manage-item-row">
              <div class="item-main">
                <div class="item-name" title="${esc(row.text)}">${esc(row.text)}</div>
                <div class="small muted" style="margin-top:5px">${row.required ? "제출 필수 항목" : "일반 항목"}</div>
                <div class="small muted" style="margin-top:5px">${describeItemVisibility(row)}</div>
              </div>
              ${badge(row.risk)}
            </div>`).join("") || `<div class="empty">아직 항목이 없습니다.</div>`}
          </div>
        </div>
      </section>`;
    }

    function renderEditableItemRow(row) {
      return `<div class="item-row edit-item-row">
        <div class="item-main">
          <div class="field" style="margin-bottom:8px">
            <label for="editItemText_${row.id}">점검 항목 수정</label>
            <input class="input" id="editItemText_${row.id}" value="${esc(row.text)}" />
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="editItemRisk_${row.id}">위험 등급</label>
              <select class="select" id="editItemRisk_${row.id}">
                <option value="high" ${row.risk === "high" ? "selected" : ""}>위험</option>
                <option value="medium" ${row.risk === "medium" ? "selected" : ""}>주의</option>
                <option value="low" ${row.risk === "low" ? "selected" : ""}>정상</option>
              </select>
            </div>
            <div class="field">
              <label for="editItemRequired_${row.id}">필수 여부</label>
              <select class="select" id="editItemRequired_${row.id}">
                <option value="yes" ${row.required ? "selected" : ""}>필수</option>
                <option value="no" ${!row.required ? "selected" : ""}>필수 아님</option>
              </select>
            </div>
            <div class="field">
              <label for="editItemVisibility_${row.id}">표시 조건</label>
              <select class="select" id="editItemVisibility_${row.id}">
                ${visibilityConditionOptions(row.visibilityCondition)}
              </select>
            </div>
          </div>
          ${renderItemToolPicker({ groupId: `edit_${row.id}`, categoryId: row.categoryId, selectedIds: row.toolIds })}
        </div>
        <div class="item-actions manage-actions">
          <button class="btn" data-save-item="${row.id}" type="button">저장</button>
          <button class="btn-danger" data-delete-item="${row.id}" type="button">삭제</button>
        </div>
      </div>`;
    }

    function renderItemToolPicker({ groupId, categoryId, selectedIds }) {
      const tools = visibleToolsForCategory(categoryId);
      const selected = new Set(sanitizeToolIds(selectedIds));
      return `<div class="field item-tool-picker">
        <div class="field-label">사용 공기구</div>
        ${tools.length ? `<div class="item-tool-options">
          ${tools.map((tool) => {
            const inputId = `itemTool_${groupId}_${tool.id}`;
            return `<label class="item-tool-option" for="${esc(inputId)}">
              <input id="${esc(inputId)}" type="checkbox" value="${esc(tool.id)}" data-item-tool-group="${esc(groupId)}" ${selected.has(tool.id) ? "checked" : ""} ${state.adminMode ? "" : "disabled"} />
              <span>${esc(tool.name)}</span>
              ${natureBadge(tool.nature)}
            </label>`;
          }).join("")}
        </div>` : `<div class="notice">선택 가능한 공기구가 없습니다. 공기구/준비물 관리에서 먼저 추가하세요.</div>`}
        <div class="small muted">선택하지 않으면 공기구와 무관한 공통 항목으로 표시됩니다.</div>
      </div>`;
    }

    function renderCategoryToolPicker({ groupId, selectedIds }) {
      const tools = activeTools();
      const selected = new Set(sanitizeToolIds(selectedIds));
      return `<div class="field category-tool-picker">
        <div class="field-label">이 작업에서 사용할 공기구/준비물</div>
        ${tools.length ? `<div class="category-tool-options">
          ${tools.map((tool) => {
            const inputId = `categoryTool_${groupId}_${tool.id}`;
            return `<label class="item-tool-option" for="${esc(inputId)}">
              <input id="${esc(inputId)}" type="checkbox" value="${esc(tool.id)}" data-category-tool-group="${esc(groupId)}" ${selected.has(tool.id) ? "checked" : ""} ${state.adminMode ? "" : "disabled"} />
              <span>${esc(tool.name)}</span>
              ${natureBadge(tool.nature)}
            </label>`;
          }).join("")}
        </div>` : `<div class="notice">등록된 공기구/준비물이 없습니다. 공기구/준비물 관리에서 먼저 추가하세요.</div>`}
        <div class="small muted">선택한 공기구/준비물만 작업자 선택 화면에 표시됩니다. 아무것도 선택하지 않으면 기존처럼 공정 성격에 맞는 전체 공기구가 표시됩니다.</div>
      </div>`;
    }

    function renderCategoryToolAssignments() {
      const categories = state.categories.slice().sort(byOrder);
      const tools = activeTools();
      if (!categories.length) return `<div class="empty compact-empty">등록된 작업 유형이 없습니다. 먼저 작업 유형을 추가하세요.</div>`;
      return `<div class="category-tool-assignment-list">
        ${categories.map((cat) => {
          const selectedToolIds = sanitizeToolIds(cat.toolIds);
          const selectedCount = selectedToolIds.length;
          const expanded = state.categoryToolAssignmentOpenIds.includes(cat.id);
          return `<article class="category-tool-assignment-row" data-toggle-category-tools="${esc(cat.id)}" role="button" tabindex="0" aria-expanded="${expanded ? "true" : "false"}" style="--accent:${esc(categoryAccent(cat))}">
            <div class="category-tool-assignment-head">
              <span class="category-tool-assignment-icon">${categoryVisual(cat)}</span>
              <div>
                <strong>${esc(cat.label)}</strong>
                <span>${sectionsFor(cat.id).length}개 섹션 · ${activeItems(cat.id).length}개 항목 · ${esc(normalizeToolNature(cat.toolNature))}</span>
              </div>
              <em>${selectedCount ? `${selectedCount}개 지정` : "전체 표시"}</em>
              <span class="category-tool-toggle-mark" aria-hidden="true">${expanded ? "⌃" : "⌄"}</span>
            </div>
            ${expanded ? (tools.length ? renderCategoryToolPicker({ groupId: `category_${cat.id}`, selectedIds: cat.toolIds }) : `<div class="notice">등록된 공기구/준비물이 없습니다. 먼저 공기구를 추가하세요.</div>`) : renderCategoryToolSummary(selectedToolIds)}
            <div class="category-tool-assignment-actions">
              ${expanded ? `<button class="btn" data-save-category-tools="${esc(cat.id)}" ${state.adminMode ? "" : "disabled"} type="button">공기구 지정 저장</button>` : ""}
              <button class="btn-light" data-manage-category="${esc(cat.id)}" type="button">섹션/항목 관리</button>
            </div>
          </article>`;
        }).join("")}
      </div>`;
    }

    function renderCategoryToolSummary(toolIds) {
      const tools = sanitizeToolIds(toolIds)
        .map((id) => toolById(id))
        .filter((tool) => tool && tool.deleted !== true);
      if (!tools.length) return `<div class="category-tool-summary empty-summary">공기구를 지정하지 않으면 기존처럼 공정 성격에 맞는 전체 공기구가 표시됩니다.</div>`;
      const visibleTools = tools.slice(0, 4);
      const hiddenCount = tools.length - visibleTools.length;
      return `<div class="category-tool-summary" aria-label="지정된 공기구 요약">
        ${visibleTools.map((tool) => `<span class="category-tool-chip">${esc(tool.name)}${natureBadge(tool.nature)}</span>`).join("")}
        ${hiddenCount > 0 ? `<span class="category-tool-chip more">+${hiddenCount}</span>` : ""}
      </div>`;
    }

    function renderToolManager() {
      const tools = activeTools();
      return `
        ${state.adminMode ? "" : `<div class="notice" style="margin-bottom:10px">수정 모드를 켜면 공기구 목록과 성격을 바꿀 수 있습니다.</div>`}
        <div class="tool-admin-toolbar">
          <div class="tool-admin-search-stack">
            <div class="field">
              <label for="toolSearch">공기구/준비물 검색</label>
              <input class="input search-input" id="toolSearch" data-tool-search value="${esc(state.toolSearchQuery)}" placeholder="공기구명 검색" autocomplete="off" />
              <div class="small muted" data-tool-search-count>${tools.length}개</div>
            </div>
            <div class="small muted">카드를 선택하면 해당 공기구만 펼쳐서 수정합니다.</div>
          </div>
          <button class="btn" data-action="toggle-tool-add" ${state.adminMode ? "" : "disabled"} type="button">${state.toolAddOpen ? "추가 닫기" : "+ 공기구 추가"}</button>
        </div>
        ${state.toolAddOpen ? `<div class="tool-admin-add">
          <div class="tool-admin-edit-grid">
            <div class="field">
              <label for="newToolName">새 공기구/준비물</label>
              <input class="input" id="newToolName" placeholder="예) 에어 호스" ${state.adminMode ? "" : "disabled"} />
            </div>
            <div class="field">
              <label for="newToolNature">성격</label>
              <select class="select" id="newToolNature" ${state.adminMode ? "" : "disabled"}>
                ${toolNatureOptions("선행")}
              </select>
            </div>
          </div>
          <button class="btn" data-action="add-tool" ${state.adminMode ? "" : "disabled"} type="button">공기구 추가</button>
        </div>` : ""}
        <div class="tool-admin-grid">
          ${tools.length ? tools.map(renderToolCard).join("") : `<div class="empty">등록된 공기구/준비물이 없습니다.</div>`}
        </div>
        ${tools.length ? `<div class="empty" data-tool-search-empty hidden>검색 결과가 없습니다.</div>` : ""}`;
    }

    function renderToolCard(tool) {
      const editing = state.editToolId === tool.id;
      const searchText = esc(searchableToolText(tool));
      if (!editing) {
        return `<button class="tool-admin-card tool-admin-card-compact" data-edit-tool="${esc(tool.id)}" data-tool-search-item data-tool-search-text="${searchText}" ${state.adminMode ? "" : "disabled"} type="button">
          <span class="tool-admin-title">${esc(tool.name)}</span>
          ${natureBadge(tool.nature)}
        </button>`;
      }
      return `<div class="tool-admin-card tool-admin-card-expanded" data-tool-search-item data-tool-search-text="${searchText}">
        <div class="tool-admin-expanded-head">
          <strong>${esc(tool.name)}</strong>
          ${natureBadge(tool.nature)}
        </div>
        <div class="tool-admin-edit-grid">
          <div class="field">
            <label for="toolName_${tool.id}">공기구명</label>
            <input class="input tool-admin-name" id="toolName_${tool.id}" value="${esc(tool.name)}" ${state.adminMode ? "" : "disabled"} />
          </div>
          <div class="field">
            <label for="toolNature_${tool.id}">성격</label>
            <select class="select tool-admin-nature" id="toolNature_${tool.id}" ${state.adminMode ? "" : "disabled"}>
              ${toolNatureOptions(tool.nature)}
            </select>
          </div>
        </div>
        <div class="tool-admin-card-actions">
          <button class="btn" data-save-tool="${tool.id}" ${state.adminMode ? "" : "disabled"} type="button">저장</button>
          <button class="btn-light" data-action="cancel-edit-tool" type="button">닫기</button>
          <button class="btn-danger" data-delete-tool="${tool.id}" ${state.adminMode ? "" : "disabled"} type="button">삭제</button>
        </div>
      </div>`;
    }

    function renderPictogramLibraryManager() {
      const customPictograms = pictogramLibrary().filter((row) => row.source === "custom");
      return `
        ${state.adminMode ? "" : `<div class="notice" style="margin-bottom:10px">수정 모드를 켜면 사용자 지정 픽토그램을 관리할 수 있습니다.</div>`}
        <div class="field" style="margin-bottom:10px">
          <label for="newPictogramLabel">새 픽토그램 이름</label>
          <input class="input" id="newPictogramLabel" placeholder="예) 방폭 조명" ${state.adminMode ? "" : "disabled"} />
        </div>
        <div class="field" style="margin-bottom:10px">
          <label for="newPictogramFile">이미지 파일</label>
          <input class="input" id="newPictogramFile" type="file" accept="image/*" ${state.adminMode ? "" : "disabled"} />
        </div>
        <button class="btn" data-action="add-pictogram" ${state.adminMode ? "" : "disabled"} type="button" style="width:100%">픽토그램 추가</button>
        <div class="tool-admin-list">
          ${customPictograms.length ? customPictograms.map((icon) => `<div class="pictogram-admin-row">
            <span class="pictogram-admin-preview">${workVisual(icon.id, icon.label)}</span>
            <div class="field">
              <label for="pictogramLabel_${icon.id}">이름</label>
              <input class="input" id="pictogramLabel_${icon.id}" value="${esc(icon.label)}" ${state.adminMode ? "" : "disabled"} />
            </div>
            <div class="item-actions manage-actions">
              <button class="btn-light" data-save-pictogram="${icon.id}" ${state.adminMode ? "" : "disabled"} type="button">저장</button>
              <button class="btn-danger" data-delete-pictogram="${icon.id}" ${state.adminMode ? "" : "disabled"} type="button">삭제</button>
            </div>
          </div>`).join("") : `<div class="empty">추가된 사용자 지정 픽토그램이 없습니다.</div>`}
        </div>`;
    }

    function describeItemVisibility(row) {
      const condition = normalizeVisibilityCondition(row.visibilityCondition);
      const tools = linkedToolsForItem(row).map((tool) => tool.name);
      if (tools.length) {
        const toolText = tools.join(", ");
        return condition === "항상 표시" ? `${toolText} 선택 시 표시` : `${condition} · ${toolText} 선택 시 표시`;
      }
      return condition === "항상 표시" ? "공통 항목" : `${condition} 공기구 선택 시 표시`;
    }

    function linkedToolsForItem(row) {
      return sanitizeToolIds(row.toolIds)
        .map((id) => toolById(id))
        .filter((tool) => tool && tool.deleted !== true);
    }

    function renderItemToolChips(row) {
      const selected = new Set(sanitizeToolIds(state.draft.selectedToolIds));
      const tools = linkedToolsForItem(row).filter((tool) => selected.has(tool.id));
      if (!tools.length) return "";
      return `<span class="item-tool-chips">${tools.map((tool) => `<span class="item-tool-chip">${esc(tool.name)}</span>`).join("")}</span>`;
    }

    function badge(risk, text = RISKS[risk]?.label || risk) {
      const safeTone = String(risk || "").replace(/[^a-z0-9_-]/gi, "");
      const cls = RISKS[risk]?.className || safeTone || "status-draft";
      const label = String(text || risk || "");
      const icon = /고위험|주의|위험|확인/.test(label) ? "▲" : /정상|완료/.test(label) ? "✓" : "●";
      return `<span class="badge ${cls}" aria-label="${esc(`위험 등급: ${label}`)}"><span aria-hidden="true">${icon}</span>${esc(label)}</span>`;
    }

    function statusBadge(status) {
      const cls = status === "완료" ? "status-done" : status === "차단" ? "status-block" : "status-draft";
      return `<span class="badge ${cls}">${esc(status)}</span>`;
    }

    function parseShipNote(note) {
      try {
        const parsed = JSON.parse(note || "{}");
        if (parsed && parsed._shipMeta === 1) return parsed;
      } catch {}
      return { note: note || "", lcDate: "", stDate: "", clDate: "", dlDate: "", deliveryType: "", deliveryDate: "" };
    }

    function shipNotePayload(ship) {
      return JSON.stringify({
        _shipMeta: 1,
        note: ship.note || "",
        lcDate: ship.lcDate || "",
        stDate: ship.stDate || "",
        clDate: ship.clDate || "",
        dlDate: ship.dlDate || "",
        deliveryType: shipDeliveryType(ship),
        deliveryDate: shipDeliveryDate(ship),
      });
    }

    function shipDeliveryType(ship) {
      if (ship.dlDate) return "D/L";
      if (ship.clDate) return "C/L";
      return ship.deliveryType || "";
    }

    function shipDeliveryDate(ship) {
      if (ship.dlDate) return ship.dlDate;
      if (ship.clDate) return ship.clDate;
      return ship.deliveryDate || "";
    }

    function shipStageInfo(stage) {
      return STAGE_META[stage] || STAGE_META.mounting;
    }

    function isWorkerVisibleShip(ship) {
      return Boolean(ship.lcDate);
    }

    function visibleWorkerShips() {
      return state.ships.filter(isWorkerVisibleShip).sort((a, b) => String(a.no).localeCompare(String(b.no)));
    }

    function selectableShips() {
      return visibleWorkerShips();
    }

    function visibleWorkerOptions(selectedId = "") {
      return `<option value="">등록자 선택</option>${state.workers
        .map((worker) => `<option value="${esc(worker.id)}" ${worker.id === selectedId ? "selected" : ""}>${esc(worker.name)}${worker.team ? ` / ${esc(worker.team)}` : ""}</option>`)
        .join("")}`;
    }

    function visibleShipOptionsForIssues(selectedNo = "") {
      return `<option value="">호선 선택</option>${selectableShips()
        .map((ship) => `<option value="${esc(ship.no)}" ${ship.no === selectedNo ? "selected" : ""}>${esc(ship.no)}${ship.type ? ` / ${esc(ship.type)}` : ""}</option>`)
        .join("")}`;
    }

    function effectiveShipStage(ship) {
      return shipStageInfo(ship.processStage || "mounting");
    }

    function dateOnly(value) {
      return String(value || "").slice(0, 10);
    }

    function inspectionActualDate(row) {
      return dateOnly(row?.createdAt || row?.date || "");
    }

    function formatDateTime(value) {
      const date = value ? new Date(value) : null;
      if (!date || Number.isNaN(date.getTime())) return "-";
      return `${date.getFullYear()}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    }

    function addDays(dateValue, days) {
      const date = new Date(`${dateOnly(dateValue)}T00:00:00`);
      date.setDate(date.getDate() + days);
      return localDate(date);
    }

    function daysUntil(dateValue) {
      const target = new Date(`${dateOnly(dateValue)}T00:00:00`);
      const base = new Date(`${today()}T00:00:00`);
      return Math.round((target - base) / 86400000);
    }

    function upcomingDeliveryShips() {
      const todayValue = today();
      const limit = addDays(todayValue, 7);
      return state.ships
        .filter((ship) => shipDeliveryDate(ship) && dateOnly(shipDeliveryDate(ship)) >= todayValue && dateOnly(shipDeliveryDate(ship)) <= limit)
        .sort((a, b) => dateOnly(shipDeliveryDate(a)).localeCompare(dateOnly(shipDeliveryDate(b))) || String(a.no).localeCompare(String(b.no)));
    }

    function addMonths(dateValue, months) {
      const date = new Date(`${dateOnly(dateValue)}T00:00:00`);
      date.setMonth(date.getMonth() + months);
      return localDate(date);
    }

    function shipTypeOptions(selected) {
      return `<option value="">선종 선택</option>${SHIP_TYPES.map((type) => `<option value="${esc(type)}" ${selected === type ? "selected" : ""}>${esc(type)}${type === "기타" ? " (직접입력)" : ""}</option>`).join("")}`;
    }

    function categoryById(id) {
      return state.categories.find((cat) => cat.id === id);
    }

    function sectionsFor(categoryId) {
      return state.sections.filter((section) => section.categoryId === categoryId).sort(byOrder);
    }

    function activeItems(categoryId) {
      return state.items.filter((row) => row.categoryId === categoryId && row.active !== false).sort(byOrder);
    }

    function normalizeToolNature(value) {
      const text = String(value || "").trim().replace("선/후행", "선행/후행");
      return TOOL_NATURES.includes(text) ? text : "선행";
    }

    function normalizeVisibilityCondition(value) {
      const text = String(value || "").trim().replace("선/후행", "선행/후행");
      return ITEM_VISIBILITY_CONDITIONS.includes(text) ? text : "항상 표시";
    }

    function normalizeToolName(value) {
      return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
    }

    function toolNatureRank(value) {
      const nature = normalizeToolNature(value);
      const index = TOOL_NATURES.indexOf(nature);
      return index === -1 ? TOOL_NATURES.length : index;
    }

    function compareToolWrittenOrder(a, b) {
      const aTime = Date.parse(a.createdAt || "") || 0;
      const bTime = Date.parse(b.createdAt || "") || 0;
      if (aTime && bTime && aTime !== bTime) return aTime - bTime;
      if (aTime && !bTime) return -1;
      if (!aTime && bTime) return 1;
      return (a.order || 0) - (b.order || 0) || String(a.id || "").localeCompare(String(b.id || ""));
    }

    function compareTools(a, b) {
      return toolNatureRank(a.nature) - toolNatureRank(b.nature)
        || compareToolWrittenOrder(a, b)
        || String(a.name || "").localeCompare(String(b.name || ""), "ko-KR", { numeric: true, sensitivity: "base" });
    }

    function defaultToolNatureForCategory(cat = {}) {
      if (DEFAULT_CATEGORY_NATURES[cat.id]) return DEFAULT_CATEGORY_NATURES[cat.id];
      const label = String(cat.label || "");
      if (/압력\s*테스트|압력테스트/.test(label)) return "선행/후행";
      if (/후행|DP|선주|선급|DEMO|Demo|demo/.test(label)) return "후행";
      if (/탑재|선행/.test(label)) return "선행";
      return "선행";
    }

    function inferVisibilityFromToolIds(row) {
      const linkedTools = sanitizeToolIds(row.toolIds).map((id) => toolById(id)).filter(Boolean);
      if (!linkedTools.length) return "항상 표시";
      const natures = [...new Set(linkedTools.map((tool) => normalizeToolNature(tool.nature)))];
      if (natures.includes("선행/후행")) return "선행/후행";
      if (natures.includes("선행") && natures.includes("후행")) return "선행/후행";
      return natures[0] || "항상 표시";
    }

    function toolNatureOptions(selected) {
      const value = normalizeToolNature(selected);
      return TOOL_NATURES.map((nature) => `<option value="${esc(nature)}" ${value === nature ? "selected" : ""}>${esc(nature)}</option>`).join("");
    }

    function visibilityConditionOptions(selected) {
      const value = normalizeVisibilityCondition(selected);
      return ITEM_VISIBILITY_CONDITIONS.map((condition) => `<option value="${esc(condition)}" ${value === condition ? "selected" : ""}>${esc(condition)}</option>`).join("");
    }

    function natureBadge(value) {
      const nature = normalizeToolNature(value);
      const className = nature === "선행" ? "nature-pre" : nature === "후행" ? "nature-post" : "nature-both";
      return `<span class="nature-badge ${className}">${esc(nature)}</span>`;
    }

    function conditionBadge(value) {
      const condition = normalizeVisibilityCondition(value);
      if (condition === "항상 표시") return `<span class="nature-badge nature-common">항상 표시</span>`;
      return natureBadge(condition);
    }

    function visibleToolsForCategory(categoryId) {
      const cat = categoryById(categoryId);
      const allowed = new Set(categoryAllowedToolIds(categoryId));
      const tools = activeTools().filter((tool) => CHECKLIST_RULES.toolMatchesCategoryNature(
        tool,
        cat?.toolNature || defaultToolNatureForCategory(cat),
      ));
      if (!allowed.size) return tools;
      return tools.filter((tool) => allowed.has(tool.id));
    }

    function categoryAllowedToolIds(categoryId) {
      const cat = categoryById(categoryId);
      return sanitizeToolIds(cat?.toolIds);
    }

    function sanitizeToolIds(toolIds) {
      return [...new Set((Array.isArray(toolIds) ? toolIds : []).map((id) => String(id || "").trim()).filter(Boolean))];
    }

    function toolsFor(categoryId = null) {
      const tools = categoryId ? state.tools.filter((tool) => !tool.categoryId || tool.categoryId === categoryId) : state.tools;
      return tools.sort(compareTools);
    }

    function activeTools(categoryId = null) {
      return toolsFor(categoryId).filter((tool) => tool.deleted !== true);
    }

    function toolById(id) {
      return state.tools.find((tool) => tool.id === id);
    }

    function normalizeShipSortMode(value) {
      const mode = String(value || "").trim();
      return SHIP_SORT_OPTIONS.some(([id]) => id === mode) ? mode : "stage";
    }

    function shipSortOptions() {
      return SHIP_SORT_OPTIONS.map(([id, label]) => `<option value="${esc(id)}" ${state.shipSortMode === id ? "selected" : ""}>${esc(label)}</option>`).join("");
    }

    function compareShipNo(a, b) {
      return String(a.no || "").localeCompare(String(b.no || ""), "ko-KR", { numeric: true, sensitivity: "base" });
    }

    function compareShipDate(getDate) {
      return (a, b) => {
        const aDate = dateOnly(getDate(a));
        const bDate = dateOnly(getDate(b));
        if (aDate && bDate) return aDate.localeCompare(bDate) || compareShipNo(a, b);
        if (aDate) return -1;
        if (bDate) return 1;
        return compareShipNo(a, b);
      };
    }

    function compareShipStage(a, b) {
      const aStage = SHIP_WORKFLOW_STAGES.indexOf(effectiveShipStage(a).stage);
      const bStage = SHIP_WORKFLOW_STAGES.indexOf(effectiveShipStage(b).stage);
      return (aStage - bStage) || compareShipNo(a, b);
    }

    function compareRecentShip(a, b) {
      const aTime = Date.parse(a.createdAt || "") || (a.order || 0);
      const bTime = Date.parse(b.createdAt || "") || (b.order || 0);
      return (bTime - aTime) || compareShipNo(a, b);
    }

    function sortedShips() {
      const ships = [...state.ships];
      const mode = normalizeShipSortMode(state.shipSortMode);
      if (mode === "number") return ships.sort(compareShipNo);
      if (mode === "lcDate") return ships.sort(compareShipDate((ship) => ship.lcDate));
      if (mode === "dlDate") return ships.sort(compareShipDate((ship) => ship.dlDate || shipDeliveryDate(ship)));
      if (mode === "recent") return ships.sort(compareRecentShip);
      if (mode === "saved") return ships.sort(byOrder);
      return ships.sort(compareShipStage);
    }

    function setShipSortMode(mode) {
      state.shipSortMode = normalizeShipSortMode(mode);
      saveJson("shipSortMode", state.shipSortMode);
      render();
    }

    function saveCurrentShipOrder() {
      if (!requireAdmin()) return;
      const ordered = sortedShips().map((ship, index) => ({ ...ship, order: index + 1 }));
      state.ships = ordered;
      state.shipSortMode = "saved";
      persistAndSync("ships");
      saveJson("shipSortMode", state.shipSortMode);
      render();
      toast("현재 호선 순서를 저장했습니다.");
    }

    function pictogramLibrary() {
      return state.pictograms.filter((row) => row.deleted !== true).sort(byOrder);
    }

    function resetToolPrepDraft() {
      state.draft = createDraft({
        worker: state.draft.worker,
        shipNo: state.draft.shipNo,
        safetyPledge: state.draft.safetyPledge,
        checks: {},
      });
    }

    function filteredChecklistItems(categoryId) {
      const cat = categoryById(categoryId);
      return CHECKLIST_RULES.filterChecklistItems({
        items: activeItems(categoryId),
        tools: activeTools(),
        selectedToolIds: state.draft.selectedToolIds,
        categoryNature: cat?.toolNature || defaultToolNatureForCategory(cat),
      });
    }

    function selectedItemToolIds(groupId) {
      return Array.from(document.querySelectorAll("[data-item-tool-group]"))
        .filter((node) => node.dataset.itemToolGroup === groupId && node.checked)
        .map((node) => node.value);
    }

    function selectedCategoryToolIds(groupId) {
      return Array.from(document.querySelectorAll("[data-category-tool-group]"))
        .filter((node) => node.dataset.categoryToolGroup === groupId && node.checked)
        .map((node) => node.value);
    }

    function selectedColor() {
      return $("catColor")?.value || COLORS[0];
    }

    function cssEscape(value) {
      if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
      return String(value).replace(/["\\]/g, "\\$&");
    }

    function resolveShipType(selectId, customId) {
      const selected = $(selectId).value;
      if (selected === "기타") return $(customId).value.trim();
      return selected;
    }

    function clearPledgeSignature() {
      state.draft.pledgeSignature = "";
      saveJson("draft", state.draft);
      render();
    }

    function startNewUnsafeIssue() {
      state.lastUnsafeIssueId = "";
      state.unsafeDraft = createUnsafeDraft();
      state.unsafePhotoFiles = [];
      persist();
      render();
      scrollScreenTop();
    }

    function startNewMissingMaterial() {
      state.lastMaterialId = "";
      state.materialDraft = createMaterialDraft();
      persist();
      render();
      scrollScreenTop();
    }

    const ADMIN_ACTIONS = new Set([
      "bulk-material-status",
      "edit-pledge-template",
      "save-pledge-template",
      "cancel-pledge-template",
      "open-analytics-filters",
      "open-analytics-detail",
      "add-ship",
      "save-ship-order",
    ]);

    function adminActionApi() {
      return {
        bulkUpdateMaterialStatus,
        editPledgeTemplate,
        savePledgeTemplate,
        cancelPledgeTemplate,
        openAnalyticsFilters,
        openAnalyticsDetail,
        addShip,
        saveCurrentShipOrder,
      };
    }

    function dispatchAdminAction(action, event) {
      loadAdminModule()
        .then((module) => {
          if (!module.runAdminAction(adminActionApi(), action, event)) {
            toast("관리자 작업을 실행할 수 없습니다.");
          }
        })
        .catch((error) => {
          console.error(error);
          toast("관리자 모듈을 불러오지 못했습니다.");
        });
      return true;
    }

    function dispatchAction(action, event) {
      if (ADMIN_ACTIONS.has(action)) return dispatchAdminAction(action, event);
      const actions = {
        "clear-pledge-signature": clearPledgeSignature,
        "submit-inspection": submitInspection,
        "submit-unsafe": submitUnsafeIssue,
        "submit-material": submitMissingMaterial,
        "new-unsafe": startNewUnsafeIssue,
        "new-material": startNewMissingMaterial,
        "toggle-admin": toggleAdminMode,
        "reset-history": resetHistory,
        "delete-selected-history": deleteSelectedHistory,
        "retry-photo-upload": retryPendingPhotoUpload,
      };
      const handler = actions[action];
      if (!handler) return false;
      handler(event);
      return true;
    }

    document.addEventListener("click", (event) => {
      const disabledReason = event.target.closest("[data-disabled-reason]");
      if (disabledReason) {
        const enabledAction = disabledReason.querySelector("button:not(:disabled)");
        if (enabledAction) return;
        event.preventDefault();
        toast(disabledReason.dataset.disabledReason);
        return;
      }

      const historyCard = event.target.closest("[data-history-detail-card]");
      if (historyCard && !event.target.closest("button,input,label,select,textarea")) {
        openHistoryDetail(historyCard.dataset.historyDetailCard);
        return;
      }

      const unsafeCard = event.target.closest("[data-unsafe-record-detail]");
      if (unsafeCard && !event.target.closest("button,input,label,select,textarea")) {
        openUnsafeDetail(unsafeCard.dataset.unsafeRecordDetail);
        return;
      }

      const analyticsRow = event.target.closest("[data-analytics-record-id]");
      if (analyticsRow && !event.target.closest("button,input,label,select,textarea")) {
        openAnalyticsRecord(analyticsRow.dataset.analyticsRecordKind, analyticsRow.dataset.analyticsRecordId);
        return;
      }

      const categoryToolRow = event.target.closest(".category-tool-assignment-row[data-toggle-category-tools]");
      if (categoryToolRow && !event.target.closest("button,input,label,select,textarea")) {
        toggleCategoryTools(categoryToolRow.dataset.toggleCategoryTools);
        return;
      }

      const button = event.target.closest("button");
      if (!button) return;

      if (button.dataset.monthlyWorkerMonth) {
        setMonthlyWorkerMonth(button.dataset.monthlyWorkerMonth);
        return;
      }
      if (button.dataset.action === "toggle-monthly-rest-settings") {
        state.monthlyRestDayPanelOpen = !state.monthlyRestDayPanelOpen;
        render();
        return;
      }
      if (button.dataset.action === "add-monthly-rest-day") {
        addCustomMonthlyRestDay(document.querySelector("[data-monthly-custom-rest-date]")?.value || "");
        return;
      }
      if (button.dataset.deleteMonthlyRestDay) {
        deleteCustomMonthlyRestDay(button.dataset.deleteMonthlyRestDay);
        return;
      }
      if (button.dataset.unsafeRecordDetail) {
        openUnsafeDetail(button.dataset.unsafeRecordDetail);
        return;
      }
      if (button.dataset.materialRecordDetail) {
        openMaterialDetail(button.dataset.materialRecordDetail);
        return;
      }
      if (button.dataset.exportRecords) {
        exportRecords(button.dataset.exportRecords);
        return;
      }
      if (button.dataset.selectPledgeWorker) {
        selectPledgeWorker(button.dataset.selectPledgeWorker);
        return;
      }
      if (button.dataset.selectPledgeShip) {
        state.draft.shipNo = button.dataset.selectPledgeShip;
        saveJson("draft", state.draft);
        render();
        return;
      }
      if (button.dataset.unsafeSelectShip) {
        state.unsafeDraft.shipNo = button.dataset.unsafeSelectShip;
        saveUnsafeDraft();
        render();
        return;
      }
      if (button.dataset.unsafeSelectWorker) {
        state.unsafeDraft.workerId = button.dataset.unsafeSelectWorker;
        saveUnsafeDraft();
        render();
        return;
      }
      if (button.dataset.unsafeEditStep) {
        state.unsafeDraft.step = Number(button.dataset.unsafeEditStep) || 1;
        saveUnsafeDraft();
        render();
        scrollScreenTop();
        return;
      }
      if (button.dataset.unsafeStepBack !== undefined) {
        state.unsafeDraft.step = Math.max(unsafeDraftStep() - 1, 1);
        saveUnsafeDraft();
        render();
        scrollScreenTop();
        return;
      }
      if (button.dataset.unsafeNext !== undefined) {
        syncUnsafeDraftFromDom();
        saveUnsafeDraft();
        if (!unsafeStepReady()) return toast(button.dataset.requiredMessage || "필수 항목을 먼저 입력하세요.");
        state.unsafeDraft.step = Math.min(unsafeDraftStep() + 1, 3);
        saveUnsafeDraft();
        render();
        scrollScreenTop();
        return;
      }
      if (button.dataset.materialSelectShip) {
        state.materialDraft.shipNo = button.dataset.materialSelectShip;
        saveMaterialDraft();
        render();
        return;
      }
      if (button.dataset.materialSelectType) {
        state.materialDraft.materialType = button.dataset.materialSelectType;
        saveMaterialDraft();
        render();
        return;
      }
      if (button.dataset.materialSelectWorker) {
        state.materialDraft.workerId = button.dataset.materialSelectWorker;
        saveMaterialDraft();
        render();
        return;
      }
      if (button.dataset.materialEditStep) {
        state.materialDraft.step = Number(button.dataset.materialEditStep) || 1;
        saveMaterialDraft();
        render();
        scrollScreenTop();
        return;
      }
      if (button.dataset.materialStepBack !== undefined) {
        state.materialDraft.step = Math.max(materialDraftStep() - 1, 1);
        saveMaterialDraft();
        render();
        scrollScreenTop();
        return;
      }
      if (button.dataset.materialNext !== undefined) {
        syncMaterialDraftFromDom();
        saveMaterialDraft();
        if (!materialStepReady()) return toast(button.dataset.requiredMessage || "필수 항목을 먼저 입력하세요.");
        state.materialDraft.step = Math.min(materialDraftStep() + 1, 4);
        saveMaterialDraft();
        render();
        scrollScreenTop();
        return;
      }
      if (button.dataset.recordFilter) {
        updateRecordFilter(button.dataset.recordFilter, button.value || "");
        return;
      }

      if (button.dataset.view) {
        if (button.dataset.view === "manage") {
          state.manageTab = "unsafe";
          state.unsafeDetailId = "";
          setUnsafeStatusFilter("");
          saveJson("manageTab", state.manageTab);
          changeView("manage");
        } else {
          changeView(button.dataset.view);
        }
      }
      if (button.dataset.action === "view-unsafe-received") openUnsafeReceivedList();
      if (button.dataset.screenMode) setScreenMode(button.dataset.screenMode);
      if (button.dataset.dashboardCategory) {
        state.selectedCategoryId = button.dataset.dashboardCategory;
        changeView("check");
      }
      if (button.dataset.selectCategory) {
        state.selectedCategoryId = button.dataset.selectCategory;
        resetToolPrepDraft();
        render();
        scrollScreenTop();
        pushRouteState();
      }
      if (button.dataset.action === "back-check-types") {
        state.selectedCategoryId = null;
        resetToolPrepDraft();
        render();
        scrollScreenTop();
        pushRouteState();
      }
      if (button.dataset.action === "continue-tool-prep") {
        state.draft.toolPrepComplete = true;
        render();
        scrollScreenTop();
      }
      if (button.dataset.action && dispatchAction(button.dataset.action, event)) return;
      if (button.dataset.action === "view-unsafe-list") {
        state.manageTab = "unsafe";
        setUnsafeStatusFilter("");
        saveJson("manageTab", state.manageTab);
        changeView("manage");
      }
      if (button.dataset.action === "view-material-list") {
        state.manageTab = "materials";
        resetMaterialShipFilter();
        saveJson("manageTab", state.manageTab);
        changeView("manage");
      }
      if (button.dataset.historyFilter) {
        state.historyFilter = button.dataset.historyFilter;
        state.historyDetailId = null;
        render();
        pushRouteState();
      }
      if (button.dataset.historyScope) {
        state.historyScope = normalizeHistoryScope(button.dataset.historyScope);
        state.historyDetailId = null;
        state.selectedHistoryIds = [];
        if (state.view === "history") {
          render();
          pushRouteState();
        } else {
          changeView("history");
        }
      }
      if (button.dataset.historyDetail) {
        openHistoryDetail(button.dataset.historyDetail);
      }
      if (button.dataset.action === "back-history-list") {
        state.historyDetailId = null;
        render();
        scrollScreenTop();
        pushRouteState();
      }
      if (button.dataset.action === "toggle-admin") toggleAdminMode();
      if (button.dataset.manageTab) {
        state.manageTab = button.dataset.manageTab;
        state.unsafeDetailId = "";
        if (state.manageTab === "unsafe") setUnsafeStatusFilter("");
        if (state.manageTab === "materials") resetMaterialShipFilter();
        saveJson("manageTab", state.manageTab);
        render();
        scrollScreenTop();
      }
      if (button.dataset.action === "back-unsafe-list") {
        state.unsafeDetailId = "";
        render();
        scrollScreenTop();
      }
      if (button.dataset.action === "add-worker") addWorker();
      if (button.dataset.editWorker) editWorker(button.dataset.editWorker);
      if (button.dataset.deleteWorker) deleteWorker(button.dataset.deleteWorker);
      if (button.dataset.saveRecordStatus) saveAdminRecord(button.dataset.saveRecordStatus, { requireStatusChange: true });
      if (button.dataset.saveRecord) saveAdminRecord(button.dataset.saveRecord);
      if (button.dataset.deleteRecord) deleteAdminRecord(button.dataset.deleteRecord);
      if (button.dataset.action === "focus-ship-add") {
        $("newShipNos")?.scrollIntoView({ behavior: "smooth", block: "center" });
        $("newShipNos")?.focus();
      }
      if (button.dataset.deleteShip) deleteShip(button.dataset.deleteShip);
      if (button.dataset.pickColor) {
        document.querySelectorAll("[data-pick-color]").forEach((node) => node.classList.toggle("active", node === button));
        const colorInput = $("catColor");
        if (colorInput) colorInput.value = button.dataset.pickColor;
      }
      if (button.dataset.pickIcon) {
        const targetId = button.dataset.pickIconTarget || "catIcon";
        document.querySelectorAll(`[data-pick-icon-target="${targetId}"]`).forEach((node) => node.classList.toggle("active", node === button));
        const target = $(targetId);
        if (target) target.value = button.dataset.pickIcon;
      }
      if (button.dataset.action === "save-category-icon") saveCategoryIcon();
      if (button.dataset.action === "toggle-category-add") {
        if (!requireAdmin()) return;
        state.categoryAddOpen = !state.categoryAddOpen;
        state.editCategoryId = null;
        render();
      }
      if (button.dataset.action === "cancel-category-add") {
        state.categoryAddOpen = false;
        render();
      }
      if (button.dataset.action === "add-category") addCategory();
      if (button.hasAttribute("data-toggle-category-visual")) {
        state.categoryVisualOpen = !state.categoryVisualOpen;
        render();
      }
      if (button.dataset.action === "toggle-tool-add") {
        if (!requireAdmin()) return;
        state.toolAddOpen = !state.toolAddOpen;
        state.editToolId = null;
        render();
      }
      if (button.dataset.action === "add-tool") addTool();
      if (button.dataset.editTool) {
        if (!requireAdmin()) return;
        state.editToolId = button.dataset.editTool;
        state.toolAddOpen = false;
        render();
      }
      if (button.dataset.action === "cancel-edit-tool") {
        state.editToolId = null;
        render();
      }
      if (button.dataset.saveTool) saveTool(button.dataset.saveTool);
      if (button.dataset.deleteTool) deleteTool(button.dataset.deleteTool);
      if (button.dataset.toggleToolCheck) toggleRequireToolCheck(button.dataset.toggleToolCheck);
      if (button.dataset.action === "add-pictogram") addPictogram();
      if (button.dataset.savePictogram) savePictogram(button.dataset.savePictogram);
      if (button.dataset.deletePictogram) deletePictogram(button.dataset.deletePictogram);
      if (button.dataset.manageCategory) {
        state.manageCategoryId = button.dataset.manageCategory;
        state.editCategoryId = null;
        state.categoryAddOpen = false;
        state.openAddItemSectionIds = [];
        state.categoryVisualOpen = false;
        render();
      }
      if (button.dataset.editCategory) editCategory(button.dataset.editCategory);
      if (button.dataset.saveCategory) saveCategory(button.dataset.saveCategory);
      if (button.dataset.saveCategoryTools) saveCategoryTools(button.dataset.saveCategoryTools);
      if (button.dataset.action === "cancel-edit-category") {
        state.editCategoryId = null;
        render();
      }
      if (button.dataset.deleteCategory) deleteCategory(button.dataset.deleteCategory);
      if (button.dataset.action === "back-items") {
        state.manageCategoryId = null;
        state.editSectionId = null;
        state.openAddItemSectionIds = [];
        state.categoryAddOpen = false;
        state.categoryVisualOpen = false;
        render();
      }
      if (button.dataset.action === "add-section") addSection();
      if (button.dataset.editSection) editSection(button.dataset.editSection);
      if (button.dataset.saveSection) saveSection(button.dataset.saveSection);
      if (button.dataset.deleteSection) deleteSection(button.dataset.deleteSection);
      if (button.dataset.toggleAddItem) {
        const sectionId = button.dataset.toggleAddItem;
        const open = new Set(state.openAddItemSectionIds);
        open.has(sectionId) ? open.delete(sectionId) : open.add(sectionId);
        state.openAddItemSectionIds = [...open];
        render();
      }
      if (button.dataset.addItem) addChecklistItem(button.dataset.addItem);
      if (button.dataset.saveItem) saveChecklistItem(button.dataset.saveItem);
      if (button.dataset.deleteItem) deleteChecklistItem(button.dataset.deleteItem);
      if (button.dataset.toolPrepToggle) {
        const selected = new Set(sanitizeToolIds(state.draft.selectedToolIds));
        if (selected.has(button.dataset.toolPrepToggle)) selected.delete(button.dataset.toolPrepToggle);
        else selected.add(button.dataset.toolPrepToggle);
        state.draft.selectedToolIds = [...selected];
        render();
      }
      if (button.dataset.action === "cancel-edit-section") {
        state.editSectionId = null;
        render();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const disabledReason = event.target.closest("[data-disabled-reason]");
      if (disabledReason) {
        event.preventDefault();
        toast(disabledReason.dataset.disabledReason);
        return;
      }

      const historyCard = event.target.closest("[data-history-detail-card]");
      const unsafeCard = event.target.closest("[data-unsafe-record-detail]");
      const analyticsRow = event.target.closest("[data-analytics-record-id]");
      if (historyCard && !event.target.closest("button,input,label,select,textarea")) {
        event.preventDefault();
        openHistoryDetail(historyCard.dataset.historyDetailCard);
        return;
      }
      if (unsafeCard && !event.target.closest("button,input,label,select,textarea")) {
        event.preventDefault();
        openUnsafeDetail(unsafeCard.dataset.unsafeRecordDetail);
        return;
      }
      if (analyticsRow && !event.target.closest("button,input,label,select,textarea")) {
        event.preventDefault();
        openAnalyticsRecord(analyticsRow.dataset.analyticsRecordKind, analyticsRow.dataset.analyticsRecordId);
        return;
      }
      const categoryToolRow = event.target.closest(".category-tool-assignment-row[data-toggle-category-tools]");
      if (categoryToolRow && event.target === categoryToolRow) {
        event.preventDefault();
        toggleCategoryTools(categoryToolRow.dataset.toggleCategoryTools);
      }
    });

    function openAnalyticsRecord(kind, id) {
      if (kind === "unsafe") {
        openUnsafeDetail(id);
        return;
      }
      if (kind === "materials") openMaterialDetail(id);
    }

    function openUnsafeDetail(id) {
      if (!id) return;
      state.unsafeDetailId = id;
      state.manageTab = "unsafe";
      saveJson("manageTab", state.manageTab);
      if (state.view === "manage") {
        render();
        scrollScreenTop();
        pushRouteState();
      } else {
        changeView("manage");
      }
    }

    function openMaterialDetail(id) {
      const row = state.missingMaterials.find((item) => item.id === id);
      if (!row) return;
      state.manageTab = "materials";
      state.materialFilters.shipNo = row.shipNo || "";
      state.materialFilters.status = row.status || "";
      state.materialFilters.materialName = "";
      saveJson("manageTab", state.manageTab);
      saveJson("materialFilters", state.materialFilters);
      if (state.view === "manage") {
        render();
        scrollScreenTop();
        pushRouteState();
      } else {
        changeView("manage");
      }
      toast("자재 누락 목록에서 해당 항목을 표시했습니다.");
    }

    function selectPledgeWorker(id) {
      const worker = state.workers.find((row) => row.id === id);
      if (!worker) return;
      const previousWorker = state.draft.worker;
      state.draft.worker = worker.name;
      if (normalizedWorkerName(previousWorker) !== normalizedWorkerName(state.draft.worker)) state.draft.pledgeSignature = "";
      preloadCachedPledgeSignature();
      saveJson("draft", state.draft);
      render();
    }

    function openUnsafeReceivedList() {
      const willNavigate = currentPageName() !== pageForView("manage").toLowerCase();
      state.manageTab = "unsafe";
      state.unsafeDetailId = "";
      if (willNavigate) markUnsafeReceivedEntry();
      setUnsafeStatusFilter(unsafeReceivedStatus());
      saveJson("manageTab", state.manageTab);
      changeView("manage");
    }

    function openHistoryDetail(id) {
      if (!id) return;
      state.historyDetailId = id;
      state.selectedHistoryIds = [];
      if (state.view === "history") {
        render();
        scrollScreenTop();
        pushRouteState();
      } else {
        changeView("history");
      }
    }

    document.addEventListener("input", (event) => {
      if (event.target.id === "worker") {
        const previousWorker = state.draft.worker;
        state.draft.worker = event.target.value;
        if (normalizedWorkerName(previousWorker) !== normalizedWorkerName(state.draft.worker)) state.draft.pledgeSignature = "";
        preloadCachedPledgeSignature();
        saveJson("draft", state.draft);
        refreshCheckSubmitControls();
      }
      if (event.target.id === "safetyPledge") state.draft.safetyPledge = event.target.value;
      if (event.target.id === "pledgeSignature") {
        state.draft.pledgeSignature = event.target.value;
        saveJson("draft", state.draft);
      }
      if (event.target.id === "pledgeSignatureText") {
        state.draft.pledgeSignature = event.target.value;
        savePledgeSignatureForWorker(state.draft.worker, state.draft.pledgeSignature);
        document.querySelector("[data-signature-pad]")?.classList.remove("has-signature");
        const canvas = document.getElementById("pledgeSignaturePad");
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveJson("draft", state.draft);
        refreshCheckSubmitControls();
      }
      if (event.target.id === "unsafeContent") {
        state.unsafeDraft.content = event.target.value;
        saveJson("unsafeDraft", state.unsafeDraft);
        updateFlowNextControls();
      }
      if (event.target.id === "materialName") {
        state.materialDraft.materialName = event.target.value;
        saveJson("materialDraft", state.materialDraft);
        updateFlowNextControls();
      }
      if (event.target.id === "materialSpec") {
        state.materialDraft.spec = event.target.value;
        saveJson("materialDraft", state.materialDraft);
      }
      if (event.target.id === "materialQuantity") {
        state.materialDraft.quantity = event.target.value;
        saveJson("materialDraft", state.materialDraft);
        updateFlowNextControls();
      }
      if (event.target.id === "materialDetail") {
        state.materialDraft.detail = event.target.value;
        saveJson("materialDraft", state.materialDraft);
      }
      if (event.target.id === "materialContent") {
        state.materialDraft.content = event.target.value;
        saveJson("materialDraft", state.materialDraft);
      }
      if (event.target.matches("[data-ship-search]")) {
        state.shipSearchQuery = event.target.value;
        applyShipSearchFilter();
      }
      if (event.target.matches("[data-tool-search]")) {
        state.toolSearchQuery = event.target.value;
        applyToolSearchFilter();
      }
      if (event.target.matches("[data-check-item]")) {
        const itemId = event.target.dataset.checkItem;
        state.draft.checks[itemId] = event.target.checked;
        saveJson("draft", state.draft);
        if (!updateCheckItemDom(itemId, event.target.checked)) render();
      }
    });

    document.addEventListener("change", (event) => {
      if (event.target.id === "shipNo") {
        state.draft.shipNo = event.target.value;
        render();
      }
      if (event.target.id === "unsafeShipNo") {
        state.unsafeDraft.shipNo = event.target.value;
        saveJson("unsafeDraft", state.unsafeDraft);
        render();
      }
      if (event.target.id === "unsafeWorkerId") {
        state.unsafeDraft.workerId = event.target.value;
        saveJson("unsafeDraft", state.unsafeDraft);
        updateFlowNextControls();
      }
      if (event.target.id === "unsafePhotos") {
        state.unsafePhotoFiles = Array.from(event.target.files || []).slice(0, ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS);
        if ((event.target.files || []).length > ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS) {
          toast(`사진은 최대 ${ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS}개까지 첨부할 수 있습니다.`);
        }
        state.unsafeDraft.photos = state.unsafePhotoFiles.map((file) => file.name);
        saveJson("unsafeDraft", state.unsafeDraft);
        render();
      }
      if (event.target.id === "materialShipNo") {
        state.materialDraft.shipNo = event.target.value;
        saveJson("materialDraft", state.materialDraft);
        render();
      }
      if (event.target.id === "materialWorkerId") {
        state.materialDraft.workerId = event.target.value;
        saveJson("materialDraft", state.materialDraft);
        updateFlowNextControls();
      }
      if (event.target.id === "materialUnit") {
        state.materialDraft.unit = event.target.value;
        saveJson("materialDraft", state.materialDraft);
        render();
      }
      if (event.target.matches("[data-record-filter]")) {
        updateRecordFilter(event.target.dataset.recordFilter, event.target.value);
      }
      if (event.target.matches("[data-monthly-public-holiday-mode]")) {
        toggleMonthlyPublicHolidayMode();
      }
      if (event.target.matches("[data-record-status]")) {
        const token = event.target.dataset.recordStatus;
        const changed = event.target.value !== (event.target.dataset.currentStatus || "");
        document.querySelectorAll(`[data-save-record-status="${cssEscape(token)}"]`).forEach((node) => {
          node.disabled = !changed;
          node.classList.toggle("is-disabled", !changed);
        });
      }
      if (event.target.matches("[data-pledge-rule]")) {
        const index = Number(event.target.dataset.pledgeRule);
        state.draft.pledgeChecks[index] = event.target.checked;
        saveJson("draft", state.draft);
        render();
      }
      if (event.target.id === "historySelectAll") {
        toggleVisibleHistory(event.target.checked);
      }
      if (event.target.matches("[data-history-check]")) {
        toggleHistorySelection(event.target.dataset.historyCheck, event.target.checked);
      }
      if (event.target.matches("[data-ship-date-field]")) {
        updateShipProcess(event.target.dataset.shipId, { [event.target.dataset.shipDateField]: event.target.value });
      }
      if (event.target.matches("[data-ship-stage-field]")) {
        updateShipProcess(event.target.dataset.shipId, { processStage: event.target.value });
      }
      if (event.target.matches("[data-ship-sort-mode]")) {
        setShipSortMode(event.target.value);
      }
    });

    async function submitInspection() {
      if (state.inspectionSubmitting) return toast("점검 제출 중입니다. 잠시만 기다려주세요.");
      const cat = categoryById(state.selectedCategoryId);
      if (!cat) return toast("점검 작업 유형을 다시 선택하세요.");
      const items = filteredChecklistItems(cat.id);
      const highMissing = items.filter((row) => row.risk === "high" && !state.draft.checks[row.id]);
      const pledgeRulesCount = pledgeRules().length;
      const pledgeChecked = pledgeRules().filter((_, index) => state.draft.pledgeChecks[index]).length;
      const signatureText = signatureLabel();
      if (!state.draft.worker.trim()) return toast("담당자명을 입력하세요.");
      if (!state.draft.shipNo) return toast("호선을 선택하세요.");
      if (pledgeChecked !== pledgeRulesCount) return toast("안전 서약 항목을 모두 확인하세요.");
      if (!signatureText) return toast("서명을 입력하거나 손가락으로 서명하세요.");
      if (highMissing.length) return toast("위험 항목을 모두 확인해야 제출할 수 있습니다.");
      if (!items.length) return toast("등록된 점검 항목이 없습니다.");
      state.inspectionSubmitting = true;
      const submitButton = document.querySelector("[data-action='submit-inspection']");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "제출 중";
      }

      try {
        const now = serverNow();
        const checkedCount = items.filter((row) => state.draft.checks[row.id]).length;
        const inspectionId = uid("inspection");
        const completion = Math.round(checkedCount / items.length * 100);
        const warnings = items.filter((row) => !state.draft.checks[row.id] && row.risk !== "low").length;
        const selectedTools = sanitizeToolIds(state.draft.selectedToolIds)
          .map((id) => toolById(id))
          .filter((tool) => tool && tool.deleted !== true)
          .map((tool) => ({ id: tool.id, name: tool.name }));
        const signatureImage = isSignatureImage(state.draft.pledgeSignature) ? state.draft.pledgeSignature : "";
        const pledgeText = `${pledgeRules().map((rule) => `[확인] ${rule}`).join("\n")}\n서명: ${signatureText}`;
        const inspection = {
          id: inspectionId,
          categoryId: cat.id,
          categoryLabel: cat.label || "",
          categoryIcon: cat.icon || "",
          categoryColor: cat.color || "",
          worker: state.draft.worker.trim(),
          shipNo: state.draft.shipNo,
          safetyPledge: pledgeText,
          signatureImage,
          signatureText: signatureImage ? "" : signatureText,
          date: localDate(now),
          time: recordTime(now),
          status: checkedCount === items.length ? "완료" : "미완료",
          warnings,
          completion,
          tools: selectedTools,
          createdAtMs: Date.now(),
          createdAt: now.toISOString(),
        };

        const inspectionItems = items.map((row) => ({
          id: uid("inspectionItem"),
          inspectionId,
          itemId: row.id,
          checked: Boolean(state.draft.checks[row.id]),
          risk: row.risk,
          text: row.text,
          sectionTitle: sectionsFor(cat.id).find((section) => section.id === row.sectionId)?.title || "",
        }));

        state.inspections.unshift(inspection);
        state.inspectionItems.push(...inspectionItems);

        state.lastInspectionId = inspectionId;
        state.draft = createDraft();
        state.selectedCategoryId = null;
        persist();
        state.inspectionSubmitting = false;
        changeView("pledgeComplete");
        toast("점검이 제출되었습니다.");
        syncInspectionHistory(inspection, inspectionItems);
      } catch (error) {
        state.inspectionSubmitting = false;
        console.error(error);
        toast("점검 제출 중 오류가 발생했습니다.");
        refreshCheckSubmitControls();
      }
    }

    async function submitUnsafeIssue() {
      syncUnsafeDraftFromDom();
      saveUnsafeDraft();
      const missing = unsafeMissingFields(3);
      if (missing.length) return toast(flowRequiredText(missing));
      const errors = ISSUE_MATERIAL_RULES.validateUnsafeDraft(state.unsafeDraft);
      if (errors.length) return toast(errors[0]);
      const input = $("unsafePhotos");
      const files = state.unsafePhotoFiles?.length ? state.unsafePhotoFiles : Array.from(input?.files || []);
      if (files.length > ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS) return toast("사진은 최대 3개까지 첨부할 수 있습니다.");
      if (!files.length && !confirm("사진 없이 등록하시겠습니까?")) return;
      const now = serverNow().toISOString();
      const id = uid("unsafe");
      const snapshot = ISSUE_MATERIAL_RULES.createWorkerSnapshot(state.unsafeDraft.workerId, state.workers);
      const row = {
        id,
        shipNo: state.unsafeDraft.shipNo,
        content: state.unsafeDraft.content.trim(),
        ...snapshot,
        status: ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0],
        adminMemo: "",
        createdAt: now,
        updatedAt: now,
        completedAt: "",
      };
      row.statusHistory = ISSUE_MATERIAL_RULES.buildRecordTimeline(row, { initialStatus: ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0] });
      state.unsafeIssues.unshift(row);
      state.lastUnsafeIssueId = id;
      state.unsafeDraft = createUnsafeDraft();
      state.unsafePhotoFiles = [];
      persist();
      render();
      scrollScreenTop();
      replaceRouteState();
      toast("불안전요소가 접수되었습니다.");
      syncUnsafeIssue(row, files);
    }

    async function submitMissingMaterial() {
      syncMaterialDraftFromDom();
      saveMaterialDraft();
      const missing = materialMissingFields(4);
      if (missing.length) return toast(flowRequiredText(missing));
      if (!isValidMaterialQuantity(state.materialDraft.quantity)) return toast("수량은 0보다 큰 숫자로 입력하세요.");
      state.materialDraft.content = materialDraftContent();
      const errors = ISSUE_MATERIAL_RULES.validateMaterialDraft(state.materialDraft);
      if (errors.length) return toast(errors[0]);
      const now = serverNow().toISOString();
      const id = uid("material");
      const snapshot = ISSUE_MATERIAL_RULES.createWorkerSnapshot(state.materialDraft.workerId, state.workers);
      const type = materialTypeMeta(state.materialDraft.materialType);
      const row = {
        id,
        shipNo: state.materialDraft.shipNo,
        materialName: state.materialDraft.materialName.trim(),
        materialType: type.id,
        materialTypeLabel: type.label,
        spec: String(state.materialDraft.spec || "").trim(),
        quantity: String(state.materialDraft.quantity || "").trim(),
        unit: String(state.materialDraft.unit || "EA").trim(),
        detail: String(state.materialDraft.detail || "").trim(),
        content: state.materialDraft.content.trim(),
        ...snapshot,
        status: ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[0],
        adminMemo: "",
        createdAt: now,
        updatedAt: now,
        completedAt: "",
      };
      row.statusHistory = ISSUE_MATERIAL_RULES.buildRecordTimeline(row, { initialStatus: ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[0] });
      state.missingMaterials.unshift(row);
      state.lastMaterialId = id;
      state.materialDraft = createMaterialDraft();
      persist();
      render();
      scrollScreenTop();
      replaceRouteState();
      toast("호선자재 누락이 접수되었습니다.");
      syncMissingMaterial(row);
    }

    function setAdminMode(enabled, email = "") {
      const wasAdmin = state.adminMode;
      state.adminMode = Boolean(enabled);
      state.adminEmail = enabled ? email : "";
      if (state.adminMode && !wasAdmin && isNarrowViewport()) {
        state.screenMode = "mobile";
        localStorage.setItem(storeKey("screenMode"), state.screenMode);
      }
      if (state.adminMode && !wasAdmin) {
        state.manageTab = "unsafe";
        state.unsafeDetailId = "";
        state.unsafeFilters.status = "";
        saveJson("manageTab", state.manageTab);
        saveJson("unsafeFilters", state.unsafeFilters);
      }
      saveAdminMode(state.adminMode);
      if (!enabled) {
        state.toolAddOpen = false;
        state.categoryAddOpen = false;
        state.editToolId = null;
        state.editCategoryId = null;
        state.editSectionId = null;
        state.editItemId = null;
        state.openAddItemSectionIds = [];
        state.categoryVisualOpen = false;
        state.selectedHistoryIds = [];
      }
      applyScreenMode();
    }

    function requestAdminAccess() {
      const password = prompt("관리자 비밀번호를 입력하세요.");
      if (password === null) return false;
      if (String(password).trim() !== ADMIN_PASSWORD) {
        toast("관리자 비밀번호가 올바르지 않습니다.");
        return false;
      }

      setAdminMode(true, "비밀번호 인증");
      toast("관리자 수정 모드가 켜졌습니다.");
      render();
      return true;
    }

    function toggleAdminMode() {
      if (state.adminMode) {
        setAdminMode(false);
        toast("관리자 수정 모드가 꺼졌습니다.");
        render();
        return;
      }
      requestAdminAccess();
    }

    function requireAdmin() {
      if (state.adminMode) return true;
      toast("관리자 비밀번호로 수정 모드를 켜주세요.");
      return false;
    }

    function addWorker() {
      if (!requireAdmin()) return;
      const name = $("workerName")?.value.trim() || "";
      const team = $("workerTeam")?.value.trim() || "";
      if (!name) return toast("작업자 이름을 입력하세요.");
      const now = serverNow().toISOString();
      state.workers.push({ id: uid("worker"), name, team, createdAt: now, updatedAt: now });
      persistAndSync("workers");
      render();
      toast("작업자를 추가했습니다.");
    }

    function editWorker(id) {
      if (!requireAdmin()) return;
      const worker = state.workers.find((row) => row.id === id);
      if (!worker) return;
      const name = prompt("작업자 이름", worker.name);
      if (name === null) return;
      const team = prompt("소속/팀", worker.team || "");
      if (team === null) return;
      const cleanName = name.trim();
      if (!cleanName) return toast("작업자 이름을 입력하세요.");
      worker.name = cleanName;
      worker.team = team.trim();
      worker.updatedAt = serverNow().toISOString();
      persistAndSync("workers");
      render();
      toast("작업자를 수정했습니다.");
    }

    async function deleteWorker(id) {
      if (!requireAdmin()) return;
      const worker = state.workers.find((row) => row.id === id);
      if (!worker) return;
      if (!confirm(`${worker.name} 작업자를 삭제할까요? 기존 기록의 등록자 정보는 유지됩니다.`)) return;
      state.workers = state.workers.filter((row) => row.id !== id);
      if (state.unsafeDraft.workerId === id) state.unsafeDraft.workerId = "";
      if (state.materialDraft.workerId === id) state.materialDraft.workerId = "";
      persist();
      await deleteRemoteRows("workers", [id]);
      render();
      toast("작업자를 삭제했습니다.");
    }

    function updateRecordFilter(token, value) {
      const [kind, key] = token.split(":");
      const target = kind === "unsafe" ? state.unsafeFilters : state.materialFilters;
      target[key] = value;
      saveJson(kind === "unsafe" ? "unsafeFilters" : "materialFilters", target);
      render();
    }

    function requireAdminWrite() {
      return requireAdmin();
    }

    function xmlEscape(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function excelColumnName(index) {
      let value = index + 1;
      let name = "";
      while (value > 0) {
        const mod = (value - 1) % 26;
        name = String.fromCharCode(65 + mod) + name;
        value = Math.floor((value - mod) / 26);
      }
      return name;
    }

    function excelCellXml(value, rowIndex, columnIndex, style = "") {
      const ref = `${excelColumnName(columnIndex)}${rowIndex + 1}`;
      if (typeof value === "number" && Number.isFinite(value)) {
        return `<c r="${ref}"${style}><v>${value}</v></c>`;
      }
      return `<c r="${ref}" t="inlineStr"${style}><is><t>${xmlEscape(value)}</t></is></c>`;
    }

    function worksheetXml(headers, rows) {
      const allRows = [headers, ...rows.map((row) => headers.map((key) => row[key] ?? ""))];
      const rowXml = allRows.map((values, rowIndex) => {
        const style = rowIndex === 0 ? ' s="1"' : "";
        return `<row r="${rowIndex + 1}">${values.map((value, columnIndex) => excelCellXml(value, rowIndex, columnIndex, style)).join("")}</row>`;
      }).join("");
      const dimension = `A1:${excelColumnName(Math.max(headers.length - 1, 0))}${Math.max(allRows.length, 1)}`;
      const cols = headers.map((header, index) => `<col min="${index + 1}" max="${index + 1}" width="${Math.min(Math.max(String(header).length + 6, 12), 34)}" customWidth="1"/>`).join("");
      return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="${dimension}"/>
  <cols>${cols}</cols>
  <sheetData>${rowXml}</sheetData>
</worksheet>`;
    }

    function crc32(bytes) {
      if (!crc32.table) {
        crc32.table = Array.from({ length: 256 }, (_, index) => {
          let value = index;
          for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
          return value >>> 0;
        });
      }
      let crc = 0xffffffff;
      bytes.forEach((byte) => { crc = crc32.table[(crc ^ byte) & 0xff] ^ (crc >>> 8); });
      return (crc ^ 0xffffffff) >>> 0;
    }

    function uint16(value) {
      return [value & 0xff, (value >>> 8) & 0xff];
    }

    function uint32(value) {
      return [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];
    }

    function concatBytes(parts) {
      const size = parts.reduce((sum, part) => sum + part.length, 0);
      const output = new Uint8Array(size);
      let offset = 0;
      parts.forEach((part) => {
        output.set(part, offset);
        offset += part.length;
      });
      return output;
    }

    function createZip(files) {
      const encoder = new TextEncoder();
      const localParts = [];
      const centralParts = [];
      let offset = 0;
      files.forEach((file) => {
        const name = encoder.encode(file.name);
        const data = encoder.encode(file.content);
        const crc = crc32(data);
        const localHeader = new Uint8Array([
          ...uint32(0x04034b50), ...uint16(20), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0),
          ...uint32(crc), ...uint32(data.length), ...uint32(data.length), ...uint16(name.length), ...uint16(0),
        ]);
        localParts.push(localHeader, name, data);
        const centralHeader = new Uint8Array([
          ...uint32(0x02014b50), ...uint16(20), ...uint16(20), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0),
          ...uint32(crc), ...uint32(data.length), ...uint32(data.length), ...uint16(name.length), ...uint16(0), ...uint16(0),
          ...uint16(0), ...uint16(0), ...uint32(0), ...uint32(offset),
        ]);
        centralParts.push(centralHeader, name);
        offset += localHeader.length + name.length + data.length;
      });
      const central = concatBytes(centralParts);
      const locals = concatBytes(localParts);
      const end = new Uint8Array([
        ...uint32(0x06054b50), ...uint16(0), ...uint16(0), ...uint16(files.length), ...uint16(files.length),
        ...uint32(central.length), ...uint32(locals.length), ...uint16(0),
      ]);
      return concatBytes([locals, central, end]);
    }

    function createXlsxBlob(sheetName, headers, rows) {
      const safeSheetName = xmlEscape(String(sheetName || "Data").slice(0, 31));
      const files = [
        {
          name: "[Content_Types].xml",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
        },
        {
          name: "_rels/.rels",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
        },
        {
          name: "xl/workbook.xml",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="${safeSheetName}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
        },
        {
          name: "xl/_rels/workbook.xml.rels",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
        },
        {
          name: "xl/styles.xml",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`,
        },
        { name: "xl/worksheets/sheet1.xml", content: worksheetXml(headers, rows) },
      ];
      return new Blob([createZip(files)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    }

    function downloadExport(filename, rows, sheetName = "Data") {
      if (!rows.length) return toast("내보낼 데이터가 없습니다.");
      const headers = [...rows.reduce((set, row) => {
        Object.keys(row).forEach((key) => set.add(key));
        return set;
      }, new Set())];
      const blob = createXlsxBlob(sheetName, headers, rows);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("Excel 파일을 만들었습니다.");
    }

    function setMonthlyWorkerMonth(mode) {
      const currentMonth = monthKeyForDate();
      const selected = selectedMonthlyWorkerMonth();
      if (mode === "current") state.selectedMonthlyWorkerMonth = currentMonth;
      if (mode === "prev") state.selectedMonthlyWorkerMonth = monthKeyOffset(selected, -1);
      if (mode === "next") state.selectedMonthlyWorkerMonth = monthKeyOffset(selected, 1) <= currentMonth ? monthKeyOffset(selected, 1) : selected;
      render();
    }

    function toggleMonthlyPublicHolidayMode() {
      const restState = monthlyWorkerRestDayState();
      saveMonthlyWorkerRestDays({ ...restState, useKoreanPublicHolidays: !restState.useKoreanPublicHolidays });
      render();
    }

    function addCustomMonthlyRestDay(date) {
      const value = dateOnly(date);
      const range = currentMonthRange(selectedMonthlyWorkerMonth());
      if (!value || value < range.start || value > range.end) return toast("선택 월 안의 날짜를 선택하세요.");
      const restState = monthlyWorkerRestDayState();
      saveMonthlyWorkerRestDays({ ...restState, customRestDays: [...restState.customRestDays, value] });
      render();
      toast("현장 휴무일을 추가했습니다.");
    }

    function deleteCustomMonthlyRestDay(date) {
      const restState = monthlyWorkerRestDayState();
      saveMonthlyWorkerRestDays({ ...restState, customRestDays: restState.customRestDays.filter((day) => day !== date) });
      render();
      toast("현장 휴무일을 삭제했습니다.");
    }

    function exportMonthlyWorkerAnalytics() {
      if (!requireAdmin()) return;
      const stats = monthlyWorkerInspectionStats();
      const headers = ["작업자", "소속/팀", "월간 점검률", "완료일 수", "미완료일 수", "휴무일 수", "대상일 수"];
      for (let day = 1; day <= 31; day += 1) headers.push(`${day}일`);
      const rows = stats.workers.map((worker) => {
        const row = {
          "작업자": worker.name,
          "소속/팀": worker.team || "-",
          "월간 점검률": `${worker.rate}%`,
          "완료일 수": worker.counts.done,
          "미완료일 수": worker.counts.partial + worker.counts.missing,
          "휴무일 수": worker.counts.rest,
          "대상일 수": worker.counts.target,
        };
        for (let day = 1; day <= 31; day += 1) {
          const status = worker.dayStatuses.find((entry) => entry.day === day)?.status || "excluded";
          row[`${day}일`] = monthlyExportStatus(status);
        }
        return row;
      });
      if (!rows.length) return toast("내보낼 월간 작업자 점검 데이터가 없습니다.");
      const blob = createXlsxBlob("월간작업자점검", headers, rows);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `monthly-worker-inspections-${stats.range.monthKey}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("월간 작업자 점검 Excel 파일을 만들었습니다.");
    }

    function exportRecords(kind) {
      if (!requireAdmin()) return;
      const date = today();
      if (kind === "monthly-worker-analytics") return exportMonthlyWorkerAnalytics();
      if (kind === "unsafe") {
        const rows = ISSUE_MATERIAL_RULES.filterRecords(state.unsafeIssues, state.unsafeFilters)
          .map((row) => ({
            id: row.id,
            shipNo: row.shipNo,
            status: row.status,
            worker: row.workerNameSnapshot,
            team: row.workerTeamSnapshot,
            content: row.content,
            memo: row.adminMemo || "",
            createdAt: formatDateTime(row.createdAt),
            updatedAt: formatDateTime(row.updatedAt),
          }));
        return downloadExport(`unsafe-issues-${date}.xlsx`, rows, "불안전요소");
      }
      if (kind === "materials") {
        const rows = ISSUE_MATERIAL_RULES.filterRecords(state.missingMaterials, state.materialFilters)
          .map((row) => ({
            id: row.id,
            shipNo: row.shipNo,
            status: row.status,
            materialName: row.materialName,
            quantity: materialQuantity(row),
            worker: row.workerNameSnapshot,
            team: row.workerTeamSnapshot,
            content: row.content,
            memo: row.adminMemo || "",
            createdAt: formatDateTime(row.createdAt),
            updatedAt: formatDateTime(row.updatedAt),
          }));
        return downloadExport(`missing-materials-${date}.xlsx`, rows, "자재누락");
      }
      if (kind === "pledge") {
        const rows = pledgeDashboardRows().map((row) => ({
          worker: row.name,
          team: row.team,
          shipNo: row.shipNo,
          time: row.time,
          status: row.done ? "완료" : "미완료",
          pledge: row.pledge,
        }));
        return downloadExport(`safety-pledges-${date}.xlsx`, rows, "안전서약");
      }
      const todayRows = state.inspections.filter((row) => row.date === date);
      const rows = [
        { metric: "todayDone", value: todayRows.filter((row) => row.status === "완료").length },
        { metric: "unsafeOpen", value: state.unsafeIssues.filter((row) => row.status !== ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2]).length },
        { metric: "materialOpen", value: state.missingMaterials.filter((row) => row.status !== ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2]).length },
        { metric: "ships", value: state.ships.length },
      ];
      return downloadExport(`safety-analytics-${date}.xlsx`, rows, "통계");
    }

    async function bulkUpdateMaterialStatus() {
      if (!requireAdminWrite()) return;
      const rows = ISSUE_MATERIAL_RULES.filterRecords(state.missingMaterials, state.materialFilters);
      if (!rows.length) return toast("변경할 자재 누락 기록이 없습니다.");
      const statuses = ISSUE_MATERIAL_RULES.MATERIAL_STATUSES;
      const selected = prompt(`변경할 상태를 입력하세요: ${statuses.join(" / ")}`, statuses[1]);
      if (selected === null) return;
      const status = selected.trim();
      if (!statuses.includes(status)) return toast("사용할 수 없는 상태입니다.");
      const memo = prompt("일괄 변경 메모", "상태 일괄 변경") || "";
      const updatedAt = serverNow().toISOString();
      const doneStatus = statuses[2];
      rows.forEach((row) => {
        const previousStatus = row.status;
        row.status = status;
        row.adminMemo = memo.trim();
        row.updatedAt = updatedAt;
        row.completedAt = status === doneStatus ? (row.completedAt || updatedAt) : "";
        if (previousStatus !== status || row.adminMemo) {
          row.statusHistory = ISSUE_MATERIAL_RULES.appendStatusHistoryEntry(row, {
            status,
            memo: row.adminMemo,
            changedAt: updatedAt,
            actor: "관리자",
          }, { initialStatus: statuses[0] });
        }
      });
      await persistAndSync("missingMaterials");
      render();
      toast(`${rows.length}건의 상태를 변경했습니다.`);
    }

    function editPledgeTemplate() {
      if (!requireAdminWrite()) return;
      state.pledgeTemplateEditing = true;
      render();
    }

    function savePledgeTemplate() {
      if (!requireAdminWrite()) return;
      const next = document.querySelector("#pledgeRulesInput")?.value || "";
      const rules = next.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      if (!rules.length) return toast("서약 문구를 1개 이상 입력하세요.");
      saveJson("pledgeRules", rules);
      state.pledgeTemplateEditing = false;
      render();
      toast("서약 양식을 저장했습니다.");
    }

    function cancelPledgeTemplate() {
      state.pledgeTemplateEditing = false;
      render();
    }

    function openAnalyticsFilters() {
      state.manageTab = "unsafe";
      state.unsafeFilters.status = ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0];
      saveJson("manageTab", state.manageTab);
      saveJson("unsafeFilters", state.unsafeFilters);
      changeView("manage");
    }

    function openAnalyticsDetail() {
      state.manageTab = "unsafe";
      state.unsafeFilters.status = "";
      saveJson("manageTab", state.manageTab);
      saveJson("unsafeFilters", state.unsafeFilters);
      changeView("manage");
    }

    function saveAdminRecord(token, options = {}) {
      if (!requireAdminWrite()) return;
      const [kind, id] = token.split(":");
      const rows = kind === "unsafe" ? state.unsafeIssues : state.missingMaterials;
      const row = rows.find((item) => item.id === id);
      if (!row) return;
      const status = document.querySelector(`[data-record-status="${cssEscape(token)}"]`)?.value || row.status;
      const memo = document.querySelector(`[data-record-memo="${cssEscape(token)}"]`)?.value || "";
      const previousStatus = row.status;
      const previousMemo = row.adminMemo || "";
      const nextMemo = memo.trim();
      const statusChanged = status !== previousStatus;
      const memoChanged = nextMemo !== previousMemo;
      if (options.requireStatusChange && !statusChanged) {
        toast("상태를 변경한 뒤 완료 처리할 수 있습니다.");
        return;
      }
      if (!statusChanged && !memoChanged) {
        toast("변경된 내용이 없습니다.");
        return;
      }
      const updatedAt = serverNow().toISOString();
      row.status = status;
      row.adminMemo = nextMemo;
      row.updatedAt = updatedAt;
      const doneStatus = kind === "unsafe" ? ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2] : ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2];
      row.completedAt = status === doneStatus ? (statusChanged ? updatedAt : (row.completedAt || updatedAt)) : "";
      const statuses = kind === "unsafe" ? ISSUE_MATERIAL_RULES.UNSAFE_STATUSES : ISSUE_MATERIAL_RULES.MATERIAL_STATUSES;
      row.statusHistory = statusChanged || memoChanged
        ? ISSUE_MATERIAL_RULES.appendStatusHistoryEntry(row, {
            status,
            memo: row.adminMemo,
            changedAt: updatedAt,
            actor: "관리자",
          }, { initialStatus: statuses[0] })
        : ISSUE_MATERIAL_RULES.buildRecordTimeline(row, { initialStatus: statuses[0] });
      persistAndSync(kind === "unsafe" ? "unsafeIssues" : "missingMaterials");
      render();
      toast("기록을 저장했습니다.");
    }

    async function deleteAdminRecord(token) {
      if (!requireAdmin()) return;
      const [kind, id] = token.split(":");
      const label = kind === "unsafe" ? "불안전요소" : "호선자재 누락";
      if (!confirm(`${label} 기록을 영구 삭제할까요?`)) return;
      if (kind === "unsafe") {
        await deleteUnsafePhotos(id);
        state.unsafeIssues = state.unsafeIssues.filter((row) => row.id !== id);
        state.issuePhotos = state.issuePhotos.filter((row) => row.targetId !== id);
        await deleteRemoteRows("unsafeIssues", [id]);
      } else {
        state.missingMaterials = state.missingMaterials.filter((row) => row.id !== id);
        await deleteRemoteRows("missingMaterials", [id]);
      }
      persist();
      render();
      toast("기록을 삭제했습니다.");
    }

    async function resetHistory() {
      if (!requireAdmin()) return;
      if (!confirm("모든 점검 이력을 초기화할까요? 작업 유형, 섹션, 항목, 호선은 유지됩니다.")) return;
      state.inspections = [];
      state.inspectionItems = [];
      state.historyDetailId = null;
      state.historyScope = "all";
      state.historyFilter = "all";
      state.selectedHistoryIds = [];
      persist();
      localStorage.removeItem(OLD_KEYS.history);
      if (isSyncConfigured()) await resetRemoteHistory();
      render();
      replaceRouteState();
      toast("점검 이력을 초기화했습니다.");
    }

    function visibleHistoryRows() {
      return filteredHistoryRows();
    }

    function toggleVisibleHistory(checked) {
      if (!state.adminMode) return;
      const visibleIds = visibleHistoryRows().map((row) => row.id);
      const selected = new Set(state.selectedHistoryIds);
      visibleIds.forEach((id) => checked ? selected.add(id) : selected.delete(id));
      state.selectedHistoryIds = [...selected];
      render();
    }

    function toggleHistorySelection(id, checked) {
      if (!state.adminMode) return;
      const selected = new Set(state.selectedHistoryIds);
      checked ? selected.add(id) : selected.delete(id);
      state.selectedHistoryIds = [...selected];
      render();
    }

    function deleteSelectedHistory() {
      if (!requireAdmin()) return;
      const ids = new Set(state.selectedHistoryIds);
      if (!ids.size) return toast("삭제할 이력을 선택하세요.");
      if (!confirm(`선택한 점검 이력 ${ids.size}건을 삭제할까요?`)) return;
      state.inspections = state.inspections.filter((row) => !ids.has(row.id));
      state.inspectionItems = state.inspectionItems.filter((row) => !ids.has(row.inspectionId));
      state.selectedHistoryIds = [];
      persist();
      if (isSyncConfigured()) deleteRemoteHistory([...ids]);
      render();
      toast("선택한 이력을 삭제했습니다.");
    }

    function addShip() {
      if (!requireAdmin()) return;
      const rawLines = $("newShipNos").value.split(/\n+/).map((line) => line.trim()).filter(Boolean);
      const defaultType = resolveShipType("newShipType", "newShipCustom");
      if (!rawLines.length) return toast("호선 번호를 입력하세요.");
      const existing = new Set(state.ships.map((ship) => ship.no));
      let added = 0;
      let skipped = 0;
      rawLines.forEach((line) => {
        const parts = line.split(/[,\s]+/).filter(Boolean);
        const no = normalizeShipNo(parts[0] || "");
        const lineType = (parts.slice(1).join(" ") || defaultType).trim();
        if (!no || !lineType || existing.has(no)) {
          skipped += 1;
          return;
        }
        existing.add(no);
        state.ships.push({
          id: uid("ship"),
          no,
          type: lineType,
          note: "",
          processStage: "mounting",
          deliveryType: "",
          deliveryDate: "",
          lcDate: "",
          stDate: "",
          clDate: "",
          dlDate: "",
          createdAt: serverNow().toISOString(),
          order: state.ships.length + 1,
        });
        added += 1;
      });
      if (!added) return toast("추가된 호선이 없습니다. 호선 번호와 선종을 확인하세요.");
      persistAndSync("ships");
      render();
      toast(`호선 ${added}척을 추가했습니다.${skipped ? ` ${skipped}건은 중복/오류로 건너뛰었습니다.` : ""}`);
    }

    async function deleteShip(id) {
      if (!requireAdmin()) return;
      const ship = state.ships.find((row) => row.id === id);
      if (!ship) return;
      if (!confirm(`${ship.no} 호선을 삭제할까요? 기존 점검 이력은 유지됩니다.`)) return;
      state.ships = state.ships.filter((row) => row.id !== id);
      if (state.draft.shipNo === ship.no) state.draft.shipNo = "";
      persist();
      if (isSyncConfigured()) {
        await deleteRemoteShips([id]);
      }
      render();
      toast(`${ship.no} 호선을 삭제했습니다.`);
    }

    function updateShipProcess(id, patch) {
      if (!requireAdmin()) return;
      state.ships = state.ships.map((ship) => {
        if (ship.id !== id) return ship;
        const next = { ...ship, ...patch };
        next.deliveryType = shipDeliveryType(next);
        next.deliveryDate = shipDeliveryDate(next);
        return next;
      });
      cleanupDeliveredShips(false);
      persistAndSync("ships");
      render();
    }

    function addCategory() {
      if (!requireAdmin()) return;
      const label = $("catLabel").value.trim();
      if (!label) return toast("작업 유형명을 입력하세요.");
      const id = uid("cat");
      state.categories.push({
        id,
        label,
        icon: $("catIcon").value.trim() || label.slice(0, 1).toUpperCase(),
        color: selectedColor(),
        requireToolCheck: true,
        toolNature: "선행",
        toolIds: [],
        order: state.categories.length + 1,
      });
      state.sections.push({ id: uid("section"), categoryId: id, title: "기본 점검", order: 1 });
      persistAndSync(["categories", "sections"]);
      state.categoryAddOpen = false;
      state.manageCategoryId = id;
      render();
    }

    function saveCategoryIcon() {
      if (!requireAdmin()) return;
      const cat = categoryById(state.manageCategoryId);
      if (!cat) return;
      const icon = $("editCatIcon").value.trim() || cat.label.slice(0, 1).toUpperCase();
      const toolNature = normalizeToolNature($("editCatToolNature")?.value || cat.toolNature);
      state.categories = state.categories.map((row) => row.id === cat.id ? { ...row, icon, toolNature } : row);
      persistAndSync("categories");
      render();
      toast("아이콘과 공기구 기준을 저장했습니다.");
    }

    function editCategory(id) {
      if (!requireAdmin()) return;
      state.editCategoryId = id;
      render();
    }

    function saveCategory(id) {
      if (!requireAdmin()) return;
      const cat = categoryById(id);
      if (!cat) return;
      const label = $(`editCategoryLabel_${id}`).value.trim();
      if (!label) return toast("작업 유형명을 입력하세요.");
      const duplicate = state.categories.some((row) => row.id !== id && row.label === label);
      if (duplicate) return toast("같은 이름의 작업 유형이 이미 있습니다.");
      state.categories = state.categories.map((row) => row.id === id ? {
        ...row,
        label,
      } : row);
      state.editCategoryId = null;
      persistAndSync("categories");
      render();
      toast("작업 유형명을 수정했습니다.");
    }

    function toggleCategoryTools(id) {
      const openIds = new Set(state.categoryToolAssignmentOpenIds);
      if (openIds.has(id)) {
        openIds.delete(id);
      } else {
        openIds.add(id);
      }
      state.categoryToolAssignmentOpenIds = [...openIds];
      render();
    }

    function saveCategoryTools(id) {
      if (!requireAdmin()) return;
      const cat = categoryById(id);
      if (!cat) return;
      state.categories = state.categories.map((row) => row.id === id ? {
        ...row,
        toolIds: selectedCategoryToolIds(`category_${id}`),
      } : row);
      state.categoryToolAssignmentOpenIds = state.categoryToolAssignmentOpenIds.filter((openId) => openId !== id);
      persistAndSync("categories");
      render();
      toast(`${cat.label} 공기구 지정을 저장했습니다.`);
    }

    async function deleteCategory(id) {
      if (!requireAdmin()) return;
      const cat = categoryById(id);
      if (!cat) return;
      if (!confirm(`${cat.label} 작업 유형을 삭제할까요? 기존 점검 이력은 유지됩니다.`)) return;
      const sectionIds = state.sections.filter((row) => row.categoryId === id).map((row) => row.id);
      const itemIds = state.items.filter((row) => row.categoryId === id).map((row) => row.id);
      state.categories = state.categories.filter((row) => row.id !== id);
      state.sections = state.sections.filter((row) => row.categoryId !== id);
      state.items = state.items.filter((row) => row.categoryId !== id);
      if (state.manageCategoryId === id) state.manageCategoryId = null;
      persist();
      if (isSyncConfigured()) {
        await deleteRemoteRows("items", itemIds);
        await deleteRemoteRows("sections", sectionIds);
        await deleteRemoteRows("categories", [id]);
      }
      render();
      toast("작업 유형을 삭제했습니다.");
    }

    function addSection() {
      if (!requireAdmin()) return;
      const title = $("newSectionTitle").value.trim();
      if (!title) return toast("섹션명을 입력하세요.");
      if (sectionsFor(state.manageCategoryId).some((section) => section.title === title)) return toast("같은 이름의 섹션이 이미 있습니다.");
      state.sections.push({
        id: uid("section"),
        categoryId: state.manageCategoryId,
        title,
        order: sectionsFor(state.manageCategoryId).length + 1,
      });
      persistAndSync("sections");
      render();
    }

    function editSection(id) {
      if (!requireAdmin()) return;
      state.editSectionId = id;
      state.editItemId = null;
      render();
    }

    function saveSection(id) {
      if (!requireAdmin()) return;
      const section = state.sections.find((row) => row.id === id);
      if (!section) return;
      const title = $(`editSectionTitle_${id}`).value.trim();
      if (!title) return toast("섹션명을 입력하세요.");
      const duplicate = sectionsFor(section.categoryId).some((row) => row.id !== id && row.title === title);
      if (duplicate) return toast("같은 이름의 섹션이 이미 있습니다.");
      state.sections = state.sections.map((row) => row.id === id ? { ...row, title } : row);
      state.editSectionId = null;
      persistAndSync("sections");
      render();
      toast("섹션명을 수정했습니다.");
    }

    function deleteSection(id) {
      if (!requireAdmin()) return;
      const section = state.sections.find((row) => row.id === id);
      if (!section) return;
      const count = state.items.filter((row) => row.sectionId === id && row.active !== false).length;
      if (!confirm(`${section.title} 섹션과 항목 ${count}개를 삭제할까요?`)) return;
      state.sections = state.sections.filter((row) => row.id !== id);
      state.items = state.items.map((row) => row.sectionId === id ? { ...row, active: false } : row);
      persistAndSync(["sections", "items"]);
      render();
    }

    function addChecklistItem(sectionId) {
      if (!requireAdmin()) return;
      const textNode = $(`itemText_${sectionId}`);
      const riskNode = $(`itemRisk_${sectionId}`);
      const requiredNode = $(`itemRequired_${sectionId}`);
      const visibilityNode = $(`itemVisibility_${sectionId}`);
      const text = textNode.value.trim();
      if (!text) return toast("점검 항목 내용을 입력하세요.");
      const section = state.sections.find((row) => row.id === sectionId);
      if (!section) return;
      const risk = riskNode.value;
      const requiredChoice = requiredNode.value;
      state.items.push({
        id: uid("item"),
        categoryId: section.categoryId,
        sectionId,
        text,
        risk,
        required: requiredChoice === "yes" || (requiredChoice === "auto" && risk === "high"),
        active: true,
        toolIds: selectedItemToolIds(`add_${sectionId}`),
        visibilityCondition: normalizeVisibilityCondition(visibilityNode?.value),
        order: activeItems(section.categoryId).filter((row) => row.sectionId === sectionId).length + 1,
      });
      persistAndSync("items");
      render();
    }

    function saveChecklistItem(id) {
      if (!requireAdmin()) return;
      const text = $(`editItemText_${id}`).value.trim();
      const risk = $(`editItemRisk_${id}`).value;
      const required = $(`editItemRequired_${id}`).value === "yes";
      const visibilityCondition = normalizeVisibilityCondition($(`editItemVisibility_${id}`)?.value);
      const toolIds = selectedItemToolIds(`edit_${id}`);
      if (!text) return toast("점검 항목 내용을 입력하세요.");
      state.items = state.items.map((row) => row.id === id ? {
        ...row,
        text,
        risk,
        required,
        toolIds,
        visibilityCondition,
      } : row);
      persistAndSync("items");
      render();
      toast("점검 항목을 수정했습니다.");
    }

    function deleteChecklistItem(id) {
      if (!requireAdmin()) return;
      const row = state.items.find((itemRow) => itemRow.id === id);
      if (!row) return;
      if (!confirm("이 점검 항목을 삭제할까요? 기존 점검 이력은 유지됩니다.")) return;
      state.items = state.items.map((itemRow) => itemRow.id === id ? { ...itemRow, active: false } : itemRow);
      persistAndSync("items");
      render();
    }

    function addTool() {
      if (!requireAdmin()) return;
      const input = $("newToolName");
      const nature = normalizeToolNature($("newToolNature")?.value);
      const name = input?.value.trim() || "";
      if (!name) return toast("공기구/준비물 이름을 입력하세요.");
      state.tools.push({
        id: uid("tool"),
        categoryId: null,
        name,
        nature,
        order: activeTools().length + 1,
        deleted: false,
      });
      input.value = "";
      state.toolAddOpen = false;
      persistAndSync("tools");
      render();
      toast("공기구/준비물을 추가했습니다.");
    }

    function saveTool(id) {
      if (!requireAdmin()) return;
      const input = $(`toolName_${id}`);
      const name = input?.value.trim() || "";
      const nature = normalizeToolNature($(`toolNature_${id}`)?.value);
      if (!name) return toast("공기구/준비물 이름을 입력하세요.");
      state.tools = state.tools.map((row) => row.id === id ? { ...row, name, nature } : row);
      state.editToolId = null;
      persistAndSync("tools");
      render();
      toast("공기구/준비물을 수정했습니다.");
    }

    function deleteTool(id) {
      if (!requireAdmin()) return;
      const tool = toolById(id);
      if (!tool) return;
      if (!confirm(`${tool.name} 공기구/준비물을 삭제할까요?`)) return;
      state.tools = state.tools.map((row) => row.id === id ? { ...row, deleted: true } : row);
      state.items = state.items.map((row) => ({ ...row, toolIds: sanitizeToolIds(row.toolIds).filter((toolId) => toolId !== id) }));
      state.draft.selectedToolIds = sanitizeToolIds(state.draft.selectedToolIds).filter((toolId) => toolId !== id);
      if (state.editToolId === id) state.editToolId = null;
      persistAndSync(["tools", "items"]);
      render();
      toast("공기구/준비물을 삭제했습니다.");
    }

    function toggleRequireToolCheck(categoryId) {
      if (!requireAdmin()) return;
      state.categories = state.categories.map((row) => row.id === categoryId ? { ...row, requireToolCheck: row.requireToolCheck === false } : row);
      persistAndSync("categories");
      render();
    }

    function addPictogram() {
      if (!requireAdmin()) return;
      const label = $("newPictogramLabel")?.value.trim() || "";
      const file = $("newPictogramFile")?.files?.[0];
      if (!label) return toast("픽토그램 이름을 입력하세요.");
      if (!file) return toast("이미지 파일을 선택하세요.");
      const reader = new FileReader();
      reader.onload = () => {
        state.pictograms.push({
          id: uid("pictogram"),
          label,
          src: String(reader.result || ""),
          source: "custom",
          order: pictogramLibrary().length + 1,
          deleted: false,
        });
        $("newPictogramLabel").value = "";
        $("newPictogramFile").value = "";
        persistAndSync("pictograms");
        render();
        toast("사용자 지정 픽토그램을 추가했습니다.");
      };
      reader.onerror = () => toast("이미지 파일을 읽지 못했습니다.");
      reader.readAsDataURL(file);
    }

    function savePictogram(id) {
      if (!requireAdmin()) return;
      const label = $(`pictogramLabel_${id}`)?.value.trim() || "";
      if (!label) return toast("픽토그램 이름을 입력하세요.");
      state.pictograms = state.pictograms.map((row) => row.id === id ? { ...row, label } : row);
      persistAndSync("pictograms");
      render();
      toast("픽토그램 이름을 수정했습니다.");
    }

    function deletePictogram(id) {
      if (!requireAdmin()) return;
      const pictogram = state.pictograms.find((row) => row.id === id);
      if (!pictogram || pictogram.source !== "custom") return toast("기본 픽토그램은 삭제할 수 없습니다.");
      if (!confirm(`${pictogram.label} 픽토그램을 삭제할까요?`)) return;
      const fallback = BUILT_IN_PICTOGRAMS[0]?.id || "blockAssembly";
      const affected = state.categories.some((row) => row.icon === id);
      state.pictograms = state.pictograms.map((row) => row.id === id ? { ...row, deleted: true } : row);
      state.categories = state.categories.map((row) => row.icon === id ? { ...row, icon: fallback } : row);
      persistAndSync(["pictograms", "categories"]);
      render();
      toast(affected ? "사용 중인 작업 유형은 기본 픽토그램으로 되돌렸습니다." : "픽토그램을 삭제했습니다.");
    }

    function photoExtension(file) {
      const name = String(file && file.name || "").toLowerCase();
      const ext = name.split(".").pop();
      return ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
    }

    function fileToDataUrl(file) {
      return new Promise((resolve) => {
        if (!file) return resolve("");
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      });
    }

    async function createPendingPhotoUploads(issueId, files, error) {
      const now = serverNow().toISOString();
      const entries = [];
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const dataUrl = file.size <= 900 * 1024 ? await fileToDataUrl(file) : "";
        entries.push({
          id: uid("pendingPhoto"),
          issueId,
          fileName: file.name || `photo-${index + 1}.${photoExtension(file)}`,
          fileType: file.type || "image/jpeg",
          fileSize: file.size || 0,
          dataUrl,
          status: "failed",
          errorMessage: error && error.message ? error.message : "upload failed",
          createdAt: now,
          updatedAt: now,
        });
      }
      state.pendingPhotoUploads = [
        ...state.pendingPhotoUploads.filter((row) => row.issueId !== issueId),
        ...entries,
      ];
      persist();
      return entries;
    }

    async function pendingUploadToFile(row) {
      if (!row.dataUrl) return null;
      const response = await fetch(row.dataUrl);
      const blob = await response.blob();
      return new File([blob], row.fileName || "photo.jpg", { type: row.fileType || blob.type || "image/jpeg" });
    }

    async function uploadUnsafePhotos(issueId, files) {
      const client = supabaseClient();
      if (!files.length) return [];
      if (!client) throw new Error("사진 업로드 서버 연결이 없습니다.");
      const uploaded = [];
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const storagePath = `unsafe/${issueId}/original-${index + 1}.${photoExtension(file)}`;
        const { error } = await client.storage.from(ISSUE_PHOTO_BUCKET).upload(storagePath, file, { upsert: true });
        if (error) throw error;
        uploaded.push({
          id: uid("photo"),
          targetType: "unsafe_issue",
          targetId: issueId,
          storageBucket: ISSUE_PHOTO_BUCKET,
          storagePath,
          sortOrder: index + 1,
          createdAt: serverNow().toISOString(),
        });
      }
      return uploaded;
    }

    function publicPhotoUrl(photo) {
      if (/^(https?:|data:|blob:)/.test(String(photo.storagePath || ""))) return photo.storagePath;
      const client = supabaseClient();
      if (!client || !photo.storagePath) return "";
      return client.storage.from(photo.storageBucket || ISSUE_PHOTO_BUCKET).getPublicUrl(photo.storagePath).data.publicUrl || "";
    }

    async function syncUnsafeIssue(row, files) {
      try {
        const photos = await uploadUnsafePhotos(row.id, files);
        state.issuePhotos.push(...photos);
        state.pendingPhotoUploads = state.pendingPhotoUploads.filter((item) => item.issueId !== row.id);
        persist();
        enqueueSyncRows("unsafeIssues", [row]);
        enqueueSyncRows("issuePhotos", photos);
        flushPendingSyncQueue();
        return true;
      } catch (error) {
        console.error(error);
        if (files.length) await createPendingPhotoUploads(row.id, files, error);
        enqueueSyncRows("unsafeIssues", [row]);
        flushPendingSyncQueue();
        toast("사진 업로드에 실패했습니다. 상세 화면에서 재시도할 수 있습니다.");
        return false;
      }
    }

    async function retryPendingPhotoUpload(event) {
      const issueId = event?.currentTarget?.dataset?.retryPhotoUpload || event?.target?.closest("[data-retry-photo-upload]")?.dataset.retryPhotoUpload || "";
      const pendingRows = pendingPhotoUploadsFor(issueId);
      if (!issueId || !pendingRows.length) return toast("재시도할 사진이 없습니다.");
      const files = (await Promise.all(pendingRows.map(pendingUploadToFile))).filter(Boolean);
      if (!files.length) return toast("사진 파일을 다시 첨부해야 재시도할 수 있습니다.");
      setSyncStatus("사진 재전송 중", "pending");
      const row = state.unsafeIssues.find((item) => item.id === issueId);
      const ok = await syncUnsafeIssue(row || { id: issueId }, files);
      render();
      toast(ok ? "사진 업로드를 다시 완료했습니다." : "사진 업로드 재시도에 실패했습니다.");
    }

    async function syncMissingMaterial(row) {
      persist();
      enqueueSyncRows("missingMaterials", [row]);
      flushPendingSyncQueue();
      return row;
    }

    async function deleteUnsafePhotos(id) {
      const client = supabaseClient();
      const photos = state.issuePhotos.filter((row) => row.targetType === "unsafe_issue" && row.targetId === id);
      if (!client || !photos.length) return;
      const paths = photos.map((photo) => photo.storagePath).filter(Boolean);
      if (paths.length) {
        const { error } = await client.storage.from(ISSUE_PHOTO_BUCKET).remove(paths);
        if (error) {
          console.error(error);
          toast("사진 삭제에 실패했습니다. Storage 정책을 확인하세요.");
        }
      }
      await deleteRemoteRows("issuePhotos", photos.map((photo) => photo.id));
    }

    async function persistAndSync(keys = null) {
      persist();
      if (!isSyncConfigured()) return true;
      enqueueSync(keys);
      flushPendingSyncQueue();
      return true;
    }

    function remoteConfigByKey(key) {
      return REMOTE_TABLES.find((config) => config.key === key);
    }

    function syncableKeys(keys) {
      const values = Array.isArray(keys) ? keys : (keys ? [keys] : []);
      return [...new Set(values.map(String).filter((key) => remoteConfigByKey(key)))];
    }

    function saveSyncQueue() {
      saveJson("pendingSyncQueue", state.pendingSyncQueue);
    }

    function enqueueSync(keys = null) {
      if (!isSyncConfigured()) return;
      if (!keys) {
        state.pendingSyncQueue.push({
          id: uid("sync"),
          type: "full",
          keys: [],
          rowIdsByKey: {},
          attempts: 0,
          createdAt: serverNow().toISOString(),
          nextRetryAt: "",
        });
        prunePendingSyncQueue();
        setSyncStatus("동기화 대기", "pending");
        saveSyncQueue();
        return;
      }
      syncableKeys(keys).forEach((key) => {
        const rows = Array.isArray(state[key]) ? state[key] : [];
        enqueueSyncRows(key, rows);
      });
    }

    function enqueueSyncRows(key, rows) {
      if (!isSyncConfigured()) return;
      const cleanRows = (Array.isArray(rows) ? rows : [rows]).filter((row) => row && row.id);
      if (!remoteConfigByKey(key) || !cleanRows.length) return;
      const existing = state.pendingSyncQueue.find((job) => job.type === "rows" && job.keys.length === 1 && job.keys[0] === key && !job.nextRetryAt);
      const nextIds = cleanRows.map((row) => row.id);
      if (existing) {
        existing.rowIdsByKey[key] = [...new Set([...(existing.rowIdsByKey[key] || []), ...nextIds])];
      } else {
        state.pendingSyncQueue.push({
          id: uid("sync"),
          type: "rows",
          keys: [key],
          rowIdsByKey: { [key]: nextIds },
          attempts: 0,
          createdAt: serverNow().toISOString(),
          nextRetryAt: "",
        });
      }
      prunePendingSyncQueue();
      setSyncStatus("동기화 대기", "pending");
      saveSyncQueue();
    }

    function prunePendingSyncQueue() {
      state.pendingSyncQueue = normalizePendingSyncQueue(state.pendingSyncQueue).slice(-80);
      const fullIndex = state.pendingSyncQueue.findIndex((job) => job.type === "full");
      if (fullIndex >= 0) {
        state.pendingSyncQueue = state.pendingSyncQueue.filter((job, index) => job.type === "full" ? index === fullIndex : true);
      }
    }

    function scheduleSyncRetry() {
      if (state.syncRetryTimer) clearTimeout(state.syncRetryTimer);
      state.syncRetryTimer = setTimeout(() => {
        state.syncRetryTimer = null;
        flushPendingSyncQueue();
      }, SYNC_RETRY_DELAY_MS);
    }

    async function flushPendingSyncQueue() {
      const client = supabaseClient();
      if (!client) {
        setSyncStatus("로컬 저장", "offline");
        return false;
      }
      if (state.syncFlushInFlight) return false;
      prunePendingSyncQueue();
      const now = Date.now();
      const job = state.pendingSyncQueue.find((item) => !item.nextRetryAt || Date.parse(item.nextRetryAt) <= now);
      if (!job) {
        if (state.pendingSyncQueue.length) scheduleSyncRetry();
        return false;
      }
      state.syncFlushInFlight = true;
      setSyncStatus("동기화 중", "pending");
      try {
        if (job.type === "full") {
          await pushRemote({ preserveQueue: true });
        } else {
          for (const key of job.keys) {
            const config = remoteConfigByKey(key);
            const ids = new Set(job.rowIdsByKey[key] || []);
            const rows = (Array.isArray(state[key]) ? state[key] : []).filter((row) => ids.has(row.id));
            await upsertTable(client, config, rows);
          }
        }
        state.pendingSyncQueue = state.pendingSyncQueue.filter((item) => item.id !== job.id);
        saveSyncQueue();
        setSyncStatus(state.pendingSyncQueue.length ? "동기화 대기" : "온라인", state.pendingSyncQueue.length ? "pending" : "online");
        state.syncFlushInFlight = false;
        if (state.pendingSyncQueue.length) flushPendingSyncQueue();
        return true;
      } catch (error) {
        console.error(error);
        job.attempts = Math.min(MAX_SYNC_ATTEMPTS, (job.attempts || 0) + 1);
        const delay = SYNC_RETRY_DELAY_MS * job.attempts;
        job.nextRetryAt = new Date(Date.now() + delay).toISOString();
        saveSyncQueue();
        setSyncStatus("재시도 대기", "pending");
        state.syncFlushInFlight = false;
        scheduleSyncRetry();
        return false;
      }
    }

    function isSyncConfigured() {
      return SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.length > 20;
    }

    function supabaseClient() {
      if (!isSyncConfigured() || !window.supabase) return null;
      if (!cachedSupabaseClient) {
        cachedSupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
      return cachedSupabaseClient;
    }

    async function pushRemote(options = {}) {
      const client = supabaseClient();
      if (!client) {
        setSyncStatus("로컬 저장", "offline");
        return true;
      }
      if (!options.preserveQueue) setSyncStatus("동기화 중", "pending");
      try {
        for (const config of REMOTE_TABLES) {
          await upsertTable(client, config, state[config.key]);
        }
        if (!options.preserveQueue) setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        if (!options.preserveQueue) {
          setSyncStatus("동기화 오류", "error");
          toast("동기화에 실패했습니다. Supabase 테이블과 RLS 정책을 확인하세요.");
        }
        return false;
      }
    }

    async function syncInspectionHistory(inspection, inspectionItems) {
      const client = supabaseClient();
      if (!client) {
        setSyncStatus("로컬 저장", "offline");
        return true;
      }

      const inspectionConfig = remoteConfigByKey("inspections");
      const itemConfig = remoteConfigByKey("inspectionItems");
      if (!inspectionConfig || !itemConfig) return false;
      enqueueSyncRows(inspectionConfig.key, [inspection]);
      enqueueSyncRows(itemConfig.key, inspectionItems);
      flushPendingSyncQueue();
      return true;
    }

    async function pullRemote(options = {}) {
      const client = supabaseClient();
      if (!client) return setSyncStatus("로컬 저장", "offline");
      if (!options.force && state.lastRemotePullAt && Date.now() - state.lastRemotePullAt < REMOTE_PULL_THROTTLE_MS) {
        flushPendingSyncQueue();
        return;
      }
      setSyncStatus("서버 확인 중", "pending");
      try {
        const results = await Promise.all(REMOTE_TABLES.map((config) => selectTable(client, config)));
        results.forEach(({ key, rows }) => {
          if (rows.length) state[key] = mergeRecordArrays(state[key], rows);
        });
        normalizeDataShape();
        state.inspections = state.inspections.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
        dedupeShips();
        cleanupDeliveredShips(true);
        state.lastRemotePullAt = Date.now();
        persist();
        setSyncStatus("온라인", "online");
        render();
        flushPendingSyncQueue();
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("서버 데이터를 가져오지 못했습니다.");
      }
    }

    async function resetRemoteHistory() {
      const client = supabaseClient();
      if (!client) return;
      try {
        const itemDelete = await client.from("safety_inspection_items").delete().neq("id", "");
        if (itemDelete.error) throw itemDelete.error;
        const inspectionDelete = await client.from("safety_inspections").delete().neq("id", "");
        if (inspectionDelete.error) throw inspectionDelete.error;
        setSyncStatus("온라인", "online");
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("서버 이력 초기화에 실패했습니다.");
      }
    }

    function cleanupDeliveredShips(syncRemote) {
      const todayValue = today();
      const expiredIds = state.ships
        .filter((ship) => shipDeliveryDate(ship) && addMonths(shipDeliveryDate(ship), 1) <= todayValue)
        .map((ship) => ship.id);
      if (!expiredIds.length) return;
      const expired = new Set(expiredIds);
      state.ships = state.ships.filter((ship) => !expired.has(ship.id));
      if (syncRemote && state.adminMode && isSyncConfigured()) deleteRemoteShips(expiredIds);
    }

    async function deleteRemoteHistory(ids) {
      const client = supabaseClient();
      if (!client || !ids.length) return;
      try {
        const itemDelete = await client.from("safety_inspection_items").delete().in("inspection_id", ids);
        if (itemDelete.error) throw itemDelete.error;
        const inspectionDelete = await client.from("safety_inspections").delete().in("id", ids);
        if (inspectionDelete.error) throw inspectionDelete.error;
        setSyncStatus("온라인", "online");
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("서버 선택 삭제에 실패했습니다.");
      }
    }

    async function deleteRemoteShips(ids) {
      const client = supabaseClient();
      if (!client || !ids.length) return false;
      try {
        const { error } = await client.from("safety_ships").delete().in("id", ids);
        if (error) throw error;
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("호선 서버 삭제에 실패했습니다. Supabase 테이블과 RLS 정책을 확인하세요.");
        return false;
      }
    }

    async function deleteRemoteRows(key, ids) {
      const client = supabaseClient();
      const config = remoteConfigByKey(key);
      if (!client || !config || !ids.length) return false;
      try {
        const { error } = await client.from(config.table).delete().in("id", ids);
        if (error) throw error;
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("서버 삭제에 실패했습니다. Supabase 테이블과 RLS 정책을 확인하세요.");
        return false;
      }
    }

    async function upsertTable(client, config, rows) {
      if (!config) throw new Error("Remote table config is missing.");
      const targetRows = config.rows ? config.rows(rows) : rows;
      if (!targetRows.length) return;
      const payload = targetRows.map(config.toDb);
      let { error } = await client.from(config.table).upsert(payload, { onConflict: "id" });
      if (error && config.key === "categories" && /tool_ids/i.test(String(error.message || error.details || ""))) {
        const fallbackPayload = payload.map(({ tool_ids, ...row }) => row);
        const retry = await client.from(config.table).upsert(fallbackPayload, { onConflict: "id" });
        error = retry.error;
      }
      if (error && config.key === "inspections" && /safety_pledge/i.test(String(error.message || error.details || ""))) {
        const fallbackPayload = payload.map(({ safety_pledge, ...row }) => row);
        const retry = await client.from(config.table).upsert(fallbackPayload, { onConflict: "id" });
        error = retry.error;
      }
      if (error && /status_history/i.test(String(error.message || error.details || ""))) {
        const fallbackPayload = payload.map(({ status_history, ...row }) => row);
        const retry = await client.from(config.table).upsert(fallbackPayload, { onConflict: "id" });
        error = retry.error;
      }
      if (error) throw error;
    }

    async function selectTable(client, config) {
      const { data, error } = await client.from(config.table).select("*");
      if (error) throw error;
      return { key: config.key, rows: (data || []).map(config.fromDb) };
    }

    boot();
