export class CheckoutStepTwoPage {
    constructor(page)
    {
        this.page = page;

        this.checkoutSummaryInfo = page.locator('.summary_info');
        this.priceTotalLabel = page.locator('.summary_total_label');
        this.finishButton = page.locator('[data-test="finish"]');
    }

    async finishCheckout()
    {
        return this.finishButton.click();
    }
}