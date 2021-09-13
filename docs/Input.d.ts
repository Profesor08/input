export declare const constrain: (n: number, low: number, high: number) => number;
export declare class Input {
    private element;
    private input;
    private inputContainer;
    private inputError;
    private inputClear;
    private value;
    constructor(element: HTMLElement);
    private setActive;
    private setValidity;
    private updateStatus;
    private updateTextArea;
    private clearErrors;
    private validationHandler;
    private inputFocusHander;
    private focusSimulator;
    clear: () => void;
    private init;
    dispose(): void;
    static create(element: HTMLElement): Input;
    static destroy(element: HTMLElement): void;
    static getInstanceFor(element: HTMLElement): Input | undefined;
    static initAllAvailableOnPage(): void;
}
