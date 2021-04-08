# Practice Ice Update Integration
## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for 
the updated Practice Ice Schedule API integration. 

## API Objects
This section outlines the objects used in relation to the API for the updated Practice Ice Schedule Integration 

### Scheduled Session Map
The Scheduled Session Map is a modification of the existing Scheduled Session object and serves the same purpose.  
It represents the same data as a Scheduled Session object, but it does not include the full data of the associated Session. 

```  
	session_id: number			    - The ID of the associated Session object
	scheduled_as: SessionType		- The type the session was scheduled as.  "wu","opi","upi" or "event"
	scheduled_event_id: number		- The ID of the Event the Session was scheduled for
```


### Mapped Skater Schedule
This object is a limited version of the SkaterSchedule object that includes a ScheduledSessionMap in place of the SkaterSchedule's 
standard array of ScheduledSession objects.  This object should only be used when full session information is available through another
API response data point, such as the "Get Practice Ice Data" endpoint

```  
	scheduled_session_maps: ScheduledSessionMap[]	- Array of Scheduled Session Map objects representing the sessions the Skater has in their schedule for the specified Competition
	events: SkatingEvent[]			                - Array of Skating Event data containing the events the Active User's is registered for in the speficied Competition. This is unchanged from the standard Skater Schedule object.
```

## API Endpoints
Even when data is not present, endpoints should return empty representations of their top level properties.

### Get Practice Ice Schedules
__Purpose:__ Get the schedules necessary to power the Practice Ice Schedule Page: a Competition Schedule and a Mapped Skater Schedule

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data to service method.

__Response:__ A `CompetitionSchedule` object within a `competition_schedule` key for the specified competition, and a 
`MappedSkaterSchedule` object within a `mapped_skater_schedule` key for the specified competition.

Note: The `CompetitionSchedule` object has not been changed in this release.


```  
{
  competition_schedule: {
    "rinks": [
      {
        "id": 1,
        "name": "OLY",
        "facility_id": 1,
        "facility": {
          "name": "Broadmoor World Arena",
          "id": 1
        }
      },
      [...]
    ],
    "facilities": [
      {
        "name": "Broadmoor World Arena",
        "id": 1
      },
      [...]
    ],
    "sessions": [
      {
        "name": "Practice Ice (IL)",
        "time_start": 1563798300,
        "date": 1563775200,
        "time_end": 1563799800,
        "slots_registered": 6,
        "slots_available": 15,
        "type_key": "practice_ice",
        "practice_ice_types": [
          "upi",
          "opi"
        ],
        "id": 1,
        "rink": {
          "id": 1,
          "name": "OLY",
          "facility_id": 1,
          "facility": {
            "name": "Broadmoor World Arena",
            "id": 1
          }
        },
        "utc_timezone_offset": 360,
        "event_ids": [
          1
        ]
      },
      [...]
    ]
  },
  mapped_skater_schedule: {
    "events": [
      {
        "id": 1,
        "name": "Intermediate Ladies",
        "competition_id": 1
      },
      [...]
    ],
    "scheduled_session_maps": [
      {
        "scheduled_as": "upi",
        "scheduled_event_id": 1,
        "session_id": 1
      },
      [...]
    ]
  }
}
```