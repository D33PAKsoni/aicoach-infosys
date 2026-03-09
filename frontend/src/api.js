import axios from "axios";

export const backendURL= "http://localhost:8000";

const API = axios.create({
  baseURL: backendURL,
  withCredentials: true
});

export default API;
