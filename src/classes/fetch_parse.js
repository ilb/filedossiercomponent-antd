import contentType from 'content-type';

/** Parse response
@param {Object} res - response object
@param {String} options.parseType - force parse type ('json', 'text' or 'arrayBuffer')
@return {mixed} parsed response body
*/
export default async function parseResponse(res, options = {}) {
  /* Errors handling */
  if (!res.status || res.status < 200 || res.status >= 400) {
    const errorText = await res.text() || res.statusText;
    throw new Error(`${res.status}: ${errorText}`);
  }

  /* Parse */
  const { parseType } = options;
  const type = getContentType(res);
  if (!type && !parseType) { return null; }

  const parser = parsers[parseType] || getParserByType(type);
  if (!parser) { return null; }
  const parsedRes = await parser(res);
  return parsedRes;
}

/** Parse response wrapped in try-catch
@return {Object} as { value, error }
*/
export const parseResponseTry = async (...args) => {
  const result = {};
  try {
    result.value = await parseResponse(...args);
  } catch (e) {
    result.error = e.message;
  }
  return result;
};

export const getContentType = (res) => {
  if (res.bodyUsed) return false;
  if (res.status === 204 || res.status === 304) return false;
  const header = (res.headers.get('content-type') || '').split(';').shift();
  if (header) {
    const { type } = contentType.parse(header);
    return type;
  }
};

const parsers = {
  arrayBuffer: res => res.arrayBuffer ? res.arrayBuffer() : res.buffer(),
  text: res => res.text(),
  json: res => res.text().then(body => body ? JSON.parse(body) : null),
};


const textTypes = ['text/plain', 'application/xml', 'text/xml'];
const getParserByType = (type) => {
  if (type === 'application/json') return parsers.json;
  if (textTypes.indexOf(type) !== -1) return parsers.text;
  return parsers.arrayBuffer;
};
