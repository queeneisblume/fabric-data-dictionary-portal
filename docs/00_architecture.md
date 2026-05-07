# Architecture

## Design principle

Portal นี้แยก concerns หลักออกเป็น 4 ส่วน:

```text
Config            = what to scan
Manual definition = สิ่งที่ business users ต้องการอธิบาย
Auto metadata      = สิ่งที่มีอยู่จริงใน Fabric
Power BI tables    = curated current-state tables สำหรับ report
```

## Table layers

### Config

```text
governance.cfg_metadata_source
```

กำหนด active workspace/lakehouse/schema source แต่ละรายการ

### Manual source tables

```text
governance.manual_table_definition
governance.manual_column_definition
```

โหลดจาก SharePoint Excel หรือ managed source อื่น ๆ

### Staging scan logs

```text
governance.stg_table_metadata
governance.stg_column_metadata
```

Append scan output แยกตาม `sync_run_id` และควบคุมปริมาณข้อมูลด้วย retention

### Current-state tables

```text
governance.dim_data_object
governance.dim_column
```

Overwrite ทุกครั้งด้วย latest metadata + latest manual definition

### Report-ready tables

```text
governance.rpt_data_dictionary_search
governance.rpt_missing_definition
governance.rpt_manual_table_orphan
governance.rpt_manual_column_orphan
```

ออกแบบมาเพื่อใช้ใน Power BI

## Recommended lifecycle

```text
stg_*     = append + retention
dim_*     = overwrite current state
rpt_*     = overwrite current issue/search state
fact_*    = append summary history
hist_*    = append change events
```
