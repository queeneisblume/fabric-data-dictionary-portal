# 03 Staging Tables

## `governance.stg_table_metadata`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Staging / Scan Log |
| Grain | 1 row ต่อ 1 table ต่อ 1 sync run |
| Description | ตาราง staging สำหรับเก็บผล scan metadata ระดับ table จาก Fabric ในแต่ละรอบ |
| Recommended Usage | ใช้ debug metadata scan, ตรวจ source ที่ scan fail และใช้ build current table |
| Refresh Pattern | Append by sync run |
| Retention | แนะนำเก็บ 30–90 วัน |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `sync_run_id` | string | รหัสของ metadata sync run ใช้ระบุว่าข้อมูล scan มาจากรอบใด |
| `source_id` | string | รหัส source จาก `cfg_metadata_source` ที่ใช้ scan |
| `layer` | string | layer ของ table ที่ scan ได้ เช่น Bronze, Silver, Gold |
| `workspace_name` | string | ชื่อ Fabric Workspace ที่ table อยู่ |
| `lakehouse_name` | string | ชื่อ Lakehouse ที่ table อยู่ |
| `schema_name` | string | ชื่อ schema ที่ table อยู่ |
| `table_name` | string | ชื่อตารางที่ scan ได้ |
| `domain` | string | domain ของ table ตาม config |
| `owner_team` | string | owner team default ตาม config |
| `row_count` | long | จำนวน row ของ table ถ้าเปิด `scan_row_count`; ถ้าไม่ได้เปิดจะเป็น null |
| `column_count` | int | จำนวน column ที่พบใน table ณ รอบ scan นั้น |
| `scan_status` | string | สถานะการ scan เช่น Success หรือ Failed |
| `error_message` | string | รายละเอียด error ถ้า scan table หรือ source ไม่สำเร็จ |
| `scanned_at` | timestamp | เวลาที่ scan metadata record นี้ |
| `sync_date` | date | วันที่ของ sync run ใช้สำหรับ partition และ retention |

## `governance.stg_column_metadata`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Staging / Scan Log |
| Grain | 1 row ต่อ 1 column ต่อ 1 sync run |
| Description | ตาราง staging สำหรับเก็บผล scan metadata ระดับ column จาก Fabric ในแต่ละรอบ |
| Recommended Usage | ใช้ debug schema, ตรวจ column ที่เพิ่ม/หาย/เปลี่ยน type และใช้ build `dim_column` |
| Refresh Pattern | Append by sync run |
| Retention | แนะนำเก็บ 30–90 วัน |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `sync_run_id` | string | รหัสของ metadata sync run |
| `source_id` | string | รหัส source จาก `cfg_metadata_source` |
| `layer` | string | layer ของ column ที่ scan ได้ เช่น Bronze, Silver, Gold |
| `workspace_name` | string | ชื่อ Fabric Workspace ที่ column อยู่ |
| `lakehouse_name` | string | ชื่อ Lakehouse ที่ column อยู่ |
| `schema_name` | string | ชื่อ schema ที่ column อยู่ |
| `table_name` | string | ชื่อตารางที่ column อยู่ |
| `column_name` | string | ชื่อ column จริงที่พบจาก Fabric metadata |
| `ordinal_position` | int | ลำดับของ column ใน schema ของ table |
| `data_type` | string | data type ของ column จาก Spark schema เช่น string, date, decimal(18,2) |
| `is_nullable` | boolean | ระบุว่า column อนุญาตให้มีค่า null หรือไม่ |
| `scan_status` | string | สถานะการ scan column metadata |
| `error_message` | string | รายละเอียด error ถ้า scan ไม่สำเร็จ |
| `scanned_at` | timestamp | เวลาที่ scan metadata record นี้ |
| `sync_date` | date | วันที่ของ sync run ใช้สำหรับ partition และ retention |
