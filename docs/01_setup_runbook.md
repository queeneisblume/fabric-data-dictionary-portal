# Setup and Runbook

## 1. Prepare Fabric Lakehouse

Create or use a monitoring/governance Lakehouse, for example:

```text
lh_monitoring_data
```

Create schema:

```sql
CREATE SCHEMA IF NOT EXISTS governance;
```

## 2. Upload config file

Expected path:

```text
Files/data_dictionary/config/cfg_metadata_source.csv
```

Do not commit the real CSV to GitHub.

Use `templates/cfg_metadata_source_template.md` for required fields.

Run:

```text
notebooks/00_load_config.ipynb
```

## 3. Upload manual dictionary file

Expected path:

```text
Files/data_dictionary/manual/manual_data_dictionary.xlsx
```

Do not commit the real Excel file to GitHub.

Run:

```text
notebooks/01_load_manual_definition.ipynb
```

## 4. Scan metadata

Run:

```text
notebooks/02_scan_metadata_to_staging.ipynb
```

Output:

```text
governance.stg_table_metadata
governance.stg_column_metadata
```

## 5. Build Gold current tables

Run:

```text
notebooks/03_build_gold_current_tables.ipynb
```

Output:

```text
governance.dim_data_object
governance.dim_column
governance.rpt_data_dictionary_search
governance.rpt_missing_definition
governance.rpt_manual_table_orphan
governance.rpt_manual_column_orphan
governance.fact_metadata_sync_run
```

## 6. Optional retention and history tracking

Run:

```text
notebooks/04_retention_and_change_tracking.ipynb
```

This keeps staging tables compact and appends schema/quality history.
