const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

(async () => {
    // 启动和初始化插件
    const pathToExtension = require('path').join(__dirname, '2captcha-solver');
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });

    const [page] = await browser.pages()

    // 打开一个页面
    await page.goto('https://2captcha.com/demo/recaptcha-v2')

    // 等待带有 CSS 选择器“.captcha-solver”的元素可用
    await page.waitForSelector('.captcha-solver')

    // 点击指定选择器的元素
    await page.click('.captcha-solver')

    // 默认情况下，waitForSelector 等待 30 秒，但是这个时间通常是不够的，所以我们用第二个参数手动指定超时值。超时值以“ms”为单位指定
    await page.waitForSelector(`.captcha-solver[data-state="solved"]`, { timeout: 180000 })

    // 点击“检查”按钮，检查验证码是否成功解决
    await page.click("button[type='submit']")
})();