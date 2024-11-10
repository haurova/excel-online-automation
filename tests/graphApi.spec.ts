import { test, expect, request, APIRequestContext } from '@playwright/test';
import { Login } from '../page-objects/login';
import { Helpers } from '../page-objects/helpers';
import { GraphApiHelper } from '../page-objects/graphAPIhelper';

let apiContext: APIRequestContext;
const workbookId = 'C7FC6BB90F95A597!108';
const cellAddress = 'I6';

test.beforeEach(async ({ page }) => {
    const login = new Login(page);

    // Create APIRequestContext with Authorization token
    const accessToken = process.env.ACCESS_TOKEN!;
    
    apiContext = await request.newContext({
        extraHTTPHeaders: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        },
    });
  
    // login to microsoft via ui and open the workbook
    await page.goto(`${process.env.URL}`);
    await expect(page).toHaveTitle(/Sign in/);
    await login.loginToMicrosoftAcc(process.env.USERNAME!, process.env.PASSWORD!);
    await expect(page).toHaveTitle('velixo-test-assignment.xlsx - Microsoft Excel Online');

    // Clear clipboard so in case copy doesn't work properly and by some chance clipboard has the today date, the test won't pass
    await page.evaluate(() => {
        navigator.clipboard.writeText('');
      });
  });

  test.afterEach(async () => {
    const graphAPI = new GraphApiHelper(apiContext);

    // Clear the cell
    await graphAPI.patchExcelCell(workbookId, cellAddress, '');
  })
  
  test('verify TODAY() function', async ({ page }) => {

    const helper = new Helpers(page);
    const graphAPI = new GraphApiHelper(apiContext);

    // send value to the cell
    await graphAPI.patchExcelCell(workbookId, cellAddress, '=TODAY()');

    // copy cell value and convert it to date format
    const excelSerialDate = await graphAPI.fetchDateValueFromCell(workbookId, cellAddress);
    const cellValue = await helper.excelSerialToDate(excelSerialDate);
    
    // formatting both dates to YYYY/MM/DD format and compare them
    console.log('excel cell: ' + await helper.dateFormatted(cellValue), 'today: ' + await helper.dateFormatted(new Date()));
    expect(await helper.dateFormatted(cellValue)).toBe(await helper.dateFormatted(new Date()));
})
