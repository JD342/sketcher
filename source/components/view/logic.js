'use strict';

(() => {

    console.log('yee');

    class SketcherApp extends HTMLElement {

        constructor() {
            super();
            console.log('wohoo!');
        }

    }

    customElements.define('sketcher-app', SketcherApp);

})();
