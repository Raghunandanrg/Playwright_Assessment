const { test, expect } = require('@playwright/test')
const Home = require('../page_objects/home_login.js');
const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('testData/creds.json'));
const CryptoJS = require('crypto-js');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.demoblaze.com/index.html')
    //get title of page and validate
    const title = await page.title()
    console.log('Page title is: ' + title)
    await expect(page).toHaveTitle('STORE')
    await expect(page).toHaveURL("https://www.demoblaze.com/index.html")

    //define dialog box handling before event is triggered
    page.on('dialog', async (dialog) => {
        console.log("Error message: " + dialog.message());
        if (dialog.message().includes('User')) {
            expect(dialog.message()).toEqual('User does not exist.');
        } else if (dialog.message().includes('password')) {
            expect(dialog.message()).toEqual('Wrong password.');
        }
        await dialog.accept();
    });
})

test('01 Test invalid login senerio', async ({ page }) => {
    //click on login and validate the errtor message on dialog box
    //Use of POM for home page
    const homepage = new Home(page);
    await homepage.clickLogin()

    //validate for wrong username
    await homepage.performLogin(credentials.invalidLogin.username, credentials.invalidLogin.password);
    await page.waitForTimeout(2000)

    //validate for correct username but wrong password
    await homepage.performLogin(credentials.wrongPasswordLogin.username, credentials.wrongPasswordLogin.password);
    await page.waitForTimeout(2000)
});

test('02 Test valid login scenario', async ({ page }) => {
    const homepage = new Home(page);
    await homepage.clickLogin();

    // Decrypt username and password using AES decryption
    const decryptedUsername = CryptoJS.AES.decrypt(credentials.validLogin.username, process.env.secret_key).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(credentials.validLogin.password, process.env.secret_key).toString(CryptoJS.enc.Utf8);
    // Print the decrypted password for debugging purposes
    console.log('Decrypted password:', decryptedPassword);
    // Perform login using decrypted credentials
    await homepage.performLogin(decryptedUsername, decryptedPassword);
    page.pause()
    // Validate successful login
    await homepage.validateSuccess(decryptedUsername);
});

test.afterEach(async ({ page }) => {
    page.close()
})
