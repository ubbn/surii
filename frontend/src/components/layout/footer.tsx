import { styled } from "styled-components";

const Container = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(211, 211, 211, 0.6);
  padding-top: 22px;
  margin: auto;
  max-width: 50vw;
`;

const Footer = () => {
  return <Container>© 2024. BiSurii</Container>;
};

export default Footer;
