(function () {
    window.ESC_CODE = 27;
    window.utils = {};
    window.utils.addHidden = function (className) {
        document.querySelector(className).classList.add('hidden');
    };
    window.utils.removeHidden = function (className) {
        document.querySelector(className).classList.remove('hidden');
    }
})();
