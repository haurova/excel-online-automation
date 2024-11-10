import { test, expect } from '@playwright/test';
import { Login } from '../page-objects/login';
import { Helpers } from '../page-objects/helpers';

test.beforeEach(async ({ page }) => {
  const login = new Login(page);

  // grant permissions to use clipboard for final verification
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']); 

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

test('verify TODAY() function', async ({ page }) => {
  const helper = new Helpers(page);
  await page.waitForTimeout(3000); // timeout to ensure that the page is loaded
  await page.mouse.move(550, 490);
  await page.waitForTimeout(2000); // timeout to let the movemement finish
  await page.mouse.click(550, 490);
  await page.keyboard.type('=TODAY()');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Control+C');
  await page.waitForTimeout(2000); // timeout to let the clipboard update
  await page.keyboard.press('Delete');

  const clipboardContent = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });

  console.log('clipboard: ' + clipboardContent, 'today: ' + await helper.dateFormatted(new Date()))
  expect(clipboardContent).toContain(await helper.dateFormatted(new Date())); 
});
 
