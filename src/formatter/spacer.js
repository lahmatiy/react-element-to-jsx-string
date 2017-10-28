export default (times, tabStop) => {
  if (times === 0) {
    return '';
  }

  return new Array(times * tabStop).fill(' ').join('');
};
