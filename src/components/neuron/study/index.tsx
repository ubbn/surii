import {
  ExclamationCircleOutlined,
  ExpandAltOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Modal, Rate, Segmented, Space, Switch, message } from "antd";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FlexRow } from "../../../common";
import { RootState } from "../../../redux/store";
import { getTimeStamp } from "../utils";

const sizeOptions = [
  { label: "Small", value: 700 },
  { label: "Medium", value: 1000 },
  { label: "Large", value: 1300 },
];

const rateToolTips = [
  "Completely forgot (0)",
  "1",
  "2",
  "3",
  "4",
  "Clearly recalls (5)",
];

export const empty: Neuron = {
  title: "",
  detail: "",
  memo: {},
  created: getTimeStamp(new Date()),
};

type Props = {
  neuron?: Neuron;
  repititionDay?: number;
  visible: boolean;
  onClose: () => void;
  onSave: (neuron: Neuron) => void;
};

const StudyModal = ({
  visible,
  onClose,
  onSave,
  neuron = empty,
  repititionDay,
}: Props) => {
  const [initial, setInitial] = React.useState<any>(neuron);
  const [item, setItem] = React.useState<Neuron>(neuron);
  const [rate, setRate] = React.useState<number | undefined>();
  const [modalSize, setModalSize] = React.useState<number | string>(700);
  const [preview, setPreview] = React.useState<boolean>(false);
  const [pristine, setPristine] = React.useState<boolean>(true);
  const { selectedNode } = useSelector((v: RootState) => v.neuron);
  const navigate = useNavigate();

  React.useEffect(() => {
    setItem(neuron);
    setInitial(neuron);
    setPristine(true);
    setPreview(false);
  }, [neuron]);

  useEffect(() => {
    setItem({ ...neuron, ntree: selectedNode });
  }, [selectedNode]);

  useEffect(() => {
    if (item) {
      setRate(getScore(item));
    }
  }, [item]);

  const saveNeuron = () => {
    setPristine(true);
    onSave(item);
    setInitial(item);
  };

  const onEditDetail = () => {
    item && navigate(`learn/${item.id}`);
  };

  const checkPristine = (newItem: any) => {
    if (initial && newItem) {
      return getScore(initial) === getScore(newItem);
    }
    return false;
  };

  const onRate = (value: number) => {
    const memoValue = value === 0 ? undefined : value - 1;
    if (repititionDay) {
      const day = `${repititionDay}`;
      const newItem = {
        ...item,
        memo: {
          ...item.memo,
          [day]: memoValue,
        },
      };
      setPristine(checkPristine(newItem));
      setItem(newItem);
    } else {
      message.error("Repitition day is invalid: " + repititionDay);
    }
  };

  const getScore = (neuron: Neuron) => {
    if (repititionDay && neuron?.memo) {
      const memoScore = neuron?.memo[`${repititionDay}`];
      if (memoScore !== undefined) {
        return +memoScore + 1;
      }
    }
    return 0; // Strangely, 0 means no value for Rate component
  };

  const onModalClose = () => {
    if (pristine) {
      onClose();
    } else {
      Modal.confirm({
        title: "Unsaved changes",
        icon: <ExclamationCircleOutlined />,
        content: "Do you want to discard unsaved changes?",
        onOk() {
          onClose();
        },
      });
    }
  };

  return (
    <Modal
      width={modalSize}
      title={
        <FlexRow style={{ justifyContent: "space-between" }}>
          <h2 style={{ marginBottom: 0 }}>{neuron?.title}</h2>
          <div style={{ marginRight: 40, color: "grey" }}>
            Day {repititionDay}
          </div>
        </FlexRow>
      }
      open={visible}
      style={{ padding: 0 }}
      onCancel={onModalClose}
      footer={[
        <Button key="close" onClick={onModalClose}>
          Close
        </Button>,
      ]}
    >
      <Space
        direction="vertical"
        style={{ width: "100%", minHeight: +modalSize / 2.7 }}
      >
        <FlexRow
          style={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <div>
            <Segmented
              options={sizeOptions}
              onChange={setModalSize}
              value={modalSize}
            />
            <Button
              style={{ margin: "0 10px", width: 35 }}
              icon={<ExpandAltOutlined />}
              onClick={onEditDetail}
              title="Show in full page"
              block
            />
          </div>
          <Switch
            title={`${preview ? "Hide" : "Show"} preview`}
            checkedChildren={
              <>
                <EyeOutlined /> shown
              </>
            }
            unCheckedChildren={
              <>
                <EyeInvisibleOutlined /> hidden
              </>
            }
            onChange={() => setPreview(!preview)}
            onClick={() => setPreview(!preview)}
            checked={preview}
          />
          <div style={{ border: "1px solid #d9d9d9", borderRadius: 3 }}>
            <Rate
              count={6}
              style={{ margin: "0 15px", color: "green" }}
              onChange={onRate}
              value={rate}
              tooltips={rateToolTips}
              character={(p) => p.index}
            />
          </div>
          <Button
            type="primary"
            disabled={pristine}
            icon={<SaveOutlined />}
            onClick={saveNeuron}
          />
        </FlexRow>
        {preview && (
          <$Wrapper>
            <ReactMarkdown children={item?.detail || ""} />
          </$Wrapper>
        )}
      </Space>
    </Modal>
  );
};

export default StudyModal;

const $Wrapper = styled.div`
  flex: 1;
  padding: 10px;
  max-width: 100%;
  & img {
    max-width: 100%;
  }
`;
