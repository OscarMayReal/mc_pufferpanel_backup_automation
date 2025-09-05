import pkg from "playwright"
import dotenv from "dotenv"
dotenv.config()
const { chromium } = pkg

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function downloadWorld() {
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto("http://localhost:8080")

    await page.locator("#input-20").fill(process.env.PUFFERPANEL_USER!)
    await page.locator("#input-24").fill(process.env.PUFFERPANEL_PASS!)
    await page.locator("button.primary").click()

    await page.waitForSelector("a[href='/server/" + process.env.SERVER_ID + "']")
    await page.locator("a[href='/server/" + process.env.SERVER_ID + "']").click()

    await page.waitForSelector("button[value='files']")
    await page.locator("button[value='files']").click()

    await page.waitForSelector(".v-list-item__title")
    await page.locator(".v-list-item__title").filter({ hasText: "world" }).click()

    await page.waitForSelector("div:nth-of-type(5) div.v-card__title > button:nth-of-type(1) > span")
    await page.locator("div:nth-of-type(5) div.v-card__title > button:nth-of-type(1) > span").click()

    await timeout(60000)

    await page.locator("button[value='console']").click()

    await page.locator("#input-102").fill("/say Backup completed")
    await page.locator("#input-102").press("Enter")

    await browser.close()
}

while (true) {
    await downloadWorld()
    await fetch(process.env.GOOGLE_CHAT_URL!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: "Backup completed"
        })
    })
    await timeout(21600000)
}
