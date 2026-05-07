import { useState, useEffect } from "react";

useEffect(() => { localStorage.setItem('checklists', JSON.stringify(checklists)); }, [checklists]);
useEffect(() => { localStorage.setItem('ships',      JSON.stringify(ships));      }, [ships]);
useEffect(() => { localStorage.setItem('history',    JSON.stringify(history));    }, [history]);

// localStorage 헬퍼
const load = (key, def) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch { return def; }
};

const INIT_CHECKLISTS = {
  welding: {
    label: "용접/절단 작업", icon: "🔥", color: "#e24b4a",
    items: [
      { id: "w1", text: "보호구 착용 확인 (용접 마스크, 장갑, 앞치마)", risk: "high" },
      { id: "w2", text: "작업 구역 가연성 물질 제거 완료", risk: "high" },
      { id: "w3", text: "소화기 비치 및 작동 상태 확인", risk: "high" },
      { id: "w4", text: "용접기/절단기 전원 및 접지 상태 점검", risk: "medium" },
      { id: "w5", text: "환기 상태 확인 (가스 농도 측정)", risk: "high" },
      { id: "w6", text: "인근 작업자 대피 또는 방호판 설치", risk: "medium" },
      { id: "w7", text: "화기 작업 허가서 발급 확인", risk: "high" },
      { id: "w8", text: "작업 후 잔불 처리 방법 숙지", risk: "medium" },
    ],
  },
  height: {
    label: "고소 작업 (비계/크레인)", icon: "🏗️", color: "#ef9f27",
    items: [
      { id: "h1", text: "안전대 및 구명줄 착용 상태 확인", risk: "high" },
      { id: "h2", text: "비계 설치 상태 및 잠금장치 점검", risk: "high" },
      { id: "h3", text: "크레인 와이어 로프 마모·손상 여부 확인", risk: "high" },
      { id: "h4", text: "하부 작업 구역 출입 통제 조치", risk: "high" },
      { id: "h5", text: "풍속 측정 및 작업 가능 여부 판단 (10m/s 이하)", risk: "medium" },
      { id: "h6", text: "작업 발판 폭 및 난간 설치 확인 (40cm 이상)", risk: "medium" },
      { id: "h7", text: "신호수 배치 확인", risk: "medium" },
      { id: "h8", text: "장비 정격 하중 초과 여부 확인", risk: "high" },
    ],
  },
  mounting: {
    label: "탑재 작업", icon: "🚢", color: "#378add",
    items: [
      { id: "m1", text: "탑재 블록 중량 및 무게중심 확인", risk: "high" },
      { id: "m2", text: "달기 구(러그) 용접 상태 및 강도 확인", risk: "high" },
      { id: "m3", text: "도크 바닥 지지 구조 하중 검토", risk: "high" },
      { id: "m4", text: "인양 신호 체계 확립 및 신호수 배치", risk: "medium" },
      { id: "m5", text: "인근 작업자 대피 완료 확인", risk: "high" },
      { id: "m6", text: "블록 위치 결정 후 고정 상태 확인", risk: "medium" },
      { id: "m7", text: "안전 통제선 및 출입 통제 설치", risk: "medium" },
    ],
  },
  confined: {
    label: "밀폐 공간 작업", icon: "🔧", color: "#1d9e75",
    items: [
      { id: "c1", text: "밀폐 공간 출입 허가서 발급 확인", risk: "high" },
      { id: "c2", text: "산소 농도 측정 (18~23.5% 유지)", risk: "high" },
      { id: "c3", text: "유해 가스 농도 측정 완료", risk: "high" },
      { id: "c4", text: "환기 장치 설치 및 가동 확인", risk: "high" },
      { id: "c5", text: "감시인 배치 및 통신 수단 확보", risk: "medium" },
      { id: "c6", text: "비상 탈출 경로 및 구조 장비 확인", risk: "high" },
      { id: "c7", text: "작업자 개인 보호구 착용 확인", risk: "medium" },
    ],
  },
};

