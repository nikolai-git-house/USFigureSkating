<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        template: "<div></div>",
        props: {
            /**
             * Site key for library provided as property
             */
            site_key: {
                type: String,
                required: true
            }
        },
        methods: {
            /**
             * Upon captcha library load, render the captcha and attach appropriate properties
             */
            captchaLoaded: function () {
                grecaptcha.render(this.$el, {
                    'sitekey': this.site_key,
                    'callback': this.captchaCallback,
                    'expired-callback': this.captchaExpiredCallback,
                });
            },
            /**
             * Captcha is completed.  Emit captcha value
             */
            captchaCallback: function (response: string) {
                this.$emit('input', response)
            },
            /**
             * Captcha is expired. Emit null value
             */
            captchaExpiredCallback: function () {
                this.$emit('input', null)
            },
        },
        /**
         * When component is mounted, add script to load captcha library and attach callbacks
         */
        mounted: function () {
            (window as any).captchaLoad = () => {
                this.captchaLoaded();
            };
            let script = document.createElement('script');
            script.src = "https://www.google.com/recaptcha/api.js?onload=captchaLoad&render=explicit";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
    });
    declare var grecaptcha: any;
</script>