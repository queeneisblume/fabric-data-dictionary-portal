const DATA_SOURCE_URL = "source_dictionary.json";
const nf = new Intl.NumberFormat("th-TH");
const pct = new Intl.NumberFormat("th-TH", { style: "percent", maximumFractionDigits: 1 });

const state = {
  tables: [],
  columns: [],
  issues: [],
  selectedTableId: "",
};

const dom = {
  tabs: [...document.querySelectorAll(".tab")],
  pages: [...document.querySelectorAll(".page")],
  resetAll: document.querySelector("#resetAll"),
  globalSearch: document.querySelector("#globalSearch"),
  tableDetailSearch: document.querySelector("#tableDetailSearch"),
  tableDetailSuggestions: document.querySelector("#tableDetailSuggestions"),
  tableDetailSearchNote: document.querySelector("#tableDetailSearchNote"),
  selectedTable: document.querySelector("#selectedTable"),
  columnSearch: document.querySelector("#columnSearch"),
  issueSearch: document.querySelector("#issueSearch"),
  filters: {
    domain: document.querySelector("#filterDomain"),
    schema: document.querySelector("#filterSchema"),
    owner: document.querySelector("#filterOwner"),
    status: document.querySelector("#filterStatus"),
    columnTable: document.querySelector("#filterColumnTable"),
    dataType: document.querySelector("#filterDataType"),
    definition: document.querySelector("#filterDefinition"),
    visible: document.querySelector("#filterVisible"),
    issueType: document.querySelector("#filterIssueType"),
    severity: document.querySelector("#filterSeverity"),
    issueOwner: document.querySelector("#filterIssueOwner"),
  },
};

async function loadDictionary() {
  const response = await fetch(DATA_SOURCE_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`Unable to load ${DATA_SOURCE_URL}: HTTP ${response.status}`);
  const rawText = await response.text();
  return JSON.parse(
    rawText
      .replace(/:\s*NaN(?=\s*[,}\]])/g, ": null")
      .replace(/:\s*-?Infinity(?=\s*[,}\]])/g, ": null")
  );
}

function text(value) {
  return String(value ?? "").trim();
}

function normalize(value) {
  return text(value).toLowerCase();
}

