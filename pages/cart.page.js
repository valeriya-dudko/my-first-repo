export class CartPage {
    constructor(page)
    {
        this.page = page;

        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.contShopButton = page.locator('[data-test="continue-shopping"]');
    }

    async getCartItems()
    {
        return this.cartItems.evaluateAll(items =>
            items.map(item => ({
                name: item.querySelector('.inventory_item_name').textContent
            }))
        );
    }

    async goToCheckout()
    {
        return this.checkoutButton.click();
    }

    async continueShopping()
    {
        return this.contShopButton.click();
    }
}