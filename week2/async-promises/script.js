'use strict'; {

    window.onload = main;

    /**
     * Fetches JSON data asynchronously
     * @param {string} url The url to fetch
     */
    function fetchJSON(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'json';
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status < 400) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error('Error: ' + xhr.status + ' ' + xhr.statusText));
                    }
                }
            };
            xhr.send();
        });
    }

    /** 
     * Creates an element and appends it to a parent
     * @param {string} name The tag name of the element to create
     * @param {string} parent The element to which to append the created element
     * @param {object} options Attributes to assign to the created elements
     */
    function createAndAppend(name, parent, options = {}) {
        const elem = document.createElement(name);
        parent.appendChild(elem);
        Object.keys(options).forEach(key => {
            const value = options[key];
            if (key === 'html') {
                elem.innerHTML = value;
            } else {
                elem.setAttribute(key, value);
            }
        });
        return elem;
    }

    /**
     * sort option value in select DOM element
     * @param {DOM element} element DOM element to sort its option alphabetically
     */
    function sortList(element) {
        const clTexts = new Array();
        for (let i = 1; i < element.length; i++) {
            clTexts[i - 1] =
                element.options[i].text.toUpperCase() + "," +
                element.options[i].text + "," +
                element.options[i].value;
        }

        clTexts.sort();

        for (let i = 1; i < element.length; i++) {
            const parts = clTexts[i - 1].split(',');

            element.options[i].text = i + '. ' + parts[1];
            element.options[i].value = parts[2];
        }
    }

    /**
     * Main function 
     */
    function main() {

        const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

        const root = document.getElementById('root');

        createAndAppend('h1', root, {
            html: 'HYF SPA <br> BY <br> >> Promises <<'
        });

        const header = createAndAppend('div', root, {
            id: 'header'
        });

        createAndAppend('label', header, {
            html: 'Select a Repository:'

        });

        const container = createAndAppend('div', root, {
            class: 'container',
            id: 'container'
        });

        const informationDiv = createAndAppend('div', container, {
            class: 'infoDiv'
        });

        createAndAppend('ul', informationDiv, {
            id: 'info'
        });

        const imagesDiv = createAndAppend('div', container, {
            class: 'imgDiv'
        });

        createAndAppend('ul', imagesDiv, {
            id: 'imgUl'
        });

        fetchJSON(url)
            .then(manipulateSelect)
            .catch(err => {
                container.innerHTML = err.message;
            });

    }

    /**
     * Renders the <select> element
     * @param {object} DOM element 
     */
    function manipulateSelect(repos) {

        // repos.sort((a, b) => a.name.localeCompare(b.name));

        const select = createAndAppend('select', document.getElementById('header'));

        createAndAppend('option', select, {

            html: 'Select Repo',

        });

        createAndAppend('optgroup', select, {
            label: '--------------------------------'
        });

        repos.forEach((repo, i) => {
            createAndAppend('option', select, {
                html: repos[i].name,
                value: i
            });
        });

        sortList(select);

        select.addEventListener('change', () => {
            const index = select.selectedIndex;
            if (index > 0) {

                getRepoInformation(repos[select.value]);

            } else {
                const ulInfo = document.getElementById('info');
                ulInfo.innerHTML = '';
                const ulImg = document.getElementById('imgUl');
                ulImg.innerHTML = '';
            }

        });

    }

    /**
     * Render Information of Repo
     * @param {object} DOM element
     */
    function getRepoInformation(data) {
        const ulInfo = document.getElementById('info');

        ulInfo.innerHTML = '';

        createAndAppend('li', ulInfo, {
            html: 'Name : ' + "<a href=" + data.html_url + ' target="_blank" >' + data.name + "</a>",

        });

        createAndAppend('li', ulInfo, {
            html: 'Description : ' + '<span>' + data.description + '</span>'
        });

        createAndAppend('li', ulInfo, {
            html: 'Forks : ' + '<span>' + data.forks + '</span>'
        });

        createAndAppend('li', ulInfo, {
            html: 'Updated : ' + '<span>' + data.updated_at + '</span>'
        });

        getContributorInformation(data.contributors_url);

    }

    /**
     * Return Information of Contributor
     * @param {object} DOM element 
     */
    function getContributorInformation(url) {

        const ulImg = document.getElementById('imgUl');

        ulImg.innerHTML = '';

        fetchJSON(url)

            .then(contributors => {

                for (const contributor of contributors) {

                    const el = createAndAppend('li', ulImg, {
                        class: 'element'
                    });

                    createAndAppend('img', el, {
                        src: contributor.avatar_url
                    });

                    createAndAppend('div', el, {
                        html: contributor.login,
                        id: 'contributorName'
                    });

                    createAndAppend('div', el, {
                        html: contributor.contributions,
                        id: 'contributionsCounter'
                    });

                }

            })
            .catch(err => {
                document.getElementById('container').innerHTML = err.message;
            });
    }

}