import axios from "axios";
import { saveAs } from "file-saver";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const exportDataApi = async (
  filters: Record<string, any>,
  exportAll: boolean,
  page?: number,
  limit?: number
) => {
  const queryParams = new URLSearchParams(filters).toString();

  const url = exportAll
    ? `${apiUrl}/export?${queryParams}`
    : `${apiUrl}/export?${queryParams}&page=${page}&limit=${limit}&exportCurrentPage=true`;

  try {
    const response = await axios.get(url, { responseType: "blob" });

    const fileName = exportAll ? "FullData.xlsx" : "FilteredData.xlsx";
    saveAs(response.data, fileName);
  } catch (error) {
    console.error("Error exporting data:", error);
  }
};
