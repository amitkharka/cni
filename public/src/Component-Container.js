'use strict';

import { NEWS_CATEGORIES } from './constants.js';

class Container {
    #activeCategory = 'business';

    constructor() {
        if (!Container.instance) {
            this.DOM = document.createElement('section');
            Container.instance = this;
        }
        return Container.instance;
    }

    init() {
        this.DOM.setAttribute('class', 'container');
        const categoriesDOM = this._getCategories();
        const articlesDOM = this._getArticles();
        this.DOM.appendChild(categoriesDOM);
        this.DOM.appendChild(articlesDOM);
    }

    _getCategories() {
        const categoriesDOM = document.createElement('ul');
        categoriesDOM.setAttribute('class', 'categories');
        const fragment = document.createDocumentFragment();

        NEWS_CATEGORIES.forEach(category => {
            const categoryDOM = document.createElement('li');
            categoryDOM.setAttribute('class', 'categories__item');
            categoryDOM.setAttribute('data-category', category);
            categoryDOM.setAttribute('data-active', category === this.#activeCategory);
            categoryDOM.textContent = category;

            categoryDOM.addEventListener('click', this._handleCategoryClick.bind(this));
            fragment.appendChild(categoryDOM);
        });

        categoriesDOM.appendChild(fragment);
        return categoriesDOM;
    }

    _getArticles() {
        const articlesContainerDOM = document.createElement('ul');
        articlesContainerDOM.setAttribute('class', 'article-group');
        articlesContainerDOM.setAttribute('id', 'articles');

        const fragment = document.createDocumentFragment();
        const articleItemDOM = document.createElement('li');
        articleItemDOM.textContent = 'Loading...';
        fragment.appendChild(articleItemDOM);

        articlesContainerDOM.appendChild(fragment);

        this._loadArticles();

        return articlesContainerDOM;
    }

    // fetch records
    async _loadArticles() {
        try {
            const response = await fetch(`/news?category=${this.#activeCategory}`);
            const result = await response.json();
            if (result.status === 'ok' && result.articles) {
                const selector = document.getElementById('articles');
                selector.innerHTML = '';
                if (result.articles.length) {
                    const { articles } = result;
                    const fragment = document.createDocumentFragment();
                    articles.forEach((article) => {
                        fragment.appendChild(this._getTemplate(article));
                    });
                    selector.appendChild(fragment);
                } else {
                    selector.textContent = 'No Items'
                }

            }
        } catch (err) {
            console.error(err);
        }
    }

    _getTemplate(article) {
        const { author, title, content, urlToImage, url, publishedAt } = article;
        const dateTime = publishedAt.replace('T', ', ');

        const liElement = document.createElement('li');
        liElement.setAttribute('class', 'article-card');
        liElement.innerHTML = `
            <a  href=${url} target="_blank">
                <img class="article-thumbnail" src="${urlToImage}"
                    loading="lazy" alt="${title ?? ''}"
                    onerror="this.src = 'http://via.placeholder.com/244x132.png?text=Ooops...'"
                />
                <h3 class="article-title">${title ?? ''}</h3>
                <div class="article-content">${content ?? ''}</div>
                <div class="article-author">
                    <img loading="lazy" 
                        src="https://www.flaticon.com/svg/static/icons/svg/3075/3075878.svg"
                        height="16" width="16"
                    />
                    ${author ?? ''}
                </div>
                <div class ="article-datetime">
                    <img loading="lazy"
                        src="https://www.flaticon.com/svg/static/icons/svg/2088/2088617.svg" 
                        height="16" width="16"
                    />
                    ${dateTime ?? ''}
                </div>
            </a>
        `;
        return liElement;
    }

    _handleCategoryClick(event) {
        event.stopPropagation();
        const { category } = event.currentTarget.dataset;
        if (category !== this.#activeCategory) {
            const lastActiveCategory = event.currentTarget.parentElement.querySelector('li[data-active="true"]');
            lastActiveCategory.dataset.active = false;

            event.currentTarget.dataset.active = true;
            this.#activeCategory = category;
            this._getArticles();
        }
    }

    get latest() {
        return this.DOM;
    }
}

const instance = new Container();
Object.freeze(instance);
instance.init();

export default instance;