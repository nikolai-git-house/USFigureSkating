# Change Log
All notable changes to this project will be documented in this file.

<!--------
## [Unreleased] yyyy-mm-dd
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
-->

## [3.2.17] Volunteer Request/Competition Portal Main Navigation yyyy-mm-dd
### Added
* Support to update Competition user navigation stack upon submission of a volunteer request from competition portal main page
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [3.2.16] Team Series Application 2020-10-14
### Added
* Team Support to Series Registration Series Overview Page
    * Supporting Data Flows
    * Supporting Components
    * Overrides and Hooks to Series Overview page component
    * Mock API updates
* Series Application Select Team Page
    * Supporting models, data flows, templates, components, mock API
* Team Support to Series Registration Application Page
    * Supporting Data Flows
    * Supporting Components
    * Overrides and Hooks to page components and state modules
    * Mock API
### Changed
* Added button override slot to `SelectTeamList` component
### Deprecated
### Removed
### Fixed
### Security

## [3.2.15] 2020-10-13
### Added
### Changed
* Logic surrounding Practice Ice Schedule conditional display and session selectability
### Deprecated
### Removed
### Fixed
### Security

## [3.2.14] Competition Portal Compliance Header 2020-08-31
### Added
* `StatusSummary` component
    - Added support for section headings
    - Added `--inline` stylistic variant
* `PageEntityComplianceHeader` component
    * Extracted from and extended `PageEntityHeader`
        * Added support for secondary compliance messaging (valid through date)
        * Added support for individual role-based compliance item display
### Changed
* Revised page components and data flows to enable addition of Compliance Header to Competition Portal pages:
    * "My Skaters"
    * "My Coaches"
    * "My Schedule"
    * "Coach Schedule"
    * "Coach Competition Schedule"
### Deprecated
* "Get Competition Skaters" `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:386` API endpoint
* "Get Competition Event Coaches" `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:480` API endpoint
* "Get Skater Competition Schedule" `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:563` API endpoint
* "Get Competition Information" `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390` API endpoint
* "Get Competition Schedule" `INTEGRATION_GUIDES/2__INTEGRATION-BATCH2.md:258` API endpoint
* "Get Competition Coached Skater Schedule" `INTEGRATION_GUIDES/9__INTEGRATION-COACH_SCHEDULE.md:30` API endpoint
### Removed
### Fixed
### Security

## [3.2.13] Shift Selection 2020-08-31
### Added
* Style Elements
   * Icons
        * `icon-status-primary-error-ada`
        * `icon-status-primary-success-ada`
        * `icon-pending-thin`
   * `text--underline` atomic text class
   * `filter-button` element
* Pages
    * Competition Portal "My Volunteer Schedule" page and supporting infrastructure
    * Competition Portal "Shift Selection" page and supporting infrastructure
* Components
    * `FilterTakeover` abstract component
    * `AccordionMultiselect` component
    * `AppNotice` "Danger" variant with red iconography
* Helpers
    * String `escapeRegex` and `displayFromKey` helpers
### Changed
* App Notice and Confirmation Overlay components iconography usage
* Extend `ConfirmActionOverlay` functionality to support promise-based confirm handlers
### Deprecated
### Removed
### Fixed
### Security

## [3.2.12.2] Admin Competition Contacts Update 2020-08-28
### Added
* Admin Portal Competition Contacts page functionality
    * Functionality to prevent removal of the last instance of specified contact roles
### Changed
* Admin Portal Competition Contacts page verbiage
    * Page title from "Administrators" to "Contacts"
    * Instances of "Competition Contacts" to LOC Contacts
### Deprecated
### Removed
### Fixed
### Security

## [3.2.12.1] Team Practice Ice Update 2020-08-28
### Added
### Changed
* Display Practice Ice "Event Schedule" view by default in team context
### Deprecated
### Removed
### Fixed
### Security

## [3.2.12] (Volunteer Application Waivers) 2020-08-26
### Added
* `Waivers` waiver list component
* "Waivers & Release" screen to volunteer opportunity application
### Changed
* Removed inline template call from volunteer opportunities page for volunteer request component
* Volunteer Request API submission to contain waivers information
### Deprecated
### Removed
* Volunteer Opportunities Request template partial (`src/views/pages/partials/volunteer-opportunities/M.3_volunteer-opportunities-request.php`)
### Fixed
### Security

