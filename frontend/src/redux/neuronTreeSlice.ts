import axios from "axios";
import { AppDispatch, AppThunk } from "./store";
import { API_NEURON_TREE, getUserEmail } from "./utils";
import { batch } from "react-redux";
import { fetchTree, getResponseMessage } from "./neuronSlice";
import { actionFinish, actionStart } from "./mainSlice";

const url = () => API_NEURON_TREE + "?user=" + getUserEmail();

export const thunkFetchNeuronTrees = (): AppThunk => {
  return (dispatch) => {
    dispatch(actionStart());
    return axios
      .get(url())
      .then(({ data }) => {
        batch(() => {
          dispatch(fetchTree({ data }));
          dispatch(getResponseMessage({}));
          dispatch(actionFinish());
        });
      })
      .catch(handleError(dispatch));
  };
};

export const thunkUpdateTreeNode = (item: NTree): AppThunk => {
  return (dispatch) => {
    dispatch(actionStart());
    return axios
      .post(API_NEURON_TREE, { ...item, user: getUserEmail() })
      .then(({ data }) => {
        const message = "Updated to " + data?.title;
        dispatch(getResponseMessage({ message, status: 200 }));
        dispatch(actionFinish());
      })
      .then(() => dispatch(thunkFetchNeuronTrees()))
      .catch(handleError(dispatch));
  };
};

export const thunkDeleteTreeNode = (id: number): AppThunk => {
  return (dispatch) => {
    dispatch(actionStart());
    return axios
      .delete(url() + `&id=${id}`)
      .then((response) => {
        const { data, status } = response;
        const message = data.length + " node(s) are deleted";
        dispatch(getResponseMessage({ message, status }));
        dispatch(actionFinish());
      })
      .then(() => {
        dispatch(thunkFetchNeuronTrees());
      })
      .catch(handleError(dispatch));
  };
};

export const handleError = (dispatch: AppDispatch) => (error: any) => {
  console.log("error", error);
  if (error?.response) {
    const { data, status } = error.response;
    dispatch(getResponseMessage({ ...data, status }));
  } else {
    dispatch(getResponseMessage({ message: error?.message }));
  }

  dispatch(actionFinish());
};
