import { combineReducers } from "@reduxjs/toolkit";
import {
  addScreenSlice,
  getListScreenSlice,
  softDeleteScreenSlice,
  getOneScreenSlice,
  editScreenSlice,
  addRamSlice,
  getOneRamSlice,
  getListRamSlice,
  softDeleteRamSlice,
  editRamSlice


} from "./slice";
const attributeReducer = combineReducers({
  addScreen: addScreenSlice,
  getListScreen:getListScreenSlice,
  softDeleteScreen:softDeleteScreenSlice,
  getOneScreen:getOneScreenSlice,
  editScreen:editScreenSlice,
  addRam:addRamSlice,
  getOneRam:getOneRamSlice,
  getListRam:getListRamSlice,
  softDeleteRam:softDeleteRamSlice,
  editRam:editRamSlice


});

export default attributeReducer;
