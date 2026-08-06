document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");

    // Temporary fallback while we're building
    const id = productId || "bettula-floor-tile";

    const product = await getProduct(id);

    if (!product) {
        document.body.innerHTML = "<h1>Product not found.</h1>";
        return;
    }

    await populateProduct(product);

});

async function populateProduct(product) {

    renderMeta(product);
    renderBreadcrumb(product);
    renderProductInfo(product);
    renderGallery(product);
    renderChips(product);
    renderFeatures(product);
    renderSpecifications(product);
    renderWhatsappButton(product);

    await renderRelatedProducts(product);

}

function renderMeta(product) {

    document.title = `${product.name} — Tiles by Rodu`;

    const description = document.querySelector('meta[name="description"]');

    if (description) {
        description.setAttribute(
            "content",
            `${product.name} from Tiles by Rodu — ${product.shortDescription} Chat with us on WhatsApp to enquire or order.`
        );
    }

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

    const sizesRow = renderSizesRow(product);

    if (sizesRow) {
        specsTable.appendChild(sizesRow);
    }

    product.specifications.forEach(spec => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${spec.label}</td>
            <td>${spec.value}</td>
        `;

        specsTable.appendChild(row);

    });

}

function renderSizesRow(product) {

    if (!Array.isArray(product.sizes) || !product.sizes.length) {
        return null;
    }

    const row = document.createElement("tr");

    const labelCell = document.createElement("td");
    labelCell.textContent = "Available Sizes";

    const valueCell = document.createElement("td");
    const chipRow = document.createElement("div");
    chipRow.className = "size-chip-row";

    product.sizes.forEach(size => {

        const chip = document.createElement("span");

        chip.className = "chip size-chip";
        chip.textContent = size;

        chipRow.appendChild(chip);

    });

    valueCell.appendChild(chipRow);

    row.appendChild(labelCell);
    row.appendChild(valueCell);

    return row;

}

function renderWhatsappButton(product) {

    const button = document.getElementById("whatsapp-button");

    if (!button) return;

    const message =
        `Hi, I'm interested in the ${product.name}. Could you please provide more information?`;

    button.href =
        `https://wa.me/2347032417780?text=${encodeURIComponent(message)}`;

}

// Which categories should surface each other in "Related products".
// Only touch this when you add a brand-new category — individual
// products never need to be wired up by hand.
const CATEGORY_RELATIONS = {
    "floor-tiles": ["wall-tiles", "outdoor-tiles", "paving-blocks"],
    "wall-tiles": ["floor-tiles", "kitchen-tiles", "bathroom-tiles", "decorative-tiles"],
    "kitchen-tiles": ["wall-tiles", "bathroom-tiles", "decorative-tiles"],
    "bathroom-tiles": ["kitchen-tiles", "wall-tiles", "outdoor-tiles"],
    "outdoor-tiles": ["floor-tiles", "paving-blocks", "interlocking-stones"],
    "decorative-tiles": ["wall-tiles", "kitchen-tiles", "interlocking-stones"],
    "paving-blocks": ["outdoor-tiles", "interlocking-stones"],
    "interlocking-stones": ["outdoor-tiles", "paving-blocks", "decorative-tiles"]
};

async function renderRelatedProducts(product) {

    const container =
        document.getElementById("related-products");

    if (!container) return;

    container.innerHTML = renderSkeletonCards(3);

    const allProducts = await getProducts();

    const related = getRelatedProducts(product, allProducts, CATEGORY_RELATIONS, 3);

    container.innerHTML = related
        .map(createProductCard)
        .join("");

    if (window.lucide) {
        window.lucide.createIcons();
    }

}

function getRelatedProducts(product, allProducts, categoryRelations, count) {

    const sameCategory = allProducts.filter(p =>
        p.id !== product.id && p.category === product.category
    );

    const relatedCategories = categoryRelations[product.category] || [];

    const crossCategory = allProducts.filter(p =>
        p.id !== product.id && relatedCategories.includes(p.category)
    );

    const seen = new Set();
    const result = [];

    for (const p of [...sameCategory, ...crossCategory]) {

        if (seen.has(p.id)) continue;

        seen.add(p.id);
        result.push(p);

        if (result.length === count) break;

    }

    return result;

}

function formatCategory(category) {

    return category
        .split("-")
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

}