# Architecture

## Design principle

The portal separates four concerns:

```text
Config            = what to scan
Manual definition = what business users want to describe
Auto metadata      = what actually exists in Fabric
Power BI tables    = curated current-state tables
```

## Table layers

### Config

```text
governance.cfg_metadata_source
```

Defines each active workspace/lakehouse/schema source.

### Manual source tables

```text
governance.manual_table_definition
governance.manual_column_definition
```

Loaded from SharePoint Excel or another managed source.

### Staging scan logs

```text
governance.stg_table_metadata
governance.stg_column_metadata
```

Append scan output by `sync_run_id`. Keep with retention.

### Current-state tables

```text
governance.dim_data_object
governance.dim_column
```

Always overwritten with latest metadata + latest manual definition.

### Report-ready tables

```text
governance.rpt_data_dictionary_search
governance.rpt_missing_definition
governance.rpt_manual_table_orphan
governance.rpt_manual_column_orphan
```

Designed for Power BI usage.

## Recommended lifecycle

```text
stg_*     = append + retention
dim_*     = overwrite current state
rpt_*     = overwrite current issue/search state
fact_*    = append summary history
hist_*    = append change events
```
