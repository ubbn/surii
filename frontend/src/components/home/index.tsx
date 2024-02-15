import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FlexColumn } from "../../common";

const Link = styled.a`
  cursor: pointer;
  text-decoration: underline;
  color: purple;
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <FlexColumn>
      <div>
        <h2>BiSurii</h2>
      </div>
      <p>
        It is a web-based memory management system. Spend only{" "}
        <strong>5 minutes</strong> a day and keep what you are learning for rest
        of your life in your memory!
      </p>
      <p>
        It is based on the spaced repitition, a science-backed method to learn
        or memorize anything for desired period of time with very little effort.
        Read more about it on{" "}
        <Link
          target="blank"
          href="https://en.wikipedia.org/wiki/Spaced_repetition"
        >
          wikipedia
        </Link>
      </p>
      <p>
        Start learn <Link onClick={() => navigate("/learn")}>now</Link>
      </p>
    </FlexColumn>
  );
};

export default Home;
