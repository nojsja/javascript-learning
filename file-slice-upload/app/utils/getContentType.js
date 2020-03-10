/**
  * getContentType [获取header content type]
  * @param  {[String]} type [类型]
  */
export function getContentType(type) {
  const map = {
    xml: { 'Content-Type': 'text/xml; charset=UTF-8' },
    json: { 'Content-Type': 'application/json' },
    form: { 'Content-Type': 'multipart/form-data' },
    text: { 'Content-Type': 'text/plain' },
    urlencoded: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };
  return map[type] || map.json;
}

export default getContentType;
