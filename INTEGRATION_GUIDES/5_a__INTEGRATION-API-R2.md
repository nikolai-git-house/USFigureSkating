# API INTEGRATION - Release 2
This document outlines data structures and API endpoints necessary for Release 2 integration 


#API Objects
## Simple Objects

### Coach Result
Represents a my coaches search result for a coach

```  
club_name: string;              - Coach's club name
first_name: string;             - Coach First Name
id: number                      - Unique ID for Coach
ineligible: boolean             - Whether the coach has been marked as ineligible
last_name: string;              - Coach last name   
member_number: number;          - Coach member number
state_abbreviation: string;     - Abbreviated Coach location state            
```

### Coach Search Params
Parameters for searching for a coach.

```  
member_number?:string     - Member number search criteria
first_name?:string        - First Name search criteria
last_name?:string         - Last Name search criteria
state?:string             - State search criteria
```

### Competition Contact
Represents a contact for a competition
```  
name:string                      - The contact's name
email:string                     - The contact's email address
role:string                 	 - The contact's role for the competition
```

### Music PPC Deadline Info
Represents information about PPC or Music deadlines

```  
formatted: string;            - Formatted string for the deadline date
timestamp: number;            - Unix timestamp for the deadline
late_fee: string;             - String representation of the late fee
```

### PPC Move
Represents a move within a PPC Element.

```  
    id: number;                          - Unique identifier for the Move
    category_id: number;                 - ID of the category to which the Move belongs.  Currently unused.
    type_id: number;                     - ID of the type of the Move
    description: string;                 - Name of the Move
    code: string | null;                 - Short code for the move.  Nullable.
    is_combo: boolean;                   - Whether the move is composed of additional moves
    is_transition: boolean;              - Provided in example data.  Currently unused
    number_of_combos: number;            - Amount of submoves required to complete the move
    exclude_from_combos: boolean         - Whether the move should be excluded from sub-move lists
```

### PPC Type
Represents a type that can classify PPCMoves

```  
     id: number;                - Unique identifier for the type 
     description: string;       - Name of the type
```

### Select Option
Represents an option for a select input
```  
label:string                     - Input display value for option
value:any                        - App value for the option
```

### Skater Event
Represents an event and associated status for a Coach's skater.  Component of My Skaters page

```  
	name: string;               - The name of the Event           
	coaching_role: string;      - The role of the coach for the skater for the event
	music_complete: boolean;    - Whether the skater's music status is complete
	ppc_complete: boolean;      - Whether the skater's PPC status is complete
```

### Skater Event Coach
Represents a coach either selected by a skater for an event, or a coach that could be so selected

```  
	id: number;                   - Unique ID for the coach
	name: string;                 - Name of the coach
	ineligible: boolean;          - Whether the coach is ineligible for the competition
	state_abbreviation:string;    - State abbreviation for the coach 
	member_number:string;         - Coach's member number
	club_name:string;             - Coach's club name
```

### Skating Event Category
Represents a category of skating events

```  
	id:number;              - Unique ID for the Category
	name:string;            - Name of the Category
	coach_limit:number      - Limit to the number of coaches a skater can have for the category
```

### Skater Skating Event Segment
Represents a skating event segment for which a skater is registered and can add music and ppc information

```  
	event_id: number;                                - The ID of the associated event
	event_name: string;                              - The name of the associated event   
	segment_id: number;                              - The ID of the event segment
	segment_name: string;                            - The name of the event segment
	competition_skated_event_id: number;             - The competition_skated_event_id for the segment
	ppc_required: boolean;                           - Whether PPC is required
	music_required: boolean;                         - Whether Music is required
	is_ppc_complete: boolean;                        - Whether PPC is complete
	is_music_complete: boolean;                      - Whether Music is complete
	ppc_last_modified_timestamp: number | null;      - Unix timestamp for the last date the associated PPC was modified. Null if it's never been modified
	music_last_modified_timestamp: number | null     - Unix timestamp for the last date the associated Music was modified. Null if it's never been modified
```



### User Information
Represents general information about the currently logged in user

```  
user_type:string            - The type of the active user.  Either "skater" or "coach"
```



