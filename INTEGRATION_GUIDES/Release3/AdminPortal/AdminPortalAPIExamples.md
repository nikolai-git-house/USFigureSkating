# Admin Portal API Documentation

## Competition Management

### Competition Management Fetch Competition Lists

**Purpose:** Fetch admin list of upcoming and past competitions.

**Request Payload:** `none`

**Response:** `CompetitionManagementFetchCompetitionListAPIResponse`

```
{
  "upcoming": [
    {
      "end_date_pretty": "11\/18\/2019",
      "icon": "\/images\/competition-icon3.png",
      "id": 8,
      "location": {
        "city": "New Avis",
        "state": "DC"
      },
      "manage_link": "\/pages\/competition-management\/8",
      "name": "Currently Happening",
      "start_date_pretty": "11\/13\/2019",
      "compliance_report_link": "https:\/\/placehold.it\/720x480&text=Currently+Happening+Compliance+Report"
    },
    // [...]
  ],
  "past": [
    {
      "end_date_pretty": "10\/26\/2019",
      "icon": "\/images\/competition-icon3.png",
      "id": 44,
      "location": {
        "city": "Adamsburgh",
        "state": "NJ"
      },
      "manage_link": "\/pages\/competition-management\/44",
      "name": "Distributed mobile portal",
      "start_date_pretty": "10\/24\/2019",
      "compliance_report_link": "https:\/\/placehold.it\/720x480&text=Distributed+mobile+portal+Compliance+Report"
    },
    //[...]
  ]
}
```

### Competition Management Fetch Competition Information

**Purpose:** Fetch Admin information about a competition, including information about registrant counts, registration timelines, deadlines, practice ice windows and volunteer timelines.

**Request Payload:** `none`

**Response:** `FetchCompetitionManagementCompetitionInformationAPIResponse`

```
{
  "deadlines": [
    {
      "date_time_formatted": "11\/15\/2019 10:21 PM EST",
      "status": "warning",
      "relative_deadline": "10 hours ",
      "name": "Music",
      "show_in_summary": true,
      "late_fee": "15"
    },
    {
      "date_time_formatted": "11\/15\/2019 07:01 PM EST",
      "status": "warning",
      "relative_deadline": "7 hours ",
      "name": "PPC",
      "show_in_summary": true,
      "late_fee": "15"
    },
    {
      "date_time_formatted": "11\/15\/2019 09:37 PM EST",
      "status": "warning",
      "relative_deadline": "9 hours ",
      "name": "Roster",
      "show_in_summary": true,
      "late_fee": null
    }
  ],
  "practice_ice": {
    "status": {
      "description": "Closed",
      "status": "error"
    },
    "windows": [
      {
        "name": "Pre-Purchase",
        "begin_date_time_formatted": "11\/02\/2019 02:00 AM EDT",
        "end_date_time_formatted": "11\/04\/2019 02:00 AM EST"
      },
      {
        "name": "Selection",
        "begin_date_time_formatted": "11\/05\/2019 02:00 AM EST",
        "end_date_time_formatted": "11\/07\/2019 02:00 AM EST"
      },
      {
        "name": "Open Sales",
        "begin_date_time_formatted": "11\/08\/2019 02:00 AM EST",
        "end_date_time_formatted": "11\/10\/2019 02:00 AM EST"
      },
      {
        "name": "Onsite Sales",
        "begin_date_time_formatted": "11\/11\/2019 02:00 AM EST",
        "end_date_time_formatted": "11\/13\/2019 02:00 AM EST"
      }
    ]
  },
  "registrants": {
    "registered": {
      "amount": 164,
      "status": "default"
    },
    "entries": {
      "amount": 192,
      "status": "default"
    },
    "entity_counts": [
      {
        "name": "Skaters",
        "count": 89
      },
      {
        "name": "Dance Teams",
        "count": 98
      },
      {
        "name": "Singles",
        "count": 112
      },
      {
        "name": "Synchro Teams",
        "count": 104
      },
      {
        "name": "Pair Teams",
        "count": 52
      }
    ]
  },
  "registration": {
    "status": {
      "description": "Closed",
      "status": "error"
    },
    "dates": [
      {
        "name": "Registration Open",
        "date_time_formatted": "10\/14\/2019 02:00 AM EDT"
      },
      {
        "name": "Early Bird Deadline",
        "date_time_formatted": "10\/24\/2019 02:00 AM EDT",
        "cost": {
            "label": "Early Bird Discount",
            "value": 47
        }
      },
      {
        "name": "Registration Deadline",
        "date_time_formatted": "10\/30\/2019 02:00 AM EDT"
      },
      {
        "name": "Late Registration Deadline",
        "date_time_formatted": "11\/06\/2019 02:00 AM EST"
      }
    ]
  },
  "volunteers": {
    "windows": [
      {
        "name": "Volunteer Requests",
        "begin_date_time_formatted": "10\/14\/2019 02:00 AM EDT",
        "end_date_time_formatted": "10\/15\/2019 02:00 AM EDT"
      },
      {
        "name": "Shift Selection",
        "begin_date_time_formatted": "10\/16\/2019 02:00 AM EDT",
        "end_date_time_formatted": "10\/17\/2019 02:00 AM EDT"
      }
    ]
  }
}
```

