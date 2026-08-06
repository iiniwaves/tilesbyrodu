function createProductCard(product) {
    return `
        <div class="tile-card" data-category="${product.category}">
            <div class="tile-card-media">

                <span class="tile-spec-label">
                    ${product.chips[0]}
                </span>

                <img
                    src="${product.images[0]}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>

            <div class="tile-card-body">

                <h3>${product.name}</h3>

                <p>${product.shortDescription}</p>

                <div class="tile-card-actions">

                    <a
                        href="product.html?product=${product.id}"
                        class="btn btn-outline btn-sm">

                        View Details

                    </a>

                    <a
                        href="https://wa.me/2347032417780?text=${encodeURIComponent(
                            `Hi, I'm interested in the ${product.name}`
                        )}"
                        class="btn btn-primary btn-sm"
                        target="_blank">

                        Enquire

                    </a>

                </div>

            </div>

        </div>
    `;
}

function renderSkeletonCards(count) {
    return Array.from({ length: count })
        .map(() => `
            <div class="tile-card tile-card-skeleton">
                <div class="tile-card-media shimmer"></div>
                <div class="tile-card-body">
                    <div class="shimmer shimmer-line" style="width: 60%; height: 20px;"></div>
                    <div class="shimmer shimmer-line" style="width: 90%; height: 14px; margin-top: 12px;"></div>
                    <div class="shimmer shimmer-line" style="width: 70%; height: 14px; margin-top: 8px;"></div>
                </div>
            </div>
        `)
        .join("");
}