## Complex Objects
### Coach Skater
This object represents the data for a Skater's relationship to a coach, including status data for the events for which the coach is a coach of the skater. 

```  
	id: number;                                     - ID for the skater
	first_name: string;                             - First name of the skater
	last_name: string;                              - Last name of the skater
	federation_letter_status: string | false;       - Status of the Skater's federation letter.  Boolean false if skater is non-international
	events: CoachSkaterEventData[]                  - Array of SkaterEvents for the skater

```
### Competition Information (Revised)
This object represents more detailed information for a Competition.  It has been extended for R2 into the following complete data structure. 

```  
     sales_windows: SalesWindow[];                           - An array of Sales Windows
     practice_ice_instructions: string;                      - A string for practice ice instructions.  HTML permitted			    
     practice_ice_terminology: string;                       - A string for practice ice terminology.  HTML permitted
     skating_events: CompleteSkatingEvent[];                 - An array of Complete Skating Events (including Credit Configs)
     schedulable_session_types: string[];                    - An array of strings representing the skater selectable type keys for the competition. Array items can be any combination of "opi","upi" and "wu"
     competition_id:number;                                  - ID representing the competition to which the information belongs
     pricing_message:string|false;                           - OPTIONAL - message to display on Competition Information Page in place of pricing information 
     music_ppc_deadline_description: string;                 - Text content to be included in the "Music & PPC Deadlines" dropdown on the Music & PPC page
     ppc_deadline: MusicPPCDeadlineInfo | null;              - Information about the competition's PPC deadlines.  Nullable
     music_deadline: MusicPPCDeadlineInfo | null;            - Information about the competition's Music deadlines.  Nullable
```
### PPC Element
This object represents a single element within a PPC

```  
type:PPCType                         - The PPCType for the Element
element:PPCMove                      - A PPCMove representing the primary move for the element. This could be a combo or non-combo move
moves:PPCMove[]                      - Array of moves supporting the move in the element key if it's a combo.  Empty array for non-combo elements
transition_description?:string       - [NEW 2020-07-13] The transition description entered for the element, if applicable
```



### PPC Form Options
Represents the available form options for a PPC.

```  
type: PPCIndexedTypesData;               - PPC Types in the form of id:descipton key:value pairs
elements: PPCIndexedMoveData;            - PPC Elements within an id-indexed object of the form id:PPCMove  
```



### Skater Coached Event Category
This object represents an event category for which a skater is registered along with any coaches they have selected for that event.
It is the same as a SkatingEventCategory, with an additional `coaches` array.

```  
	id: number;                            - ID for the event
	name: string;                          - Name of the event
	coach_limit: string;                   - Limit to the number of coaches a skater can have for the category
	coaches: SkaterEventCoach[]            - Array of SkaterEventCoach objects 
```

### Skater PPC
This object represents the PPC for a skater.  
```  
elements: PPCElement[]              - Array of PPCElements in order for the PPC
```


#API Endpoints
Even when data is not present, endpoints should return empty representations of their top level properties.  
## General
### Get PPC Form Options
__Purpose:__ Return the form options for the PPC editor.

__Request Payload:__ The `event_id`, `event_segment_id`, `competition_id` and `competition_skated_event_id` for the appropriate PPC:

```  
{
  "event_id": 1,
  "event_segment_id": 1,
  "competition_id": 1,
  "competition_skated_event_id": 4
}
```
__Response:__ The PPC Form Options data available to the provided event

```  
{
  "type": {
    "5": "Jumps",
    "22": "Spins",
    "27": "Twizzles",
    [...]
  },
  "elements": {
    "1": {
      "id": 1,
      "category_id": 2,
      "type_id": 5,
      "description": "Single-Toeloop",
      "code": "1T",
      "is_combo": false,
      "is_transition": false,
      "number_of_combos": 0,
      "exclude_from_combos": false
    },
    "25": {
      "id": 25,
      "category_id": 2,
      "type_id": 5,
      "description": "2-Jump Combination",
      "code": null,
      "is_combo": true,
      "is_transition": false,
      "number_of_combos": 2,
      "exclude_from_combos": true
    },
    [...]
  }
}
```

## Competitions
### Get Competition Contacts
__Purpose:__ Return a list of contacts for a Competition.

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data to service method.

