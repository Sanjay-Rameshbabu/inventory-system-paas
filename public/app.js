// public/app.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const productIdInput = document.getElementById('product-id');
    const submitButton = document.getElementById('submit-button');

    const API_URL = 'http://localhost:3000/api/products';

    // READ: Fetch products from the server and display them
    const fetchProducts = async () => {
        const response = await fetch(API_URL);
        const products = await response.json();

        productList.innerHTML = ''; // Clear the list before repopulating
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${product.id}" data-name="${product.name}" data-quantity="${product.quantity}" data-price="${product.price}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            productList.appendChild(tr);
        });
    };

    // Handle form submission for CREATE and UPDATE
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = productIdInput.value;
        const name = document.getElementById('product-name').value;
        const quantity = document.getElementById('product-quantity').value;
        const price = document.getElementById('product-price').value;

        const productData = { name, quantity, price };
        let method = 'POST';
        let url = API_URL;

        if (id) { // If there's an ID, it's an UPDATE
            method = 'PUT';
            url = `${API_URL}/${id}`;
        }

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        resetForm();
        fetchProducts();
    });

    // Handle clicks on Edit and Delete buttons
    productList.addEventListener('click', async (e) => {
        const target = e.target;

        // DELETE
        if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchProducts();
        }

        // UPDATE (prepare form for editing)
        if (target.classList.contains('edit-btn')) {
            productIdInput.value = target.dataset.id;
            document.getElementById('product-name').value = target.dataset.name;
            document.getElementById('product-quantity').value = target.dataset.quantity;
            document.getElementById('product-price').value = target.dataset.price;
            submitButton.textContent = 'Update Product';
        }
    });

    // Function to reset the form after submission or edit
    const resetForm = () => {
        form.reset();
        productIdInput.value = '';
        submitButton.textContent = 'Add Product';
    };

    // Initial fetch of products when the page loads
    fetchProducts();
});