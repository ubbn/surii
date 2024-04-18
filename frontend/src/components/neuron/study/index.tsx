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
import { useSelector } from "react-redux";
import styled from "styled-components";
import { FlexRow } from "../../../common";
import Editor from "../../../common/editor/editor";
import { RootState } from "../../../redux/store";
import { getDateFromStr } from "../utils";

const sizeOptions = [
  { label: "S", value: 700 },
  { label: "M", value: 1000 },
  { label: "L", value: 1300 },
];

const rateToolTips = [
  "Sorry, completely forgot (0)",
  "Oops, almost forgot",
  "Hmm, it was hard",
  "Okayish",
  "Okay",
  "Superb (5)",
];

type Props = {
  neurons: Neuron[];
  repititionForSingleDay?: number; // This value is set when repitation day cell is singly clicked
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
  const { studyDate } = useSelector((v: RootState) => v.neuron);
  const [index, setIndex] = React.useState<number>(0);
  const [item, setItem] = React.useState<Neuron | undefined>();
  const [rate, setRate] = React.useState<number | undefined>();
  const [modalSize, setModalSize] = React.useState<number | string>(700);
  const [preview, setPreview] = React.useState<boolean>(false);
  const [pristine, setPristine] = React.useState<boolean>(true);

  React.useEffect(() => {
    const score = getScore(neurons[index]);
    setRate(score)
    setItem(neurons[index])
    setPreview(false)
  }, [index])

  React.useEffect(() => {
    if (visible) {
      const score = getScore(neurons[index]);
      setRate(score);
      setItem(neurons[index])
      setIndex(0);
    } else {
      setPristine(true);
      setPreview(false);
    }
  }, [visible]);

  const getThatFuckingDay = (neuron?: Neuron) => {
    if (repititionForSingleDay) {
      return repititionForSingleDay;
    }
    const created = getDateFromStr(neuron?.created);
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

  const checkPristine = (one: any, other: any) => {
    if (one && other) {
      return getScore(one) === getScore(other) && one.detail === other.detail;
    }
    return false;
  };

  const onRate = (value: number) => {
    const memoValue = value === 0 ? undefined : value - 1;
    const repititionDay = getThatFuckingDay(item);
    if (repititionDay) {
      const day = `${repititionDay}`;
      const newItem = {
        ...item,
        memo: {
          ...item?.memo,
          [day]: memoValue,
        },
      };
      setPristine(checkPristine(neurons[index], newItem));
      setItem(newItem as Neuron)
      setRate(value);
    } else {
      message.error("Repitition day has invalid value: " + repititionDay);
    }
  };

  const getScore = (neuron: Neuron) => {
    const repititionDay = getThatFuckingDay(neuron);
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
    <$Modal
      width={modalSize}
      title={
        <FlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ marginBottom: 0 }}>{item?.title}</h2>
          <Switch
            title={`${preview ? "Hide" : "Show"} preview`}
            checkedChildren={<><EyeOutlined /> shown</>}
            unCheckedChildren={<><EyeInvisibleOutlined /> hidden</>}
            onChange={() => setPreview(!preview)}
            onClick={() => setPreview(!preview)}
            checked={preview}
          />
          <div style={{ marginRight: 40, color: "grey", fontWeight: "normal" }}>
            Study on <strong>day {getThatFuckingDay(item)}</strong>
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
          <div>
            <Button
              type="primary"
              disabled={pristine}
              icon={<SaveOutlined />}
              onClick={saveNeuron}
            >
              Save
            </Button>
            <Button key="close" onClick={onModalClose}>
              Close
            </Button>
          </div>
        </FlexRow>,
      ]}
    >
      <Space
        direction="vertical"
        style={{ width: "100%", minHeight: +modalSize / 2.7, justifyContent: "flex-start" }}
      >
        <FlexRow
          style={{ alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}
        >
          <div>
            <Segmented
              options={sizeOptions}
              onChange={setModalSize}
              value={modalSize}
              style={{ marginRight: 10 }}
            />
            <Button
              style={{ width: 35 }}
              icon={<ExpandAltOutlined />}
              onClick={onEditDetail}
              title="Show in full page"
              block
            />
          </div>
          <FlexRow>
            <div style={{ border: "1px solid #d9d9d9", borderRadius: 5 }}>
              <Rate
                count={6}
                style={{ margin: "5px 15px 4px", color: "green", minWidth: 108 }}
                onChange={onRate}
                value={rate}
                tooltips={rateToolTips}
                character={(p) => p.index}
              />
            </div>
          </FlexRow>
        </FlexRow>
        {preview && (
          <$Wrapper>
            <Editor
              text={neurons[index]?.detail}
              hideToolbar
              onChange={(value) => {
                if (item) {
                  const newItem = { ...neurons[index], detail: value }
                  setPristine(checkPristine(neurons[index], newItem))
                  setItem(newItem)
                }
              }}
            />
          </$Wrapper>
        )}
      </Space>
    </$Modal>
  );
};

export default StudyModal;

const $Wrapper = styled.div`
  flex: 1;
  height: 100%
  & img {
    max-width: 100%;
  }
`;

const $Modal = styled(Modal)`
  .ant-modal-body {
    display: flex;
  }

  .ant-space-item:last-child {
    display: flex;
    height: 100%;
  }
`
