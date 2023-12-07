import { styled } from "styled-components";

const Container = styled.div`
  min-height: 20vh;
  display: flex;
  justify-content: center;
`;

const Body = ({ children }: { children: any }) => {
  return <Container>{children}</Container>;
};

export default Body;
