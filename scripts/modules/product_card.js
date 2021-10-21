import { createElement } from '../libs/custom_libs.js';

export default class ProductCard {
  constructor(product) {
    this.product = product;
    this.createCard();
  }

  createCard() {
    const imgName = this.product.image;
    const price = this.product.price.toFixed(2);
    const productName = this.product.name;
    const productId = this.product.id;
    const template = `
    <div class="card">
      <div class="card__top">
        <img src="/assets/images/products/${imgName}" class="card__image" alt="product">
        <span class="card__price">€${price}</span>
      </div>
      <div class="card__body">
        <div class="card__title">${productName}</div>
        <button type="button" class="card__button">
          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
      </div>
    </div>
    `;
    this.elem = createElement(template);
    this.productAdd(this.elem, productId);
  }
  productAdd(elem, id) {
    elem.addEventListener('click', (e) => {
      if (e.target.closest('.card__button')) {
        const eventAdd = new CustomEvent('product-add', {
          detail: id,
          bubbles: true,
        });
        elem.dispatchEvent(eventAdd);
      }
    });
  }
}