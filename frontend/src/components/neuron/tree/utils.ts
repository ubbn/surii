import { EventDataNode } from "antd/lib/tree";
import { delKey } from "../../../common/utils";

/**
 * Build hierarchial tree structure from list of nodes
 *
 * @param nodes node list
 * @returns tree
 */
export const buildTree = (nodes: any[]): any[] => {
  const cloned = JSON.parse(JSON.stringify(nodes)).map((v: any) => ({
    ...delKey(v, "modified"),
    value: v.key, // Needed for TreeSelect
  }));
  for (let i = 0; i < cloned.length; i++) {
    const node = cloned[i];
    for (let j = 0; j < cloned.length; j++) {
      if (i === j) continue;
      if (node.key === cloned[j].parent) {
        if (node?.children) {
          node.children.push(cloned[j]);
        } else {
          node.children = [cloned[j]];
        }
      }
    }
  }

  return cloned.filter((node: any) => !node?.parent);
};

export const areSiblings = (a: EventDataNode<any>, b: EventDataNode<any>) => {
  if (a.pos && b.pos) {
    const partA = a.pos.split("-");
    const partB = b.pos.split("-");
    if (partA.length === partB.length) {
      return (
        a.pos.substring(0, a.pos.lastIndexOf("-")) ===
        b.pos.substring(0, b.pos.lastIndexOf("-"))
      );
    }
  }
  return false;
};