__Response:__ an array of `CompetitionContact` objects within a `contacts` key:

```  
{
  "contacts": [
    {
      "name": "Dallin Schuster",
      "role": "Chair",
      "email": "dallin.schuster@test.com"
    },
    [...]
  ]
}
```

### Get Competition Information (Revised)
__Purpose:__ Return the `CompetitionInformation` object for the specified Competition. The response has been extended in R2.

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data to service method.

__Response:__ the `CompetitionInformation` object for the specified `competition_id`:

```  
{
  "competition_id": "1",
  "sales_windows": [
    {
      "key": "pre_purchase",
      "name": "Pre-Purchase Sales",
      "start_datetime_timestamp": 1519225200,
      "end_datetime_timestamp": 1520002800,
      "start_datetime_formatted": "2\/21\/2018 8:00AM MDT",
      "end_datetime_formatted": "3\/2\/2018 8:00AM MDT"
    },
    {
      "key": "selection",
      "name": "Pre-Purchase Selection",
      "start_datetime_timestamp": 1520002800,
      "end_datetime_timestamp": 1522418400,
      "start_datetime_formatted": "3\/2\/2018 8:00AM MDT",
      "end_datetime_formatted": "3\/30\/2018 8:00AM MDT"
    },
    {
      "key": "open_sales",
      "name": "Open Sales",
      "start_datetime_timestamp": 1522418400,
      "end_datetime_timestamp": 1563714000,
      "start_datetime_formatted": "3\/30\/2018 8:00AM MDT",
      "end_datetime_formatted": "7\/21\/2019 7:00AM MDT"
    },
    {
      "key": "on_site",
      "name": "On-Site Sales",
      "start_datetime_timestamp": 1563714000,
      "end_datetime_timestamp": 1569161400,
      "start_datetime_formatted": "7\/21\/2019 7:00AM MDT",
      "end_datetime_formatted": "9\/22\/2019 8:10AM MDT"
    }
  ],
  "music_ppc_deadline_description": "In preparation for the competition you complete planned program content (PPC) for the events in which you are registered. This registration component must be complete prior to the deadline(s) listed below.",
  "ppc_deadline": {
    "formatted": "3\/30\/19 8:00 AM EDT",
    "late_fee": "$10.25",
    "timestamp": 1553954400
  },
  "music_deadline": {
    "formatted": "3\/30\/19 8:00 AM EDT",
    "late_fee": "$11.25",
    "timestamp": 1553954400
  },
  "practice_ice_instructions": "This competition is configured for OPI, UPI and WU to all be selectable.",
  "practice_ice_terminology": "Et non tenetur. Alias dignissimos nisi nemo provident ut omnis occaecati. Quo numquam quo aut non. Repudiandae voluptate neque earum. Sunt temporibus et. Cupiditate rerum consequatur delectus.",
  "skating_events": [
    {
      "id": 1,
      "name": "Intermediate Ladies",
      "credit_config": [
        {
          "key": "opi",
          "cost": 35,
          "limit": 5
        },
        {
          "key": "upi",
          "cost": 30,
          "limit": 4
        },
        {
          "key": "wu",
          "cost": 25,
          "limit": 3
        }
      ],
      "credit_packages": [
        {
          "cost": 10,
          "id": 1,
          "credits": {
            "opi": 1,
            "upi": 2
          },
          "event_id": 1
        },
       [...]
      ],
      "competition_id": 1
    },
    [...]
  ],
  "schedulable_session_types": [
    "upi",
    "wu",
    "opi"
  ]
}
```

At the minimum, this endpoint should return an empty array in the `contacts` key



## Coaches
### Get Competition Skaters
__Purpose:__ Return a list of skaters for a given competition for which the active user is a coach.

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data to service method.

__Response:__ an array of `CoachSkater` objects within a `skaters` key:


```  
{
  "skaters": [
    {
      "id": 1,
      "name": "Ella Kumela",
      "federation_letter_status": false,
      "events": [
        {
          "name": "Junior Men",
          "coaching_role": "First Coach",
          "music_complete": false,
          "ppc_complete": true
        },
        [...]
      ]
    },
    [...]
  ]
}
```

At the minimum, this endpoint should return an empty array in the `skaters` key


