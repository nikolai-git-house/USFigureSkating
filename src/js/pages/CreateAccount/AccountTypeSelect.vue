<script lang="ts">
    import Vue from "vue";
    import {AccountTypeKey} from "../../contracts/AppContracts";

    export default Vue.extend({
        data: function () {
            return {
                active_info_modal_key: <AccountTypeKey | null>null
            }
        },
        methods: {
            /**
             * Select an account type
             */
            select: function (account_type_key: AccountTypeKey) {
                this.$emit('type-selected', account_type_key);
            },
            /**
             * Launch the info modal for an account type
             */
            launchInfo: function (account_type_key: AccountTypeKey, event: MouseEvent) {
                let target = event.target as HTMLElement;
                target.blur();
                this.active_info_modal_key = account_type_key;
            },
            /**
             * Close the info modal
             */
            closeInfo: function () {
                this.active_info_modal_key = null;
            }
        },
        computed: {
            /**
             * Whether the volunteer info modal is active
             */
            volunteer_info_active: function (): boolean {
                return this.active_info_modal_key === "volunteer";
            },
            /**
             * Whether the foreign info modal is active
             */
            foreign_info_active: function (): boolean {
                return this.active_info_modal_key === "foreign";
            },
        }
    });
</script>