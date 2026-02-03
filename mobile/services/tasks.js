import { SERVER_IP } from "../constants/services";

export const fetchTasks = async (token, from, to) => {
  const fromISO = from.toISOString(); // Date -> "2026-01-26T00:00:00.000Z"
  const toISO = to.toISOString();
  const res = await fetch(
    `http://${SERVER_IP}/tasks?from=${fromISO}&to=${toISO}`,
    {headers: { Authorization: `Bearer ${token}` }}
    );
//   console.log("Server response:", res);
  return res.json();
};

