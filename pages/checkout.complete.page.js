export class CheckoutCompletePage {
    constructor(page)
    {
        this.page = page;

        this.completeHeader = page.locator('.complete-header');
        this.backButton = page.locator('[data-test="back-to-products"]');
    }

    async getCompletionMessage()
    {
        return this.completeHeader.textContent();
    }
}