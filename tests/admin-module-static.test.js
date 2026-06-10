const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function expectMatch(source, pattern, message) {
  if (!pattern.test(source)) throw new Error(message);
}

const app = read("assets/js/app-v2.js");
const adminModule = read("assets/js/admin-v2.js");
const sw = read("sw.js");

expectMatch(app, /import\("\.\/admin-v2\.js"\)/, "app must load the admin action module");
expectMatch(adminModule, /export function runAdminAction\(api, action, event\)/, "admin module must export runAdminAction");

[
  ["bulk-material-status", "bulkUpdateMaterialStatus"],
  ["edit-pledge-template", "editPledgeTemplate"],
  ["save-pledge-template", "savePledgeTemplate"],
  ["cancel-pledge-template", "cancelPledgeTemplate"],
  ["open-analytics-filters", "openAnalyticsFilters"],
  ["open-analytics-detail", "openAnalyticsDetail"],
  ["add-ship", "addShip"],
  ["save-ship-order", "saveCurrentShipOrder"],
].forEach(([action, handler]) => {
  expectMatch(adminModule, new RegExp(`"${action}":\\s*"${handler}"`), `${action} must dispatch to ${handler}`);
});

expectMatch(adminModule, /typeof handler !== "function"\) return false/, "unknown admin actions should be rejected");
expectMatch(sw, /"\/assets\/dist\/js\/admin-v2\.js"/, "service worker should cache the dynamically imported admin module");
