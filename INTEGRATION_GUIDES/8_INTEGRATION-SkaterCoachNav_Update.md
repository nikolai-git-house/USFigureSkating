# Skater/Coach Navigation Integration
## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for the updated Skater/Coach Navigation component


## General


### API Changes
The "Get User Info" API endpoint has been updated to return an array of roles applicable to the current user instead of a single string. 
Further, its HTTP method has changed from GET to POST and it now includes a `competition_id` field in its request payload.
  
  
## API Objects
This section outlines the objects used in relation to the API for the Skater/Coach Nav.

### User Information (Updated)
Represents general information about the currently logged in user.  
This object has been updated in this release to return an array of user roles.
 
 ```  
roles: string[]              - The roles of the active user.  Valid array values are "skater" and "coach"
upload_file_capability: {    - Information about whether the user can upload files on their current device
     can_upload: boolean,    - Whether the user can upload files on their current device
     error_message: string   - Notice to display in place of upload inputs.  Empty string when can_upload is true. 
}
member_number: number;       - The user's member number
email: string;               - The user's primary email address
 ```


## API Endpoints
Even when data is not present, endpoints should return empty representations of their top level properties.

### Get User Info
__Purpose:__ Get general information about the currently logged in user.  This example demonstrates updates from the previous release.

__Request Payload:__ A `competition_id` containing the ID of the active competition, or `false` if no competition is active.

__Response:__ A `UserInformation` object within a `user` key:

```  
{
  "user": {
    "roles": ["skater"],
    "upload_file_capability": {
      "can_upload": true,
      "error_message": ""
    },
    "member_number": 123456,
    "email": "test@test.com"
  }
}
```

Note: If any user types are provided other than "skater" or "coach," they will be ignored by the Frontend App as of this writing