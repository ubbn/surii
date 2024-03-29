import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import qs from "query-string";
import { batch } from "react-redux";
import { buildTree } from "../components/neuron/tree/utils";
import { actionFinish, actionStart, resetAction } from "./mainSlice";
import { AppThunk } from "./store";
import axios, { API_NEURON, getUserEmail, handleError } from "./utils";

export type NeuronState = {
  selected?: Neuron;
  items: Neuron[];
  leaves: NTree[];
  tree: NTree[];
  backend?: any;
  selectedNode?: any;
  studyDate?: Date;
};

const initialState: NeuronState = {
  items: [],
  leaves: [],
  tree: [],
};

const neuronSlice = createSlice({
  name: "neurons",
  initialState,
  reducers: {
    addNeuron: (state: NeuronState, action: any) => {
      const neuron = action.payload;
      let existingId = undefined;
      state.items.find((v, i) => {
        if (v.id === neuron.id) {
          existingId = i;
          return true;
        }
        return false;
      });
      if (existingId !== undefined) {
        state.items[existingId] = neuron;
      } else {
        state.items = state.items.concat([neuron]);
      }
    },
    removeNeuron: (state: NeuronState, action: any) => {
      const id = action.payload;
      state.items = state.items.filter((v) => v.id !== +id);
    },
    setNeuron: (state: NeuronState, action: PayloadAction<any>) => {
      state.selected = action.payload;
    },
    fetchNeurons: (state: NeuronState, action: PayloadAction<any>) => {
      const { data } = action.payload;
      state.items = data as any[];
    },
    deleteNodeFromTree: (state: NeuronState, action: PayloadAction<any>) => {
      const { data } = action.payload;
      state.leaves = data as any[];
    },
    fetchTree: (state: NeuronState, action: PayloadAction<any>) => {
      const { data } = action.payload;
      state.leaves = data as any[];
      state.tree = buildTree(data);
    },
    getResponseMessage: (state: NeuronState, action: PayloadAction<any>) => {
      state.backend = action.payload;
    },
    setSelectedNode: (state: NeuronState, action: PayloadAction<any>) => {
      state.selectedNode = action.payload;
    },
    setStudyDate: (state: NeuronState, action: PayloadAction<any>) => {
      state.studyDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAction, () => {
      return initialState;
    });
  },
});

export default neuronSlice.reducer;
export const {
  addNeuron,
  removeNeuron,
  setNeuron,
  fetchNeurons,
  deleteNodeFromTree,
  fetchTree,
  getResponseMessage,
  setSelectedNode,
  setStudyDate,
} = neuronSlice.actions;

const url = () => API_NEURON + "?user=" + getUserEmail();

export const thunkGetNeuron = (id: any): AppThunk => {
  return (dispatch) => {
    dispatch(actionStart());
    return axios
      .get(url() + `&id=${id}`)
      .then(({ data }) => {
        batch(() => {
          dispatch(setNeuron(data));
          dispatch(actionFinish());
        });
      })
      .catch(handleError(dispatch));
  };
};

export const thunkFetchNeurons = (params?: any): AppThunk => {
  return (dispatch) => {
    dispatch(actionStart());
    return axios
      .get(url() + (params ? "&" + qs.stringify(params) : ""))
      .then(({ data }) => {
        batch(() => {
          dispatch(fetchNeurons({ data }));
          dispatch(actionFinish());
        });
      })
      .catch(handleError(dispatch));
  };
};

export const thunkFetchConnectedNeurons = (treeId: any): AppThunk => {
  if (treeId) {
    return (dispatch) => {
      dispatch(actionStart());
      return axios
        .get(url() + `&tree=${treeId}`)
        .then(({ data }) => {
          dispatch(fetchNeurons({ data }));
          dispatch(getResponseMessage({}));
          dispatch(actionFinish());
        })
        .catch(handleError(dispatch));
    };
  } else {
    return (dispatch) => {
      dispatch(thunkFetchNeurons());
    };
  }
};

export const thunkUpdateNeuron = (item: Neuron): AppThunk => {
  return (dispatch) => {
    dispatch(actionStart());
    return axios
      .post(url(), { user: getUserEmail(), ...item })
      .then(({ data }) => {
        dispatch(setNeuron(data));
        dispatch(actionFinish());
      })
      .catch(handleError(dispatch));
  };
};

export const thunkDeleteNeuron = (id: number, selectedNode: any): AppThunk => {
  return (dispatch) => {
    dispatch(actionStart());
    return axios
      .delete(url() + "&id=" + id)
      .then(() => dispatch(actionFinish()))
      .then(() => dispatch(thunkFetchConnectedNeurons(selectedNode)))
      .catch(handleError(dispatch));
  };
};
