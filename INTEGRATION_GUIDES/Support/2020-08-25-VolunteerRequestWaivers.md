# Volunteer Opportunity Waivers 2020-08-25

## Purpose

This document aids in the process of integration of isolated frontend development assets with a backend environment for
an update to Volunteer Opportunity requests to include user completion of waivers.

## Changelog

Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Summary of Changes

This update adds a third screen to the Volunteer Request flow in which users must complete waivers before submitting the
request. This addition was made through the following changes:

### API

1. Addition of `waivers` property to `FetchVolunteerRequestDataAPIResponse` returned by the "Fetch Volunteer Request
   Data" API endpoint (`INTEGRATION_GUIDES/Release3/r3.3.0_INTEGRATION_VolunteerOpportunitiesAPI.md:120`,
   `INTEGRATION_GUIDES/16_INTEGRATION-SCHEDULE-ACCESS.md:112`).
   - The change has been formulated to be non breaking. If this property is not provided in the response, the waivers
     screen will simply show the Terms and Conditions inputs.
1. Addition of a `waivers` property to the `SubmitVolunteerRequestAPIPayload` request payload sent to the "Submit
   Volunteer Request" (`INTEGRATION_GUIDES/Release3/r3.3.0_INTEGRATION_VolunteerOpportunitiesAPI.md:359`) and "Submit
   Competition Volunteer Request" (`INTEGRATION_GUIDES/Release3/ScheduleAccess/ScheduleAccessAPI.md:46`) API endpoints.

### Client App

1. Creation and registration of `Waivers` list component
   - `src/js/components/Waivers.vue`
   - Registered in `src/js/bootstrap.ts`
1. Revised Volunteer Opportunities Request component
   (`src/js/components/VolunteerOpportunities/VolunteerOpportunitiesRequest.vue`) to add waivers screen and handle data
   workflows
1. Revised `src/js/adaptors/APIAdaptors/VolunteerOpportunitiesAPIAdaptor.ts` to facilitate changes to API fetch and
   submission transformations.
1. Revised Volunteer Request Experience Form component
   (`src/js/components/VolunteerOpportunities/VolunteerRequestExperienceForm.vue`)
   - Removed Terms & Conditions confirmation inputs (moved to new waivers form component)
   - Changed button text to "Continue"
   - Revised related form classes to account for changes (`src/js/models/Forms/VolunteerRequestExperienceFormState.ts`,
     `src/js/models/Forms/VolunteerRequestExperienceFormValidator.ts`)
1. Added Volunteer Request Waivers component (`src/js/components/VolunteerOpportunities/VolunteerRequestWaivers.vue`)
   - Contains Terms & Conditions confirmation inputs removed from Volunteer Request Experience Form
   - Created associated form classes (`src/js/models/Forms/VolunteerRequestWaiversFormState.ts`,
     `src/js/models/Forms/VolunteerRequestWaiversFormValidator.ts`)
1. Create global Volunteer Request form class to contain all request data
   (`rc/js/models/Forms/VolunteerRequestFormState.ts`)
   - Update State Module (`src/js/store/Modules/VolunteerOpportunitiesState.ts`) and API Services
     (`src/js/services/CompetitionService.ts`,`src/js/services/VolunteerOpportunitiesService.ts`) to use new exported
     data interface
1. Updated State Module (`src/js/store/Modules/VolunteerOpportunitiesState.ts`) to track information about waivers
   related to a volunteer request
1. Updated stylesheets to account for changes
   - `src/sass/components/volunteer-opportunities/_volunteer-request-experience-form.scss`

### Templates

1. Updated volunteer opportunities page template (`src/views/pages/M.1_volunteer-opportunities.php`) so
   `volunteer-opportunities-request` component element does not call an inline-template
1. Deleted (previously-deprecated, now-outdated) volunteer opportunities request component template partial
   (`src/views/pages/partials/volunteer-opportunities/M.3_volunteer-opportunities-request.php`)

## Integration Steps

