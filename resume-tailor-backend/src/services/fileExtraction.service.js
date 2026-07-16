import mammoth from "mammoth";
import { badRequest } from "../utils/ApiError.js";

/**
 * Extracts plain text from an uploaded file buffer based on its mimetype.
 * Supports PDF, DOCX, and plain text. Throws a 400 ApiError for anything else.
 */
export async function extractTextFromFile(file) {
  if (!file) throw badRequest("No file uploaded");

  const { mimetype, originalname, buffer } = file;

  if (mimetype === "application/pdf" || originalname.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    originalname.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimetype === "text/plain" || originalname.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  throw badRequest(
    `Unsupported file type: ${mimetype || originalname}. Upload a .pdf, .docx, or .txt file.`
  );
}
