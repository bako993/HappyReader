// Get the list of books from the webapp.db database through (getBooks) function of the serverside.
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:5000/books');
        if (!response.ok) {
            throw new Error('Failed to fetch books.');
        }
        const data = await response.json();
        populateTable(data);
    } catch (error) {
        console.error(error);
    }

}
(async () => {
    await fetchBooks();
})();
function populateTable(data) {
    const booksTable = document.getElementById('booksTable');

    // Loop through the data and create table rows
    data.forEach(book => {
        const row = document.createElement('tr');
        row.setAttribute('id', `book-${book.book_id}`);
        row.innerHTML = `
      <td>${book.book_id}</td>
      <td>${book.book_name}</td>
      <td>${book.author_name}</td>
      <td>${book.category}</td>
      <td>${book.price}</td>
      <td><button class="add-to-cart" data-bookid="${book.book_id}">Add to Cart</button>
      <button class="delete-book" data-bookid="${book.book_id}">Delete</button>
      </td>
    `;
        booksTable.appendChild(row);
    });

    // Add event listeners to the "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCartClicked);
    });

    // Add event listeners to the "Delete" buttons
    const deleteBookButtons = document.querySelectorAll('.delete-book');
    deleteBookButtons.forEach(button => {
        button.addEventListener('click', deleteBookClicked);
    });
}
// Add new book to the webapp.db database using the (createBooks) function of the serverside.
const addBookForm = document.getElementById('addBookForm');
const errorMessageContainer = document.getElementById('errorMessageContainer');
addBookForm.addEventListener('submit', async event => {
    event.preventDefault();

    const bookName = document.getElementById('bookNameInput').value;
    const authorName = document.getElementById('authorNameInput').value;
    const category = document.getElementById('categoryInput').value;
    const price = document.getElementById('priceInput').value;

    if (!bookName || !authorName || !category || isNaN(price) || price <= 0) {
        displayErrorMessage("Please enter a valid positive price.");
        return;
    }

    // Create the book object
    const book = {
        book_name: bookName,
        author_name: authorName,
        category: category,
        price: parseFloat(price)
    };

    try {
        // Send the book data to the server
        const response = await fetch('http://localhost:5000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });

        const data = await response.json();

        // Clear the form inputs
        addBookForm.reset();

        // Add the new book to the table
        const booksTable = document.getElementById('booksTable');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${data.book_id}</td>
            <td>${data.book_name}</td>
            <td>${data.author_name}</td>
            <td>${data.category}</td>
            <td>${data.price}</td>
             <td>
              <button class="add-to-cart" data-bookid="${data.book_id}">Add to Cart</button>
              <button class="delete-book" data-bookid="${data.book_id}">Delete</button>
            </td>
          `;
        booksTable.appendChild(newRow);

        // Add event listener to the new "Add to Cart" button
        const newAddToCartButton = newRow.querySelector('.add-to-cart');
        newAddToCartButton.addEventListener('click', addToCartClicked);

        // Add event listener to the new "Delete" button
        const newDeleteBookButton = newRow.querySelector('.delete-book');
        newDeleteBookButton.addEventListener('click', deleteBookClicked);

    } catch (error) {
        console.error(error);
    }
});

async function addToCartClicked(event) {
    const bookId = event.target.getAttribute('data-bookid');

    try {
        // Retrieve the book data from the server using the book ID
        const response = await fetch(`http://localhost:5000/books/${bookId}`);
        const book = await response.json();

        // Retrieve the existing cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Add the selected book to the cartItems array
        cartItems.push(book);

        // Store the updated cart items in localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Clear the form inputs
        addBookForm.reset();

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-check', 'green-icon');
        event.target.appendChild(icon);
        setTimeout(() => {
            icon.remove();
        }, 2000);
    } catch (error) {
        console.error(error);
    }
}
async function deleteBook(bookId) {
    try {
        const response = await fetch(`http://localhost:5000/books/${bookId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            // Book successfully deleted
            // Remove the corresponding row from the table
            const row = document.getElementById(`book-${bookId}`);
            row.remove();
        } else {
            // Failed to delete book
            console.error('Failed to delete book');
        }
    } catch (error) {
        console.error(error);
    }
}
async function deleteBookClicked(event) {
    const bookId = event.target.getAttribute('data-bookid');
    const confirmation = confirm('Are you sure you want to delete this book?');
    if (!confirmation) {
        return;
    }
    await deleteBook(bookId);
}
function displayErrorMessage(message) {
    // Create error message element
    const errorMessageElement = document.createElement('p');
    errorMessageElement.classList.add('error-message');
    errorMessageElement.textContent = message;

    // Add error message to the container
    errorMessageContainer.appendChild(errorMessageElement);

    setTimeout(() => {
        clearErrorMessage();
    }, 1500);
}
function clearErrorMessage() {
    while (errorMessageContainer.firstChild) {
        errorMessageContainer.removeChild(errorMessageContainer.firstChild);
    }
}