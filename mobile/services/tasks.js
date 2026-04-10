import { SERVER_IP } from "../constants/services";

export const fetchTasks = async (token, from, to) => {
  const fromISO = from.toISOString(); // Date -> "2026-01-26T00:00:00.000Z"
  const toISO = to.toISOString();
  console.log("\n\n\n\n")
  console.log("FROM ISO: " + fromISO)
  console.log("TO ISO: " + toISO)
  console.log("\n\n\n\n")
  const res = await fetch(
    `http://${SERVER_IP}/tasks?from=${fromISO}&to=${toISO}`,
    {headers: { Authorization: `Bearer ${token}` }}
    );
//   console.log("Server response:", res);
  return res.json();
};

export const fetchPoolTasks = async (token) => {
  const res = await fetch(
    `http://${SERVER_IP}/tasks/pool}`,
    {headers: { Authorization: `Bearer ${token}` }}
    );

    return res.json();
};

export const toggleTaskDone = async (taskId, taskType, token) => {
  console.log("TOKEN IN toggleTaskDone:", token);
  const res = await fetch(
    `http://${SERVER_IP}/tasks/${taskId}/toggle-done`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: taskType, // "flexible" | "planned"
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to toggle task");
  }

  return await res.json();
};

export const fetchCreateTask = async (token, taskData) => {
  const res = await fetch(
    `http://${SERVER_IP}/tasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create task");
  }

  // return data; // { id: ... }
};

export function formatTaskDateToInfo(start) {
  const date = new Date(start);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

export function formatTaskTimeRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return `from ${formatTime(startDate)} to ${formatTime(endDate)}`;
}

export const deleteTask = async (token, taskId, type) => {
    const res = await fetch(
      `http://${SERVER_IP}/tasks/${taskId}?type=${type}`,
      {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });

    if (!res.ok) throw new Error("Failed to delete task");
    
    return res.json();

}