(function () {
    function photoEffect() {
        switch (window.utils.effectCurrent) {
            case 'chrome':
                window.uploadImg.photo.style.filter = `grayscale(${+scaleVal.value / 100})`;
                break;
            case 'sepia':
                window.uploadImg.photo.style.filter = `sepia(${+scaleVal.value / 100})`;
                break;
            case 'marvin':
                window.uploadImg.photo.style.filter = `invert(${scaleVal.value}%)`;
                break;
            case 'phobos':
                window.uploadImg.photo.style.filter = `blur(${(+(scaleVal.value / 100) * phobosMax)}px)`;
                break;
            case "heat":
                window.uploadImg.photo.style.filter = `brightness(${(+scaleVal.value / 100) * (heatMax - heatMin) + heatMin})`;
                break;
            default:
                window.uploadImg.photo.style.filter = 'none';
        }
    }

    function calcPinPosition(currX=0, clientX) {
        const diff = currX - clientX;
        let newX;
        if (clientX > scaleLine.getBoundingClientRect().right) {
            newX = maxValScale;
        } else if (clientX < scaleLine.getBoundingClientRect().left) {
            newX = minValScale;
        } else {
            newX = (scalePin.offsetLeft - diff);
        }
        currX = clientX;
        scalePin.style.left = newX + 'px';
        scaleLevel.style.width = newX + 'px';
        return currX;
    }

    function calcScaleValue(x, width) {
        return +(((x / width) * 100).toFixed(2));
    }

    function mouseDownHandler(event) {
        event.stopPropagation();
        function mouseMoveHandler(event) {

            if (!event.target.closest('div.scale__pin')) {
                return
            }
            currX = calcPinPosition(currX, event.clientX);
            scaleVal.value = calcScaleValue(currX, scaleLine.offsetWidth);
            photoEffect();
        }
        function mouseUpHandler(event) {
            event.preventDefault();
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }
        event.preventDefault();
        let currX =  event.clientX;
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    function scaleClickHandler(event) {
        if (event.target === scalePin) {
            return
        }
        event.preventDefault();
        let coordX = event.offsetX;
        let positionValueClick;
        if (coordX >= 0 && coordX <= scaleLine.offsetWidth) {
            positionValueClick = (coordX / scaleLine.offsetWidth) * 100;
        }
        scalePin.style.left = positionValueClick + '%';
        scaleLevel.style.width = positionValueClick + '%';
        scaleVal.value = calcScaleValue(scalePin.offsetLeft, scaleLine.offsetWidth);
        photoEffect();
    }

    function effectChangeHandler(event) {
        const target = event.target.closest('input[type="radio"]');
        if (!target) {
            return
        }
        if (target.value === 'none') {
            window.utils.addHidden('.img-upload__scale');
        } else {
            window.utils.removeHidden('.img-upload__scale');
        }
        window.uploadImg.photo.style.filter = 'none';
        window.utils.effectCurrent = target.value;
        scalePin.style.left = 0;
        scaleLevel.style.width = 0;
        scaleVal.value = 0;
    }

    function changeSize(value) {
        const output = imageSelect.querySelector('.resize__control--value');
        const currValue = parseInt(output.value);
        let newVal = currValue + value;
        if (newVal > sizeMax || newVal < sizeMin) {
            return
        }
        output.value = `${newVal}%`;
        window.uploadImg.photoPreview.style.transform = `scale(${newVal / 100})`
    }

    function decreaseSizeHandler(event) {
        event.preventDefault();
        changeSize(-sizeStep);
    }

    function increaseSizeHandler(event) {
        event.preventDefault();
        changeSize(sizeStep);
    }

    window.utils.resetForm = function () {
        window.utils.addHidden('.img-upload__overlay');
        window.utils.addHidden('.img-upload__scale');
        window.uploadImg.photo.style.filter = 'none';
        window.uploadImg.photo.className = '';
        window.utils.effectCurrent = 'none';
        scalePin.style.left = 0;
        scaleLevel.style.width = 0;
        scaleVal.value = defaultSaleValue;
        imageSelect.querySelector('.resize__control--value').value = '55%';
    };

    const imageSelect = document.querySelector('#upload-select-image');
    const effectsList = imageSelect.querySelector('.effects__list');
    const scalePin = imageSelect.querySelector('.scale__pin');
    const scaleLevel = imageSelect.querySelector('.scale__level');
    const scaleLine = imageSelect.querySelector('.scale__line');
    const scaleVal = imageSelect.querySelector('.scale__value');
    const maxValScale = scaleLine.offsetWidth;
    const minValScale = 0;
    const phobosMax = 3;
    const heatMin = 1;
    const heatMax = 3;
    const sizeMin = 25;
    const sizeMax = 100;
    const sizeStep  = 25;
    const defaultSaleValue = 55;
    imageSelect.querySelector('.resize__control--minus').addEventListener('click', decreaseSizeHandler);
    imageSelect.querySelector('.resize__control--plus').addEventListener('click', increaseSizeHandler);
    effectsList.addEventListener('click', effectChangeHandler);
    scalePin.addEventListener('mousedown', mouseDownHandler, false);
    scaleLine.addEventListener('click', scaleClickHandler, false)
})();
