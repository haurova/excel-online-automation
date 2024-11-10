import { Page, request } from "@playwright/test";

export class Helpers{


    constructor(
        private page: Page, 
      ) {}
    
    // format date to YYYY-MM-DD format
    async dateFormatted(date: Date) {
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(date);

        return formattedDate;
    }

    // convert Excel serial number to a date
    async excelSerialToDate(serial: number): Promise<Date> {
        const excelEpoch = new Date(1899, 11, 30); 
        const convertedDate = new Date(excelEpoch.getTime() + serial * 86400 * 1000); 
        return convertedDate;
      }
    
}