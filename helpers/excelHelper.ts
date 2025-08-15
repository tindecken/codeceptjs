const Helper = require("@codeceptjs/helper");
const fs = require("fs");
const ExcelJS = require("exceljs");

class ExcelHelper extends Helper {
  async findAndReplaceTextInExcelFile(
    inputFilePath: string,
    outputFilePath: string,
    searchText: string,
    replaceText: string
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();

    try {
      // Verify input file exists
      if (!fs.existsSync(inputFilePath)) {
        throw new Error(`Input file not found: ${inputFilePath}`);
      }

      // Read the input Excel file
      await workbook.xlsx.readFile(inputFilePath);

      // Process all worksheets
      workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            if (cell.value && typeof cell.value === "string") {
              cell.value = cell.value
                .toString()
                .replace(new RegExp(escapeRegExp(searchText)), replaceText);
            }
          });
        });
      });

      // Create a new workbook for output to ensure clean structure
      const newWorkbook = new ExcelJS.Workbook();
      workbook.eachSheet((worksheet) => {
        const newWorksheet = newWorkbook.addWorksheet(worksheet.name);
        worksheet.eachRow((row) => {
          const newRow = newWorksheet.addRow([]);
          row.eachCell((cell) => {
            newRow.getCell(cell.col).value = cell.value;
            // Copy style if needed
            if (cell.style) {
              newRow.getCell(cell.col).style = cell.style;
            }
          });
        });
      });

      // Save to the new output file with proper options
      await newWorkbook.xlsx.writeFile(outputFilePath, {
        useStyles: true,
        useSharedStrings: true,
      });
      console.log(`Successfully saved updated file to: ${outputFilePath}`);
    } catch (error) {
      console.error("Error processing Excel file:", error);
      throw error;
    }

    // Helper function to escape regex special characters
    function escapeRegExp(string: string): string {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }
}

export = ExcelHelper;
