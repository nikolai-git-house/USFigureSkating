# Integration Guide - Batch 2
This document is specific to Batch 2 integration. For information about Batch 1, see the README and INTEGRATION files.

##Data

The app relies on various endpoints to function. Each data endpoint has a data adaption layer than can be modified if necessary in order to translate data sets into formats usable by the application.  While there is some latitude involved, data points and data retrieval endpoints must be adhered to or additional updates to the app architecture may be necessary.  

## Objects

### Competition
This object represents the minimal essential information for a Competition. 

Competitions must be resolved using the following data points:

```  

	id: number;                          - unique identifier for each Competition
	name: string;						 - The name of the Competition 
	start_date: number;                  - Unix timestamp for start date
	end_date: number;                    - Unix timestamp for start date
	icon: string;                        - url string linking to the Competition icon image
	schedule_available: boolean;         - whether skaters can access "My Schedule"
	practice_ice_available: boolean;     - whether skaters can access "Practice Ice/Schedule"

```
### Credit Config

A Credit Config represents the important data related to a Session Credit Type


```  
	
	key: string;						- The type of session this config is for.  Options are "opi","upi" and "wu"
	cost: number;						- The current cost for purchasing a credit of this type for this event. Whole numbers currently supported.
	limit: number;						- The maximum of this Credit Type a skater can schedule for this event
	
```





### Sales Window
A sales window represents a Sales Window, which belongs to a Competition


```  
	name: string;							- The name of the Sales Window, eg: "Open Sales"
	start_datetime_timestamp: number;		- Unix timestamp for when the Sales Window opens
	end_datetime_timestamp: number;			- Unix timestamp for when the Sales Window closes
	start_datetime_formatted:string;		- String representation for when the Sales Window opens.  eg "4/12/2019 8:04AM PST"
	end_datetime_formatted:string;			- String representation for when the Sales Window closes.  eg "4/12/2019 8:04AM PST"
	key:string;								- Key identifier for Sales Window.  Possible options are "pre_purchase", "selection", "open_sales" and "on_site"

```

### Skating Event
This object represents the core of a Skating Event.  


```  

	id: number;								- Unique identifier for event
	name: string;							- Name of event

```

### Complete Skating Event
This object is an extension of the Skating Event object.  It requires the same fields, as well as:


```   

	id: number;								- Same identifier as event it extends
	name: string;							- Same name as event it extends
	credit_config: array					- An array of Credit Configs.  Include a Credit Config for each Credit Type.  If an Event doesn't feature a Credit Type, set the limit and cost to 0

```




### Competition Information
This object represents more substantial information for a Competition.


```  

	sales_windows: SalesWindow[];					- An array of Sales Windows
	practice_ice_instructions: string;				- A string for practice ice instructions.  HTML permitted			    
	practice_ice_terminology: string;				- A string for practice ice terminology.  HTML permitted
	skating_events: CompleteSkatingEvent[]			- An array of Complete Skating Events (including Credit Configs)
	schedulable_session_types: string[]				- An array of strings representing the skater selectable type keys for the competition. Array items can be any combination of "opi","upi" and "wu"

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

### Complete Rink
A Complete Rink consists of a Rink as well as the Facility to which it belongs


```  

	id: number;										- Unique identifier for the Rink
	name: string;									- Name of the Rink
	facility_id: number								- The ID of the Facility to which the Rink belongs
	facility:Facility								- Facility data object for the Facility to which the Rink belongs (outlined above)

```


### Session
The Session object type is abstract. Session instances require all the base data points, as well as data points unique to each extension

#### Base Session
All Sessions must have the following data

```  

	id: number;															- Unique identifier for the Session
	name: string;														- Name of the Session
	date: number;														- Unix timestamp for the date of the Session.  NOTE: This must be set to time 00:00:00 on the appropriate date to ensure proper functionality
	time_start: number;													- Unix timestamp for when the Session starts.
	time_end: number;													- Unix timestamp for when the Session ends.
	slots_registered: number;											- Number of skaters who have registered for the Session
	slots_available: number;											- Number of total slots available for the Session
	rink_id: number;													- The ID of the Rink to which the Session belongs
	rink: RinkDataComplete												- The complete CompleteRink data object for the associated Rink
	event_ids: number[]													- Array of event ids the Session is linked to
	type_key: ('practice_ice' | 'warm_up' | 'event' | 'resurface');		- The type of Session. 

```

#### Event Session

```  
event_type: string;			- Key for the type of Event the Session is associated with.  Originally used to determine icon classes. Current supported options: "ladies"
icon_color:string;			- Optional.  Hex code for the Session's icon color 
```

#### Practice Ice

```  
practice_ice_types:SessionType[] - Array of session types ('opi' and/or 'upi') for the Practice Ice. 
```

#### Warm Up
Warm Up Sessions have no additional data on top of the Base Session Data

#### Resurface
Resurface Sessions have no additional data requirements.  They still require the same data points as a Base Session, but the event_ids and slots data points can be empty instances of the proper types.

### Scheduled Session
The Scheduled Session represents a Session a user has either in their schedule or in their cart


```  

