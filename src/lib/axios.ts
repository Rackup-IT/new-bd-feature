import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});
