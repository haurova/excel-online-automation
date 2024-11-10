import { Page } from "@playwright/test";

export class Login {


    constructor(
        private readonly page: Page, 
      ) {}

    async loginToMicrosoftAcc(email: string, password: string) {
        
        const emailField = this.page.getByTestId('i0116');
        const passwordField = this.page.getByTestId('i0118');
        const buttonNext = this.page.getByRole('button', {name: "Next"});
        const buttonSignIn = this.page.getByRole('button', {name: "Sign In"});
        const passwordFormHeading = this.page.getByRole('heading', {name: "Enter password"});
        const staySignedInHeading = this.page.getByRole('heading', {name: "Stay signed in?"});
        const buttonYes = this.page.locator('#acceptButton');

        await emailField.fill(process.env.USERNAME!);
        await buttonNext.click();
        await passwordFormHeading.waitFor();
        await passwordField.fill(process.env.PASSWORD!);
        await buttonSignIn.click();
        await staySignedInHeading.waitFor();
        await buttonYes.click(); 
    }
}