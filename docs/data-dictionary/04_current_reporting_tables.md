# 04 Current and Reporting Tables

## `governance.dim_data_object`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Current Dimension |
| Grain | 1 row ต่อ 1 data object เช่น table หรือ view |
| Description | ตาราง current-state ระดับ table ที่รวม auto metadata จาก Fabric และ manual definition จากทีม |
| Recommended Usage | ใช้เป็น table หลักของ Power BI semantic model สำหรับหน้า Catalog และ Table Detail |
| Refresh Pattern | Overwrite ทุก metadata sync |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `data_object_id` | string | surrogate key ของ table สร้างจาก hash ของ `workspace_name + lakehouse_name + schema_name + table_name` |
| `source_id` | string | รหัส source จาก config ที่ table นี้ถูก scan มา |
| `layer` | string | layer ของ table เช่น Bronze, Silver, Gold |
| `workspace_name` | string | ชื่อ Fabric Workspace |
| `lakehouse_name` | string | ชื่อ Lakehouse |
| `schema_name` | string | ชื่อ schema |
| `table_name` | string | ชื่อตารางจริงใน Fabric |
| `full_table_name` | string | ชื่อเต็มของ table สำหรับอ้างอิง เช่น `workspace.lakehouse.schema.table` |
| `domain` | string | business domain ของ table |
| `business_process` | string | business process ที่ table นี้รองรับ |
| `table_description` | string | คำอธิบายเชิงธุรกิจของ table |
| `grain_description` | string | คำอธิบายว่า 1 row ของ table แทนข้อมูลระดับใด |
| `recommended_usage` | string | วิธีใช้งานที่แนะนำสำหรับ table นี้ |
| `owner_team` | string | technical owner หรือทีมที่ดูแล table |
| `business_owner` | string | owner ฝั่ง business |
| `refresh_frequency` | string | ความถี่การ refresh ของ table |
| `refresh_sla` | string | SLA หรือเวลาที่ข้อมูลควรพร้อมใช้งาน |
| `status` | string | สถานะของ table เช่น Active, Draft, Deprecated |
| `row_count` | long | จำนวน row ล่าสุดจาก metadata scan ถ้าเปิดการนับ row |
| `column_count` | int | จำนวน column ล่าสุดของ table |
| `table_definition_status` | string | สถานะความครบถ้วนของ `table_description` เช่น Complete หรือ Missing |
| `grain_definition_status` | string | สถานะความครบถ้วนของ `grain_description` เช่น Complete หรือ Missing |
| `last_metadata_sync_at` | timestamp | เวลาที่ table นี้ถูก scan metadata ล่าสุด |
| `gold_updated_at` | timestamp | เวลาที่ record นี้ถูก build เข้า current table ล่าสุด |

## `governance.dim_column`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Current Dimension |
| Grain | 1 row ต่อ 1 column ของแต่ละ data object |
| Description | ตาราง current-state ระดับ column ที่รวม auto metadata จาก Fabric และ manual definition จากทีม |
| Recommended Usage | ใช้เป็น table หลักของ Power BI semantic model สำหรับหน้า Column Dictionary และ Table Detail |
| Refresh Pattern | Overwrite ทุก metadata sync |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `column_id` | string | surrogate key ของ column สร้างจาก hash ของ `workspace_name + lakehouse_name + schema_name + table_name + column_name` |
| `data_object_id` | string | foreign key เชิง logical ไปที่ `dim_data_object.data_object_id` |
| `source_id` | string | รหัส source จาก config ที่ column นี้ถูก scan มา |
| `layer` | string | layer ของ column เช่น Bronze, Silver, Gold |
| `workspace_name` | string | ชื่อ Fabric Workspace |
| `lakehouse_name` | string | ชื่อ Lakehouse |
| `schema_name` | string | ชื่อ schema |
| `table_name` | string | ชื่อตารางที่ column นี้อยู่ |
| `column_name` | string | ชื่อ column จริงใน Fabric |
| `display_column_name` | string | ชื่อ column ที่ใช้แสดงใน portal ถ้า manual definition ระบุไว้ |
| `ordinal_position` | int | ลำดับของ column ใน schema |
| `data_type` | string | data type ของ column จาก Fabric/Spark metadata |
| `is_nullable` | boolean | ระบุว่า column อนุญาตให้มีค่า null หรือไม่ |
| `business_definition` | string | ความหมายเชิงธุรกิจของ column |
| `technical_definition` | string | คำอธิบายเชิง technical ของ column |
| `calculation_logic` | string | สูตรหรือ logic การคำนวณของ column ถ้ามี |
| `example_value` | string | ตัวอย่างค่าของ column |
| `usage_note` | string | ข้อควรระวังหรือคำแนะนำการใช้งาน column |
| `source_table` | string | table ต้นทางของ column |
| `source_column` | string | column ต้นทางของ column |
| `is_visible_in_portal` | boolean | flag ระบุว่า column นี้ควรแสดงใน portal หรือไม่ |
| `column_definition_status` | string | สถานะความครบถ้วนของ `business_definition` เช่น Complete หรือ Missing |
| `last_metadata_sync_at` | timestamp | เวลาที่ column นี้ถูก scan metadata ล่าสุด |
| `gold_updated_at` | timestamp | เวลาที่ record นี้ถูก build เข้า current table ล่าสุด |