### Get State Options
__Purpose:__ Return a list of options for the coach search State input

__Request Payload:__ None

__Response:__ an array of `SelectOption` objects within a `state_options` key:


```  
{
  "state_options": [
    {
      "value": "AL",
      "label": "Alabama"
    },
    [...]
  ]
}
```
Note: Label will display as provided within input, and value will be passed as data point to coach search endpoint.


### Search Coaches
__Purpose:__ Search for a coach based on user supplied criteria

__Request Payload:__ `CoachSearchParams` object:

```  
{
  "member_number": "1234567",
  "first_name": "Jennifer",
  "last_name": "Bralick",
  "state": "FL"
}
```

Note: all parameters are optional and might not be included with search requests

__Response:__ an array of `CoachResult` objects within a `coaches` key:

```  
{
  "coaches": [
    {
      "id": 274,
      "first_name": "Jennifer",
      "last_name": "Bralick",
      "state_abbreviation": "FL",
      "member_number": 1234567,
      "club_name": "1 - All Your FSC (First Family)",
      "ineligible": false
    },
    [...]
  ]
}
```

Note: Coach results will display in the order returned by the API


##Skater
### Get Competition Event Coaches
__Purpose:__ Return a list of all the event categories and their associated coaches a skater has for a given competition

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data to service method.

__Response:__ an array of `SkaterCoachedEventCategory` objects within a `event_categories` key:


```  
{
  "event_categories": [
    {
      "id": 1,
      "name": "Singles",
      "coach_limit":2,
      "coaches": [
        {
          "id": 1,
          "first_name": "Jennifer",
          "last_name": "Bralick",
          "state_abbreviation": "FL",
          "member_number": "1234567",
          "club_name": "All Your FSC (First Family)",
          "ineligible": false
        },
        [...]
      ]
    },
   [...]
  ]
}
```


### Add Competition Event Coach
__Purpose:__ Add a coach to the active user's coaches for an event category within a competition

__Request Payload:__ Along with the following payload, `competition_id` provided as possible url segment
```  
{
  "competition_id": 1,            -  The ID of the active competition
  "coach_id": 1,                  - The ID of the coach to add
  "event_category_id": 1          - The event category ID for the coach to be added to
}
```

__Response:__ Object containing key indicating the addition was successful:
              
```  
{
"success": true
}
```


### Remove Competition Event Coach
__Purpose:__ Remove a coach from the active user's coaches for an event category within a competition

__Request Payload:__ Along with the following payload, `competition_id` provided as possible url segment
```  
{
  "competition_id": 1,            -  The ID of the active competition
  "coach_id": 1,                  - The ID of the coach to remove
  "event_category_id": 1          - The event category ID for the coach to be removed from
}
```

__Response:__ Object containing key indicating the removal was successful:
              
```  
{
"success": true
}
```

### Replace Competition Event Coach
__Purpose:__ Replace a coach in the active user's coaches for an event category within a competition with a new coach

__Request Payload:__ Along with the following payload, `competition_id` provided as possible url segment
```  
{
  "competition_id": 1,            - The ID of the active competition
  "replacement_coach_id": 1,      - The ID of the coach to use as a replacement
  "event_category_id": 1,         - The event category ID for the coach to be removed from
  "previous_coach_id": 1          - The ID of the coach being replaced
}
```

__Response:__ Object containing key indicating the replacement was successful:
              
```  
{
"success": true
}
```

### Get Competition Event Segments
__Purpose:__ Get all the event segments for a skater within a competition.  Used to populate the Music and PPC page.

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data to service method.

__Response:__ an array of `SkaterSkatingEventSegment` objects within a `skating_event_segments` key:


```  
{
  "skater_event_segments": [
    {
      "event_name": "PrePreliminary Girls Free Skate",
      "segment_name": "Free Skate / Free Dance",
      "event_id": 1,
      "segment_id": 1,
      "ppc_required": true,
      "music_required": true,
      "is_ppc_complete": false,
      "is_music_complete": false,
      "ppc_last_modified_timestamp": 1533794400,
      "music_last_modified_timestamp": 1528524000,
      competition_skated_event_id: 4
    }
    [...]
  ]
}
```

### Get PPC
__Purpose:__ Get the Skater's PPC for an event segment.

