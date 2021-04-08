<template>
    <div class="my-volunteer-schedule-contacts-overlay">
        <div class="grid-container">
            <h2 class="site-takeover__title site-takeover__title--large">
                Volunteer Contacts
            </h2>
            <p class="my-volunteer-schedule-contacts-overlay__lead">
                <span>Refer to the contacts below for competition related questions. For assistance with EMS, contact</span>
                <a :href="product_support_link"
                   title="Open product support form"
                   class="standard-link">
                    <span>Product Support through EMS</span>
                </a>
                <span>or email</span>
                <span><a class="standard-link"
                         title="Email product support"
                         href="mailto:productsupport@usfigureskating.org">
                    <span>Product Support</span>
                </a>.</span>
            </p>
            <div class="my-volunteer-schedule-contacts-overlay__content">
                <div class="panel-list">
                    <div v-for="(contact,index) in contacts"
                         :key="index"
                         class="panel-list__item">
                        <div class="competition-contact">
                            <div class="competition-contact__person">
                                <span class="competition-contact__title">
                                    {{contact.role}}:
                                </span>
                                <span class="competition-contact__name">
                                    {{contact.name}}
                                </span>
                            </div>
                            <div class="competition-contact__email">
                                <a class="standard-link"
                                   :title="contact | link_title"
                                   :href="`mailto:${contact.email}`">{{contact.email}}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {CompetitionContact} from '../../../../../../contracts/AppContracts';
    import {CompetitionPortalVolunteer} from '../../../../_contracts';

    export default Vue.extend({
        filters: {
            /**
             * Create a link title attribute from a contact
             */
            link_title: function (contact: CompetitionContact) {
                return `Email ${contact.name} at ${contact.email}`;
            }
        },
        computed: {
            /**
             * List of contacts for display
             */
            contacts: function (): CompetitionContact[] {
                return this.$store.state.competition_portal.volunteer.contacts;
            },
            /**
             * Link target for product support form
             */
            product_support_link: function (): string {
                const links: CompetitionPortalVolunteer.MyVolunteerScheduleLinks = this.$store.state.competition_portal.volunteer.links;

                return links.product_support;
            }
        }
    });
</script>