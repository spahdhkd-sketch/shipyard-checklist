import React, { useState } from "react";
import { 
  Flame, 
  Construction, 
  Ship, 
  Wrench, 
  ClipboardCheck, 
  History as HistoryIcon, 
  Ship as ShipIcon, 
  Settings as SettingsIcon,
  LayoutDashboard,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface ChecklistItem {
  id: string;
  text: string;
  risk: 'high' | 'medium' | 'low';
}

interface ChecklistCategory {
  label: string;
  icon: React.ReactNode;
  color: string;
  items: ChecklistItem[];
}

interface ShipData {
  id: number;
  no: string;
  name: string;
}

interface HistoryEntry {
  id: number;
  type: string;
  date: string;
  time: string;
  worker: string;
  shipNo: string;
  status: string;
  warnings: number;
}

const INIT_CHECKLISTS: Record<string, ChecklistCategory> = {
  welding: {
    label: "용접/절단 작업", icon: <Flame className="w-5 h-5" />, color: "#e24b4a",
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
    label: "고소 작업 (비계/크레인)", icon: <Construction className="w-5 h-5" />, color: "#ef9f27",
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
    label: "탑재 작업", icon: <Ship className="w-5 h-5" />, color: "#378add",
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
    label: "밀폐 공간 작업", icon: <Wrench className="w-5 h-5" />, color: "#1d9e75",
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
const RISK_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
};

const PRESET_COLORS = ["#e24b4a", "#ef9f27", "#378add", "#1d9e75", "#7c5cbf", "#d97ab0", "#5b8c5a", "#e07b39", "#0077a8", "#c0392b"];

const TABS = [
  { id: 0, label: "대시보드", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 1, label: "체크리스트 작성", icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: 2, label: "점검 이력", icon: <HistoryIcon className="w-4 h-4" /> },
  { id: 3, label: "호선 관리", icon: <ShipIcon className="w-4 h-4" /> },
  { id: 4, label: "항목 관리", icon: <SettingsIcon className="w-4 h-4" /> },
];

const initShips: ShipData[] = [];

const sampleHistory: HistoryEntry[] = [];

export default function App() {
  const [tab, setTab] = useState(0);
  const [checklists, setChecklists] = useState<Record<string, ChecklistCategory>>(INIT_CHECKLISTS);

  // Ships management
  const [ships, setShips] = useState<ShipData[]>(initShips);
  const [newShipNo, setNewShipNo] = useState("");
  const [newShipName, setNewShipName] = useState("");
  const [editShipId, setEditShipId] = useState<number | null>(null);
  const [editShipNo, setEditShipNo] = useState("");
  const [editShipName, setEditShipName] = useState("");

  // Management – category selection and items CRUD
  const [mgmtType, setMgmtType] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState("");
  const [newItemRisk, setNewItemRisk] = useState<'high' | 'medium' | 'low'>("medium");
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemText, setEditItemText] = useState("");
  const [editItemRisk, setEditItemRisk] = useState<'high' | 'medium' | 'low'>("medium");

  // Category editing
  const [editCatKey, setEditCatKey] = useState<string | null>(null);
  const [editCatLabel, setEditCatLabel] = useState("");
  const [editCatColor, setEditCatColor] = useState("#378add");

  // New category form
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatColor, setNewCatColor] = useState("#378add");
  const [deleteCatConfirm, setDeleteCatConfirm] = useState<string | null>(null);

  // Checklist creation
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [worker, setWorker] = useState("");
  const [shipNo, setShipNo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(sampleHistory);
  const [filterType, setFilterType] = useState("all");

  const cl = selectedType ? checklists[selectedType] : null;
  const currentItems = cl ? cl.items : [];
  const checkedCount = currentItems.filter(i => checks[i.id]).length;
  const uncheckedHigh = currentItems.filter(i => !checks[i.id] && i.risk === "high");
  const progress = currentItems.length ? Math.round((checkedCount / currentItems.length) * 100) : 0;

  const totalToday = history.filter(h => h.date === "2026-05-07").length;
  const totalDone = history.filter(h => h.status === "완료").length;
  const totalWarn = history.filter(h => h.warnings > 0).length;

  // Submit checklist
  function handleSubmit() {
    if (!selectedType || !worker.trim() || !shipNo) return;
    const newEntry: HistoryEntry = { 
      id: Date.now(), 
      type: selectedType, 
      date: "2026-05-07", 
      time: new Date().toTimeString().slice(0, 5), 
      worker, 
      shipNo, 
      status: checkedCount === currentItems.length ? "완료" : "미완료", 
      warnings: uncheckedHigh.length 
    };
    setHistory([newEntry, ...history]);
    setSubmitted(true);
  }
  
  function resetForm() { 
    setSelectedType(null); 
    setChecks({}); 
    setWorker(""); 
    setShipNo(""); 
    setSubmitted(false); 
  }

  // Ship CRUD
  function addShip() { 
    if (!newShipNo.trim()) return; 
    setShips([...ships, { id: Date.now(), no: newShipNo.trim(), name: newShipName.trim() }]); 
    setNewShipNo(""); 
    setNewShipName(""); 
  }
  
  function deleteShip(id: number) { 
    setShips(ships.filter(s => s.id !== id)); 
  }
  
  function startEditShip(s: ShipData) { 
    setEditShipId(s.id); 
    setEditShipNo(s.no); 
    setEditShipName(s.name); 
  }
  
  function saveEditShip() { 
    setShips(ships.map(s => s.id === editShipId ? { ...s, no: editShipNo.trim(), name: editShipName.trim() } : s)); 
    setEditShipId(null); 
  }

  // Item CRUD
  function addItem() {
    if (!newItemText.trim() || !mgmtType) return;
    const ni: ChecklistItem = { id: `${mgmtType}_${Date.now()}`, text: newItemText.trim(), risk: newItemRisk };
    setChecklists(prev => ({ 
      ...prev, 
      [mgmtType]: { ...prev[mgmtType], items: [...prev[mgmtType].items, ni] } 
    }));
    setNewItemText(""); 
    setNewItemRisk("medium");
  }
  
  function deleteItem(typeKey: string, itemId: string) { 
    setChecklists(prev => ({ 
      ...prev, 
      [typeKey]: { ...prev[typeKey], items: prev[typeKey].items.filter(i => i.id !== itemId) } 
    })); 
  }
  
  function startEditItem(item: ChecklistItem) { 
    setEditItemId(item.id); 
    setEditItemText(item.text); 
    setEditItemRisk(item.risk); 
  }
  
  function saveEditItem() {
    if (!mgmtType || !editItemId) return;
    setChecklists(prev => ({ 
      ...prev, 
      [mgmtType]: { ...prev[mgmtType], items: prev[mgmtType].items.map(i => i.id === editItemId ? { ...i, text: editItemText.trim(), risk: editItemRisk } : i) } 
    }));
    setEditItemId(null);
  }

  // Category CRUD
  function startEditCat(k: string) {
    setEditCatKey(k); 
    setEditCatLabel(checklists[k].label);
    setEditCatColor(checklists[k].color);
    setShowNewCat(false);
  }
  
  function saveEditCat() {
    if (!editCatKey || !editCatLabel.trim()) return;
    setChecklists(prev => ({ 
      ...prev, 
      [editCatKey]: { ...prev[editCatKey], label: editCatLabel.trim(), color: editCatColor } 
    }));
    setEditCatKey(null);
  }
  
  function addCat() {
    if (!newCatLabel.trim()) return;
    const key = "cat_" + Date.now();
    setChecklists(prev => ({ 
      ...prev, 
      [key]: { 
        label: newCatLabel.trim(), 
        icon: <ClipboardCheck className="w-5 h-5" />, 
        color: newCatColor, 
        items: [] 
      } 
    }));
    setNewCatLabel(""); 
    setNewCatColor("#378add"); 
    setShowNewCat(false);
  }
  
  function deleteCat(k: string) {
    const next = { ...checklists };
    delete next[k];
    setChecklists(next);
    setDeleteCatConfirm(null);
    if (mgmtType === k) setMgmtType(null);
  }

  const filteredHistory = filterType === "all" ? history : history.filter(h => h.type === filterType);

  return (
    <div className="flex flex-col md:flex-row w-full h-[100dvh] bg-slate-50 text-slate-900 overflow-hidden font-sans md:border-8 md:border-indigo-900 shadow-2xl">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-indigo-950 text-white z-30 shadow-lg">
        <div className="flex items-center gap-2">
          <Ship className="w-5 h-5 text-indigo-200" />
          <h1 className="text-lg font-black tracking-tight">안전 관리</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-indigo-300 font-bold opacity-70 uppercase tracking-widest">{TABS[tab].label}</div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black italic">SA</div>
        </div>
      </header>

      {/* Desktop Sidebar Navigation (Hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-indigo-950 text-white flex-col p-6 space-y-8 shrink-0 shadow-2xl relative z-20">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Ship className="w-6 h-6 text-indigo-200" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">⚓ 안전 관리</h1>
          </div>
          <p className="text-[10px] text-indigo-300 opacity-80 uppercase tracking-[0.2em] font-black pl-1">Shipyard Systems</p>
        </div>
        
        <nav className="flex-1 space-y-1.5 no-scrollbar overflow-y-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                if (t.id === 1) resetForm();
                if (t.id === 4) { setMgmtType(null); setEditCatKey(null); setShowNewCat(false); }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all duration-200 group relative",
                tab === t.id 
                  ? "bg-white text-indigo-900 shadow-lg shadow-indigo-950/50" 
                  : "text-indigo-200 hover:bg-white/5 opacity-70 hover:opacity-100"
              )}
            >
              <span className={cn(
                "transition-transform duration-200",
                tab === t.id ? "scale-110" : "group-hover:scale-110"
              )}>
                {t.icon}
              </span>
              {t.label}
              {tab === t.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-900 rounded-l-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-indigo-900/40 rounded-2xl border border-indigo-400/10 backdrop-blur-sm">
          <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1 px-1">현재 접속자</div>
          <div className="font-bold text-sm text-white px-1">C820062@bp.hd.com</div>
          <div className="text-[9px] text-indigo-400/80 mt-2 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
            <Clock className="w-2.5 h-2.5" /> 06:43:20 KST
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-hidden">
        <header className="px-6 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-end bg-white/40 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 transition-all gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{TABS[tab].label}</h2>
            <p className="text-slate-500 text-[10px] md:text-xs font-semibold mt-1">
              2026년 05월 07일 · 울산 조선소 현원
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] md:text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all active:scale-95">보고서 출력</button>
            <button 
              onClick={() => setTab(1)}
              className={cn(
                "flex-1 sm:flex-none px-4 py-2 bg-indigo-900 rounded-xl text-[10px] md:text-xs font-bold text-white hover:bg-indigo-800 shadow-md shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2",
                tab === 1 && "hidden"
              )}
            >
              <Plus className="w-3.5 h-3.5" /> 새 점검
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-0 md:p-8 min-h-0">
          <div className="p-4 md:p-0 pb-36 md:pb-8">
            <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="h-full"
            >
          {/* Dashboard */}
          {tab === 0 && (
            <div className="flex flex-col gap-6 h-full">
              {/* Metric Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "오늘 총 점검 건수", val: totalToday, color: "text-indigo-900", icon: <Clock className="w-4 h-4" />, secondary: "▲ 20%", secondaryColor: "text-emerald-600 bg-emerald-50" },
                  { label: "실시간 완료율", val: `${Math.round((totalDone / (history.length || 1)) * 100)}%`, color: "text-emerald-700", icon: <CheckCircle2 className="w-4 h-4" />, secondary: `${totalDone}/${history.length} 완료`, secondaryColor: "text-slate-400 bg-slate-50" },
                  { label: "위험 경고 알림", val: totalWarn.toString().padStart(2, '0'), color: "text-rose-700", icon: <AlertTriangle className="w-4 h-4" />, secondary: totalWarn > 0 ? "긴급 확인" : "정상", secondaryColor: totalWarn > 0 ? "text-rose-600 bg-rose-50" : "text-emerald-600 bg-emerald-50" },
                ].map((m, i) => (
                  <div key={i} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{m.label}</span>
                      <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-600 transition-colors">{m.icon}</div>
                    </div>
                    <div className="flex items-baseline gap-3 mt-6">
                      <div className={cn("text-3xl md:text-4xl font-black tabular-nums", m.color)}>{m.val}</div>
                      <div className={cn("text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest", m.secondaryColor)}>
                        {m.secondary}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
                {/* Middle Row */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-indigo-900" />
                      안전 이행도 지표
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                    {(Object.entries(checklists) as [string, ChecklistCategory][]).map(([k, v]) => {
                      const cnt = history.filter(h => h.type === k).length;
                      const done = history.filter(h => h.type === k && h.status === "완료").length;
                      const pct = cnt ? Math.round((done / cnt) * 100) : 0;
                      return (
                        <div key={k} className="space-y-4 group cursor-default">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="flex items-center gap-2 text-slate-700">
                              <span style={{ color: v.color }}>{v.icon}</span>
                              <span>{v.label}</span>
                            </span>
                            <span className="text-slate-400 tabular-nums">{done} / {cnt} UNITS</span>
                          </div>
                          <div className="h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full rounded-full shadow-sm transition-all" 
                              style={{ backgroundColor: v.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Alert/High Risk */}
                <div className="lg:col-span-4 bg-rose-950 rounded-3xl p-8 shadow-xl shadow-rose-950/20 flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 duration-700">
                    <AlertTriangle className="w-24 h-24 text-white" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.22em] flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        CRITICAL ALERTS
                      </h3>
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                    </div>
                    <div className="space-y-4 flex-1">
                      {history.filter(h => h.warnings > 0).slice(0, 2).map((h, i) => (
                        <div key={i} className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[9px] font-black bg-rose-600 text-white px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">Danger</span>
                            <span className="text-[9px] text-rose-300 font-bold uppercase tabular-nums">#{h.shipNo}</span>
                          </div>
                          <p className="text-[11px] text-white leading-relaxed font-bold opacity-90">
                            {checklists[h.type]?.label || "Field"} 점검 중 {h.warnings}건의 고위험 위반이 감지되었습니다.
                          </p>
                        </div>
                      ))}
                      {history.filter(h => h.warnings > 0).length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-rose-200 opacity-40 space-y-4 py-8">
                          <CheckCircle2 className="w-10 h-10" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Node</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setTab(2)} className="mt-8 w-full py-4 bg-white text-rose-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all shadow-xl active:scale-95">이력 로그 분석</button>
                  </div>
                </div>

                {/* Bottom Activity */}
                <div className="lg:col-span-12 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                      <HistoryIcon className="w-4 h-4 text-indigo-900" />
                      최근 활동 피드
                    </h3>
                    <button onClick={() => setTab(2)} className="hidden sm:flex text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline items-center gap-1.5">View Archive <ArrowRight className="w-3 h-3" /></button>
                  </div>
                  <div className="overflow-x-auto no-scrollbar -mx-6 md:mx-0">
                    <table className="w-full text-left min-w-[600px]">
                      <thead>
                        <tr className="text-[9px] text-slate-400 border-b border-slate-50 uppercase tracking-[0.2em]">
                          <th className="px-6 pb-5 font-black">MODULE</th>
                          <th className="px-6 pb-5 font-black">ENGINEER</th>
                          <th className="px-6 pb-5 font-black">VESSEL</th>
                          <th className="px-6 pb-5 font-black">TIMESTAMP</th>
                          <th className="px-6 pb-5 font-black text-center">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {history.slice(0, 5).map((h) => {
                          const c = checklists[h.type] || { icon: null, label: "(NA)", color: "#94a3b8" };
                          return (
                            <tr key={h.id} className="group hover:bg-slate-50 transition-all font-bold">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform" style={{ backgroundColor: `${c.color}15`, color: c.color }}>
                                    {c.icon}
                                  </div>
                                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{c.label}</span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-slate-600 text-[11px]">{h.worker}</td>
                              <td className="px-6 py-5 text-[10px] font-black text-indigo-600 tabular-nums uppercase">{h.shipNo}</td>
                              <td className="px-6 py-5 text-[10px] text-slate-400 font-bold tabular-nums">{h.time}</td>
                              <td className="px-6 py-5 text-center">
                                <span className={cn(
                                  "px-3 py-1.5 rounded-full font-black text-[8px] uppercase tracking-widest shadow-sm",
                                  h.status === "완료" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                )}>
                                  {h.status === "완료" ? "Verified" : "Pending"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Checklist Application */}
          {tab === 1 && (
            <div className="max-w-4xl mx-auto space-y-8">
              {submitted ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center"
                >
                  <div className="inline-flex p-6 bg-emerald-50 rounded-full mb-8 shadow-inner">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">현장 점검 제출 완료</h2>
                  <p className="text-sm text-slate-500 mb-10 max-w-sm mx-auto font-medium">
                    {worker} 엔지니어님, {shipNo} 호선 {cl?.label} 점검 데이터가 서버에 안전하게 기록되었습니다.
                  </p>
                  
                  {uncheckedHigh.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl mb-10 flex items-start gap-4 text-left max-w-lg mx-auto shadow-sm">
                      <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                      <div>
                        <p className="text-sm font-black text-rose-700 uppercase tracking-tight">위험 요소 감지됨 ({uncheckedHigh.length}건)</p>
                        <p className="text-xs text-rose-600/80 mt-1 font-bold leading-relaxed">
                          미체크된 고위험 항목은 안전 사고의 원인이 될 수 있습니다. 현장 조치 후 재점검 바랍니다.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={resetForm}
                    className="bg-indigo-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all active:scale-95"
                  >
                    새 체크리스트 작성하기
                  </button>
                </motion.div>
              ) : !selectedType ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">작업 유형 선택</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {(Object.entries(checklists) as [string, ChecklistCategory][]).map(([k, v]) => (
                      <button
                        key={k}
                        onClick={() => setSelectedType(k)}
                        className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-xl transition-all text-left overflow-hidden flex flex-col items-center text-center"
                      >
                        <div className="relative z-10 w-full flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-inner group-hover:shadow-indigo-100/50" style={{ backgroundColor: `${v.color}15`, color: v.color }}>
                            {v.icon}
                          </div>
                          <div className="font-black text-slate-900 text-lg tracking-tight mb-2 uppercase">{v.label}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{v.items.length} Modules</div>
                        </div>
                        <div className="mt-6 flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                          Select Action <ArrowRight className="w-3 h-3" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8 pb-20">
                  <button 
                    onClick={() => setSelectedType(null)}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back to Selection
                  </button>

                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                      <div className="p-3 rounded-2xl shadow-inner" style={{ backgroundColor: `${cl?.color}15`, color: cl?.color }}>
                        {cl?.icon}
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-slate-900 tracking-tight">{cl?.label} 정밀 점검</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Safety Inspection Protocol v.2026</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">담당 엔지니어</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                          <input 
                            placeholder="성명 또는 사번 입력"
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold transition-all outline-none"
                            value={worker}
                            onChange={e => setWorker(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">대상 호선 선택</label>
                        <div className="relative group">
                          <ShipIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                          <select 
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
                            value={shipNo}
                            onChange={e => setShipNo(e.target.value)}
                          >
                            <option value="">호선 선택 (Ship No.)</option>
                            {ships.map(s => <option key={s.id} value={s.no}>{s.no} {s.name ? ` · ${s.name}` : ""}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between px-2">
                      <div>
                        <div className="text-4xl font-black text-slate-900 tabular-nums">{progress}%</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Inspection Progress</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-700 tabular-nums">{checkedCount} / {currentItems.length}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Confirmed Units</div>
                      </div>
                    </div>
                    <div className="h-4 bg-white border border-slate-200 rounded-full p-1 overflow-hidden shadow-inner flex">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full rounded-full shadow-lg"
                        style={{ backgroundColor: cl?.color }}
                      />
                    </div>
                  </div>

                  {uncheckedHigh.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl flex items-center gap-4 animate-pulse-slow shadow-sm">
                      <div className="bg-rose-500 p-2 rounded-xl text-white shadow-lg">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="text-[11px] font-black text-rose-700 uppercase tracking-tight leading-4">
                        경고: 위험(Risk: High) 등급 항목 {uncheckedHigh.length}건이 아직 완료되지 않았습니다.<br/>
                        현장 확인 후 반드시 체크를 완료해야 제출이 가능합니다.
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-50">
                    {currentItems.length === 0 ? (
                      <div className="p-20 text-center text-slate-300 font-bold italic text-sm">등록된 점검 항목이 없습니다.</div>
                    ) : (
                      currentItems.map((item) => (
                        <label 
                          key={item.id} 
                          className={cn(
                            "flex items-start gap-6 p-6 transition-all cursor-pointer hover:bg-slate-50/80 group",
                            checks[item.id] && "bg-slate-50/30"
                          )}
                        >
                          <div className="relative mt-0.5">
                            <input 
                              type="checkbox" 
                              className="peer absolute opacity-0 w-6 h-6 cursor-pointer z-10"
                              checked={!!checks[item.id]}
                              onChange={e => setChecks({ ...checks, [item.id]: e.target.checked })}
                            />
                            <div className={cn(
                              "w-6 h-6 rounded-lg border-2 border-slate-200 transition-all flex items-center justify-center bg-white shadow-sm peer-checked:bg-indigo-600 peer-checked:border-indigo-600",
                              cl?.color && "peer-checked:bg-" // Dynamics handled by style below
                            )} style={{ backgroundColor: checks[item.id] ? cl?.color : 'white', borderColor: checks[item.id] ? cl?.color : '#e2e8f0' }}>
                              <CheckCircle2 className={cn("w-4 h-4 text-white opacity-0 transition-opacity", checks[item.id] && "opacity-100")} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm font-bold transition-all leading-relaxed", 
                              checks[item.id] ? "text-slate-400 line-through" : "text-slate-900"
                            )}>
                              {item.text}
                            </p>
                          </div>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm shrink-0",
                            RISK_COLORS[item.risk].bg,
                            RISK_COLORS[item.risk].text,
                            RISK_COLORS[item.risk].border
                          )}>
                            {item.risk}
                          </span>
                        </label>
                      ))
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={resetForm}
                      className="flex-1 bg-white border-2 border-slate-200 text-slate-500 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                    >
                      초기화
                    </button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={!worker.trim() || !shipNo || !selectedType}
                      className="flex-[2] bg-indigo-950 disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-900/20 transition-all hover:bg-indigo-900 active:scale-95"
                    >
                      전체 항목 검증 및 제출 (Final)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {tab === 2 && (
            <div className="space-y-6">
              <div className="flex gap-3 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
                {[["all", "전체"], ...(Object.entries(checklists) as [string, ChecklistCategory][]).map(([k, v]) => [k, `${v.label}`])].map(([k, label]) => (
                  <button 
                    key={k} 
                    onClick={() => setFilterType(k)}
                    className={cn(
                      "px-6 py-2.5 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all border uppercase tracking-widest",
                      filterType === k 
                        ? "bg-indigo-950 text-white border-indigo-950 shadow-xl shadow-indigo-900/20" 
                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-400 hover:text-slate-600"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden transition-all">
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">작업 모듈</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">현장 담당 엔지니어 / 대상 호선</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">데이터 기록 시스템</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">처리 상태</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap text-right">경위 / 위험도</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredHistory.length === 0 ? (
                        <tr><td colSpan={5} className="px-8 py-32 text-center text-slate-300 font-bold italic text-sm">해당 필터에 일치하는 점검 로그가 존재하지 않습니다.</td></tr>
                      ) : (
                        filteredHistory.map(h => {
                          const c = checklists[h.type] || { icon: null, label: "(삭제됨)", color: "#aaa" };
                          return (
                            <tr key={h.id} className="hover:bg-slate-50/50 transition-all group font-bold">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform" style={{ backgroundColor: `${c.color}15`, color: c.color }}>
                                    {c.icon}
                                  </div>
                                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{c.label}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="text-sm text-slate-700">{h.worker}</div>
                                <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block mt-2 uppercase tracking-widest">{h.shipNo}</div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap tabular-nums">
                                <div className="text-xs text-slate-600">{h.date}</div>
                                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-2.5 h-2.5"/> {h.time}</div>
                              </td>
                              <td className="px-8 py-6">
                                <span className={cn(
                                  "px-3 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-sm",
                                  h.status === "완료" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                )}>
                                  {h.status === "완료" ? "Verified" : "Pending"}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                {h.warnings > 0 ? (
                                  <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-[9px] font-black border border-rose-100 uppercase tracking-widest shadow-sm">
                                    Warn: {h.warnings}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Secured</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards */}
                <div className="md:hidden divide-y divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <div className="px-8 py-32 text-center text-slate-300 font-bold italic text-sm">해당 필터에 일치하는 점검 로그가 존재하지 않습니다.</div>
                  ) : (
                    filteredHistory.map(h => {
                      const c = checklists[h.type] || { icon: null, label: "(삭제됨)", color: "#aaa" };
                      return (
                        <div key={h.id} className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner" style={{ backgroundColor: `${c.color}15`, color: c.color }}>
                                {c.icon}
                              </div>
                              <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{c.label}</span>
                            </div>
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[8px] font-black border uppercase tracking-widest shadow-sm",
                              h.status === "완료" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                            )}>
                              {h.status === "완료" ? "Verified" : "Pending"}
                            </span>
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <div>
                              <div className="text-sm font-bold text-slate-700">{h.worker}</div>
                              <div className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-1 uppercase tracking-widest tabular-nums">#{h.shipNo}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-slate-400 font-bold tabular-nums">{h.date} {h.time}</div>
                              {h.warnings > 0 ? (
                                <div className="mt-1 text-[8px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1 justify-end">
                                  <AlertTriangle className="w-2.5 h-2.5" /> High Risk Detected
                                </div>
                              ) : (
                                <div className="mt-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest">Safe Status</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ships Management */}
          {tab === 3 && (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">새 호선 등록 (Asset Registration)</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">호선 번호 (Hull No.)</label>
                    <input 
                      placeholder="예: H3462"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-3 text-sm font-bold transition-all outline-none"
                      value={newShipNo}
                      onChange={e => setNewShipNo(e.target.value)}
                    />
                  </div>
                  <div className="flex-[1.5] space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">선박 명칭 (Ship Name)</label>
                    <input 
                      placeholder="예: LNG-C carrier A"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-3 text-sm font-bold transition-all outline-none"
                      value={newShipName}
                      onChange={e => setNewShipName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={addShip}
                      disabled={!newShipNo.trim()}
                      className="h-[52px] w-full sm:w-auto bg-indigo-950 disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-900/10 hover:bg-indigo-900 transition-all active:scale-95"
                    >
                      기록 생성
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ships.length === 0 ? (
                  <div className="col-span-full py-32 text-center text-slate-300 font-bold italic text-sm">등록된 호선 정보가 데이터베이스에 존재하지 않습니다.</div>
                ) : (
                  ships.map(ship => (
                    <div key={ship.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      {editShipId === ship.id ? (
                        <div className="flex flex-col gap-4 w-full">
                          <div className="flex gap-3">
                            <input className="flex-1 bg-slate-50 border-2 border-indigo-600 rounded-xl px-4 py-2 text-sm font-bold outline-none" value={editShipNo} onChange={e => setEditShipNo(e.target.value)} />
                            <input className="flex-[2] bg-slate-50 border-2 border-indigo-600 rounded-xl px-4 py-2 text-sm font-bold outline-none" value={editShipName} onChange={e => setEditShipName(e.target.value)} />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button className="bg-indigo-950 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={saveEditShip}>저장</button>
                            <button className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-2" onClick={() => setEditShipId(null)}>취소</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-slate-50 rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:bg-indigo-50 transition-colors">
                              <ShipIcon className="w-7 h-7 text-indigo-900 transition-transform group-hover:scale-110 duration-500" />
                            </div>
                            <div>
                              <div className="text-xl font-black text-slate-900 tracking-tight uppercase">{ship.no}</div>
                              {ship.name && <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{ship.name}</div>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <button onClick={() => startEditShip(ship)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteShip(ship.id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Items & Category Management */}
          {tab === 4 && (
            <div className="max-w-5xl mx-auto space-y-10">
              {!mgmtType ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Protocol Configuration</h3>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Active Nodes: {Object.keys(checklists).length}</p>
                    </div>
                    <button 
                      onClick={() => { setShowNewCat(!showNewCat); setEditCatKey(null); }}
                      className="bg-indigo-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-900/20 flex items-center gap-2 hover:bg-indigo-900 transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> 신규 유형 생성
                    </button>
                  </div>

                  <AnimatePresence>
                    {showNewCat && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0, y: -20 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white border-2 border-indigo-600/30 p-8 rounded-[2rem] overflow-hidden mb-10 shadow-2xl shadow-indigo-950/5"
                      >
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 pl-1">New Category Definition</h4>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">카테고리 식별자명</label>
                              <input 
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-3 text-sm font-bold transition-all outline-none"
                                placeholder="예: 전기 안전 점검"
                                value={newCatLabel}
                                onChange={e => setNewCatLabel(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">시각화 테마 색상</label>
                              <div className="grid grid-cols-5 gap-3 bg-slate-50 p-3 rounded-2xl min-h-[50px]">
                                {PRESET_COLORS.map(c => (
                                  <button 
                                    key={c}
                                    onClick={() => setNewCatColor(c)}
                                    className={cn(
                                      "w-full h-6 rounded-lg transition-all border-2 shadow-sm",
                                      newCatColor === c ? "border-indigo-600 scale-110 shadow-md shadow-indigo-100" : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button onClick={addCat} disabled={!newCatLabel.trim()} className="flex-1 bg-indigo-950 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-900/10 disabled:bg-slate-100 disabled:text-slate-300">카테고리 아키텍처 배포</button>
                            <button onClick={() => setShowNewCat(false)} className="px-10 bg-slate-50 text-slate-400 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100">취소</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.entries(checklists) as [string, ChecklistCategory][]).map(([k, v]) => (
                      <div key={k} className="relative group">
                        {editCatKey === k ? (
                          <div className="bg-white border-2 border-indigo-600 p-6 md:p-8 rounded-3xl shadow-2xl">
                            <div className="grid grid-cols-1 gap-6 mb-8">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">분류명 명칭 변경</label>
                                <input className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all" value={editCatLabel} onChange={e => setEditCatLabel(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">테마 색상 보정</label>
                                <div className="grid grid-cols-5 md:grid-cols-5 gap-2.5 p-3 bg-slate-50 rounded-2xl">
                                  {PRESET_COLORS.map(c => (
                                    <button key={c} onClick={() => setEditCatColor(c)} className={cn("w-full h-5 rounded-lg border-2 shadow-sm transition-all", editCatColor === c ? "border-indigo-600 scale-110 shadow-md shadow-indigo-100" : "border-transparent opacity-60")} style={{ backgroundColor: c }} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button onClick={saveEditCat} className="flex-1 bg-indigo-950 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-950/20">업데이트 반영</button>
                              <button onClick={() => setEditCatKey(null)} className="px-6 bg-slate-50 text-slate-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">중단</button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between hover:border-indigo-400 hover:shadow-xl transition-all group overflow-hidden gap-4">
                            <div className="flex items-center gap-5 w-full sm:w-auto">
                              <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 shadow-inner shrink-0" style={{ backgroundColor: `${v.color}15`, color: v.color }}>
                                {v.icon}
                              </div>
                              <div>
                                <div className="text-lg font-black text-slate-900 uppercase tracking-tight">{v.label}</div>
                                <div className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest tabular-nums">{v.items.length} Modules Registered</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                              <button onClick={() => setMgmtType(k)} className="flex-1 sm:flex-none px-4 py-2 bg-indigo-50 rounded-xl text-[10px] font-black uppercase tracking-tighter text-indigo-700 hover:bg-indigo-100 transition-all">항목 관리</button>
                              <button onClick={() => startEditCat(k)} className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm"><Edit2 className="w-3.5 h-3.5"/></button>
                              {deleteCatConfirm === k ? (
                                <button onClick={() => deleteCat(k)} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-rose-200">Confirm</button>
                              ) : (
                                <button onClick={() => setDeleteCatConfirm(k)} className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm"><Trash2 className="w-3.5 h-3.5"/></button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <button onClick={() => setMgmtType(null)} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest">
                    <ChevronLeft className="w-4 h-4" /> Back to Categories
                  </button>

                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-10 group">
                    <div className="flex items-center justify-between pb-8 border-b border-slate-50">
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${checklists[mgmtType].color}15`, color: checklists[mgmtType].color }}>
                          {checklists[mgmtType].icon}
                        </div>
                        <div>
                          <h4 className="font-black text-2xl text-slate-900 tracking-tight uppercase leading-none">{checklists[mgmtType].label}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">Logic Node Editor</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-slate-900 tabular-nums">{checklists[mgmtType].items.length}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active rules</div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">신규 프로토콜 항목 정의 (New Rule)</label>
                        <textarea 
                          placeholder="작업 중 반드시 검증해야 할 정밀 안전 수칙을 명확하게 입력하세요..."
                          className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-3xl p-6 text-sm font-bold h-32 transition-all outline-none resize-none shadow-inner"
                          value={newItemText}
                          onChange={e => setNewItemText(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">위험 계수 (Risk Factor)</label>
                          <select 
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-3.5 px-6 text-sm font-black appearance-none cursor-pointer outline-none transition-all uppercase tracking-tighter"
                            value={newItemRisk}
                            onChange={e => setNewItemRisk(e.target.value as any)}
                          >
                            <option value="high">Critical Risk [High]</option>
                            <option value="medium">Medium Concern [Mid]</option>
                            <option value="low">Standard Check [Low]</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button 
                            onClick={addItem}
                            disabled={!newItemText.trim()}
                            className="w-full md:w-auto bg-indigo-950 disabled:bg-slate-100 disabled:text-slate-300 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-indigo-900 shadow-xl shadow-indigo-950/10 active:scale-95"
                          >
                            프로토콜 등록
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Registered Protocols Timeline</h5>
                      <span className="text-[10px] font-black text-slate-400 tabular-nums uppercase">ID Sequential</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {checklists[mgmtType].items.map((item, idx) => (
                        <div key={item.id} className="p-8 flex items-start gap-8 hover:bg-slate-50 transition-all group relative">
                          <div className="text-[10px] font-black text-slate-200 w-6 pt-1 tabular-nums transition-colors group-hover:text-indigo-300">{(idx + 1).toString().padStart(2, '0')}</div>
                          <div className="flex-1">
                            {editItemId === item.id ? (
                              <div className="space-y-4">
                                <textarea className="w-full bg-white border-2 border-indigo-600 rounded-2xl p-4 text-sm font-bold shadow-xl outline-none" value={editItemText} onChange={e => setEditItemText(e.target.value)} />
                                <div className="flex gap-3">
                                  <select className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-tight" value={editItemRisk} onChange={e => setEditItemRisk(e.target.value as any)}>
                                    <option value="high">Critical</option>
                                    <option value="medium">Caution</option>
                                    <option value="low">Standard</option>
                                  </select>
                                  <button onClick={saveEditItem} className="bg-indigo-950 text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">Update</button>
                                  <button onClick={() => setEditItemId(null)} className="text-slate-400 text-[10px] font-black uppercase tracking-widest transition-colors px-4">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="text-sm font-bold text-slate-900 leading-[1.6] group-hover:text-indigo-950 transition-colors">{item.text}</div>
                                <div className="mt-3 flex items-center gap-3">
                                  <span className={cn(
                                    "px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest shadow-sm", 
                                    RISK_COLORS[item.risk].bg, 
                                    RISK_COLORS[item.risk].text, 
                                    RISK_COLORS[item.risk].border
                                  )}>
                                    Level: {item.risk}
                                  </span>
                                  {item.risk === 'high' && (
                                    <span className="flex items-center gap-1 text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse leading-none">
                                      <AlertTriangle className="w-3 h-3" /> Mandatory Check
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                          {!editItemId && (
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                              <button onClick={() => startEditItem(item)} className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm bg-slate-50/50 group-hover:shadow-indigo-100/30 border border-slate-100">
                                <Edit2 className="w-3.5 h-3.5"/>
                              </button>
                              <button onClick={() => deleteItem(mgmtType, item.id)} className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm bg-slate-50/50 group-hover:shadow-rose-100/30 border border-slate-100">
                                <Trash2 className="w-3.5 h-3.5"/>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Decoration */}
      <footer className="mt-20 py-8 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">
          <div className="w-8 h-[1px] bg-slate-200" />
          AnchorSafe Industrial Systems 2026
          <div className="w-8 h-[1px] bg-slate-200" />
        </div>
      </footer>
          </div>
        </div>

        {/* Mobile Bottom Navigation (Visible on mobile only) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center z-40 backdrop-blur-xl bg-white/90">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id === 1) resetForm();
              if (t.id === 4) { setMgmtType(null); setEditCatKey(null); setShowNewCat(false); }
            }}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              tab === t.id ? "text-indigo-900 scale-110" : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              tab === t.id ? "bg-indigo-50" : ""
            )}>
              {t.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">{t.label}</span>
          </button>
        ))}
      </nav>
    </main>
  </div>
);
}
