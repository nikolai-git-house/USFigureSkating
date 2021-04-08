<template>
	<div class="event-card" :class="{'event-card--registered' : event.is_registered_for, 'event-card--selected' : event.is_selected}">
		<div class="event-card__content">
			<div class="event-card__details">
				<p class="event-card__event-name">{{event.name}}</p>
				<p class="event-card__event-details">Judging System:
					<span :class="{'ijs-fix':event.judging_system.toLowerCase()==='ijs'}">{{event.judging_system}}</span>
				</p>
			</div>
			<slot name="actions"></slot>
		</div>
		<slot name="error"></slot>
	</div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {EventSelectionEvent} from "../../contracts/app/CompetitionRegistrationContracts";

    export default Vue.extend({
        props: {
            /**
             * The competition to populate the card
             */
            event: {
                type: Object as () => EventSelectionEvent,
                required: true
            }
        }
    });
</script>