document.addEventListener('DOMContentLoaded', function() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length > 0) {
        const cartTable = document.getElementById('cartItems');

        cartItems.forEach(book => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
        <td>${book.book_id}</td>
        <td>${book.book_name}</td>
        <td>${book.author_name}</td>
        <td>${book.category}</td>
        <td>${book.price}</td>
        <td><button class="remove-book">Remove</button></td>
      `;

            cartTable.querySelector('tbody').appendChild(newRow);
        });

        const removeButtons = document.querySelectorAll('.remove-book');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeBookClicked);
        });

        const totalAmount = calculateTotalAmount(cartItems);
        const totalAmountElement = document.getElementById('totalAmount');
        totalAmountElement.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    }

    const orderButton = document.getElementById('orderButton');
    orderButton.addEventListener('click', placeOrderClicked);
});

function removeBookClicked(event) {
    const row = event.target.closest('tr');
    row.remove();

    const bookId = row.querySelector('td:first-child').textContent;
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartItems = cartItems.filter(book => book.book_id.toString() !== bookId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    const totalAmount = calculateTotalAmount(cartItems);
    const totalAmountElement = document.getElementById('totalAmount');
    totalAmountElement.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;

    localStorage.removeItem(bookId);
}

function calculateTotalAmount(cartItems) {
    let total = 0;
    cartItems.forEach(book => {
        total += book.price;
    });
    return total;
}

function placeOrderClicked() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsQueryParam = encodeURIComponent(JSON.stringify(cartItems));
    localStorage.removeItem('cartItems');
    window.location.href = `../pages/order.html?cartItems=${cartItemsQueryParam}`;
}