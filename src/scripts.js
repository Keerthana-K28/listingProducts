let products = [];
let filteredProducts = [];
let currentIndex = 0;
const itemsPerLoad = 10;

// Function to fetch products from the API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        filterProductsByCategory();
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error fetching the products:', error);
        document.getElementById('loading').textContent = 'Error loading products.';
    }
}

// Function to filter products by category based on URL parameter
function filterProductsByCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
        filteredProducts = products.filter(product => product.category === category);
    } else {
        filteredProducts = products;
    }

    displayProducts();
    updateResultCount();
}

// Function to display products in the container
function displayProducts() {
    const container = document.getElementById('product-container');
    const slice = filteredProducts.slice(currentIndex, currentIndex + itemsPerLoad);
    slice.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" onclick="navigateToDetails(${product.id})">
            <h3>${product.title}</h3>
            <p class="price">$${product.price}</p>
        `;

        container.appendChild(productCard);
    });
    currentIndex += itemsPerLoad;
    updateLoadMoreButton();
}

// Function to update the visibility of the Load More button
function updateLoadMoreButton() {
    const loadMoreButton = document.getElementById('load-more');
    if (currentIndex >= filteredProducts.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}

// Function to filter products based on search and sort
function filterProducts() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();

    filteredProducts = products.filter(product => {
        const matchesCategory = !category || product.category === category;
        const matchesSearch = product.title.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    sortProducts();
}

// Function to sort products
function sortProducts() {
    const sortOption = document.getElementById('sort-options').value;

    if (sortOption === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayFilteredProducts();
}
// Function to update the sidebar content based on selected categories
function updateSidebar() {
    const sidebar = document.getElementById('sidebar-content');
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(checkbox => checkbox.value);

    if (selectedCategories.length === 0) {
        sidebar.innerHTML = 'All Products';
    } else {
        sidebar.innerHTML = selectedCategories.map(category => {
            return `<div>${category.charAt(0).toUpperCase() + category.slice(1)}</div>`;
        }).join(', ');
    }
}


// Function to display filtered and sorted products
function displayFilteredProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    currentIndex = 0;
    displayProducts();
    updateResultCount();
    updateSidebar();
}

// Function to update the result count
function updateResultCount() {
    const resultCount = document.getElementById('result-count');
    resultCount.textContent = `${filteredProducts.length} Results`;
}

// Function to navigate to the details page with product data
function navigateToDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        localStorage.setItem('productDetails', JSON.stringify(product));
        window.location.href = 'details.html';
    }
}

function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(checkbox => checkbox.value);
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const matchesSearch = product.title.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    sortProducts();
}
// Event listeners for filters, sort, search, and load more button
document.querySelectorAll('.category-filter').forEach(cb => {
    cb.addEventListener('change', filterProducts);
});
document.getElementById('sort-options').addEventListener('change', sortProducts);
document.getElementById('search-bar').addEventListener('input', filterProducts);
document.getElementById('load-more').addEventListener('click', displayProducts);

// Initial fetch and display of products
fetchProducts();
document.addEventListener("DOMContentLoaded", function() {
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const headerList = document.getElementById("header_list");

    hamburgerMenu.addEventListener("click", function() {
        headerList.classList.toggle("show");
    });
});