## `governance.rpt_data_dictionary_search`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Reporting / Denormalized Search |
| Grain | 1 row ต่อ 1 visible column พร้อม table context |
| Description | ตาราง denormalized สำหรับทำ search ใน Power BI หรือ web portal โดยรวมข้อมูล table-level และ column-level ไว้ใน record เดียว |
| Recommended Usage | ใช้เป็น source หลักของหน้า Catalog Search |
| Refresh Pattern | Overwrite ทุก metadata sync |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `layer` | string | layer ของ table/column |
| `workspace_name` | string | ชื่อ Fabric Workspace |
| `lakehouse_name` | string | ชื่อ Lakehouse |
| `schema_name` | string | ชื่อ schema |
| `table_name` | string | ชื่อตารางจริงใน Fabric |
| `full_table_name` | string | ชื่อเต็มของ table สำหรับอ้างอิง |
| `domain` | string | business domain ของ table |
| `business_process` | string | business process ที่ table นี้รองรับ |
| `table_description` | string | คำอธิบายเชิงธุรกิจของ table |
| `grain_description` | string | คำอธิบาย grain ของ table |
| `recommended_usage` | string | วิธีใช้งานที่แนะนำของ table |
| `owner_team` | string | technical owner หรือทีมที่ดูแล table |
| `business_owner` | string | owner ฝั่ง business |
| `refresh_frequency` | string | ความถี่การ refresh |
| `refresh_sla` | string | SLA หรือเวลาที่ข้อมูลควรพร้อมใช้งาน |
| `status` | string | สถานะของ table |
| `row_count` | long | จำนวน row ล่าสุดของ table ถ้ามีการ scan row count |
| `column_count` | int | จำนวน column ล่าสุดของ table |
| `column_name` | string | ชื่อ column จริง |
| `display_column_name` | string | ชื่อ column ที่ใช้แสดงใน portal |
| `ordinal_position` | int | ลำดับของ column |
| `data_type` | string | data type ของ column |
| `is_nullable` | boolean | ระบุว่า column อนุญาตให้มีค่า null หรือไม่ |
| `business_definition` | string | ความหมายเชิงธุรกิจของ column |
| `technical_definition` | string | คำอธิบายเชิง technical ของ column |
| `calculation_logic` | string | สูตรหรือ logic การคำนวณของ column |
| `example_value` | string | ตัวอย่างค่าของ column |
| `usage_note` | string | ข้อควรระวังหรือคำแนะนำการใช้งาน column |
| `source_table` | string | table ต้นทางของ column |
| `source_column` | string | column ต้นทางของ column |
| `column_definition_status` | string | สถานะความครบถ้วนของ column definition |
| `table_definition_status` | string | สถานะความครบถ้วนของ table description |
| `grain_definition_status` | string | สถานะความครบถ้วนของ grain description |
| `last_metadata_sync_at` | timestamp | เวลาที่ metadata ถูก sync ล่าสุด |
| `search_text` | string | ข้อความรวมสำหรับ search เช่น table name, column name, description, definition และ usage note |

## `governance.rpt_missing_definition`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Reporting / Maintenance |
| Grain | 1 row ต่อ 1 missing definition issue |
| Description | ตาราง issue ปัจจุบันสำหรับแสดงรายการ definition ที่ยังขาดหรือยังต้องเติม |
| Recommended Usage | ใช้ในหน้า Maintenance ของ Power BI/Web Portal |
| Refresh Pattern | Overwrite ทุก metadata sync |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `issue_type` | string | ประเภทของ issue เช่น Missing table description, Missing grain description, Missing column definition |
| `layer` | string | layer ของ object ที่มี issue |
| `workspace_name` | string | ชื่อ Fabric Workspace ของ object ที่มี issue |
| `lakehouse_name` | string | ชื่อ Lakehouse ของ object ที่มี issue |
| `schema_name` | string | ชื่อ schema ของ object ที่มี issue |
| `table_name` | string | ชื่อตารางที่มี issue |
| `column_name` | string | ชื่อ column ที่มี issue; เป็น null ถ้าเป็น issue ระดับ table |
| `owner_team` | string | ทีมที่ควรรับผิดชอบการแก้ไข issue |
| `last_metadata_sync_at` | timestamp | เวลาที่ metadata ของ object นี้ถูก sync ล่าสุด |

## `governance.rpt_manual_table_orphan`

| Column | Type | Definition |
|---|---|---|
| `issue_type` | string | ประเภท issue เช่น Manual table not found in auto metadata |
| `workspace_name` | string | ชื่อ Fabric Workspace จาก manual definition |
| `lakehouse_name` | string | ชื่อ Lakehouse จาก manual definition |
| `schema_name` | string | ชื่อ schema จาก manual definition |
| `table_name` | string | ชื่อตารางจาก manual definition ที่ match กับ auto metadata ไม่เจอ |
| `domain` | string | domain จาก manual definition |
| `owner_team` | string | owner team จาก manual definition |

## `governance.rpt_manual_column_orphan`

| Column | Type | Definition |
|---|---|---|
| `issue_type` | string | ประเภท issue เช่น Manual column not found in auto metadata |
| `workspace_name` | string | ชื่อ Fabric Workspace จาก manual definition |
| `lakehouse_name` | string | ชื่อ Lakehouse จาก manual definition |
| `schema_name` | string | ชื่อ schema จาก manual definition |
| `table_name` | string | ชื่อตารางจาก manual definition |
| `column_name` | string | ชื่อ column จาก manual definition ที่ match กับ auto metadata ไม่เจอ |
| `business_definition` | string | business definition ที่มีอยู่ใน manual definition ของ orphan column |
