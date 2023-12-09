import { FlexColumn } from "../../common";

const Home = () => {
  return (
    <FlexColumn>
      <div>
        <h2>B-Learn</h2>
      </div>
      <p>
        It is a web-based memory management system. Spend only{" "}
        <strong>5 minutes</strong> a day to keep what you have learnt in your
        memory for rest of your life time!
      </p>
      <p>
        It is based on the spaced repitition, a science-backed method to learn
        or memorize anything for desired period of time with very little effort.
        Read more about it on{" "}
        <a href="https://en.wikipedia.org/wiki/Spaced_repetition">wikipedia</a>
      </p>
      <p></p>
    </FlexColumn>
  );
};

export default Home;
