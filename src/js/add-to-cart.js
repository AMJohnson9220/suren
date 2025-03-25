// Quick Buy Update
class QuickBuyUpdate {
  constructor() {
    this.cartUpdateUrl = '/cart/update.js';

    this.formatCurrency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    });

    this.setupEventListeners();
  }

  async updateToCart(variantId, newQty) {
    console.log('firstsss', variantId, newQty);
    let formData = {
      updates: {
        [variantId]: newQty,
      },
    };

    try {
      const response = await fetch(this.cartUpdateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();

      // Update cart icon based on total items in the cart
      const cartIcon = document.querySelector('.header--cart-count');
      if (
        responseData.totalItems > 0 &&
        !cartIcon.classList.contains('active')
      ) {
        cartIcon.classList.add('active');
      } else if (responseData.totalItems === 0) {
        cartIcon.classList.remove('active');
      }

      return responseData;
    } catch (error) {
      console.error(`Failed to update cart: ${error.message}`);
      return null;
    }
  }

  onQuickBuyClick(event) {
    const btn = event.target.closest('.quick-buy--adjust');
    if (!btn) return;

    const inputField = btn
      .closest('.quick-buy--button')
      .querySelector('.quick-buy--quantity');
    const buttonContainer = btn.closest('.quick-buy--button');
    const currentQuantity = parseInt(inputField.value, 10);
    const updateAmount = parseInt(btn.dataset.update, 10);
    const maxQuantity = parseInt(inputField.dataset.max, 10);
    const newQuantity = Math.min(currentQuantity + updateAmount, maxQuantity);

    inputField.value = Math.max(0, newQuantity); // Ensure the quantity does not drop below 0

    buttonContainer.classList.toggle('active', newQuantity > 0);
    buttonContainer.classList.toggle('max', newQuantity === maxQuantity);

    if (newQuantity <= 0 || btn.classList.contains('disabled')) return;

    const variantId = inputField.dataset.id;
    this.updateToCart(variantId, newQuantity).then((response) => {
      if (response) {
        console.log('Cart update response:', response);
      }
    });
  }

  setupEventListeners() {
    document.querySelectorAll('.quick-buy--adjust').forEach((button) => {
      button.addEventListener('click', this.onQuickBuyClick.bind(this));
    });
  }
}
const shopifyAdder = new QuickBuyUpdate();

// Cart
class Cart {
  constructor() {
    this.cartContainer = document.querySelector('.cart-main');

    // Add event listeners for dynamic cart items (event delegation)
    this.cartContainer.addEventListener(
      'click',
      this.handleCartActions.bind(this)
    );

    this.loadDetails();
  }

  async loadDetails() {
    try {
      const response = await fetch('/cart.js');
      const cartData = await response.json();

      this.displayCartDetails(cartData);
    } catch (error) {
      console.error('Error fetching cart details:', error);
    }
  }

