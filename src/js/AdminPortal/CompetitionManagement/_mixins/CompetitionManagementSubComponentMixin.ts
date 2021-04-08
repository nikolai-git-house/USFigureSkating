import Vue from 'vue';

export default Vue.extend({
    props: {
        /**
         * Whether component is acting as a child, or if it's a standalone component
         */
        is_child: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        /**
         * Handle click event on back link.
         */
        backClick: function (e: MouseEvent) {
            if (this.is_child) {
                e.preventDefault();
                this.$emit('back');
            }
        }
    }
});