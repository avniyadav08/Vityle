const productContainer = document.querySelector('.container');
const searchInput = document.querySelector('#searchItem');
const categoryButtons = document.querySelectorAll('.items');

let allProducts = [];

const loader = document.createElement('div');
loader.innerText = 'Loading....';
loader.style.textAlign = 'center';
loader.style.fontSize = '30px';
loader.style.padding = '20px';
loader.style.color = 'Black';


const categoryMap = {
    "all": "all",
    "groceries": "groceries",
    "beauty": "beauty",
    "fragrances": "fragrances",
    "shoes": "mens-shoes", 
    "furniture": "furniture",
    "kitchen accessories": "home-decoration", 
};

async function fetchproducts() {
    try {
        productContainer.innerHTML = '';
        productContainer.appendChild(loader);
        const res = await fetch('https://dummyjson.com/products?limit=100');
        const data = await res.json();
        allProducts = data.products;
        displayProducts(allProducts);
    } catch (err) {
        productContainer.innerHTML = `<p>Please check Your Connection!!! Products unable to Load........</p>`;
        console.error(err);
    }
}

function displayProducts(products) {
    productContainer.innerHTML = '';

    if (products.length === 0) {
        productContainer.innerHTML = `<p>No product available</p>`;
        return;
    }

    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-card';

        item.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <small>${product.category}</small>
        `;

        item.addEventListener('click', () => showProductModel(product));
        productContainer.appendChild(item);
    });
}

function showProductModel(product) {
    const modelOverlay = document.createElement('div');
    modelOverlay.style.position = 'absolute';
    modelOverlay.style.top = '0';
    modelOverlay.style.left = '0';
    modelOverlay.style.width = '100vw';
    modelOverlay.style.height = '100vh';
    modelOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modelOverlay.style.display = 'flex';
    modelOverlay.style.justifyContent = "center";
    modelOverlay.style.alignItems = "center";
    modelOverlay.style.zIndex = '10000';

    const modelContent = document.createElement('div');
    modelContent.style.backgroundColor = '#fff';
    modelContent.style.padding = '20px';
    modelContent.style.borderRadius = '10px';
    modelContent.style.maxWidth = '400px';
    modelContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    modelContent.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.thumbnail}" alt="${product.title}" style="width:100%;border-radius:6px;margin:10px 0;">
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Description:</strong> ${product.description}</p>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <button style="margin-top:10px; padding:8px 12px; background-color:#007BFF; color:white; border:none; border-radius:5px; cursor:pointer;">Close</button> 
    `;

    modelContent.querySelector('button').addEventListener('click', () => {
        document.body.removeChild(modelOverlay);
    });

    modelOverlay.appendChild(modelContent);
    document.body.appendChild(modelOverlay);
}

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

const handleSearch = debounce(() => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
}, 300);

searchInput.addEventListener('input', handleSearch);

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const btnText = btn.textContent.trim().toLowerCase();
        const apiCategory = categoryMap[btnText];

        if (!apiCategory || apiCategory === "all") {
            displayProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p =>
                p.category.toLowerCase() === apiCategory
            );
            displayProducts(filtered);
        }
    });
});

fetchproducts();