session: SessionData			- The data for the associated Session object
scheduled_as: SessionType		- The type the session was scheduled as.  "wu","opi","upi" or "event"
scheduled_event_id: number		- The ID of the Event the Session was scheduled for

```

### Cart Session
The Cart Session is an extension of the Scheduled Session object, with an additional `cost` (integer) field.

### Credit State
The Credit State object represents the current state of a set of Credits


```  

opi: number;
wu: number;
upi: number;

```


### Event Credit State


```  

event_id: number;					- The Event ID for which the Credits apply
total: CreditState;					- Credit State representing the total Credits the skater has purchased for the Event
scheduled: CreditState;				- Credit State representing the scheduled Credits the skater has purchased for the Event

```


### Competition Schedule
The Competition Schedule represents the data related to a competition's schedule


```  

	facilities: Facility[];						- An array of Facilities for the Competition 
	rinks: CompleteRink[];						- An array of Complete Rinks for the Competition
	sessions: Session[]							- An array of all the Sessions for the Competition

```









## Endpoints
### Competition
URLs for endpoints can be set in src/js/services/CompetitionService.ts  
#### Get Competition List
This endpoint should return a list of Competitions for which the active user is registered.

Payload: None

Expected Response: an array of `Competition` objects.

#### Get Competition Information
This endpoint should return the `CompetitionInformation` object for the specified Competition.

Payload: None, but `competition_id` provided as possible url segment or possible request data.

Expected Response: the `CompetitionInformation` object for the specified `competition_id`

#### Get Competition Schedule
This endpoint should return the `Competition Schedule` for the specified Competition.

Payload: None, but `competition_id` provided as possible url segment or possible request data.

Expected Response: the `CompetitionSchedule` object for the specified `competition_id`

### Skater
URLs for endpoints can be set in src/js/services/SkaterService.ts 

#### Get Competition Schedule
This endpoint should retrieve the Skater Registered Events and Sessions for a Competition for the Active User

Payload: None, but `competition_id` provided as possible url segment or possible request data.

Expected Response:

```  

sessions: ScheduledSession[]	- Array of Scheduled Session objects representing the sessions the Skater has in their schedule for the specified Competition
events: SkatingEvent[]			- Array of Skating Event data containing the events the Active User's is registered for in the speficied Competition. Note, this is core Skating Event and not Complete Skating Event

```

#### Get Competition Credits
This endpoint should retrieve the Event Credit States for all the Events for which the Active User is registered in the specified Competition

Payload: None, but `competition_id` provided as possible url segment or possible request data.
 
Expected Response: Array containing `Event Credit State` objects for all Active Skater-registered events in the specified Competition


#### Competition Registered Event IDs
This endpoint should return an array of Event ids for which the Active User is registered in the specified Competition.

Payload: None, but `competition_id` provided as possible url segment or possible request data.

Expected Response: Array containing an array of Event ids for which the Active User is registered in the specified Competition

#### Add Session to Schedule
A stub for this has been implemented, but no mock API call has been implemented. This method should post the necessary information to the Backend for adding a session to the Skater's schedule.

Payload: A `ScheduledSession` object is provided to this method.

Expected Response: N/A, but current method must resolve the Promise it returns.

#### Remove Session From Schedule
A stub for this has been implemented, but no mock API call has been implemented. This method should post the necessary information to the Backend for removing a session from the Skater's schedule.

Payload: A `ScheduledSession` object is provided to this method.

Expected Response: N/A, but current method must resolve the Promise it returns.

Expected Response: N/A, but current method must resolve the Promise it returns.

### Cart
URLs for endpoints can be set in src/js/services/CartService.ts 

#### Fetch Cart
This endpoint should return data related to the current user's Cart.

Payload: none

Expected Response: An array of `CartSession` objects.

#### Add Session
This endpoint should handle adding a session to the user's cart on the backend.

A stub for this has been implemented, but no mock API call has been implemented.

Payload: `scheduled_session` (ScheduledSession) and  `cost` (integer) arguments are provided to the method

Expected Response: N/A, but current method must resolve the Promise it returns.

#### Remove Session
This endpoint should handle removing a session from the user's cart on the backend.

A stub for this has been implemented, but no mock API call has been implemented.

Payload: `session_id` argument is provided to the method

Expected Response: N/A, but current method must resolve the Promise it returns.


#### Add Credits
This endpoint should handle adding a set of Credits to the user's cart on the backend.

A stub for this has been implemented, but no mock API call has been implemented.

Payload: an array of CartCredits (outlined below) is provided to the method

Expected Response: N/A, but current method must resolve the Promise it returns.

Cart Credit:

```  

event_id:number;			-The event for which the credit applies
credit_type:SessionType;	- The session type for which the credit applies
amount:number;				- The amount of credits
cost:number;				- The total cost of the set of credits

```

