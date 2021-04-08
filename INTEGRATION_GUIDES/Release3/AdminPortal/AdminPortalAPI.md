# Admin Portal API Documentation

## Competition Management

### Competition Management Fetch Competition Lists

**Purpose:** Fetch admin list of upcoming and past competitions.

**Source:** “Competition Management” page load (contains “Upcoming” and “Past” competition lists)

**URL:** `GET: /api/competition-management/competitions`

**Request Payload:** `none`

**Response:** `CompetitionManagementFetchCompetitionListAPIResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the component will display a generic message (“Error loading competitions.”).
1. If either upcoming or past competition list is empty, a message will display in the appropriate tab (“There are no <upcoming/past> competitions configured.”).

### Competition Management Fetch Active Competition

**Purpose:** Fetch the active competition data to power the competition management experience.

**Source:**

1. Competition Management Competition Index Page Load (when acting as an SPA)
1. Competition Management Information, Compliance, Contacts, or Check-In page load (when acting as an MPA)

**URL:**

1. State-based: `/api/competition-management/active-competition`
1. Stateless: `/api/competition-management/competitions/${competition.id}`

**Request Payload:** `none`

**Response:** `FetchActiveCompetitionManagementCompetitionAPIResponse`

**Notes:**

1. Two options for endpoint URLs are available:
   1. State-based
      - This endpoint does not accept a competition id URL segment, and returns the information based on the active user's session.
   1. Stateless
      - This endpoint accepts a competition id URL segment, and returns information based on this id
      - To enable this version...
        1. When a user accesses a page within the competition management experience for a competition, a cookie should be sent including that competition's id.
        1. Within `src/js/config/AppConfig.ts`, set `COMPETITION_MANAGEMENT_COOKIE_NAME` to the name of this cookie.
1. The Competition Management Competition Index supports functioning as both an SPA and as a MPA. To enable SPA loading of a sub-component, the link data for the component (CompetitionManagementCompetitionIndexLinkData) should contain an appropriate component_link key. Current valid keys are 'competition-information', 'compliance', 'competition-contacts' and 'check-in';
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the component will display a generic message
   1. When acting as an SPA - “Error loading competition.”
   1. When acting as an MPA - “Error loading <page name>.”

### Competition Management Fetch Competition Information

**Purpose:** Fetch Admin information about a competition, including information about registrant counts, registration timelines, deadlines, practice ice windows and volunteer timelines.

**Source:** Admin Portal “Competition Information” page load.

**URL:** `GET: /api/competition-management/competitions/${competition.id}/information`

**Request Payload:** `none`

**Response:** `FetchCompetitionManagementCompetitionInformationAPIResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the component will display a generic message (“Error loading competition information.”).

## Check-In Index

### Check-In Fetch Entities

**Purpose:** Get the entities list for the check-in page.

**Source:** Check-in page load

**URL:** `GET: /api/competitions/${competition.id}/check-in`

**Request Payload:** `none`

**Response:** `FetchCheckInEntitiesAPIResponse`

**Notes:**

1. This assumes the “check-in report” link target will be associated with the competition data. If this shouldn’t be the case, this information should be loaded at this time as well
1. App-side, all Check-in Entities extend from a common abstract class. If a property is not present on an entity’s respective data interface, that property is set to a falsy value in the App instance class. For example, since phone and email information does not show on the Entity Check-in Page for Skater entities, these properties are always set to null in the Skater instance class.
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (“Error loading check-in.”).
1. If the response contains an empty list, a message will display in the interface “Check-in is currently unavailable”

### Check-In Fetch Email Configuration

**Purpose:** Fetch the options for BCC and CC email recipients, as well as any attachment validation rules, for the Check-In email form

**Source:** Check-in Email component load

**URL:** `GET: /api/competitions/${competition.id}/check-in/email`

**Request Payload:** `none`

