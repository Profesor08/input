var inputsMap = new Map();
export var constrain = function (n, low, high) {
    return Math.max(Math.min(n, high), low);
};
var Input = /** @class */ (function () {
    function Input(element) {
        var _this = this;
        this.element = element;
        this.value = "";
        this.setActive = function (force) {
            if (force === void 0) { force = true; }
            _this.element.classList.toggle("is-active", force);
        };
        this.setValidity = function (force) {
            _this.element.classList.toggle("is-invalid", force === false);
        };
        this.updateStatus = function () {
            if (_this.input !== null) {
                _this.element.classList.toggle("is-changed", _this.input.value !== _this.value);
                if (document.activeElement === _this.input) {
                    _this.setActive(true);
                }
                else {
                    _this.setActive(_this.input !== null && _this.input.value.length !== 0);
                }
                if (_this.input instanceof HTMLTextAreaElement) {
                    _this.updateTextArea(_this.input);
                }
            }
            else {
                _this.setActive(false);
            }
        };
        this.updateTextArea = function (textarea) {
            var style = getComputedStyle(textarea);
            var lineHeight = parseInt(style.lineHeight) || 0;
            var paddingTop = parseInt(style.paddingTop) || 0;
            var paddingBottom = parseInt(style.paddingBottom) || 0;
            var borderTopWidth = parseInt(style.borderTopWidth) || 0;
            var borderBottomWidth = parseInt(style.borderBottomWidth) || 0;
            var rows = textarea.rows;
            var maxRows = parseInt(textarea.getAttribute("data-max-rows") || "99999") || 99999;
            textarea.style.setProperty("height", "0px");
            var minHeight = lineHeight * rows +
                paddingTop +
                paddingBottom +
                borderTopWidth +
                borderBottomWidth;
            var maxHeight = maxRows * lineHeight;
            var targetHeight = Math.floor(textarea.scrollHeight / lineHeight) * lineHeight +
                (textarea.scrollHeight % lineHeight ? 1 : 0) * lineHeight;
            var height = constrain(targetHeight, minHeight, maxHeight);
            textarea.style.setProperty("height", height + "px");
            textarea.style.setProperty("min-height", minHeight + "px");
            textarea.style.setProperty("max-height", maxHeight + "px");
        };
        this.clearErrors = function () {
            if (_this.inputError !== null) {
                var animation_1 = _this.inputError.animate([
                    {
                        height: _this.inputError.clientHeight + "px",
                        opacity: 1,
                    },
                    {
                        height: 0,
                        opacity: 0,
                    },
                ], {
                    duration: 500,
                    fill: "forwards",
                });
                animation_1.addEventListener("finish", function () {
                    animation_1.cancel();
                });
                _this.element.classList.remove("is-error");
            }
            else {
                _this.element.classList.remove("is-error");
            }
        };
        this.validationHandler = function () {
            if (_this.input !== null) {
                var validity = _this.input.validity;
                if (validity.valid) {
                    _this.setValidity(true);
                }
                else {
                    _this.setValidity(false);
                }
            }
        };
        this.inputFocusHander = function () {
            _this.setValidity(true);
        };
        this.focusSimulator = function () {
            if (_this.input) {
                _this.input.focus();
            }
        };
        this.clear = function () {
            if (_this.input) {
                _this.input.value = "";
                _this.input.dispatchEvent(new Event("input", {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                }));
            }
        };
        this.input = element.querySelector(".input-field");
        this.inputContainer =
            element.querySelector(".input-container");
        this.inputError = element.querySelector(".input-error");
        this.inputClear = element.querySelector(".input-clear");
        this.init();
        this.updateStatus();
        inputsMap.set(element, this);
    }
    Input.prototype.init = function () {
        if (this.inputContainer) {
            this.inputContainer.addEventListener("click", this.focusSimulator);
            this.inputContainer.addEventListener("touchstart", this.focusSimulator);
        }
        if (this.input) {
            this.value = this.input.value;
            this.input.addEventListener("focus", this.updateStatus);
            this.input.addEventListener("focus", this.clearErrors);
            this.input.addEventListener("blur", this.updateStatus);
            this.input.addEventListener("input", this.updateStatus);
            this.input.addEventListener("blur", this.validationHandler);
            this.input.addEventListener("invalid", this.validationHandler);
            this.input.addEventListener("valid", this.validationHandler);
            this.input.addEventListener("focus", this.inputFocusHander);
        }
        if (this.inputClear) {
            this.inputClear.addEventListener("click", this.clear);
        }
    };
    Input.prototype.dispose = function () {
        this.element.removeEventListener("click", this.focusSimulator);
        this.element.removeEventListener("touchstart", this.focusSimulator);
        if (this.input) {
            this.input.removeEventListener("focus", this.updateStatus);
            this.input.removeEventListener("focus", this.clearErrors);
            this.input.removeEventListener("blur", this.updateStatus);
            this.input.removeEventListener("input", this.updateStatus);
            this.input.removeEventListener("blur", this.validationHandler);
            this.input.removeEventListener("invalid", this.validationHandler);
            this.input.removeEventListener("valid", this.validationHandler);
            this.input.removeEventListener("focus", this.inputFocusHander);
            if (this.input instanceof HTMLTextAreaElement) {
                this.input.style.removeProperty("height");
                this.input.style.removeProperty("max-height");
            }
        }
        if (this.inputClear) {
            this.inputClear.removeEventListener("click", this.clear);
        }
    };
    Input.create = function (element) {
        var instance = inputsMap.get(element);
        if (instance !== undefined) {
            return instance;
        }
        return new Input(element);
    };
    Input.destroy = function (element) {
        var instance = inputsMap.get(element);
        if (instance) {
            instance.dispose();
        }
    };
    Input.getInstanceFor = function (element) {
        return inputsMap.get(element);
    };
    Input.initAllAvailableOnPage = function () {
        document.querySelectorAll(".input").forEach(function (element) {
            Input.create(element);
        });
    };
    return Input;
}());
export { Input };
