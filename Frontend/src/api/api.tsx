const apiUrl = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";

export const fetchData = async (
  page: number,
  limit: number,
  filters: { [key: string]: string }
) => {
  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...filters,
  });

  const response = await axios.get(`${apiUrl}?${queryParams.toString()}`);
  return response.data;
};