  displayCartDetails(cartData) {
    let formatCurrency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
    });
  
    // Clear previous cart items
    this.cartContainer.innerHTML = ''; 
  
    let numberOfItems = cartData.item_count;
    let subtotal = cartData.items_subtotal_price / 100;
    let total = subtotal;
  
    // Calculate postage based on total price
    let postage = 0;
    if (cartData.total_price >= 2000 && cartData.total_price < 3000) {
      postage = 199 / 100;
    } else if (cartData.total_price >= 3000) {
      postage = 0; // Free postage for total price greater than or equal to 30.00
    } else {
      postage = 499 / 100;
    }
  
    total += postage; // Add postage to the total
  
    // Update the values in the cart summary
    document.querySelector('.cart--item-count').textContent = numberOfItems;
    document.querySelector('.cart--subtotal').textContent =
      formatCurrency.format(subtotal);
    document.querySelector('.cart--postage').textContent =
      postage === 0 ? 'Free' : formatCurrency.format(postage); // Display 'Free' if postage is 0
    document.querySelector('.cart--total').textContent =
      formatCurrency.format(total);

    // Update the shipping--updates element value
    const shippingUpdates = document.querySelector('.shipping--updates');
    if (postage === 0) {
      shippingUpdates.textContent = 'You are eligible for free delivery.';
    } else {
      shippingUpdates.textContent = `You are ${formatCurrency.format(
        (3000 - cartData.total_price) / 100
      )} away from free delivery.`;
    }

    total = cartData.total_price / 100;
    
    if (document.querySelector('.shipping--amount')) {
      const shippingAmount = new ShippingAmount(total);
    }
  
    // Add all items to the cart
    cartData.items.forEach((item) => {
      const itemElem = document.createElement('div');
      itemElem.classList.add('cart-main--item');
  
      itemElem.innerHTML = `
              <span class="cart-main--item-image">
                <img src="${item.image}" alt="${item.title}">
              </span>
              <span class="cart-main--item-info">
                <span class="cart-main--item-content">
                  <span class="cart-main--item-title">${item.vendor}</span>
                  <span class="cart-main--item-type">${item.title}</span>
                </span>
  
                <div class="cart-main--item-action">
                  <span class="quick-buy--component">
                    <span class="quick-buy--adjust quick-buy--minus" data-line-item="${item.id}">
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-minus" fill="none" viewBox="0 0 10 2">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor">
                      </svg>
                    </span>
                    <input data-id="${item.variant_id}" type="number" value="${item.quantity}" class="quick-buy--quantity" disabled>
                    <span class="quick-buy--adjust quick-buy--plus" data-line-item="${item.id}">
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-plus" fill="none" viewBox="0 0 10 10">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor">
                      </svg>
                    </span>
                  </span>
  
                  <span class="cart-main--item-price">${formatCurrency.format(item.price / 100)}</span>
  
                  <span class="cart-main--item-delete" data-line-item="${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false" role="presentation" class="icon icon-remove">
                      <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="#1b1e21"/>
                      <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="#1b1e21"/>
                    </svg>
                  </span>
                </div>
              </span>
          `;
  
      this.cartContainer.appendChild(itemElem);
    });
  
    // Check if cart icon has dot
    const cartIcon = document.querySelector('.header--cart-count');
    if (cartData.item_count == 0) {
      if (cartIcon.classList.contains('active')) {
        cartIcon.classList.remove('active');
      }
    }
  }

  handleCartActions(event) {
    const target = event.target;
    const currentItem = this.cartContainer
      .querySelector(`[data-line-item="${target.dataset.lineItem}"]`)
      .closest('.quick-buy--component');
    const currentQty = parseInt(
      currentItem.querySelector('.quick-buy--quantity').value
    );

    if (target.classList.contains('quick-buy--plus')) {
      this.updateItemQuantity(target.dataset.lineItem, currentQty + 1);
    } else if (target.classList.contains('quick-buy--minus')) {
      this.updateItemQuantity(target.dataset.lineItem, currentQty - 1);
    } else if (target.classList.contains('cart-main--item-delete')) {
      this.deleteItem(target.dataset.lineItem);
    }
  }

  async updateItemQuantity(lineItemId, newQty) {
    // Avoid setting quantity below 0
    if (newQty < 0) {
      return;
    }

    // console.log(lineItemId, newQty)

    let formData = {
      updates: {
        [lineItemId]: newQty,
      },
    };

    try {
      const response = await fetch('/cart/update.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if the response status is an error
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedCart = await response.json();

      // console.log('update', updatedCart)
      this.displayCartDetails(updatedCart); // Refresh cart details after update
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  }

  async deleteItem(lineItemId) {
    try {
      await this.updateItemQuantity(lineItemId, 0); // Setting quantity directly to 0
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  }
}
const cart = new Cart();



// class QuickBuyAdder {
//   constructor() {
//     this.cartAddUrl = '/cart/add.js';

//     this.formatCurrency = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'GBP',
//     });
//   }

//   async addToCart(variantid, quantity) {
//     const formData = new FormData();
//     formData.append('id', variantid);
//     formData.append('quantity', quantity);

//     try {
//       const response = await fetch(this.cartAddUrl, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       const responseData = await response.json();

//       // Check if cart icon has dot
//       const cartIcon = document.querySelector('.header--cart-count')
//       if (responseData.quantity > 0) {
//         if (!cartIcon.classList.contains('active')) {
//           cartIcon.classList.add('active')
//         }
//       }

//       return responseData;
//     } catch (error) {
//       console.error(`Failed to add to cart: ${error.message}`);
//       return null;
//     }
//   }

//   onQuickBuyClick(event) {
//     const btn = event.target;

//     // Exit if the button is disabled (prevents double clicking or any other actions)
//     if (btn.disabled) return;

//     const variantid = btn.dataset.variantid;
//     const quantity = parseInt(btn.dataset.quantity, 10) || 1;
//     const cartButtonContent = btn.closest('.quick-buy--plus')

//     Promise.all([this.addToCart(variantid, quantity)]).then(([response]) => {
//       if (response) {
//         cartButtonContent.classList.add('active');

//         // Disable the button temporarily
//         setTimeout(() => {
//           cartButtonContent.classList.remove('active');
//           btn.disabled = false;
//         }, 1000)
//       }
//     });
//   }

// updateVariantId(event) {
//   const variant = event.target;
//   const variantId = document.querySelector('.quick-buy--add-to-cart');
//   const variantCartId = document.querySelector('.quick-buy--add-to-cart-button')
//   const variantCartPrice = document.querySelector('.quick-buy--variant-price');
//   const variantCartButton = document.querySelector('.quick-buy--add-to-cart-button');
//   const quantityInput = document.querySelector('.quick-buy--quantity'); // Select the quantity input element

//   // Update the 'data-variantid' attribute with the selected variant's 'data-variant' value
//   variantId.setAttribute('data-variantid', variant.dataset.varid);

//   // Update the data-variantid attribute with the selected variant's data-variant value
//   variantCartId.setAttribute('data-variantid', variant.dataset.varid)

//   // Update this.selectedVariantId
//   this.selectedVariantId = variant.dataset.varid;

//   // Reset quantity to 1 whenever a variant is clicked
//   quantityInput.value = 1;

//   // Update the data-quantity attribute of the add-to-cart button to 1
//   variantCartButton.setAttribute('data-quantity', 1);

//   // Update variant price
//   this.variantPrice = variant.dataset.varprice;
//   variantCartPrice.setAttribute('data-price', this.variantPrice); // Update the data-price attribute
//   variantCartPrice.innerHTML = this.formatCurrency.format(this.variantPrice / 100);
// }

//   updateVariantQuantity(event) {
//     const quantityInput = event.target.parentElement.querySelector('.quick-buy--quantity');
//     const variantCartPrice = document.querySelector('.quick-buy--variant-price');
//     const variantCartButton = document.querySelector('.quick-buy--add-to-cart-button');

//     let variantPrice = Number(variantCartPrice.dataset.price);
//     let newQty = Number(quantityInput.value);

//     if (event.target.classList.contains('quick-buy--increase-qty')) {
//       newQty = newQty + 1;
//     } else {
//       newQty = newQty - 1;
//       if (newQty < 1) {
//         newQty = 1;
//       }
//     }

//     quantityInput.value = newQty;
//     variantCartPrice.innerHTML = this.formatCurrency.format((variantPrice * newQty) / 100);
//     variantCartButton.dataset.quantity = newQty;
//   }

//   // bindEvents() {
//   //   const buttons = document.querySelectorAll('.quick-buy--add-to-cart');
//   //   buttons.forEach((btn) => {
//   //     btn.addEventListener('click', this.onQuickBuyClick.bind(this));
//   //   });

//   //   // Add event listeners to product-card--variant elements
//   //   const variantElements = document.querySelectorAll('.main-product--strength-variant');
//   //   variantElements.forEach((element) => {
//   //     element.addEventListener('click', this.updateVariantId.bind(this));
//   //   });

//   //   const quantityAdjustElements = document.querySelectorAll('.quick-buy--quantity-adjust');
//   //   quantityAdjustElements.forEach((element) => {
//   //     element.addEventListener('click', this.updateVariantQuantity.bind(this));
//   //   });
//   // }
// }

// const shopifyAdder = new QuickBuyAdder();
// shopifyAdder.bindEvents();

// Product Selector
// class ProductSelector {
//   constructor() {
//     this.parentElement = document.querySelectorAll('.product--content');
//     this.formatCurrency = new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'GBP',
//     });
//     this.init();
//   }

//   init(){
//     this.parentElement.forEach((parentElement) => {
//       const selector = parentElement.querySelector('.main-product--selector');

//       selector.addEventListener('change', (event) => {
//         const closestSelectedOption = event.target.querySelector('.main-product--strength-variant:checked');

//         if (closestSelectedOption) {
//           const varId = closestSelectedOption.getAttribute('data-varId');
//           const varPrice = parseFloat(closestSelectedOption.getAttribute('data-varPrice'));

//           // Update data attributes of the selector element
//           selector.setAttribute('data-varId', varId);
//           selector.setAttribute('data-varPrice', varPrice);

//           // Update data-variantid attribute of the addToCartButton
//           const addToCartButton = parentElement.querySelector('.quick-buy--add-to-cart-button');
//           addToCartButton.setAttribute('data-variantid', varId);

//           // Format variant price with £ symbol and correct money format
//           const variantPriceElement = parentElement.querySelector('.quick-buy--variant-price');
//           variantPriceElement.textContent = this.formatCurrency.format(varPrice / 100);
//         }
//       });
//     });
//   }
// }

// const productSelector = new ProductSelector();

// class CheckMark {
//   constructor() {
//     this.checkmark = document.querySelector('.cart-checkout--agreement');
//     this.init();
//   }

//   init() {
//     this.checkmark.addEventListener('click', () => {
//       this.checkmark.classList.toggle('disabled')

//       if(!this.checkmark.classList.contains('disabled')) {
//         document.querySelector('.cart-button').classList.add('enabled')
//       } else {
//         document.querySelector('.cart-button').classList.remove('enabled')
//       }
//     })
//   }
// }

// new CheckMark();
