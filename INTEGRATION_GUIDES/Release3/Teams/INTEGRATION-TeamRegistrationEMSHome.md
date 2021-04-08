# Team Registration Integration - EMS Home
This document summarizes changes surrounding the EMS Home page in relation to Team Registration.

## Template Changes
### `src/views/pages/N.0_EMS_Home.php`
Prior to this release, this template was a static page with no reactivity.  As part of this release, this 
template has been updated to use a reactive page component.  This component includes a loading state while the active 
user's information is being loaded.   

## API Changes
### Get User Information
The `UserData.roles` property returned by the Get User Information endpoint (defined in release 1, extended in subsequent
releases) has been extended to accept a role of `team_manager`.  If this role is included for this API response, the user 
will be able to access the "Competition Registration - Teams" link from EMS home.  If this role is not included, a message
will appear that informs the user they must be a team manager in order to proceed when the navigation item is clicked, and the
user will not be able to continue.