const RISK_LABELS = { high: "위험", medium: "주의", low: "정상" };
const RISK_COLORS = {
  high: { bg: "#fcebeb", color: "#a32d2d", border: "#f09595" },
  medium: { bg: "#faeeda", color: "#854f0b", border: "#fac775" },
  low: { bg: "#eaf3de", color: "#3b6d11", border: "#c0dd97" },
};
const PRESET_COLORS = ["#e24b4a","#ef9f27","#378add","#1d9e75","#7c5cbf","#d97ab0","#5b8c5a","#e07b39","#0077a8","#c0392b"];
const TABS = ["대시보드", "체크리스트 작성", "점검 이력", "호선 관리", "항목 관리"];
const initShips = [
  { id: 1, no: "1234", name: "LNG 운반선 A" },
  { id: 2, no: "H3462", name: "컨테이너선 B" },
];
const sampleHistory = [
  { id: 1, type: "welding", date: "2026-05-07", time: "08:30", worker: "김철수", shipNo: "1234", status: "완료", warnings: 0 },
  { id: 2, type: "height", date: "2026-05-07", time: "09:15", worker: "이영희", shipNo: "H3462", status: "완료", warnings: 1 },
  { id: 3, type: "mounting", date: "2026-05-06", time: "14:00", worker: "박민준", shipNo: "1234", status: "미완료", warnings: 2 },
  { id: 4, type: "confined", date: "2026-05-06", time: "10:45", worker: "최지원", shipNo: "H3462", status: "완료", warnings: 0 },
  { id: 5, type: "welding", date: "2026-05-05", time: "07:50", worker: "정우성", shipNo: "1234", status: "완료", warnings: 0 },
];

