const canRender = (x: any) => x !== undefined && x !== null && x !== false;

type JSXProps = Record<string, any> & {
    children?: any;
};

export const Fragment = Symbol.for('Fragment');
type Component<P = any> = (props: P) => HTMLElement | DocumentFragment;

type ElementType =
    | Component<any>
    | keyof HTMLElementTagNameMap
    | typeof Fragment;

function appendChild(parent: HTMLElement | DocumentFragment, child: any) {
    if (!canRender(child)) return;

    if (Array.isArray(child)) {
        for (const sub of child) {
            appendChild(parent, sub);
        }
        return;
    }

    parent.append(child);
}

function commonJSXHandler(
    type: ElementType,
    props: JSXProps | null,
): HTMLElement | DocumentFragment {
    if (typeof type == 'function') {
        return type(props ?? {});
    }

    const { children, ...rest } = props ?? {};
    const element =
        type == Fragment
            ? document.createDocumentFragment()
            : document.createElement(type);

    if (element instanceof Element)
        for (const key in rest) {
            const value = rest[key];

            if (key == 'className') {
                element.className = value;
            } else if (key == 'classList') {
                if (Array.isArray(value)) {
                    element.classList.add(...value.filter(Boolean));
                } else if (typeof value === 'object') {
                    for (const cls in value) {
                        if (value[cls]) {
                            element.classList.add(cls);
                        }
                    }
                }
            } else if (key == 'style') {
                if (value && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (typeof value === 'string' && value.trim()) {
                    element.style.cssText = value;
                }
            } else if (key == 'hidden') {
                element.toggleAttribute('hidden', value);
            } else if (key == 'dataset') {
                Object.assign(element.dataset, value);
            } else if (key.startsWith('on')) {
                const event = key.slice(2);
                element.addEventListener(event.toLowerCase(), value);
            } else if (key.startsWith('data-')) {
                if (value == null) continue;

                if (typeof value === 'boolean') {
                    element.toggleAttribute(key, value);
                } else {
                    element.setAttribute(key, value);
                }
            } else {
                element.setAttribute(key, value);
            }
        }

    appendChild(element, children);

    return element;
}

export const jsx = commonJSXHandler;
export const jsxx = commonJSXHandler;
