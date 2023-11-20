const coupons = ['APPLY10', 'APPLY20'];

const getCurrentCart = () => {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('user.cart')) || [];
    } catch (error) {
        cart = [];
    }
    return cart;
};

const countTotalItemInCart = () => getCurrentCart().reduce(
    (totalItem, product) => totalItem + product.quantity, 0
);

const countTotalItemInPrice = () => getCurrentCart().reduce(
    (totalItem, product) => totalItem + product.total, 0
);

const renderTotalCart = () => {
    const elTotalCartItem = document.getElementById('total-cart-item');
    elTotalCartItem.innerText = countTotalItemInCart();

    const elTotalCartPrice = document.getElementById('total-cart-price');
    elTotalCartPrice.innerText = countTotalItemInPrice();
}

const addProductToCart = ({ id, name, price }, quantity, replace = false) => {
    const currentCart = getCurrentCart();

    const findProduct = currentCart.findIndex(product => product.id === id);
    if (findProduct !== -1) {
        if (quantity >= 1) {
            const existProduct = currentCart[findProduct];
            const updatedQuantity = replace ? parseInt(quantity) : parseInt(existProduct.quantity) + parseInt(quantity);
            const updatedTotal = updatedQuantity * price;
            const updateProduct = { ...existProduct, price: price, quantity: updatedQuantity, total: updatedTotal }

            currentCart[findProduct] = updateProduct;   
        }

        if (quantity === 0) {
            currentCart.splice(findProduct, 1);
        }
    }

    if (findProduct === -1 && quantity >= 1) {
        currentCart.push({ id, name, price, quantity, total: price * quantity });
    }

    localStorage.setItem('user.cart', JSON.stringify(currentCart));
    renderTotalCart();
};

const renderCartProduct = (username) => {
    const elUsername = document.getElementById('checkout-username');
    elUsername.innerText = username;

    const columns = ['Name', 'Price', 'Action', 'Total'];

    const elCheckoutContainer = document.getElementById('checkout-container');
    elCheckoutContainer.innerHTML = '';

    const elProductTable = document.createElement('table');

    // Create the header row
    const headerRow = document.createElement('tr');
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });

    elProductTable.appendChild(headerRow);

    const products = getCurrentCart();
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
            elInputNumber.min = 0;
            elInputNumber.max = 100;
            elInputNumber.step = 1;
            elInputNumber.value = product.quantity;
            tdAction.appendChild(elInputNumber);

            const elBtnUpdate = document.createElement('button');
            elBtnUpdate.type = 'button';
            elBtnUpdate.id = `button-product-cart-${product.id}`;
            elBtnUpdate.textContent = 'Update Cart';

            elBtnUpdate.addEventListener('click', function (e) {
                e.preventDefault();
                const quantity = parseInt(elInputNumber.value);

                addProductToCart(product, quantity, true);
                renderCartProduct(username);
            });
            tdAction.appendChild(elBtnUpdate);

            row.appendChild(tdAction);

            const tdTotal = document.createElement('td');
            tdTotal.textContent = product.total;
            row.appendChild(tdTotal);            

            elProductTable.appendChild(row);
        });
    }

    // Append the table to the container
    elCheckoutContainer.appendChild(elProductTable);
};

(() => {
    renderTotalCart();
})();