function escapeHtml(value) {
  return text(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function keyOf(row) {
  return [row.workspace_name, row.lakehouse_name, row.schema_name, row.table_name].map(normalize).join("|");
}

function tableId(index) {
  return `T${String(index + 1).padStart(3, "0")}`;
}

function columnId(index) {
  return `C${String(index + 1).padStart(5, "0")}`;
}

function tableLabel(row) {
  return `${text(row.schema_name) || "no_schema"}.${text(row.table_name) || "unnamed_table"}`;
}

function titleCase(value) {
  const v = text(value);
  return v
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
}

function inferDataType(name, example) {
  const lower = normalize(name);
  const sample = text(example);
  if (lower.includes("datetime") || lower.includes("timestamp") || lower.includes("_time")) return "datetime";
  if (lower.includes("date") || lower.includes("_dt") || lower.endsWith("dt")) return "date";
  if (/(month|year|rowno|count|qty|num|_id$)/.test(lower)) return "whole number";
  if (/(price|amount|value|stock|weight|cost|ratio|gap)/.test(lower)) return "decimal number";
  if (/^\d{4}-\d{2}-\d{2}/.test(sample)) return sample.includes(":") ? "datetime" : "date";
  if (/^-?\d+(\.\d+)?$/.test(sample.replaceAll(",", ""))) return sample.includes(".") ? "decimal number" : "whole number";
  return "text";
}

function isVisible(value) {
  return !["false", "0", "no", "n"].includes(normalize(value));
}

function includesQuery(rowText, query) {
  if (!query) return true;
  return query.split(/\s+/).filter(Boolean).every((part) => rowText.includes(part));
}

function selected(select, value) {
  return select.value === "ALL" || select.value === value;
}

function badge(value) {
  const label = text(value) || "-";
  const cls = label.toLowerCase().replace(/\s+/g, "-");
  return `<span class="badge ${escapeHtml(cls)}">${escapeHtml(label)}</span>`;
}

function fillSelect(select, values, label = "All") {
  const current = select.value;
  const cleaned = [...new Set(values.map(text).filter(Boolean))].sort((a, b) => a.localeCompare(b, "th"));
  select.innerHTML = `<option value="ALL">${label}</option>${cleaned
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("")}`;
  if (cleaned.includes(current)) select.value = current;
}

function fillTableOptions(select, tables, label = "All tables") {
  const current = select.value;
  const sorted = [...tables].sort((a, b) => tableLabel(a).localeCompare(tableLabel(b), "th"));
  select.innerHTML = `<option value="ALL">${label}</option>${sorted
    .map((row) => `<option value="${escapeHtml(row.table_id)}">${escapeHtml(tableLabel(row))}</option>`)
    .join("")}`;
  if (sorted.some((row) => row.table_id === current)) select.value = current;
}

function buildModel(raw) {
  const rawTables = raw.table_definition ?? [];
  const rawColumns = raw.column_definition ?? [];
  const tableKeyToId = new Map();

  state.tables = rawTables.map((row, index) => {
    const item = {
      table_id: tableId(index),
      table_key: keyOf(row),
      workspace_name: text(row.workspace_name),
      lakehouse_name: text(row.lakehouse_name),
      schema_name: text(row.schema_name),
      table_name: text(row.table_name),
      domain: text(row.domain) || "Unassigned",
      business_process: text(row.business_process),
      table_description: text(row.table_description),
      grain_description: text(row.grain_description),
      recommended_usage: text(row.recommended_usage),
      owner_team: text(row.owner_team) || "Unassigned",
      business_owner: text(row.business_owner) || "Unassigned",
      refresh_frequency: titleCase(row.refresh_frequency || row.Frequency || "Unknown"),
      status: text(row.status) || "Active",
    };
    item.search_text = normalize(Object.values(item).join(" | "));
    tableKeyToId.set(item.table_key, item.table_id);
    return item;
  });

  state.columns = rawColumns.map((row, index) => {
    const businessDefinition = text(row.business_definition);
    const technicalDefinition = text(row.technical_definition);
    const calculationLogic = text(row.calculation_logic);
    const item = {
      column_id: columnId(index),
      table_id: tableKeyToId.get(keyOf(row)) ?? "",
      workspace_name: text(row.workspace_name),
      lakehouse_name: text(row.lakehouse_name),
      schema_name: text(row.schema_name),
      table_name: text(row.table_name),
      column_name: text(row.column_name),
      display_column_name: text(row.display_column_name) || titleCase(row.column_name),
      data_type: inferDataType(row.column_name, row.example_value),
      business_definition: businessDefinition,
      technical_definition: technicalDefinition,
      calculation_logic: calculationLogic,
      example_value: text(row.example_value),
      usage_note: text(row.usage_note),
      is_visible_in_portal: isVisible(row.is_visible_in_portal) ? "TRUE" : "FALSE",
      definition_status: businessDefinition || technicalDefinition || calculationLogic ? "Complete" : "Missing",
    };
    item.search_text = normalize(Object.values(item).join(" | "));
    return item;
  });

  state.issues = Array.isArray(raw.issues) && raw.issues.length ? raw.issues.map(toIssue) : createIssues();
  state.selectedTableId = state.tables[0]?.table_id ?? "";
}

function toIssue(row, index) {
  const table = state.tables.find((item) => keyOf(item) === keyOf(row)) ?? {
    table_id: "",
    schema_name: text(row.schema_name),
    table_name: text(row.table_name),
    owner_team: text(row.owner_team) || "Unassigned",
  };
  const issueType = text(row.issue_type) || "Notebook issue";
  const item = {
    issue_id: `N${String(index + 1).padStart(5, "0")}`,
    issue_type: issueType,
    severity: severityForIssue(issueType),
    source: "Notebook",
    table_id: table.table_id,
    schema_name: table.schema_name,
    table_name: table.table_name,
    column_name: text(row.column_name),
    owner_team: text(row.owner_team) || table.owner_team || "Unassigned",
    suggested_action: text(row.recommended_action) || "Review this dictionary item",
  };
  item.search_text = normalize(Object.values(item).join(" | "));
  return item;
}

function severityForIssue(issueType) {
  const value = normalize(issueType);
  if (value.includes("missing table") || value.includes("missing grain") || value.includes("table missing")) return "High";
  if (value.includes("missing") || value.includes("duplicate")) return "Medium";
  return "Low";
}

function createIssues() {
  const issues = [];
  state.tables.forEach((table) => {
    if (!table.table_description) issues.push(toIssue({ ...table, issue_type: "Missing table description", recommended_action: "Fill table_description" }, issues.length));
    if (!table.grain_description) issues.push(toIssue({ ...table, issue_type: "Missing grain description", recommended_action: "Fill grain_description" }, issues.length));
  });
  state.columns.filter((column) => column.definition_status === "Missing").forEach((column) => {
    issues.push(toIssue({ ...column, issue_type: "Missing column definition", owner_team: state.tables.find((table) => table.table_id === column.table_id)?.owner_team, recommended_action: "Fill business_definition, technical_definition, or calculation_logic" }, issues.length));
  });
  return issues;
}

function tableColumns(tableId) {
  return state.columns.filter((column) => column.table_id === tableId);
}

function initControls() {
  fillSelect(dom.filters.domain, state.tables.map((row) => row.domain), "All domains");
  fillSelect(dom.filters.schema, state.tables.map((row) => row.schema_name), "All schemas");
  fillSelect(dom.filters.owner, state.tables.map((row) => row.owner_team), "All owners");
  fillSelect(dom.filters.status, state.tables.map((row) => row.status), "All statuses");
  fillTableOptions(dom.filters.columnTable, state.tables);
  fillSelect(dom.filters.dataType, state.columns.map((row) => row.data_type), "All data types");
  fillSelect(dom.filters.definition, state.columns.map((row) => row.definition_status), "All definitions");
  fillSelect(dom.filters.visible, state.columns.map((row) => row.is_visible_in_portal), "All visibility");
  fillSelect(dom.filters.issueType, state.issues.map((row) => row.issue_type), "All issues");
  fillSelect(dom.filters.severity, state.issues.map((row) => row.severity), "All severity");
  fillSelect(dom.filters.issueOwner, state.issues.map((row) => row.owner_team), "All owners");
  fillTableOptions(dom.selectedTable, state.tables, "Select table");
}

function renderKpis() {
  const totalColumns = state.columns.length;
  const completeColumns = state.columns.filter((row) => row.definition_status === "Complete").length;
  document.querySelector("#kpiTables").textContent = nf.format(state.tables.length);
  document.querySelector("#kpiColumns").textContent = nf.format(totalColumns);
  document.querySelector("#kpiActive").textContent = nf.format(state.tables.filter((row) => row.status === "Active").length);
  document.querySelector("#kpiMissing").textContent = nf.format(totalColumns - completeColumns);
  document.querySelector("#kpiCoverage").textContent = pct.format(totalColumns ? completeColumns / totalColumns : 0);
}

function filteredCatalogTables() {
  const query = normalize(dom.globalSearch.value);
  return state.tables.filter((row) =>
    includesQuery(row.search_text, query) &&
    selected(dom.filters.domain, row.domain) &&
    selected(dom.filters.schema, row.schema_name) &&
    selected(dom.filters.owner, row.owner_team) &&
    selected(dom.filters.status, row.status)
  );
}

function renderCatalog() {
  const rows = filteredCatalogTables();
  document.querySelector("#catalogRows").innerHTML = rows.map((table) => `
    <tr>
      <td>${escapeHtml(table.workspace_name)}</td>
      <td>${escapeHtml(table.domain)}</td>
      <td>${escapeHtml(table.schema_name)}</td>
      <td><button class="table-link" type="button" data-table-id="${table.table_id}">${escapeHtml(table.table_name)}</button></td>
      <td>${escapeHtml(table.table_description || "-")}</td>
      <td>${escapeHtml(table.grain_description || "-")}</td>
      <td>${escapeHtml(table.owner_team)}</td>
      <td>${badge(table.status)}</td>
    </tr>`).join("") || `<tr><td class="empty-state" colspan="8">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</td></tr>`;
}

function matchingTablesForDetail() {
  const query = normalize(dom.tableDetailSearch.value);
  return state.tables.filter((table) =>
    !query ||
    includesQuery(table.search_text, query) ||
    tableColumns(table.table_id).some((column) => includesQuery(column.search_text, query))
  );
}

function renderTableDetail() {
  const matches = matchingTablesForDetail();
  const options = matches.length ? matches : state.tables;
  fillTableOptions(dom.selectedTable, options, "Select table");
  dom.tableDetailSuggestions.innerHTML = options.slice(0, 80).map((table) => `<option value="${escapeHtml(tableLabel(table))}"></option>`).join("");
  dom.tableDetailSearchNote.textContent = dom.tableDetailSearch.value ? `${nf.format(matches.length)} matching tables` : "";
  if (!options.some((table) => table.table_id === state.selectedTableId)) state.selectedTableId = options[0]?.table_id ?? "";
  dom.selectedTable.value = state.selectedTableId;

  const table = state.tables.find((item) => item.table_id === state.selectedTableId);
  if (!table) return;
  document.querySelector("#tableProfile").innerHTML = [
    ["Table", tableLabel(table)],
    ["Workspace", table.workspace_name],
    ["Lakehouse", table.lakehouse_name],
    ["Domain", table.domain],
    ["Owner", table.owner_team],
    ["Description", table.table_description || "-"],
    ["Grain", table.grain_description || "-"],
    ["Recommended Usage", table.recommended_usage || "-"],
  ].map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("");

  document.querySelector("#detailColumnRows").innerHTML = tableColumns(table.table_id).map((column) => `
    <tr>
      <td>${escapeHtml(column.column_name)}</td>
      <td>${escapeHtml(column.display_column_name)}</td>
      <td>${escapeHtml(column.data_type)}</td>
      <td>${escapeHtml(column.business_definition || "-")}</td>
      <td>${escapeHtml(column.technical_definition || "-")}</td>
      <td>${escapeHtml(column.usage_note || "-")}</td>
      <td>${badge(column.is_visible_in_portal)}</td>
    </tr>`).join("") || `<tr><td class="empty-state" colspan="7">ยังไม่มี column_definition</td></tr>`;
}

function renderColumns() {
  const query = normalize(dom.columnSearch.value);
  const rows = state.columns.filter((row) =>
    includesQuery(row.search_text, query) &&
    selected(dom.filters.columnTable, row.table_id) &&
    selected(dom.filters.dataType, row.data_type) &&
    selected(dom.filters.definition, row.definition_status) &&
    selected(dom.filters.visible, row.is_visible_in_portal)
  );
  document.querySelector("#columnRows").innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.schema_name)}.${escapeHtml(row.table_name)}</td>
      <td>${escapeHtml(row.column_name)}</td>
      <td>${escapeHtml(row.display_column_name)}</td>
      <td>${escapeHtml(row.data_type)}</td>
      <td>${escapeHtml(row.business_definition || "-")}</td>
      <td>${escapeHtml(row.technical_definition || "-")}</td>
      <td>${escapeHtml(row.usage_note || "-")}</td>
      <td>${badge(row.is_visible_in_portal)}</td>
    </tr>`).join("") || `<tr><td class="empty-state" colspan="8">ไม่พบ column ที่ตรงกับเงื่อนไข</td></tr>`;
}

function filteredIssues() {
  const query = normalize(dom.issueSearch.value);
  return state.issues.filter((row) =>
    includesQuery(row.search_text, query) &&
    selected(dom.filters.issueType, row.issue_type) &&
    selected(dom.filters.severity, row.severity) &&
    selected(dom.filters.issueOwner, row.owner_team)
  );
}

function renderIssues() {
  const rows = filteredIssues();
  document.querySelector("#issueCount").textContent = `${nf.format(state.issues.length)} issues`;
  document.querySelector("#kpiMissingTable").textContent = nf.format(rows.filter((row) => row.issue_type.includes("table description")).length);
  document.querySelector("#kpiMissingGrain").textContent = nf.format(rows.filter((row) => row.issue_type.includes("grain")).length);
  document.querySelector("#kpiColumnIssues").textContent = nf.format(rows.filter((row) => row.column_name).length);
  document.querySelector("#kpiReview").textContent = nf.format(rows.filter((row) => row.issue_type.toLowerCase().includes("review")).length);
  document.querySelector("#issueRows").innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.issue_type)}</td>
      <td>${badge(row.severity)}</td>
      <td>${badge(row.source)}</td>
      <td>${escapeHtml(row.schema_name)}</td>
      <td>${escapeHtml(row.table_name)}</td>
      <td>${escapeHtml(row.column_name || "-")}</td>
      <td>${escapeHtml(row.owner_team)}</td>
      <td>${escapeHtml(row.suggested_action)}</td>
    </tr>`).join("") || `<tr><td class="empty-state" colspan="8">ไม่พบ issue ที่ตรงกับเงื่อนไข</td></tr>`;
}

