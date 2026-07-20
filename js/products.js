document.addEventListener("DOMContentLoaded", async () => {

    const grid = document.getElementById("products-grid");

    if (!grid) return;

    grid.innerHTML = renderSkeletonCards(6);

    let products = await getProducts();

    renderProducts(products);

    const filters = document.querySelectorAll(".filter-pill");

    filters.forEach(button => {

        button.addEventListener("click", async () => {

            filters.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const category = button.dataset.filter;

            grid.innerHTML = renderSkeletonCards(6);

            products = await getProductsByCategory(category);

            renderProducts(products);

        });

    });

    function renderProducts(products) {

        grid.innerHTML = products
            .map(createProductCard)
            .join("");

        if (window.lucide) {
            window.lucide.createIcons();
        }

    }

});