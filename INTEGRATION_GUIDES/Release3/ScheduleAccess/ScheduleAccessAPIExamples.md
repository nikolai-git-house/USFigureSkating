### [NEW] Fetch Competition Search Competitions

**Request Payload:** `none`

**Response:** `FetchSearchCompetitionListAPIResponse`

```
{
  "competitions": [
    {
      "id": 40,
      "name": "2020 Skate Austin Bluebonnet",
      "start_date_ts": 1578009600,
      "end_date_ts": 1578182400,
      "city": "New Daphnee",
      "state": "NM",
      "club": "Port Huron FSC",
      "icon": "/images/competition-icon4.png",
      "user_registration_status": "in_progress",
      "has_registration_deadline_warning": true,
      "registration_deadline": "12/27, 7:00 PM EST",
      "series": null,
      "view_competition_link": "/CompetitionProfile/Index?id=40"
    },
    // [...]
  ]
}
```

### [NEW] Fetch View Competition Competition

**Request Payload:** `none`

**Response:** `FetchViewCompetitionAPIResponse`

example: user is a registered skater for the competition

```
{
  "id": 1,
  "name": "2018 Test Competition",
  "user_navigation": [
    {
      "label": "My Schedule",
      "url": "/pages/my-schedule?id=1",
      "is_active": false,
      "inactive_message": "The schedule has not been posted. Try again later."
    },
    {
      "label": "Competition Information",
      "url": "/pages/competition-information?id=1",
      "is_active": true
    },
    {
      "label": "Practice Ice / Schedule",
      "url": "/pages/practice-ice-schedule?id=1",
      "is_active": true
    },
   //[...]
  ],
  "icon": "/images/2018-MW-Adult.png",
  "end_date_pretty": "12/8/2020",
  "directions": [
    {
      "location_name": "Great Park Ice",
      "link": "https://www.google.com/maps/dir//maps+Great+Park+Ice/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x80dcc3626e80b181:0x13ed30cbfcdd99c3?sa=X&ved=2ahUKEwj55PrA7d_kAhVRop4KHcQ7DzgQ9RcwFHoECA8QEA"
    }
  ],
  "announcement_url": "https://placehold.it/720x480&text=Announcement+PDF+Document",
  "website_url": "https://placehold.it/720x480&text=Competition+Website",
  "start_date_pretty": "12/7/2020",
  "is_ems": true,
  "registration_cta_configuration": {
    "has_registration_deadline_warning": false,
    "registration_deadline": "02/15, 3:25 PM EST",
    "user_registration_status": "registered",
    "user_registration_link": "/pages/competition-registration/1/event-selection",
    "competition_registration_status": "open"
  },
  "volunteer_cta_configuration": {
    "actions": {
      "request": {
        "visible": true,
        "enabled": true
      },
      "select_shifts": {
        "visible": false,
        "enabled": false,
        "url": "https://placehold.it/500x500&text=Shift+Selection"
      }
    },
    "phase_message": {
      "text": "Tap request to select volunteer opportunities",
      "type": "default"
    }
  }
}
```


### [NEW] Submit Competition Volunteer Request

**Request Payload:** [EXISTING]`SubmitVolunteerRequestAPIPayload`

```
// PREVIOUS STRUCTURE UNCHANGED
```

**Response:** `SubmitCompetitionVolunteerRequestAPIResponse`

```
{
  "success": true,
  "error": "",
  "volunteer_cta_configuration": {
    "actions": {
      "request": {
        "visible": false,
        "enabled": false
      },
      "select_shifts": {
        "visible": true,
        "enabled": true,
        "url": "https://placehold.it/500x500&text=Shift+Selection"
      }
    },
    "phase_message": {
      "text": "Your request has been approved, now select shifts",
      "type": "success"
    }
  },
  "confirmation_message": "Your request has been approved"
}
```

#### [Updated] Fetch Volunteer Request Data

**Request Payload:** [UNCHANGED] `none`

**Response:** [EXTENDED] `FetchVolunteerRequestDataAPIResponse`

```
{
  // PREVIOUS PROPERTIES UNCHANGED
  "links": {
    "criminal_history_check": "https://placehold.it/320x240&text=Criminal+Check",
    "terms_and_conditions": "https://placehold.it/320x240&text=Terms+Conditions"
  }
}
```

### [NEW] Fetch Competition Page Heading

**Request Payload:** `none`

**Response:** `FetchCompetitionPageHeadingAPIResponse`

```
{
  "icon": "/images/competition-icon.png",
  "end_date_pretty": "1/21/2020",
  "name": "2020 Skate Austin Bluebonnet",
  "directions": [
    {
      "location_name": "Russel-Feest",
      "link": "https://placehold.it/720x480&text=2020+Skate+Austin+Bluebonnet+Directions+Link"
    }
  ],
  "announcement_url": "https://placehold.it/720x480&text=2020+Skate+Austin+Bluebonnet+Announcement",
  "website_url": "https://placehold.it/720x480&text=2020+Skate+Austin+Bluebonnet+Website",
  "start_date_pretty": "1/18/2020"
}
```

#### [EXTENDED] Get Competition Schedule

**Request Payload:** [UNCHANGED]`none`

**Response:** [NEW]`FetchCompetitionScheduleAPIResponse`

example: schedule unavailable(`FetchUnavailableCompetitionScheduleAPIResponse`):

```
{
  "schedule_unavailable": true
}
```

example: schedule available(`FetchAvailableCompetitionScheduleAPIResponse`):


```
{
  "rinks": EXISTING STRUCTURE UNCHANGED
  "facilities": EXISTING STRUCTURE UNCHANGED
  "sessions": EXISTING STRUCTURE UNCHANGED
  "legend": {
    "abbreviations": [
      {
        "label": "OPI",
        "value": "Official Practice Ice"
      },
      //[...]
    ],
    "color_key": [
      {
        "label": "Ladies/Girls",
        "color": "#FF8FF3"
      },
      //[...]
    ]
  },
  "links": {
    "download_schedule": "https://placehold.it/500x500&text=Download+Schedule"
  }
}
```