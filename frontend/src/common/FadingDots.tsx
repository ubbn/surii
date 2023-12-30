import styled from "styled-components";

const Wrapper = styled.div`
  margin: auto;
  text-align: center;

  div {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    background-color: grey;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: anime-fade 1.4s infinite ease-in-out both;
    animation: anime-fade 1.4s infinite ease-in-out both;
  }

  .dot1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .dot2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes anime-fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes anime-fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const FadingDots = (props: any) => {
  return (
    <Wrapper {...props}>
      <div className="dot1" />
      <div className="dot2" />
      <div className="dot3" />
    </Wrapper>
  );
};

export default FadingDots;