function switchPage(pageId) {
  dom.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.page === pageId));
  dom.pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
}

function renderAll() {
  renderKpis();
  renderCatalog();
  renderTableDetail();
  renderColumns();
  renderIssues();
}

function bindEvents() {
  dom.tabs.forEach((tab) => tab.addEventListener("click", () => switchPage(tab.dataset.page)));
  dom.resetAll.addEventListener("click", () => {
    [dom.globalSearch, dom.tableDetailSearch, dom.columnSearch, dom.issueSearch].forEach((input) => (input.value = ""));
    Object.values(dom.filters).forEach((select) => (select.value = "ALL"));
    renderAll();
  });
  [dom.globalSearch, dom.columnSearch, dom.issueSearch].forEach((input) => input.addEventListener("input", renderAll));
  dom.tableDetailSearch.addEventListener("input", renderTableDetail);
  Object.values(dom.filters).forEach((select) => select.addEventListener("change", renderAll));
  dom.selectedTable.addEventListener("change", () => {
    state.selectedTableId = dom.selectedTable.value;
    renderTableDetail();
  });
  document.querySelector("#catalogRows").addEventListener("click", (event) => {
    const button = event.target.closest("[data-table-id]");
    if (!button) return;
    state.selectedTableId = button.dataset.tableId;
    dom.tableDetailSearch.value = "";
    switchPage("tableDetail");
    renderTableDetail();
  });
}

async function init() {
  try {
    const dictionary = await loadDictionary();
    buildModel(dictionary);
    initControls();
    bindEvents();
    renderAll();
    const generatedAt = dictionary.meta?.generated_at ? ` - generated ${dictionary.meta.generated_at}` : "";
    document.querySelector("#lastUpdated").textContent =
      `JSON snapshot - ${nf.format(state.tables.length)} table rows - ${nf.format(state.columns.length)} column rows${generatedAt}`;
    document.querySelector("#subtitle").textContent =
      `${dictionary.meta?.source || "Microsoft Fabric"} - ${dictionary.meta?.schema || "governance"} schema`;
  } catch (error) {
    document.querySelector("#catalogRows").innerHTML =
      `<tr><td class="empty-state" colspan="8">${escapeHtml(error.message)}</td></tr>`;
    console.error(error);
  }
}

init();
