# 02 Manual Definition Tables

## `governance.manual_table_definition`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Manual Definition |
| Grain | 1 row ต่อ 1 table ที่ต้องการเติม business definition |
| Description | ตาราง manual definition ระดับ table ที่โหลดมาจาก SharePoint Excel หรือ source ที่ทีมดูแลเอง |
| Recommended Usage | ใช้เติมคำอธิบายเชิงธุรกิจ เช่น table description, grain, owner, usage และ SLA |
| Refresh Pattern | Overwrite จาก manual Excel / SharePoint |
| Owner | Data Engineering + Data Owner |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `workspace_name` | string | ชื่อ Fabric Workspace ของ table ที่ต้องการเติม definition |
| `lakehouse_name` | string | ชื่อ Lakehouse ของ table ที่ต้องการเติม definition |
| `schema_name` | string | ชื่อ schema ของ table |
| `table_name` | string | ชื่อตารางจริงใน Fabric ต้องตรงกับ auto metadata เพื่อให้ merge ติด |
| `domain` | string | business domain ของ table เช่น Pawnshop, Master Data, Gold Trading |
| `business_process` | string | business process ที่ table นี้รองรับ เช่น Daily Pawn Stock, Money Dayend, Branch Master |
| `table_description` | string | คำอธิบายว่าตารางนี้ใช้ทำอะไรในเชิงธุรกิจ |
| `grain_description` | string | คำอธิบายว่า 1 row ของตารางแทนข้อมูลระดับใด เช่น 1 row ต่อ `report_date + branch_code` |
| `recommended_usage` | string | วิธีใช้งานที่แนะนำ เช่น ใช้ทำ dashboard, reconciliation, master lookup |
| `owner_team` | string | ทีม technical owner หรือทีมที่ดูแล table นี้ |
| `business_owner` | string | owner ฝั่ง business ที่รับผิดชอบความหมายหรือการใช้งานข้อมูล |
| `refresh_frequency` | string | ความถี่การ refresh เช่น Daily, Weekly, Monthly, On change, Ad hoc |
| `refresh_sla` | string | SLA หรือเวลาที่คาดว่าข้อมูลควรพร้อมใช้งาน เช่น D-1 before 06:30 ICT |
| `status` | string | สถานะของ table เช่น Active, Draft, Deprecated, Archived, Replaced |
| `manual_updated_at` | timestamp | วันที่โหลดหรืออัปเดต manual definition เข้าระบบล่าสุด |

## `governance.manual_column_definition`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Manual Definition |
| Grain | 1 row ต่อ 1 column ที่ต้องการเติม business definition |
| Description | ตาราง manual definition ระดับ column ที่โหลดมาจาก SharePoint Excel หรือ source ที่ทีมดูแลเอง |
| Recommended Usage | ใช้เติมความหมายของ column, calculation logic, example value และ usage note |
| Refresh Pattern | Overwrite จาก manual Excel / SharePoint |
| Owner | Data Engineering + Data Owner |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `workspace_name` | string | ชื่อ Fabric Workspace ของ column ที่ต้องการเติม definition |
| `lakehouse_name` | string | ชื่อ Lakehouse ของ column ที่ต้องการเติม definition |
| `schema_name` | string | ชื่อ schema ของ table |
| `table_name` | string | ชื่อตารางจริงใน Fabric |
| `column_name` | string | ชื่อ column จริงใน Fabric ต้องตรงกับ auto metadata เพื่อให้ merge ติด |
| `business_definition` | string | ความหมายเชิงธุรกิจของ column เขียนให้ user เข้าใจได้ |
| `technical_definition` | string | คำอธิบายเชิง technical เช่น ที่มาของ column, transformation หรือ rule ที่เกี่ยวข้อง |
| `calculation_logic` | string | สูตรหรือ logic การคำนวณของ column ถ้าเป็น derived field หรือ metric |
| `example_value` | string | ตัวอย่างค่าของ column เพื่อช่วยให้ user เข้าใจรูปแบบข้อมูล |
| `usage_note` | string | ข้อควรระวังหรือคำแนะนำการใช้งาน เช่น join key, aggregation rule, filter ที่ควรใช้ |
| `source_table` | string | table ต้นทางที่ column นี้ถูกดึงหรือ derive มา |
| `source_column` | string | column ต้นทางที่เกี่ยวข้อง |
| `display_column_name` | string | ชื่อที่ต้องการให้แสดงใน portal ถ้าอยากใช้ชื่อที่อ่านง่ายกว่าชื่อจริง |
| `is_visible_in_portal` | boolean | flag ระบุว่า column นี้ควรแสดงใน portal หรือไม่ ใช้ซ่อน technical columns เช่น `batch_id`, `row_hash` |
| `manual_updated_at` | timestamp | วันที่โหลดหรืออัปเดต manual definition เข้าระบบล่าสุด |
