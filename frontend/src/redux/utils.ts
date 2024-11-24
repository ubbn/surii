import { getAuthenticationData } from "../common/storage";
import { actionFail } from "./mainSlice";
import { AppDispatch } from "./store";
import axios from "axios";

export const handleError = (dispatch: AppDispatch) => (error: any) => {
  console.error(error);
  dispatch(actionFail({ error }));
};

export const getUserEmail = () => {
  const token = getAuthenticationData();
  return token?.user?.email || "";
};

export const getIdToken = () => {
  const token = getAuthenticationData();

  // TODO there is bug that this method is only called first time, not called everytime
  console.log("Token read from localstorage: ", token?.credential);

  return token?.user?.stsTokenManager?.accessToken || "";
};

axios.defaults.headers.common = { Authorization: `Bearer ${getIdToken()}` };
export default axios;

export const API_NEURON = import.meta.env.VITE_NEURON_API;
export const API_NEURON_TREE = import.meta.env.VITE_NTREE_API;
