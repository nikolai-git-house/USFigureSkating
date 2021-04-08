<!--eslint-disable-->
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1">
    <meta http-equiv="X-UA-Compatible"
          content="ie=edge">
    <title>USFS Mobile EMS - Components</title>
    <link rel="stylesheet"
          href="<?php echo mix('/css/style-guide.css') ?>"/>
</head>
<body>
<div id="app">
    <div class="style-guide">
        <div class="style-guide__page-heading">
            <h1>Components Guide</h1>
        </div>
        <!--        <section class="style-guide__section">-->
        <!--            <div class="style-guide__section-heading">-->
        <!--                <h2 class="style-guide__section-heading-text">Section</h2>-->
        <!--            </div>-->
        <!--            <div class="style-guide__section-content">-->
        <!--                Section content-->
        <!--            </div>-->
        <!--        </section>-->
        <section class="style-guide__section"
                 style="background-color:#F3F3F3;">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Volunteer Shift Cards</h2>
            </div>
            <div class="style-guide__section-content">
                <h2>My Schedule Card</h2>
                <my-volunteer-schedule-shift-card

                        compliance_link_target="#"
                        :user_is_compliant="true"
                        :shift="{
                            start_time_formatted: '6:00 AM',
                            end_time_formatted: '8:00 AM',
                            position_title: 'Shift Position Title',
                            location_name: 'Location Name 1',
                            is_approved: true,
                            is_pending: false,
                            requires_compliance: true,
                            total_positions: 10,
                            open_positions: 2,
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem ipsum dolor sit.',
                            openings_status: 'success'
                          }"></my-volunteer-schedule-shift-card>
                <hr>
                <my-volunteer-schedule-shift-card

                        compliance_link_target="#"
                        :user_is_compliant="false"
                        :shift="{
                            start_time_formatted: '6:00 AM',
                            end_time_formatted: '8:00 AM',
                            position_title: 'Shift Position Title',
                            location_name: 'Location Name 1',
                            is_approved: false,
                            is_pending: true,
                            requires_compliance: false,
                            total_positions: 10,
                            open_positions: 2,
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem ipsum dolor sit.',
                            openings_status: 'success'
                          }"></my-volunteer-schedule-shift-card>
                <hr>
                <my-volunteer-schedule-shift-card

                        compliance_link_target="#"
                        :user_is_compliant="false"
                        :shift="{
                            start_time_formatted: '6:00 AM',
                            end_time_formatted: '8:00 AM',
                            position_title: 'Shift Position Title',
                            location_name: 'Location Name 1',
                            is_approved: false,
                            is_pending: true,
                            requires_compliance: true,
                            total_positions: 10,
                            open_positions: 2,
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem ipsum dolor sit.',
                            openings_status: 'success'
                          }"></my-volunteer-schedule-shift-card>
                <h2>Shift Selection Card</h2>
                <shift-selection-shift-card :shift="{
                            start_time_formatted: '6:00 AM',
                            end_time_formatted: '8:00 AM',
                            position_title: 'Shift Position Title',
                            requires_compliance: false,
                            location_name: 'Location Name 1',
                            openings_status: 'success',
                            open_positions: 2,
                            total_positions: 10,
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem.',
                            status: 'approved'
                          }"
                                            :shift_has_conflict="false"
                                            :user_is_compliant="true"></shift-selection-shift-card>
                <hr>
                <shift-selection-shift-card :shift="{
                            start_time_formatted: '6:00 AM',
                            end_time_formatted: '8:00 AM',
                            position_title: 'Shift Position Title',
                            requires_compliance: true,
                            location_name: 'Location Name 1',
                            openings_status: 'success',
                            open_positions: 2,
                            total_positions: 10,
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem.',
                            status: 'pending'
                          }"
                                            :shift_has_conflict="false"
                                            :user_is_compliant="true"></shift-selection-shift-card>
                <hr>
                <shift-selection-shift-card :shift="{
                            start_time_formatted: '6:00 AM',
                            end_time_formatted: '8:00 AM',
                            position_title: 'Shift Position Title',
                            requires_compliance: false,
                            location_name: 'Location Name 1',
                            openings_status: 'success',
                            open_positions: 2,
                            total_positions: 10,
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem.',
                            status: 'pending'
                          }"
                                            :shift_has_conflict="false"
                                            :user_is_compliant="true"></shift-selection-shift-card>

                <hr>
                <shift-selection-shift-card :shift="{
                            start_time_formatted: '6:00 AM',
                            end_time_formatted: '8:00 AM',
                            position_title: 'Shift Position Title',
                            requires_compliance: false,
                            location_name: 'Location Name 1',
                            openings_status: 'success',
                            open_positions: 2,
                            total_positions: 10,
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem.',
                            status: 'new'
                          }"
                                            :shift_has_conflict="false"
                                            :user_is_compliant="true"></shift-selection-shift-card>
                <hr>
                <shift-selection-shift-card :shift="{
                            start_time_formatted: '6:00 AM',
                            end_time_formatted: '8:00 AM',
                            position_title: 'Shift Position Title',
                            requires_compliance: false,
                            location_name: 'Location Name 1',
                            openings_status: 'success',
                            open_positions: 2,
                            total_positions: 10,
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, Lorem.',
                            status: 'new'
                          }"
                                            :shift_has_conflict="true"
                                            :user_is_compliant="true"></shift-selection-shift-card>

            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Accordion Multiselect</h2>
            </div>
            <div class="style-guide__section-content">
                <accordion-multiselect :options="{
                                                default:{
                                                    options:[
                                                        {
                                                            label:'Option 1',
                                                            value:1,
                                                        },
                                                        {
                                                            label:'Option 2',
                                                            value:2,
                                                        }
                                                    ]
                                                }
                                            }"
                                       v-model="accordion_multiselect1"
                                       select_title="Select a Value"></accordion-multiselect>
                <br>
                <accordion-multiselect :options="{
                                                default:{
                                                    options:[
                                                        {
                                                            label:'Option 1',
                                                            value:1,
                                                        },
                                                        {
                                                            label:'Option 2',
                                                            value:2,
                                                        }
                                                    ]
                                                },
                                                default2:{
                                                    options:[
                                                        {
                                                            label:'Option 1',
                                                            value:1,
                                                        },
                                                        {
                                                            label:'Option 2',
                                                            value:2,
                                                        }
                                                    ]
                                                }
                                            }"
                                       v-model="accordion_multiselect2"
                                       select_title="Select a Value"></accordion-multiselect>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Data Navigation Link</h2>
            </div>
            <div class="style-guide__section-content">
                <data-navigation-link v-for="item in data_navigation_items" :link="item"></data-navigation-link>
            </div>
        </section>

        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Status Summary</h2>
            </div>
            <div class="style-guide__section-content">
                <h3>Standard</h3>
                <status-summary :status_items="status_summary_items"></status-summary>
                <h3>With Columns</h3>
                <status-summary class="status-summary--with-columns" :status_items="status_summary_items"></status-summary>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Competition Heading</h2>
            </div>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <h3 class="grid-container">With Links</h3>
                <competition-heading :competition_override="competition_heading_full"></competition-heading>
                <h3 class="grid-container">Without Links</h3>
                <competition-heading :competition_override="{
                        ...competition_heading_full,
                        directions:[],
                        announcement_url:null,
                        website_url:null
                        }"></competition-heading>

                <h3 class="grid-container">Team Registration (Full)</h3>
                <div class="team-registration-header">
                    <competition-heading :always_show="true"
                                         :competition_override="{
                                                start_date_pretty: '8/30/2020',
                                                end_date_pretty: '9/2/2020',
                                                links: {
                                                    cart: '/pages/competition-registration-teams/24/cart'
                                                },
                                                icon: '/images/competition-icon.png',
                                                id: 24,
                                                name: 'Late Registration Open'
                                          }"></competition-heading>
                    <page-entity-header entity_name="Denver Synchronicity of Colorado - Synchro Skills 1"></page-entity-header>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Competition Portal Page Heading</h2>
            </div>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <h3 class="grid-container">Without Entity</h3>
                <competition-portal-page-heading v-bind="{
                ...competition_portal_header,
                entity:null
                }"></competition-portal-page-heading>
                <h3 class="grid-container">With Entity</h3>
                <competition-portal-page-heading v-bind="competition_portal_header"></competition-portal-page-heading>
                <h3 class="grid-container">With Entity Without Links</h3>
                <competition-portal-page-heading v-bind="{
                ...competition_portal_header,
                competition:{
                ...competition_portal_header.competition,
                  directions:[],
                        announcement_url:null,
                        website_url:null
                }
                }"></competition-portal-page-heading>
                <h3 class="grid-container">With Entity Without Entity Name</h3>
                <competition-portal-page-heading v-bind="{
                entity:{
                ...competition_portal_header.entity,
                name:null
                },
                competition:{
                ...competition_portal_header.competition,
                  directions:[],
                        announcement_url:null,
                        website_url:null
                }
                }"></competition-portal-page-heading>
                <h3 class="grid-container">With Compliance Items</h3>
                <competition-portal-page-heading v-bind="{
                entity:{
                ...page_entity_header_compliance_singular,
                name:null
                },
                competition:{
                ...competition_portal_header.competition,
                  directions:[],
                        announcement_url:null,
                        website_url:null
                }
                }"></competition-portal-page-heading>
                <h3 class="grid-container">With Compliance Items (Multirole)</h3>
                <competition-portal-page-heading v-bind="{
                entity:{
                ...templates.page_entity_header_compliance,
                name:null
                },
                competition:{
                ...competition_portal_header.competition,
                  directions:[],
                        announcement_url:null,
                        website_url:null
                }
                }"></competition-portal-page-heading>

            </div>
        </section>

        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Page Entity Header</h2>
            </div>
            <h2 class="grid-container">Simple Version</h2>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <page-entity-header entity_name="Denver Synchronicity of Colorado - Synchro Skills 1"></page-entity-header>
            </div>
            <h2 class="grid-container">With Compliance (linked)</h2>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <page-entity-header :entity="templates.page_entity_header"></page-entity-header>
            </div>
            <h2 class="grid-container">Participant Compliance</h2>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <page-entity-header :entity="page_entity_header_compliance_singular"></page-entity-header>
            </div>
            <h2 class="grid-container">Participant Compliance (All Roles)</h2>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <page-entity-header :entity="templates.page_entity_header_compliance"></page-entity-header>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Animated Icons</h2>
            </div>
            <div class="style-guide__section-content">
                <h2>Animated Check Icon</h2>
                <admin-animated-icon>
                    <div slot-scope="{show_icon}">
                        <animated-check-icon v-if="show_icon"></animated-check-icon>
                    </div>
                </admin-animated-icon>
                <h2>Animated Saving Icon</h2>
                <animated-saving-icon></animated-saving-icon>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Music Item</h2>
            </div>
            <div class="style-guide__section-content">
                <music-item class="music-item--standalone"
                            :music="music_item"></music-item>
            </div>
        </section>

        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Forms</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="form-group">
                    <label class="field-label"
                           for="example-extended-date">Extended Date Input
                    </label>
                    <date-input-extended id="example-extended-date"
                                         class="form-field"></date-input-extended>
                </div>
                <div class="form-group">
                    <label class="field-label"
                           for="">Unrestricted AutoSuggest
                    </label>
                    <auto-suggest :restricted="false"
                                  :options="autosuggest_options"
                                  :input_attrs="{class:['form-field'],type:'text'}"></auto-suggest>
                </div>
                <div class="form-group">
                    <label class="field-label"
                           for="">Restricted AutoSuggest
                    </label>
                    <auto-suggest :restricted="true"
                                  :options="autosuggest_options"
                                  :input_attrs="{class:['form-field'],type:'text'}"></auto-suggest>
                </div>

                <div class="form-group">
                    <label class="field-label"
                           for="">Input Style Accordion
                    </label>
                    <accordion class="accordion--select">
                        <span slot="trigger_text">Toggle Trigger</span>
                        <div slot="expand_content"
                             class="">
                            this is the expand content
                        </div>
                    </accordion>
                </div>
                <div class="form-group">
                    <label class="field-label"
                           for="">Increment Input
                    </label>
                    <!--    include :min="" or :initial="" attributes to configure minimum and starting values -->
                    <increment-input inline-template>
                        <div class="increment-input">
                            <div class="increment-input__block">
                                <button class="button increment-input__remove"
                                        v-on:click.prevent="decrement"
                                        :disabled="value<=min"
                                        type="button">
                                    -
                                </button>
                            </div>
                            <div class="increment-input__block">
                                <input v-number-input
                                       class="form-field"
                                       type="text"
                                       v-bind="attrs"
                                       v-model="value">
                            </div>
                            <div class="increment-input__block">
                                <button class="button increment-input__add"
                                        v-on:click.prevent="increment"
                                        type="button">
                                    +
                                </button>
                            </div>
                        </div>
                    </increment-input>
                </div>
                <div class="form-group">
                    <label class="field-label"
                           for="">Increment Input --Small
                    </label>
                    <!--    include :min="" or :initial="" attributes to configure minimum and starting values -->
                    <increment-input inline-template>
                        <div class="increment-input increment-input--small">
                            <div class="increment-input__block">
                                <button class="button increment-input__remove"
                                        v-on:click.prevent="decrement"
                                        :disabled="value<=min"
                                        type="button">
                                    -
                                </button>
                            </div>
                            <div class="increment-input__block">
                                <input v-number-input
                                       class="form-field"
                                       type="text"
                                       v-bind="attrs"
                                       v-model="value">
                            </div>
                            <div class="increment-input__block">
                                <button class="button increment-input__add"
                                        v-on:click.prevent="increment"
                                        type="button">
                                    +
                                </button>
                            </div>
                        </div>
                    </increment-input>
                </div>
                <div class="form-group">
                    <h3>Parented Checkbox Group</h3>
                    <parented-checkbox-group :options="[
                        {
                            label:'Label 1',
                            value:'value1'
                        },
                        {
                            label:'Label 2',
                            value:'value2'
                        },
                        {
                            label:'Label 3',
                            value:'value3'
                        }
                    ]"></parented-checkbox-group>
                    <h3>Parented Checkbox Group
                        <small>With Configured All Suffix</small>
                    </h3>
                    <parented-checkbox-group all_suffix="Options"
                                             :options="[
                        {
                            label:'Label 1',
                            value:'value1'
                        },
                        {
                            label:'Label 2',
                            value:'value2'
                        },
                        {
                            label:'Label 3',
                            value:'value3'
                        }
                    ]"></parented-checkbox-group>
                    <h3>Parented Checkbox Group
                        <small>--small variant</small>
                    </h3>
                    <parented-checkbox-group class="parented-checkbox-group--small"
                                             :options="[
                        {
                            label:'Label 1',
                            value:'value1'
                        },
                        {
                            label:'Label 2',
                            value:'value2'
                        },
                        {
                            label:'Label 3',
                            value:'value3'
                        }
                    ]">
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Tabs</h2>
            </div>
            <div class="style-guide__section-content">
                <tabs>
                    <tab name="Tab Name 1"
                         :selected="true">
                        tab content 1
                    </tab>
                    <tab name="Tab Name 2">
                        tab content 2
                    </tab>
                </tabs>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Tabs - Reduced</h2>
            </div>
            <div class="style-guide__section-content">
                <tabs class="tabs--reduced">
                    <tab name="Tab Name 1"
                         :selected="true">
                        tab content 1
                    </tab>
                    <tab name="Tab Name 2">
                        tab content 2
                    </tab>
                </tabs>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Tabs - Justified</h2>
            </div>
            <div class="style-guide__section-content">
                <tabs class="tabs--justified">
                    <tab name="Tab Name 1"
                         :selected="true">
                        tab content 1
                    </tab>
                    <tab name="Tab Name 2">
                        tab content 2
                    </tab>
                </tabs>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Accordion</h2>
            </div>
            <div class="style-guide__section-content">
                <accordion>
                    <span slot="trigger_text">Trigger Text</span>
                    <div slot="expand_content">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur beatae cupiditate
                            dolorum error harum libero nihil optio velit! Ab esse hic iure molestias quo ut? Dolore
                            labore laboriosam quas temporibus?
                        </p>
                    </div>
                </accordion>
                <accordion class="accordion--info accordion--info--large">
                    <span slot="trigger_text">Juvenile Combined Dance</span>
                    <div slot="expand_content">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur beatae cupiditate
                            dolorum error harum libero nihil optio velit! Ab esse hic iure molestias quo ut? Dolore
                            labore laboriosam quas temporibus?
                        </p>
                    </div>
                </accordion>
                <div style="background-color:grey; padding:10px;">
                    <accordion class="accordion--large accordion--unpadded-content-h accordion--white-bg-content">
                        <span slot="trigger_text">Large accordion with unpadded horizontal content and white background content</span>
                        <div slot="expand_content">
                            accordion--large accordion--unpadded-content-h accordion--white-bg-content
                        </div>
                    </accordion>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Session</h2>
            </div>
            <div class="style-guide__section-content"
                 style="background-color:#333;padding-top:3rem; padding-bottom:3rem;">
                <div :key="index"
                     v-for="(session,index) in individual_sessions">
                    <standard-session style="background-color:white"
                                      :session="session"
                                      :class="{'session--scheduled':session.scheduled,'session--in-cart':session.in_cart}"></standard-session>
                    <hr>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Session --Extended</h2>
            </div>
            <div class="style-guide__section-content">
                <extended-session :scheduled_session="extended_session"
                                  :session="extended_session.session"></extended-session>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Cart Item</h2>
            </div>
            <div class="style-guide__section-content"
                 style="background-color: rgb(51, 51, 51); padding-top: 3rem; padding-bottom: 3rem;">
                <cart-item :show_remove="true"
                           :item="cart_session"></cart-item>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Cart Overview</h2>
            </div>
            <div class="style-guide__section-content"
                 style="background-color: #e3e3e3;">
                <cart-overview></cart-overview>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Cart Summary</h2>
            </div>
            <div class="style-guide__section-content"
                 style="background-color: #e3e3e3; padding-top: 3rem; padding-bottom: 3rem;">
                <cart-summary :show_remove_item="true"></cart-summary>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Cart Summary List</h2>
            </div>
            <div class="style-guide__section-content">
                <cart-summary class="cart-summary--list"
                              :show_remove_item="false"
                              :show_remove_item="true"></cart-summary>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Steps Indicator</h2>
            </div>
            <div class="style-guide__section-content">
                <steps-indicator :available_step_count="4"
                                 :active_step_number="2"></steps-indicator>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Progress Bar</h2>
            </div>
            <div class="style-guide__section-content">
                <progress-bar :available_step_count="7"
                              :active_step_number="3"></progress-bar>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Page Alerts</h2>
            </div>
            <div class="style-guide__section-content">
                <page-alert style="margin-top:2.5rem"
                            class="page-alert">
                    <div slot="trigger_text">
                        Generic Page Alert
                    </div>
                    <div slot="expand_content">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
                            beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
                            quaerat quod repellat sapiente sit?
                        </p>
                    </div>
                </page-alert>
                <page-alert style="margin-top:2.5rem"
                            class="page-alert page-alert--notice">
                    <div slot="trigger_text">
                        Notice
                    </div>
                    <div slot="expand_content">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
                            beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
                            quaerat quod repellat sapiente sit?
                        </p>
                    </div>
                </page-alert>
                <page-alert style="margin-top:2.5rem"
                            class="page-alert page-alert--medium">
                    <div slot="trigger_text">
                        Medium
                    </div>
                    <div slot="expand_content">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
                            beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
                            quaerat quod repellat sapiente sit?
                        </p>
                    </div>
                </page-alert>
                <page-alert style="margin-top:2.5rem"
                            class="page-alert page-alert--no-icon">
                    <div slot="trigger_text">
                        No Icon
                    </div>
                    <div slot="expand_content">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
                            beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
                            quaerat quod repellat sapiente sit?
                        </p>
                    </div>
                </page-alert>
                <page-alert style="margin-top:2.5rem"
                            class="page-alert page-alert--bleed">
                    <div slot="trigger_text">
                        Bleed (alert toggle bleeds to width of parent)
                    </div>
                    <div slot="expand_content">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
                            beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
                            quaerat quod repellat sapiente sit?
                        </p>
                    </div>
                </page-alert>
                <page-alert style="margin-top:2.5rem"
                            class="page-alert">
                    <div slot="trigger_text">
                        Content
                    </div>
                    <div slot="expand_content">
                        <ul class="page-alert__content__list">
                            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea enim ex facilis
                                incidunt numquam officiis placeat quos, sapiente veritatis voluptatem. Accusantium
                                atque deserunt eaque ex maiores nisi quaerat tempore temporibus!
                            </li>
                            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea enim ex facilis
                                incidunt numquam officiis placeat quos, sapiente veritatis voluptatem. Accusantium
                                atque deserunt eaque ex maiores nisi quaerat tempore temporibus!
                            </li>
                            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea enim ex facilis
                                incidunt numquam officiis placeat quos, sapiente veritatis voluptatem. Accusantium
                                atque deserunt eaque ex maiores nisi quaerat tempore temporibus!
                            </li>
                            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea enim ex facilis
                                incidunt numquam officiis placeat quos, sapiente veritatis voluptatem. Accusantium
                                atque deserunt eaque ex maiores nisi quaerat tempore temporibus!
                            </li>
                        </ul>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
                            beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
                            quaerat quod repellat sapiente sit?
                        </p>
                    </div>
                </page-alert>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Competition Tile (in .competition-tile-list)</h2>
            </div>
            <div class="style-guide__section-content"
                 style="background-color: rgb(51, 51, 51); padding-top: 3rem; padding-bottom: 3rem;">
                <div class="competition-tile-list">
                    <competition-tile :competition="{
                name:'Competition Name',
                icon: '/images/2018-MW-Adult.png',
                start_date:'7/2',
                end_date:'7/6',
                city:'North Shore',
                state:'OH',
                club:'Silver Blades of OH',
                series:null
                }"></competition-tile>
                    <competition-tile :competition="{
                name:'Competition Name',
                icon: '/images/2018-MW-Adult.png',
                start_date:'7/2',
                end_date:'7/6',
                city:'North Shore',
                state:'OH',
                club:'Silver Blades of OH',
                series:[{name:'SDS'}]
                }">
                        <div slot="banners"
                             class="competition-tile__banners">
                            <div class="competition-tile-banner competition-tile-banner--registered">
                                Registered
                            </div>
                            <div class="competition-tile-banner competition-tile-banner--series">
                                SDS
                            </div>
                        </div>
                    </competition-tile>
                    <competition-tile :competition="{
                name:'Competition Name',
                icon: '/images/2018-MW-Adult.png',
                start_date:'7/2',
                end_date:'7/6',
                city:'North Shore',
                state:'OH',
                club:'Silver Blades of OH',
                series:[{name:'SDS'}]
                }">
                        <div slot="drawer"
                             class="competition-tile__drawer">
                            <div class="competition-tile__cta">
                                <a href="#"
                                   class="button button--block">
                                    Register Now
                                </a>
                            </div>
                            <p class="competition-tile__text competition-tile__text--secondary competition-tile__text--alert">
                                Registration deadline: 04/12, 3:00 am
                            </p>
                        </div>
                    </competition-tile>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Entity Compliance Requirements Summary</h2>
            </div>
            <div class="style-guide__section-content">
                <entity-compliance-requirements-summary :compliance_items="[
                    {
                    complete:true,
                    overridden:false,
                    name:'Coach Code of Ethics'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Background Check'},
                    {
                    complete:true,
                    overridden:false,
                    name:'Membership'},
                    {
                    complete:true,
                    overridden:false,
                    name:'CER'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Liability Insurance'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'PSA'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'SafeSport'
                    }
                    ]"></entity-compliance-requirements-summary>
                <h3>Small</h3>
                <entity-compliance-requirements-summary :override_permitted="false"
                                                        class="entity-compliance-requirements-summary--small"
                                                        :compliance_items="[
                    {
                    complete:true,
                    overridden:false,
                    name:'Coach Code of Ethics'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Background Check'},
                    {
                    complete:true,
                    overridden:false,
                    name:'Membership'},
                    {
                    complete:true,
                    overridden:false,
                    name:'CER'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Liability Insurance'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'PSA'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'SafeSport'
                    }
                    ]"></entity-compliance-requirements-summary>
                <h3>Small With Columns</h3>
                <entity-compliance-requirements-summary :override_permitted="false"
                                                        class="entity-compliance-requirements-summary--small entity-compliance-requirements-summary--with-columns"
                                                        :compliance_items="[
                    {
                    complete:true,
                    overridden:false,
                    name:'Coach Code of Ethics'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Background Check'},
                    {
                    complete:true,
                    overridden:false,
                    name:'Membership'},
                    {
                    complete:true,
                    overridden:false,
                    name:'CER'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Liability Insurance'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'PSA'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'SafeSport'
                    }
                    ]"></entity-compliance-requirements-summary>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Status Entity Card</h2>
            </div>
            <div class="style-guide__section-content">
                <div style="background-color:#333;padding:3rem;">
                    <status-entity-card class="status-entity-card--centered" :is_success="false"
                                        :is_invalid="true">
                        <div slot="primary-content">
                            Centered, Version
                            <span class="text--muted">(123456)</span>
                        </div>
                        <status-summary class="status-summary--with-columns"
                                        slot="expand-content"
                                        :status_items="status_summary_items"></status-summary>
                    </status-entity-card>
                </div>

                <div style="background-color:#333;padding:3rem;">
                    <status-entity-card class="status-entity-card--compliance"
                                        :is_success="true">
                        <div slot="primary-content">
                            Lastname, Firstname
                            <span class="text--muted">(12345678)</span>
                        </div>
                        <div slot="secondary-content">
                            <p class="status-entity-card__secondary status-entity-card__secondary--highlight">
                                Team Trainer
                            </p>
                            <ul class="status-entity-card__secondary-list">
                                <li>
                                    <a class="standard-link"
                                       :href="'mailto:test@test.com'">
                                        test@test.com
                                    </a>
                                </li>
                                <li>
                                    <a class="standard-link"
                                       :href="'tel:555-555-5555'">
                                        555-555-5555
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <entity-compliance-requirements-summary slot="expand-content"
                                                                class="entity-compliance-requirements-summary--small entity-compliance-requirements-summary--with-columns"
                                                                :compliance_items="[
                    {
                    complete:true,
                    overridden:false,
                    name:'Coach Code of Ethics'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Background Check'},
                    {
                    complete:true,
                    overridden:false,
                    name:'Membership'},
                    {
                    complete:true,
                    overridden:false,
                    name:'CER'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Liability Insurance'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'PSA'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'SafeSport'
                    }
                    ]"
                                                                :override_permitted="false"></entity-compliance-requirements-summary>
                    </status-entity-card>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Competition Registration CTA</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="card">
                    <competition-registration-cta :competition="{
                        competition_registration_status: 'open',
                        has_registration_deadline_warning: false,
                        registration_deadline: '04/12, 3:00 am',
                        user_registration_link: 'https://placehold.it/320x240&text=text',
                        user_registration_status: 'new'
                }"></competition-registration-cta>
                </div>

                <div class="card">
                    <competition-registration-cta :competition="{
                        competition_registration_status: 'late',
                        has_registration_deadline_warning: true,
                        registration_deadline: '04/12, 3:00 am',
                        user_registration_link: 'https://placehold.it/320x240&text=text',
                        user_registration_status: 'new'
                }"></competition-registration-cta>
                </div>
                <div class="card">
                    <competition-registration-cta :competition="{
                        competition_registration_status: 'open',
                        has_registration_deadline_warning: false,
                        registration_deadline: '04/12, 3:00 am',
                        user_registration_link: 'https://placehold.it/320x240&text=text',
                        user_registration_status: 'registered'
                }"></competition-registration-cta>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Competition Volunteer CTA</h2>
            </div>
            <div class="style-guide__section-content">
                <competition-volunteer-cta :source="{
                    actions: {
                        request: {
                            visible: true,
                            enabled: true
                        },
                        select_shifts: {
                            visible: false,
                            enabled: false,
                            url: ''
                        }
                    },
                    phase_message: {
                        text: 'Example Phase Message',
                        type: 'success'
                    },
                    status_message: {
                        text: 'Example status message',
                        type_key: 'alert'
                    }
                }"></competition-volunteer-cta>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Carousel</h2>
            </div>
            <div class="style-guide__section-content">
                <carousel>
                    <div class="swiper-slide">
                        <div style="height:150px; background-color:darkgray; display:flex; align-items:center;justify-content:center">
                            Slide 1
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div style="height:150px; background-color:darkgray; display:flex; align-items:center;justify-content:center">
                            Slide 2
                        </div>
                    </div>
                </carousel>
                <h3>With Navigation</h3>
                <carousel :show_navigation="true">
                    <div class="swiper-slide">
                        <div style="height:150px; background-color:darkgray; display:flex; align-items:center;justify-content:center">
                            Slide 1
                        </div>
                    </div>
                    <div class="swiper-slide">
                        <div style="height:150px; background-color:darkgray; display:flex; align-items:center;justify-content:center">
                            Slide 2
                        </div>
                    </div>
                </carousel>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Competition User Navigation</h2>
            </div>
            <div class="style-guide__section-content">
                <competition-user-navigation :links="[
                    {
                        label: 'Inactive Item',
                        url: 'http://google.com',
                    },
                    {
                        label: 'Active Item',
                    },
               ]"></competition-user-navigation>
            </div>
        </section>

        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Series Page Header</h2>
            </div>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <series-page-header :series="{
                    name:'2020 National Qualifying Series',
                    icon:'/images/series-icon-1.png',
                    application_deadline_formatted:'5/28/2019 11:59 PM ET'
                }"></series-page-header>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Page Entity Header</h2>
            </div>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <page-entity-header slot="pre-header"
                                    entity_name="Denver Synchronicity - Synchro Skills"></page-entity-header>
            </div>
        </section>
    </div>
</div>

<script src="<?php echo mix('/js/manifest.js') ?>"></script>
<script src="<?php echo mix('/js/vendor.js') ?>"></script>
<script src="<?php echo mix('/js/competition-registration.js') ?>"></script>
<script src="<?php echo mix('/js/component-guide.js') ?>"></script>
</body>
</html>