import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Tour, TourProps, message, notification } from "antd";
import { useEffect, useRef, useState } from "react";
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
import { Anchor, compareNeurons } from "./utils";
import Tooltip from "../../common/tooltip";
import { styled } from "styled-components";

const TourButton = styled.div`
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer;
`;

const Ilearn = () => {
  const refAddNeuron = useRef(null);
  const refCategoryControl = useRef<any>(null);
  const refCategoryFilter = useRef<any>(null);
  const refStudyButton = useRef<any>(null);
  const refIntervals = useRef<any>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [hasChanged, setHasChanged] = useState(false);
  const { selectedNode, selected } = useSelector((v: RootState) => v.neuron);
  const dispatch = useAppDispatch();
  const [studyList, setStudyList] = useState<Neuron[]>([]);
  const [repititionDay, setRepititionDay] = useState<number>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStudyModal, setShowStudyModal] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const steps: TourProps["steps"] = [
    {
      title: "Control categories",
      description:
        "Before adding something new your have learnt, it is good idea to create a category. Here you can add/edit/remove categories",
      target: () => refCategoryControl.current,
    },
    {
      title: "Filter categories",
      description:
        "As you add more categories or nested categories, filter option will make sense to find the ones you look for. Type your search string in input box.",
      target: () => refCategoryFilter.current,
    },
    {
      title: "Add a new",
      description:
        "Add your newly learnt items by openning up new modal window.",
      target: () => refAddNeuron.current,
    },
    {
      title: "Study today",
      description: "It will list all the items that are due to study today.",
      target: () => refStudyButton.current,
    },
    {
      title: "Study intervals",
      description: "Choose pre-defined frequency of study.",
      target: () => refIntervals.current,
    },
  ];

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
        // Clicked on repetition day columns
        setShowStudyModal(true);
        setRepititionDay(day);
        setStudyList([neuron])
      } else if (columnId === 2) {
        // Clicked on category column
        dispatch(setSelectedNode(neuron?.ntree));
      } else {
        // Clicked on itself
        setShowEditModal(true);
        setActive(neuron);
      }
    } catch (error: any) {
      message.error(error);
      setActive(undefined);
    }
  };

  const onClickStudyButton = (itemsToStudy: Neuron[]) => {
    setStudyList(itemsToStudy.sort(compareNeurons));
    setRepititionDay(undefined);
    if (itemsToStudy.length > 0) {
      setShowStudyModal(true);
    } else {
      message.info("No neurons to study on this day");
    }
  };

  return (
    <div style={{ fontSize: 14 }}>
      <FlexRow>
        <CategoryTree tourRefs={[refCategoryFilter, refCategoryControl]} />
        <NeuronTable
          onClick={onClickNeuron}
          onStudy={onClickStudyButton}
          tourRefs={[refStudyButton, refIntervals]}
        />
      </FlexRow>
      <Anchor>
        <Tooltip text="Take a tour">
          <TourButton onClick={() => setOpen(true)}>
            <QuestionCircleOutlined style={{ fontSize: 20 }} />
          </TourButton>
        </Tooltip>
        <Tooltip text="Add a new neuron">
          <Button
            ref={refAddNeuron}
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
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
};

export default Ilearn;
