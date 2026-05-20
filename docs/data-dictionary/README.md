# Governance Data Dictionary

เอกสารชุดนี้อธิบาย data model ของ schema `governance` สำหรับ Fabric Data Dictionary Portal โดยเน้น definition ภาษาไทยและคงศัพท์เทคนิคภาษาอังกฤษเมื่อแปลแล้วทำให้ความหมายคลาดเคลื่อน

## Table Groups

| Group | Tables | Purpose |
|---|---|---|
| Config | `cfg_metadata_source` | กำหนด source ที่ต้อง scan metadata |
| Manual Definition | `manual_table_definition`, `manual_column_definition` | เก็บ business definition ที่ทีมเติมเองจาก SharePoint/Excel |
| Staging | `stg_table_metadata`, `stg_column_metadata` | เก็บ raw metadata จากการ scan แต่ละรอบ |
| Current / Reporting | `dim_data_object`, `dim_column`, `rpt_*` | ตาราง current-state และ report-ready สำหรับ Power BI/Web Portal |
| Monitoring / History | `fact_metadata_sync_run`, `fact_definition_quality_snapshot`, `hist_schema_change` | เก็บ operation log, coverage snapshot และ schema change history |

## Lifecycle Pattern

```text
cfg_*       = manual/on-change configuration
manual_*    = overwrite from SharePoint/Excel
stg_*       = append by sync_run_id with retention
dim_*       = overwrite current state
rpt_*       = overwrite current issue/search state
fact_*      = append monitoring snapshot
hist_*      = append change event
```

## Key Design

### Table-level natural key

```text
workspace_name + lakehouse_name + schema_name + table_name
```

### Column-level natural key

```text
workspace_name + lakehouse_name + schema_name + table_name + column_name
```

### Surrogate keys

```text
data_object_id = hash(table-level natural key)
column_id      = hash(column-level natural key)
```

## Files

| File | Content |
|---|---|
| `01_config_tables.md` | Config table definition |
| `02_manual_definition_tables.md` | Manual table/column definition tables |
| `03_staging_tables.md` | Staging metadata scan tables |
| `04_current_reporting_tables.md` | Current and report-ready tables |
| `05_monitoring_history_tables.md` | Monitoring, quality snapshot and schema history tables |
