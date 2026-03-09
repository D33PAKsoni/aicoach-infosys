import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true
});

export default API;

export const API2 = axios.create({
  baseURL: "https://deepakkumarsoni-aicoach2.hf.space",
  withCredentials: true
});