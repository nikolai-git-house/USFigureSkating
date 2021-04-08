/* eslint-disable max-lines */
import './bootstrap';
import Vue from 'vue';
import SiteHeader from './components/SiteHeader.vue';
import store from './store';
import {SessionDataAdaptor} from './adaptors/SessionDataAdaptor';
import {Music} from './models/Music/Music';
import MusicItem from './pages/Music/MusicItem.vue';
import StepsIndicator from './components/StepsIndicator.vue';
import AutoSuggest from './components/AutoSuggest.vue';
import ProgressBar from './components/ProgressBar.vue';
import CompetitionTile from './components/CompetitionTile/CompetitionTile.vue';
import EntityComplianceRequirementsSummary from './AdminPortal/_components/EntityComplianceRequirementsSummary.vue';
import {PracticeIceData} from './contracts/data/DataContracts';
import CompetitionVolunteerCta from './components/CompetitionVolunteerCTA/CompetitionVolunteerCta.vue';
import SeriesPageHeader from './SeriesRegistration/_components/SeriesPageHeader.vue';
import {PageEntityHeaderComponentEntity} from './components/_contracts/PageEntityHeaderComponentContracts';
import {CompetitionHeadingSource} from './contracts/AppContracts';
import {DATA_NAVIGATION_LINK_ITEMS} from './constants/ComponentGuideConstants';
import {CompetitionPortalPageHeadingBinding} from './CompetitionPortal/_components/_contracts';
import {MyVolunteerScheduleShiftCard} from './CompetitionPortal/Volunteers/_pages/MySchedule/_components';
import {ShiftSelectionShiftCard} from './CompetitionPortal/Volunteers/_pages/ShiftSelection/_components';

// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    store,
    components: {
        SiteHeader,
        'music-item': MusicItem,
        StepsIndicator,
        ProgressBar,
        AutoSuggest,
        CompetitionTile,
        EntityComplianceRequirementsSummary,
        CompetitionVolunteerCta,
        SeriesPageHeader,
        MyVolunteerScheduleShiftCard,
        ShiftSelectionShiftCard,
        'admin-animated-icon': {
            template: `
                <div>
                    <slot :show_icon="show_icon"></slot>
                    <div style="margin-top:3rem;text-align: center;">
                        <button class="button button--small"
                                @click="toggle">Play
                        </button>
                    </div>
                </div>
            `,
            data: function () {
                return {
                    show_icon: true
                };
            },
            mounted: function () {
                const self = this as any;
                self.playIcon();
            },
            methods: {
                toggle: function () {
                    const self = this as any;
                    self.show_icon = false;
                    this.$nextTick(() => {
                        self.show_icon = true;
                        this.$nextTick(() => {
                            self.playIcon();
                        });
                    });
                },
                playIcon: function () {
                    const vNode: any = this.$children[0];
                    if (vNode && typeof vNode.play === 'function') {
                        vNode.play();
                    }
                }
            }
        }
    },
    data: {
        accordion_multiselect1: {
            default: []
        },
        accordion_multiselect2: {
            default: [],
            default2: []
        },
        data_navigation_items: DATA_NAVIGATION_LINK_ITEMS,
        autosuggest_options: [
            {
                'value': 'ORG00000108',
                'label': 'Michiana FSC, Inc (1483)'
            },
            {
                'value': 'ORG00000264',
                'label': 'Front Range FSC (1830)'
            },
            {
                'value': 'ORG00000344',
                'label': 'Skatium FSC (2136)'
            },
            {
                'value': 'ORG00000411',
                'label': 'The FSC of Texas, Inc. (2272)'
            },
            {
                'value': 'ORG00000456',
                'label': 'Berkley Royal Blades FSC (240)'
            },
            {
                'value': 'ORG00000711',
                'label': 'City of Ames-DELETED (4181)'
            }
        ],
        individual_sessions: [
            {
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                pretty_time_end: '8:45',
                time_end_meridian: 'AM',
                name: 'Practice Ice - Intermediate',
                slots_registered: 6,
                slots_available: 15,
                is_event: false,
                is_resurface: false,
                type_code: 'UPI/OPI'
            },
            {
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                pretty_time_end: '8:45',
                time_end_meridian: 'AM',
                name: 'Resurface',
                slots_registered: 0,
                slots_available: 0,
                is_event: false,
                is_resurface: true,
                type_code: 'UPI/OPI'
            },
            {
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                pretty_time_end: '8:45',
                time_end_meridian: 'AM',
                name: 'Senior Ladies S - Group B (15)',
                slots_registered: 6,
                slots_available: 15,
                is_event: true,
                icon_class: 'session__icon--ladies'
            },
            {
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                pretty_time_end: '8:45',
                time_end_meridian: 'AM',
                name: 'Senior Mens S - Group B (15)',
                slots_registered: 6,
                slots_available: 15,
                is_event: true,
                icon_class: 'session__icon--mens'
            },
            {
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                pretty_time_end: '8:45',
                time_end_meridian: 'AM',
                name: 'Senior Mens S - Practice Ice',
                slots_registered: 6,
                slots_available: 15,
                is_event: false,
                icon_class: 'session__icon--mens',
                type_code: 'UPI/OPI',
                scheduled: true
            },
            {
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                pretty_time_end: '8:45',
                time_end_meridian: 'AM',
                name: 'Senior Mens S - Practice Ice',
                slots_registered: 6,
                slots_available: 15,
                is_event: false,
                icon_class: 'session__icon--mens',
                type_code: 'UPI/OPI',
                in_cart: true
            }
        ],
        list_sessions: [
            {
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                pretty_time_end: '8:45',
                time_end_meridian: 'AM',
                name: 'Practice Ice - Intermediate',
                slots_registered: 6,
                slots_available: 15,
                is_event: false,
                is_resurface: false,
                type_code: 'UPI/OPI'
            },
            {
                pretty_time_start: '10:00',
                time_start_meridian: 'AM',
                pretty_time_end: '10:30',
                time_end_meridian: 'AM',
                name: 'Practice Ice - Intermediate',
                slots_registered: 4,
                slots_available: 15,
                is_event: false,
                is_resurface: false,
                type_code: 'OPI',
                in_cart: true
            },
            {
                pretty_time_start: '1:45',
                time_start_meridian: 'PM',
                pretty_time_end: '2:30',
                time_end_meridian: 'PM',
                name: 'Senior Ladies S - Warm Up',
                slots_registered: 0,
                slots_available: 15,
                is_event: false,
                is_resurface: false,
                type_code: 'WU'
            },
            {
                pretty_time_start: '2:45',
                time_start_meridian: 'PM',
                pretty_time_end: '3:45',
                time_end_meridian: 'PM',
                name: 'Senior Ladies S - Group B (15)',
                slots_registered: 14,
                slots_available: 15,
                is_event: true,
                icon_class: 'session__icon--ladies',
                scheduled: true
            },
            {
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                pretty_time_end: '8:45',
                time_end_meridian: 'AM',
                name: 'Senior Mens S - Practice Ice',
                slots_registered: 6,
                slots_available: 15,
                type_code: 'UPI/OPI',
                scheduled: true
            },
            {
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                pretty_time_end: '8:45',
                time_end_meridian: 'AM',
                name: 'Senior Mens S - Practice Ice',
                slots_registered: 6,
                slots_available: 15,
                type_code: 'UPI/OPI',
                in_cart: true
            }
        ],
        extended_session: SessionDataAdaptor.adaptScheduled({
            scheduled_as: 'upi',
            scheduled_event_id: 1,
            session: {
                name: 'Practice Ice (IL + IP)',
                time_start: 1563811800,
                date: 1563775200,
                time_end: 1563813300,
                slots_registered: 6,
                slots_available: 15,
                type_key: 'practice_ice',
                location: 'Location Name',
                id: 10,
                rink_id: 1,
                rink: {
                    id: 1,
                    name: 'OLY',
                    facility_id: 1,
                    facility: {
                        name: 'Broadmoor World Arena',
                        id: 1
                    }
                },
                utc_timezone_offset: 360,
                event_ids: [
                    1,
                    2
                ],
                practice_ice_types: [
                    'upi',
                    'opi'
                ]
            } as PracticeIceData
        }),
        cart_session: {
            session: {
                id: 1,
                'name': 'Practice Ice',
                'time_start': new Date('March 21, 2018 8:15:00'),
                'date': new Date('March 21, 2018 00:00:00'),
                'time_end': 'March 21, 2018 8:45:00',
                'slots_registered': 6,
                'slots_available': 15,
                'type_key': 'practice_ice',
                'practice_ice_types': [
                    'upi',
                    'opi'
                ],
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                rink: {
                    name: 'OLY'
                }
            },
            cost: 35,
            competition_id: 1,
            competition_name: '2018 Test Competition',
            scheduled_event_name: 'Individual Ladies',
            scheduled_as: 'upi',
            scheduled_event_id: 1
        },
        music_item: new Music({
            has_been_played: false,
            name: 'Maid with the Flaxen Hair',
            copyrights: [],
            file: {
                // @downstream-sync 2020-07-02 - downstream music items have id:string typing
                id: '1',
                url: '/example-music/MaidWithTheFlaxenHair.mp3'
            },
            active_copyright_context_id: 1
        }),
        templates: {
            page_entity_header: <PageEntityHeaderComponentEntity>{
                name: 'Denver Synchronicity of Colorado - Synchro Skills 1',
                compliance: {
                    status_description: 'Not Complete',
                    status_key: 'alert',
                    link: {
                        url: 'https://placehold.it/320x240',
                        is_new_tab: false
                    }
                }
            },
            page_entity_header_compliance: <PageEntityHeaderComponentEntity>{
                compliance: {
                    status_description: 'Complete',
                    status_key: 'success',
                    link: {
                        url: 'https://placehold.it/320x240',
                        is_new_tab: false
                    },
                    supporting_description: {
                        text: 'Valid Through: 10/2/2020',
                        type_key: 'success'
                    },
                    role_items: [
                        {
                            'role': 'Coach',
                            'items': [
                                {
                                    name: 'Membership',
                                    complete: true,
                                    is_membership: true,
                                    membership_expiration_date_formatted: '2/21/2020'
                                },
                                {
                                    name: 'SafeSport Training',
                                    complete: true
                                },
                                {
                                    name: 'Background Check',
                                    complete: true
                                },
                                {
                                    name: 'Coach Code of Ethics',
                                    complete: true
                                },
                                {
                                    name: 'Coach Education Requirements (CER)',
                                    complete: true
                                },
                                {
                                    name: 'Liability Insurance',
                                    complete: true
                                },
                                {
                                    name: 'Waivers and Release',
                                    complete: true
                                },
                                {
                                    name: 'Medical Consent',
                                    complete: true
                                },
                                {
                                    name: 'Name and Likeness Release',
                                    complete: true
                                },
                                {
                                    name: 'PSA Membership',
                                    complete: true
                                }
                            ]
                        },
                        {
                            'role': 'Mandatory Athlete (Skater)',
                            'items': [
                                {
                                    name: 'Membership',
                                    complete: true,
                                    is_membership: true,
                                    membership_expiration_date_formatted: '2/21/2020'
                                },
                                {
                                    name: 'SafeSport Training',
                                    complete: false
                                }
                            ]
                        },
                        {
                            'role': 'Volunteer',
                            'items': [
                                {
                                    name: 'SafeSport Training',
                                    complete: true
                                },
                                {
                                    name: 'Background Check',
                                    complete: true
                                }
                            ]
                        }
                    ]
                }
            },
            competition_heading: <CompetitionHeadingSource>{
                id: 1,
                name: '2018 Test Competition',
                start_date_pretty: '7/21/2019',
                end_date_pretty: '9/22/2019',
                icon: '/images/2018-MW-Adult.png',
                directions: [],
                announcement_url: null,
                website_url: null
            }
        },
        status_summary_items: [
            {
                complete: true,
                overridden: false,
                name: 'Coach Code of Ethics'
            },
            {
                complete: false,
                overridden: false,
                name: 'Background Check'
            },
            {
                complete: true,
                overridden: false,
                name: 'Membership'
            },
            {
                complete: true,
                overridden: false,
                name: 'CER'
            },
            {
                complete: false,
                overridden: false,
                name: 'Liability Insurance'
            },
            {
                complete: false,
                overridden: false,
                name: 'PSA'
            },
            {
                complete: false,
                overridden: false,
                name: 'SafeSport'
            }
        ]

    },
    computed: {
        competition_heading_full: function (): CompetitionHeadingSource {
            return {
                ...this.templates.competition_heading,
                directions: [
                    {
                        location_name: 'Great Park Ice',
                        link: 'https://www.google.com/maps/dir//maps+Great+Park+Ice/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x80dcc3626e80b181:0x13ed30cbfcdd99c3?sa=X&ved=2ahUKEwj55PrA7d_kAhVRop4KHcQ7DzgQ9RcwFHoECA8QEA'
                    }
                ],
                announcement_url: 'https://placehold.it/720x480&text=Announcement+PDF+Document',
                website_url: 'https://placehold.it/720x480&text=Competition+Website'
            };
        },
        page_entity_header_compliance_singular: function () {
            const base = {...this.templates.page_entity_header_compliance};
            // @ts-ignore
            const role_items = [base.compliance.role_items[1]];
            // @ts-ignore
            base.compliance = {
                ...base.compliance,
                role_items
            };

            return base;
        },
        competition_portal_header(): CompetitionPortalPageHeadingBinding {
            return {
                entity: this.templates.page_entity_header,
                competition: this.competition_heading_full
            };
        }
    },
    created: function () {
        this.$store.dispatch('cart/fetchCart');
    }
});