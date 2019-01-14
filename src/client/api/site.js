import axios from "axios";

export const keepAlive = () =>
  axios.get("/keep-alive").then(({ data }) => data);
