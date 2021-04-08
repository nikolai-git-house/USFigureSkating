/**
 * Helpers for calculating element positions and scrolling to elements;
 */
export default class ScrollHelpers {
    /**
     * Get the distance between the top of the element and the top of the document
     */
    static getElementTopOffSet(el: any) {
        let topOffset = 0;
        let element = el;
        while (element) {
            topOffset += element.offsetTop;
            element = element.offsetParent;
        }
        return topOffset;
    }

    /**
     * Scroll to a vertical offset position
     */
    static scrollToOffset(offset: number) {
        let scrollingElement: Element = this.getRootScrollingElement();
        scrollingElement.scrollTop = offset;
    }

    /**
     * Get an element's height
     */
    static getElementHeight(el: HTMLElement) {
        return el.offsetHeight;
    }

    /**
     * Get an element'scrolltop within its parent
     */
    static getElementScrollTop(element: HTMLElement) {
        return element.scrollTop;
    }

    /**
     * Get the root scrolling element for a document
     */
    static getRootScrollingElement(): Element {
        return document.scrollingElement || document.documentElement || document.getElementsByTagName('body')[0];
    }
}