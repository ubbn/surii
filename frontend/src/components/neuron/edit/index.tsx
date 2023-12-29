import { useParams } from "react-router-dom";
import Editor from "../../../common/editor/editor";

function Iedit() {
  const { id } = useParams();

  return <Editor />;
}

export default Iedit;
