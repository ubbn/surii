import { getAuthenticationData } from "../common/storage";
import { actionFail } from "./mainSlice";
import { AppDispatch } from "./store";

export const handleError = (dispatch: AppDispatch) => (error: any) => {
  console.error(error);
  dispatch(actionFail({ error }));
};

export const getUserEmail = () => {
  const token = getAuthenticationData();
  return token?.user?.email || "";
};

export const API_NEURON =
  "https://zv467817l5.execute-api.eu-north-1.amazonaws.com/prod/neuron";
export const API_NEURON_TREE =
  "https://vt66afp8r2.execute-api.eu-north-1.amazonaws.com/prod/ntree";
