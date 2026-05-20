# 05 Monitoring and History Tables

## `governance.fact_metadata_sync_run`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Fact / Operation Log |
| Grain | 1 row ต่อ 1 metadata sync run หรือ 1 source ต่อ sync run ขึ้นกับ implementation |
| Description | ตาราง log สรุปผลการ scan metadata ในแต่ละรอบ |
| Recommended Usage | ใช้ monitoring ว่า sync รอบล่าสุดสำเร็จหรือ fail และดูจำนวน table ที่ scan ได้ |
| Refresh Pattern | Append ทุก metadata sync |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `sync_run_id` | string | รหัสของ metadata sync run |
| `source_id` | string | รหัส source ที่ scan ถ้า log เป็นระดับ source |
| `workspace_name` | string | ชื่อ Fabric Workspace ที่ scan |
| `lakehouse_name` | string | ชื่อ Lakehouse ที่ scan |
| `schema_name` | string | ชื่อ schema ที่ scan |
| `sync_started_at` | timestamp | เวลาเริ่ม metadata sync |
| `sync_finished_at` | timestamp | เวลาจบ metadata sync |
| `sync_status` | string | สถานะของ sync run เช่น Success, Partial Success, Failed |
| `scanned_table_items` | int | จำนวน table item ที่ scanner ประมวลผล |
| `success_table_items` | int | จำนวน table item ที่ scan สำเร็จ |
| `failed_table_items` | int | จำนวน table item ที่ scan ไม่สำเร็จ |
| `scanned_column_items` | int | จำนวน column item ที่ scanner ประมวลผล |
| `failed_column_items` | int | จำนวน column item ที่ scan ไม่สำเร็จ |
| `error_message` | string | error summary ของ sync run ถ้ามี |
| `created_at` | timestamp | เวลาที่เขียน log record เข้าตาราง |

## `governance.fact_definition_quality_snapshot`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Fact / Quality Snapshot |
| Grain | 1 row ต่อ 1 sync run + layer/domain/schema |
| Description | ตาราง snapshot สำหรับติดตาม coverage ของ data dictionary เช่น จำนวน missing definition และ coverage percentage |
| Recommended Usage | ใช้ทำ trend ว่า data dictionary สมบูรณ์ขึ้นหรือแย่ลงเมื่อเวลาผ่านไป |
| Refresh Pattern | Append ทุก metadata sync หรือทุก scheduled quality snapshot |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `sync_run_id` | string | รหัส metadata sync run ที่ snapshot นี้อ้างอิง |
| `snapshot_at` | timestamp | เวลาที่คำนวณ quality snapshot |
| `layer` | string | layer ของกลุ่มข้อมูลที่คำนวณ coverage |
| `domain` | string | domain ของกลุ่มข้อมูลที่คำนวณ coverage |
| `workspace_name` | string | ชื่อ Fabric Workspace |
| `lakehouse_name` | string | ชื่อ Lakehouse |
| `schema_name` | string | ชื่อ schema |
| `total_tables` | int | จำนวน table ทั้งหมดในกลุ่มนี้ |
| `missing_table_description_count` | int | จำนวน table ที่ยังไม่มี table description |
| `missing_grain_count` | int | จำนวน table ที่ยังไม่มี grain description |
| `total_columns` | int | จำนวน column ทั้งหมดในกลุ่มนี้ |
| `missing_column_definition_count` | int | จำนวน column ที่ยังไม่มี business definition |
| `column_definition_coverage_pct` | double | สัดส่วน column ที่มี definition แล้ว คำนวณจาก `(total_columns - missing_column_definition_count) / total_columns` |

## `governance.hist_schema_change`

### Table Definition

| Field | Value |
|---|---|
| Table Type | History / Change Event |
| Grain | 1 row ต่อ 1 schema change event |
| Description | ตารางประวัติการเปลี่ยนแปลง schema ของ table หรือ column เช่น table added, column removed, data type changed |
| Recommended Usage | ใช้ audit และ troubleshooting เมื่อ dashboard หรือ pipeline ได้รับผลกระทบจาก schema change |
| Refresh Pattern | Append เฉพาะเมื่อ detect change |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `change_id` | string | unique id ของ change event |
| `sync_run_id` | string | metadata sync run ที่ตรวจพบ change |
| `detected_at` | timestamp | เวลาที่ตรวจพบ schema change |
| `change_type` | string | ประเภทการเปลี่ยนแปลง เช่น table_added, table_removed, column_added, column_removed, data_type_changed |
| `object_level` | string | ระดับของ object ที่เปลี่ยน เช่น table หรือ column |
| `workspace_name` | string | ชื่อ Fabric Workspace ของ object ที่เปลี่ยน |
| `lakehouse_name` | string | ชื่อ Lakehouse ของ object ที่เปลี่ยน |
| `schema_name` | string | ชื่อ schema ของ object ที่เปลี่ยน |
| `table_name` | string | ชื่อตารางที่เกิด change |
| `column_name` | string | ชื่อ column ที่เกิด change; เป็น null ถ้าเป็น change ระดับ table |
| `old_value` | string | ค่าเดิมก่อนเปลี่ยน เช่น data type เดิม หรือสถานะเดิม |
| `new_value` | string | ค่าใหม่หลังเปลี่ยน เช่น data type ใหม่ หรือสถานะใหม่ |
| `impact_level` | string | ระดับผลกระทบโดยประมาณ เช่น Low, Medium, High |
| `review_status` | string | สถานะการ review change เช่น Pending, Reviewed, Ignored |
| `review_note` | string | note จากผู้ review change |
