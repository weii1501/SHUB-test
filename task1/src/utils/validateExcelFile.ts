// src/index.ts

/**
 * Validates if the file is a valid Excel file by checking its header (magic numbers).
 * Supports both XLS and XLSX formats.
 * @param headerBuffer - The first few bytes of the file.
 * @returns boolean indicating if the file is valid.
 */
export function validateExcelFile(headerBuffer: Buffer): boolean {
    // XLSX files are ZIP archives and start with PK (0x50 0x4B 0x03 0x04)
    const xlsxSignature = Buffer.from([0x50, 0x4B, 0x03, 0x04]);
  
    // XLS files start with D0 CF 11 E0 (0xD0 0xCF 0x11 0xE0)
    const xlsSignature = Buffer.from([0xD0, 0xCF, 0x11, 0xE0]);
  
    const header = headerBuffer.slice(0, 4);
  
    if (header.equals(xlsxSignature)) {
      return true; // It's an XLSX file
    }
    if (header.equals(xlsSignature)) {
      return true; // It's an XLS file
    }
    return false;
  }
