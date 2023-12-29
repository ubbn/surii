import { useParams } from "react-router-dom";
import Editor from "../../../common/editor/editor";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

function Iedit() {
  const { id } = useParams();
  const { selected } = useSelector((v: RootState) => v.neuron);

  useEffect(() => {
    console.log("Url param: ", id);
  }, [id]);

  return <Editor text={selected?.detail} />;
}

export default Iedit;