## [3.2.11.4] Team Portal Revisions 2020-08-22
### Added
### Changed
* extend CompetitionRegistrationRegistrationCta component to support displaying a notice in place of the action button
* revise view competition page component to support link to change view in team and self contexts
* Update competition portal roster page to use API-provided page introduction text
### Deprecated
### Removed
### Fixed
* DataNavigationLink component styles to prevent content/chevron overlap in small screen contexts
* Removed design artifact and normalized Team Registration Header with other header instances
### Security

## [3.2.11.3] 2020-08-21
### Added
### Changed
* Remove check-in comments fetch blocker when checking in or undoing check-in for an entity
* Display email overlay component form with Subject field open by default
* Competition Information (Admin) page data structures surrounding "Registration" section dates to facilitate adding associated costs/discounts
    - Remove standalone `CompetitionManagementCompetitionInformationRegistrationData.late_registration_fee` property
    - Revise `CompetitionManagementCompetitionInformationRegistrationData.dates` to use new `CompetitionManagementNamedDateTimeWithOptionalCostData` schema
### Deprecated
### Removed
### Fixed
* Competition Information (Admin) page data accordions to optimize display when Chrome focus rings are active
* Fixed visibility of Check-In page loading display when page loads in standalone mode
### Security

## [3.2.11.2] 2020-08-05
### Added
* Conditional admin-only "Edit Mode" link to competition schedule page and data
* Support for secondary link for header of Page component
* `icon-link--edit` variant
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [3.2.11.1] 2020-08-03
### Added
### Changed
* Series application to enable API-configurable amount of max levels
### Deprecated
### Removed
### Fixed
* Competition Filter component filtering error when regex special characters are used in text filter
### Security

## [3.2.11] Team Portal 2020-07-24
### Added
* Component guide (sibling to style guide)
* `CompetitionPortal` sass and js src directories
    * Import Competition Portal js bootstrap file into main.js bootstrap
* Link configuration contracts and filters to populate link attributes
* Support for display of compliance information within `PageEntityHeader` component
* `CompetitionPortalPageMixin` page mixin
* Cart Add Credits endpoint for Teams
* Components
    * `StatusSummary`
    * `CompetitionPortalPageHeading`
    * `DataNavigationLink`
* Pages
    * Team Portal / Competition Portal
        * "My Competitions - Teams" page
        * "My Teams" page
        * "Select Competition Entity" page (from Search Competitions flow)
        * "Competition Documents" page
        * "Competition Team Personnel" page
        * "Competition Roster" page
