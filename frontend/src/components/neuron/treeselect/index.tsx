import { FolderOpenOutlined } from "@ant-design/icons";
import { TreeSelect } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const _TreeSelect = ({
  selected,
  onChange,
}: {
  selected?: React.Key;
  onChange?: (value: React.Key) => void;
}) => {
  const treeData = useSelector((v: RootState) => v.neuron.tree);
  const [value, setValue] = useState<React.Key>();

  useEffect(() => {
    setValue(selected);
  }, [selected]);

  const onSelectedChange = (newValue: string) => {
    setValue(newValue);
    onChange && onChange(newValue);
  };

  const onSearch = (a: any) => {
    console.log("Dummy search", a);
  };

  return (
    <TreeSelect
      showSearch
      style={{ width: "100%", marginRight: 5 }}
      value={value as string}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder={
        <span>
          <FolderOpenOutlined />
          <span style={{ marginLeft: 10 }}>Select node</span>
        </span>
      }
      allowClear
      treeDefaultExpandAll
      onChange={onSelectedChange}
      onSearch={onSearch}
      treeData={treeData}
    />
  );
};

export default _TreeSelect;
