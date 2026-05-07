# cfg_metadata_source Template

Do not commit the real config CSV if it exposes internal workspace/lakehouse names.

Required fields:

| field | description |
|---|---|
| source_id | Unique source identifier |
| layer | Bronze/Silver/Gold |
| workspace_name | Fabric workspace name |
| lakehouse_name | Fabric lakehouse name |
| schema_name | Schema name; leave blank for non-schema lakehouse |
| domain | Business/data domain |
| is_active | TRUE/FALSE |
| include_table_pattern | Regex include pattern, usually `.*` |
| exclude_table_pattern | Regex exclude pattern |
| owner_team | Default owner team |
| scan_row_count | TRUE/FALSE; recommend FALSE for MVP |

Example values should be managed outside GitHub.