## Check-In Index

### Check-In Fetch Entities

**Purpose:** Get the entities list for the check-in page.

**Request Payload:** `none`

**Response:** `FetchCheckInEntitiesAPIResponse`

```
[
    {
        "check_in_status": {
          "checked_in": false,
          "checked_in_by": null,
          "checked_in_date_time_formatted": null,
          "credential_received": false,
          "unpaid_fees_received": false,
          "name": "FeesEvents TestUnpaid",
          "eligible": true,
          "entity_type_key": "team"
        },
        "club": "Denver FSC,
        "comment_count": 10,
        "eligible": true,
        "id": "27",
        "lts_program": null,
        "member_number": "1403964",
        "name": "John Smith",
        "membership_status": {
          "active": true,
          "validity_date_formatted": "3\/24\/20"
        },
        "entity_type_key": "team",
        "roster_count": 6,
        "events_complete": false,
        "coach_count": 1,
        "team_service_personnel_count": 1,
        "outstanding_fees": [
          {
            "name": "PPC Late Fee",
            "amount": "10.00"
          },
          {
            "name": "Music Late Fee",
            "amount": "10.00"
          }
        ],
        "unpaid_events": [
          "Masters Junior-Senior Ladies II",
          "Adult Silver Duets Pattern Dance"
        ],
        "team_level": "Level 2",
        "checked_in": false
      },
      [...]
  ]
```

### Check-In Fetch Email Configuration

**Purpose:** Fetch the options for BCC and CC email recipients, as well as any attachment validation rules, for the Check-In email form

**Request Payload:** `none`

**Response:** `FetchCheckInEmailConfigurationAPIResponse`

```
{
  "cc": [
    {
      "label": "All Competition Contacts",
      "value": "all_competition_contacts",
      "options": [
        {
          "label": "Friedrich Rutherford IV",
          "value": "71197604",
          "role": "Chair"
        },
       [...]
      ]
    },
    {
      "label": "All Key Officials",
      "value": "all_key_officials",
      "options": [
        {
          "label": "Jacynthe D'Amore",
          "value": "76891",
          "role": "Chief Referee"
        },
        [...]
      ]
    }
  ],
  "bcc": [
    {
      "label": "All Participants",
      "value": "all_participants",
      "options": [
        {
          "label": "Checked-In",
          "value": "checked_in"
        },
        {
          "label": "Not Checked-In",
          "value": "not_checked_in"
        },
        {
          "label": "Ineligible",
          "value": "ineligible"
        }
      ]
    }
  ],
  "attachment_rules": {
    "valid_types": [
      "image\/png",
      "image\/jpg",
      "audio\/mp3",
      "audio\/mpeg",
      "audio\/x-mpeg",
      "video\/mpeg",
      "video\/x-mpeg",
      "audio\/mpeg3",
      "audio\/x-mpeg-3",
      "audio\/mpg"
    ],
    "max_individual_size": 2000000,
    "max_total_size": 15000000
  }
}
```

