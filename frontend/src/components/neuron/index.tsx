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
  const { selectedNode, selected } = useSelector((v: RootState) => v.neuron);
  const dispatch = useAppDispatch();
  const [studyList, setStudyList] = useState<Neuron[]>([]);
  const [repititionDay, setRepititionDay] = useState<number>();
  const [showEditModal, setShowEditModal] = useState(!!selected);
  const [showStudyModal, setShowStudyModal] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "c") {
      e.stopPropagation();
      // TODO solve keypress feature generally
      // setShowEditModal(true);
    }
  };

  const onSave = (neuron: Neuron) => {
    dispatch(thunkUpdateNeuron(neuron));
    setStudyList(studyList.map((v) => (v.id === neuron.id ? neuron : v)));
    setHasChanged(true);
    openNotification(neuron);
  };

  const setActive = (neuron: any) => {
    dispatch(setNeuron(neuron));
  };

  const openNotification = (neuron?: Neuron) => {
    notification.info({
      message: `${neuron?.title}`,
      description: "New update",
      placement: "bottomLeft",
    });
  };

  const onModalClose = () => {
    if (hasChanged) {
      dispatch(thunkFetchConnectedNeurons(selectedNode));
      setHasChanged(false);
    }
    setShowEditModal(false);
    setShowStudyModal(false);
    setActive(undefined);
    setStudyList([]);
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

  const onStudy = (itemsToStudy: Neuron[]) => {
    setStudyList(itemsToStudy.sort(comparator));
    if (itemsToStudy.length > 0) {
      setActive(itemsToStudy[0]);
      setShowStudyModal(true);
    } else {
      message.info("No neurons to study on this day");
    }
  };

  const comparator = (a: Neuron, b: Neuron) => {
    if (a.created == undefined && b.created == undefined) return 0;
    if (a.created == undefined) return 1;
    if (b.created == undefined) return -1;
    return +b.created - +a.created;
  };

  return (
    <div style={{ fontSize: 14 }}>
      <FlexRow>
        <CategoryTree />
        <NeuronTable onClick={onClickNeuron} onStudy={onStudy} />
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
        neuron={selected}
        visible={showEditModal}
        onClose={onModalClose}
        onSave={onSave}
      />
      <StudyModal
        neurons={studyList}
        repititionForSingleDay={repititionDay}
        visible={showStudyModal}
        onClose={onModalClose}
        onSave={onSave}
      />
    </div>
  );
};

export default Ilearn;
