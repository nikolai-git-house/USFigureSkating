# Team Portal Integration - Competition Portal Main CTAs

This document summarizes integration notes surrounding changes and additions to the Competition Portal Main page CTA
cards ("For Skaters," "For Volunteers," "For Teams") contained within the Team Registration/Team Portal release.

## Background/Overview

The "For Skaters" and "For Volunteers" CTA were originally developed as part of the Schedule Access release. The Team
Portal release adds the "For Teams" CTA. Additionally, this release adds conditionality surrounding the display of these
CTAs based on whether the page is being viewed as a team or the active user.

## Summary of Changes

- Added "For Teams" CTA
  - Displays in team context to provide information and links relative to competition registration for the team for the
    competition being viewed.
  - Displays in self context to allow the active user to navigate to the appropriate team view of the page for teams
    they manage.
- Made "For Skaters" CTA display conditional
  - Allows CTA to hide when viewing the page in the team context, since it is not relevant in this context.
- Made "For Volunteers" CTA display conditional
  - Allows CTA to hide when viewing the page in the team context, since it is not relevant in this context.

## "For Teams" CTA

### Team Context

The "For Teams" CTA has been added to the page by adding an optional `team_registration_cta_configuration` property to
the `ViewCompetitionData` contained in the `CompetitionPortalApi.FetchCompetitionMainApiResponse.competition` returned
by the "Fetch Competition Portal Main"
(`INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMain.md:40`) API Endpoint. This property
should only be included when returning data for a team context. This property uses the pre-existing
`CompetitionRegistrationCtaConfigurationData` structure, which is not changed as part of this release:

```
export interface CompetitionRegistrationCtaConfigurationData {
    competition_registration_status: 'open' | 'late' | 'future' | 'closed';     // The competition's registration window status
    has_registration_deadline_warning: boolean;                                 // Whether the competition's registration deadline should be highlighted in red
    registration_deadline: string;                                              // string to display as the registration deadline
    user_registration_link: string;                                             // the link the active user should be directed to when selecting a competition (this should direct to the Team Registration flow in this context)
    user_registration_status: 'registered' | 'in_progress' | 'new';             // the active team's status relative to registering for the competition
}
```

Additionally, if the team is registered for the competition, and there are no more events it is eligible to add, this
property should not be included in the response (resulting in the CTA not displaying).

### Active User Context

Within the active user context, the "For Teams" CTA will show when the active user manages any teams that are either
registered or are eligible to be registered for the competition. The CTA will simply feature a link to direct the user
to the "Select Competition Entity"
(`INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-SelectCompetitionEntity.md`) page for the competition, where
they can choose to view the competition as one of these eligible teams.

To facilitate this, the `CompetitionPortalApi.FetchCompetitionMainApiResponse` returned by the "Fetch Competition Portal
Main" (`INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMain.md:40`) API Endpoint has been
extended to include a new `user_manages_competition_eligible_teams:boolean` property. When this property is set to true,
the "For Teams" CTA will show in this context.

Additionally, to facilitate linking to the "Select Competition Entity" page for the competition, the
`ViewCompetitionData` contained in the `CompetitionPortalApi.FetchCompetitionMainApiResponse.competition` returned by
the "Fetch Competition Portal Main" API endpoint has been extended to feature a `links` property:

```
    links: {
        select_competition_entity: string;     // Link to the "Select Competition Entity" page for the competition
    };
```

This link will be applied to the CTA button when the CTA is configured to show.

## "For Skaters" and "For Volunteers" CTAs

In order to facilitate the use cases where the "For Skaters" and "For Volunteers" should not show, the respective
`registration_cta_configuration` and `volunteer_cta_configuration` properties of the `ViewCompetitionData` contained in
the `CompetitionPortalApi.FetchCompetitionMainApiResponse.competition` returned by the "Fetch Competition Portal Main"
API endpoint have been made optional. When either property is not provided, the respective CTA will not show.

## API

Outside of extensions to the response body (`CompetitionPortalApi.FetchCompetitionMainApiResponse`), the "Fetch
Competition Portal Main" API Endpoint remains unchanged from its most recent documentation in
`INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMain.md:40`.

## Data Structures

```
/**
 * API response when fetching information for the Competition Portal Main page
 */
export interface FetchCompetitionMainApiResponse {
    competition: ViewCompetitionData;                                       // [ViewCompetitionData] extended
    back_link?: BackLinkConfigurationData;                                  // [Unchanged]
    entity_summary?: CompetitionPortalData.ActiveEntitySummary;             // [Unchanged]
    user_manages_competition_eligible_teams: boolean;                       // [New] Whether the active user manages teams that are either registered for the competition or can be registered for the competition
}

/**
 * Represents data necessary to power the View Competition page
 */
export interface ViewCompetitionData extends CompetitionFoundationData, CompetitionHeadingData, CompetitionUserNavigationFieldData {
    is_ems: boolean;                    // [Unchanged]

    registration_cta_configuration?: CompetitionRegistrationCtaConfigurationData;       // [Extended - made optional] Information about registering for the competition.
                                                                                        // Powers the "For Skaters" CTA block
                                                                                        // If not provided, CTA will not show
    team_registration_cta_configuration?: CompetitionRegistrationCtaConfigurationData;  // [New] Information about registering for the competition for teams.
                                                                                        // Powers the "For Teams" CTA block
                                                                                        // If not provided, CTA will not show
    volunteer_cta_configuration?: CompetitionVolunteerCtaConfigurationData;             // [Extended - made optional] Information about volunteering for the competition.
                                                                                        // Powers the "For Volunteers" CTA block
                                                                                        // If not provided, CTA will not show
    links: {                                                                            // [New] - Links for the competition
        select_competition_entity: string;                                                     // Link to the "Select Competition Entity" page for the competition
    };
}
```