**Response:** `FetchCheckInEmailConfigurationAPIResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the component will display a generic message (“Error loading email form.”).
1. The example response previously outlined remains unchanged, although an optional new property has been added to the response payload.

### Check-In Email Submit

**Purpose:** Submit a Check-in email

**Source:** Check-in Email component “send” email click

**URL:** `POST: /api/competitions/${competition.id}/check-in/email`

**Request Payload:** `SubmitCheckInEmailAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. In order to facilitate attachments, this request will be submitted with a Content-Type of multipart/form-data.
1. Data will be present in the keys identified in the SubmitCheckInEmailAPIPayload structure.
1. If the submission is unsuccessful, the interface will display an error message above the “send” button. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error sending email.”)

### Fetch Entity Check-In

**Purpose:** Fetch data necessary to initiate the entity check-in process

**Source:** Check-In page Entity Card "Check-In" button click

**URL:** `GET:/api/competitions/{competition_id}/check-in/{entity_id}`

**Request Payload:** `none`

**Response:** `FetchCheckInEntityApiResponse`

**Notes:**
1. As of this writing, this endpoint has been created to reduce the server processing necessary to return `is_compliant`
information for each entity in the "Check-In" page list.  As such, the only property currently being returned by this endpoint is
`is_compliant`, which indicates whether the entity is or is not compliance-complete.
1. As a part of potential future optimizations, this endpoint may be extended in the future to return additional information that is not
needed upon "Check-In" load that is needed for "Entity Check-In" in order to further reduce the page load time for "Check-In".

### Check-In Check in Entity

**Purpose:** Check an Entity in

**Source:** Check-in Entity Index “Check-in” button click for an entity

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/check-in`

**Request Payload:** `CheckEntityInAPIPayload`

**Response:** `CheckEntityInAPIResponse`

**Notes:**

1. If the submission is unsuccessful, the interface will display an error message above the “check-in” button. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error checking the {entity type} in.”)

### Check-In Undo Check in Entity

**Purpose:** Undo the check-in for an Entity

**Source:** Check-in Index “Undo Check-in” button click

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/undo-check-in`

**Request Payload:** `none`

**Response:** `APISubmissionResponse`

**Notes:**

1. Upon a successful response, the App will set the CheckInEntityCheckInStatusData on the entity to a non-checked in state (all boolean properties false, and all nullable properties null).
1. If the submission is unsuccessful, the interface will display an error message above the “check-in” button. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error undoing the check-in for the {entity type}.”)

## Entity Check-In - Comments

### Entity Check-In Fetch Comments

**Purpose:** Fetch comments data for a check-in entity

**Source:** Check-in Comments subpage load

**URL:** `GET: /api/competitions/${competition.id}/check-in/${entity.id}/comments`

**Request Payload:** `none`

**Response:** `FetchEntityCommentsAPIResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (“Error loading comments.”).
1. If the response contains an empty list for the comments, a message will display in the interface “No comments for {{active_entity_name}} yet.”
1. Data elements should be returned in the desired display order

### Entity Check-In Submit Comment

**Purpose:** Add a check-in comment for an entity

**Source:** Valid Check-in Comments subpage “add” button click

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/comments`

**Request Payload:** `SubmitEntityCommentAPIPayload`

**Response:** `EntityCommentAPISubmissionResponse`

**Notes:**

1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Add” button. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error saving comment.”)
1. The frontend will increment the total comment count on the active entity following a successful submission.
1. The frontend will rely on backend response data to add the new comment to the UI.

## Entity Check-In - Compliance

### Entity Check-In Fetch Compliance

**Purpose:** Fetch compliance information for an entity being checked in

**Source:** Check-in Compliance Subpage

**URL:** `GET: /api/competitions/${competition.id}/compliance/${entity.id}`

**Request Payload:** `none`

**Response:** `FetchEntityComplianceAPIResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the Compliance subpage will display a generic message (“Error loading compliance information.”).

### Entity Check-In Override Compliance Item

**Purpose:** Override the compliance of an item for an entity

**Source:** Check-in Compliance Sub-page "Viewed" checkbox click

**URL:** `POST: /api/competitions/${competition.id}/compliance/${entity.id}/override`

**Request Payload:** `OverrideComplianceItemAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. The frontend will determine whether this change results in the entity becoming overall-compliant.
1. If the submission is unsuccessful, the interface will display an error message below the “Viewed” input. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error overriding compliance item.”)

