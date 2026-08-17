const STORAGE_PREFIX = "shipyardSafetyV1.";
    const APP_VERSION = "1.12.4-20260814-editor-safety";
    const APP_VERSION_SHORT = String(APP_VERSION).split("-")[0];
    const APP_VERSION_LABEL = `v${APP_VERSION_SHORT}`;
    const STORAGE_VERSION_KEY = "storageVersion";
    const SUPABASE_URL = "https://yuuroocvxvzgmsdeeiws.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dXJvb2N2eHZ6Z21zZGVlaXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTc2OTMsImV4cCI6MjA5MzczMzY5M30.pW-yyuI5B1YeKT_7DCGBAKmFzLH33O6Eb8OVKYPM2L4";
    const PUSH_VAPID_PUBLIC_KEY = "BKlPDt9ioyub9HDzHMBpTqXjK70PpfoeoLsO7u2sQzSS-Ut5YQIIpJaXof0nJEq7MZpzwu6rT5CaCMCGI0SaVM8";
    const PUSH_TEST_NOTIFICATION_DISABLE_AT = Date.parse("2026-05-26T11:59:00+09:00");
    const PUSH_RULES = typeof window !== "undefined" && window.PushRules ? window.PushRules : {};
    const DEFAULT_PUSH_NOTIFICATION_TEMPLATES = PUSH_RULES.DEFAULT_PUSH_NOTIFICATION_TEMPLATES;
    const ADMIN_PUSH_STYLES = PUSH_RULES.ADMIN_PUSH_STYLES;
    const SERVER_CLOCK_REFRESH_MS = 5 * 60 * 1000;
    const REMOTE_PULL_THROTTLE_MS = 10 * 1000;
    const REMOTE_DELETE_RECONCILE_MS = 60 * 1000;
    const REMOTE_DELETE_RECONCILE_BATCH_SIZE = 50;
    const INSPECTION_DELETION_REALTIME_READY_TIMEOUT_MS = 2000;
    const INSPECTION_DELETION_TABLE = "safety_inspection_deletions";
    const REMOTE_POLL_INTERVAL_MS = 15 * 1000;
    const REMOTE_REACTIVE_PULL_DELAY_MS = 700;
    const DEFAULT_REMOTE_LIST_LIMIT = 20;
    const REMOTE_INCREMENTAL_LIMIT = 60;
    const REMOTE_RECONCILE_INTERVAL_MS = 5 * 60 * 1000;
    const INSPECTION_RANGE_CACHE_TTL_MS = 2 * 60 * 1000;
    const SYNC_RETRY_DELAY_MS = 8 * 1000;
    const MAX_SYNC_ATTEMPTS = 5;
    const STORAGE_WARNING_KB = 4600;
    const STORAGE_COMPACT_KB = 3800;
    const PENDING_PHOTO_RETRY_MAX_BYTES = 240 * 1024;
    const PENDING_PHOTO_DATA_URL_MAX_CHARS = 360 * 1024;
    const ISSUE_PHOTO_UPLOAD_MAX_SIDE = 1440;
    const ISSUE_PHOTO_UPLOAD_QUALITY = 0.72;
    const PICTOGRAM_IMAGE_BUCKET = "safety-pictograms";
    const PICTOGRAM_IMAGE_MAX_BYTES = 768 * 1024;
    const PICTOGRAM_IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
    const SYNC_STATUS_LABELS = {
      "로컬 저장": {
        default: "임시저장됨 · 연결 시 전송",
        compact: "임시저장",
      },
      "동기화 대기": {
        default: "전송 대기 중",
        compact: "전송 대기",
      },
      "서버 확인 중": {
        default: "서버 확인 중",
        compact: "확인 중",
      },
      "동기화 중": {
        default: "동기화 중",
        compact: "동기화 중",
      },
      "온라인": {
        default: "동기화 완료",
        compact: "동기화 완료",
      },
      "동기화 오류": {
        default: "동기화 실패 — 다시 시도해주세요",
        compact: "동기화 실패",
      },
      "일부 데이터 동기화 실패": {
        default: "일부 데이터 동기화 실패",
        compact: "일부 실패",
      },
      "전송 실패함": {
        default: "전송 실패 — 확인 필요",
        compact: "전송 실패",
      },
    };
    const GENERIC_WORKER_LABELS = new Set(["작업자", "로그인 전"]);
    const PICTOGRAM_IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";
    const PICTOGRAM_HELPERS = typeof window !== "undefined" && window.ShipyardPictogramHelpers
      ? window.ShipyardPictogramHelpers
      : {};
    const SHIP_HELPERS = typeof window !== "undefined" && window.ShipyardShipHelpers
      ? window.ShipyardShipHelpers
      : {};
    const WORKER_HELPERS = typeof window !== "undefined" && window.ShipyardWorkerHelpers
      ? window.ShipyardWorkerHelpers
      : {};
    const DASHBOARD_VIEW = typeof window !== "undefined" && window.ShipyardDashboardView
      ? window.ShipyardDashboardView
      : {};
    const SCREEN_VIEWS = typeof window !== "undefined" && window.ShipyardScreenViews
      ? window.ShipyardScreenViews
      : {};
    const XLSX_HELPERS = typeof window !== "undefined" && window.ShipyardXlsxHelpers
      ? window.ShipyardXlsxHelpers
      : {};
    const ANALYTICS_MODEL = typeof window !== "undefined" && window.ShipyardAnalyticsModel
      ? window.ShipyardAnalyticsModel
      : {};
    const SHIP_IMPORT_RULES = typeof window !== "undefined" && window.ShipyardShipImportRules
      ? window.ShipyardShipImportRules
      : {};
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
      hullGrinding: illustration("hullGrinding"),
      insulationWork: illustration("insulationWork"),
      wasteDisposal: illustration("wasteDisposal"),
      safetyTraining: illustration("safetyTraining"),
      remoteInspection: illustration("remoteInspection"),
      ecoPainting: illustration("ecoPainting"),
      launchPrep: illustration("launchPrep"),
      launchInspection: illustration("launchInspection"),
      seaTrial: illustration("seaTrial"),
      controlRoom: illustration("controlRoom"),
      sonarInstallation: illustration("sonarInstallation"),
      blockTransport: illustration("blockTransport"),
      weldingRobot: illustration("weldingRobot"),
      smartLogistics: illustration("smartLogistics"),
      environmentalProtection: illustration("environmentalProtection"),
      safetyGear: illustration("safetyGear"),
      pressureTest: illustration("pressureTest"),
      dpInstallation: illustration("dpInstallation"),
      dpInspection: illustration("dpInspection"),
      classSurvey: illustration("classSurvey"),
      demoCheck: illustration("demoCheck"),
      lcWork: illustration("lcWork"),
      stInspection: illustration("stInspection"),
      dlWork: illustration("dlWork"),
      welding: illustration("weldingWork"),
      workAtHeights: illustration("scaffolding"),
      erection: illustration("blockAssembly"),
      confinedSpace: illustration("confinedSpace"),
      confined: illustration("confined"),
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
    const ISSUE_PHOTO_PRIVATE_CACHE_SECONDS = 10 * 60;
    const ITEM_VISIBILITY_CONDITIONS = ["항상 표시", ...TOOL_NATURES];
    const CATEGORY_TOOL_META_PREFIX = "__category_tools__";
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
      mounting: { stage: "mounting", label: "탑재", percent: 20, color: "#7A5326", bg: "#F8F1E8" },
      lc: { stage: "lc", label: "L/C", percent: 45, color: "#2E5DA6", bg: "#eff6ff" },
      st: { stage: "st", label: "S/T", percent: 70, color: "#0f766e", bg: "#f0fdfa" },
      cl: { stage: "cl", label: "C/L", percent: 92, color: "#3F7A50", bg: "#F1F6F2" },
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
        selectColumns: "id,label,icon,color,require_tool_check,tool_nature,tool_ids,sort_order",
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
        selectColumns: "id,category_id,title,sort_order,sign_code,frequency,severity,total_score",
        toDb: (row) => ({ id: row.id, category_id: row.categoryId, title: row.title, sort_order: row.order || 0, sign_code: row.signCode || null, frequency: Number.isFinite(row.frequency) ? row.frequency : null, severity: Number.isFinite(row.severity) ? row.severity : null, total_score: Number.isFinite(row.totalScore) ? row.totalScore : null }),
        fromDb: (row) => ({ id: row.id, categoryId: row.category_id, title: row.title, order: row.sort_order || 0, signCode: row.sign_code || "", frequency: Number.isFinite(row.frequency) ? row.frequency : null, severity: Number.isFinite(row.severity) ? row.severity : null, totalScore: Number.isFinite(row.total_score) ? row.total_score : (Number.isFinite(row.frequency) && Number.isFinite(row.severity) ? row.frequency * row.severity : null) }),
      },
      {
        table: "safety_items",
        key: "items",
        selectColumns: "id,category_id,section_id,text,risk,required,active,tool_ids,visibility_condition,sort_order",
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
        selectColumns: "id,category_id,name,nature,deleted,sort_order",
        toDb: (row) => ({
          id: row.id,
          category_id: row.categoryId || "",
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
        selectColumns: "id,label,source,deleted,sort_order,storage_bucket,storage_path,mime_type,file_size",
        rows: (rows) => rows.filter((row) => row.source === "custom" && row.deleted !== true),
        toDb: (row) => ({
          id: row.id,
          label: row.label,
          source: "custom",
          deleted: Boolean(row.deleted),
          sort_order: row.order || 0,
          storage_bucket: row.storageBucket || PICTOGRAM_IMAGE_BUCKET,
          storage_path: row.storagePath || null,
          mime_type: row.mimeType || null,
          file_size: Number(row.fileSize || 0) || null,
        }),
        fromDb: (row) => ({
          id: row.id,
          label: row.label,
          source: row.source || "custom",
          deleted: Boolean(row.deleted),
          order: row.sort_order || 0,
          storageBucket: row.storage_bucket || PICTOGRAM_IMAGE_BUCKET,
          storagePath: row.storage_path || "",
          mimeType: row.mime_type || "",
          fileSize: Number(row.file_size || 0),
        }),
      },
      {
        table: "safety_ships",
        key: "ships",
        selectColumns: "id,no,type,note,process_stage,delivery_type,delivery_date,created_at,sort_order",
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
        selectColumns: "id,category_id,worker_id,worker,ship_no,date,time,status,warnings,completion,tools,safety_pledge,work_prep_record_id,work_prep_worker_id,created_at",
        orderBy: "created_at",
        ascending: false,
        limit: DEFAULT_REMOTE_LIST_LIMIT,
        toDb: (row) => ({
          id: row.id,
          category_id: row.categoryId,
          worker_id: row.workerId || null,
          worker: row.worker,
          ship_no: row.shipNo,
          date: row.date,
          time: row.time,
          status: row.status,
          warnings: row.warnings || 0,
          completion: row.completion || 0,
          tools: Array.isArray(row.tools) ? row.tools : [],
          safety_pledge: row.safetyPledge || "",
          work_prep_record_id: row.workPrepRecordId || "",
          work_prep_worker_id: row.workPrepWorkerId || "",
          created_at: row.createdAt || serverNow().toISOString(),
        }),
        fromDb: (row) => ({
          id: row.id,
          categoryId: row.category_id,
          workerId: row.worker_id || "",
          worker: row.worker,
          shipNo: row.ship_no,
          date: row.date,
          time: row.time,
          status: row.status,
          warnings: row.warnings || 0,
          completion: row.completion || 0,
          tools: Array.isArray(row.tools) ? row.tools : [],
          safetyPledge: row.safety_pledge || "",
          workPrepRecordId: row.work_prep_record_id || "",
          workPrepWorkerId: row.work_prep_worker_id || "",
          createdAt: row.created_at,
        }),
      },
      {
        pullOnStartup: false,
        table: "safety_inspection_items",
        key: "inspectionItems",
        selectColumns: "id,inspection_id,item_id,checked,risk,text,section_title",
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
        readTable: "workers_public",
        key: "workers",
        selectColumns: "id,name,team,position,active,unsafe_push_target,created_at,updated_at",
        rows: (rows) => rows.filter((row) => row.active !== false),
        toDb: (row) => ({
          id: row.id,
          name: row.name,
          team: row.team || "",
          position: normalizeWorkerPosition(row.position),
          active: row.active !== false,
          unsafe_push_target: Boolean(row.unsafePushTarget),
          created_at: row.createdAt || serverNow().toISOString(),
          updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
        }),
        fromDb: (row) => ({
          id: row.id,
          name: row.name,
          team: row.team || "",
          position: normalizeWorkerPosition(row.position),
          active: row.active !== false,
          unsafePushTarget: Boolean(row.unsafe_push_target),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }),
      },
      {
        table: "unsafe_issues",
        key: "unsafeIssues",
        selectColumns: "id,ship_no,content,worker_id,worker_name_snapshot,worker_team_snapshot,status,admin_memo,created_at,updated_at,completed_at,status_history",
        orderBy: "created_at",
        ascending: false,
        limit: DEFAULT_REMOTE_LIST_LIMIT,
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
        selectColumns: "id,ship_no,material_name,content,material_type,material_type_label,spec,quantity,unit,detail,worker_id,worker_name_snapshot,worker_team_snapshot,status,admin_memo,created_at,updated_at,completed_at,status_history",
        orderBy: "created_at",
        ascending: false,
        limit: DEFAULT_REMOTE_LIST_LIMIT,
        toDb: (row) => ({
          id: row.id,
          ship_no: row.shipNo,
          material_name: row.materialName,
          content: row.content,
          material_type: row.materialType || "",
          material_type_label: row.materialTypeLabel || "",
          spec: row.spec || "",
          quantity: row.quantity || "",
          unit: row.unit || "EA",
          detail: row.detail || "",
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
          materialType: row.material_type || "",
          materialTypeLabel: row.material_type_label || "",
          spec: row.spec || "",
          quantity: row.quantity || "",
          unit: row.unit || "EA",
          detail: row.detail || "",
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
        pullOnStartup: false,
        table: "issue_photos",
        key: "issuePhotos",
        selectColumns: "id,target_type,target_id,storage_bucket,storage_path,sort_order,created_at",
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
          signedUrl: row.signed_url || "",
          signedUrlExpiresAt: row.signed_url_expires_at || "",
        }),
      },
      {
        table: "work_prep_records",
        key: "workPrepRecords",
        selectColumns: "id,work_date,appearance_time,team,ship_no,category_id,leader_worker_id,worker_ids,other_team_worker_ids,tool_ids,status,status_history,created_at,updated_at,deleted_at",
        fallbackSelectColumns: "id,work_date,appearance_time,team,ship_no,category_id,leader_worker_id,worker_ids,other_team_worker_ids,tool_ids,status,created_at,updated_at,deleted_at",
        orderBy: "updated_at",
        ascending: false,
        limit: 0,
        toDb: (row) => ({
          id: row.id,
          work_date: row.workDate || "",
          appearance_time: row.appearanceTime || "",
          team: row.team || "",
          ship_no: row.shipNo || "",
          category_id: row.categoryId || "",
          leader_worker_id: row.leaderWorkerId || "",
          worker_ids: Array.isArray(row.workerIds) ? row.workerIds : [],
          other_team_worker_ids: Array.isArray(row.otherTeamWorkerIds) ? row.otherTeamWorkerIds : [],
          tool_ids: sanitizeToolIds(row.toolIds),
          status: normalizeWorkPrepStatus(row.status || "preparing"),
          status_history: Array.isArray(row.statusHistory) ? row.statusHistory : [],
          created_at: row.createdAt || serverNow().toISOString(),
          updated_at: row.updatedAt || row.createdAt || serverNow().toISOString(),
        }),
        fallbackPayload: (payload) => payload.map(({ status_history, ...row }) => row),
        fromDb: (row) => ({
          id: row.id,
          workDate: row.work_date || "",
          appearanceTime: row.appearance_time || "",
          team: row.team || "",
          shipNo: row.ship_no || "",
          categoryId: row.category_id || "",
          leaderWorkerId: row.leader_worker_id || "",
          workerIds: Array.isArray(row.worker_ids) ? row.worker_ids : [],
          otherTeamWorkerIds: Array.isArray(row.other_team_worker_ids) ? row.other_team_worker_ids : [],
          toolIds: sanitizeToolIds(row.tool_ids),
          status: normalizeWorkPrepStatus(row.status || "preparing"),
          statusHistory: Array.isArray(row.status_history) ? row.status_history : [],
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          deletedAt: row.deleted_at || "",
        }),
      },
    ];
    const REMOTE_AUTHORITATIVE_KEYS = new Set([
      "categories",
      "sections",
      "items",
      "tools",
      "pictograms",
      "workers",
      "ships",
      "inspections",
      "inspectionItems",
      "unsafeIssues",
      "missingMaterials",
      "issuePhotos",
      "workPrepRecords",
    ]);
    const REALTIME_REMOTE_KEYS = new Set([
      "ships",
      "inspections",
      "unsafeIssues",
      "missingMaterials",
      "workPrepRecords",
    ]);
    const REALTIME_DELTA_COLUMNS = new Map([
      ["inspections", "created_at"],
      ["unsafeIssues", "updated_at"],
      ["missingMaterials", "updated_at"],
      ["workPrepRecords", "updated_at"],
    ]);
    const REMOTE_RECONCILE_KEYS = new Set(["inspections", "unsafeIssues", "missingMaterials"]);
    const ADMIN_REMOTE_KEYS = new Set([
      "workers",
      "categories",
      "sections",
      "items",
      "tools",
      "pictograms",
      "ships",
      "workPrepRecords",
    ]);
    const WORKER_INSERT_REMOTE_KEYS = new Set([
      "inspections",
      "inspectionItems",
      "unsafeIssues",
      "missingMaterials",
    ]);

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
        if (key === "draft" && value && typeof value === "object") value.savedAt = new Date().toISOString();
        localStorage.setItem(storeKey(key), JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn("Local storage write failed", key, error);
        return false;
      }
    };
    function refreshVersionedLocalCache() {
      try {
        const versionKey = storeKey(STORAGE_VERSION_KEY);
        const savedVersion = localStorage.getItem(versionKey);
        if (savedVersion === APP_VERSION) return false;

        const legacyStorage = !savedVersion;
        const pendingQueue = loadJson("pendingSyncQueue", []);
        for (const config of REMOTE_TABLES) {
          const pendingRows = NormalizationRules.pendingRowsForVersionRefresh(
            config.key,
            loadJson(config.key, []),
            pendingQueue,
          );
          if (pendingRows.length) {
            if (!saveJson(config.key, pendingRows)) throw new Error(`pending_cache_preserve_failed:${config.key}`);
          } else {
            localStorage.removeItem(storeKey(config.key));
          }
        }
        localStorage.removeItem(storeKey("lastRemotePullAt"));
        localStorage.removeItem(storeKey("remoteListLimits"));
        localStorage.setItem(versionKey, APP_VERSION);
        if (legacyStorage) console.info("Legacy local cache refreshed for current app version.");
        return true;
      } catch (error) {
        console.warn("Local storage version check failed", error);
        return false;
      }
    }
    refreshVersionedLocalCache();
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
      return estimateLocalStorageKb() >= STORAGE_WARNING_KB;
    }

    function pendingPhotoDataUrlForStorage(value) {
      const dataUrl = String(value || "");
      return dataUrl.length <= PENDING_PHOTO_DATA_URL_MAX_CHARS ? dataUrl : "";
    }

    function compactStoragePayloadsIfNeeded() {
      if (estimateLocalStorageKb() < STORAGE_COMPACT_KB) return false;
      let changed = false;
      if (Array.isArray(state.pendingPhotoUploads) && state.pendingPhotoUploads.some((row) => row.dataUrl)) {
        state.pendingPhotoUploads = state.pendingPhotoUploads.map((row) => row.dataUrl ? { ...row, dataUrl: "" } : row);
        changed = true;
      }
      if (Array.isArray(state.pictograms) && state.pictograms.some((row) => row.deleted === true && row.src)) {
        state.pictograms = state.pictograms.map((row) => row.deleted === true && row.src ? { ...row, src: "" } : row);
        changed = true;
      }
      return changed;
    }

    function recordTimestamp(row) {
      const value = row?.updatedAt || row?.createdAt || row?.date || "";
      const time = Date.parse(value);
      return Number.isFinite(time) ? time : 0;
    }

    function mergeRemoteRecord(local, remote) {
      if (!local) return remote;
      if (!remote) return local;
      // 동률 timestamp일 때 기기마다 자기 로컬을 유지해 값이 갈리지 않도록, 서버(remote)를
      // 결정적으로 채택해 모든 기기가 같은 값으로 수렴하게 한다. (authoritative 테이블의
      // 미push 로컬 변경은 pendingSyncRowsForKey가 별도로 보존한다.)
      return recordTimestamp(remote) >= recordTimestamp(local) ? remote : local;
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

    function pendingSyncRowsForKey(key) {
      const pendingIds = new Set();
      const queue = normalizePendingSyncQueue(state.pendingSyncQueue);
      const rows = Array.isArray(state[key]) ? state[key] : [];
      if (queue.some((job) => job.type === "full")) return rows;
      queue.forEach((job) => {
        if (job.type !== "rows") return;
        (job.rowIdsByKey[key] || []).forEach((id) => pendingIds.add(String(id)));
      });
      return rows.filter((row) => row?.id && pendingIds.has(String(row.id)));
    }

    function authoritativeRemoteRows(key, remoteRows) {
      const byId = new Map();
      (Array.isArray(remoteRows) ? remoteRows : []).forEach((row) => {
        if (row?.id) byId.set(row.id, row);
      });
      if (key === "workers") {
        state.workerDeletionTombstones.forEach((id) => {
          if (byId.has(id)) byId.delete(id);
          else state.workerDeletionTombstones.delete(id);
        });
        state.pendingCreatedWorkers = (Array.isArray(state.pendingCreatedWorkers) ? state.pendingCreatedWorkers : [])
          .filter((row) => row?.id && !byId.has(row.id));
        state.pendingCreatedWorkers.forEach((row) => byId.set(row.id, row));
      }
      pendingSyncRowsForKey(key).forEach((row) => {
        if (row?.id) byId.set(row.id, row);
      });
      return Array.from(byId.values());
    }

    function mergeWorkPrepHistory(localRow, remoteRow) {
      if (!localRow) return remoteRow;
      if (!remoteRow) return localRow;
      const base = recordTimestamp(remoteRow) >= recordTimestamp(localRow) ? remoteRow : localRow;
      return {
        ...base,
        statusHistory: WorkPrepTimelineRules.uniqueEntries([
          ...(Array.isArray(localRow.statusHistory) ? localRow.statusHistory : []),
          ...(Array.isArray(remoteRow.statusHistory) ? remoteRow.statusHistory : []),
        ]),
      };
    }

    function authoritativeWorkPrepRows(remoteRows) {
      const localById = new Map();
      filterDeletedWorkPrepRecords(state.workPrepRecords).forEach((row) => {
        if (row && row.id) localById.set(row.id, row);
      });
      const byId = new Map();
      (Array.isArray(remoteRows) ? remoteRows : []).forEach((row) => {
        if (row && row.id) byId.set(row.id, mergeWorkPrepHistory(localById.get(row.id), row));
      });
      // 아직 서버에 반영되지 않은 로컬 변경(미push)은 statusHistory를 합쳐 보존
      pendingSyncRowsForKey("workPrepRecords").forEach((row) => {
        if (row && row.id) byId.set(row.id, mergeWorkPrepHistory(byId.get(row.id), row));
      });
      return Array.from(byId.values());
    }

    function applyRemoteTableRows(key, rows) {
      const config = remoteConfigByKey(key);
      const nextRows = key === "workPrepRecords" ? filterDeletedWorkPrepRecords(rows) : rows;
      if (config?.limit) {
        const remoteRows = Array.isArray(nextRows) ? nextRows : [];
        if (remoteRows.length < remoteListLimit(key)) {
          state[key] = authoritativeRemoteRows(key, remoteRows);
          return;
        }
        const boundary = String(remoteRows[remoteRows.length - 1]?.createdAt || "");
        const outsideWindow = (Array.isArray(state[key]) ? state[key] : [])
          .filter((row) => !boundary || String(row?.createdAt || "") < boundary);
        state[key] = mergeRecordArrays(outsideWindow, authoritativeRemoteRows(key, remoteRows));
        return;
      }
      if (config?.pullOnStartup === false) {
        state[key] = mergeRecordArrays(key === "workPrepRecords" ? filterDeletedWorkPrepRecords(state[key]) : state[key], nextRows);
        return;
      }
      if (REMOTE_AUTHORITATIVE_KEYS.has(key)) {
        state[key] = key === "workPrepRecords"
          ? authoritativeWorkPrepRows(nextRows)
          : authoritativeRemoteRows(key, nextRows);
        return;
      }
      if (nextRows.length) state[key] = mergeRecordArrays(state[key], nextRows);
    }

    function normalizePendingSyncQueue(value) {
      return NormalizationRules.normalizePendingSyncQueue(value, {
        uid,
        now: () => new Date().toISOString(),
      });
    }

    const loadAdminMode = () => {
      try {
        return sessionStorage.getItem(storeKey("adminMode")) === "true";
      } catch {
        return false;
      }
    };
    const loadAdminAuthSource = () => {
      try {
        return sessionStorage.getItem(storeKey("adminAuthSource")) || "";
      } catch {
        return "";
      }
    };
    const loadAdminSession = () => {
      try {
        const value = sessionStorage.getItem(storeKey("adminSession"));
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    };
    const saveAdminMode = (enabled, source = "") => {
      try {
        if (enabled) {
          sessionStorage.setItem(storeKey("adminMode"), "true");
          if (source) {
            sessionStorage.setItem(storeKey("adminAuthSource"), source);
          } else {
            sessionStorage.removeItem(storeKey("adminAuthSource"));
          }
        } else {
          sessionStorage.removeItem(storeKey("adminMode"));
          sessionStorage.removeItem(storeKey("adminAuthSource"));
        }
      } catch {}
    };
    const saveAdminSession = (session) => {
      try {
        if (session?.token) {
          sessionStorage.setItem(storeKey("adminSession"), JSON.stringify(session));
        } else {
          sessionStorage.removeItem(storeKey("adminSession"));
        }
      } catch {}
    };
    const clearAdminSession = () => {
      try {
        sessionStorage.removeItem(storeKey("adminSession"));
      } catch {}
    };
    const loadWorkerSession = () => {
      try {
        const value = sessionStorage.getItem(storeKey("workerSession"));
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    };
    const saveWorkerSession = (session) => {
      try {
        sessionStorage.setItem(storeKey("workerSession"), JSON.stringify(session));
      } catch {}
    };
    const clearWorkerSession = () => {
      try {
        sessionStorage.removeItem(storeKey("workerSession"));
      } catch {}
    };
    const loadLastLoginWorkerId = () => {
      try {
        return localStorage.getItem(storeKey("lastLoginWorkerId")) || "";
      } catch {
        return "";
      }
    };
    const saveLastLoginWorkerId = (workerId) => {
      try {
        if (workerId) {
          localStorage.setItem(storeKey("lastLoginWorkerId"), workerId);
        } else {
          localStorage.removeItem(storeKey("lastLoginWorkerId"));
        }
      } catch {}
    };
    const normalizeEmployeeNo = (value) => String(value || "").trim();
    const adminSessionLooksActive = (session) => Boolean(
      session
      && session.token
      && session.workerId
      && (!session.expiresAt || Date.parse(session.expiresAt) > Date.now() + 30000),
    );

    function createDraft(overrides = {}) {
      return {
        worker: "",
        workPrepRecordId: "",
        workPrepWorkerId: "",
        shipNo: "",
        safetyPledge: "",
        pledgeChecks: {},
        pledgeSignature: "",
        pledgeSignatureCleared: false,
        checks: {},
        selectedToolIds: [],
        toolPrepComplete: false,
        directShipSelectionComplete: false,
        savedAt: "",
        ...overrides,
      };
    }

    function createWorkPrepDraft(overrides = {}) {
      return {
        id: "",
        workDate: localDate(new Date()),
        appearanceTime: "15:00",
        team: "",
        shipNo: "",
        categoryId: "",
        leaderWorkerId: "",
        workerIds: [],
        otherTeamWorkerIds: [],
        toolIds: [],
        status: "preparing",
        ...overrides,
      };
    }

    function createFreshWorkPrepRegistrationDraft(previous = {}) {
      return createWorkPrepDraft({
        workDate: today(),
        appearanceTime: previous.appearanceTime || DEFAULT_WORK_PREP_APPEARANCE_TIME,
        team: previous.team || "",
        shipNo: "",
        categoryId: "",
        leaderWorkerId: "",
        workerIds: [],
        otherTeamWorkerIds: [],
        toolIds: [],
        status: "preparing",
      });
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
    const HIDDEN_PLEDGE_ANALYTICS_WORKER_IDS = new Set(["worker_001", "worker_002", "worker_007", "worker_013"]);
    const HIDDEN_PLEDGE_ANALYTICS_WORKER_NAMES = new Set(["김광수", "허지원", "김준혁", "김경제"]);
    const DEFAULT_WORKER_POSITION = "작업자";
    const LEADER_WORKER_POSITION = "조장";
    const FOREMAN_WORKER_POSITION = "반장";
    const WORKER_POSITIONS = [DEFAULT_WORKER_POSITION, LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION, "대표", "관리", "총무"];
    const ADMIN_PREENTRY_WORKER_POSITIONS = new Set([FOREMAN_WORKER_POSITION, "대표", "관리", "총무"]);
    const LEADER_EQUIVALENT_WORKER_POSITIONS = new Set([LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION]);
    const PRIVILEGED_WORKER_POSITIONS = new Set([LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION, "관리", "총무"]);
    const PRIVILEGED_WORKER_TEAMS = new Set(["관리", "총무"]);
    const WORKER_TEAM_OPTIONS = ["선행", "후행", "관리"];
    const LOGIN_WORKER_GROUP_ORDER = ["대표", "관리", "선행", "후행", "총무"];
    const LOGIN_WORKER_GROUP_RANK = new Map(LOGIN_WORKER_GROUP_ORDER.map((group, index) => [group, index]));
    const WORK_PREP_TEAM_OPTIONS = WORKER_TEAM_OPTIONS;
    const WORK_PREP_STATUS_LABELS = {
      confirmed: "확정",
      preparing: "점검 대기",
      ordered: "작업지시",
      unregistered: "미등록",
      used: "점검 완료",
    };
    const WORK_PREP_STATUS_ORDER = {
      confirmed: 1,
      preparing: 2,
      ordered: 3,
      unregistered: 4,
      used: 5,
    };
    const DEFAULT_WORK_PREP_APPEARANCE_TIME = "15:00";
    const WORK_PREP_START_TIME = "07:00";
    const WORK_PREP_START_LOCKED_MESSAGE = "작업당일 07:00부터 점검 시작 가능합니다";

    function signatureCacheDateKey() {
      return today();
    }

    function normalizedWorkerName(workerName) {
      if (typeof WORKER_HELPERS.normalizedWorkerName === "function") {
        return WORKER_HELPERS.normalizedWorkerName(workerName);
      }
      return String(workerName || "").trim();
    }

    function normalizeWorkerPosition(position) {
      if (typeof WORKER_HELPERS.normalizeWorkerPosition === "function") {
        return WORKER_HELPERS.normalizeWorkerPosition(position);
      }
      const value = String(position || "").trim();
      return WORKER_POSITIONS.includes(value) ? value : DEFAULT_WORKER_POSITION;
    }

    function workerDisplayPosition(worker) {
      const position = normalizeWorkerPosition(worker?.position);
      const name = normalizedWorkerName(worker?.name);
      if (name === "백승기" && position === LEADER_WORKER_POSITION) return FOREMAN_WORKER_POSITION;
      return position;
    }

    function loginWorkerGroup(worker) {
      if (typeof WORKER_HELPERS.loginWorkerGroup === "function") {
        return WORKER_HELPERS.loginWorkerGroup(worker);
      }
      const position = normalizeWorkerPosition(worker?.position);
      const team = normalizeWorkerTeam(worker?.team);
      if (position === "대표") return "대표";
      if (position === "총무") return "총무";
      if (position === "관리" || team === "관리") return "관리";
      if (team === "선행") return "선행";
      if (team === "후행") return "후행";
      return "";
    }

    function loginWorkerGroupRank(worker) {
      if (typeof WORKER_HELPERS.loginWorkerGroupRank === "function") {
        return WORKER_HELPERS.loginWorkerGroupRank(worker);
      }
      const group = loginWorkerGroup(worker);
      return LOGIN_WORKER_GROUP_RANK.has(group) ? LOGIN_WORKER_GROUP_RANK.get(group) : LOGIN_WORKER_GROUP_ORDER.length;
    }

    function sortWorkersForLogin(workers) {
      if (typeof WORKER_HELPERS.sortWorkersForLogin === "function") {
        return WORKER_HELPERS.sortWorkersForLogin(workers);
      }
      return [...(Array.isArray(workers) ? workers : [])].sort((a, b) =>
        loginWorkerGroupRank(a) - loginWorkerGroupRank(b)
        || String(a.name || "").localeCompare(String(b.name || ""), "ko")
        || String(a.id || "").localeCompare(String(b.id || "")));
    }

    function isLeaderWorker(worker) {
      if (typeof WORKER_HELPERS.isLeaderWorker === "function") {
        return WORKER_HELPERS.isLeaderWorker(worker);
      }
      return LEADER_EQUIVALENT_WORKER_POSITIONS.has(normalizeWorkerPosition(worker?.position));
    }

    function canWorkerPreEnterAdminMode(worker) {
      if (typeof WORKER_HELPERS.canWorkerPreEnterAdminMode === "function") {
        return WORKER_HELPERS.canWorkerPreEnterAdminMode(worker);
      }
      const position = normalizeWorkerPosition(worker?.position);
      const team = String(worker?.team || "").trim();
      return ADMIN_PREENTRY_WORKER_POSITIONS.has(position) || PRIVILEGED_WORKER_TEAMS.has(team);
    }

    function workerAdminModeLabel(worker) {
      if (typeof WORKER_HELPERS.workerAdminModeLabel === "function") {
        return WORKER_HELPERS.workerAdminModeLabel(worker);
      }
      const name = String(worker?.name || "").trim();
      return name ? `${name} 권한` : "작업자 권한";
    }

    function canWorkerPerformLeaderActions(worker) {
      const position = normalizeWorkerPosition(worker?.position);
      const team = String(worker?.team || "").trim();
      return PRIVILEGED_WORKER_POSITIONS.has(position) || team === "관리" || team === "총무";
    }

    function canOpenWorkPrepRegister() {
      const worker = currentWorkerSessionWorker();
      return Boolean(state.adminMode || canWorkerPerformLeaderActions(worker));
    }

    function saveWorkPrepDraft() {
      saveJson("workPrepDraft", state.workPrepDraft);
    }

    function loadWorkPrepRecords() {
      return loadJson("workPrepRecords", []);
    }

    function saveWorkPrepRecords() {
      saveJson("workPrepRecords", state.workPrepRecords);
    }

    function saveDeletedWorkPrepRecordIds() {
      saveJson("deletedWorkPrepRecordIds", state.deletedWorkPrepRecordIds);
    }

    function deletedWorkPrepRecordIdSet() {
      return new Set(Array.isArray(state.deletedWorkPrepRecordIds) ? state.deletedWorkPrepRecordIds.filter(Boolean) : []);
    }

    function filterDeletedWorkPrepRecords(rows) {
      const deletedIds = deletedWorkPrepRecordIdSet();
      return (Array.isArray(rows) ? rows : []).filter((row) => row?.id && !row.deletedAt && !deletedIds.has(row.id));
    }

    function rememberDeletedWorkPrepRecordId(recordId) {
      const id = String(recordId || "").trim();
      if (!id) return;
      state.deletedWorkPrepRecordIds = [...deletedWorkPrepRecordIdSet(), id].slice(-300);
      removePendingSyncRows("workPrepRecords", [id]);
      saveDeletedWorkPrepRecordIds();
    }

    function normalizeWorkPrepStatus(status) {
      return WORK_PREP_STATUS_ORDER[status] ? status : "ordered";
    }

    function workPrepStatusOptions() {
      return Object.keys(WORK_PREP_STATUS_ORDER)
        .sort((a, b) => (WORK_PREP_STATUS_ORDER[a] || 99) - (WORK_PREP_STATUS_ORDER[b] || 99));
    }

    function currentTimelineActorLabel(fallback = "관리자") {
      const worker = currentWorkerSessionWorker();
      const name = String(worker?.name || "").trim();
      if (name) return name;
      const sessionName = String(state.workerSession?.workerName || "").trim();
      if (sessionName) return sessionName;
      return state.adminMode ? fallback : "작업자";
    }

    function workPrepActorLabel() {
      return currentTimelineActorLabel();
    }

    function normalizeWorkPrepTimelineEntry(entry) {
      return WorkPrepTimelineRules.normalizeEntry(entry);
    }

    function uniqueWorkPrepTimelineEntries(entries) {
      return WorkPrepTimelineRules.uniqueEntries(entries);
    }

    function workPrepTimelineActorText(entry) {
      const ids = Array.isArray(entry && entry.actors) ? entry.actors : [];
      const names = ids
        .map((id) => state.workers.find((worker) => worker.id === id))
        .map((worker) => String((worker && worker.name) || "").trim())
        .filter(Boolean);
      if (names.length === 1) return names[0];
      if (names.length === 2) return `${names[0]}, ${names[1]}`;
      if (names.length > 2) return `${names[0]} 외 ${names.length - 1}명`;
      return String((entry && (entry.actorLabel || entry.actor)) || "").trim() || "관리자";
    }

    function applyWorkPrepMilestone(recordId, statusForRecord, milestone) {
      let updated = null;
      state.workPrepRecords = state.workPrepRecords.map((row) => {
        if (row.id !== recordId) return row;
        updated = {
          ...row,
          status: normalizeWorkPrepStatus(statusForRecord),
          statusHistory: WorkPrepTimelineRules.upsertMilestone(row.statusHistory || [], milestone),
          updatedAt: milestone.changedAt,
        };
        return updated;
      });
      if (updated) {
        saveWorkPrepRecords();
        if (isSyncConfigured()) {
          enqueueSyncRows("workPrepRecords", [updated]);
          flushPendingSyncQueue();
        }
      }
      return updated;
    }

    function workPrepRegistrationActor(record) {
      const leader = state.workers.find((worker) => worker.id === record?.leaderWorkerId);
      return String(leader?.name || "").trim() || "관리자";
    }

    function buildWorkPrepTimeline(record) {
      const row = record && typeof record === "object" ? record : {};
      const entries = Array.isArray(row.statusHistory) ? [...row.statusHistory] : [];
      const hasRegister = entries.some((entry) => {
        const normalized = WorkPrepTimelineRules.normalizeEntry(entry);
        return normalized && normalized.kind === "register";
      });
      const createdAt = String(row.createdAt || "").trim();
      if (!hasRegister && createdAt) {
        // 구버전 호환: 저장된 등록 줄이 없으면 등록 시점으로 보강(상태 문구 왜곡 없이 고정)
        entries.push({
          kind: "register",
          status: WorkPrepTimelineRules.MILESTONE.register,
          changedAt: createdAt,
          actors: row.leaderWorkerId ? [String(row.leaderWorkerId)] : [],
          actorLabel: workPrepRegistrationActor(row),
        });
      }
      return uniqueWorkPrepTimelineEntries(entries);
    }

    function appendWorkPrepStatusHistoryEntry(record, entry) {
      return uniqueWorkPrepTimelineEntries([
        ...buildWorkPrepTimeline(record),
        entry,
      ]);
    }

    function workPrepRecordWithStatus(row, status, options = {}) {
      const normalized = normalizeWorkPrepStatus(status);
      const previousStatus = normalizeWorkPrepStatus(row?.status || "");
      const changedAt = options.changedAt || serverNow().toISOString();
      if (previousStatus === normalized) return row;
      return {
        ...row,
        status: normalized,
        statusHistory: appendWorkPrepStatusHistoryEntry(row, {
          status: WORK_PREP_STATUS_LABELS[normalized] || normalized,
          memo: `${WORK_PREP_STATUS_LABELS[previousStatus] || previousStatus} → ${WORK_PREP_STATUS_LABELS[normalized] || normalized}`,
          changedAt,
          actor: options.actor || workPrepActorLabel(),
        }),
        updatedAt: changedAt,
      };
    }

    function normalizeWorkPrepWorkerIds(draft) {
      const leaderId = String(draft.leaderWorkerId || "");
      const ids = new Set(Array.isArray(draft.workerIds) ? draft.workerIds : []);
      ids.delete(leaderId);
      ids.delete("");
      return [...ids].filter((id) => state.workers.some((worker) => worker.id === id));
    }

    function workPrepCounterpartTeam(team) {
      const value = String(team || "").trim();
      if (value === "선행") return "후행";
      if (value === "후행") return "선행";
      return "";
    }

    function normalizeOtherTeamWorkPrepWorkerIds(draft) {
      const leaderId = String(draft.leaderWorkerId || "");
      const counterpartTeam = workPrepCounterpartTeam(draft.team);
      const ids = new Set(Array.isArray(draft.otherTeamWorkerIds) ? draft.otherTeamWorkerIds : []);
      ids.delete(leaderId);
      ids.delete("");
      return [...ids].filter((id) => state.workers.some((worker) => worker.id === id && worker.team === counterpartTeam));
    }

    function syncWorkPrepWorkerBucketsToTeam(draft) {
      const team = String(draft.team || "");
      const counterpartTeam = workPrepCounterpartTeam(team);
      const leaderId = String(draft.leaderWorkerId || "");
      const selectedIds = new Set([
        ...(Array.isArray(draft.workerIds) ? draft.workerIds : []),
        ...(Array.isArray(draft.otherTeamWorkerIds) ? draft.otherTeamWorkerIds : []),
      ].map((id) => String(id || "")).filter(Boolean));
      selectedIds.delete(leaderId);
      draft.workerIds = [];
      draft.otherTeamWorkerIds = [];
      selectedIds.forEach((id) => {
        const worker = state.workers.find((row) => row.id === id);
        if (!worker) return;
        if (team && worker.team === team) draft.workerIds.push(id);
        else if (counterpartTeam && worker.team === counterpartTeam) draft.otherTeamWorkerIds.push(id);
      });
      return draft;
    }

    function normalizeWorkPrepToolIds(draft) {
      const category = categoryById(draft.categoryId);
      const availableIds = new Set(category ? visibleToolsForCategory(category.id).map((tool) => tool.id) : []);
      return sanitizeToolIds(draft.toolIds).filter((id) => availableIds.has(id));
    }

    function createWorkPrepRecordFromDraft(draft) {
      const now = new Date().toISOString();
      const cleanDraft = createWorkPrepDraft(draft);
      const id = cleanDraft.id || uid("workprep");
      return {
        id,
        workDate: cleanDraft.workDate,
        appearanceTime: cleanDraft.appearanceTime || DEFAULT_WORK_PREP_APPEARANCE_TIME,
        team: cleanDraft.team,
        shipNo: cleanDraft.shipNo,
        categoryId: cleanDraft.categoryId,
        leaderWorkerId: cleanDraft.leaderWorkerId,
        workerIds: normalizeWorkPrepWorkerIds(cleanDraft),
        otherTeamWorkerIds: normalizeOtherTeamWorkPrepWorkerIds(cleanDraft),
        toolIds: normalizeWorkPrepToolIds(cleanDraft),
        status: normalizeWorkPrepStatus(cleanDraft.status || "preparing"),
        statusHistory: WorkPrepTimelineRules.upsertMilestone(cleanDraft.statusHistory || [], {
          kind: "register",
          changedAt: cleanDraft.createdAt || now,
          actorIds: cleanDraft.leaderWorkerId ? [cleanDraft.leaderWorkerId] : [],
          actorLabel: workPrepRegistrationActor(cleanDraft),
        }),
        createdAt: cleanDraft.createdAt || now,
        updatedAt: now,
      };
    }

    function upsertWorkPrepRecord(draft) {
      const record = createWorkPrepRecordFromDraft(draft);
      const index = state.workPrepRecords.findIndex((row) => row.id === record.id);
      if (index >= 0) state.workPrepRecords[index] = { ...state.workPrepRecords[index], ...record };
      else state.workPrepRecords = [record, ...state.workPrepRecords];
      saveWorkPrepRecords();
      if (isSyncConfigured()) {
        enqueueSyncRows("workPrepRecords", [record]);
      }
      return record;
    }

    function workPrepPendingSyncJobs(record) {
      if (!record?.id) return [];
      const recordId = String(record.id);
      return normalizePendingSyncQueue(state.pendingSyncQueue).filter((job) => (
        job.type === "rows"
        && (job.rowIdsByKey?.workPrepRecords || []).map(String).includes(recordId)
      ));
    }

    function workPrepSyncPresentation(record) {
      if (!isSyncConfigured() || !window.supabase) {
        return {
          state: "offline",
          label: "기기에만 저장",
          detail: "연결되면 서버로 자동 전송됩니다.",
        };
      }
      const jobs = workPrepPendingSyncJobs(record);
      if (!jobs.length) {
        return {
          state: "synced",
          label: "서버 반영 완료",
          detail: "PC와 다른 기기에서도 확인할 수 있습니다.",
        };
      }
      if (jobs.some((job) => Number(job.attempts || 0) > 0 || job.nextRetryAt)) {
        return {
          state: "retry",
          label: "서버 재전송 대기",
          detail: "기기에는 저장되었으며 연결이 회복되면 자동 재전송합니다.",
        };
      }
      return {
        state: "pending",
        label: "서버 반영 중",
        detail: "화면을 바로 이동해도 전송은 계속됩니다.",
      };
    }

    function workPrepRecordById(recordId) {
      return state.workPrepRecords.find((row) => row.id === recordId) || null;
    }

    function updateWorkPrepRecordStatus(recordId, status) {
      const normalized = normalizeWorkPrepStatus(status);
      const now = serverNow().toISOString();
      let updated = null;
      state.workPrepRecords = state.workPrepRecords.map((row) => {
        if (row.id !== recordId) return row;
        updated = workPrepRecordWithStatus(row, normalized, { changedAt: now });
        return updated;
      });
      if (updated) {
        saveWorkPrepRecords();
        if (isSyncConfigured()) {
          enqueueSyncRows("workPrepRecords", [updated]);
          flushPendingSyncQueue();
        }
      }
      return updated;
    }

    async function updateWorkPrepAdminStatus(recordId, status) {
      if (!requireAdminWrite()) return;
      const record = workPrepRecordById(recordId);
      if (!record) return;
      const normalized = normalizeWorkPrepStatus(status);
      const previous = {
        ...record,
        statusHistory: Array.isArray(record.statusHistory) ? [...record.statusHistory] : [],
      };
      if (normalizeWorkPrepStatus(record.status) === normalized) {
        toast("변경된 작업지시서 상태가 없습니다.");
        return;
      }
      const changedAt = serverNow().toISOString();
      const updated = workPrepRecordWithStatus(record, normalized, {
        changedAt,
        actor: workPrepActorLabel(),
      });
      state.workPrepRecords = state.workPrepRecords.map((row) => row.id === record.id ? updated : row);
      saveWorkPrepRecords();
      const ok = await upsertAdminRows("workPrepRecords", [updated]);
      if (!ok) {
        state.workPrepRecords = state.workPrepRecords.map((row) => row.id === record.id ? previous : row);
        saveWorkPrepRecords();
        render();
        return;
      }
      persist();
      renderPreservingScroll();
      toast("작업지시서 상태를 변경했습니다.");
    }

    async function deleteWorkPrepRecord(recordId) {
      const record = workPrepRecordById(recordId);
      if (!record) return toast("삭제할 작업지시서를 찾을 수 없습니다.");
      if (!canOpenWorkPrepRegister()) return toast("작업지시서를 삭제할 권한이 없습니다.");
      const category = categoryById(record.categoryId);
      const title = `${record.shipNo || "-"} ${category ? workLabel(category) : "작업지시서"}`;
      if (!window.confirm(`${title} 작업지시서를 삭제할까요?\n삭제 후 복구할 수 없습니다.`)) return;
      if (isSyncConfigured() && !(await deleteRemoteRows("workPrepRecords", [record.id]))) return;
      rememberDeletedWorkPrepRecordId(record.id);
      state.workPrepRecords = state.workPrepRecords.filter((row) => row.id !== record.id);
      if (state.workPrepDraft?.id === record.id) {
        state.workPrepDraft = createFreshWorkPrepRegistrationDraft(state.workPrepDraft);
      }
      saveWorkPrepRecords();
      renderPreservingScroll();
      toast("작업지시서를 삭제했습니다.");
    }

    function workPrepParticipantWorkerIds(record) {
      const ids = new Set([
        String(record?.leaderWorkerId || ""),
        ...(Array.isArray(record?.workerIds) ? record.workerIds : []),
        ...(Array.isArray(record?.otherTeamWorkerIds) ? record.otherTeamWorkerIds : []),
      ].map((id) => String(id || "").trim()).filter(Boolean));
      return [...ids].filter((id) => state.workers.some((worker) => worker.id === id));
    }

    function isWorkPrepParticipant(record, workerId) {
      const id = String(workerId || "").trim();
      if (!id) return false;
      return workPrepParticipantWorkerIds(record).includes(id);
    }

    function inspectionWorkPrepWorkerId(inspection, record) {
      const savedId = String(inspection?.workPrepWorkerId || "").trim();
      if (savedId) return savedId;
      const workerName = normalizedWorkerName(inspection?.worker || "");
      if (!workerName) return "";
      const participantIds = new Set(workPrepParticipantWorkerIds(record));
      return state.workers.find((worker) =>
        participantIds.has(worker.id) && normalizedWorkerName(worker.name || "") === workerName
      )?.id || "";
    }

    function workPrepSubmissionProgress(record) {
      const participantIds = workPrepParticipantWorkerIds(record);
      const participantSet = new Set(participantIds);
      const submittedIds = new Set();
      workPrepSubmissionInspections(record)
        .forEach((inspection) => {
          const workerId = inspectionWorkPrepWorkerId(inspection, record);
          if (participantSet.has(workerId)) submittedIds.add(workerId);
        });
      return {
        done: submittedIds.size,
        total: participantIds.length,
        submittedIds: [...submittedIds],
        complete: Boolean(participantIds.length) && submittedIds.size >= participantIds.length,
      };
    }

    function workPrepSubmissionInspections(record) {
      const recordId = String(record?.id || "");
      if (!recordId) return [];
      return state.inspections.filter((inspection) => String(inspection.workPrepRecordId || "") === recordId);
    }

    function hasSubmittedWorkPrepInspection(record, workerId) {
      const id = String(workerId || "").trim();
      if (!id) return false;
      return workPrepSubmissionProgress(record).submittedIds.includes(id);
    }

    function updateWorkPrepRecordUsageFromSubmissions(recordId) {
      const record = workPrepRecordById(recordId);
      if (!record) return null;
      const progress = workPrepSubmissionProgress(record);
      if (progress.complete) {
        return applyWorkPrepMilestone(record.id, "used", {
          kind: "complete",
          changedAt: serverNow().toISOString(),
          actorIds: progress.submittedIds,
          replaceActors: true,
        });
      }
      if (normalizeWorkPrepStatus(record.status) === "used") return updateWorkPrepRecordStatus(record.id, "confirmed");
      return record;
    }

    function isHiddenPledgeAnalyticsWorker(worker) {
      if (!worker) return false;
      const id = String(worker.id || worker.workerId || "").trim();
      const name = normalizedWorkerName(worker.name || worker.worker || worker.workerNameSnapshot || "");
      return HIDDEN_PLEDGE_ANALYTICS_WORKER_IDS.has(id) || HIDDEN_PLEDGE_ANALYTICS_WORKER_NAMES.has(name);
    }

    function visiblePledgeAnalyticsWorkers() {
      return state.workers.filter((worker) => !isHiddenPledgeAnalyticsWorker(worker));
    }

    function hiddenPledgeAnalyticsWorkerName(name) {
      return HIDDEN_PLEDGE_ANALYTICS_WORKER_NAMES.has(normalizedWorkerName(name));
    }

    function visiblePledgeAnalyticsWorkerName(name) {
      const workerName = normalizedWorkerName(name);
      if (!workerName) return false;
      return visiblePledgeAnalyticsWorkers().some((worker) => normalizedWorkerName(worker.name) === workerName);
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
      if (state.draft.pledgeSignatureCleared) return false;
      const cached = cachedPledgeSignatureForWorker(state.draft.worker);
      if (!cached) return false;
      state.draft.pledgeSignature = cached;
      state.draft.pledgeSignatureCleared = false;
      saveJson("draft", state.draft);
      return true;
    }

    function browserNotificationsAvailable() {
      return typeof window !== "undefined" && "Notification" in window;
    }

    function pushNotificationsSupported() {
      return Boolean(
        browserNotificationsAvailable() &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        window.isSecureContext
      );
    }

    function pushSubscriptionState() {
      return loadJson("pushSubscriptionState", {});
    }

    function savePushSubscriptionState(value) {
      saveJson("pushSubscriptionState", value && typeof value === "object" ? value : {});
    }

    function pushSubscriptionStatus() {
      return state?.pushSubscriptionStatus && typeof state.pushSubscriptionStatus === "object" ? state.pushSubscriptionStatus : {};
    }

    function savePushSubscriptionStatus(value) {
      const status = value && typeof value === "object" ? value : {};
      state.pushSubscriptionStatus = status;
      saveJson("pushSubscriptionStatus", state.pushSubscriptionStatus);
      if (status.workerId) saveWorkerPushSubscriptionStatuses([status]);
    }

    function workerPushSubscriptionStatuses() {
      return state?.workerPushSubscriptionStatuses && typeof state.workerPushSubscriptionStatuses === "object"
        ? state.workerPushSubscriptionStatuses
        : {};
    }

    function saveWorkerPushSubscriptionStatuses(rows) {
      const next = { ...workerPushSubscriptionStatuses() };
      (Array.isArray(rows) ? rows : [rows]).filter(Boolean).forEach((row) => {
        const status = normalizeWorkerPushSubscriptionStatus(row.workerId || row.worker_id, row);
        if (status.workerId) next[status.workerId] = status;
      });
      state.workerPushSubscriptionStatuses = next;
      saveJson("workerPushSubscriptionStatuses", next);
    }

    function workerPushSubscriptionStatusFor(workerId) {
      const id = String(workerId || "").trim();
      if (!id) return {};
      const status = workerPushSubscriptionStatuses()[id];
      if (status && typeof status === "object") return status;
      const current = pushSubscriptionStatus();
      return current.workerId === id ? current : {};
    }

    function workerPushSubscriptionStatusRefreshNeeded(workerIds, maxAgeMs = 60 * 1000) {
      const ids = [...new Set((Array.isArray(workerIds) ? workerIds : []).map((id) => String(id || "").trim()).filter(Boolean))];
      if (!ids.length) return false;
      return ids.some((id) => {
        const checkedAt = Date.parse(workerPushSubscriptionStatusFor(id).checkedAt || "");
        return !Number.isFinite(checkedAt) || Date.now() - checkedAt > maxAgeMs;
      });
    }

    function pushStatusForCurrentWorker() {
      const workerId = state.workerSession?.workerId || "";
      const workerStatus = workerPushSubscriptionStatusFor(workerId);
      if (workerStatus.workerId) return workerStatus;
      const status = pushSubscriptionStatus();
      return status.workerId && status.workerId === workerId ? status : {};
    }

    function pushRegisteredForCurrentDevice() {
      const saved = pushSubscriptionState();
      return Boolean(saved.workerId && saved.workerId === state.workerSession?.workerId && saved.permission === "granted");
    }

    function pushRegisteredForCurrentWorker() {
      const remoteStatus = pushStatusForCurrentWorker();
      if (typeof remoteStatus.registered === "boolean") return remoteStatus.registered;
      return pushRegisteredForCurrentDevice();
    }

    function pushDeviceName() {
      const ua = navigator.userAgent || "";
      const mobileUa = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
      const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
      return mobileUa || coarsePointer ? "휴대폰" : "PC";
    }

    function pushTestNotificationEnabled() {
      return serverNow().getTime() < PUSH_TEST_NOTIFICATION_DISABLE_AT;
    }

    function base64UrlToUint8Array(value) {
      const padding = "=".repeat((4 - value.length % 4) % 4);
      const base64 = `${value}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
      const raw = window.atob(base64);
      return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
    }

    function timeoutAfter(ms) {
      return new Promise((resolve) => window.setTimeout(() => resolve(null), ms));
    }

    function rejectAfter(ms, message) {
      return new Promise((resolve, reject) => window.setTimeout(() => reject(new Error(message)), ms));
    }

    async function withPushTimeout(promise, ms, message) {
      return Promise.race([promise, rejectAfter(ms, message)]);
    }

    async function pushServiceWorkerRegistration() {
      if (!("serviceWorker" in navigator)) return null;
      try {
        const existing = await navigator.serviceWorker.getRegistration("/");
        if (!existing && !navigator.serviceWorker.controller) {
          await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
        }
        return await Promise.race([navigator.serviceWorker.ready, timeoutAfter(5000)]);
      } catch (error) {
        console.warn("push service worker registration failed", error);
        return null;
      }
    }

    async function createBrowserPushSubscription(registration) {
      const existing = await withPushTimeout(
        registration.pushManager.getSubscription(),
        5000,
        "push_subscription_lookup_timeout"
      );
      if (existing) return existing;
      return withPushTimeout(
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64UrlToUint8Array(PUSH_VAPID_PUBLIC_KEY),
        }),
        15000,
        "push_subscription_create_timeout"
      );
    }

    async function ensureBrowserNotificationPermission() {
      if (!browserNotificationsAvailable()) {
        toast("이 브라우저는 알림을 지원하지 않습니다.");
        return false;
      }
      if (Notification.permission === "granted") return true;
      if (Notification.permission === "denied") {
        toast("브라우저 알림 권한이 차단되어 있습니다.");
        return false;
      }
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") return true;
        toast("브라우저 알림 권한이 허용되지 않았습니다.");
      } catch (error) {
        console.error(error);
        toast("브라우저 알림 권한 요청 중 오류가 발생했습니다.");
      }
      return false;
    }

    function showBrowserNotification(title, options = {}) {
      if (!browserNotificationsAvailable() || Notification.permission !== "granted") return null;
      try {
        const notification = new Notification(title, {
          icon: "/assets/icons/notification-icon.png",
      badge: "/assets/icons/notification-icon.png",
          ...options,
        });
        window.setTimeout(() => notification.close?.(), 8000);
        return notification;
      } catch (error) {
        console.error(error);
        toast("브라우저 알림을 표시하지 못했습니다.");
        return null;
      }
    }

    function normalizeWorkerPushSubscriptionStatus(workerId, row) {
      return PUSH_RULES.normalizeWorkerPushSubscriptionStatus(workerId, row, serverNow().toISOString());
    }

    async function fetchWorkerPushSubscriptionStatuses(workerIds) {
      const ids = [...new Set((Array.isArray(workerIds) ? workerIds : []).map((id) => String(id || "").trim()).filter(Boolean))];
      const client = supabaseClient();
      if (!client || !ids.length) return [];
      const sender = pushSenderPayload();
      if (sender.senderWorkerId && sender.senderEmployeeNo) {
        try {
          const { data, error } = await client.functions.invoke("worker-push", {
            body: {
              action: "status",
              workerIds: ids,
              ...sender,
            },
          });
          if (!error && !data?.error) {
            const rows = Array.isArray(data?.statuses) ? data.statuses : [];
            return ids.map((id) => normalizeWorkerPushSubscriptionStatus(id, rows.find((row) => row?.workerId === id || row?.worker_id === id)));
          }
          console.warn("worker push status function failed", error || data?.error);
        } catch (error) {
          console.warn("worker push status function failed", error);
        }
      }
      return [];
    }

    async function fetchWorkerPushSubscriptionStatus(workerId) {
      const statuses = await fetchWorkerPushSubscriptionStatuses([workerId]);
      return statuses[0] || null;
    }

    async function refreshWorkerPushSubscriptionStatus(options = {}) {
      const worker = currentWorkerSessionWorker();
      if (!worker?.id || state.pushSubscriptionStatusChecking) return pushStatusForCurrentWorker();
      const current = pushStatusForCurrentWorker();
      const checkedAt = Date.parse(current.checkedAt || "");
      if (!options.force && Number.isFinite(checkedAt) && Date.now() - checkedAt < 60 * 1000) return current;
      state.pushSubscriptionStatusChecking = true;
      updatePushRegistrationControls();
      try {
        const status = await fetchWorkerPushSubscriptionStatus(worker.id);
        if (status) savePushSubscriptionStatus(status);
        return status;
      } catch (error) {
        console.warn("push subscription status check failed", error);
        return null;
      } finally {
        state.pushSubscriptionStatusChecking = false;
        updatePushRegistrationControls();
      }
    }

    async function refreshWorkerPushSubscriptionStatuses(options = {}) {
      const workerIds = state.workers.map((worker) => worker.id).filter(Boolean);
      if (!workerIds.length || state.workerPushSubscriptionStatusesChecking) return workerPushSubscriptionStatuses();
      if (!options.force && !workerPushSubscriptionStatusRefreshNeeded(workerIds)) return workerPushSubscriptionStatuses();
      state.workerPushSubscriptionStatusesChecking = true;
      renderWorkerPushSubscriptionStatusBadges();
      try {
        const statuses = await fetchWorkerPushSubscriptionStatuses(workerIds);
        saveWorkerPushSubscriptionStatuses(statuses);
        return workerPushSubscriptionStatuses();
      } catch (error) {
        console.warn("worker push statuses refresh failed", error);
        return workerPushSubscriptionStatuses();
      } finally {
        state.workerPushSubscriptionStatusesChecking = false;
        if (state.view === "manage" && ["workers", "push"].includes(state.manageTab)) {
          renderPreservingScroll();
        }
      }
    }

    function scheduleWorkerPushSubscriptionStatusRefresh(options = {}) {
      if (state.view !== "manage" || !["workers", "push"].includes(state.manageTab) || !state.adminMode) return;
      const workerIds = state.workers.map((worker) => worker.id).filter(Boolean);
      if (!options.force && !workerPushSubscriptionStatusRefreshNeeded(workerIds)) return;
      if (state.workerPushSubscriptionStatusesChecking || state.workerPushSubscriptionStatusTimer) return;
      state.workerPushSubscriptionStatusTimer = window.setTimeout(() => {
        state.workerPushSubscriptionStatusTimer = null;
        refreshWorkerPushSubscriptionStatuses(options).catch((error) => console.warn("worker push statuses refresh failed", error));
      }, 0);
    }

    function normalizeWorkerPushDevice(row) {
      return PUSH_RULES.normalizeWorkerPushDevice(row);
    }

    function currentWorkerPushDeviceWorker() {
      return state.workers.find((worker) => worker.id === state.workerPushDeviceWorkerId) || null;
    }

    function updateWorkerPushStatusFromDevices(workerId, devices) {
      const enabledCount = (Array.isArray(devices) ? devices : []).filter((device) => device.enabled !== false).length;
      saveWorkerPushSubscriptionStatuses([{
        workerId,
        registered: enabledCount > 0,
        subscriptionCount: enabledCount,
        checkedAt: serverNow().toISOString(),
      }]);
      renderWorkerPushSubscriptionStatusBadges();
    }

    async function invokeWorkerPushDeviceAction(body) {
      const client = supabaseClient();
      if (!client) throw new Error("server_required");
      const sender = pushSenderPayload();
      if (!sender.senderWorkerId || !sender.senderEmployeeNo) throw new Error("sender_required");
      const { data, error } = await client.functions.invoke("worker-push", {
        body: {
          ...body,
          ...sender,
        },
      });
      if (error || data?.error) throw new Error(error?.message || data.error);
      return data;
    }

    async function fetchWorkerPushDevices(workerId) {
      const data = await invokeWorkerPushDeviceAction({
        action: "devices",
        workerId,
      });
      return Array.isArray(data?.devices) ? data.devices.map(normalizeWorkerPushDevice) : [];
    }

    function renderWorkerPushDeviceManagerLoading() {
      state.workerPushDeviceLoading = true;
      renderPreservingScroll();
    }

    async function refreshWorkerPushDevices(workerId = state.workerPushDeviceWorkerId) {
      if (!workerId) return [];
      state.workerPushDeviceLoading = true;
      renderPreservingScroll();
      try {
        const devices = await fetchWorkerPushDevices(workerId);
        if (state.workerPushDeviceWorkerId === workerId) {
          state.workerPushDevices = devices;
          updateWorkerPushStatusFromDevices(workerId, devices);
        }
        return devices;
      } catch (error) {
        console.error(error);
        toast("알림 기기 목록을 불러오지 못했습니다.");
        return [];
      } finally {
        state.workerPushDeviceLoading = false;
        renderPreservingScroll();
      }
    }

    function openWorkerPushDeviceManager(event) {
      if (!state.adminMode) return toast("관리자 모드에서 알림 기기를 수정할 수 있습니다.");
      const button = event?.target?.closest("[data-worker-push-manage]");
      const workerId = button?.dataset.workerPushManage || "";
      const worker = state.workers.find((row) => row.id === workerId);
      if (!worker) return toast("작업자를 찾을 수 없습니다.");
      state.workerPushDeviceWorkerId = workerId;
      state.workerPushDevices = [];
      renderWorkerPushDeviceManagerLoading();
      refreshWorkerPushDevices(workerId).catch((error) => console.warn("worker push devices refresh failed", error));
    }

    function closeWorkerPushDeviceManager() {
      state.workerPushDeviceWorkerId = "";
      state.workerPushDeviceLoading = false;
      state.workerPushDeviceSavingId = "";
      state.workerPushDevices = [];
      renderPreservingScroll();
    }

    function workerPushDeviceInput(deviceId, selector) {
      return Array.from(document.querySelectorAll(selector))
        .find((node) => node.dataset.workerPushDeviceId === deviceId);
    }

    async function saveWorkerPushDevice(event) {
      const button = event?.target?.closest("[data-worker-push-device-save]");
      const deviceId = button?.dataset.workerPushDeviceSave || "";
      const workerId = state.workerPushDeviceWorkerId;
      if (!workerId || !deviceId) return;
      const labelInput = workerPushDeviceInput(deviceId, "[data-worker-push-device-label]");
      const enabledInput = workerPushDeviceInput(deviceId, "[data-worker-push-device-enabled]");
      state.workerPushDeviceSavingId = deviceId;
      renderPreservingScroll();
      try {
        await invokeWorkerPushDeviceAction({
          action: "updateDevice",
          workerId,
          subscriptionId: deviceId,
          deviceLabel: labelInput?.value || "알림 기기",
          enabled: Boolean(enabledInput?.checked),
        });
        toast("알림 기기 설정을 저장했습니다.");
        await refreshWorkerPushDevices(workerId);
        await refreshWorkerPushSubscriptionStatuses({ force: true });
      } catch (error) {
        console.error(error);
        toast(/sender_required|forbidden|403/i.test(String(error?.message || "")) ? "알림 기기 수정 권한을 확인하세요." : "알림 기기 설정 저장에 실패했습니다.");
      } finally {
        state.workerPushDeviceSavingId = "";
        renderPreservingScroll();
      }
    }

    async function deleteWorkerPushDevice(event) {
      const button = event?.target?.closest("[data-worker-push-device-delete]");
      const deviceId = button?.dataset.workerPushDeviceDelete || "";
      const workerId = state.workerPushDeviceWorkerId;
      if (!workerId || !deviceId) return;
      const device = state.workerPushDevices.find((row) => row.id === deviceId);
      if (!confirm(`${device?.deviceLabel || "알림 기기"} 구독을 삭제할까요?`)) return;
      state.workerPushDeviceSavingId = deviceId;
      renderPreservingScroll();
      try {
        await invokeWorkerPushDeviceAction({
          action: "deleteDevice",
          workerId,
          subscriptionId: deviceId,
        });
        toast("알림 기기를 삭제했습니다.");
        await refreshWorkerPushDevices(workerId);
        await refreshWorkerPushSubscriptionStatuses({ force: true });
      } catch (error) {
        console.error(error);
        toast(/sender_required|forbidden|403/i.test(String(error?.message || "")) ? "알림 기기 삭제 권한을 확인하세요." : "알림 기기 삭제에 실패했습니다.");
      } finally {
        state.workerPushDeviceSavingId = "";
        renderPreservingScroll();
      }
    }

    async function registerWorkerPushNotifications() {
      const worker = currentWorkerSessionWorker();
      if (!worker?.id) return toast("작업자 로그인 후 이 기기 알림을 등록하세요.");
      if (!pushNotificationsSupported()) return toast("이 브라우저는 휴대폰 Push 알림을 지원하지 않습니다.");
      if (state.pushRegistrationSubmitting) return;
      if (pushRegisteredForCurrentWorker()) return toast("이미 등록된 휴대폰 알림 구독이 있습니다.");
      const client = supabaseClient();
      if (!client) return toast("서버 연결이 필요합니다 — 잠시 후 다시 시도해주세요.");

      const employeeNo = normalizeEmployeeNo(state.workerSession?.employeeNo || "");
      if (!employeeNo) {
        state.pushEmployeeNoPromptOpen = true;
        updatePushRegistrationControls();
        focusPushEmployeeNoInput();
        return toast("사번을 입력하고 등록을 눌러주세요.");
      }
      const remoteStatus = await refreshWorkerPushSubscriptionStatus({ force: true });
      if (remoteStatus?.registered) return toast("이 기기는 이미 알림 등록이 되어 있습니다.");
      if (!(await ensureBrowserNotificationPermission())) return;

      state.pushRegistrationSubmitting = true;
      updatePushRegistrationControls();
      try {
        const registration = await pushServiceWorkerRegistration();
        if (!registration) return toast("서비스워커를 준비하지 못했습니다.");
        const subscription = await createBrowserPushSubscription(registration);
        const { data, error } = await client.functions.invoke("worker-push", {
          body: {
            action: "register",
            workerId: worker.id,
            employeeNo,
            subscription: subscription.toJSON(),
            userAgent: navigator.userAgent,
            deviceLabel: `${worker.name || currentWorkerSessionLabel()} ${pushDeviceName()}`,
          },
        });
        if (error || data?.error) throw new Error(error?.message || data.error);
        savePushSubscriptionState({
          workerId: worker.id,
          endpoint: subscription.endpoint,
          permission: Notification.permission,
          deviceName: pushDeviceName(),
          userAgent: navigator.userAgent,
          registeredAt: serverNow().toISOString(),
        });
        savePushSubscriptionStatus({
          workerId: worker.id,
          registered: true,
          subscriptionCount: Number(data?.subscriptionCount || 1),
          checkedAt: serverNow().toISOString(),
        });
        updatePushRegistrationControls();
        toast(`이 ${pushDeviceName()}로 브라우저 알림을 받을 수 있습니다.`);
      } catch (error) {
        console.error(error);
        if (/invalid_worker|forbidden|403/i.test(String(error?.message || ""))) {
          state.workerSession = { ...state.workerSession, employeeNo: "" };
          saveWorkerSession(state.workerSession);
          state.pushEmployeeNoPromptOpen = true;
          updatePushRegistrationControls();
          focusPushEmployeeNoInput();
          return toast("작업자 또는 사번을 확인하세요.");
        }
        if (/push_subscription_|permission denied|registration failed|aborterror/i.test(String(error?.message || ""))) {
          return toast("브라우저 Push 구독을 완료하지 못했습니다. 알림 권한을 확인해 주세요.");
        }
        toast("브라우저 알림 등록에 실패했습니다.");
      } finally {
        state.pushRegistrationSubmitting = false;
        updatePushRegistrationControls();
      }
    }

    async function submitWorkerPushEmployeeNo(event) {
      event?.preventDefault?.();
      const worker = currentWorkerSessionWorker();
      if (!worker?.id) return toast("작업자 로그인 후 이 기기 알림을 등록하세요.");
      const input = Array.from(document.querySelectorAll("[data-push-employee-no-input]"))
        .find((node) => !node.closest("[hidden]") && !node.disabled)
        || document.querySelector("[data-push-employee-no-input]");
      const employeeNo = normalizeEmployeeNo(input?.value || "");
      if (!employeeNo) {
        focusPushEmployeeNoInput();
        return toast("사번을 입력하세요.");
      }
      state.workerSession = { ...state.workerSession, employeeNo };
      saveWorkerSession(state.workerSession);
      state.pushEmployeeNoPromptOpen = false;
      updatePushRegistrationControls();
      await registerWorkerPushNotifications();
    }

    function focusPushEmployeeNoInput() {
      window.setTimeout(() => {
        const input = Array.from(document.querySelectorAll("[data-push-employee-no-input]"))
          .find((node) => !node.closest("[hidden]") && !node.disabled);
        input?.focus();
      }, 0);
    }

    function pushEmployeeNoFormHtml(prefix) {
      const inputId = `${prefix}PushEmployeeNoInput`;
      return `<form id="${prefix}PushEmployeeNoForm" class="push-employee-form ${prefix}-push-employee-form" data-push-employee-no-form hidden>
        <label for="${inputId}">사번 재확인</label>
        <div class="push-employee-row">
          <input id="${inputId}" class="push-employee-input" data-push-employee-no-input type="password" inputmode="text" autocomplete="current-password" autocapitalize="characters" placeholder="사번 입력" />
          <button class="push-employee-submit" type="submit">등록</button>
        </div>
      </form>`;
    }

    function pushSenderPayload() {
      return {
        senderWorkerId: state.workerSession?.workerId || "",
        senderEmployeeNo: normalizeEmployeeNo(state.workerSession?.employeeNo || ""),
      };
    }

    async function sendWorkerPushNotification(workerIds, notification, options = {}) {
      const ids = [...new Set((Array.isArray(workerIds) ? workerIds : []).map((id) => String(id || "").trim()).filter(Boolean))];
      if (!ids.length && options.serverResolvedTargets !== true) {
        return { ok: true, sent: 0, failed: 0, targetWorkers: 0 };
      }
      const client = supabaseClient();
      if (!client) {
        if (!options.silent) toast("서버 동기화 연결이 필요합니다.");
        return null;
      }
      try {
        const { data, error } = await client.functions.invoke("worker-push", {
          body: {
            action: "send",
            workerIds: ids,
            notification,
            sendKind: options.kind || "",
            ...pushSenderPayload(),
          },
        });
        if (error || data?.error) throw new Error(error?.message || data.error);
        return data;
      } catch (error) {
        console.error(error);
        if (!options.silent) {
          if (/sender_|forbidden|403/i.test(String(error?.message || ""))) {
            toast("알림 발송 권한 또는 작업자 로그인을 확인하세요.");
          } else {
            toast("브라우저 알림 발송에 실패했습니다.");
          }
        }
        return null;
      }
    }

    function updateAdminPushDraftField(field, value) {
      const draft = createAdminPushDraft(state.adminPushDraft);
      if (field === "title") draft.title = String(value || "").slice(0, 80);
      if (field === "body") draft.body = String(value || "").slice(0, 220);
      if (field === "url") draft.url = String(value || "").trim() || "/index.html";
      state.adminPushDraft = draft;
      saveAdminPushDraft();
    }

    function setAdminPushStyle(styleId) {
      state.adminPushDraft = createAdminPushDraft({ ...state.adminPushDraft, style: adminPushStyleMeta(styleId).id });
      saveAdminPushDraft();
      renderPreservingScroll();
    }

    function toggleAdminPushWorker(workerId, checked) {
      const id = String(workerId || "").trim();
      if (!id) return;
      const selected = new Set(normalizeAdminPushWorkerIds(state.adminPushDraft.selectedWorkerIds));
      if (checked) selected.add(id);
      else selected.delete(id);
      state.adminPushDraft = createAdminPushDraft({ ...state.adminPushDraft, selectedWorkerIds: [...selected] });
      saveAdminPushDraft();
      renderPreservingScroll();
    }

    async function refreshPushManagerStatuses() {
      await refreshWorkerPushSubscriptionStatuses({ force: true });
      toast("푸시 구독 상태를 새로 확인했습니다.");
    }

    async function sendAdminPush() {
      if (state.adminPushSending) return;
      if (!state.adminMode) return toast("관리자만 사용할 수 있는 기능입니다.");
      if (!canSendPledgeNotifications()) return toast("조장, 관리, 총무 작업자 로그인에서 발송할 수 있습니다.");
      const targets = adminPushTargetWorkers();
      if (!targets.length) return toast("발송 대상 작업자를 선택하세요.");
      const preview = adminPushNotificationPreview();
      state.adminPushSending = true;
      renderPreservingScroll();
      try {
        const result = await sendWorkerPushNotification(targets.map((worker) => worker.id), {
          title: preview.title,
          body: preview.body,
          tag: `admin-${preview.style.id}-${Date.now()}`,
          url: preview.url,
          style: preview.style.id,
          requireInteraction: Boolean(preview.style.requireInteraction),
          renotify: Boolean(preview.style.renotify),
          vibrate: preview.style.vibrate,
        }, { kind: "adminManual" });
        if (result) toast(`푸시 발송 완료: ${result.sent || 0}건 전송, ${result.failed || 0}건 실패`);
      } finally {
        state.adminPushSending = false;
        renderPreservingScroll();
      }
    }

    async function testCurrentWorkerPushNotification() {
      if (!pushTestNotificationEnabled()) return toast("테스트 알림은 비활성화되었습니다.");
      const worker = currentWorkerSessionWorker();
      if (!worker?.id) return toast("작업자 로그인 후 테스트 알림을 보낼 수 있습니다.");
      const result = await sendWorkerPushNotification([worker.id], {
        title: "GS 안전 체크리스트 테스트",
        body: `${currentWorkerSessionLabel()}님 ${pushDeviceName()} 브라우저 알림 테스트입니다.`,
        tag: `push-test-${worker.id}-${Date.now()}`,
        url: `/${currentPageName() || "index.html"}`,
      }, { kind: "test" });
      if (!result) return;
      if (result.sent) {
        toast(`테스트 알림을 ${result.sent}대 기기로 보냈습니다.`);
        return;
      }
      if (result.failed) {
        toast(`테스트 알림 발송 실패 ${result.failed}대`);
        return;
      }
      toast("등록된 알림 구독이 없습니다.");
    }

    function workerIdsForNames(names) {
      const targets = new Set((Array.isArray(names) ? names : []).map(normalizedWorkerName).filter(Boolean));
      return state.workers
        .filter((worker) => targets.has(normalizedWorkerName(worker.name)))
        .map((worker) => worker.id)
        .filter(Boolean);
    }

    function unsafePushTargetWorkerIds() {
      return state.workers.filter((w) => w.unsafePushTarget).map((w) => w.id).filter(Boolean);
    }

    function normalizePushTemplateKind(kind) {
      return PUSH_RULES.normalizePushTemplateKind(kind);
    }

    function normalizePushTemplate(template, fallback) {
      return PUSH_RULES.normalizePushTemplate(template, fallback);
    }

    function pushNotificationTemplates() {
      const saved = loadJson("pushNotificationTemplates", {});
      return Object.keys(DEFAULT_PUSH_NOTIFICATION_TEMPLATES).reduce((templates, kind) => {
        templates[kind] = normalizePushTemplate(saved?.[kind], DEFAULT_PUSH_NOTIFICATION_TEMPLATES[kind]);
        return templates;
      }, {});
    }

    function pushNotificationTemplate(kind) {
      const templateKind = normalizePushTemplateKind(kind);
      if (!templateKind) return { title: "", body: "" };
      return pushNotificationTemplates()[templateKind];
    }

    function savePushNotificationTemplate(kind, template) {
      const templateKind = normalizePushTemplateKind(kind);
      if (!templateKind) return false;
      const templates = pushNotificationTemplates();
      templates[templateKind] = normalizePushTemplate(template, DEFAULT_PUSH_NOTIFICATION_TEMPLATES[templateKind]);
      return saveJson("pushNotificationTemplates", templates);
    }

    function replacePushTemplateTokens(text, context = {}) {
      return PUSH_RULES.replacePushTemplateTokens(text, context);
    }

    function pushNotificationFromTemplate(kind, context = {}) {
      return PUSH_RULES.pushNotificationFromTemplate(kind, context, pushNotificationTemplates());
    }

    function pushTemplateMeta(kind) {
      return PUSH_RULES.pushTemplateMeta(kind, {
        todayLabel: today().replace(/-/g, "."),
        pledgePendingCount: pledgePendingRows().length || 1,
        senderName: currentWorkerSessionWorker()?.name || "관리자",
      });
    }

    function adminPushStyleMeta(styleId) {
      return PUSH_RULES.adminPushStyleMeta(styleId);
    }

    function normalizeAdminPushTargetMode(value) {
      return PUSH_RULES.normalizeAdminPushTargetMode(value);
    }

    function normalizeAdminPushWorkerIds(value) {
      return PUSH_RULES.normalizeAdminPushWorkerIds(value);
    }

    function createAdminPushDraft(overrides = {}) {
      return PUSH_RULES.createAdminPushDraft(overrides);
    }

    function saveAdminPushDraft() {
      state.adminPushDraft = createAdminPushDraft(state.adminPushDraft);
      saveJson("adminPushDraft", state.adminPushDraft);
    }

    function pledgeRowStatus(row) {
      return row?.status || (row?.done ? "완료" : "미완료");
    }

    function pledgePendingRows() {
      return pledgeDashboardRows().filter((row) => pledgeRowStatus(row) === "미완료");
    }

    function canSendPledgeNotifications() {
      const worker = currentWorkerSessionWorker();
      return canWorkerPerformLeaderActions(worker);
    }

    async function notifyPledgePendingWorkers() {
      if (!canSendPledgeNotifications()) {
        toast("조장 또는 관리 담당자만 미완료자 알림을 발송할 수 있습니다.");
        return;
      }
      const pendingRows = pledgePendingRows();
      if (!pendingRows.length) {
        toast("서약 미완료자가 없습니다.");
        return;
      }
      const names = pendingRows.map((row) => row.name).filter(Boolean);
      const workerIds = pendingRows.map((row) => row.workerId).filter(Boolean);
      const notification = pushNotificationFromTemplate("pledgePending", {
        날짜: today().replace(/-/g, "."),
        인원: pendingRows.length,
      });
      const result = await sendWorkerPushNotification(workerIds, {
        ...notification,
        tag: `pledge-pending-${today()}`,
        url: "/pledge.html",
      }, { kind: "pledgePending" });
      if (!result) return;
      const targetText = result.sent ? `${result.sent}대 휴대폰` : `${names.length}명`;
      toast(result.sent ? `미완료자 알림을 ${targetText}으로 보냈습니다.` : "등록된 브라우저 알림 구독이 없습니다.");
    }

    async function notifyUnsafeIssueRegistered(row) {
      if (!row) return;
      const notification = pushNotificationFromTemplate("unsafeIssue", {
        호선: row.shipNo ? `호선 ${row.shipNo}` : "호선 미지정",
        등록자: row.workerNameSnapshot || "작업자",
        내용: shortUnsafeTitle(row.content || "불안전요소"),
      });
      await sendWorkerPushNotification(unsafePushTargetWorkerIds(), {
        ...notification,
        tag: `unsafe-${row.id || Date.now()}`,
        url: "/unsafe.html",
      }, { silent: true, kind: "unsafeIssue" });
    }

    async function notifyMissingMaterialRegistered(row) {
      if (!row) return false;
      const notification = pushNotificationFromTemplate("missingMaterial", {
        호선: row.shipNo ? `호선 ${row.shipNo}` : "호선 미지정",
        등록자: row.workerNameSnapshot || "작업자",
        자재: row.materialName || "자재명 미지정",
        수량: materialQuantity(row),
      });
      const result = await sendWorkerPushNotification([], {
        ...notification,
        tag: `material-${row.id || Date.now()}`,
        url: "/materials.html",
      }, { silent: true, kind: "missingMaterial", serverResolvedTargets: true });
      return Boolean(
        result
        && Number(result.sent || 0) > 0
        && Number(result.failed || 0) === 0
        && Number(result.subscribedWorkers || 0) >= Number(result.targetWorkers || 0)
      );
    }

    function normalizePendingMissingMaterialNotifications(value) {
      const byKey = new Map();
      (Array.isArray(value) ? value : []).forEach((entry) => {
        const materialId = String(entry?.materialId || "");
        const ownerWorkerId = String(entry?.ownerWorkerId || "");
        if (!materialId || !ownerWorkerId) return;
        byKey.set(`${ownerWorkerId}:${materialId}`, {
          materialId,
          ownerWorkerId,
          attempts: Math.max(0, Number(entry.attempts) || 0),
          createdAt: String(entry.createdAt || ""),
          nextRetryAt: String(entry.nextRetryAt || ""),
        });
      });
      return [...byKey.values()];
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

    const savedAdminMode = loadAdminMode();
    const savedAdminAuthSource = savedAdminMode ? loadAdminAuthSource() : "";
    const savedAdminSession = savedAdminMode && savedAdminAuthSource === "worker" ? loadAdminSession() : null;
    if (savedAdminMode && (savedAdminAuthSource !== "worker" || !adminSessionLooksActive(savedAdminSession))) {
      saveAdminMode(false);
      clearAdminSession();
    }
    const initialAdminMode = savedAdminMode && savedAdminAuthSource === "worker" && adminSessionLooksActive(savedAdminSession);
    const initialAdminAuthSource = initialAdminMode ? savedAdminAuthSource : "";
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
      pendingMissingMaterialNotifications: normalizePendingMissingMaterialNotifications(loadJson("pendingMissingMaterialNotifications", [])),
      missingMaterialNotificationFlushInFlight: false,
      monthlyWorkerRestDays: loadJson("monthlyWorkerRestDays", {
        useKoreanPublicHolidays: true,
        holidayData: {},
        customRestDays: [],
      }),
      monthlyWorkerExpandedKeys: loadJson("monthlyWorkerExpandedKeys", null),
      selectedMonthlyWorkerMonth: "",
      monthlyWorkerMonthHighlight: false,
      monthlyWorkerMonthHighlightTimer: null,
      monthlyRestDayPanelOpen: false,
      photoViewer: null,
      unsafePhotoFiles: [],
      unsafePhotoUploadingIds: [],
      selectedCategoryId: null,
      manageCategoryId: null,
      workTypeManagerSelectedId: null,
      workTypeManagerTab: "summary",
      workTypeManagerMobileDetailOpen: false,
      workTypeSearchQuery: "",
      categoryToolSearchQuery: "",
      editCategoryId: null,
      editSectionId: null,
      sectionEditorDraft: null,
      sectionSaveSubmittingId: "",
      editItemId: null,
      editToolId: null,
      toolAddOpen: false,
      toolAddSubmitting: false,
      toolManagerOpen: false,
      categoryAddOpen: false,
      categoryToolDrafts: {},
      openAddItemSectionIds: [],
      openManageSectionId: null,
      categoryVisualOpen: false,
      workerFallbackOpen: false,
      pledgeWorkerCollapsed: false,
      pledgeShipCollapsed: false,
      pledgeViewDate: "",
      workPrepRegisterOpen: false,
      workPrepRecords: loadWorkPrepRecords(),
      deletedWorkPrepRecordIds: loadJson("deletedWorkPrepRecordIds", []),
      selectedWorkPrepDate: "",
      workPrepDateManuallySelected: false,
      workPrepDirectOpen: false,
      workPrepOtherWorkersOpen: false,
      workPrepAppearanceOpen: false,
      workPrepDraft: createWorkPrepDraft(loadJson("workPrepDraft", {})),
      draft: loadDraft(),
      checkSubmitSheetOpen: false,
      historyScope: "all",
      historyFilter: "all",
      historyShipNo: "",
      historyDetailId: null,
      selectedHistoryIds: [],
      toastTimer: null,
      syncMode: "offline",
      syncText: "로컬 저장",
      syncDetailsOpen: false,
      remotePullHealth: loadJson("remotePullHealth", {}) || {},
      serviceWorkerVersion: "",
      serviceWorkerCache: "",
      pendingSyncQueue: normalizePendingSyncQueue(loadJson("pendingSyncQueue", [])),
      syncRetryTimer: null,
      syncFlushInFlight: false,
      syncActiveJobId: "",
      syncActiveAbortController: null,
      lastRemotePullAt: Number(loadJson("lastRemotePullAt", 0)) || 0,
      lastRemoteDeleteReconcileAt: 0,
      screenMode: localStorage.getItem(storeKey("screenMode")) || "desktop",
      shipSortMode: normalizeShipSortMode(loadJson("shipSortMode", "stage")),
      shipDataCardOpenIds: loadJson("shipDataCardOpenIds", []),
      shipSearchQuery: "",
      toolSearchQuery: "",
      adminMode: initialAdminMode,
      adminEmail: initialAdminMode ? (initialAdminAuthSource === "worker" ? "작업자 권한" : "비밀번호 인증") : "",
      adminAuthSource: initialAdminAuthSource,
      adminSessionToken: initialAdminMode ? savedAdminSession.token : "",
      adminSessionWorkerId: initialAdminMode ? savedAdminSession.workerId : "",
      adminSessionExpiresAt: initialAdminMode ? (savedAdminSession.expiresAt || "") : "",
      scrollTimer: null,
      lastScrollY: 0,
      serverTimeOffsetMs: Number(loadJson("serverClock", {})?.offsetMs || 0),
      serverClockSyncedAt: String(loadJson("serverClock", {})?.syncedAt || ""),
      remotePullInFlight: false,
      remotePullQueuedOptions: null,
      remoteRefreshTimer: null,
      remotePollTimer: null,
      remoteRealtimeChannel: null,
      remoteRealtimeStatus: "",
      inspectionDeletionRealtimeChannel: null,
      inspectionDeletionRealtimeStatus: "",
      inspectionDeletionTableAvailable: null,
      remoteRealtimeRetryTimer: null,
      remoteRealtimeGapInFlight: false,
      remoteRealtimeGapQueuedReason: "",
      remoteRealtimeCursors: loadJson("remoteRealtimeCursors", {}) || {},
      lastRemoteChangeAt: 0,
      lastRemoteReconcileAt: Number(loadJson("lastRemoteReconcileAt", 0)) || 0,
      pendingCreatedWorkers: [],
      workerDeletionTombstones: new Set(),
      workerSession: loadWorkerSession(),
      pushSubscriptionStatus: loadJson("pushSubscriptionStatus", {}),
      workerPushSubscriptionStatuses: loadJson("workerPushSubscriptionStatuses", {}),
      pushSubscriptionStatusChecking: false,
      workerPushSubscriptionStatusesChecking: false,
      workerPushSubscriptionStatusTimer: null,
      workerPushDeviceWorkerId: "",
      workerPushDevices: [],
      workerPushDeviceLoading: false,
      workerPushDeviceSavingId: "",
      workerEditCardId: "",
      workerCreateSubmitting: false,
      workerDeleteSubmittingId: "",
      workerCreateRequest: { fingerprint: "", id: "" },
      pushEmployeeNoPromptOpen: false,
      pushRegistrationSubmitting: false,
      loginSubmitting: false,
      loginWorkerId: "",
      loginWorkerPickerOpen: false,
      loginWorkerSearch: "",
      lastLoginWorkerId: loadLastLoginWorkerId(),
      unsafeDraft: createUnsafeDraft(loadJson("unsafeDraft", {})),
      materialDraft: createMaterialDraft(loadJson("materialDraft", {})),
      unsafeFilters: loadJson("unsafeFilters", { shipNo: "", status: "", workerId: "", sort: "status" }),
      materialFilters: loadJson("materialFilters", { shipNo: "", status: "", workerId: "", materialName: "", sort: "status" }),
      workPrepFilters: loadJson("workPrepFilters", { shipNo: "", status: "", sort: "latest" }),
      manageTab: loadJson("manageTab", "workers"),
      manageMobileFilterOpen: false,
      manageMobileFilterDraft: null,
      adminPushDraft: createAdminPushDraft(loadJson("adminPushDraft", {})),
      adminPushSending: false,
      unsafeDetailId: "",
      materialDetailId: "",
      workPrepDetailId: "",
      lastUnsafeIssueId: "",
      lastMaterialId: "",
      lastMaterialNotificationState: "",
      lastInspectionId: "",
      inspectionSubmitting: false,
      unsafeSubmitting: false,
      pushTemplateEditorKind: "",
      pledgeTemplateEditing: false,
      remoteLoadedInspectionItemIds: [],
      remoteLoadedIssuePhotoTargetIds: [],
      archivedInspections: [],
      remoteLoadedInspectionRanges: {},
      remoteListLimits: loadJson("remoteListLimits", {}),
    };
    let cachedSupabaseClient = null;
    let workPrepMutationSessionPromise = null;
    let workPrepMutationSessionWorkerId = "";
    let workerMutationSessionPromise = null;
    let workerMutationSessionWorkerId = "";

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

    function routeQueryParam(name) {
      try {
        return new URLSearchParams(location.search).get(name) || "";
      } catch {
        return "";
      }
    }

    function routeShipNo() {
      return normalizeShipNo(String(routeQueryParam("shipNo") || "").trim());
    }

    function applyRouteFiltersFromQuery() {
      const shipNo = routeShipNo();
      if (!shipNo) return;
      if (state.view === "history") {
        state.historyScope = "all";
        state.historyFilter = "all";
        state.historyShipNo = shipNo;
        state.historyDetailId = null;
      }
      if (state.view === "manage") {
        const tab = routeQueryParam("tab");
        if (tab === "unsafe") {
          state.manageTab = "unsafe";
          state.unsafeDetailId = "";
          state.unsafeFilters = { ...state.unsafeFilters, shipNo, status: "" };
          saveJson("unsafeFilters", state.unsafeFilters);
          saveJson("manageTab", state.manageTab);
        }
        if (tab === "materials") {
          state.manageTab = "materials";
          state.materialFilters = { ...state.materialFilters, shipNo, status: "", materialName: "" };
          saveJson("materialFilters", state.materialFilters);
          saveJson("manageTab", state.manageTab);
        }
      }
    }

    async function boot() {
      migrateIfNeeded();
      cleanupDeliveredShips(false);
      prepareInitialManageFilters();
      applyRouteFiltersFromQuery();
      applyScreenMode();
      requestServiceWorkerVersion();
      updateHeaderClock();
      render();
      replaceRouteState();
      setupScrollNav();
      setInterval(updateHeaderClock, 1000);
      setInterval(syncServerClock, SERVER_CLOCK_REFRESH_MS);
      setInterval(() => {
        flushPendingSyncQueue();
        flushPendingMissingMaterialNotifications();
      }, SYNC_RETRY_DELAY_MS);
      window.addEventListener("resize", applyScreenMode);
      window.addEventListener("online", handleSyncWake);
      window.addEventListener("focus", handleSyncWake);
      window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") handleSyncWake();
      });
      window.addEventListener("storage", handleStorageSyncWake);
      window.addEventListener("popstate", restoreRouteState);
      window.addEventListener("beforeunload", (event) => {
        if (!state.sectionSaveSubmittingId && !isSectionEditorDirty()) return;
        event.preventDefault();
        event.returnValue = "";
      });
      setSyncStatus(isSyncConfigured() ? "동기화 대기" : "로컬 저장", isSyncConfigured() ? "pending" : "offline");
      if (isSyncConfigured()) {
        await startRemoteSync();
        syncServerClock();
        await flushPendingSyncQueue();
        await flushPendingMissingMaterialNotifications();
        await pullRemote({ force: true });
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
      applyCategoryToolMetaItems();
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
            storageBucket: row.storageBucket || row.storage_bucket || PICTOGRAM_IMAGE_BUCKET,
            storagePath: row.storagePath || row.storage_path || "",
            mimeType: row.mimeType || row.mime_type || "",
            fileSize: Number(row.fileSize || row.file_size || 0),
          })),
      ];
      state.draft = createDraft(state.draft);
      state.workPrepDraft = createWorkPrepDraft(state.workPrepDraft);
      state.workers = (Array.isArray(state.workers) ? state.workers : []).map((worker) => ({
        id: worker.id || uid("worker"),
        name: String(worker.name || "").trim(),
        team: String(worker.team || "").trim(),
        position: normalizeWorkerPosition(worker.position),
        active: worker.active !== false,
        unsafePushTarget: Boolean(worker.unsafePushTarget || worker.unsafe_push_target),
        createdAt: worker.createdAt || serverNow().toISOString(),
        updatedAt: worker.updatedAt || worker.createdAt || serverNow().toISOString(),
      })).filter((worker) => worker.name);
      state.unsafeIssues = normalizeStatusRecords(state.unsafeIssues, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES);
      state.missingMaterials = normalizeStatusRecords(state.missingMaterials, ISSUE_MATERIAL_RULES.MATERIAL_STATUSES);
      state.issuePhotos = Array.isArray(state.issuePhotos) ? state.issuePhotos : [];
      state.pendingPhotoUploads = normalizePendingPhotoUploads(state.pendingPhotoUploads).map((row) => ({
        ...row,
        ownerWorkerId: row.ownerWorkerId
          || state.unsafeIssues.find((issue) => issue.id === row.issueId)?.workerId
          || "",
      }));
      state.unsafeDraft = createUnsafeDraft(state.unsafeDraft);
      state.materialDraft = createMaterialDraft(state.materialDraft);
      state.unsafeFilters = { shipNo: "", status: "", workerId: "", sort: "status", ...state.unsafeFilters };
      state.materialFilters = { shipNo: "", status: "", workerId: "", materialName: "", sort: "status", ...state.materialFilters };
      state.workPrepFilters = { shipNo: "", status: "", sort: "latest", ...state.workPrepFilters };
      if (!["workers", "push", "unsafe", "materials", "workPrep"].includes(state.manageTab)) state.manageTab = "workers";
    }

    function normalizeStatusRecords(records, statuses) {
      return NormalizationRules.normalizeStatusRecords(records, statuses, {
        now: () => serverNow().toISOString(),
        buildRecordTimeline: ISSUE_MATERIAL_RULES.buildRecordTimeline,
      });
    }

    function normalizePendingPhotoUploads(records) {
      return NormalizationRules.normalizePendingPhotoUploads(records, {
        uid,
        now: () => serverNow().toISOString(),
        photoDataUrlForStorage: pendingPhotoDataUrlForStorage,
      });
    }

    function storedPictograms() {
      return state.pictograms
        .filter((row) => row.source !== "builtIn")
        .map(({ src, ...row }) => row);
    }

    function issuePhotosForStorage() {
      return state.issuePhotos.map(({ signedUrl, signedUrlExpiresAt, ...photo }) => photo);
    }

    function dedupeChecklistItems() {
      state.items = StateShapeRules.dedupeChecklistItems(state.items);
    }

    function dedupeTools() {
      state.tools = StateShapeRules.dedupeTools(state.tools, { normalizeToolName, compareToolWrittenOrder });
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
      const migrated = StateShapeRules.migrateOldChecklists(oldChecklists, { uid, colors: COLORS });
      state.categories = migrated.categories;
      state.sections = migrated.sections;
      state.items = migrated.items;
    }

    function dedupeShips() {
      state.ships = StateShapeRules.dedupeShips(state.ships, { normalizeShipNo, workflowStages: SHIP_WORKFLOW_STAGES });
    }

    function persist() {
      compactStoragePayloadsIfNeeded();
      saveJson("categories", state.categories);
      saveJson("sections", state.sections);
      saveJson("items", state.items);
      saveJson("tools", state.tools);
      saveJson("pictograms", storedPictograms());
      saveJson("ships", state.ships);
      saveJson("inspections", state.inspections);
      saveJson("inspectionItems", state.inspectionItems);
      saveJson("draft", state.draft);
      saveJson("workers", state.workers);
      saveJson("unsafeIssues", state.unsafeIssues);
      saveJson("missingMaterials", state.missingMaterials);
      saveJson("issuePhotos", issuePhotosForStorage());
      saveJson("pendingPhotoUploads", state.pendingPhotoUploads);
      saveJson("pendingSyncQueue", state.pendingSyncQueue);
      saveJson("lastRemotePullAt", state.lastRemotePullAt || 0);
      saveJson("remoteRealtimeCursors", state.remoteRealtimeCursors || {});
      saveJson("unsafeDraft", state.unsafeDraft);
      saveJson("materialDraft", state.materialDraft);
      saveJson("unsafeFilters", state.unsafeFilters);
      saveJson("materialFilters", state.materialFilters);
      saveJson("workPrepFilters", state.workPrepFilters);
      saveJson("manageTab", state.manageTab);
      if (compactStoragePayloadsIfNeeded()) {
        saveJson("pendingPhotoUploads", state.pendingPhotoUploads);
        saveJson("pictograms", storedPictograms());
      }
      if (shouldWarnStorage() && !state.storageWarningShown) {
        state.storageWarningShown = true;
        toast("저장 공간이 부족합니다. 오래된 이력과 사진을 정리해주세요.");
      }
    }

    function routeState() {
      return {
        app: "shipyardSafety",
        view: state.view,
        workPrepRegisterOpen: state.view === "check" && state.workPrepRegisterOpen,
        selectedCategoryId: state.selectedCategoryId,
        historyScope: state.historyScope,
        historyFilter: state.historyFilter,
        historyShipNo: state.historyShipNo,
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
        state.workPrepRegisterOpen = false;
        state.selectedCategoryId = null;
        state.historyDetailId = null;
        clearCompletionStateForView("dashboard");
        render();
        scrollScreenTop();
        replaceRouteState();
        return;
      }
      state.view = routeViews().some((nav) => nav.id === route.view) ? route.view : "dashboard";
      state.workPrepRegisterOpen = state.view === "check" && Boolean(route.workPrepRegisterOpen);
      state.selectedCategoryId = route.selectedCategoryId || null;
      state.historyScope = normalizeHistoryScope(route.historyScope || "all");
      state.historyFilter = route.historyFilter || "all";
      state.historyShipNo = route.historyShipNo || "";
      state.historyDetailId = route.historyDetailId || null;
      if (state.view !== "check") {
        state.selectedCategoryId = null;
        state.workPrepRegisterOpen = false;
      }
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
      const enteringCheckView = view === "check" && state.view !== "check";
      const changed = state.view !== view || state.selectedCategoryId || state.historyDetailId;
      state.view = view;
      if (enteringCheckView) {
        state.selectedWorkPrepDate = "";
        state.workPrepDateManuallySelected = false;
      }
      if (view !== "check") {
        state.selectedCategoryId = null;
        state.workPrepRegisterOpen = false;
      }
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
        const labelText = syncStatusLabel(text, badgeId === "mobileSyncBadge");
        if (badge) {
          badge.className = `${badgeId === "mobileSyncBadge" ? "sync-chip" : "sync-badge"} ${mode}`;
          badge.dataset.syncDetails = "true";
          badge.setAttribute("role", "button");
          badge.setAttribute("tabindex", "0");
          badge.setAttribute("aria-label", `${labelText}. 동기화 상세 보기`);
          badge.title = syncDetailsSummary();
        }
        if (label) label.textContent = labelText;
      });
    }

    function syncTableLabel(key) {
      return {
        categories: "작업 유형",
        sections: "점검 구역",
        items: "점검 항목",
        tools: "공도구",
        pictograms: "아이콘",
        workers: "작업자",
        ships: "호선",
        inspections: "점검 이력",
        unsafeIssues: "불안전 요소",
        missingMaterials: "누락 자재",
        workPrepRecords: "작업 준비",
      }[key] || key;
    }

    function syncDetailsSummary() {
      const failedTables = Object.entries(state.remotePullHealth || {})
        .filter(([, health]) => health?.error)
        .map(([key]) => syncTableLabel(key));
      const failedJobs = normalizePendingSyncQueue(state.pendingSyncQueue)
        .filter((job) => job.status === "failed").length;
      if (!failedTables.length && !failedJobs) return "동기화 상세 보기";
      const parts = [];
      if (failedTables.length) parts.push(`불러오기 실패: ${failedTables.join(", ")}`);
      if (failedJobs) parts.push(`전송 실패함 ${failedJobs}건`);
      return parts.join(" · ");
    }

    function syncTimestampLabel(value) {
      const parsed = Date.parse(String(value || ""));
      return Number.isFinite(parsed) ? new Date(parsed).toLocaleString("ko-KR") : "기록 없음";
    }

    function renderSyncDetailsPanel() {
      if (!state.syncDetailsOpen) return "";
      const tableRows = Object.entries(state.remotePullHealth || {})
        .sort(([a], [b]) => syncTableLabel(a).localeCompare(syncTableLabel(b), "ko"))
        .map(([key, health]) => `<li class="${health?.error ? "is-error" : "is-ok"}">
          <span><strong>${esc(syncTableLabel(key))}</strong><small>마지막 성공 ${esc(syncTimestampLabel(health?.successAt))}</small></span>
          <span>${health?.error ? esc(health.error) : "정상"}</span>
        </li>`).join("");
      const failedJobs = normalizePendingSyncQueue(state.pendingSyncQueue).filter((job) => job.status === "failed");
      const failedRows = failedJobs.map((job) => `<li class="is-error">
        <span><strong>${esc((job.keys || []).map(syncTableLabel).join(", ") || "이전 동기화")}</strong><small>${esc(job.lastError || "자동 재시도 횟수를 초과했습니다.")}</small></span>
        <span class="sync-detail-actions">
          ${job.type === "rows" && !(job.keys || []).includes("issuePhotos") ? `<button type="button" class="btn ghost small" data-retry-sync-job="${esc(job.id)}">다시 시도</button>` : ""}
          <button type="button" class="btn ghost small" data-discard-sync-job="${esc(job.id)}">폐기</button>
        </span>
      </li>`).join("");
      return `<section class="sync-details-panel" role="dialog" aria-modal="false" aria-label="동기화 상세">
        <div class="sync-details-head">
          <div><strong>동기화 상세</strong><small>테이블별 마지막 성공과 전송 실패 작업을 확인합니다.</small></div>
          <button type="button" class="icon-btn" data-action="close-sync-details" aria-label="닫기">×</button>
        </div>
        <div class="sync-details-section">
          <h3>서버 데이터</h3>
          <ul>${tableRows || "<li><span>아직 동기화 기록이 없습니다.</span></li>"}</ul>
        </div>
        <div class="sync-details-section">
          <h3>전송 실패함</h3>
          <ul>${failedRows || "<li><span>실패한 전송이 없습니다.</span></li>"}</ul>
        </div>
      </section>`;
    }

    function syncStatusLabel(text, compact = false) {
      const fallback = String(text || "").trim() || "상태 확인 중";
      const labels = SYNC_STATUS_LABELS[fallback];
      if (!labels) return fallback;
      return compact ? labels.compact : labels.default;
    }

    function isNarrowViewport() {
      return window.matchMedia && window.matchMedia("(max-width: 920px)").matches;
    }

    function effectiveScreenMode() {
      if (isNarrowViewport()) return "mobile";
      if (state.adminMode) return state.screenMode === "mobile" ? "mobile" : "desktop";
      return "desktop";
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

    function cssEscapeValue(value) {
      if (window.CSS?.escape) return CSS.escape(String(value));
      return String(value).replace(/["\\]/g, "\\$&");
    }

    function focusedFieldSelector(field) {
      if (!field?.matches?.("input, textarea, select")) return "";
      if (field.id) return `#${cssEscapeValue(field.id)}`;
      if (field.name) return `${field.tagName.toLowerCase()}[name="${cssEscapeValue(field.name)}"]`;
      return "";
    }

    function captureFocusedFieldState() {
      const field = document.activeElement;
      const selector = focusedFieldSelector(field);
      if (!selector || field.type === "file") return null;
      const captured = {
        selector,
        type: field.type || "",
        value: field.value,
        checked: Boolean(field.checked),
        selectionStart: null,
        selectionEnd: null,
      };
      try {
        captured.selectionStart = field.selectionStart;
        captured.selectionEnd = field.selectionEnd;
      } catch {
        captured.selectionStart = null;
        captured.selectionEnd = null;
      }
      return captured;
    }

    function restoreFocusedFieldState(captured) {
      if (!captured?.selector) return;
      const field = document.querySelector(captured.selector);
      if (!field || field.disabled || field.type === "file") return;
      if (captured.type === "checkbox" || captured.type === "radio") {
        field.checked = captured.checked;
      } else if ("value" in field) {
        field.value = captured.value;
      }
      field.focus({ preventScroll: true });
      if (
        typeof captured.selectionStart === "number" &&
        typeof captured.selectionEnd === "number" &&
        typeof field.setSelectionRange === "function"
      ) {
        try {
          field.setSelectionRange(captured.selectionStart, captured.selectionEnd);
        } catch {
          // Some input types do not support text selection.
        }
      }
    }

    function render() {
      const focusedFieldState = captureFocusedFieldState();
      renderNav();
      renderAppHeader();
      const page = $("page");
      const loggedIn = isWorkerLoggedIn();
      document.body.classList.toggle("login-required", !loggedIn);
      if (!loggedIn) {
        page.innerHTML = renderLogin();
        page.insertAdjacentHTML("beforeend", renderSyncDetailsPanel());
        setSyncStatus(state.syncText, state.syncMode);
        ensureRenderedAccessibility();
        applyLoginWorkerSearchFilter();
        restoreFocusedFieldState(focusedFieldState);
        return;
      }
      applyLoggedInWorkerToDrafts();
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
      page.insertAdjacentHTML("beforeend", renderPhotoViewer());
      page.insertAdjacentHTML("beforeend", renderPushTemplateEditor());
      page.insertAdjacentHTML("beforeend", renderWorkerPushDeviceManager());
      page.insertAdjacentHTML("beforeend", renderSyncDetailsPanel());
      setSyncStatus(state.syncText, state.syncMode);
      applyClientSearchFilters();
      setupSignaturePad();
      setupPictogramImageFallbacks();
      ensureRenderedAccessibility();
      restoreFocusedFieldState(focusedFieldState);
      scheduleWorkerPushSubscriptionStatusRefresh();
    }

    function renderPreservingScroll() {
      const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      render();
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
        state.lastScrollY = y;
      });
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
        state.draft.pledgeSignatureCleared = false;
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
      applyWorkTypeSearchFilter();
      applyCategoryToolSearchFilter();
      applyLoginWorkerSearchFilter();
    }

    function applyLoginWorkerSearchFilter() {
      const rows = Array.from(document.querySelectorAll("[data-login-worker-search-item]"));
      if (!rows.length) return;
      const query = normalizeSearchQuery(state.loginWorkerSearch);
      let visibleCount = 0;
      rows.forEach((row) => {
        const matches = !query || (row.dataset.loginWorkerSearchText || "").includes(query);
        row.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      const empty = document.querySelector("[data-login-worker-search-empty]");
      if (empty) empty.hidden = visibleCount > 0;
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

    function applyWorkTypeSearchFilter() {
      const rows = Array.from(document.querySelectorAll("[data-work-type-search-item]"));
      if (!rows.length) return;
      const query = normalizeSearchQuery(state.workTypeSearchQuery);
      let visibleCount = 0;
      rows.forEach((row) => {
        const matches = !query || (row.dataset.workTypeSearchText || "").includes(query);
        row.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      const counter = document.querySelector("[data-work-type-search-count]");
      if (counter) counter.textContent = query ? `${visibleCount}/${rows.length}개` : `${rows.length}개`;
      const empty = document.querySelector("[data-work-type-search-empty]");
      if (empty) empty.hidden = visibleCount > 0;
    }

    function applyCategoryToolSearchFilter() {
      const options = Array.from(document.querySelectorAll("[data-category-tool-search-item]"));
      if (!options.length) return;
      const query = normalizeSearchQuery(state.categoryToolSearchQuery);
      let visibleCount = 0;
      options.forEach((option) => {
        const matches = !query || (option.dataset.categoryToolSearchText || "").includes(query);
        option.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      const counter = document.querySelector("[data-category-tool-search-count]");
      if (counter) counter.textContent = query ? `${visibleCount}/${options.length}개` : `${options.length}개`;
      const empty = document.querySelector("[data-category-tool-search-empty]");
      if (empty) empty.hidden = visibleCount > 0;
    }

    function updateDesktopWorkerSession() {
      const loggedIn = isWorkerLoggedIn();
      const logout = $("desktopLogoutButton");
      const session = $("desktopWorkerSession");
      const name = $("desktopWorkerName");
      const greeting = $("desktopWorkerGreeting");
      if (logout) logout.hidden = !loggedIn;
      if (session) session.hidden = !loggedIn;
      if (!loggedIn) {
        updatePushRegistrationControls();
        return;
      }
      if (session && !$("desktopPushButton")) {
        session.insertAdjacentHTML("beforeend", `<button id="desktopPushButton" class="sidebar-push-btn" data-action="register-push-notifications" type="button">알림 등록</button>`);
      }
      if (session && $("desktopPushButton") && !$("desktopPushEmployeeNoForm")) {
        $("desktopPushButton").insertAdjacentHTML("afterend", pushEmployeeNoFormHtml("desktop"));
      }
      if (session && $("desktopPushEmployeeNoForm") && !$("desktopPushTestButton")) {
        $("desktopPushEmployeeNoForm").insertAdjacentHTML("afterend", `<button id="desktopPushTestButton" class="sidebar-push-test-btn" data-action="test-push-notification" type="button" hidden>테스트 알림</button>`);
      }
      const label = currentWorkerSessionLabel();
      if (name) name.textContent = label;
      if (greeting) greeting.textContent = "안전한 하루 되세요.";
      updatePushRegistrationControls();
      refreshWorkerPushSubscriptionStatus().catch((error) => console.warn("push status refresh failed", error));
    }

    function updatePushRegistrationControls() {
      const loggedIn = isWorkerLoggedIn();
      const mobileLogout = $("mobileLogoutButton");
      if (mobileLogout && !$("mobilePushButton")) {
        mobileLogout.insertAdjacentHTML("beforebegin", `<button id="mobilePushButton" class="mobile-push-btn" data-action="register-push-notifications" type="button">알림 등록</button>`);
      }
      if ($("mobilePushButton") && !$("mobilePushEmployeeNoForm")) {
        $("mobilePushButton").insertAdjacentHTML("afterend", pushEmployeeNoFormHtml("mobile"));
      }
      if ($("mobilePushEmployeeNoForm") && !$("mobilePushTestButton")) {
        $("mobilePushEmployeeNoForm").insertAdjacentHTML("afterend", `<button id="mobilePushTestButton" class="mobile-push-test-btn" data-action="test-push-notification" type="button" hidden>테스트 알림</button>`);
      }
      const registered = pushRegisteredForCurrentWorker();
      const remoteStatus = pushStatusForCurrentWorker();
      const subscriptionCount = Number(remoteStatus.subscriptionCount || 0);
      const registeredDeviceCount = subscriptionCount || (registered ? 1 : 0);
      const supported = pushNotificationsSupported();
      const checking = Boolean(state.pushSubscriptionStatusChecking);
      const registering = Boolean(state.pushRegistrationSubmitting);
      const needsEmployeeNo = loggedIn && !normalizeEmployeeNo(state.workerSession?.employeeNo || "");
      const showEmployeeNoForm = Boolean(state.pushEmployeeNoPromptOpen && needsEmployeeNo && supported && !registered);
      const registeredLabel = registeredDeviceCount > 1
        ? `휴대폰 알림 등록됨 (${registeredDeviceCount}대)`
        : "휴대폰 알림 등록됨";
      [
        $("desktopPushButton"),
        $("mobilePushButton"),
      ].filter(Boolean).forEach((button) => {
        button.hidden = !loggedIn;
        button.disabled = loggedIn && (registered || checking || registering || !supported);
        button.textContent = registering ? "알림 등록 중" : checking ? "알림 상태 확인 중" : registered ? registeredLabel : needsEmployeeNo ? "사번 확인 후 등록" : `${pushDeviceName()} 알림 등록`;
        button.title = registered
          ? `서버에 등록된 알림 ${registeredDeviceCount}건이 확인되어 등록 버튼을 비활성화했습니다`
          : needsEmployeeNo
          ? "사번을 한 번 더 확인한 뒤 이 기기에 Push 알림을 등록합니다"
          : supported ? "이 기기로 작업자 Push 알림을 받습니다" : "이 브라우저는 Push 알림을 지원하지 않습니다";
      });
      [
        $("desktopPushTestButton"),
        $("mobilePushTestButton"),
      ].filter(Boolean).forEach((button) => {
        const testEnabled = pushTestNotificationEnabled();
        button.hidden = !loggedIn || !registered;
        button.disabled = checking || registering || !testEnabled;
        button.title = testEnabled ? "현재 작업자에게 테스트 브라우저 알림을 보냅니다" : "테스트 알림은 2026.05.26 11:59 이후 비활성화되었습니다";
      });
      [
        $("desktopPushEmployeeNoForm"),
        $("mobilePushEmployeeNoForm"),
      ].filter(Boolean).forEach((form) => {
        form.hidden = !showEmployeeNoForm;
        form.querySelectorAll("input,button").forEach((node) => {
          node.disabled = !showEmployeeNoForm || checking || registering;
        });
      });
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
      const loggedIn = isWorkerLoggedIn();
      const greeting = $("homeGreetingLabel");
      const mobileLogout = $("mobileLogoutButton");
      if (title) title.textContent = loggedIn ? (titles[state.view] || "홈") : "로그인";
      if (mobileLogout) mobileLogout.hidden = !loggedIn;
      updateDesktopWorkerSession();
      if (headline) {
        const showHomeHeadline = loggedIn && state.view === "dashboard";
        headline.style.display = showHomeHeadline ? "flex" : "none";
        headline.setAttribute("aria-hidden", showHomeHeadline ? "false" : "true");
      }
      if (greeting) greeting.textContent = homeGreetingText();
      if (date) date.textContent = formatKoreanDate(serverNow());
      updateHeaderClock();
    }

    function updateHeaderClock() {
      const time = $("phoneTime");
      const date = $("homeDateLabel");
      const version = $("homeVersionLabel");
      const now = serverNow();
      if (time) time.textContent = formatHeaderTime(now);
      if (date) date.textContent = formatKoreanDate(now);
      if (version) {
        version.innerHTML = `<span class="sync-dot" aria-hidden="true"></span><span>${esc(appVersionLabel())}</span>`;
        version.title = serviceWorkerVersionTitle();
      }
      syncMobileHeaderState();
    }

    function syncMobileHeaderState() {
      const loggedIn = isWorkerLoggedIn();
      const headline = $("homeHeadline");
      const greeting = $("homeGreetingLabel");
      const mobileLogout = $("mobileLogoutButton");
      const version = $("homeVersionLabel");
      updateDesktopWorkerSession();
      if (headline) {
        const showHomeHeadline = loggedIn && state.view === "dashboard";
        headline.style.display = showHomeHeadline ? "flex" : "none";
        headline.setAttribute("aria-hidden", showHomeHeadline ? "false" : "true");
      }
      if (greeting) greeting.textContent = homeGreetingText();
      if (mobileLogout) mobileLogout.hidden = !loggedIn;
      if (version) {
        version.classList.remove("online", "pending", "error", "offline");
        version.classList.add(state.syncMode || "offline");
      }
    }

    function appVersionLabel() {
      return APP_VERSION_LABEL;
    }

    function serviceWorkerVersionTitle() {
      const workerVersion = state.serviceWorkerVersion || "확인 중";
      const cacheVersion = state.serviceWorkerCache || "확인 중";
      return `앱 ${APP_VERSION} · 서비스워커 ${workerVersion} · 캐시 ${cacheVersion}`;
    }

    let swAutoReloadReady = false;
    function setupServiceWorkerAutoReload() {
      if (swAutoReloadReady || !("serviceWorker" in navigator)) return;
      // 첫 설치(제어 중인 SW가 아직 없음)면 새로고침 불필요. 이미 SW 제어 하에 있는
      // 세션에서 새 SW로 제어가 넘어갈 때(=새 배포 활성화)만 1회 자동 새로고침해
      // 모든 기기가 강제 새로고침 없이 최신 코드로 맞춰지도록 한다.
      if (!navigator.serviceWorker.controller) return;
      swAutoReloadReady = true;
      let reloading = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (reloading) return;
        reloading = true;
        window.location.reload();
      });
    }

    function requestServiceWorkerVersion() {
      if (!("serviceWorker" in navigator)) return;
      setupServiceWorkerAutoReload();
      let finished = false;
      const receiveVersion = (event) => {
        const data = event.data || {};
        if (data.type !== "GS_SW_VERSION") return;
        state.serviceWorkerVersion = String(data.appVersion || "").trim();
        state.serviceWorkerCache = String(data.cache || data.assetToken || "").trim();
        finished = true;
        updateHeaderClock();
      };
      const sendVersionRequest = () => {
        try {
          navigator.serviceWorker.controller?.postMessage({ type: "GS_GET_VERSION" });
        } catch (error) {
          console.warn("service worker version request failed", error);
        }
      };
      navigator.serviceWorker.addEventListener("message", receiveVersion);
      sendVersionRequest();
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.update?.().catch((error) => console.warn("service worker update check failed", error));
          sendVersionRequest();
        })
        .catch((error) => console.warn("service worker ready failed", error));
      setTimeout(() => {
        if (!finished) updateHeaderClock();
        navigator.serviceWorker.removeEventListener("message", receiveVersion);
      }, 2500);
    }

    function formatKoreanDate(date) {
      const safeDate = validDateOrNow(date);
      try {
        const parts = kstDateParts(safeDate);
        const weekday = kstWeekdayFormatter.format(safeDate).replace("요일", "");
        return `${parts.year}.${pad2(parts.month)}.${pad2(parts.day)} (${weekday})`;
      } catch {
        const local = validDateOrNow(new Date());
        return `${local.getFullYear()}.${pad2(local.getMonth() + 1)}.${pad2(local.getDate())}`;
      }
    }

    function formatHeaderTime(date) {
      try {
        return localTime(validDateOrNow(date));
      } catch {
        return "시간 확인 필요";
      }
    }

    function validDateOrNow(value) {
      const date = value instanceof Date ? value : new Date(value);
      return Number.isFinite(date.getTime()) ? date : new Date();
    }

    function serverNow() {
      return new Date(Date.now() + Number(state.serverTimeOffsetMs || 0));
    }

    async function syncServerClock() {
      const client = supabaseClient();
      if (!client) return;
      const startedAt = Date.now();
      try {
        const { data, error } = await client.rpc("app_server_time");
        const endedAt = Date.now();
        if (error) throw error;
        const serverMs = Date.parse(String(data || ""));
        if (!Number.isFinite(serverMs)) throw new Error("server_time_invalid");
        state.serverTimeOffsetMs = serverMs - Math.round((startedAt + endedAt) / 2);
        state.serverClockSyncedAt = new Date(endedAt).toISOString();
        saveJson("serverClock", {
          offsetMs: state.serverTimeOffsetMs,
          syncedAt: state.serverClockSyncedAt,
        });
      } catch (error) {
        console.warn("서버 시계 동기화 실패:", error);
      } finally {
        updateHeaderClock();
      }
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
      const loggedIn = isWorkerLoggedIn();
      $("desktopNav").innerHTML = loggedIn ? renderNavButtons(visibleNavItems()) : "";
      $("mobileNav").innerHTML = loggedIn ? renderNavButtons(mobileNavItems()) : "";
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
          <h1>${esc(title)}</h1>
          <p class="lead">${esc(lead)}</p>
        </div>
        <div class="toolbar">${actions}</div>
      </div>`;
    }

    function isWorkerLoggedIn() {
      return Boolean(state.workerSession?.workerId);
    }

    function currentWorkerSessionLabel() {
      const worker = state.workers.find((row) => row.id === state.workerSession?.workerId);
      return worker?.name || state.workerSession?.workerName || "작업자";
    }

    function currentWorkerSessionWorker() {
      const workerId = state.workerSession?.workerId || "";
      const worker = state.workers.find((row) => row.id === workerId);
      if (worker) return worker;
      if (!workerId) return null;
      return { id: workerId, name: state.workerSession?.workerName || "작업자", team: "", position: DEFAULT_WORKER_POSITION };
    }

    function applyLoggedInWorkerToDrafts() {
      const worker = currentWorkerSessionWorker();
      if (!worker?.id) return;
      let draftChanged = false;
      let unsafeChanged = false;
      let materialChanged = false;
      const workerName = worker.name || currentWorkerSessionLabel();
      if (workerName && normalizedWorkerName(state.draft.worker) !== normalizedWorkerName(workerName)) {
        state.draft.worker = workerName;
        state.draft.pledgeSignature = "";
        state.draft.pledgeSignatureCleared = false;
        draftChanged = true;
      }
      if (state.unsafeDraft.workerId !== worker.id) {
        state.unsafeDraft.workerId = worker.id;
        unsafeChanged = true;
      }
      if (state.materialDraft.workerId !== worker.id) {
        state.materialDraft.workerId = worker.id;
        materialChanged = true;
      }
      if (draftChanged) {
        preloadCachedPledgeSignature();
        saveJson("draft", state.draft);
      }
      if (unsafeChanged) saveJson("unsafeDraft", state.unsafeDraft);
      if (materialChanged) saveJson("materialDraft", state.materialDraft);
    }

    function homeGreetingText() {
      if (!isWorkerLoggedIn()) return "안전한 하루 되세요.";
      const label = currentWorkerSessionLabel();
      return GENERIC_WORKER_LABELS.has(label)
        ? "안전한 하루 되세요."
        : `${label}님, 안전한 하루 되세요.`;
    }

    function renderLogin() {
      const workers = [...sortWorkersForLogin(state.workers)];
      const disabled = !workers.length || state.loginSubmitting;
      const selectedWorker = workers.find((worker) => worker.id === state.loginWorkerId);
      const rememberedWorker = rememberedLoginWorker(workers);
      const effectiveWorker = selectedWorker || rememberedWorker;
      const shouldAutofocusEmployeeNo = Boolean(effectiveWorker && !state.loginWorkerPickerOpen);
      return `<section class="login-screen" aria-labelledby="loginTitle">
        <div class="login-hero">
          <div class="login-brand">
            <span>GS</span>
            <div>
              <strong>Safety Checklist</strong>
              <em>Shipyard field login</em>
            </div>
          </div>
          <div class="login-copy">
            <p>현장 작업자 확인</p>
            <h1 id="loginTitle">작업자 로그인</h1>
            <span>등록된 작업자를 선택하고 사번을 입력하세요.</span>
          </div>
        </div>
        <form class="login-card" data-login-form>
          <div class="field login-worker-field">
            <label for="loginWorkerId">작업자</label>
            <input id="loginWorkerId" name="username" autocomplete="username" type="hidden" value="${esc(effectiveWorker?.id || "")}" required />
            ${renderLoginWorkerSelector(workers, selectedWorker, rememberedWorker, effectiveWorker, disabled)}
          </div>
          <div class="field">
            <label for="loginEmployeeNo">사번</label>
            <input class="input" id="loginEmployeeNo" type="password" inputmode="text" autocomplete="current-password" autocapitalize="characters" placeholder="사번 입력" ${shouldAutofocusEmployeeNo ? "autofocus" : ""} ${disabled ? "disabled" : ""} required />
          </div>
          <button class="btn login-submit" type="submit" ${disabled ? "disabled" : ""}>${state.loginSubmitting ? "확인 중" : "로그인"}</button>
          <button class="btn-light login-refresh" data-action="refresh-workers" type="button" ${state.loginSubmitting ? "disabled" : ""}>작업자 목록 새로고침</button>
          <div class="login-help">${workers.length ? "사번이 등록되지 않은 작업자는 관리자에게 사번 등록을 요청하세요." : "작업자 목록을 불러오는 중입니다."}</div>
        </form>
      </section>`;
    }

    function rememberedLoginWorker(workers) {
      const workerId = state.lastLoginWorkerId || "";
      if (!workerId) return null;
      return workers.find((worker) => worker.id === workerId && worker.active !== false) || null;
    }

    function renderLoginWorkerLabel(worker, placeholder = "작업자 선택") {
      if (!worker) return `<span class="login-worker-placeholder">${esc(placeholder)}</span>`;
      return `<span class="login-worker-text">
        <strong>${esc(worker.name)}</strong>
        ${workerBadgeRow(worker)}
      </span>`;
    }

    function renderLoginWorkerSelector(workers, selectedWorker, rememberedWorker, effectiveWorker, disabled) {
      const hasWorker = Boolean(effectiveWorker);
      const accountLabel = effectiveWorker?.id === rememberedWorker?.id ? "내 계정" : "선택한 작업자";
      return `<div class="login-worker-selector" data-login-worker-picker>
        ${hasWorker ? `
          <div class="login-account-strip">
            <div class="login-account-copy">
              <span>${accountLabel}</span>
              ${renderLoginWorkerLabel(effectiveWorker)}
            </div>
            <button class="btn login-account-action" data-login-remember-worker="${esc(effectiveWorker.id)}" type="button" ${disabled ? "disabled" : ""}>${esc(effectiveWorker.name)}으로 계속</button>
          </div>
        ` : renderLoginWorkerTrigger(null, disabled)}
        ${hasWorker ? `
          <button class="btn-light login-worker-change" data-action="toggle-login-worker-picker" type="button" aria-expanded="${state.loginWorkerPickerOpen ? "true" : "false"}" ${disabled ? "disabled" : ""}>다른 작업자 선택</button>
        ` : ""}
        ${state.loginWorkerPickerOpen && !disabled ? renderLoginWorkerSearchPanel(workers, selectedWorker || effectiveWorker) : ""}
      </div>`;
    }

    function renderLoginWorkerTrigger(selectedWorker, disabled) {
      const expanded = state.loginWorkerPickerOpen && !disabled;
      return `<button class="login-worker-trigger ${expanded ? "open" : ""}" data-action="toggle-login-worker-picker" type="button" aria-haspopup="listbox" aria-expanded="${expanded ? "true" : "false"}" ${disabled ? "disabled" : ""}>
        ${renderLoginWorkerLabel(selectedWorker)}
        <span class="login-worker-chevron" aria-hidden="true"></span>
      </button>`;
    }

    function loginWorkerSearchText(worker) {
      return normalizeSearchQuery([
        worker?.name,
        worker?.team,
        workerDisplayPosition(worker),
        loginWorkerGroup(worker),
      ].filter(Boolean).join(" "));
    }

    function renderLoginWorkerSearchPanel(workers, selectedWorker) {
      return `<div class="login-worker-search-panel">
        <label for="loginWorkerSearch">작업자 검색</label>
        <input class="input login-worker-search-input" id="loginWorkerSearch" data-login-worker-search value="${esc(state.loginWorkerSearch)}" placeholder="이름 검색" autocomplete="off" />
        <div class="login-worker-options login-worker-options-inline" role="listbox" aria-label="작업자 선택">
          ${workers.map((worker) => `<button class="login-worker-option ${worker.id === selectedWorker?.id ? "selected" : ""}" data-login-worker-select="${esc(worker.id)}" data-login-worker-search-item data-login-worker-search-text="${esc(loginWorkerSearchText(worker))}" type="button" role="option" aria-selected="${worker.id === selectedWorker?.id ? "true" : "false"}">
            ${renderLoginWorkerLabel(worker)}
          </button>`).join("")}
        </div>
        <div class="login-worker-empty" data-login-worker-search-empty hidden>검색 결과가 없습니다.</div>
      </div>`;
    }

    function logoutButton() {
      return `<button class="btn-light" data-action="worker-logout" type="button">로그아웃</button>`;
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
      const sessionWorker = currentWorkerSessionWorker();
      const myCheck = (() => {
        if (!sessionWorker?.id) return null;
        const preps = workPrepRecordsForDate(today())
          .filter((record) => !record.deletedAt && workPrepParticipantWorkerIds(record).includes(sessionWorker.id));
        const pendingPreps = preps.filter((record) => !hasSubmittedWorkPrepInspection(record, sessionWorker.id));
        const next = pendingPreps[0] || null;
        const nextCat = next ? state.categories.find((cat) => cat.id === next.categoryId) : null;
        const gate = next ? workPrepStartAvailability(next) : { canStart: true, message: "" };
        return {
          name: sessionWorker.name || "",
          total: preps.length,
          pending: pendingPreps.length,
          status: !preps.length ? "none" : !pendingPreps.length ? "done" : gate.canStart ? "ready" : "locked",
          nextLabel: next ? `H${next.shipNo}${nextCat ? ` · ${workLabel(nextCat)}` : ""}` : "",
          lockMessage: gate.message || "",
        };
      })();
      return {
        myCheck,
        todayCount,
        todayDone,
        todayPending,
        todayCompletion,
        unsafeCount,
        completion,
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
      return DASHBOARD_VIEW.renderDashboardView(dashboardModel(), { sectionHeading, navIcon });
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

    function progress(pct, color, attrs = "") {
      const value = Math.max(0, Math.min(100, Number(pct) || 0));
      return `<div class="progress" ${attrs} role="progressbar" aria-label="점검 완료율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><span style="--pct:${value}%;--bar:${esc(color)}"></span></div>`;
    }

    function normalizeIconKey(id) {
      if (typeof PICTOGRAM_HELPERS.normalizeIconKey === "function") {
        return PICTOGRAM_HELPERS.normalizeIconKey(id);
      }
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
      const builtInSrc = PICTOGRAM_ASSETS[id] || PICTOGRAM_ASSETS[key] || "";
      if (builtInSrc) return builtInSrc;
      const row = (Array.isArray(state?.pictograms) ? state.pictograms : []).find((item) => (
        item?.deleted !== true && normalizeIconKey(item.id) === key
      ));
      if (!row || row.source !== "custom") return "";
      if (isSyncConfigured()) return pictogramLazyImageSrc(row);
      return row.src || "";
    }

    function pictogramLazyImageSrc(row) {
      if (typeof PICTOGRAM_HELPERS.pictogramLazyImageSrc === "function") {
        return PICTOGRAM_HELPERS.pictogramLazyImageSrc(row, {
          supabaseUrl: SUPABASE_URL,
          syncConfigured: isSyncConfigured(),
        });
      }
      const id = String(row?.id || "").trim();
      if (!id || !isSyncConfigured()) return "";
      const version = encodeURIComponent(row.storagePath || row.updatedAt || row.id);
      return `${SUPABASE_URL}/functions/v1/pictogram-image?id=${encodeURIComponent(id)}&v=${version}`;
    }

    function lineIconName(id, fallbackIcon = "") {
      if (typeof PICTOGRAM_HELPERS.lineIconName === "function") {
        return PICTOGRAM_HELPERS.lineIconName(id, fallbackIcon);
      }
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
      const iconName = lineIconName(id, fallbackIcon);
      if (src) {
        const img = `<img class="pictogram-image" src="${esc(src)}" alt="" loading="lazy" decoding="async" aria-hidden="true" data-fallback-icon="${esc(iconName)}" />`;
        // Built-in local illustrations ship a WebP twin (~80% smaller). Serve it
        // via <picture> with the PNG as automatic fallback; custom/remote
        // pictograms keep the plain <img>. The existing error handler still
        // degrades to a line icon if both sources fail.
        if (src.startsWith(ILLUSTRATION_BASE) && src.endsWith(".png")) {
          const webp = `${src.slice(0, -4)}.webp`;
          return `<picture class="pictogram-picture"><source srcset="${esc(webp)}" type="image/webp" />${img}</picture>`;
        }
        return img;
      }
      return lineIcon(iconName);
    }

    function setupPictogramImageFallbacks() {
      document.querySelectorAll("img.pictogram-image[data-fallback-icon]").forEach((img) => {
        if (img.dataset.fallbackReady === "true") return;
        img.dataset.fallbackReady = "true";
        img.addEventListener("error", () => {
          const fallback = document.createElement("span");
          fallback.className = "pictogram-image pictogram-image-fallback";
          fallback.setAttribute("aria-hidden", "true");
          fallback.innerHTML = lineIcon(img.dataset.fallbackIcon || "shieldCheck");
          img.replaceWith(fallback);
        }, { once: true });
        if (img.complete && img.naturalWidth === 0) {
          img.dispatchEvent(new Event("error"));
        }
      });
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
      return `<button class="more-toggle" ${attrs} type="button" aria-expanded="${expanded ? "true" : "false"}">${expanded ? "접기" : "+ 더보기"}</button>`;
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

    function workerMatchesCategoryNature(worker, categoryNature) {
      const nature = normalizeToolNature(categoryNature);
      if (nature === "선행/후행") return true;
      const text = `${worker?.name || ""} ${worker?.team || ""}`;
      const hasPre = text.includes("선행");
      const hasPost = text.includes("후행");
      if (!hasPre && !hasPost) return true;
      return nature === "선행" ? hasPre : hasPost;
    }

    function checkWorkerGroups(category) {
      const categoryNature = category?.toolNature || defaultToolNatureForCategory(category);
      const groups = { primary: [], other: [], categoryNature: normalizeToolNature(categoryNature) };
      state.workers.forEach((worker) => {
        if (workerMatchesCategoryNature(worker, groups.categoryNature)) {
          groups.primary.push(worker);
        } else {
          groups.other.push(worker);
        }
      });
      return groups;
    }

    function renderWorkerButton(worker) {
      const selected = state.draft.worker === worker.name;
      return `<button class="pledge-worker-row ${selected ? "active" : ""}" data-select-pledge-worker="${esc(worker.id)}" type="button" aria-pressed="${selected ? "true" : "false"}">
        <span class="pledge-avatar">${esc(workerInitial(worker.name))}</span>
        <span><strong>${esc(worker.name)}</strong>${workerBadgeRow(worker)}</span>
      </button>`;
    }

    function renderOtherWorkerSelect(otherWorkers) {
      const selectedWorker = otherWorkers.find((worker) => worker.name === state.draft.worker);
      return `<div class="pledge-other-worker-panel">
        <label for="otherWorkerSelect">타 작업자 목록</label>
        <select class="select" id="otherWorkerSelect">
          <option value="">타 작업자 선택</option>
          ${otherWorkers.map((worker) => `<option value="${esc(worker.id)}" ${selectedWorker?.id === worker.id ? "selected" : ""}>${esc(worker.name)}${worker.team ? ` / ${esc(worker.team)}` : ""}</option>`).join("")}
        </select>
      </div>`;
    }

    function workerTeamBadge(team) {
      if (typeof WORKER_HELPERS.workerTeamBadge === "function") {
        return WORKER_HELPERS.workerTeamBadge(team);
      }
      const value = String(team || "").trim();
      if (!value) return `<span class="worker-team-badge is-empty">소속 미지정</span>`;
      const className = value === "선행" ? "is-pre" : value === "후행" ? "is-post" : "is-neutral";
      return `<span class="worker-team-badge ${className}">${esc(value)}</span>`;
    }

    function workerRoleBadge(worker) {
      if (typeof WORKER_HELPERS.workerRoleBadge === "function") {
        return WORKER_HELPERS.workerRoleBadge(worker);
      }
      const position = normalizeWorkerPosition(worker?.position);
      const label = workerDisplayPosition(worker);
      const className = PRIVILEGED_WORKER_POSITIONS.has(position) ? "is-leader" : "";
      return `<span class="worker-position-badge ${className}">${esc(label)}</span>`;
    }

    function workerBadgeRow(worker) {
      return `<span class="worker-badge-row">${workerTeamBadge(worker?.team)}${workerRoleBadge(worker)}</span>`;
    }

    function renderPledgeFlowSummary({ label, title, meta = "", metaHtml = "", action = "", stage = null, locked = false }) {
      const content = `<span class="pledge-summary-main">
          <span class="pledge-summary-label">${esc(label)}</span>
          <strong>${esc(title)}</strong>
          ${metaHtml || (meta ? `<em>${esc(meta)}</em>` : "")}
        </span>
        ${stage ? `<span class="pledge-summary-stage" style="--stage:${esc(stage.color)}">${esc(stage.label)}</span>` : ""}
        <span class="pledge-summary-action">${locked ? "고정" : "변경"}</span>`;
      if (locked) {
        return `<section class="pledge-flow-card pledge-flow-card-collapsed">
          <div class="pledge-flow-summary ${stage ? "ship" : ""} locked" aria-label="${esc(label)} 고정">${content}</div>
        </section>`;
      }
      return `<section class="pledge-flow-card pledge-flow-card-collapsed">
        <button class="pledge-flow-summary ${stage ? "ship" : ""}" data-action="${esc(action)}" type="button" aria-label="${esc(label)} 변경">
          ${content}
        </button>
      </section>`;
    }

    function renderPledgeWorkerSelect(category = null) {
      const workers = state.workers;
      if (!workers.length) {
        return `<section class="pledge-flow-card" data-submit-blocker-anchor="worker">
          <div class="pledge-flow-title">작업자 선택</div>
          <label class="field">
            <span>작업자명</span>
            <input class="input" id="worker" value="${esc(state.draft.worker)}" placeholder="이름 입력" />
          </label>
        </section>`;
      }
      const worker = currentWorkerSessionWorker();
      const nature = normalizeToolNature(category?.toolNature || defaultToolNatureForCategory(category));
      const fromWorkPrepRecord = Boolean(state.draft.workPrepRecordId);
      return `<div data-submit-blocker-anchor="worker">${renderPledgeFlowSummary({
        label: fromWorkPrepRecord ? "점검 작업자" : "담당 작업자",
        title: worker?.name || currentWorkerSessionLabel(),
        metaHtml: `<span class="pledge-summary-meta-row">${worker ? workerBadgeRow(worker) : `<span class="worker-team-badge is-empty">로그인 작업자</span>`}<em>${esc(nature)} 기준</em></span>`,
        action: "expand-pledge-worker",
        locked: fromWorkPrepRecord,
      })}</div>`;
    }

    function renderPledgeShipSelect(ships) {
      const selectedShip = ships.find((ship) => ship.no === state.draft.shipNo);
      const fromWorkPrepRecord = Boolean(state.draft.workPrepRecordId);
      if ((state.pledgeShipCollapsed || fromWorkPrepRecord) && selectedShip) {
        const stage = effectiveShipStage(selectedShip);
        return `<div data-submit-blocker-anchor="ship">${renderPledgeFlowSummary({
          label: fromWorkPrepRecord ? "작업지시 호선" : "오늘 작업 호선",
          title: selectedShip.no,
          meta: `${selectedShip.type || "선종 미지정"} · ${shipDeliveryType(selectedShip) || "인도"} ${shipDeliveryDate(selectedShip) || "-"}`,
          action: "expand-pledge-ship",
          stage,
          locked: fromWorkPrepRecord,
        })}</div>`;
      }
      return `<section class="pledge-flow-card" data-submit-blocker-anchor="ship">
        <div class="pledge-flow-title">오늘 작업 호선</div>
        <div class="pledge-ship-list">
          ${ships.map((ship) => {
            const stage = effectiveShipStage(ship);
            const selected = state.draft.shipNo === ship.no;
            return `<button class="pledge-ship-row ${selected ? "active" : ""}" data-select-pledge-ship="${esc(ship.no)}" type="button" aria-pressed="${selected ? "true" : "false"}">
              <span class="pledge-radio"></span>
              <span><strong>${esc(ship.no)}</strong><em>${esc(ship.type || "선종 미지정")} · ${esc(shipDeliveryType(ship) || "인도")} ${esc(shipDeliveryDate(ship) || "-")}</em></span>
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
      return `<section class="pledge-flow-card" data-submit-blocker-anchor="pledge">
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
        ${complete ? `<div class="pledge-sign-panel" data-submit-blocker-anchor="signature">
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
      const blockers = [
        { target: "worker", label: "담당자명 미입력", required: !state.draft.worker.trim() },
        { target: "ship", label: "호선 미선택", required: !state.draft.shipNo },
        { target: "pledge", label: `안전 서약 ${pledgeRulesCount - pledgeChecked}건 미확인`, required: pledgeChecked !== pledgeRulesCount },
        { target: "signature", label: "서명 미입력", required: !signatureLabel() },
        { target: "checks", label: "등록된 점검 항목 없음", required: !items.length },
        { target: "high-risk", label: `고위험 항목 ${missingHighItems.length}건 미확인`, required: Boolean(missingHighItems.length) },
      ].filter((blocker) => blocker.required);
      return {
        canSubmit,
        blockers,
        disabledText: blockers.length ? `제출할 수 없음: ${blockers.map((blocker) => blocker.label).join(", ")}` : "제출하기",
      };
    }

    function submitBlockerButtonsHtml(blockers) {
      return blockers.map((blocker) => `<button class="check-submit-blocker" data-submit-blocker="${esc(blocker.target)}" type="button">${esc(blocker.label)}</button>`).join("");
    }

    function renderCheckSubmitBlockers(blockers) {
      return `<section class="check-submit-blockers" data-check-submit-blockers role="status" aria-live="polite" ${blockers.length ? "" : "hidden"}>
        <strong>제출 전 확인</strong>
        <div class="check-submit-blocker-list">${submitBlockerButtonsHtml(blockers)}</div>
      </section>`;
    }

    function checkDraftSaveLabel() {
      const savedAt = Date.parse(state.draft.savedAt || "");
      if (!Number.isFinite(savedAt)) return "임시저장 대기";
      return `임시저장 ${new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(savedAt))}`;
    }

    function renderCheckSubmitBar(items, checked, submitState) {
      return `<aside class="check-submit-fixed-bar" data-check-submit-bar aria-label="점검 제출 상태">
        <div class="check-submit-fixed-summary">
          <strong data-check-submit-progress>확인 ${checked}/${items.length}</strong>
          <span data-check-draft-saved-at>${esc(checkDraftSaveLabel())}</span>
        </div>
        ${renderCheckSubmitBlockers(submitState.blockers)}
        <button class="material-flow-primary check-submit-btn" data-action="open-check-submit-sheet" type="button">제출 전 확인</button>
      </aside>`;
    }

    function renderCheckSubmitSheet(submitState) {
      if (!state.checkSubmitSheetOpen) return "";
      return `<section class="check-submit-sheet-overlay" data-check-submit-sheet role="dialog" aria-modal="true" aria-label="점검 제출 확인">
        <button class="check-submit-sheet-backdrop" data-action="close-check-submit-sheet" type="button" aria-label="제출 시트 닫기"></button>
        <div class="check-submit-sheet-panel">
          <div class="check-submit-sheet-head">
            <div><span>점검 제출</span><h2>안전 서약과 서명을 확인하세요</h2></div>
            <button class="btn-light" data-action="close-check-submit-sheet" type="button">나중에 제출</button>
          </div>
          <p class="check-submit-sheet-guide">점검 내용은 임시저장되어 있습니다. 서약과 서명을 완료한 뒤 최종 제출합니다.</p>
          ${renderSafetyPledgeChecklist()}
          ${renderCheckSubmitBlockers(submitState.blockers)}
          <button class="material-flow-primary check-submit-sheet-submit" data-action="final-submit-inspection" ${submitState.canSubmit ? "" : "disabled"} title="${esc(submitState.disabledText)}" aria-label="${esc(submitState.disabledText)}" type="button">최종 제출</button>
        </div>
      </section>`;
    }

    function refreshCheckSubmitBlockers(blockers) {
      document.querySelectorAll("[data-check-submit-blockers]").forEach((panel) => {
        panel.hidden = !blockers.length;
        const list = panel.querySelector(".check-submit-blocker-list");
        if (list) list.innerHTML = submitBlockerButtonsHtml(blockers);
      });
    }

    function focusSubmitBlocker(target) {
      if (["pledge", "signature"].includes(target) && !state.checkSubmitSheetOpen) {
        state.checkSubmitSheetOpen = true;
        renderPreservingScroll();
        requestAnimationFrame(() => focusSubmitBlocker(target));
        return;
      }
      const selector = {
        worker: "[data-submit-blocker-anchor='worker']",
        ship: "[data-submit-blocker-anchor='ship']",
        pledge: "[data-submit-blocker-anchor='pledge']",
        signature: "[data-submit-blocker-anchor='signature'], [data-submit-blocker-anchor='pledge']",
        checks: "[data-submit-blocker-anchor='checks']",
        "high-risk": "[data-check-item-risk='high']:not(:checked)",
      }[target];
      const element = selector ? document.querySelector(selector) : null;
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      const focusable = element.matches("button, input, select, textarea")
        ? element
        : element.querySelector("button, input, select, textarea");
      focusable?.focus({ preventScroll: true });
    }

    function refreshCheckSubmitControls() {
      const buttons = Array.from(document.querySelectorAll("[data-action='final-submit-inspection']"));
      if (!buttons.length) return;
      const cat = categoryById(state.selectedCategoryId);
      if (!cat) return;
      const items = filteredChecklistItems(cat.id);
      const highMissing = items.filter((row) => row.risk === "high" && !state.draft.checks[row.id]);
      const submitState = buildCheckSubmitState(cat, items, highMissing);
      buttons.forEach((button) => {
        button.disabled = !submitState.canSubmit;
        button.title = submitState.disabledText;
        button.setAttribute("aria-label", submitState.disabledText);
      });
      const checked = items.filter((row) => state.draft.checks[row.id]).length;
      document.querySelectorAll("[data-check-submit-progress]").forEach((element) => {
        element.textContent = `확인 ${checked}/${items.length}`;
      });
      document.querySelectorAll("[data-check-draft-saved-at]").forEach((element) => {
        element.textContent = checkDraftSaveLabel();
      });
      refreshCheckSubmitBlockers(submitState.blockers);
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
        const allChecked = sectionItems.length > 0 && sectionItems.every((entry) => state.draft.checks[entry.id]);
        const someChecked = sectionItems.some((entry) => state.draft.checks[entry.id]);
        document.querySelectorAll(`[data-check-section-master="${cssEscape(sectionId)}"]`).forEach((node) => {
          node.checked = allChecked;
          node.indeterminate = !allChecked && someChecked;
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

      if (state.view === "check") {
        renderPreservingScroll();
        return true;
      }
      refreshCheckSubmitControls();
      return true;
    }

    function uniqueWorkerTeams() {
      return [...new Set(state.workers.map((worker) => String(worker.team || "").trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "ko"));
    }

    function workPrepTeamOptions() {
      return WORK_PREP_TEAM_OPTIONS.filter((team) => state.workers.some((worker) => worker.team === team));
    }

    function workPrepDraftWithDefaults() {
      const worker = currentWorkerSessionWorker();
      const teams = workPrepTeamOptions();
      const categories = state.categories.sort(byOrder);
      const ships = visibleWorkerShips();
      const leaders = state.workers.filter(isLeaderWorker).sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "ko"));
      const preferredTeam = state.workPrepDraft.team || worker?.team || "";
      const fallbackTeam = teams.includes(preferredTeam) ? preferredTeam : teams[0] || "";
      const leader = state.workPrepDraft.leaderWorkerId
        ? state.workers.find((row) => row.id === state.workPrepDraft.leaderWorkerId)
        : (isLeaderWorker(worker) ? worker : leaders.find((row) => row.team === fallbackTeam) || leaders[0]);
      const team = leader?.team && teams.includes(leader.team) ? leader.team : fallbackTeam;
      const workerIds = new Set(Array.isArray(state.workPrepDraft.workerIds) ? state.workPrepDraft.workerIds : []);
      const draft = createWorkPrepDraft({
        ...state.workPrepDraft,
        workDate: state.workPrepDraft.workDate || today(),
        appearanceTime: state.workPrepDraft.appearanceTime || DEFAULT_WORK_PREP_APPEARANCE_TIME,
        team,
        shipNo: state.workPrepDraft.shipNo || ships[0]?.no || "",
        categoryId: state.workPrepDraft.categoryId || categories[0]?.id || "",
        leaderWorkerId: leader?.id || "",
        workerIds: [...workerIds],
      });
      syncWorkPrepWorkerBucketsToTeam(draft);
      draft.workerIds = normalizeWorkPrepWorkerIds(draft);
      draft.otherTeamWorkerIds = normalizeOtherTeamWorkPrepWorkerIds(draft);
      draft.toolIds = normalizeWorkPrepToolIds(draft);
      draft.status = normalizeWorkPrepStatus(draft.status || "preparing");
      return draft;
    }

    function openWorkPrepRegister() {
      if (!canOpenWorkPrepRegister()) return toast("작업지시서 등록은 관리/총무/조장만 사용할 수 있습니다.");
      const previous = state.workPrepDraft || {};
      state.workPrepDraft = createFreshWorkPrepRegistrationDraft(previous);
      state.workPrepRegisterOpen = true;
      state.workPrepOtherWorkersOpen = false;
      state.workPrepAppearanceOpen = false;
      state.selectedCategoryId = null;
      state.workPrepDraft = workPrepDraftWithDefaults();
      saveWorkPrepDraft();
      render();
      scrollScreenTop();
      pushRouteState();
    }

    function openWorkPrepRecordForEdit(recordId, options = {}) {
      if (!canOpenWorkPrepRegister()) return toast("작업지시서 수정은 관리/총무/조장만 사용할 수 있습니다.");
      const record = workPrepRecordById(recordId);
      if (!record) return toast("작업지시서를 찾을 수 없습니다.");
      const nextRecord = options.status ? updateWorkPrepRecordStatus(record.id, options.status) || record : record;
      state.workPrepRegisterOpen = true;
      state.workPrepOtherWorkersOpen = false;
      state.workPrepAppearanceOpen = false;
      state.selectedCategoryId = null;
      state.workPrepDraft = createWorkPrepDraft(nextRecord);
      state.workPrepDraft = workPrepDraftWithDefaults();
      saveWorkPrepDraft();
      render();
      scrollScreenTop();
      pushRouteState();
    }

    function startWorkPrepRecord(recordId) {
      const record = workPrepRecordById(recordId);
      if (!record) return toast("작업지시서를 찾을 수 없습니다.");
      const availability = workPrepStartAvailability(record);
      if (!availability.canStart) return toast(availability.message);
      openWorkPrepRecordForEdit(recordId, { status: "preparing" });
    }

    function startCheckFromWorkPrepRecord(recordId) {
      const record = workPrepRecordById(recordId);
      if (!record) return toast("작업지시서를 찾을 수 없습니다.");
      const availability = workPrepStartAvailability(record);
      if (!availability.canStart) return toast(availability.message);
      const category = categoryById(record.categoryId);
      if (!category) return toast("작업 유형을 찾을 수 없습니다.");
      const currentWorker = currentWorkerSessionWorker();
      if (!isWorkPrepParticipant(record, currentWorker?.id)) return toast("작업지시서에 등록된 조장/작업자만 점검을 시작할 수 있습니다.");
      if (hasSubmittedWorkPrepInspection(record, currentWorker?.id)) return toast("이미 이 작업지시서 점검을 제출했습니다.");
      const leader = state.workers.find((worker) => worker.id === record.leaderWorkerId);
      const workerName = currentWorker?.name || leader?.name || state.draft.worker || "";
      const workPrepWorkerId = currentWorker?.id || leader?.id || "";
      const confirmedRecord = applyWorkPrepMilestone(record.id, "confirmed", {
        kind: "start",
        changedAt: serverNow().toISOString(),
        actorIds: workPrepWorkerId ? [workPrepWorkerId] : [],
        actorLabel: workerName,
      }) || { ...record, status: "confirmed" };
      state.workPrepDraft = createWorkPrepDraft(confirmedRecord);
      saveWorkPrepDraft();
      state.workPrepRegisterOpen = false;
      state.selectedCategoryId = category.id;
      state.workerFallbackOpen = false;
      state.pledgeWorkerCollapsed = Boolean(workerName);
      state.pledgeShipCollapsed = Boolean(record.shipNo);
      state.draft = createDraft({
        worker: workerName,
        workPrepRecordId: record.id,
        workPrepWorkerId,
        shipNo: record.shipNo || "",
        selectedToolIds: normalizeWorkPrepToolIds(record),
        toolPrepComplete: false,
        checks: {},
      });
      saveJson("draft", state.draft);
      render();
      scrollScreenTop();
      pushRouteState();
    }

    function closeWorkPrepRegister() {
      state.workPrepRegisterOpen = false;
      state.workPrepDraft = createFreshWorkPrepRegistrationDraft();
      saveWorkPrepDraft();
      render();
      scrollScreenTop();
      pushRouteState();
    }

    function updateWorkPrepDraftField(field, value) {
      const draft = workPrepDraftWithDefaults();
      draft[field] = value;
      if (field === "team") {
        const teamLeader = state.workers.find((worker) => isLeaderWorker(worker) && worker.team === value);
        if (teamLeader) draft.leaderWorkerId = teamLeader.id;
      }
      if (field === "categoryId") draft.toolIds = [];
      if (field === "leaderWorkerId") {
        const leader = state.workers.find((worker) => worker.id === value);
        if (leader?.team && WORK_PREP_TEAM_OPTIONS.includes(leader.team)) draft.team = leader.team;
        draft.workerIds = draft.workerIds.filter((id) => id !== value);
        draft.otherTeamWorkerIds = (draft.otherTeamWorkerIds || []).filter((id) => id !== value);
      }
      syncWorkPrepWorkerBucketsToTeam(draft);
      draft.workerIds = normalizeWorkPrepWorkerIds(draft);
      draft.otherTeamWorkerIds = normalizeOtherTeamWorkPrepWorkerIds(draft);
      draft.toolIds = normalizeWorkPrepToolIds(draft);
      state.workPrepDraft = draft;
      saveWorkPrepDraft();
      renderPreservingScroll();
    }

    function toggleWorkPrepWorker(workerId, checked) {
      const draft = workPrepDraftWithDefaults();
      if (workerId === draft.leaderWorkerId) return;
      const workerIds = new Set(draft.workerIds);
      checked ? workerIds.add(workerId) : workerIds.delete(workerId);
      draft.workerIds = normalizeWorkPrepWorkerIds({ ...draft, workerIds: [...workerIds] });
      state.workPrepDraft = draft;
      saveWorkPrepDraft();
      renderPreservingScroll();
    }

    function toggleOtherTeamWorkPrepWorker(workerId, checked) {
      const draft = workPrepDraftWithDefaults();
      if (workerId === draft.leaderWorkerId) return;
      const workerIds = new Set(draft.otherTeamWorkerIds || []);
      checked ? workerIds.add(workerId) : workerIds.delete(workerId);
      draft.otherTeamWorkerIds = normalizeOtherTeamWorkPrepWorkerIds({ ...draft, otherTeamWorkerIds: [...workerIds] });
      state.workPrepDraft = draft;
      saveWorkPrepDraft();
      renderPreservingScroll();
    }

    function toggleWorkPrepTool(toolId, checked) {
      const draft = workPrepDraftWithDefaults();
      const toolIds = new Set(draft.toolIds);
      checked ? toolIds.add(toolId) : toolIds.delete(toolId);
      draft.toolIds = normalizeWorkPrepToolIds({ ...draft, toolIds: [...toolIds] });
      state.workPrepDraft = draft;
      saveWorkPrepDraft();
      renderPreservingScroll();
    }

    function sameTeamWorkPrepWorkers(draft) {
      const leaderId = String(draft.leaderWorkerId || "");
      return state.workers
        .filter((worker) => worker.team === draft.team)
        .filter((worker) => worker.id !== leaderId)
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "ko"));
    }

    function otherTeamWorkPrepWorkers(draft) {
      const leaderId = String(draft.leaderWorkerId || "");
      const counterpartTeam = workPrepCounterpartTeam(draft.team);
      return state.workers
        .filter((worker) => counterpartTeam && worker.team === counterpartTeam)
        .filter((worker) => worker.id !== leaderId)
        .sort((a, b) => String(a.team || "").localeCompare(String(b.team || ""), "ko") || String(a.name || "").localeCompare(String(b.name || ""), "ko"));
    }

    function renderWorkPrepAppearanceBadge(draft) {
      const time = draft.appearanceTime || DEFAULT_WORK_PREP_APPEARANCE_TIME;
      return `<div class="work-prep-appearance-wrap">
        <button class="work-prep-appearance-badge" data-action="toggle-work-prep-appearance" type="button" aria-expanded="${state.workPrepAppearanceOpen ? "true" : "false"}">${esc(time)} 이후 표시</button>
        ${state.workPrepAppearanceOpen ? `<div class="work-prep-appearance-popover">
          <label for="workPrepAppearanceTime">다음날 지시서 표시</label>
          <input class="input" id="workPrepAppearanceTime" data-work-prep-appearance-time type="time" value="${esc(time)}" />
        </div>` : ""}
      </div>`;
    }

    function updateWorkPrepAppearanceTime(value) {
      const draft = workPrepDraftWithDefaults();
      draft.appearanceTime = value || DEFAULT_WORK_PREP_APPEARANCE_TIME;
      state.workPrepDraft = draft;
      saveWorkPrepDraft();
      renderPreservingScroll();
    }

    async function saveWorkPrepRegistration() {
      const draft = workPrepDraftWithDefaults();
      const category = categoryById(draft.categoryId);
      const tools = category ? visibleToolsForCategory(category.id) : [];
      draft.workerIds = normalizeWorkPrepWorkerIds(draft);
      draft.otherTeamWorkerIds = normalizeOtherTeamWorkPrepWorkerIds(draft);
      draft.toolIds = normalizeWorkPrepToolIds(draft);
      state.workPrepDraft = draft;
      saveWorkPrepDraft();
      if (!draft.workDate) return toast("작업일을 선택하세요.");
      if (!draft.shipNo) return toast("호선을 선택하세요.");
      if (!draft.categoryId) return toast("작업 유형을 선택하세요.");
      if (!draft.leaderWorkerId) return toast("조장을 선택하세요.");
      if (tools.length && !draft.toolIds.length) return toast("공기구/준비물을 1개 이상 선택하세요.");
      const saved = upsertWorkPrepRecord(draft);
      state.workPrepDraft = createFreshWorkPrepRegistrationDraft(draft);
      saveWorkPrepDraft();
      state.workPrepRegisterOpen = false;
      render();
      scrollScreenTop();
      pushRouteState();
      const initialSync = workPrepSyncPresentation(saved);
      toast(initialSync.state === "offline"
        ? "작업지시서를 기기에 저장했습니다. 연결되면 서버로 자동 전송합니다."
        : "작업지시서를 기기에 저장했습니다. 서버에 반영하고 있습니다.");
      if (initialSync.state === "offline") return;
      await flushPendingSyncQueue();
      refreshVisiblePendingSyncStatus();
      const finalSync = workPrepSyncPresentation(saved);
      toast(finalSync.state === "synced"
        ? "작업지시서가 서버에 반영되었습니다."
        : "작업지시서는 기기에 저장되었고 서버 재전송을 기다리고 있습니다.");
    }

    function workPrepDateSectionTitle(date) {
      const parsed = new Date(`${date}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) return "작업지시서";
      return `${String(parsed.getMonth() + 1).padStart(2, "0")}월${String(parsed.getDate()).padStart(2, "0")}일 작업지시서`;
    }

    function addDaysToLocalDate(date, days) {
      const parsed = new Date(`${date}T00:00:00`);
      parsed.setDate(parsed.getDate() + days);
      return localDate(parsed);
    }

    function isWorkPrepRestDate(date) {
      const parsed = new Date(`${date}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) return false;
      const day = parsed.getDay();
      return day === 0 || day === 6 || Boolean(isMonthlyRestDay(date));
    }

    function workPrepOpenDate(workDate) {
      const parsed = new Date(`${workDate}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) return "";
      let openDate = addDaysToLocalDate(workDate, -1);
      let guard = 0;
      while (openDate && isWorkPrepRestDate(openDate) && guard < 14) {
        openDate = addDaysToLocalDate(openDate, -1);
        guard += 1;
      }
      return openDate;
    }

    function workPrepOpenDateTime(record) {
      const openDate = workPrepOpenDate(record?.workDate || "");
      if (!openDate) return null;
      const [rawHour, rawMinute] = String(record?.appearanceTime || DEFAULT_WORK_PREP_APPEARANCE_TIME).split(":").map(Number);
      const hour = Number.isFinite(rawHour) ? rawHour : 15;
      const minute = Number.isFinite(rawMinute) ? rawMinute : 0;
      const openAt = new Date(`${openDate}T${pad2(hour)}:${pad2(minute)}:00`);
      return Number.isNaN(openAt.getTime()) ? null : openAt;
    }

    function shouldShowUpcomingWorkPrepRecord(record, now = new Date()) {
      const workDate = String(record?.workDate || "");
      if (!workDate || workDate <= localDate(now)) return false;
      const openAt = workPrepOpenDateTime(record);
      return Boolean(openAt) && now >= openAt;
    }

    function workPrepStartDateTime(record) {
      const workDate = String(record?.workDate || "").trim();
      if (!workDate) return null;
      const [rawHour, rawMinute] = WORK_PREP_START_TIME.split(":").map(Number);
      const hour = Number.isFinite(rawHour) ? rawHour : 7;
      const minute = Number.isFinite(rawMinute) ? rawMinute : 0;
      const startAt = new Date(`${workDate}T${pad2(hour)}:${pad2(minute)}:00`);
      return Number.isNaN(startAt.getTime()) ? null : startAt;
    }

    function workPrepStartAvailability(record, now = serverNow()) {
      const startAt = workPrepStartDateTime(record);
      if (!startAt || now >= startAt) return { canStart: true, message: "" };
      return { canStart: false, message: WORK_PREP_START_LOCKED_MESSAGE };
    }

    function workPrepAppearanceMeta(record, todayDate = today()) {
      const workDate = String(record?.workDate || "");
      if (!workDate || workDate <= todayDate) return "";
      return `${record?.appearanceTime || DEFAULT_WORK_PREP_APPEARANCE_TIME} 이후`;
    }

    function sortWorkPrepRecords(records = []) {
      const workerTeam = String(currentWorkerSessionWorker()?.team || "").trim();
      return [...records]
        .sort((a, b) => {
          if (workerTeam) {
            const teamDiff = (String(b.team || "").trim() === workerTeam ? 1 : 0) - (String(a.team || "").trim() === workerTeam ? 1 : 0);
            if (teamDiff) return teamDiff;
          }
          const statusDiff = (WORK_PREP_STATUS_ORDER[normalizeWorkPrepStatus(a.status)] || 99) - (WORK_PREP_STATUS_ORDER[normalizeWorkPrepStatus(b.status)] || 99);
          if (statusDiff) return statusDiff;
          return String(a.shipNo || "").localeCompare(String(b.shipNo || ""), "ko");
        });
    }

    function workPrepRecordsForDate(date) {
      return sortWorkPrepRecords(state.workPrepRecords.filter((record) => record.workDate === date));
    }

    function visibleUpcomingWorkPrepRecords(todayDate = today(), now = new Date()) {
      return sortWorkPrepRecords(state.workPrepRecords.filter((record) => record.workDate > todayDate && shouldShowUpcomingWorkPrepRecord(record, now)));
    }

    function workPrepVisibleDateOptions(todayDate = today(), now = new Date()) {
      const dates = new Set([todayDate]);
      state.workPrepRecords.forEach((record) => {
        if (record.workDate && record.workDate <= todayDate) dates.add(record.workDate);
      });
      visibleUpcomingWorkPrepRecords(todayDate, now).forEach((record) => {
        if (record.workDate) dates.add(record.workDate);
      });
      return [...dates].filter(Boolean).sort();
    }

    function selectedWorkPrepDisplayDate(dateOptions, fallbackDate) {
      const options = Array.isArray(dateOptions) ? dateOptions.filter(Boolean) : [];
      const selected = String(state.selectedWorkPrepDate || "");
      if (state.workPrepDateManuallySelected && selected && options.includes(selected)) return selected;
      const fallback = options.includes(fallbackDate) ? fallbackDate : options[0] || fallbackDate || today();
      state.selectedWorkPrepDate = fallback;
      state.workPrepDateManuallySelected = false;
      return fallback;
    }

    function selectWorkPrepDate(date) {
      const options = workPrepVisibleDateOptions();
      if (!options.includes(date)) return;
      state.selectedWorkPrepDate = date;
      state.workPrepDateManuallySelected = true;
      renderPreservingScroll();
    }

    function renderWorkPrepShipMark(record) {
      return `<div class="work-prep-ship-mark" aria-hidden="true">
        <span class="work-prep-ship-icon"><i></i><i></i></span>
        <strong>${esc(record?.shipNo || "-")}</strong>
      </div>`;
    }

    function renderWorkPrepTypeIcon(category, className = "work-prep-record-type-icon") {
      return `<span class="${esc(className)}" aria-hidden="true">${category ? categoryVisual(category) : lineIcon("shieldCheck")}</span>`;
    }

    function renderWorkPrepCard(record) {
      const category = categoryById(record.categoryId);
      const leader = state.workers.find((worker) => worker.id === record.leaderWorkerId);
      const status = normalizeWorkPrepStatus(record.status);
      const workerCount = (record.workerIds || []).length + (record.otherTeamWorkerIds || []).length;
      const toolCount = (record.toolIds || []).length;
      const submissionProgress = workPrepSubmissionProgress(record);
      const progressTotal = submissionProgress.total || workPrepParticipantWorkerIds(record).length || workerCount + (leader ? 1 : 0);
      const isUsed = status === "used";
      const currentWorker = currentWorkerSessionWorker();
      const canStartCheck = isWorkPrepParticipant(record, currentWorker?.id);
      const currentWorkerSubmitted = hasSubmittedWorkPrepInspection(record, currentWorker?.id);
      const startAvailability = workPrepStartAvailability(record);
      const checkDisabled = !isUsed && (!startAvailability.canStart || (status === "ordered" ? false : (!canStartCheck || currentWorkerSubmitted)));
      const canDelete = canOpenWorkPrepRegister();
      const submittedIds = new Set(submissionProgress.submittedIds || []);
      const pendingNames = workPrepParticipantWorkerIds(record)
        .filter((id) => !submittedIds.has(id))
        .map((id) => state.workers.find((worker) => worker.id === id))
        .filter(Boolean)
        .map((worker) => worker.name || "이름 없음");
      const buttonLabel = status === "ordered"
        ? "준비 시작"
        : isUsed
          ? WORK_PREP_STATUS_LABELS.used
          : currentWorkerSubmitted
            ? "제출 완료"
            : canStartCheck
              ? "점검 시작"
              : "점검 대기";
      return SCREEN_VIEWS.renderWorkPrepCardView({
        status,
        recordId: record.id,
        ariaLabel: `${record.shipNo || "-"} 작업지시서 수정`,
        typeIconHtml: renderWorkPrepTypeIcon(category),
        shipNo: record.shipNo || "-",
        categoryLabel: category ? workLabel(category) : "작업 유형 없음",
        statusLabel: WORK_PREP_STATUS_LABELS[status],
        leaderName: leader?.name || "미정",
        leaderBadgeHtml: workerBadgeRow(leader || { team: record.team, position: LEADER_WORKER_POSITION }),
        workerCount,
        progressDone: submissionProgress.done,
        progressTotal,
        toolCount,
        team: record.team || "-",
        summaryKind: status === "ordered" ? "ordered" : submissionProgress.complete ? "done" : "pending",
        pendingNames,
        canDelete,
        deleteDisabled: !canDelete,
        deleteAriaLabel: `${record.shipNo || "-"} 작업지시서 삭제`,
        buttonLight: status === "ordered" || isUsed || checkDisabled,
        buttonDisabled: isUsed || checkDisabled,
        buttonHelp: !startAvailability.canStart ? startAvailability.message : "",
        buttonAction: status === "ordered" ? "start-work-prep-record" : "start-check-from-work-prep",
        buttonLabel,
      });
    }

    function renderWorkPrepDateSection(date, records, options = {}) {
      if (!records.length && !options.force) return "";
      const dateOptions = Array.isArray(options.dateOptions) && options.dateOptions.length ? options.dateOptions : [date];
      const currentIndex = Math.max(0, dateOptions.indexOf(date));
      const prevDate = currentIndex > 0 ? dateOptions[currentIndex - 1] : "";
      const nextDate = currentIndex < dateOptions.length - 1 ? dateOptions[currentIndex + 1] : "";
      return `<section class="work-prep-date-section ${options.next ? "next-date" : ""}">
        <div class="section-head">
          <div class="work-prep-date-nav">
            <button class="work-prep-date-arrow" data-action="select-work-prep-date" data-work-prep-date="${esc(prevDate)}" ${prevDate ? "" : "disabled"} type="button" aria-label="이전 작업지시서 날짜">&laquo;</button>
            <h2>${esc(workPrepDateSectionTitle(date))}</h2>
            <button class="work-prep-date-arrow" data-action="select-work-prep-date" data-work-prep-date="${esc(nextDate)}" ${nextDate ? "" : "disabled"} type="button" aria-label="다음 작업지시서 날짜">&raquo;</button>
          </div>
          <span class="count">${records.length}건</span>
        </div>
        <div class="work-prep-record-stack">
          ${records.length ? records.map(renderWorkPrepCard).join("") : `<div class="empty compact-empty">등록된 작업지시서가 없습니다.</div>`}
        </div>
      </section>`;
    }

    function checkFlowShipsForDraft() {
      const ships = visibleWorkerShips();
      if (!state.draft.workPrepRecordId || !state.draft.shipNo) return ships;
      if (ships.some((ship) => ship.no === state.draft.shipNo)) return ships;
      const workPrepShip = state.ships.find((ship) => ship.no === state.draft.shipNo);
      return workPrepShip ? [workPrepShip, ...ships] : ships;
    }

    function renderDirectCheckSection(categories) {
      return `<section class="work-prep-direct-section">
        <button class="work-prep-direct-toggle" data-action="toggle-work-prep-direct" type="button" aria-expanded="${state.workPrepDirectOpen ? "true" : "false"}">
          <span><strong>작업지시서 없이 점검</strong><em>등록된 작업지시서가 없거나 즉시 점검할 때 펼쳐서 선택</em></span>
          ${renderCategoryToggleImage(state.workPrepDirectOpen, { color: "#2E5DA6" })}
        </button>
        ${state.workPrepDirectOpen ? `<div class="work-prep-direct-panel">
          <div class="work-grid check-flow-work-grid">
            ${categories.length ? categories.map((cat) => `<button class="work-card" style="--accent:${esc(categoryAccent(cat))}" data-select-category="${cat.id}" type="button">
              <span class="work-icon">${categoryVisual(cat)}</span>
              <div class="work-title">${esc(workLabel(cat))}</div>
            </button>`).join("") : `<div class="empty">등록된 작업 유형이 없습니다. 관리자 메뉴에서 작업 유형을 추가하세요.</div>`}
          </div>
        </div>` : ""}
      </section>`;
    }

    function renderWorkPrepRegister() {
      const manageContext = state.view === "manage" && state.manageTab === "workPrep";
      const draft = workPrepDraftWithDefaults();
      const teams = workPrepTeamOptions();
      const ships = visibleWorkerShips();
      const categories = state.categories.sort(byOrder);
      const leaders = state.workers.filter(isLeaderWorker).sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "ko"));
      const selectedCategory = categoryById(draft.categoryId) || categories[0] || null;
      const tools = selectedCategory ? visibleToolsForCategory(selectedCategory.id) : [];
      const workerChoices = sameTeamWorkPrepWorkers(draft);
      const otherWorkerChoices = otherTeamWorkPrepWorkers(draft);
      const selectedWorkers = new Set(draft.workerIds || []);
      const selectedOtherWorkers = new Set(draft.otherTeamWorkerIds || []);
      const selectedTools = new Set(draft.toolIds || []);
      const workerChipModel = (worker, checked) => ({
        id: worker.id,
        name: worker.name,
        checked,
        badgeHtml: workerBadgeRow(worker),
      });
      return SCREEN_VIEWS.renderWorkPrepRegisterView({
        manageContext,
        activeStatus: normalizeWorkPrepStatus(draft.status),
        statusSteps: [
          { status: "ordered", label: "작업지시" },
          { status: "preparing", label: "점검 대기" },
          { status: "confirmed", label: "확정" },
          { status: "used", label: WORK_PREP_STATUS_LABELS.used },
        ],
        appearanceBadgeHtml: renderWorkPrepAppearanceBadge(draft),
        workDate: draft.workDate,
        team: draft.team,
        teams,
        shipNo: draft.shipNo,
        ships: ships.map((ship) => ({ no: ship.no, type: ship.type })),
        categoryId: draft.categoryId,
        categories: categories.map((cat) => ({ id: cat.id, label: workLabel(cat) })),
        leaderWorkerId: draft.leaderWorkerId,
        leaders: leaders.map((worker) => ({ id: worker.id, name: worker.name, team: worker.team })),
        teamLabel: draft.team || "같은 소속",
        workerChoices: workerChoices.map((worker) => workerChipModel(worker, selectedWorkers.has(worker.id))),
        otherWorkersOpen: state.workPrepOtherWorkersOpen,
        otherSelectedCount: selectedOtherWorkers.size,
        otherWorkerChoices: otherWorkerChoices.map((worker) => workerChipModel(worker, selectedOtherWorkers.has(worker.id))),
        toolCategoryLabel: selectedCategory ? workLabel(selectedCategory) : "작업 유형",
        tools: tools.map((tool) => ({ id: tool.id, name: tool.name, natureLabel: normalizeToolNature(tool.nature), checked: selectedTools.has(tool.id) })),
      });
    }

    function renderUncheckedChecklistItems(categoryId, items) {
      const uncheckedItems = items.filter((row) => !state.draft.checks[row.id]);
      if (!uncheckedItems.length) return "";
      const sections = new Map(sectionsFor(categoryId).map((section) => [section.id, section]));
      const completedCount = items.length - uncheckedItems.length;
      return `<section class="unchecked-items-panel" data-unchecked-items-panel>
        <div class="unchecked-items-panel-head">
          <div><strong>미확인 항목 ${uncheckedItems.length}건</strong><span>확인 완료 ${completedCount}건은 접어 두었습니다.</span></div>
        </div>
        <div class="unchecked-items-list">
          ${uncheckedItems.map((row) => {
            const section = sections.get(row.sectionId);
            const riskLabel = row.risk === "high" ? "고위험" : row.risk === "medium" ? "주의" : "일반";
            return `<article class="unchecked-item-card">
              <div>
                <span class="unchecked-item-risk is-${esc(row.risk || "low")}">${esc(riskLabel)}</span>
                <strong>${esc(section?.title || "위험요인 미지정")}</strong>
                <p>${esc(row.text)}</p>
              </div>
              <button class="btn-light unchecked-item-unsafe-btn" data-action="open-unsafe-from-check" data-check-unsafe-item="${esc(row.id)}" type="button">불안전요소로 접수</button>
            </article>`;
          }).join("")}
        </div>
      </section>`;
    }

    function recentCheckFlowShips(ships) {
      const availableShips = new Map(ships.map((ship) => [ship.no, ship]));
      const recentRecords = [...state.inspections, ...state.workPrepRecords]
        .sort((left, right) => String(right.createdAt || right.date || "").localeCompare(String(left.createdAt || left.date || "")));
      const seen = new Set();
      return recentRecords
        .map((record) => availableShips.get(record.shipNo))
        .filter((ship) => ship && !seen.has(ship.no) && seen.add(ship.no))
        .slice(0, 3);
    }

    function checkFlowShipSearchText(ship) {
      const stage = effectiveShipStage(ship);
      return normalizeSearchQuery([ship.no, ship.type, stage.label, shipDeliveryMeta(ship)].filter(Boolean).join(" "));
    }

    function renderDirectCheckShipSelect(category) {
      const ships = checkFlowShipsForDraft();
      const selectedShip = ships.find((ship) => ship.no === state.draft.shipNo);
      const recentShips = recentCheckFlowShips(ships);
      const shipRows = ships.map((ship) => {
        const stage = effectiveShipStage(ship);
        const selected = state.draft.shipNo === ship.no;
        return `<button class="check-flow-ship-row ${selected ? "active" : ""}" data-select-check-ship="${esc(ship.no)}" data-ship-search-item data-ship-search-text="${esc(checkFlowShipSearchText(ship))}" type="button" aria-pressed="${selected ? "true" : "false"}">
          <strong>${esc(ship.no)}</strong>
          <span>${esc([ship.type || "선종 미지정", stage.label, shipDeliveryMeta(ship)].filter(Boolean).join(" · "))}</span>
        </button>`;
      }).join("");
      const body = `<section class="check-flow-selection-card">
        <div class="check-flow-selection-head">
          <span>작업 선택</span>
          <strong>${esc(workLabel(category))}</strong>
          <button class="btn-light" data-action="back-check-types" type="button">변경</button>
        </div>
      </section>
      <section class="check-flow-ship-picker" data-submit-blocker-anchor="ship">
        <div class="check-flow-ship-picker-head">
          <div><strong>오늘 작업 호선</strong><span>호선번호, 선종, 공정 또는 인도 일정으로 찾을 수 있습니다.</span></div>
          ${selectedShip ? `<span class="check-flow-selected-ship">선택됨 · ${esc(selectedShip.no)}</span>` : ""}
        </div>
        <label class="check-flow-ship-search">
          <span class="sr-only">호선 검색</span>
          <input class="input" data-ship-search value="${esc(state.shipSearchQuery)}" placeholder="호선 검색" autocomplete="off">
        </label>
        ${recentShips.length ? `<div class="check-flow-recent-ships" aria-label="최근 사용 호선">
          <span>최근 사용</span>
          ${recentShips.map((ship) => `<button class="check-flow-ship-chip ${state.draft.shipNo === ship.no ? "active" : ""}" data-select-check-ship="${esc(ship.no)}" type="button">${esc(ship.no)}</button>`).join("")}
        </div>` : ""}
        <div class="check-flow-ship-list" aria-label="호선 목록">${shipRows}</div>
        <p class="empty compact-empty" data-ship-search-empty hidden>검색 조건에 맞는 호선이 없습니다.</p>
        ${ships.length ? "" : `<div class="notice danger">작업자에게 공개된 호선이 없습니다. 호선 관리에서 공개 기준일을 입력한 호선만 점검 목록에 표시됩니다.</div>`}
      </section>`;
      const footer = `<button class="btn-light material-flow-secondary" data-action="back-check-types" type="button">작업 유형</button>
        ${disabledReasonWrap(`<button class="material-flow-primary" data-action="continue-check-ship" ${selectedShip ? "" : "disabled"} type="button">다음 단계로</button>`, "다음 단계로 이동하려면 작업 호선을 선택하세요.", !selectedShip)}`;
      return checkFlowShell(1, "작업과 호선 선택", "작업 유형과 오늘 작업 호선을 모두 선택하세요.", body, footer);
    }

    function renderToolFilterSummary(category, visibleItems) {
      const allItems = activeItems(category.id);
      const visibleIds = new Set(visibleItems.map((item) => item.id));
      const excludedItems = allItems.filter((item) => !visibleIds.has(item.id));
      if (!excludedItems.length) return "";
      const relatedTools = [...new Set(excludedItems
        .flatMap((item) => linkedToolsForItem(item).map((tool) => tool.name)))]
        .slice(0, 3);
      const hiddenNames = relatedTools.length
        ? `${relatedTools.join(" · ")}${excludedItems.length > relatedTools.length ? ` 외 ${excludedItems.length - relatedTools.length}건` : ""}`
        : `${excludedItems.slice(0, 2).map((item) => item.text).join(" · ")}${excludedItems.length > 2 ? ` 외 ${excludedItems.length - 2}건` : ""}`;
      return `<section class="tool-filter-summary" data-tool-filter-summary>
        <div>
          <strong>안전대책 ${visibleItems.length}건 점검 · ${excludedItems.length}건은 미선택 공기구라 제외됨</strong>
          <span>제외된 대책: ${esc(hiddenNames)}</span>
        </div>
        <button class="btn-light" data-action="back-tool-prep" type="button">공기구 다시 고르기</button>
      </section>`;
    }

    function renderCheck() {
      if (state.workPrepRegisterOpen) return renderWorkPrepRegister();
      if (!state.selectedCategoryId) {
        const categories = state.categories.sort(byOrder);
        const todayDate = today();
        const dateOptions = workPrepVisibleDateOptions(todayDate);
        const selectedDate = selectedWorkPrepDisplayDate(dateOptions, todayDate);
        const selectedRecords = workPrepRecordsForDate(selectedDate);
        const workPrepSections = renderWorkPrepDateSection(selectedDate, selectedRecords, { next: selectedDate !== todayDate, force: true, dateOptions });
        const prepEntry = canOpenWorkPrepRegister() ? `<section class="work-prep-entry-card">
          <div>
            <strong>작업지시서 등록</strong>
            <span>조장/관리/총무가 점검 전 작업자와 공기구를 먼저 정리합니다.</span>
          </div>
          <button class="btn" data-action="open-work-prep-register" type="button">등록</button>
        </section>` : "";
        const body = `${prepEntry}${workPrepSections}${renderDirectCheckSection(categories)}`;
        return checkFlowShell(1, "작업 선택", "어떤 작업을 점검할까요?", body);
      }

      const cat = categoryById(state.selectedCategoryId);
      if (!cat) {
        state.selectedCategoryId = null;
        return renderCheck();
      }
      if (!state.draft.workPrepRecordId && !state.draft.directShipSelectionComplete) return renderDirectCheckShipSelect(cat);
      if (visibleToolsForCategory(cat.id).length && !state.draft.toolPrepComplete) return renderToolPrep(cat);
      const items = filteredChecklistItems(cat.id);
      const checked = items.filter((row) => state.draft.checks[row.id]).length;
      const highMissing = items.filter((row) => row.risk === "high" && !state.draft.checks[row.id]);
      const pct = items.length ? Math.round(checked / items.length * 100) : 0;
      const selectableShips = checkFlowShipsForDraft();
      preloadCachedPledgeSignature();
      const submitState = buildCheckSubmitState(cat, items, highMissing);
      const canSubmit = submitState.canSubmit;
      const submitDisabledText = submitState.disabledText;

      const body = `${renderToolFilterSummary(cat, items)}
      ${renderUncheckedChecklistItems(cat.id, items)}
      <div class="check-flow-status-card" aria-label="점검 작성 상태">
        <div class="section-title">작성 상태 <span class="small muted" data-check-count>${checked}/${items.length} 항목 확인됨</span></div>
        ${progress(pct, categoryAccent(cat), "data-check-progress")}
        <div class="check-flow-status-badges">
          <span data-high-missing-badge>${badge(highMissing.length ? "high" : "low", highMissing.length ? `위험 ${highMissing.length}건 남음` : "위험 확인 완료")}</span>
          ${badge("medium", state.draft.worker.trim() ? "담당자 입력됨" : "담당자 필요")}
          ${badge("medium", state.draft.shipNo ? "호선 선택됨" : "호선 필요")}
        </div>
      </div>
      <div class="pledge-flow-grid">
        ${renderPledgeWorkerSelect(cat)}
      </div>
      ${selectableShips.length ? "" : `<div class="notice danger">작업자에게 공개된 호선이 없습니다. 호선 관리에서 공개 기준일을 입력한 호선만 점검 목록에 표시됩니다.</div>`}
      ${highMissing.length ? `<div class="notice danger" data-high-missing-notice>미확인 위험 항목 ${highMissing.length}건이 있습니다. 위험 항목은 모두 확인해야 제출할 수 있습니다.</div>` : `<div class="notice good" data-high-missing-notice>고위험 항목이 모두 확인되었습니다.</div>`}
      <div data-submit-blocker-anchor="checks">${renderChecklistSections(cat.id)}</div>`;
      return `<div class="check-submit-flow">
        ${checkFlowShell(3, cat.label, "섹션별로 점검하고, 고위험 항목은 모두 확인해야 제출됩니다.", body)}
        ${renderCheckSubmitBar(items, checked, submitState)}
        ${renderCheckSubmitSheet(submitState)}
      </div>`;
    }

    function renderToolPrep(cat) {
      const tools = visibleToolsForCategory(cat.id);
      const selectedIds = new Set(sanitizeToolIds(state.draft.selectedToolIds));
      const selectedCount = tools.filter((tool) => selectedIds.has(tool.id)).length;
      const coverage = toolPrepCoverage(cat, tools, [...selectedIds]);
      const fromWorkPrepRecord = Boolean(state.draft.workPrepRecordId);
      const displayTools = fromWorkPrepRecord ? tools.filter((tool) => selectedIds.has(tool.id)) : tools;
      const requireSelection = cat.requireToolCheck !== false;
      const allToolsSelected = Boolean(tools.length) && selectedCount === tools.length;
      const continueDisabled = requireSelection && !selectedCount;
      const continueDisabledText = continueDisabled ? "다음 점검표로 이동할 수 없음: 공기구/준비물 선택 필요" : "다음 점검표로";
      const selectionRequiredMessage = fromWorkPrepRecord
        ? "작업지시서에 공기구/준비물이 1개 이상 등록되어야 다음 점검표로 이동할 수 있습니다."
        : "공기구/준비물을 1개 이상 선택해야 다음 점검표로 이동할 수 있습니다.";
      const body = `<div class="pledge-flow-grid">
        ${renderPledgeWorkerSelect(cat)}
      </div>
      <div class="tool-prep-panel ${fromWorkPrepRecord ? "work-prep-tool-lock" : ""}">
        <div class="tool-prep-head">
          <div class="section-title">
            <span>${esc(cat.label)}</span>
            <span class="small muted">${esc(normalizeToolNature(cat.toolNature))} 기준 · ${fromWorkPrepRecord ? "작업지시 등록" : "선택"} ${selectedCount}개</span>
          </div>
          ${fromWorkPrepRecord ? "" : `<button class="btn-light tool-prep-select-all" data-action="toggle-all-tool-prep" type="button">${allToolsSelected ? "전체 해제" : "전체 선택"}</button>`}
        </div>
        <div class="tool-prep-coverage ${coverage.independent ? "is-independent" : ""}" data-tool-prep-coverage>
          <strong>${esc(coverage.title)}</strong>
          <span>${esc(coverage.description)}</span>
        </div>
        <div class="tool-prep-grid">
          ${displayTools.map((tool) => {
            const checked = selectedIds.has(tool.id);
            const linkedCount = coverage.toolCounts.get(tool.id) || 0;
            const countLabel = linkedCount
              ? (checked ? `대책 ${linkedCount}건` : `대책 ${linkedCount}건 제외`)
              : "연결 대책 없음";
            if (fromWorkPrepRecord) {
              return `<div class="tool-prep-card checked locked" role="listitem" aria-label="${esc(`${tool.name} 작업지시 등록 공기구`)}">
              <span class="tool-prep-check">✓</span>
              <span class="tool-prep-name">${esc(tool.name)}</span>
              ${natureBadge(tool.nature)}
              <span class="tool-prep-linked-count">${esc(countLabel)}</span>
            </div>`;
            }
            return `<button class="tool-prep-card ${checked ? "checked" : ""}" data-tool-prep-toggle="${esc(tool.id)}" type="button" aria-pressed="${checked ? "true" : "false"}">
              <span class="tool-prep-check">${checked ? "✓" : ""}</span>
              <span class="tool-prep-name">${esc(tool.name)}</span>
              ${natureBadge(tool.nature)}
              <span class="tool-prep-linked-count ${checked ? "" : "is-excluded"}">${esc(countLabel)}</span>
            </button>`;
          }).join("")}
        </div>
        ${requireSelection && !selectedCount ? `<div class="notice danger">${selectionRequiredMessage}</div>` : (fromWorkPrepRecord ? `<div class="notice good">작업지시서에 등록된 공기구/준비물입니다. 변경 없이 준비 여부만 확인하세요.</div>` : `<div class="notice good">선택한 공기구에 맞는 점검 항목만 다음 화면에 표시됩니다.</div>`)}
      </div>`;
      const footer = `<button class="btn-light material-flow-secondary" data-action="${fromWorkPrepRecord ? "back-check-types" : "back-check-ship"}" type="button">${fromWorkPrepRecord ? "작업 유형" : "작업과 호선"}</button>
        ${disabledReasonWrap(`<button class="material-flow-primary" data-action="continue-tool-prep" ${continueDisabled ? "disabled" : ""} title="${esc(continueDisabledText)}" aria-label="${esc(continueDisabledText)}" type="button">다음 점검표로</button>`, continueDisabledText, continueDisabled)}`;
      return checkFlowShell(2, "공기구 확인", fromWorkPrepRecord ? "작업지시서에 등록된 공기구와 준비물을 확인하세요" : "사용할 공기구와 준비물을 선택하세요", body, footer);
    }

    function checkFlowShell(step, title, lead, body, footer = "") {
      const total = 3;
      const pct = Math.round(step / total * 100);
      return `<section class="material-flow check-flow">
        <div class="material-flow-head">
          <div class="material-flow-kicker">작업 전 점검 · STEP ${step} / ${total}</div>
          <div class="material-flow-title">
            ${step > 1 ? `<button class="material-back" data-action="back-check-types" type="button" aria-label="작업 유형 선택으로 돌아가기">‹</button>` : ""}
            <h1>${esc(title)}</h1>
          </div>
          <p>${esc(lead)}</p>
          <div class="material-flow-progress" role="progressbar" aria-label="점검 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
        </div>
        <div class="material-flow-body">${body}</div>
        ${footer ? `<div class="material-flow-footer">${footer}</div>` : ""}
      </section>`;
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

    function sectionSignImg(signCode) {
      if (!/^[PMSW]-(?:0[1-9]|1[0-2])$/.test(signCode)) return "";
      return `<div class="check-section-sign-wrap">
        <button class="check-section-sign-trigger" type="button" data-section-sign-open aria-haspopup="dialog" aria-label="안전표지 ${esc(signCode)} 확대 보기">
          <img class="check-section-sign" src="assets/pictograms/signs/${signCode}.png" alt="" data-section-sign-image loading="lazy">
          <span class="check-section-sign-zoom" aria-hidden="true">확대</span>
        </button>
        <dialog class="check-section-sign-dialog" data-section-sign-dialog aria-label="안전표지 ${esc(signCode)} 확대 보기">
          <div class="check-section-sign-dialog-body">
            <img src="assets/pictograms/signs/${signCode}.png" alt="안전표지 ${esc(signCode)}">
            <strong>${esc(signCode)}</strong>
            <button class="btn-light" type="button" data-section-sign-close>닫기</button>
          </div>
        </dialog>
      </div>`;
    }

    function sectionRiskBadge(section) {
      const total = section.totalScore;
      if (!(Number.isFinite(total) && total >= 1)) return "";
      const tone = total >= 6 ? "risk-sign-high" : total >= 3 ? "risk-sign-mid" : "risk-sign-low";
      return `<span class="check-section-risk ${tone}">위험도 ${esc(String(total))}</span>`;
    }

    function sectionGradeBadge(section) {
      const total = section.totalScore;
      if (!(Number.isFinite(total) && total >= 3)) return "";
      return badge(total >= 6 ? "high" : "medium");
    }

    function renderChecklistSections(categoryId) {
      const sections = sectionsFor(categoryId);
      const visibleItems = filteredChecklistItems(categoryId);
      if (!sections.length) return `<div class="empty empty-section-note">등록된 섹션이 없습니다.</div>`;
      const visibleSections = sections
        .map((section) => ({
          section,
          items: visibleItems.filter((row) => row.sectionId === section.id),
        }))
        .filter(({ items }) => items.length);
      if (!visibleSections.length) return `<div class="empty empty-section-note">선택한 공기구/준비물에 해당하는 점검 항목이 없습니다.</div>`;
      return visibleSections.map(({ section, items }) => {
        const tone = section.totalScore >= 6 ? "high" : section.totalScore >= 3 ? "mid" : "low";
        const uncheckedItems = items.filter((row) => !state.draft.checks[row.id]);
        const completedItems = items.filter((row) => state.draft.checks[row.id]);
        return `<section class="check-section" data-check-section="${esc(section.id)}">
          <div class="check-section-hero">
            <label class="check-section-master">
              <input type="checkbox" data-check-section-master="${esc(section.id)}" aria-label="위험요인 전체 확인" ${items.every((row) => state.draft.checks[row.id]) ? "checked" : ""} />
              <span class="check-section-master-box" aria-hidden="true"></span>
              <strong>이 위험요인 전체 확인</strong>
            </label>
            ${sectionSignImg(section.signCode)}
            <div class="check-section-badges">${sectionRiskBadge(section)}${sectionGradeBadge(section)}</div>
          </div>
          <div class="check-section-titlebar" data-risk-tone="${tone}">
            <span class="check-section-title">${esc(section.title)}</span>
            <span class="small muted" data-check-section-count="${esc(section.id)}">${items.filter((row) => state.draft.checks[row.id]).length}/${items.length}</span>
          </div>
          <div class="check-section-items">
            ${uncheckedItems.map(renderChecklistItem).join("")}
            ${completedItems.length ? `<details class="check-section-completed">
              <summary>확인 완료 ${completedItems.length}건 펼치기</summary>
              <div class="check-section-completed-list">${completedItems.map(renderChecklistItem).join("")}</div>
            </details>` : ""}
          </div>
        </section>`;
      }).join("");
    }

    function renderChecklistItem(row) {
      return `<label class="check-item ${state.draft.checks[row.id] ? "checked" : ""}" data-check-row="${esc(row.id)}">
        <input type="checkbox" data-check-item="${esc(row.id)}" data-check-item-risk="${esc(row.risk)}" ${state.draft.checks[row.id] ? "checked" : ""} />
        <span class="check-text">${esc(row.text)}${renderItemToolChips(row)}</span>
      </label>`;
    }

    function renderHistory() {
      if (state.historyDetailId) {
        const detailRow = state.inspections.find((row) => row.id === state.historyDetailId);
        if (detailRow) return renderInspectionRecord(detailRow);
        state.historyDetailId = null;
      }
      state.historyScope = normalizeHistoryScope(state.historyScope);
      state.historyFilter = "all";
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
      ${isDeliveryScope || !state.historyShipNo ? "" : renderShipFilterNotice("history", state.historyShipNo)}
      ${isDeliveryScope || !state.adminMode ? "" : `<div class="notice good" style="margin-bottom:12px">관리자 수정 모드가 켜져 있습니다.${state.adminEmail ? ` (${esc(state.adminEmail)})` : ""}</div>`}
      ${isDeliveryScope ? "" : renderHistoryPledgeStatus()}
      <div class="panel panel-pad">
        ${isDeliveryScope
          ? (deliveryRows.length ? renderDeliveryCards(deliveryRows) : `<div class="empty">7일 이내 인도 예정 호선이 없습니다.</div>`)
          : (rows.length ? renderHistoryTable(rows) : `<div class="empty">조건에 맞는 점검 이력이 없습니다.</div>`)}
        ${isDeliveryScope ? "" : renderHistoryLoadMore(rows)}
      </div>`;
    }

    function renderHistoryLoadMore(rows) {
      const limit = remoteListLimit("inspections");
      return DASHBOARD_VIEW.renderHistoryLoadMoreView({
        visible: isSyncConfigured()
          && state.historyScope === "all"
          && !state.historyShipNo
          && state.historyFilter === "all"
          && Array.isArray(rows)
          && rows.length >= limit,
      });
    }

    function renderHistoryPledgeStatus() {
      const rows = pledgeDashboardRows();
      const completed = rows.filter((row) => row.done).length;
      const pending = Math.max(rows.length - completed, 0);
      const rate = rows.length ? Math.round(completed / rows.length * 100) : 0;
      return SCREEN_VIEWS.renderHistoryPledgeStatusView({ completed, pending, rate });
    }

    function filteredHistoryRows() {
      state.historyScope = normalizeHistoryScope(state.historyScope);
      let rows = state.inspections;
      if (state.historyScope === "today") rows = rows.filter((row) => row.date === today());
      if (state.historyShipNo) rows = rows.filter((row) => sameShipNo(row.shipNo, state.historyShipNo));
      if (state.historyFilter !== "all") rows = rows.filter((row) => row.categoryId === state.historyFilter);
      return rows;
    }

    function renderHistoryTable(rows) {
      const canSelect = state.view === "history" && state.adminMode;
      const displayRows = state.view === "dashboard" ? rows.slice(0, 4) : rows;
      return DASHBOARD_VIEW.renderHistoryTableView({
        rows: displayRows.map((row) => {
          const cat = categoryById(row.categoryId) || { label: row.categoryLabel || "(삭제된 유형)", icon: row.categoryIcon || "?", color: row.categoryColor || "#607084" };
          const risk = historyRisk(row);
          const completion = Math.max(0, Math.min(100, Number(row.completion) || 0));
          const worker = historyWorkerForRow(row);
          const time = historyTimeParts(row.time);
          const ship = state.ships.find((item) => sameShipNo(item.no, row.shipNo));
          const stage = ship ? effectiveShipStage(ship) : stageForCategory(cat);
          const riskBadgeHtml = historyRiskBadgeHtml(risk);
          return {
            id: row.id,
            accent: categoryAccent(cat),
            stageColor: stage?.color || categoryAccent(cat),
            stageBg: stage?.bg || "#fff",
            ariaLabel: `${cat.label} ${risk.label === "정상" ? "완료" : risk.label} 점검 상세내역 보기`,
            categoryVisualHtml: categoryVisual(cat),
            canSelect,
            selected: state.selectedHistoryIds.includes(row.id),
            shipNo: row.shipNo || "-",
            workLabel: historyListWorkLabel(cat.label || "-"),
            workerName: row.worker || worker?.name || "-",
            workerPosition: workerDisplayPosition(worker || { position: row.workerPosition || "" }),
            workerTeam: normalizeWorkerTeam(worker?.team || row.workerTeam || ""),
            dateText: row.date || "",
            timePeriod: time.period,
            timeText: time.text,
            statusLabel: historyStatusLabel(row.status || (completion >= 100 ? "완료" : "확인 필요")),
            completion,
            riskBadgeHtml,
          };
        }),
      });
    }

    function historyWorkerForRow(row) {
      const workerId = String(row.workerId || "").trim();
      const workerName = String(row.worker || "").trim();
      return state.workers.find((worker) => worker.id === workerId)
        || state.workers.find((worker) => normalizedWorkerName(worker.name) === normalizedWorkerName(workerName))
        || null;
    }

    function historyListWorkLabel(value) {
      const label = String(value || "").trim();
      return ({
        "탑재 작업": "탑재",
        "선행 설치 작업": "선행 설치",
        "후행 설치 작업": "후행 설치",
        "DP설치작업": "DP설치",
        "DP 설치 작업": "DP 설치",
      })[label] || label;
    }

    function historyTimeParts(value) {
      const raw = String(value || "").trim();
      const match = raw.match(/^(\d{1,2}):(\d{2})/);
      if (!match) return { period: "", text: raw || "시간 미기록" };
      const hour = Number(match[1]);
      const minute = match[2];
      const period = hour < 12 ? "오전" : "오후";
      const displayHour = hour % 12 || 12;
      return { period, text: `${displayHour}:${minute}` };
    }

    function historyStatusLabel(status) {
      const value = String(status || "").trim();
      if (value === "완료") return "점검 완료";
      return value || "확인 필요";
    }

    function historyRisk(row) {
      const warnings = Number(row.warnings) || 0;
      const completion = Number(row.completion) || 0;
      if (warnings > 0) return { tone: "medium", label: `주의 ${warnings}건` };
      if (completion >= 100 && row.status === "완료") return { tone: "low", label: "정상" };
      return { tone: "medium", label: "확인 필요" };
    }

    function historyRiskBadgeHtml(risk) {
      const completed = risk.label === "정상";
      const label = completed ? "완료" : risk.label;
      return `<span class="history-risk-badge ${completed ? "is-complete" : "is-caution"}"><span aria-hidden="true">${completed ? "✓" : "▲"}</span><span>${esc(label)}</span></span>`;
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
      return SCREEN_VIEWS.renderInspectionRecordView({
        pageHeadHtml: pageHead(`${cat.label} 점검 기록`, "제출 당시 점검 화면을 읽기 전용으로 확인합니다.", `<button class="btn-light" data-action="back-history-list" type="button">목록으로</button>`),
        miniCardHtml: renderInspectionWorkPrepMiniCard(row),
        worker: row.worker || "-",
        shipNo: row.shipNo || "-",
        dateTime: `${row.date || "-"} ${row.time || ""}`.trim(),
        safetyPledge: row.safetyPledge || "-",
        signatureImage: row.signatureImage,
        toolNames: Array.isArray(row.tools) ? row.tools.map((tool) => tool.name || tool.id || "-") : [],
        sectionsHtml: items.length ? renderInspectionRecordSections(items) : "",
        accent,
        categoryVisualHtml: categoryVisual(cat),
        categoryLabelHtml: firstSpaceBreakHtml(cat.label),
        progressHtml: progress(pct, accent),
        checkedCount,
        itemCount: items.length,
        statusBadgeHtml: statusBadge(row.status || "완료"),
        warningBadgeHtml: badge(Number(row.warnings || 0) ? "high" : "low", Number(row.warnings || 0) ? `위험 ${row.warnings}건 미확인` : "위험 확인 완료"),
        completionBadgeHtml: badge("medium", `완료율 ${pct}%`),
      });
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
        ships: ships.filter((ship) => effectiveShipStage(ship).stage === stage),
      }));
      const bulkShipAddPanel = state.adminMode ? `
      <div class="panel panel-pad" style="margin-bottom:14px">
        <div class="section-title">
          <span>호선 일괄 추가</span>
        </div>
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
            <button class="btn" data-action="add-ship" type="button">일괄 추가</button>
          </div>
        </div>
      </div>` : "";
      return `${renderProcessBoard(grouped)}
      ${bulkShipAddPanel}
      <div class="panel panel-pad">
        <div class="section-title">
          <span>호선 정보 카드</span>
          <span class="ship-data-actions">
            ${adminToggleButton()}
            <button class="btn-light" data-action="import-ships" type="button">엑셀 불러오기</button>
            <button class="btn-light" data-action="export-ships" ${state.ships.length ? "" : "disabled"} type="button">엑셀 내보내기</button>
          </span>
          <input data-import-ships-file type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" hidden />
        </div>
        <div class="ship-sort-bar">
          <div class="field ship-search-field">
            <label for="shipSearch">호선번호 검색</label>
            <input class="input search-input" id="shipSearch" data-ship-search value="${esc(state.shipSearchQuery)}" placeholder="예) H3481" autocomplete="off" />
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
      const stages = grouped.map(({ stage, ships }) => {
        const info = shipStageInfo(stage);
        return {
          label: info.label,
          color: info.color,
          count: ships.length,
          chips: ships.slice(0, 5).map((ship) => ({ no: ship.no, foot: shipStageCardFoot(ship) })),
          overflow: Math.max(ships.length - 5, 0),
        };
      });
      return SCREEN_VIEWS.renderProcessBoardView({
        total: state.ships.length,
        note: "공정 상태는 호선 정보 카드 오른쪽의 상태 목록에서 수정합니다. 인도일 + 1개월이 지난 호선은 자동 삭제됩니다.",
        stages,
        legend: SHIP_WORKFLOW_STAGES.map((stage) => {
          const info = shipStageInfo(stage);
          return { label: info.label, color: info.color };
        }),
      }, { navIcon });
    }

    function renderShipRow(ship) {
      const info = effectiveShipStage(ship);
      const scheduleInfo = shipScheduleStage(ship);
      const summary = shipDataSummary(ship);
      const expanded = state.shipDataCardOpenIds.includes(ship.id);
      return `<article class="item-row ship-card ship-data-card ${expanded ? "is-expanded" : "is-collapsed"}" style="--stage:${esc(info.color)}" data-ship-search-item data-ship-search-text="${esc(searchableShipNo(ship))}">
        <div class="ship-card-head">
          <div class="ship-identity">
            <div class="ship-card-title">${esc(ship.no)}</div>
            <div class="ship-card-sub">${esc(ship.type || "선종 미지정")}${isWorkerVisibleShip(ship) ? " · 작업자 공개" : ""}</div>
          </div>
          <div class="ship-stage-stack">
            ${shipStageField(ship)}
            <span class="ship-stage-derived">일정 기준 ${esc(scheduleInfo.label)}</span>
          </div>
        </div>
        <div class="ship-card-body">
          <div class="ship-date-grid">
            ${shipDateField(ship, "lcDate", "L/C")}
            ${shipDateField(ship, "stDate", "S/T")}
            ${shipDateField(ship, "clDate", "C/L")}
            ${shipDateField(ship, "dlDate", "D/L")}
          </div>
          ${renderShipDataKpis(ship, summary)}
          ${renderShipDataRecent(summary)}
          <div class="ship-data-toggle-row">
            <button class="ship-data-toggle" data-action="toggle-ship-data-card" data-ship-id="${esc(ship.id)}" type="button" aria-expanded="${expanded ? "true" : "false"}" aria-label="${expanded ? "호선 DATA 카드 접기" : "호선 DATA 카드 펼치기"}">
              ${renderCategoryToggleImage(expanded, { color: "#1f6eb3" })}
            </button>
          </div>
          ${expanded ? renderShipDataExpanded(summary) : ""}
          ${state.adminMode ? `<div class="ship-card-admin-actions"><button class="btn-danger ship-delete-btn" data-delete-ship="${ship.id}" type="button">삭제</button></div>` : ""}
        </div>
      </article>`;
    }

    function sameShipNo(value, shipNo) {
      const left = normalizeShipNo(String(value || ""));
      const right = normalizeShipNo(String(shipNo || ""));
      return Boolean(left && right && left === right);
    }

    function shipScheduleStage(ship) {
      const current = today();
      if (!ship.lcDate) return shipStageInfo("mounting");
      if (ship.dlDate && current >= dateOnly(ship.dlDate)) return shipStageInfo("dl");
      if (ship.clDate && current >= dateOnly(ship.clDate)) return shipStageInfo("cl");
      if (ship.stDate && current >= dateOnly(ship.stDate)) return shipStageInfo("st");
      return shipStageInfo("lc");
    }

    function shipDataSummary(ship) {
      const shipNo = ship.no || "";
      const todayValue = today();
      const inspections = state.inspections
        .filter((row) => sameShipNo(row.shipNo, shipNo))
        .sort((a, b) => recordTimestamp(b) - recordTimestamp(a));
      const todayInspections = inspections.filter((row) => inspectionActualDate(row) === todayValue);
      const todayDone = todayInspections.filter((row) => row.status === "완료").length;
      const unsafeRows = state.unsafeIssues
        .filter((row) => sameShipNo(row.shipNo, shipNo))
        .sort((a, b) => recordTimestamp(b) - recordTimestamp(a));
      const materialRows = state.missingMaterials
        .filter((row) => sameShipNo(row.shipNo, shipNo))
        .sort((a, b) => recordTimestamp(b) - recordTimestamp(a));
      const materialDone = ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2];
      const openMaterials = materialRows.filter((row) => row.status !== materialDone && !row.completedAt).length;
      return {
        shipNo,
        inspections,
        todayDone,
        todayTotal: todayInspections.length,
        unsafeRows,
        latestUnsafe: unsafeRows[0] || null,
        materialRows,
        openMaterials,
      };
    }

    function renderShipDataKpis(ship, summary) {
      const latestUnsafeStatus = summary.latestUnsafe?.status || "등록 없음";
      const materialFoot = summary.openMaterials ? "미처리" : "처리 없음";
      return `<div class="ship-data-kpis">
        <button class="ship-data-kpi tone-ok" data-action="open-ship-data-target" data-ship-data-target="history" data-ship-no="${esc(ship.no)}" type="button">
          <span>오늘 점검</span><strong>${esc(summary.todayDone)}/${esc(summary.todayTotal)}</strong><em>누적 ${esc(summary.inspections.length)}건</em>
        </button>
        <button class="ship-data-kpi tone-warn" data-action="open-ship-data-target" data-ship-data-target="unsafe" data-ship-no="${esc(ship.no)}" type="button">
          <span>불안전요소</span><strong>${summary.latestUnsafe ? "최근 1" : "없음"}</strong><em>${esc(latestUnsafeStatus)}</em>
        </button>
        <button class="ship-data-kpi tone-danger" data-action="open-ship-data-target" data-ship-data-target="materials" data-ship-no="${esc(ship.no)}" type="button">
          <span>자재누락</span><strong>${esc(summary.openMaterials)}건</strong><em>${esc(materialFoot)}</em>
        </button>
      </div>`;
    }

    function renderShipDataRecent(summary) {
      const latest = summary.latestUnsafe;
      const title = latest ? shortUnsafeTitle(latest.content || "불안전요소") : "등록된 불안전요소 없음";
      return `<div class="ship-data-recent">
        <span>최근 불안전요소</span>
        <strong>${esc(title)}</strong>
      </div>`;
    }

    function renderShipDataExpanded(summary) {
      const inspectionRows = summary.inspections.slice(0, 3);
      const latestUnsafe = summary.latestUnsafe;
      const latestMaterial = summary.materialRows[0] || null;
      return `<div class="ship-data-expanded">
        <div class="ship-data-detail-card">
          <h3>최근 점검기록</h3>
          ${inspectionRows.length ? inspectionRows.map((row) => {
            const cat = categoryById(row.categoryId);
            const label = row.date === today() ? "오늘" : shortDate(row.date || row.createdAt);
            const text = `${row.worker || "-"} · ${cat?.label || row.categoryLabel || "점검"}`;
            return renderShipDataDetailRow(label, text, row.status || "확인");
          }).join("") : `<div class="ship-data-empty">점검 이력이 없습니다.</div>`}
        </div>
        <div class="ship-data-detail-card">
          <h3>최근 불안전요소 + 자재누락</h3>
          ${latestUnsafe ? renderShipDataDetailRow("위험", shortUnsafeTitle(latestUnsafe.content || "불안전요소"), latestUnsafe.status || "확인중", "warn") : renderShipDataDetailRow("위험", "등록된 불안전요소 없음", "없음")}
          ${latestMaterial ? renderShipDataDetailRow("자재", latestMaterial.materialName || latestMaterial.content || "자재누락", latestMaterial.status || "미처리", "danger") : renderShipDataDetailRow("자재", "등록된 자재누락 없음", "없음")}
        </div>
      </div>`;
    }

    function renderShipDataDetailRow(label, text, status, tone = "") {
      return `<div class="ship-data-detail-row">
        <b>${esc(label)}</b><span>${esc(text)}</span><i class="ship-data-status-chip ${tone}">${esc(status)}</i>
      </div>`;
    }

    function renderShipFilterNotice(kind, shipNo) {
      const safeShipNo = esc(shipNo);
      if (kind === "history") {
        return `<div class="notice ship-filter-notice">호선 ${safeShipNo} 점검 이력만 표시 중입니다. <button class="btn-light" data-action="clear-history-ship-filter" type="button">전체 보기</button></div>`;
      }
      const label = kind === "unsafe" ? "불안전요소" : "자재누락";
      return `<div class="notice ship-filter-notice">호선 ${safeShipNo} ${label}만 표시 중입니다. <button class="btn-light" data-record-filter="${esc(kind)}:shipNo" value="" type="button">전체 보기</button></div>`;
    }

    function toggleShipDataCard(shipId) {
      if (!shipId) return;
      const openIds = new Set(state.shipDataCardOpenIds || []);
      openIds.has(shipId) ? openIds.delete(shipId) : openIds.add(shipId);
      state.shipDataCardOpenIds = [...openIds];
      saveJson("shipDataCardOpenIds", state.shipDataCardOpenIds);
      renderPreservingScroll();
    }

    function openShipDataTarget(target, shipNo) {
      const normalizedShipNo = normalizeShipNo(String(shipNo || ""));
      if (!normalizedShipNo) return;
      if (target === "history") {
        state.historyScope = "all";
        state.historyFilter = "all";
        state.historyShipNo = normalizedShipNo;
        state.historyDetailId = null;
        location.href = `${pageForView("history")}?shipNo=${encodeURIComponent(normalizedShipNo)}`;
        return;
      }
      if (target === "unsafe") {
        state.manageTab = "unsafe";
        state.unsafeDetailId = "";
        state.unsafeFilters = { ...state.unsafeFilters, shipNo: normalizedShipNo, status: "" };
        saveJson("manageTab", state.manageTab);
        saveJson("unsafeFilters", state.unsafeFilters);
        location.href = `${pageForView("manage")}?tab=unsafe&shipNo=${encodeURIComponent(normalizedShipNo)}`;
        return;
      }
      if (target === "materials") {
        state.manageTab = "materials";
        state.materialFilters = { ...state.materialFilters, shipNo: normalizedShipNo, status: "", materialName: "" };
        saveJson("manageTab", state.manageTab);
        saveJson("materialFilters", state.materialFilters);
        location.href = `${pageForView("manage")}?tab=materials&shipNo=${encodeURIComponent(normalizedShipNo)}`;
      }
    }

    function clearHistoryShipFilter() {
      state.historyShipNo = "";
      render();
      history.pushState(routeState(), "", location.pathname);
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
      const displayValue = state.adminMode ? value : yymmddDate(value);
      return `<div class="ship-date-field">
        <label for="${field}_${ship.id}">${label}</label>
        <input class="input" id="${field}_${ship.id}" type="${state.adminMode ? "date" : "text"}" data-ship-date-field="${field}" data-ship-id="${ship.id}" value="${esc(displayValue)}" placeholder="미입력" ${state.adminMode ? "" : "disabled"} />
        ${value || state.adminMode ? "" : `<span class="ship-date-empty">미입력</span>`}
      </div>`;
    }

    function yymmddDate(value) {
      const clean = dateOnly(value);
      const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      return match ? `${match[1].slice(2)}${match[2]}${match[3]}` : clean;
    }

    function shipStageCardFoot(ship) {
      const info = effectiveShipStage(ship);
      return info.label;
    }

    function renderItems() {
      if (!state.manageCategoryId) {
        return SCREEN_VIEWS.renderItemManagerHomeView({
          pageHeadHtml: pageHead("작업 유형 관리", "작업 유형별 기본 정보, 공기구, 섹션과 점검 항목을 한곳에서 관리합니다.", adminToggleButton()),
          sessionLabel: currentWorkerSessionLabel(),
          logoutButtonHtml: logoutButton(),
          toolManagerShellHtml: renderToolManagerShell(),
          adminMode: state.adminMode,
          categoryAddOpen: state.categoryAddOpen,
          colors: COLORS,
          pictogramPickerHtml: state.categoryAddOpen ? renderPictogramPicker("blockAssembly") : "",
          categoryToolAssignmentsHtml: renderCategoryToolAssignments(),
        });
      }

      const cat = categoryById(state.manageCategoryId);
      if (!cat) {
        state.manageCategoryId = null;
        return renderItems();
      }
      return SCREEN_VIEWS.renderItemManagerCategoryView({
        pageHeadHtml: pageHead(`${cat.label} 항목 관리`, "섹션별로 항목을 나누어 현장 점검 화면에 같은 구조로 표시합니다.", `<button class="btn-light" data-action="back-items" type="button">목록으로</button>${adminToggleButton()}`),
        adminMode: state.adminMode,
        sectionsHtml: sectionsFor(cat.id).map((section) => renderSectionManager(cat, section)).join("") || `<div class="empty">섹션이 없습니다. 먼저 섹션을 추가하세요.</div>`,
      });
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
      const ships = issueSelectableShips();
      const selected = ships.find((ship) => ship.no === state.unsafeDraft.shipNo);
      const selectedMeta = selected ? effectiveShipStage(selected) : null;
      const body = `${ships.length ? `<div class="field material-flow-field">
        <label for="unsafeShipNo">호선 선택 *</label>
        <select class="select" id="unsafeShipNo">
          ${visibleShipOptionsForIssues(state.unsafeDraft.shipNo)}
        </select>
      </div>
      ${selected ? `<div class="material-selected-note"><strong>${esc(selected.no)}</strong> ${esc(selected.type || "")} · ${esc(selectedMeta.label)} ${esc(selectedMeta.percent)}%</div>` : ""}` : `<div class="notice danger">등록된 호선이 없습니다. 호선 관리에서 먼저 호선을 추가하세요.</div>`}`;
      const label = selected ? `${selected.no} 선택 → 다음` : "호선 선택 후 다음";
      return unsafeFlowShell(1, "호선 선택", "불안전요소가 발생한 호선을 선택하세요", body, `<button class="material-flow-primary ${selected ? "" : "is-disabled"}" data-unsafe-next type="button" ${selected ? "" : "disabled"}>${esc(label)}</button>`);
    }

    function renderUnsafeContentStep() {
      reconcileUnsafePhotoDraft();
      const ready = unsafeStepReady(2);
      const selectedWorker = currentWorkerSessionWorker();
      const photoNames = currentUnsafePhotoNames();
      const body = `<div class="field material-flow-field">
        <label for="unsafeContent"><span>불안전요소 내용 *</span><small>${String(state.unsafeDraft.content || "").length}/300</small></label>
        <textarea class="textarea" id="unsafeContent" maxlength="300" placeholder="예: 3번 탱크 상부 난간 미설치, 작업자 통행 위험">${esc(state.unsafeDraft.content || "")}</textarea>
      </div>
      <div class="field material-flow-field">
        <label>등록자</label>
        <div class="readonly-box"><strong>${esc(selectedWorker?.name || currentWorkerSessionLabel())}</strong>${selectedWorker?.team ? `<small>${esc(selectedWorker.team)}</small>` : ""}</div>
        <div class="small muted material-selected-note">로그인한 작업자로 자동 접수됩니다.</div>
      </div>
      ${renderUnsafePhotoPicker(photoNames)}`;
      return unsafeFlowShell(2, "내용 입력", `${state.unsafeDraft.shipNo || "선택한 호선"}에서 발견한 위험 요소를 적어주세요`, body, `<button class="material-flow-primary ${ready ? "" : "is-disabled"}" data-unsafe-next type="button" data-required-message="${esc(flowRequiredText(unsafeMissingFields(2)))}" ${ready ? "" : "disabled"}>다음 → 최종 확인</button>`);
    }

    function renderUnsafePhotoPicker(photoNames = currentUnsafePhotoNames()) {
      const files = Array.isArray(state.unsafePhotoFiles) ? state.unsafePhotoFiles : [];
      const max = ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS;
      const countLabel = files.length ? `${files.length}/${max}장 선택됨` : `최대 ${max}장`;
      const statusLabel = files.length ? `첨부 파일 ${files.length}장 등록됨` : "선택된 파일 없음";
      const slots = Array.from({ length: max }, (_, index) => {
        const file = files[index];
        if (!file) {
          return `<div class="unsafe-photo-chip is-empty"><span>사진 ${index + 1}</span><small>비어 있음</small></div>`;
        }
        return `<div class="unsafe-photo-chip">
          <span>${esc(file.name || `사진 ${index + 1}`)}</span>
          <small>${esc(formatBytes(file.size || 0))}</small>
          <button type="button" data-remove-unsafe-photo="${index}" aria-label="${esc(file.name || `사진 ${index + 1}`)} 삭제">삭제</button>
        </div>`;
      }).join("");
      return `<div class="field material-flow-field unsafe-photo-field">
        <label><span>현장 사진 첨부</span><small>선택 사항 · ${esc(countLabel)}</small></label>
        <div class="unsafe-photo-actions" aria-label="현장 사진 첨부 방식">
          <label class="unsafe-photo-action" for="unsafePhotoCamera">
            <strong>카메라 촬영</strong>
            <small>촬영 후 1장씩 추가</small>
          </label>
          <label class="unsafe-photo-action" for="unsafePhotoGallery">
            <strong>갤러리 선택</strong>
            <small>사진 선택 또는 추가</small>
          </label>
        </div>
        <input class="unsafe-photo-input" id="unsafePhotoCamera" data-unsafe-photo-input="camera" type="file" accept="image/*" capture="environment" />
        <input class="unsafe-photo-input" id="unsafePhotoGallery" data-unsafe-photo-input="gallery" type="file" accept="image/*" multiple />
        <div class="unsafe-photo-status">${esc(statusLabel)}</div>
        <div class="unsafe-photo-selected" aria-live="polite">${slots}</div>
        <div class="small muted">${photoNames.length ? "선택한 사진은 제출 시 함께 업로드됩니다." : "사진 없이도 다음 단계로 진행할 수 있습니다."}</div>
      </div>`;
    }

    function workPrepRecordForInspection(inspection) {
      const recordId = String(inspection?.workPrepRecordId || "").trim();
      if (!recordId) return null;
      return workPrepRecordById(recordId);
    }

    function renderInspectionWorkPrepMiniCard(inspection, options = {}) {
      const recordId = String(inspection?.workPrepRecordId || "").trim();
      if (!recordId) return "";
      const record = workPrepRecordForInspection(inspection);
      if (!record) {
        return SCREEN_VIEWS.renderInspectionWorkPrepMiniCardView({ fallback: true, recordId });
      }
      const category = categoryById(record.categoryId);
      const leader = state.workers.find((worker) => worker.id === record.leaderWorkerId);
      const status = normalizeWorkPrepStatus(record.status);
      const workerCount = (record.workerIds || []).length + (record.otherTeamWorkerIds || []).length;
      const toolCount = (record.toolIds || []).length;
      const submissionProgress = workPrepSubmissionProgress(record);
      const titlePrefix = options.compact ? "" : "작업지시서 ";
      const workDateTitle = workPrepDateSectionTitle(record.workDate);
      const workType = category ? workLabel(category) : "작업 유형 없음";
      return SCREEN_VIEWS.renderInspectionWorkPrepMiniCardView({
        status,
        title: `${titlePrefix}${record.shipNo || "-"}`,
        subtitle: options.compact
          ? `${workDateTitle} · ${workType}`
          : `${workDateTitle.replace(" 작업지시서", "")} · ${workType} · 작업지시서 기준 점검 완료`,
        statusLabel: WORK_PREP_STATUS_LABELS[status],
        leaderName: leader?.name || "미정",
        progressDone: submissionProgress.done,
        progressTotal: submissionProgress.total || workerCount + 1,
        toolCount,
        team: record.team || "-",
      });
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
      const ships = issueSelectableShips();
      const selected = ships.find((ship) => ship.no === state.materialDraft.shipNo);
      const selectedMeta = selected ? effectiveShipStage(selected) : null;
      const body = `${ships.length ? `<div class="field material-flow-field">
        <label for="materialShipNo">호선 선택 *</label>
        <select class="select" id="materialShipNo">
          ${visibleShipOptionsForIssues(state.materialDraft.shipNo)}
        </select>
      </div>
      ${selected ? `<div class="material-selected-note"><strong>${esc(selected.no)}</strong> ${esc(selected.type || "")} · ${esc(selectedMeta.label)} ${esc(selectedMeta.percent)}%</div>` : ""}` : `<div class="notice danger">등록된 호선이 없습니다. 호선 관리에서 먼저 호선을 추가하세요.</div>`}`;
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
      const selectedWorker = currentWorkerSessionWorker();
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
        <label>등록자</label>
        <div class="readonly-box"><strong>${esc(selectedWorker?.name || currentWorkerSessionLabel())}</strong>${selectedWorker?.team ? `<small>${esc(selectedWorker.team)}</small>` : ""}</div>
      </div>
      <div class="small muted material-selected-note">로그인한 작업자로 자동 접수됩니다.</div>`;
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
      <div class="notice material-submit-note">등록 정보가 서버에 저장되면 관리자에게 알림을 전송합니다. 전송 상태는 완료 화면에서 확인하세요.</div>`;
      const footer = `<button class="btn-light material-flow-secondary" data-material-edit-step="2" type="button">수정하기</button>
        <button class="material-flow-primary ${ready ? "" : "is-disabled"}" data-action="submit-material" type="button" ${ready ? "" : "disabled"}>${navIcon("board")} 누락 자재 등록</button>`;
      return materialFlowShell(4, "최종 확인", "등록 내용을 확인하고 제출하세요", body, footer);
    }

    function currentUnsafePhotoNames() {
      const files = Array.isArray(state.unsafePhotoFiles) ? state.unsafePhotoFiles : [];
      return files.length ? files.map((file) => file.name) : [];
    }

    function formatBytes(bytes) {
      const value = Number(bytes) || 0;
      if (value < 1024) return `${value}B`;
      if (value < 1024 * 1024) return `${Math.round(value / 1024)}KB`;
      return `${(value / 1024 / 1024).toFixed(1)}MB`;
    }

    function photoFileKey(file) {
      return [
        file?.name || "",
        file?.size || 0,
        file?.lastModified || 0,
        file?.type || "",
      ].join(":");
    }

    function mergeUnsafePhotoFiles(files) {
      const merged = [];
      const seen = new Set();
      [...(state.unsafePhotoFiles || []), ...(Array.isArray(files) ? files : [])].forEach((file) => {
        if (!file || seen.has(photoFileKey(file))) return;
        seen.add(photoFileKey(file));
        if (merged.length < ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS) merged.push(file);
      });
      return merged;
    }

    function updateUnsafePhotoDraftFromFiles() {
      state.unsafeDraft.photos = currentUnsafePhotoNames();
      saveJson("unsafeDraft", state.unsafeDraft);
    }

    function removeUnsafePhotoFile(index) {
      state.unsafePhotoFiles = (state.unsafePhotoFiles || []).filter((_, fileIndex) => fileIndex !== index);
      updateUnsafePhotoDraftFromFiles();
      render();
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

    function isMobileManageReadOnly() {
      return state.view === "manage"
        && typeof window !== "undefined"
        && typeof window.matchMedia === "function"
        && window.matchMedia("(max-width: 720px)").matches;
    }

    function manageMobileFilterKind() {
      return ["unsafe", "materials", "workPrep"].includes(state.manageTab) ? state.manageTab : "";
    }

    function manageMobileFiltersFor(kind = manageMobileFilterKind()) {
      if (kind === "unsafe") return state.unsafeFilters;
      if (kind === "materials") return state.materialFilters;
      if (kind === "workPrep") return state.workPrepFilters;
      return null;
    }

    function manageMobileFilterCount(kind, filters) {
      if (kind === "unsafe") return ISSUE_MATERIAL_RULES.filterRecords(state.unsafeIssues, filters).length;
      if (kind === "materials") return ISSUE_MATERIAL_RULES.filterRecords(state.missingMaterials, filters).length;
      if (kind === "workPrep") return filterWorkPrepRecords(state.workPrepRecords, filters).length;
      return 0;
    }

    function manageMobileFilterTitle(kind) {
      return kind === "unsafe" ? "불안전요소" : kind === "materials" ? "자재누락" : "작업지시서";
    }

    function manageMobileStatusOptions(kind) {
      if (kind === "unsafe") return ISSUE_MATERIAL_RULES.UNSAFE_STATUSES.map((status) => [status, status]);
      if (kind === "materials") return ISSUE_MATERIAL_RULES.MATERIAL_STATUSES.map((status) => [status, status]);
      return workPrepStatusOptions().map((status) => [status, WORK_PREP_STATUS_LABELS[status] || status]);
    }

    function renderManageMobileToolbar() {
      const kind = manageMobileFilterKind();
      const count = kind ? manageMobileFilterCount(kind, manageMobileFiltersFor(kind)) : 0;
      return `<section class="manage-mobile-mode" aria-label="모바일 관리 모드">
        <p><strong>조회 모드</strong><span>수정과 승인은 PC에서</span></p>
        <div>
          ${kind ? `<button class="btn-light" data-action="open-manage-mobile-filter" type="button">필터 <span>${esc(count)}건</span></button>` : ""}
          ${state.manageTab === "push" ? "" : `<button class="btn" data-manage-tab="push" type="button">담당자에게 알림 보내기</button>`}
        </div>
      </section>`;
    }

    function renderManageMobileFilterSheet() {
      const kind = manageMobileFilterKind();
      if (!isMobileManageReadOnly() || !state.manageMobileFilterOpen || !kind) return "";
      const filters = state.manageMobileFilterDraft || { ...manageMobileFiltersFor(kind) };
      const count = manageMobileFilterCount(kind, filters);
      const ships = kind === "workPrep" ? visibleWorkerShips() : issueSelectableShips();
      const statuses = manageMobileStatusOptions(kind);
      return `<section class="manage-mobile-filter-sheet" role="dialog" aria-modal="true" aria-labelledby="manageMobileFilterTitle">
        <div class="manage-mobile-filter-sheet-head">
          <div><span>조회 필터</span><h2 id="manageMobileFilterTitle">${esc(manageMobileFilterTitle(kind))}</h2></div>
          <button class="btn-light" data-action="cancel-manage-mobile-filter" type="button">닫기</button>
        </div>
        <div class="manage-mobile-filter-fields">
          <label>호선
            <select class="select" data-manage-mobile-filter="shipNo">
              <option value="">전체 호선</option>
              ${ships.map((ship) => `<option value="${esc(ship.no)}" ${filters.shipNo === ship.no ? "selected" : ""}>${esc(ship.no)}</option>`).join("")}
            </select>
          </label>
          <label>상태
            <select class="select" data-manage-mobile-filter="status">
              <option value="">전체 상태</option>
              ${statuses.map(([value, label]) => `<option value="${esc(value)}" ${filters.status === value ? "selected" : ""}>${esc(label)}</option>`).join("")}
            </select>
          </label>
          ${kind === "materials" ? `<label>자재명
            <input class="input" data-manage-mobile-filter="materialName" value="${esc(filters.materialName || "")}" placeholder="자재명으로 찾기" />
          </label>` : ""}
        </div>
        <div class="manage-mobile-filter-sheet-actions">
          <button class="btn-light" data-action="cancel-manage-mobile-filter" type="button">취소</button>
          <button class="btn" data-action="apply-manage-mobile-filter" type="button">${esc(count)}건 보기</button>
        </div>
      </section>`;
    }

    function openManageMobileFilter() {
      const kind = manageMobileFilterKind();
      if (!isMobileManageReadOnly() || !kind) return;
      state.manageMobileFilterDraft = { ...manageMobileFiltersFor(kind) };
      state.manageMobileFilterOpen = true;
      render();
    }

    function closeManageMobileFilter() {
      state.manageMobileFilterOpen = false;
      state.manageMobileFilterDraft = null;
      render();
    }

    function applyManageMobileFilter() {
      const kind = manageMobileFilterKind();
      const filters = state.manageMobileFilterDraft;
      if (!kind || !filters) return closeManageMobileFilter();
      const target = manageMobileFiltersFor(kind);
      Object.assign(target, filters);
      saveJson(kind === "unsafe" ? "unsafeFilters" : kind === "materials" ? "materialFilters" : "workPrepFilters", target);
      if (kind === "unsafe") state.unsafeDetailId = "";
      if (kind === "materials") state.materialDetailId = "";
      if (kind === "workPrep") state.workPrepDetailId = "";
      state.manageMobileFilterOpen = false;
      state.manageMobileFilterDraft = null;
      renderPreservingScroll();
    }

    function renderManage() {
      const tabs = [
        ["workers", "작업자"],
        ["push", "푸시"],
        ["unsafe", "불안전요소"],
        ["materials", "자재누락"],
        ["workPrep", "작업지시서"],
      ];
      const previewAdmin = isRedesignPreviewPage();
      const readOnlyTabs = new Set(["unsafe", "materials"]);
      if (!state.adminMode && !previewAdmin && !readOnlyTabs.has(state.manageTab)) state.manageTab = "unsafe";
      const readOnlyList = !state.adminMode && readOnlyTabs.has(state.manageTab);
      if (!state.adminMode && !previewAdmin && !readOnlyList) {
        return pageHead("관리", "관리자 모드에서 사용할 수 있습니다.", adminToggleButton())
        + `<div class="notice danger">관리자만 사용할 수 있는 기능입니다.</div>`;
      }
      const visibleTabs = state.adminMode || previewAdmin ? tabs : tabs.filter(([id]) => readOnlyTabs.has(id));
      const unsafeOpen = state.unsafeIssues.filter((row) => row.status !== ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2]).length;
      const materialOpen = state.missingMaterials.filter((row) => row.status !== ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2]).length;
      const tabCounts = {
        workers: state.workers.length,
        push: adminPushSubscribedWorkers().length,
        unsafe: unsafeOpen,
        materials: materialOpen,
        workPrep: state.workPrepRecords.length,
      };
      const lead = state.adminMode || previewAdmin ? "작업자와 접수 기록을 관리합니다." : "접수 현황을 확인합니다.";
      const mobileReadOnly = isMobileManageReadOnly();
      return DASHBOARD_VIEW.renderManageShellView({
        pageHeadHtml: pageHead("관리", lead, adminToggleButton()),
        readOnlyNoticeHtml: state.adminMode || previewAdmin ? "" : `<div class="notice" style="margin-bottom:12px">목록은 볼 수 있고, 상태 변경과 삭제는 관리자 모드에서 사용할 수 있습니다.</div>`,
        mobileReadOnly,
        mobileToolbarHtml: mobileReadOnly ? renderManageMobileToolbar() : "",
        mobileFilterSheetHtml: mobileReadOnly ? renderManageMobileFilterSheet() : "",
        tabs: visibleTabs.map(([id, label]) => ({
          id,
          label,
          count: tabCounts[id],
          active: state.manageTab === id,
        })),
        activeTab: state.manageTab,
        panels: {
          workers: state.manageTab === "workers" ? renderWorkerManager() : "",
          push: state.manageTab === "push" ? renderPushManager() : "",
          unsafe: state.manageTab === "unsafe" ? renderUnsafeManager() : "",
          materials: state.manageTab === "materials" ? renderMaterialManager() : "",
          workPrep: state.manageTab === "workPrep" ? renderWorkPrepManager() : "",
        },
      });
    }

    function renderWorkPrepManager() {
      if (state.workPrepRegisterOpen) return renderWorkPrepRegister();
      const canEdit = canOpenWorkPrepRegister() || isRedesignPreviewPage();
      const filters = state.workPrepFilters;
      const filtered = filterWorkPrepRecords(state.workPrepRecords, filters);
      const records = sortWorkPrepAdminRecords(filtered, filters.sort);
      const filterPanelRows = filterWorkPrepRecords(state.workPrepRecords, { ...filters, shipNo: "" });
      const shipGroups = groupWorkPrepRecordsByShip(sortWorkPrepAdminRecords(filterPanelRows, "shipNo"));
      const preparing = state.workPrepRecords.filter((row) => normalizeWorkPrepStatus(row.status) === "preparing").length;
      const confirmed = state.workPrepRecords.filter((row) => normalizeWorkPrepStatus(row.status) === "confirmed").length;
      const ordered = state.workPrepRecords.filter((row) => normalizeWorkPrepStatus(row.status) === "ordered").length;
      const used = state.workPrepRecords.filter((row) => normalizeWorkPrepStatus(row.status) === "used").length;
      const activeId = records.some((row) => row.id === state.workPrepDetailId) ? state.workPrepDetailId : "";
      return SCREEN_VIEWS.renderWorkPrepManagerView({
        totalCount: state.workPrepRecords.length,
        progressCount: confirmed + ordered,
        usedCount: used,
        canEdit,
        kpiHtml: [
          workPrepKpi("전체", state.workPrepRecords.length, "건", "#0b1d3a", ""),
          workPrepKpi("준비", preparing, "건", "#d97706", "preparing"),
          workPrepKpi("지시", ordered, "건", "#2E5DA6", "ordered"),
          workPrepKpi("진행", confirmed, "건", "#0f766e", "confirmed"),
          workPrepKpi("완료", used, "건", "#64748b", "used"),
        ].join("\n          "),
        allShipsActive: !filters.shipNo,
        filterPanelCount: filterPanelRows.length,
        shipGroups: shipGroups.map((group) => ({
          shipNo: group.shipNo,
          active: filters.shipNo === group.shipNo,
          progressText: workPrepGroupProgressText(group),
          count: group.records.length,
        })),
        filteredCount: filtered.length,
        rowsHtml: records.map((row) => {
          const active = row.id === activeId;
          return `${renderWorkPrepAdminRow(row, active)}${active ? renderWorkPrepInlineDetail(row) : ""}`;
        }).join(""),
      });
    }

    function workPrepKpi(label, value, unit, color, status) {
      const active = (state.workPrepFilters.status || "") === status;
      return `<button class="material-kpi work-prep-kpi ${active ? "active" : ""}" style="--kpi:${esc(color)}" data-record-filter="workPrep:status" value="${esc(status)}" type="button" aria-pressed="${active ? "true" : "false"}">
        <span>${esc(label)}</span>
        <strong>${esc(value)}</strong><em>${esc(unit)}</em>
      </button>`;
    }

    function filterWorkPrepRecords(records, filters = {}) {
      return (Array.isArray(records) ? records : []).filter((record) => {
        if (filters.shipNo && !sameShipNo(record.shipNo, filters.shipNo)) return false;
        if (filters.status && normalizeWorkPrepStatus(record.status) !== filters.status) return false;
        return true;
      });
    }

    function sortWorkPrepAdminRecords(records = [], sort = "latest") {
      return [...records].sort((a, b) => {
        if (sort === "status") {
          const statusDiff = (WORK_PREP_STATUS_ORDER[normalizeWorkPrepStatus(a.status)] || 99) - (WORK_PREP_STATUS_ORDER[normalizeWorkPrepStatus(b.status)] || 99);
          if (statusDiff) return statusDiff;
        }
        if (sort === "shipNo") {
          const shipDiff = String(a.shipNo || "").localeCompare(String(b.shipNo || ""), "ko");
          if (shipDiff) return shipDiff;
        }
        const dateDiff = String(b.workDate || "").localeCompare(String(a.workDate || ""));
        if (dateDiff) return dateDiff;
        return String(a.shipNo || "").localeCompare(String(b.shipNo || ""), "ko");
      });
    }

    function groupWorkPrepRecordsByShip(records = []) {
      const groups = new Map();
      records.forEach((record) => {
        const shipNo = record.shipNo || "-";
        if (!groups.has(shipNo)) groups.set(shipNo, { shipNo, records: [] });
        groups.get(shipNo).records.push(record);
      });
      return [...groups.values()];
    }

    function workPrepGroupProgressText(group) {
      const done = group.records.filter((record) => normalizeWorkPrepStatus(record.status) === "used").length;
      return `완료 ${done}/${group.records.length}`;
    }

    function workPrepParticipantNameSummary(record) {
      const ids = [
        ...(Array.isArray(record.workerIds) ? record.workerIds : []),
        ...(Array.isArray(record.otherTeamWorkerIds) ? record.otherTeamWorkerIds : []),
      ].filter((id) => id && id !== record.leaderWorkerId);
      const names = [...new Set(ids)]
        .map((id) => state.workers.find((worker) => worker.id === id)?.name || "")
        .filter(Boolean);
      if (!names.length) return "-";
      const visible = names.slice(0, 2).join(" · ");
      return names.length > 2 ? `${visible} 외 ${names.length - 2}명` : visible;
    }

    function renderWorkPrepAdminRow(record, active = false) {
      const category = categoryById(record.categoryId);
      const leader = state.workers.find((worker) => worker.id === record.leaderWorkerId);
      const progressInfo = workPrepSubmissionProgress(record);
      const participantCount = workPrepParticipantWorkerIds(record).length;
      const status = normalizeWorkPrepStatus(record.status);
      const sync = workPrepSyncPresentation(record);
      const canEdit = state.adminMode || isRedesignPreviewPage();
      return SCREEN_VIEWS.renderWorkPrepAdminRowView({
        status,
        active,
        recordId: record.id,
        ariaLabel: `${record.shipNo || "-"} 작업지시서 상세 보기`,
        typeIconHtml: renderWorkPrepTypeIcon(category, "work-prep-admin-type-icon"),
        shipNo: record.shipNo || "-",
        categoryLabel: category ? workLabel(category) : "작업 유형 없음",
        leaderName: leader?.name || "미정",
        leaderBadgeHtml: workerBadgeRow(leader || { team: record.team, position: LEADER_WORKER_POSITION }),
        participantNames: workPrepParticipantNameSummary(record),
        progressDone: progressInfo.done,
        progressTotal: progressInfo.total || participantCount,
        toolCount: sanitizeToolIds(record.toolIds).length,
        team: record.team || "-",
        dateLabel: shortDate(record.workDate || record.createdAt),
        appearanceMeta: workPrepAppearanceMeta(record),
        syncState: sync.state,
        syncLabel: sync.label,
        syncDetail: sync.detail,
        statusControlHtml: renderWorkPrepStatusControl(record, canEdit),
        canEdit,
        deleteAriaLabel: `${record.shipNo || "-"} 작업지시서 삭제`,
        timelineSummaryHtml: renderWorkPrepAdminTimelineSummary(record),
      });
    }

    function renderWorkPrepAdminTimelineSummary(record) {
      const timeline = buildWorkPrepTimeline(record).slice(0, 2);
      if (!timeline.length) return "";
      return `<div class="work-prep-admin-timeline" aria-label="작업지시서 상태 타임라인">
        <span>타임라인</span>
        ${timeline.map((entry) => `<em>${esc(formatDateTime(entry.changedAt))} · ${esc(entry.actor || "관리자")} · ${esc(entry.status || "")}</em>`).join("")}
      </div>`;
    }

    function renderWorkPrepStatusControl(record, canEdit) {
      const status = normalizeWorkPrepStatus(record.status);
      const label = WORK_PREP_STATUS_LABELS[status] || status;
      if (!canEdit) return statusChip(label);
      return SCREEN_VIEWS.renderWorkPrepStatusControlView({
        status,
        recordId: record.id,
        ariaLabel: `${record.shipNo || "-"} 작업지시서 상태 변경`,
        options: workPrepStatusOptions().map((option) => ({
          value: option,
          label: WORK_PREP_STATUS_LABELS[option] || option,
          selected: option === status,
        })),
      });
    }

    function renderWorkPrepInlineDetail(record) {
      return `<article class="work-prep-inline-detail" aria-label="${esc(record.shipNo || "")} 작업지시서 상세">
        ${renderWorkPrepDetail(record)}
      </article>`;
    }

    function renderWorkPrepDetail(record) {
      const category = categoryById(record.categoryId);
      const leader = state.workers.find((worker) => worker.id === record.leaderWorkerId);
      const progressInfo = workPrepSubmissionProgress(record);
      const participantIds = workPrepParticipantWorkerIds(record).filter((id) => id !== record.leaderWorkerId);
      const participantNames = participantIds
        .map((id) => state.workers.find((worker) => worker.id === id)?.name || "")
        .filter(Boolean);
      const submittedNames = progressInfo.submittedIds
        .map((id) => state.workers.find((worker) => worker.id === id)?.name || "")
        .filter(Boolean);
      const toolNames = sanitizeToolIds(record.toolIds)
        .map((id) => {
          const tool = toolById(id);
          return tool?.label || tool?.name || "";
        })
        .filter(Boolean);
      const status = normalizeWorkPrepStatus(record.status);
      const canEdit = state.adminMode || isRedesignPreviewPage();
      const total = progressInfo.total || workPrepParticipantWorkerIds(record).length;
      const progressPercent = total ? Math.round(progressInfo.done / total * 100) : 0;
      const statusLabel = WORK_PREP_STATUS_LABELS[status] || status;
      return SCREEN_VIEWS.renderWorkPrepDetailView({
        shipNo: record.shipNo || "-",
        categoryLabel: category ? workLabel(category) : "작업 유형 없음",
        metaLine: [record.team || "-", shortDate(record.workDate || record.createdAt), workPrepAppearanceMeta(record)].filter(Boolean).join(" · "),
        statusChipHtml: statusChip(statusLabel),
        progressDone: progressInfo.done,
        progressTotal: total || 0,
        progressPercent,
        progressNote: submittedNames.length ? `완료: ${submittedNames.join(" · ")}` : "아직 완료한 작업자가 없습니다.",
        leaderName: leader?.name || "미정",
        participantLine: participantNames.length ? participantNames.join(" · ") : "참여 작업자 없음",
        toolBadgesHtml: renderWorkPrepToolBadges(toolNames),
        timelineHtml: renderWorkPrepTimeline(record),
        createdAtLabel: formatDateTime(record.createdAt || record.updatedAt || ""),
        canEdit,
        recordId: record.id,
      });
    }

    function renderWorkPrepTimeline(record) {
      const timeline = buildWorkPrepTimeline(record);
      if (!timeline.length) return "";
      return SCREEN_VIEWS.renderWorkPrepTimelineView({
        entries: timeline.map((entry) => ({
          changedAt: entry.changedAt,
          changedAtLabel: formatDateTime(entry.changedAt),
          statusBadgeHtml: statusBadge(entry.status),
          actor: workPrepTimelineActorText(entry),
          memo: entry.memo,
        })),
      });
    }

    function renderWorkPrepToolBadges(toolNames) {
      const names = Array.isArray(toolNames) ? toolNames.filter(Boolean) : [];
      if (!names.length) return `<div class="work-prep-tool-badges muted">선택된 공기구/준비물이 없습니다.</div>`;
      return `<div class="work-prep-tool-badges">${names.map((name) => `<span class="work-prep-tool-badge">${esc(name)}</span>`).join("")}</div>`;
    }

    function renderWorkerManager() {
      const workers = sortWorkersForLogin(state.workers);
      return SCREEN_VIEWS.renderWorkerManagerView({
        count: state.workers.length,
        teamOptionsHtml: renderWorkerTeamOptions(""),
        positionOptionsHtml: renderWorkerPositionOptions(DEFAULT_WORKER_POSITION),
        rows: workers.map(workerRowModel),
      });
    }

    function workerRowModel(worker) {
      const expanded = state.workerEditCardId === worker.id;
      return {
        id: worker.id,
        name: worker.name,
        teamLine: worker.team || "팀 성격 미지정",
        expanded,
        canEditPush: Boolean(state.adminMode),
        badgesHtml: `${workerTeamBadge(worker.team)}\n          ${workerRoleBadge(worker)}\n          ${workerPushSubscriptionBadgeHtml(worker.id)}`,
        editPanelHtml: expanded ? renderWorkerEditPanel(worker) : "",
      };
    }

    function adminPushWorkers() {
      return state.workers
        .filter((worker) => worker && worker.deleted !== true && worker.id)
        .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    }

    function adminPushSubscribedWorkers() {
      return adminPushWorkers().filter((worker) => Number(workerPushSubscriptionStatusFor(worker.id).subscriptionCount || 0) > 0);
    }

    function adminPushTargetWorkers() {
      const selected = new Set(normalizeAdminPushWorkerIds(state.adminPushDraft.selectedWorkerIds));
      return adminPushWorkers().filter((worker) => selected.has(worker.id));
    }

    function adminPushNotificationPreview() {
      const draft = createAdminPushDraft(state.adminPushDraft);
      const style = adminPushStyleMeta(draft.style);
      const context = {
        날짜: today().replace(/-/g, "."),
        발신자: currentWorkerSessionWorker()?.name || "관리자",
        대상수: adminPushTargetWorkers().length,
      };
      const title = replacePushTemplateTokens(draft.title, context).trim() || DEFAULT_PUSH_NOTIFICATION_TEMPLATES.adminManual.title;
      const body = replacePushTemplateTokens(draft.body, context).trim() || DEFAULT_PUSH_NOTIFICATION_TEMPLATES.adminManual.body;
      return {
        title: title.startsWith(style.titlePrefix) ? title : `${style.titlePrefix}${title}`,
        body,
        url: draft.url || "/index.html",
        style,
      };
    }

    function renderPushManager() {
      if (isMobileManageReadOnly()) {
        return `<section class="panel panel-pad manage-mobile-notify-panel">
          <div class="section-title">담당자 알림</div>
          <p>모바일에서는 대상과 발송 이력을 조회합니다. 알림 문구 작성·대상 변경·최종 발송은 PC의 확인 절차에서 진행합니다.</p>
          <button class="btn" data-action="manage-mobile-notify" type="button">담당자에게 알림 보내기</button>
        </section>`;
      }
      const workers = adminPushWorkers();
      const subscribedWorkers = adminPushSubscribedWorkers();
      const targetWorkers = adminPushTargetWorkers();
      const draft = createAdminPushDraft(state.adminPushDraft);
      const preview = adminPushNotificationPreview();
      const canSend = state.adminMode && canSendPledgeNotifications() && targetWorkers.length > 0 && draft.title.trim() && draft.body.trim() && !state.adminPushSending;
      const disabledReason = !state.adminMode
        ? "관리자만 사용할 수 있는 기능입니다."
        : !canSendPledgeNotifications()
          ? "조장, 관리, 총무 작업자 로그인에서 발송할 수 있습니다."
          : !targetWorkers.length
            ? "발송 대상 작업자를 선택하세요."
            : !draft.title.trim() || !draft.body.trim()
              ? "제목과 내용을 입력하세요."
              : "";
      return SCREEN_VIEWS.renderPushManagerView({
        subscribedCount: subscribedWorkers.length,
        workerCount: workers.length,
        statusesChecking: state.workerPushSubscriptionStatusesChecking,
        draft,
        styles: ADMIN_PUSH_STYLES,
        preview,
        targetCount: targetWorkers.length,
        canSend,
        disabledReason,
        sendButtonLabel: state.adminPushSending ? "발송중" : "즉시발송",
        workersHtml: workers.length ? workers.map((worker) => renderPushTargetWorker(worker, draft)).join("") : "",
      });
    }

    function renderPushTargetWorker(worker, draft) {
      const status = workerPushSubscriptionStatusFor(worker.id);
      const count = Number(status.subscriptionCount || 0);
      const checked = normalizeAdminPushWorkerIds(draft.selectedWorkerIds).includes(worker.id);
      return SCREEN_VIEWS.renderPushTargetWorkerView({
        id: worker.id,
        name: worker.name,
        team: worker.team || "소속 없음",
        position: workerDisplayPosition(worker),
        count,
        checked,
        badgeHtml: workerPushSubscriptionBadgeHtml(worker.id),
      });
    }

    function renderWorkerPositionOptions(selectedPosition) {
      const selected = normalizeWorkerPosition(selectedPosition);
      return WORKER_POSITIONS.map((position) => `<option value="${esc(position)}" ${position === selected ? "selected" : ""}>${esc(position)}</option>`).join("");
    }

    function normalizeWorkerTeam(team) {
      if (typeof WORKER_HELPERS.normalizeWorkerTeam === "function") {
        return WORKER_HELPERS.normalizeWorkerTeam(team);
      }
      const value = String(team || "").trim();
      return WORKER_TEAM_OPTIONS.includes(value) ? value : "";
    }

    function renderWorkerTeamOptions(selectedTeam) {
      const selected = normalizeWorkerTeam(selectedTeam);
      return `<option value="" ${selected ? "" : "selected"}>팀 성격 선택</option>${WORKER_TEAM_OPTIONS.map((team) => `<option value="${esc(team)}" ${team === selected ? "selected" : ""}>${esc(team)}</option>`).join("")}`;
    }

    function workerPushSubscriptionBadgeMeta(workerId) {
      return PUSH_RULES.workerPushSubscriptionBadgeMeta(workerPushSubscriptionStatusFor(workerId), Boolean(state.workerPushSubscriptionStatusesChecking));
    }

    function workerPushSubscriptionBadgeHtml(workerId) {
      const meta = workerPushSubscriptionBadgeMeta(workerId);
      return `<span class="worker-push-badge ${esc(meta.className)}" data-worker-push-badge="${esc(workerId)}" title="${esc(meta.title)}">${esc(meta.text)}</span>`;
    }

    function renderWorkerPushSubscriptionStatusBadges() {
      document.querySelectorAll("[data-worker-push-badge]").forEach((node) => {
        const workerId = node.dataset.workerPushBadge || "";
        const meta = workerPushSubscriptionBadgeMeta(workerId);
        node.className = `worker-push-badge ${meta.className}`;
        node.title = meta.title;
        node.textContent = meta.text;
      });
    }

    function workerPushDeviceBrowserLabel(userAgent) {
      return PUSH_RULES.workerPushDeviceBrowserLabel(userAgent);
    }

    function workerPushDevicePlatformLabel(userAgent) {
      return PUSH_RULES.workerPushDevicePlatformLabel(userAgent);
    }

    function renderWorkerPushDeviceRow(device) {
      const saving = state.workerPushDeviceSavingId === device.id;
      return SCREEN_VIEWS.renderWorkerPushDeviceRowView({
        id: device.id,
        enabled: device.enabled,
        saving,
        deviceLabel: device.deviceLabel,
        deviceMeta: `${workerPushDevicePlatformLabel(device.userAgent)} · ${workerPushDeviceBrowserLabel(device.userAgent)}`,
        lastSeen: formatDateTime(device.lastSeenAt),
        lastSentAt: device.lastSentAt,
        lastSent: formatDateTime(device.lastSentAt),
        lastError: device.lastError,
      });
    }

    function renderWorkerPushDeviceManager() {
      const worker = currentWorkerPushDeviceWorker();
      if (!worker) return "";
      const loading = Boolean(state.workerPushDeviceLoading);
      const devices = Array.isArray(state.workerPushDevices) ? state.workerPushDevices : [];
      const enabledCount = devices.filter((device) => device.enabled !== false).length;
      return SCREEN_VIEWS.renderWorkerPushDeviceManagerView({
        workerName: worker.name,
        deviceCount: devices.length,
        enabledCount,
        loading,
        rowsHtml: devices.map(renderWorkerPushDeviceRow).join(""),
      });
    }

    function workerFieldId(worker, field) {
      return `worker_${String(worker.id || "").replace(/[^a-zA-Z0-9_-]/g, "_")}_${field}`;
    }

    function renderWorkerEditPanel(worker) {
      const currentWorker = state.workerSession?.workerId === worker.id;
      const deleting = state.workerDeleteSubmittingId === worker.id;
      return `<div class="worker-edit-panel">
        <div class="worker-edit-grid">
          <div class="field">
            <label for="${esc(workerFieldId(worker, "name"))}">이름</label>
            <input class="input" id="${esc(workerFieldId(worker, "name"))}" data-worker-edit="${esc(worker.id)}" data-worker-edit-field="name" value="${esc(worker.name)}" />
          </div>
          <div class="field">
            <label for="${esc(workerFieldId(worker, "team"))}">팀 성격</label>
            <select class="select" id="${esc(workerFieldId(worker, "team"))}" data-worker-edit="${esc(worker.id)}" data-worker-edit-field="team">
              ${renderWorkerTeamOptions(worker.team)}
            </select>
          </div>
          <div class="field">
            <label for="${esc(workerFieldId(worker, "position"))}">배지</label>
            <select class="select" id="${esc(workerFieldId(worker, "position"))}" data-worker-edit="${esc(worker.id)}" data-worker-edit-field="position">
              ${renderWorkerPositionOptions(worker.position)}
            </select>
          </div>
          <label class="check-row worker-push-target-field" for="${esc(workerFieldId(worker, "unsafePushTarget"))}">
            <input type="checkbox" id="${esc(workerFieldId(worker, "unsafePushTarget"))}" data-worker-edit="${esc(worker.id)}" data-worker-edit-field="unsafePushTarget" ${worker.unsafePushTarget ? "checked" : ""} />
            <span>불안전·누락자재 알림 대상</span>
          </label>
        </div>
        <p class="small muted worker-security-note">사번/비밀번호 변경은 보안 전환 중 서버 관리 경로로 이동합니다.</p>
        <div class="worker-edit-actions">
          <button class="btn" data-save-worker="${esc(worker.id)}" type="button">수정</button>
          <button class="btn-danger" data-delete-worker="${esc(worker.id)}" ${currentWorker || deleting ? "disabled" : ""} type="button" title="${currentWorker ? "현재 로그인한 본인은 삭제할 수 없습니다." : ""}">${deleting ? "삭제 중" : "삭제"}</button>
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
      const filtered = ISSUE_MATERIAL_RULES.filterRecords(state.unsafeIssues, state.unsafeFilters);
      const sorted = ISSUE_MATERIAL_RULES.sortRecords(filtered, state.unsafeFilters.sort, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES);
      const openCount = state.unsafeIssues.filter((row) => row.status !== ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2]).length;
      const activeId = sorted.some((row) => row.id === state.unsafeDetailId) ? state.unsafeDetailId : "";
      return SCREEN_VIEWS.renderUnsafeManagerView({
        totalCount: state.unsafeIssues.length,
        openCount,
        adminMode: Boolean(state.adminMode),
        shipFilterNoticeHtml: state.unsafeFilters.shipNo ? renderShipFilterNotice("unsafe", state.unsafeFilters.shipNo) : "",
        rowsHtml: sorted.length ? sorted.map((row) => {
          const active = row.id === activeId;
          return `${renderUnsafeQueueItem(row, active)}${active ? renderUnsafeInlineDetail(row) : ""}`;
        }).join("") : "",
      });
    }

    function renderUnsafeQueueItem(row, active) {
      const pendingPhotoCount = pendingPhotoUploadsFor(row.id).length;
      return `<button class="unsafe-list-row ${active ? "active" : ""}" data-unsafe-record-detail="${esc(row.id)}" type="button">
        <span><strong>${esc(row.shipNo || "-")}</strong><em>${esc(relativeRecordTime(row.createdAt))}</em></span>
        <span><strong>${esc(shortUnsafeTitle(row.content))}</strong><em>${esc(row.workerNameSnapshot || "-")} · ${esc(shipStageForNo(row.shipNo))}${pendingPhotoCount ? ` · 사진 업로드 대기 ${pendingPhotoCount}장` : ""}</em></span>
        ${statusChip(row.status)}
      </button>`;
    }

    function renderUnsafeInlineDetail(row) {
      return `<article class="unsafe-inline-detail" aria-label="${esc(row.shipNo || "")} 불안전요소 상세">
        ${renderUnsafeProcessingDetail(row)}
      </article>`;
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
      const label = `사진${index + 1}`;
      return `<figure class="unsafe-photo-slot ${url ? "has-photo" : "no-photo"}" ${url ? `data-photo-viewer-src="${esc(url)}" data-photo-viewer-label="${esc(label)}" role="button" tabindex="0" aria-label="${esc(label)} 확대 보기"` : ""}>
        <span class="unsafe-photo-label">${esc(label)}</span>
        ${url ? `<img src="${esc(url)}" alt="현장 사진 ${index + 1}" />` : `<div><strong>사진 없음</strong><span>첨부된 현장 사진이 없습니다</span></div>`}
      </figure>`;
    }

    function renderPhotoViewer() {
      const viewer = state.photoViewer;
      if (!viewer || !viewer.src) return "";
      const label = viewer.label || "현장 사진";
      return `<div class="photo-viewer-overlay" role="dialog" aria-modal="true" aria-label="${esc(label)} 확대 보기">
        <button class="photo-viewer-backdrop" data-photo-viewer-close type="button" aria-label="사진 닫기"></button>
        <figure class="photo-viewer-frame">
          <button class="photo-viewer-close" data-photo-viewer-close type="button" aria-label="사진 닫기">닫기</button>
          <img src="${esc(viewer.src)}" alt="${esc(label)} 원본" />
          <figcaption>${esc(label)}</figcaption>
        </figure>
      </div>`;
    }

    function renderPushTemplateEditor() {
      const kind = normalizePushTemplateKind(state.pushTemplateEditorKind);
      if (!kind) return "";
      const meta = pushTemplateMeta(kind);
      const template = pushNotificationTemplate(kind);
      const preview = pushNotificationFromTemplate(kind, meta?.previewContext || {});
      return SCREEN_VIEWS.renderPushTemplateEditorView({
        heading: meta?.heading || "",
        description: meta?.description || "",
        tokens: meta?.tokens || [],
        title: template.title,
        body: template.body,
        previewTitle: preview.title,
        previewBody: preview.body,
      });
    }

    function pendingPhotoUploadsFor(issueId) {
      const workerId = String(state.workerSession?.workerId || "");
      return state.pendingPhotoUploads.filter((row) => (
        row.issueId === issueId
        && workerId
        && row.ownerWorkerId === workerId
      ));
    }

    function isUnsafePhotoUploading(issueId) {
      return (state.unsafePhotoUploadingIds || []).includes(issueId);
    }

    function markUnsafePhotoUploading(issueId, uploading) {
      if (!issueId) return;
      const ids = new Set(state.unsafePhotoUploadingIds || []);
      if (uploading) ids.add(issueId);
      else ids.delete(issueId);
      state.unsafePhotoUploadingIds = [...ids];
    }

    function renderPhotoUploadProgressPanel(count = 0) {
      return `<div class="photo-retry-panel photo-upload-progress" role="status" aria-live="polite">
        <div>
          <strong>사진 업로드 중</strong>
          <span>${Number(count || 0)}장 · 완료되면 자동으로 사진 수가 갱신됩니다.</span>
        </div>
      </div>`;
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
        <div class="photo-retry-actions">
          <button class="btn-light" data-action="retry-photo-upload" data-retry-photo-upload="${esc(issueId)}" ${retryable ? "" : "disabled"} type="button">재시도</button>
          <label class="btn-light photo-retry-file" for="retryPhoto_${esc(issueId)}">사진 다시 선택</label>
          <input class="photo-retry-input" id="retryPhoto_${esc(issueId)}" data-retry-photo-file="${esc(issueId)}" type="file" accept="image/*" multiple />
        </div>
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
      const canEdit = state.adminMode || isRedesignPreviewPage();
      const filtered = ISSUE_MATERIAL_RULES.filterRecords(state.missingMaterials, state.materialFilters);
      const sorted = ISSUE_MATERIAL_RULES.sortRecords(filtered, state.materialFilters.sort, ISSUE_MATERIAL_RULES.MATERIAL_STATUSES);
      const filterPanelRows = ISSUE_MATERIAL_RULES.filterRecords(state.missingMaterials, { ...state.materialFilters, shipNo: "" });
      const filterGroups = ISSUE_MATERIAL_RULES.groupMaterialsByShip(ISSUE_MATERIAL_RULES.sortRecords(filterPanelRows, "shipNo", ISSUE_MATERIAL_RULES.MATERIAL_STATUSES));
      const statuses = ISSUE_MATERIAL_RULES.MATERIAL_STATUSES;
      const received = state.missingMaterials.filter((row) => row.status === statuses[0]).length;
      const checking = state.missingMaterials.filter((row) => row.status === statuses[1]).length;
      const done = state.missingMaterials.filter((row) => row.status === statuses[2]).length;
      const activeId = sorted.some((row) => row.id === state.materialDetailId) ? state.materialDetailId : "";
      const filterPanelHtml = `<button class="material-ship-filter ${state.materialFilters.shipNo ? "" : "active"}" data-record-filter="materials:shipNo" value="" type="button">
              <span>전체 호선</span><strong>${filterPanelRows.length}</strong>
            </button>
            ${filterGroups.map((group) => `<button class="material-ship-filter ${state.materialFilters.shipNo === group.shipNo ? "active" : ""}" data-record-filter="materials:shipNo" value="${esc(group.shipNo)}" type="button">
              <span><strong>${esc(group.shipNo)}</strong><em>${esc(shipStageForNo(group.shipNo))} · ${materialProgressForGroup(group)}%</em></span><strong>${group.records.length}</strong>
            </button>`).join("")}`;
      return SCREEN_VIEWS.renderMaterialManagerView({
        totalCount: state.missingMaterials.length,
        checkingCount: checking,
        doneCount: done,
        adminMode: Boolean(state.adminMode),
        canEdit,
        kpiHtml: [
          materialKpi("전체", state.missingMaterials.length, "건", "#0b1d3a", ""),
          materialKpi("접수", received, "건", "#dc2626", statuses[0]),
          materialKpi("확인중", checking, "건", "#d97706", statuses[1]),
          materialKpi("완료", done, "건", "#3F7A50", statuses[2]),
        ].join(""),
        shipFilterNoticeHtml: state.materialFilters.shipNo ? renderShipFilterNotice("materials", state.materialFilters.shipNo) : "",
        filterPanelHtml,
        visibleCount: filtered.length,
        sortValue: state.materialFilters.sort === "latest" ? "status" : "latest",
        sortLabel: state.materialFilters.sort === "latest" ? "상태순" : "최신순",
        rowsHtml: sorted.length ? sorted.map((row) => {
          const active = row.id === activeId;
          return `${renderMaterialTableRow(row, active)}${active ? renderMaterialInlineDetail(row) : ""}`;
        }).join("") : "",
      });
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

    function renderMaterialTableRow(row, active = false) {
      const token = `materials:${row.id}`;
      const canEdit = state.adminMode || isRedesignPreviewPage();
      return `<div class="material-row ${active ? "active" : ""}" data-material-record-detail="${esc(row.id)}" role="button" tabindex="0" aria-label="${esc(`${row.shipNo || "-"} ${row.materialName || "자재누락"} 상세 보기`)}">
        <span><input type="checkbox" aria-label="자재 기록 선택" ${canEdit ? "" : "disabled"} /></span>
        <span><strong>${esc(row.shipNo || "-")}</strong><em>${esc(shipStageForNo(row.shipNo))}</em></span>
        <span><strong>${esc(row.materialName || "-")}</strong><em>${esc(row.content || "내용 없음")}</em></span>
        <span><strong>${esc(materialQuantity(row))}</strong></span>
        <span>${esc(row.workerNameSnapshot || "-")}</span>
        <span>${esc(shortRecordTime(row.createdAt))}</span>
        <span>${active ? statusChip(row.status) : `<select class="select" data-record-status="${esc(token)}" ${canEdit ? "" : "disabled"}>${ISSUE_MATERIAL_RULES.MATERIAL_STATUSES.map((status) => `<option value="${esc(status)}" ${row.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}</select>`}</span>
        <span class="material-row-actions">${active ? "" : `
          <textarea data-record-memo="${esc(token)}" hidden>${esc(row.adminMemo || "")}</textarea>
          <button class="btn-light" data-save-record="${esc(token)}" ${canEdit ? "" : "disabled"} type="button">저장</button>
        `}</span>
      </div>`;
    }

    function renderMaterialInlineDetail(row) {
      return `<article class="material-inline-detail" aria-label="${esc(row.shipNo || "")} 자재누락 상세">
        ${renderMaterialProcessingDetail(row)}
      </article>`;
    }

    function renderMaterialProcessingDetail(row) {
      return DASHBOARD_VIEW.renderMaterialDetailView({
        statusBadgeHtml: badge("medium", row.status),
        shipNo: row.shipNo,
        materialName: row.materialName,
        quantityText: materialQuantity(row),
        workerName: row.workerNameSnapshot,
        createdAtText: formatDateTime(row.createdAt),
        content: row.content,
        adminMemo: row.adminMemo,
        timelineHtml: renderRecordTimeline(row, { initialStatus: ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[0] }),
        adminControlsHtml: renderAdminRecordControls("materials", row, ISSUE_MATERIAL_RULES.MATERIAL_STATUSES),
      });
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

    // 분석/서약 화면용 결합 점검 목록: 최근 목록(state.inspections) + 기간 캐시(state.archivedInspections).
    // 기간 캐시는 읽기 전용이라 동기화(pullRemote)의 본 목록 갱신과 충돌하지 않는다.
    function combinedInspectionRows() {
      const archived = Array.isArray(state.archivedInspections) ? state.archivedInspections : [];
      if (!archived.length) return state.inspections;
      return ANALYTICS_MODEL.combineInspectionRows(state.inspections, archived);
    }

    function pledgeDashboardRows(date = today()) {
      const dateValue = dateOnly(date) || today();
      const dayInspections = combinedInspectionRows().filter((row) => row.date === dateValue);
      const byWorker = new Map();
      dayInspections.forEach((row) => {
        const name = row.worker || "미지정";
        if (!byWorker.has(name)) byWorker.set(name, row);
      });
      const workerRows = visiblePledgeAnalyticsWorkers().map((worker) => {
        const row = byWorker.get(worker.name);
        const done = Boolean(row && String(row.safetyPledge || "").trim());
        return {
          workerId: worker.id,
          name: worker.name,
          team: worker.team || "-",
          shipNo: row ? row.shipNo || "-" : "-",
          time: row ? row.time || "-" : "-",
          done,
          status: done ? "완료" : "미완료",
          pledge: row ? row.safetyPledge || "" : "",
        };
      });
      return workerRows;
    }

    function pledgeWeekStats(anchorDate = today()) {
      return Array.from({ length: 7 }, (_, index) => addDays(anchorDate, index - 6)).map((date) => {
        const rows = combinedInspectionRows().filter((row) => row.date === date && !hiddenPledgeAnalyticsWorkerName(row.worker));
        const total = Math.max(visiblePledgeAnalyticsWorkers().length, rows.length);
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

    function pledgeViewDate() {
      const todayValue = today();
      const value = dateOnly(state.pledgeViewDate);
      if (!value || value > todayValue) return todayValue;
      return value;
    }

    function setPledgeViewDate(mode, value = "") {
      const todayValue = today();
      const selected = pledgeViewDate();
      let nextDate = selected;
      if (mode === "today") nextDate = todayValue;
      if (mode === "prev") nextDate = addDays(selected, -1);
      if (mode === "next") nextDate = addDays(selected, 1) <= todayValue ? addDays(selected, 1) : selected;
      if (mode === "pick") {
        const picked = dateOnly(value);
        if (picked && picked > todayValue) toast("오늘 이후 날짜는 조회할 수 없습니다.");
        nextDate = picked && picked <= todayValue ? picked : selected;
      }
      state.pledgeViewDate = nextDate === todayValue ? "" : nextDate;
      render();
    }

    function renderPledgeManager() {
      const viewDate = pledgeViewDate();
      ensureInspectionRangeLoaded(addDays(viewDate, -6), viewDate);
      const isToday = viewDate === today();
      const rows = pledgeDashboardRows(viewDate);
      const completed = rows.filter((row) => pledgeRowStatus(row) === "완료").length;
      const pending = Math.max(rows.length - completed, 0);
      const rate = rows.length ? Math.round(completed / rows.length * 100) : 0;
      const week = pledgeWeekStats(viewDate);
      const weekTotal = week.reduce((sum, row) => sum + row.done, 0);
      const kpiHtml = [
        pledgeKpi(isToday ? "오늘 서약 완료" : "서약 완료", completed, "명", `전체 ${rows.length}명 중`, "done"),
        pledgeKpi("미완료", pending, "명", isToday ? "알림 발송 가능" : "지난 날짜 조회", "warn"),
        pledgeKpi("완료율", rate, "%", isToday ? "어제 대비 추적" : viewDate.replace(/-/g, ".") + " 기준", "rate"),
        pledgeKpi(isToday ? "이번 주 누적" : "주간 누적", weekTotal, "건", "일 평균 " + (Math.round(weekTotal / 7 * 10) / 10) + "건", "total"),
      ].join("");
      return SCREEN_VIEWS.renderPledgeManagerView({
        dateLabel: viewDate.replace(/-/g, "."),
        todayIso: today(),
        viewDate,
        isToday,
        maxDate: today(),
        rows: rows.map((row) => ({
          name: row.name,
          team: row.team,
          shipNo: row.shipNo,
          time: row.time,
          statusChipHtml: statusChip(pledgeRowStatus(row)),
        })),
        totalCount: rows.length,
        pendingCount: pending,
        kpiHtml,
        canNotifyPledge: canSendPledgeNotifications() && isToday,
        adminMode: state.adminMode,
        editing: Boolean(state.pledgeTemplateEditing),
        rules: pledgeRules(),
        weekBars: week.map((row) => ({ label: row.date.slice(5).replace("-", "/"), pct: row.pct })),
      });
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

    function renderCompletionScreen({ type = "", icon = "check", title, message, messageHtml = "", statusHtml = "", stats = [], actions = [] }) {
      const renderedMessage = messageHtml || esc(message || "");
      return `<section class="mobile-complete-screen ${esc(type)}">
        <div class="mobile-complete-visual">${completionIcon(icon)}</div>
        <h1>${esc(title)}</h1>
        <p>${renderedMessage}</p>
        ${statusHtml}
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

    function inspectionPendingSyncJobs(row) {
      if (!row?.id) return [];
      const inspectionId = String(row.id);
      const itemIds = new Set(state.inspectionItems
        .filter((item) => String(item.inspectionId || "") === inspectionId)
        .map((item) => String(item.id)));
      return normalizePendingSyncQueue(state.pendingSyncQueue).filter((job) => {
        if (job.type !== "rows") return false;
        const inspectionIds = (job.rowIdsByKey?.inspections || []).map(String);
        const inspectionItemIds = (job.rowIdsByKey?.inspectionItems || []).map(String);
        return inspectionIds.includes(inspectionId) || inspectionItemIds.some((id) => itemIds.has(id));
      });
    }

    function inspectionSyncPresentation(row) {
      if (!isSyncConfigured() || !window.supabase) {
        return {
          state: "offline",
          label: "기기에 저장됨",
          detail: "연결되면 서버로 자동 전송됩니다.",
        };
      }
      const jobs = inspectionPendingSyncJobs(row);
      if (!jobs.length) {
        return {
          state: "synced",
          label: "서버 반영 완료",
          detail: "관리자 화면에서도 바로 확인할 수 있습니다.",
        };
      }
      const failedJob = jobs.find((job) => job.status === "failed");
      if (failedJob) {
        return {
          state: "failed",
          label: "서버 반영 실패",
          detail: failedJob.lastError || "동기화 상세에서 다시 시도하거나 폐기할 수 있습니다.",
          jobId: failedJob.id,
        };
      }
      if (jobs.some((job) => Number(job.attempts || 0) > 0 || job.nextRetryAt)) {
        return {
          state: "retry",
          label: "서버 재전송 대기",
          detail: "기기에는 저장되었습니다. 연결이 회복되면 자동 재전송합니다.",
        };
      }
      return {
        state: "pending",
        label: "서버 반영 중",
        detail: "다른 화면으로 이동해도 자동으로 계속 전송합니다.",
      };
    }

    function renderInspectionSubmissionStatus(row) {
      const sync = inspectionSyncPresentation(row);
      return `<div class="inspection-submit-status state-${esc(sync.state)}" role="status" aria-live="polite" data-inspection-sync-state="${esc(sync.state)}">
        <div class="inspection-submit-status-row inspection-submit-status-local">
          <span class="inspection-submit-status-check" aria-hidden="true">✓</span>
          <span><strong>점검 완료</strong><small>홈과 점검 이력에 즉시 반영되었습니다.</small></span>
        </div>
        <div class="inspection-submit-status-row inspection-submit-status-server">
          <span class="inspection-submit-status-dot" aria-hidden="true"></span>
          <span><strong>${esc(sync.label)}</strong><small>${esc(sync.detail)}</small>
            ${sync.jobId ? `<button type="button" class="btn ghost small" data-retry-sync-job="${esc(sync.jobId)}">다시 시도</button>` : ""}
          </span>
        </div>
      </div>`;
    }

    function refreshVisiblePendingSyncStatus() {
      const inspectionVisible = state.view === "pledgeComplete" && state.lastInspectionId;
      const materialVisible = state.view === "materials" && state.lastMaterialId;
      const workPrepVisible = state.view === "manage"
        && state.manageTab === "workPrep"
        && !state.workPrepRegisterOpen;
      if (!inspectionVisible && !materialVisible && !workPrepVisible) return;
      renderPreservingScroll();
    }

    function renderPledgeComplete() {
      const row = state.inspections.find((item) => item.id === state.lastInspectionId) || state.inspections[0];
      if (!row) return `${pageHead("안전 서약 완료", "제출된 서약 정보가 없습니다.")}<button class="btn" data-view="dashboard" type="button">홈으로</button>`;
      const itemCount = state.inspectionItems.filter((item) => item.inspectionId === row.id).length;
      const checkedCount = state.inspectionItems.filter((item) => item.inspectionId === row.id && item.checked).length;
      const warnings = Number(row.warnings || 0);
      const pending = Math.max(Number(itemCount || 0) - checkedCount, 0);
      const completionMessage = `${row.shipNo || "-"} · ${row.categoryLabel || categoryById(row.categoryId)?.label || "작업"} 점검이 관리자에게 자동 보고됩니다.`;
      return renderCompletionScreen({
        type: "inspection",
        icon: "check",
        title: "점검이 제출되었습니다",
        message: completionMessage,
        messageHtml: `${esc(completionMessage)}${renderInspectionWorkPrepMiniCard(row, { compact: true })}`,
        statusHtml: renderInspectionSubmissionStatus(row),
        stats: [
          { value: checkedCount || 0, label: "완료", tone: "green" },
          { value: warnings, label: "NG", tone: warnings ? "pink" : "green" },
          { value: pending, label: "대기" },
        ],
        actions: [
          { label: "다른 점검", view: "check" },
          { label: "홈에서 완료 확인", view: "dashboard", primary: true },
        ],
      });
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
      visiblePledgeAnalyticsWorkers().forEach((worker) => {
        const name = String(worker.name || "").trim();
        if (!name) return;
        byName.set(normalizedWorkerName(name), { name, team: worker.team || "-", source: "workers" });
      });
      return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }

    function workerHasWorkPrepObligation(workerName, date) {
      const key = normalizedWorkerName(workerName);
      if (!key || !date) return false;
      const workerIds = new Set(state.workers
        .filter((worker) => normalizedWorkerName(worker.name || "") === key)
        .map((worker) => String(worker.id || "").trim())
        .filter(Boolean));
      if (!workerIds.size) return false;
      return state.workPrepRecords.some((record) =>
        String(record?.workDate || "") === date
        && workPrepParticipantWorkerIds(record).some((id) => workerIds.has(id)));
    }

    function workerDayInspectionStatus(workerName, date) {
      const key = normalizedWorkerName(workerName);
      const dayInspections = combinedInspectionRows().filter((row) => normalizedWorkerName(row.worker || "") === key && monthlyInspectionDate(row) === date);
      return ANALYTICS_MODEL.monthlyWorkerDayStatus({
        isRestDay: Boolean(isMonthlyRestDay(date)),
        isFuture: date > today(),
        dayInspections,
        hasObligation: workerHasWorkPrepObligation(workerName, date),
      });
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
      return {
        range,
        workers,
        totals,
        rate: totals.target ? Math.round(totals.done / totals.target * 100) : 0,
        dueLabel,
        dueMissing,
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

    function monthlyWorkerCardKey(worker) {
      return normalizedWorkerName(worker?.name || "");
    }

    function monthlyWorkerExpandedKeySet(workers = []) {
      if (Array.isArray(state.monthlyWorkerExpandedKeys)) return new Set(state.monthlyWorkerExpandedKeys.filter(Boolean));
      const firstWorker = workers[0] ? monthlyWorkerCardKey(workers[0]) : "";
      return new Set(firstWorker ? [firstWorker] : []);
    }

    function saveMonthlyWorkerExpandedKeys(keys) {
      state.monthlyWorkerExpandedKeys = [...new Set(keys.filter(Boolean))];
      saveJson("monthlyWorkerExpandedKeys", state.monthlyWorkerExpandedKeys);
    }

    function toggleMonthlyWorkerCard(key) {
      const normalizedKey = normalizedWorkerName(key || "");
      if (!normalizedKey) return;
      const expanded = monthlyWorkerExpandedKeySet(monthlyWorkerRows());
      if (expanded.has(normalizedKey)) expanded.delete(normalizedKey);
      else expanded.add(normalizedKey);
      saveMonthlyWorkerExpandedKeys([...expanded]);
      render();
    }

    function monthlyWorkerInspectionDataState(range) {
      if (!isSyncConfigured()) return "ready";
      const start = dateOnly(range?.start);
      let end = dateOnly(range?.end);
      const todayValue = today();
      if (end && end > todayValue) end = todayValue;
      if (!start || !end || start > end) return "error";
      const entry = state.remoteLoadedInspectionRanges?.[`${start}~${end}`];
      if (entry?.status === "loaded") return "ready";
      if (entry?.status === "error") return "error";
      return "loading";
    }

    function buildMonthlyWorkerAnalyticsModel() {
      const stats = monthlyWorkerInspectionStats();
      const restState = monthlyWorkerRestDayState();
      const holidayRows = stats.range.dates.map((date) => koreanPublicHolidayInfo(date)).filter(Boolean);
      const customRows = restState.customRestDays.filter((date) => monthKeyForDate(date) === stats.range.monthKey);
      const expandedWorkers = monthlyWorkerExpandedKeySet(stats.workers);
      return {
        dataState: monthlyWorkerInspectionDataState(stats.range),
        monthText: `${stats.range.year}년 ${stats.range.month}월`,
        monthHighlight: state.monthlyWorkerMonthHighlight,
        restOpen: state.monthlyRestDayPanelOpen,
        range: stats.range,
        workers: stats.workers.map((worker) => {
          const key = monthlyWorkerCardKey(worker);
          return { ...worker, key, expanded: expandedWorkers.has(key) };
        }),
        rate: stats.rate,
        totals: stats.totals,
        dueLabel: stats.dueLabel,
        dueMissing: stats.dueMissing,
        restPanel: {
          useKoreanPublicHolidays: restState.useKoreanPublicHolidays,
          start: stats.range.start,
          end: stats.range.end,
          holidayRows,
          customRows,
        },
      };
    }

    function renderMonthlyWorkerAnalytics() {
      const range = currentMonthRange(selectedMonthlyWorkerMonth());
      ensureInspectionRangeLoaded(range.start, range.end);
      return DASHBOARD_VIEW.renderMonthlyWorkerAnalyticsView(buildMonthlyWorkerAnalyticsModel(), { analyticsKpi });
    }

    // 분석 모델 빌더는 assets/js/analytics-model.js (window.ShipyardAnalyticsModel)로 추출됨.
    function buildAnalyticsDashboardModel() {
      return ANALYTICS_MODEL.buildAnalyticsDashboardModel({
        now: serverNow(),
        todayValue: today(),
        syncText: state.syncText || "로컬 저장",
        inspections: state.inspections,
        unsafeIssues: state.unsafeIssues,
        missingMaterials: state.missingMaterials,
        ships: state.ships,
      }, {
        localDate,
        formatKoreanDate,
        syncStatusLabel,
        shipStageInfo,
        effectiveShipStage,
        isVisibleWorkerName: visiblePledgeAnalyticsWorkerName,
        unsafeStatuses: ISSUE_MATERIAL_RULES.UNSAFE_STATUSES,
        materialStatuses: ISSUE_MATERIAL_RULES.MATERIAL_STATUSES,
        workflowStages: SHIP_WORKFLOW_STAGES,
      });
    }

    function renderAnalyticsDashboard() {
      return DASHBOARD_VIEW.renderAnalyticsDashboardView(buildAnalyticsDashboardModel(), {
        analyticsKpi,
        monthlyWorkerAnalyticsHtml: renderMonthlyWorkerAnalytics(),
        relativeRecordTime,
        shortUnsafeTitle,
        statusChip,
      });
    }

    function renderRecordFilters(kind) {
      const filters = kind === "unsafe" ? state.unsafeFilters : state.materialFilters;
      const statuses = kind === "unsafe" ? ISSUE_MATERIAL_RULES.UNSAFE_STATUSES : ISSUE_MATERIAL_RULES.MATERIAL_STATUSES;
      return `<div class="record-filters">
        <select class="select" data-record-filter="${kind}:shipNo">
          <option value="">전체 호선</option>
          ${issueSelectableShips().map((ship) => `<option value="${esc(ship.no)}" ${filters.shipNo === ship.no ? "selected" : ""}>${esc(ship.no)}</option>`).join("")}
        </select>
        <select class="select" data-record-filter="${kind}:status">
          <option value="">전체 상태</option>
          ${statuses.map((status) => `<option value="${esc(status)}" ${filters.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}
        </select>
        <select class="select" data-record-filter="${kind}:workerId">
          <option value="">전체 등록자</option>
          ${visiblePledgeAnalyticsWorkers().map((worker) => `<option value="${esc(worker.id)}" ${filters.workerId === worker.id ? "selected" : ""}>${esc(worker.name)}</option>`).join("")}
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
      const photoCount = unsafePhotosFor(row.id).length;
      const pendingPhotoCount = pendingPhotoUploadsFor(row.id).length;
      const uploading = isUnsafePhotoUploading(row.id);
      return DASHBOARD_VIEW.renderUnsafeRecordCardView({
        id: row.id,
        shipNo: row.shipNo,
        content: row.content,
        status: row.status,
        workerName: row.workerNameSnapshot,
        createdAtText: formatDateTime(row.createdAt),
        photoCount,
        pendingPhotoCount,
        uploading,
        adminMemo: row.adminMemo,
        timelineHtml: renderRecordTimeline(row, { compact: true, initialStatus: ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0] }),
        adminControlsHtml: renderAdminRecordControls("unsafe", row, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES),
      });
    }

    function renderUnsafeDetail(row) {
      const photos = unsafePhotosFor(row.id);
      const pendingPhotos = pendingPhotoUploadsFor(row.id);
      const uploading = isUnsafePhotoUploading(row.id);
      return DASHBOARD_VIEW.renderUnsafeDetailView({
        statusBadgeHtml: badge("medium", row.status),
        shipNo: row.shipNo,
        workerName: row.workerNameSnapshot,
        createdAtText: formatDateTime(row.createdAt),
        photoCount: photos.length,
        content: row.content,
        adminMemo: row.adminMemo,
        photos: photos.map((photo) => ({ url: publicPhotoUrl(photo) })),
        uploadingHtml: uploading ? renderPhotoUploadProgressPanel(row.expectedPhotoCount || 0) : "",
        pendingPhotoHtml: renderPendingPhotoUploadPanel(row.id, pendingPhotos),
        timelineHtml: renderRecordTimeline(row, { initialStatus: ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0] }),
        adminControlsHtml: renderAdminRecordControls("unsafe", row, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES),
      });
    }

    function renderMaterialRecordCard(row) {
      return DASHBOARD_VIEW.renderMaterialRecordCardView({
        shipNo: row.shipNo,
        materialName: row.materialName,
        workerName: row.workerNameSnapshot,
        createdAtText: formatDateTime(row.createdAt),
        content: row.content,
        adminMemo: row.adminMemo,
        timelineHtml: renderRecordTimeline(row, { compact: true, initialStatus: ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[0] }),
        adminControlsHtml: renderAdminRecordControls("materials", row, ISSUE_MATERIAL_RULES.MATERIAL_STATUSES),
      });
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
      const pendingPhotos = pendingPhotoUploadsFor(row.id);
      const uploading = isUnsafePhotoUploading(row.id);
      const photoValue = uploading ? "업로드 중" : (pendingPhotos.length ? "대기" : (photos.length || 0));
      return renderCompletionScreen({
        type: "unsafe",
        icon: "warning",
        title: uploading ? "신고 접수 및 사진 업로드 중" : "신고가 접수되었습니다",
        message: uploading
          ? `${row.shipNo || "-"} 불안전요소가 접수됐고 사진을 업로드하고 있습니다. 완료되면 사진 수가 자동 갱신됩니다.`
          : `${row.shipNo || "-"} 불안전요소가 관리자에게 전달됐습니다. 처리 내역은 불안전요소 탭에서 확인하세요.`,
        stats: [
          { value: "위험", label: "위험도", tone: "pink" },
          { value: row.shipNo || "-", label: "호선" },
          { value: photoValue, label: "사진" },
        ],
        actions: [
          { label: "목록 보기", action: "view-unsafe-list" },
          { label: "홈으로", view: "dashboard", primary: true },
        ],
      });
    }

    function materialNotificationPresentation(row) {
      const materialId = String(row?.id || "");
      const pending = state.pendingMissingMaterialNotifications.find((entry) => entry.materialId === materialId);
      if (!pending) {
        return {
          state: "delivered",
          label: "관리자 알림 전송 완료",
          detail: "등록 정보와 브라우저 알림이 관리자에게 전달되었습니다.",
        };
      }
      if (state.lastMaterialNotificationState === "retry" || Number(pending.attempts || 0) > 0) {
        return {
          state: "retry",
          label: "관리자 알림 재전송 대기",
          detail: "등록 정보는 저장되었습니다. 연결이 회복되면 알림을 자동으로 다시 전송합니다.",
        };
      }
      return {
        state: "sending",
        label: "관리자 알림 전송 중",
        detail: "등록 정보를 서버에 저장한 뒤 관리자 대상 알림을 전송하고 있습니다.",
      };
    }

    function renderMaterialNotificationStatus(row) {
      const notification = materialNotificationPresentation(row);
      return `<div class="inspection-submit-status state-${esc(notification.state)}" role="status" aria-live="polite" data-material-notification-state="${esc(notification.state)}">
        <div class="inspection-submit-status-row inspection-submit-status-local">
          <span class="inspection-submit-status-check" aria-hidden="true">✓</span>
          <span><strong>자재 누락 등록 완료</strong><small>관리센터 목록에 즉시 반영되었습니다.</small></span>
        </div>
        <div class="inspection-submit-status-row inspection-submit-status-server">
          <span class="inspection-submit-status-dot" aria-hidden="true"></span>
          <span><strong>${esc(notification.label)}</strong><small>${esc(notification.detail)}</small></span>
        </div>
      </div>`;
    }

    function renderMaterialComplete(row) {
      return renderCompletionScreen({
        type: "material",
        icon: "box",
        title: "자재 누락이 등록되었습니다",
        message: `${row.shipNo || "-"} · ${row.materialName || "-"} 누락 신청이 등록되었습니다.`,
        statusHtml: renderMaterialNotificationStatus(row),
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
      const addOpen = state.openAddItemSectionIds.includes(section.id);
      const expanded = state.openManageSectionId === section.id;
      const editing = state.editSectionId === section.id;
      const editor = editing ? sectionEditorDraftFor(section) : section;
      return SCREEN_VIEWS.renderSectionManagerView({
        sectionId: section.id,
        sectionTitle: editor.title,
        signCode: editor.signCode || "",
        frequency: editor.frequency,
        severity: editor.severity,
        editing,
        saving: state.sectionSaveSubmittingId === section.id,
        expanded,
        addOpen,
        adminMode: state.adminMode,
        moreToggleHtml: moreToggle(`data-toggle-add-item="${esc(section.id)}"`, addOpen),
        visibilityOptionsHtml: addOpen ? visibilityConditionOptions("항상 표시") : "",
        toolPickerHtml: addOpen ? renderItemToolPicker({ groupId: `add_${section.id}`, categoryId: cat.id, selectedIds: [] }) : "",
        rows: items.map((row) => ({
          html: state.adminMode ? (state.editItemId === row.id ? renderEditableItemRow(row) : renderManageItemSummaryRow(row)) : "",
          text: row.text,
          requiredLabel: row.required ? "제출 필수 항목" : "일반 항목",
          visibilityLabel: describeItemVisibility(row),
          badgeHtml: badge(row.risk),
        })),
      });
    }

    function normalizeSectionEditorScore(value) {
      const score = parseInt(value, 10);
      return Number.isInteger(score) && score >= 1 && score <= 5 ? score : null;
    }

    function normalizeSectionEditorSign(value) {
      const signCode = String(value || "").trim();
      return /^[PMSW]-(?:0[1-9]|1[0-2])$/.test(signCode) ? signCode : "";
    }

    function createSectionEditorDraft(section) {
      return {
        sectionId: section.id,
        title: String(section.title || ""),
        signCode: normalizeSectionEditorSign(section.signCode),
        frequency: normalizeSectionEditorScore(section.frequency),
        severity: normalizeSectionEditorScore(section.severity),
      };
    }

    function sectionEditorDraftFor(section) {
      if (!section) return null;
      if (state.sectionEditorDraft?.sectionId !== section.id) {
        state.sectionEditorDraft = createSectionEditorDraft(section);
      }
      return state.sectionEditorDraft;
    }

    function beginSectionEditor(section) {
      state.sectionEditorDraft = section ? createSectionEditorDraft(section) : null;
    }

    function updateSectionEditorDraft(sectionId, field, value) {
      const section = state.sections.find((row) => row.id === sectionId);
      if (!section || state.editSectionId !== sectionId || !["title", "signCode", "frequency", "severity"].includes(field)) return;
      const draft = sectionEditorDraftFor(section);
      state.sectionEditorDraft = { ...draft, [field]: value };
    }

    function clearSectionEditorDraft(sectionId = state.editSectionId) {
      if (!sectionId || state.sectionEditorDraft?.sectionId === sectionId) state.sectionEditorDraft = null;
    }

    function isSectionEditorDirty(sectionId = state.editSectionId) {
      const section = state.sections.find((row) => row.id === sectionId);
      if (!section || !sectionId) return false;
      const draft = sectionEditorDraftFor(section);
      return String(draft.title || "").trim() !== String(section.title || "").trim()
        || normalizeSectionEditorSign(draft.signCode) !== normalizeSectionEditorSign(section.signCode)
        || normalizeSectionEditorScore(draft.frequency) !== normalizeSectionEditorScore(section.frequency)
        || normalizeSectionEditorScore(draft.severity) !== normalizeSectionEditorScore(section.severity);
    }

    function shouldPreserveSectionEditorOnAdminExit() {
      const sectionId = state.editSectionId || state.sectionSaveSubmittingId;
      if (!sectionId) return false;
      return state.sectionSaveSubmittingId === sectionId || isSectionEditorDirty(sectionId);
    }

    function confirmSectionEditorDiscard(button) {
      const sectionId = state.editSectionId;
      if (!sectionId) return true;
      if (state.sectionSaveSubmittingId === sectionId) {
        toast("섹션 저장 중입니다. 잠시만 기다려주세요.");
        return false;
      }
      if (button?.dataset.action === "toggle-admin" && !state.adminMode) return true;
      if (button?.dataset.saveSection === sectionId || button?.dataset.action === "cancel-edit-section") return true;
      if (isSectionEditorDirty(sectionId)
        && !window.confirm("저장하지 않은 섹션 변경사항이 있습니다.\n변경사항을 버리고 이동할까요?")) return false;
      clearSectionEditorDraft(sectionId);
      return true;
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
          <button class="btn-light" data-action="cancel-edit-item" type="button">취소</button>
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
            return `<label class="item-tool-option" for="${esc(inputId)}" data-category-tool-search-item data-category-tool-search-text="${esc(normalizeSearchQuery(`${tool.name} ${tool.nature}`))}">
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
      if (!categories.length) return `<div class="empty compact-empty">등록된 작업 유형이 없습니다. 먼저 작업 유형을 추가하세요.</div>`;
      const selectedCategory = categoryById(state.workTypeManagerSelectedId) || categories[0];
      state.workTypeManagerSelectedId = selectedCategory.id;
      const selectedToolIds = categoryToolDraftIds(selectedCategory.id, selectedCategory.toolIds);
      return SCREEN_VIEWS.renderWorkTypeManagerView({
        searchQuery: state.workTypeSearchQuery,
        mobileDetailOpen: state.workTypeManagerMobileDetailOpen,
        categories: categories.map((cat) => ({
          id: cat.id,
          label: cat.label,
          meta: `${sectionsFor(cat.id).length}개 섹션 · ${activeItems(cat.id).length}개 항목 · ${normalizeToolNature(cat.toolNature)}`,
          countLabel: sanitizeToolIds(cat.toolIds).length ? `${sanitizeToolIds(cat.toolIds).length}개 지정` : "전체 표시",
          searchText: normalizeSearchQuery(`${cat.label} ${cat.toolNature}`),
          active: cat.id === selectedCategory.id,
          accent: categoryAccent(cat),
          iconHtml: categoryVisual(cat),
        })),
        detailHtml: renderWorkTypeDetail(selectedCategory, selectedToolIds, categories),
      });
    }

    function renderWorkTypeDetail(cat, selectedToolIds, categories) {
      const tab = ["summary", "tools", "sections"].includes(state.workTypeManagerTab) ? state.workTypeManagerTab : "summary";
      const sections = sectionsFor(cat.id);
      const items = activeItems(cat.id);
      const tabs = [
        ["summary", "기본 정보"],
        ["tools", `공기구 ${selectedToolIds.length}`],
        ["sections", `섹션·항목 ${items.length}`],
      ];
      return `<div class="work-type-detail-shell" style="--accent:${esc(categoryAccent(cat))}">
        <button class="work-type-mobile-back" data-action="back-work-type-list" type="button">‹ 작업 유형 목록</button>
        <header class="work-type-detail-head">
          <span class="work-type-detail-icon">${categoryVisual(cat)}</span>
          <div>
            <span class="work-type-detail-kicker">작업 유형</span>
            <h2>${esc(cat.label)}</h2>
            <p>${sections.length}개 섹션 · ${items.length}개 점검 항목 · ${esc(normalizeToolNature(cat.toolNature))}</p>
          </div>
        </header>
        <nav class="work-type-tabs" aria-label="작업 유형 관리 메뉴">
          ${tabs.map(([id, label]) => `<button class="${tab === id ? "active" : ""}" data-work-type-tab="${id}" type="button" aria-current="${tab === id ? "page" : "false"}">${esc(label)}</button>`).join("")}
        </nav>
        <div class="work-type-tab-panel">
          ${tab === "summary" ? renderWorkTypeSummaryTab(cat, selectedToolIds, sections, items) : ""}
          ${tab === "tools" ? renderWorkTypeToolsTab(cat, selectedToolIds, categories) : ""}
          ${tab === "sections" ? renderWorkTypeSectionsTab(cat, sections, items) : ""}
        </div>
      </div>`;
    }

    function renderWorkTypeSummaryTab(cat, selectedToolIds, sections, items) {
      if (state.editCategoryId === cat.id) {
        return `${renderCategoryEditPanel(cat)}
          <div class="work-type-sticky-actions">
            <button class="btn" data-save-category="${esc(cat.id)}" ${state.adminMode ? "" : "disabled"} type="button">변경사항 저장</button>
            <button class="btn-light" data-action="cancel-edit-category" type="button">취소</button>
          </div>`;
      }
      return `<div class="work-type-summary-grid">
          <div><strong>${sections.length}</strong><span>섹션</span></div>
          <div><strong>${items.length}</strong><span>점검 항목</span></div>
          <div><strong>${selectedToolIds.length || "전체"}</strong><span>지정 공기구</span></div>
        </div>
        <div class="work-type-summary-block">
          <div class="section-title">현재 공기구 설정</div>
          ${renderCategoryToolSummary(selectedToolIds)}
        </div>
        <div class="work-type-detail-actions">
          <button class="btn" data-edit-category="${esc(cat.id)}" ${state.adminMode ? "" : "disabled"} type="button">기본 정보 수정</button>
          <button class="btn-light" data-manage-category="${esc(cat.id)}" type="button">섹션·항목 관리</button>
          <details class="work-type-overflow">
            <summary>기타</summary>
            <button class="btn-danger" data-delete-category="${esc(cat.id)}" ${state.adminMode ? "" : "disabled"} type="button">작업 유형 삭제</button>
          </details>
        </div>`;
    }

    function renderWorkTypeToolsTab(cat, selectedToolIds, categories) {
      const sources = categories.filter((row) => row.id !== cat.id);
      return `<section class="work-type-copy-panel">
          <div>
            <strong>다른 작업 유형의 공기구 설정 복사</strong>
            <p>가져온 설정은 바로 반영되지 않습니다. 아래 저장 버튼을 눌러야 적용됩니다.</p>
          </div>
          <div class="work-type-copy-controls">
            <label class="sr-only" for="copyCategorySource_${esc(cat.id)}">복사할 작업 유형</label>
            <select class="select" id="copyCategorySource_${esc(cat.id)}" data-copy-category-source>
              <option value="">복사할 작업 유형 선택</option>
              ${sources.map((source) => `<option value="${esc(source.id)}">${esc(source.label)} · ${sanitizeToolIds(source.toolIds).length || "전체"}</option>`).join("")}
            </select>
            <button class="btn-light" data-copy-category-tools="${esc(cat.id)}" ${state.adminMode && sources.length ? "" : "disabled"} type="button">설정 가져오기</button>
          </div>
        </section>
        <div class="work-type-tool-toolbar">
          <label class="sr-only" for="categoryToolSearch_${esc(cat.id)}">공기구 검색</label>
          <input class="input" id="categoryToolSearch_${esc(cat.id)}" type="search" value="${esc(state.categoryToolSearchQuery)}" placeholder="공기구 이름 검색" data-category-tool-search />
          <span data-category-tool-search-count>${activeTools().length}개</span>
        </div>
        ${renderCategoryToolPicker({ groupId: `category_${cat.id}`, selectedIds: selectedToolIds })}
        <div class="empty compact-empty" data-category-tool-search-empty hidden>검색 결과가 없습니다.</div>
        <div class="work-type-sticky-actions">
          <span>${selectedToolIds.length ? `${selectedToolIds.length}개 선택됨` : "전체 공기구 표시"}</span>
          <button class="btn" data-save-category-tools="${esc(cat.id)}" ${state.adminMode ? "" : "disabled"} type="button">공기구 설정 저장</button>
        </div>`;
    }

    function renderWorkTypeSectionsTab(cat, sections, items) {
      return `<p class="work-type-section-guide">편집할 섹션을 선택하세요.</p>
        <div class="work-type-section-list">
          ${sections.map((section) => {
            const count = items.filter((item) => item.sectionId === section.id).length;
            const open = state.openManageSectionId === section.id;
            return `<div class="work-type-section-entry ${open ? "is-open" : ""}">
              <button class="work-type-section-row ${open ? "is-open" : ""}" data-edit-work-type-section="${esc(section.id)}" ${state.adminMode ? "" : "disabled"} type="button" aria-expanded="${open ? "true" : "false"}" aria-label="${esc(`${section.title} 섹션 편집`)}"><span>${esc(section.title)}</span><em>${count}개 항목 <i aria-hidden="true">›</i></em></button>
              ${open ? `<div class="work-type-section-inline-editor">${renderSectionManager(cat, section)}</div>` : ""}
            </div>`;
          }).join("") || `<div class="empty compact-empty">등록된 섹션이 없습니다.</div>`}
        </div>`;
    }

    function renderCategoryToggleImage(expanded, cat) {
      const label = expanded ? "공기구 지정 접힘 상태로 전환" : "공기구 지정 펼침 상태로 전환";
      const path = expanded
        ? "M7.5 13.2 12 8.8l4.5 4.4"
        : "M7.5 10.8 12 15.2l4.5-4.4";
      return `<span class="category-tool-toggle-image ${expanded ? "expanded" : "collapsed"}" aria-label="${label}" role="img" style="--accent:${esc(categoryAccent(cat))}">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="10.2"></circle>
          <path d="${path}"></path>
        </svg>
      </span>`;
    }

    function renderCategoryEditPanel(cat) {
      const selectedColor = cat.color || categoryAccent(cat) || COLORS[0];
      return `<div class="category-edit-panel">
        <div class="tool-admin-edit-grid">
          <div class="field">
            <label for="editCategoryLabel_${esc(cat.id)}">작업 유형명</label>
            <input class="input" id="editCategoryLabel_${esc(cat.id)}" value="${esc(cat.label)}" ${state.adminMode ? "" : "disabled"} />
          </div>
          <div class="field">
            <label for="editCategoryIcon_${esc(cat.id)}">아이콘/픽토그램</label>
            <input class="input" id="editCategoryIcon_${esc(cat.id)}" value="${esc(cat.icon || "")}" placeholder="예) erection 또는 P" ${state.adminMode ? "" : "disabled"} />
          </div>
          <div class="field">
            <label for="editCategoryNature_${esc(cat.id)}">공기구 기준 성격</label>
            <select class="select" id="editCategoryNature_${esc(cat.id)}" ${state.adminMode ? "" : "disabled"}>
              ${toolNatureOptions(cat.toolNature)}
            </select>
          </div>
          <div class="field">
            <span class="field-label">색상</span>
            <div class="color-row">${COLORS.map((color) => `<button class="color-dot ${color === selectedColor ? "active" : ""}" style="--dot:${color}" data-edit-category-color-id="${esc(cat.id)}" data-edit-category-color="${color}" ${state.adminMode ? "" : "disabled"} type="button" aria-label="색상 선택"></button>`).join("")}</div>
          </div>
        </div>
        <button class="toggle ${cat.requireToolCheck !== false ? "active" : ""}" data-toggle-tool-check="${esc(cat.id)}" ${state.adminMode ? "" : "disabled"} type="button" aria-pressed="${cat.requireToolCheck !== false ? "true" : "false"}">
          <span class="toggle-track"></span><span>공기구 체크 필수 ${cat.requireToolCheck !== false ? "ON" : "OFF"}</span>
        </button>
        ${renderPictogramPicker(cat.icon || "", `editCategoryIcon_${cat.id}`)}
        <div class="item-actions manage-actions">
          <button class="btn" data-apply-category-icon="${esc(cat.id)}" ${state.adminMode ? "" : "disabled"} type="button">선택한 아이콘 적용</button>
          <span class="section-help">아이콘을 선택한 뒤 이 버튼을 누르면 해당 작업 유형에 저장됩니다.</span>
        </div>
        <div class="tool-admin-stack category-edit-library">
          <div>
            <div class="section-title">픽토그램 라이브러리 관리</div>
            <p class="section-help">아래의 이름 저장은 사용자 지정 픽토그램의 표시 이름만 변경합니다.</p>
            ${renderPictogramLibraryManager()}
          </div>
        </div>
      </div>`;
    }

    function renderCategoryToolSummary(toolIds) {
      const tools = sanitizeToolIds(toolIds)
        .map((id) => toolById(id))
        .filter((tool) => tool && tool.deleted !== true);
      if (!tools.length) return `<div class="category-tool-summary empty-summary">공기구 미지정 시 전체 표시</div>`;
      const visibleTools = tools.slice(0, 4);
      const hiddenCount = tools.length - visibleTools.length;
      return `<div class="category-tool-summary" aria-label="지정된 공기구 요약">
        ${visibleTools.map((tool) => `<span class="category-tool-chip">${esc(tool.name)}${natureBadge(tool.nature)}</span>`).join("")}
        ${hiddenCount > 0 ? `<span class="category-tool-chip more">+${hiddenCount}</span>` : ""}
      </div>`;
    }

    function renderToolManagerShell() {
      const tools = activeTools();
      const expanded = state.toolManagerOpen === true;
      const editingTool = state.editToolId ? toolById(state.editToolId) : null;
      const statusText = editingTool
        ? `${editingTool.name} 수정 중`
        : state.toolAddOpen
          ? "새 공기구 추가 작성 중"
          : `${tools.length}개 등록`;
      return `<div class="tool-manager-shell ${expanded ? "expanded" : "collapsed"}">
        <div class="tool-manager-summary">
          <div class="tool-manager-summary-copy">
            <div class="section-title">공기구/준비물 관리</div>
            <span class="small muted">${esc(statusText)}</span>
          </div>
          <button class="btn-light tool-manager-toggle" data-action="toggle-tool-manager" type="button" aria-expanded="${expanded ? "true" : "false"}">${expanded ? "접기" : "더보기"}</button>
        </div>
        ${expanded ? `<div class="tool-manager-body">${renderToolManager()}</div>` : ""}
      </div>`;
    }

    function renderToolManager() {
      const tools = activeTools();
      return `
        <div class="tool-admin-toolbar">
          <div class="tool-admin-search-stack">
            <div class="field">
              <label for="toolSearch">공기구/준비물 검색</label>
              <input class="input search-input" id="toolSearch" data-tool-search value="${esc(state.toolSearchQuery)}" placeholder="공기구명 검색" autocomplete="off" />
              <div class="small muted" data-tool-search-count>${tools.length}개</div>
            </div>
            <div class="small muted">카드를 선택하면 해당 공기구만 펼쳐서 수정합니다.</div>
          </div>
          <button class="btn" data-action="toggle-tool-add" ${state.adminMode && !state.toolAddSubmitting ? "" : "disabled"} type="button">${state.toolAddOpen ? "추가 닫기" : "+ 공기구 추가"}</button>
        </div>
        ${state.toolAddOpen ? `<div class="tool-admin-add">
          <div class="tool-admin-edit-grid">
            <div class="field">
              <label for="newToolName">새 공기구/준비물</label>
              <input class="input" id="newToolName" placeholder="예) 에어 호스" ${state.adminMode && !state.toolAddSubmitting ? "" : "disabled"} />
            </div>
            <div class="field">
              <label for="newToolNature">성격</label>
              <select class="select" id="newToolNature" ${state.adminMode && !state.toolAddSubmitting ? "" : "disabled"}>
                ${toolNatureOptions("선행")}
              </select>
            </div>
          </div>
          <button class="btn" data-action="add-tool" ${state.adminMode && !state.toolAddSubmitting ? "" : "disabled"} type="button">${state.toolAddSubmitting ? "추가 중..." : "공기구 추가"}</button>
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
        <div class="field" style="margin-bottom:10px">
          <label for="newPictogramLabel">새 픽토그램 이름</label>
          <input class="input" id="newPictogramLabel" placeholder="예) 방폭 조명" ${state.adminMode ? "" : "disabled"} />
        </div>
        <div class="field" style="margin-bottom:10px">
          <label for="newPictogramFile">이미지 파일</label>
          <input class="input" id="newPictogramFile" type="file" accept="${PICTOGRAM_IMAGE_ACCEPT}" ${state.adminMode ? "" : "disabled"} />
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
              <button class="btn-light" data-save-pictogram="${icon.id}" ${state.adminMode ? "" : "disabled"} type="button">이름 저장</button>
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

    function shipDeliveryMeta(ship) {
      const deliveryType = shipDeliveryType(ship);
      const deliveryDate = shipDeliveryDate(ship);
      return [deliveryType || (deliveryDate ? "" : "인도"), deliveryDate].filter(Boolean).join(" ");
    }

    function shipDeliveryDate(ship) {
      if (ship.dlDate) return ship.dlDate;
      if (ship.clDate) return ship.clDate;
      return ship.deliveryDate || "";
    }

    function shipStageInfo(stage) {
      if (typeof SHIP_HELPERS.shipStageInfo === "function") {
        return SHIP_HELPERS.shipStageInfo(stage);
      }
      return STAGE_META[stage] || STAGE_META.mounting;
    }

    function normalizeShipStageInput(value) {
      if (typeof SHIP_HELPERS.normalizeShipStageInput === "function") {
        return SHIP_HELPERS.normalizeShipStageInput(value);
      }
      const raw = String(value || "").trim();
      if (!raw) return "";
      const compact = raw.toLowerCase().replace(/[\s/_-]+/g, "");
      const stage = SHIP_WORKFLOW_STAGES.find((item) => item === compact || STAGE_META[item].label.toLowerCase().replace(/[\s/_-]+/g, "") === compact);
      if (stage) return stage;
      if (["탑재", "mounting", "mount"].includes(compact)) return "mounting";
      if (compact === "lc") return "lc";
      if (compact === "st") return "st";
      if (compact === "cl") return "cl";
      if (compact === "dl") return "dl";
      return "";
    }

    function isWorkerVisibleShip(ship) {
      return Boolean(ship.lcDate || ship.stDate || ship.clDate);
    }

    function visibleWorkerShips() {
      return state.ships.filter(isWorkerVisibleShip).sort((a, b) => String(a.no).localeCompare(String(b.no)));
    }

    function selectableShips() {
      return visibleWorkerShips();
    }

    function issueSelectableShips() {
      return [...state.ships].sort((a, b) => String(a.no).localeCompare(String(b.no)));
    }

    function visibleWorkerOptions(selectedId = "") {
      return `<option value="">등록자 선택</option>${state.workers
        .map((worker) => `<option value="${esc(worker.id)}" ${worker.id === selectedId ? "selected" : ""}>${esc(worker.name)}${worker.team ? ` / ${esc(worker.team)}` : ""}</option>`)
        .join("")}`;
    }

    function visibleShipOptionsForIssues(selectedNo = "") {
      return `<option value="">호선 선택</option>${issueSelectableShips()
        .map((ship) => `<option value="${esc(ship.no)}" ${ship.no === selectedNo ? "selected" : ""}>${esc(ship.no)}${ship.type ? ` / ${esc(ship.type)}` : ""}</option>`)
        .join("")}`;
    }

    function effectiveShipStage(ship) {
      if (typeof SHIP_HELPERS.effectiveShipStage === "function") {
        return SHIP_HELPERS.effectiveShipStage(ship);
      }
      return shipStageInfo(ship.processStage || "mounting");
    }

    function dateOnly(value) {
      return String(value || "").slice(0, 10);
    }

    function inspectionActualDate(row) {
      if (row?.date) return dateOnly(row.date);
      if (!row?.createdAt) return "";
      const createdAt = new Date(row.createdAt);
      return Number.isNaN(createdAt.getTime()) ? dateOnly(row.createdAt) : localDate(createdAt);
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

    function categoryToolMetaItemId(categoryId) {
      return `${CATEGORY_TOOL_META_PREFIX}${categoryId}`;
    }

    function isCategoryToolMetaItem(row) {
      return String(row?.id || "").startsWith(CATEGORY_TOOL_META_PREFIX);
    }

    function categoryToolMetaLabel(categoryId) {
      return `${CATEGORY_TOOL_META_PREFIX}${categoryId}`;
    }

    function syncCategoryToolMetaItem(categoryId, toolIds) {
      const cat = categoryById(categoryId);
      const section = sectionsFor(categoryId)[0];
      if (!cat || !section) return;
      const id = categoryToolMetaItemId(categoryId);
      const cleanToolIds = sanitizeToolIds(toolIds);
      const existing = state.items.find((row) => row.id === id);
      const row = {
        ...(existing || {}),
        id,
        categoryId,
        sectionId: section.id,
        text: categoryToolMetaLabel(categoryId),
        risk: "low",
        required: false,
        active: false,
        visibilityCondition: "항상 표시",
        toolIds: cleanToolIds,
        order: existing?.order || 9999,
      };
      if (existing) {
        state.items = state.items.map((item) => item.id === id ? row : item);
      } else if (cleanToolIds.length) {
        state.items.push(row);
      }
      state.categories = state.categories.map((item) => item.id === categoryId ? { ...item, toolIds: cleanToolIds } : item);
    }

    function applyCategoryToolMetaItems() {
      const metaToolIds = new Map();
      state.items.forEach((row) => {
        if (isCategoryToolMetaItem(row) && row.categoryId) {
          metaToolIds.set(row.categoryId, sanitizeToolIds(row.toolIds));
        }
      });
      state.categories = state.categories.map((cat) => {
        const metaIds = metaToolIds.get(cat.id);
        return {
          ...cat,
          toolIds: metaToolIds.has(cat.id) ? metaIds : sanitizeToolIds(cat.toolIds),
        };
      });
      state.categories.forEach((cat) => {
        if (sanitizeToolIds(cat.toolIds).length || metaToolIds.has(cat.id)) {
          syncCategoryToolMetaItem(cat.id, cat.toolIds);
        }
      });
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
      if (typeof SHIP_HELPERS.normalizeShipSortMode === "function") {
        return SHIP_HELPERS.normalizeShipSortMode(value);
      }
      const mode = String(value || "").trim();
      return SHIP_SORT_OPTIONS.some(([id]) => id === mode) ? mode : "stage";
    }

    function shipSortOptions() {
      return SHIP_SORT_OPTIONS.map(([id, label]) => `<option value="${esc(id)}" ${state.shipSortMode === id ? "selected" : ""}>${esc(label)}</option>`).join("");
    }

    function compareShipNo(a, b) {
      if (typeof SHIP_HELPERS.compareShipNo === "function") {
        return SHIP_HELPERS.compareShipNo(a, b);
      }
      return String(a.no || "").localeCompare(String(b.no || ""), "ko-KR", { numeric: true, sensitivity: "base" });
    }

    function compareShipDate(getDate) {
      if (typeof SHIP_HELPERS.compareShipDate === "function") {
        return SHIP_HELPERS.compareShipDate(getDate);
      }
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
      if (typeof SHIP_HELPERS.compareShipStage === "function") {
        return SHIP_HELPERS.compareShipStage(a, b);
      }
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

    async function saveCurrentShipOrder() {
      if (!requireAdminWrite()) return;
      const ordered = sortedShips().map((ship, index) => ({ ...ship, order: index + 1 }));
      state.ships = ordered;
      state.shipSortMode = "saved";
      if (!(await persistAndSync("ships"))) return;
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

    function checklistItemsForSelectedTools(categoryId, selectedToolIds) {
      const cat = categoryById(categoryId);
      return CHECKLIST_RULES.filterChecklistItems({
        items: activeItems(categoryId),
        tools: activeTools(),
        selectedToolIds,
        categoryNature: cat?.toolNature || defaultToolNatureForCategory(cat),
      });
    }

    function filteredChecklistItems(categoryId) {
      return checklistItemsForSelectedTools(categoryId, state.draft.selectedToolIds);
    }

    function toolPrepCoverage(category, tools, selectedToolIds) {
      const items = activeItems(category.id);
      const visibleItems = checklistItemsForSelectedTools(category.id, selectedToolIds);
      const toolCounts = new Map(tools.map((tool) => [
        tool.id,
        items.filter((item) => linkedToolsForItem(item).some((linked) => linked.id === tool.id)).length,
      ]));
      const hasLinkedItems = [...toolCounts.values()].some(Boolean);
      if (!hasLinkedItems) {
        return {
          independent: true,
          title: `이 작업은 공기구와 무관하게 안전대책 ${items.length}건을 모두 점검합니다.`,
          description: "공기구 선택은 준비 확인에만 사용됩니다.",
          toolCounts,
        };
      }
      return {
        independent: false,
        title: `이 선택으로 점검할 안전대책 ${visibleItems.length} / ${items.length}건`,
        description: "공기구를 더 고르면 관련 대책이 함께 열립니다.",
        toolCounts,
      };
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

    function categoryToolDraftIds(categoryId, fallbackIds = []) {
      const draftIds = state.categoryToolDrafts?.[categoryId];
      return sanitizeToolIds(Array.isArray(draftIds) ? draftIds : fallbackIds);
    }

    function setCategoryToolDraft(categoryId, toolIds) {
      if (!categoryId) return;
      state.categoryToolDrafts = {
        ...state.categoryToolDrafts,
        [categoryId]: sanitizeToolIds(toolIds),
      };
    }

    function clearCategoryToolDraft(categoryId) {
      if (!categoryId || !state.categoryToolDrafts?.[categoryId]) return;
      const { [categoryId]: _removed, ...remaining } = state.categoryToolDrafts;
      state.categoryToolDrafts = remaining;
    }

    function updateCategoryToolDraft(groupId, toolId, checked) {
      if (!state.adminMode) return;
      const categoryId = String(groupId || "").replace(/^category_/, "");
      const category = categoryById(categoryId);
      if (!category || !toolId) return;
      const selected = new Set(categoryToolDraftIds(categoryId, category.toolIds));
      checked ? selected.add(toolId) : selected.delete(toolId);
      setCategoryToolDraft(categoryId, [...selected]);
    }

    function selectedColor() {
      return $("catColor")?.value || COLORS[0];
    }

    function selectedEditCategoryColor(id, fallback) {
      const active = Array.from(document.querySelectorAll("[data-edit-category-color-id]"))
        .find((node) => node.dataset.editCategoryColorId === id && node.classList.contains("active"));
      return active?.dataset.editCategoryColor || fallback || COLORS[0];
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
      state.draft.pledgeSignatureCleared = true;
      saveJson("draft", state.draft);
      render();
    }

    function openCheckSubmitSheet() {
      state.checkSubmitSheetOpen = true;
      renderPreservingScroll();
      requestAnimationFrame(() => document.querySelector("[data-check-submit-sheet] [data-pledge-rule]")?.focus());
    }

    function closeCheckSubmitSheet() {
      state.checkSubmitSheetOpen = false;
      renderPreservingScroll();
      requestAnimationFrame(() => document.querySelector("[data-action='open-check-submit-sheet']")?.focus());
    }

    function startNewUnsafeIssue() {
      state.lastUnsafeIssueId = "";
      state.unsafeDraft = createUnsafeDraft();
      state.unsafePhotoFiles = [];
      persist();
      render();
      scrollScreenTop();
    }

    function openUnsafeDraftFromCheck(itemId) {
      const model = currentCheckRenderState();
      const item = model?.items.find((row) => row.id === itemId);
      if (!model || !item) return;
      const section = sectionsFor(model.cat.id).find((row) => row.id === item.sectionId);
      const prefilledContent = `[점검 미확인] ${section?.title || "위험요인"}: ${item.text}`;
      const currentContent = String(state.unsafeDraft.content || "").trim();
      state.lastUnsafeIssueId = "";
      state.unsafeDraft = createUnsafeDraft({
        ...state.unsafeDraft,
        step: 2,
        shipNo: state.draft.shipNo || state.unsafeDraft.shipNo,
        content: currentContent.includes(prefilledContent)
          ? currentContent
          : [currentContent, prefilledContent].filter(Boolean).join("\n"),
        workerId: state.unsafeDraft.workerId || currentWorkerSessionWorker()?.id || "",
      });
      saveUnsafeDraft();
      changeView("unsafe");
      scrollScreenTop();
    }

    function startNewMissingMaterial() {
      state.lastMaterialId = "";
      state.lastMaterialNotificationState = "";
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

    function runActionMap(actions, action, event) {
      const handler = actions[action];
      if (!handler) return false;
      handler(event);
      return true;
    }

    function dispatchWorkerSessionAction(action, event) {
      return runActionMap({
        "worker-login": submitWorkerLogin,
        "worker-logout": logoutWorker,
        "refresh-workers": refreshWorkerList,
        "clear-pledge-signature": clearPledgeSignature,
        "notify-pledge-pending": notifyPledgePendingWorkers,
      }, action, event);
    }

    function dispatchPushAction(action, event) {
      return runActionMap({
        "edit-push-template": openPushTemplateEditor,
        "save-push-template": savePushTemplateEditor,
        "cancel-push-template": closePushTemplateEditor,
        "reset-push-template": resetPushTemplateEditor,
        "register-push-notifications": registerWorkerPushNotifications,
        "test-push-notification": testCurrentWorkerPushNotification,
        "edit-worker-push-devices": openWorkerPushDeviceManager,
        "close-worker-push-devices": closeWorkerPushDeviceManager,
        "save-worker-push-device": saveWorkerPushDevice,
        "delete-worker-push-device": deleteWorkerPushDevice,
        "refresh-worker-push-statuses": refreshPushManagerStatuses,
        "set-admin-push-style": () => setAdminPushStyle(event.target.closest("[data-admin-push-style]")?.dataset.adminPushStyle),
        "send-admin-push": sendAdminPush,
      }, action, event);
    }

    function dispatchWorkPrepAction(action, event) {
      const workPrepRecordId = () => event?.target?.closest("[data-work-prep-record-id]")?.dataset.workPrepRecordId || "";
      return runActionMap({
        "open-work-prep-register": openWorkPrepRegister,
        "close-work-prep-register": closeWorkPrepRegister,
        "save-work-prep-registration": saveWorkPrepRegistration,
        "start-work-prep-record": () => startWorkPrepRecord(workPrepRecordId()),
        "start-check-from-work-prep": () => startCheckFromWorkPrepRecord(workPrepRecordId()),
        "edit-work-prep-record": () => openWorkPrepRecordForEdit(workPrepRecordId()),
        "delete-work-prep-record": () => deleteWorkPrepRecord(workPrepRecordId()),
        "select-work-prep-date": () => selectWorkPrepDate(event.target.closest("[data-work-prep-date]")?.dataset.workPrepDate || ""),
        "toggle-work-prep-appearance": () => {
          state.workPrepAppearanceOpen = !state.workPrepAppearanceOpen;
          renderPreservingScroll();
        },
        "toggle-work-prep-other-workers": () => {
          state.workPrepOtherWorkersOpen = !state.workPrepOtherWorkersOpen;
          renderPreservingScroll();
        },
        "toggle-work-prep-direct": () => {
          state.workPrepDirectOpen = !state.workPrepDirectOpen;
          renderPreservingScroll();
        },
      }, action, event);
    }

    function dispatchShipDataAction(action, event) {
      return runActionMap({
        "import-ships": triggerShipImport,
        "export-ships": exportShips,
        "toggle-ship-data-card": () => toggleShipDataCard(event.target.closest("[data-ship-id]")?.dataset.shipId),
        "open-ship-data-target": () => openShipDataTarget(
          event.target.closest("[data-ship-data-target]")?.dataset.shipDataTarget,
          event.target.closest("[data-ship-no]")?.dataset.shipNo,
        ),
      }, action, event);
    }

    function dispatchInspectionAction(action, event) {
      return runActionMap({
        "submit-inspection": submitInspection,
        "final-submit-inspection": submitInspection,
        "open-check-submit-sheet": openCheckSubmitSheet,
        "close-check-submit-sheet": closeCheckSubmitSheet,
        "submit-unsafe": submitUnsafeIssue,
        "submit-material": submitMissingMaterial,
        "new-unsafe": startNewUnsafeIssue,
        "open-unsafe-from-check": (event) => openUnsafeDraftFromCheck(event.target.closest("[data-check-unsafe-item]")?.dataset.checkUnsafeItem),
        "new-material": startNewMissingMaterial,
      }, action, event);
    }

    function dispatchPledgeManagerAction(action, event) {
      return runActionMap({
        "pledge-prev-day": () => setPledgeViewDate("prev"),
        "pledge-next-day": () => setPledgeViewDate("next"),
        "pledge-view-today": () => setPledgeViewDate("today"),
      }, action, event);
    }

    function dispatchHistoryAdminAction(action, event) {
      return runActionMap({
        "clear-history-ship-filter": clearHistoryShipFilter,
        "toggle-admin": toggleAdminMode,
        "reset-history": resetHistory,
        "reset-unsafe-records": resetUnsafeIssueRecords,
        "reset-material-records": resetMissingMaterialRecords,
        "delete-selected-history": deleteSelectedHistory,
        "load-more-history": loadMoreHistory,
        "retry-photo-upload": retryPendingPhotoUpload,
      }, action, event);
    }

    function dispatchManageMobileAction(action) {
      return runActionMap({
        "open-manage-mobile-filter": openManageMobileFilter,
        "cancel-manage-mobile-filter": closeManageMobileFilter,
        "apply-manage-mobile-filter": applyManageMobileFilter,
        "manage-mobile-notify": () => toast("담당자 알림 발송은 PC에서 문구·대상·최종 확인 후 진행합니다."),
      }, action);
    }

    function dispatchAction(action, event) {
      if (ADMIN_ACTIONS.has(action)) return dispatchAdminAction(action, event);
      return (
        dispatchManageMobileAction(action, event) ||
        dispatchWorkerSessionAction(action, event) ||
        dispatchPushAction(action, event) ||
        dispatchWorkPrepAction(action, event) ||
        dispatchShipDataAction(action, event) ||
        dispatchInspectionAction(action, event) ||
        dispatchPledgeManagerAction(action, event) ||
        dispatchHistoryAdminAction(action, event)
      );
    }

    document.addEventListener("submit", (event) => {
      const pushForm = event.target.closest("[data-push-employee-no-form]");
      if (pushForm) {
        event.preventDefault();
        submitWorkerPushEmployeeNo(event);
        return;
      }
      const form = event.target.closest("[data-login-form]");
      if (!form) return;
      event.preventDefault();
      submitWorkerLogin();
    });

    function handleDelegatedClick(event) {
      const syncDetailsTarget = event.target.closest("[data-sync-details]");
      if (syncDetailsTarget) {
        state.syncDetailsOpen = !state.syncDetailsOpen;
        renderPreservingScroll();
        return true;
      }
      const disabledReason = event.target.closest("[data-disabled-reason]");
      if (disabledReason) {
        const enabledAction = disabledReason.querySelector("button:not(:disabled)");
        if (enabledAction) return true;
        event.preventDefault();
        toast(disabledReason.dataset.disabledReason);
        return true;
      }

      const historyCard = event.target.closest("[data-history-detail-card]");
      if (historyCard && !event.target.closest("button,input,label,select,textarea")) {
        openHistoryDetail(historyCard.dataset.historyDetailCard);
        return true;
      }

      const workPrepCard = event.target.closest("[data-work-prep-record]");
      if (workPrepCard && !event.target.closest("button,input,label,select,textarea")) {
        openWorkPrepRecordForEdit(workPrepCard.dataset.workPrepRecord);
        return true;
      }

      const workPrepOtherWorkersGroup = event.target.closest("[data-work-prep-other-workers-group]");
      if (workPrepOtherWorkersGroup && !event.target.closest("input,label,select,textarea")) {
        state.workPrepOtherWorkersOpen = !state.workPrepOtherWorkersOpen;
        renderPreservingScroll();
        return true;
      }

      const photoViewerClose = event.target.closest("[data-photo-viewer-close]");
      if (photoViewerClose) {
        closePhotoViewer();
        return true;
      }

      const photoViewerTarget = event.target.closest("[data-photo-viewer-src]");
      if (photoViewerTarget) {
        openPhotoViewer(photoViewerTarget.dataset.photoViewerSrc, photoViewerTarget.dataset.photoViewerLabel);
        return true;
      }

      const unsafeCard = event.target.closest("[data-unsafe-record-detail]");
      if (unsafeCard && !event.target.closest("button,input,label,select,textarea")) {
        openUnsafeDetail(unsafeCard.dataset.unsafeRecordDetail);
        return true;
      }

      const materialCard = event.target.closest("[data-material-record-detail]");
      if (materialCard && !event.target.closest("button,input,label,select,textarea")) {
        openMaterialDetail(materialCard.dataset.materialRecordDetail);
        return true;
      }

      const workPrepDetailRow = event.target.closest("[data-work-prep-record-detail]");
      if (workPrepDetailRow && !event.target.closest("button,input,label,select,textarea")) {
        openWorkPrepDetail(workPrepDetailRow.dataset.workPrepRecordDetail);
        return true;
      }

      const analyticsRow = event.target.closest("[data-analytics-record-id]");
      if (analyticsRow && !event.target.closest("button,input,label,select,textarea")) {
        openAnalyticsRecord(analyticsRow.dataset.analyticsRecordKind, analyticsRow.dataset.analyticsRecordId);
        return true;
      }

      const workerCard = event.target.closest("[data-worker-card-toggle]");
      if (workerCard && !event.target.closest("button,input,label,select,textarea,.worker-edit-panel")) {
        toggleWorkerCard(workerCard.dataset.workerCardToggle);
        return true;
      }

      if (state.loginWorkerPickerOpen && !event.target.closest("[data-login-worker-picker]")) {
        state.loginWorkerPickerOpen = false;
        render();
        return true;
      }
      return false;
    }

    function handleSyncButtonClick(button) {
      if (button.dataset.action === "close-sync-details") {
        state.syncDetailsOpen = false;
        renderPreservingScroll();
        return true;
      }
      if (button.dataset.retrySyncJob) {
        retryPendingSyncJob(button.dataset.retrySyncJob);
        return true;
      }
      if (button.dataset.discardSyncJob) {
        discardPendingSyncJob(button.dataset.discardSyncJob);
        return true;
      }
      return false;
    }

    function handleWorkerBoardButtonClick(button) {
      if (button.dataset.monthlyWorkerMonth) {
        setMonthlyWorkerMonth(button.dataset.monthlyWorkerMonth);
        return true;
      }
      if (button.dataset.action === "toggle-login-worker-picker") {
        state.loginWorkerPickerOpen = !state.loginWorkerPickerOpen;
        if (state.loginWorkerPickerOpen) state.loginWorkerSearch = "";
        render();
        return true;
      }
      if (button.dataset.loginRememberWorker) {
        state.loginWorkerId = button.dataset.loginRememberWorker;
        state.loginWorkerPickerOpen = false;
        state.loginWorkerSearch = "";
        render();
        requestAnimationFrame(() => $("loginEmployeeNo")?.focus());
        return true;
      }
      if (button.dataset.loginWorkerSelect) {
        state.loginWorkerId = button.dataset.loginWorkerSelect;
        state.loginWorkerPickerOpen = false;
        state.loginWorkerSearch = "";
        render();
        requestAnimationFrame(() => $("loginEmployeeNo")?.focus());
        return true;
      }
      if (button.dataset.monthlyWorkerToggle) {
        toggleMonthlyWorkerCard(button.dataset.monthlyWorkerToggle);
        return true;
      }
      if (button.dataset.action === "toggle-monthly-rest-settings") {
        state.monthlyRestDayPanelOpen = !state.monthlyRestDayPanelOpen;
        render();
        return true;
      }
      if (button.dataset.action === "retry-monthly-worker-analytics") {
        const range = currentMonthRange(selectedMonthlyWorkerMonth());
        ensureInspectionRangeLoaded(range.start, range.end, true);
        render();
        return true;
      }
      if (button.dataset.action === "add-monthly-rest-day") {
        addCustomMonthlyRestDay(document.querySelector("[data-monthly-custom-rest-date]")?.value || "");
        return true;
      }
      if (button.dataset.deleteMonthlyRestDay) {
        deleteCustomMonthlyRestDay(button.dataset.deleteMonthlyRestDay);
        return true;
      }
      return false;
    }

    function handleRecordShortcutButtonClick(button) {
      if (button.dataset.unsafeRecordDetail) {
        openUnsafeDetail(button.dataset.unsafeRecordDetail);
        return true;
      }
      if (button.dataset.materialRecordDetail) {
        openMaterialDetail(button.dataset.materialRecordDetail);
        return true;
      }
      if (button.dataset.exportRecords) {
        exportRecords(button.dataset.exportRecords);
        return true;
      }
      return false;
    }

    function handlePledgeButtonClick(button) {
      if (button.dataset.selectPledgeWorker) {
        selectPledgeWorker(button.dataset.selectPledgeWorker);
        return true;
      }
      if (button.dataset.action === "expand-pledge-worker") {
        state.pledgeWorkerCollapsed = false;
        renderPreservingScroll();
        return true;
      }
      if (button.dataset.action === "expand-pledge-ship") {
        state.pledgeShipCollapsed = false;
        renderPreservingScroll();
        return true;
      }
      if (button.dataset.action === "toggle-other-workers") {
        state.workerFallbackOpen = !state.workerFallbackOpen;
        render();
        return true;
      }
      if (button.dataset.selectPledgeShip) {
        state.draft.shipNo = button.dataset.selectPledgeShip;
        saveJson("draft", state.draft);
        state.pledgeShipCollapsed = true;
        renderPreservingScroll();
        return true;
      }
      return false;
    }

    function handleUnsafeDraftButtonClick(button) {
      if (button.dataset.unsafeSelectShip) {
        state.unsafeDraft.shipNo = button.dataset.unsafeSelectShip;
        saveUnsafeDraft();
        render();
        return true;
      }
      if (button.dataset.unsafeSelectWorker) {
        state.unsafeDraft.workerId = button.dataset.unsafeSelectWorker;
        saveUnsafeDraft();
        render();
        return true;
      }
      if (button.dataset.removeUnsafePhoto !== undefined) {
        removeUnsafePhotoFile(Number(button.dataset.removeUnsafePhoto));
        return true;
      }
      if (button.dataset.unsafeEditStep) {
        state.unsafeDraft.step = Number(button.dataset.unsafeEditStep) || 1;
        saveUnsafeDraft();
        render();
        scrollScreenTop();
        return true;
      }
      if (button.dataset.unsafeStepBack !== undefined) {
        state.unsafeDraft.step = Math.max(unsafeDraftStep() - 1, 1);
        saveUnsafeDraft();
        render();
        scrollScreenTop();
        return true;
      }
      if (button.dataset.unsafeNext !== undefined) {
        syncUnsafeDraftFromDom();
        saveUnsafeDraft();
        if (!unsafeStepReady()) { toast(button.dataset.requiredMessage || "필수 항목을 먼저 입력하세요."); return true; }
        state.unsafeDraft.step = Math.min(unsafeDraftStep() + 1, 3);
        saveUnsafeDraft();
        render();
        scrollScreenTop();
        return true;
      }
      return false;
    }

    function handleMaterialDraftButtonClick(button) {
      if (button.dataset.materialSelectShip) {
        state.materialDraft.shipNo = button.dataset.materialSelectShip;
        saveMaterialDraft();
        render();
        return true;
      }
      if (button.dataset.materialSelectType) {
        state.materialDraft.materialType = button.dataset.materialSelectType;
        saveMaterialDraft();
        render();
        return true;
      }
      if (button.dataset.materialSelectWorker) {
        state.materialDraft.workerId = button.dataset.materialSelectWorker;
        saveMaterialDraft();
        render();
        return true;
      }
      if (button.dataset.materialEditStep) {
        state.materialDraft.step = Number(button.dataset.materialEditStep) || 1;
        saveMaterialDraft();
        render();
        scrollScreenTop();
        return true;
      }
      if (button.dataset.materialStepBack !== undefined) {
        state.materialDraft.step = Math.max(materialDraftStep() - 1, 1);
        saveMaterialDraft();
        render();
        scrollScreenTop();
        return true;
      }
      if (button.dataset.materialNext !== undefined) {
        syncMaterialDraftFromDom();
        saveMaterialDraft();
        if (!materialStepReady()) { toast(button.dataset.requiredMessage || "필수 항목을 먼저 입력하세요."); return true; }
        state.materialDraft.step = Math.min(materialDraftStep() + 1, 4);
        saveMaterialDraft();
        render();
        scrollScreenTop();
        return true;
      }
      return false;
    }

    function handleViewNavigationClick(button) {
      if (button.dataset.view) {
        if (button.dataset.view === "manage") {
          state.manageTab = "unsafe";
          state.unsafeDetailId = "";
          state.materialDetailId = "";
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
        state.workerFallbackOpen = false;
        state.pledgeWorkerCollapsed = false;
        state.pledgeShipCollapsed = false;
        resetToolPrepDraft();
        state.draft.shipNo = "";
        state.draft.directShipSelectionComplete = false;
        state.shipSearchQuery = "";
        saveJson("draft", state.draft);
        render();
        scrollScreenTop();
        pushRouteState();
      }
      if (button.dataset.action === "back-check-types") {
        state.selectedCategoryId = null;
        state.workerFallbackOpen = false;
        state.pledgeWorkerCollapsed = false;
        state.pledgeShipCollapsed = false;
        resetToolPrepDraft();
        render();
        scrollScreenTop();
        pushRouteState();
      }
      if (button.dataset.selectCheckShip) {
        state.draft.shipNo = button.dataset.selectCheckShip;
        saveJson("draft", state.draft);
        renderPreservingScroll();
      }
      if (button.dataset.action === "continue-check-ship") {
        if (!state.draft.shipNo) return toast("다음 단계로 이동하려면 작업 호선을 선택하세요.");
        state.draft.directShipSelectionComplete = true;
        saveJson("draft", state.draft);
        render();
        scrollScreenTop();
      }
      if (button.dataset.action === "back-check-ship") {
        state.draft.toolPrepComplete = false;
        state.draft.directShipSelectionComplete = false;
        saveJson("draft", state.draft);
        render();
        scrollScreenTop();
        return;
      }
      if (button.dataset.action === "back-tool-prep") {
        state.draft.toolPrepComplete = false;
        render();
        scrollScreenTop();
      }
      if (button.dataset.action === "continue-tool-prep") {
        state.draft.toolPrepComplete = true;
        state.pledgeWorkerCollapsed = false;
        state.pledgeShipCollapsed = false;
        render();
        scrollScreenTop();
      }
    }

    function handleHistoryManageButtonClick(button) {
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
        state.manageMobileFilterOpen = false;
        state.manageMobileFilterDraft = null;
        state.unsafeDetailId = "";
        state.materialDetailId = "";
        state.workPrepDetailId = "";
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
      if (button.dataset.action === "back-material-list") {
        state.materialDetailId = "";
        render();
        scrollScreenTop();
      }
      if (button.dataset.action === "back-work-prep-list") {
        state.workPrepDetailId = "";
        renderPreservingScroll();
      }
      return false;
    }

    function handleAdminRecordButtonClick(button) {
      if (button.dataset.action === "add-worker") addWorker();
      if (button.dataset.saveWorker) saveWorker(button.dataset.saveWorker);
      if (button.dataset.deleteWorker) deleteWorker(button.dataset.deleteWorker);
      if (button.dataset.saveRecordStatus) saveAdminRecord(button.dataset.saveRecordStatus, { requireStatusChange: true });
      if (button.dataset.saveRecord) saveAdminRecord(button.dataset.saveRecord);
      if (button.dataset.deleteRecord) deleteAdminRecord(button.dataset.deleteRecord);
      if (button.dataset.action === "focus-ship-add") {
        $("newShipNos")?.scrollIntoView({ behavior: "smooth", block: "center" });
        $("newShipNos")?.focus();
      }
      if (button.dataset.deleteShip) deleteShip(button.dataset.deleteShip);
      return false;
    }

    function handleCategoryToolButtonClick(button) {
      if (button.dataset.pickColor) {
        document.querySelectorAll("[data-pick-color]").forEach((node) => node.classList.toggle("active", node === button));
        const colorInput = $("catColor");
        if (colorInput) colorInput.value = button.dataset.pickColor;
      }
      if (button.dataset.editCategoryColor) {
        const categoryId = button.dataset.editCategoryColorId || "";
        document.querySelectorAll("[data-edit-category-color-id]").forEach((node) => {
          node.classList.toggle("active", node.dataset.editCategoryColorId === categoryId && node === button);
        });
      }
      if (button.dataset.pickIcon) {
        const targetId = button.dataset.pickIconTarget || "catIcon";
        document.querySelectorAll(`[data-pick-icon-target="${targetId}"]`).forEach((node) => node.classList.toggle("active", node === button));
        const target = $(targetId);
        if (target) target.value = button.dataset.pickIcon;
        if (targetId.startsWith("editCategoryIcon_")) toast("아이콘을 선택했습니다. 아래의 '선택한 아이콘 적용'을 눌러 저장하세요.");
      }
      if (button.dataset.applyCategoryIcon) saveCategory(button.dataset.applyCategoryIcon);
      if (button.dataset.action === "save-category-icon") saveCategoryIcon();
      if (button.dataset.action === "toggle-category-add") {
        if (!requireAdminWrite()) return true;
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
        if (state.toolAddSubmitting) return true;
        if (!requireAdminWrite()) return true;
        state.toolManagerOpen = true;
        state.toolAddOpen = !state.toolAddOpen;
        state.editToolId = null;
        render();
      }
      if (button.dataset.action === "add-tool") addTool();
      if (button.dataset.editTool) {
        if (!requireAdminWrite()) return true;
        state.toolManagerOpen = true;
        state.editToolId = button.dataset.editTool;
        state.toolAddOpen = false;
        render();
      }
      if (button.dataset.action === "toggle-tool-manager") {
        state.toolManagerOpen = !state.toolManagerOpen;
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
      if (button.dataset.selectWorkType) {
        state.workTypeManagerSelectedId = button.dataset.selectWorkType;
        state.workTypeManagerMobileDetailOpen = true;
        state.editCategoryId = null;
        state.editSectionId = null;
        state.editItemId = null;
        state.openManageSectionId = null;
        state.openAddItemSectionIds = [];
        state.categoryToolSearchQuery = "";
        render();
      }
      if (button.dataset.workTypeTab) {
        state.workTypeManagerTab = button.dataset.workTypeTab;
        if (state.workTypeManagerTab !== "sections") {
          state.editSectionId = null;
          state.editItemId = null;
          state.openManageSectionId = null;
          state.openAddItemSectionIds = [];
        }
        state.categoryToolSearchQuery = "";
        render();
      }
      if (button.dataset.action === "back-work-type-list") {
        state.workTypeManagerMobileDetailOpen = false;
        render();
      }
      if (button.dataset.copyCategoryTools) copyCategoryTools(button.dataset.copyCategoryTools);
      if (button.dataset.editWorkTypeSection) {
        if (!requireAdminWrite()) return false;
        const sectionId = button.dataset.editWorkTypeSection;
        const section = sectionsFor(state.workTypeManagerSelectedId).find((row) => row.id === sectionId);
        if (!section) return false;
        const closing = state.openManageSectionId === sectionId;
        if (closing) clearSectionEditorDraft(sectionId);
        else beginSectionEditor(section);
        state.openManageSectionId = closing ? null : sectionId;
        state.editSectionId = closing ? null : sectionId;
        state.editItemId = null;
        state.openAddItemSectionIds = [];
        render();
      }
      if (button.dataset.manageCategory) {
        state.manageCategoryId = button.dataset.manageCategory;
        state.editCategoryId = null;
        state.editSectionId = null;
        state.editItemId = null;
        state.categoryAddOpen = false;
        state.openAddItemSectionIds = [];
        state.openManageSectionId = sectionsFor(state.manageCategoryId)[0]?.id || null;
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
        state.editItemId = null;
        state.openAddItemSectionIds = [];
        state.openManageSectionId = null;
        state.categoryAddOpen = false;
        state.categoryVisualOpen = false;
        render();
      }
      return false;
    }

    function handleSectionItemButtonClick(button) {
      if (button.dataset.action === "add-section") addSection();
      if (button.dataset.toggleManageSection) {
        const sectionId = button.dataset.toggleManageSection;
        state.openManageSectionId = state.openManageSectionId === sectionId ? null : sectionId;
        state.editSectionId = null;
        state.editItemId = null;
        state.openAddItemSectionIds = [];
        render();
      }
      if (button.dataset.editSection) {
        state.openManageSectionId = button.dataset.editSection;
        editSection(button.dataset.editSection);
      }
      if (button.dataset.saveSection) saveSection(button.dataset.saveSection);
      if (button.dataset.deleteSection) deleteSection(button.dataset.deleteSection);
      if (button.dataset.toggleAddItem) {
        const sectionId = button.dataset.toggleAddItem;
        state.openManageSectionId = sectionId;
        const open = new Set(state.openAddItemSectionIds);
        open.has(sectionId) ? open.delete(sectionId) : open.add(sectionId);
        state.openAddItemSectionIds = [...open];
        render();
      }
      if (button.dataset.editItem) {
        const row = state.items.find((item) => item.id === button.dataset.editItem);
        if (row) {
          state.openManageSectionId = row.sectionId;
          state.editItemId = row.id;
          state.editSectionId = null;
          render();
        }
      }
      if (button.dataset.addItem) addChecklistItem(button.dataset.addItem);
      if (button.dataset.saveItem) saveChecklistItem(button.dataset.saveItem);
      if (button.dataset.deleteItem) deleteChecklistItem(button.dataset.deleteItem);
      if (button.dataset.toolPrepToggle) {
        const selected = new Set(sanitizeToolIds(state.draft.selectedToolIds));
        if (selected.has(button.dataset.toolPrepToggle)) selected.delete(button.dataset.toolPrepToggle);
        else selected.add(button.dataset.toolPrepToggle);
        state.draft.selectedToolIds = [...selected];
        saveJson("draft", state.draft);
        render();
      }
      if (button.dataset.action === "toggle-all-tool-prep") {
        const category = categoryById(state.selectedCategoryId);
        if (!category || state.draft.workPrepRecordId) return;
        const tools = visibleToolsForCategory(category.id);
        const toolIds = tools.map((tool) => tool.id);
        const selected = new Set(sanitizeToolIds(state.draft.selectedToolIds));
        const allSelected = toolIds.length > 0 && toolIds.every((toolId) => selected.has(toolId));
        toolIds.forEach((toolId) => {
          if (allSelected) selected.delete(toolId);
          else selected.add(toolId);
        });
        state.draft.selectedToolIds = [...selected];
        saveJson("draft", state.draft);
        render();
      }
      if (button.dataset.action === "cancel-edit-section") {
        clearSectionEditorDraft();
        state.editSectionId = null;
        if (!state.manageCategoryId && state.workTypeManagerTab === "sections") state.openManageSectionId = null;
        render();
      }
      if (button.dataset.action === "cancel-edit-item") {
        state.editItemId = null;
        render();
      }
      return false;
    }

    function handleSectionSignButtonClick(button) {
      if (button.matches("[data-section-sign-open]")) {
        const dialog = button.closest(".check-section-sign-wrap")?.querySelector("[data-section-sign-dialog]");
        if (!dialog?.showModal) return false;
        dialog.addEventListener("close", () => button.focus(), { once: true });
        dialog.showModal();
        dialog.querySelector("[data-section-sign-close]")?.focus();
        return true;
      }
      if (button.matches("[data-section-sign-close]")) {
        const dialog = button.closest("[data-section-sign-dialog]");
        const opener = dialog?.closest(".check-section-sign-wrap")?.querySelector("[data-section-sign-open]");
        dialog?.close();
        opener?.focus();
        return true;
      }
      return false;
    }

    document.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (button && !confirmSectionEditorDiscard(button)) {
        event.preventDefault();
        return;
      }
      if (handleDelegatedClick(event)) return;
      if (!button) return;

      if (handleSyncButtonClick(button)) return;
      if (handleWorkerBoardButtonClick(button)) return;
      if (handleRecordShortcutButtonClick(button)) return;
      if (handlePledgeButtonClick(button)) return;
      if (handleUnsafeDraftButtonClick(button)) return;
      if (handleMaterialDraftButtonClick(button)) return;
      if (handleSectionSignButtonClick(button)) return;
      if (button.dataset.submitBlocker) {
        focusSubmitBlocker(button.dataset.submitBlocker);
        return;
      }
      if (button.dataset.recordFilter) {
        updateRecordFilter(button.dataset.recordFilter, button.value || "");
        return;
      }

      handleViewNavigationClick(button);
      if (button.dataset.action && dispatchAction(button.dataset.action, event)) return;
      if (handleHistoryManageButtonClick(button)) return;
      if (handleAdminRecordButtonClick(button)) return;
      if (handleCategoryToolButtonClick(button)) return;
      if (handleSectionItemButtonClick(button)) return;
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.pushTemplateEditorKind) {
        event.preventDefault();
        closePushTemplateEditor();
        return;
      }
      if (event.key === "Escape" && state.photoViewer) {
        event.preventDefault();
        closePhotoViewer();
        return;
      }
      if (event.key !== "Enter" && event.key !== " ") return;
      const syncDetailsTarget = event.target.closest("[data-sync-details]");
      if (syncDetailsTarget) {
        event.preventDefault();
        state.syncDetailsOpen = !state.syncDetailsOpen;
        renderPreservingScroll();
        return;
      }
      const disabledReason = event.target.closest("[data-disabled-reason]");
      if (disabledReason) {
        event.preventDefault();
        toast(disabledReason.dataset.disabledReason);
        return;
      }

      const historyCard = event.target.closest("[data-history-detail-card]");
      const photoViewerTarget = event.target.closest("[data-photo-viewer-src]");
      const unsafeCard = event.target.closest("[data-unsafe-record-detail]");
      const workPrepDetailRow = event.target.closest("[data-work-prep-record-detail]");
      const workPrepCard = event.target.closest("[data-work-prep-record]");
      const analyticsRow = event.target.closest("[data-analytics-record-id]");
      if (photoViewerTarget) {
        event.preventDefault();
        openPhotoViewer(photoViewerTarget.dataset.photoViewerSrc, photoViewerTarget.dataset.photoViewerLabel);
        return;
      }
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
      if (workPrepDetailRow && !event.target.closest("button,input,label,select,textarea")) {
        event.preventDefault();
        openWorkPrepDetail(workPrepDetailRow.dataset.workPrepRecordDetail);
        return;
      }
      if (workPrepCard && !event.target.closest("button,input,label,select,textarea")) {
        event.preventDefault();
        openWorkPrepRecordForEdit(workPrepCard.dataset.workPrepRecord);
        return;
      }
      if (analyticsRow && !event.target.closest("button,input,label,select,textarea")) {
        event.preventDefault();
        openAnalyticsRecord(analyticsRow.dataset.analyticsRecordKind, analyticsRow.dataset.analyticsRecordId);
        return;
      }
    });

    function openAnalyticsRecord(kind, id) {
      if (kind === "unsafe") {
        openUnsafeDetail(id);
        return;
      }
      if (kind === "materials") openMaterialDetail(id);
    }

    async function openUnsafeDetail(id) {
      if (!id) return;
      state.manageTab = "unsafe";
      saveJson("manageTab", state.manageTab);
      let shouldLoadPhotos = false;
      if (state.view === "manage") {
        state.unsafeDetailId = state.unsafeDetailId === id ? "" : id;
        shouldLoadPhotos = state.unsafeDetailId === id;
        renderPreservingScroll();
        pushRouteState();
      } else {
        state.unsafeDetailId = id;
        shouldLoadPhotos = true;
        changeView("manage");
      }
      if (!shouldLoadPhotos) return;
      try {
        await loadIssuePhotosForDetail(id);
        if (state.unsafeDetailId === id) renderPreservingScroll();
      } catch (error) {
        console.warn("issue photo detail load failed", error);
      }
    }

    function openPhotoViewer(src, label) {
      if (!src) return;
      state.photoViewer = { src, label: label || "현장 사진" };
      renderPreservingScroll();
    }

    function closePhotoViewer() {
      state.photoViewer = null;
      renderPreservingScroll();
    }

    function openPushTemplateEditor(event) {
      if (!requireAdminWrite()) return;
      const button = event?.target?.closest("[data-push-template-kind]");
      const kind = normalizePushTemplateKind(button?.dataset?.pushTemplateKind || "");
      if (!kind) return toast("푸시 문구 종류를 확인할 수 없습니다.");
      state.pushTemplateEditorKind = kind;
      renderPreservingScroll();
      requestAnimationFrame(() => $("pushTemplateTitleInput")?.focus());
    }

    function closePushTemplateEditor() {
      state.pushTemplateEditorKind = "";
      renderPreservingScroll();
    }

    function savePushTemplateEditor() {
      if (!requireAdminWrite()) return;
      const kind = normalizePushTemplateKind(state.pushTemplateEditorKind);
      if (!kind) return toast("푸시 문구 종류를 확인할 수 없습니다.");
      const title = $("pushTemplateTitleInput")?.value?.trim() || "";
      const body = $("pushTemplateBodyInput")?.value?.trim() || "";
      if (!title || !body) return toast("제목과 내용을 입력하세요.");
      savePushNotificationTemplate(kind, { title, body });
      state.pushTemplateEditorKind = "";
      renderPreservingScroll();
      toast("푸시 문구를 저장했습니다.");
    }

    function resetPushTemplateEditor() {
      if (!requireAdminWrite()) return;
      const kind = normalizePushTemplateKind(state.pushTemplateEditorKind);
      if (!kind) return toast("푸시 문구 종류를 확인할 수 없습니다.");
      savePushNotificationTemplate(kind, DEFAULT_PUSH_NOTIFICATION_TEMPLATES[kind]);
      renderPreservingScroll();
      toast("기본 푸시 문구로 되돌렸습니다.");
    }

    function openMaterialDetail(id) {
      const row = state.missingMaterials.find((item) => item.id === id);
      if (!row) return;
      state.manageTab = "materials";
      saveJson("manageTab", state.manageTab);
      if (state.view === "manage") {
        state.materialDetailId = state.materialDetailId === id ? "" : id;
        renderPreservingScroll();
        pushRouteState();
      } else {
        state.materialFilters.shipNo = row.shipNo || "";
        state.materialFilters.status = row.status || "";
        state.materialFilters.materialName = "";
        saveJson("materialFilters", state.materialFilters);
        state.materialDetailId = id;
        changeView("manage");
      }
    }

    function openWorkPrepDetail(id) {
      const row = state.workPrepRecords.find((item) => item.id === id);
      if (!row) return;
      state.manageTab = "workPrep";
      saveJson("manageTab", state.manageTab);
      if (state.view === "manage") {
        state.workPrepDetailId = state.workPrepDetailId === id ? "" : id;
        renderPreservingScroll();
        pushRouteState();
      } else {
        state.workPrepFilters.shipNo = row.shipNo || "";
        state.workPrepFilters.status = normalizeWorkPrepStatus(row.status) || "";
        saveJson("workPrepFilters", state.workPrepFilters);
        state.workPrepDetailId = id;
        changeView("manage");
      }
    }

    function selectPledgeWorker(id) {
      const worker = state.workers.find((row) => row.id === id);
      if (!worker) return;
      const previousWorker = state.draft.worker;
      state.draft.worker = worker.name;
      if (normalizedWorkerName(previousWorker) !== normalizedWorkerName(state.draft.worker)) state.draft.pledgeSignature = "";
      preloadCachedPledgeSignature();
      saveJson("draft", state.draft);
      state.pledgeWorkerCollapsed = true;
      renderPreservingScroll();
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

    async function openHistoryDetail(id) {
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
      try {
        await loadInspectionItemsForDetail(id);
        if (state.historyDetailId === id) renderPreservingScroll();
      } catch (error) {
        console.warn("inspection item detail load failed", error);
      }
    }

    document.addEventListener("input", (event) => {
      if (event.target.matches("[data-section-editor-field]")) {
        updateSectionEditorDraft(event.target.dataset.sectionEditorId, event.target.dataset.sectionEditorField, event.target.value);
      }
      if (event.target.matches("[data-admin-push-field]")) {
        updateAdminPushDraftField(event.target.dataset.adminPushField, event.target.value);
      }
      if (event.target.id === "worker") {
        const previousWorker = state.draft.worker;
        state.draft.worker = event.target.value;
        if (normalizedWorkerName(previousWorker) !== normalizedWorkerName(state.draft.worker)) {
          state.draft.pledgeSignature = "";
          state.draft.pledgeSignatureCleared = false;
        }
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
        state.draft.pledgeSignatureCleared = !state.draft.pledgeSignature.trim();
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
      if (event.target.matches("[data-work-type-search]")) {
        state.workTypeSearchQuery = event.target.value;
        applyWorkTypeSearchFilter();
      }
      if (event.target.matches("[data-category-tool-search]")) {
        state.categoryToolSearchQuery = event.target.value;
        applyCategoryToolSearchFilter();
      }
      if (event.target.matches("[data-login-worker-search]")) {
        state.loginWorkerSearch = event.target.value;
        applyLoginWorkerSearchFilter();
      }
      if (event.target.matches("[data-check-item]")) {
        const itemId = event.target.dataset.checkItem;
        state.draft.checks[itemId] = event.target.checked;
        saveJson("draft", state.draft);
        if (!updateCheckItemDom(itemId, event.target.checked)) render();
      }
      if (event.target.matches("[data-check-section-master]")) {
        const sectionId = event.target.dataset.checkSectionMaster;
        const checked = event.target.checked;
        const model = currentCheckRenderState();
        if (!model) return;
        const sectionItems = model.items.filter((row) => row.sectionId === sectionId);
        sectionItems.forEach((row) => {
          state.draft.checks[row.id] = checked;
        });
        saveJson("draft", state.draft);
        let ok = sectionItems.length > 0;
        sectionItems.forEach((row) => {
          if (!updateCheckItemDom(row.id, checked)) ok = false;
        });
        if (!ok) render();
      }
    });

    document.addEventListener("change", (event) => {
      if (event.target.matches("[data-manage-mobile-filter]")) {
        const key = event.target.dataset.manageMobileFilter;
        if (state.manageMobileFilterOpen && state.manageMobileFilterDraft && key) {
          state.manageMobileFilterDraft[key] = event.target.value;
          renderPreservingScroll();
        }
        return;
      }
      if (event.target.matches("[data-section-editor-field]")) {
        updateSectionEditorDraft(event.target.dataset.sectionEditorId, event.target.dataset.sectionEditorField, event.target.value);
      }
      if (event.target.matches("[data-section-sign-preview]")) {
        const preview = document.getElementById(event.target.dataset.sectionSignPreview);
        const image = preview?.querySelector("img");
        const label = preview?.querySelector("span");
        const signCode = event.target.value;
        if (!preview || !image || !label) return;
        if (/^[PMSW]-(?:0[1-9]|1[0-2])$/.test(signCode)) {
          image.src = `assets/pictograms/signs/${signCode}.png`;
          label.textContent = signCode;
          preview.hidden = false;
        } else {
          image.removeAttribute("src");
          label.textContent = "";
          preview.hidden = true;
        }
        return;
      }
      if (event.target.matches("[data-section-score-preview]")) {
        const sectionId = event.target.dataset.sectionEditorId;
        const draft = state.sectionEditorDraft?.sectionId === sectionId ? state.sectionEditorDraft : null;
        const output = document.getElementById(event.target.dataset.sectionScorePreview);
        const frequency = normalizeSectionEditorScore(draft?.frequency);
        const severity = normalizeSectionEditorScore(draft?.severity);
        if (output) output.textContent = frequency != null && severity != null ? String(frequency * severity) : "-";
        return;
      }
      if (event.target.matches("[data-pledge-view-date]")) {
        setPledgeViewDate("pick", event.target.value);
        return;
      }
      if (event.target.matches("[data-admin-push-field]")) {
        updateAdminPushDraftField(event.target.dataset.adminPushField, event.target.value);
        renderPreservingScroll();
        return;
      }
      if (event.target.matches("[data-admin-push-worker]")) {
        toggleAdminPushWorker(event.target.dataset.adminPushWorker, event.target.checked);
        return;
      }
      if (event.target.matches("[data-category-tool-group]")) {
        updateCategoryToolDraft(event.target.dataset.categoryToolGroup, event.target.value, event.target.checked);
        return;
      }
      if (event.target.matches("[data-work-prep-field]")) {
        updateWorkPrepDraftField(event.target.dataset.workPrepField, event.target.value);
        return;
      }
      if (event.target.matches("[data-work-prep-worker]")) {
        toggleWorkPrepWorker(event.target.dataset.workPrepWorker, event.target.checked);
        return;
      }
      if (event.target.matches("[data-work-prep-other-worker]")) {
        toggleOtherTeamWorkPrepWorker(event.target.dataset.workPrepOtherWorker, event.target.checked);
        return;
      }
      if (event.target.matches("[data-work-prep-tool]")) {
        toggleWorkPrepTool(event.target.dataset.workPrepTool, event.target.checked);
        return;
      }
      if (event.target.matches("[data-work-prep-appearance-time]")) {
        updateWorkPrepAppearanceTime(event.target.value);
        return;
      }
      if (event.target.matches("[data-work-prep-status]")) {
        updateWorkPrepAdminStatus(event.target.dataset.workPrepStatus, event.target.value);
        return;
      }
      if (event.target.id === "otherWorkerSelect") {
        selectPledgeWorker(event.target.value);
        return;
      }
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
      if (event.target.dataset.unsafePhotoInput) {
        const incoming = Array.from(event.target.files || []);
        const beforeCount = state.unsafePhotoFiles.length;
        state.unsafePhotoFiles = mergeUnsafePhotoFiles(incoming);
        if (incoming.length + beforeCount > ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS) {
          toast(`사진은 최대 ${ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS}개까지 첨부할 수 있습니다.`);
        }
        updateUnsafePhotoDraftFromFiles();
        render();
      }
      if (event.target.dataset.retryPhotoFile) {
        retryPendingPhotoUploadWithFiles(event.target.dataset.retryPhotoFile, Array.from(event.target.files || []));
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
      if (event.target.matches("[data-import-ships-file]")) {
        importShipsFromFile(event.target.files?.[0]);
        event.target.value = "";
      }
    });

    document.addEventListener("error", (event) => {
      const image = event.target;
      if (!image?.matches?.("[data-section-sign-image]")) return;
      const preview = image.closest(".section-sign-preview");
      if (preview) preview.hidden = true;
      else image.hidden = true;
    }, true);

    async function submitInspection() {
      if (state.inspectionSubmitting) return toast("점검 제출 중입니다. 잠시만 기다려주세요.");
      const cat = categoryById(state.selectedCategoryId);
      if (!cat) return toast("점검 작업 유형을 다시 선택하세요.");
      const items = filteredChecklistItems(cat.id);
      const pledgeRulesCount = pledgeRules().length;
      const pledgeChecked = pledgeRules().filter((_, index) => state.draft.pledgeChecks[index]).length;
      const signatureText = signatureLabel();
      const validationError = InspectionRules.validateInspectionDraft({
        worker: state.draft.worker,
        shipNo: state.draft.shipNo,
        items,
        checks: state.draft.checks,
        pledgeRulesCount,
        pledgeCheckedCount: pledgeChecked,
        signatureText,
      });
      if (validationError) return toast(validationError);
      state.inspectionSubmitting = true;
      const submitButton = document.querySelector("[data-action='final-submit-inspection']");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "제출 중";
      }

      try {
        const now = serverNow();
        const summary = InspectionRules.summarizeInspectionChecks(items, state.draft.checks);
        const inspectionId = uid("inspection");
        const completion = summary.completion;
        const warnings = summary.warnings;
        const selectedTools = sanitizeToolIds(state.draft.selectedToolIds)
          .map((id) => toolById(id))
          .filter((tool) => tool && tool.deleted !== true)
          .map((tool) => ({ id: tool.id, name: tool.name }));
        const signatureImage = isSignatureImage(state.draft.pledgeSignature) ? state.draft.pledgeSignature : "";
        const pledgeText = `${pledgeRules().map((rule) => `[확인] ${rule}`).join("\n")}\n서명: ${signatureText}`;
        const workPrepRecordId = state.draft.workPrepRecordId || "";
        const workPrepRecord = workPrepRecordId ? workPrepRecordById(workPrepRecordId) : null;
        const workPrepWorkerId = state.draft.workPrepWorkerId || inspectionWorkPrepWorkerId({ worker: state.draft.worker, workPrepRecordId }, workPrepRecord);
        const inspection = {
          id: inspectionId,
          categoryId: cat.id,
          categoryLabel: cat.label || "",
          categoryIcon: cat.icon || "",
          categoryColor: cat.color || "",
          workerId: state.workerSession?.workerId || "",
          worker: state.draft.worker.trim(),
          shipNo: state.draft.shipNo,
          safetyPledge: pledgeText,
          signatureImage,
          signatureText: signatureImage ? "" : signatureText,
          date: localDate(now),
          time: recordTime(now),
          status: summary.status,
          warnings,
          completion,
          tools: selectedTools,
          workPrepRecordId,
          workPrepWorkerId,
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
        if (workPrepRecordId) updateWorkPrepRecordUsageFromSubmissions(workPrepRecordId);

        state.lastInspectionId = inspectionId;
        state.draft = createDraft();
        state.selectedCategoryId = null;
        persist();
        state.inspectionSubmitting = false;
        const syncPromise = syncInspectionHistory(inspection, inspectionItems);
        changeView("pledgeComplete");
        toast("점검은 기기에 저장되었습니다. 서버 반영 상태를 확인합니다.");
        syncPromise.catch((error) => {
          console.error(error);
          setSyncStatus("재시도 대기", "pending");
          refreshVisiblePendingSyncStatus();
        });
      } catch (error) {
        state.inspectionSubmitting = false;
        console.error(error);
        toast("점검 제출 중 오류가 발생했습니다.");
        refreshCheckSubmitControls();
      }
    }

    async function submitUnsafeIssue() {
      if (state.unsafeSubmitting) return toast("불안전요소 접수 중입니다. 잠시만 기다려주세요.");
      syncUnsafeDraftFromDom();
      saveUnsafeDraft();
      const missing = unsafeMissingFields(3);
      if (missing.length) return toast(flowRequiredText(missing));
      const errors = ISSUE_MATERIAL_RULES.validateUnsafeDraft(state.unsafeDraft);
      if (errors.length) return toast(errors[0]);
      const inputFiles = Array.from(document.querySelectorAll("[data-unsafe-photo-input]")).flatMap((input) => Array.from(input.files || []));
      const files = state.unsafePhotoFiles?.length ? state.unsafePhotoFiles : inputFiles;
      if (files.length > ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS) return toast(`사진은 최대 ${ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS}개까지 첨부할 수 있습니다.`);
      if (!files.length && !confirm("사진 없이 등록하시겠습니까?")) return;
      state.unsafeSubmitting = true;
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
        expectedPhotoCount: files.length,
      };
      row.statusHistory = ISSUE_MATERIAL_RULES.buildRecordTimeline(row, { initialStatus: ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[0] });
      state.unsafeIssues.unshift(row);
      state.lastUnsafeIssueId = id;
      state.unsafeDraft = createUnsafeDraft();
      state.unsafePhotoFiles = [];
      if (files.length) markUnsafePhotoUploading(id, true);
      persist();
      render();
      scrollScreenTop();
      replaceRouteState();
      toast(files.length ? "불안전요소가 접수되었습니다. 사진 업로드 중입니다." : "불안전요소가 접수되었습니다.");
      notifyUnsafeIssueRegistered(row);
      try {
        await syncUnsafeIssue(row, files);
      } finally {
        state.unsafeSubmitting = false;
      }
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
      state.lastMaterialNotificationState = "sending";
      state.materialDraft = createMaterialDraft();
      persist();
      const notificationPromise = syncMissingMaterial(row);
      render();
      scrollScreenTop();
      replaceRouteState();
      toast("호선자재 누락이 접수되었습니다.");
      const notificationDelivered = await notificationPromise;
      state.lastMaterialNotificationState = notificationDelivered ? "delivered" : "retry";
      if (state.lastMaterialId === id) renderPreservingScroll();
    }

    async function verifyWorkerLogin(workerId, employeeNo) {
      try {
        return await createAdminSession(workerId, employeeNo, "worker");
      } catch (error) {
        console.warn("worker login function failed", error);
        return null;
      }
    }

    function setAdminSession(session = {}) {
      state.adminSessionToken = String(session.token || "");
      state.adminSessionWorkerId = String(session.workerId || "");
      state.adminSessionExpiresAt = String(session.expiresAt || "");
      if (state.adminSessionToken) {
        saveAdminSession({
          token: state.adminSessionToken,
          workerId: state.adminSessionWorkerId,
          expiresAt: state.adminSessionExpiresAt,
        });
      } else {
        clearAdminSession();
      }
    }

    function clearAdminSessionState() {
      state.adminSessionToken = "";
      state.adminSessionWorkerId = "";
      state.adminSessionExpiresAt = "";
      clearAdminSession();
    }

    function adminSessionActive() {
      return Boolean(
        state.adminSessionToken
        && state.adminSessionWorkerId
        && state.adminSessionWorkerId === state.workerSession?.workerId
        && (!state.adminSessionExpiresAt || Date.parse(state.adminSessionExpiresAt) > Date.now() + 30000),
      );
    }

    async function createAdminSession(workerId, employeeNo, scope = "admin") {
      const client = supabaseClient();
      if (!client) throw new Error("Supabase client is not configured.");
      const { data, error } = await client.functions.invoke("admin-mutations", {
        body: {
          action: "createSession",
          workerId,
          employeeNo,
          scope,
        },
      });
      if (error || data?.error) throw new Error(error?.message || data.error);
      if (!data?.session?.token) throw new Error("admin_session_missing");
      return data.session;
    }

    async function submitWorkerLogin() {
      if (state.loginSubmitting) return;
      const workerId = $("loginWorkerId")?.value || state.loginWorkerId || "";
      const employeeNo = normalizeEmployeeNo($("loginEmployeeNo")?.value || "");
      const worker = state.workers.find((row) => row.id === workerId);
      if (!worker) return toast("작업자를 선택하세요.");
      if (!employeeNo) return toast("사번을 입력하세요.");

      state.loginSubmitting = true;
      render();
      try {
        const mutationSession = await verifyWorkerLogin(workerId, employeeNo);
        if (!mutationSession) {
          toast("작업자 또는 사번을 확인하세요.");
          return;
        }

        state.workerSession = {
          workerId: worker.id,
          workerName: worker.name,
          employeeNo,
          loggedInAt: serverNow().toISOString(),
          mutationToken: mutationSession.token,
          mutationExpiresAt: mutationSession.expiresAt,
          mutationScope: mutationSession.scope || "worker",
        };
        state.lastLoginWorkerId = worker.id;
        state.loginWorkerPickerOpen = false;
        state.loginWorkerSearch = "";
        saveWorkerSession(state.workerSession);
        saveLastLoginWorkerId(worker.id);
        if (!state.adminMode && canWorkerPreEnterAdminMode(worker)) {
          try {
            setAdminSession(await createAdminSession(worker.id, employeeNo));
            setAdminMode(true, workerAdminModeLabel(worker), "worker");
            toast(`${worker.name}님 로그인되었습니다. 관리자 수정 모드가 켜졌습니다.`);
          } catch (error) {
            console.warn("admin session create failed", error);
            clearAdminSessionState();
            setAdminMode(false);
            toast(`${worker.name}님 로그인되었습니다. 관리자 서버 권한 확인에는 실패했습니다.`);
          }
        } else if (canWorkerPerformLeaderActions(worker)) {
          try {
            setAdminSession(await createAdminSession(worker.id, employeeNo, "workPrep"));
            toast(`${worker.name}님 로그인되었습니다.`);
          } catch (error) {
            console.warn("work prep session create failed", error);
            clearAdminSessionState();
            toast(`${worker.name}님 로그인되었습니다. 작업지시서 서버 권한 확인에는 실패했습니다.`);
          }
        } else {
          clearAdminSessionState();
          toast(`${worker.name}님 로그인되었습니다.`);
        }
        scrollScreenTop();
        flushPendingSyncQueue();
        flushPendingMissingMaterialNotifications();
        refreshWorkerPushSubscriptionStatus({ force: true }).catch((error) => console.warn("push status refresh failed", error));
      } finally {
        state.loginSubmitting = false;
        render();
      }
    }

    async function refreshWorkerList() {
      setSyncStatus("서버 확인 중", "pending");
      await pullRemote({ force: true });
      toast("작업자 목록을 새로 불러왔습니다.");
    }

    async function revokeMutationSessionToken(token) {
      const client = supabaseClient();
      if (!client || !token) return;
      try {
        const { error } = await client.functions.invoke("admin-mutations", {
          body: {
            action: "revokeSession",
            mutationSession: { token },
          },
        });
        if (error) throw error;
      } catch (error) {
        console.warn("mutation session revoke failed", error);
      }
    }

    async function logoutWorker() {
      const mutationTokens = [...new Set([
        String(state.workerSession?.mutationToken || ""),
        String(state.adminSessionToken || ""),
      ].filter(Boolean))];
      if (state.adminAuthSource === "worker") {
        setAdminMode(false);
      }
      clearAdminSessionState();
      state.workerSession = null;
      state.issuePhotos = issuePhotosForStorage();
      state.photoViewer = null;
      state.loginSubmitting = false;
      state.pushSubscriptionStatus = {};
      state.pushSubscriptionStatusChecking = false;
      state.view = "dashboard";
      state.selectedCategoryId = null;
      state.historyDetailId = null;
      clearCompletionStateForView("dashboard");
      clearWorkerSession();
      saveJson("issuePhotos", state.issuePhotos);
      toast("로그아웃되었습니다.");
      render();
      scrollScreenTop();
      history.replaceState(routeState(), "", "/");
      await Promise.allSettled(mutationTokens.map(revokeMutationSessionToken));
    }

    function setAdminMode(enabled, email = "", source = "password") {
      const wasAdmin = state.adminMode;
      const preserveSectionEditor = !enabled && shouldPreserveSectionEditorOnAdminExit();
      state.adminMode = Boolean(enabled);
      state.adminEmail = enabled ? email : "";
      state.adminAuthSource = enabled ? source : "";
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
      saveAdminMode(state.adminMode, state.adminAuthSource);
      if (!enabled) {
        state.toolAddOpen = false;
        state.categoryAddOpen = false;
        state.editToolId = null;
        state.editCategoryId = null;
        if (!preserveSectionEditor) {
          const sectionEditorId = state.editSectionId || state.sectionEditorDraft?.sectionId;
          state.editSectionId = null;
          clearSectionEditorDraft(sectionEditorId);
        }
        state.editItemId = null;
        state.openAddItemSectionIds = [];
        state.categoryVisualOpen = false;
        state.selectedHistoryIds = [];
      }
      applyScreenMode();
    }

    function requestAdminAccess() {
      const worker = currentWorkerSessionWorker();
      if (canWorkerPreEnterAdminMode(worker) && adminSessionActive()) {
        setAdminMode(true, workerAdminModeLabel(worker), "worker");
        toast("관리자 수정 모드가 켜졌습니다.");
        return true;
      }
      toast("관리자만 수정할 수 있습니다 — 관리자 권한 작업자로 로그인해주세요.");
      return false;
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
      toast("관리자 권한 작업자로 로그인해주세요.");
      return false;
    }

    function requireRecordResetPassword(label) {
      if (requireAdminWrite()) return true;
      toast(`${label} 이력 초기화는 관리자 권한 작업자로 로그인한 뒤 사용할 수 있습니다.`);
      return false;
    }

    async function addWorker() {
      if (!requireAdminWrite()) return;
      if (state.workerCreateSubmitting) return;
      const name = $("workerName")?.value.trim() || "";
      const team = normalizeWorkerTeam($("workerTeam")?.value || "");
      const position = normalizeWorkerPosition($("workerPosition")?.value || "");
      const employeeNo = normalizeEmployeeNo($("workerEmployeeNo")?.value || "");
      if (!name) return toast("작업자 이름을 입력하세요.");
      if (!team) return toast("팀 성격을 선택하세요.");
      if (!/^[A-Za-z0-9_-]{4,40}$/.test(employeeNo)) return toast("사번은 영문·숫자·밑줄·하이픈으로 4자 이상 입력하세요.");

      const requestFingerprint = JSON.stringify([name, team, position, employeeNo]);
      const requestId = state.workerCreateRequest?.fingerprint === requestFingerprint
        ? state.workerCreateRequest.id
        : uid("worker");
      state.workerCreateRequest = { fingerprint: requestFingerprint, id: requestId };
      const submitButton = document.querySelector('[data-action="add-worker"]');
      state.workerCreateSubmitting = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "등록 중";
      }
      try {
        const result = await invokeAdminMutation("createWorker", {
          worker: { id: requestId, name, team, position, employeeNo },
        });
        if (!result.worker?.id) throw new Error("worker_create_response_invalid");
        const existingIndex = state.workers.findIndex((row) => row.id === result.worker.id);
        if (existingIndex >= 0) state.workers[existingIndex] = result.worker;
        else state.workers.push(result.worker);
        state.pendingCreatedWorkers = [
          ...(Array.isArray(state.pendingCreatedWorkers) ? state.pendingCreatedWorkers : [])
            .filter((row) => row?.id !== result.worker.id),
          result.worker,
        ];
        state.workerEditCardId = result.worker.id;
        persist();
        state.workerCreateRequest = { fingerprint: "", id: "" };
        state.workerCreateSubmitting = false;
        render();
        toast(`${name} 신입사원을 등록했습니다.`);
      } catch (error) {
        console.error(error);
        const message = String(error?.message || "");
        if (/worker_employee_no_exists|duplicate|23505/i.test(message)) {
          toast("이미 사용 중인 사번입니다.");
        } else {
          toast("신입사원 등록에 실패했습니다. 사번 중복과 연결 상태를 확인해주세요.");
        }
      } finally {
        state.workerCreateSubmitting = false;
        if (submitButton?.isConnected) {
          submitButton.disabled = false;
          submitButton.textContent = "신입사원 등록";
        }
      }
    }

    function toggleWorkerCard(id) {
      state.workerEditCardId = state.workerEditCardId === id ? "" : id;
      renderPreservingScroll();
    }

    async function deleteWorker(workerId) {
      if (!requireAdminWrite()) return;
      const id = String(workerId || "").trim();
      const worker = state.workers.find((row) => row.id === id);
      if (!worker) return;
      if (state.workerSession?.workerId === id) {
        toast("현재 로그인한 본인은 삭제할 수 없습니다.");
        return;
      }
      if (state.workerDeleteSubmittingId) return;
      if (!confirm(`${worker.name} 작업자를 삭제할까요?\n로그인 권한과 푸시 알림이 해제되고 과거 점검 이력은 유지됩니다.`)) return;

      state.workerDeleteSubmittingId = id;
      render();
      try {
        await invokeAdminMutation("deleteWorker", { workerId: id });
        state.workerDeletionTombstones.add(id);
        state.workers = state.workers.filter((row) => row.id !== id);
        state.pendingCreatedWorkers = (Array.isArray(state.pendingCreatedWorkers) ? state.pendingCreatedWorkers : [])
          .filter((row) => row?.id !== id);
        if (state.workerEditCardId === id) state.workerEditCardId = "";
        if (state.workerPushDeviceWorkerId === id) {
          state.workerPushDeviceWorkerId = "";
          state.workerPushDevices = [];
        }
        persist();
        toast(`${worker.name} 작업자를 삭제했습니다.`);
      } catch (error) {
        console.error(error);
        if (/worker_self_delete_forbidden/i.test(String(error?.message || ""))) {
          toast("현재 로그인한 본인은 삭제할 수 없습니다.");
        } else {
          toast("작업자 삭제에 실패했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.");
        }
      } finally {
        if (state.workerDeleteSubmittingId === id) state.workerDeleteSubmittingId = "";
        render();
      }
    }

    function workerEditFieldValue(id, field) {
      return Array.from(document.querySelectorAll(`[data-worker-edit-field="${field}"]`))
        .find((node) => node.dataset.workerEdit === id)?.value || "";
    }

    function workerEditFieldChecked(id, field) {
      return Boolean(Array.from(document.querySelectorAll(`[data-worker-edit-field="${field}"]`))
        .find((node) => node.dataset.workerEdit === id)?.checked);
    }

    async function saveWorker(id) {
      if (!requireAdminWrite()) return;
      const worker = state.workers.find((row) => row.id === id);
      if (!worker) return;
      const cleanName = workerEditFieldValue(id, "name").trim();
      const cleanTeam = normalizeWorkerTeam(workerEditFieldValue(id, "team"));
      const cleanPosition = normalizeWorkerPosition(workerEditFieldValue(id, "position"));
      if (!cleanName) return toast("작업자 이름을 입력하세요.");
      if (!cleanTeam) return toast("팀 성격을 선택하세요.");
      worker.name = cleanName;
      worker.team = cleanTeam;
      worker.position = cleanPosition;
      worker.unsafePushTarget = workerEditFieldChecked(id, "unsafePushTarget");
      worker.updatedAt = serverNow().toISOString();
      if (state.workerSession?.workerId === worker.id) {
        state.workerSession = { ...state.workerSession, workerName: cleanName };
        saveWorkerSession(state.workerSession);
        if (state.adminAuthSource === "worker" && !canWorkerPreEnterAdminMode(worker)) {
          clearAdminSessionState();
          setAdminMode(false);
        }
      }
      if (!(await persistAndSync("workers"))) return;
      render();
      toast("작업자를 수정했습니다.");
    }

    function updateRecordFilter(token, value) {
      const [kind, key] = token.split(":");
      const target = kind === "unsafe"
        ? state.unsafeFilters
        : kind === "workPrep"
          ? state.workPrepFilters
          : state.materialFilters;
      target[key] = value;
      saveJson(kind === "unsafe" ? "unsafeFilters" : kind === "workPrep" ? "workPrepFilters" : "materialFilters", target);
      if (key === "shipNo" && !value && routeQueryParam("shipNo")) {
        history.replaceState(routeState(), "", location.pathname);
      }
      render();
    }

    function adminMutationAuthPayload() {
      return {
        token: state.adminSessionToken || "",
      };
    }

    function currentWorkerMutationSessionSnapshot() {
      const token = String(state.workerSession?.mutationToken || "");
      const workerId = String(state.workerSession?.workerId || "");
      const expiresAt = String(state.workerSession?.mutationExpiresAt || "");
      return token && workerId ? { token, workerId, expiresAt } : null;
    }

    function workerMutationAuthPayload(session = null) {
      return {
        token: session?.token || state.workerSession?.mutationToken || "",
      };
    }

    function workerMutationSessionActive() {
      return Boolean(
        state.workerSession?.mutationToken
        && (!state.workerSession.mutationExpiresAt
          || Date.parse(state.workerSession.mutationExpiresAt) > Date.now() + 30000),
      );
    }

    function setWorkerMutationSession(session = {}, expectedWorkerId = "") {
      if (!state.workerSession
        || !expectedWorkerId
        || state.workerSession.workerId !== expectedWorkerId
        || String(session.workerId || "") !== expectedWorkerId) return false;
      state.workerSession = {
        ...state.workerSession,
        mutationToken: String(session.token || ""),
        mutationExpiresAt: String(session.expiresAt || ""),
        mutationScope: String(session.scope || "worker"),
      };
      saveWorkerSession(state.workerSession);
      return true;
    }

    async function ensureWorkerMutationSession() {
      if (!isSyncConfigured()) return true;
      if (workerMutationSessionActive()) return true;
      const worker = currentWorkerSessionWorker();
      const employeeNo = normalizeEmployeeNo(state.workerSession?.employeeNo || "");
      if (!worker || !employeeNo) return false;
      const expectedWorkerId = worker.id;
      if (!workerMutationSessionPromise || workerMutationSessionWorkerId !== expectedWorkerId) {
        const refresh = createAdminSession(expectedWorkerId, employeeNo, "worker")
          .then((session) => {
            return setWorkerMutationSession(session, expectedWorkerId);
          })
          .catch((error) => {
            console.warn("worker mutation session refresh failed", error);
            return false;
          });
        workerMutationSessionPromise = refresh;
        workerMutationSessionWorkerId = expectedWorkerId;
        refresh.finally(() => {
          if (workerMutationSessionPromise === refresh) {
            workerMutationSessionPromise = null;
            workerMutationSessionWorkerId = "";
          }
        });
      }
      return workerMutationSessionPromise;
    }

    function canAttemptServerAdminWrite() {
      return adminSessionActive();
    }

    async function ensureWorkPrepMutationSession() {
      if (!isSyncConfigured()) return true;
      if (canAttemptServerAdminWrite()) return true;
      const worker = currentWorkerSessionWorker();
      const employeeNo = normalizeEmployeeNo(state.workerSession?.employeeNo || "");
      if (!worker || !employeeNo || !canWorkerPerformLeaderActions(worker)) return false;
      const expectedWorkerId = worker.id;
      if (!workPrepMutationSessionPromise || workPrepMutationSessionWorkerId !== expectedWorkerId) {
        const refresh = createAdminSession(expectedWorkerId, employeeNo, "workPrep")
          .then((session) => {
            if (state.workerSession?.workerId !== expectedWorkerId
              || String(session.workerId || "") !== expectedWorkerId) return false;
            setAdminSession(session);
            return true;
          })
          .catch((error) => {
            console.warn("work prep session refresh failed", error);
            return false;
          });
        workPrepMutationSessionPromise = refresh;
        workPrepMutationSessionWorkerId = expectedWorkerId;
        refresh.finally(() => {
          if (workPrepMutationSessionPromise === refresh) {
            workPrepMutationSessionPromise = null;
            workPrepMutationSessionWorkerId = "";
          }
        });
      }
      return workPrepMutationSessionPromise;
    }

    function requireAdminWrite() {
      if (!requireAdmin()) return false;
      if (canAttemptServerAdminWrite()) return true;
      clearAdminSessionState();
      setAdminMode(false);
      toast("관리자만 저장할 수 있습니다 — 관리자 권한 작업자로 로그인해주세요.");
      return false;
    }

    // XLSX 코덱은 assets/js/xlsx-helpers.js (window.ShipyardXlsxHelpers)로 추출됨.
    function createXlsxBlob(sheetName, headers, rows) {
      return XLSX_HELPERS.createXlsxBlob(sheetName, headers, rows);
    }

    function createZip(files) {
      return XLSX_HELPERS.createZip(files);
    }

    async function readXlsxObjects(file) {
      return XLSX_HELPERS.readXlsxObjects(file);
    }

    async function saveBlobFile(filename, blob, options = {}) {
      const pickerType = options.pickerType || {
        description: "파일",
        accept: { [blob.type || "application/octet-stream"]: [`.${filename.split(".").pop() || "bin"}`] },
      };
      if (typeof window.showSaveFilePicker === "function" && window.isSecureContext) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: filename,
            types: [pickerType],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          toast(options.savedToast || "파일을 저장했습니다.");
          return true;
        } catch (error) {
          if (error?.name === "AbortError") {
            toast("저장을 취소했습니다.");
            return false;
          }
          console.warn("Save picker failed; falling back to download.", error);
        }
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast(options.fallbackToast || "파일을 만들었습니다.");
      return true;
    }

    async function saveXlsxBlob(filename, blob) {
      return saveBlobFile(filename, blob, {
        pickerType: {
          description: "Excel 통합 문서",
          accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
        },
        savedToast: "Excel 파일을 저장했습니다.",
        fallbackToast: "Excel 파일을 만들었습니다.",
      });
    }

    function downloadExport(filename, rows, sheetName = "Data") {
      if (!rows.length) return toast("내보낼 데이터가 없습니다.");
      const headers = [...rows.reduce((set, row) => {
        Object.keys(row).forEach((key) => set.add(key));
        return set;
      }, new Set())];
      const blob = createXlsxBlob(sheetName, headers, rows);
      return saveXlsxBlob(filename, blob);
    }

    function setMonthlyWorkerMonth(mode) {
      const currentMonth = monthKeyForDate();
      const selected = selectedMonthlyWorkerMonth();
      let nextMonth = selected;
      if (mode === "current") nextMonth = currentMonth;
      if (mode === "prev") nextMonth = monthKeyOffset(selected, -1);
      if (mode === "next") nextMonth = monthKeyOffset(selected, 1) <= currentMonth ? monthKeyOffset(selected, 1) : selected;
      state.selectedMonthlyWorkerMonth = nextMonth;
      if (nextMonth !== selected) {
        state.monthlyWorkerMonthHighlight = true;
        clearTimeout(state.monthlyWorkerMonthHighlightTimer);
        state.monthlyWorkerMonthHighlightTimer = setTimeout(() => {
          state.monthlyWorkerMonthHighlight = false;
          if (state.view === "analytics") render();
        }, 900);
      }
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

    function exportShips() {
      const rows = sortedShips().map((ship) => ({
        "호선명": ship.no || "",
        "선종": ship.type || "",
        "상태": effectiveShipStage(ship).label,
        "L/C": dateOnly(ship.lcDate || ""),
        "S/T": dateOnly(ship.stDate || ""),
        "C/L": dateOnly(ship.clDate || ""),
        "D/L": dateOnly(ship.dlDate || ""),
      }));
      return downloadExport(`gs_safety_ships_data-${today()}.xlsx`, rows, "호선목록");
    }

    function zipSafeSegment(value, fallback = "data") {
      const safe = String(value || "")
        .trim()
        .replace(/[<>:"\\|?*\u0000-\u001f]/g, "")
        .replace(/[\/]+/g, "-")
        .replace(/\s+/g, "_")
        .slice(0, 80);
      return safe || fallback;
    }

    function photoExportExtension(photo, blob) {
      const path = String(photo?.storagePath || "").split("?")[0].toLowerCase();
      const ext = path.split(".").pop();
      if (["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(ext)) return ext;
      const type = String(blob?.type || "").toLowerCase();
      if (type.includes("png")) return "png";
      if (type.includes("webp")) return "webp";
      if (type.includes("heic")) return "heic";
      if (type.includes("heif")) return "heif";
      return "jpg";
    }

    function isRemoteStoragePhoto(photo) {
      const path = String(photo?.storagePath || "");
      return Boolean(path && !/^(https?:|data:|blob:)/.test(path));
    }

    async function blobToBytes(blob) {
      return new Uint8Array(await blob.arrayBuffer());
    }

    async function fetchPhotoBlob(photo) {
      const path = String(photo?.storagePath || "");
      if (!path) return null;
      if (/^(https?:|data:|blob:)/.test(path)) {
        const response = await fetch(path);
        if (!response.ok) return null;
        return response.blob();
      }
      const client = supabaseClient();
      if (client) {
        const { data, error } = await client.storage.from(photo.storageBucket || ISSUE_PHOTO_BUCKET).download(path);
        if (!error && data) return data;
      }
      const url = publicPhotoUrl(photo);
      if (!url) return null;
      const response = await fetch(url);
      return response.ok ? response.blob() : null;
    }

    function imageFromObjectUrl(url) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
      });
    }

    async function photoThumbnailDataUrl(blob) {
      if (!blob) return "";
      const url = URL.createObjectURL(blob);
      try {
        const image = await imageFromObjectUrl(url);
        const maxSide = 360;
        const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width || 1, image.naturalHeight || image.height || 1));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round((image.naturalWidth || image.width || 1) * scale));
        canvas.height = Math.max(1, Math.round((image.naturalHeight || image.height || 1) * scale));
        const context = canvas.getContext("2d");
        if (!context) return "";
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.72);
      } catch (error) {
        console.warn("Thumbnail generation failed.", error);
        return "";
      } finally {
        URL.revokeObjectURL(url);
      }
    }

    async function removeOriginalPhotoStorage(photos) {
      const client = supabaseClient();
      if (!client) return true;
      const byBucket = photos.reduce((map, photo) => {
        if (!isRemoteStoragePhoto(photo)) return map;
        const bucket = photo.storageBucket || ISSUE_PHOTO_BUCKET;
        if (!map.has(bucket)) map.set(bucket, []);
        map.get(bucket).push(photo.storagePath);
        return map;
      }, new Map());
      let ok = true;
      for (const [bucket, paths] of byBucket.entries()) {
        if (!paths.length) continue;
        const { error } = await client.storage.from(bucket).remove(paths);
        if (error) {
          ok = false;
          console.error(error);
        }
      }
      return ok;
    }

    async function replaceUnsafePhotosWithThumbnails(photoUpdates, originalPhotos) {
      if (!photoUpdates.length) return;
      const removed = await removeOriginalPhotoStorage(originalPhotos);
      const byId = new Map(photoUpdates.map((photo) => [photo.id, photo]));
      state.issuePhotos = state.issuePhotos.map((photo) => byId.get(photo.id) || photo);
      persist();
      if (isSyncConfigured()) {
        enqueueSyncRows("issuePhotos", photoUpdates);
        flushPendingSyncQueue();
      }
      toast(removed ? "원본 사진을 백업 후 썸네일로 전환했습니다." : "백업은 완료했지만 일부 원본 사진 삭제에 실패했습니다.");
    }

    async function exportUnsafeIssuesPackage(date) {
      if (!requireAdmin()) return;
      const records = ISSUE_MATERIAL_RULES.filterRecords(state.unsafeIssues, state.unsafeFilters);
      if (!records.length) return toast("내보낼 불안전요소 데이터가 없습니다.");
      toast("사진 포함 백업 파일을 준비합니다.");
      const zipFiles = [];
      const photoUpdates = [];
      const originalPhotos = [];
      let missingPhotos = 0;
      const rows = [];
      for (const row of records) {
        const photoNames = [];
        const photos = unsafePhotosFor(row.id);
        for (let index = 0; index < photos.length; index += 1) {
          const photo = photos[index];
          const blob = await fetchPhotoBlob(photo);
          if (!blob) {
            missingPhotos += 1;
            continue;
          }
          const folder = `${zipSafeSegment(row.shipNo || "호선미정")}_${zipSafeSegment(shortRecordId(row.id), "record")}`;
          const ext = photoExportExtension(photo, blob);
          const name = `photos/${folder}/photo-${index + 1}-${zipSafeSegment(shortRecordId(photo.id), "file")}.${ext}`;
          zipFiles.push({ name, content: await blobToBytes(blob) });
          photoNames.push(name);
          const thumbnail = await photoThumbnailDataUrl(blob);
          if (thumbnail) {
            photoUpdates.push({
              ...photo,
              storageBucket: "thumbnail",
              storagePath: thumbnail,
              sortOrder: photo.sortOrder || index + 1,
            });
            originalPhotos.push(photo);
          }
        }
        rows.push({
          id: row.id,
          shipNo: row.shipNo,
          status: row.status,
          worker: row.workerNameSnapshot,
          team: row.workerTeamSnapshot,
          content: row.content,
          memo: row.adminMemo || "",
          photoCount: photos.length,
          exportedPhotos: photoNames.join("\n"),
          createdAt: formatDateTime(row.createdAt),
          updatedAt: formatDateTime(row.updatedAt),
        });
      }
      const xlsxBlob = createXlsxBlob("불안전요소", rows.length ? Object.keys(rows[0]) : [], rows);
      zipFiles.unshift({ name: `unsafe-issues-${date}.xlsx`, content: await blobToBytes(xlsxBlob) });
      if (missingPhotos) {
        zipFiles.push({ name: "README.txt", content: `사진 ${missingPhotos}장은 원본 파일을 가져오지 못해 백업에 포함되지 않았습니다.` });
      }
      const blob = new Blob([createZip(zipFiles)], { type: "application/zip" });
      const saved = await saveBlobFile(`unsafe-issues-${date}.zip`, blob, {
        pickerType: { description: "불안전요소 백업 ZIP", accept: { "application/zip": [".zip"] } },
        savedToast: "불안전요소 백업 파일을 저장했습니다.",
        fallbackToast: "불안전요소 백업 파일을 만들었습니다.",
      });
      if (saved) await replaceUnsafePhotosWithThumbnails(photoUpdates, originalPhotos);
    }

    const SHIP_IMPORT_DATE_FIELDS = SHIP_IMPORT_RULES.SHIP_IMPORT_DATE_FIELDS || [];

    function triggerShipImport() {
      if (!state.adminMode && !requestAdminAccess()) return;
      document.querySelector("[data-import-ships-file]")?.click();
    }

    // 가져오기 규칙은 assets/js/ship-import-rules.js (window.ShipyardShipImportRules)로 추출됨.
    function normalizeShipImportRow(row) {
      return SHIP_IMPORT_RULES.normalizeShipImportRow(row, { normalizeShipNo, normalizeShipStageInput });
    }

    function shipImportDateConflicts(importedRows) {
      return SHIP_IMPORT_RULES.shipImportDateConflicts(importedRows, state.ships);
    }

    function confirmShipImportDateChanges(conflicts) {
      if (!conflicts.length) return true;
      const preview = conflicts.slice(0, 10).map((row) => `${row.no} ${row.label}: ${row.before} -> ${row.after}`).join("\n");
      const suffix = conflicts.length > 10 ? `\n...외 ${conflicts.length - 10}건` : "";
      return confirm(`기존 날짜가 등록된 호선의 일자가 변경됩니다.\n이 날짜가 맞으면 확인을 눌러 업데이트하세요.\n\n${preview}${suffix}\n\n취소하면 불러오기를 중단합니다.`);
    }

    async function applyShipImportRows(importedRows) {
      const existingByNo = new Map(state.ships.map((ship) => [ship.no, ship]));
      const now = serverNow().toISOString();
      let added = 0;
      let updated = 0;
      importedRows.forEach((imported) => {
        const existing = existingByNo.get(imported.no);
        if (existing) {
          state.ships = state.ships.map((ship) => {
            if (ship.no !== imported.no) return ship;
            const next = { ...ship };
            if (imported.type) next.type = imported.type;
            if (imported.processStage) next.processStage = imported.processStage;
            SHIP_IMPORT_DATE_FIELDS.forEach(([field]) => {
              if (imported[field]) next[field] = imported[field];
            });
            next.deliveryType = shipDeliveryType(next);
            next.deliveryDate = shipDeliveryDate(next);
            next.updatedAt = now;
            return next;
          });
          updated += 1;
          return;
        }
        const ship = {
          id: uid("ship"),
          no: imported.no,
          type: imported.type || "",
          note: "",
          processStage: imported.processStage || "mounting",
          deliveryType: "",
          deliveryDate: "",
          lcDate: imported.lcDate || "",
          stDate: imported.stDate || "",
          clDate: imported.clDate || "",
          dlDate: imported.dlDate || "",
          createdAt: now,
          updatedAt: now,
          order: state.ships.length + added + 1,
        };
        ship.deliveryType = shipDeliveryType(ship);
        ship.deliveryDate = shipDeliveryDate(ship);
        state.ships.push(ship);
        existingByNo.set(ship.no, ship);
        added += 1;
      });
      cleanupDeliveredShips(false);
      if (!(await persistAndSync("ships"))) return;
      render();
      toast(`호선 ${added}척 추가, ${updated}척 업데이트했습니다.`);
    }

    async function importShipsFromFile(file) {
      if (!file) return;
      if (!requireAdminWrite()) return;
      try {
        const rows = await readXlsxObjects(file);
        const importedRows = rows.map(normalizeShipImportRow).filter(Boolean);
        if (!importedRows.length) return toast("불러올 호선 데이터가 없습니다.");
        const conflicts = shipImportDateConflicts(importedRows);
        if (!confirmShipImportDateChanges(conflicts)) return toast("호선 불러오기를 취소했습니다.");
        await applyShipImportRows(importedRows);
      } catch (error) {
        console.error(error);
        toast(error?.message || "호선 엑셀 파일을 읽지 못했습니다.");
      }
    }

    async function exportRecords(kind) {
      if (!requireAdmin()) return;
      const date = today();
      if (kind === "monthly-worker-analytics") return exportMonthlyWorkerAnalytics();
      if (kind === "unsafe") return exportUnsafeIssuesPackage(date);
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
      const snapshots = rows.map((row) => ({ row, previous: { ...row, statusHistory: Array.isArray(row.statusHistory) ? [...row.statusHistory] : [] } }));
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
            actor: currentTimelineActorLabel("관리자"),
          }, { initialStatus: statuses[0] });
        }
      });
      const ok = await upsertAdminRows("missingMaterials", rows);
      if (!ok) {
        snapshots.forEach(({ row, previous }) => Object.assign(row, previous));
        render();
        return;
      }
      persist();
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

    async function saveAdminRecord(token, options = {}) {
      if (!requireAdminWrite()) return;
      const [kind, id] = token.split(":");
      const rows = kind === "unsafe" ? state.unsafeIssues : state.missingMaterials;
      const row = rows.find((item) => item.id === id);
      if (!row) return;
      const previous = { ...row, statusHistory: Array.isArray(row.statusHistory) ? [...row.statusHistory] : [] };
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
            actor: currentTimelineActorLabel("관리자"),
          }, { initialStatus: statuses[0] })
        : ISSUE_MATERIAL_RULES.buildRecordTimeline(row, { initialStatus: statuses[0] });
      const remoteKey = kind === "unsafe" ? "unsafeIssues" : "missingMaterials";
      const ok = await upsertAdminRows(remoteKey, [row]);
      if (!ok) {
        Object.assign(row, previous);
        render();
        return;
      }
      persist();
      render();
      toast("기록을 저장했습니다.");
    }

    async function deleteAdminRecord(token) {
      if (!requireAdminWrite()) return;
      const [kind, id] = token.split(":");
      const label = kind === "unsafe" ? "불안전요소" : "호선자재 누락";
      if (!confirm(`${label} 기록을 영구 삭제할까요?`)) return;
      if (isSyncConfigured()) {
        const remoteKey = kind === "unsafe" ? "unsafeIssues" : "missingMaterials";
        if (kind === "unsafe" && !(await deleteUnsafePhotos(id))) return;
        if (!(await deleteRemoteRows(remoteKey, [id]))) return;
      }
      if (kind === "unsafe") {
        state.unsafeIssues = state.unsafeIssues.filter((row) => row.id !== id);
        state.issuePhotos = state.issuePhotos.filter((row) => row.targetId !== id);
      } else {
        state.missingMaterials = state.missingMaterials.filter((row) => row.id !== id);
      }
      persist();
      render();
      toast("기록을 삭제했습니다.");
    }

    async function resetHistory() {
      if (!requireAdminWrite()) return;
      if (!confirm("모든 점검 이력을 초기화할까요? 작업 유형, 섹션, 항목, 호선은 유지됩니다.")) return;
      const inspectionIds = [...new Set([
        ...state.inspections.map((row) => row.id),
        ...state.archivedInspections.map((row) => row.id),
      ].filter(Boolean))];
      if (isSyncConfigured() && !(await resetRemoteHistory())) return;
      if (inspectionIds.length) applyDeletedRows("inspections", inspectionIds);
      state.inspections = [];
      state.archivedInspections = [];
      state.inspectionItems = [];
      state.historyDetailId = null;
      state.historyScope = "all";
      state.historyFilter = "all";
      state.selectedHistoryIds = [];
      persist();
      localStorage.removeItem(OLD_KEYS.history);
      render();
      replaceRouteState();
      toast("점검 이력을 초기화했습니다.");
    }

    async function resetUnsafeIssueRecords() {
      if (!requireAdminWrite()) return;
      if (!requireRecordResetPassword("불안전요소")) return;
      const issueIds = state.unsafeIssues.map((row) => row.id).filter(Boolean);
      if (!confirm(`불안전요소 이력 ${issueIds.length}건을 초기화할까요? 호선/작업자/점검 항목은 유지됩니다.`)) return;
      if (isSyncConfigured()) {
        const photoResults = await Promise.all(issueIds.map((id) => deleteUnsafePhotos(id)));
        if (photoResults.some((ok) => !ok)) return;
        if (!(await deleteRemoteRows("unsafeIssues", issueIds))) return;
      }
      state.unsafeIssues = [];
      state.issuePhotos = state.issuePhotos.filter((photo) => !issueIds.includes(photo.targetId));
      state.pendingPhotoUploads = state.pendingPhotoUploads.filter((row) => !issueIds.includes(row.issueId));
      state.unsafePhotoUploadingIds = [];
      state.lastUnsafeIssueId = null;
      state.unsafeDetailId = null;
      state.unsafeFilters = { shipNo: "", status: "", workerId: "", sort: "status" };
      saveJson("unsafeFilters", state.unsafeFilters);
      persist();
      render();
      toast("불안전요소 이력을 초기화했습니다.");
    }

    async function resetMissingMaterialRecords() {
      if (!requireAdminWrite()) return;
      if (!requireRecordResetPassword("자재누락")) return;
      const materialIds = state.missingMaterials.map((row) => row.id).filter(Boolean);
      if (!confirm(`자재누락 이력 ${materialIds.length}건을 초기화할까요? 호선/작업자/점검 항목은 유지됩니다.`)) return;
      if (isSyncConfigured() && !(await deleteRemoteRows("missingMaterials", materialIds))) return;
      state.missingMaterials = [];
      state.lastMaterialId = null;
      state.materialDetailId = null;
      state.materialFilters = { shipNo: "", status: "", workerId: "", materialName: "", sort: "status" };
      saveJson("materialFilters", state.materialFilters);
      persist();
      render();
      toast("자재누락 이력을 초기화했습니다.");
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

    async function deleteSelectedHistory() {
      if (!requireAdminWrite()) return;
      const ids = new Set(state.selectedHistoryIds);
      if (!ids.size) return toast("삭제할 이력을 선택하세요.");
      if (!confirm(`선택한 점검 이력 ${ids.size}건을 삭제할까요?`)) return;
      if (isSyncConfigured() && !(await deleteRemoteHistory([...ids]))) return;
      applyDeletedRows("inspections", [...ids]);
      state.selectedHistoryIds = [];
      persist();
      render();
      toast("선택한 이력을 삭제했습니다.");
    }

    async function addShip() {
      if (!requireAdminWrite()) return;
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
      if (!(await persistAndSync("ships"))) return;
      render();
      toast(`호선 ${added}척을 추가했습니다.${skipped ? ` ${skipped}건은 중복/오류로 건너뛰었습니다.` : ""}`);
    }

    async function deleteShip(id) {
      if (!requireAdminWrite()) return;
      const ship = state.ships.find((row) => row.id === id);
      if (!ship) return;
      if (!confirm(`${ship.no} 호선을 삭제할까요? 기존 점검 이력은 유지됩니다.`)) return;
      if (isSyncConfigured()) {
        if (!(await deleteRemoteShips([id]))) return;
      }
      state.ships = state.ships.filter((row) => row.id !== id);
      if (state.draft.shipNo === ship.no) state.draft.shipNo = "";
      persist();
      render();
      toast(`${ship.no} 호선을 삭제했습니다.`);
    }

    async function updateShipProcess(id, patch) {
      if (!requireAdminWrite()) return;
      state.ships = state.ships.map((ship) => {
        if (ship.id !== id) return ship;
        const next = { ...ship, ...patch };
        next.deliveryType = shipDeliveryType(next);
        next.deliveryDate = shipDeliveryDate(next);
        return next;
      });
      cleanupDeliveredShips(false);
      if (!(await persistAndSync("ships"))) return;
      render();
    }

    async function addCategory() {
      if (!requireAdminWrite()) return;
      const label = $("catLabel").value.trim();
      if (!label) return toast("작업 유형명을 입력하세요.");
      const id = uid("cat");
      const previousCategories = state.categories;
      const previousSections = state.sections;
      state.categories = [...state.categories, {
        id,
        label,
        icon: normalizeIconKey($("catIcon").value.trim() || "blockAssembly"),
        color: selectedColor(),
        requireToolCheck: true,
        toolNature: "선행",
        toolIds: [],
        order: state.categories.length + 1,
      }];
      state.sections = [...state.sections, { id: uid("section"), categoryId: id, title: "기본 점검", order: 1 }];
      if (!(await persistAndSync(["categories", "sections"]))) {
        state.categories = previousCategories;
        state.sections = previousSections;
        persist();
        render();
        return;
      }
      state.categoryAddOpen = false;
      state.manageCategoryId = id;
      render();
    }

    async function saveCategoryIcon() {
      if (!requireAdminWrite()) return;
      const cat = categoryById(state.manageCategoryId);
      if (!cat) return;
      const icon = $("editCatIcon").value.trim() || cat.label.slice(0, 1).toUpperCase();
      const toolNature = normalizeToolNature($("editCatToolNature")?.value || cat.toolNature);
      state.categories = state.categories.map((row) => row.id === cat.id ? { ...row, icon, toolNature } : row);
      if (!(await persistAndSync("categories"))) return;
      render();
      toast("아이콘과 공기구 기준을 저장했습니다.");
    }

    function editCategory(id) {
      if (!requireAdminWrite()) return;
      state.workTypeManagerSelectedId = id;
      state.workTypeManagerTab = "summary";
      state.workTypeManagerMobileDetailOpen = true;
      state.editCategoryId = id;
      state.categoryAddOpen = false;
      render();
    }

    async function saveCategory(id) {
      if (!requireAdminWrite()) return;
      const cat = categoryById(id);
      if (!cat) return;
      const label = $(`editCategoryLabel_${id}`).value.trim();
      const icon = normalizeIconKey($(`editCategoryIcon_${id}`)?.value.trim() || cat.icon || "blockAssembly");
      const color = selectedEditCategoryColor(id, cat.color);
      const toolNature = normalizeToolNature($(`editCategoryNature_${id}`)?.value || cat.toolNature);
      if (!label) return toast("작업 유형명을 입력하세요.");
      const duplicate = state.categories.some((row) => row.id !== id && row.label === label);
      if (duplicate) return toast("같은 이름의 작업 유형이 이미 있습니다.");
      const iconChanged = normalizeIconKey(cat.icon) !== icon;
      const previousCategories = state.categories;
      const previousEditCategoryId = state.editCategoryId;
      state.categories = state.categories.map((row) => row.id === id ? {
        ...row,
        label,
        icon,
        color,
        toolNature,
      } : row);
      state.editCategoryId = null;
      if (!(await persistAndSync("categories"))) {
        state.categories = previousCategories;
        state.editCategoryId = previousEditCategoryId;
        persist();
        render();
        return;
      }
      render();
      toast(iconChanged ? "작업 유형 아이콘을 변경했습니다." : "작업 유형 설정을 수정했습니다.");
    }

    function copyCategoryTools(targetId) {
      if (!requireAdminWrite()) return;
      const target = categoryById(targetId);
      const sourceId = $(`copyCategorySource_${targetId}`)?.value || "";
      const source = categoryById(sourceId);
      if (!target || !source) return toast("복사할 작업 유형을 선택하세요.");
      const copiedIds = StateShapeRules.copyCategoryToolIds(source.toolIds, activeTools().map((tool) => tool.id));
      setCategoryToolDraft(target.id, copiedIds);
      state.workTypeManagerSelectedId = target.id;
      state.workTypeManagerTab = "tools";
      render();
      toast(`${source.label}의 공기구 설정 ${copiedIds.length}개를 가져왔습니다. 저장하면 반영됩니다.`);
    }

    async function saveCategoryTools(id) {
      if (!requireAdminWrite()) return;
      const cat = categoryById(id);
      if (!cat) return;
      const toolIds = selectedCategoryToolIds(`category_${id}`);
      state.categories = state.categories.map((row) => row.id === id ? {
        ...row,
        toolIds,
      } : row);
      syncCategoryToolMetaItem(id, categoryById(id)?.toolIds || []);
      clearCategoryToolDraft(id);
      if (!(await persistAndSync(["categories", "items"]))) return;
      render();
      toast(`${cat.label} 공기구 지정을 저장했습니다.`);
    }

    async function deleteCategory(id) {
      if (!requireAdminWrite()) return;
      const cat = categoryById(id);
      if (!cat) return;
      if (!confirm(`${cat.label} 작업 유형을 삭제할까요? 기존 점검 이력은 유지됩니다.`)) return;
      if (isSyncConfigured()) {
        try {
          await invokeAdminMutation("deleteCategoryCascade", { categoryId: id });
          setSyncStatus("온라인", "online");
        } catch (error) {
          console.error(error);
          setSyncStatus("동기화 오류", "error");
          toast("작업 유형 삭제 실패 — 권한과 연결 상태를 확인해주세요.");
          return;
        }
      }
      state.categories = state.categories.filter((row) => row.id !== id);
      state.sections = state.sections.filter((row) => row.categoryId !== id);
      state.items = state.items.filter((row) => row.categoryId !== id);
      if (state.manageCategoryId === id) state.manageCategoryId = null;
      persist();
      render();
      toast("작업 유형을 삭제했습니다.");
    }

    async function addSection() {
      if (!requireAdminWrite()) return;
      const title = $("newSectionTitle").value.trim();
      if (!title) return toast("섹션명을 입력하세요.");
      if (sectionsFor(state.manageCategoryId).some((section) => section.title === title)) return toast("같은 이름의 섹션이 이미 있습니다.");
      state.sections.push({
        id: uid("section"),
        categoryId: state.manageCategoryId,
        title,
        order: sectionsFor(state.manageCategoryId).length + 1,
      });
      if (!(await persistAndSync("sections"))) return;
      render();
    }

    function editSection(id) {
      if (!requireAdminWrite()) return;
      const section = state.sections.find((row) => row.id === id);
      if (!section) return;
      beginSectionEditor(section);
      state.editSectionId = id;
      state.editItemId = null;
      render();
    }

    async function saveSection(id) {
      if (!requireAdminWrite()) {
        if (state.sectionEditorDraft?.sectionId === id) render();
        return;
      }
      if (state.sectionSaveSubmittingId) return toast("섹션 저장 중입니다. 잠시만 기다려주세요.");
      const section = state.sections.find((row) => row.id === id);
      if (!section) return;
      const draft = sectionEditorDraftFor(section);
      const title = String(draft.title || "").trim();
      if (!title) return toast("섹션명을 입력하세요.");
      const duplicate = sectionsFor(section.categoryId).some((row) => row.id !== id && row.title === title);
      if (duplicate) return toast("같은 이름의 섹션이 이미 있습니다.");
      const signCode = normalizeSectionEditorSign(draft.signCode);
      const frequency = normalizeSectionEditorScore(draft.frequency);
      const severity = normalizeSectionEditorScore(draft.severity);
      const totalScore = frequency != null && severity != null ? frequency * severity : null;
      const previousSection = { ...section };
      const updatedSection = { ...section, title, signCode, frequency, severity, totalScore };
      state.sections = state.sections.map((row) => row.id === id ? updatedSection : row);
      state.sectionSaveSubmittingId = id;
      render();
      let saved = false;
      try {
        saved = await persistAndSync("sections");
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("저장 실패 — 권한과 연결 상태를 확인해주세요.");
      }
      state.sectionSaveSubmittingId = "";
      if (!saved) {
        state.sections = state.sections.map((row) => row.id === id ? previousSection : row);
        render();
        return;
      }
      state.editSectionId = null;
      clearSectionEditorDraft(id);
      if (!state.manageCategoryId && state.workTypeManagerTab === "sections") state.openManageSectionId = null;
      render();
      toast("섹션명을 수정했습니다.");
    }

    async function deleteSection(id) {
      if (!requireAdminWrite()) return;
      const section = state.sections.find((row) => row.id === id);
      if (!section) return;
      const count = state.items.filter((row) => row.sectionId === id && row.active !== false).length;
      if (!confirm(`${section.title} 섹션과 항목 ${count}개를 삭제할까요?`)) return;
      if (isSyncConfigured()) {
        try {
          await invokeAdminMutation("deleteSectionCascade", { sectionId: id });
          setSyncStatus("온라인", "online");
        } catch (error) {
          console.error(error);
          setSyncStatus("동기화 오류", "error");
          toast("섹션 삭제 실패 — 권한과 연결 상태를 확인해주세요.");
          return;
        }
      }
      state.sections = state.sections.filter((row) => row.id !== id);
      state.items = state.items.map((row) => row.sectionId === id ? { ...row, active: false } : row);
      persist();
      render();
    }

    async function addChecklistItem(sectionId) {
      if (!requireAdminWrite()) return;
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
      if (!(await persistAndSync("items"))) return;
      render();
    }

    async function saveChecklistItem(id) {
      if (!requireAdminWrite()) return;
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
      state.editItemId = null;
      if (!(await persistAndSync("items"))) return;
      render();
      toast("점검 항목을 수정했습니다.");
    }

    async function deleteChecklistItem(id) {
      if (!requireAdminWrite()) return;
      const row = state.items.find((itemRow) => itemRow.id === id);
      if (!row) return;
      if (!confirm("이 점검 항목을 삭제할까요? 기존 점검 이력은 유지됩니다.")) return;
      state.items = state.items.map((itemRow) => itemRow.id === id ? { ...itemRow, active: false } : itemRow);
      if (!(await persistAndSync("items"))) return;
      render();
    }

    function setToolAddSubmitting(submitting) {
      state.toolAddSubmitting = Boolean(submitting);
      const disabled = state.toolAddSubmitting || !state.adminMode;
      const input = $("newToolName");
      const nature = $("newToolNature");
      const addButton = document.querySelector("[data-action='add-tool']");
      const toggleButton = document.querySelector("[data-action='toggle-tool-add']");
      if (input) input.disabled = disabled;
      if (nature) nature.disabled = disabled;
      if (addButton) {
        addButton.disabled = disabled;
        addButton.textContent = state.toolAddSubmitting ? "추가 중..." : "공기구 추가";
      }
      if (toggleButton) toggleButton.disabled = disabled;
    }

    async function addTool() {
      if (state.toolAddSubmitting) return;
      if (!requireAdminWrite()) return;
      const input = $("newToolName");
      const nature = normalizeToolNature($("newToolNature")?.value);
      const name = input?.value.trim() || "";
      if (!name) return toast("공기구/준비물 이름을 입력하세요.");
      const tool = {
        id: uid("tool"),
        categoryId: "",
        name,
        nature,
        order: activeTools().length + 1,
        deleted: false,
      };
      setToolAddSubmitting(true);
      let saved = false;
      try {
        state.tools.push(tool);
        saved = await persistAndSync("tools");
        if (!saved) return;
        input.value = "";
        state.toolAddOpen = false;
        render();
        toast("공기구/준비물을 추가했습니다.");
      } finally {
        if (!saved) state.tools = state.tools.filter((row) => row.id !== tool.id);
        setToolAddSubmitting(false);
      }
    }

    async function saveTool(id) {
      if (!requireAdminWrite()) return;
      const input = $(`toolName_${id}`);
      const name = input?.value.trim() || "";
      const nature = normalizeToolNature($(`toolNature_${id}`)?.value);
      if (!name) return toast("공기구/준비물 이름을 입력하세요.");
      state.tools = state.tools.map((row) => row.id === id ? { ...row, name, nature } : row);
      state.editToolId = null;
      if (!(await persistAndSync("tools"))) return;
      render();
      toast("공기구/준비물을 수정했습니다.");
    }

    async function deleteTool(id) {
      if (!requireAdminWrite()) return;
      const tool = toolById(id);
      if (!tool) return;
      if (!confirm(`${tool.name} 공기구/준비물을 삭제할까요?`)) return;
      state.tools = state.tools.map((row) => row.id === id ? { ...row, deleted: true } : row);
      state.items = state.items.map((row) => ({ ...row, toolIds: sanitizeToolIds(row.toolIds).filter((toolId) => toolId !== id) }));
      state.categories = state.categories.map((row) => ({ ...row, toolIds: sanitizeToolIds(row.toolIds).filter((toolId) => toolId !== id) }));
      state.draft.selectedToolIds = sanitizeToolIds(state.draft.selectedToolIds).filter((toolId) => toolId !== id);
      if (state.editToolId === id) state.editToolId = null;
      if (!(await persistAndSync(["tools", "items", "categories"]))) return;
      render();
      toast("공기구/준비물을 삭제했습니다.");
    }

    async function toggleRequireToolCheck(categoryId) {
      if (!requireAdminWrite()) return;
      state.categories = state.categories.map((row) => row.id === categoryId ? { ...row, requireToolCheck: row.requireToolCheck === false } : row);
      if (!(await persistAndSync("categories"))) return;
      render();
    }

    function pictogramMimeType(file) {
      const type = String(file?.type || "").toLowerCase();
      if (PICTOGRAM_IMAGE_MIME_TYPES.has(type)) return type;
      const name = String(file?.name || "").toLowerCase();
      if (name.endsWith(".png")) return "image/png";
      if (name.endsWith(".webp")) return "image/webp";
      if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
      return "";
    }

    function validatePictogramFile(file) {
      if (!file) return "이미지 파일을 선택하세요.";
      if (!PICTOGRAM_IMAGE_MIME_TYPES.has(pictogramMimeType(file))) return "PNG, JPG, WebP 이미지만 사용할 수 있습니다.";
      if (Number(file.size || 0) > PICTOGRAM_IMAGE_MAX_BYTES) return `픽토그램 이미지는 ${formatBytes(PICTOGRAM_IMAGE_MAX_BYTES)} 이하로 등록하세요.`;
      return "";
    }

    async function uploadPictogramImage(id, file, label, sortOrder) {
      const dataUrl = await fileToDataUrl(file);
      if (!dataUrl) throw new Error("pictogram_file_read_failed");
      const result = await invokeAdminMutation("uploadPictogramImage", {
        pictogramId: id,
        fileName: file.name || `${id}.png`,
        mimeType: pictogramMimeType(file),
        fileSize: Number(file.size || 0),
        label,
        sortOrder,
        dataUrl,
      });
      return result.pictogram || {};
    }

    async function addPictogram() {
      if (!requireAdminWrite()) return;
      const label = $("newPictogramLabel")?.value.trim() || "";
      const file = $("newPictogramFile")?.files?.[0];
      if (!label) return toast("픽토그램 이름을 입력하세요.");
      const fileError = validatePictogramFile(file);
      if (fileError) return toast(fileError);
      const id = uid("pictogram");
      const sortOrder = pictogramLibrary().length + 1;
      setSyncStatus("픽토그램 업로드 중", "pending");
      try {
        const pictogram = await uploadPictogramImage(id, file, label, sortOrder);
        state.pictograms.push({ ...pictogram, id, label, source: "custom", deleted: false, order: sortOrder });
        $("newPictogramLabel").value = "";
        $("newPictogramFile").value = "";
        persist();
        setSyncStatus("온라인", "online");
        render();
        toast("사용자 지정 픽토그램을 추가했습니다.");
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("픽토그램 업로드 실패 — 권한과 연결 상태를 확인해주세요.");
      }
    }

    async function savePictogram(id) {
      if (!requireAdminWrite()) return;
      const label = $(`pictogramLabel_${id}`)?.value.trim() || "";
      if (!label) return toast("픽토그램 이름을 입력하세요.");
      const previousPictograms = state.pictograms;
      const nextPictogram = state.pictograms.find((row) => row.id === id && row.source === "custom" && row.deleted !== true);
      if (!nextPictogram) return toast("수정할 픽토그램을 찾을 수 없습니다.");
      const updatedPictogram = { ...nextPictogram, label };
      state.pictograms = state.pictograms.map((row) => row.id === id ? updatedPictogram : row);
      if (!(await upsertAdminRows("pictograms", updatedPictogram))) {
        state.pictograms = previousPictograms;
        persist();
        render();
        return;
      }
      persist();
      render();
      toast("픽토그램 이름만 수정했습니다.");
    }

    async function deletePictogram(id) {
      if (!requireAdminWrite()) return;
      const pictogram = state.pictograms.find((row) => row.id === id);
      if (!pictogram || pictogram.source !== "custom") return toast("기본 픽토그램은 삭제할 수 없습니다.");
      if (!confirm(`${pictogram.label} 픽토그램을 삭제할까요?`)) return;
      const fallback = BUILT_IN_PICTOGRAMS[0]?.id || "blockAssembly";
      const affected = state.categories.some((row) => row.icon === id);
      try {
        await invokeAdminMutation("deletePictogram", { pictogramId: id, fallbackIcon: fallback });
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        return toast("픽토그램 삭제 실패 — 연결 상태를 확인한 뒤 다시 시도해주세요.");
      }
      state.pictograms = state.pictograms.map((row) => row.id === id ? { ...row, deleted: true } : row);
      state.categories = state.categories.map((row) => row.icon === id ? { ...row, icon: fallback } : row);
      persist();
      setSyncStatus("온라인", "online");
      render();
      toast(affected ? "사용 중인 작업 유형은 기본 픽토그램으로 되돌렸습니다." : "픽토그램을 삭제했습니다.");
    }

    function photoExtension(file) {
      const name = String(file && file.name || "").toLowerCase();
      const ext = name.split(".").pop();
      if (["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(ext)) return ext;
      const type = String(file?.type || "").toLowerCase();
      if (type.includes("png")) return "png";
      if (type.includes("webp")) return "webp";
      if (type.includes("heic")) return "heic";
      if (type.includes("heif")) return "heif";
      return "jpg";
    }

    function photoMimeType(file) {
      const type = String(file?.type || "").toLowerCase();
      if (type.startsWith("image/") && type !== "image/jpg") return type;
      const ext = photoExtension(file);
      if (ext === "png") return "image/png";
      if (ext === "webp") return "image/webp";
      if (ext === "heic") return "image/heic";
      if (ext === "heif") return "image/heif";
      return "image/jpeg";
    }

    function normalizedPhotoFile(file) {
      if (!file) return file;
      const type = photoMimeType(file);
      if (file.type === type) return file;
      return new File([file], file.name || `photo.${photoExtension(file)}`, {
        type,
        lastModified: file.lastModified || Date.now(),
      });
    }

    function compressedPhotoName(file) {
      const stem = String(file?.name || "photo")
        .replace(/\.[^.]+$/, "")
        .replace(/[^\w-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        || "photo";
      return `${stem}.jpg`;
    }

    async function compressUnsafePhotoFile(file) {
      if (!file || !/^image\/(jpeg|png|webp)$/i.test(photoMimeType(file))) return file;
      const url = URL.createObjectURL(file);
      try {
        const image = await imageFromObjectUrl(url);
        const width = image.naturalWidth || image.width || 0;
        const height = image.naturalHeight || image.height || 0;
        if (!width || !height) return file;
        const scale = Math.min(1, ISSUE_PHOTO_UPLOAD_MAX_SIDE / Math.max(width, height));
        if (scale >= 1 && Number(file.size || 0) <= 500 * 1024) return file;
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const context = canvas.getContext("2d");
        if (!context) return file;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", ISSUE_PHOTO_UPLOAD_QUALITY));
        if (!blob || blob.size >= Number(file.size || 0)) return file;
        return new File([blob], compressedPhotoName(file), {
          type: "image/jpeg",
          lastModified: file.lastModified || Date.now(),
        });
      } catch (error) {
        console.warn("photo compression failed", error);
        return file;
      } finally {
        URL.revokeObjectURL(url);
      }
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
        const file = normalizedPhotoFile(files[index]);
        const dataUrl = file.size <= PENDING_PHOTO_RETRY_MAX_BYTES ? await fileToDataUrl(file) : "";
        entries.push({
          id: uid("pendingPhoto"),
          issueId,
          ownerWorkerId: String(state.workerSession?.workerId || ""),
          fileName: file.name || `photo-${index + 1}.${photoExtension(file)}`,
          fileType: photoMimeType(file),
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

    async function uploadUnsafePhotos(issueId, files, onUploaded = () => {}) {
      const client = supabaseClient();
      if (!files.length) return [];
      if (!client) throw new Error("사진 업로드 서버 연결이 없습니다.");
      if (!(await ensureWorkerMutationSession())) throw new Error("worker_mutation_session_required");
      const config = remoteConfigByKey("issuePhotos");
      if (!config) throw new Error("issue_photo_config_missing");
      const uploaded = [];
      for (let index = 0; index < files.length; index += 1) {
        let upload = {};
        let completedPhoto = null;
        try {
          const file = await compressUnsafePhotoFile(normalizedPhotoFile(files[index]));
          const mimeType = photoMimeType(file);
          const uploadResponse = await invokeWorkerMutation("createIssuePhotoUpload", {
            targetId: issueId,
            mimeType,
            fileSize: Number(file.size || 0),
          });
          upload = uploadResponse.upload || {};
          if (!upload.photoId || !upload.path || !upload.token) throw new Error("issue_photo_upload_url_missing");
          const { error } = await client.storage.from(upload.bucket || ISSUE_PHOTO_BUCKET).uploadToSignedUrl(
            upload.path,
            upload.token,
            file,
            {
              contentType: photoMimeType(file),
              cacheControl: String(ISSUE_PHOTO_PRIVATE_CACHE_SECONDS),
            },
          );
          if (error) throw error;
          const completeResponse = await invokeWorkerMutation("completeIssuePhotoUpload", {
            targetId: issueId,
            photoId: upload.photoId,
            storagePath: upload.path,
          });
          if (!completeResponse.photo) throw new Error("issue_photo_complete_missing");
          completedPhoto = config.fromDb(completeResponse.photo);
          uploaded.push(completedPhoto);
          await onUploaded(completedPhoto);
        } catch (error) {
          const failure = error instanceof Error ? error : new Error(String(error || "issue_photo_upload_failed"));
          failure.pendingPhotoFiles = files.slice(index + (completedPhoto ? 1 : 0));
          throw failure;
        }
      }
      return uploaded;
    }

    function publicPhotoUrl(photo) {
      const storagePath = String(photo.storagePath || "");
      if (/^(data:|blob:)/.test(storagePath)) return storagePath;
      if (!photo.signedUrl) return "";
      if (photo.signedUrlExpiresAt && Date.parse(photo.signedUrlExpiresAt) <= Date.now()) return "";
      return photo.signedUrl;
    }

    async function syncUnsafeIssue(row, files) {
      try {
        const client = supabaseClient();
        const issueConfig = remoteConfigByKey("unsafeIssues");
        if (!client || !issueConfig) throw new Error("unsafe_issue_sync_unavailable");
        await upsertTable(client, issueConfig, [row]);
        const photos = await uploadUnsafePhotos(row.id, files, async (photo) => {
          state.issuePhotos = [
            ...state.issuePhotos.filter((item) => item.id !== photo.id),
            photo,
          ];
          persist();
        });
        state.pendingPhotoUploads = state.pendingPhotoUploads.filter((item) => item.issueId !== row.id);
        markUnsafePhotoUploading(row.id, false);
        persist();
        render();
        if (photos.length) toast(`사진 ${photos.length}장 업로드가 완료되었습니다.`);
        return true;
      } catch (error) {
        console.error(error);
        markUnsafePhotoUploading(row.id, false);
        const pendingFiles = Array.isArray(error?.pendingPhotoFiles) ? error.pendingPhotoFiles : files;
        if (pendingFiles.length) await createPendingPhotoUploads(row.id, pendingFiles, error);
        else state.pendingPhotoUploads = state.pendingPhotoUploads.filter((item) => item.issueId !== row.id);
        enqueueSyncRows("unsafeIssues", [row]);
        flushPendingSyncQueue();
        render();
        toast(files.length
          ? "사진 업로드에 실패했습니다. 상세 화면에서 재시도할 수 있습니다."
          : "불안전요소 서버 전송에 실패했습니다. 연결되면 다시 전송합니다.");
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

    async function retryPendingPhotoUploadWithFiles(issueId, selectedFiles) {
      const files = selectedFiles.slice(0, ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS);
      if (!issueId || !files.length) return;
      if (selectedFiles.length > ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS) {
        toast(`사진은 최대 ${ISSUE_MATERIAL_RULES.MAX_UNSAFE_PHOTOS}개까지 첨부할 수 있습니다.`);
      }
      setSyncStatus("사진 재전송 중", "pending");
      const row = state.unsafeIssues.find((item) => item.id === issueId);
      const ok = await syncUnsafeIssue(row || { id: issueId }, files);
      render();
      toast(ok ? "사진 업로드를 다시 완료했습니다." : "사진 업로드 재시도에 실패했습니다.");
    }

    function savePendingMissingMaterialNotifications() {
      state.pendingMissingMaterialNotifications = normalizePendingMissingMaterialNotifications(
        state.pendingMissingMaterialNotifications,
      );
      saveJson("pendingMissingMaterialNotifications", state.pendingMissingMaterialNotifications);
    }

    function enqueueMissingMaterialNotification(row) {
      const materialId = String(row?.id || "");
      const ownerWorkerId = String(row?.workerId || state.workerSession?.workerId || "");
      if (!materialId || !ownerWorkerId) return;
      const existing = state.pendingMissingMaterialNotifications.find((entry) => (
        entry.materialId === materialId && entry.ownerWorkerId === ownerWorkerId
      ));
      if (existing) {
        existing.nextRetryAt = "";
      } else {
        state.pendingMissingMaterialNotifications.push({
          materialId,
          ownerWorkerId,
          attempts: 0,
          createdAt: serverNow().toISOString(),
          nextRetryAt: "",
        });
      }
      savePendingMissingMaterialNotifications();
    }

    async function flushPendingMissingMaterialNotifications() {
      if (state.missingMaterialNotificationFlushInFlight) return false;
      const client = supabaseClient();
      const config = remoteConfigByKey("missingMaterials");
      const workerId = String(state.workerSession?.workerId || "");
      if (!client || !config || !workerId) return false;
      const now = Date.now();
      const dueEntries = state.pendingMissingMaterialNotifications.filter((entry) => (
        entry.ownerWorkerId === workerId
        && (!entry.nextRetryAt || Date.parse(entry.nextRetryAt) <= now)
      ));
      if (!dueEntries.length) return true;
      state.missingMaterialNotificationFlushInFlight = true;
      let allDelivered = true;
      try {
        for (const entry of dueEntries) {
          const row = state.missingMaterials.find((item) => String(item.id) === entry.materialId);
          if (!row) {
            allDelivered = false;
            continue;
          }
          try {
            await upsertTable(client, config, [row], { expectedWorkerId: workerId });
            removePendingSyncRows("missingMaterials", [row.id]);
            if (!(await notifyMissingMaterialRegistered(row))) throw new Error("missing_material_push_incomplete");
            state.pendingMissingMaterialNotifications = state.pendingMissingMaterialNotifications.filter((item) => (
              item.materialId !== entry.materialId || item.ownerWorkerId !== entry.ownerWorkerId
            ));
          } catch (error) {
            console.warn("missing material notification retry failed", error);
            entry.attempts = Math.min(MAX_SYNC_ATTEMPTS, Number(entry.attempts || 0) + 1);
            entry.nextRetryAt = new Date(Date.now() + SYNC_RETRY_DELAY_MS * entry.attempts).toISOString();
            allDelivered = false;
          }
          savePendingMissingMaterialNotifications();
        }
      } finally {
        state.missingMaterialNotificationFlushInFlight = false;
      }
      if (state.pendingMissingMaterialNotifications.length) {
        setSyncStatus("누락자재 알림 재시도 대기", "pending");
        scheduleSyncRetry();
      }
      refreshVisiblePendingSyncStatus();
      return allDelivered;
    }

    async function syncMissingMaterial(row) {
      persist();
      enqueueSyncRows("missingMaterials", [row]);
      enqueueMissingMaterialNotification(row);
      await flushPendingSyncQueue();
      const delivered = await flushPendingMissingMaterialNotifications();
      const stillPending = state.pendingMissingMaterialNotifications.some((entry) => entry.materialId === String(row?.id || ""));
      return delivered && !stillPending;
    }

    async function deleteUnsafePhotos(id) {
      if (!id) return true;
      try {
        await invokeAdminMutation("deleteIssuePhotos", {
          targetType: "unsafe_issue",
          targetIds: [id],
        });
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("사진 삭제 실패 — 권한과 연결 상태를 확인해주세요.");
        return false;
      }
    }

    async function syncAdminKeysNow(keys) {
      const client = supabaseClient();
      const targetKeys = syncableKeys(keys);
      if (!client || !targetKeys.length) return false;
      setSyncStatus("동기화 중", "pending");
      try {
        for (const key of targetKeys) {
          const config = remoteConfigByKey(key);
          const rows = Array.isArray(state[key]) ? state[key] : [];
          await upsertTable(client, config, rows);
        }
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("저장 실패 — 권한과 연결 상태를 확인해주세요.");
        return false;
      }
    }

    async function persistAndSync(keys = null, options = {}) {
      const adminKeys = syncableKeys(keys).some((key) => ADMIN_REMOTE_KEYS.has(key));
      if (adminKeys && isSyncConfigured()) {
        if (!(await syncAdminKeysNow(keys))) return false;
        persist();
        return true;
      }
      persist();
      if (!isSyncConfigured()) return true;
      enqueueSync(keys);
      if (options.waitForSync || adminKeys) return flushPendingSyncQueue();
      flushPendingSyncQueue();
      return true;
    }

    function remoteConfigByKey(key) {
      return REMOTE_TABLES.find((config) => config.key === key);
    }

    function remoteErrorText(error) {
      if (!error) return "";
      if (typeof error === "string") return error;
      const parts = [
        error.message,
        error.details,
        error.hint,
        error.code,
        error.error,
        error.name,
      ];
      try {
        parts.push(JSON.stringify(error));
      } catch (_) {}
      return parts.filter(Boolean).join(" ");
    }

    function remoteSelectColumns(config, fallback = false) {
      return fallback && config?.fallbackSelectColumns ? config.fallbackSelectColumns : config?.selectColumns;
    }

    function shouldRetryRemoteWithoutOptionalColumns(config, error) {
      if (!config || (!config.fallbackSelectColumns && !config.fallbackPayload)) return false;
      return /status_history|schema cache|column|PGRST|admin_upsert_failed/i.test(remoteErrorText(error));
    }

    function remoteFallbackPayload(config, payload) {
      return typeof config?.fallbackPayload === "function" ? config.fallbackPayload(payload) : payload;
    }

    function syncableKeys(keys) {
      const values = Array.isArray(keys) ? keys : (keys ? [keys] : []);
      return [...new Set(values.map(String).filter((key) => remoteConfigByKey(key)))];
    }

    function remoteListLimit(key) {
      const config = remoteConfigByKey(key);
      const configured = Number(state.remoteListLimits?.[key] || 0);
      return Math.max(configured || Number(config?.limit || 0), Number(config?.limit || 0), 0);
    }

    function setRemoteListLimit(key, limit) {
      state.remoteListLimits = {
        ...(state.remoteListLimits || {}),
        [key]: Math.max(Number(limit || 0), Number(remoteConfigByKey(key)?.limit || 0)),
      };
      saveJson("remoteListLimits", state.remoteListLimits);
    }

    async function loadMoreHistory() {
      const current = remoteListLimit("inspections") || DEFAULT_REMOTE_LIST_LIMIT;
      setRemoteListLimit("inspections", current + DEFAULT_REMOTE_LIST_LIMIT);
      setSyncStatus("추가 이력 불러오는 중", "pending");
      await pullRemote({ force: true, silent: true, reason: "load-more-history" });
      renderPreservingScroll();
    }

    function saveSyncQueue() {
      saveJson("pendingSyncQueue", state.pendingSyncQueue);
    }

    function syncRowOwnerWorkerId(key, row) {
      if (!row) return "";
      if (key === "inspections") return String(row.workerId || row.workPrepWorkerId || "");
      if (key === "unsafeIssues" || key === "missingMaterials") return String(row.workerId || "");
      if (key !== "inspectionItems") return "";
      const inspection = state.inspections.find((item) => String(item.id) === String(row.inspectionId || ""));
      return String(inspection?.workerId || inspection?.workPrepWorkerId || "");
    }

    function pendingSyncJobTouchesWorkerData(job) {
      return job?.type === "full" || (job?.keys || []).some((key) => WORKER_INSERT_REMOTE_KEYS.has(key));
    }

    function pendingSyncJobOwnerWorkerId(job) {
      const explicitOwner = String(job?.ownerWorkerId || "");
      if (!pendingSyncJobTouchesWorkerData(job)) return "";
      if (job?.type !== "rows") return explicitOwner || null;
      const ownerIds = new Set();
      for (const key of job.keys || []) {
        if (!WORKER_INSERT_REMOTE_KEYS.has(key)) continue;
        const ids = new Set((job.rowIdsByKey?.[key] || []).map(String));
        const rows = (Array.isArray(state[key]) ? state[key] : []).filter((row) => ids.has(String(row.id)));
        rows.forEach((row) => {
          const ownerId = syncRowOwnerWorkerId(key, row);
          if (ownerId) ownerIds.add(ownerId);
        });
      }
      if (ownerIds.size > 1) return null;
      const inferredOwner = [...ownerIds][0] || "";
      if (explicitOwner && inferredOwner && explicitOwner !== inferredOwner) return null;
      return explicitOwner || inferredOwner || null;
    }

    function pendingSyncJobEligible(job, workerId) {
      if (job?.status === "failed" || job?.type === "full" || (job?.keys || []).includes("issuePhotos")) return false;
      if (!pendingSyncJobTouchesWorkerData(job)) return true;
      const ownerWorkerId = pendingSyncJobOwnerWorkerId(job);
      if (ownerWorkerId && !job.ownerWorkerId) job.ownerWorkerId = ownerWorkerId;
      const storedSession = job?.mutationSession;
      const storedSessionValid = Boolean(
        storedSession?.token
        && storedSession?.workerId === ownerWorkerId
        && (!storedSession.expiresAt || Date.parse(storedSession.expiresAt) > Date.now() + 10000)
      );
      return Boolean(storedSessionValid || (ownerWorkerId && ownerWorkerId === workerId));
    }

    function enqueueSync(keys = null) {
      if (!isSyncConfigured()) return;
      if (!keys) {
        state.pendingSyncQueue.push({
          id: uid("sync"),
          type: "full",
          keys: [],
          rowIdsByKey: {},
          ownerWorkerId: String(state.workerSession?.workerId || ""),
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
      const ownerIds = new Set(cleanRows.map((row) => syncRowOwnerWorkerId(key, row)).filter(Boolean));
      const currentWorkerId = String(state.workerSession?.workerId || "");
      const inferredOwner = ownerIds.size === 1 ? [...ownerIds][0] : "";
      const ownerWorkerId = WORKER_INSERT_REMOTE_KEYS.has(key)
        ? (inferredOwner && currentWorkerId && inferredOwner !== currentWorkerId ? "" : inferredOwner || currentWorkerId)
        : "";
      const mutationSession = WORKER_INSERT_REMOTE_KEYS.has(key)
        ? currentWorkerMutationSessionSnapshot()
        : null;
      const existing = state.pendingSyncQueue.find((job) => job.type === "rows"
        && job.id !== state.syncActiveJobId
        && job.status !== "failed"
        && job.keys.length === 1
        && job.keys[0] === key
        && String(job.ownerWorkerId || "") === ownerWorkerId);
      const nextIds = cleanRows.map((row) => row.id);
      if (existing) {
        existing.rowIdsByKey[key] = [...new Set([...(existing.rowIdsByKey[key] || []), ...nextIds])];
        existing.nextRetryAt = "";
        existing.mutationSession = mutationSession || existing.mutationSession || null;
      } else {
        state.pendingSyncQueue.push({
          id: uid("sync"),
          type: "rows",
          keys: [key],
          rowIdsByKey: { [key]: nextIds },
          ownerWorkerId,
          mutationSession,
          status: "pending",
          attempts: 0,
          createdAt: serverNow().toISOString(),
          nextRetryAt: "",
          lastError: "",
          failedAt: "",
        });
      }
      prunePendingSyncQueue();
      setSyncStatus("동기화 대기", "pending");
      saveSyncQueue();
    }

    function removePendingSyncRows(key, ids) {
      const removeIds = new Set((Array.isArray(ids) ? ids : [ids]).map((id) => String(id || "").trim()).filter(Boolean));
      if (!removeIds.size) return;
      state.pendingSyncQueue = normalizePendingSyncQueue(state.pendingSyncQueue)
        .map((job) => {
          if (job.type !== "rows" || !job.rowIdsByKey[key]) return job;
          const remainingIds = job.rowIdsByKey[key].filter((id) => !removeIds.has(String(id || "")));
          return {
            ...job,
            rowIdsByKey: {
              ...job.rowIdsByKey,
              [key]: remainingIds,
            },
          };
        })
        .filter((job) => job.type !== "rows" || job.keys.some((itemKey) => (job.rowIdsByKey[itemKey] || []).length));
      saveSyncQueue();
    }

    function abortActiveSyncRows(key, ids) {
      const activeJob = normalizePendingSyncQueue(state.pendingSyncQueue)
        .find((job) => job.id === state.syncActiveJobId);
      if (!activeJob || !StateShapeRules.syncJobContainsDeletedRows(activeJob, key, ids)) return false;
      if (state.syncActiveAbortController && !state.syncActiveAbortController.signal.aborted) {
        state.syncActiveAbortController.abort();
      }
      return true;
    }

    function applyDeletedRows(key, ids) {
      const result = StateShapeRules.removeRemoteDeletedRows({
        rows: state[key],
        archivedInspections: state.archivedInspections,
        inspectionItems: state.inspectionItems,
        selectedHistoryIds: state.selectedHistoryIds,
        historyDetailId: state.historyDetailId,
      }, key, ids);
      abortActiveSyncRows(key, ids);
      state[key] = result.rows;
      removePendingSyncRows(key, ids);
      if (key === "inspections") {
        if (result.removedItemIds.length) abortActiveSyncRows("inspectionItems", result.removedItemIds);
        state.archivedInspections = result.archivedInspections;
        state.inspectionItems = result.inspectionItems;
        state.selectedHistoryIds = result.selectedHistoryIds;
        state.historyDetailId = result.historyDetailId;
        if (result.removedItemIds.length) removePendingSyncRows("inspectionItems", result.removedItemIds);
      }
      return result.changed;
    }

    function applyRemoteInspectionTombstone(payload) {
      const deletedId = String(payload?.new?.inspection_id || "").trim();
      if (!deletedId) return false;
      const changed = applyDeletedRows("inspections", [deletedId]);
      if (changed) {
        persist();
        renderPreservingScroll();
      }
      return changed;
    }

    function isMissingInspectionDeletionTableError(error) {
      const code = String(error?.code || "").toUpperCase();
      if (code === "42P01" || code === "PGRST205") return true;
      const text = remoteErrorText(error).toLowerCase();
      return text.includes(INSPECTION_DELETION_TABLE)
        && /(does not exist|could not find|schema cache|relation)/.test(text);
    }

    function clearInspectionDeletionRealtimeChannel() {
      const activeChannel = state.inspectionDeletionRealtimeChannel;
      state.inspectionDeletionRealtimeChannel = null;
      state.inspectionDeletionRealtimeStatus = "";
      if (activeChannel) {
        try { supabaseClient()?.removeChannel(activeChannel); } catch (_) {}
      }
    }

    function waitForInspectionDeletionRealtimeReady() {
      if (state.inspectionDeletionTableAvailable === false) return Promise.resolve(false);
      if (state.inspectionDeletionRealtimeStatus === "SUBSCRIBED") return Promise.resolve(true);
      const startedAt = Date.now();
      return new Promise((resolve) => {
        const check = () => {
          if (state.inspectionDeletionRealtimeStatus === "SUBSCRIBED") return resolve(true);
          if (state.inspectionDeletionTableAvailable === false
            || Date.now() - startedAt >= INSPECTION_DELETION_REALTIME_READY_TIMEOUT_MS) {
            return resolve(false);
          }
          setTimeout(check, 25);
        };
        check();
      });
    }

    function renderManageItemSummaryRow(row) {
      return `<div class="item-row manage-item-row compact-manage-item-row">
        <div class="item-main">
          <div class="item-name" title="${esc(row.text)}">${esc(row.text)}</div>
          <div class="manage-item-meta">
            <span>${row.required ? "제출 필수" : "일반"}</span>
            <span>${esc(describeItemVisibility(row))}</span>
          </div>
        </div>
        ${badge(row.risk)}
        <button class="btn-light" data-edit-item="${esc(row.id)}" type="button">편집</button>
      </div>`;
    }

    function startInspectionDeletionRealtime() {
      if (state.inspectionDeletionTableAvailable === false) return Promise.resolve(false);
      const client = supabaseClient();
      if (!client || typeof client.channel !== "function") return Promise.resolve(false);
      if (state.inspectionDeletionRealtimeChannel) return waitForInspectionDeletionRealtimeReady();
      let channel = client.channel("gs-safety-inspection-deletions");
      channel = channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: INSPECTION_DELETION_TABLE },
        (payload) => {
          state.lastRemoteChangeAt = Date.now();
          applyRemoteInspectionTombstone(payload);
        },
      );
      state.inspectionDeletionRealtimeChannel = channel.subscribe((status) => {
        state.inspectionDeletionRealtimeStatus = status;
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          clearInspectionDeletionRealtimeChannel();
          scheduleRemoteRefresh("inspection-deletion-realtime-fallback", 0);
          if (state.inspectionDeletionTableAvailable !== false) {
            setTimeout(startInspectionDeletionRealtime, 5000);
          }
        }
      });
      return waitForInspectionDeletionRealtimeReady();
    }

    async function reconcileDeletedInspectionRows(client) {
      const config = remoteConfigByKey("inspections");
      if (!client || !config) return false;
      const queuedJobs = normalizePendingSyncQueue(state.pendingSyncQueue);
      const hasFullJob = queuedJobs.some((job) => job.type === "full");
      const cachedRows = [
        ...(Array.isArray(state.inspections) ? state.inspections : []),
        ...(Array.isArray(state.archivedInspections) ? state.archivedInspections : []),
      ];
      const pendingIds = pendingSyncRowsForKey("inspections").map((row) => row.id);
      const pendingIdSet = new Set(pendingIds.map((id) => String(id || "").trim()).filter(Boolean));
      const cachedIds = [...new Set(cachedRows
        .map((row) => String(row?.id || "").trim())
        .filter(Boolean))];

      try {
        const tombstoneIds = [];
        try {
          if (cachedIds.length) {
            for (let index = 0; index < cachedIds.length; index += REMOTE_DELETE_RECONCILE_BATCH_SIZE) {
              const chunk = cachedIds.slice(index, index + REMOTE_DELETE_RECONCILE_BATCH_SIZE);
              const { data, error } = await client
                .from(INSPECTION_DELETION_TABLE)
                .select("inspection_id")
                .in("inspection_id", chunk);
              if (error) throw error;
              if (!Array.isArray(data)) throw new Error("inspection_tombstone_reconcile_invalid_response");
              data.forEach((row) => {
                const id = String(row?.inspection_id || "").trim();
                if (id) tombstoneIds.push(id);
              });
            }
          } else {
            const { data, error } = await client
              .from(INSPECTION_DELETION_TABLE)
              .select("inspection_id")
              .limit(1);
            if (error) throw error;
            if (!Array.isArray(data)) throw new Error("inspection_tombstone_probe_invalid_response");
          }
          state.inspectionDeletionTableAvailable = true;
          startInspectionDeletionRealtime();
        } catch (error) {
          if (!isMissingInspectionDeletionTableError(error)) throw error;
          state.inspectionDeletionTableAvailable = false;
          clearInspectionDeletionRealtimeChannel();
        }

        const existingIds = [];
        if (!hasFullJob) {
          const tombstoneIdSet = new Set(tombstoneIds);
          const candidateIds = cachedIds.filter((id) => !pendingIdSet.has(id) && !tombstoneIdSet.has(id));
          for (let index = 0; index < candidateIds.length; index += REMOTE_DELETE_RECONCILE_BATCH_SIZE) {
            const chunk = candidateIds.slice(index, index + REMOTE_DELETE_RECONCILE_BATCH_SIZE);
            const { data, error } = await client
              .from(config.readTable || config.table)
              .select("id")
              .in("id", chunk);
            if (error) throw error;
            if (!Array.isArray(data)) throw new Error("inspection_delete_reconcile_invalid_response");
            data.forEach((row) => {
              const id = String(row?.id || "").trim();
              if (id) existingIds.push(id);
            });
          }
        }
        const deletedIds = StateShapeRules.reconciledRemoteDeletedRowIds({
          cachedRows,
          tombstoneIds,
          existingIds,
          pendingIds,
          preserveUnconfirmedMissing: hasFullJob,
        });
        if (deletedIds.length) applyDeletedRows("inspections", deletedIds);
        state.lastRemoteDeleteReconcileAt = Date.now();
        return deletedIds.length > 0;
      } catch (error) {
        console.warn("삭제된 점검 이력 재확인 실패:", error);
        return false;
      }
    }

    function prunePendingSyncQueue() {
      state.pendingSyncQueue = normalizePendingSyncQueue(state.pendingSyncQueue);
      const latestFullByOwner = new Map();
      state.pendingSyncQueue.forEach((job) => {
        if (job.type === "full") latestFullByOwner.set(String(job.ownerWorkerId || ""), job);
      });
      state.pendingSyncQueue = state.pendingSyncQueue.filter((job) => job.type !== "full"
        || latestFullByOwner.get(String(job.ownerWorkerId || "")) === job);
    }

    function scheduleSyncRetry() {
      if (state.syncRetryTimer) clearTimeout(state.syncRetryTimer);
      state.syncRetryTimer = setTimeout(() => {
        state.syncRetryTimer = null;
        flushPendingSyncQueue();
        flushPendingMissingMaterialNotifications();
      }, SYNC_RETRY_DELAY_MS);
    }

    function pendingSyncFailure(error) {
      const code = String(error?.code || error?.message || error || "");
      if (/worker_inspection_forbidden|work prep participant forbidden/i.test(code)) {
        return {
          terminal: true,
          message: "오늘 작업준비 명단에 없어 제출이 거부되었습니다. 조장/반장에게 작업준비 등록을 요청한 뒤 다시 시도하세요.",
        };
      }
      if (/mutation_session_expired|mutation_session_invalid|worker_mutation_session_required|pending_sync_worker_changed/i.test(code)) {
        return {
          terminal: true,
          message: "전송 인증이 만료되었습니다. 같은 작업자로 다시 로그인한 뒤 다시 시도하세요.",
        };
      }
      if (/full_sync_requires_review/i.test(code)) {
        return { terminal: true, message: "이전 전체 동기화 작업은 자동 전송할 수 없어 확인이 필요합니다." };
      }
      if (/pending_sync_rows_missing/i.test(code)) {
        return { terminal: true, message: "기기에 원본 데이터가 없어 자동 전송할 수 없습니다." };
      }
      return { terminal: false, message: remoteErrorMessage(error) };
    }

    async function retryPendingSyncJob(id) {
      const job = state.pendingSyncQueue.find((item) => item.id === id);
      if (!job) return;
      if (pendingSyncJobTouchesWorkerData(job)) {
        const ownerWorkerId = pendingSyncJobOwnerWorkerId(job);
        const currentWorkerId = String(state.workerSession?.workerId || "");
        if (ownerWorkerId === currentWorkerId) {
          if (!(await ensureWorkerMutationSession())) {
            toast("같은 작업자로 다시 로그인한 뒤 재시도하세요.");
            return;
          }
          job.mutationSession = currentWorkerMutationSessionSnapshot();
        }
        const expiresAt = String(job.mutationSession?.expiresAt || "");
        if (!job.mutationSession?.token || (expiresAt && Date.parse(expiresAt) <= Date.now() + 10000)) {
          toast("같은 작업자로 다시 로그인한 뒤 재시도하세요.");
          return;
        }
      }
      job.status = "pending";
      job.attempts = 0;
      job.nextRetryAt = "";
      job.lastError = "";
      job.failedAt = "";
      saveSyncQueue();
      renderPreservingScroll();
      flushPendingSyncQueue();
    }

    function discardPendingSyncJob(id) {
      state.pendingSyncQueue = state.pendingSyncQueue.filter((job) => job.id !== id);
      saveSyncQueue();
      setSyncStatus(state.pendingSyncQueue.some((job) => job.status === "failed") ? "전송 실패함" : "온라인",
        state.pendingSyncQueue.some((job) => job.status === "failed") ? "error" : "online");
      renderPreservingScroll();
    }

    async function flushPendingSyncQueue() {
      const client = supabaseClient();
      if (!client) {
        setSyncStatus("로컬 저장", "offline");
        refreshVisiblePendingSyncStatus();
        return false;
      }
      if (state.syncFlushInFlight) return false;
      prunePendingSyncQueue();
      const now = Date.now();
      const workerId = String(state.workerSession?.workerId || "");
      const job = state.pendingSyncQueue.find((item) => {
        if (item.nextRetryAt && Date.parse(item.nextRetryAt) > now) return false;
        if (!pendingSyncJobEligible(item, workerId)) return false;
        const writesInspectionHistory = StateShapeRules.syncJobRequiresInspectionDeleteWins(item);
        return !writesInspectionHistory || state.inspectionDeletionTableAvailable === true;
      });
      if (!job) {
        const hasEligibleRetry = state.pendingSyncQueue.some((item) => pendingSyncJobEligible(item, workerId));
        if (hasEligibleRetry) scheduleSyncRetry();
        if (state.pendingSyncQueue.length) {
          const hasFailed = state.pendingSyncQueue.some((item) => item.status === "failed");
          setSyncStatus(hasFailed ? "전송 실패함" : "해당 작업자 로그인 후 동기화", hasFailed ? "error" : "pending");
          saveSyncQueue();
        }
        refreshVisiblePendingSyncStatus();
        return false;
      }
      state.syncFlushInFlight = true;
      state.syncActiveJobId = job.id;
      const abortController = typeof AbortController === "function" ? new AbortController() : null;
      state.syncActiveAbortController = abortController;
      setSyncStatus("동기화 중", "pending");
      try {
        if (job.type === "full") {
          throw new Error("full_sync_requires_review");
        } else {
          for (const key of job.keys) {
            const config = remoteConfigByKey(key);
            const ids = new Set((job.rowIdsByKey[key] || []).map(String));
            const rowsById = new Map();
            (Array.isArray(state[key]) ? state[key] : []).forEach((row) => {
              if (ids.has(String(row.id))) rowsById.set(String(row.id), row);
            });
            if ([...ids].some((id) => !rowsById.has(id))) throw new Error(`pending_sync_rows_missing:${key}`);
            const rows = [...rowsById.values()];
            await upsertTable(client, config, rows, {
              expectedWorkerId: pendingSyncJobOwnerWorkerId(job) || "",
              mutationSession: job.mutationSession || null,
              signal: abortController?.signal,
            });
            if (config.key === "inspections" || config.key === "inspectionItems") {
              const inspectionIds = new Set(config.key === "inspections"
                ? rows.map((row) => String(row.id))
                : rows.map((row) => String(row.inspectionId)));
              const itemIds = state.inspectionItems
                .filter((row) => inspectionIds.has(String(row.inspectionId)))
                .map((row) => row.id);
              removePendingSyncRows("inspections", [...inspectionIds]);
              removePendingSyncRows("inspectionItems", itemIds);
            }
          }
        }
        state.pendingSyncQueue = state.pendingSyncQueue.filter((item) => item.id !== job.id);
        saveSyncQueue();
        setSyncStatus(state.pendingSyncQueue.length ? "동기화 대기" : "온라인", state.pendingSyncQueue.length ? "pending" : "online");
        state.syncFlushInFlight = false;
        state.syncActiveJobId = "";
        state.syncActiveAbortController = null;
        refreshVisiblePendingSyncStatus();
        if (state.pendingSyncQueue.length) await flushPendingSyncQueue();
        return true;
      } catch (error) {
        const aborted = Boolean(abortController?.signal.aborted);
        if (!aborted) console.error(error);
        const activeJobStillQueued = state.pendingSyncQueue.some((item) => item.id === job.id);
        let terminal = false;
        if (activeJobStillQueued && aborted) {
          state.pendingSyncQueue = state.pendingSyncQueue.map((item) => item.id === job.id
            ? { ...item, status: "pending", nextRetryAt: "", lastError: "", failedAt: "" }
            : item);
        } else if (activeJobStillQueued) {
          const attempts = Math.min(MAX_SYNC_ATTEMPTS, (job.attempts || 0) + 1);
          const failure = pendingSyncFailure(error);
          terminal = failure.terminal || attempts >= MAX_SYNC_ATTEMPTS;
          job.status = terminal ? "failed" : "pending";
          const lastError = terminal && !failure.terminal
            ? `자동 재시도 ${MAX_SYNC_ATTEMPTS}회 실패: ${failure.message}`
            : failure.message;
          const failedAt = terminal ? new Date().toISOString() : "";
          const nextRetryAt = terminal ? "" : new Date(Date.now() + (SYNC_RETRY_DELAY_MS * attempts)).toISOString();
          state.pendingSyncQueue = state.pendingSyncQueue.map((item) => item.id === job.id
            ? { ...item, attempts, status: job.status, lastError, failedAt, nextRetryAt }
            : item);
        }
        saveSyncQueue();
        state.syncFlushInFlight = false;
        state.syncActiveJobId = "";
        state.syncActiveAbortController = null;
        setSyncStatus(terminal ? "전송 실패함" : (state.pendingSyncQueue.length ? "재시도 대기" : "온라인"), terminal ? "error" : (state.pendingSyncQueue.length ? "pending" : "online"));
        if (!terminal && state.pendingSyncQueue.length) scheduleSyncRetry();
        const failedJob = state.pendingSyncQueue.find((item) => item.id === job.id);
        if (terminal && /작업준비 명단/.test(failedJob?.lastError || "")) toast(failedJob.lastError);
        refreshVisiblePendingSyncStatus();
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

    async function invokeAdminMutation(action, payload = {}) {
      const client = supabaseClient();
      if (!client) throw new Error("Supabase client is not configured.");
      const { data, error } = await client.functions.invoke("admin-mutations", {
        body: {
          action,
          ...payload,
          adminSession: adminMutationAuthPayload(),
        },
      });
      if (error || data?.error) {
        let message = data?.error || error?.message;
        if (!data?.error && error?.context && typeof error.context.json === "function") {
          try {
            const context = typeof error.context.clone === "function" ? error.context.clone() : error.context;
            const errorPayload = await context.json();
            message = errorPayload?.error || errorPayload?.message || message;
          } catch (_) {}
        }
        const errorStatus = Number(error?.context?.status || 0);
        if (/admin_session_|admin_forbidden|403|jwt/i.test(String(message || "")) || errorStatus === 401 || errorStatus === 403) {
          clearAdminSessionState();
          setAdminMode(false);
        }
        throw new Error(message);
      }
      return data || { ok: true };
    }

    async function invokeWorkerMutation(action, payload = {}, options = {}) {
      const client = supabaseClient();
      if (!client) throw new Error("Supabase client is not configured.");
      const mutationSession = options.mutationSession || null;
      const { data, error } = await client.functions.invoke("admin-mutations", {
        body: {
          action,
          ...payload,
          mutationSession: workerMutationAuthPayload(mutationSession),
        },
      });
      if (error || data?.error) {
        let responseError = "";
        try {
          const response = error?.context?.clone ? error.context.clone() : error?.context;
          const body = response && typeof response.json === "function" ? await response.json() : null;
          responseError = String(body?.error || "");
        } catch (_) {}
        const message = responseError || data?.error || error?.message || "worker_mutation_failed";
        if (/admin_session_|mutation_session_|403|jwt/i.test(String(message || ""))
          && state.workerSession
          && (!mutationSession?.token || mutationSession.token === state.workerSession.mutationToken)) {
          state.workerSession = {
            ...state.workerSession,
            mutationToken: "",
            mutationExpiresAt: "",
          };
          saveWorkerSession(state.workerSession);
        }
        const mutationError = new Error(message);
        mutationError.code = message;
        throw mutationError;
      }
      return data || { ok: true };
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
          await upsertTable(client, config, state[config.key], { signal: options.signal });
        }
        if (!options.preserveQueue) setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        if (!options.preserveQueue) {
          setSyncStatus("동기화 오류", "error");
          toast("동기화 실패 — 연결 상태를 확인한 뒤 다시 시도해주세요.");
        }
        return false;
      }
    }

    async function syncInspectionHistory(inspection, inspectionItems) {
      const client = supabaseClient();
      if (!client) {
        setSyncStatus("로컬 저장", "offline");
        refreshVisiblePendingSyncStatus();
        return false;
      }

      const inspectionConfig = remoteConfigByKey("inspections");
      const itemConfig = remoteConfigByKey("inspectionItems");
      if (!inspectionConfig || !itemConfig) {
        setSyncStatus("동기화 설정 오류", "error");
        refreshVisiblePendingSyncStatus();
        return false;
      }
      enqueueSyncRows(inspectionConfig.key, [inspection]);
      enqueueSyncRows(itemConfig.key, inspectionItems);
      await flushPendingSyncQueue();
      refreshVisiblePendingSyncStatus();
      return inspectionPendingSyncJobs(inspection).length === 0;
    }

    function shouldRefreshRemote() {
      return isSyncConfigured() && document.visibilityState !== "hidden";
    }

    function scheduleRemoteRefresh(reason = "change", delay = REMOTE_REACTIVE_PULL_DELAY_MS) {
      if (!shouldRefreshRemote()) return;
      if (state.remoteRefreshTimer) clearTimeout(state.remoteRefreshTimer);
      state.remoteRefreshTimer = setTimeout(() => {
        state.remoteRefreshTimer = null;
        pullRemote({ force: true, silent: true, reason });
      }, Math.max(0, delay));
    }

    function realtimeRemoteConfigs() {
      return REMOTE_TABLES.filter((config) => REALTIME_REMOTE_KEYS.has(config.key));
    }

    function updateRealtimeCursor(config, dbRow) {
      const column = REALTIME_DELTA_COLUMNS.get(config.key);
      const value = column ? String(dbRow?.[column] || "") : "";
      if (!value) return;
      if (!state.remoteRealtimeCursors || typeof state.remoteRealtimeCursors !== "object" || Array.isArray(state.remoteRealtimeCursors)) {
        state.remoteRealtimeCursors = {};
      }
      const previous = String(state.remoteRealtimeCursors?.[config.key] || "");
      if (!previous || value > previous) state.remoteRealtimeCursors[config.key] = value;
    }

    function invalidateInspectionRangesForDate(date) {
      const target = String(date || "");
      const ranges = state.remoteLoadedInspectionRanges;
      if (!target || !ranges || typeof ranges !== "object") return;
      Object.keys(ranges).forEach((key) => {
        const [start, end] = key.split("~");
        if (start && end && target >= start && target <= end) delete ranges[key];
      });
    }

    function applyRemoteRealtimeRow(config, eventType, dbRow) {
      const id = String(dbRow?.id || "");
      if (!id) return false;
      updateRealtimeCursor(config, dbRow);
      const remove = eventType === "DELETE" || (config.key === "workPrepRecords" && Boolean(dbRow?.deleted_at));
      if (remove) {
        const changed = applyDeletedRows(config.key, [id]);
        if (config.key === "inspections") invalidateInspectionRangesForDate(dbRow?.date);
        return changed;
      }

      const remoteRow = config.fromDb(dbRow);
      const rows = Array.isArray(state[config.key]) ? state[config.key] : [];
      const index = rows.findIndex((row) => String(row?.id || "") === id);
      if (index >= 0) rows[index] = mergeRemoteRecord(rows[index], remoteRow);
      else rows.unshift(remoteRow);
      state[config.key] = config.key === "workPrepRecords" ? filterDeletedWorkPrepRecords(rows) : rows;
      if (config.key === "inspections") {
        invalidateInspectionRangesForDate(remoteRow.date);
        if (!Array.isArray(state.archivedInspections)) state.archivedInspections = [];
        const archivedIndex = state.archivedInspections.findIndex((row) => String(row?.id || "") === id);
        if (archivedIndex >= 0) state.archivedInspections[archivedIndex] = mergeRemoteRecord(state.archivedInspections[archivedIndex], remoteRow);
      }
      return true;
    }

    function finishRemoteRealtimeApply() {
      normalizeDataShape();
      state.inspections = state.inspections.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
      dedupeShips();
      cleanupDeliveredShips(true);
      persist();
      const hasPullFailure = Object.values(state.remotePullHealth || {}).some((health) => health?.error);
      setSyncStatus(hasPullFailure ? "일부 데이터 동기화 실패" : "실시간 연결", hasPullFailure ? "error" : "online");
      renderPreservingScroll();
    }

    function handleRemoteRealtimeChange(config, payload) {
      const eventType = String(payload?.eventType || payload?.type || "").toUpperCase();
      const dbRow = eventType === "DELETE" ? payload?.old : payload?.new;
      if (!eventType || !dbRow?.id) {
        scheduleRemoteRefresh(`realtime-invalid:${config.key}`, 0);
        return;
      }
      state.lastRemoteChangeAt = Date.now();
      if (applyRemoteRealtimeRow(config, eventType, dbRow)) finishRemoteRealtimeApply();
    }

    async function selectRealtimeGapTable(client, config) {
      const column = REALTIME_DELTA_COLUMNS.get(config.key);
      let cursor = String(state.remoteRealtimeCursors?.[config.key] || "");
      if (!column || !cursor) return { ...(await selectTable(client, config)), full: true };

      const rows = [];
      for (let page = 0; page < 10; page += 1) {
        const data = await selectDetailRows(client, config, (query) => query
          .gt(column, cursor)
          .order(column, { ascending: true })
          .limit(500));
        if (!data.length) break;
        rows.push(...data);
        data.forEach((row) => {
          const value = String(row?.[column] || "");
          if (value > cursor) cursor = value;
        });
        if (data.length < 500) break;
      }
      return { key: config.key, config, dbRows: rows, cursor, full: false };
    }

    async function pullRealtimeGap(reason = "reconnect") {
      const client = supabaseClient();
      if (!client || !shouldRefreshRemote()) return;
      if (state.remoteRealtimeGapInFlight) {
        state.remoteRealtimeGapQueuedReason = reason;
        return;
      }
      state.remoteRealtimeGapInFlight = true;
      try {
        const settled = await Promise.allSettled(realtimeRemoteConfigs().map((config) => selectRealtimeGapTable(client, config)));
        let changed = false;
        settled.forEach((result) => {
          if (result.status !== "fulfilled") {
            console.warn("실시간 공백 보정 실패:", result.reason);
            return;
          }
          if (result.value.full) {
            applyRemoteTableRows(result.value.key, result.value.rows);
            changed = true;
          } else {
            result.value.dbRows.forEach((row) => {
              changed = applyRemoteRealtimeRow(result.value.config, "UPDATE", row) || changed;
            });
          }
          if (result.value.cursor) state.remoteRealtimeCursors[result.value.key] = result.value.cursor;
        });
        const reconcileReason = reason === "subscribed" || reason === "reconnect";
        if (!state.lastRemoteDeleteReconcileAt
          || Date.now() - state.lastRemoteDeleteReconcileAt >= REMOTE_DELETE_RECONCILE_MS
          || reconcileReason) {
          changed = (await reconcileDeletedInspectionRows(client)) || changed;
        }
        if (changed) finishRemoteRealtimeApply();
        else saveJson("remoteRealtimeCursors", state.remoteRealtimeCursors || {});
        state.lastRemoteChangeAt = Date.now();
        if (reason) console.info(`실시간 공백 보정 완료: ${reason}`);
      } finally {
        state.remoteRealtimeGapInFlight = false;
        const queuedReason = state.remoteRealtimeGapQueuedReason;
        state.remoteRealtimeGapQueuedReason = "";
        if (queuedReason) queueMicrotask(() => pullRealtimeGap(queuedReason));
      }
    }

    async function handleSyncWake() {
      if (!isSyncConfigured()) return;
      ensureRemoteRealtimeConnection();
      await flushPendingSyncQueue();
      await flushPendingMissingMaterialNotifications();
      await pullRemote({ force: true, silent: true, reason: "wake" });
    }

    function handleStorageSyncWake(event) {
      if (!event.key || !event.key.startsWith(STORAGE_PREFIX)) return;
      const key = event.key.slice(STORAGE_PREFIX.length);
      if (!remoteConfigByKey(key)) return;
      scheduleRemoteRefresh("storage", 0);
    }

    function remoteRealtimeConnected() {
      return state.remoteRealtimeStatus === "SUBSCRIBED";
    }

    function stopRemotePolling() {
      if (!state.remotePollTimer) return;
      clearInterval(state.remotePollTimer);
      state.remotePollTimer = null;
    }

    function startRemotePolling() {
      if (!isSyncConfigured() || state.remotePollTimer || remoteRealtimeConnected()) return;
      state.remotePollTimer = setInterval(() => {
        if (remoteRealtimeConnected()) {
          stopRemotePolling();
          return;
        }
        if (!shouldRefreshRemote()) return;
        pullRealtimeGap("poll");
      }, REMOTE_POLL_INTERVAL_MS);
    }

    function clearRemoteRealtimeChannel() {
      const channel = state.remoteRealtimeChannel;
      state.remoteRealtimeChannel = null;
      state.remoteRealtimeStatus = "";
      if (channel) {
        try { supabaseClient()?.removeChannel(channel); } catch (_) {}
      }
    }

    function scheduleRemoteRealtimeRetry() {
      if (state.remoteRealtimeRetryTimer) return;
      state.remoteRealtimeRetryTimer = setTimeout(() => {
        state.remoteRealtimeRetryTimer = null;
        startRemoteRealtime();
      }, 5000);
    }

    function startRemoteRealtime() {
      const client = supabaseClient();
      if (!client || state.remoteRealtimeChannel || typeof client.channel !== "function") {
        if (!state.remoteRealtimeChannel) startRemotePolling();
        return;
      }

      let channel = client.channel("gs-safety-remote-sync");
      realtimeRemoteConfigs().forEach((config) => {
        channel = channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table: config.table },
          (payload) => handleRemoteRealtimeChange(config, payload),
        );
      });

      state.remoteRealtimeChannel = channel.subscribe((status) => {
        state.remoteRealtimeStatus = status;
        if (status === "SUBSCRIBED") {
          if (state.remoteRealtimeRetryTimer) clearTimeout(state.remoteRealtimeRetryTimer);
          state.remoteRealtimeRetryTimer = null;
          stopRemotePolling();
          startInspectionDeletionRealtime().then(() => pullRealtimeGap("subscribed"));
          return;
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          clearRemoteRealtimeChannel();
          startRemotePolling();
          scheduleRemoteRefresh("realtime-fallback", REMOTE_REACTIVE_PULL_DELAY_MS);
          scheduleRemoteRealtimeRetry();
        }
      });
    }

    function ensureRemoteRealtimeConnection() {
      const client = supabaseClient();
      const socketConnected = typeof client?.realtime?.isConnected === "function"
        ? client.realtime.isConnected()
        : remoteRealtimeConnected();
      if (remoteRealtimeConnected() && socketConnected) {
        startInspectionDeletionRealtime();
        return;
      }
      if (state.remoteRealtimeChannel) clearRemoteRealtimeChannel();
      startRemoteRealtime();
      startRemotePolling();
    }

    function startRemoteSync() {
      const inspectionDeletionRealtimeReady = startInspectionDeletionRealtime();
      startRemoteRealtime();
      if (!state.remoteRealtimeChannel) startRemotePolling();
      return inspectionDeletionRealtimeReady;
    }

    function remoteErrorMessage(error) {
      const raw = String(error?.message || error?.details || error || "알 수 없는 오류").trim();
      return raw.slice(0, 180);
    }

    async function selectAllRemoteIds(client, config) {
      const ids = [];
      const pageSize = 1000;
      for (let page = 0; page < 20; page += 1) {
        const from = page * pageSize;
        const { data, error } = await client
          .from(config.readTable || config.table)
          .select("id")
          .range(from, from + pageSize - 1);
        if (error) throw error;
        const rows = Array.isArray(data) ? data : [];
        rows.forEach((row) => {
          if (row?.id) ids.push(String(row.id));
        });
        if (rows.length < pageSize) break;
      }
      return ids;
    }

    async function reconcileRemoteIds(client, force = false) {
      if (!force && state.lastRemoteReconcileAt && Date.now() - state.lastRemoteReconcileAt < REMOTE_RECONCILE_INTERVAL_MS) return;
      const configs = REMOTE_TABLES.filter((config) => REMOTE_RECONCILE_KEYS.has(config.key));
      const settled = await Promise.allSettled(configs.map(async (config) => ({
        config,
        ids: await selectAllRemoteIds(client, config),
      })));
      let changed = false;
      settled.forEach((result) => {
        if (result.status !== "fulfilled") {
          console.warn("원격 ID 대사 실패:", result.reason);
          return;
        }
        const { config, ids } = result.value;
        const remoteIds = new Set(ids);
        pendingSyncRowsForKey(config.key).forEach((row) => remoteIds.add(String(row.id)));
        const before = Array.isArray(state[config.key]) ? state[config.key] : [];
        const after = before.filter((row) => remoteIds.has(String(row?.id || "")));
        if (after.length !== before.length) changed = true;
        state[config.key] = after;
        if (config.key === "inspections") {
          const archivedBefore = Array.isArray(state.archivedInspections) ? state.archivedInspections : [];
          state.archivedInspections = archivedBefore.filter((row) => remoteIds.has(String(row?.id || "")));
          const localInspectionIds = new Set([
            ...state.inspections.map((row) => String(row.id)),
            ...state.archivedInspections.map((row) => String(row.id)),
          ]);
          const pendingItemIds = new Set(pendingSyncRowsForKey("inspectionItems").map((row) => String(row.id)));
          state.inspectionItems = state.inspectionItems.filter((row) => (
            localInspectionIds.has(String(row.inspectionId)) || pendingItemIds.has(String(row.id))
          ));
        }
      });
      state.lastRemoteReconcileAt = Date.now();
      saveJson("lastRemoteReconcileAt", state.lastRemoteReconcileAt);
      if (changed) persist();
    }

    async function pullRemote(options = {}) {
      const client = supabaseClient();
      if (!client) return setSyncStatus("로컬 저장", "offline");
      if (state.remotePullInFlight) {
        state.remotePullQueuedOptions = {
          ...(state.remotePullQueuedOptions || {}),
          ...options,
          force: Boolean(state.remotePullQueuedOptions?.force || options.force),
        };
        return;
      }
      if (!options.force && state.lastRemotePullAt && Date.now() - state.lastRemotePullAt < REMOTE_PULL_THROTTLE_MS) {
        flushPendingSyncQueue();
        return;
      }
      state.remotePullInFlight = true;
      if (!options.silent) setSyncStatus("서버 확인 중", "pending");
      try {
        const requestedKeys = Array.isArray(options.keys) ? new Set(options.keys) : null;
        const pullConfigs = REMOTE_TABLES.filter((config) => config.pullOnStartup !== false && (!requestedKeys || requestedKeys.has(config.key)));
        if (!pullConfigs.length) return;
        const settled = await Promise.allSettled(pullConfigs.map((config) => selectTable(client, config)));
        const failures = [];
        const checkedAt = new Date().toISOString();
        settled.forEach((result, index) => {
          const config = pullConfigs[index];
          if (result.status === "fulfilled") {
            applyRemoteTableRows(result.value.key, result.value.rows);
            state.remotePullHealth[config.key] = {
              successAt: checkedAt,
              errorAt: "",
              error: "",
            };
          } else {
            const message = remoteErrorMessage(result.reason);
            failures.push({ key: config.key, error: result.reason });
            state.remotePullHealth[config.key] = {
              ...(state.remotePullHealth[config.key] || {}),
              errorAt: checkedAt,
              error: message,
            };
            console.warn("테이블 pull 실패:", result.reason);
          }
        });
        saveJson("remotePullHealth", state.remotePullHealth);
        if (failures.length === pullConfigs.length) throw failures[0].error;
        const reconcileReason = options.reason === "wake"
          || options.reason === "realtime-fallback"
          || options.reason === "inspection-deletion-realtime-fallback"
          || options.reason === "load-more-history";
        if (!state.lastRemoteDeleteReconcileAt
          || Date.now() - state.lastRemoteDeleteReconcileAt >= REMOTE_DELETE_RECONCILE_MS
          || reconcileReason) {
          await reconcileDeletedInspectionRows(client);
        }
        normalizeDataShape();
        state.inspections = state.inspections.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
        dedupeShips();
        cleanupDeliveredShips(true);
        await reconcileRemoteIds(client);
        state.lastRemotePullAt = Date.now();
        persist();
        setSyncStatus(failures.length ? "일부 데이터 동기화 실패" : "온라인", failures.length ? "error" : "online");
        render();
        flushPendingSyncQueue();
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        if (!options.silent) toast("데이터를 불러오지 못했습니다 — 잠시 후 다시 시도해주세요.");
      } finally {
        state.remotePullInFlight = false;
        const queuedOptions = state.remotePullQueuedOptions;
        state.remotePullQueuedOptions = null;
        if (queuedOptions) queueMicrotask(() => pullRemote(queuedOptions));
      }
    }

    async function resetRemoteHistory() {
      try {
        if (!canAttemptServerAdminWrite()) throw new Error("admin_session_required");
        await invokeAdminMutation("deleteAllInspectionHistory");
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("점검 이력 초기화 실패 — 연결 상태를 확인한 뒤 다시 시도해주세요.");
        return false;
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
      const inspectionIds = [...new Set((Array.isArray(ids) ? ids : []).map(String).filter(Boolean))];
      if (!inspectionIds.length) return true;
      try {
        if (!canAttemptServerAdminWrite()) throw new Error("admin_session_required");
        await invokeAdminMutation("deleteInspectionHistory", { ids: inspectionIds });
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("점검 이력 삭제 실패 — 연결 상태를 확인한 뒤 다시 시도해주세요.");
        return false;
      }
    }

    async function upsertAdminRows(key, rows) {
      const config = remoteConfigByKey(key);
      const cleanRows = (Array.isArray(rows) ? rows : [rows]).filter((row) => row && row.id);
      if (!config || !cleanRows.length) return false;
      try {
        const payload = cleanRows.map(config.toDb);
        try {
          await invokeAdminMutation("upsertRows", { key: config.key, rows: payload });
        } catch (error) {
          if (!shouldRetryRemoteWithoutOptionalColumns(config, error)) throw error;
          await invokeAdminMutation("upsertRows", { key: config.key, rows: remoteFallbackPayload(config, payload) });
        }
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("저장 실패 — 권한과 연결 상태를 확인해주세요.");
        return false;
      }
    }

    async function deleteRemoteShips(ids) {
      const client = supabaseClient();
      if (!ids.length) return true;
      if (!client) return false;
      try {
        await invokeAdminMutation("deleteRows", { key: "ships", ids });
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("호선 삭제 실패 — 연결 상태를 확인한 뒤 다시 시도해주세요.");
        return false;
      }
    }

    async function deleteRemoteRows(key, ids) {
      const client = supabaseClient();
      const config = remoteConfigByKey(key);
      if (!ids.length) return true;
      if (!client || !config) return false;
      try {
        if (ADMIN_REMOTE_KEYS.has(config.key) || WORKER_INSERT_REMOTE_KEYS.has(config.key)) {
          if (config.key === "workPrepRecords") {
            const expectedWorkerId = String(state.workerSession?.workerId || "");
            if (!(await ensureWorkPrepMutationSession())) throw new Error("work_prep_session_required");
            if (!expectedWorkerId
              || state.workerSession?.workerId !== expectedWorkerId
              || state.adminSessionWorkerId !== expectedWorkerId) throw new Error("work_prep_worker_changed");
          } else if (!canAttemptServerAdminWrite()) {
            throw new Error("admin_session_required");
          }
          await invokeAdminMutation("deleteRows", { key: config.key, ids });
          setSyncStatus("온라인", "online");
          return true;
        }
        const { error } = await client.from(config.table).delete().in("id", ids);
        if (error) throw error;
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("삭제 실패 — 연결 상태를 확인한 뒤 다시 시도해주세요.");
        return false;
      }
    }

    function throwIfRemoteSyncAborted(signal) {
      if (!signal?.aborted) return;
      const error = new Error("sync_aborted");
      error.name = "AbortError";
      throw error;
    }

    function withRemoteAbortSignal(query, signal) {
      if (signal && typeof query?.retry === "function") query = query.retry(false);
      if (signal && typeof query?.abortSignal === "function") return query.abortSignal(signal);
      return query;
    }

    async function upsertTable(client, config, rows, options = {}) {
      if (!config) throw new Error("Remote table config is missing.");
      const targetRows = config.rows ? config.rows(rows) : rows;
      if (!targetRows.length) return;
      const payload = targetRows.map(config.toDb);
      const runPublicUpsert = async (upsertRows, upsertOptions) => {
        throwIfRemoteSyncAborted(options.signal);
        const query = client.from(config.table).upsert(upsertRows, upsertOptions);
        const result = await withRemoteAbortSignal(query, options.signal);
        throwIfRemoteSyncAborted(options.signal);
        return result;
      };
      throwIfRemoteSyncAborted(options.signal);
      if (ADMIN_REMOTE_KEYS.has(config.key)) {
        if (config.key === "workPrepRecords") {
          const expectedWorkerId = String(state.workerSession?.workerId || "");
          if (!(await ensureWorkPrepMutationSession())) throw new Error("work_prep_session_required");
          if (!expectedWorkerId
            || state.workerSession?.workerId !== expectedWorkerId
            || state.adminSessionWorkerId !== expectedWorkerId) throw new Error("work_prep_worker_changed");
        }
        try {
          await invokeAdminMutation("upsertRows", { key: config.key, rows: payload });
        } catch (error) {
          if (!shouldRetryRemoteWithoutOptionalColumns(config, error)) throw error;
          await invokeAdminMutation("upsertRows", { key: config.key, rows: remoteFallbackPayload(config, payload) });
        }
        throwIfRemoteSyncAborted(options.signal);
        return;
      }
      if (WORKER_INSERT_REMOTE_KEYS.has(config.key)) {
        const expectedWorkerId = String(options.expectedWorkerId || state.workerSession?.workerId || "");
        let mutationSession = options.mutationSession || null;
        if (mutationSession?.token) {
          if (mutationSession.workerId !== expectedWorkerId) throw new Error("pending_sync_worker_changed");
          if (mutationSession.expiresAt && Date.parse(mutationSession.expiresAt) <= Date.now() + 10000) {
            throw new Error("mutation_session_expired");
          }
        } else {
          if (!expectedWorkerId || state.workerSession?.workerId !== expectedWorkerId) {
            throw new Error("pending_sync_worker_changed");
          }
          if (!(await ensureWorkerMutationSession())) throw new Error("worker_mutation_session_required");
          if (state.workerSession?.workerId !== expectedWorkerId) {
            throw new Error("pending_sync_worker_changed");
          }
          mutationSession = currentWorkerMutationSessionSnapshot();
        }
        if (config.key === "inspections" || config.key === "inspectionItems") {
          const inspectionConfig = remoteConfigByKey("inspections");
          const itemConfig = remoteConfigByKey("inspectionItems");
          if (!inspectionConfig || !itemConfig) throw new Error("inspection_sync_config_missing");
          const inspectionIds = new Set((config.key === "inspections" ? targetRows : targetRows.map((row) => ({
            id: row.inspectionId,
          }))).map((row) => String(row.id || "")).filter(Boolean));
          const inspections = state.inspections.filter((row) => inspectionIds.has(String(row.id)));
          if (inspections.length !== inspectionIds.size) throw new Error("inspection_sync_header_missing");
          for (const inspection of inspections) {
            throwIfRemoteSyncAborted(options.signal);
            const inspectionItems = state.inspectionItems.filter((row) => String(row.inspectionId) === String(inspection.id));
            if (!inspectionItems.length) throw new Error("inspection_sync_items_missing");
            await invokeWorkerMutation("submitInspection", {
              inspection: inspectionConfig.toDb(inspection),
              items: inspectionItems.map(itemConfig.toDb),
            }, { mutationSession });
            throwIfRemoteSyncAborted(options.signal);
          }
          return;
        }
        throwIfRemoteSyncAborted(options.signal);
        await invokeWorkerMutation("submitRows", { key: config.key, rows: payload }, { mutationSession });
        throwIfRemoteSyncAborted(options.signal);
        return;
      }
      if (config.key === "issuePhotos") {
        return;
      }
      let { error } = await runPublicUpsert(payload, { onConflict: "id" });
      if (error && config.key === "categories" && /tool_ids/i.test(String(error.message || error.details || ""))) {
        const fallbackPayload = payload.map(({ tool_ids, ...row }) => row);
        const retry = await runPublicUpsert(fallbackPayload, { onConflict: "id" });
        error = retry.error;
      }
      if (error && config.key === "inspections" && /safety_pledge/i.test(String(error.message || error.details || ""))) {
        const fallbackPayload = payload.map(({ safety_pledge, ...row }) => row);
        const retry = await runPublicUpsert(fallbackPayload, { onConflict: "id" });
        error = retry.error;
      }
      if (error && shouldRetryRemoteWithoutOptionalColumns(config, error)) {
        const retry = await runPublicUpsert(remoteFallbackPayload(config, payload), { onConflict: "id" });
        error = retry.error;
      }
      if (error) throw error;
    }

    async function selectTable(client, config) {
      async function runSelect(fallback = false) {
        const source = config.readTable || config.table;
        let query = client.from(source).select(remoteSelectColumns(config, fallback));
        if (config.orderBy) query = query.order(config.orderBy, { ascending: config.ascending !== false });
        const limit = remoteListLimit(config.key);
        if (limit) query = query.limit(limit);
        const { data, error } = await query;
        if (error) throw error;
        const dbRows = data || [];
        dbRows.forEach((row) => updateRealtimeCursor(config, row));
        return {
          key: config.key,
          rows: dbRows.map(config.fromDb),
          cursor: state.remoteRealtimeCursors?.[config.key] || "",
        };
      }
      try {
        return await runSelect(false);
      } catch (error) {
        if (!shouldRetryRemoteWithoutOptionalColumns(config, error)) throw error;
        return runSelect(true);
      }
    }

    async function selectDetailRows(client, config, buildQuery) {
      const source = config.readTable || config.table;
      const runSelect = async (fallback = false) => {
        const query = buildQuery(client.from(source).select(remoteSelectColumns(config, fallback)));
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      };
      try {
        return await runSelect(false);
      } catch (error) {
        if (!shouldRetryRemoteWithoutOptionalColumns(config, error)) throw error;
        return runSelect(true);
      }
    }

    async function loadInspectionItemsForDetail(inspectionId) {
      const id = String(inspectionId || "").trim();
      if (!id || state.remoteLoadedInspectionItemIds.includes(id)) return;
      const client = supabaseClient();
      const config = remoteConfigByKey("inspectionItems");
      if (!client || !config) return;
      const data = await selectDetailRows(client, config, (query) => query.eq("inspection_id", id));
      applyRemoteTableRows(config.key, (data || []).map(config.fromDb));
      state.remoteLoadedInspectionItemIds = [...new Set([...state.remoteLoadedInspectionItemIds, id])];
      persist();
    }

    async function loadIssuePhotosForDetail(targetId) {
      const id = String(targetId || "").trim();
      if (!id) return;
      const currentPhotos = state.issuePhotos.filter((photo) => photo.targetType === "unsafe_issue" && photo.targetId === id);
      const signedUrlsFresh = currentPhotos.length
        && currentPhotos.every((photo) => photo.signedUrl && (!photo.signedUrlExpiresAt
          || Date.parse(photo.signedUrlExpiresAt) > Date.now() + 30000));
      if (state.remoteLoadedIssuePhotoTargetIds.includes(id) && signedUrlsFresh) return;
      const config = remoteConfigByKey("issuePhotos");
      if (!config || !(await ensureWorkerMutationSession())) return;
      const data = await invokeWorkerMutation("listIssuePhotos", { targetId: id });
      const photos = (Array.isArray(data.photos) ? data.photos : []).map(config.fromDb);
      state.issuePhotos = state.issuePhotos.filter((photo) => !(photo.targetType === "unsafe_issue" && photo.targetId === id));
      applyRemoteTableRows(config.key, photos);
      state.remoteLoadedIssuePhotoTargetIds = [...new Set([...state.remoteLoadedIssuePhotoTargetIds, id])];
      persist();
    }

    const INSPECTION_RANGE_RETRY_MS = 60 * 1000;

    // 월간 작업자 통계/서약 지난 날짜 조회용 기간 점검 이력 로더.
    // 최근 N건 윈도(state.inspections)와 별개인 읽기 전용 캐시(state.archivedInspections)에 병합하므로
    // 이후 pullRemote가 본 목록을 갱신해도 통계/서약 화면 데이터가 사라지지 않는다.
    // 같은 기간(키)은 세션당 1회만 조회하고, 실패 시 잠시 후에만 재시도해 무한 재조회를 막는다.
    async function ensureInspectionRangeLoaded(startDate, endDate, force = false) {
      const todayValue = today();
      const start = dateOnly(startDate);
      let end = dateOnly(endDate);
      if (end && end > todayValue) end = todayValue;
      if (!start || !end || start > end) return;
      const key = `${start}~${end}`;
      if (!state.remoteLoadedInspectionRanges || typeof state.remoteLoadedInspectionRanges !== "object") {
        state.remoteLoadedInspectionRanges = {};
      }
      const ranges = state.remoteLoadedInspectionRanges;
      const entry = ranges[key];
      if (!force && entry && ((entry.status === "loaded" && Date.now() - Number(entry.at || 0) < INSPECTION_RANGE_CACHE_TTL_MS) || entry.status === "loading"
        || (entry.status === "error" && Date.now() - Number(entry.at || 0) < INSPECTION_RANGE_RETRY_MS))) return;
      const client = supabaseClient();
      const config = remoteConfigByKey("inspections");
      if (!client || !config) {
        ranges[key] = { status: "error", at: Date.now() };
        return;
      }
      ranges[key] = { status: "loading", at: Date.now() };
      try {
        const data = await selectDetailRows(client, config, (query) => query
          .gte("date", start)
          .lte("date", end)
          .order("created_at", { ascending: false }));
        const rows = (data || []).map(config.fromDb);
        const outsideRange = (Array.isArray(state.archivedInspections) ? state.archivedInspections : [])
          .filter((row) => !row?.date || row.date < start || row.date > end);
        const pendingRange = pendingSyncRowsForKey("inspections")
          .filter((row) => row?.date && row.date >= start && row.date <= end);
        state.archivedInspections = mergeRecordArrays(outsideRange, rows, pendingRange);
        ranges[key] = { status: "loaded", at: Date.now() };
        renderPreservingScroll();
      } catch (error) {
        console.warn("점검 이력 기간 로드 실패:", error);
        ranges[key] = { status: "error", at: Date.now() };
        renderPreservingScroll();
      }
    }

    boot();
