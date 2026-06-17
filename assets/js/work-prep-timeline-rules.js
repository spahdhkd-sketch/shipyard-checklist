(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.WorkPrepTimelineRules = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  // Work-prep timeline (entry v2). Milestones: register / start / complete.
  // Each milestone is a single line; "start" accumulates actor ids, "complete"
  // replaces with the full submitter set. Legacy entries ({status,memo,actor})
  // normalize losslessly (actors=[], actorLabel=actor, kind inferred).

  const MILESTONE = { register: "작업지시서 등록", start: "점검 시작", complete: "점검 완료" };
  const STATUS_TO_KIND = {
    "작업지시서 등록": "register",
    "등록": "register",
    "점검 시작": "start",
    "점검 완료": "complete",
  };
  const MILESTONE_KINDS = new Set(["register", "start", "complete"]);

  function uniqArr(a) {
    return [...new Set((Array.isArray(a) ? a : []).map((x) => String(x || "")).filter(Boolean))];
  }
  function inferKind(status, explicit) {
    return explicit || STATUS_TO_KIND[status] || "status";
  }

  function normalizeEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    const status = String(entry.status || "").trim();
    const changedAt = String(entry.changedAt || "").trim();
    if (!status || !changedAt) return null;
    const actorLabel = String(entry.actorLabel || entry.actor || "").trim() || "관리자";
    const kind = inferKind(status, String(entry.kind || "").trim());
    const id = String(entry.id || "").trim() || `${changedAt}:${status}:${actorLabel}`;
    return {
      id,
      kind,
      status,
      changedAt,
      actors: uniqArr(entry.actors),
      actorLabel,
      memo: String(entry.memo || "").trim(),
      actor: actorLabel,
    };
  }

  function uniqueEntries(entries) {
    const norm = (Array.isArray(entries) ? entries : []).map(normalizeEntry).filter(Boolean);
    const milestones = new Map();
    const others = [];
    const seen = new Set();
    for (const e of norm) {
      if (MILESTONE_KINDS.has(e.kind)) {
        const ex = milestones.get(e.kind);
        if (!ex) {
          milestones.set(e.kind, { ...e, actors: [...e.actors] });
        } else {
          const earlier = e.changedAt < ex.changedAt ? e.changedAt : ex.changedAt;
          milestones.set(e.kind, { ...ex, changedAt: earlier, actors: uniqArr([...ex.actors, ...e.actors]) });
        }
      } else {
        const key = `${e.changedAt} ${e.status} ${e.memo} ${e.actorLabel}`;
        if (seen.has(key)) continue;
        seen.add(key);
        others.push(e);
      }
    }
    return [...milestones.values(), ...others]
      .sort((a, b) => String(a.changedAt).localeCompare(String(b.changedAt)));
  }

  function upsertMilestone(entries, m) {
    const kind = m && m.kind;
    if (!MILESTONE_KINDS.has(kind)) return uniqueEntries(entries);
    const list = (Array.isArray(entries) ? entries : []).map(normalizeEntry).filter(Boolean);
    const idx = list.findIndex((e) => e.kind === kind);
    const incomingActors = uniqArr(m.actorIds);
    if (idx < 0) {
      list.push({
        id: `${m.changedAt}:${kind}`,
        kind,
        status: MILESTONE[kind],
        changedAt: m.changedAt,
        actors: incomingActors,
        actorLabel: m.actorLabel || "",
        memo: m.memo || "",
        actor: m.actorLabel || "",
      });
    } else {
      const ex = list[idx];
      const actors = m.replaceActors ? incomingActors : uniqArr([...ex.actors, ...incomingActors]);
      list[idx] = {
        ...ex,
        actors,
        changedAt: ex.changedAt || m.changedAt,
        actorLabel: ex.actorLabel || m.actorLabel || "",
        memo: m.memo != null && m.memo !== "" ? m.memo : ex.memo,
      };
    }
    return uniqueEntries(list);
  }

  return { MILESTONE, normalizeEntry, uniqueEntries, upsertMilestone };
});
