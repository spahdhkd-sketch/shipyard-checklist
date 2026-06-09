const ACTION_HANDLERS = {
  "bulk-material-status": "bulkUpdateMaterialStatus",
  "edit-pledge-template": "editPledgeTemplate",
  "save-pledge-template": "savePledgeTemplate",
  "cancel-pledge-template": "cancelPledgeTemplate",
  "open-analytics-filters": "openAnalyticsFilters",
  "open-analytics-detail": "openAnalyticsDetail",
  "add-ship": "addShip",
  "save-ship-order": "saveCurrentShipOrder",
};

export function runAdminAction(api, action, event) {
  const handlerName = ACTION_HANDLERS[action];
  const handler = handlerName ? api?.[handlerName] : null;
  if (typeof handler !== "function") return false;
  handler(event);
  return true;
}
