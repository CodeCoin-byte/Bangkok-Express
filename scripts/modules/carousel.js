import { createElement } from '../libs/custom_libs.js';

export default class Carousel {
  constructor(slides) {
    this.elem = this.createCarousel(slides);
  }
  createSlide(slideOptions) {
    const image = slideOptions.image;
    const id = slideOptions.id;
    const price = slideOptions.price.toFixed(2);
    const name = slideOptions.name;
    const template = `
    <div class="carousel__slide" data-id="${id}">
        <img src="/assets/images/carousel/${image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${price}</span>
          <div class="carousel__title">${name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `;
    const slide = createElement(template);
    const productAddEvent = new CustomEvent('product-add', {
      detail: id,
      bubbles: true,
    });
    slide.addEventListener('click', (e) => {
      if (e.target.closest('.carousel__button')) {
        slide.dispatchEvent(productAddEvent);
      }
    });
    return slide;
  }
  createControls() {
    const templateRight = `
    <div class="carousel__arrow carousel__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </div>
    `;
    const templateLeft = `
    <div class="carousel__arrow carousel__arrow_left">
      <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
    </div>
    `;
    const container = document.createDocumentFragment();
    container.append(createElement(templateRight));
    container.append(createElement(templateLeft));
    return container;
  }

  createCarousel(slides) {
    const carousel = document.createElement('div');
    carousel.classList.add('carousel');
    const containerSlides = document.createElement('div');
    containerSlides.classList.add('carousel__inner');
    carousel.append(this.createControls());
    for (let value of slides) {
      containerSlides.append(this.createSlide(value));
    }
    carousel.append(containerSlides);

    const btnLeft = carousel.querySelector('.carousel__arrow_left');
    const btnRight = carousel.querySelector('.carousel__arrow_right');
    btnLeft.style.display = 'none';
    
    let currentSlideCount = 1;
    let currentOffset = 0;
    carousel.addEventListener('click', (e) => {
      const slideWidth = containerSlides.offsetWidth;
      if (e.target.closest('.carousel__arrow_right')) {
        currentSlideCount += 1;
        currentOffset += slideWidth;
        containerSlides.style.transform = `translateX(-${currentOffset}px)`;
      } else if (e.target.closest('.carousel__arrow_left')) {
        currentOffset = currentOffset - slideWidth;
        containerSlides.style.transform = `translateX(-${currentOffset}px)`;
        currentSlideCount -= 1;
      }
      if (currentSlideCount > 1) {
        btnLeft.style.display = 'flex';
      } else {
        btnLeft.style.display = 'none';
      } if (currentSlideCount === slides.length) {
        btnRight.style.display = 'none';
      } else {
        btnRight.style.display = 'flex';
      }
    });
    return carousel;
  }
}
