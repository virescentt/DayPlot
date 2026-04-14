import { SERVER_IP } from "../constants/services";

export const fetchFreeSlots = async (token, startDate, endDate) => {
    const res = await fetch(
      `http://${SERVER_IP}/algorithm`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({startDate, endDate})
    });

    if (!res.ok) throw new Error("Failed to find free slots.");
    
    return res.json();

}