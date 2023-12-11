import { PlusOutlined } from "@ant-design/icons";
import { Button, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FlexRow } from "../../common";

import {
  setNeuron,
  setSelectedNode,
  thunkFetchConnectedNeurons,
  thunkUpdateNeuron,
} from "../../redux/neuronSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import EditModal from "./Modal";
import StudyModal from "./study";
import NeuronTable from "./table";
import CategoryTree from "./tree";
import { Anchor } from "./utils";
import Tooltip from "../../common/tooltip";

const Ilearn = () => {
  const [hasChanged, setHasChanged] = useState(false);
  const {
    items,
    selectedNode,
    selected: active,
  } = useSelector((v: RootState) => v.neuron);
  const dispatch = useAppDispatch();
  const [repititionDay, setRepititionDay] = useState<number>();
  const [showEditModal, setShowEditModal] = useState(!!active);
  const [showStudyModal, setShowStudyModal] = useState(!!active);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "c") {
      e.stopPropagation();
      setShowEditModal(true);
    }
  };

  const onSave = (neuron: Neuron) => {
    dispatch(thunkUpdateNeuron(neuron));
    setHasChanged(true);
  };

  const setActive = (neuron: any) => {
    dispatch(setNeuron(neuron));
  };

  const openNotification = (neuron?: Neuron) => {
    notification.info({
      message: `${neuron?.title}`,
      description: "New update",
      placement: "bottomRight",
    });
  };

  const onModalClose = () => {
    if (hasChanged) {
      dispatch(thunkFetchConnectedNeurons(selectedNode));
      setHasChanged(false);
      openNotification(active);
    }
    setShowEditModal(false);
    setShowStudyModal(false);
    setActive(undefined);
  };

  const onClickNeuron = (neuron: Neuron, columnId: number, day?: number) => {
    try {
      if (columnId >= 3) {
        setShowStudyModal(true);
        setRepititionDay(day);
        setActive(neuron);
      } else if (columnId === 2) {
        dispatch(setSelectedNode(neuron?.ntree));
      } else {
        setShowEditModal(true);
        setActive(neuron);
      }
    } catch (e: any) {
      message.error(e);
      setActive(undefined);
    }
  };

  return (
    <div style={{ fontSize: 14 }}>
      <FlexRow>
        <CategoryTree />
        <NeuronTable neurons={items} onClick={onClickNeuron} />
      </FlexRow>
      <Anchor>
        <Tooltip text="Add a new neuron">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setShowEditModal(!showEditModal)}
          />
        </Tooltip>
      </Anchor>
      <EditModal
        neuron={active}
        visible={showEditModal}
        onClose={onModalClose}
        onSave={onSave}
      />
      <StudyModal
        neuron={active}
        repititionDay={repititionDay}
        visible={showStudyModal}
        onClose={onModalClose}
        onSave={onSave}
      />
    </div>
  );
};

export default Ilearn;
