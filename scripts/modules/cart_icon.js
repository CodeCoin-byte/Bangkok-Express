import { createElement } from '../libs/custom_libs.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    if (this.elem.offsetHeight) {
      const currentOffsetCart = this.elem.getBoundingClientRect().top - window.pageYOffset;
      const container = document.querySelector('.container');
      const offsetFromContainer = container.getBoundingClientRect().right + 20;
      const offsetFromDocument = document.documentElement.clientWidth - this.elem.offsetWidth - 10;
      const leftIndent = Math.min(offsetFromContainer, offsetFromDocument);
      const isMobile = document.documentElement.clientWidth <= 767;
      if (window.pageYOffset > currentOffsetCart && !isMobile) {
        this.elem.style.position = 'fixed';
        this.elem.style.top = '50px';
        this.elem.style.zIndex = '1000';
        this.elem.style.right = '10px';
        this.elem.style.left = `${leftIndent}px`;
      } else {
        this.elem.style.position = '';
        this.elem.style.top = '';
        this.elem.style.zIndex = '';
        this.elem.style.left = ``;
      }
    }
  }
}