### Check-In Email Submit

**Purpose:** Submit a Check-in email

**Request Payload:** `SubmitCheckInEmailAPIPayload`

```
attachments: (binary)
bcc: ["checked_in"]
cc: ["85507962","all_key_officials"]
message: Test
subject: Currently Happening
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Check-In Check in Entity

**Purpose:** Check an Entity in

**Request Payload:** `CheckEntityInAPIPayload`

```
{
  "credential_provided": true,
  "unpaid_fees_received": false
}

```

**Response:** `CheckEntityInAPIResponse`

```
{
  "success": true,
  "error": "",
  "status": {
    "checked_in": true,
    "checked_in_by": "Prof. Cielo Berge",
    "checked_in_date_time_formatted": "11\/15\/2019 9:51am",
    "credential_received": true,
    "unpaid_fees_received": true
  }
}
```

### Check-In Undo Check in Entity

**Purpose:** Undo the check-in for an Entity

**Request Payload:** `none`

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Entity Check-In Fetch Comments

**Purpose:** Fetch comments data for a check-in entity

**Request Payload:** `none`

**Response:** `FetchEntityCommentsAPIResponse`

```
[
  {
    "id": 66126555,
    "author": "Imani Schumm",
    "datetime_formatted": "11\/15\/19 4:27am",
    "comment": "Explicabo vel consequatur blanditiis ratione magni ipsam dignissimos. Excepturi error assumenda rerum nobis et aut totam. Aspernatur atque qui expedita quis corrupti optio."
  },
 [...]
]
```

### Entity Check-In Submit Comment

**Purpose:** Add a check-in comment for an entity

**Request Payload:** `SubmitEntityCommentAPIPayload`

```
{
  "comment": "Animi quidem est id ullam in nihil. Adipisci id voluptate quaerat et assumenda occaecati quas consequuntur."
}
```

**Response:** `EntityCommentAPISubmissionResponse`

```
{
  "success": true,
  "error": "",
  "comment": {
    "id": 4,
    "author": "Katelynn Cassin",
    "datetime_formatted": "11\/15\/19 9:56 am",
    "comment": "Animi quidem est id ullam in nihil. Adipisci id voluptate quaerat et assumenda occaecati quas consequuntur."
  }
}
```

### Entity Check-In Fetch Compliance

**Purpose:** Fetch compliance information for an entity being checked in

**Request Payload:** `none`

**Response:** `FetchEntityComplianceAPIResponse`

```
[
  {
    "id": 1,
    "name": "Coach Code of Ethics",
    "complete": true,
    "overridden": false
  },
  {
    "id": 2,
    "name": "Background Check",
    "complete": true,
    "overridden": false
  },
  [...]
]
```

### Entity Check-In Override Compliance Item

**Purpose:** Override the compliance of an item for an entity

**Request Payload:** `OverrideComplianceItemAPIPayload`

```
{
    "compliance_item_id": 1,
    "is_overridden": true
}
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Entity Check-In Fetch Events

**Purpose:** Fetch the events list for a check-in entity

**Request Payload:** `none`

**Response:** `FetchEntityEventsAPIResponse`

```
[
  {
    "id": 1,
    "name": "Intermediate Teams",
    "segments": [
      {
        "event_id": 1,
        "id": 1,
        "name": "Free",
        "music": {
          "copyrights": [
            {
              "title": "Copyright Title",
              "artist": null,
              "arrangement": null,
              "record_label": null,
              "duration_minutes": 2,
              "duration_seconds": 50
            }
          ],
          "id": 1,
          "name": "Maid with the Flaxen Hair",
          "has_been_played": true,
          "file": {
            "url": "\/example-music\/MaidWithTheFlaxenHair.mp3",
            "id": 1
          }
        },
        "music_status": {
          "completed": true,
          "overridden": false
        },
        "ppc": [
          "STw",
          "1Lz",
          "STw",
          "1Lo",
          "STw",
          "SoTw",
          "STw"
        ],
        "ppc_status": {
          "completed": true,
          "overridden": false
        },
        "music_required": true,
        "ppc_required": true
      },
      {
        "event_id": 1,
        "id": 2,
        "name": "Short",
        "music": null,
        "music_status": {
          "completed": false,
          "overridden": false
        },
        "ppc": [],
        "ppc_status": {
          "completed": false,
          "overridden": false
        },
        "music_required": true,
        "ppc_required": true
      }
    ]
  },
  [...]
]
```

