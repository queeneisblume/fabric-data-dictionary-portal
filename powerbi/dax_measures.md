# DAX Measures

```DAX
Total Tables =
DISTINCTCOUNT ( dim_data_object[data_object_id] )
```

```DAX
Total Columns =
COUNTROWS ( dim_column )
```

```DAX
Active Tables =
CALCULATE (
    DISTINCTCOUNT ( dim_data_object[data_object_id] ),
    dim_data_object[status] = "Active"
)
```

```DAX
Missing Table Description =
CALCULATE (
    DISTINCTCOUNT ( dim_data_object[data_object_id] ),
    dim_data_object[table_definition_status] = "Missing"
)
```

```DAX
Missing Grain Description =
CALCULATE (
    DISTINCTCOUNT ( dim_data_object[data_object_id] ),
    dim_data_object[grain_definition_status] = "Missing"
)
```

```DAX
Missing Column Definition =
CALCULATE (
    COUNTROWS ( dim_column ),
    dim_column[column_definition_status] = "Missing"
)
```

```DAX
Column Definition Coverage % =
VAR total_columns = [Total Columns]
VAR missing_columns = [Missing Column Definition]
RETURN
DIVIDE ( total_columns - missing_columns, total_columns )
```

```DAX
Last Metadata Sync =
MAX ( dim_data_object[last_metadata_sync_at] )
```
