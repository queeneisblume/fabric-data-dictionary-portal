# Manual Dictionary Template

Do not commit the real Excel file if it contains internal table definitions.

## Sheet: table_definition

Required keys:

```text
workspace_name
lakehouse_name
schema_name
table_name
```

Business fields:

```text
domain
business_process
table_description
grain_description
recommended_usage
owner_team
business_owner
refresh_frequency
refresh_sla
status
```

## Sheet: column_definition

Required keys:

```text
workspace_name
lakehouse_name
schema_name
table_name
column_name
```

Business fields:

```text
business_definition
technical_definition
calculation_logic
example_value
usage_note
source_table
source_column
display_column_name
is_visible_in_portal
```

## Key rules

- Do not change actual `table_name` or `column_name` for display purposes.
- Use `display_column_name` for friendly names.
- Leave unknown definitions blank; the pipeline will mark them as `Missing`.
- `is_visible_in_portal = FALSE` hides technical columns from the search portal.
