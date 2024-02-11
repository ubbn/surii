type Props = {
  title: string;
  ognoo?: string;
};

const Post = ({ title, ognoo }: Props) => {
  return (
    <div
      style={{
        border: "1px solid lightgrey",
        padding: "5px 10px",
        margin: "20px 0",
        borderRadius: 6,
        cursor: "pointer"
      }}
    >
      <h2>{title}</h2>
      {ognoo}
    </div>
  );
};

export default Post;
