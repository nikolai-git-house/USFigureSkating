# Competition Documents API Changes/Additions

This document outlines API changes and additions related to the "Schedule Access" release.

## API Endpoints

### [NEW] Fetch Competition Search Competitions

**Purpose:** Fetch list of competitions available for display on the Search Competitions page

**Source:** Search Competitions page load

**URL:** `GET: /api/search-competitions`

**Request Payload:** `none`

**Response:** `FetchSearchCompetitionListAPIResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message (`Error loading competitions.`).
1. If the response contains an empty list, a message will display in the interface:
   `There are no competitions currently available. Check back again.`
1. Data elements should be returned in the desired display order.
1. This endpoint simply returns the list of competitions available for display on the search competitions page. Filtering will take place client side.

### [NEW] Fetch View Competition Competition

**Purpose:** Fetch Competition data for the View Competition page

**Source:** View Competition page load

**URL:** `GET: /api/view-competition/${competition_id}`

**Request Payload:** `none`

**Response:** `FetchViewCompetitionAPIResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message
   (`Error loading competition information.`).

### [NEW] Submit Competition Volunteer Request

**Purpose:** Submit a volunteer request for a competition from the View Competition page

**Source:** Volunteer Request component submit from View Competition Page

**URL:** `POST: /api/competitions/${competition_id}/volunteer-request`

**Request Payload:** `SubmitVolunteerRequestAPIPayload`

**Response:** `SubmitCompetitionVolunteerRequestAPIResponse`

**Notes:**

1. This API endpoint has been created as a parallel to the previously established "Submit Volunteer Request" API endpoint
   because of a difference in necessary response data.
1. Request payload was previously established and remains unchanged.
1. If the submission is unsuccessful, the interface will display an error message below the "Submit Request" button.
   If a 2xx response code is sent with a value in the response `error` key, the provided message will display.
   Otherwise, a generic message will display (`Error submitting request.`)
1. [Update 2020-10-19] - A `competition_user_navigation:DataNavigationLinkData.DataNavigationLink[]` optional property
   has been added to this response. If provided, it will be used to update the navigation stack on the page. This
   property should contain the entire navigation, not just the updated items.

### [Updated] Fetch Volunteer Request Data

**Purpose:** Retrieve information enabling a user to pursue an volunteer request opportunity, including user profile and request form options

**Source:** Initiate a Volunteer Request

**URL:** [UNCHANGED] `GET /api/volunteer-request/{competition_id}/profile`

**Request Payload:** [UNCHANGED] `none`

**Response:** [EXTENDED] `FetchVolunteerRequestDataAPIResponse`

**Notes:**

1. Response has been updated to include an additional `links` property. See "API Changes" section of `INTEGRATION_GUIDES/16_INTEGRATION-SCHEDULE-ACCESS.md`
   for more information

### Existing Volunteer Request Endpoints

Unless otherwise outlined in this document, pre-existing Volunteer Opportunity endpoints remain unchanged.

### [NEW] Fetch Competition Page Heading

**Purpose:** Fetch data to populate the Competition Heading component on a page

**Source:** Various. As of this writing:

1. Competition Contacts Page load, for competitions not in user competition list
1. Competition Schedule Page load, for competitions not in user competition list

**URL:** `GET: /api/competitions/${competition.id}/page-heading`

**Request Payload:** `none`

**Response:** `FetchCompetitionPageHeadingAPIResponse`

**Notes:**

1. On an applicable page, the frontend will first attempt to populate the Competition Heading on the page with competition
   information present in the user's Competition List. If the Competition for the page is not in the user's Competition List,
   this endpoint will be queried to retrieve data for the Competition Heading.
1. If the competition for a page is not in the user's Competition List, and information is not returned by this endpoint
   or the request fails, the competition heading will not display.

### [EXTENDED] Get Competition Schedule

**Purpose:** [EXTENDED] Return the schedule and associated data for a competition; Respond with flag when competition schedule is not available

**Request Payload:** [UNCHANGED]`none`

**Response:** [NEW]`FetchCompetitionScheduleAPIResponse`

**Notes:**

1. Response has been extended to return a `FetchAvailableCompetitionScheduleAPIResponse` when the schedule is available
   or a `FetchUnavailableCompetitionScheduleAPIResponse` if the schedule is not available.
1. `CompetitionScheduleData` has been extended to include optional `legend` and `links` properties.
   - If `legend` property is not included in the response, the legend on the Competition Schedule page will not show
   - If `links` property is not included in the response, or it doesn't contain a `download_schedule` value,
     the download schedule link on the Competition Schedule will display, but will be disabled.