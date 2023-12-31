(async () => {
    const username = 'TEST-NEURON';

    const elBtnCheckout = document.getElementById('btn-checkout');
    const elCheckoutSection = document.getElementById('checkout-section');
    const toggleCheckoutSection = (show) => elCheckoutSection.style.display = show ? 'block' : 'none';

    const elProductSection = document.getElementById('product-section');
    const toggleProductSection = (show) => elProductSection.style.display = show ? 'block' : 'none';

    const elProductListState = document.getElementById('product-list-state');
    const toggleProductListState = (isLoading) => {
        elProductListState.innerText = isLoading ? 'Loading...' : '';
        elProductListState.style.display = isLoading ? 'block' : 'none';
    };

    elBtnCheckout.addEventListener('click', (e) => {
        toggleProductSection(false);
        
        toggleCheckoutSection(true);
        renderCartProduct(username);
    });

    toggleProductSection(true);
    toggleProductListState(true);

    const [error, products] = await loadProductData().finally(() => toggleProductListState(false));
    if (error) {
        elProductListState.innerText = error;
        elProductListState.style.display = 'block';
    }
    renderProduct(products || []);
})();