### Entity Check-In Override Event Segment Music Status

**Purpose:** Mark an event’s incomplete Music requirement as “viewed”

**Request Payload:** `OverrideCheckInEventSegmentMusicPpcItemAPIPayload`

```
{
  "event_id": 1,
  "segment_id": 1,
  "is_overridden": true
}
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Entity Check-In Override Event Segment PPC Status

**Purpose:** Mark an event’s incomplete PPC requirement as “viewed”

**Request Payload:** `OverrideCheckInEventSegmentMusicPpcItemAPIPayload`

```
{
  "event_id": 1,
  "segment_id": 2,
  "is_overridden": true
}
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Entity Check-In Fetch Roster

**Purpose:** Fetch information required to power the roster subpages of check-in

**Request Payload:** `none`

**Response:** `FetchEntityRosterInformationAPIResponse`

```
{
  "competition_roster_skater_ids": [
    1,
    [...]
  ],
  "team_roster": [
    {
      "can_be_added_to_roster": true,
      "cannot_be_added_to_roster_reason": "Not a Member",
      "compliance_summary": [
        {
          "id": 1,
          "name": "SafeSport Training",
          "complete": true,
          "overridden": false,
          "status_description": "Yes"
        },
        {
          "id": 2,
          "name": "Background Check",
          "complete": true,
          "overridden": false,
          "status_description": "Complete"
        }
      ],
      "first_name": "Brice",
      "full_name": "Brice Adams",
      "id": 16,
      "last_name": "Adams",
      "member_number": "5576977",
      "age": 9,
      "requirements_summary": [
        {
          "id": 1,
          "name": "Age Verified",
          "complete": true,
          "overridden": false,
          "status_description": "Yes"
        },
        {
          "id": 2,
          "name": "Waivers",
          "complete": true,
          "overridden": false,
          "status_description": "Complete"
        },
        {
          "id": 3,
          "name": "Medical",
          "complete": false,
          "overridden": false,
          "status_description": "Incomplete"
        }
      ]
    },
    "team_roster_rules": [
       "You must have a minimum of 8 skaters.",
       "You can not exceed 20 skaters.",
       "The majority of skaters must be 12 or under."
     ]
   [...]
  ]
}
```

### Entity Check-In Roster Update

**Purpose:** Update an entity’s competition roster

**Request Payload:** `UpdateEntityCompetitionRosterAPIPayload`

