# Power BI Build Guide

## Recommended semantic model tables

```text
governance.dim_data_object
governance.dim_column
governance.rpt_data_dictionary_search
governance.rpt_missing_definition
governance.fact_metadata_sync_run
governance.rpt_manual_table_orphan
governance.rpt_manual_column_orphan
```

## Relationship

```text
dim_data_object[data_object_id] 1:* dim_column[data_object_id]
```

Use single-direction filtering.

`rpt_data_dictionary_search` can remain standalone because it is denormalized for the search page.

## Report pages

### Page 1: Catalog Search

Use:

```text
governance.rpt_data_dictionary_search
```

Visuals:

- KPI cards
- Search slicer/text filter on `search_text`
- Slicers: layer, domain, workspace_name, lakehouse_name, schema_name, owner_team, status
- Result table with table/column context

### Page 2: Table Detail

Use:

```text
governance.dim_data_object
governance.dim_column
```

Show:

- table_description
- grain_description
- recommended_usage
- owner_team
- refresh_frequency
- refresh_sla
- column list

### Page 3: Column Dictionary

Use:

```text
governance.dim_column
```

Show:

- table_name
- column_name
- display_column_name
- data_type
- business_definition
- calculation_logic
- usage_note
- example_value

### Page 4: Maintenance

Use:

```text
governance.rpt_missing_definition
governance.rpt_manual_table_orphan
governance.rpt_manual_column_orphan
```

Show missing definitions and manual orphan issues.
