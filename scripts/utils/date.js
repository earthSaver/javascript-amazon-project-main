const weekMap = new Map([
    [1, "Monday"],
    [2, "Tuesday"],
    [3, "Wednesday"],
    [4, "Thursday"],
    [5, "Friday"],
    [6, "Saturday"],
    [7, "Sunday"]
]);

const monthMap = new Map([
    [0, "January"],
    [1, "February"],
    [2, "March"],
    [3, "April"],
    [4, "May"],
    [5, "June"],
    [6, "July"],
    [7, "August"],
    [9, "October"],
    [9, "September"],
    [10, "November"],
    [11, "December"]
]);

export function formatDate_week_month_date(dateDelta) {
    if( !dateDelta ) {
        dateDelta = 0;
    }
    let date = new Date();
    date.setDate(date.getDate() + dateDelta);
    return weekMap.get(date.getDay()) + ", " + monthMap.get(date.getMonth()) + " " + date.getDate();
}