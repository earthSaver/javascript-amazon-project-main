class Order {
    constructor(totalItemPrice, totalShippingAndHandlingPrice, taxRate) {
        this.totalItemPrice = totalItemPrice;
        this.totalShippingAndHandlingPrice = totalShippingAndHandlingPrice;
        this.taxRate = taxRate;
    }
    getTotalBeforeTax() {
        return this.totalItemPrice + this.totalShippingAndHandlingPrice;
    }
    getEstimatedTax() {
        return this.taxRate * this.getTotalBeforeTax() / 100
    }
    getTotal() {
        // must add this
        return this.getTotalBeforeTax() + this.getEstimatedTax();
    }
}

export const order = new Order(0, 0, 15);