```
[1,2,3,4,5,6,7,8,9,16,34]
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Entity Check-In Fetch Coached Skaters

**Purpose:** Fetch information about the skaters for an entity being checked in

**Request Payload:** `none`

**Response:** `FetchEntityCoachedSkatersAPIResponse`

```
[
  {
    "first_name": "Shawna",
    "last_name": "Baumbach",
    "checked_in": false
  },
  [...]
]
```

### Entity Check-In Fetch Skater Coaches

**Purpose:** Fetch the information related to the check-in entity’s current coach-event assignment.

**Request Payload:** `none`

**Response:** `FetchEntitySkaterCoachInformationAPIResponse`

```
[
  {
    "coach_limit": 2,
    "coaches": [
      {
        "first_name": "Jovany",
        "id": "5dcede4c068e2",
        "last_name": "Jakubowski",
        "compliance_summary": [
          {
            "complete": true,
            "id": 1,
            "name": "U.S. Figure Skating or LTS Membership",
            "overridden": false
          },
          [...]
        ],
        "ineligible": false
      },
      [...]
    ],
    "id": 1,
    "name": "Singles"
  },
 [...]
]
```

### Entity Check-In Fetch Skater Coach Search Form Options

**Purpose:** Load form options for search when modifying a check-in entity’s coaches

**Request Payload:** `none`

**Response:** `FetchEntitySkaterCoachSearchFormOptionsAPIResponse`

```
{
  "states": [
    {
      "value": "AL",
      "label": "AL"
    },
    [...]
  ]
}
```

### Entity Check-In Skater Coach Search

**Purpose:** Search for coaches to select for a check-in entity

**Request Payload:** `MemberSearchAPIParameters`

```
{
  "member_number": "295",
  "first_name": "Kelly",
  "last_name": "Thompson",
  "state": "LA"
}
```

**Response:** `MemberSearchResultAPIResponse`

```
{
  "results": [
    {
      "id": 1,
      "first_name": "Jennifer",
      "last_name": "Bralick",
      "state_abbreviation": "FL",
      "city": "New Erahaven",
      "member_number": "1234567",
      "club_name": "All Your FSC (First Family)",
      "ineligible": false,
      "active": true
    },
    [...]
  ]
}
```

### Entity Check-In Skater Coach Add

**Purpose:** Add a coach to an event category for a check-in entity.

**Request Payload:** `AddEntitySkaterCategoryCoachAPIPayload`

```
{
  "coach_id": 15,
  "category_id": 2
}
```

**Response:** `AddEntitySkaterCategoryCoachAPIResponse`

```
{
  "success": true,
  "error": "",
  "coach": {
    "first_name": "Brad",
    "id": 15,
    "last_name": "Farrell",
    "compliance_summary": [
      {
        "complete": true,
        "id": 1,
        "name": "U.S. Figure Skating or LTS Membership",
        "overridden": false
      },
      [...]
    ],
    "ineligible": false,
    "active": true,
    "state_abbreviation": "SC",
    "city": "Robelborough",
    "club_name": "Denver FSC",
    "member_number": 4429116
  }
}
```

### Entity Check-In Skater Coach Remove

**Purpose:** Remove a coach from an event category for a check-in entity.

**Request Payload:** `RemoveEntitySkaterCategoryCoachAPIPayload`

```
{
  "coach_id": "5dcede4c069e5",
  "category_id": 1
}
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Entity Check-In Skater Coach Replace

**Purpose:** Replace a coach for an event category for a check-in entity.

**Request Payload:** `ReplaceEntitySkaterCategoryCoachAPIPayload`

```
{
  "coach_id": 9,
  "category_id": 1,
  "replace_coach_id": "5dcede4c068e2"
}
```

**Response:** `ReplaceEntitySkaterCategoryCoachAPIResponse`

```
{
  "success": true,
  "error": "",
  "coach": {
    "first_name": "Hester",
    "id": 9,
    "last_name": "Crona",
    "compliance_summary": [
      {
        "complete": false,
        "id": 1,
        "name": "U.S. Figure Skating or LTS Membership",
        "overridden": false
      },
      [...]
    ],
    "ineligible": false,
    "active": true,
    "state_abbreviation": "LA",
    "city": "West Jayda",
    "club_name": "Denver FSC",
    "member_number": 6333898
  }
}
```

### Entity Check-In Fetch Team Coaches

**Purpose:** Fetch information required to power the Team Coaches subpages of check-in

**Request Payload:** `none`

**Response:** `FetchEntityTeamCoachInformationAPIResponse`

```
{
  "competition_coach_ids": [
    1,
    [...]
  ],
  "team_coaches": [
    {
      "can_be_added_to_roster": true,
      "cannot_be_added_to_roster_reason": "Not a Member",
      "compliance_summary": [
        {
          "id": 1,
          "name": "Background Check",
          "complete": false,
          "overridden": false
        },
        [...]
      ],
      "first_name": "Aimee",
      "full_name": "Aimee Bahringer",
      "id": 11,
      "last_name": "Bahringer",
      "member_number": "7536301",
      "email_address": "eprohaska@yahoo.com",
      "phone_number": "1-506-243-9424 x20646"
    },
    [...]
  ]
}
```

### Entity Check-In Team Coach Update

**Purpose:** Update the list of Coaches selected for a check-in entity for a competition

**Request Payload:** `UpdateEntityCompetitionTeamCoachesAPIPayload`

