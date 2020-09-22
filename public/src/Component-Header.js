'use strict';

import { APP_TITLE } from './constants.js';

class Header {
    constructor() {
        if (!Header.instance) {
            this.DOM = document.createElement('header');
            Header.instance = this;
        }
        return Header.instance;
    }

    init() {
        this.DOM.setAttribute('class', 'header');
        const title = document.createElement('a');
        title.setAttribute('class', 'header-title');
        title.setAttribute('href', '/');
        title.textContent = APP_TITLE;
        this.DOM.appendChild(title);
    }

    get latest() {
        return this.DOM;
    }
}

const instance = new Header();
Object.freeze(instance);
instance.init();

export default instance;