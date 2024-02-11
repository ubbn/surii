import { useSelector } from "react-redux";
import Post from "./Post";
import { RootState } from "../../redux/store";
import { getDateFromStr, yyyyMMdd } from "../neuron/utils";
import { format } from "date-fns";

const getDateInYYYYMMDD = (ognooStr?: string) => {
  if (ognooStr) {
    const ognoo = getDateFromStr(ognooStr);
    return format(ognoo, yyyyMMdd);
  }
  return "";
};

const Blog = () => {
  const { items } = useSelector((v: RootState) => v.neuron);

  return (
    <div style={{ width: "100%" }}>
      {items.map((v, i) => (
        <Post key={i} ognoo={getDateInYYYYMMDD(v.created)} title={v.title} />
      ))}
    </div>
  );
};

export default Blog;
