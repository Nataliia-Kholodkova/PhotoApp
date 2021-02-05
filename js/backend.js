(function () {
    function filterPhotosHandler(event) {
        event.preventDefault();
        const target = event.target.closest('button');
        filterForm.querySelectorAll('.img-filters__button').forEach(button => button.classList.remove('img-filters__button--active'));
        target.classList.add('img-filters__button--active');
        let photosCopy = photos.slice();
        switch (target.id) {
            case 'filter-popular':
                renderPhotos(photosCopy.sort(function (a, b) {
                    return b.likes - a.likes;
                }));
                break;
            case 'filter-discussed':
                renderPhotos(photosCopy.sort(function (a, b) {
                    return b.comments.length - a.comments.length;
                }));
                break;
            default:
                renderPhotos(photos)
        }
    }

    function renderPhoto(photo, node) {
        node.querySelector('img').setAttribute('src', photo.url);
        node.querySelector('.picture__stat--likes').textContent = photo.likes;
        node.querySelector('.picture__stat--comments').textContent = photo.comments.length;
        node.dataset.id = photo.linkId;
        return node
    }

    function renderPhotos(photos) {
        const template = document.querySelector('#picture').content.querySelector('.picture__link');
        const fragment = document.createDocumentFragment();
        const pictures = document.querySelector('.pictures');
        pictures.querySelectorAll('a').forEach(a => a.remove());
        photos.forEach((photo, index) => {
            const link = template.cloneNode(true);
            photo.linkId = index;
            link.addEventListener('click', fullScreenImageHandler);
            fragment.appendChild(renderPhoto(photo, link));
        });
        pictures.append(fragment);
    }

    function renderBigPhoto(photo) {
        function renderComments(start) {
            const fragment = document.createDocumentFragment();
            for (let i = start; i < start + commentsCount; i++) {
                if (!photo.comments[i]) {
                    break;
                }
                let node = nodeComment.cloneNode(true);
                node.querySelector('.social__picture').src = `${photo.comments[i].avatar}`;
                node.querySelector('.social__text').textContent = `${photo.comments[i].message}`;
                fragment.appendChild(node);
            }
            comments.appendChild(fragment);
        }
        document.querySelector('body').classList.add('modal-open');
        const picture = document.querySelector('.big-picture');
        picture.classList.remove('hidden');
        picture.querySelector('.big-picture__img').firstElementChild.setAttribute('src', photo.url);
        picture.querySelector('.likes-count').textContent = photo.likes;
        picture.querySelector('.social__caption').textContent = photo.description;
        picture.querySelector('.comments-count').textContent = photo.comments.length;
        let comments = picture.querySelector('.social__comments');
        let nodeComment = comments.querySelector('.social__comment');
        comments.innerHTML = '';
        let counter = 5;
        renderComments(0);
        picture.querySelector('.social__comment-count').classList.add('visually-hidden');
        picture.querySelector('.social__loadmore').addEventListener('click', function (event) {
            renderComments(counter);
            counter += 5;
            if (counter >= photo.comments.length) {
                this.classList.add('visually-hidden');
                return
            }
        });
    }

    function closeBigPhotoHandler(event) {
        if ((event.type === 'keyup' && event.keyCode === window.ESC_CODE) || event.type === 'click') {
            window.utils.addHidden('.big-picture');
            document.querySelector('body').classList.remove('modal-open');
        }
    }

    function fullScreenImageHandler(event) {
        event.preventDefault();
        const target = event.target.closest('a');
        if (!target) {
            return
        }
        const photo = photos.find(photo => photo.linkId === +target.dataset.id);
        renderBigPhoto(photo);
        document.querySelector('#picture-cancel').addEventListener('click', closeBigPhotoHandler);
        document.addEventListener('keyup', closeBigPhotoHandler);
    }

    function onLoad(xhr) {
        photos = xhr.response;
        renderPhotos(photos);
        document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    }

    function onError(message) {
        alert(message);
    }

    window.utils.xhrDataRequest = function(method, url, onLoadHandler, onErrorHandler, data=null) {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        console.log(data);
        xhr.onload = function () {
            switch (xhr.status) {
                case 200:
                    if (method === 'POST') {
                        return
                    }
                    onLoadHandler(xhr);
                    break;
                case 400:
                    onErrorHandler('ERROR. Invalid URL.');
                    break;
                case 404:
                    onErrorHandler('ERROR. No data');
                    break;
                case 500:
                    onErrorHandler('ERROR. Server error.');
                    break;
            }
        };
        xhr.onerror = function () {
            onErrorHandler('ERROR')
        };

        xhr.open(method, url);

        xhr.send(data)
    };

    function sendFormHandler(event) {
        event.preventDefault();
        window.utils.xhrDataRequest('POST', 'https://21.javascript.pages.academy/kekstagram', onLoad, onError, new FormData(form));
        document.querySelector('.img-upload__overlay').classList.add('hidden');
    }

    let photos = [];
    const commentsCount = 5;
    window.utils.xhrDataRequest('GET', 'https://21.javascript.pages.academy/kekstagram/data', onLoad, onError);
    const filterForm = document.querySelector('.img-filters__form');
    filterForm.addEventListener('click', filterPhotosHandler);
    form = document.querySelector('.img-upload__form');
    form.addEventListener('submit', sendFormHandler);
})();
