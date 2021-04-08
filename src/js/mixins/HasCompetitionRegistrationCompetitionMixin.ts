import Vue from "vue";
import {
    CompetitionRegistrationActiveCompetition,
    CompetitionRegistrationCompetitionCore
} from "../contracts/app/CompetitionRegistrationContracts";

export default Vue.extend({
    computed: {
        active_competition: function (): CompetitionRegistrationActiveCompetition {
            return this.$store.getters['competition_registration/active_competition'];
        },
        competition: function (): CompetitionRegistrationCompetitionCore {
            return this.active_competition.competition;
        }

    }
})