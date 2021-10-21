import { createElement } from '../libs/custom_libs.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.createSlider();
    this.onClick();
    this.dragAndDrop();
  }

  
  createSlider() {
    const template = `
    <div class="slider">
    <div class="slider__thumb">
    <span class="slider__value">0</span>
    </div>
    <div class="slider__progress"  style="width: 0%;"></div>
    <div class="slider__steps">
    </div>
    </div>
    `;
    this.elem = createElement(template);
    const sliderSteps = this.elem.querySelector('.slider__steps');
    const thumb = this.elem.querySelector('.slider__thumb');
    thumb.style.left = `${this.value / (this.steps - 1) * 100}%`;
    const progress = this.elem.querySelector('.slider__progress');
    progress.style.width = `${this.value / (this.steps - 1) * 100}%`;
    const value = this.elem.querySelector('.slider__value');
    value.textContent = this.value;
    for (let i = 0; i < this.steps; i += 1) {
      const stepElem = document.createElement('span');
      sliderSteps.append(stepElem);
      if (i === this.value) {
        stepElem.classList.add('slider__step-active');
      }
    }
  }
  
  activeStep(elements) {
    for (let i = 0; i < elements.length; i += 1) {
      if (elements[i].classList.contains('slider__step-active')) {
        elements[i].classList.remove('slider__step-active');
      }
      if (i === this.value) {
        elements[i].classList.add('slider__step-active');
      }
    }
  }

  onClick() {
    const elements = this.elem.querySelectorAll('.slider__steps span');
    this.elem.addEventListener('click', (e) => {
      const steps = elements.length - 1;
      const offsetContainer = this.elem.getBoundingClientRect().left;
      const clickX = e.clientX - offsetContainer;
      const leftRelative = clickX / this.elem.offsetWidth;
      this.value = Math.round(leftRelative * steps);
      const sliderValue = document.querySelector('.slider__value');
      const sliderThumb = document.querySelector('.slider__thumb');
      const sliderProgress = document.querySelector('.slider__progress');
      sliderValue.textContent = this.value;
      sliderThumb.style.left = `${this.value / steps * 100}%`;
      sliderProgress.style.width = `${this.value / steps * 100}%`;
      this.activeStep(elements);
      const sliderChange = new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true,
      });
      this.elem.dispatchEvent(sliderChange);
    });
  }

  dragAndDrop() {
    const elements = this.elem.querySelectorAll('.slider__steps span');
    const thumb = this.elem.querySelector('.slider__thumb');
    const progress = this.elem.querySelector('.slider__progress');
    const steps = elements.length - 1;
    this.elem.addEventListener('pointerdown', (event) => {
      const sliderValue = document.querySelector('.slider__value');
      event.preventDefault();
      const coordsContainer = this.elem.getBoundingClientRect();

      const move = (e) => {
        e.preventDefault();
        const currentPosition = e.clientX - coordsContainer.left;
        const leftRelative = currentPosition / coordsContainer.width;
        this.value = Math.round(leftRelative * steps);
        if (leftRelative < 0 || e.clientX < coordsContainer.left) {
          thumb.style.left = '0%';
          progress.style.width = '0%';
          this.value = 0;
        } else if (leftRelative > 1 || e.clientX > coordsContainer.right) {
          thumb.style.left = '100%';
          progress.style.width = '100%';
          this.value = steps;
        } else {
          thumb.style.left = `${leftRelative * 100}%`;
          progress.style.width = `${leftRelative * 100}%`;
        }
        this.elem.classList.add('slider_dragging');
        sliderValue.textContent = this.value;
      };

      document.documentElement.addEventListener('pointermove', move);

      document.documentElement.onpointerup = (e) => {
        const sliderChange = new CustomEvent('slider-change', {
          detail: this.value,
          bubbles: true,
        });
        if (!e.target.closest('.slider')) {
          const steps = elements.length - 1;
          const sliderThumb = document.querySelector('.slider__thumb');
          const sliderProgress = document.querySelector('.slider__progress');
          sliderThumb.style.left = `${this.value / steps * 100}%`;
          sliderProgress.style.width = `${this.value / steps * 100}%`;
          this.elem.dispatchEvent(sliderChange);
          this.elem.classList.remove('slider_dragging');
          document.documentElement.removeEventListener('pointermove', move);
          thumb.onpointerup = null;
        } else {
          this.elem.dispatchEvent(sliderChange);
          this.elem.classList.remove('slider_dragging');
          document.documentElement.removeEventListener('pointermove', move);
          thumb.onpointerup = null;
        }
        this.activeStep(elements);

      };
    });

    this.elem.ondragstart = () => false;
  }
}
