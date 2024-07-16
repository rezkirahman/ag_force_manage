import generateSignature from '@/libs/signatureUtils';
import axios from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import cookie from 'cookie'

export function getAPIServer() {
  const { access_token: token } = parseCookies();

  const api = axios.create({
    // baseURL: "https://hr-dev.agforce.co.id/api",
     baseURL: "https://hr.agforce.co.id/api",
    headers: {
      'Content-type': 'application/json',
    },
  })

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return api
}