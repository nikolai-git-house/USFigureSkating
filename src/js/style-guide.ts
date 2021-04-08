/* eslint-disable */
import "./bootstrap";
import Vue from "vue";
import SiteHeader from "./components/SiteHeader.vue";
import store from './store'
import {SessionDataAdaptor} from "./adaptors/SessionDataAdaptor";
import {Music} from "./models/Music/Music";
import MusicItem from "./pages/Music/MusicItem.vue";
import StepsIndicator from "./components/StepsIndicator.vue";
import AutoSuggest from "./components/AutoSuggest.vue";
import ProgressBar from "./components/ProgressBar.vue";
import CompetitionTile from "./components/CompetitionTile/CompetitionTile.vue";
import EntityComplianceRequirementsSummary from "./AdminPortal/_components/EntityComplianceRequirementsSummary.vue";
import {PracticeIceData} from "./contracts/data/DataContracts";
import CompetitionVolunteerCta from "./components/CompetitionVolunteerCTA/CompetitionVolunteerCta.vue"
import SeriesPageHeader from './SeriesRegistration/_components/SeriesPageHeader.vue';
new Vue({
    el: "#app",
    store,
    components: {
        SiteHeader,
        "music-item": MusicItem,
        StepsIndicator,
        ProgressBar,
        AutoSuggest,
        CompetitionTile,
        EntityComplianceRequirementsSummary,
        CompetitionVolunteerCta,
        SeriesPageHeader,
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
                }
            },
            mounted: function () {
                (<any>this).playIcon();
            },
            methods: {
                toggle: function () {
                    (<any>this).show_icon = false;
                    this.$nextTick(() => {
                        (<any>this).show_icon = true;
                        this.$nextTick(() => {
                            (<any>this).playIcon();
                        })
                    })
                },
                playIcon: function () {
                    const vNode: any = this.$children[0];
                    if (vNode && typeof vNode.play === 'function') {
                        vNode.play()
                    }
                }
            }
        }
    },
    data: {
        autosuggest_options: [
            {
                "value": "ORG00000108",
                "label": "Michiana FSC, Inc (1483)"
            },
            {
                "value": "ORG00000264",
                "label": "Front Range FSC (1830)"
            },
            {
                "value": "ORG00000344",
                "label": "Skatium FSC (2136)"
            },
            {
                "value": "ORG00000411",
                "label": "The FSC of Texas, Inc. (2272)"
            },
            {
                "value": "ORG00000456",
                "label": "Berkley Royal Blades FSC (240)"
            },
            {
                "value": "ORG00000711",
                "label": "City of Ames-DELETED (4181)"
            },
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
                type_code: 'WU',
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
            },
        ],
        extended_session: SessionDataAdaptor.adaptScheduled({
            scheduled_as: "upi",
            scheduled_event_id: 1,
            session: {
                name: "Practice Ice (IL + IP)",
                time_start: 1563811800,
                date: 1563775200,
                time_end: 1563813300,
                slots_registered: 6,
                slots_available: 15,
                type_key: "practice_ice",
                location: "Location Name",
                id: 10,
                rink_id: 1,
                rink: {
                    id: 1,
                    name: "OLY",
                    facility_id: 1,
                    facility: {
                        name: "Broadmoor World Arena",
                        id: 1
                    }
                },
                utc_timezone_offset: 360,
                event_ids: [
                    1,
                    2
                ],
                practice_ice_types: [
                    "upi",
                    "opi"
                ]
            } as PracticeIceData
        }),
        cart_session: ({
            session: {
                id: 1,
                "name": "Practice Ice",
                "time_start": new Date("March 21, 2018 8:15:00"),
                "date": new Date("March 21, 2018 00:00:00"),
                "time_end": "March 21, 2018 8:45:00",
                "slots_registered": 6,
                "slots_available": 15,
                "type_key": "practice_ice",
                "practice_ice_types": [
                    "upi",
                    "opi"
                ],
                pretty_time_start: '8:15',
                time_start_meridian: 'AM',
                rink: {
                    name: "OLY"
                }
            },
            cost: 35,
            competition_id: 1,
            competition_name: "2018 Test Competition",
            scheduled_event_name: "Individual Ladies",
            scheduled_as: 'upi',
            scheduled_event_id: 1
        }),
        music_item: new Music({
            has_been_played: false,
            name: "Maid with the Flaxen Hair",
            copyrights: [],
            file: {
                // @downstream-sync 2020-07-02 - downstream music items have id:string typing
                id: "1",
                url: "/example-music/MaidWithTheFlaxenHair.mp3",
            },
            active_copyright_context_id: 1,
        })

    },
    created: function () {
        this.$store.dispatch('cart/fetchCart');
    }
});