import Vue from "vue";

export default Vue.extend({
    /**
     * Handle data loading and loading state-related variables upon component creation
     */
    created: function () {

        this.initLoadingTimeout();
        this.preDataLoad()
            .then(()=>{
                this.loadData().catch(() => {
                    this.load_error = true;
                });
            });

    },
    data: function () {
        return {
            /**
             * Dependencies for component loading
             */
            dependencies: <{ [key: string]: boolean; }> {},
            /**
             * Whether there was an error loading component dependencies
             */
            load_error: false,
            /**
             * Timeout after which to display a loading message if data is not yet loaded
             */
            loading_timeout: false,
        }
    },
    methods: {
        /**
         * Start the loading timeout.  Log value after expiration
         */
        initLoadingTimeout: function () {
            setTimeout(() => {
                this.loading_timeout = true;
            }, 200);
        },
        /**
         * Load dependencies
         */
        loadData: function () {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        },
        /**
         * Action to take prior to data load attempt
         */
        preDataLoad:function(){
            return new Promise(function (resolve) {
                resolve();
            });
        }
    },
    computed: {
        /**
         * Whether the component data is fully loaded.
         */
        loaded: function () {
            for (let i in this.dependencies) {
                if (this.dependencies.hasOwnProperty(i)) {
                    let obj = this.dependencies[i];
                    if (obj !== true) {
                        return false;
                    }
                }
            }
            return true;
        },
        /**
         * Whether the component successfully loaded
         */
        component_loaded: function () {
            return this.loaded && !this.load_error;
        }
    }
});
