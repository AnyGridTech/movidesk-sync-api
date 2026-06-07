import axios from 'axios'

export const api = axios.create({
  baseURL: "https://api.movidesk.com/public/v1",
  headers: { "Content-Type": "application/json" },
});
