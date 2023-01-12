import { configureStore } from "@reduxjs/toolkit";
import userLoginSlice from "../slices/userLoginSlice";
import userRegisterSlice from "../slices/userRegisterSlice";
export const store = configureStore({
  reducer: {
    user: userLoginSlice,
    userRegister: userRegisterSlice,
  },
});
