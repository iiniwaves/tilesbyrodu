document.addEventListener("DOMContentLoaded", async () => {

    const grid = document.getElementById("products-grid");

    if (!grid) return;

    grid.innerHTML = renderSkeletonCards(6);

    try {

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

                const filtered = await getProductsByCategory(category);

                renderProducts(filtered);

            });

        });

    } catch (err) {

        console.error("Failed to load products:", err);

        grid.innerHTML = `
            <div class="products-error" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                <p style="font-size: 1.1rem; margin-bottom: 8px;"><strong>Unable to load products.</strong></p>
                <p style="color: #666;">This page needs to be served over HTTP. Use a local server (e.g. Live Server in VS Code) instead of opening the file directly.</p>
            </div>
        `;

    }

    function renderProducts(products) {

        grid.innerHTML = products
            .map(createProductCard)
            .join("");

        if (window.lucide) {
            window.lucide.createIcons();
        }

    }

});