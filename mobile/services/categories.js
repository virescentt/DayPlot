import { SERVER_IP } from "../constants/services";

export const fetchCategories = async (token) => {
  const res = await fetch(
    `http://${SERVER_IP}/categories`,
    {headers: { Authorization: `Bearer ${token}` }}
    );
    
    return res.json();
};