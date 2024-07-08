import moment from "moment"
import CryptoJS from "crypto-js"
const { createHash } = require('crypto')

const generateSignature = (url, method, body) => {
  const hasApp = "fvzwFwcRZ6R";
  const source = "com.ag.agforce";
  const timeStamp = moment().format("yyyyMDDhhmmss")
  const format = `${source}${timeStamp}${body}${url}${hasApp}${method}`
  const signature = createHash('sha256').update(format).digest('hex')
  return {
    "X-TimeStamp": timeStamp,
    "X-Signature": signature,
  };
};

export default generateSignature;