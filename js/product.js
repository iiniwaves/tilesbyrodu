document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");

    // Temporary fallback while we're building
    const id = productId || "matte-grey-floor-tile";

    const product = await getProduct(id);

    if (!product) {
        document.body.innerHTML = "<h1>Product not found.</h1>";
        return;
    }

    await populateProduct(product);

});

async function populateProduct(product) {

    renderBreadcrumb(product);
    renderProductInfo(product);
    renderGallery(product);
    renderChips(product);
    renderFeatures(product);
    renderSpecifications(product);
    renderWhatsappButton(product);

    await renderRelatedProducts(product);

}

function renderBreadcrumb(product) {

    document.getElementById("breadcrumb-name").textContent =
        product.name;

    document.getElementById("breadcrumb-category").textContent =
        formatCategory(product.category);

    document.getElementById("breadcrumb-category").href =
        `products.html#${product.category}`;

}

function renderProductInfo(product) {

    document.getElementById("product-category").textContent =
        formatCategory(product.category);

    document.getElementById("product-name").textContent =
        product.name;

    document.getElementById("product-description").textContent =
        product.description;

}

function renderGallery(product) {

    const mainImage = document.getElementById("product-main-image");
    const mainWrap = mainImage ? mainImage.closest(".gallery-main") : null;
    const thumbnails = document.getElementById("product-thumbnails");

    mainImage.src = product.images[0];
    mainImage.alt = product.name;

    if (!thumbnails) return;

    thumbnails.innerHTML = "";

    product.images.forEach((image, index) => {

        const img = document.createElement("img");

        img.src = image;
        img.alt = `${product.name} ${index + 1}`;

        if (index === 0) {
            img.classList.add("active");
        }

        img.addEventListener("click", () => {

            if (mainImage.src.endsWith(image)) return;

            document
                .querySelectorAll("#product-thumbnails img")
                .forEach(i => i.classList.remove("active"));

            img.classList.add("active");

            if (mainWrap) mainWrap.classList.add("is-swapping");

            window.setTimeout(() => {
                mainImage.src = image;
                if (mainWrap) mainWrap.classList.remove("is-swapping");
            }, 180);

        });

        thumbnails.appendChild(img);

    });

}

function renderChips(product) {

    const chipsContainer =
        document.getElementById("product-chips");

    if (!chipsContainer) return;

    chipsContainer.innerHTML = "";

    product.chips.forEach(chip => {

        const span = document.createElement("span");

        span.className = "chip";

        span.textContent = chip;

        chipsContainer.appendChild(span);

    });

}

function renderFeatures(product) {

    const featuresList =
        document.getElementById("product-features");

    if (!featuresList) return;

    featuresList.innerHTML = "";

    product.features.forEach(feature => {

        const li = document.createElement("li");

        li.textContent = feature;

        featuresList.appendChild(li);

    });

}

function renderSpecifications(product) {

    const specsTable =
        document.getElementById("product-specifications");

    if (!specsTable) return;

    specsTable.innerHTML = "";

    product.specifications.forEach(spec => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${spec.label}</td>
            <td>${spec.value}</td>
        `;

        specsTable.appendChild(row);

    });

}

function renderWhatsappButton(product) {

    const button = document.getElementById("whatsapp-button");

    if (!button) return;

    const message =
        `Hi, I'm interested in the ${product.name}. Could you please provide more information?`;

    button.href =
        `https://wa.me/2348000000000?text=${encodeURIComponent(message)}`;

}

async function renderRelatedProducts(product) {

    const container =
        document.getElementById("related-products");

    if (!container) return;

    container.innerHTML = renderSkeletonCards(3);

    const allProducts = await getProducts();

    const related = allProducts
        .filter(p => product.related.includes(p.id))
        .slice(0, 3);

    container.innerHTML = related
        .map(createProductCard)
        .join("");

    if (window.lucide) {
        window.lucide.createIcons();
    }

}

function formatCategory(category) {

    return category
        .split("-")
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

}