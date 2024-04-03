import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  ExpandAltOutlined,
  RetweetOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import Editor from "../../common/editor/editor";
import { Button, Input, Modal, Popconfirm, Segmented, Space } from "antd";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FlexRow } from "../../common";

import { useNavigate } from "react-router-dom";
import DatePicker from "../../common/DatePicker";
import { thunkDeleteNeuron } from "../../redux/neuronSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import _TreeSelect from "./treeselect";
import { getDateFromStr, getTimeStamp } from "./utils";
import { styled } from "styled-components";

const sizeOptions = [
  { label: "S", value: 700 },
  { label: "M", value: 1000 },
  { label: "L", value: 1300 },
];

export const empty: Neuron = {
  title: "",
  detail: "",
  memo: {},
  created: getTimeStamp(new Date()),
};

type Props = {
  neuron?: Neuron;
  visible: boolean;
  onClose: () => void;
  onSave: (neuron: Neuron) => void;
};

const EditModal = ({ visible, onClose, neuron, onSave }: Props) => {
  const [initial, setInitial] = React.useState<Neuron>(empty);
  const [item, setItem] = React.useState<Neuron>(empty);
  const [pristine, setPristine] = React.useState<boolean>(true);

  const [error, setError] = React.useState<any>();
  const [modalSize, setModalSize] = React.useState<number | string>(1000);
  const { selectedNode } = useSelector((v: RootState) => v.neuron); // Selected tree node if any

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editorRef = useRef<any>()

  React.useEffect(() => {
    if (neuron) {
      resetTo(neuron)
      setError(undefined);
    }
  }, [neuron]);

  // Set selected tree node as category when adding a new neuron
  useEffect(() => {
    if (visible && neuron === undefined) {
      resetTo({ ...empty, ntree: selectedNode })
    }
  }, [visible]);

  const resetTo = (value: any) => {
    setInitial(value)
    setItem(value)
    setPristine(true);
  }

  const onDateChange = (date: Date, dateStr: string | string[]) => {
    const newItem = {
      ...item,
      created: dateStr ? getTimeStamp(date) : undefined,
    };
    setPristine(compare(initial, newItem));
    setItem(newItem);
  };

  const saveNeuron = () => {
    if (!item?.title) {
      setError({ ...error, title: "error" });
    } else if (!item?.detail) {
      setError({ ...error, detail: "error" });
    } else {
      onSave(item);
      resetTo(item)
    }
  };

  const onEditDetail = () => {
    item && navigate(`/learn/${item.id}/edit`);
  };

  const compare = (one: any, other: any) => {
    if (one && other) {
      return (
        one?.created === other?.created &&
        one?.title === other?.title &&
        one?.detail === other?.detail &&
        one?.ntree === other?.ntree
      );
    }
    return false;
  };

  const onInputChange = (key: string, value: string | number) => {
    const newItem = {
      ...item,
      [key]: value,
    };
    const stats = compare(initial, newItem)
    setPristine(stats);
    setItem(newItem);
    setError({
      ...error,
      [key]: "",
    });
  };

  const onDelete = () => {
    if (item.id !== undefined) {
      dispatch(thunkDeleteNeuron(item.id, selectedNode));
      resetTo(empty)
      onClose();
    }
  };

  const onRestartNeuron = () => {
    if (item.id !== undefined) {
      onSave({
        title: item.title,
        detail: item.detail,
        ntree: item.ntree,
        created: getTimeStamp(new Date()),
      } as Neuron);
    }
  };

  const onModalClose = () => {
    if (pristine) {
      resetTo(empty)
      onClose();
    } else {
      Modal.confirm({
        title: "Unsaved changes",
        icon: <ExclamationCircleOutlined />,
        content: "Do you want to discard unsaved changes?",
        onOk() {
          resetTo(empty)
          onClose();
        },
      });
    }
  };

  return (
    <$Modal
      width={modalSize}
      title={neuron?.id ? "Edit" : "Add a new"}
      okButtonProps={{ style: { display: "none" } }}
      open={visible}
      onCancel={onModalClose}
      footer={[
        <FlexRow key="foot" style={{ justifyContent: "space-between" }}>
          <div>
            <Popconfirm
              key="delete"
              placement="bottomRight"
              title={"Устгамаар байна уу?"}
              onConfirm={onDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                title="Устгах"
                disabled={item.id === undefined}
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
            <Popconfirm
              key="reset"
              placement="bottomRight"
              title={"Шинээр эхнээс нь эхлэх үү?"}
              onConfirm={onRestartNeuron}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                title="Эхлүүлэх"
                disabled={item.id === undefined}
                icon={<RetweetOutlined />}
                color="green"
              />
            </Popconfirm>
          </div>
          <div>
            <Button
              key="save"
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
        style={{ width: "100%", minHeight: +modalSize / 2 }}
      >
        <FlexRow>
          <Input
            key="title"
            status={error?.title}
            placeholder="What you've learnt"
            value={item.title || ""}
            style={{ marginRight: 10 }}
            onChange={(e) => onInputChange("title", e.target.value)}
          />
          <div style={{ width: "30%" }}>
            <DatePicker
              style={{ width: "100%" }}
              onChange={onDateChange}
              defaultValue={new Date()}
              allowClear={true}
              value={item.created ? getDateFromStr(item.created) : undefined}
            />
          </div>
        </FlexRow>
        <FlexRow style={{ alignItems: "center" }}>
          <_TreeSelect
            selected={item.ntree}
            onChange={(treeNodeKey) => onInputChange("ntree", treeNodeKey as number)}
          />
          <Button
            type="link"
            title="Clean modal"
            onClick={() => resetTo(empty)}
          >
            Clean
          </Button>
          <Segmented
            options={sizeOptions}
            onChange={setModalSize}
            value={modalSize}
          />
          <Button
            style={{ marginLeft: 10, width: 70 }}
            icon={<ExpandAltOutlined />}
            onClick={onEditDetail}
            title="Show in full page"
            block
          />
        </FlexRow>
        <Editor
          editorRef={editorRef}
          text={initial.detail}
          onChange={(value) => {
            onInputChange("detail", value)
          }}
        />
      </Space>
    </$Modal>
  );
};

export default EditModal;


const $Modal = styled(Modal)`
  .ant-modal-body {
    display: flex;
  }

.ant-space-item:last-child {
    display: flex;
    height: 100%;
  }

`