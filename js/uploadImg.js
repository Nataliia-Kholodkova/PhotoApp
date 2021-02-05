(function () {
    function closeFormHandel(event) {
        if ((event.type === 'keyup' && event.keyCode === window.ESC_CODE && (document.activeElement !== document.querySelector('.text__hashtags') && document.activeElement !== document.querySelector('.text__description')) ) || event.type === 'click') {
            window.uploadImg.uploadInput.value = "";
            window.utils.resetForm();
        }
    }

    function uploadImageHandler(event) {
        event.preventDefault();
        reader = new FileReader();
        reader.onload = function () {
            window.utils.removeHidden('.img-upload__overlay');
            document.addEventListener('keyup', closeFormHandel);
            window.uploadImg.photoPreview = document.querySelector('.img-upload__preview');
            window.uploadImg.photo = window.uploadImg.photoPreview.firstElementChild;
            window.uploadImg.photo.setAttribute('src', reader.result);
            document.querySelector('#upload-cancel').addEventListener('click', closeFormHandel);
            document.querySelector('#upload-cancel').addEventListener('keyup', closeFormHandel);
            window.utils.addHidden('.img-upload__scale');
            window.uploadImg.photoPreview.style.transform = 'scale(0.55)'; // Для соответствия значения в поле масштаба по умолчанию
            document.querySelector('#effect-none').checked = true;
        };
        reader.readAsDataURL(this.files[0]);
    }

    function tagsInputHandler(event) {
        const values = hashTagInput.value.toLowerCase().trim().split(' ');
        const setValues = new Set(values);
        if (values.length !== setValues.size) {
            hashTagInput.setCustomValidity('There are the non-unique tags.');
            return false
        }
        if (values.length > maxTagsCount) {
            hashTagInput.setCustomValidity('Too many hashtags. Maximum allowed is 5.');
            return false
        }
        for (let tag of values) {
            if (tag.length > maxtagLength || !tag.startsWith('#')) {
                hashTagInput.setCustomValidity('Too long hashtag. Maximum length is 20.');
                return false
            }
        }
        hashTagInput.setCustomValidity('');
        return true
    }

    const hashTagInput = document.querySelector('.text__hashtags');
    const maxTagsCount = 5;
    const maxtagLength = 20;
    window.uploadImg = {};
    window.uploadImg.uploadInput = document.querySelector('#upload-file');
    window.uploadImg.uploadInput.addEventListener('change', uploadImageHandler);
    hashTagInput.addEventListener('blur', tagsInputHandler);
})();
