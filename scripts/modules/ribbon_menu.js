import { createElement } from '../libs/custom_libs.js';

export default class RibbonMenu {
  constructor(categories) {
    this.createMenu(categories);
  }

  createBtn(direction) {
    const template = `
    <button class="ribbon__arrow ribbon__arrow_${direction}">
      <img src="./assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    `;
    const elementBtn = createElement(template);
    return elementBtn;
  }

  createLink(options) {
    const template = `
    <a href="#" class="ribbon__item" data-id="${options.id}">${options.name}</a>
    `;
    const link = createElement(template);
    return link;
  }

  createMenu(coll) {
    this.elem = document.createElement('div');
    const btnRight = this.createBtn('right');
    const btnLeft = this.createBtn('left');
    const containerLinks = document.createElement('nav');

    containerLinks.onscroll = () => {
      const clientWidth = containerLinks.clientWidth;
      const scrollWidth = containerLinks.scrollWidth;
      const scrollLeft = containerLinks.scrollLeft;
      const right = scrollWidth - clientWidth - scrollLeft;
      if (right < 1) {
        btnRight.classList.remove('ribbon__arrow_visible');
      } else {
        btnRight.classList.add('ribbon__arrow_visible');
      }
      if (scrollLeft > 1) {
        btnLeft.classList.add('ribbon__arrow_visible');
      } else {
        btnLeft.classList.remove('ribbon__arrow_visible');
      }

    };
    this.elem.addEventListener('click', (e) => {
      console.log(this.elem)
      if (e.target.closest('.ribbon__arrow_right')) {
        containerLinks.scrollBy(350, 0);
      }
      if (e.target.closest('.ribbon__arrow_left')) {
        containerLinks.scrollBy(-350, 0);
      }
      if (e.target.closest('.ribbon__item')) {
        e.preventDefault();
        const items = document.querySelectorAll('.ribbon__item');
        const id = e.target.dataset.id;
        items.forEach((i) => {
          if (i.classList.contains('ribbon__item_active')) {
            i.classList.remove('ribbon__item_active');
          }
        });
        e.target.classList.add('ribbon__item_active');
        const customEvent = new CustomEvent('ribbon-select', {
          detail: id,
          bubbles: true,
        });
        this.elem.dispatchEvent(customEvent);
      }
    });
    
    btnRight.classList.add('ribbon__arrow_visible');
    this.elem.classList.add('ribbon');
    containerLinks.classList.add('ribbon__inner');
    this.elem.append(btnLeft);

    for (let i = 0; i < coll.length; i += 1) {
      const link = this.createLink(coll[i]);
      containerLinks.append(link);
    }

    this.elem.append(containerLinks);
    this.elem.append(btnRight);
  }
}