```
[1,2,11,14]
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Entity Check-In Fetch Team Service Personnel

**Purpose:** Fetch information required to power the Team Service Personnel subpages of check-in

**Request Payload:** `none`

**Response:** `FetchEntityTeamServicePersonnelInformationAPIResponse`

```
{
  "competition_team_service_personnel_ids": [
    11,
   [...]
  ],
  "team_service_personnel": [
    {
      "can_be_added_to_roster": true,
      "cannot_be_added_to_roster_reason": "",
      "compliance_summary": [
        {
          "id": 1,
          "name": "Background Check",
          "complete": false,
          "overridden": false
        },
        {
          "id": 2,
          "name": "SafeSport",
          "complete": false,
          "overridden": false
        }
      ],
      "first_name": "Bradford",
      "full_name": "Bradford Abbott",
      "id": 11,
      "last_name": "Abbott",
      "member_number": "7082824",
      "team_role": "Team Physician",
      "email_address": "qkuphal@hotmail.com",
      "phone_number": "247.865.5983"
    },
    [...]
  ]
}
```

### Entity Check-In Team Service Personnel Update

**Purpose:** Update the list of TSP selected for a check-in entity for a competition

**Request Payload:** `UpdateEntityCompetitionTeamServicePersonnelAPIPayload`

```
[1,2,3,11,14,6]
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

## Compliance Page

This section outlines the API endpoints specific to Admin Portal Compliance Page functionality

### Competition Management Compliance Fetch Entities

**Purpose:** Fetch the entities for display on the Competition Management “Compliance” page

**Request Payload:** `none`

**Response:** `CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse`

```
[
  {
    "id": 2466263230,
    "last_name": "Aaaronsen",
    "is_compliant": true,
    "first_name": "Adam",
    "full_name": "Adam Aaaronsen",
    "member_number": "5223587",
    "email_address": "emmerich.diamond@rowe.info",
    "phone_number": "(603) 571-9902",
    "city": "North Annalise",
    "state_abbreviation": "GA",
    "positions": [
      {
        "label": "Compete USA Coaches",
        "key": "coach_compete_usa"
      }
    ],
    "compliance_summary": [
      {
        "name": "Background Check",
        "complete": true
      },
      {
        "name": "Membership",
        "complete": true
      },
      {
        "name": "Coach Code of Ethics",
        "complete": true
      },
      {
        "name": "PSA",
        "complete": true
      },
      {
        "name": "CER",
        "complete": true
      },
      {
        "name": "SafeSport",
        "complete": true
      },
      {
        "name": "Liability Insurance",
        "complete": true
      }
    ]
  },
  [...]
]
```

### Competition Management Compliance Fetch Email Configuration

**Purpose:** Fetch the email CC options for the Compliance Page Email Component

**Request Payload:** `none`

**Response:** `FetchComplianceEmailConfigurationAPIResponse`

```
{
  "cc": [
    {
      "label": "All Competition Contacts",
      "value": "all_competition_contacts",
      "options": [
        {
          "label": "Hailie Ankunding",
          "value": "75136548",
          "role": "Chair"
        },
        [...]
      ]
    },
    [...]
  ],
  "attachment_rules": {
    "valid_types": [
      "image\/png",
      [...]
    ],
    "max_individual_size": 2000000,
    "max_total_size": 15000000
  }
}
```

### Competition Management Compliance Email Submit

**Purpose:** Submit a compliance email

**Request Payload:** `SubmitComplianceEmailAPIPayload`

