/**
 * Get an element's current scrollbar width
 */
export function getElementScrollBarWidth(el: HTMLElement) {
    //create invisible inner element
    const inner: HTMLElement = document.createElement('div');
    inner.style.visibility = 'hidden';
    el.appendChild(inner);
    //Calculate the difference in parent element width and our inner element
    const scrollbarWidth = (el.offsetWidth - inner.offsetWidth);
    el.removeChild(inner);
    return scrollbarWidth;
}