let productsCache = null;

async function getProducts() {
    if (productsCache) {
        return productsCache;
    }

    const response = await fetch("data/products.json");

    if (!response.ok) {
        throw new Error("Failed to load products.");
    }

    const data = await response.json();

    productsCache = data.products;

    return productsCache;
}

async function getProduct(id) {
    const products = await getProducts();

    return products.find(product => product.id === id);
}

async function getFeaturedProducts() {
    const products = await getProducts();

    return products.filter(product => product.featured);
}

async function getProductsByCategory(category) {
    const products = await getProducts();

    if (category === "all") {
        return products;
    }

    return products.filter(product => product.category === category);
}