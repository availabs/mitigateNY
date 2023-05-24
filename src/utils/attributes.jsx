export const SourceAttributes = {
    "source_id": "source_id",
    "name": "name",
    "display_name": "display_name",
    "type": "type",
    "update_interval": "update_interval",
    "category": "category",
    "categories": "categories",
    "description": "description",
    "statistics": "statistics",
    "metadata": "metadata",
};

export const ViewAttributes = {
    "view_id" : "view_id",
    "source_id" : "source_id",
    "data_type" : "data_type",
    "interval_version" : "interval_version",
    "geography_version" : "geography_version",
    "version" : "version",
    "source_url" : "source_url",
    "publisher" : "publisher",
    "table_schema" : "table_schema",
    "table_name" : "table_name",
    "data_table" : "data_table",
    "download_url" : "download_url",
    "tiles_url" : "tiles_url",
    "start_date" : "start_date",
    "end_date" : "end_date",
    "last_updated" : "last_updated",
    "statistics" : "statistics",
    "metadata" : "metadata",
    "user_id" : "user_id",
    "etl_context_id" : "etl_context_id",
    "view_dependencies" : "view_dependencies",
    "active_start_timestamp" : "active_start_timestamp",
    "active_end_timestamp" : "active_end_timestamp",
    "_created_timestamp" : "_created_timestamp",
    "_modified_timestamp" : "_modified_timestamp"
};

export const getAttributes = (data) => {
    return Object.entries(data)
        .reduce((out,attr) => {
            const [k,v] = attr
            typeof v.value !== 'undefined' ?
                out[k] = v.value :
                out[k] = v
            return out
        },{})
};