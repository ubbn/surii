import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Tree, TreeProps, message } from "antd";
import type { DataNode } from "antd/es/tree";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Tooltip from "../../../common/tooltip";
import {
  setSelectedNode,
  thunkFetchConnectedNeurons,
} from "../../../redux/neuronSlice";
import {
  thunkDeleteTreeNode,
  thunkFetchNeuronTrees,
} from "../../../redux/neuronTreeSlice";
import { RootState, useAppDispatch } from "../../../redux/store";
import Modal from "./Modal";
import { areSiblings } from "./utils";

const { Search } = Input;

const getParentKey = (key: React.Key, tree: NTree[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key as React.Key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const _Tree: React.FC = () => {
  const dispatch = useAppDispatch();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isAddNew, setIsAddNew] = useState(false);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const {
    backend,
    selectedNode,
    tree,
    leaves: treeAsList,
  } = useSelector((v: RootState) => v.neuron);

  useEffect(() => {
    dispatch(thunkFetchNeuronTrees());
    if (selectedNode) {
      const found = treeAsList.find((v) => v.key === +selectedNode);
      onSearch(found?.title || "");
    }
  }, []);

  useEffect(() => {
    dispatch(thunkFetchConnectedNeurons(selectedNode as string));
    setAutoExpandParent(true);
    setExpandedKeys([selectedNode]);
    setSearchValue("");
  }, [selectedNode]);

  useEffect(() => {
    if (backend?.status === 405) {
      const theOne = treeAsList.find((v) => v.key === +backend.key);
      message.error(backend.message + ": " + theOne?.title);
    } else if (backend?.status === 200) {
      message.success(backend?.message);
    } else if (backend?.status > 200) {
      message.error(backend?.message);
    }
  }, [backend]);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onSearch = (searchKey: string) => {
    const newExpandedKeys = treeAsList
      .map((item: NTree) => {
        if (item.title?.toLowerCase().includes(searchKey.toLowerCase())) {
          return getParentKey(item.key, tree);
        }
        return null;
      })
      .filter((item, i, self) => searchKey && item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(searchKey);
    setAutoExpandParent(true);
  };

  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = strTitle.substring(0, index);
        const matched = strTitle.substring(index, index + searchValue.length);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{matched}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
    return loop((tree || []) as DataNode[]);
  }, [searchValue, tree]);

  const onSelectNode = (key: React.Key[]) => {
    if (key.length > 0) {
      dispatch(setSelectedNode(key[0]));
    } else {
      dispatch(setSelectedNode(undefined));
    }
  };

  const onAdd = () => {
    setShowModal(true);
    setIsAddNew(true);
  };

  const onEdit = () => {
    setShowModal(true);
    setIsAddNew(false);
  };

  const onDelete = () => {
    if (selectedNode) {
      dispatch(thunkDeleteTreeNode(+selectedNode));
    } else {
      message.error("No tree node is selected");
    }
  };

  const onDrop: TreeProps["onDrop"] = (info) => {
    const { node: targetNode, dragNode, dropPosition } = info;

    console.log(targetNode, dragNode, dropPosition);
    const targetKey = targetNode.key;
    const dragKey = dragNode.key;
    console.log(
      targetKey,
      dragKey,
      areSiblings(targetNode, dragNode),
      targetNode.pos,
      dragNode.pos
    );
  };

  return (
    <div>
      <div style={{ marginRight: 8 }}>
        <Search
          value={searchValue}
          allowClear
          placeholder={`Search categories`}
          onChange={(e) => onSearch(e.target.value)}
          enterButton={<button style={{ display: "none" }} />}
        />
      </div>
      <div>
        <Tooltip text="Add category">
          <Button
            size="small"
            style={{ width: 40 }}
            icon={<PlusCircleOutlined />}
            onClick={onAdd}
          />
        </Tooltip>
        <Tooltip text={selectedNode ? "Edit category" : ""}>
          <Button
            size="small"
            style={{ width: 40, margin: 8 }}
            icon={<EditOutlined />}
            disabled={!selectedNode}
            onClick={onEdit}
          />
        </Tooltip>
        <Tooltip
          text={selectedNode ? "Delete selected category" : ""}
          placement="right"
        >
          <Popconfirm
            placement="topLeft"
            title={"Устгамаар байна уу?"}
            onConfirm={onDelete}
            okText="Yes"
            disabled={!selectedNode}
            cancelText="No"
          >
            <Button
              size="small"
              style={{ width: 40 }}
              icon={<DeleteOutlined />}
              disabled={!selectedNode}
            />
          </Popconfirm>
        </Tooltip>
      </div>
      <Tree
        draggable
        onDrop={onDrop}
        selectedKeys={[selectedNode]}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        onSelect={onSelectNode}
        titleRender={(a) => (
          <div key={a.key} title={`${a.key}`}>
            {a.title as React.ReactNode}
          </div>
        )}
      />
      <Modal
        open={showModal}
        selectedKey={selectedNode}
        onClose={() => setShowModal(false)}
        isAddNew={isAddNew}
      />
    </div>
  );
};

export default _Tree;
