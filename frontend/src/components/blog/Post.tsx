import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setNeuron, thunkGetNeuron } from "../../redux/neuronSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import Editor from "../../common/editor/editor";
import { styled } from "styled-components";

const Post = () => {
  const [item, setItem] = useState<Neuron>()
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { selected } = useSelector((v: RootState) => v.neuron);
  const { loading } = useSelector((v: RootState) => v.main);

  useEffect(() => {
    if (id) {
      setItem(undefined)
      dispatch(thunkGetNeuron(id))
    }
    return (() => {
      dispatch(setNeuron(undefined))
    })
  }, [id]);

  useEffect(() => {
    if (selected) {
      setItem(selected)
    }
  }, [selected])

  if (loading) {
    return <>Loading...</>
  }

  return (
    <Container>
      <StyledTitle>{item?.title}</StyledTitle>
      <$Wrapper>
        <Editor
          text={item?.detail}
          hideToolbar
          editable={false}
        />
      </$Wrapper>
    </Container>
  );
};

export default Post;

const Container = styled.div`
  padding: 20px 80px 60px;
  .editor-container {
    border: none;
  }
  .editor-input {
    padding: 0;
  }
  @media (max-width: 600px) {
    padding: 0 5px;
  }
`;

const StyledTitle = styled.h1`
  font-size: 30px;
`

const $Wrapper = styled.div`
  margin-top: 20px;
  flex: 1;
  height: 100%
  & img {
    max-width: 100%;
  }
`;