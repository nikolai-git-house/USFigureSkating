# Shift Selection Integration - Competition Portal Main

This document summarizes integration notes surrounding the Competition Portal "Competition Portal Main" page contained
within the Shift Selection release.

## Templates

No template changes are part of this release for this page.

### Server Side Requirements

No new server side requirements impacting this page are contained in this release for this page.

## Functional Overview

This release contains a new context in which the Competition Portal Main page loads (registered/approved volunteer).
This context is facilitated by manipulation of API data already present when fetching data for this page.

The notes below assume the Team Portal updates to the Competition Portal Main page have been made.

### Page Load

#### Non-Volunteer User

If the active user is not a registered/approved volunteer for the competition, no configurations are necessary.

#### Volunteer User

If the active user is a registered/approved volunteer for the competition, the following configurations of the
`CompetitionPortalApi.FetchCompetitionMainApiResponse` returned by the "Fetch Competition Portal Main" should be made:

1. Exclude the `competition.volunteer_cta_configuration` property from the response. This hides the "For Volunteers" CTA
   on the page.
1. Extend the `competition.user_navigation` property to contain items for the "Volunteer Shift Selection" and "My
   Volunteer Schedule" pages

ex:

```
[
 //...
  {
    "label": "Volunteer Shift Selection",
    "url": "/pages/competitions/shift-selection?id=1",
    "data": [
      {
        "status_type": "alert",
        "content": "Selection Closes: 12 hours"
      }
    ]
  },
  {
    "label": "My Volunteer Schedule",
    "url": "/pages/competitions/volunteer-schedule?id=1",
    "data": [
      {
        "icon": "scheduled",
        "content": "4 Approved"
      },
      {
        "icon": "pending",
        "content": "4 Pending"
      }
    ]
  },
 //...
]
```