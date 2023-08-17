import { cart, removeFromCart, calculateCartQuantity } from "../data/cart.js";
import { productMap } from "../data/products.js";
import { delivery } from "../data/delivery.js";
import { formatCurrency } from "./utils/money.js";
import { order } from "../data/order.js";

// -------------------------------generate cart HTML-----------------------------------

let cartHTML = '';

cart.forEach((cartItem) => {

    let matchingProduct = productMap.get(cartItem.productId);

    cartHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date js-delivery-date-${cartItem.productId}">
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

            <div class="delivery-options js-delivery-options-${matchingProduct.id}">
            </div>

        </div>
    </div>
    `;
})

document.querySelector(".js-order-summary").innerHTML = cartHTML;

// add delete feature
document.querySelectorAll(".js-delete-link").
    forEach((link) => {
        link.addEventListener("click", () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
            updateCheckoutNumHTML();
            updateOrder();
        });
    });

// -------------------------------generate delivery HTML-----------------------------------

function getDeliveryHTML(productId) {
    let deliveryHTML = 
        `<div class="delivery-options-title">
            Choose a delivery option:
        </div>`;
    delivery.forEach((deliveryItem) => {
        deliveryHTML += 
        `<div class="delivery-option">
            <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${productId}" value="${deliveryItem.priceCents}" data-product-id = "${productId}">
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
    document.querySelector(`.js-delivery-options-${cartItem.productId}`).innerHTML = getDeliveryHTML(cartItem.productId);
});

// -------------------------------generate checkout item number HTML-----------------------------------

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

// -------------------------------generate order summary HTML-----------------------------------

let orderSummaryHTML = '';

// recalculate order information
function updateOrder() {

    order.totalItemPrice = 0;
    order.totalShippingAndHandlingPrice = 0;

    cart.forEach(cartItem => {

        let matchingProduct = productMap.get(cartItem.productId);
    
        order.totalItemPrice += matchingProduct.priceCents * cartItem.quantity;
    
        let shippingAndhandlingPrice = 0;
    
        // note how to use radio, use getElementsByName method to get elements
        document.getElementsByName(`delivery-option-${cartItem.productId}`).forEach(radio => {
            // checked是选中的
            if(radio.checked){
                // get value attribute, default type is string which needs to be converted to Number type
                shippingAndhandlingPrice = Number(radio.value);
            }
        });

        let matchingDelivery;

        delivery.forEach(deliveryItem => {
            if(deliveryItem.priceCents === shippingAndhandlingPrice) {
                matchingDelivery = deliveryItem;
            }
        })

        document.querySelector(`.js-delivery-date-${cartItem.productId}`).innerHTML = "Delievry Date: " + matchingDelivery.getDateContent();
    
        order.totalShippingAndHandlingPrice += shippingAndhandlingPrice;
    });

    orderSummaryHTML = `
        <div class="payment-summary-title">
        Order Summary
        </div>

        <div class="payment-summary-row">
        <div>Items (${calculateCartQuantity()}):</div>
        <div class="payment-summary-money">$${formatCurrency(order.totalItemPrice)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatCurrency(order.totalShippingAndHandlingPrice)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatCurrency(order.getTotalBeforeTax())}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (${order.taxRate}%):</div>
        <div class="payment-summary-money">$${formatCurrency(order.getEstimatedTax())}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatCurrency(order.getTotal())}</div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>
    `;

    document.querySelector(".js-payment-summary").innerHTML = orderSummaryHTML;
}

// initialize order
updateOrder();

// add click event to delivery radio
document.querySelectorAll(".delivery-option-input").forEach(radio => {
    radio.addEventListener("click", () => {
        updateOrder();
    });
});