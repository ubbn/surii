import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $getSelection } from "lexical";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "./editor";
import "./styles.css";

function Iedit() {
  const { id } = useParams();

  return <Editor />;
}

export default Iedit;