1. Import ClientApp changes:
   - [Modified] src/js/adaptors/APIAdaptors/VolunteerOpportunitiesAPIAdaptor.ts
   - [Modified] src/js/bootstrap.ts
   - [Modified] src/js/components/VolunteerOpportunities/VolunteerOpportunitiesRequest.vue
   - [Modified] src/js/components/VolunteerOpportunities/VolunteerRequestExperienceForm.vue
   - [Added] src/js/components/VolunteerOpportunities/VolunteerRequestWaivers.vue
   - [Added] src/js/components/Waivers.vuev
   - [Modified] src/js/contracts/app/VolunteerOpportunitiesContracts.ts
   - [Modified] src/js/contracts/release3/api/VolunteerOpportunitiesAPIContracts.ts
   - [Modified] src/js/models/Forms/VolunteerRequestExperienceFormState.ts
   - [Modified] src/js/models/Forms/VolunteerRequestExperienceFormValidator.ts
   - [Added] src/js/models/Forms/VolunteerRequestFormState.ts
   - [Added] src/js/models/Forms/VolunteerRequestWaiversFormState.ts
   - [Added] src/js/models/Forms/VolunteerRequestWaiversFormValidator.ts
   - [Modified] src/js/services/CompetitionService.ts
   - [Modified] src/js/services/VolunteerOpportunitiesService.tsv
   - [Modified] src/js/store/Modules/VolunteerOpportunitiesState.ts
   - [Modified] src/sass/components/volunteer-opportunities/\_volunteer-request-experience-form.scss
1. Remove `inline-template` attribute and definition from Volunteer Opportunities Page template
   (`src/views/pages/M.1_volunteer-opportunities.php` in this repository)
   - If desired, this will result in the associated template being obsolete, and it can be deleted
     (`src/views/pages/partials/volunteer-opportunities/M.3_volunteer-opportunities-request.php` in this repository)
1. Make API changes outlined below

## API Changes

### [Extended] "Fetch Volunteer Request Data"

The `FetchVolunteerRequestDataAPIResponse` returned by the "Fetch Volunteer Request Data" endpoint
(`INTEGRATION_GUIDES/Release3/r3.3.0_INTEGRATION_VolunteerOpportunitiesAPI.md:120`,
`INTEGRATION_GUIDES/16_INTEGRATION-SCHEDULE-ACCESS.md:112`) has been extended to include a `waivers` property. This
property is used to populate the Waivers screen of a volunteer request.

Notes:

1. This change is non-breaking. If the waivers property is not returned in the response, the user will still be able to
   complete a volunteer request, but will not need to complete any waivers in order to do so.
1. The relationships `FormOptionData` options and the `UserWaiverData` schema were defined in a previous release and are
   not changed as part of this release.

```
/**
 * Response when retrieving information enabling a user to pursue an volunteer request opportunity
 */
export interface FetchVolunteerRequestDataAPIResponse {
    // Previous Properties Unchanged
    waivers: {
        form_options: {
            relationships: FormOptionData[];                      // Form options for "relationship" inputs
        };
        user_waivers: UserWaiverData[];                           // List of waivers to display, and user's signing data relative to each
        introduction: string;                                     // Introductory text for "Waivers" section of request.
    };
}
```

### [Extended] "Submit Volunteer Request"

The `SubmitVolunteerRequestAPIPayload` request payload sent to the "Submit Volunteer Request"
(`INTEGRATION_GUIDES/Release3/r3.3.0_INTEGRATION_VolunteerOpportunitiesAPI.md:359`) endpoint has been extended to
include a `waivers` property.

Notes:

1. If the `waivers` property is not returned by the "Fetch Volunteer Request Data" endpoint, this property in the
   submission payload will contain an empty array.
1. The `UserWaiverSaveData` schema was defined in a previous release and is not changed as part of this release.

```
/**
 * Payload when submitting a volunteer request
 */
export interface SubmitVolunteerRequestAPIPayload {
     // Previous Properties Unchanged
    waivers: UserWaiverSaveData[];                      // Information related to the user's waivers
}
```

### [Extended] "Submit Competition Volunteer Request"

The `SubmitVolunteerRequestAPIPayload` request payload sent to the "Submit Competition Volunteer Request"
(`INTEGRATION_GUIDES/Release3/ScheduleAccess/ScheduleAccessAPI.md:46`) endpoint has been extended to include a `waivers`
property.

Notes:

1. If the `waivers` property is not returned by the "Fetch Volunteer Request Data" endpoint, this property in the
   submission payload will contain an empty array.
1. The `UserWaiverSaveData` schema was defined in a previous release and is not changed as part of this release.

```
/**
 * Payload when submitting a volunteer request
 */
export interface SubmitVolunteerRequestAPIPayload {
     // Previous Properties Unchanged
    waivers: UserWaiverSaveData[];                      // Information related to the user's waivers
}
```
