document.addEventListener("DOMContentLoaded", async () => {

    const grid = document.getElementById("featured-products-grid");

    if (!grid) return;

    // Light shimmer placeholder while the data loads, so the section
    // doesn't just sit empty for the split-second before render.
    grid.innerHTML = renderSkeletonCards(3);

    const featured = await getFeaturedProducts();

    grid.innerHTML = featured
        .map(createProductCard)
        .join("");

    if (window.lucide) {
        window.lucide.createIcons();
    }

});
