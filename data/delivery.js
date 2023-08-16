import { formatDate_week_month_date } from "../scripts/utils/date.js";
import { formatCurrency } from "../scripts/utils/money.js";

class Delivery {
    constructor(days, priceCents) {
        this.days = days;
        this.priceCents = priceCents;
    }
    getDateContent() {
        return formatDate_week_month_date(this.days);
    }
    getPriceContent() {
        let priceContent = "";
        if( this.priceCents > 0 ){
            priceContent = "$" + formatCurrency(this.priceCents) + " shipping";
        } else {
            priceContent = "Free shipping";
        }
        return priceContent;
    }
}

export const delivery = [
    new Delivery(5, 999),
    new Delivery(6, 499),
    new Delivery(7, 0)
];