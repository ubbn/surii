## Structure of neuron

```json
{
  "id": 20221011090347, // will never change
  "title": "ArrayList",
  "created": 20221011090347, // created date can be updated from UI
  "modified": 20221011090347, // any update to neuron
  "detail": "aak", // markdown body text
  "memo": {
    "1": 5, // scale of vividness in memory (0-5) 1 after studied
    "3": 5,
    "5": 2
  }
}
```

## Structure of semantic tree

### TreeSelect treedata

```js
const treeSelectData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
  },
]
```

### Tree control data

```js
export interface DataNode extends BasicDataNode {
  children?: DataNode[];
  key: string | number;
  title?: React.ReactNode;
}
```
