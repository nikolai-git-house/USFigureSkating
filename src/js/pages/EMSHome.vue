<script lang="ts">
    import HasDataDependencies from '../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import {UserRole} from '../contracts/AppContracts';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                dependencies: {
                    user_info: false
                },
                show_team_registration_error: false
            };
        },
        computed: {
            /**
             * Whether the request to load user info has completed
             */
            user_info_endpoint_request_completed: function () {
                return this.$store.state.user.user_info_endpoint_request_completed;
            },
            /**
             * The active user's roles
             */
            user_roles: function (): UserRole[] {
                return this.$store.getters['user/user_roles'];
            },
            /**
             * Whether the active user is a team manager
             */
            user_is_team_manager: function (): boolean {
                return this.user_roles.indexOf('team_manager') !== -1;
            }
        },
        watch: {
            /**
             * Watch Whether the request to load user info has completed, and update dependency loading state once it has
             */
            user_info_endpoint_request_completed: function (newValue) {
                if (newValue) {
                    this.dependencies.user_info = true;
                }
            }
        },
        methods: {
            /**
             * Handle click event on team registration link
             */
            handleTeamRegistrationClick: function (event: MouseEvent) {
                if (!this.user_is_team_manager) {
                    event.preventDefault();
                    this.flashTeamRegistrationErrorMessage();
                }
            },
            /**
             * Flash the error that the user can't access team registration
             */
            flashTeamRegistrationErrorMessage: function () {
                this.show_team_registration_error = true;
                setTimeout(() => {
                    this.show_team_registration_error = false;
                }, 3000);
            }
        }
    });
</script>