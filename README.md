# Fabric Data Dictionary Portal

Repository สำหรับสร้าง **Data Dictionary Portal** บน Microsoft Fabric + Power BI

## สิ่งที่มีอยู่ใน repository นี้

- Fabric notebooks ในรูปแบบ `.ipynb`
- Mermaid workflow code
- PNG workflow diagrams
- Markdown implementation instructions
- Power BI theme และ DAX measures guide
- Template documentation สำหรับ config และ manual dictionary structure

## สิ่งที่ตั้งใจไม่ใส่ไว้ใน repository นี้

- Demo data files
- Production metadata exports
- Manual dictionary Excel files ของจริง
- Staging output files
- Delta/Parquet files
- PBIX/PBIT binary files
- Secrets, tokens และ workspace credentials

## Target architecture

```text
SharePoint manual dictionary
        +
Fabric metadata scan จาก configured workspace/lakehouse/schema
        ↓
governance.stg_* append scan logs
        ↓
governance.dim_* current-state tables
        ↓
governance.rpt_* report-ready tables
        ↓
Power BI Data Dictionary Portal
```

## Recommended run order

```text
1. notebooks/00_load_config.ipynb
2. notebooks/01_load_manual_definition.ipynb
3. notebooks/02_scan_metadata_to_staging.ipynb
4. notebooks/03_build_gold_current_tables.ipynb
5. notebooks/04_retention_and_change_tracking.ipynb  optional
```

## Power BI tables

ใช้ tables เหล่านี้สำหรับ semantic model:

```text
governance.dim_data_object
governance.dim_column
governance.rpt_data_dictionary_search
governance.rpt_missing_definition
governance.fact_metadata_sync_run
governance.rpt_manual_table_orphan
governance.rpt_manual_column_orphan
```

Main relationship:

```text
dim_data_object[data_object_id] 1:* dim_column[data_object_id]
```

`rpt_data_dictionary_search` intentionally denormalized เพื่อใช้เป็น main search table ได้โดยไม่ต้องสร้าง relationships เพิ่ม
