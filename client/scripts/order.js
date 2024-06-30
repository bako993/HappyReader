document.addEventListener('DOMContentLoaded', function() {
    // Extract the cart items data from the URL query parameter
    const cartItems = getCartItems();

    // Display the cart items information on the order page
    const orderItemsTable = document.getElementById('orderItems');
    cartItems.forEach(book => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
      <td>${book.book_id}</td>
      <td>${book.book_name}</td>
      <td>${book.author_name}</td>
      <td>${book.category}</td>
      <td>${book.price}</td>
    `;
        orderItemsTable.querySelector('tbody').appendChild(newRow);
    });

    const totalAmount = calculateTotalAmount(cartItems);
    const totalAmountElement = document.getElementById('totalAmount');
    totalAmountElement.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;

    // Clear the cart after placing the order
    localStorage.removeItem('cartItems');

});
document.addEventListener('DOMContentLoaded', function() {
    const customerForm = document.getElementById('customerForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    customerForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;


        const customer = {
            name: name,
            email: email,
            address: address
        };

        try {
            // Send a POST request to the server to create the customer
            const response = await fetch('http://localhost:5000/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customer)
            });

            if (!response.ok) {
                throw new Error('Failed to create customer.');
            }

            const data = await response.json();
            const message = `Thank you, ${data.name}! Your order has been confirmed. We will send a confirmation email to ${data.email}. Your order will be shipped to ${data.address}.`;
            confirmationMessage.textContent = message;
            // Reset the form
            customerForm.reset();
            // the user back to the home page
            setTimeout(function() {
                window.location.href = '../pages/index.html';
            }, 2000);
        } catch (error) {
            console.error('Error creating customer:', error);
            confirmationMessage.textContent = 'Failed to create customer.';
        }
    });
});

function getCartItems() {
    // Extract the cart items data from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cartItemsQueryParam = urlParams.get('cartItems');

    // Parse the cart items data back into an array
    return JSON.parse(decodeURIComponent(cartItemsQueryParam)) || [];
}
function calculateTotalAmount(cartItems) {
    let total = 0;
    cartItems.forEach(book => {
        total += book.price;
    });
    return total;
}

