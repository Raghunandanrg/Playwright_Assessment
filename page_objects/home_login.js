const { expect } = require('@playwright/test')

class Home {
    constructor(page) {
        this.page = page;
        this.login = '#login2';
        this.username = 'input[id="loginusername"]';
        this.password = '#loginpassword';
        this.login_button = '//button[contains(text(), "Log in")]'
        this.login_measage = '#nameofuser'
    }

    async clickLogin() {
        await this.page.locator(this.login).click()
    }

    async performLogin(username, password) {
        //clear and type username 
        await this.page.locator(this.username).clear()
        await this.page.locator(this.username).fill(username);
        //type password 
        await this.page.locator(this.password).clear()
        await this.page.fill(this.password, password)
        //click login botton
        await this.page.click(this.login_button)
    }

    async validateSuccess(username) {
        await expect(this.page.locator(this.login_measage)).toBeVisible();
        await expect(this.page.locator(this.login_measage)).toHaveText(`Welcome ${username}`);
        console.log("Logged INNN:)")
    }

}
module.exports = Home;