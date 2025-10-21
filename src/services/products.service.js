// Mock-Datenbank für Products
let products = [
    { id: 1, name: "Laptop", price: 999.99, stock: 15 },
    { id: 2, name: "Mouse", price: 29.99, stock: 50 },
    { id: 3, name: "Keyboard", price: 79.99, stock: 30 },
];

let nextId = 4;

class ProductsService {
    getAllProducts() {
        return products;
    }

    getProductById(id) {
        return products.find((product) => product.id === parseInt(id));
    }

    createProduct(productData) {
        const newProduct = {
            id: nextId++,
            name: productData.name,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock) || 0,
        };
        products.push(newProduct);
        return newProduct;
    }

    updateProduct(id, productData) {
        const index = products.findIndex((product) => product.id === parseInt(id));
        if (index === -1) return null;

        products[index] = {
            ...products[index],
            ...productData,
            id: parseInt(id),
        };
        return products[index];
    }

    deleteProduct(id) {
        const index = products.findIndex((product) => product.id === parseInt(id));
        if (index === -1) return null;

        const deletedProduct = products[index];
        products.splice(index, 1);
        return deletedProduct;
    }
}

module.exports = new ProductsService();
