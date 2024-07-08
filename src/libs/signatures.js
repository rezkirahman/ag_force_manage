import moment from 'moment';
const {createHash} = require('crypto')

export const signaturePIN = (pin, date) => {
  var salt = `9ae12b1403d242c53b0ea80137de34856b3495c3c49670aa77c7ec99eadbba6e${date}`
  var firstSalt = salt.substring(0, salt.length / 2)
  var twoSalt = salt.substring(salt.length / 2)
  var format = `${firstSalt}${pin}${twoSalt}`
  var hash = createHash('sha256').update(format).digest('hex')
  return hash
}

function Signature(urlPath, method, body, date) {
  const source = "com.ag.agforce"
  const hasApp = "fvzwFwcRZ6R"
  var format = `${source}${date}${body}${urlPath}${hasApp}${method}`
  var hash = createHash('sha256').update(format).digest('hex')
  return hash
}

export const MakeSignatureHeader = (urlPath, method, body, date) => {
  let timeStamp = moment().format("yyyyMDDhhmmss")
  if (date) {
    timeStamp = date
  }
  var signature = Signature(urlPath, method, body, timeStamp)
  var header = {
    "Content-Type": "application/json",
    "X-TimeStamp": timeStamp,
    "X-Signature": signature,
    "X-Source": "com.ag.agforce",
  }
  return header
}
