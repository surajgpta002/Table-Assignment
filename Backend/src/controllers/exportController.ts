import { FastifyRequest, FastifyReply } from "fastify";
import { GetTablesDataQuerySchema } from "../schema/tableSchema";
import { Static } from "@sinclair/typebox";
import ExcelJS from "exceljs";
import { fetchTableData } from "../utils/fetchDataTable";

/**
 * Export all Data
 */
type QueryType = Static<typeof GetTablesDataQuerySchema>;

export const exportData = async (
  request: FastifyRequest<{ Querystring: QueryType }>,
  reply: FastifyReply
) => {
  try {
    const { exportCurrentPage, page, limit, ...filters } = request.query;
    const paginationParams = exportCurrentPage
      ? { page: Number(page), limit: Number(limit) }
      : {};

    const tableData = await fetchTableData(
      { ...paginationParams, ...filters },
      true
    );

    if (!Array.isArray(tableData) || tableData.length === 0) {
      return reply.status(404).send({ message: "No data available" });
    }

    const filename = exportCurrentPage ? "FilteredData.xlsx" : "FullData.xlsx";

    reply.raw.writeHead(200, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Access-control-allow-origin": "*",
    });
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: reply.raw,
    });
    const worksheet = workbook.addWorksheet("Exported Data");

    worksheet
      .addRow([
        "Date",
        "Business Name",
        "Industry Type",
        "Transfer Amount",
        "Customer UPI",
        "Customer UTR",
        "Order ID",
        "Transaction ID",
        "MDR Rate",
        "Product Name",
        "Quantity",
        "Price",
      ])
      .commit();

    for (const row of tableData) {
      worksheet
        .addRow([
          row.Date,
          row.Business_Name,
          row.Industry_Type,
          row.Transfer_Amount,
          row.Customer_UPI,
          row.Customer_UTR,
          row.Order_Id,
          row.Txn_Id,
          row.Mdr_Rate,
          row.Product_Name,
          row.Quantity,
          row.Price,
        ])
        .commit();
    }

    await workbook.commit();
    console.log("Export completed successfully");
  } catch (error) {
    console.error("Error exporting data:", error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
