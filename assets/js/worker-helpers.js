(function attachWorkerHelpers(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.ShipyardWorkerHelpers = api;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function buildWorkerHelpers() {
  const DEFAULT_WORKER_POSITION = "작업자";
  const LEADER_WORKER_POSITION = "조장";
  const FOREMAN_WORKER_POSITION = "반장";
  const WORKER_POSITIONS = [DEFAULT_WORKER_POSITION, LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION, "대표", "관리", "총무"];
  const WORKER_TEAM_OPTIONS = ["선행", "후행", "관리"];
  const ADMIN_PREENTRY_WORKER_POSITIONS = new Set(["대표", "관리", "총무"]);
  const LEADER_EQUIVALENT_WORKER_POSITIONS = new Set([LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION]);
  const PRIVILEGED_WORKER_POSITIONS = new Set([LEADER_WORKER_POSITION, FOREMAN_WORKER_POSITION, "관리", "총무"]);
  const LOGIN_WORKER_GROUP_ORDER = ["대표", "관리", "선행", "후행", "총무"];
  const LOGIN_WORKER_GROUP_RANK = new Map(LOGIN_WORKER_GROUP_ORDER.map((group, index) => [group, index]));

  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[char]));
  }

  function normalizedWorkerName(workerName) {
    return String(workerName || "").trim();
  }

  function normalizeWorkerPosition(position) {
    const value = String(position || "").trim();
    return WORKER_POSITIONS.includes(value) ? value : DEFAULT_WORKER_POSITION;
  }

  function workerDisplayPosition(worker) {
    const position = normalizeWorkerPosition(worker && worker.position);
    const name = normalizedWorkerName(worker && worker.name);
    if (name === "백승기" && position === LEADER_WORKER_POSITION) return FOREMAN_WORKER_POSITION;
    return position;
  }

  function normalizeWorkerTeam(team) {
    const value = String(team || "").trim();
    return WORKER_TEAM_OPTIONS.includes(value) ? value : "";
  }

  function loginWorkerGroup(worker) {
    const position = normalizeWorkerPosition(worker && worker.position);
    const team = normalizeWorkerTeam(worker && worker.team);
    if (position === "대표") return "대표";
    if (position === "총무") return "총무";
    if (position === "관리" || team === "관리") return "관리";
    if (team === "선행") return "선행";
    if (team === "후행") return "후행";
    return "";
  }

  function loginWorkerGroupRank(worker) {
    const group = loginWorkerGroup(worker);
    return LOGIN_WORKER_GROUP_RANK.has(group) ? LOGIN_WORKER_GROUP_RANK.get(group) : LOGIN_WORKER_GROUP_ORDER.length;
  }

  function sortWorkersForLogin(workers) {
    return [...(Array.isArray(workers) ? workers : [])].sort((a, b) =>
      loginWorkerGroupRank(a) - loginWorkerGroupRank(b)
      || String(a && a.name || "").localeCompare(String(b && b.name || ""), "ko")
      || String(a && a.id || "").localeCompare(String(b && b.id || "")));
  }

  function isLeaderWorker(worker) {
    return LEADER_EQUIVALENT_WORKER_POSITIONS.has(normalizeWorkerPosition(worker && worker.position));
  }

  function canWorkerPreEnterAdminMode(worker) {
    const position = normalizeWorkerPosition(worker && worker.position);
    return ADMIN_PREENTRY_WORKER_POSITIONS.has(position);
  }

  function workerAdminModeLabel(worker) {
    const name = String(worker && worker.name || "").trim();
    return name ? `${name} 권한` : "작업자 권한";
  }

  function workerTeamBadge(team) {
    const value = String(team || "").trim();
    if (!value) return `<span class="worker-team-badge is-empty">소속 미지정</span>`;
    const className = value === "선행" ? "is-pre" : value === "후행" ? "is-post" : "is-neutral";
    return `<span class="worker-team-badge ${className}">${esc(value)}</span>`;
  }

  function workerRoleBadge(worker) {
    const position = normalizeWorkerPosition(worker && worker.position);
    const label = workerDisplayPosition(worker);
    const className = PRIVILEGED_WORKER_POSITIONS.has(position) ? "is-leader" : "";
    return `<span class="worker-position-badge ${className}">${esc(label)}</span>`;
  }

  return {
    DEFAULT_WORKER_POSITION,
    LEADER_WORKER_POSITION,
    FOREMAN_WORKER_POSITION,
    WORKER_POSITIONS,
    WORKER_TEAM_OPTIONS,
    normalizedWorkerName,
    normalizeWorkerPosition,
    workerDisplayPosition,
    normalizeWorkerTeam,
    loginWorkerGroup,
    loginWorkerGroupRank,
    sortWorkersForLogin,
    isLeaderWorker,
    canWorkerPreEnterAdminMode,
    workerAdminModeLabel,
    workerTeamBadge,
    workerRoleBadge,
  };
}));