## Entity Check-In - Events

### Entity Check-In Fetch Events

**Purpose:** Fetch the events list for a check-in entity

**Source:** Check-in Events Subpage load

**URL:** `GET: /api/competitions/${competition.id}/check-in/${entity.id}/events`

**Request Payload:** `none`

**Response:** `FetchEntityEventsAPIResponse`

**Notes:**

1. “check_in_entity_id” refers to the unique identifier associated with the entity being checked in
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (“Error loading events.”).
1. If the response contains an empty list, a message will display in the interface “{active_entity_name} is not registered for any events in this competition.”
1. Data elements should be returned in the desired display order

### Entity Check-In Override Event Segment Music Status

**Purpose:** Mark an event’s incomplete Music requirement as “viewed”

**Source:** Check-in Events Sub-page Event Segment Music "Viewed" checkbox click

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/override-music`

**Request Payload:** `OverrideCheckInEventSegmentMusicPpcItemAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. The frontend will determine whether this change results in the entity becoming overall-events-complete (determined if Music/PPC is either complete, overridden or not required for each segment within each event).
1. If the submission is unsuccessful, the interface will display an error message below the “Viewed” input. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error saving Music override.”)

### Entity Check-In Override Event Segment PPC Status

**Purpose:** Mark an event’s incomplete PPC requirement as “viewed”

**Source:** Check-in Events Sub-page Event PPC "Viewed" checkbox click

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/override-ppc`

**Request Payload:** `OverrideCheckInEventSegmentMusicPpcItemAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. The frontend will determine whether this change results in the entity becoming overall-events-complete (determined if Music/PPC is either complete, overridden or not required for each segment within each event).
1. If the submission is unsuccessful, the interface will display an error message below the “Viewed” input. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error saving PPC override.”)

## Entity Check-In - Roster

### Entity Check-In Fetch Roster

**Purpose:** Fetch information required to power the roster subpages of check-in

**Source:** Check-in Roster subpage load

**URL:** `GET: /api/competitions/${competition.id}/check-in/${entity.id}/roster`

**Request Payload:** `none`

**Response:** `FetchEntityRosterInformationAPIResponse`

**Notes:**

1. Entities for competition roster and the full team roster exist in one shared set of objects, and the competition roster is identified through an array of skater IDs.
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (“Error loading roster.”).
1. If the response contains an empty list for the competition roster, a message will display in the interface “There are no skaters in the competition roster.”
1. If the response contains an empty list for the full team roster, a message will display in the interface “There are no skaters in the team roster.”
1. Data elements should be returned in the desired display order
1. If the response contains an empty list for the roster rules, rules will not display

### Entity Check-In Roster Update

**Purpose:** Update an entity’s competition roster

**Source:** Check-in Edit Roster subpage “Confirm Roster” button click

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/roster`

**Request Payload:** `UpdateEntityCompetitionRosterAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Confirm Roster” button. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error updating roster.”)
1. The frontend will rely on the backend to validate that all applicable roster requirements have been met. If there are errors resulting from this validation, a 2xx response code should be sent with a message indicating the validation errors in the response error key. This message will be displayed in the UI.

## Entity Check-In - Skaters

### Entity Check-In Fetch Coached Skaters

**Purpose:** Fetch information about the skaters for an entity being checked in

**Source:** Check-in Skaters subpage

**URL:** `GET: /api/competitions/${competition.id}/check-in/${entity.id}/skaters`

**Request Payload:** `none`

**Response:** `FetchEntityCoachedSkatersAPIResponse`

**Notes:**

1. “check_in_entity_id” refers to the unique identifier associated with the entity being checked in
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (“Error loading skaters.”).
1. If the response contains an empty list, a message will display in the interface “{entity_name} is not coaching any skaters for this competition.”
1. Skaters should be returned in the desired display order

## Entity Check-In - Skater Coaches

### Entity Check-In Fetch Skater Coaches