__Request Payload:__  `event_id`, `event_segment_id`, `competition_id`, `competition_skated_event_id` are provided in GET request parameters.

__Response:__ A `SkaterPPC` object within a `ppc` key.  Note, the expected response contains the standard keys of "number_of_combos" and "description".
`competition_id`, `event_id`, `event_segment_id`, `competition_skated_event_id`, keys with corresponding data 
```  
{
  "event_id": 1,
  "event_segment_id": 1,
  "competition_id": 1,
  "competition_skated_event_id": 1
  "ppc": {
    "elements": [
      {
        "moves": [
          {
            "id": 1,
            "category_id": 2,
            "type_id": 5,
            "description": "Single-Toeloop",
            "code": "1T",
            "is_combo": false,
            "is_transition": false,
            "number_of_combos": 0,
            "exclude_from_combos": false
          },
          {
            "id": 5,
            "category_id": 2,
            "type_id": 5,
            "description": "Single-Lutz",
            "code": "1Lz",
            "is_combo": false,
            "is_transition": false,
            "number_of_combos": 0,
            "exclude_from_combos": false
          }
        ],
        "type": {
          "id": 5,
          "description": "Jumps"
        },
        "element": {
          "id": 25,
          "category_id": 2,
          "type_id": 5,
          "description": "2-Jump Combination",
          "code": null,
          "is_combo": true,
          "is_transition": false,
          "number_of_combos": 2,
          "exclude_from_combos": true
        }
      },
      {
        "moves": [],
        "type": {
          "id": 5,
          "description": "Jumps"
        },
        "element": {
          "id": 1,
          "category_id": 2,
          "type_id": 5,
          "description": "Single-Toeloop",
          "code": "1T",
          "is_combo": false,
          "is_transition": false,
          "number_of_combos": 0,
          "exclude_from_combos": false
        }
      },
      [...]
    ]
  }
}
```



### Save PPC
__Purpose:__ Save the user's PPC

__Request Payload:__ The skater's  `SkaterPPC` within a `ppc` key and supporting `competition_id`, `event_id`, `event_segment_id` and `competition_skated_event_id` information.
Note: when saving a PPC, the "description" field for moves is called "name" and the "number_of_combos" field is renamed "move_count"

```  
{
  "event_id": 1,
  "event_segment_id": 1,
  "competition_id": 1,
  "competition_skated_event_id": 4,
  "ppc": {
    "elements": [
      {
        "moves": [
          {
            "id": 1,
            "category_id": 2,
            "type_id": 5,
            "name": "Single-Toeloop",
            "code": "1T",
            "is_combo": false,
            "is_transition": false,
            "move_count": 0,
            "exclude_from_combos": false
          },
          {
            "id": 5,
            "category_id": 2,
            "type_id": 5,
            "name": "Single-Lutz",
            "code": "1Lz",
            "is_combo": false,
            "is_transition": false,
            "move_count": 0,
            "exclude_from_combos": false
          }
        ],
        "type": {
          "id": 5,
          "name": "Jumps"
        },
        "element": {
          "id": 25,
          "category_id": 2,
          "type_id": 5,
          "name": "2-Jump Combination",
          "code": null,
          "is_combo": true,
          "is_transition": false,
          "move_count": 2,
          "exclude_from_combos": true
        }
      },
      {
        "moves": [],
        "type": {
          "id": 5,
          "name": "Jumps"
        },
        "element": {
          "id": 1,
          "category_id": 2,
          "type_id": 5,
          "name": "Single-Toeloop",
          "code": "1T",
          "is_combo": false,
          "is_transition": false,
          "move_count": 0,
          "exclude_from_combos": false
        }
      },
      [...]
    ]
  }
}
```

__Response:__  Information about the PPC following save:

```  
{
  success: true,                - Whether the save was successful
  is_complete: true,            - Whether the resulting PPC is complete
  last_modified: 1532405964     - Unix timestamp indicating the recorded time for the save
}
```


## User
### Get User Info
__Purpose:__ Get general information about the currently logged in user

__Request Payload:__ None

__Response:__ A `UserInformation` objects within a `user` key:


```  
{
  "user": {
    "user_type": "coach"
  }
}
```