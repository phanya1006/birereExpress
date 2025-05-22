const phoneNumber = "+243990462408";
let cart = [];
let products = [];
let cartOpen = false;
let categoriesOpen = false;
let detailsOpen = false;

// Charger les produits depuis le JSON
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error("Erreur de chargement");
    products = await response.json();
    renderProducts();
    generateCategoryList();
  } catch (error) {
    console.error("Erreur:", error);
    // Produits par défaut si échec
    products = [
      {
        id: "chaussure-1",
        name: "Nike Air Max",
        category: "chaussures",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        price: "120.00",
        description: "Chaussures de sport confortables avec coussin d'air."
      },
      {
        id: "tshirt-1",
        name: "T-Shirt Blanc",
        category: "vêtements",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dC1zaGlydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        price: "25.99",
        description: "T-shirt en coton 100% qualité premium."
      },
      {
        id: "phone-1",
        name: "iPhone 13",
        category: "électronique",
        image: "https://images.unsplash.com/photo-1632679965851-4e8f57df4ea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXBob25lJTIwMTN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        price: "899.99",
        description: "Smartphone haut de gamme avec écran Super Retina XDR."
      }
    ];
    renderProducts();
    generateCategoryList();
  }
}

// Afficher les produits
function renderProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
 
  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.name = product.name.toLowerCase();
    card.dataset.category = product.category;
    card.id = product.id;
    card.style.animationDelay = `${index * 0.2}s`;
   
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onclick="showProductDetails('${product.id}')">
      <h3>${product.name}</h3>
      <div class="price">${product.price} USD</div>
      <button class="order-btn" onclick="event.stopPropagation(); openWhatsApp('Bonjour, je veux commander : ${product.name} (${product.price} USD)')">
        Commander
      </button>
      <button class="add-cart-btn" onclick="event.stopPropagation(); addToCart('${product.name}', '${product.id}')">
        Ajouter au panier
      </button>
    `;
   
    grid.appendChild(card);
  });
}

// Afficher les détails du produit
function showProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  detailsOpen = true;
  document.body.style.overflow = "hidden";
  const detailsContent = document.getElementById('detailsContent');
 
  // Template de base
  let detailsHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <div class="price" style="font-size: 1.5rem; margin: 10px 0 20px;">${product.price} USD</div>
    <p style="margin-bottom: 20px;">${product.description || 'Pas de description disponible.'}</p>
  `;

  // Options spécifiques par catégorie
  switch(product.category) {
    case 'chaussures':
      detailsHTML += `
        <div class="size-options">
          <h4>Taille :</h4>
          ${[36, 37, 38, 39, 40, 41, 42, 43, 44].map(size => `
            <button onclick="selectOption(this, 'size')">${size}</button>
          `).join('')}
        </div>
      `;
      break;
     
    case 'vêtements':
      detailsHTML += `
        <div class="size-options">
          <h4>Taille :</h4>
          ${['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => `
            <button onclick="selectOption(this, 'size')">${size}</button>
          `).join('')}
        </div>
        <div class="color-options">
          <h4>Couleur :</h4>
          ${[
            {name: 'Noir', value: '#000000'},
            {name: 'Blanc', value: '#ffffff'},
            {name: 'Bleu', value: '#0000ff'},
            {name: 'Rouge', value: '#ff0000'}
          ].map(color => `
            <button
              onclick="selectOption(this, 'color')"
              style="background-color: ${color.value}"
              title="${color.name}"
            ></button>
          `).join('')}
        </div>
      `;
      break;
     
    case 'électronique':
      detailsHTML += `
        <div class="custom-options">
          <h4>Options :</h4>
          <button onclick="selectOption(this, 'storage')">128GB</button>
          <button onclick="selectOption(this, 'storage')">256GB</button>
          <button onclick="selectOption(this, 'storage')">512GB</button>
        </div>
      `;
      break;
     
    default:
      detailsHTML += `
        <div class="custom-options">
          <h4>Options :</h4>
          <button onclick="selectOption(this, 'option')">Standard</button>
          <button onclick="selectOption(this, 'option')">Premium</button>
        </div>
      `;
  }
 
  // Boutons d'action
  detailsHTML += `
    <div class="details-actions">
      <button class="add-cart-btn" style="flex: 1;" onclick="addToCart('${product.name}', '${product.id}')">
        Ajouter au panier
      </button>
      <button class="order-btn" style="flex: 1;" onclick="openWhatsApp('Bonjour, je veux commander : ${product.name} (${product.price} USD)')">
        Commander maintenant
      </button>
    </div>
  `;

  detailsContent.innerHTML = detailsHTML;
  document.getElementById('productDetailsSlide').classList.add('open');
}

function closeProductDetails() {
  detailsOpen = false;
  document.body.style.overflow = "auto";
  document.getElementById('productDetailsSlide').classList.remove('open');
}

