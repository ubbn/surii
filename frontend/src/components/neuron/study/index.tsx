import {
  ExclamationCircleOutlined,
  ExpandAltOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Modal, Rate, Segmented, Space, Switch, message } from "antd";
import { differenceInCalendarDays } from "date-fns";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FlexRow } from "../../../common";
import { setNeuron } from "../../../redux/neuronSlice";
import { RootState } from "../../../redux/store";
import { getDateFromStr } from "../utils";

const sizeOptions = [
  { label: "Small", value: 700 },
  { label: "Medium", value: 1000 },
  { label: "Large", value: 1300 },
];

const rateToolTips = [
  "Sorry, completely forgot (0)",
  "Oops, almost forgot",
  "Hmm, it was hard",
  "Okayish",
  "Okay",
  "Clearly recalls (5)",
];

type Props = {
  neurons: Neuron[];
  repititionForSingleDay?: number;
  visible: boolean;
  onClose: () => void;
  onSave: (neuron: Neuron) => void;
};

const StudyModal = ({
  visible,
  repititionForSingleDay,
  onClose,
  onSave,
  neurons,
}: Props) => {
  const { studyDate, selected } = useSelector((v: RootState) => v.neuron);
  const [index, setIndex] = React.useState<number>(0);
  const [item, setItem] = React.useState<Neuron | undefined>(selected);
  const [rate, setRate] = React.useState<number | undefined>();
  const [modalSize, setModalSize] = React.useState<number | string>(700);
  const [preview, setPreview] = React.useState<boolean>(false);
  const [pristine, setPristine] = React.useState<boolean>(true);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (selected && visible) {
      setItem(selected);
      setPristine(true);
      const score = getScore(selected);
      setRate(score);
    }
  }, [selected]);

  React.useEffect(() => {
    if (index >= 0 && index < neurons.length) {
      dispatch(setNeuron(neurons[index]));
    }
    setPreview(false);
  }, [index]);

  React.useEffect(() => {
    if (!visible) {
      dispatch(setNeuron(undefined));
      setIndex(0);
      setPreview(false);
    }
  }, [visible]);

  const getThatFuckingDay = () => {
    if (neurons.length === 0) {
      return repititionForSingleDay;
    }
    return getIntervalDay();
  };

  const getIntervalDay = () => {
    const created = getDateFromStr(selected?.created);
    if (created) {
      const diff = differenceInCalendarDays(studyDate || new Date(), created);
      return diff;
    }
    return undefined;
  };

  const saveNeuron = () => {
    setPristine(true);
    item && onSave(item);
  };

  const onEditDetail = () => {
    message.warning("No implemented yet");
    // item && navigate(`learn/${item.id}`);
  };

  const checkPristine = (newItem: any) => {
    if (selected && newItem) {
      return getScore(selected) === getScore(newItem);
    }
    return false;
  };

  const onRate = (value: number) => {
    const memoValue = value === 0 ? undefined : value - 1;
    const repititionDay = getThatFuckingDay();
    if (repititionDay && item) {
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
      setRate(getScore(newItem));
    } else {
      message.error("Repitition day has invalid value: " + repititionDay);
    }
  };

  const getScore = (neuron: Neuron) => {
    const repititionDay = getThatFuckingDay();
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

  const onPrevious = () =>
    setIndex(index === 0 ? neurons.length - 1 : index - 1);

  const onNext = () => setIndex(index >= neurons.length - 1 ? 0 : index + 1);

  return (
    <Modal
      width={modalSize}
      title={
        <FlexRow style={{ justifyContent: "space-between" }}>
          <h2 style={{ marginBottom: 0 }}>{selected?.title}</h2>
          <div style={{ marginRight: 40, color: "grey", fontWeight: "normal" }}>
            Study at <strong>day {getThatFuckingDay()}</strong>
          </div>
        </FlexRow>
      }
      open={visible}
      style={{ padding: 0 }}
      onCancel={onModalClose}
      footer={[
        <FlexRow key="foot" style={{ justifyContent: "space-between" }}>
          {neurons.length > 0 && (
            <div>
              <Button onClick={onPrevious}>{"<"}</Button>
              <span style={{ margin: "0 15px", fontWeight: "bold" }}>
                {index + 1} of {neurons.length}
              </span>
              <Button onClick={onNext}>{">"}</Button>
            </div>
          )}
          <div />
          <Button key="close" onClick={onModalClose}>
            Close
          </Button>
        </FlexRow>,
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
          <FlexRow>
            <div style={{ border: "1px solid #d9d9d9", marginRight: 10 }}>
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