**Purpose:** Fetch the information related to the check-in entity’s current coach-event assignment.

**Source:** Check-in Skater-Coaches Subpage

**URL:** `GET: /api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches`

**Request Payload:** `none`

**Response:** `FetchEntitySkaterCoachInformationAPIResponse`

**Notes:**

1. “check_in_entity_id” refers to the unique identifier associated with the entity being checked in
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (“Error loading coaches.”).
1. If the response contains an empty list of events, a message will display in the interface “No coach selections available.”

### Entity Check-In Fetch Skater Coach Search Form Options

**Purpose:** Load form options for search when modifying a check-in entity’s coaches

**Source:** Check-in Skater Coaches Subpage - add/replace coach search form load.

**URL:** `GET: /api/form-options/coaches`

**Request Payload:** `none`

**Response:** `FetchEntitySkaterCoachSearchFormOptionsAPIResponse`

**Notes:**

1. “check_in_entity_id” refers to the unique identifier associated with the entity being checked in
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (“Error loading search form.”).
1. This API call only fires when the search form is loaded for the first time since it loads a result that is not unique to the active check-in entity. Subsequent form load events will use data loaded from this first call.

### Entity Check-In Skater Coach Search

**Purpose:** Search for coaches to select for a check-in entity

**Source:** Check-in Skater Coaches Subpage Search form submission.

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches/search`

**Request Payload:** `MemberSearchAPIParameters`

**Response:** `MemberSearchResultAPIResponse`

**Notes:**

1. If the response contains zero results, a message will show on the search form “No results found.”
1. If the submission results in an error for any reason, the search form will display an error message “Search error. Please try again.”

### Entity Check-In Skater Coach Add

**Purpose:** Add a coach to an event category for a check-in entity.

**Source:** Check-in Skater Coaches search results “add” button following a search to add a new coach.

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches`

**Request Payload:** `AddEntitySkaterCategoryCoachAPIPayload`

**Response:** `AddEntitySkaterCategoryCoachAPIResponse`

**Notes:**

1. Following the selection of a coach, that coach’s compliance information is necessary to power the UI. This information will be returned in the response for this endpoint to prevent the need to include compliance information for all search results objects returned when searching for a coach.
1. If the submission is unsuccessful, the interface will display an error message on top of the search result item. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error adding coach.”)

### Entity Check-In Skater Coach Remove

**Purpose:** Remove a coach from an event category for a check-in entity.

**Source:** Check-in Skater Coaches Subpage “remove” button click

**URL:** `DELETE: /api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches`

**Request Payload:** `RemoveEntitySkaterCategoryCoachAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. If the submission is unsuccessful, the interface will display an error message below the remove button. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error removing coach.”)

### Entity Check-In Skater Coach Replace

**Purpose:** Replace a coach for an event category for a check-in entity.

**Source:** Check-in Skater Coaches search results “add” button following a search to replace a coach.

**URL:** `PUT: /api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches`

**Request Payload:** `ReplaceEntitySkaterCategoryCoachAPIPayload`

**Response:** `ReplaceEntitySkaterCategoryCoachAPIResponse`

**Notes:**

1. Following the selection of a coach, that coach’s compliance information is necessary to power the UI. This information will be returned in the response for this endpoint to prevent the need to include compliance information for all search results objects returned when searching for a coach.
1. If the submission is unsuccessful, the interface will display an error message on top of the search result item. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error replacing coach.”)

## Entity Check-In - Team Coaches

### Entity Check-In Fetch Team Coaches

**Purpose:** Fetch information required to power the Team Coaches subpages of check-in

**Source:** Check-in Team Coaches subpage load

**URL:** `GET: /api/competitions/${competition.id}/check-in/${entity.id}/team-coaches`

**Request Payload:** `none`

**Response:** `FetchEntityTeamCoachInformationAPIResponse`

**Notes:**

1. The Coaches selected for the competition and the full set of Coaches associated with the team exist in one shared set of objects, and the selected Coaches are identified through an array of entity IDs.
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (“Error loading coaches.”).
1. If the response contains an empty list for the selected TSP, a message will display in the interface “{{active_entity_name}} does not have any coaches attending this competition.”
1. If the response contains an empty list for the full set of TSP associated with the team, a message will display in the interface “{{active_entity_name}} does not have any available coaches.”
1. Data elements should be returned in the desired display order

### Entity Check-In Team Coach Update

**Purpose:** Update the list of Coaches selected for a check-in entity for a competition

**Source:** Check-in Edit Team Coaches subpage “Confirm Roster” button click

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/team-coaches`

