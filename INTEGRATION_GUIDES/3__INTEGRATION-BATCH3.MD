## Architecture Updates
An adaptor layer has been added when posting data to the API.  These adaptors are located at `src/js/adaptors/APIAdaptors`
and can be modified to tailor reported data to the specific needs of the backend. Previously outlined api payloads and 
expected responses have not been specifically modified except where outlined in this document. 

### Adaptor Methods
#### Cart

```  
adaptRemoveSession  - Adapt data for removing a session from the skater's cart
adaptAddSession     - Adapt data for adding a session to the skater's cart
adaptAddCredits     - Adapt data for adding credits to the skater's cart
adaptRemoveCredit   - Adapt data for removing a credit from the skater's cart
adaptCompleteOrder  - Adapt data for completing an order from the checkout page
```

#### Skater

```  
adaptAddSession     - Adapt data for adding a session to the skater's schedule
adaptRemoveSession  - Adapt data for removing a session from the skater's schedule
adaptUpdateAddress  - Adapt data for editing a skater's previously saved address
adaptCreateAddress  - Adapt data for adding a saved address to the skater
```

## API Data Changes
Where referenced in previous documents, the following elements require the following changes to data structures:

### Cart Session
The following additions have been made to cart session data:

```  
competition_id:number;          - The id for the associated competition for the session
competition_name:string;        - The name of the associated competition
scheduled_event_name:string;    - The name of the associated event

```

## New API Data Elements
The following elements are new API data structures that have been added

### CartCredit
Represents a credit in the skater's cart

```  
event_id: number;               -  The id for the event associated with the session
credit_type: SessionType;       -  The session type of the credit
amount: number;                 -  The amount of such credits
cost: number;                   -  The total cost for the credits (base credit cost * amount)
competition_id: number;         -  The id for the associated competition
competition_name: string;       -  The name for the associated competition 
event_name: string              -  The name for the event associated with the session
```

## Updated API Endpoint Expected Responses
The following API endpoints have been updated to require additional data in their expected responses:

### Fetch Cart
This endpoint has been updated to require the following response:

```  
sessions:CartSession[]      - An Array of cart sessions
credits:CartCredit[]        - An array of cart credits
```


## New App Data Structures
The following app data structures have been added:

### CreditCard
Represents a selected credit card

```  
cvc:string                 - A string representing the card's cvc code  -  "224"
expiration_month:number    - Number representing the expiration month (1-12)  -  12
expiration_year:number     - Number representing the 4 digit expiration year - 2020
number:number              - Number representing the credit card number with no formatting - 4242424242424242
number_formatted:string    - Formatted credit card number string - "4242 4242 4242 4242"
type:string                - String key representing the card type ('visa', 'mastercard', 'american-express','discover') - "visa"
type_formatted:string 	   - Human friendly string representing the caed type - "Visa"

```

### BillingAddress
Represents a selected billing address
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




## New API Endpoints
The following necessary API endpoints have been added.

### Get Skater Saved Addresses
This endpoint returns the list of saved addresses for the active skater.

Payload: none

Expected Response:
Array containing billing address data sets

```  
[
	{
		id: number;
		first_name: string;
		last_name: string;
		street: string;
		street_2: string | null;
		city: string;
		state: string;
		zip_code: number;
		is_default: boolean;
	 },
	 //...
]
```

### Update Skater Billing Address
This endpoint saves updates to a previously saved skater address

Payload:

```  
source:BillingAddress               - BillingAddress model for currently saved set of data.
data:{                              - Form data representing edits to the billing address
	first_name: string;
	last_name: string;
	street: string;
	street_2: string | null;
	city: string;
	state: string;
	zip_code: string;
	is_default: boolean;
}
```

Expected Response: No data  

### Create Billing Address
This endpoint creates a new billing address

Available Data:

```  
data:{
		first_name: string;
		last_name: string;
		street: string;
		street_2: string | null;
		city: string;
		state: string;
		zip_code: string;
		is_default: boolean;
};
```

Expected Response: The ID of the newly saved Billing Address (number)


### Get Skater Info
This endpoint retrieves foundational information for the logged in skater. 
This is used to pre-populate the billing address form in the event the skater has no saved addresses

Payload: none

Expected Response:
Data containing information associated with the Skater

```  
	first_name: string;
	last_name: string;
	address: {
		street: string;
		street_2: string | null;
		city: string;
		state: string;
		zip_code: number;
	}
```


### Complete Order
This endpoint handles a user completing an order on the checkout page.

Available data for payload:

```  

payment_info: {
	card: CreditCard,
	address: BillingAddress
}
cart: Cart


```
In this payload, each object is a model class and contains multiple helper methods to retrieve required data points.
Server payload can be adjusted within the src/js/adaptors/APIAdaptors/CartAPIAdaptor.ts::adaptCompleteOrder method

Expected Response:


```  
success:boolean              - Whether the order placement was successful.  
message:string               - Message associated with success or failure of order placement. 

```

If the server returns `success:false`, the checkout page will display the included error message as an error below the  
"Complete Payment" button.  This allows final server validation before reporting success to the user.