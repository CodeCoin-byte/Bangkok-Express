import { createElement } from '../libs/custom_libs.js';
import ProductCard from './product_card.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = createElement(`<div class="products-grid">
    <div class="products-grid__inner">
    </div>
    </div>`);
    this.render(products);
  }

  render(products) {
    const container = this.elem.querySelector('.products-grid__inner');
    container.innerHTML = '';
    products.forEach((product) => {
      const productCard = new ProductCard(product);
      container.append(productCard.elem);
    });
  }

  updateFilter(filters) {
    this.filters = {...this.filters, ...filters};
    const keys = Object.keys(this.filters);
    let result = this.products.filter((p) => {
      let count = true;
      for (let i = 0; i < keys.length; i += 1) {
        if (keys[i] === 'noNuts' && this.filters[keys[i]]) {
          if (p['nuts']) {
            count = false;
          }
          
        } else if (keys[i] === 'vegeterianOnly' && this.filters[keys[i]]) {
          if (!p['vegeterian']) {
            count = false;
          }
        } else if (keys[i] === 'maxSpiciness') {
          if (p['spiciness'] > this.filters[keys[i]]) {
            count = false;
          }
        } else if (keys[i] === 'category') {
          if (p['category'] !== this.filters[keys[i]] && !!this.filters[keys[i]]) {
            count = false;
          }
        }
      }
      return count;
    });
    this.render(result);
  }
}