**Request Payload:** `UpdateEntityCompetitionTeamCoachesAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Confirm Roster” button. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error updating team coaches.”)
1. The frontend will rely on the backend to validate that all applicable selection rules have been met. If there are errors resulting from this validation, a 2xx response code should be sent with a message indicating the validation errors in the response error key. This message will be displayed in the UI.

## Entity Check-In - Team Service Personnel

### Entity Check-In Fetch Team Service Personnel

**Purpose:** Fetch information required to power the Team Service Personnel subpages of check-in

**Source:** Check-in Team Service Personnel subpage load

**URL:** `GET: /api/competitions/${competition.id}/check-in/${entity.id}/team-service-personnel`

**Request Payload:** `none`

**Response:** `FetchEntityTeamServicePersonnelInformationAPIResponse`

**Notes:**

1. The TSP selected for the competition and the full set of TSP associated with the team exist in one shared set of objects, and the selected TSP are identified through an array of entity IDs.
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (“Error loading team service personnel.”).
1. If the response contains an empty list for the selected TSP, a message will display in the interface “{{active_entity_name}} does not have any team service personnel attending this competition.”
1. If the response contains an empty list for the full set of TSP associated with the team, a message will display in the interface “{{active_entity_name}} does not have any available team service personnel.”
1. Data elements should be returned in the desired display order

### Entity Check-In Team Service Personnel Update

**Purpose:** Update the list of TSP selected for a check-in entity for a competition

**Source:** Check-in Edit Team Service Personnel subpage “Confirm Roster” button click

**URL:** `POST: /api/competitions/${competition.id}/check-in/${entity.id}/team-service-personnel`

**Request Payload:** `UpdateEntityCompetitionTeamServicePersonnelAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Confirm Roster” button. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error updating team service personnel.”)
1. The frontend will rely on the backend to validate that all applicable selection rules have been met. If there are errors resulting from this validation, a 2xx response code should be sent with a message indicating the validation errors in the response error key. This message will be displayed in the UI.

## Compliance Page

This section outlines the API endpoints specific to Admin Portal Compliance Page functionality

### Competition Management Compliance Fetch Entities

**Purpose:** Fetch the entities for display on the Competition Management “Compliance” page

**Source:** Competition Management “Compliance” page load

**URL:** `GET: /api/competitions/${competition.id}/compliance`

**Request Payload:** `none`

**Response:** `CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse`

**Notes:**

1. The options present on the filters screen will populate based on the unique ComplianceEntityPositionData values provided in the result set.
   1. Filers will display in the order listed for the definition of ComplianceEntityPositionKeyData.
   1. Additional position keys can be provided and they will appear in the filters list after the order mentioned above
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the component will display a generic message (“Error loading compliance information.”).

### Competition Management Compliance Fetch Email Configuration

**Purpose:** Fetch the email CC options for the Compliance Page Email Component

**Source:** Competition Management “Compliance” email component load

**URL:** `GET: /api/competitions/${competition.id}/compliance/email`

**Request Payload:** `none`

**Response:** `FetchComplianceEmailConfigurationAPIResponse`

**Notes:**

1. If an empty response is sent, the CC block of the email component will not display.
1. BCC options are populated by the frontend and any BCC configurations in the response will be ignored. BCC options are based on the following:
   1. Compliance (static--compliant, non-compliant, both)
   1. Position (dynamic)
      1. All Positions, or…
      1. [...Each unique position present in the “Fetch Competition Compliance Entities” result set]
1. Email Component BCC options are pre-selected based on the user’s active page filters for position and compliance.
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the component will display a generic message (“Error loading email form.”).

