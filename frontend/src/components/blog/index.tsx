import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getDateFromStr, yyyyMMdd } from "../neuron/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const getDateInYYYYMMDD = (ognooStr?: string) => {
  if (ognooStr) {
    const ognoo = getDateFromStr(ognooStr);
    return format(ognoo, yyyyMMdd);
  }
  return "";
};

const pageSize = 8;

const Blog = () => {
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagedItems, setPagedItems] = useState<Neuron[]>([]);
  const { items } = useSelector((v: RootState) => v.neuron);
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length > 0) {
      setPagedItems(items.slice(0, pageSize));
      setTotalPage(Math.ceil(items.length / pageSize));
    } else {
      setPagedItems([]);
      setTotalPage(1);
    }
    setCurrentPage(1);
  }, [items]);

  const onPrev = () => {
    const newPage = Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
    setPagedItems(items.slice((newPage - 1) * pageSize, newPage * pageSize));
  };

  const onNext = () => {
    const newPage = Math.min(currentPage + 1, totalPage);
    setCurrentPage(newPage);
    setPagedItems(items.slice((newPage - 1) * pageSize, newPage * pageSize));
  };

  const onClickPost = (id: number | undefined) => {
    if (id) {
      navigate(`${id}`)
    } else {
      console.error("Invalid post");
    }
  }

  return (
    <div style={{ width: "100%" }}>
      {pagedItems.map((v, i) => (
        <div key={i}
          onClick={() => onClickPost(v.id)}
          style={{
            border: "1px solid lightgrey",
            padding: "5px 10px",
            margin: "20px 0",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          <h2>{v.title}</h2>
          {getDateInYYYYMMDD(v.created)}
        </div>
      ))}
      <div style={{ margin: 20 }}>
        <Button onClick={onPrev}>prev</Button>
        {currentPage} of {totalPage}
        <Button onClick={onNext}>next</Button>
      </div>
    </div>
  );
};

export default Blog;
