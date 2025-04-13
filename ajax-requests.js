document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
});

function loadProducts() {
  fetch("products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayProducts(data.products);
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      // Fallback: Show error message to user
      const container = document.getElementById("featured-products");
      if (container) {
        container.innerHTML = `
          <div class="alert alert-danger">
            Failed to load products. Please refresh the page or try again later.
          </div>
        `;
      }
    });
}

function displayProducts(products) {
  const container = document.getElementById("featured-products");
  if (!container) {
    console.error("Featured products container not found");
    return;
  }

  // Clear existing content
  container.innerHTML = "";

  // Calculate number of slides needed (4 products per slide)
  const slidesNeeded = Math.ceil(products.length / 4);

  // Create each slide
  for (let i = 0; i < slidesNeeded; i++) {
    const slide = document.createElement("div");
    slide.className = `carousel-item ${i === 0 ? "active" : ""}`;

    const row = document.createElement("div");
    row.className = "row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4";

    // Add products to this slide (max 4 per slide)
    for (let j = 0; j < 4; j++) {
      const productIndex = i * 4 + j;
      if (productIndex >= products.length) break;

      const product = products[productIndex];
      row.appendChild(createProductCard(product));
    }

    slide.appendChild(row);
    container.appendChild(slide);
  }

  // Add indicators if more than one slide
  if (slidesNeeded > 1) {
    addCarouselIndicators(slidesNeeded);
  }
}

function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col";

  const priceDisplay = product.discounted_price
    ? `<span class="text-muted text-decoration-line-through">${product.price}</span>
       <span class="text-danger fw-bold ms-2">${product.discounted_price}</span>`
    : `<span class="fw-bold">${product.price}</span>`;

  col.innerHTML = `
    <div class="card h-100 product-card">
      <img src="${product.image}" class="card-img-top" alt="${product.name}" 
           style="height: 200px; object-fit: cover;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text flex-grow-1">${product.description}</p>
        <div class="mt-auto">
          <div class="price mb-2">${priceDisplay}</div>
          <a href="Cart_info.html?id=${product.id}" class="btn btn-primary w-100" onclick="isLoggedIn()">Buy Now</a>
        </div>
      </div>
    </div>
  `;

  return col;
}

function addCarouselIndicators(slidesCount) {
  const carousel = document.getElementById("productCarousel");
  const indicatorsContainer = document.createElement("div");
  indicatorsContainer.className = "carousel-indicators";

  for (let i = 0; i < slidesCount; i++) {
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.dataset.bsTarget = "#productCarousel";
    indicator.dataset.bsSlideTo = i;
    indicator.setAttribute("aria-label", `Slide ${i + 1}`);
    if (i === 0) {
      indicator.className = "active";
      indicator.setAttribute("aria-current", "true");
    }
    indicatorsContainer.appendChild(indicator);
  }

  carousel.appendChild(indicatorsContainer);
}
