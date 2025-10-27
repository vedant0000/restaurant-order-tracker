const API = "http://localhost:3000";

async function loadMenu() {
  const res = await fetch(`${API}/menu`);
  const items = await res.json();
  const tbody = document.querySelector("#menuTable tbody");
  const select = document.getElementById("orderItem");
  tbody.innerHTML = "";
  select.innerHTML = "";
  items.forEach(i => {
    tbody.innerHTML += `<tr><td>${i.name}</td><td>${i.category}</td><td>${i.price}</td></tr>`;
    select.innerHTML += `<option value="${i._id}">${i.name}</option>`;
  });
}

async function addMenuItem() {
  const name = document.getElementById("itemName").value;
  const category = document.getElementById("itemCategory").value;
  const price = parseInt(document.getElementById("itemPrice").value);
  await fetch(`${API}/menu`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, category, price})
  });
  loadMenu();
}

// ---- Customers ----
async function loadCustomers() {
  const res = await fetch(`${API}/customers`);
  const customers = await res.json();
  const list = document.getElementById("customerList");
  const select = document.getElementById("orderCustomer");
  list.innerHTML = "";
  select.innerHTML = "";
  customers.forEach(c => {
    list.innerHTML += `<li>${c.name} (${c.phone})</li>`;
    select.innerHTML += `<option value="${c._id}">${c.name}</option>`;
  });
}

async function addCustomer() {
  const name = document.getElementById("custName").value;
  const phone = document.getElementById("custPhone").value;
  const email = document.getElementById("custEmail").value;
  await fetch(`${API}/customers`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, phone, email})
  });
  loadCustomers();
}

// ---- Orders ----
async function loadOrders() {
  const res = await fetch(`${API}/orders`);
  const orders = await res.json();
  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";
  orders.forEach(o => {
    tbody.innerHTML += `<tr>
      <td>${o.customerId}</td>
      <td>${o.items.length}</td>
      <td>${o.totalAmount}</td>
      <td>${o.status}</td>
    </tr>`;
  });
}

async function placeOrder() {
  const customerId = document.getElementById("orderCustomer").value;
  const menuItemId = document.getElementById("orderItem").value;
  const quantity = parseInt(document.getElementById("orderQty").value);
  await fetch(`${API}/orders`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      customerId,
      items: [{menuItemId, quantity}]
    })
  });
  loadOrders();
}

// ---- Initial load ----
loadMenu();
loadCustomers();
loadOrders();
