function boolValue(str) {
  if (str === 'true') {
    return true;
  }
  if (str === 'false') {
    return false;
  }
  if (str === '') {
    return false;
  }
  return str;
}

export default boolValue;
