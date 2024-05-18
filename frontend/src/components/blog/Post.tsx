import { EditOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";
import { FlexRow } from "../../common";
import Editor from "../../common/editor/editor";
import { setNeuron, thunkGetNeuron, thunkUpdateNeuron } from "../../redux/neuronSlice";
import { RootState, useAppDispatch } from "../../redux/store";

const Post = () => {
  const [initial, setInitial] = React.useState<Neuron>()
  const [item, setItem] = React.useState<Neuron>()
  const [editMode, setEditMode] = React.useState<boolean>(false)
  const [pristine, setPristine] = React.useState<boolean>(true);
  const { selected } = useSelector((v: RootState) => v.neuron);
  const { loading } = useSelector((v: RootState) => v.main);

  const { id } = useParams();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (id) {
      setItem(undefined)
      dispatch(thunkGetNeuron(id))
    }
    return (() => {
      dispatch(setNeuron(undefined))
    })
  }, [id]);

  React.useEffect(() => {
    if (selected) {
      setInitial(selected)
      setItem(selected)
    }
  }, [selected])

  const saveNeuron = () => {
    if (item) {
      dispatch(thunkUpdateNeuron(item, true))
      setPristine(true);
      setInitial(item)
    }
  }

  const onView = () => {
    setEditMode(false)
  }

  const onEdit = () => {
    setEditMode(true)
  }

  if (loading && !editMode) {
    // Don't show it if in Edit mode
    return <Container>Loading...</Container>
  }

  return (
    <Container editMode={editMode}>
      <FlexRow style={{ justifyContent: "space-between", alignItems: "start" }}>
        <StyledTitle>{item?.title}</StyledTitle>
        {editMode ?
          <div>
            <Button icon={<SaveOutlined />} size="large" disabled={pristine} danger type="text" onClick={saveNeuron} />
            <Button icon={<EyeOutlined />} size="large" type="link" onClick={onView} />
          </div>
          :
          <Button icon={<EditOutlined />} size="large" type="link" onClick={onEdit} />
        }
      </FlexRow>
      <$Wrapper>
        <Editor
          text={initial?.detail}
          hideToolbar={!editMode}
          editable={editMode}
          onChange={(value) => {
            setPristine(value === initial?.detail)
            setItem({ ...item, detail: value } as Neuron)
          }}
        />
      </$Wrapper>
    </Container>
  );
};

export default Post;

export const Container = styled.div<{ editMode?: boolean; }>`
  width: 100%;
  padding: 20px 80px 60px;
  .editor-container {
    border: ${props => props.editMode ? "1px solid #dde" : "none"};
  }
  .editor-input {
    padding: ${props => props.editMode ? "10px" : 0};
  }
  @media (max-width: 600px) {
    padding: 0 5px;
  }
`;

const StyledTitle = styled.h1`
  font-size: 30px;
  max-width: 90%;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const $Wrapper = styled.div`
  flex: 1;
  height: 100%
  & img {
    max-width: 100%;
  }
`;