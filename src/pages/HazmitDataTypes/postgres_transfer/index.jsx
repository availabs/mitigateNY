import Create from './create';
import Table from "../../DataManager/DataTypes/gis_dataset/pages/Table";

const Config = {
    sourceCreate: {
        name: 'Create',
        component: Create
    },
    add_version: {
        name: "Add Version",
        path: "/add_version",
        component: Create,
    },
    table: {
        name: "Table",
        path: "/table",
        component: Table,
      },
}

export default Config;
