type MinJSXEventMap = {
    animationcancel: 'AnimationCancel';
    animationend: 'AnimationEnd';
    animationiteration: 'AnimationIteration';
    animationstart: 'AnimationStart';
    auxclick: 'AuxClick';
    beforeinput: 'BeforeInput';
    beforematch: 'BeforeMatch';
    beforetoggle: 'BeforeToggle';
    beforexrselect: 'BeforeXRSelect';
    canplay: 'CanPlay';
    canplaythrough: 'CanPlaythrough';
    compositionend: 'CompositionEnd';
    compositionstart: 'ComposistionStart';
    compositionupdate: 'CompositionUpdate';
    contextmenu: 'ContextMenu';
    cuechange: 'CueChange';
    dblclick: 'DBlclick';
    dragend: 'DragEnd';
    dragenter: 'DragEnter';
    dragleave: 'DragLeave';
    dragover: 'DragOver';
    dragstart: 'DragStart';
    durationchange: 'DurationChange';
    focusin: 'FocusIn';
    focusout: 'FocusOut';
    formdata: 'FormData';
    gotpointercapture: 'GotPointerCapture';
    keydown: 'KeyDown';
    keypress: 'KeyPress';
    keyup: 'KeyUp';
    loadeddata: 'LoadedData';
    loadedmetadata: 'LoadedMetadata';
    loadstart: 'LoadedStart';
    lostpointercapture: 'LostPointCapture';
    mousedown: 'MouseDown';
    mouseenter: 'MouseEnter';
    mouseleave: 'MouseLeave';
    mousemove: 'MouseMown';
    mouseout: 'MouseOut';
    mouseover: 'MouseOver';
    mouseup: 'MouseOut';
    pointercancel: 'PointerCancel';
    pointerdown: 'PointerDown';
    pointerenter: 'PointerEnter';
    pointerleave: 'PointerLeave';
    pointermove: 'PointerMove';
    pointerout: 'PointerOut';
    pointerover: 'PointerOver';
    pointerup: 'PointerUp';
    ratechange: 'RateChange';
    securitypolicyviolation: 'SecurityPolicyViolation';
    selectionchange: 'SelectionChange';
    selectstart: 'SelectionStart';
    slotchange: 'SlotChange';
    timeupdate: 'TimeUpdate';
    touchcancel: 'TouchCancel';
    touchend: 'TouchEnd';
    touchmove: 'TouchMove';
    touchstart: 'TouchStart';
    transitioncancel: 'TransitionCancel';
    transitionend: `TransitionEnd`;
    transitionrun: `TransitionRun`;
    transitionstart: `TransitionStart`;
    volumechange: 'VolumeChange';
    webkitanimationend: 'WebkitAnimationEnd';
    webkitanimationiteration: 'WebkitAnimationIteration';
    webkitanimationstart: 'WebkitAnimationStart';
    webkittransitionend: 'WebkitTransitionEnd';
};

type EventHandlerKey<T extends keyof GlobalEventHandlersEventMap> =
    `on${T extends keyof MinJSXEventMap ? MinJSXEventMap[T] : Capitalize<T>}`;

type FalsyValue = false | undefined | null;

type Component<P = any> = (props: P) => HTMLElement | DocumentFragment;

type StyleProps = {
    [K in keyof CSSStyleDeclaration]?: string | number;
};

type BaseElement = {
    className?: string;
    classList?: (string | FalsyValue)[] | Record<string, true | FalsyValue>;
    id?: string;
    children?: any;
    style?: StyleProps | FalsyValue;
    dataset?: Record<string, string | boolean>;
    hidden?: boolean;
    draggable?: boolean;
    title?: string;
} & { [Key in `data-${string}`]?: string | boolean } & {
    [Key in keyof GlobalEventHandlersEventMap as EventHandlerKey<Key>]?: (
        event: GlobalEventHandlersEventMap[Key],
    ) => void;
};

type MinJSXElementProperties = {
    img: { src?: string; alt?: string };
    button: { type?: 'submit' | 'reset' | 'button' };
};

namespace JSX {
    type ElementType = keyof IntrinsicElements | Component;

    type Element = HTMLElement | DocumentFragment;

    type IntrinsicElements = {
        [T in keyof HTMLElementTagNameMap]: BaseElement &
            (T extends keyof MinJSXElementProperties
                ? MinJSXElementProperties[T]
                : {});
    };
}
