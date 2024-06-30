// Fetch all customers from server
async function fetchCustomers() {
    try {
        const response = await fetch('http://localhost:5000/customers');
        if (!response.ok) {
            throw new Error('Unable to fetch customers');
        }
        const customers = await response.json();
        return customers;
    } catch (error) {
        console.error(error);
        return [];
    }
}
// Fetch delete customer function
async function deleteCustomer(customerId) {
    try {
        const response = await fetch(`http://localhost:5000/customers/${customerId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Unable to delete customer');
        }
        console.log(`Customer with ID ${customerId} has been deleted`);
        // Refresh the customer table
        await displayCustomers();
    } catch (error) {
        console.error(error);
    }
}
// Fetch update customer function
async function updateCustomer(customerId, updatedCustomer) {
    try {
        const response = await fetch(`http://localhost:5000/customers/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCustomer)
        });
        if (!response.ok) {
            throw new Error('Unable to update customer');
        }
        console.log(`Customer with ID ${customerId} has been updated`);

        await displayCustomers();
    } catch (error) {
        console.error(error);
    }
}

// Function to display customers in the table
async function displayCustomers() {
    const customersTable = document.getElementById('customers-table');
    const tbody = customersTable.querySelector('tbody');

    // Fetch customers
    const customers = await fetchCustomers();

    // Generate table rows
    const rows = customers.map((customer) => {
        return `
      <tr>
        <td>${customer.customer_id}</td>
        <td>${customer.name}</td>
        <td>${customer.email}</td>
        <td>${customer.address}</td>
        <td>
          <button class="delete-btn" data-customer-id="${customer.customer_id}">Delete</button>
          <button class="update-btn" data-customer-id="${customer.customer_id}">Update</button>
        </td>
      </tr>
    `;
    });

    // Append rows to the table body
    tbody.innerHTML = rows.join('');

    // Add event listeners to delete buttons
    const deleteButtons = document.getElementsByClassName('delete-btn');
    Array.from(deleteButtons).forEach((button) => {
        button.addEventListener('click', () => {
            const customerId = button.getAttribute('data-customer-id');
            deleteCustomer(customerId);
        });
    });

    // Add event listeners to update buttons
    const updateButtons = document.getElementsByClassName('update-btn');
    Array.from(updateButtons).forEach((button) => {
        button.addEventListener('click', () => {
            const customerId = button.getAttribute('data-customer-id');
            const customerRow = button.parentNode.parentNode;
            const nameCell = customerRow.querySelector('td:nth-child(2)');
            const emailCell = customerRow.querySelector('td:nth-child(3)');
            const addressCell = customerRow.querySelector('td:nth-child(4)');

            const currentName = nameCell.textContent;
            const currentEmail = emailCell.textContent;
            const currentAddress = addressCell.textContent;

            const newName = prompt('Enter the updated name:', currentName);
            const newEmail = prompt('Enter the updated email:', currentEmail);
            const newAddress = prompt('Enter the updated address:', currentAddress);

            if (newName !== null || newEmail !== null || newAddress !== null) {
                const updatedCustomer = {
                    name: newName !== null ? (newName !== '' ? newName : currentName) : currentName,
                    email: newEmail !== null ? (newEmail !== '' ? newEmail : currentEmail) : currentEmail,
                    address: newAddress !== null ? (newAddress !== '' ? newAddress : currentAddress) : currentAddress
                };

                updateCustomer(customerId, updatedCustomer);
            }
        });
    });
}
window.addEventListener('load', displayCustomers);

