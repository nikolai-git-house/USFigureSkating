# Series Registration API

This document outlines API additions related to the "Series Registration" release "Series Information" page.

## API Endpoints

### Fetch Series Registration Series List

**Purpose:** Fetch the list of available series to display on the "Series Information" Page

**Source:** "Series Information" page load

**URL:** `GET: /api/series-registration/series`

**Request Payload:** `none`

**Response:** `FetchSeriesRegistrationSeriesListApiResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
found, a non-2xx HTTP response code should be returned and the page will display a generic message
("Error loading series information.").
1. Series should be returned in the desired display order.
1. If no series are returned, the page will display a notice ("No series are available at this time.")