export default function App() {
  const [tab, setTab] = useState(0);
  const [checklists, setChecklists] = useState(() => load('checklists', INIT_CHECKLISTS));

  // 호선
  const [ships,      setShips]      = useState(() => load('ships',      initShips));
  const [newShipNo, setNewShipNo] = useState("");
  const [newShipName, setNewShipName] = useState("");
  const [editShipId, setEditShipId] = useState(null);
  const [editShipNo, setEditShipNo] = useState("");
  const [editShipName, setEditShipName] = useState("");

  // 항목 관리 – 카테고리 선택 및 아이템 CRUD
  const [mgmtType, setMgmtType] = useState(null);
  const [newItemText, setNewItemText] = useState("");
  const [newItemRisk, setNewItemRisk] = useState("medium");
  const [editItemId, setEditItemId] = useState(null);
  const [editItemText, setEditItemText] = useState("");
  const [editItemRisk, setEditItemRisk] = useState("medium");

  // 카테고리 편집
  const [editCatKey, setEditCatKey] = useState(null);
  const [editCatLabel, setEditCatLabel] = useState("");
  const [editCatIcon, setEditCatIcon] = useState("");
  const [editCatColor, setEditCatColor] = useState("#378add");

  // 새 카테고리 추가 폼
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("📋");
  const [newCatColor, setNewCatColor] = useState("#378add");
  const [deleteCatConfirm, setDeleteCatConfirm] = useState(null);

  // 체크리스트 작성
  const [selectedType, setSelectedType] = useState(null);
  const [checks, setChecks] = useState({});
  const [worker, setWorker] = useState("");
  const [shipNo, setShipNo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history,    setHistory]    = useState(() => load('history',    sampleHistory));
  const [filterType, setFilterType] = useState("all");

  const cl = selectedType ? checklists[selectedType] : null;
  const items = cl ? cl.items : [];
  const checkedCount = items.filter(i => checks[i.id]).length;
  const uncheckedHigh = items.filter(i => !checks[i.id] && i.risk === "high");
  const progress = items.length ? Math.round((checkedCount / items.length) * 100) : 0;

  const totalToday = history.filter(h => h.date === "2026-05-07").length;
  const totalDone = history.filter(h => h.status === "완료").length;
  const totalWarn = history.filter(h => h.warnings > 0).length;

  // 체크리스트 제출
  function handleSubmit() {
    if (!worker.trim() || !shipNo) return;
    setHistory([{ id: history.length + 1, type: selectedType, date: "2026-05-07", time: new Date().toTimeString().slice(0, 5), worker, shipNo, status: checkedCount === items.length ? "완료" : "미완료", warnings: uncheckedHigh.length }, ...history]);
    setSubmitted(true);
  }
  function resetForm() { setSelectedType(null); setChecks({}); setWorker(""); setShipNo(""); setSubmitted(false); }

  // 호선 CRUD
  function addShip() { if (!newShipNo.trim()) return; setShips([...ships, { id: Date.now(), no: newShipNo.trim(), name: newShipName.trim() }]); setNewShipNo(""); setNewShipName(""); }
  function deleteShip(id) { setShips(ships.filter(s => s.id !== id)); }
  function startEditShip(s) { setEditShipId(s.id); setEditShipNo(s.no); setEditShipName(s.name); }
  function saveEditShip() { setShips(ships.map(s => s.id === editShipId ? { ...s, no: editShipNo.trim(), name: editShipName.trim() } : s)); setEditShipId(null); }

  // 아이템 CRUD
  function addItem() {
    if (!newItemText.trim() || !mgmtType) return;
    const ni = { id: `${mgmtType}_${Date.now()}`, text: newItemText.trim(), risk: newItemRisk };
    setChecklists(prev => ({ ...prev, [mgmtType]: { ...prev[mgmtType], items: [...prev[mgmtType].items, ni] } }));
    setNewItemText(""); setNewItemRisk("medium");
  }
  function deleteItem(typeKey, itemId) { setChecklists(prev => ({ ...prev, [typeKey]: { ...prev[typeKey], items: prev[typeKey].items.filter(i => i.id !== itemId) } })); }
  function startEditItem(item) { setEditItemId(item.id); setEditItemText(item.text); setEditItemRisk(item.risk); }
  function saveEditItem() {
    setChecklists(prev => ({ ...prev, [mgmtType]: { ...prev[mgmtType], items: prev[mgmtType].items.map(i => i.id === editItemId ? { ...i, text: editItemText.trim(), risk: editItemRisk } : i) } }));
    setEditItemId(null);
  }

  // 카테고리 CRUD
  function startEditCat(k) {
    setEditCatKey(k); setEditCatLabel(checklists[k].label);
    setEditCatIcon(checklists[k].icon); setEditCatColor(checklists[k].color);
    setShowNewCat(false);
  }
  function saveEditCat() {
    if (!editCatLabel.trim()) return;
    setChecklists(prev => ({ ...prev, [editCatKey]: { ...prev[editCatKey], label: editCatLabel.trim(), icon: editCatIcon.trim() || "📋", color: editCatColor } }));
    setEditCatKey(null);
  }
  function addCat() {
    if (!newCatLabel.trim()) return;
    const key = "cat_" + Date.now();
    setChecklists(prev => ({ ...prev, [key]: { label: newCatLabel.trim(), icon: newCatIcon.trim() || "📋", color: newCatColor, items: [] } }));
    setNewCatLabel(""); setNewCatIcon("📋"); setNewCatColor("#378add"); setShowNewCat(false);
  }
  function deleteCat(k) {
    const next = { ...checklists };
    delete next[k];
    setChecklists(next);
    setDeleteCatConfirm(null);
    if (mgmtType === k) setMgmtType(null);
  }

  const filteredHistory = filterType === "all" ? history : history.filter(h => h.type === filterType);

  const s = {
    wrap: { fontFamily: "sans-serif", color: "var(--color-text-primary)", maxWidth: 720, margin: "0 auto", padding: "0 0 2rem" },
    header: { background: "#0c447c", color: "#fff", padding: "1rem 1.25rem", borderRadius: "var(--border-radius-lg)", marginBottom: "1rem" },
    tabs: { display: "flex", gap: 2, marginBottom: "1rem", borderBottom: "0.5px solid var(--color-border-tertiary)", flexWrap: "wrap" },
    tab: (a) => ({ padding: "8px 12px", fontSize: 13, fontWeight: a ? 500 : 400, color: a ? "#185fa5" : "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", borderBottom: a ? "2px solid #185fa5" : "2px solid transparent", marginBottom: -1 }),
    card: { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: 12 },
    metricGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 },
    metric: { background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "0.75rem 1rem" },
    typeGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 },
    typeBtn: (sel, color) => ({ background: sel ? color + "18" : "var(--color-background-primary)", border: sel ? `1.5px solid ${color}` : "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "0.85rem 1rem", cursor: "pointer", textAlign: "left" }),
    badge: (risk) => ({ fontSize: 11, padding: "2px 7px", borderRadius: 99, background: RISK_COLORS[risk].bg, color: RISK_COLORS[risk].color, border: `0.5px solid ${RISK_COLORS[risk].border}`, whiteSpace: "nowrap", display: "inline-block" }),
    progressBar: (pct, color) => ({ height: 6, background: color, borderRadius: 99, width: pct + "%", transition: "width .3s" }),
    progressTrack: { height: 6, background: "var(--color-background-secondary)", borderRadius: 99, marginBottom: 8 },
    input: { width: "100%", boxSizing: "border-box", padding: "8px 12px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)" },
    select: { boxSizing: "border-box", padding: "8px 10px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", fontSize: 13, background: "var(--color-background-primary)", color: "var(--color-text-primary)", cursor: "pointer" },
    btn: (disabled) => ({ padding: "8px 18px", borderRadius: "var(--border-radius-md)", background: disabled ? "var(--color-background-secondary)" : "#185fa5", color: disabled ? "var(--color-text-tertiary)" : "#fff", border: "none", cursor: disabled ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }),
    btnSm: (color) => ({ padding: "5px 10px", borderRadius: "var(--border-radius-md)", background: "none", color: color || "var(--color-text-secondary)", border: `0.5px solid ${color || "var(--color-border-secondary)"}`, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }),
    btnGhost: { padding: "7px 14px", borderRadius: "var(--border-radius-md)", background: "none", color: "#185fa5", border: "1px dashed #185fa5", cursor: "pointer", fontSize: 13, fontWeight: 500 },
    warnBox: { background: "#fcebeb", border: "0.5px solid #f09595", borderRadius: "var(--border-radius-md)", padding: "0.75rem 1rem", marginBottom: 12 },
    histHead: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.8fr 0.8fr 70px 60px", gap: 8, padding: "6px 0 8px", borderBottom: "0.5px solid var(--color-border-secondary)", fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 },
    histRow: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.8fr 0.8fr 70px 60px", gap: 8, alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13 },
  };

  // 카테고리 색상 팔레트 피커 컴포넌트
  function ColorPicker({ value, onChange }) {
    return (
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        {PRESET_COLORS.map(c => (
          <button key={c} onClick={() => onChange(c)} style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: value === c ? "2.5px solid var(--color-text-primary)" : "2px solid transparent", cursor: "pointer", padding: 0, outline: "none", flexShrink: 0 }} />
        ))}
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width: 28, height: 22, border: "0.5px solid var(--color-border-secondary)", borderRadius: 4, padding: 0, cursor: "pointer", background: "none" }}
          title="직접 선택" />
      </div>
    );
  }

  // 카테고리 인라인 편집 폼
  function CatEditForm({ onSave, onCancel, label, setLabel, icon, setIcon, color, setColor, saveLabel }) {
    return (
      <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "0.85rem 1rem", marginBottom: 4 }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>아이콘</div>
            <input style={{ ...s.input, textAlign: "center", fontSize: 20 }} value={icon} onChange={e => setIcon(e.target.value)} maxLength={4} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>카테고리명 *</div>
            <input style={s.input} placeholder="작업 유형 이름" value={label} onChange={e => setLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && onSave()} />
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>색상</div>
          <ColorPicker value={color} onChange={setColor} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={s.btn(!label.trim())} onClick={onSave} disabled={!label.trim()}>{saveLabel || "저장"}</button>
          <button style={s.btnSm()} onClick={onCancel}>취소</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={{ fontSize: 20, fontWeight: 500 }}>⚓ 조선소 안전 체크리스트</div>
        <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>현장 작업 안전 점검 관리 시스템 · 2026-05-07</div>
      </div>

      <div style={s.tabs}>
        {TABS.map((t, i) => <button key={i} style={s.tab(tab === i)} onClick={() => { setTab(i); if (i === 1) resetForm(); if (i === 4) { setMgmtType(null); setEditCatKey(null); setShowNewCat(false); } }}>{t}</button>)}
      </div>

      {/* ── 대시보드 ── */}
      {tab === 0 && (
        <>
          <div style={s.metricGrid}>
            <div style={s.metric}><div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>오늘 점검 건수</div><div style={{ fontSize: 22, fontWeight: 500, color: "#185fa5" }}>{totalToday}</div></div>
            <div style={s.metric}><div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>완료율</div><div style={{ fontSize: 22, fontWeight: 500, color: "#3b6d11" }}>{Math.round((totalDone / history.length) * 100)}%</div></div>
            <div style={s.metric}><div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>위험 경고 건수</div><div style={{ fontSize: 22, fontWeight: 500, color: "#a32d2d" }}>{totalWarn}</div></div>
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>작업 유형별 현황</div>
            {Object.entries(checklists).map(([k, v]) => {
              const cnt = history.filter(h => h.type === k).length;
              const done = history.filter(h => h.type === k && h.status === "완료").length;
              const pct = cnt ? Math.round((done / cnt) * 100) : 0;
              return (
                <div key={k} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span>{v.icon} {v.label}</span>
                    <span style={{ color: "var(--color-text-secondary)" }}>{done}/{cnt} 완료</span>
                  </div>
                  <div style={s.progressTrack}><div style={s.progressBar(pct, v.color)} /></div>
                </div>
              );
            })}
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>최근 점검 내역</div>
            {history.slice(0, 4).map(h => {
              const c = checklists[h.type] || { icon: "?", label: "(삭제된 유형)" };
              return (
                <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13 }}>
                  <div><span style={{ marginRight: 6 }}>{c.icon}</span><span style={{ fontWeight: 500 }}>{c.label}</span><span style={{ color: "var(--color-text-secondary)", marginLeft: 8 }}>{h.worker} · {h.shipNo} · {h.date}</span></div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {h.warnings > 0 && <span style={s.badge("high")}>위험 {h.warnings}</span>}
                    <span style={s.badge(h.status === "완료" ? "low" : "medium")}>{h.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── 체크리스트 작성 ── */}
      {tab === 1 && (
        <>
          {submitted ? (
            <div style={{ ...s.card, textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>체크리스트가 제출되었습니다</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16 }}>{worker} · {shipNo} · {cl?.label} · {checkedCount}/{items.length} 항목 완료</div>
              {uncheckedHigh.length > 0 && <div style={{ ...s.warnBox, marginBottom: 16 }}><div style={{ fontSize: 13, color: "#a32d2d", fontWeight: 500 }}>미확인 위험 항목 {uncheckedHigh.length}건이 있습니다. 즉시 조치 바랍니다.</div></div>}
              <button style={s.btn(false)} onClick={resetForm}>새 체크리스트 작성</button>
            </div>
          ) : !selectedType ? (
            <>
              <div style={{ fontSize: 14, marginBottom: 10, color: "var(--color-text-secondary)" }}>작업 유형을 선택하세요</div>
              <div style={s.typeGrid}>
                {Object.entries(checklists).map(([k, v]) => (
                  <button key={k} style={s.typeBtn(false, v.color)} onClick={() => setSelectedType(k)}>
                    <div style={{ fontSize: 22 }}>{v.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{v.label}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{v.items.length}개 항목</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <button onClick={() => setSelectedType(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)" }}>← 뒤로</button>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{cl.icon} {cl.label}</span>
              </div>
              <div style={{ ...s.card, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>담당자명</div>
                    <input style={s.input} placeholder="이름 입력" value={worker} onChange={e => setWorker(e.target.value)} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>호선 번호</div>
                    <select style={s.input} value={shipNo} onChange={e => setShipNo(e.target.value)}>
                      <option value="">호선 선택</option>
                      {ships.map(s => <option key={s.id} value={s.no}>{s.no}{s.name ? ` · ${s.name}` : ""}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {uncheckedHigh.length > 0 && <div style={s.warnBox}><div style={{ fontSize: 13, color: "#a32d2d", fontWeight: 500 }}>⚠ 위험 항목 {uncheckedHigh.length}건 미확인</div><div style={{ fontSize: 12, color: "#a32d2d" }}>제출 전 반드시 확인하세요.</div></div>}
              <div style={s.progressTrack}><div style={s.progressBar(progress, cl.color)} /></div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10 }}>{checkedCount}/{items.length} 항목 확인됨 ({progress}%)</div>
              <div style={s.card}>
                {items.length === 0 && <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>등록된 항목이 없습니다. 항목 관리 탭에서 추가해 주세요.</div>}
                {items.map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", opacity: checks[item.id] ? 0.55 : 1 }}>
                    <input type="checkbox" checked={!!checks[item.id]} onChange={e => setChecks({ ...checks, [item.id]: e.target.checked })} style={{ marginTop: 2, accentColor: cl.color, cursor: "pointer", width: 16, height: 16, flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 14, textDecoration: checks[item.id] ? "line-through" : "none" }}>{item.text}</div>
                    <span style={s.badge(item.risk)}>{RISK_LABELS[item.risk]}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                <button style={s.btn(!worker.trim() || !shipNo)} onClick={handleSubmit} disabled={!worker.trim() || !shipNo}>제출하기</button>
              </div>
            </>
          )}
        </>
      )}

      {/* ── 점검 이력 ── */}
      {tab === 2 && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {[["all", "전체"], ...Object.entries(checklists).map(([k, v]) => [k, v.icon + " " + v.label])].map(([k, label]) => (
              <button key={k} onClick={() => setFilterType(k)} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 99, background: filterType === k ? "#185fa5" : "var(--color-background-secondary)", color: filterType === k ? "#fff" : "var(--color-text-secondary)", border: "none", cursor: "pointer" }}>{label}</button>
            ))}
          </div>
          <div style={s.card}>
            <div style={s.histHead}><span>작업 유형</span><span>담당자</span><span>호선</span><span>일시</span><span>상태</span><span>경고</span></div>
            {filteredHistory.length === 0 && <div style={{ fontSize: 13, color: "var(--color-text-secondary)", padding: "1rem 0" }}>결과 없음</div>}
            {filteredHistory.map(h => {
              const c = checklists[h.type] || { icon: "?", label: "(삭제)" };
              return (
                <div key={h.id} style={s.histRow}>
                  <span>{c.icon} {c.label}</span><span>{h.worker}</span>
                  <span style={{ color: "var(--color-text-secondary)" }}>{h.shipNo}</span>
                  <span style={{ color: "var(--color-text-secondary)" }}>{h.date} {h.time}</span>
                  <span style={s.badge(h.status === "완료" ? "low" : "medium")}>{h.status}</span>
                  <span style={s.badge(h.warnings > 0 ? "high" : "low")}>{h.warnings > 0 ? `위험 ${h.warnings}` : "없음"}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── 호선 관리 ── */}
      {tab === 3 && (
        <>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>새 호선 추가</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr auto", gap: 8, alignItems: "end" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>호선 번호 *</div>
                <input style={s.input} placeholder="예) H1234" value={newShipNo} onChange={e => setNewShipNo(e.target.value)} onKeyDown={e => e.key === "Enter" && addShip()} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>선박명 (선택)</div>
                <input style={s.input} placeholder="예) LNG 운반선 C" value={newShipName} onChange={e => setNewShipName(e.target.value)} onKeyDown={e => e.key === "Enter" && addShip()} />
              </div>
              <button style={s.btn(!newShipNo.trim())} onClick={addShip} disabled={!newShipNo.trim()}>추가</button>
            </div>
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>등록된 호선 목록 <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 400 }}>({ships.length}척)</span></div>
            {ships.length === 0 && <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>등록된 호선이 없습니다.</div>}
            {ships.map(ship => (
              <div key={ship.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                {editShipId === ship.id ? (
                  <>
                    <input style={{ ...s.input, width: 100 }} value={editShipNo} onChange={e => setEditShipNo(e.target.value)} />
                    <input style={{ ...s.input, flex: 1 }} value={editShipName} onChange={e => setEditShipName(e.target.value)} />
                    <button style={s.btn(!editShipNo.trim())} onClick={saveEditShip} disabled={!editShipNo.trim()}>저장</button>
                    <button style={s.btnSm()} onClick={() => setEditShipId(null)}>취소</button>
                  </>
                ) : (
                  <>
                    <div style={{ flex: 1 }}><span style={{ fontWeight: 500, fontSize: 14 }}>{ship.no}</span>{ship.name && <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: 8 }}>{ship.name}</span>}</div>
                    <button style={s.btnSm("#185fa5")} onClick={() => startEditShip(ship)}>수정</button>
                    <button style={s.btnSm("#a32d2d")} onClick={() => deleteShip(ship.id)}>삭제</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── 항목 관리 ── */}
      {tab === 4 && (
        <>
          {/* 카테고리 목록 화면 */}
          {!mgmtType ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>작업 유형 관리 <span style={{ fontSize: 12 }}>· 카테고리를 수정하거나 새로 추가하세요</span></div>
                <button style={s.btnGhost} onClick={() => { setShowNewCat(!showNewCat); setEditCatKey(null); }}>+ 새 작업 추가</button>
              </div>

              {/* 새 카테고리 추가 폼 */}
              {showNewCat && (
                <div style={{ ...s.card, border: "1px dashed #185fa5" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: "#185fa5" }}>새 작업 유형 추가</div>
                  <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>아이콘</div>
                      <input style={{ ...s.input, textAlign: "center", fontSize: 20 }} value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} maxLength={4} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>카테고리명 *</div>
                      <input style={s.input} placeholder="예) 도장 작업" value={newCatLabel} onChange={e => setNewCatLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && addCat()} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>색상</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      {PRESET_COLORS.map(c => (
                        <button key={c} onClick={() => setNewCatColor(c)} style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: newCatColor === c ? "2.5px solid var(--color-text-primary)" : "2px solid transparent", cursor: "pointer", padding: 0, outline: "none" }} />
                      ))}
                      <input type="color" value={newCatColor} onChange={e => setNewCatColor(e.target.value)} style={{ width: 28, height: 22, border: "0.5px solid var(--color-border-secondary)", borderRadius: 4, padding: 0, cursor: "pointer", background: "none" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={s.btn(!newCatLabel.trim())} onClick={addCat} disabled={!newCatLabel.trim()}>추가하기</button>
                    <button style={s.btnSm()} onClick={() => { setShowNewCat(false); setNewCatLabel(""); setNewCatIcon("📋"); setNewCatColor("#378add"); }}>취소</button>
                  </div>
                </div>
              )}

              {/* 카테고리 카드 목록 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(checklists).map(([k, v]) => (
                  <div key={k}>
                    {editCatKey === k ? (
                      <div style={{ ...s.card, border: `1.5px solid ${v.color}` }}>
                        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: v.color }}>카테고리 수정 중</div>
                        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 10, marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>아이콘</div>
                            <input style={{ ...s.input, textAlign: "center", fontSize: 20 }} value={editCatIcon} onChange={e => setEditCatIcon(e.target.value)} maxLength={4} />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>카테고리명 *</div>
                            <input style={s.input} value={editCatLabel} onChange={e => setEditCatLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEditCat()} />
                          </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>색상</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                            {PRESET_COLORS.map(c => (
                              <button key={c} onClick={() => setEditCatColor(c)} style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: editCatColor === c ? "2.5px solid var(--color-text-primary)" : "2px solid transparent", cursor: "pointer", padding: 0, outline: "none" }} />
                            ))}
                            <input type="color" value={editCatColor} onChange={e => setEditCatColor(e.target.value)} style={{ width: 28, height: 22, border: "0.5px solid var(--color-border-secondary)", borderRadius: 4, padding: 0, cursor: "pointer", background: "none" }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={s.btn(!editCatLabel.trim())} onClick={saveEditCat} disabled={!editCatLabel.trim()}>저장</button>
                          <button style={s.btnSm()} onClick={() => setEditCatKey(null)}>취소</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ ...s.card, borderLeft: `4px solid ${v.color}`, display: "flex", alignItems: "center", gap: 12, marginBottom: 0 }}>
                        <div style={{ fontSize: 26 }}>{v.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{v.label}</div>
                          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>점검 항목 {v.items.length}개</div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <button style={s.btnSm(v.color)} onClick={() => { setMgmtType(k); setEditCatKey(null); setShowNewCat(false); }}>항목 관리</button>
                          <button style={s.btnSm("#185fa5")} onClick={() => { startEditCat(k); setShowNewCat(false); }}>수정</button>
                          {deleteCatConfirm === k ? (
                            <>
                              <button style={s.btnSm("#a32d2d")} onClick={() => deleteCat(k)}>확인 삭제</button>
                              <button style={s.btnSm()} onClick={() => setDeleteCatConfirm(null)}>취소</button>
                            </>
                          ) : (
                            <button style={s.btnSm("#a32d2d")} onClick={() => setDeleteCatConfirm(k)}>삭제</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {Object.keys(checklists).length === 0 && (
                  <div style={{ ...s.card, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 13, padding: "2rem" }}>
                    등록된 작업 유형이 없습니다. 위에서 새 작업을 추가해 주세요.
                  </div>
                )}
              </div>
            </>
          ) : (
            /* 항목 목록 화면 */
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <button onClick={() => { setMgmtType(null); setEditItemId(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)" }}>← 뒤로</button>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{checklists[mgmtType].icon} {checklists[mgmtType].label}</span>
              </div>
              <div style={s.card}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>새 항목 추가</div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>점검 내용 *</div>
                  <input style={s.input} placeholder="점검 항목 내용을 입력하세요" value={newItemText} onChange={e => setNewItemText(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()} />
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>위험 등급</div>
                    <select style={{ ...s.select, width: "100%" }} value={newItemRisk} onChange={e => setNewItemRisk(e.target.value)}>
                      <option value="high">🔴 위험</option>
                      <option value="medium">🟡 주의</option>
                      <option value="low">🟢 정상</option>
                    </select>
                  </div>
                  <div style={{ paddingTop: 20 }}>
                    <button style={s.btn(!newItemText.trim())} onClick={addItem} disabled={!newItemText.trim()}>추가</button>
                  </div>
                </div>
              </div>
              <div style={s.card}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>항목 목록 <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 400 }}>({checklists[mgmtType].items.length}개)</span></div>
                {checklists[mgmtType].items.length === 0 && <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>등록된 항목이 없습니다.</div>}
                {checklists[mgmtType].items.map((item, idx) => (
                  <div key={item.id} style={{ padding: "10px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                    {editItemId === item.id ? (
                      <div>
                        <input style={{ ...s.input, marginBottom: 8 }} value={editItemText} onChange={e => setEditItemText(e.target.value)} />
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <select style={s.select} value={editItemRisk} onChange={e => setEditItemRisk(e.target.value)}>
                            <option value="high">🔴 위험</option>
                            <option value="medium">🟡 주의</option>
                            <option value="low">🟢 정상</option>
                          </select>
                          <button style={s.btn(!editItemText.trim())} onClick={saveEditItem} disabled={!editItemText.trim()}>저장</button>
                          <button style={s.btnSm()} onClick={() => setEditItemId(null)}>취소</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", paddingTop: 2, minWidth: 20 }}>{idx + 1}.</span>
                        <div style={{ flex: 1, fontSize: 14 }}>{item.text}</div>
                        <span style={{ ...s.badge(item.risk), marginRight: 6 }}>{RISK_LABELS[item.risk]}</span>
                        <button style={s.btnSm("#185fa5")} onClick={() => startEditItem(item)}>수정</button>
                        <button style={s.btnSm("#a32d2d")} onClick={() => deleteItem(mgmtType, item.id)}>삭제</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
