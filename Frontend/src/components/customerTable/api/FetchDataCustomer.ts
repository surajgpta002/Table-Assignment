import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL_TABLE;

export const FetchDataCustomer = async (
  page: number,
  limit: number,
  filters: { [key: string]: string }
) => {
  const formattedFilters: { [key: string]: string } = {};

  Object.keys(filters).forEach((key) => {
    if (key.startsWith("orderDetails_")) {
      formattedFilters[key.replace("orderDetails_", "")] = filters[key];
    } else {
      formattedFilters[key] = filters[key];
    }
  });

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...formattedFilters,
  });

  const response = await axios.get(`${apiUrl}?${queryParams.toString()}`);

  const formattedData = response.data.data.map((item: any) => ({
    ...item,
    orderDetails: item.orderDetails,
  }));

  return { ...response.data, data: formattedData };
};
