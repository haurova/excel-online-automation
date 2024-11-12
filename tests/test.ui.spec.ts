import { test, expect } from '@playwright/test';
import { Login } from '../page-objects/login';

test.beforeEach(async ({ page }) => {
  const login = new Login(page);

  // grant permissions to use clipboard for final verification
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']); 

  // login to microsoft via ui and open the workbook
  await page.goto(`${process.env.URL}`);
  await expect(page).toHaveTitle(/Sign in/);
  await login.loginToMicrosoftAcc(process.env.USERNAME!, process.env.PASSWORD!);
  await expect(page).toHaveTitle('velixo-test-assignment.xlsx - Microsoft Excel Online');

  // clear clipboard so in case copy doesn't work properly and by some chance clipboard has the today date, the test won't pass
  await page.evaluate(() => {
    navigator.clipboard.writeText('');
  });
});

test('verify TODAY() function', async ({ page }) => {
  const frame = page.locator('#WacFrame_Excel_0').contentFrame();
  const selectCell = frame.locator('#FormulaBar-NameBox-input')
  const insertFunctionButton = frame.getByRole('button', {name: "insert function"})
  const searchForFunctionTextField = frame.getByPlaceholder('Search for a function')
  const insertButtonDialog = frame.getByRole('button', {name: 'Insert'})
  const today = new Date()
  const todayDate = (`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`)
  let clipboardContent: string
  
  await selectCell.click()
  await selectCell.fill('A2')
  await page.keyboard.press('Enter'); 
  await insertFunctionButton.click()  
  await searchForFunctionTextField.fill('today')
  await insertButtonDialog.click()
  await page.keyboard.press('Control+C');
  await page.waitForTimeout(3000) // necessary timeout for clipboard to update
  await page.keyboard.press('Delete');

  clipboardContent = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });

  expect(clipboardContent).toContain(todayDate); 
});
 
