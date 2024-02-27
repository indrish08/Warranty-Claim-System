var orders
var table

const startPicker = new SimplePicker({
    zIndex: 10,
});
const endPicker = new SimplePicker(".head", {
    zIndex: 10,
});

const startDateTimeInput = document.querySelector(".start-datetime");
const endDateTimeInput = document.querySelector(".end-datetime");
document.addEventListener("DOMContentLoaded", loadDataTable);
document.querySelector(".filter-trigger").addEventListener("mousedown", updateDataTable);
document.querySelector(".filter-time").addEventListener("change", selectTime);

startDateTimeInput.addEventListener("click", () => {
    startPicker.open();
});

endDateTimeInput.addEventListener("click", () => {
    endPicker.open();
});

startPicker.on("submit", (date, readableDate) => {
    startDateTimeInput.value = readableDate;
    const startDate = new Date(readableDate);
    const endDate = new Date(endDateTimeInput.value)
    if (endDate && endDate <= startDate) {
        startDateTimeInput.value = "";
    }
});

endPicker.on("submit", (date, readableDate) => {
    endDateTimeInput.value = readableDate;
    const startDate = new Date(startDateTimeInput.value);
    const endDate = new Date(readableDate)
    if (startDate && endDate <= startDate) {
        endDateTimeInput.value = "";
    }
});

async function getOrdersData() {
    const status = document.querySelector(".filter-status").value;
    const time = document.querySelector(".filter-time").value;

    var reqBody = {
        status: status,
        time: time,
    }
    if (time === 'custom-range' && startDateTimeInput.value !== '' && endDateTimeInput.value !== '') {
        reqBody.startDate = new Date(startDateTimeInput.value)
        reqBody.endDate = new Date(endDateTimeInput.value)
    }
    
    const response = await fetch("/getorders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
    });
    orders = await response.json();
    return orders;
}

async function loadDataTable() {
    orders = await getOrdersData();
    table = await new DataTable("#example", {
        data: orders,
        order: [[3, "desc"]],
        columnDefs: [
            {
                targets: [1, 2, 4, 5],
                orderable: false,
            },
            {
                targets: [0, 5],
                className: "text-center",
            },
        ],
        columns: [
            { data: "id" },
            {
                data: "Products",
                render: (data) => data[0].name,
            },
            { data: "billingAddress" },
            {
                data: "orderDate",
                render: (data) => new Date(data).toLocaleDateString("en-GB"),
                type: "date-uk",
            },
            {
                data: "Products",
                render: (data) => `₹${data[0].price}`,
            },
            { data: "status" },
        ],
    });
    updateButton();
    table.on("draw.dt", updateButton);
    table.on("click", ".claim-warranty-button", openModal);
}

async function updateDataTable() {
    orders = await getOrdersData();
    table.clear().draw();
    table.rows.add(orders).draw();
}

function updateButton() {
    table
        .column(5)
        .nodes()
        .each(function (cell) {
            var status = table.cell(cell).data();
            if (status === "Delivered") {
                var orderId = cell
                    .closest("tr")
                    .querySelector("td:first-child").textContent;
                var buttonHTML = `<button class="claim-warranty-button btn btn-warning" data-order-id="${orderId}">Claim Warranty</button>`;
                cell.innerHTML = buttonHTML;
            }
        });
}

function openModal() {
    document.querySelector(".order-id").textContent =
        this.getAttribute("data-order-id");
    $("#claim-warranty").modal("show");
}

function selectTime() {
    const time = document.querySelector('.filter-time').value;
    const custom_range_picker = document.querySelectorAll('.custom-range-picker')

    custom_range_picker[0].classList.toggle('d-none', !(time === 'custom-range'));
    custom_range_picker[1].classList.toggle('d-none', !(time === 'custom-range'));  
}

