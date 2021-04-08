# Coach Schedule Integration
## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for the Coach Schedule component.


## General
### Link Targets Needed
There are various links that require targets:
* Competition Schedule "Coach Schedule" link in popup (~src/views/pages/H.1_competition-schedule.php:79)
* "My Schedule" and "Competition Schedule" download links on Competition Schedule header (~src/views/pages/H.1_competition-schedule.php:34)
  
  
## API Objects
This section outlines the objects used in relation to the API for the Coach Schedule.

### Session ID Skater Name Map
This object represents a mapping between sessions and the names of associated coached skaters.  
This is an keyed array in which the keys are Session IDs and the values are arrays of skater names belonging to that Session.

```  
{
	[key:number]:string[]
}
```


## API Endpoints
Even when data is not present, endpoints should return empty representations of their top level properties.

### Get Competition Coached Skater Schedule
__Purpose:__ Get the sessions a coach's skaters are assigned to for a given competition, along with a map tying the 
skater names to the appropriate sessions.

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data to service method.

__Response:__ An array of  `Session` objects within a `sessions` key, and a `SessionIDSkaterNameMap` within a `skater_session_map` key

```  
{
  "sessions": [
    {
      "id": 2,
      "name": "Practice Ice (IP)",
      "time_start": 1563799800,
      "date": 1563775200,
      "time_end": 1563801300,
      "slots_registered": 6,
      "slots_available": 15,
      "type_key": "practice_ice",
      "practice_ice_types": [
        "upi",
        "opi"
      ],
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
        2
      ]
    },
    [...]
  ],
  "skater_session_map": {
    "2": [
      "Retta Grady",
      "Dr. Baby Gulgowski",
      "Gabrielle Johns",
      "Donnie Rutherford DDS"
    ],
    [...]
  }
}
```