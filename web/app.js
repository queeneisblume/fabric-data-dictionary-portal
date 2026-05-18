const tables = [
  {
    table: 'fact_daily_pawn_stock',
    fullName: 'Gold Layer.lh_report_data.pawnshop.fact_daily_pawn_stock',
    domain: 'Pawnshop',
    layer: 'Gold',
    schema: 'pawnshop',
    owner: 'Data Engineering',
    status: 'Complete',
    refresh: 'Daily · D-1 before 06:30 ICT',
    description: 'ตารางสรุปยอดทรัพย์จำนำคงเหลือรายวัน แยกตามวันที่ สาขา ประเภททรัพย์ และสถานะการเชื่อมโยงข้อมูล',
    grain: '1 row ต่อ report_date + branch_code + asset_type + linked_status',
    usage: 'ใช้สำหรับดูยอด stock รายวันระดับสาขา และตรวจสอบยอดเทียบกับ dayend'
  },
  {
    table: 'fact_money_dayend',
    fullName: 'Gold Layer.lh_report_data.pawnshop.fact_money_dayend',
    domain: 'Pawnshop',
    layer: 'Gold',
    schema: 'pawnshop',
    owner: 'Data Engineering',
    status: 'Partial',
    refresh: 'Daily · D-1 before 07:00 ICT',
    description: 'ตารางสรุปยอดเงินประจำวันของสาขาจากระบบ Money Dayend',
    grain: '1 row ต่อ report_date + branch_code',
    usage: 'ใช้ตรวจสอบยอดเงินประจำวัน รายงาน dayend และ reconciliation ระดับสาขา'
  },
  {
    table: 'dim_branch_history',
    fullName: 'Gold Layer.lh_report_data.pawnshop.dim_branch_history',
    domain: 'Master Data',
    layer: 'Gold',
    schema: 'pawnshop',
    owner: 'Data Engineering',
    status: 'Complete',
    refresh: 'On change',
    description: 'ตาราง master สาขาแบบเก็บประวัติ ใช้ระบุชื่อสาขา BU และช่วงเวลาที่ข้อมูลสาขามีผล',
    grain: '1 row ต่อ branch_code + effective_start_date + effective_end_date',
    usage: 'ใช้ join กับ fact tables ที่มี branch_code เพื่อแสดงชื่อสาขาและ BU'
  },
  {
    table: 'dim_goldprice_history',
    fullName: 'Gold Layer.lh_report_data.gold.dim_goldprice_history',
    domain: 'Gold Trading',
    layer: 'Gold',
    schema: 'gold',
    owner: 'Data Engineering',
    status: 'Complete',
    refresh: 'Daily · D-1 before 06:30 ICT',
    description: 'ตารางประวัติราคาทองจากแหล่งอ้างอิง ใช้เปรียบเทียบกับราคาทองจำนำ',
    grain: '1 row ต่อ price_date + gold_type + source',
    usage: 'ใช้ join เพื่อคำนวณส่วนต่างระหว่างราคาทองตลาดกับราคาทองจำนำ'
  },
  {
    table: 'newpawn_outstanding_assets',
    fullName: 'Silver Layer.lh_tts_datamart.pawnshop.newpawn_outstanding_assets',
    domain: 'Pawnshop',
    layer: 'Silver',
    schema: 'pawnshop',
    owner: 'Data Engineering',
    status: 'Missing',
    refresh: 'Daily',
    description: 'รายการทรัพย์จำนำคงเหลือระดับ asset จาก operational source',
    grain: '1 row ต่อ ticket_code + asset_id',
    usage: 'ใช้เป็น source ระดับ transaction/asset ก่อน aggregate เป็น Gold fact'
  },
  {
    table: 'rpt_data_dictionary_search',
    fullName: 'Gold Layer.lh_monitoring_data.governance.rpt_data_dictionary_search',
    domain: 'Governance',
    layer: 'Gold',
    schema: 'governance',
    owner: 'Data Engineering',
    status: 'Complete',
    refresh: 'Daily after metadata sync',
    description: 'ตาราง denormalized สำหรับ search data dictionary ใน Power BI หรือ web portal',
    grain: '1 row ต่อ visible column พร้อม table context',
    usage: 'ใช้เป็น table หลักสำหรับหน้า Catalog Search'
  }
];

