export default sortProps => (a, b) => {
  if (a === b) {
    return 0;
  } else if (a === 'key' || a === 'ref') {
    return -1;
  } else if (b === 'key' || b === 'ref') {
    return 1;
  }

  if (!sortProps) {
    return 0;
  }

  return a < b ? -1 : 1;
};
