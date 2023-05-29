const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('id');

const orderIdElement = document.getElementById('orderId');
orderIdElement.textContent = orderId;