# 01 Config Tables

## `governance.cfg_metadata_source`

### Table Definition

| Field | Value |
|---|---|
| Table Type | Config |
| Grain | 1 row ต่อ 1 metadata source ที่ต้อง scan เช่น workspace + lakehouse + schema |
| Description | ตาราง config สำหรับกำหนดว่า metadata scanner ต้อง scan workspace, lakehouse และ schema ใดบ้าง |
| Recommended Usage | ใช้ควบคุม scope ของการ scan metadata โดยไม่ต้องแก้ code ใน notebook |
| Refresh Pattern | Manual update / On change |
| Owner | Data Engineering |

### Column Definition

| Column | Type | Definition |
|---|---|---|
| `source_id` | string | รหัส unique ของ metadata source แต่ละรายการ ใช้เป็น key ในการอ้างอิง source ที่ scanner ต้องประมวลผล |
| `layer` | string | layer ของข้อมูล เช่น Bronze, Silver, Gold |
| `workspace_name` | string | ชื่อ Fabric Workspace ที่มี Lakehouse หรือ Warehouse ที่ต้อง scan |
| `lakehouse_name` | string | ชื่อ Lakehouse ที่ต้อง scan metadata |
| `schema_name` | string | ชื่อ schema ภายใน Lakehouse ถ้า Lakehouse เปิดใช้ schema; ถ้าไม่มี schema สามารถปล่อยว่างได้ |
| `domain` | string | business domain หรือ data domain ของ source เช่น Pawnshop, Finance, Inventory, Governance |
| `is_active` | boolean | flag ระบุว่า source นี้ยังต้อง scan อยู่หรือไม่ ถ้า `false` scanner จะข้าม source นี้ |
| `include_table_pattern` | string | regex pattern สำหรับเลือก table ที่ต้องการ include เช่น `.*`, `fact_.*`, `dim_.*` |
| `exclude_table_pattern` | string | regex pattern สำหรับตัด table ที่ไม่ต้องการ scan เช่น `tmp_.*`, `test_.*`, `backup_.*` |
| `owner_team` | string | ทีมเจ้าของ default ของ source นี้ ใช้เติม owner กรณี manual definition ยังไม่ได้ระบุ |
| `scan_row_count` | boolean | flag ระบุว่าจะให้ scanner นับจำนวน row ของ table หรือไม่; ควรตั้งเป็น `false` ใน MVP เพื่อลด CU |
| `created_at` | timestamp | วันที่สร้าง config record |
| `updated_at` | timestamp | วันที่แก้ไข config record ล่าสุด |
