# Series Registration API - Series Application

## Purpose
This document outlines API additions related to the “Series Registration” release “Series Application” page.

## API Endpoints

### Fetch Series Registration Series Application

**Purpose:** Fetch information for the "Series Application" page for a series

**Source:** "Series Application" page load

**URL:** `GET:/api/series-registration/${series.id}/application`

**Request Payload:** `none`

**Response:** `SeriesApplicationApi.FetchApplicationAPIResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading series application.").
1. There are various points of related data within this response. Be sure that any `discipline_id` properties correspond with the `id` of a discipline within the series application configuration 
1. In the event a user becomes ineligible for any elements within their application, such elements should be removed from the the application data prior to its being returned by this endpoint


### Update Series Registration User Profile

**Purpose:** Update the active user's profile relative to a series registration

**Source:** "Series Application" page email edit form submission

**URL:** `PATCH:/api/series-registration/${series_id}/profile`

**Request Payload:** `SeriesApplicationApi.UpdateProfileAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**
1. The only field present in the submission payload at this time is the user's email address, but additional fields can be added in the future if the need arises.
1. If the submission is unsuccessful, the interface will display an error message above the “save” button. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display ("Error updating email address").


### Fetch Series Application Coach Search Form Options

**Purpose:** Fetch form options for the Coach Search form on a Series Application

**Source:** "Series Application" page "Add Coach" search form load

**URL:** `GET: /api/series-registration/${series_id}/coach-search`

**Request Payload:** `none`

**Response:** `SeriesApplicationApi.CoachSearchFormOptionsAPIResponse`

**Notes:**
1. If this request fails, it will fail silently and the member search "State" field will not contain any options


### Run Series Application Coach Search

**Purpose:** Run the series application coach search

**Source:** "Series Application" page "Add Coach" search form submit

**URL:** `POST: /api/series-registration/${series_id}/coach-search`

**Request Payload:** `MemberSearchAPIParameters`

**Response:** `SeriesApplicationApi.CoachSearchAPIResponse`

**Notes:**
1. This request uses the pre-existing `MemberSearchAPIParameters` request and `MemberSearchResultAPIResponse` response structures. 



### Fetch Series Application Partner Search Form Options

**Purpose:** Fetch state form options for the Partner Search form on a Series Application

**Source:** "Series Application" page "Add Partner" search form load

**URL:** `GET: /api/series-registration/${series_id}/partner-search`

**Request Payload:** `none`

**Response:** `SeriesApplicationApi.PartnerSearchFormOptionsAPIResponse`

**Notes:**
1. If this request fails, it will fail silently and the member search "State" field will not provide any options


### Run Series Application Partner Search

**Purpose:** Run the series application partner search

**Source:** "Series Application" page "Add Partner" search form submit

**URL:** `POST: /api/series-registration/${series_id}/partner-search/discipline/${discipline_id}`

**Request Payload:** `MemberSearchAPIParameters`

**Response:** `SeriesApplicationApi.PartnerSearchAPIResponse`

**Notes:**
1. This request uses the pre-existing `MemberSearchAPIParameters` request structure.
1. The response structure is an extension of the pre-existing `MemberSearchResultAPIResponse`
    * The individual results in the response contain an additional property that includes information about the result's level eligibility relative to the discipline specified in the URL.  


### Add Series Application Skate Test

**Purpose:** Add a skate test to a user's skate test history from the Series Application Page.  Get updated application information

**Source:** Series Application Skate Tests Component Add Test Form submission

**URL:** `POST: /api/series-registration/${series_id}/skate-test-history`

**Request Payload:** `UserAddSkateTestAPIPayload`

**Response:** `SeriesApplicationApi.AddSkateTestAPIResponse`

**Notes:**
1. The request payload and primary response are unchanged from previous implementations of skate test history functionality.
1. The response body extends previous data structures to contain information about changes in level eligibility resulting from the submission.


### Remove Series Application Skate Test

**Purpose:** Remove a skate test from a user's skate test history from the Series Application Page.  Get updated application information

**Source:** Series Application Skate Tests Component Remove Test button click

**URL:** `DELETE: /api/series-registration/${series_id}/skate-test-history`

**Request Payload:** `UserRemoveSkateTestAPIPayload`

**Response:** `SeriesApplicationApi.RemoveSkateTestAPIResponse`

**Notes:**
1. The request payload and primary response are unchanged from previous implementations of skate test history functionality.
1. The response body extends previous data structures to contain information about changes in level eligibility resulting from the submission.


### Save Series Application

**Purpose:** Save a series application for a user

**Source:** Series application save button click

**URL:** `POST: /api/series-registration/${series_id}/application`

**Request Payload:** `SeriesApplicationApi.SaveApplicationAPIPayload`

**Response:** `SeriesApplicationApi.SaveApplicationAPIResponse`

**Notes:**
1. If the submission is unsuccessful, the interface will display an error message within an overlay. If a 2xx response code is sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will display (“Error saving application.”)
1. This endpoint is shared between the "save" and "pay" buttons on the series application page.  The `cart_link` property in the response body is only used when the "pay" button is clicked.