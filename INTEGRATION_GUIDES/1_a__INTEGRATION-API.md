# API INTEGRATION
This document supersedes any previous API documentation. 


#API Objects
## Simple Objects
### Billing Address
Represents a saved billing address for a skater
```  
id:number                        - Identifier for the billing address (1)
first_name:string                ("Jane")
last_name:string                 ("Skater")
street:string                    ("10 1st Street")
street_2:string|null             - Optional second part of billing address.  Is null when not present ("Apartment 3C")
city:string                      ("Colorado Springs")
state:string                     ("CO")
zip_code:number                  (80906)
is_default:boolean               - Whether the address is saved as the default for the user (true)
```


###CartCredit
This object represents a credit in the user's cart

```  
amount: number                   - Amount of credits
competition_id: number           - ID for the associated competition
competition_name: string         - Name of the associated competition
cost: number                     - Total cost of the credits (not per-credit cost) 
credit_type: string              - Type of the credit (opi,upi,wu)
event_id: number                 - ID for the associated Event
event_name: string               - Name of the associated Event
```


###CartPackage
This object represents a credit package in the user's cart

```  
 cost: number                      - Cost of the package
 id: number                        - ID of the source package
 credits: {                        - Amount of credits incuded in the package
   opi: number
   upi: number
   wu: number
 },
 competition_name: string          - Name of the associated competition
 event_name: string                - Name of the associated event
 competition_id: number            - ID of the associated competition
 event_id:number                   - ID of the associated event
 name: string                      - Name of the package ("Type:Amount/Type:Amount")
```


### Competition
This object represents the minimal essential information for a Competition. 

```  
    id: number;                          - unique identifier for each Competition
    name: string;                        - The name of the Competition
    start_date: number;                  - Unix timestamp for start date
    end_date: number;                    - Unix timestamp for start date
    icon: string;                        - url string linking to the Competition icon image
    schedule_available: boolean;         - whether skaters can access "My Schedule"
    practice_ice_available: boolean;     - whether skaters can access "Practice Ice/Schedule"
    active_sales_window: string;         - Key for the active sales window. Options are "open_sales", "none", "pre_purchase", "selection", "on_site"
    directions?: {                       - [OPTIONAL] Array of Directions information for the competition.
        location_name: string;           - The name of the location
        link: string;                    - Directions link URL
    }[]
    announcement_url?: string;           - [OPTIONAL] URL for the Competition Announcement
    website_url?: string;                - [OPTIONAL] URL for the Competition Website
```


### Credit Config
A Credit Config represents the important data related to a Session Credit Type

```  
	key: string;						- The type of session this config is for.  Options are "opi","upi" and "wu"
	cost: number;						- The current cost for purchasing a credit of this type for this event. Whole numbers currently supported.
	limit: number;						- The maximum of this Credit Type a skater can schedule for this event
```


### Credit Package Config
This object represents a Credit Package available for an event.

```  
	cost: number;                - The cost of the credit package 
	id: number;                  - Unique identifier for the credit package
	credits: {                   - CreditType-keyed object of credits included in the package.  Key-value pairs are only required for credits included in the package 
	  opi: number;           
	  upi: number;           
	},                           
	event_id: number;            - The ID for the event associated with the package 
``` 


### Credit State
The Credit State object represents the current state of a set of Credits for a context

```  
	opi: number;
	wu: number;
	upi: number;
```


### Facility
This represents a Facility for a Competition

```  
	id: number										- A unique identifier for the Facility
	name: string;									- The name of the Facility
```


### Rink
The rink represents a Rink for a Competition

```  
	id: number;										- Unique identifier for the Rink
	name: string;									- Name of the Rink
	facility_id: number								- The ID of the Facility to which the Rink belongs
```


### Sales Window
This object represents a sales window within a competition

 ```  
 	name: string;							- The name of the Sales Window, eg: "Open Sales"
 	start_datetime_timestamp: number;		- Unix timestamp for when the Sales Window opens
 	end_datetime_timestamp: number;			- Unix timestamp for when the Sales Window closes
 	start_datetime_formatted:string;		- String representation for when the Sales Window opens.  eg "4/12/2019 8:04AM PST"
 	end_datetime_formatted:string;			- String representation for when the Sales Window closes.  eg "4/12/2019 8:04AM PST"
 	key:string;								- Key identifier for Sales Window.  Possible options are "pre_purchase", "selection", "open_sales" and "on_site"
 
 ```
 
