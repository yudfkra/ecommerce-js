class Product
{
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    calculateTotal(quantity) {
        return this.price * quantity;
    }
}

const loadProductData = () => {
    return fetch('https://6554347063cafc694fe63a4b.mockapi.io/api/v1/products')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Gagal mendapatkan data product.');
    })
    .then(products => [null, products])
    .catch(error => [error, undefined]);
}

const renderProduct = (products = []) => {
    const columns = ['Name', 'Price'];
    
    const elProductContainer = document.getElementById('product-container');
    const elProductTable = document.createElement('table');

    // Create the header row
    const headerRow = document.createElement('tr');
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });

    const thAction = document.createElement('th');
    thAction.textContent = 'Action';
    headerRow.appendChild(thAction);    

    elProductTable.appendChild(headerRow);

    if (products) {
        products.forEach(product => {
            const row = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.textContent = product.name;
            row.appendChild(tdName);

            const tdPrice = document.createElement('td');
            tdPrice.textContent = product.price;
            row.appendChild(tdPrice);

            const tdAction = document.createElement('td');

            const elInputNumber = document.createElement('input');
            elInputNumber.type = 'number';
            elInputNumber.id = `input-product-quantity-${product.id}`;
            elInputNumber.name = `quantity[${product.id}]`;
            elInputNumber.min = 1;
            elInputNumber.max = 100;
            elInputNumber.step = 1;
            elInputNumber.value = 0;
            tdAction.appendChild(elInputNumber);

            const elBtnAddCart = document.createElement('button');
            elBtnAddCart.type = 'button';
            elBtnAddCart.id = `button-product-cart-${product.id}`;
            elBtnAddCart.textContent = 'Add Cart';

            elBtnAddCart.addEventListener('click', function (e) {
                e.preventDefault();
                const quantity = parseInt(elInputNumber.value);
                if (quantity <= 0) {
                    return;
                }

                addProductToCart(product, quantity);
            });
            tdAction.appendChild(elBtnAddCart);

            row.appendChild(tdAction);

            elProductTable.appendChild(row);
        });   
    }

    // Append the table to the container
    elProductContainer.appendChild(elProductTable);
};