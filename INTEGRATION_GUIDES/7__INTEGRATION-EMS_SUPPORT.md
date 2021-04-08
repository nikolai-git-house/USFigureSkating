# EMS Support Integration
## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for the EMS Support component.


## General
### Primary Navigation Link
EMS Support page link has been added to primary navigation.  The URL for this page is not tied to any app functionality and can be modified without issue. The link url can be set in `src/views/layouts/partials/header.php:42`

### API Changes
The "Get User Info" API endpoint has been extended to include additional information about the current user including member number and email address.
  
  
## API Objects
This section outlines the objects used in relation to the API for the EMS Support.

### User Information
Represents general information about the currently logged in user.  This object has been extended in this release to include additional information.
 
 ```  
user_type: string            - The type of the active user.  Either "skater" or "coach"
upload_file_capability: {    - Information about whether the user can upload files on their current device
     can_upload: boolean,    - Whether the user can upload files on their current device
     error_message: string   - Notice to display in place of upload inputs.  Empty string when can_upload is true. 
}
member_number: number;       - The user's member number
email: string;               - The user's primary email address
 ```

### EMS Support Issue Type Option
This object represents an option for "Issue Type" on the EMS Support form, as well as its associated subtypes.

```  
label: string;            - String representation of the Issue Type
subtypes: string[]        - Array of strings representing the available subtypes for the type. Empty array when no subtypes available
```

### EMS Support Form Data
This object represents the data from the EMS Support form. When fields are not filled out, they appear as empty strings.

```  
member_number: number;        - The member number provided on the form
email: string;                - The email provided on the form 
phone: string;                - The phone number  provided on the form 
issue_type: string;           - The issue type provided on the form
issue_subtype: string;        - The sub-issue type provided on the form
description: string;          - The text content provided on the form
```

### EMS Support Submission Result
This object represents the result following an EMS Support Form submission.

```  
{
  success: boolean;          - Whether the submission was successful
  error: string;             - Error message string.
}
```
When a submission results in a false value for `success`, the provided `error` value will be displayed to the user. 
If the submission is successful, the `error` key will be ignored but it's recommended to set it to an empty string.


## API Endpoints
Even when data is not present, endpoints should return empty representations of their top level properties.

### Get User Info
__Purpose:__ Get general information about the currently logged in user.  This example demonstrates updates changes from the previous release.

__Request Payload:__ None

__Response:__ A `UserInformation` object within a `user` key:

```  
{
  "user": {
    "user_type": "skater",
    "upload_file_capability": {
      "can_upload": true,
      "error_message": ""
    },
    "member_number": 123456,
    "email": "test@test.com"
  }
}
```

### Get Issue Type Options
__Purpose:__ Retrieve options for the "Issue Type" and "Sub-Issue Type" inputs on the EMS Support Form. 

__Request Payload:__ None 

__Response:__ Array of `EMSSupportIssueTypeOption` objects within a `issue_types` key:

```  
{
  "issue_types": [
    {
      "label": "Registration",
      "subtypes": []
    },
    {
      "label": "Skater Portal",
      "subtypes": [
        "Music Upload",
        "PPC Submission",
        "My Coaches",
        "Practice Ice",
        "Other"
      ]
    },
    [...]
  ]
}
```

### Submit EMS Support Request
__Purpose:__ Handle the submission of the EMS Support Form

__Request Payload:__ An instance of `EMSSupportFormData` representing the submitted form data

__Response:__ 

Example 1: Successful Submission:

```  
{
  "success": true,
  "error": ""
}
```

Example 2: Submission Resulting in Error:

```  
{
  "success": false,
  "error": "Server side configurable error message."
}
```