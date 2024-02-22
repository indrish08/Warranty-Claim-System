var orders

document.addEventListener("DOMContentLoaded", getOrdersData)
document.querySelector('.filter-trigger').addEventListener('mousedown', getOrdersData)
document.querySelector('.search-button').addEventListener('mousedown', searchOrdersData)
document.querySelector('.searchOrder').addEventListener('input', searchOrders)


async function searchOrdersData() {
    const search = document.querySelector('.searchOrder').value
    if (search.length !== 0) {
        const response = await fetch('/getorders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                search: search
            })
        });
        orders = await response.json();
        loadData(orders);
    }
}

function searchOrders() {
    const search = document.querySelector('.searchOrder').value
    var filteredOrders = orders.filter(order => {
        return order.Products.some(product => product.name.toLowerCase().includes(search.toLowerCase()))
    })
    loadData(filteredOrders)
}

async function getOrdersData() {
    const status = document.querySelector('.filter-status').value
    const time = document.querySelector('.filter-time').value
    
    const response = await fetch('/getorders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status: status,
            time: time,
        })
    });
    orders = await response.json();
    loadData(orders);
}   

function loadData(orders) {
    const order_list = document.querySelector(".order-list");
    while (order_list.lastChild) {
        order_list.removeChild(order_list.lastChild);
    }

    if (orders.length === 0) {
        var empty_orders = document.createElement("div")
        empty_orders.classList.add("text-center", "mt-5")
        empty_orders.innerHTML = "There are no orders to show here."
        order_list.append(empty_orders)
    }
    
    orders.forEach((order) => {
        var list_group = document.createElement("div");
        list_group.classList.add("list-group", "mt-3");

        order.Products.forEach((product) => {
            const orderData = {
                name: product.name,
                address: order.shippingAddress,
                date: new Date(order.dispatchDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
                price: product.price,
                quantity: product.OrderProduct.quantity,
                status: order.status,
            };
            list_group.append(addOrderItem(orderData));
        });

        order_list.append(list_group);
    });
}

function addOrderItem(order) {
    var list_group_item = document.createElement("div");
    list_group_item.classList.add("list-group-item");
    var grid = document.createElement("div");
    grid.classList.add("row", "align-items-center");
    var item_head = document.createElement("div");
    item_head.classList.add("item-head", "col-6");
    var item_name = document.createElement("div");
    item_name.classList.add("item-name");
    var item_address = document.createElement("div");
    item_address.classList.add("item-address");
    var item_date = document.createElement("div");
    item_date.classList.add("item-date", "col-2");
    var item_price = document.createElement("div");
    item_price.classList.add("item-price", "col-2");
    var item_warranty = document.createElement("div");
    item_warranty.classList.add("item-warranty", "col-2");
    var button = document.createElement("button");
    button.classList.add("btn", "w-100");

    item_head.append(item_name, item_address);
    item_warranty.append(button);
    grid.append(item_head, item_date, item_price, item_warranty);
    list_group_item.appendChild(grid);

    item_name.innerHTML = `${order.name}${
        order.quantity === 1 ? "" : " x" + order.quantity
    }`;
    item_address.innerHTML = order.address;
    item_date.innerHTML = order.date;
    item_price.innerHTML = `₹${order.price}`;

    if (order.status === 'Delevered') {
        button.innerHTML = 'Claim Warranty'
        button.classList.add('btn-warning')
    } else {
        button.innerHTML = order.status
        if (order.status === 'Cancelled') {
            button.classList.add('btn-danger')
        } else if (order.status === 'Ordered') {
            button.classList.add('btn-success')
        } else {
            button.classList.add('btn-info')
        }
    }

    return list_group_item;
}