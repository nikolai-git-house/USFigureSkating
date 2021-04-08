<script lang="ts">
    import EventSelectionMixin from '../../mixins/EventSelectionMixin';
    import mixins from 'vue-typed-mixins';
    import EventSelectionCard from './EventSelectionEvent.vue';
    import {EventSelectionEvent} from '../../contracts/app/CompetitionRegistrationContracts';

    const extendedVue = mixins(EventSelectionMixin);
    export default extendedVue.extend({
        components: {
            EventSelectionCard
        },
        methods: {
            /**
             * Action to perform add event
             */
            addEventAction: function (event: EventSelectionEvent): Promise<void> {
                return this.$store.dispatch('competition_registration/addEvent', event);
            },
            /**
             * Action to perform remove event
             */
            removeEventAction: function (event: EventSelectionEvent): Promise<void> {
                return this.$store.dispatch('competition_registration/removeEvent', event);
            }
        }
    });
</script>