<!-- eslint-disable max-lines -->
<template>
    <div class="series-application-discipline">
        <h3 class="series-application-discipline__name">
            {{discipline.name}}
        </h3>
        <div v-if="show_section_partner"
             class="series-application-discipline__section">
            <h4 class="series-application-discipline__section-name">
                Partner
            </h4>
            <div v-if="notice_partner"
                 class="series-application-discipline__section-notice">
                <p :class="`text--icon-${notice_partner.type}`">
                    {{notice_partner.message}}
                </p>
            </div>
            <ul v-if="partners.length"
                class="series-application-discipline__element-list">
                <li v-for="partner in partners"
                    :key="partner.id">
                    <div class="series-application-discipline__element">
                        <div class="series-application-discipline__element__label">
                            {{partner.first_name}} {{partner.last_name}}
                            <span v-if="partner.ineligible"
                                  class="text--error">(Ineligible)</span>
                        </div>
                        <div class="series-application-discipline__element__action">
                            <button :disabled="paid_level_exists"
                                    class="icon-button icon-button--md icon-button--delete icon-button--pseudo"
                                    :title="`Remove Partner ${partner.name}`"
                                    v-on:click.prevent="partnerRemove(partner)">
                                <span class="sr-only">Remove Partner {{partner.name}}</span>
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="show_partner_add"
                 class="series-application-discipline__section__add">
                <div class="series-application-discipline__element">
                    <div class="series-application-discipline__element__placeholder">
                        Add Partner
                    </div>
                    <div class="series-application-discipline__element__action">
                        <button class="icon-button icon-button--lg icon-button--add icon-button--pseudo"
                                v-on:click.prevent="partnerAdd()">
                            <span class="sr-only">Add Partner</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="show_section_levels"
             class="series-application-discipline__section">
            <h4 class="series-application-discipline__section-name">
                Levels
            </h4>
            <div v-if="notice_levels"
                 class="series-application-discipline__section-notice">
                <p :class="`text--icon-${notice_levels.type}`">
                    {{notice_levels.message}}
                </p>
            </div>
            <ul v-if="levels.length"
                class="series-application-discipline__element-list">
                <li v-for="level in levels"
                    :key="level.id">
                    <div class="series-application-discipline__element"
                         :class="level_element_class(level)">
                        <div class="series-application-discipline__element__label">
                            {{level.name}}
                        </div>
                        <div v-if="!level.is_paid"
                             class="series-application-discipline__element__action">
                            <button class="icon-button icon-button--md icon-button--delete icon-button--pseudo"
                                    :title="`Remove ${level.name}`"
                                    v-on:click.prevent="levelRemove(level)">
                                <span class="sr-only">Remove Level {{level.name}}</span>
                            </button>
                        </div>
                        <div v-else
                             class="series-application-discipline__element__payment-status series-application-discipline__element__payment-status--paid">
                            <span class="series-application-discipline__element__payment-status__text">
                                Paid
                            </span>
                            <i class="series-application-discipline__element__payment-status__icon icon-status-check">
                                &nbsp;
                            </i>
                        </div>
                    </div>
                    <div v-if="!level.is_paid && show_level_payment_status"
                         class="series-application-discipline__element-label">
                        Unpaid level
                    </div>
                </li>
            </ul>
            <div class="series-application-discipline__section__add">
                <div v-if="show_level_select"
                     class="series-application-discipline__element form-group">
                    <select id="level"
                            v-model="level_select_value"
                            name="level"
                            class="form-field">
                        <option :value="null">
                            Select Level
                        </option>
                        <option v-for="(level, index) in levels_selectable"
                                :key="index"
                                :value="level">
                            {{level.name}}
                        </option>
                    </select>
                </div>
                <div v-else-if="show_level_add"
                     class="series-application-discipline__element">
                    <div class="series-application-discipline__element__placeholder">
                        Add Level
                    </div>
                    <div class="series-application-discipline__element__action">
                        <button class="icon-button icon-button--lg icon-button--add icon-button--pseudo"
                                v-on:click.prevent="levelAdd()">
                            <span class="sr-only">Add Level</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="show_section_coaches"
             class="series-application-discipline__section">
            <h4 class="series-application-discipline__section-name">
                Coaches
            </h4>
            <div v-if="notice_coaches"
                 class="series-application-discipline__section-notice">
                <p :class="`text--icon-${notice_coaches.type}`">
                    {{notice_coaches.message}}
                </p>
            </div>
            <ul v-if="coaches.length"
                class="series-application-discipline__element-list">
                <li v-for="coach in coaches"
                    :key="coach.id">
                    <div class="series-application-discipline__element">
                        <div class="series-application-discipline__element__label">
                            {{coach.first_name}} {{coach.last_name}}
                            <span v-if="coach.ineligible"
                                  class="text--error">(Ineligible)</span>
                        </div>
                        <div class="series-application-discipline__element__action">
                            <button :title="`Remove Coach ${coach.name}`"
                                    class="icon-button icon-button--md icon-button--delete icon-button--pseudo"
                                    v-on:click.prevent="coachRemove(coach)">
                                <span class="sr-only">Remove Coach {{coach.name}}</span>
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="show_coach_add"
                 class="series-application-discipline__section__add">
                <div class="series-application-discipline__element">
                    <div class="series-application-discipline__element__placeholder">
                        Add Coach
                    </div>
                    <div class="series-application-discipline__element__action">
                        <button class="icon-button icon-button--lg icon-button--add icon-button--pseudo"
                                v-on:click.prevent="coachAdd()">
                            <span class="sr-only">Add Coach</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesApplication} from '../_contracts';

    export default Vue.extend({
        props: {
            discipline: {
                type: Object as () => SeriesApplication.ApplicationDiscipline,
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The value selected for the level select
                 */
                level_select_value: null,
                /**
                 * Whether to show the level select input
                 */
                show_level_select: false
            };
        },
        computed: {
            /**
             * The currently added coaches
             */
            coaches: function (): SeriesApplication.ApplicationDisciplineCoach[] {
                return this.discipline.coaches;
            },
            /**
             * The class to apply to a level element item
             */
            level_element_class: function (): (level: SeriesApplication.ApplicationDisciplineLevelSelected) => string | null {
                return (level: SeriesApplication.ApplicationDisciplineLevelSelected): string | null => {
                    if (level.is_paid) {
                        return 'series-application-discipline__element--paid';
                    }
                    if (!this.show_level_payment_status) {
                        return null;
                    }

                    return 'series-application-discipline__element--unpaid';
                };
            },
            /**
             * The currently added levels
             */
            levels: function (): SeriesApplication.ApplicationDisciplineLevelSelected[] {
                return this.discipline.levels;
            },
            /**
             * The complete available levels for selection
             *
             * For partnered discipline, levels for which current user and partner are both eligible
             *
             * Otherwise, user eligible levels
             */
            levels_available: function (): SeriesApplication.ApplicationDisciplineLevel[] {
                return this.$store.getters['series_registration/application/user_selectable_discipline_levels'](this.discipline);
            },
            /**
             * The levels that can be selected
             *
             * `force_up` controls whether only levels above currently selected level are presented
             *
             * Otherwise show all levels that aren't already selected
             */
            levels_selectable: function (): SeriesApplication.ApplicationDisciplineLevel[] {
                const force_up = false;
                if (force_up) {

                    const max_selected_level_id: number = this.levels.reduce((carry, level) => {
                        return level.level_id > carry ? level.level_id : carry;
                    }, -1);

                    return this.levels_available.filter((level: SeriesApplication.ApplicationDisciplineLevel) => {
                        return level.level_id > max_selected_level_id;
                    });
                }

                // eslint-disable-next-line
                const selected_level_ids = this.levels.map(level => level.id);

                return this.levels_available.filter((level: SeriesApplication.ApplicationDisciplineLevel) => {
                    return selected_level_ids.indexOf(level.id) === -1;
                });

            },
            /**
             * The maximum number of levels the user can select
             */
            max_levels: function (): number {
                return this.$store.getters['series_registration/application/max_levels'];
            },
            /**
             * The notice to display in the coaches section
             */
            notice_coaches: function (): SeriesApplication.DisciplineNotice | null {
                return {
                    type: 'warning',
                    message: `You may select up to ${this.discipline.coach_limit} coaches.`
                };
            },
            /**
             * The notice to display in the levels section
             */
            notice_levels: function (): SeriesApplication.DisciplineNotice | null {
                if (!this.levels_selectable.length || this.levels.length === this.max_levels) {
                    const levels_selected = this.levels.length;
                    const partner_discipline = this.discipline.partner_configuration.is_partnered;

                    const entity_descriptor = partner_discipline && !levels_selected ? ' with this partner' : '';
                    const level_descriptor = levels_selected ? 'any more' : 'any';

                    const message = `You are not eligible for ${level_descriptor} levels${entity_descriptor}.`;

                    return {
                        type: levels_selected ? 'warning' : 'danger',
                        message
                    };
                }
                if (!this.discipline.levels.length && this.discipline.coach_limit) {
                    return {
                        type: 'warning',
                        message: 'You must select a level before adding coach(es).'
                    };
                }

                return null;
            },
            /**
             * The notice to display in the partner section
             */
            notice_partner: function (): SeriesApplication.DisciplineNotice | null {
                if (this.partner_ineligible_selected) {
                    return {
                        type: 'danger',
                        message: 'You must select an eligible partner before adding levels.'
                    };
                }
                if (!this.discipline.partners.length) {
                    return {
                        type: 'warning',
                        message: 'You must select a partner before adding level(s).'
                    };
                }

                return null;
            },
            /**
             * Whether a paid level exists for the discipline
             */
            paid_level_exists: function (): boolean {
                for (let i = 0; i < this.levels.length; i++) {
                    const level = this.levels[i];
                    if (level.is_paid) {
                        return true;
                    }
                }

                return false;
            },
            /**
             * Whether an ineligible partner has been selected
             */
            partner_ineligible_selected: function (): boolean {
                for (let i = 0; i < this.partners.length; i++) {
                    const partner = this.partners[i];
                    if (partner.ineligible) {
                        return true;
                    }
                }

                return false;
            },
            /**
             * The currently added partners
             */
            partners: function (): SeriesApplication.ApplicationDisciplinePartner[] {
                return this.discipline.partners;
            },
            /**
             * Whether to show the coaches add control
             */
            show_coach_add: function (): boolean {
                return this.coaches.length < this.discipline.coach_limit;
            },
            /**
             * Whether to show the levels add control
             */
            show_level_add: function (): boolean {
                return this.levels.length < this.max_levels && !!this.levels_selectable.length;
            },
            /**
             * Whether to show payment status on level items
             */
            show_level_payment_status: function (): boolean {
                return this.$store.state.series_registration.application.saved_application_exists;
            },
            /**
             * Whether to show the partner add control
             */
            show_partner_add: function (): boolean {
                return this.partners.length === 0;
            },
            /**
             * Whether to show the coach section
             */
            show_section_coaches: function (): boolean {
                return this.levels.length > 0 && this.discipline.coach_limit > 0;
            },
            /**
             * Whether to show the levels section
             */
            show_section_levels: function (): boolean {
                if (this.discipline.partner_configuration.is_partnered) {
                    return this.partners.length > 0;
                }

                return true;
            },
            /**
             * Whether to show the partner section
             */
            show_section_partner: function (): boolean {
                return this.discipline.partner_configuration.is_partnered;
            }
        },
        watch: {
            /**
             * Watch the level select value for change.  If a value is set, report the selection and reset the form input
             */
            level_select_value: function (value: SeriesApplication.ApplicationDisciplineLevel): void {
                if (value) {
                    this.levelSelect(value);
                    this.show_level_select = false;
                    this.level_select_value = null;
                }
            }
        },
        methods: {
            /**
             * Add a coach
             */
            coachAdd: function (): void {
                this.$store.dispatch('series_registration/application/openCoachSearch', this.discipline);
            },
            /**
             * Remove a coach
             */
            coachRemove: function (coach: SeriesApplication.ApplicationDisciplineCoach): void {
                this.$store.dispatch('app/confirmAction', {
                    message: `Are you sure you want to remove ${coach.first_name} ${coach.last_name} from your coach list?`,
                    action: () => {
                        const payload: SeriesApplication.RemoveCoachPayload = {
                            coach,
                            discipline: this.discipline
                        };
                        this.$store.dispatch('series_registration/application/removeCoach', payload);
                    }
                });
            },
            /**
             * Handle the click event on the add level button
             */
            levelAdd: function (): void {
                if (this.levels_selectable.length > 1) {
                    this.show_level_select = true;

                    return;
                }
                this.levelSelect(this.levels_selectable[0]);
            },
            /**
             * Remove a level
             */
            levelRemove: function (level: SeriesApplication.ApplicationDisciplineLevelSelected): void {
                if (level.is_paid) {
                    return;
                }
                this.$store.dispatch('app/confirmAction', {
                    message: `Are you sure you want to remove ${level.name} from your levels?`,
                    action: () => {
                        const payload: SeriesApplication.RemoveLevelPayload = {
                            discipline: this.discipline,
                            level
                        };
                        this.$store.dispatch('series_registration/application/removeLevel', payload);
                    }
                });
            },
            /**
             * Select a level
             */
            levelSelect: function (level: SeriesApplication.ApplicationDisciplineLevel): void {
                const payload: SeriesApplication.SelectLevelPayload = {
                    discipline: this.discipline,
                    level
                };
                this.$store.dispatch('series_registration/application/selectLevel', payload);
            },
            /**
             * Handle the click event on the add partner button
             */
            partnerAdd: function (): void {
                this.$store.dispatch('series_registration/application/openPartnerSearch', this.discipline);
            },
            /**
             * Remove a partner
             */
            partnerRemove: function (partner: SeriesApplication.ApplicationDisciplinePartner): void {
                if (this.paid_level_exists) {
                    return;
                }
                this.$store.dispatch('app/confirmAction', {
                    message: `Are you sure you want to remove ${partner.first_name} ${partner.last_name} from your partner list?`,
                    action: () => {
                        this.$store.dispatch('series_registration/application/removePartner', <SeriesApplication.RemovePartnerPayload>{
                            partner,
                            discipline: this.discipline
                        });
                    }
                });
            }
        }
    });
</script>