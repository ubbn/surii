import {
  combineReducers,
  configureStore,
  Action,
  ThunkAction,
} from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { useDispatch } from "react-redux";
import mainReducer from "./mainSlice";
import neuronReducer from "./neuronSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  main: mainReducer,
  neuron: neuronReducer,
});

const store: any = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