### Skater Info
This object represents basic information about the active user

```  
  first_name: string
  last_name: string
  address: {
    street: string
    street_2: string | null
    city: string
    state: string
    zip_code: string | number
  }
```


  
### Skating Event
This object represents the core of a Skating Event.  
 
```  
	id: number;								- Unique identifier for event
	name: string;							- Name of event
	competition_id:number;                  - ID for the competition to which the event belongs
```



## Session Objects
The Session objects all extend from the same abstract data set. Session instances require all the base data points, as 
well as data points unique to each type of Session Object

### Base Session
All Sessions must have the following data

```  
	id: number;															- Unique identifier for the Session
	name: string;														- Name of the Session
	utc_timezone_offset:number                                          - Timezone offset from UTC for Session in minutes (west of UTC is positive.  EG: MDT is 6*60=360) 
	date: number;														- Unix timestamp for the date of the Session.  NOTE: This must be set to time 00:00:00 on the appropriate date to ensure proper functionality
	time_start: number;													- Unix timestamp for when the Session starts.
	time_end: number;													- Unix timestamp for when the Session ends.
	slots_registered: number;											- Number of skaters who have registered for the Session
	slots_available: number;											- Number of total slots available for the Session
	rink_id: number;													- The ID of the Rink to which the Session belongs
	rink: RinkDataComplete												- The CompleteRink data object for the associated Rink
	event_ids: number[]													- Array of event ids the Session is linked to
	type_key: ('practice_ice' | 'warm_up' | 'event' | 'resurface');		- The type of Session. 
```


### Event Session
The Event Session represents a session for a Skating Event

```  
	event_type: string;			- Key for the type of Event the Session is associated with.  Originally used to determine icon classes. Current supported options: "ladies"
	icon_color:string;			- Optional.  Hex code for the Session's icon color 
```


### Practice Ice
The Practice Ice Session represents a practice ice session (with OPI and/or UPI subtypes)

```  
practice_ice_types:SessionType[] - Array of session types ('opi' and/or 'upi') for the Practice Ice. 
```


### Warm Up
Warm Up Sessions have no additional data on top of the Base Session Data


### Resurface
Resurface Sessions have no additional data requirements.  They still require the same data points as a Base Session, 
but the event_ids and slots data points are not displayed and can be empty instances of the proper types.



## Complex Objects
### Competition Information
This object represents more detailed information for a Competition.

```  
	sales_windows: SalesWindow[];					- An array of Sales Windows
	practice_ice_instructions: string;				- A string for practice ice instructions.  HTML permitted			    
	practice_ice_terminology: string;				- A string for practice ice terminology.  HTML permitted
	skating_events: CompleteSkatingEvent[]			- An array of Complete Skating Events (including Credit Configs)
	schedulable_session_types: string[]				- An array of strings representing the skater selectable type keys for the competition. Array items can be any combination of "opi","upi" and "wu"
	competition_id:number                           - ID representing the competition to which the information belongs
	pricing_message:string|false                    - OPTIONAL - message to display on Competition Information Page in place of pricing information 
```

__Note__: If pricing_message is provided, it will display in place of pricing information on Competition Information
page regardless of any other criteria. 


### Competition Schedule
The Competition Schedule represents the data related to a competition's schedule

```  
	facilities: Facility[];						- An array of Facilities for the Competition 
	rinks: CompleteRink[];						- An array of Complete Rinks for the Competition
	sessions: Session[]							- An array of all the Sessions for the Competition
```


### Competition Skater Credits
This object represents all the credit information for a user for a given Competition

All skater-registered events need to be represented in the `event_credits` object, even if all credit values are 0

```  
	event_credits:EventCreditState[]    - Array of EventCreditState objects for all the events the user is registered for.
	purchased_package_ids: number[]     - Array of the IDS of credit packages the skater has already purchased 
```


### CompleteRink
A Complete Rink consists of a Rink as well as the Facility to which it belongs

