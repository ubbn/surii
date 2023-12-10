import { Input, message, Modal } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { thunkUpdateTreeNode } from "../../../redux/neuronTreeSlice";
import { RootState, useAppDispatch } from "../../../redux/store";
import _TreeSelect from "../treeselect";
import { getTimeStamp } from "../utils";
import { InputStatus } from "antd/lib/_util/statusUtils";

const _Modal = ({
  open,
  onClose,
  selectedKey,
  isAddNew,
}: {
  open: boolean;
  selectedKey?: React.Key;
  onClose: () => void;
  isAddNew: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>();
  const [status, setStatus] = useState<InputStatus>();
  const [selectedNode, setSelectedNode] = React.useState<NTree>();
  const { leaves } = useSelector((v: RootState) => v.neuron);

  React.useEffect(() => {
    if (isAddNew) {
      setTitle("");
    } else {
      const foundNode = leaves.find((x) => x.key === selectedKey);
      setSelectedNode(foundNode);
      setTitle(foundNode?.title);
    }
  }, [open]);

  const handleOk = () => {
    if (isAddNew) {
      if (title && title.trim()) {
        dispatch(
          thunkUpdateTreeNode({
            title,
            key: +getTimeStamp(new Date()) as React.Key,
            parent: selectedKey,
          })
        );
        onClose();
      } else {
        setStatus("error");
      }
    } else if (selectedNode) {
      if (selectedKey === selectedNode.parent) {
        message.warning("You can't select itself for parent");
      } else {
        dispatch(thunkUpdateTreeNode(selectedNode));
        onClose();
      }
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const onChange = (a: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedNode({ ...selectedNode, title: a.target.value } as NTree);
    setTitle(a.target.value);
    if (a.target.value) {
      setStatus("");
    } else {
      setStatus("error");
    }
  };

  const onSelectNode = (onSelectedNodeKey: React.Key) => {
    if (selectedKey === onSelectedNodeKey) {
      message.warning("You can't select itself for parent");
      setSelectedNode({ ...selectedNode, parent: "" } as NTree);
    } else {
      setSelectedNode({ ...selectedNode, parent: onSelectedNodeKey } as NTree);
    }
  };

  return (
    <Modal
      title={isAddNew ? "Add new category" : `Update ${title}`}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <_TreeSelect
        selected={isAddNew ? selectedKey : selectedNode?.parent}
        onChange={onSelectNode}
      />
      <Input
        status={status}
        placeholder="Category name"
        value={title}
        onChange={onChange}
        style={{ marginTop: 5 }}
      />
    </Modal>
  );
};

export default _Modal;
