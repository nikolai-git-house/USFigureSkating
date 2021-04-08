# Series Registration API - Series Overview

This document outlines API additions related to the “Series Registration” release “Series Overview” page

## API Endpoints

### Fetch Series Overview

**Purpose:** Fetch information for the "Series Overview" page for a series

**Source:** "Series Overview" page load

**URL:** `GET:/api/series-registration/${series.id}/overview`

**Request Payload:** `none`

**Response:** `SeriesOverviewApi.FetchSeriesOverviewApiResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading series information."). 