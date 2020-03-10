function trim(str) {
  if (!str) {
    return '';
  }
  if (str.trim) {
    return str.trim();
  }
  return '';
}

export default trim;
