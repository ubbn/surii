import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  ExpandAltOutlined,
  RetweetOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { Button, Input, Modal, Popconfirm, Segmented, Space } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FlexRow } from "../../common";

import { useNavigate } from "react-router-dom";
import DatePicker from "../../common/DatePicker";
import { thunkDeleteNeuron } from "../../redux/neuronSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import _TreeSelect from "./treeselect";
import { getDateFromStr, getTimeStamp } from "./utils";

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

const EditModal = ({ visible, onClose, neuron = empty, onSave }: Props) => {
  const [initial, setInitial] = React.useState<any>(neuron);
  const [item, setItem] = React.useState<Neuron>(neuron);
  const [error, setError] = React.useState<any>();
  const [modalSize, setModalSize] = React.useState<number | string>(1000);
  const [pristine, setPristine] = React.useState<boolean>(true);
  const { selectedNode } = useSelector((v: RootState) => v.neuron);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    setItem({ ...neuron, ntree: neuron.ntree || selectedNode });
    setError(undefined);
    setInitial(neuron);
    setPristine(true);
  }, [neuron]);

  useEffect(() => {
    setItem({ ...neuron, ntree: selectedNode });
  }, [selectedNode]);

  const onDateChange = (date: Date | null, dateStr: string) => {
    const newItem = {
      ...item,
      created: dateStr ? getTimeStamp(date) : undefined,
    };
    setPristine(checkPristine(newItem));
    setItem(newItem);
  };

  const saveNeuron = () => {
    if (!item?.title) {
      setError({ ...error, title: "error" });
    } else if (!item?.detail) {
      setError({ ...error, detail: "error" });
    } else {
      onSave(item);
      setPristine(true);
      setInitial(item);
      return true;
    }
    return false;
  };

  const onEditDetail = () => {
    item && navigate(`/learn/${item.id}/edit`);
  };

  const checkPristine = (newItem: any) => {
    if (initial && newItem) {
      return (
        initial?.created === newItem?.created &&
        initial?.title === newItem?.title &&
        initial?.detail === newItem?.detail &&
        initial?.ntree === newItem?.ntree
      );
    }
    return false;
  };

  const onInputChange = (key: string, value: string | number) => {
    const newItem = {
      ...item,
      [key]: value,
    };
    setPristine(checkPristine(newItem));
    setItem(newItem);
    setError({
      ...error,
      [key]: "",
    });
  };

  const onDelete = () => {
    if (item.id !== undefined) {
      dispatch(thunkDeleteNeuron(item.id, selectedNode));
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
                danger
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
            value={item.title}
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
            onChange={(treeNodeKey) =>
              onInputChange("ntree", treeNodeKey as number)
            }
          />
          <Button
            type="link"
            title="Clean modal"
            onClick={() => {
              setItem(empty);
              setInitial(empty);
            }}
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
        <MDEditor
          overflow={false}
          autoFocus
          value={item?.detail}
          onChange={(v) => onInputChange("detail", v || "")}
          preview="edit"
          height={450}
          style={{ width: "100%" }}
          components={{
            toolbar: (command, disabled, executeCommand) => {
              if (command.keyCommand === "code") {
                return (
                  <button
                    aria-label="Insert code"
                    disabled={disabled}
                    onClick={(evn) => {
                      evn.stopPropagation();
                      executeCommand(command, command.groupName);
                    }}
                  >
                    Code
                  </button>
                );
              }
              return null;
            },
          }}
        />
      </Space>
    </Modal>
  );
};

export default EditModal;
