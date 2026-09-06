import { SaveOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { FlexRow } from "../../common";
import { getAuthenticationData } from "../../common/storage";
import { thunkUpdateNeuron } from "../../redux/neuronSlice";
import { useAppDispatch } from "../../redux/store";
import { empty } from "../neuron/utils";
import FullEditor from "../../common/fullEditor";

const NewPost = () => {
  const [item, setItem] = React.useState<Neuron>(empty);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = React.useMemo(() => {
    const auth = getAuthenticationData();
    return !!auth?.user?.email;
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const onSave = () => {
    if (!item.title) {
      message.warning("Give it a title before saving.");
      return;
    }
    dispatch(thunkUpdateNeuron({ ...item, public: 1 }, true))
      .then(() => {
        message.success("Post created");
        navigate("/blog");
      });
  };

  return (
    <Container>
      <FlexRow style={{ justifyContent: "space-between", alignItems: "center" }}>
        <StyledTitleInput
          placeholder="Post title"
          value={item.title}
          onChange={(e) => setItem({ ...item, title: e.target.value })}
        />
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
          disabled={!item.title}
        >
          Save
        </Button>
      </FlexRow>
      <$Wrapper>
        <FullEditor
          text={item.detail}
          editable
          onChange={(value) => setItem((prev) => ({ ...prev, detail: value }))}
        />
      </$Wrapper>
    </Container>
  );
};

export default NewPost;

const Container = styled.div`
  width: 100%;
  padding: 20px 30px 60px;
  @media (max-width: 600px) {
    padding: 0 5px;
  }
`;

const StyledTitleInput = styled(Input)`
  font-size: 24px;
  font-weight: 600;
  border: none;
  padding-left: 0;
  &:focus {
    box-shadow: none;
  }
`;

const $Wrapper = styled.div`
  flex: 1;
  height: 100%;
  margin-top: 10px;
  & img {
    max-width: 100%;
  }
`;
