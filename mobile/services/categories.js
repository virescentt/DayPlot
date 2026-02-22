import { SERVER_IP } from "../constants/services";

export const fetchCategories = async () => {
  const res = await fetch(
    `http://${SERVER_IP}/categories`,
    {headers: { Authorization: `Bearer ${token}` }}
    );
    
    return res.json();
};

  // Фетч категорий с сервера
  // useEffect(() => {
  //   fetch('http://<SERVER_IP>/categories')  // подставь свой сервер
  //     .then(res => res.json())
  //     .then(data => setCategories(data))
  //     .catch(err => console.log(err));
  // }, []);