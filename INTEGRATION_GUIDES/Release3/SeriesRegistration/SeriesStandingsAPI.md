# Series Registration API - Series Standings

This document outlines API additions related to the “Series Registration” release “Series Standings” page

## Notes
This document contains namespaced data structures for organizational purposes.  These namespaces are either `SeriesStandingsApi`
or `SeriesStandingsData`.  Any data structures noted without one of these prefixes is preexisting and unchanged.


## API Endpoints

### Fetch Series Standings

**Purpose:** Fetch information for the "Series Standings" page for a series

**Source:** "Series Standings" page load

**URL:** `GET:/api/series-registration/${series.id}/standings`

**Request Payload:** `none`

**Response:** `SeriesStandingsApi.FetchSeriesStandingsApiResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading standings.").
1. The response contains metadata about the standings, including a string indicating the last update datetime, and the available filters for the standings.
1. The `resource_documents` property of `SeriesStandingsApi.FetchSeriesStandingsApiResponse.series` should only feature documents with the names "Dance," "Singles," and "Pairs"
to ensure presentational integrity.