```  
	id: number;										- Unique identifier for the Rink
	name: string;									- Name of the Rink
	facility_id: number								- The ID of the Facility to which the Rink belongs
	facility:Facility								- Facility data object for the Facility to which the Rink belongs (outlined above)
```

 
### Complete Skating Event
This object is an extension of the Skating Event object.  It contains more detailed information.

```   
	id: number;								- Same identifier as event it extends
	competition_id:number;                  - ID for the competition to which the event belongs
	name: string;							- Same name as event it extends
	credit_config: array					- An array of CreditConfigs.  Include a CreditConfig for each Credit Type.  If an Event doesn't feature a Credit Type, set the limit and cost to 0
	credit_packages: array;					- An array of CreditPackageConfigs
``` 


### Event Credit State
This object represents the skater's credit state for a given event. 

The total credits included in this object represent all the credits the skater has purchased both as single credits and 
through package purchases.

```  
	event_id: number;					- The Event ID for which the Credits apply
	total: CreditState;					- CreditState representing the total Credits the skater has purchased for the Event.  This includes credits purchased individually as well as part of packages
	scheduled: CreditState;				- CreditState representing the scheduled Credits the skater has purchased for the Event
```


### Scheduled Session
The Scheduled Session represents a Session a user has either in their schedule or in their cart

```  
	session: Session			    - The data for the associated Session object
	scheduled_as: SessionType		- The type the session was scheduled as.  "wu","opi","upi" or "event"
	scheduled_event_id: number		- The ID of the Event the Session was scheduled for
```


### Skater Schedule
The skater schedule contains information about the skater's schedule for the competition

```  
	sessions: ScheduledSession[]	- Array of Scheduled Session objects representing the sessions the Skater has in their schedule for the specified Competition
	events: SkatingEvent[]			- Array of Skating Event data containing the events the Active User's is registered for in the speficied Competition. Note, this is core Skating Event and not Complete Skating Event
```

### Skater Cart
Representation of the items in the active user's cart. Return an empty array for each key that has no data

```  
  sessions:ScheduledSession[]
  credits:CartCredit[]
  packages:CartPackage[]
```



#API Endpoints
Even when data is not present, endpoints should return empty representations of their top level properties.  

See "Get Competition Schedule" as an example. 

## Competitions
### Get Competition List
__Purpose:__ Return a list of Competitions for which the active user is registered.

__Response:__ an array of `Competition` objects:

```  
[
 {
     "id": 1,
     "name": "2018 Test Competition",
     "start_date": 1563688800,
     "end_date": 1569132000,
     "icon": "/images/2018-MW-Adult.png",
     "schedule_available": true,
     "practice_ice_available": true,
     "active_sales_window": "open_sales",
     "directions": [
       {
         "location_name": "Great Park Ice",
         "link": "https://www.google.com/maps/dir//maps+Great+Park+Ice/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x80dcc3626e80b181:0x13ed30cbfcdd99c3?sa=X&ved=2ahUKEwj55PrA7d_kAhVRop4KHcQ7DzgQ9RcwFHoECA8QEA"
       }
     ],
     "announcement_url": "https://placehold.it/720x480&text=Announcement+PDF+Document",
     "website_url": "https://placehold.it/720x480&text=Competition+Website"
   },
   {
     "id": 2,
     "name": "2018 U.S. Adult Figure Skating Championship",
     "start_date": 1563688800,
     "end_date": 1569132000,
     "icon": "/images/bg.png",
     "schedule_available": true,
     "practice_ice_available": true,
     "active_sales_window": "open_sales",
     "directions": [
       {
         "location_name": "Great Park Ice",
         "link": "https://www.google.com/maps/dir//maps+Great+Park+Ice/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x80dcc3626e80b181:0x13ed30cbfcdd99c3?sa=X&ved=2ahUKEwj55PrA7d_kAhVRop4KHcQ7DzgQ9RcwFHoECA8QEA"
       },
       {
         "location_name": "Secondary Location",
         "link": "https://www.google.com/maps/dir//maps+Great+Park+Ice/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x80dcc3626e80b181:0x13ed30cbfcdd99c3?sa=X&ved=2ahUKEwj55PrA7d_kAhVRop4KHcQ7DzgQ9RcwFHoECA8QEA"
       }
     ]
   },
   {
     "id": 3,
     "name": "Madison Open",
     "start_date": 1563688800,
     "end_date": 1569132000,
     "icon": "/images/madison-open-noyear.png",
     "schedule_available": true,
     "practice_ice_available": true,
     "active_sales_window": "open_sales"
   },
  [...]
]
```


