import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Post = () => {
  const { id } = useParams();

  useEffect(() => {
    console.log("Url param: ", id);
  }, [id]);

  return (
    <div>
      <h2>{id}</h2>
      <div>Hej hej</div>
    </div>
  );
};

export default Post;