const columns = [
  { table: 'fact_daily_pawn_stock', column: 'report_date', type: 'date', status: 'Complete', definition: 'วันที่รายงานข้อมูล stock ตามรอบธุรกิจ', note: 'ใช้ filter รอบข้อมูล ควรใช้ร่วมกับ branch_code' },
  { table: 'fact_daily_pawn_stock', column: 'branch_code', type: 'string', status: 'Complete', definition: 'รหัสสาขาที่ใช้ระบุสาขาของรายการ stock', note: 'ใช้ join กับ dim_branch_history เพื่อดึงชื่อสาขาและ BU' },
  { table: 'fact_daily_pawn_stock', column: 'easy_id', type: 'string', status: 'Complete', definition: 'รหัสลูกค้า', note: 'ถ้าต้องการนับลูกค้า ให้ใช้ COUNT DISTINCT easy_id ห้าม SUM' },
  { table: 'fact_daily_pawn_stock', column: 'linked_status', type: 'string', status: 'Missing', definition: '', note: 'ควรเติมนิยามจาก reconciliation logic' },
  { table: 'fact_money_dayend', column: 'cash_balance', type: 'decimal(18,2)', status: 'Complete', definition: 'ยอดเงินสดคงเหลือ ณ สิ้นวัน', note: 'ใช้ตรวจสอบยอดเงินสดระดับสาขา' },
  { table: 'fact_money_dayend', column: 'bank_balance', type: 'decimal(18,2)', status: 'Partial', definition: 'ยอดเงินธนาคารคงเหลือ ณ สิ้นวัน', note: 'ใช้เทียบกับ bank statement/reconciliation' },
  { table: 'dim_branch_history', column: 'effective_start_date', type: 'date', status: 'Complete', definition: 'วันที่เริ่มมีผลของ record สาขา', note: 'ใช้กับ branch mapping ตามช่วงเวลา' },
  { table: 'dim_goldprice_history', column: 'gold_price_range', type: 'string', status: 'Complete', definition: 'ช่วงราคาทองที่จัดกลุ่มทุก 500 บาท', note: 'ใช้ทำ distribution chart' }
];

const issues = [
  { type: 'Missing column definition', object: 'fact_daily_pawn_stock.linked_status', owner: 'Data Engineering', action: 'เติม business_definition และ usage_note ใน manual dictionary' },
  { type: 'Missing table description', object: 'newpawn_outstanding_assets', owner: 'Data Engineering', action: 'ระบุ table_description และ grain_description ให้ชัดเจนก่อนเปิดให้ทีมใช้งาน' },
  { type: 'Potential metric without calculation logic', object: 'fact_money_dayend.bank_balance', owner: 'Finance Operation', action: 'เติม calculation_logic หรือ source mapping เพื่อป้องกันการตีความผิด' },
  { type: 'Manual column orphan', object: 'tmp_pawn_2025.old_branch_name', owner: 'Data Engineering', action: 'ลบ mapping เก่าหรือแก้ key ให้ตรงกับ auto metadata' }
];

const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('page-title');

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((btn) => btn.classList.remove('active'));
    pages.forEach((page) => page.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(`${item.dataset.page}-page`).classList.add('active');
    pageTitle.textContent = item.textContent;
  });
});

const els = {
  search: document.getElementById('global-search'),
  domain: document.getElementById('domain-filter'),
  layer: document.getElementById('layer-filter'),
  status: document.getElementById('status-filter'),
  catalogCards: document.getElementById('catalog-cards'),
  catalogCount: document.getElementById('catalog-count'),
  tableList: document.getElementById('table-list'),
  tableCount: document.getElementById('table-count'),
  columnBody: document.getElementById('column-body'),
  columnCount: document.getElementById('column-count'),
  kpiGrid: document.getElementById('kpi-grid'),
  issueBody: document.getElementById('issue-body'),
  coverage: document.getElementById('coverage-stat')
};

function unique(values) {
  return [...new Set(values)].sort();
}

function populateFilters() {
  unique(tables.map((row) => row.domain)).forEach((domain) => {
    els.domain.insertAdjacentHTML('beforeend', `<option value="${domain}">${domain}</option>`);
  });
  unique(tables.map((row) => row.layer)).forEach((layer) => {
    els.layer.insertAdjacentHTML('beforeend', `<option value="${layer}">${layer}</option>`);
  });
  unique(tables.map((row) => row.status)).forEach((status) => {
    els.status.insertAdjacentHTML('beforeend', `<option value="${status}">${status}</option>`);
  });
}

function filteredTables() {
  const keyword = els.search.value.trim().toLowerCase();
  return tables.filter((row) => {
    const haystack = `${row.table} ${row.fullName} ${row.domain} ${row.schema} ${row.description} ${row.grain} ${row.usage}`.toLowerCase();
    return (!keyword || haystack.includes(keyword)) &&
      (els.domain.value === 'all' || row.domain === els.domain.value) &&
      (els.layer.value === 'all' || row.layer === els.layer.value) &&
      (els.status.value === 'all' || row.status === els.status.value);
  });
}

