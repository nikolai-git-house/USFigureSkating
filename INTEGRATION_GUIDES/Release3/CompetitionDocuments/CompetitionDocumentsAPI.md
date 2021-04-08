# Competition Documents API Changes/Additions

This document outlines API changes and additions related to the "Competition Documents" release.

## API Endpoints

### Fetch Competition Information

The "Get Competition Information" endpoint described in `INTEGRATION_GUIDES/2__INTEGRATION-BATCH2.md:251` is updated as
part of this release to include additional information for Competition Documents. Except where noted
below, this API endpoint remains unchanged.

**Purpose:** Previous purpose unchanged. New purpose to provide information about competition documents.

**Source:** Unchanged. Used in this release upon Competition Information page load.

**URL:** `unchanged`

**Request Payload:** `unchanged`

**Response:** `CompetitionInformationData`

```
{
  // previous properties not documented and unchanged
  "competition_documents": { // @deprecated 2020-06-17
    "reference_documents": [
      {
        "id": 3914413475,
        "name": "Practice Ice Schedule",
        "url": "https://placehold.it/720x480&text=Practice+Ice+Schedule+Document"
      },
      [...]
    ],
    "action_documents": [
      {
        "is_complete": false,
        "id": 817993893,
        "name": "Merchandise Order Form",
        "url": "https://placehold.it/720x480&text=Merchandise+Order+Form+Document"
      },
      {
        "is_complete": true,
        "deadline_formatted": "12/02/2019 11:50 AM EST",
        "id": 49028154,
        "name": "Practice Ice Preference Form",
        "url": "https://placehold.it/720x480&text=Practice+Ice+Preference+Form+Document"
      },
      [...]
    ]
  }
}
```

**Notes:**

1. This endpoint and response existed as part of previous releases.
1. Previous response data remains unchanged outside of the addition of `competition_documents` data.

### Update Competition Document Completion Status

**Purpose:** Change the active user completion status on an Action Competition Document.

**Source:** Competition Information page Competition Documents section Action Document checkbox toggle.

**URL:** `PUT: /api/competitions/{competition_id}/documents/{document_id}`

**Request Payload:** `ChangeCompetitionDocumentCompletionAPIPayload`

```
{
  "competition_id": 1,
  "document_id": 817993893,
  "is_complete": true
}
```

**Response:** `APISubmissionResponse`

```
{"success":true,"error":""}
```