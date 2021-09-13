const inputsMap = new Map<HTMLElement, Input>();

export const constrain = (n: number, low: number, high: number) => {
  return Math.max(Math.min(n, high), low);
};

export class Input {
  private input: HTMLInputElement | HTMLTextAreaElement | null;
  private inputContainer: HTMLElement | null;
  private inputError: HTMLElement | null;
  private inputClear: HTMLElement | null;
  private value: string = "";

  constructor(private element: HTMLElement) {
    this.input = element.querySelector<HTMLInputElement>(".input-field");
    this.inputContainer =
      element.querySelector<HTMLElement>(".input-container");
    this.inputError = element.querySelector<HTMLElement>(".input-error");
    this.inputClear = element.querySelector<HTMLElement>(".input-clear");
    this.init();
    this.updateStatus();
    inputsMap.set(element, this);
  }

  private setActive = (force: boolean = true) => {
    this.element.classList.toggle("is-active", force);
  };

  private setValidity = (force: boolean) => {
    this.element.classList.toggle("is-invalid", force === false);
  };

  private updateStatus = () => {
    if (this.input !== null) {
      this.element.classList.toggle(
        "is-changed",
        this.input.value !== this.value,
      );

      if (document.activeElement === this.input) {
        this.setActive(true);
      } else {
        this.setActive(this.input !== null && this.input.value.length !== 0);
      }

      if (this.input instanceof HTMLTextAreaElement) {
        this.updateTextArea(this.input);
      }
    } else {
      this.setActive(false);
    }
  };

  private updateTextArea = (textarea: HTMLTextAreaElement) => {
    const style = getComputedStyle(textarea);
    const lineHeight = parseInt(style.lineHeight) || 0;
    const paddingTop = parseInt(style.paddingTop) || 0;
    const paddingBottom = parseInt(style.paddingBottom) || 0;
    const borderTopWidth = parseInt(style.borderTopWidth) || 0;
    const borderBottomWidth = parseInt(style.borderBottomWidth) || 0;
    const rows = textarea.rows;
    const maxRows =
      parseInt(textarea.getAttribute("data-max-rows") || "99999") || 99999;

    textarea.style.setProperty("height", "0px");

    const minHeight =
      lineHeight * rows +
      paddingTop +
      paddingBottom +
      borderTopWidth +
      borderBottomWidth;

    const maxHeight = maxRows * lineHeight;

    const targetHeight =
      Math.floor(textarea.scrollHeight / lineHeight) * lineHeight +
      (textarea.scrollHeight % lineHeight ? 1 : 0) * lineHeight;

    const height = constrain(targetHeight, minHeight, maxHeight);

    textarea.style.setProperty("height", height + "px");
    textarea.style.setProperty("min-height", minHeight + "px");
    textarea.style.setProperty("max-height", maxHeight + "px");
  };

  private clearErrors = () => {
    if (this.inputError !== null) {
      const animation = this.inputError.animate(
        [
          {
            height: this.inputError.clientHeight + "px",
            opacity: 1,
          },
          {
            height: 0,
            opacity: 0,
          },
        ],
        {
          duration: 500,
          fill: "forwards",
        },
      );

      animation.addEventListener("finish", () => {
        animation.cancel();
      });

      this.element.classList.remove("is-error");
    } else {
      this.element.classList.remove("is-error");
    }
  };

  private validationHandler = () => {
    if (this.input !== null) {
      const validity = this.input.validity;

      if (validity.valid) {
        this.setValidity(true);
      } else {
        this.setValidity(false);
      }
    }
  };

  private inputFocusHander = () => {
    this.setValidity(true);
  };

  private focusSimulator = () => {
    if (this.input) {
      this.input.focus();
    }
  };

  public clear = () => {
    if (this.input) {
      this.input.value = "";
      this.input.dispatchEvent(
        new Event("input", {
          bubbles: true,
          cancelable: true,
          composed: true,
        }),
      );
    }
  };

  private init() {
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
  }

  public dispose() {
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
  }

  public static create(element: HTMLElement): Input {
    const instance = inputsMap.get(element);

    if (instance !== undefined) {
      return instance;
    }

    return new Input(element);
  }

  public static destroy(element: HTMLElement) {
    const instance = inputsMap.get(element);

    if (instance) {
      instance.dispose();
    }
  }

  public static getInstanceFor(element: HTMLElement): Input | undefined {
    return inputsMap.get(element);
  }

  public static initAllAvailableOnPage() {
    document.querySelectorAll<HTMLElement>(".input").forEach((element) => {
      Input.create(element);
    });
  }
}
