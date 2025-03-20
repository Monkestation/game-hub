// Server -> Plexora
import axios from "axios";

const API_BASE_URL = process.env.PLEXORA_API_URL || "http://localhost:1330/api";
const API_KEY = process.env.PLEXORA_API_KEY || "none";

export default axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${API_KEY}`,
  },
});
