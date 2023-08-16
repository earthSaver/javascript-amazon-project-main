import { cart, removeFromCart, calculateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { delivery } from "../data/delivery.js";
import { formatCurrency } from "./utils/money.js";
// import { getFormattedDateWithWeekMonthDate } from "./utils/date.js";

let cartHTML = '';

// console.log(getFormattedDateWithWeekMonthDate());

function getDeliveryHTML(matchingProduct) {
    let deliveryHTML = 
        `<div class="delivery-options-title">
            Choose a delivery option:
        </div>`;
    delivery.forEach((deliveryItem) => {
        deliveryHTML += 
        `<div class="delivery-option">
            <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}}" value="${deliveryItem.priceCents}">
            <div>
            <div class="delivery-option-date">
                ${deliveryItem.getDateContent()}
            </div>
            <div class="delivery-option-price">
                ${deliveryItem.getPriceContent()}
            </div>
            </div>
        </div>`;
    });
    return deliveryHTML;
}



cart.forEach((cartItem) => {

    let matchingProduct;

    products.forEach((productItem) => {
        if(productItem.id === cartItem.productId){
            matchingProduct = productItem;
        }
    });

    cartHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options js-delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                <div class="delivery-option">
                    <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}}" value="${delivery.priceCents}">
                    <div>
                    <div class="delivery-option-date">
                        Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                        FREE Shipping
                    </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}}" value="${deliveryFeeCents.get("Wednesday")}">
                    <div>
                    <div class="delivery-option-date">
                        Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                        $${formatCurrency(deliveryFeeCents.get("Wednesday"))} - Shipping
                    </div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}}" value="${deliveryFeeCents.get("Monday")}">
                    <div>
                    <div class="delivery-option-date">
                        Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                        $${formatCurrency(deliveryFeeCents.get("Monday"))} - Shipping
                    </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `;
})

// console.log(cartHTML);

document.querySelector(".js-order-summary").innerHTML = cartHTML;

function updateCheckoutNumHTML() {
    let checkoutNumHTML = "";

    let checkoutNum = calculateCartQuantity();

    if (checkoutNum < 2) {
        checkoutNumHTML = checkoutNum + " item";
    } else {
        checkoutNumHTML = checkoutNum + " items";
    }
    document.querySelector(".js-checkout-header").innerHTML = checkoutNumHTML;
}

updateCheckoutNumHTML();

document.querySelectorAll(".js-delete-link").
    forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
            updateCheckoutNumHTML();
        });
    });