* Style Elements
    * Anchor element hover state support within status text atomic classes
    * `--large` `--unpadded-content-h` `--white-bg-content` Accordion variants
    * `--large' Count Badge variant
    * `--aligned` warning text variant
    * `--no-first-pad` `.panel-link-group` element modified to remove padding from the first panel link in the group
    * Icons
        * `icon-chevron-right-gray`
        * `icon-danger-alt`
        * `icon-chevron-blue-large-down`
        * `icon-chevron-blue-large-up`
        * `icon-pending`
        * `icon-scheduled`
    * "New" badge/faux icon
    * `text--standard` atomic text class
    * `ada-text` atomic class
        * Adjusts contained status text elements to use new ADA coloring
### Changed
* Extended `src/js/store/Modules/AppState.ts` module to track active page back link configuration
* `src/views/layouts/partials/header.php`
   * Added main menu link to "My Competitions - Teams"
* Extracted `src/js/Teams/_components/SelectTeamList.vue` component from `src/js/Teams/CompetitionRegistration/_pages/SelectTeamPage.vue`
    * Added supporting contract `SelectTeamListComponentTeam`, which `src/js/Teams/_models/ManagedTeam.ts` now extends
* Extracted `transformManagedTeams` method from `src/js/Teams/TeamsApiTransformer.ts`
* `Page` component
    * Added "subtitle" support
* "Fetch View Competition" API endpoint
    * URL
    * Response Schema
    * Addition of URL specifying intent to view information as a team
* `ViewCompetition` page component
    * Removed "back_link" component property
    * Revised component markup to use Competition Portal Page mixin
    * Changed state action for loading page data
    * Added support for "For Teams" CTA.
    * Added support for conditional display of "For Skaters" and "For Volunteers" CTAs
* Extended `CompetitionDocuments` component to allow external control of component data flows
* Competition Contacts page component/functionality
    * Changed component file location and bootstrap registration location
    * Transferred HTML markup from standalone template file to Vue component
    * (Client-side) Revised API integration and data flow layers to occupy "CompetitionPortal" namespace
    * Modernized component code
    * Extended API endpoint to contain CompetitionPortalCore information in response
* Competition Information page component/functionality
    * Changed component file location and bootstrap registration location
    * Transferred HTML markup from standalone template file to Vue component
    * Removed "Competition Documents" sub-component from page
    * Revised API integration and data flow layers
    * Modernized component code
    * Add new dedicated Page API endpoint and data flows within CompetitionPortal namespace
* Promoted `StatusEntityCard` component from Admin Portal to Main
    * Added `--centered` class variant for centered card content
    * Add support for invalid state icon display
* Music/PPC page component/structure/functionality
    * Reintegrated upstream revisions by USFS dev team
    * Revised/Modernized page component markup structure
    * Created new endpoint to power page
    * Added support for teams for all sub-editor API endpoint interactions
    * Changed fetch PPC form Options endpoint URL
    * Add support for PPC "Transition Description" form input and data
* Practice Ice Schedule page component/functionality
    * Revised API integration and data flow layers
    * Modernized component code
    * Extended for use in Team context
* Practice Ice Pre-Purchase page component/functionality
    * Revised API integration and data flow layers
    * Modernized component code
    * Extended for use in Team context
* Competition Schedule page component/functionality
    * Revised API integration and data flow layers
    * Modernized component code
    * Extended for use in Team context
* `ViewCompetitionData` contract `user_navigation` property type
* `CompetitionUserNavigation.vue` to use new `DataNavigationLink.vue` component sub-links
* `CompetitionRegistrationRegistrationCta` component to support external click event handling
* `ViewCompetitionData` schema
    * Added `links` property
    * Made `registration_cta_configuration` and `volunteer_cta_configuration` properties optional
    * Added  `team_registration_cta_configuration` property
### Deprecated
* Pre-existing "View Competition" schemas and functionality
    * `FetchViewCompetitionAPIResponse` interface
    * API Service `fetchViewCompetitionCompetition` method
    * State Module `fetchViewCompetitionCompetition` action
* Elements of existing Competition Documents functionality
    * `competition_documents` property of CompetitionInformation-related structures
        * `CompetitionInformationData`
        * `CompetitionInformation` model
        * `competition_documents` property of "Fetch Competition Information" API response
    * competition document getters and actions in `CompetitionsState`
* `CompetitionService` and `CompetitionsState` methods and properties related to Competition Contacts
### Removed
* "Competition Documents" accordion from "Competition Information" page
    * Removed element from template
    * Removed component registration in parent
* `CompetitionUserNavigationLink` component and related data structures
### Fixed
### Security

## [3.2.10.2] Admin Portal Compliance Data Update - 2020-07-23
### Added
* "Fetch Entity Check-In" API endpoint and supporting functionality
### Changed
### Deprecated
### Removed
* `is_compliant` property from entities returned by "Check-In Fetch Entities" API endpoint
### Fixed
### Security

## [3.2.10.1] Admin Portal Update - Roster Rules 2020-07-21
### Added
### Changed
* Moved `team_roster_rules` property from "Competition Management Fetch Active Competition" API endpoint to
  "Entity Check-In Fetch Roster" endpoint
### Deprecated
### Removed
* `team_roster_rules` property from `CompetitionManagementCompetition` model
### Fixed
### Security

## [3.2.10] Team Registration 2020-06-11
### Added
* Reactive page component for EMS Home
* 'team_manager' UserRole
* `competition-registration-teams.js ` build script
* `PageEntityHeader` component
* Team Registration
    * Select Team Page
    * Competition List Page
    * Registration SPA
* Page component "Back" link click handler function option
* Abstract API service `getValueFromCookie` method
* Generic saving/confirmation overlay component (`SavingConfirmationOverlay`)
* 'patch' verb support to `AbstractAPIService` `submitWithTransformedResponse` method
* Extensible PricingTable component (namespaced within TeamRegistration)
* Event Selection Event Card paid status indicator
* `--invalid` (red) custom checkbox variant
* `.labeled-action-button` element
* `.warning-notice` multi-line warning text element
    * associated icon
### Changed
* BrowserSync proxy URL
* Default pagination per-page to 50
* Tangential Structures to support EMS Home reactivity
    * Changed markup in `src/views/pages/N.0_EMS_Home.php`
    * `.panel-link__error` styling
    * Added user endpoint completion detection for User State
* SPD Competition Registration Event Selection Component (`src/js/components/CompetitionRegistration/EventSelection.vue`)
    * Extract majority of functionality into mixin (`src/js/mixins/EventSelectionMixin.ts`)
### Deprecated
### Removed
### Fixed
* Issue in which cleared dates in Competition Filter triggered filtering incorrectly
### Security

## [3.2.9.4] 2020-06-04
### Added
* Discrete PI error messaging when selecting full session
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [3.2.9.3] 2020-06-02
### Added
* Support for competitions with closed registration windows in Competition Registration CTA component
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [3.2.9.2] 2020-06-02
### Added
### Changed
* Populate "Back" link on Competition Schedule via API data rather than component property
### Deprecated
### Removed
### Fixed
### Security

## [3.2.9.1] Nullable Search Competitions Registration Deadlines - yyyy-mm-dd
### Added
### Changed
* Made SearchCompetition Competition registration_deadline property optional
### Deprecated
### Removed
### Fixed
### Security

## [3.2.9] Series Registration Standings - 2020-04-10
### Added
* "Series Registration" Standings page, elements and components
* Elements
    * Labeled Toggle Element
    * Small toggle variant
* Support
    * Base filtering service
### Changed
### Deprecated
### Removed
### Fixed
### Security

### Added
## [3.2.8] Series Registration - 2020-03-26
* "Series Registration" pages, elements and components
    * General
        * Series Registration compiled script
        * Elements
            * `series-summary`
            * `cost-display`
    * "Series Information" (Series Registration Index) page
    * "Series Application" page
* Components
    * Self-contained "Skate Tests" component that includes history display and edit overlay
    * Self-contained "Member Search Takeover" component that includes member search within a `site-takeover`
    * Root level "Confirm Action" overlay component - allows interrupting a user action with a confirmation overlay on the app root level
    * Root level "Notice" overlay component
    * Animated Saving Icon
* Elements
    * Warning and Danger icons
    * Warning and danger text display elements
* Support
    * Member search validation function factory
    * Helper function (`enforcePromiseResolutionDuration`) to enforce promise resolution minimum duration
    * Base level member search API service
    * Status Text
        * Dedicated Global contracts
        * Global class filter
* Mock API
    * Member Search
        * ability to search by gender
        * generic member search endpoint
    * Cart
        * Series registration cart
### Changed
* General
    * Added EMS Home to primary navigation main menu
* Elements
    * Popup
        * add `--md` variant
    * Site Takeover
        * Add title element
        * Add `--accent` variant
* Components
    * `Page`
        * add pre-header slot
        * add header-content slot
    * `AnimatedCheckIcon`
        *  Moved to app level components directory from Admin Portal components directory
* Support
    * Abstract API Service
        * added `patch` to available request methods for `SubmitForAPISubmissionResponseParameters`
    * Skate Test History State Module
        * Added ability to override save and remove test actions
    * Cart
        * Added `cart_item_type_key` enum option of `series_registration_fee`
        * Extended `CartRemoveRegistrationItemAPIPayload` to include the `cart_item_type_key` of the item being removed
* Mock API
    * Skate Tests
        * moved skate test modification functionality from endpoint closure to skate test history model/manager
* Added AutoSuggest component input debounce to improve performance in Edge/IE
### Deprecated
### Removed
### Fixed
* Added missing preventDefault on member search ineligible warning notice click event
### Security
* Updated NPM dependencies to resolve security issues


## [3.2.7] - Schedule Access - 2020‑02‑03
### Added
* Global Components
    * `Carousel`
    * `CompetitionRegistrationRegistrationCta`
    * `CompetitionUserNavigation`
    * `ComponentLoader`
    * `AddressFormFields`
    * `ParentedCheckboxGroup`
    * `DateInputExtended`
    * `CompetitionFilter`
    * `Page`
* Search Competitions Page
    * Page component
    * Supporting State/Service methods
    * Supporting Contracts
    * Page template
* View Competition Page
    * Page component
    * Supporting Contracts
    * Supporting Sub-Components
        * `CompetitionVolunteerCta`
    * Model
    * Supporting State/Service methods
* Competition Schedule Page
    * Page component
    * Supporting Sub-Components
        * `CompetitionScheduleFilters`
        * `CompetitionScheduleLegend`
        * `CompetitionScheduleRinkSchedule`
    * Supporting Filtering Service `CompetitionScheduleRinkScheduleFilterService`
    * Supporting Contracts and Constants
    * Supporting State and API Service methods
* Search Competitions page links
    * EMS Home template `N.0_EMS_Home.php`
    * Main navigation menu `src/views/layouts/partials/header.php`
* Competition Heading Data Flows for Non-User Competitions
    * `HasVariableCompetitionHeading` mixin
    * State and Service methods
* Mixins
    * `HasConfirmationOverlay`
* Helpers
    * `src/js/helpers/DateFilterer` `dateRangeWithinWindow` method
    * `src/js/helpers/StringHelpers.ts` `splice` method
* Style Elements/Modifiers
    * `--with-pagination` page variant
    * Page Heading Site Element (`.page-heading`)
    * `.competition-tile-list` abstract element styles
    * `--range` `.form-row` variant
* Segregated Competition Field contracts
* Mock API
    * `CompetitionFieldFactory`
    * `FieldFactory`
    * Routes/Factories and Managers to support new API functionality needs
### Changed
* Global Components
    * `Accordion`
        * Added close method
        * Extracted interface out of .vue file
    * `StandardSession`
        * Added property to configure carousel no-swipe binding
* Volunteer Opportunities
    * Components
        * `VolunteerOpportunitiesRequest`
                * Added template to vue file
                * Extended completion functionality to extra response data
                * Added scroll resetting in context outside of site overlay
        * `VolunteerRequestExperienceForm`
                * Added template to vue file
                * Added support for JS-based criminal check and terms links
        * `VolunteerRequestGeneralInformation`
                * Added template to vue file
                * code formatting
        * `VolunteerRequestGeneralInformationForm`
                * Added template to vue file
                * code formatting
    * State
        * Added standalone mode with unique submission flow for submitting a request from View Competition page
        * Added configurability
        * Added links for criminal history and terms links
        * Extended submit request response handling
    * Data
        * Added links property to model
* Existing "Competition Schedule" (Coach Competition Schedule)
    * Demo Site page url from `/competition-schedule` to `/coach-competition-schedule`
    * `CompetitionList` Component (Site Header Competition Sub-navigation menu)
        * Change link label from "Competition Schedule" to "Competition Schedule (Coach)"
        * Change component members and bindings to refer to "Coach Competition Schedule" instead of "Competition Schedule"
    * `CompetitionDetail` page component
        * Change component members and bindings to refer to "Coach Competition Schedule" instead of "Competition Schedule"
        * Change template (`src/views/pages/C.1_competition_details.php`) bindings to updated members. Add "(Coach)" label to link.
    * Competition model (`src/js/models/Competition/Competition.ts`)
        * Rename `_competition_schedule_link` property to `_coach_competition_schedule_link` and change URL.
    * Page Component
        * renamed from `srs/js/CompetitionSchedule.vue` to `src/js/CoachCompetitionSchedule.vue`
        * Changed component binding element from `<competition-schedule>` to `<coach-competition-schedule>`
    * Page Template
        * Changed component binding to reference new component binding
    * Symbolic link file to `src/views/pages/coach-competition-schedule.php`
* Competition Contacts
    * `CompetitionContacts` page component
        * Upgraded to use `HasDataDependencies` mixin for loading process
        * Added `HasVariableCompetitionHeading` to support loading page heading for non-user competitions
    * Service/State (`CompetitionService`, `CompetitionsState`)
        * Changed Competition Contacts fetch method to use `AbstractAPIService` API instead of request-specific functionality.
        * Added `FetchCompetitionContactsAPIResponse` and `FetchCompetitionContactsServiceResponse` types
    * Modified template `src/views/pages/E.2.1_Competition-contacts.php` to support new competition heading and use new component loader
* `CompetitionTile` component
    * Relocated and reformatted file (`src/js/components/CompetitionRegistration/` to `src/js/components/CompetitionTile/`)
    * Registered component globally (removed local registration from `src/js/pages/CompetitionRegistration/CompetitionRegistrationIndex.vue`)
    * Changed prop type from `RegistrationListCompetition` to new component-specific `CompetitionTileCompetition`
    * Relocated and reorganized associated stylesheets
    * Extracted `.competition-tile-list` abstract element
* Session `type_key` property from generic string to new `SessionTypeKey` dedicated type
    * `src/js/models/Sessions/PracticeIce.ts`
    * `src/js/models/Sessions/Resurface.ts`
    * `src/js/models/Sessions/Session.ts`
    * `src/js/models/Sessions/SkatingEventSession.ts`
    * `src/js/models/Sessions/WarmUp.ts`
    * `src/js/models/SessionValidator.ts`
    * `src/js/models/Collections/SessionCollection.ts`
* Schedule Carousel Factories (`src/js/pages/PracticeIce/RinkNameCarousel.ts`, `src/js/pages/PracticeIce/RinkSessionCarousel.ts`)
    * Extended `create` function to accept override parameters
* Competition Schedule Model - Added optional `legend` and `links` properties
    * `src/js/models/Competition/CompetitionSchedule.ts`
    * `src/js/adaptors/CompetitionScheduleDataAdaptor.ts`
        * Additional linting updates
* Element Styles
    * `.parented-checkbox-group`
        * Moved file into global elements directory
        * Added `--small` variant
    * Increased `.page__heading` top padding to normalize page heading alignment site-wide
* Symbolic file `src/views/CompetitionProfile/Index.php` to reference `/O.2_view_competition.php` instead of `C.1_competition_details.php`
* Mock API
    * Update selected functionality to work within Schedule Access user flows
        * `CompetitionRegistrationCompetition`
        * `CompetitionSchedule`
### Deprecated
* Volunteer Opportunities Sub-component Templates - Deprecated in favor of Vue component templates
    * `M.3.1.1_volunteer-request-general-information-form.php`
    * `M.3.1_volunteer-request-general-information.php`
    * `M.3.2_volunteer-opportunities-request-experience.php`
    * `M.3_volunteer-opportunities-request.php`
* Competition Registration Index
    * Unique Competition tile CTA functionality has been superseded by new `CompetitionRegistrationRegistrationCta` component
        * `CompetitionRegistrationIndex` Vue component
                * Deprecation notice added to methods superseded by new component
        * `K.0_CompetitionRegistration.competition-list.php` Template
                * Deprecation notice added to unique markup for CTA.
                * New component integration stub added (within inactive code).
* CompetitionDetail Page (replaced by View Competition page)
    * template `src/views/pages/C.1_competition_details.php`
    * page component `src/js/components/CompetitionDetail.vue`
    * page style override `src/sass/pages/_app-pages.scss:23`
* `address-form-fields.php` partial in favor of new Vue component partial
* `.page__heading` Block element
### Removed
* `CompetitionRegistrationIndex` vue component `CompetitionTile` component local registration
### Fixed
* Coach Competition Schedule Template
    * `H.1_competition-schedule.php` - Added carousel navigation added to Practice Ice in release 3.2.3
* Incorrect type reference in `INTEGRATION_GUIDES/2__INTEGRATION-BATCH2.md:263`


## [3.2.6] - Competition Documents - 2019-12-06
### Added
* Competition Documents feature:
    * Component presentation, interaction, state, service and data layers
    * Mock API
    * Documentation
* `delay_response` Demo simulation argument
* `IdIndexedSubmissionStatus` App-level interface (extracted from `EditableComplianceSummaryState`)
* Inline documentation to `CompetitionInformationData` interface
* Status Checkbox markup, styles and icons
* Skater Portal page "Back Heading" presentation layer
### Changed
* Performed code style updates to existing files to adhere to new standards:
    * `src/js/adaptors/CompetitionInformationDataAdaptor.ts`
    * `src/js/components/CompetitionInformation.vue`
    * `src/js/models/Competition/CompetitionInformation.ts`
    * `src/js/services/CompetitionService.ts`
    * `src/js/store/Modules/CompetitionsState.ts`
* Extended Competition Information page to support Competition Documents and tangential updates
    * Add competition documents accordion and content
    * Add updated page heading to include back link
    * Added `HasDataDependencies` mixin to optimize loading process
    * Added documentation to component members where absent
    * Refactored data calls to use prioritized data structures (removed associated @refactor flag)
    * Refactored markup and styles of template:
        * Remove unnecessary markup for accordion contents
        * Normalize accordion content styles
        * Use utility classes added prior to original page completion
* Extracted variables from `src/sass/AdminPortal/_elements/_admin-portal-page-heading.scss`
### Removed
* Style definitions rendered obsolete by updates


## [3.2.5] - Admin Portal - 2019-11-20
### Added
* Admin Portal pages and associated functionality
* EMS Landing Page
* Directions, announcement and directions properties to CompetitionData schema
    * See updated `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md` for new optional properties:
        * `website_url`
        * `directions`
        * `announcement_url`
* Email Form component and state module
* Site Takeover Component (alternative to Site Overlay)
* Site Takeover Directive
* Markup templates to component files
    * `MemberCategoryAssignment`
    * `MemberSearch`
    * `MemberSearchForm`
    * `MemberSearchResults`
    * `MemberSearchResultsHeader`
    * `MemberSearchResultsPagination`
* Member Search form Pre/Post slots, and additional form validation configurations
* Optional Configurations to Site Overlay Component
    * Transitions
    * Return to scroll position on close
    * Whether to lock body scroll
    * Whether to show header
* New Helpers
    * File Size
    * String Manipulation
* App Root Functions related to document scroll position
* Has Paginated Items Mixin
* Abstract API Service
* New App Icons
* Ghost Action Button variant
* Data-trigger Accordion variant
* Status and External Panel Link variants
### Changed
* Elevated abstract components from Competition Registration script file to main script bootstrap
* CompetitionHeading component
    * Markup/Styles rewrite
    * Add directions, announcement and competition website links
* Navigation "Main Menu" navigation items
* Refined lint rules
* `SkaterCoachedEventCollection` typing extensions
### Removed
* Button links on Members Only Home page

## [3.2.4] Volunteer Opportunities - 2019-08-19
### Added
* Volunteer Opportunities feature
* Linting tooling (Eslint)
* Pre-commit hook to enforce code style
* Search mixins to contain shared functionality across search related components
  * SearchMixin
  * SearchResultsMixin
* Optional template to abstract Pagination component
* Standalone SearchResultsHeader abstract component
* Ability to pass component props to existing components:
  * SiteOverlay (content HTML class)
  * Tab (tab body HTML class)
  * Tabs (tab triggers HTML class)
* `preDataLoad` method to `HasDataDependencies` mixin to enable actions prior to data retrieval
* `confirmed` Form Validation rule
* Stricter typing surrounding Pagination
* Emergency Contact information and Profile update functionality to `UserState`
* Fixed-width flex grid column variant
### Changed
* Mock competition data allowing demo site to always enable Music and PPC component access
* Dependency version updates
  * Minor version updates to multiple dependencies
  * Laravel Mix (2=>4)
  * Minor source updates to align with updated dependencies
    * Added Promise polyfill to Competition Registration scripts as needed given build update
    * Removed fallback static alt attribute in `CompetitionHeading` component template
    * Changed syntax in various components to adhere to new build dependency rules:
      * `MemberSearchForm`
      * `MyCoachesSearchForm`
      * `RinkSchedule`
      * `PopUp`
      * `SupportDocuments`
    * Changed vuex module registration timing in `CompetitionRegistrationSkateTests` component
  * Build configurations to align with updated dependencies
* Location of `EmergencyContactFormState` file
* Moved User-related contracts into dedicated file
  * Updated import path in dependent files
* `CoachSearch` and `MemberSearch` component implementations to use new search mixins
### Removed
* Mock Club form options with "Deleted" in the name
### Fixed
* Added missing closing tag to Create Account parent template
### Security
* Dependency updates to resolve security vulnerabilities

## [3.2.3] Practice Ice UI Updates - 2019-08-12
### Changed
* Practice Ice carousel display
* Practice Ice related file code style
### Added
* Available icons to style guide

## [3.2.2] Event Requirements - 2019‑07‑19
### Added
* Competition Registration Event Selection "Event Requirements" subcomponent

## [3.2.1] Build Updates - 2019-07-09
### Added
* Fork TS Checker Webpack Plugin to speed up build process.
* New constants for quicker build configurations


## [3.2.0] Support Documents - 2019-07-02
### Added
* Support Documents Page and supporting functionality
* Icon link class and modifier extensions
	* Relocated previously existing style definitions into new file
	* Adjusted page-specific styles to accommodate abstraction changes
* DOM helpers class
* Left/Right slide transitions
* Document Icon
* Documentation files
	* `CHANGELOG.md`
	* `INTEGRATION_GUIDES/13_INTEGRATION-SUPPORT-DOCUMENTS.md`
		* Outlines general integration notes
	* `INTEGRATION_GUIDES/Release3/r3.2.0_INTEGRATION_SupportDocumentsAPI.md`
		* Documents API integration
* Option to Create Account component to skip submission of blank emergency contact form data (resolved "todo")
### Changed
* `src/views/layouts/partials/footer.php`
	* "Contact Us" wording change to "Contact Member Services"
* `src/views/layouts/partials/header.php`
	* Add link to Support Documents ("Help & Resources")
	* Change wording of EMS Support link from "Support
* `src/views/pages/J.1_create_account.php`
	* Add create account instruction link and copy
* Site header menu tab text alignment
### Removed
* Deprecated/Unused Type Definitions:
	* `StagingCartCreditAddPayload`
	* `StagingCreditList`
	* `SkatingEventCategory`
* `legacy-mocks` and `legacy-models` directories and contents
### Fixed
* Code style of contract files
	* All lines terminated with semicolon
	* Single line break between types/interfaces
	* Double line break between sections
* Miscellaneous cleanup:
	* comment typos
	* Add missing semicolons


## [3.1.1] 2019-06-28 Representation Selection Hotfix
### Added
* `RepresentationSelectionAPIPayload` request with default payload when user checks confirmation checkbox on Competition
Registration "My Profile" page when `representation_selection_required` flag is set.
	* Default payload selects the user's first LTS program if they have any.  Otherwise, payload indicates the user's home club
	* Disables confirmation checkbox form input while request is pending
	* Includes support of error message display should the request fail.
* Disabled visual state to custom checkbox element. 
* Display message for representation selection screen when a user has neither club nor LTS membership
### Changed
* Allow `lts_programs` property on UserProfile to be null
	* If a user has no LTS programs, do not show "Other Organization" in Representation Selection
	* Hide section of "My Profile" page when data is absent
* Make `membership_validity_formatted` on user profile `home_club` property optional
	* Updated interface logic to hide UI elements when data is absent
* Make `summary.validity_date_formatted` on user profile `lts_programs` property optional
	* Updated interface logic to hide UI elements when data is absent
* Display of club information on Competition Registration "My Profile" page when data is null
	* Previously displayed "None" next to field label. Now field does not show if data is null
### Removed
* Extraneous inline style on Competition Registration "My Profile" page confirmation checkbox element
### Fixed
* Issue in which a user could not proceed past "My Profile" page of Competition Registration when `representation_selection_required`
flag is set to false.


## [3.1.0] Competition Registration - 2019-06-03
### Added 
* Competition Registration components
* Member search abstract component
* Autosuggest component
* Category Member Assignment component
* Skate Test History
### Changed 
* Script builds to use vendor extraction
* Cart API
* Billing Address API and interface
### Deprecated 
* Skate Test Equivalency
### Removed 
* Old billing address state management


## Previous Releases
3.0.0 - Create Account - 2019‑04‑12
2.4.0 - Practice Ice Data Update - 2018‑09‑28
2.3.0 - Coach Schedule - 2018‑09‑19
2.2.0 - Skater Coach Nav - 2018‑07‑13
2.1.0 - EMS Support - 2018‑08‑21
2.0.0 - Music & PPC - 2018‑07‑27