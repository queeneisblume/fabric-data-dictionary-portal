# Easy Money Fabric Data Dictionary Portal

## Design Concept

Portal นี้ถูกออกแบบให้เป็น lightweight interactive web portal สำหรับทีม Data / Analytics Engineering เพื่อใช้ค้นหาและ maintenance metadata บน Microsoft Fabric

Theme หลัก:

- Primary color: Easy Money Red `#ed1b2f`
- Accent color: Soft Yellow `#f6c21a`
- Background: Minimal light gray
- Style: Enterprise dashboard + governance portal

---

## Main Pages

### 1. Catalog Search

หน้าหลักสำหรับค้นหา:

- Workspace
- Lakehouse
- Schema
- Table
- Column
- Business definition

Features:

- Keyword search
- Domain filter
- Layer filter
- Status filter
- Interactive cards

---

### 2. Table Definition

Table-level metadata view

Fields:

- table_name
- domain
- layer
- grain
- owner
- definition_status

Use case:

- ตรวจว่า table ไหนยังไม่มี definition
- ตรวจ grain inconsistency
- governance review

---

### 3. Column Definition

Column-level dictionary view

Fields:

- column_name
- data_type
- business_definition
- pii_flag
- visibility_status

Use case:

- semantic alignment
- PII review
- downstream BI usage

---

### 4. Maintenance

Monitoring page สำหรับ data governance

KPIs:

- missing definitions
- orphan mappings
- metadata refresh issues
- coverage percentage

Use case:

- operational governance monitoring
- metadata quality tracking
- backlog prioritization

---

## Recommended Deployment

### Option 1 — GitHub Pages

Suitable for:

- lightweight internal portal
- prototype governance portal
- quick deployment

Steps:

1. Push `/web` folder to repository
2. Enable GitHub Pages
3. Select `main` branch
4. Set root folder to `/web`

---

### Option 2 — SharePoint Static Hosting

Suitable for:

- enterprise Microsoft 365 environment
- internal-only access
- integration with SharePoint governance ecosystem

Recommended integration:

- SharePoint Excel metadata source
- Fabric notebook export JSON
- Power Automate refresh orchestration

---

## Future Enhancements

Recommended next phase:

- Connect live Fabric metadata API
- Add table lineage view
- Add Mermaid lineage diagrams
- Add semantic model dependency graph
- Add authentication layer
- Add admin maintenance page
- Add Power BI embedded reports
