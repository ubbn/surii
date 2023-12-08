import { styled } from "styled-components";

const Container = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(211, 211, 211, 0.6);
  padding-top: 22px;
  margin: auto;
  max-width: 30vw;
`;

const Footer = () => {
  return <Container>© 2023. BLearn</Container>;
};

export default Footer;