### Competition Management Compliance Email Submit

**Purpose:** Submit a compliance email

**Source:** Competition Management “Compliance” email component submit

**URL:** `POST: /api/competitions/${competition.id}/compliance/email`

**Request Payload:** `SubmitComplianceEmailAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. The submission payload is an extension of previously defined structures
1. The submission payload contains keys identifying the target compliance status (first index) and position(s)(subsequent indices). These keys are outlined in the data structure definitions.
1. When determining email targets on the back-end, targets should be the subtractive set of position and compliance values (further outlined in data structures)

## Competition Management Contacts Page

This section outlines the API endpoints specific to Admin Portal Competition Management Contacts page

### Competition Management Contacts Fetch Entities

**Purpose:** Fetch the entities for display on the Competition Management “Contacts” page

**Source:** Competition Management “Contacts” page load

**URL:** `GET: /api/competition-management/competitions/${competition.id}/contacts`

**Request Payload:** `none`

**Response:** `CompetitionManagementContactsFetchAPIResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the component will display a generic message (“Error loading contacts.”).
1. The frontend will sort each list in alphabetical order by last name. This will facilitate proper sorting when adding new contacts without needing to refresh the entire list.

### Competition Management Contacts Fetch Add Form Options

**Purpose:** Fetch the form options for the “Add Contact/Official” form

**Source:** Competition Management “Contacts” “add” component load

**URL:** `GET: /api/form-options/competition-contact-add`

**Request Payload:** `none`

**Response:** `CompetitionManagementContactsFetchAddFormOptionsAPIResponse`

**Notes:**

1. Request will only be sent once (subsequent form loads will use data from initial response)
1. Response body allows configuration of different options for different contact types (“contacts” vs “officials”)
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the component will display a generic message (“Error loading form.”).

### Competition Management Contacts Add

**Purpose:** Add a contact

**Source:** Competition Management “Contacts” “add” component search form submit

**URL:** `POST: /api/competition-management/competitions/${competition.id}/contacts`

**Request Payload:** `CompetitionManagementContactsAddAPIPayload`

**Response:** `CompetitionManagementContactsAddAPIResponse`

**Notes:**

1. If the submission is unsuccessful, the interface will display an error message on the search result item. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error adding <contact/official>”)

### Competition Management Contacts Add Search

**Purpose:** Search for a contact or official to add as a contact

**Source:** Competition Management “Contacts” “add” component search form submit

**URL:** `POST: /api/competition-management/competitions/${competition.id}/contact-search`

**Request Payload:** `CompetitionManagementContactsSearchAPIParameters`

**Response:** `MemberSearchResultAPIResponse`

**Notes:**

1. Request will contain information regarding the active entity type at the time of search (“contact” or “official”) as well as the position FormOptionValue selected from the search form
1. If the server returns a non-2xx response code, an error will display on the form “Search error. Please try again.”
1. If the search returns no results, a message will display on the form “No results found.”

### Competition Management Contacts Remove

**Purpose:** Remove a contact from the list for a competition

**Source:** Competition Management “Contacts” Contact remove button click

**URL:** `DELETE: /api/competition-management/competitions/${competition.id}/contacts`

**Request Payload:** `CompetitionManagementContactsRemoveAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. If the submission is unsuccessful, the interface will display an error message in the remove confirmation dialog. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error removing <contact/official>”)

### Competition Management Contacts Change Display

**Purpose:** Change whether a contact should display in the Competitor/Coach portal as a contact

**Source:** Competition Management “Contacts” Card “Display as Contact?” option change

**URL:** `PUT: /api/competition-management/competitions/${competition.id}/contact-display`

**Request Payload:** `CompetitionManagementContactsChangeDisplayAPIPayload`

**Response:** `APISubmissionResponse`

**Notes:**

1. If the submission is unsuccessful, the interface will display an error message entity card. If a 2xx response code is sent with a value in the response error key, the provided message will display. Otherwise, a generic message will display (“Error updating contact display”)
1. Though configured to work for officials, this functionality is only present in the UI for “Competition Contact” types.
