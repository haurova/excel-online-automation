# Velixo Test Assignment - Excel Online Automation

This repository contains an automated test suite built with Playwright to interact with Excel Online using the Microsoft Graph API. The test automates the following tasks:

- Logging into Microsoft 365 and opening an Excel workbook.
- Using the `=TODAY()` formula to update a cell in the workbook.
- Verifying that the cell value matches the current date.
- Cleaning up by clearing the modified cell.

The project uses Playwright's test runner for test execution.

## Project Setup

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>

2. **Install dependencies**:

Ensure you have Node.js installed, then run:

	npm install

3. **Install Playwright**:

Install Playwright and its required browsers by running:

	npx playwright install

4. **Environment Variables**:

Create a .env file at the root of the project with the following environment variables:

	URL=<Microsoft Sign-In URL>
	USERNAME=<your-microsoft-email>
	PASSWORD=<your-microsoft-password>
	ACCESS_TOKEN=<your-microsoft-graph-access-token>

URL: The URL for the Microsoft 365 sign-in page (e.g., https://login.microsoftonline.com).
USERNAME: Your Microsoft 365 email address.
PASSWORD: Your Microsoft 365 password.
ACCESS_TOKEN: The Microsoft Graph API token for authentication.

5. **Running Tests**:

After installing the dependencies and setting up the environment variables, you can run the Playwright tests.

	npx playwright test

If you want to run a specific test use 

	npx playwright test test.ui.spec.ts --headed 

or

	npx playwright test graphApi.spec.ts --headed 

this will run the tests in headed mode 

