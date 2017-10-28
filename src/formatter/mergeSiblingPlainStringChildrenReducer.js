const isGoodToMerge = node => node.type === 'string' || node.type === 'number';

export default (nodes, current) => {
  const prev = nodes[nodes.length - 1];

  if (prev && isGoodToMerge(prev) && isGoodToMerge(current)) {
    prev.value += String(current.value);
  } else {
    nodes.push(current);
  }

  return nodes;
};
