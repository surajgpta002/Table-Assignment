import { Order } from "../models/orderModel";
import moment from "moment";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { FastifyReply, FastifyRequest } from "fastify";
import { Table } from "../models/tableModel";

/**
 * Import Table Data
 */

export const uploadExcelData = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const options = { limits: { fileSize: 1024 * 1024 * 1024 } };
    const data = await req.file(options);
    if (!data) return reply.code(400).send({ error: "No file uploaded" });

    const filePath = path.join(__dirname, "../uploads", data.filename);
    await fs.promises.writeFile(filePath, await data.toBuffer());

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];

    const tableData: any[] = [];
    const orderData: any[] = [];

    sheet.eachRow((row: any, rowNumber) => {
      if (rowNumber === 1) return;

      const getCellValue = (col: number) => row.getCell(col)?.value || null;

      const dateValue = getCellValue(1);
      const parsedDate =
        typeof dateValue === "number"
          ? new Date((dateValue - 25569) * 86400000)
          : moment(dateValue, "YYYY-MM-DDTHH:mm:ss.SSS").isValid()
          ? moment(dateValue).toDate()
          : null;

      if (!parsedDate) throw new Error(`Invalid date at row ${rowNumber}`);

      tableData.push({
        date: parsedDate,
        businessName: getCellValue(2),
        industryType: getCellValue(3),
        transferAmount: getCellValue(4),
        customerUPI: getCellValue(5),
        customerUTR: getCellValue(6),
        orderId: getCellValue(7),
        txnId: getCellValue(8),
        mdrRate: getCellValue(9),
      });

      orderData.push({
        orderId: getCellValue(7),
        productName: getCellValue(10),
        quantity: getCellValue(11),
        price: getCellValue(12),
      });
    });

    const BATCH_SIZE = 1000;
    for (let i = 0; i < tableData.length; i += BATCH_SIZE) {
      await Table.insertMany(tableData.slice(i, i + BATCH_SIZE), {
        ordered: false,
      });
      await Order.insertMany(orderData.slice(i, i + BATCH_SIZE), {
        ordered: false,
      });
    }

    await fs.promises.unlink(filePath);

    reply
      .code(201)
      .send({ message: "File uploaded and data stored successfully!" });
  } catch (error: any) {
    reply
      .code(500)
      .send({ error: "Error processing file", details: error.message });
  }
};
