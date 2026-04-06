import { SERVER_IP } from "../constants/services";

export const fetchStats = async (token) => {
  const res = await fetch(
    `http://${SERVER_IP}/stats`,
    {headers: { Authorization: `Bearer ${token}` }}
    );
    
    return res.json();
};

export const editStats = async (token, stats) => {
    const res = await fetch(
      `http://${SERVER_IP}/stats`,
      {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(stats)
    });

    if (!res.ok) throw new Error("Failed to save stats");
    
    return res.json();

}