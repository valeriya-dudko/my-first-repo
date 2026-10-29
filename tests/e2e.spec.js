import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/login.page';
import {InventoryPage} from '../pages/inventory.page';
import {CartPage} from '../pages/cart.page';
import {CheckoutStepOnePage} from '../pages/checkout.one.page';
import {CheckoutStepTwoPage} from '../pages/checkout.two.page';
import {CheckoutCompletePage} from '../pages/checkout.complete.page';

test('Успешный логин и проверка страниц товаров', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.pageTitle, 'Inventory page is opened.').toHaveText('Products');
    const inventoryItems = await inventoryPage.getInventoryItems();
    const sortedItems = [...inventoryItems].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    const expensiveItem = sortedItems[0];
    await inventoryPage.addItemToCart(expensiveItem.name);

    await inventoryPage.openCart();

    const cartPage = new CartPage(page);
    await expect(page, 'Cart page is opened.').toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(cartPage.cartItems, 'Cart has one item.').toHaveCount(1);
    const cartItem = await cartPage.getCartItems();
    await expect(cartItem[0].name, 'Cart item is the one added.').toBe(expensiveItem.name);

    await cartPage.goToCheckout();

    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await checkoutStepOnePage.fillUserInfo('Test', 'User', '12345');
    await checkoutStepOnePage.continueCheckout();

    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    await checkoutStepTwoPage.finishCheckout();

    const checkoutCompletePage = new CheckoutCompletePage(page);
    await expect(checkoutCompletePage.completeHeader, 'Checkout is complete.').toHaveText('Thank you for your order!');
});