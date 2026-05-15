const STORAGE_PREFIX = "shipyardSafetyV1.";
    const ADMIN_PASSWORD = "gs2026";
    const SUPABASE_URL = "https://psatbyktzladtymdygwh.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYXRieWt0emxhZHR5bWR5Z3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODM1NjEsImV4cCI6MjA5NDA1OTU2MX0.tGbJ0Eg8lprH2UaCwlfHYfnrfaDDKvv3fjo4NhvgclQ";
    const SERVER_CLOCK_REFRESH_MS = 5 * 60 * 1000;
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
      { id: "check", label: "점검", icon: "noteCheck" },
      { id: "ships", label: "호선", icon: "ship" },
      { id: "history", label: "기록", icon: "book" },
      { id: "items", label: "더보기", icon: "menu" },
    ];
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
    const PICTOGRAM_ASSETS = Object.fromEntries([
      ["blockAssembly", "block-assembly.png"],
      ["weldingWork", "welding-work.png"],
      ["hullPainting", "hull-painting.png"],
      ["qualityInspection", "quality-inspection.png"],
      ["materialStorage", "material-storage.png"],
      ["shipDesign", "ship-design.png"],
      ["ncCutting", "nc-cutting.png"],
      ["curvedBlockProcessing", "curved-block-processing.png"],
      ["steelPlateCutting", "steel-plate-cutting.png"],
      ["scaffolding", "scaffolding.png"],
      ["engineInstallation", "engine-installation.png"],
      ["craneOperation", "crane-operation.png"],
      ["cabinAssembly", "cabin-assembly.png"],
      ["propellerInstallation", "propeller-installation.png"],
      ["electricalWork", "electrical-work.png"],
      ["upperModuleInstallation", "upper-module-installation.png"],
      ["materialTransport", "material-transport.png"],
      ["boardingWork", "boarding-work.png"],
      ["cutInspection", "cut-inspection.png"],
      ["curvedBlockInspection", "curved-block-inspection.png"],
      ["yardTransfer", "yard-transfer.png"],
      ["namingCeremony", "naming-ceremony.png"],
      ["gasCutting", "gas-cutting.png"],
      ["anchorInstallation", "anchor-installation.png"],
      ["hullGrinding", "hull-grinding.png"],
      ["insulationWork", "insulation-work.png"],
      ["wasteDisposal", "waste-disposal.png"],
      ["safetyTraining", "safety-training.png"],
      ["remoteInspection", "remote-inspection.png"],
      ["ecoPainting", "eco-painting.png"],
      ["launchPrep", "launch-prep.png"],
      ["launchInspection", "launch-inspection.png"],
      ["seaTrial", "sea-trial.png"],
      ["controlRoom", "control-room.png"],
      ["sonarInstallation", "sonar-installation.png"],
      ["blockTransport", "block-transport.png"],
      ["weldingRobot", "welding-robot.png"],
      ["smartLogistics", "smart-logistics.png"],
      ["environmentalProtection", "environmental-protection.png"],
      ["safetyGear", "safety-gear.png"],
      ["pressureTest", "pressure-test.png"],
      ["dpInstallation", "dp-installation.png"],
      ["dpInspection", "dp-inspection.png"],
      ["classSurvey", "class-survey.png"],
      ["demoCheck", "demo-check.png"],
      ["lcWork", "lc-work.png"],
      ["stInspection", "st-inspection.png"],
      ["dlWork", "dl-work.png"],
    ].map(([key, file]) => [key, `assets/icons/shipyard-illustrated/${file}`]));
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
    const SHIP_SORT_OPTIONS = [
      ["stage", "공정 상태순"],
      ["number", "호선 번호순"],
      ["lcDate", "L/C일 빠른순"],
      ["dlDate", "D/L일 빠른순"],
      ["recent", "최근 추가순"],
      ["saved", "저장된 순서"],
    ];
    const STAGE_META = {
      mounting: { stage: "mounting", label: "탑재", percent: 20, color: "#c2410c", bg: "#fff7ed" },
      lc: { stage: "lc", label: "L/C", percent: 45, color: "#1d4ed8", bg: "#eff6ff" },
      st: { stage: "st", label: "S/T", percent: 70, color: "#0f766e", bg: "#f0fdfa" },
      cl: { stage: "cl", label: "C/L", percent: 92, color: "#15803d", bg: "#f0fdf4" },
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
          sort_order: row.order || 0,
        }),
        fromDb: (row) => ({
          id: row.id,
          label: row.label,
          icon: row.icon,
          color: row.color,
          requireToolCheck: row.require_tool_check !== false,
          toolNature: normalizeToolNature(row.tool_nature || defaultToolNatureForCategory(row)),
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
    const firstSpaceBreakHtml = (value = "") => {
      const text = String(value);
      const index = text.indexOf(" ");
      if (index < 0) return esc(text);
      return `${esc(text.slice(0, index))}<br>${esc(text.slice(index + 1))}`;
    };
    const today = () => localDate(serverNow());
    const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;
    const pad2 = (value) => String(value).padStart(2, "0");
    const localDate = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
    const localTime = (date) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    const recordTime = (date) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
    const normalizeShipNo = (value) => {
      const raw = value.trim().toUpperCase().replace(/\s+/g, "");
      if (!raw) return "";
      return raw.startsWith("H") ? raw : `H${raw}`;
    };
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
    const saveJson = (key, value) => localStorage.setItem(storeKey(key), JSON.stringify(value));
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
        checks: {},
        selectedToolIds: [],
        toolPrepComplete: false,
        ...overrides,
      };
    }

    function createUnsafeDraft(overrides = {}) {
      return {
        shipNo: "",
        content: "",
        workerId: "",
        photos: [],
        ...overrides,
      };
    }

    function createMaterialDraft(overrides = {}) {
      return {
        shipNo: "",
        materialName: "",
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
      return [...NAV, { id: "unsafe" }, { id: "materials" }, { id: "manage" }];
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
      selectedCategoryId: null,
      manageCategoryId: null,
      editCategoryId: null,
      editSectionId: null,
      editItemId: null,
      editToolId: null,
      toolAddOpen: false,
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
      screenMode: localStorage.getItem(storeKey("screenMode")) || "desktop",
      shipSortMode: normalizeShipSortMode(loadJson("shipSortMode", "stage")),
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
    };
    let cachedSupabaseClient = null;

    function initialView() {
      const view = document.body?.dataset?.initialView || "dashboard";
      return routeViews().some((nav) => nav.id === view) ? view : "dashboard";
    }

    function pageForView(view) {
      return {
        dashboard: "index.html",
        check: "check.html",
        ships: "ships.html",
        history: "history.html",
        items: "items.html",
        unsafe: "unsafe.html",
        materials: "materials.html",
        manage: "manage.html",
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
    async function boot() {
      migrateIfNeeded();
      cleanupDeliveredShips(false);
      applyScreenMode();
      updateHeaderClock();
      render();
      replaceRouteState();
      setupScrollNav();
      setInterval(updateHeaderClock, 1000);
      setInterval(syncServerClock, SERVER_CLOCK_REFRESH_MS);
      window.addEventListener("resize", applyScreenMode);
      window.addEventListener("popstate", restoreRouteState);
      setSyncStatus(isSyncConfigured() ? "동기화 대기" : "로컬 저장", isSyncConfigured() ? "pending" : "offline");
      if (isSyncConfigured()) {
        syncServerClock();
        pullRemote();
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
      state.unsafeIssues = Array.isArray(state.unsafeIssues) ? state.unsafeIssues : [];
      state.missingMaterials = Array.isArray(state.missingMaterials) ? state.missingMaterials : [];
      state.issuePhotos = Array.isArray(state.issuePhotos) ? state.issuePhotos : [];
      state.unsafeDraft = createUnsafeDraft(state.unsafeDraft);
      state.materialDraft = createMaterialDraft(state.materialDraft);
      state.unsafeFilters = { shipNo: "", status: "", workerId: "", sort: "status", ...state.unsafeFilters };
      state.materialFilters = { shipNo: "", status: "", workerId: "", materialName: "", sort: "status", ...state.materialFilters };
      if (!["workers", "unsafe", "materials"].includes(state.manageTab)) state.manageTab = "workers";
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
      saveJson("unsafeDraft", state.unsafeDraft);
      saveJson("materialDraft", state.materialDraft);
      saveJson("unsafeFilters", state.unsafeFilters);
      saveJson("materialFilters", state.materialFilters);
      saveJson("manageTab", state.manageTab);
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
        render();
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
      render();
    }

    function changeView(view, options = {}) {
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

    function setSyncStatus(text, mode) {
      state.syncText = text;
      state.syncMode = mode;
      [["syncBadge", "syncText"], ["mobileSyncBadge", "mobileSyncText"]].forEach(([badgeId, textId]) => {
        const badge = $(badgeId);
        const label = $(textId);
        if (badge) badge.className = `${badgeId === "mobileSyncBadge" ? "sync-chip" : "sync-badge"} ${mode}`;
        if (label) label.textContent = text;
      });
    }

    function applyScreenMode() {
      const isNarrow = window.matchMedia && window.matchMedia("(max-width: 920px)").matches;
      if (isNarrow) {
        document.body.classList.remove("preview-mobile");
      } else {
        document.body.classList.toggle("preview-mobile", state.screenMode === "mobile");
      }
      updateScreenToggle();
    }

    function updateScreenToggle() {
      const isNarrow = window.matchMedia && window.matchMedia("(max-width: 920px)").matches;
      const effectiveMode = isNarrow ? "mobile" : state.screenMode;
      document.querySelectorAll("[data-screen-mode]").forEach((button) => {
        button.classList.toggle("active", button.dataset.screenMode === effectiveMode);
      });
    }

    function setScreenMode(mode) {
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
      }[state.view]();
      setSyncStatus(state.syncText, state.syncMode);
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
      };
      const title = $("appbarTitle");
      const headline = $("homeHeadline");
      const date = $("homeDateLabel");
      if (title) title.textContent = titles[state.view] || "홈";
      if (headline) headline.style.display = "flex";
      if (date) date.textContent = formatKoreanDate(serverNow());
      updateHeaderClock();
    }

    function updateHeaderClock() {
      const time = $("phoneTime");
      const date = $("homeDateLabel");
      if (time) time.textContent = localTime(serverNow());
      if (date) date.textContent = formatKoreanDate(serverNow());
    }

    function formatKoreanDate(date) {
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      return `${date.getFullYear()}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())} (${days[date.getDay()]})`;
    }

    function serverNow() {
      return new Date(Date.now() + Number(state.serverTimeOffsetMs || 0));
    }

    async function syncServerClock() {
      if (!isSyncConfigured()) return;
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: "HEAD",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          cache: "no-store",
        });
        const serverDate = response.headers.get("date");
        if (!serverDate) return;
        const serverMs = new Date(serverDate).getTime();
        if (!Number.isFinite(serverMs)) return;
        state.serverTimeOffsetMs = serverMs - Date.now();
        state.serverClockSyncedAt = new Date().toISOString();
        updateHeaderClock();
      } catch (error) {
        console.warn("Server clock sync failed", error);
      }
    }

    function visibleNavItems() {
      return state.adminMode ? [...NAV, { id: "manage", label: "관리", icon: "settings" }] : NAV;
    }

    function renderNav() {
      const html = visibleNavItems().map((nav) => `
        <button class="nav-btn ${state.view === nav.id ? "active" : ""}" data-view="${nav.id}" type="button">
          <span class="nav-icon">${navIcon(nav.icon)}</span><span>${esc(nav.label)}</span>
        </button>`).join("");
      $("desktopNav").innerHTML = html;
      $("mobileNav").innerHTML = html;
    }

    function navIcon(name) {
      const icons = {
        home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 4l8 7.5"></path><path d="M6.5 10.5V20h11v-9.5"></path><path d="M10 20v-6h4v6"></path></svg>`,
        board: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path><path d="M7 8h10"></path><path d="M7 12h6"></path></svg>`,
        note: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7z"></path><path d="M15 3v5h5"></path><path d="M9 12h6"></path><path d="M9 16h5"></path></svg>`,
        book: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"></path><path d="M4 5.5v16"></path><path d="M8 7h8"></path><path d="M8 11h7"></path></svg>`,
        ship: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17h16l-2 3H6z"></path><path d="M6 17l1-7h10l1 7"></path><path d="M9 10V6h6v4"></path><path d="M3 21c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1"></path></svg>`,
        noteCheck: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7z"></path><path d="M15 3v5h5"></path><path d="M8.5 14l2.5 2.5 4.5-5"></path></svg>`,
        menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>`,
        settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.1 2.1-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.7V21h-3v-.6a1.8 1.8 0 0 0-1.1-1.7 1.8 1.8 0 0 0-2 .4l-.1.1-2.1-2.1.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.7-1.1H4v-3h.6a1.8 1.8 0 0 0 1.7-1.1 1.8 1.8 0 0 0-.4-2l-.1-.1 2.1-2.1.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1.1-1.7V3h3v.6a1.8 1.8 0 0 0 1.1 1.7 1.8 1.8 0 0 0 2-.4l.1-.1 2.1 2.1-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.7 1.1h.6v3h-.6a1.8 1.8 0 0 0-1.7 1.1z"></path></svg>`,
      };
      return icons[name] || icons.note;
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

    function renderDashboard() {
      const todayRows = state.inspections.filter((row) => row.date === today());
      const todayCount = todayRows.length;
      const todayDone = todayRows.filter((row) => row.status === "완료").length;
      const doneCount = state.inspections.filter((row) => row.status === "완료").length;
      const unsafeCount = unsafeReceivedCount();
      const completion = state.inspections.length ? Math.round(doneCount / state.inspections.length * 100) : 0;
      const latest = state.inspections.slice(0, 4);
      const deliverySoon = upcomingDeliveryShips().length;
      const processStages = SHIP_WORKFLOW_STAGES.map((stage) => ({
        stage,
        info: shipStageInfo(stage),
        count: state.ships.filter((ship) => effectiveShipStage(ship).stage === stage).length,
      }));

      return `<div class="app-card-shell">
        <div class="home-focus-title">
          <strong>핵심 메뉴</strong>
        </div>
        <div class="quick-actions">
          <button class="quick-card primary" data-view="check" type="button">
            <span class="quick-icon">${navIcon("noteCheck")}</span>
            <div class="quick-title">점검 작성</div>
            <div class="small">새 점검을 시작합니다</div>
            <span class="quick-arrow">›</span>
          </button>
          <button class="quick-card secondary" data-view="ships" type="button">
            <span class="quick-icon">${navIcon("ship")}</span>
            <div class="quick-title">호선 관리</div>
            <div class="small">호선 및 공정 관리</div>
            <span class="quick-arrow" style="color:#07906f">›</span>
          </button>
          <button class="quick-card primary" data-view="unsafe" type="button">
            <span class="quick-icon">${navIcon("note")}</span>
            <div class="quick-title">불안전요소 등록</div>
            <div class="small">위험 요소를 기록합니다</div>
            <span class="quick-arrow">›</span>
          </button>
          <button class="quick-card secondary" data-view="materials" type="button">
            <span class="quick-icon">${navIcon("board")}</span>
            <div class="quick-title">호선자재 누락</div>
            <div class="small">누락 자재를 확인합니다</div>
            <span class="quick-arrow" style="color:#07906f">›</span>
          </button>
        </div>
      </div>
      <div class="stat-strip">
        ${statPill("오늘 점검", todayCount, "건", "#07966f", "shield", "", "today")}
        ${statPill("불안전 요소", unsafeCount, "건", "#dc2626", "warning", unsafeCount ? "즉시 확인 필요" : "", "unsafe")}
        ${statPill("인도 예정", deliverySoon, "척", "#f97316", "clock", "7일 이내", "delivery")}
      </div>
      <section class="panel panel-pad home-section">
        <div class="section-title">호선 공정 요약 <button class="btn-light" data-view="ships" type="button">보기</button></div>
        <div class="mini-process">
          ${processStages.map(({ info, count }) => `<div class="mini-stage">
            <span class="mini-stage-dot" style="--dot:${esc(info.color)}"></span>
            <div style="font-weight:800">${count}</div>
            <div class="small muted">${esc(info.label)}</div>
          </div>`).join("")}
        </div>
      </section>
      <div class="panel panel-pad">
        <div class="section-title">최근 점검 이력 <button class="btn-light" data-history-scope="all" type="button">전체 보기</button></div>
        ${latest.length ? renderHistoryTable(latest) : `<div class="empty">아직 점검 이력이 없습니다.</div>`}
      </div>`;
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

    function unsafeReceivedCount() {
      const received = unsafeReceivedStatus();
      return state.unsafeIssues.filter((row) => row.status === received).length;
    }

    function statPill(label, value, unit, color, icon = "board", foot = "", scope = "all") {
      const attrs = scope === "unsafe"
        ? `data-stat-scope="unsafe" data-action="view-unsafe-received"`
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

    function progress(pct, color) {
      return `<div class="progress" aria-label="${pct}%"><span style="--pct:${pct}%;--bar:${esc(color)}"></span></div>`;
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

    function workVisual(id, fallbackIcon) {
      const key = normalizeIconKey(id);
      const customPictogram = pictogramLibrary().find((row) => row.id === key && row.source === "custom");
      if (customPictogram?.src) {
        return `<img class="pictogram-art" src="${esc(customPictogram.src)}" alt="${esc(customPictogram.label || fallbackIcon || key)}" loading="lazy" />`;
      }
      const asset = PICTOGRAM_ASSETS[key];
      if (asset) {
        return `<img class="pictogram-art" src="${esc(asset)}" alt="${esc(fallbackIcon || key)}" loading="lazy" />`;
      }
      const visuals = {
        blockAssembly: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="18" width="16" height="16" rx="2"></rect><rect x="30" y="18" width="16" height="16" rx="2"></rect><rect x="21" y="36" width="16" height="16" rx="2"></rect><path d="M28 26h2"></path><path d="M29 34v2"></path></svg>`,
        erection: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 52h40"></path><path d="M20 52V32h24v20"></path><path d="M14 32h36"></path><path d="M32 11v21"></path><path d="M23 20h18"></path><path d="M32 11l9 9"></path><path d="M32 11l-9 9"></path><rect x="26" y="40" width="12" height="12" rx="1"></rect></svg>`,
        painting: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M15 23h19v12H15z"></path><path d="M34 26h8l6 6"></path><path d="M22 35v10"></path><path d="M18 48h8"></path><path d="M49 34c4 3 4 7 0 10"></path><path d="M54 30c6 6 6 14 0 20"></path></svg>`,
        launching: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 40h40l-6 10H19z"></path><path d="M21 40l4-14h18l4 14"></path><path d="M18 53c4 3 8 3 12 0 4 3 8 3 12 0 4 3 8 3 12 0"></path><path d="M24 31h18"></path></svg>`,
        outfitting: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 43h20"></path><path d="M16 33h28"></path><path d="M16 23h18"></path><circle cx="44" cy="43" r="7"></circle><path d="M44 36v14"></path><path d="M37 43h14"></path></svg>`,
        cutting: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 48l22-22"></path><path d="M34 22l8-8 8 8-8 8z"></path><path d="M18 18h18"></path><path d="M18 26h12"></path><path d="M46 34c2 4 2 8-1 12"></path><path d="M51 31c5 7 5 14 0 21"></path></svg>`,
        welding: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 42h25l-4 12H18z"></path><path d="M18 42l4-12h13l4 12"></path><path d="M42 41h10"></path><path d="M52 34v16"></path><path d="M47 36l10 12"></path><path d="M57 36L47 48"></path><path d="M16 18h16l8 8v8"></path></svg>`,
        goliathCrane: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M11 16h42"></path><path d="M18 16v36"></path><path d="M46 16v36"></path><path d="M14 52h10"></path><path d="M40 52h10"></path><path d="M32 16v15"></path><path d="M27 31h10"></path><path d="M32 31v8"></path></svg>`,
        weldingMachine: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="15" y="20" width="28" height="25" rx="3"></rect><path d="M21 27h16"></path><circle cx="24" cy="51" r="3"></circle><circle cx="39" cy="51" r="3"></circle><path d="M43 32c8 2 9 8 4 14"></path><path d="M50 45l6 6"></path></svg>`,
        grinder: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="24" cy="40" r="11"></circle><path d="M32 32l15-15 6 6-15 15"></path><path d="M16 48l-5 5"></path><path d="M20 40h8"></path></svg>`,
        airHose: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 43c7-12 18 12 26 0 6-10-11-13-8-22 2-6 11-6 18-1"></path><path d="M45 16l7 7"></path><path d="M50 14l5 5"></path></svg>`,
        liftingJack: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M17 49h30"></path><path d="M23 49l8-24h10l-8 24"></path><path d="M27 25h22"></path><path d="M45 25l6-8"></path><path d="M22 39h18"></path></svg>`,
        spanner: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M45 13a12 12 0 0 0-13 16L14 47l7 7 18-18a12 12 0 0 0 16-13l-8 8-10-10z"></path></svg>`,
        hammer: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M25 15h18l8 8-7 7-8-8H25z"></path><path d="M31 25L14 48l6 6 23-17"></path></svg>`,
        measuringTool: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="13" y="35" width="38" height="14" rx="2"></rect><path d="M18 35v7"></path><path d="M25 35v5"></path><path d="M32 35v7"></path><path d="M39 35v5"></path><path d="M46 35v7"></path><path d="M20 25h24"></path><path d="M39 20l5 5-5 5"></path></svg>`,
        drill: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 23h28v14H14z"></path><path d="M42 27h10l4 3-4 3H42"></path><path d="M23 37v14h10V37"></path><path d="M19 51h18"></path><circle cx="22" cy="30" r="3"></circle></svg>`,
        paintGun: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 24h26v11H14z"></path><path d="M40 27h8l5 5"></path><path d="M23 35l-5 15h10l5-15"></path><path d="M53 28c4 2 4 6 0 8"></path></svg>`,
        pressureWasher: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="14" y="32" width="24" height="16" rx="3"></rect><circle cx="20" cy="52" r="3"></circle><circle cx="35" cy="52" r="3"></circle><path d="M38 36l15-15"></path><path d="M50 18l5 5"></path><path d="M49 30c5 3 5 8 0 11"></path></svg>`,
        workAtHeights: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="22" cy="14" r="5"></circle><path d="M22 21l-8 13v18"></path><path d="M25 24l10 8"></path><path d="M40 12v42"></path><path d="M51 12v42"></path><path d="M40 23h11"></path><path d="M40 34h11"></path><path d="M40 45h11"></path></svg>`,
        confinedSpace: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="13" y="13" width="38" height="38" rx="3"></rect><path d="M23 51V39c0-6 4-10 9-10s9 4 9 10v12"></path><circle cx="32" cy="23" r="6"></circle><path d="M20 56h24"></path></svg>`,
        crushingHazard: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 20h16v24H13z"></path><path d="M35 20h16v24H35z"></path><path d="M29 32h6"></path><path d="M23 50l9-12 9 12"></path><path d="M32 38v16"></path></svg>`,
        fallingObjects: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 12l9 9-9 9-9-9z"></path><path d="M32 31v13"></path><path d="M19 50h26"></path><path d="M23 50c2-7 16-7 18 0"></path><path d="M28 44h8"></path></svg>`,
        firePrevention: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22"></circle><path d="M17 47l30-30"></path><path d="M32 48c-7 0-12-5-12-12 0-7 5-11 9-17 4 5 4 9 3 12 3-2 5-5 6-10 5 6 8 10 8 16 0 6-6 11-14 11z"></path></svg>`,
        chemicalHandling: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M25 12h14"></path><path d="M29 12v12L17 48c-2 4 1 8 5 8h20c4 0 7-4 5-8L35 24V12"></path><path d="M24 41h16"></path><path d="M21 48h22"></path></svg>`,
        heavyLifting: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="24" cy="14" r="5"></circle><path d="M24 21l-8 12 10 7"></path><path d="M26 40l-3 13"></path><path d="M31 30l10 6"></path><rect x="40" y="36" width="12" height="12" rx="2"></rect></svg>`,
        hardHat: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 39c0-11 7-20 16-20s16 9 16 20"></path><path d="M12 39h40"></path><path d="M22 39v-9"></path><path d="M42 39v-9"></path><path d="M20 45h24"></path></svg>`,
        safetyGlasses: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 30h16l4 10 4-10h16"></path><path d="M12 30l4 14h12l4-14"></path><path d="M52 30l-4 14H36l-4-14"></path><path d="M28 34h8"></path></svg>`,
        safetyGloves: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 33V17a4 4 0 0 1 8 0v13"></path><path d="M28 31V14a4 4 0 0 1 8 0v17"></path><path d="M36 32V18a4 4 0 0 1 8 0v22c0 9-6 15-14 15s-14-6-14-15v-7c0-4 4-6 7-4"></path></svg>`,
        hearingProtection: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 36v-8c0-9 6-16 14-16s14 7 14 16v8"></path><rect x="12" y="34" width="10" height="16" rx="4"></rect><rect x="42" y="34" width="10" height="16" rx="4"></rect></svg>`,
        fallArrest: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 14h36"></path><path d="M32 14v15"></path><circle cx="32" cy="35" r="6"></circle><path d="M24 53l8-12 8 12"></path><path d="M20 30l12 11 12-11"></path></svg>`,
        fireAlarm: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="22" y="18" width="20" height="28" rx="4"></rect><circle cx="32" cy="32" r="6"></circle><path d="M18 14l-6-6"></path><path d="M46 14l6-6"></path><path d="M16 32H8"></path><path d="M56 32h-8"></path><path d="M25 52h14"></path></svg>`,
      };
      return visuals[key] || `<span>${esc(fallbackIcon || "?")}</span>`;
    }

    function categoryVisual(cat) {
      return workVisual(cat.icon, cat.icon || cat.id || "?");
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

    function renderCheck() {
      if (!state.selectedCategoryId) {
        return `<section class="write-intro">
          <h1>어떤 작업을 점검할까요?</h1>
          <p>작업 유형을 선택하면 점검을 시작합니다.</p>
        </section>
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
      const canSubmit = state.draft.worker.trim() && state.draft.shipNo && items.length && highMissing.length === 0;

      return `${pageHead(cat.label, "섹션별로 점검하고, 고위험 항목은 모두 확인해야 제출됩니다.", `<button class="btn-light" data-action="back-check-types" type="button">뒤로</button>`)}
      <div class="split">
        <div>
          <div class="panel panel-pad" style="margin-bottom:12px">
            <div class="form-row">
              <div class="field">
                <label for="worker">담당자명</label>
                <input class="input" id="worker" value="${esc(state.draft.worker)}" placeholder="이름 입력" />
              </div>
              <div class="field">
                <label for="shipNo">호선 번호</label>
                <select class="select" id="shipNo">
                  <option value="">호선 선택</option>
                  ${selectableShips.map((ship) => `<option value="${esc(ship.no)}" ${state.draft.shipNo === ship.no ? "selected" : ""}>${esc(ship.no)} · ${esc(ship.type || "선종 미지정")}</option>`).join("")}
                </select>
              </div>
              <div class="field safety-pledge-field">
                <label for="safetyPledge">안전다짐</label>
                <textarea class="textarea" id="safetyPledge" placeholder="오늘 하루의 안전다짐 작성을 해주세요">${esc(state.draft.safetyPledge)}</textarea>
              </div>
            </div>
          </div>
          ${selectableShips.length ? "" : `<div class="notice danger" style="margin-bottom:12px">작업자에게 공개된 호선이 없습니다. 호선 관리에서 L/C일을 입력한 호선만 점검 목록에 표시됩니다.</div>`}
          ${highMissing.length ? `<div class="notice danger" style="margin-bottom:12px">미확인 위험 항목 ${highMissing.length}건이 있습니다. 위험 항목은 모두 확인해야 제출할 수 있습니다.</div>` : `<div class="notice good" style="margin-bottom:12px">고위험 항목이 모두 확인되었습니다.</div>`}
          ${renderChecklistSections(cat.id)}
          <div class="check-submit-bar">
            <button class="btn check-submit-btn" data-action="submit-inspection" ${canSubmit ? "" : "disabled"} type="button">제출하기</button>
          </div>
        </div>
        <aside class="panel panel-pad">
          <div class="section-title">작성 상태</div>
          ${progress(pct, categoryAccent(cat))}
          <div class="small muted" style="margin-top:8px">${checked}/${items.length} 항목 확인됨</div>
          <div class="list" style="margin-top:16px">
            ${badge(highMissing.length ? "high" : "low", highMissing.length ? `위험 ${highMissing.length}건 남음` : "위험 확인 완료")}
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
      return `${pageHead("사용 공기구와 준비물", "사용할 공기구와 준비물을 체크한 뒤 다음 점검표로 이동하세요.", `<button class="btn-light" data-action="back-check-types" type="button">뒤로</button>`)}
      <div class="panel panel-pad">
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
          <button class="btn" data-action="continue-tool-prep" ${(requireSelection && !selectedCount) ? "disabled" : ""} type="button">다음 점검표로</button>
        </div>
      </div>`;
    }

    function renderChecklistSections(categoryId) {
      const sections = sectionsFor(categoryId);
      const visibleItems = filteredChecklistItems(categoryId);
      if (!sections.length) return `<div class="empty">등록된 섹션이 없습니다.</div>`;
      return sections.map((section) => {
        const items = visibleItems.filter((row) => row.sectionId === section.id);
        return `<section class="check-section">
          <div class="check-section-head">
            <span>${esc(section.title)}</span>
            <span class="small muted">${items.filter((row) => state.draft.checks[row.id]).length}/${items.length}</span>
          </div>
          ${items.length ? items.map((row) => `
            <label class="check-item ${state.draft.checks[row.id] ? "checked" : ""}">
              <input type="checkbox" data-check-item="${row.id}" ${state.draft.checks[row.id] ? "checked" : ""} />
              <span class="check-text">${esc(row.text)}${renderItemToolChips(row)}</span>
              ${badge(row.risk)}
            </label>`).join("") : `<div class="notice">이 섹션에는 항목이 없습니다.</div>`}
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
      <div class="panel panel-pad">
        ${isDeliveryScope
          ? (deliveryRows.length ? renderDeliveryCards(deliveryRows) : `<div class="empty">7일 이내 인도 예정 호선이 없습니다.</div>`)
          : (rows.length ? renderHistoryTable(rows) : `<div class="empty">조건에 맞는 점검 이력이 없습니다.</div>`)}
      </div>`;
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
          const cat = categoryById(row.categoryId) || { label: "(삭제된 유형)", icon: "?" };
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
              <div class="history-card-summary">${esc(row.worker || "-")} · ${esc(row.shipNo || "-")} · ${esc(shortHistoryDate(row))}</div>
              <div class="history-card-progress">완료율 ${esc(row.completion)}%</div>
            </div>
          </article>`;
        }).join("")}
      </div>`;
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
      const cat = categoryById(row.categoryId) || { id: row.categoryId || "deleted", label: "(삭제된 유형)", icon: "?", color: "#607084" };
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
          <div class="field ship-sort-field">
            <label for="shipSortMode">정렬</label>
            <select class="select" id="shipSortMode" data-ship-sort-mode>
              ${shipSortOptions()}
            </select>
          </div>
          <button class="btn-light" data-action="save-ship-order" ${state.adminMode && state.ships.length ? "" : "disabled"} type="button">현재 순서 저장</button>
        </div>
        ${state.ships.length ? `<div class="list">${ships.map(renderShipRow).join("")}</div>` : `<div class="empty">등록된 호선이 없습니다.</div>`}
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
      return `<div class="item-row ship-card" style="--stage:${esc(info.color)}">
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
        return `${pageHead("항목 관리", "작업 유형을 만들고, 유형 안에 섹션을 나눈 뒤 점검 항목을 추가합니다.", adminToggleButton())}
        <div class="panel panel-pad" style="margin-bottom:14px">
          <div class="section-title">공기구/준비물 관리</div>
          ${renderToolManager()}
        </div>
        <div class="panel panel-pad" style="margin-bottom:14px">
          <div class="section-title">작업 유형 추가</div>
          ${state.adminMode ? "" : `<div class="notice" style="margin-bottom:12px">항목 수정은 상단 수정 버튼으로 관리자 로그인 후 가능합니다.</div>`}
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
          </div>
          ${renderPictogramPicker("erection")}
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
      return `${pageHead("불안전요소 등록", "현장 위험 요소를 빠르게 등록합니다.")}
      <section class="panel panel-pad issue-form">
        ${selectableShips().length ? "" : `<div class="notice danger" style="margin-bottom:12px">작업자에게 공개된 호선이 없습니다.</div>`}
        ${state.workers.length ? "" : `<div class="notice" style="margin-bottom:12px">등록자 목록이 없습니다. 관리자 모드에서 작업자를 추가하세요.</div>`}
        <div class="form-row">
          <div class="field">
            <label for="unsafeShipNo">호선</label>
            <select class="select" id="unsafeShipNo">${visibleShipOptionsForIssues(state.unsafeDraft.shipNo)}</select>
          </div>
          <div class="field">
            <label for="unsafeWorkerId">등록자</label>
            <select class="select" id="unsafeWorkerId">${visibleWorkerOptions(state.unsafeDraft.workerId)}</select>
          </div>
        </div>
        <div class="field" style="margin-top:12px">
          <label for="unsafeContent">내용</label>
          <textarea class="textarea" id="unsafeContent" placeholder="불안전요소 내용을 입력하세요">${esc(state.unsafeDraft.content)}</textarea>
        </div>
        <div class="field" style="margin-top:12px">
          <label for="unsafePhotos">사진 권장, 최대 3개</label>
          <input class="input" id="unsafePhotos" type="file" accept="image/*" multiple />
          <div class="small muted">사진 없이도 확인 후 등록할 수 있습니다.</div>
        </div>
        <div class="form-actions">
          <button class="btn" data-action="submit-unsafe" type="button">등록</button>
        </div>
      </section>`;
    }

    function renderMaterials() {
      const detail = state.lastMaterialId ? state.missingMaterials.find((row) => row.id === state.lastMaterialId) : null;
      if (detail) return renderMaterialComplete(detail);
      return `${pageHead("호선자재 누락", "호선별 누락 자재를 등록합니다.")}
      <section class="panel panel-pad issue-form">
        ${selectableShips().length ? "" : `<div class="notice danger" style="margin-bottom:12px">작업자에게 공개된 호선이 없습니다.</div>`}
        ${state.workers.length ? "" : `<div class="notice" style="margin-bottom:12px">등록자 목록이 없습니다. 관리자 모드에서 작업자를 추가하세요.</div>`}
        <div class="form-row">
          <div class="field">
            <label for="materialShipNo">호선</label>
            <select class="select" id="materialShipNo">${visibleShipOptionsForIssues(state.materialDraft.shipNo)}</select>
          </div>
          <div class="field">
            <label for="materialWorkerId">등록자</label>
            <select class="select" id="materialWorkerId">${visibleWorkerOptions(state.materialDraft.workerId)}</select>
          </div>
        </div>
        <div class="field" style="margin-top:12px">
          <label for="materialName">자재명</label>
          <input class="input" id="materialName" value="${esc(state.materialDraft.materialName)}" placeholder="예) 배관 자재" />
        </div>
        <div class="field" style="margin-top:12px">
          <label for="materialContent">내용</label>
          <textarea class="textarea" id="materialContent" placeholder="누락 내용을 입력하세요">${esc(state.materialDraft.content)}</textarea>
        </div>
        <div class="form-actions">
          <button class="btn" data-action="submit-material" type="button">등록</button>
        </div>
      </section>`;
    }

    function renderManage() {
      const tabs = [
        ["workers", "작업자"],
        ["unsafe", "불안전요소"],
        ["materials", "자재누락"],
      ];
      const unsafeReadOnly = !state.adminMode && state.manageTab === "unsafe";
      if (!state.adminMode && !unsafeReadOnly) {
        return pageHead("관리", "관리자 모드에서 사용할 수 있습니다.", adminToggleButton())
          + `<div class="notice danger">관리자 모드가 필요합니다.</div>`;
      }
      const visibleTabs = state.adminMode ? tabs : [["unsafe", "불안전요소"]];
      const lead = state.adminMode ? "작업자와 접수 기록을 관리합니다." : "불안전요소 접수 현황을 확인합니다.";
      return `${pageHead("관리", lead, adminToggleButton())}
      ${state.adminMode ? "" : `<div class="notice" style="margin-bottom:12px">목록은 볼 수 있고, 상태 변경과 삭제는 관리자 모드에서 사용할 수 있습니다.</div>`}
      <div class="manage-tabs" role="tablist" aria-label="관리 탭">
        ${visibleTabs.map(([id, label]) => `<button class="seg-btn ${state.manageTab === id ? "active" : ""}" data-manage-tab="${id}" type="button">${esc(label)}</button>`).join("")}
      </div>
      ${state.manageTab === "workers" ? renderWorkerManager() : ""}
      ${state.manageTab === "unsafe" ? renderUnsafeManager() : ""}
      ${state.manageTab === "materials" ? renderMaterialManager() : ""}`;
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

    function renderUnsafeManager() {
      const detail = state.unsafeDetailId ? state.unsafeIssues.find((row) => row.id === state.unsafeDetailId) : null;
      if (detail) return renderUnsafeDetail(detail);
      if (state.unsafeDetailId) state.unsafeDetailId = "";
      const filtered = ISSUE_MATERIAL_RULES.filterRecords(state.unsafeIssues, state.unsafeFilters);
      const sorted = ISSUE_MATERIAL_RULES.sortRecords(filtered, state.unsafeFilters.sort, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES);
      const groups = ISSUE_MATERIAL_RULES.groupUnsafeByStatus(sorted);
      return `<section class="panel panel-pad">
        <div class="section-title">불안전요소 <span class="small muted">${filtered.length}건</span></div>
        ${renderRecordFilters("unsafe")}
        <div class="record-groups">
          ${groups.map((group) => renderUnsafeGroup(group)).join("")}
        </div>
      </section>`;
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
      return `<section class="panel panel-pad">
        <div class="section-title">호선자재 누락 <span class="small muted">${filtered.length}건</span></div>
        ${renderRecordFilters("materials")}
        <div class="record-groups">
          ${groups.map((group) => renderMaterialGroup(group)).join("")}
        </div>
      </section>`;
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
      const disabled = state.adminMode ? "" : "disabled";
      return `<div class="admin-record-controls">
        <select class="select" data-record-status="${kind}:${esc(row.id)}" ${disabled}>
          ${statuses.map((status) => `<option value="${esc(status)}" ${row.status === status ? "selected" : ""}>${esc(status)}</option>`).join("")}
        </select>
        <textarea class="textarea" data-record-memo="${kind}:${esc(row.id)}" placeholder="조치/메모" ${disabled}>${esc(row.adminMemo || "")}</textarea>
        <button class="btn-light" data-save-record="${kind}:${esc(row.id)}" ${disabled} type="button">저장</button>
        <button class="btn-danger" data-delete-record="${kind}:${esc(row.id)}" ${disabled} type="button">삭제</button>
      </div>`;
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
      return `<article class="record-card clickable-record" data-unsafe-record-detail="${esc(row.id)}" tabindex="0" role="button" aria-label="${esc(row.shipNo)} 불안전요소 상세 보기">
        <div class="record-card-main">
          <div class="record-card-headline">
            ${photoUrl ? `<img class="record-thumb" src="${esc(photoUrl)}" alt="불안전요소 사진" />` : ""}
            <div>
              <strong>${esc(row.shipNo)}</strong>
              <span class="small muted">${esc(row.workerNameSnapshot)} · ${esc(formatDateTime(row.createdAt))}</span>
              ${photoCount > 1 ? `<span class="small muted">사진 ${photoCount}장</span>` : ""}
            </div>
          </div>
          <p>${esc(row.content)}</p>
          ${row.adminMemo ? `<div class="small muted">메모: ${esc(row.adminMemo)}</div>` : ""}
        </div>
        ${renderAdminRecordControls("unsafe", row, ISSUE_MATERIAL_RULES.UNSAFE_STATUSES)}
      </article>`;
    }

    function renderUnsafeDetail(row) {
      const photos = unsafePhotosFor(row.id);
      const photoHtml = photos.length
        ? `<div class="unsafe-detail-photos">${photos.map((photo, index) => {
            const url = publicPhotoUrl(photo);
            return url ? `<figure><img class="unsafe-detail-photo" src="${esc(url)}" alt="불안전요소 사진 ${index + 1}" /><figcaption>사진 ${index + 1}</figcaption></figure>` : "";
          }).join("")}</div>`
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
        </div>
        ${row.adminMemo ? `<div class="field" style="margin-top:12px"><span class="field-label">현재 조치/메모</span><div class="readonly-box">${esc(row.adminMemo)}</div></div>` : ""}
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
      const photoHtml = photos.length
        ? `<div class="photo-strip">${photos.map((photo) => {
            const url = publicPhotoUrl(photo);
            return url ? `<img src="${esc(url)}" alt="불안전요소 사진" />` : "";
          }).join("")}</div>`
        : "";
      return `${pageHead("불안전요소 등록 완료", "접수된 내용을 확인하세요.")}
      <section class="panel panel-pad completion-card">
        ${badge("medium", row.status)}
        <div class="detail-grid">
          <div><span class="small muted">호선</span><strong>${esc(row.shipNo)}</strong></div>
          <div><span class="small muted">등록자</span><strong>${esc(row.workerNameSnapshot)}</strong></div>
          <div><span class="small muted">등록일시</span><strong>${esc(formatDateTime(row.createdAt))}</strong></div>
          <div><span class="small muted">사진</span><strong>${photos.length ? `${photos.length}개 첨부` : "없음"}</strong></div>
        </div>
        <div class="field" style="margin-top:12px">
          <span class="field-label">내용</span>
          <div class="readonly-box">${esc(row.content)}</div>
        </div>
        ${photoHtml}
        ${renderCompletionActions("unsafe")}
      </section>`;
    }

    function renderMaterialComplete(row) {
      return `${pageHead("호선자재 누락 등록 완료", "접수된 내용을 확인하세요.")}
      <section class="panel panel-pad completion-card">
        ${badge("medium", row.status)}
        <div class="detail-grid">
          <div><span class="small muted">호선</span><strong>${esc(row.shipNo)}</strong></div>
          <div><span class="small muted">자재명</span><strong>${esc(row.materialName)}</strong></div>
          <div><span class="small muted">등록자</span><strong>${esc(row.workerNameSnapshot)}</strong></div>
          <div><span class="small muted">등록일시</span><strong>${esc(formatDateTime(row.createdAt))}</strong></div>
        </div>
        <div class="field" style="margin-top:12px">
          <span class="field-label">내용</span>
          <div class="readonly-box">${esc(row.content)}</div>
        </div>
        ${renderCompletionActions("materials")}
      </section>`;
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

    function renderToolManager() {
      const tools = activeTools();
      return `
        ${state.adminMode ? "" : `<div class="notice" style="margin-bottom:10px">수정 모드를 켜면 공기구 목록과 성격을 바꿀 수 있습니다.</div>`}
        <div class="tool-admin-toolbar">
          <div class="small muted">카드를 선택하면 해당 공기구만 펼쳐서 수정합니다.</div>
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
        </div>`;
    }

    function renderToolCard(tool) {
      const editing = state.editToolId === tool.id;
      if (!editing) {
        return `<button class="tool-admin-card tool-admin-card-compact" data-edit-tool="${esc(tool.id)}" ${state.adminMode ? "" : "disabled"} type="button">
          <span class="tool-admin-title">${esc(tool.name)}</span>
          ${natureBadge(tool.nature)}
        </button>`;
      }
      return `<div class="tool-admin-card tool-admin-card-expanded">
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
      const cls = RISKS[risk]?.className || "status-draft";
      return `<span class="badge ${cls}">${esc(text)}</span>`;
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
      return activeTools().filter((tool) => CHECKLIST_RULES.toolMatchesCategoryNature(
        tool,
        cat?.toolNature || defaultToolNatureForCategory(cat),
      ));
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
      persistAndSync();
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

    document.addEventListener("click", (event) => {
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

      const button = event.target.closest("button");
      if (!button) return;

      if (button.dataset.view) changeView(button.dataset.view);
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
        pushRouteState();
      }
      if (button.dataset.action === "back-check-types") {
        state.selectedCategoryId = null;
        resetToolPrepDraft();
        render();
        pushRouteState();
      }
      if (button.dataset.action === "continue-tool-prep") {
        state.draft.toolPrepComplete = true;
        render();
      }
      if (button.dataset.action === "submit-inspection") submitInspection();
      if (button.dataset.action === "submit-unsafe") submitUnsafeIssue();
      if (button.dataset.action === "submit-material") submitMissingMaterial();
      if (button.dataset.action === "new-unsafe") {
        state.lastUnsafeIssueId = "";
        state.unsafeDraft = createUnsafeDraft();
        persist();
        render();
      }
      if (button.dataset.action === "new-material") {
        state.lastMaterialId = "";
        state.materialDraft = createMaterialDraft();
        persist();
        render();
      }
      if (button.dataset.action === "view-unsafe-list") {
        state.manageTab = "unsafe";
        saveJson("manageTab", state.manageTab);
        changeView("manage");
      }
      if (button.dataset.action === "view-material-list") {
        state.manageTab = "materials";
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
        pushRouteState();
      }
      if (button.dataset.action === "toggle-admin") toggleAdminMode();
      if (button.dataset.manageTab) {
        state.manageTab = button.dataset.manageTab;
        state.unsafeDetailId = "";
        saveJson("manageTab", state.manageTab);
        render();
      }
      if (button.dataset.action === "back-unsafe-list") {
        state.unsafeDetailId = "";
        render();
      }
      if (button.dataset.action === "add-worker") addWorker();
      if (button.dataset.editWorker) editWorker(button.dataset.editWorker);
      if (button.dataset.deleteWorker) deleteWorker(button.dataset.deleteWorker);
      if (button.dataset.saveRecord) saveAdminRecord(button.dataset.saveRecord);
      if (button.dataset.deleteRecord) deleteAdminRecord(button.dataset.deleteRecord);
      if (button.dataset.action === "reset-history") resetHistory();
      if (button.dataset.action === "delete-selected-history") deleteSelectedHistory();
      if (button.dataset.action === "add-ship") addShip();
      if (button.dataset.action === "save-ship-order") saveCurrentShipOrder();
      if (button.dataset.action === "focus-ship-add") {
        $("newShipNos")?.scrollIntoView({ behavior: "smooth", block: "center" });
        $("newShipNos")?.focus();
      }
      if (button.dataset.deleteShip) deleteShip(button.dataset.deleteShip);
      if (button.dataset.pickColor) {
        document.querySelectorAll("[data-pick-color]").forEach((node) => node.classList.toggle("active", node === button));
        $("catColor").value = button.dataset.pickColor;
      }
      if (button.dataset.pickIcon) {
        const targetId = button.dataset.pickIconTarget || "catIcon";
        document.querySelectorAll(`[data-pick-icon-target="${targetId}"]`).forEach((node) => node.classList.toggle("active", node === button));
        const target = $(targetId);
        if (target) target.value = button.dataset.pickIcon;
      }
      if (button.dataset.action === "save-category-icon") saveCategoryIcon();
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
        state.openAddItemSectionIds = [];
        state.categoryVisualOpen = false;
        render();
      }
      if (button.dataset.editCategory) editCategory(button.dataset.editCategory);
      if (button.dataset.saveCategory) saveCategory(button.dataset.saveCategory);
      if (button.dataset.action === "cancel-edit-category") {
        state.editCategoryId = null;
        render();
      }
      if (button.dataset.deleteCategory) deleteCategory(button.dataset.deleteCategory);
      if (button.dataset.action === "back-items") {
        state.manageCategoryId = null;
        state.editSectionId = null;
        state.openAddItemSectionIds = [];
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
      const historyCard = event.target.closest("[data-history-detail-card]");
      const unsafeCard = event.target.closest("[data-unsafe-record-detail]");
      if (historyCard && !event.target.closest("button,input,label,select,textarea")) {
        event.preventDefault();
        openHistoryDetail(historyCard.dataset.historyDetailCard);
        return;
      }
      if (unsafeCard && !event.target.closest("button,input,label,select,textarea")) {
        event.preventDefault();
        openUnsafeDetail(unsafeCard.dataset.unsafeRecordDetail);
      }
    });

    function openUnsafeDetail(id) {
      if (!id) return;
      state.unsafeDetailId = id;
      state.manageTab = "unsafe";
      saveJson("manageTab", state.manageTab);
      render();
    }

    function openUnsafeReceivedList() {
      state.manageTab = "unsafe";
      state.unsafeDetailId = "";
      state.unsafeFilters = { ...state.unsafeFilters, status: unsafeReceivedStatus() };
      saveJson("manageTab", state.manageTab);
      saveJson("unsafeFilters", state.unsafeFilters);
      changeView("manage");
    }

    function openHistoryDetail(id) {
      if (!id) return;
      state.historyDetailId = id;
      state.historyScope = "all";
      state.selectedHistoryIds = [];
      if (state.view === "history") {
        render();
        pushRouteState();
      } else {
        changeView("history");
      }
    }

    document.addEventListener("input", (event) => {
      if (event.target.id === "worker") state.draft.worker = event.target.value;
      if (event.target.id === "safetyPledge") state.draft.safetyPledge = event.target.value;
      if (event.target.id === "unsafeContent") {
        state.unsafeDraft.content = event.target.value;
        saveJson("unsafeDraft", state.unsafeDraft);
      }
      if (event.target.id === "materialName") {
        state.materialDraft.materialName = event.target.value;
        saveJson("materialDraft", state.materialDraft);
      }
      if (event.target.id === "materialContent") {
        state.materialDraft.content = event.target.value;
        saveJson("materialDraft", state.materialDraft);
      }
      if (event.target.matches("[data-check-item]")) {
        state.draft.checks[event.target.dataset.checkItem] = event.target.checked;
        render();
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
      }
      if (event.target.id === "unsafeWorkerId") {
        state.unsafeDraft.workerId = event.target.value;
        saveJson("unsafeDraft", state.unsafeDraft);
      }
      if (event.target.id === "unsafePhotos") {
        state.unsafeDraft.photos = Array.from(event.target.files || []).map((file) => file.name);
        saveJson("unsafeDraft", state.unsafeDraft);
      }
      if (event.target.id === "materialShipNo") {
        state.materialDraft.shipNo = event.target.value;
        saveJson("materialDraft", state.materialDraft);
      }
      if (event.target.id === "materialWorkerId") {
        state.materialDraft.workerId = event.target.value;
        saveJson("materialDraft", state.materialDraft);
      }
      if (event.target.matches("[data-record-filter]")) {
        updateRecordFilter(event.target.dataset.recordFilter, event.target.value);
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
      const cat = categoryById(state.selectedCategoryId);
      const items = filteredChecklistItems(cat.id);
      const highMissing = items.filter((row) => row.risk === "high" && !state.draft.checks[row.id]);
      if (!state.draft.worker.trim()) return toast("담당자명을 입력하세요.");
      if (!state.draft.shipNo) return toast("호선을 선택하세요.");
      if (highMissing.length) return toast("위험 항목을 모두 확인해야 제출할 수 있습니다.");
      if (!items.length) return toast("등록된 점검 항목이 없습니다.");

      const now = serverNow();
      const checkedCount = items.filter((row) => state.draft.checks[row.id]).length;
      const inspectionId = uid("inspection");
      const completion = Math.round(checkedCount / items.length * 100);
      const warnings = items.filter((row) => !state.draft.checks[row.id] && row.risk !== "low").length;
      const selectedTools = sanitizeToolIds(state.draft.selectedToolIds)
        .map((id) => toolById(id))
        .filter((tool) => tool && tool.deleted !== true)
        .map((tool) => ({ id: tool.id, name: tool.name }));
      const inspection = {
        id: inspectionId,
        categoryId: cat.id,
        worker: state.draft.worker.trim(),
        shipNo: state.draft.shipNo,
        safetyPledge: state.draft.safetyPledge.trim(),
        date: localDate(now),
        time: recordTime(now),
        status: checkedCount === items.length ? "완료" : "미완료",
        warnings,
        completion,
        tools: selectedTools,
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

      state.draft = createDraft();
      state.selectedCategoryId = null;
      persist();
      const synced = await syncInspectionHistory(inspection, inspectionItems);
      if (synced) {
        changeView("history");
        toast("점검 이력이 저장되었습니다.");
        return;
      }
      state.view = "history";
      state.historyScope = "all";
      state.historyFilter = "all";
      state.historyDetailId = null;
      render();
      replaceRouteState();
      toast("점검 이력은 저장되었지만 서버 동기화에 실패했습니다.");
    }

    async function submitUnsafeIssue() {
      const errors = ISSUE_MATERIAL_RULES.validateUnsafeDraft(state.unsafeDraft);
      if (errors.length) return toast(errors[0]);
      const input = $("unsafePhotos");
      const files = Array.from(input?.files || []);
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
      state.unsafeIssues.unshift(row);
      state.lastUnsafeIssueId = id;
      state.unsafeDraft = createUnsafeDraft();
      persist();
      await syncUnsafeIssue(row, files);
      render();
      replaceRouteState();
      toast("불안전요소가 접수되었습니다.");
    }

    async function submitMissingMaterial() {
      const errors = ISSUE_MATERIAL_RULES.validateMaterialDraft(state.materialDraft);
      if (errors.length) return toast(errors[0]);
      const now = serverNow().toISOString();
      const id = uid("material");
      const snapshot = ISSUE_MATERIAL_RULES.createWorkerSnapshot(state.materialDraft.workerId, state.workers);
      const row = {
        id,
        shipNo: state.materialDraft.shipNo,
        materialName: state.materialDraft.materialName.trim(),
        content: state.materialDraft.content.trim(),
        ...snapshot,
        status: ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[0],
        adminMemo: "",
        createdAt: now,
        updatedAt: now,
        completedAt: "",
      };
      state.missingMaterials.unshift(row);
      state.lastMaterialId = id;
      state.materialDraft = createMaterialDraft();
      persist();
      await syncMissingMaterial(row);
      render();
      replaceRouteState();
      toast("호선자재 누락이 접수되었습니다.");
    }

    function setAdminMode(enabled, email = "") {
      state.adminMode = Boolean(enabled);
      state.adminEmail = enabled ? email : "";
      saveAdminMode(state.adminMode);
      if (!enabled) {
        state.toolAddOpen = false;
        state.editToolId = null;
        state.editCategoryId = null;
        state.editSectionId = null;
        state.editItemId = null;
        state.openAddItemSectionIds = [];
        state.categoryVisualOpen = false;
        state.selectedHistoryIds = [];
      }
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
      persistAndSync();
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
      persistAndSync();
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
      if (isSyncConfigured()) await pushRemote();
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

    function saveAdminRecord(token) {
      if (!requireAdmin()) return;
      const [kind, id] = token.split(":");
      const rows = kind === "unsafe" ? state.unsafeIssues : state.missingMaterials;
      const row = rows.find((item) => item.id === id);
      if (!row) return;
      const status = document.querySelector(`[data-record-status="${cssEscape(token)}"]`)?.value || row.status;
      const memo = document.querySelector(`[data-record-memo="${cssEscape(token)}"]`)?.value || "";
      row.status = status;
      row.adminMemo = memo.trim();
      row.updatedAt = serverNow().toISOString();
      const doneStatus = kind === "unsafe" ? ISSUE_MATERIAL_RULES.UNSAFE_STATUSES[2] : ISSUE_MATERIAL_RULES.MATERIAL_STATUSES[2];
      row.completedAt = status === doneStatus ? (row.completedAt || row.updatedAt) : "";
      persistAndSync();
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
      if (isSyncConfigured()) await pushRemote();
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
      persistAndSync();
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
      persistAndSync();
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
        pushRemote();
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
      persistAndSync();
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
        order: state.categories.length + 1,
      });
      state.sections.push({ id: uid("section"), categoryId: id, title: "기본 점검", order: 1 });
      persistAndSync();
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
      persistAndSync();
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
      state.categories = state.categories.map((row) => row.id === id ? { ...row, label } : row);
      state.editCategoryId = null;
      persistAndSync();
      render();
      toast("작업 유형명을 수정했습니다.");
    }

    function deleteCategory(id) {
      if (!requireAdmin()) return;
      const cat = categoryById(id);
      if (!cat) return;
      if (!confirm(`${cat.label} 작업 유형을 삭제할까요? 기존 점검 이력은 유지됩니다.`)) return;
      state.categories = state.categories.filter((row) => row.id !== id);
      state.sections = state.sections.filter((row) => row.categoryId !== id);
      state.items = state.items.map((row) => row.categoryId === id ? { ...row, active: false } : row);
      if (state.manageCategoryId === id) state.manageCategoryId = null;
      persistAndSync();
      render();
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
      persistAndSync();
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
      persistAndSync();
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
      persistAndSync();
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
      persistAndSync();
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
      persistAndSync();
      render();
      toast("점검 항목을 수정했습니다.");
    }

    function deleteChecklistItem(id) {
      if (!requireAdmin()) return;
      const row = state.items.find((itemRow) => itemRow.id === id);
      if (!row) return;
      if (!confirm("이 점검 항목을 삭제할까요? 기존 점검 이력은 유지됩니다.")) return;
      state.items = state.items.map((itemRow) => itemRow.id === id ? { ...itemRow, active: false } : itemRow);
      persistAndSync();
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
      persistAndSync();
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
      persistAndSync();
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
      persistAndSync();
      render();
      toast("공기구/준비물을 삭제했습니다.");
    }

    function toggleRequireToolCheck(categoryId) {
      if (!requireAdmin()) return;
      state.categories = state.categories.map((row) => row.id === categoryId ? { ...row, requireToolCheck: row.requireToolCheck === false } : row);
      persistAndSync();
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
        persistAndSync();
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
      persistAndSync();
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
      persistAndSync();
      render();
      toast(affected ? "사용 중인 작업 유형은 기본 픽토그램으로 되돌렸습니다." : "픽토그램을 삭제했습니다.");
    }

    function photoExtension(file) {
      const name = String(file && file.name || "").toLowerCase();
      const ext = name.split(".").pop();
      return ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
    }

    async function uploadUnsafePhotos(issueId, files) {
      const client = supabaseClient();
      if (!client || !files.length) return [];
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
        persist();
        const synced = await persistAndSync();
        if (!synced) toast("기록은 저장되었지만 서버 동기화에 실패했습니다.");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("사진 업로드에 실패했습니다. 기록은 로컬에 저장되었습니다.");
        return false;
      }
    }

    async function syncMissingMaterial(row) {
      const synced = await persistAndSync();
      if (!synced) toast("기록은 저장되었지만 서버 동기화에 실패했습니다.");
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

    async function persistAndSync() {
      persist();
      if (isSyncConfigured()) {
        return pushRemote();
      }
      return true;
    }

    function remoteConfigByKey(key) {
      return REMOTE_TABLES.find((config) => config.key === key);
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

    async function pushRemote() {
      const client = supabaseClient();
      if (!client) {
        setSyncStatus("로컬 저장", "offline");
        return true;
      }
      setSyncStatus("동기화 중", "pending");
      try {
        for (const config of REMOTE_TABLES) {
          await upsertTable(client, config, state[config.key]);
        }
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("동기화에 실패했습니다. Supabase 테이블과 RLS 정책을 확인하세요.");
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
      setSyncStatus("동기화 중", "pending");

      try {
        await upsertTable(client, inspectionConfig, [inspection]);
        await upsertTable(client, itemConfig, inspectionItems);
        setSyncStatus("온라인", "online");
        return true;
      } catch (error) {
        console.error(error);
        setSyncStatus("동기화 오류", "error");
        toast("동기화에 실패했습니다. Supabase 테이블과 RLS 정책을 확인하세요.");
        return false;
      }
    }

    async function pullRemote() {
      const client = supabaseClient();
      if (!client) return setSyncStatus("로컬 저장", "offline");
      setSyncStatus("서버 확인 중", "pending");
      try {
        const results = await Promise.all(REMOTE_TABLES.map((config) => selectTable(client, config)));
        results.forEach(({ key, rows }) => {
          if (rows.length) state[key] = rows;
        });
        normalizeDataShape();
        state.inspections = state.inspections.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
        dedupeShips();
        cleanupDeliveredShips(true);
        persist();
        setSyncStatus("온라인", "online");
        render();
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
      if (error && config.key === "inspections" && /safety_pledge/i.test(String(error.message || error.details || ""))) {
        const fallbackPayload = payload.map(({ safety_pledge, ...row }) => row);
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
