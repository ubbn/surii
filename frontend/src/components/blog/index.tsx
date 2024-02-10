import Post from "./Post";

const posts = [
  {
    title: "Greater",
    ognoo: "2024-01-29",
  },
  {
    title: "Alexander",
    ognoo: "2024-01-29",
  },
];

const Blog = () => {
  return (
    <div style={{ width: "100%"}}>
      {posts.map((v, i) => (
        <Post key={i} ognoo={v.ognoo} title={v.title} />
      ))}
    </div>
  );
};

export default Blog;
