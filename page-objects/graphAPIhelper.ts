import { APIRequestContext } from "@playwright/test";

export class GraphApiHelper{

    constructor(
        private apiContext: APIRequestContext // Accept the APIRequestContext
      ) {}
    
    // update cell value
    async patchExcelCell(workbookId: string, cellAddress: string, value: string) {
        const response = await this.apiContext.patch(
            `https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets/Sheet1/range(address='${cellAddress}')`,
            {
              data: { formulas: [[value]] },
            }
          );
          return response;
    }

    // get cell value
    async fetchDateValueFromCell(workbookId: string, cellAddress: string) {
        const response = await this.apiContext.get(
          `https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets/Sheet1/range(address='${cellAddress}')`
        );
        const jsonFromResponse = await response.json();
        const cellValue = await jsonFromResponse.values[0][0];
        return cellValue;
      }
    
}