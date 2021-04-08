# Admin Portal Integration

## Overview

This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Admin Portal component suite.

## Changelog

Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Contents

This release includes:

* [Updated] Members Only Home
* [Added] EMS Landing Page
* [Added] Admin Portal
    * Competition Management List Page
    * Individual Competition Management
        * Main/Index
        * Competition Information
        * Check-In
        * Compliance
        * Competition Contacts

# General

## Data Structure Documentation

In line with the previous release, this release utilizes a "documentation in place" strategy to document data structures.

## Code Structure

Unlike in previous releases, component templates have been included with `.vue` component files rather than as separate html
partials. This enables Admin Portal Competition Management to function as an SPA if desired, as well as ensures proximity
of presentation and interaction code.

In order to facilitate better organization, script files have been added under the `src/js/AdminPortal` directory, and
are grouped by concept (eg "CheckIn") before purpose (eg "models").

Similarly, stylesheets have been added under the `src/sass/AdminPortal` directory and are similarly grouped by concept before
purpose.

## Inline Integration Notes

In previous releases, static page elements (such as link targets) have required integration additions and have been
tagged with `@integration` flags. In this release, these elements are largely filled through API data. However,
the EMS home template does feature the need for some integration configurations for link targets.

## Scripts

As part of this release, a new script file has been added (`public/js/admin-portal.js`). This script will need to be included
on Admin-Portal-related pages. This script will not cause conflicts if included on other pages.

## Stylesheets

Style updates have been bundled into the existing `public/css/main.css` stylesheet. No integration work should be required
for new style components.

## Templates

New templates have been added or modified as part of this release:

* [Modified] Site Header
    * Main Menu link changes
* [Modified] Members Only Landing (`src/views/pages/A.3_members.only.landing.php`)
    * This template has been modified to align more closely with the modified version already present in the USFSA codebase. Integration may not be needed.
* [Added] EMS Home (`src/views/pages/N.0_EMS_Home.php`)
    * This template has been added, but had previously been implemented in the USFSA codebase. Integration may not be needed.
* [Added] Competition Management List Page (`src/views/pages/competition-management/N.1_Competition_Management_Index.php`)
    * This new template for the Competition Management List Page will require integration to add to the appropriate page template in the USFSA codebase
* [Added] Competition Management Competition (`src/views/pages/competition-management/N.2_Competition_Management_Competition.php`)
    * This template serves as the Competition Management Competition main page, as well as the entry point for Competition Management when functioning as a Single-Page-Application. It will require integration.
* [Added] Competition Management Competition Information (`src/views/pages/competition-management/N.2.1_Competition_Management_Competition_Information.php`)
    * This template allows this page to function within a Multi-Page-Application (MPA) experience for Competition Management. If MPA support for Competition Management is desired, this template will require integration
* [Added] Competition Management Check-In (`src/views/pages/competition-management/N.2.2_Competition_Management_Check_In.php`)
    * This template allows this page to function within a Multi-Page-Application (MPA) experience for Competition Management. If MPA support for Competition Management is desired, this template will require integration
* [Added] Competition Management Compliance (`src/views/pages/competition-management/N.2.3_Competition_Management_Compliance.php`)
    * This template allows this page to function within a Multi-Page-Application (MPA) experience for Competition Management. If MPA support for Competition Management is desired, this template will require integration
* [Added] Competition Management Contacts (`src/views/pages/competition-management/N.2.4_Competition_Management_Competition_Contacts.php`)
    * This template allows this page to function within a Multi-Page-Application (MPA) experience for Competition Management. If MPA support for Competition Management is desired, this template will require integration

## Configuration

### Competition Management Experience

The experience for individual Competition Management has been created such that it can function both as an MPA and as an SPA.

#### SPA

To function as an SPA, the primary entry point ("Competition Management Competition") template noted above will require integration.  
Additionally, the `index_links` property of the `CompetitionManagementCompetitionData` returned via the
`Competition Management Fetch Active Competition` API endpoint will need to contain the appropriate `component_link` value
for the following:

1. "Competition Information" - `competition-information`
1. "Check-In" - `check-in`
1. "Compliance" - `compliance`
1. "Competition Contacts" - `competition-contacts`

```
{
  [...]
  "index_links": [
    {
      "label": "Competition Information",
      "url": "",
      "component_link": "competition-information"
    },
    {
      "label": "Check-In",
      "url": "",
      "component_link": "check-in"
    },
    {
      "label": "Compliance",
      "url": "",
      "component_link": "compliance"
    },
    {
      "label": "Competition Contacts",
      "url": "",
      "component_link": "competition-contacts"
    },
   [...]
  ]
}
```

#### MPA

To function as an MPA, all of the Competition Management templates notes above will require integration. Additionally,
the `component_link` property noted above should not be included in the API response.

```
{
  [...]
  "index_links": [
    {
      "label": "Competition Information",
      "url": "<competition-information page URL>"
    },
    {
      "label": "Check-In",
      "url": "<check-in page URL>"
    },
    {
      "label": "Compliance",
      "url": "<compliance page URL>"
    },
    {
      "label": "Competition Contacts",
      "url": "<competition-contacts page URL>"
    },
   [...]
  ]
}
```

Upon page load, each sub-component of Competition Management will function as a standalone experience.

Note: SPA functionality can be set on a by-component basis.

### Active Competition API

Within the Competition Management experience, the frontend queries an API endpoint to fetch information about the active
competition. The frontend has been written to support using either a state-based or stateless API endpoint for fetching
this information.

#### State-Based (default)

In this option, the frontend will query an endpoint that will provide information based on the active competition relative
to the user's session. The frontend will use `GET: /api/competition-management/active-competition` for this information.

#### Stateless

In this option, the frontend will query an API endpoint and identify a competition ID in a url segment for which information
should be returned. The URL used in this case will be `GET: /api/competition-management/competitions/${competition.id}`.

In order for the frontend to "know" the active competition ID, a cookie will need to be provided containing this
information. Additionally, the constant `COMPETITION_MANAGEMENT_COOKIE_NAME` in `src/js/contracts/AppConfig.ts` will
need to be changed from `false` to the name of the cookie containing this information.

## Competition Page Heading Changes

The Competition Page Heading has been updated to feature directions, announcement and competition website links.
These new data points are optional, and will only display if provided through API data. These additions to the core
Competition data structures have been documented in `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md`:

```
directions?: {                       - [OPTIONAL] Array of Directions information for the competition.
    location_name: string;           - The name of the location
    link: string;                    - Directions link URL
}[]
announcement_url?: string;           - [OPTIONAL] URL for the Competition Announcement
website_url?: string;                - [OPTIONAL] URL for the Competition Website
```

Existing pages affected by this change include:

1. Skater Portal Competition Profile Page
1. Skater Portal Competition Information Page
1. Skater Portal Competition Music and PPC Page
1. Skater Portal Competition My Coaches Page
1. Skater Portal Competition Competition Contacts Page

# API

API endpoints and payloads are outlined in `INTEGRATION_GUIDES/Release3/AdminPortal/AdminPortalAPI.md`

API endpoint call and response examples are documented in `INTEGRATION_GUIDES/Release3/AdminPortal/AdminPortalAPIExamples.md`
