<template>
    <page class="page page-competition-contacts"
          :header="page_header">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="competition-heading"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading competition contacts."></component-loader>
        <div slot="header-content"
             class="page-heading__intro">
            <p>
                As you have questions regarding the competition, below are the positions, names and emails of the
                individuals to contact. For questions regarding rules of the competition or questions not answered by
                the above persons first, you may contact the Chief Referee. Refer to the contacts below for competition
                related questions. For assistance with using EMS, refer to the EMS Support Form or email
                <span>
                    <a class="standard-link"
                       href="mailto:productsupport@usfigureskating.org">Product Support</a>.
                </span>
            </p>
        </div>
        <div slot="content"
             class="page__content page__content--no-top-pad">
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
                               :title="contactLinkTitle(contact)"
                               :href="`mailto:${contact.email}`">{{contact.email}}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </page>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {CompetitionContact} from '../../contracts/AppContracts';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import {CompetitionPortalPageMixin} from '../_mixins';

    const vueClass = mixins(HasDataDependencies, CompetitionPortalPageMixin);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for component
                 */
                dependencies: {
                    /**
                     * Competition Contacts data
                     */
                    contacts: false
                },
                page_title: 'Competition Contacts'

            };
        },
        computed: {
            /**
             * The set of competition contacts
             */
            contacts: function (): CompetitionContact[] {
                return this.$store.state.competition_portal.competition_contacts;
            }
        },
        methods: {
            /**
             * Title attribute for contact email link
             */
            contactLinkTitle: function (contact: CompetitionContact) {
                return `Email ${contact.name} at ${contact.email}`;
            },
            /**
             * Load dependencies. HasDataDependencies hook
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchCompetitionContacts')
                        .then(() => {
                            this.dependencies.contacts = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            }
        }
    });
</script>