// filter status and time period for in datatable
// function filterStatus(){
//     table.column(5).search(this.value).draw();
// }
// function filterTime(){
//     switch (this.value) {
//         case 'all':
//             table.column(3).search('').draw();
//             break;
//         case '30days':
//             var start = moment().subtract(30, 'days');
//             table.column(3).search(date =>
//                 moment(date, 'DD/MM/YYYY').isBetween(start, moment(), undefined, '[]')
//             ).draw();
//             break;
//         case '3months':
//             var start = moment().subtract(3, 'months');
//             table.column(3).search(date =>
//                 moment(date, 'DD/MM/YYYY').isBetween(start, moment(), undefined, '[]')
//             ).draw();
//             break;
//         case 'older':
//             table.column(3).search(d =>
//                 moment(d, 'DD/MM/YYYY').isBefore(moment('2020-12-31').endOf('year'))
//             ).draw();
//             break;
//         default:
//             table.column(3).search(this.value + "$", true, false).draw()
//             break;
//     }
// }

// search orders: both server side and client side
// async function searchOrdersData() {
//     const search = document.querySelector('.searchOrder').value
//     if (search.length !== 0) {
//         const response = await fetch('/getorders', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 search: search
//             })
//         });
//         orders = await response.json();
//         loadData(orders);
//     }
// }
// function searchOrders() {
//     const search = document.querySelector('.searchOrder').value
//     var filteredOrders = orders.filter(order =>
//         order.Products.some(product => product.name.toLowerCase().includes(search.toLowerCase()))
//     )
//     loadData(filteredOrders)
// }

// inserting
// function loadData(orders) {
//     document.querySelector('.orders-count').innerHTML = orders.length
//     const order_list = document.querySelector(".order-list");
//     while (order_list.lastChild) {
//         order_list.removeChild(order_list.lastChild);
//     }

//     if (orders.length === 0) {
//         var empty_orders = document.createElement("div")
//         empty_orders.classList.add("text-center", "mt-5")
//         empty_orders.innerHTML = "There are no orders to show here."
//         order_list.append(empty_orders)
//     }

//     orders.forEach((order) => {
//         var list_group = document.createElement("div");
//         list_group.classList.add("list-group", "mt-3");

//         order.Products.forEach((product) => {
//             const orderData = {
//                 name: product.name,
//                 address: order.shippingAddress,
//                 date: new Date(order.dispatchDate).toLocaleDateString("en-IN", {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                 }),
//                 price: product.price,
//                 quantity: product.OrderProduct.quantity,
//                 status: order.status,
//             };
//             list_group.append(addOrderItem(orderData));
//         });

//         order_list.append(list_group);
//     });
// }
// function addOrderItem(order) {
//     var list_group_item = document.createElement("div");
//     list_group_item.classList.add("list-group-item");
//     var grid = document.createElement("div");
//     grid.classList.add("row", "align-items-center");
//     var item_head = document.createElement("div");
//     item_head.classList.add("item-head", "col-6");
//     var item_name = document.createElement("div");
//     item_name.classList.add("item-name");
//     var item_address = document.createElement("div");
//     item_address.classList.add("item-address");
//     var item_date = document.createElement("div");
//     item_date.classList.add("item-date", "col-2");
//     var item_price = document.createElement("div");
//     item_price.classList.add("item-price", "col-2");
//     var item_warranty = document.createElement("div");
//     item_warranty.classList.add("item-warranty", "col-2");
//     var button = document.createElement("button");
//     button.classList.add("btn", "w-100");

//     item_head.append(item_name, item_address);
//     item_warranty.append(button);
//     grid.append(item_head, item_date, item_price, item_warranty);
//     list_group_item.appendChild(grid);

//     item_name.textContent = `${order.name}${
//         order.quantity === 1 ? "" : " x" + order.quantity
//     }`;
//     item_address.textContent = order.address;
//     item_date.textContent = order.date;
//     item_price.textContent = `₹${order.price}`;

//     if (order.status === 'Delevered') {
//         button.textContent = 'Claim Warranty'
//         button.classList.add('btn-warning')
//     } else {
//         button.textContent = order.status
//         if (order.status === 'Cancelled') {
//             button.classList.add('btn-danger')
//         } else if (order.status === 'Ordered') {
//             button.classList.add('btn-success')
//         } else {
//             button.classList.add('btn-info')
//         }
//     }

//     return list_group_item;
// }
