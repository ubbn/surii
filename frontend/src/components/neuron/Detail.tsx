import { RollbackOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Typography } from "antd";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { FlexColumn, FlexRow } from "../../common";
import { thunkGetNeuron } from "../../redux/neuronSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import { getGoodFormatted } from "./utils";

const { Text } = Typography;

const Meta = styled.div`
  margin-top: 20px;
  font-size: 14px;
`;

const NeuronDetail = () => {
  const [treeNode, setTreeNode] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { neuronId } = useParams() as { neuronId: any };
  const { selected, leaves } = useSelector((v: RootState) => v.neuron);

  useEffect(() => {
    if (neuronId) {
      dispatch(thunkGetNeuron(neuronId));
    }
  }, [neuronId]);

  useEffect(() => {
    if (selected?.ntree) {
      const found = leaves.find((v) => v.key === selected?.ntree);
      if (found?.title) {
        setTreeNode(found.title);
      }
    }
  }, [selected]);

  const onBack = () => {
    navigate("/learn");
  };

  return (
    <div>
      <FlexRow style={{ alignItems: "center" }}>
        <div style={{ marginRight: 10 }}>
          <Button shape="circle" icon={<RollbackOutlined />} onClick={onBack} />
        </div>
        <Breadcrumb>
          <Breadcrumb.Item>{treeNode}</Breadcrumb.Item>
          <Breadcrumb.Item>{selected?.title}</Breadcrumb.Item>
        </Breadcrumb>
      </FlexRow>
      <FlexRow>
        <Meta>
          <FlexRow>
            <FlexColumn style={{ marginRight: 10 }}>
              <Text type="secondary">Created</Text>
              <Text type="secondary">Modified</Text>
            </FlexColumn>
            <FlexColumn>
              <Text type="secondary">
                {getGoodFormatted(selected?.created)}
              </Text>
              <Text type="secondary">
                {getGoodFormatted(selected?.modified)}
              </Text>
            </FlexColumn>
          </FlexRow>
        </Meta>
        <div style={{ marginLeft: "8%" }}>
          <ReactMarkdown children={selected?.detail || ""} />
        </div>
      </FlexRow>
    </div>
  );
};

export default NeuronDetail;