function renderCatalog(data) {
  els.catalogCount.textContent = `${data.length} tables`;
  els.catalogCards.innerHTML = data.length ? '' : '<div class="empty">ไม่พบ table ที่ตรงกับเงื่อนไข</div>';
  data.forEach((row) => {
    els.catalogCards.insertAdjacentHTML('beforeend', `
      <article class="card">
        <div class="card-head">
          <div><p class="eyebrow">${row.schema} · ${row.domain}</p><h4>${row.table}</h4></div>
          <span class="status ${row.status}">${row.status}</span>
        </div>
        <p class="desc">${row.description}</p>
        <div class="meta">
          <span class="tag">${row.layer}</span>
          <span class="tag">${row.owner}</span>
          <span class="tag">${row.refresh}</span>
        </div>
      </article>`);
  });
}

function renderTableDefinitions(data) {
  els.tableCount.textContent = `${data.length} tables`;
  els.tableList.innerHTML = data.length ? '' : '<div class="empty">ไม่พบ table ที่ตรงกับเงื่อนไข</div>';
  data.forEach((row) => {
    els.tableList.insertAdjacentHTML('beforeend', `
      <article class="table-detail">
        <div class="profile">
          <div class="profile-row"><b>Table</b><span>${row.table}</span></div>
          <div class="profile-row"><b>Full Name</b><span>${row.fullName}</span></div>
          <div class="profile-row"><b>Domain</b><span>${row.domain}</span></div>
          <div class="profile-row"><b>Owner</b><span>${row.owner}</span></div>
          <div class="profile-row"><b>Status</b><span class="status ${row.status}">${row.status}</span></div>
        </div>
        <div class="definition">
          <h4>${row.table}</h4>
          <p>${row.description}</p>
          <div class="block"><b>Grain</b>${row.grain}</div>
          <div class="block"><b>Recommended Usage</b>${row.usage}</div>
        </div>
      </article>`);
  });
}

function renderColumns(data) {
  const allowed = new Set(data.map((row) => row.table));
  const filtered = columns.filter((row) => allowed.has(row.table));
  els.columnCount.textContent = `${filtered.length} columns`;
  els.columnBody.innerHTML = '';
  filtered.forEach((row) => {
    els.columnBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${row.table}</td>
        <td><strong>${row.column}</strong></td>
        <td>${row.type}</td>
        <td>${row.definition || '<span class="muted">ยังไม่มีนิยาม</span>'}</td>
        <td>${row.note || '-'}</td>
        <td><span class="status ${row.status}">${row.status}</span></td>
      </tr>`);
  });
}

function renderMaintenance() {
  const totalColumns = columns.length;
  const missingColumns = columns.filter((c) => c.status === 'Missing').length;
  const completeColumns = totalColumns - missingColumns;
  const coverage = Math.round((completeColumns / totalColumns) * 100);
  els.coverage.textContent = `${coverage}%`;
  const kpis = [
    ['Total Tables', tables.length],
    ['Total Columns', totalColumns],
    ['Missing Definitions', missingColumns],
    ['Open Issues', issues.length]
  ];
  els.kpiGrid.innerHTML = '';
  kpis.forEach(([label, value]) => {
    els.kpiGrid.insertAdjacentHTML('beforeend', `<div class="kpi"><p class="eyebrow">${label}</p><strong>${value}</strong><span class="muted">current snapshot</span></div>`);
  });
  els.issueBody.innerHTML = '';
  issues.forEach((issue) => {
    els.issueBody.insertAdjacentHTML('beforeend', `<tr><td>${issue.type}</td><td>${issue.object}</td><td>${issue.owner}</td><td>${issue.action}</td></tr>`);
  });
}

function renderAll() {
  const data = filteredTables();
  renderCatalog(data);
  renderTableDefinitions(data);
  renderColumns(data);
}

['input', 'change'].forEach((eventName) => {
  els.search.addEventListener(eventName, renderAll);
  els.domain.addEventListener(eventName, renderAll);
  els.layer.addEventListener(eventName, renderAll);
  els.status.addEventListener(eventName, renderAll);
});

document.getElementById('reset-filters').addEventListener('click', () => {
  els.search.value = '';
  els.domain.value = 'all';
  els.layer.value = 'all';
  els.status.value = 'all';
  renderAll();
});

populateFilters();
renderAll();
renderMaintenance();
