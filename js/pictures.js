(function () {
    function getRandomNumber(minNum, maxNum) {
        return Math.ceil(Math.random() * maxNum + minNum);
    }

    function generateObjects(num) {
        const comments = [
            'Всё отлично!', 'В целом всё неплохо. Но не всё.',
            'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
            'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
            'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
            'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
        ];
        const description = [
            'Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...',
            'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех' +
            ' словами......',
            'Вот это тачка!'
        ];
        let objects = [];
        for (let i = 1; i < num + 1; i++) {
            const numComments = getRandomNumber(1, 3);
            const commentsToPhoto = [];
            for (let j = 0; j < numComments; j++) {
                commentsToPhoto.push(comments[getRandomNumber(0, comments.length)]);
            }
            objects.push({
                'url': `photos/${i}.jpg`,
                'likes': getRandomNumber(15, 201),
                'comments': commentsToPhoto,
                'description': description[getRandomNumber(0, description.length)]
            })
        }
        return objects;
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
        photos.forEach((photo, index) => {
            const link = template.cloneNode(true);
            photo.linkId = index;
            link.addEventListener('click', fullScreenImageHandler);
            fragment.appendChild(renderPhoto(photo, link));
        });
        pictures.append(fragment);
    }

    function renderBigPhoto(photo) {
        const picture = document.querySelector('.big-picture');
        picture.classList.remove('hidden');
        picture.querySelector('.big-picture__img').firstElementChild.setAttribute('src', photo.url);
        picture.querySelector('.likes-count').textContent = photo.likes;
        picture.querySelector('.social__caption').textContent = photo.description;
        picture.querySelector('.comments-count').textContent = photo.comments.length;
        let comments = picture.querySelector('.social__comments');
        const fragment = document.createDocumentFragment();
        for (let comment of photo.comments) {
            fragment.innerHTML +=
                `<li class="social__comment social__comment--text">
                <img class="social__picture" src="img/avatar-${getRandomNumber(1, 7)}.svg" alt="Аватар комментатора фотографии" width="35" height="35">
                <p class="social__text">${comment}</p>
</li>`;
        }
        comments.appendChild(fragment);
        picture.querySelector('.social__comment-count').classList.add('visually-hidden');
        picture.querySelector('.social__loadmore').classList.add('visually-hidden');
    }

    function closeBigPhotoHandler(event) {
        if ((event.type === 'keyup' && event.keyCode === window.ESC_CODE) || event.type === 'click') {
            window.utils.addHidden('.big-picture');
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

    const photos = generateObjects(25);
    renderPhotos(photos);


})();
