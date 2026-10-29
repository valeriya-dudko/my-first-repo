export class InventoryPage {
    constructor(page)
    {
        this.page = page;

        this.pageTitle = page.locator('.title');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.inventoryItems = page.locator('.inventory_item');
        this.addToCartButtons = page.locator('.btn_inventory');
    }

    async getInventoryItems()
    {
        return this.inventoryItems.evaluateAll(items =>
            items.map(item => ({
                name: item.querySelector('.inventory_item_name').textContent,
                price: item.querySelector('.inventory_item_price').textContent.replace('$', '')
            }))
        );
    }

    async addItemToCart(itemName)
    {
        const item = this.inventoryItems.filter({ hasText: itemName });
        const addToCartButton = item.locator(this.addToCartButtons);
        return addToCartButton.click();
    }

    async openCart()
    {
        return this.cartIcon.click();
    }

    async getPageTitle()
    {
        return this.pageTitle.textContent();
    }
}