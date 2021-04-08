# USFSA EMS Mobile Redesign
This project includes redesigning the mobile experience for U.S. Figure Skating’s Event Management System (EMS).  

For this project, we are targeting the Practice Ice, Schedule and Payment Process elements of the Event Management System.

This approach provides a scalable and interactive project lifecycle to also address a larger site experience to be phased in, adding, for example, Music & Program Content. 

The approach leaves the desktop experience in place, therefore mobile is a separate experience. This will be handled with a separate URL strategy ( www.m.usfsaonline.org). Upon device detection on a mobile device, this URL would be served.


## Overview
### Technology Stack
1. [Vue.js](https://vuejs.org/) - UI Framework
1. [Vuex](https://vuex.vuejs.org/en/) - State Management
1. [axios](https://github.com/axios/axios) - HTTP Client
1. [Laravel Mix](https://github.com/JeffreyWay/laravel-mix) - Webpack build wrapper
1. [Typescript](http://www.typescriptlang.org/) - JavaScript Superset
1. [SASS](https://sass-lang.com/) - CSS preprocessor - SCSS syntax used

Version requirements of dependencies can be found in `package.json` and `package-lock.json`

## Integration Guide
Various integration guides can be found in the `INTEGRATION_GUIDES` directory. They are numbered according to the order in which they were written.  

## Pre-Integration Demo
The app has been set up to mimic the functionality following final data integration in the following ways:

### General
To simulate a slow response from the server, append a request parameter of `delay_response` to any URL and all API calls will
be delayed by 2 seconds.

### Login Page
#### Simulating a Login Error
If you log in with no credentials, or user number "invalid", an error state will be triggered.  

#### Simulating User Role
* If you log in with Member Number of "coach," you will see the coach version of the navigation. 
* If you log in with Member Number of "both," you will see the combined coach and skater version of the navigation. 
* Otherwise you will see the skater version.

#### Simulating User Device Without Upload Capability
If you log in with Member Number "noupload", the demo will simulate backend determination that the active user's device does
not support mobile file uploads. 

### Forgot Password Page
1. If you enter "error" as your email address, an error state will be triggered
1. If you enter "multiple" as your email address, the "select account" popup will display. 

### Saving PPC
If you save a PPC with 4-7 elements, the mock api will respond with data indicating the PPC is complete.  Less than 4 or more than
7 items will result in an "incomplete" status.

### Uploading Music File
On the Music page, if you upload a file with a name containing "error," it will simulate backend validation failure of the uploaded file.

### Submitting EMS Support
On the EMS Support page, if you submit the form with an email address containing "error," it will simulate backend validation failure of the EMS Support form. 

### Create Account
#### Simulating Existing Account
To simulate an attempt to create an account where one already exists, include "duplicate" in the email address provided on the Personal Information page

#### Simulating Address Submission Error
To simulate a server error when submitting the Create Account Address form, include "error" in the first street address input

#### Simulating Emergency Contact Submission Error
To simulate a server error when submitting the Create Account Emergency Contact form, include "error" in the relationship field

#### Simulating Password Submission Error
To simulate a server error when submitting the Create Account Password form, include "error" in the password field

### Competition Registration

#### No-Partner-Events Competition
Competition 2 has been configured to not feature partner events.  It should direct straight from skate tests
to event selection, and going backwards from event selection to skate test history.  Additionally,
it should show only 5 steps for registration.
`/pages/competition-registration/2`

#### Competition Overview
Most competitions are configured to demonstrate full pricing data.

The following competitions are configure to demonstrate...
* No IJS Events:  `/pages/competition-registration/2`
* No 6.0 Events: `/pages/competition-registration/3`

#### Profile
Most competitions are configured to require full representation selection.

To demonstrate the following use cases, add the specified text to the end of the URL:
* User has no home club -  `/no_club`
* User has no LTS programs -  `/no_lts`
* Representation selection not required -  `/no_representation`
* User has already selected their representation, - `/preselected`

Multiple options above can be used through comma separated lists. ex: `/no_representation,no_lts,no_club`

#### Partner Events
To simulate that the user has already selected partner events, add `/preselected` to the end of the URL.

#### Partner Identification
To simulate that a partner has been added through an incomplete registration, add "preselected" to end of URL:

`/pages/competition-registration/1/partner-identification/preselected`

To simulate that the partner is now ineligible, add "ineligible" to end of URL:

`/pages/competition-registration/1/partner-identification/preselected,ineligible`

#### Event Selection
Event selection has been preconfigured to represent a state where the user has already
selected some events and is registered for an event.  To simulate a fresh event selection state, add `/raw` to the end
of the URL

Mock events have been named to indicate mock events and include events that:
* Can't be removed from selections when other selections are present
* An event that can't be added at all

When adding a pairs event, the addition of a new partner skate test summary item is added
with a partner that doesn't meet requirements.

When managing a partner skate test, removing a test will result in the partner no longer meeting requirements removing
a test will result in the partner no longer meeting requirements. Adding a test will result in the partner meeting
requirements.

#### Coach Identification
To simulate a continued registration in which a user has selected coaches, add `/preselected` to the end of the URL.

To simulate the case where a user has not selected any partner events, add `no_partner_events` to the end of the URL.
This simulates the case where a user should not see "Partner Identification" upon going back, but instead "Partner Events".

The various categories have been configured to have the following coach limits:
* Singles - 2
* Dance - 3
* Pairs - 3

#### Waivers
To simulate that the user has completed their waivers, add `/complete` to the end of the URL.
To simulate that the user has complete some of their waivers, add `/partial` to the end of the URL.

#### Cart/Checkout
The cart has been set up to mock the increase of the remaining registration fee price when another registration fee is removed.

The previous submit payment response in which "Unprocessable Credit Card." would be returned at random has been updated
to only return this error response when the credit card expiration date is in June.

### Volunteer Opportunities

#### Index
Append a URL segment including `no-opps` when loading the index to simulate no available opportunities for any of the
available lists.

#### Update Profile
When updating the user's profile, include `error` in the email field to simulate an error resulting from the submission.

#### Waivers
`vol_waivers_complete` - All waivers are complete
`vol_waivers_mixed` - Some waivers complete
`vol_waivers_none` - Waivers not provided in response

#### Submit Request
When submitting a request from the experience form, include `error` in the "Volunteer Skillset" field to simulate an error resulting from the submission.
When submitting a request from the experience form, include `redirect` in the "Volunteer Skillset" field to simulate 
an event that redirects a user to shift selection.

#### Search
When searching for opportunities, a random result set will be generated containing the search criteria.
If you search for an "Event Name" of "none", it will simulate a search returning no results.
If you search for an "Event Name" of "error", it will simulate a search error.
If you search for a start date and end date in which the end date is before the start date, no results will be returned.

### Admin Portal
The following URL segments have the following effects in the Admin Portal demo.  Note: Sometimes url segments can be
appended as `/<simulation_key>`, and sometimes they follow the format of `?<simulation_key>` depending on the page.

1. `comp_man_load_error` - Simulates a load error for:
   - Competition Management Competition Lists
   - Competition Information
   - Compliance
   - Compliance Email Configuration
   - Active Competition
1. `no_email_cc` - Simulates no CC Email options for:
   - Compliance Email
   - Check-In Email
1. `comp_list_over_50` - Ensures over 50 competitions are contained in lists.
1. `comp_man_no_upcoming` - Simulates no upcoming competitions in the competition list.
1. `comp_man_no_past` - Simulates no past competitions in the competition list.
1. `no_volunteer_timeline` - Simulates data state in which Volunteer Timeline accordion does not show on Competition Information
1. `only_test_checkin_roles` - Only return 1 of each possible check-in role for Check-In Index Entity List
1. `only_test_checkin_entities` - Only return test check-in entities built for test cases. Do not include randomly generated entities.
1. `compliance_list_over_50` - Ensures the list of compliance entities has over 50 items.
1. `contacts_list_over_50` - Ensures the list of contacts entities has over 50 items.
1. `checkin_load_error` - Simulates an error when loading Check-In page.
1. `checkin_email_load_error` - Simulates an error loading Check-In email configuration
1. `check_in_submit_error` - Simulates errors with Check-In data submissions:
   - Email
   - Check Entity In
   - Undo Check-In
   - Add Comment
   - Override Compliance
   - Override Music Status
   - Override PPC Status
   - Roster Update
   - Add Skater Coach
   - Remove Skater Coach
   - Replace Skater Coach
   - Team Coaches Update
   - Team Service Personnel Update
1. `check_in_entity_fetch_error` - Simulates errors fetching entity check-in data:
   - Comments
   - Compliance
   - Events
   - Roster
   - Skaters
   - Coaches (Skater)
   - Coaches (Team)
   - Team Service Personnel
1. `comp_man_submit_error`
   - Add Competition Contact
   - Remove Competition Contact
   - Change Competition Contact Display
   - Compliance Email

### Competition Documents
The following URL segments have the following effects for Competition Documents:

1. `comp_doc_change_error`- simulates an error when updating the status of a competition document.
1. `no-action-documents` - simulates no action documents available
1. `no-reference-documents` - simulates no reference documents available

### Schedule Access
#### Search Competitions
The following URL segments have the following effects for Competition Documents:

1. `error`- simulates an error retrieving the search competitions list
1. `no_competitions` - simulates no competitions available
1. `competition_count=<count>` Set the amount of competitions present in the search competitions list

#### View Competition
The following URL segments have the following effects for Competition Documents:

1. `error`- simulates an error retrieving the competition data
1. `no_ems` - simulates the competition is not using EMS
1. `no_schedule` - simulates the competition schedule isn't posted yet
1. `registration_closed` - simulates registration for the competition is closed
1. `volunteer_scenario=<key>` - loads various volunteer scenarios for the following keys:
   - `shift_selection` - Volunteer Request Approved, Shift Selection Open
   - `default` - Volunteer Request Open
   - `coming_soon` - Volunteer Request Coming Soon
   - `pending_approval` - Shift Selection Pending Approval
   - `request_pending_approval` - Request Pending Approval
   - `denied` - Volunteer Request not approved
#### View Competition Volunteer Request
By entering any of the following keys in the "Volunteer Skillset" input, the following outcomes can be simulated:

1. `pending`  - Request submitted and pending approval
1. `error`  - Error submitting request

#### Competition Schedule
The following URL segments have the following effects for the Competition Schedule Page:

1. `schedule_unavailable` - Simulates the schedule is not yet available for the competition

### Series Registration
The following URIs will simulate the following outcomes:


| Page                    | URI                                                                          | Outcome                                                                           |
| ----------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Series Information      | `/pages/series-registration/no_series`                                       | No series available                                                               |
| Series Information      | `/pages/series-registration/no_indiv_series`                                 | No non-team series available                                                      |
| Series Information      | `/pages/series-registration/no_team_series`                                  | No team series available                                                          |
| Series Application      | `/pages/series-registration/1/application/fail_save`                         | Save error                                                                        |
| Series Application      | `/pages/series-registration/1/application/noncitizen`                        | Block user from applying due to citizenship                                       |
| Series Application      | `/pages/series-registration/1/application/partner_cea`                       | Add citizenship eligibility data to partner search results                        |
| Series Application      | `/pages/series-registration/1/application/no_eligibility`                    | User is not eligible for any discipline levels                                    |
| Series Application      | `/pages/series-registration/1/application/single_level`                      | User is only allowed to select a single level                                     |
| Series Overview         | `/pages/series-registration/1?error`                                         | Load error                                                                        |
| Series Overview         | `/pages/series-registration/1?no_admin`                                      | Series reports don't display                                                      |
| Series Overview         | `/pages/series-registration/1?application_permutation`                       | Saved application altered to show various levels of completion on each discipline |
| Series Overview         | `/pages/series-registration/1?ineligible_entities`                           | Ineligible partner and coach simulation                                           |
| Series Standings        | `/pages/series-registration/1/standings/error`                               | Load error                                                                        |
| Series Standings        | `/pages/series-registration/1/standings/standings_list_long`                 | Long list of standings (~150 events)                                              |
| Series Standings        | `/pages/series-registration/1/standings/standings_list_dynamic`              | Dynamically generate long list of standings                                       |
| Team Series Application | `/pages/series-registration/11/application?teamId=2&team_profile_incomplete` | Team profile has empty optional values                                            |
| Team Series Application | `/pages/series-registration/11/application?teamId=2&alt_team_series`         | Alternate series card is available for selection                                  |
| Team Series Application | `/pages/series-registration/11/application?teamId=2&no_ts_docs`              | No eligibility docs/Confirmation                                                  |

1. When updating a series application email address, if the edited email address contains the word 'error', it will simulate a submission error.

### Team Registration
The following URIs will simulate the following outcomes:

| Page                           	| URI                                                                                                             	| Outcome                                                                                          	|
|--------------------------------	|-----------------------------------------------------------------------------------------------------------------	|--------------------------------------------------------------------------------------------------	|
| EMS Home                       	| `/pages/ems/non_team_manager`                                                                                   	| User is not a team manager and can't access team registration                                    	|
| Registration Team Selection    	| `/pages/competition-registration-teams/select-team/load_error`                                                  	| Error loading select team page                                                                   	|
| Registration Competition List  	| `/pages/competition-registration-teams/competitions/error`                                                      	| Error fetching competitions                                                                      	|
| Registration Competition List  	| `/pages/competition-registration-teams/competitions/no_nonqual,no_qual`                                         	| No Competitions available                                                                        	|
| Registration Competition List  	| `/pages/competition-registration-teams/competitions/no_nonqual`                                                 	| No Nonqualifying Competitions available                                                          	|
| Registration Competition List  	| `/pages/competition-registration-teams/competitions/no_qual`                                                    	| No Qualifying Competitions available                                                             	|
| Registration                   	| `/pages/competition-registration-teams/[id]/no_prop_crew`                                                       	| Prop Crew step not applicable to team                                                            	|
| Registration                   	| `/pages/competition-registration-teams/[id]/initial_page=roster`                                                	| Initialize on specified page.  Replace 'roster' with any valid page key                          	|
| Registration                   	| `/pages/competition-registration-teams/[id]/load_error`                                                         	| Registration load error                                                                          	|
| Registration Team Verification 	| `/pages/competition-registration-teams/[id]/expired_membership`                                                 	| Team has expired membership                                                                      	|
| Registration Overview          	| `/pages/competition-registration-teams/[id]/overview_error`                                                     	| Error loading registration overview                                                              	|
| Registration Overview          	| `/pages/competition-registration-teams/[id]/qual_pricing`                                                       	| Display qualifying competition pricing tables                                                    	|
| Event Selection                	| `/pages/competition-registration-teams/[id]/events_error`                                                       	| Error loading event selection                                                                    	|
| Event Selection                	| `/pages/competition-registration-teams/[id]/add_event_error`                                                    	| Error when attempting to add an event                                                            	|
| Event Selection                	| `/pages/competition-registration-teams/[id]/remove_event_error`                                                 	| Error when attempting to remove an event                                                         	|
| Event Selection                	| `/pages/competition-registration-teams/[id]/es_selected`                                                        	| Event selection loads with events pre-selected and registered for                                	|
| Event Selection                	| `/pages/competition-registration-teams/[id]/es_many`                                                            	| Event selection loads large event count requiring pagination                                     	|
| Roster                         	| `/pages/competition-registration-teams/[id]/roster_error`                                                       	| Error loading roster                                                                             	|
| Roster                         	| `/pages/competition-registration-teams/[id]/no_skater_fee`                                                      	| No Per Skater Fee                                                                                	|
| Roster                         	| `/pages/competition-registration-teams/[id]/decimal_skater_fee`                                                 	| Non-whole-number Per Skater Fee                                                                  	|
| Roster                         	| `/pages/competition-registration-teams/[id]/roster_enforce_max`                                                 	| Enforce the roster maximum length                                                                	|
| Roster                         	| `/pages/competition-registration-teams/[id]/prepopulate_roster`                                                 	| Prepopulate roster with valid selections                                                         	|
| Roster                         	| `/pages/competition-registration-teams/[id]/prepopulate_roster=[invalid,incomplete,ineligible]`                 	| Prepopulate roster with selections that are any combination of incomplete, ineligible or invalid 	|
| Roster                         	| `/pages/competition-registration-teams/[id]/roster_submit_error`                                                	| Error when confirming roster                                                                     	|
| Coaches                        	| `/pages/competition-registration-teams/[id]/coaches_error`                                                      	| Error loading coaches                                                                            	|
| Coaches                        	| `/pages/competition-registration-teams/[id]/prepopulate_coaches`                                                	| Prepopulate coaches with valid selections                                                        	|
| Coaches                        	| `/pages/competition-registration-teams/[id]/prepopulate_coaches=[invalid,incomplete,ineligible]`                	| Prepopulate coaches with selections that are any combination of invalid and ineligible           	|
| Coaches                        	| `/pages/competition-registration-teams/[id]/coaches_submit_error`                                               	| Error when confirming coaches                                                                    	|
| Team Service Personnel         	| `/pages/competition-registration-teams/[id]/tsp_error`                                                          	| Error loading TSP                                                                                	|
| Team Service Personnel         	| `/pages/competition-registration-teams/[id]/tsp_submit_error`                                                   	| Error submitting change to TSP                                                                   	|
| Team Service Personnel         	| `/pages/competition-registration-teams/[id]/prepopulate_team_service_personnel`                                 	| Prepopulate TSP with valid selections                                                            	|
| Team Service Personnel         	| `/pages/competition-registration-teams/[id]/prepopulate_team_service_personnel=[invalid,incomplete,ineligible]` 	| Prepopulate TSP with selections that are any combination of invalid and ineligible               	|
| Prop Crew                      	| `/pages/competition-registration-teams/[id]/prop_crew_error`                                                    	| Error loading Prop Crew                                                                          	|
| Prop Crew                      	| `/pages/competition-registration-teams/[id]/prop_crew_submit_error`                                             	| Error submitting change to Prop Crew                                                             	|
| Prop Crew                      	| `/pages/competition-registration-teams/[id]/prepopulate_prop_crew`                                              	| Prepopulate prop crew with valid selections                                                      	|
| Prop Crew                      	| `/pages/competition-registration-teams/[id]/prepopulate_prop_crew=[invalid,ineligible]`                         	| Prepopulate prop crew with selections that are any combination of invalid and ineligible         	|

When changing the team name on the Team Verification page, including 'error' in the team name will simulate a submission error

### Team Portal
The following URIs will simulate the following outcomes:

| Page                       | URI                                                                                                              | Outcome                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| My Competitions - Teams    | `/pages/my-competitions-teams/load_error`                                                                        | Error loading page                                                          |
| My Competitions - Teams    | `/pages/my-competitions-teams/no_team_competitions`                                                              | No competitions in list                                                     |
| Competition Team Personnel | `/pages/competitions/competition-team-personnel?id=10&teamId=1&ctp_unclean`                                      | Mix of non-compliant/ineligible selections                                  |
| Competition Team Personnel | `/pages/competitions/competition-team-personnel?id=10&teamId=1&no_prop_crew`                                     | Prop Crew Not Applicable to Team                                            |
| Competition Team Personnel | `/pages/competitions/competition-team-personnel?id=10&teamId=1&ctp_none`                                         | No Team Personnel Selected                                                  |
| Competition Team Personnel | `/pages/competitions/competition-team-personnel?id=10&teamId=1&ctp_submit_fail`                                  | Submission of change to personnel fails                                     |
| Competition Roster         | `/pages/competitions/competition-roster?id=10&teamId=1&cp_roster_noncompliant`                                   | Non-Compliant member in roster                                              |
| Competition Roster         | `/pages/competitions/competition-roster?id=10&teamId=1&cp_roster_ineligible`                                     | Ineligible member in roster                                                 |
| Competition Roster         | `/pages/competitions/competition-roster?id=10&teamId=1&cp_roster_length=`                                        | Roster of X length                                                          |
| Competition Roster         | `/pages/competitions/competition-roster?id=10&teamId=1&cp_roster_disabled`                                       | Roster can't be edited                                                      |
| Competition Roster         | `/pages/competitions/competition-roster?id=10&teamId=1&cp_roster_submit_fail`                                    | Failure upon roster change save                                             |
| Competition Portal Main    | `/CompetitionProfile/Index?id=1&cd_action`                                                                       | Display competition documents action required state                         |
| Competition Portal Main    | `/CompetitionProfile/Index?id=1&pi_perm_closing`                                                                 | Display practice ice credits and window closing state                       |
| Competition Portal Main    | `/CompetitionProfile/Index?id=1&pi_perm_raw`                                                                     | Display practice ice no credits purchased notice and window opening message |
| Competition Portal Main    | `/CompetitionProfile/Index?id=1&music_ppc_incomplete`                                                            | Display music and PPC item in incomplete status                             |
| Competition Portal Main    | `/CompetitionProfile/Index?id=1&teamId=2&roster_incomplete`                                                      | Display roster in incomplete status                                         |
| Competition Portal Main    | `/CompetitionProfile/Index?id=1&no_eligible_teams`                                                               | User doesn't manage any competition-eligible teams                          |
| Competition Portal Main    | `/CompetitionProfile/Index?id=1&team_registration_scenario=<openlate, default, closed, new, no_add, ineligible>` | Various For Teams CTA permutations                                          |

### Shift Selection

| Page                    | URI                                                                    | Outcome                                                               |
| ----------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Competition Portal Main | `/CompetitionProfile/Index?id=1&registered_volunteer`                  | Display mode with a registered volunteer (menu items show, cta hides) |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&load_error`                  | Error loading shift selection                                         |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&ss_unavailable`              | Shift Selection not available                                         |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&shift_selection_error`       | Error selecting shifts                                                |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&shift_remove_error`          | Error removing shifts                                                 |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&user_non_compliant`          | User is non-compliant                                                 |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&shift_selection_pending`     | Selections result in pending status                                   |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&ss_not_open`                 | Selection window not open                                             |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&shift_selection_past`        | All volunteer shifts occurred in the past                             |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&shift_selection_in_progress` | Some (but not all) volunteer shifts occurred in the past              |
| Shift Selection         | `/pages/competitions/shift-selection?id=1&shift_selection_today`       | First volunteer shift occurs today                                    |
| My Volunteer Schedule   | `/pages/competitions/volunteer-schedule?id=1&shift_remove_error`       | Error removing shift                                                  |

### Compliance Header

The following URIs will simulate the following outcomes:

| Page                                          | URI                                                                                                                               | Outcome                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Competition Portal Main/Subpages              | (`compliance_header_multirole`)`http://localhost:3000/CompetitionProfile/Index?id=999111999&teamId=2&compliance_header_multirole` | Simulate multi-role entity compliance item list in header |
| Competition Portal My Schedule Coach          | `/pages/coach-schedule?id=7&no_schedule`                                                                                          | No schedule available                                     |
| Competition Portal My Schedule Skater         | `/pages/my-schedule?id=7&no_schedule`                                                                                             | No schedule available                                     |
| Competition Portal Coach Competition Schedule | `pages/coach-competition-schedule?id=1&no_schedule`                                                                               | No schedule available                                     |
## Style Guide
A style guide featuring an outline of available site elements can be found at `src/views/style-guide.php` and is accessible 
at the url `/style-guide` when the Development Environment as described below is set up.  

## Frontend Development
### Getting Started
A development application based on [simple](https://github.com/rtmatt/simple) has been configured to streamline 
development.  Its use is optional, as all .php view files can easily be converted into HTML files by copying and pasting
 their contents.  If you are unable to use a PHP environment, you can skip the steps below referencing PHP and Composer.  

#### Prerequisites
* Node
* NPM
* Composer
* PHP >=5.4.0
#### Steps
1. Clone the repo
1. Install Frontend dependencies - `npm install`
 * This can take a while to run, and on Windows there's not any feedback for a few seconds. Trust that it's running. 
1. Install Backend dependencies - `composer install`
1. Configure Apache or Nginx with `public` as the directory root 

#### Additional Steps to Get Started on Windows
##### Git BASH
You will need Git BASH for BASH emulation used to run git and npm on the command line.  

Download and install git for windows, including Git BASH, from [here](https://git-scm.com/download/win)

Depending on your computer's settings, you may need to run Git BASH as an administrator.

##### Node/NPM
You will need node running within your environment in order to build site assets.  

1. Download the node installer  -  [link](https://nodejs.org/en/download/)
2. Use the wizard to install node.  Use all default options. 
3. Re-open the installer. 
 * Click "Change" button
 * Select "Add to PATH" option. 
 * Click next until complete.

Now you should have node installed.  Open Git BASH, and type `node -v`.  You should see the currently installed version of node. 

NPM should come pre-packaged with the latest version of Node.  You can check NPM is installed by running  `npm -v`.  
If NPM is installed, you should see the current version displayed. 

#### Check Everything
From within the project root, run `npm run dev`.  After a short while, the build should start and compile the site assets. 


### Stylesheets and Javascript
The JavaScript and stylesheet source files can be found in the `src` directory. After modifying these source files, you need to run a build to generate the public assets the app uses:

1. `src/js/app.js` => `public/js/app.js`
2. `src/js/login.js` => `public/js/login.js`
3. `src/sass/app.scss` => `public/css/app.css`

When each file is built, the Asset Manifest `public/mix-manifest.json` is also created.  It is a manifest file that maps versioned assets to their source files.

``` json
{
    "/js/main.js": "/js/main.js?id=<unique_version_hash>",
    "/css/main.css": "/css/main.css?id=<unique_version_hash>"
}
```

To load a versioned asset in a PHP template, use the `mix(<asset_public_path))` helper defined in `app/helpers.php`.  This will ensure the most up to date asset file is used.
For example, to load the app stylesheet:

``` php
<link rel="stylesheet" href="<?php echo mix('/css/app.css') ?>">
```
This will get the latest version hash from the Asset Manifest and resolve to

``` html
<link rel="stylesheet" href="/css/app.css?id=<version_from_manifest>">
```
Please note this requires the helper method is accessible in the PHP file.

``` php
require_once (__DIR__.'/../app/helpers.php');
```

Built assets can also be linked directly without the mix helper.


``` html 
<link rel="stylesheet" href="/css/app.css">
```



### Style Architecture
The SASS architecture of this project uses a modified version of the [7-1 Pattern](https://sass-guidelin.es/#the-7-1-pattern).  The master stylesheet is located at `src/sass/main.scss`.  This file imports all stylesheets necessary for the project.

An additional master stylesheet is located at `src/sass/style-guide.scss`.  This imports the main stylesheet and adds additional styles necessary for the style guide page. 

### JavaScript Architecture
Full description coming soon. The master JavaScript file is located at `src/js/main.ts`.  This file imports all Javascript files necessary for the project.

### View Architecture
The views for the project are located in the `src/views` directory.  

#### Layout Views
Each page of the app loads one of two master layouts:
1. `src/views/layouts/main.php` - Master layout after a user has logged in
1. `src/views/layouts/blank.php` - Master layout before a user has logged in

Each master layout references a header and (optional) footer partial:
1. `src/views/layouts/partials/header.php` - Header for logged in layout
1. `src/views/layouts/partials/footer.php` - Footer for logged in layout
1. `src/views/layouts/alternate-header.php` - Header for layout before a user has logged in

#### Page Views
Page files load into the content section of their associated layout files and map to urls based on their file path.  Pages have a 1-1 mapping from the domain root to the `src/views/` directory.  
For example, `src/views/pages/A.1_login.php` maps to a URL of `/pages/A.1_login`

For the sake of clean urls, some page files reference others.  For example, `src/views/Members/MemberHome.php` references `src/views/pages/A.3_members.only.landing.php`, allowing the members only landing page to display when accessing the url `/Members/MemberHome`

Wireframe document page filenames consist of their Wireframe page names (`A.1 - Login` => `src/pages/A.1_login.php`).

### Asset Builds
The frontend build process uses the [Laravel Mix](https://github.com/JeffreyWay/laravel-mix) wrapper around Webpack.

There are 3 types of builds:

1. `npm run dev` - Development build.
2. `npm run watch` - During development, watches files for changes and automatically runs a development build.
3. `npm run production` - Production build.

The code has been written in a build-agnostic manner. As such, you can replace the Laravel Mix build with a build 
process of your choice. Just be sure you are building the following assets:

1. `src/sass/main.scss`
1. `src/sass/style-guide.scss`
1. `src/js/main.ts`
1. `src/js/login.ts`

Additionally, the existing build process features the following that should be included to ensure asset integrity:

1. CSS [Autoprefixer](https://github.com/postcss/autoprefixer)
1. Typescript Compiling 
1. ES 2015 Compiling

The default build also enables the following optional features:
1. Minification
1. Uglification

### Build Configuration
#### Typescript Checking
Out of the box, the build has been configured to use the (Fork TS Checker Webpack Plugin)[https://github.com/Realytics/fork-ts-checker-webpack-plugin].
This plugin runs the TypeScript type checker on a separate process to speed up build times.
This can be turned off by setting the constant `TYPESCRIPT_SEPARATE_PROCESS` to `false` in `webpack.mix.js`

#### Hot Reloading
Out of the box, the build process has been configured to use hot reloading using Browsersync built in to Laravel Mix when
running `npm run watch`.
Hot reloading can be turned off by setting the constant `ENABLE_HOT_RELOAD` to `false` in `webpack.mix.js`
You will need to set the constant `LOCAL_URL` in `webpack.mix.js` to an appropriate proxy URL for this to function.

Additional documentation for Laravel Mix hot reloading can be found [here](https://laravel-mix.com/docs/2.1/browsersync)


##### Stylesheets and Javascript Notes
* Development builds will not minify or uglify stylesheets and JavaScript
* Production builds do minify and/or uglify stylesheets and javascript.
* Production builds run stylesheets through an auto-prefixer, so vendor prefixes will be added automatically and do not need to be included in source files

##### Commit Guidelines for Built Files
The following guidelines should be adhered to when dealing with `public/js/main.js`,`public/css/main.css`,`public/mix-manifest.json`

1. Do not commit any of the built files following a dev build.
2. Do not commit any of the built files along with changes to any source files
3. When committing built files, commit all changed built files together, with no other files, and use the commit message `fe build`.

## Code Style

This project uses [ESLint](https://eslint.org/) to enforce code style.

### Git Hooks

A pre-commit hook to enforce code style is included within this repository in the `githooks` directory. To install the hook,
run `cp githooks/pre-commit .git/hooks && chmod +x .git/hooks/pre-commit` from the root of the project.

Once installed, eslint will run against files being committed and block the commit if they do not meet the proper code style.

Occasionally, you may be trying to commit a file that does not require linting. You can either add the file to `.eslintignore`
at the root of this project, or commit the file using `git commit --no-verify`.

## Complete Structure

```
.
├── app.......................................................Development App Backend Files
│   ├── helpers.php
│   ├── PagesController.php
│   └── routes.php
├── public....................................................Public Root.  Contains all built assets
│   ├── css...................................................Compiled Style Assets
│   │   ├── main.css
│   │   └── style-guide.css
│   ├── fonts.................................................Fonts needed for site
│   │   ├── Futura Std Book.otf
│   │   └── Futura Std Book.woff
│   ├── images................................................Public Image Root
│   │   [...]
│   ├── index.php.............................................Development App Entry Point
│   ├── js....................................................Compiled JavaScript Assets
│   │   ├── login.js
│   │   └── main.js
│   └── mix-manifest.json
├── src.......................................................Source File Root
│   ├── js....................................................JavaScript source file root
│   │   ├── bootstrap.ts
│   │   ├── components
│   │   │   ├── Accordion.vue
│   │   │   ├── CompetitionDetail.vue
│   │   │   ├── CompetitionList.vue
│   │   │   ├── IncrementInput.vue
│   │   │   ├── LoginForm.vue
│   │   │   ├── PasswordReset.vue
│   │   │   ├── SiteHeader.vue
│   │   │   ├── SiteOverlay.vue
│   │   │   ├── Tabs.vue
│   │   │   └── Tab.vue
│   │   ├── config
│   │   │   └── AppConfig.ts
│   │   ├── directives
│   │   │   └── NumberInput.vue
│   │   ├── login.ts..........................................Master File for pre-login scripts
│   │   ├── main.ts...........................................Master File for post-login scripts
│   │   ├── mocks.............................................Data mocks for development
│   │   │   └── CompetitionData.ts
│   │   ├── models............................................JavaScript Object Models
│   │   │   └── Competition.ts
│   │   ├── services..........................................JavaScript Services
│   │   │   └── CompetitionService.ts
│   │   └── store.............................................JavaScript State Management
│   │       └── index.ts
│   ├── sass..................................................Style Source Root
│   │   ├── abstracts
│   │   │   ├── _icons.scss
│   │   │   ├── _mixins.scss
│   │   │   ├── _transitions.scss
│   │   │   └── _variables.scss
│   │   ├── base
│   │   │   ├── _baseline.scss
│   │   │   ├── _forms.scss
│   │   │   ├── _overrides.scss
│   │   │   └── _typography.scss
│   │   ├── components
│   │   │   ├── _accordion.scss
│   │   │   ├── _competition-summary.scss
│   │   │   ├── _nav-list.scss
│   │   │   ├── _panel-link.scss
│   │   │   └── _site-overlay.scss
│   │   ├── framework
│   │   │   ├── _accordion.scss
│   │   │   ├── _buttons.scss
│   │   │   ├── _forms.scss
│   │   │   ├── _grid.scss
│   │   │   ├── _increment-input.scss
│   │   │   ├── _navbar.scss
│   │   │   ├── _nav-toggle.scss
│   │   │   ├── _tabs.scss
│   │   │   ├── _typography.scss
│   │   │   └── _utils.scss
│   │   ├── layout
│   │   │   ├── _global.scss
│   │   │   ├── _site-footer.scss
│   │   │   ├── _site-header.scss
│   │   │   └── _site-menu.scss
│   │   ├── main.scss.........................................Master File for Stylesheets
│   │   ├── pages
│   │   │   ├── _competition-detail.scss
│   │   │   ├── _login.scss
│   │   │   └── _page.scss
│   │   ├── style-guide.scss..................................Master File for Style Guide Stylesheet
│   │   ├── utils
│   │   └── vendors
│   │       └── _reset.scss
│   ├── views.................................................View Source Root
│   │   ├── 404.php
│   │   ├── CompetitionProfile
│   │   │   └── Index.php
│   │   ├── layouts...........................................Layout master layout files
│   │   │   ├── blank.php
│   │   │   ├── main.php
│   │   │   └── partials......................................Layout master partials
│   │   │       ├── alternate-header.php
│   │   │       ├── footer.php
│   │   │       └── header.php
│   │   ├── Members
│   │   │   └── MemberHome.php
│   │   ├── pages
│   │   │   ├── A.1_login.php
│   │   │   ├── A.2_password.recovery.php
│   │   │   ├── A.3_members.only.landing.php
│   │   │   ├── B.1_my.competitions.php
│   │   │   ├── C.1_competition_details.php
│   │   │   ├── competition-information.php
│   │   │   ├── login.php
│   │   │   ├── my-competitions.php
│   │   │   ├── my-schedule.php
│   │   │   ├── practice-ice-schedule.php
│   │   │   └── reset-password.php
│   │   └── style-guide.php
│   └── vue-shims.d.ts........................................Shim to aid in typescript compilation of .vue files
├── tsconfig.json.............................................Typescript Config
└── webpack.mix.js............................................Build Config
```
