/*
 * Author @mattemrick
 * */
export const NumberInput = {
    twoWay: true,
    bind: function (el: HTMLElement) {
        el.onkeypress = function (event: KeyboardEvent) {
            return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
        }
    }
};