```
attachments: (binary)
bcc: ["compliant","coach_nonqualifying","coach_compete_usa","coach_foreign","team_service_personnel","other"]
cc: ["all_competition_contacts","8"]
message: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem corporis cupiditate debitis delectus dolor dolorum facere fugit id illum ipsam laudantium magni necessitatibus pariatur quidem quo, sed veniam, veritatis vero?
subject: Email Subject
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

## Competition Management Contacts Page

This section outlines the API endpoints specific to Admin Portal Competition Management Contacts page

### Competition Management Contacts Fetch Entities

**Purpose:** Fetch the entities for display on the Competition Management “Contacts” page

**Request Payload:** `none`

**Response:** `CompetitionManagementContactsFetchAPIResponse`

```
{
  "contacts":[
    {
      "email_address": "uschuppe@yahoo.com",
      "first_name": "Sean",
      "id": 3948929312,
      "is_compliant": false,
      "is_display": false,
      "last_name": "Maggio",
      "member_number": 799722,
      "phone_number": "395-858-7483",
      "position": {
        "label": "Contact Role 5",
        "key": "cr5"
      }
    },
    [...]
  ],
  "officials": [
    {
      "email_address": "estella74@wyman.biz",
      "first_name": "Harmon",
      "id": 3101883266,
      "is_compliant": true,
      "is_display": true,
      "last_name": "Torphy",
      "member_number": 237591,
      "phone_number": "+1 (372) 891-2654",
      "position": {
        "label": "Official Role 4",
        "key": "off4"
      }
    },
    [...]
  ],
  "required_roles": {
    "officials": ["off4"]
  }
}
```

### Competition Management Contacts Fetch Add Form Options

**Purpose:** Fetch the form options for the “Add Contact/Official” form

**Request Payload:** `none`

**Response:** `CompetitionManagementContactsFetchAddFormOptionsAPIResponse`

```
{
  "position_form_options": {
    "contact": [
      {
        "label": "Contact Role 1",
        "value": "cr1"
      },
      [...]
    ],
    "official": [
      {
        "label": "Official Role 1",
        "value": "off1"
      },
      [...]
    ]
  },
  "state_form_options": {
    "contact": [
      {
        "value": "AL",
        "label": "AL"
      },
      [...]
    ],
    "official": [
      {
        "value": "AL",
        "label": "AL"
      },
     [...]
    ]
  }
}
```

### Competition Management Contacts Add

**Purpose:** Add a contact

**Request Payload:** `CompetitionManagementContactsAddAPIPayload`

```
{
  "id": 35,
  "position": "cr1",
  "type": "contact"
}
```

**Response:** `CompetitionManagementContactsAddAPIResponse`

```
{
  "success": true,
  "error": "",
  "contact": {
    "email_address": "elmer.bechtelar@yahoo.com",
    "first_name": "Tom",
    "id": 2749404425,
    "is_compliant": false,
    "is_display": false,
    "last_name": "Schaden",
    "member_number": 1563856,
    "phone_number": "(996) 610-3999",
    "position": {
      "label": "Contact Role 1",
      "key": "cr1"
    }
  }
}
```

### Competition Management Contacts Add Search

**Purpose:** Search for a contact or official to add as a contact

**Request Payload:** `CompetitionManagementContactsSearchAPIParameters`

```
{
  "member_number": "196",
  "first_name": "Wallace",
  "last_name": "Gill",
  "state": "CA",
  "position": "cr1",
  "type_key": "contact"
}
```

**Response:** `MemberSearchResultAPIResponse`

```
{
  "results": [
    {
      "id": 2,
      "first_name": "Jennifer",
      "last_name": "Flygare",
      "state_abbreviation": "CA",
      "city": "East Garrisontown",
      "member_number": "1234568",
      "club_name": "All Your FSC (First Family)",
      "ineligible": true
    },
    [...]
  ]
}
```

### Competition Management Contacts Remove

**Purpose:** Remove a contact from the list for a competition

**Request Payload:** `CompetitionManagementContactsRemoveAPIPayload`

```
{
  "id": 2626684988,
  "type_key": "contact"
}
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Competition Management Contacts Change Display

**Purpose:** Change whether a contact should display in the Competitor/Coach portal as a contact

**Request Payload:** `CompetitionManagementContactsChangeDisplayAPIPayload`

```
{
  "id": 3251942417,
  "is_display": true,
  "type_key": "contact"
}
```

**Response:** `APISubmissionResponse`

```
{
  "success": true,
  "error": ""
}
```

### Competition Management Fetch Active Competition

**Purpose:** Fetch the active competition data to power the competition management experience.

**Request Payload:** `none`

**Response:** `FetchActiveCompetitionManagementCompetitionAPIResponse`
