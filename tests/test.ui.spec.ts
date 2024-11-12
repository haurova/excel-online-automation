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

  // clear clipboard so in case copy doesn't work properly and by some chance clipboard has the today date, the test won't pass
  await page.evaluate(() => {
    navigator.clipboard.writeText('');
  });
});

test('verify TODAY() function', async ({ page }) => {
  const helper = new Helpers(page);
  const frame = page.locator('#WacFrame_Excel_0').contentFrame();
  const selectCell = frame.locator('#FormulaBar-NameBox-input')
  const formulaBar = frame.locator('#formulaBarTextDivId_textElement')
  const commitButton = frame.getByRole('button', {name: 'commit edit'})
  const popUpButton = frame.getByRole('button', {name: 'Got it'})


  await selectCell.click()
  await selectCell.fill('A1')
  await page.keyboard.press('Enter'); 
  await formulaBar.click();
  await formulaBar.pressSequentially('=TODAY()');
  await commitButton.click();
  await popUpButton.click(); // closing annoying excel pop up about new script button
  await popUpButton.isVisible!()
  await page.keyboard.press('Control+C');
  await page.waitForTimeout(2000); // timeout to let the clipboard update
  await page.keyboard.press('Delete');

  const clipboardContent = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });

  console.log('clipboard: ' + clipboardContent, 'today: ' + await helper.dateFormatted(new Date()))
  expect(clipboardContent).toContain(await helper.dateFormatted(new Date())); 

});
 
