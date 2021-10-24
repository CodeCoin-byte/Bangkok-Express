import { createElement } from '../libs/custom_libs.js';
import { escapeHtml } from '../libs/custom_libs.js';

import Modal from './modal.js';

export default class Cart {
  
  constructor(cartIcon) {
    this.cartItems = []; // [product: {...}, count: N]
    this.cartIcon = cartIcon;
    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) {
      return;
    }
    let isContain = false;
    let cartItem = {};
    if (this.cartItems.length > 0) {
      this.cartItems.forEach((i) => {
        if (i.product.id === product.id) {
          i.count += 1;
          cartItem = i;
          isContain = true;
        }
      });
    }
    if (!isContain) {
      cartItem = {
        product,
        count: 1,
      };
      this.cartItems.push(cartItem);
    }
    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    this.cartItems.forEach((item, index) => {
      if (item.product.id === productId) {
        const count = item.count + amount;
        if (count <= 0) {
          item.count = count;
          this.cartItems = [...this.cartItems.slice(0, index), ...this.cartItems.slice(index + 1,)];
        } else {
          item.count = count;
        }
        this.onProductUpdate(item);
      }
    });
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((acc, item) => {
      return acc + item.count;
    }, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((acc, item) => {
      return acc + item.product.price * item.count;
    }, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="./assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="./assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="./assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    const container = document.createElement('div');
    this.cartItems.forEach((i) => {
      container.append(this.renderProduct(i.product, i.count));
    });
    container.append(this.renderOrderForm());
    this.modal = new Modal();
    const cartForm = container.querySelector('.cart-form');
    cartForm.addEventListener('submit', (e) => {
      this.onSubmit(e);
    });
    this.modal.open();
    this.modal.setTitle('Your order');
    this.modal.setBody(container);
    container.addEventListener('click', (e) => {
      const product = e.target.closest('.cart-product');
      if (e.target.closest('.cart-counter__button_plus')) {
        this.updateProductCount(product.dataset.productId, 1);
      } else if (e.target.closest('.cart-counter__button_minus')) {
        this.updateProductCount(product.dataset.productId, -1);
      }
    });
    
  }

  onProductUpdate(cartItem) {
    if (cartItem.count < 1) {
      const product = document.querySelector(`[data-product-id="${cartItem.product.id}"]`);
      product.remove();
      if (this.cartItems.length < 1) {
        this.modal.close();
      }
    } else if (document.body.classList.contains('is-modal-open')) {
      const productId = cartItem.product.id;
      const modal = document.querySelector('.modal');
      let productCount = modal.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      let productPrice = modal.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      let infoPrice = modal.querySelector(`.cart-buttons__info-price`);
      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }

    this.cartIcon.update(this);
  }

  onSubmit(event) {
    const modal = document.querySelector('.modal');
    event.preventDefault();
    const btnSubmit = modal.querySelector('button[type="submit"]');
    btnSubmit.classList.add('is-loading');
    const cartForm = document.querySelector('.cart-form');
    const formData = new FormData(cartForm);
    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: formData,
    }).then((result) => {
      const modalBody = createElement(`<div class="modal__body-inner">
      <p>
        Order successful! Your order is being cooked :) <br>
        We’ll notify you about delivery time shortly.<br>
        <img src="./assets/images/delivery.gif">
      </p>
    </div>
    `);
      if (result.ok) {
        this.modal.setTitle('Success!');
        this.cartItems = [];
        this.modal.setBody(modalBody);
      }
      this.cartIcon.update(this);
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

