//import { messages } from "../modules/avl-components/src";
import { Reducers, messages } from "~/modules/ams/src";
import { configureStore } from "@reduxjs/toolkit";

// import data_manager from "pages/DataManager/store";

export default configureStore({
  reducer: {
    ...Reducers,
    messages,
  },
});

