'use strict';

(() => {

    const initCanvas = Symbol();

    class ViewElement extends HTMLElement {

        constructor() {
            super();
            this[initCanvas]();
        }

        [initCanvas]() {

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            this.appendChild(canvas);
            window.addEventListener('resize', onResize);
            onResize();

            function onResize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                context.fillText('hello', 100, 100);
            }

        }

    }

    customElements.define('app-view', ViewElement);

})();