### Get Competition Information
__Purpose:__ Return the `CompetitionInformation` object for the specified Competition.

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data to service method.

__Response:__ the `CompetitionInformation` object for the specified `competition_id`:

```  
{
  "sales_windows": [
    {
      "key": "pre_purchase",
      "name": "Pre-Purchase Sales",
      "start_datetime_timestamp": 1519225200,
      "end_datetime_timestamp": 1520002800,
      "start_datetime_formatted": "2/21/2018 8:00AM MDT",
      "end_datetime_formatted": "3/2/2018 8:00AM MDT"
    },
    {
      "key": "selection",
      "name": "Pre-Purchase Selection",
      "start_datetime_timestamp": 1520002800,
      "end_datetime_timestamp": 1522418400,
      "start_datetime_formatted": "3/2/2018 8:00AM MDT",
      "end_datetime_formatted": "3/30/2018 8:00AM MDT"
    },
    {
      "key": "open_sales",
      "name": "Open Sales",
      "start_datetime_timestamp": 1522418400,
      "end_datetime_timestamp": 1563714000,
      "start_datetime_formatted": "3/30/2018 8:00AM MDT",
      "end_datetime_formatted": "7/21/2019 7:00AM MDT"
    },
    {
      "key": "on_site",
      "name": "On-Site Sales",
      "start_datetime_timestamp": 1563714000,
      "end_datetime_timestamp": 1569161400,
      "start_datetime_formatted": "7/21/2019 7:00AM MDT",
      "end_datetime_formatted": "9/22/2019 8:10AM MDT"
    }
  ],
  "competition_id": "1",
  "practice_ice_instructions": "<h1>Et non tenetur.</h1> Alias dignissimos nisi nemo provident ut omnis occaecati. Quo numquam quo aut non. Repudiandae voluptate neque earum. Sunt temporibus et. Cupiditate rerum consequatur delectus.",
  "practice_ice_terminology": "Et non tenetur. <em>Alias dignissimos nisi nemo</em> provident ut omnis occaecati. Quo numquam quo aut non. Repudiandae voluptate neque earum. Sunt temporibus et. Cupiditate rerum consequatur delectus.",
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
        {
          "cost": 20,
          "id": 2,
          "credits": {
            "wu": 1,
            "upi": 2
          },
          "event_id": 1
        }
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


### Get Competition Schedule
__Purpose:__ return the `CompetitionSchedule` for the specified Competition.

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data.

__Response:__ the `CompetitionSchedule` object for the specified `competition_id`:

```  
{
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
      "event_ids": [
        1
      ]
    },
    [...]
  ]
}
```
Even if a schedule is not posted, the minimum response should include

```  
{
	rinks:[],
	facilities:[],
	sessions:[]
}
```



## Skater
### Get Skater Competition Schedule
__Purpose:__ Return the Skater Registered Events and Sessions for a Competition for the Active User

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data.

__Response:__ `SkaterSchedule` Object

```  
{
  "events": [
    {
      "id": 1,
      "name": "Intermediate Ladies"
    },
    [...]
  ],
  "sessions": [
    {
      "scheduled_as": "upi",
      "scheduled_event_id": 1,
      "session": {
        "name": "Practice Ice (IL + IP)",
        "time_start": 1563811800,
        "date": 1563775200,
        "time_end": 1563813300,
        "slots_registered": 6,
        "slots_available": 15,
        "type_key": "practice_ice",
        "practice_ice_types": [
          "upi"
        ],
        "location": "Location Name",
        "id": 10,
        "rink": {
          "id": 1,
          "name": "OLY",
          "facility_id": 1,
          "facility": {
            "name": "Broadmoor World Arena",
            "id": 1
          }
        },
        "event_ids": [
          1,
          2
        ]
      }
    },
    [...]
  ]
}
```
Even if skater has nothing in their schedule, the minimum response should include

```  
{
	events:[],
	sessions:[]
}
```

### Get Competition Credits
__Purpose:__ Return the Event Credit States for all the Events for which the Active User is registered in the specified 
Competition as well as which packages they have already purchased

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data.

__Response:__ `CompetitionSkaterCredits` object for the specified competition

The `event_credits` object must contain an entry for all the events for which the skater is registered in the competition,
even if the skater has not acquired any credits for that event (values will be 0). 

```  
{
  "event_credits": [
    {
      "event_id": 1,
      "total": {
        "opi": 1,
        "wu": 1,
        "upi": 1
      },
      "scheduled": {
        "opi": 0,
        "wu": 0,
        "upi": 1
      }
    },
    {
      "event_id": 2,
      "total": {
        "opi": 0,
        "wu": 0,
        "upi": 0
      },
      "scheduled": {
        "opi": 0,
        "wu": 0,
        "upi": 0
      }
    }
  ],
  "purchased_package_ids": []
}
```

purchased_package_ids was added in Batch 4


### Add Session To Schedule
__Purpose:__ Add a session to the skater's schedule

__Request Payload:__

```  
{
  "scheduled_as": "opi",
  "scheduled_event_id": 1,
  "session_id": 1
}
```

__Response:__ Object containing key indicating the addition was successful:

```  
{
  "success": true
}
```


### Remove Session From Schedule
__Purpose:__ Remove a session from the skater's schedule

__Request Payload:__

```  
{
  "scheduled_as": "opi",
  "scheduled_event_id": 1,
  "session_id": 1
}
```

__Response:__ Object containing key indicating the addition was successful:
              
```  
{
  "success": true
}
```


### Get Competition Registered Event IDS
__Purpose:__ Return an array of Event ids for which the Active User is registered in the specified Competition.

__Request Payload:__ None, but `competition_id` provided as possible url segment or possible request data.

__Response:__ Array containing  Event IDs for which the Active User is registered in the specified Competition
If skater is not registered for any events, return an empty array


### Get Billing Addresses
__Purpose:__ Return the list of saved addresses for the active skater.

__Request Payload:__ None

__Response:__ Array containing saved skater `BillingAddresses`.  Empty array if skater has no saved addresses

```  
[
  {
    "id": 1,
    "first_name": "Jane",
    "last_name": "Skater",
    "street": "10 1st Street",
    "street_2": null,
    "city": "Colorado Springs",
    "state": "CO",
    "zip_code": 80906,
    "is_default": true
  },
  [...]
]
```


### Update Billing Address
__Purpose:__ Save updates to a previously saved skater address

__Request Payload:__ Object containing source `BillingAddresses`, and data representing the modified version:

```  
{
  "source": {
    "id": 1,
    "first_name": "Jane",
    "last_name": "Skater",
    "street": "10 1st Street",
    "street_2": null,
    "city": "Colorado Springs",
    "state": "CO",
    "zip_code": 80906
    "is_default": true,
  },
  "data": {
    "first_name": "Jane",
    "last_name": "Skater",
    "street": "10 1st Street",
    "street_2": null,
    "city": "Colorado Springs",
    "state": "CO",
    "zip_code": 80906,
    "is_default": true
  }
}
```

__Response:__ Object containing key indicating the addition was successful:
                           
```  
{
  "success": true
}
```


### Create Billing Address
__Purpose:__ Create a new billing address

__Request Payload:__ Address data:

```  
{
  "first_name": "Skater ",
  "last_name": "Name",
  "street": "123 Fake Street",
  "street_2": "APT 2C",
  "city": "Denver",
  "state": "CO",
  "zip_code": "80209",
  "is_default": true
}
```

__Response:__ The ID of the newly saved Billing Address (number)


### Get Skater Info
__Purpose:__ Retrieve foundational information for the logged in skater.
This is used to pre-populate the billing address form in the event the skater has no saved addresses

__Request Payload:__ None

__Response:__ `SkaterInfo` for the active skater

```  
{
  "first_name": "test",
  "last_name": "name",
  "address": {
    "street": "123 fake street",
    "street_2": null,
    "city": "denver",
    "state": "CO",
    "zip_code": 12345
  }
}
```



## Cart
### Add Session
__Purpose:__ Add a session to the user's cart

__Request Payload:__

```  
{
  "scheduled_as": "upi",
  "scheduled_event_id": 1,
  "session_id": 1,
  "cost": 30
}
```

__Response:__ Object containing key indicating the addition was successful:
                                         
```  
{
  "success": true
}
```


### Get Skater Cart
__Purpose:__ return data related to the current user's Cart.

__Request Payload:__ None

__Response:__ `SkaterCart` for the logged in user. 

```  
{
  "sessions": [
    {
      "scheduled_as": "opi",
      "scheduled_event_id": 1,
      "cost": 30,
      "session": {
        "name": "Practice Ice (IL + IP)",
        "time_start": 1563801300,
        "date": 1563775200,
        "time_end": 1563802800,
        "slots_registered": 6,
        "slots_available": 15,
        "type_key": "practice_ice",
        "practice_ice_types": [
          "upi",
          "opi"
        ],
        "id": 3,
        "rink": {
          "id": 1,
          "name": "OLY",
          "facility_id": 1,
          "facility": {
            "name": "Broadmoor World Arena",
            "id": 1
          }
        },
        "event_ids": [
          1,
          2
        ]
      },
      "competition_id": 1,
      "competition_name": "2018 Midwestern Adult Sectional Figure Skating Championship (All Selectable)",
      "scheduled_event_name": "Intermediate Ladies"
    }
  ],
  "credits": [
    {
      "amount": 1,
      "competition_id": 1,
      "competition_name": "2018 Midwestern Adult Sectional Figure Skating Championship (All Selectable)",
      "cost": 35,
      "credit_type": "opi",
      "event_id": 1,
      "event_name": "Intermediate Ladies"
    }
  ],
  "packages": [
    {
      "cost": 10,
      "id": 131,
      "credits": {
        "opi": 1,
        "upi": 2,
        "wu": 0
      },
      "competition_name": "Prepurchase Sales",
      "event_name": "Intermediate Ladies",
      "competition_id": 5,
      "event_id": 13,
      "name": "OPI:1/UPI:2"
    }
  ]
}
```


### Remove Session From Cart
__Purpose:__ Remove a session from the user's cart.

__Request Payload:__ Object containing id of the session to remove

```  
{
session_id:1
}
```

__Response:__ Object containing key indicating the addition was successful:
                                                       
```  
{
  "success": true
}
```


### Add Credits to Cart
__Purpose:__ Add Credits (packages and individual) to the cart

__Request Payload:__ Object containing `credits` and `packages` keys with the respective objects to add to the cart:

```  
{
  "credits": [
    {
      "competition_id": 5,
      "event_name": "Intermediate Ladies",
      "competition_name": "Prepurchase Sales",
      "event_id": 13,
      "credit_type": "opi",
      "amount": 2,
      "cost": 35
    },
   [...]
  ],
  "packages": [
    {
      "cost": 20,
      "competition_id": 5,
      "event_id": 13,
      "event_name": "Intermediate Ladies",
      "competition_name": "Prepurchase Sales",
      "id": 132,
      "name": "UPI:2/WU:1",
      "credits": {
        "opi": 0,
        "upi": 2,
        "wu": 1
      }
    },
    [...]
  ]
}
```

__Response:__ Object containing key indicating the addition was successful:
                                                                     
```  
{
  "success": true
}
```


### Remove Credit From Cart
__Purpose:__ Remove a credit from the cart

__Request Payload:__ Representation of the credit item to remove:

```  
{
  "competition_id": 1,
  "event_name": "Intermediate Ladies",
  "competition_name": "2018 Midwestern Adult Sectional Figure Skating Championship (All Selectable)",
  "event_id": 1,
  "credit_type": "opi",
  "amount": 1,
  "cost": 35
}
```

__Response:__ Object containing key indicating the addition was successful:
                                                                                   
```  
{
  "success": true
}
```


### Complete Order
__Purpose:__ Complete a user's order

__Request Payload:__ Object containing `card`, `address` and `cart` keys containing information pertinent to each.
`cart` key in turn contains `total_cost`, `scheduled_sessions`, `credits` and `credit_packages` keys 

```  
{
  "payment_info": {
    "card": {
      "number": 4242424242424242,
      "cvc": "223",
      "expiration_month": 1,
      "expiration_year": 2019,
      "type": "visa",
      "type_formatted": "Visa",
      "number_formatted": "4242 4242 4242 4242"
    },
    "address": {
      "street_2": null,
      "is_default": true,
      "id": 585,
      "first_name": "test",
      "last_name": "name",
      "street": "123 fake street",
      "city": "denver",
      "state": "CO",
      "zip_code": 12345
    }
  },
  "cart": {
    "total_cost": 75,
    "scheduled_sessions": {
      "scheduled_sessions": [
        {
          "session": {
            "slots_registered": 6,
            "slots_available": 15,
            "_is_event": false,
            "_is_resurface": false,
            "_credit_types": [
              "upi",
              "opi"
            ],
            "_location": "",
            "_cost": 0,
            "name": "Practice Ice (IL + IP)",
            "_id": 3,
            "_date": "2019-07-22T06:00:00.000Z",
            "_time_start": "2019-07-22T13:15:00.000Z",
            "_time_end": "2019-07-22T13:40:00.000Z",
            "_pretty_time_start": "7:15",
            "_time_start_meridian": "AM",
            "_time_end_meridian": "AM",
            "_pretty_time_end": "7:40",
            "_rink": {
              "_name": "OLY",
              "_facility": {
                "_name": "Broadmoor World Arena",
                "_id": 1
              },
              "_id": 1,
              "_full_name": "OLY - Broadmoor World Arena"
            },
            "_facility_name": "Broadmoor World Arena",
            "_event_ids": [
              1,
              2
            ],
            "_type_key": "practice_ice",
            "_types": [
              "upi",
              "opi"
            ],
            "_type_code": "UPI/OPI",
            "_type_description": "Practice Ice (UPI/OPI)"
          },
          "scheduled_as": "opi",
          "scheduled_event_id": 1,
          "cart_item_type_key": "session",
          "competition_id": 1,
          "cost": 30,
          "scheduled_event_name": "Intermediate Ladies",
          "competition_name": "2018 Midwestern Adult Sectional Figure Skating Championship (All Selectable)"
        }
      ]
    },
    "credits": {
      "cart_credits": [
        {
          "cart_item_type_key": "credit",
          "competition_id": 1,
          "event_name": "Intermediate Ladies",
          "competition_name": "2018 Midwestern Adult Sectional Figure Skating Championship (All Selectable)",
          "event_id": 1,
          "credit_type": "opi",
          "amount": 1,
          "cost": 35,
          "cart_description": "OPI Credit"
        }
      ]
    },
    "credit_packages": {
      "credit_packages": [
        {
          "cart_item_type_key": "credit_package",
          "cost": 10,
          "competition_id": 5,
          "event_id": 13,
          "event_name": "Intermediate Ladies",
          "competition_name": "Prepurchase Sales",
          "id": 131,
          "name": "OPI:1/UPI:2",
          "credits": {
            "opi": 1,
            "upi": 2,
            "wu": 0
          }
        }
      ]
    }
  }
}
```

__Response:__ Object containing success and message keys.  If success is true, page directs to confirmation page.  If
success is false, message must be provided and will display on the page. 

```  
{
  "success": true,
  "message": ""
}
```

When completing an order, the total of all credits should be added to the corresponding keys returned by the CompetitionSkaterCredits.

### Remove Credit Package From Cart
__Purpose:__ Remove a credit package from the cart

__Request Payload:__ Object representing the credit package to remove

```  
{
  "cart_item_type_key": "credit_package",
  "cost": 10,
  "competition_id": 5,
  "event_id": 13,
  "event_name": "Intermediate Ladies",
  "competition_name": "Prepurchase Sales",
  "id": 131,
  "name": "OPI:1/UPI:2",
  "credits": {
    "opi": 1,
    "upi": 2,
    "wu": 0
  }
}
```

__Response:__ Object containing key indicating the addition was successful:
                                                                                                
```  
{
  "success": true
}
```