function selectOption(button, type) {
  // Désélectionne tous les boutons du même groupe
  const parent = button.parentElement;
  parent.querySelectorAll('button').forEach(btn => {
    btn.classList.remove('selected');
  });
  // Sélectionne le bouton cliqué
  button.classList.add('selected');
}

// Fonctions utilitaires
function openWhatsApp(message) {
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
}

function filterProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.getAttribute("data-name");
    card.style.display = name.includes(input) ? "block" : "none";
  });
}

function filterCategory(category) {
  document.querySelectorAll(".product-card").forEach(card => {
    if (category === "all") {
      card.style.display = "block";
    } else {
      card.style.display = card.getAttribute("data-category") === category ? "block" : "none";
    }
  });
}

function toggleCart() {
  cartOpen = !cartOpen;
  document.getElementById("cartSidebar").classList.toggle("open");
  document.body.style.overflow = cartOpen ? "hidden" : "auto";
 
  if (cartOpen && detailsOpen) {
    closeProductDetails();
  }
}

function toggleAllCategories() {
  categoriesOpen = !categoriesOpen;
  document.getElementById("allCategoriesSidebar").classList.toggle("open");
  document.body.style.overflow = categoriesOpen ? "hidden" : "auto";
 
  if (categoriesOpen && detailsOpen) {
    closeProductDetails();
  }
}

function generateCategoryList() {
  const categories = [...new Set(products.map(p => p.category))];
  const container = document.getElementById('allCategoriesList');
  container.innerHTML = '';
 
  // Bouton "Toutes"
  const allBtn = document.createElement('button');
  allBtn.textContent = "Toutes";
  allBtn.onclick = () => {
    filterCategory('all');
    toggleAllCategories();
  };
  container.appendChild(allBtn);
 
  // Boutons catégories
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.onclick = () => {
      filterCategory(cat);
      toggleAllCategories();
    };
    container.appendChild(btn);
  });
}

function addToCart(productName, productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const productLink = `${window.location.origin}/#${productId}`;
  cart.push({
    name: productName,
    price: product.price,
    link: productLink,
    id: Date.now() + Math.random()
  });
 
  displayCart();
  updateCartCount();
 
  if (cart.length === 1 && !cartOpen) {
    toggleCart();
  }
}

function displayCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
 
  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Votre panier est vide</li>";
    document.getElementById("cartActions").style.display = "none";
    return;
  }
 
  cart.forEach(item => {
    const li = document.createElement("li");
   
    const itemInfo = document.createElement("div");
    itemInfo.className = "cart-item-info";
   
    const itemName = document.createElement("span");
    itemName.textContent = `${item.name} - ${item.price}`;
   
    const itemLink = document.createElement("a");
    itemLink.href = item.link;
    itemLink.textContent = "(voir)";
    itemLink.style.color = "#ffd700";
    itemLink.target = "_blank";
   
    itemInfo.appendChild(itemName);
    itemInfo.appendChild(itemLink);
   
    const itemActions = document.createElement("div");
    itemActions.className = "cart-item-actions";
   
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-item-btn";
    removeBtn.textContent = "×";
    removeBtn.onclick = () => removeFromCart(item.id);
   
    itemActions.appendChild(removeBtn);
    li.appendChild(itemInfo);
    li.appendChild(itemActions);
    cartItems.appendChild(li);
  });
 
  document.getElementById("cartActions").style.display = "flex";
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  displayCart();
  updateCartCount();
}

function clearCart() {
  if (confirm("Êtes-vous sûr de vouloir vider tout votre panier ?")) {
    cart = [];
    displayCart();
    updateCartCount();
  }
}

function updateCartCount() {
  const count = cart.length;
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartCountSidebar").textContent = count;
}

function orderCart() {
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }
  let message = "Bonjour, je souhaite commander :\n";
  cart.forEach(item => {
    message += `- ${item.name} (${item.price}) ${item.link}\n`;
  });
  message += `\nTotal: ${cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)} USD`;
  openWhatsApp(message);
}

// Fermeture des slide-ins en cliquant à l'extérieur
document.addEventListener('click', function(event) {
  const cartSidebar = document.getElementById('cartSidebar');
  const categoriesSidebar = document.getElementById('allCategoriesSidebar');
  const detailsSidebar = document.getElementById('productDetailsSlide');
  const cartButton = document.querySelector('.cart-toggle');
  const categoriesButton = document.querySelector('.show-all-categories');
 
  if (cartOpen && !cartSidebar.contains(event.target)) {
    if (event.target !== cartButton && !cartButton.contains(event.target)) {
      toggleCart();
    }
  }
 
  if (categoriesOpen && !categoriesSidebar.contains(event.target)) {
    if (event.target !== categoriesButton && !categoriesButton.contains(event.target)) {
      toggleAllCategories();
    }
  }
 
  if (detailsOpen && !detailsSidebar.contains(event.target)) {
    if (!event.target.closest('.product-card')) {
      closeProductDetails();
    }
  }
});

// Démarrer
window.addEventListener("DOMContentLoaded", loadProducts);