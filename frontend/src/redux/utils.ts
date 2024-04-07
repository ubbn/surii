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
  return token?.credential?.idToken || "";
};

axios.defaults.baseURL = "http://localhost:1010/";
axios.defaults.headers.common = { Authorization: `Bearer ${getIdToken()}` };
export default axios;

export const API_NEURON =
  import.meta.env.VITE_NEURON_API ??
  "https://ssps2j1f24.execute-api.eu-north-1.amazonaws.com/prod/neuron";
export const API_NEURON_TREE =
  import.meta.env.VITE_NTREE_API ??
  "https://6nlg5feov4.execute-api.eu-north-1.amazonaws.com/prod/ntree";
