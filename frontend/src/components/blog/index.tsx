import { Button } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { FlexRow } from "../../common";
import { thunkFetchNeurons } from "../../redux/neuronSlice";
import { thunkFetchNeuronTrees } from "../../redux/neuronTreeSlice";
import { RootState, useAppDispatch } from "../../redux/store";
import { compareNeurons, getDateFromStr, yyyyMMdd } from "../neuron/utils";
import { Container } from "./Post";

const getDateInYYYYMMDD = (ognooStr?: string) => {
  if (ognooStr) {
    const ognoo = getDateFromStr(ognooStr);
    return format(ognoo, yyyyMMdd);
  }
  return "";
};

const pageSize = 50;

const Blog = () => {
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagedItems, setPagedItems] = useState<Neuron[]>([]);
  const { items, leaves } = useSelector((v: RootState) => v.neuron);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(thunkFetchNeurons());
    dispatch(thunkFetchNeuronTrees());
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      setPagedItems(items.filter(v => v.public).sort(compareNeurons).slice(0, pageSize));
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
    setPagedItems(pagedItems.slice((newPage - 1) * pageSize, newPage * pageSize));
  };

  const onNext = () => {
    const newPage = Math.min(currentPage + 1, totalPage);
    setCurrentPage(newPage);
    setPagedItems(pagedItems.slice((newPage - 1) * pageSize, newPage * pageSize));
  };

  const onClickPost = (id: number | undefined) => {
    if (id) {
      navigate(`${id}`)
    } else {
      console.error("Invalid post");
    }
  }

  const getCategoryName = (id: React.Key | undefined) => {
    if (leaves && id) {
      const found = leaves.find(v => v.key === id)
      if (found) {
        return found.title
      }
    }
    return ""
  }

  if (pagedItems.length === 0) {
    return <Container>No post...</Container>
  }

  return (
    <Container>
      {pagedItems.map((post, i) => (
        <StyledCart key={i} onClick={() => onClickPost(post.id)}>
          <h2>{post.title}</h2>
          <FlexRow style={{ alignItems: "end", justifyContent: "space-between" }}>
            <div style={{ color: "gray", fontSize: 14 }} title="Published on">
              {`${getDateInYYYYMMDD(post.created)} ${post.ntree ? " | " + getCategoryName(post.ntree) : ""}`}
            </div>
          </FlexRow>
        </StyledCart>
      ))}
      {pagedItems.length > pageSize && <div style={{ margin: 20 }}>
        <Button onClick={onPrev}>prev</Button>
        {currentPage} of {totalPage}
        <Button onClick={onNext}>next</Button>
      </div>}
    </Container>
  );
};

export default Blog;

const StyledCart = styled.div`
  border: 1px solid lightgrey;
  padding: 25px;
  margin: 20px 0;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 3px 3px 7px lightgray;
  &:hover {
    box-shadow: 7px 7px 13px lightgray;
  }
`
