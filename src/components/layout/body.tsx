import { styled } from "styled-components";

const Container = styled.div`
  margin: auto;
  min-height: 80vh;
  display: flex;
  max-width: 1098px;
`;

const Body = ({ children }: { children: any }) => {
  return <Container>{children}</Container>;
};

export default Body;
