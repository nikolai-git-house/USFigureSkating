import Vue, {DirectiveOptions} from 'vue';
import ScrollHelpers from '../helpers/scroll';

/**
 * When elements with this directive are bound, they will show in the root of the App
 * and hide all other app child elements.  Upon removal, initial state will be restored
 */
Vue.directive('site-takeover', <DirectiveOptions>{
    /**
     * Upon bind...
     * 1. Remove app top padding if present
     * 2. Hide all child nodes of the node's root context
     * 3. Add the node's element
     */
    bind: function (el, binding, vnode) {
        const root = vnode.context && vnode.context.$root;
        if (!root) {
            return;
        }
        const current_scroll = ScrollHelpers.getElementScrollTop(ScrollHelpers.getRootScrollingElement() as HTMLElement);
        if (current_scroll) {
            el.dataset.previousScroll = current_scroll.toString();
        }
        const root_element: HTMLElement = root.$el as HTMLElement;

        if (root_element.classList.contains('app--header-pad')) {
            root_element.dataset.takeoverClass = 'app--header-pad';
            root_element.classList.remove('app--header-pad');
        }
        const root_children = root_element.children;
        for (let i = 0; i < root_children.length; i++) {
            const rootChild = root_children[i] as HTMLElement;
            rootChild.style.display = 'none';
        }
        root_element.appendChild(el);
    },
    /**
     * Upon unbind...
     *
     * 1. Restore root class removed when bound
     * 2. Restore visibility on root context's child nodes
     * 3. Node element will be removed automatically
     */
    unbind: function (el, binding, vnode) {
        const offset = el.dataset.previousScroll && parseInt(el.dataset.previousScroll);
        delete el.dataset.previousScroll;

        const root = vnode.context && vnode.context.$root;
        if (!root) {
            return;
        }

        const root_element = root.$el;
        if (root_element.dataset.takeoverClass) {
            root_element.classList.add(root_element.dataset.takeoverClass);
            delete root_element.dataset.takeoverClass;
        }
        const root_children = root.$el.children;
        for (let i = 0; i < root_children.length; i++) {
            const rootChild = root_children[i] as HTMLElement;
            rootChild.style.removeProperty('display');
        }

        offset && ScrollHelpers.scrollToOffset(offset);
    }
});