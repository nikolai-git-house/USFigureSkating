# Create Account Integration
## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for the Create Account component. 


# General
## General Integration Notes
## Create Account Layout and Script Integration
The create account component utilizes the same `blank` layout as the login and forgot password screens. 
However, when the create account page loads, the `create-account.js` scripts should load instead of the `login.js` scripts.  
An example of this loading logic can be found around `src/views/layouts/blank.php:76`
## reCaptcha
You will need to add the Site Key from your reCaptcha account to the element located at or around
src/views/pages/partials/create-account/j.3_account.creation.personal-info.php:65
## Link Targets
There are various links that require targets within template files.  These links have been flagged with an `@integration` comment
flag.


# API Endpoints
This section contains API endpoints added as part of this update.
## Form Options
API endpoints related to form options.

### GetCreateAccountOptions
__Purpose:__ Fetch input options for all available create account forms.

__Request Payload:__ None

__Response:__ a `CreateAccountFormOptions` object within an `options` key:

```  
{
  "options": {
    "states": [
      {
        "label": "AL",
        "value": "AL"
      },
      [...]
    ],
    "countries": [
      {
        "label": "United States",
        "value": "usa",
        "is_usa": true,
        "is_canada": false
      },
      {
        "label": "Canada",
        "value": "canada",
        "is_usa": false,
        "is_canada": true
      },
      {
        "label": "Country 1",
        "value": "country1",
        "is_usa": false,
        "is_canada": false
      },
      [...]
    ],
    "federations": [
      {
        "label": "Federation 1",
        "value": "federation1"
      },
      [...]
    ],
    "provinces": [
      {
        "label": "Province 1",
        "value": "province1"
      },
      [...]
    ],
    "skate_test_disciplines": [
      {
        "label": "Free Skating",
        "key": "free_skating"
      },
      {
        "label": "Pair",
        "key": "pair"
      },
      {
        "label": "Dance",
        "key": "dance"
      },
      {
        "label": "Free Dance",
        "key": "free_dance"
      },
      {
        "label": "Figure",
        "key": "figure"
      }
    ],
    "skate_tests": {
      "free_skating": [
        {
          "label": "Free Skating Option 1",
          "value": "free_skating_value_1",
          "level_id": 1
        },
        {
          "label": "Free Skating Option 2",
          "value": "free_skating_value_2",
          "level_id": 2
        },
        [...]
      ],
      "pair": [
        {
          "label": "Pair Option 1",
          "value": "pair_value_1",
          "level_id": 1
        },
        {
          "label": "Pair Option 2",
          "value": "pair_value_2",
          "level_id": 2
        },
        [...]
      ],
      "dance": [
        {
          "label": "Dance Option 1",
          "value": "dance_value_1",
          "level_id": 1
        },
        {
          "label": "Dance Option 2",
          "value": "dance_value_2",
          "level_id": 2
        },
        [...]
      ],
      "free_dance": [
        {
          "label": "Free Dance Option 1",
          "value": "free_dance_value_1",
          "level_id": 1
        },
        {
          "label": "Free Dance Option 2",
          "value": "free_dance_value_2",
          "level_id": 2
        },
        [...]
      ],
      "figure": [
        {
          "label": "Figure Option 1",
          "value": "figure_value_1",
          "level_id": 1
        },
        {
          "label": "Figure Option 2",
          "value": "figure_value_2",
          "level_id": 2
        },
        [...]
      ]
    }
  }
}
```


## Create Account
API endpoints related to create account component

### SubmitPersonalInformation
__Purpose:__ Submit data from personal information form.  Detect duplicate accounts. Create account based on provided data.

__Request Payload:__ `CreateAccountPersonalInformationAPIPayload`

```  
{
  "personal_information_data": {
    "first_name": "Dacey",
    "last_name": "Hopkins",
    "date_of_birth": "12/24/1976",
    "gender": "male",
    "phone": "+1 (361) 713-4007",
    "email": "kyraq@mailinator.net"
  },
  "account_type": "foreign"
}
```

__Response:__  `PersonalInformationSubmissionResponse`

```  
{
  "success": true,
  "error": "",
  "is_duplicate_account": false,
  "data": {
    "member_number": "5ca6a53441d8b",
    "account_id": "2"
  }
}
```


### SubmitAddressInformation
__Purpose:__ Submit data from address form

__Request Payload:__ `CreateAccountAddressAPIPayload`

```  
{
  "account_id": "2",
  "address_data": {
    "country": "usa",
    "street": "Dignissimos sit occa",
    "street_2": "Vel ut ab doloremque",
    "city": "Voluptate ipsa tene",
    "state": "NJ",
    "province": "",
    "zip": "27050"
  }
}
```

__Response:__ `SubmissionResponse`

```  
{
  "success": true,
  "error": ""
}
```


### SubmitEmergencyContactInformation
__Purpose:__ Submit data from emergency contact form

__Request Payload:__ `CreateAccountEmergencyContactAPIPayload`

```  
{
  "account_id": "2",
  "emergency_contact_data": {
    "name": "Brooke Hogan",
    "relationship": "Mother",
    "phone": "+1 (717) 895-4944"
  }
}
```

__Response:__ `SubmissionResponse`

```  
{
  "success": true,
  "error": ""
}
```

### SubmitFederationInformation
__Purpose:__ Submit data related to federation information

__Request Payload:__ `CreateAccountFederationInfoAPIPayload`

```  
{
  "account_id": "2",
  "federation_information_data": {
    "federation": "federation2",
    "user_type": [
      "skater",
      "coach"
    ]
  }
}
```

__Response:__ `SubmissionResponse`

```  
{
  "success": true,
  "error": ""
}
```

### AddSkateTestEquivalency
__Purpose:__ Submit new skate test equivalency data

__Request Payload:__ `CreateAccountSkateTestEquivalencyAPIPayload`

```  
{
  "account_id": "2",
  "skate_test_data": {
    "free_skating": {
      "club": "Foreign",
      "club_id": null,
      "date": "12/24/1974",
      "test": "free_skating_value_4"
    },
    "pair": {
      "club": "Qui corporis distinc",
      "club_id": 1,
      "date": "12/24/1974",
      "test": "pair_value_6"
    },
    "dance": {
      "club": "Porro aute accusanti",
      "club_id": "11ABS",
      "date": "12/24/1974",
      "test": "dance_value_5"
    },
    "free_dance": {
      "club": "Foreign",
      "club_id": null,
      "date": "12/24/1974",
      "test": "free_dance_value_1"
    },
    "figure": null
  }
}
```

__Response:__ `SubmissionResponse`

```  
{
  "success": true,
  "error": ""
}
```

### SubmitPassword
__Purpose:__ Submit data from set password form

__Request Payload:__ `CreateAccountPasswordAPIPayload`

```  
{
  "account_id": "2",
  "password_data": {
    "password": "Pa$$w0rd!",
    "password_confirm": "Pa$$w0rd!"
  }
}
```

__Response:__ `PasswordSubmissionResponse`

```  
{
  "success": true,
  "error": "",
  "redirect_url": "\/Members\/MemberHome"
}
```


# Data Structures
This section outlines important data structures referenced and used in this update. 


## Simple Types
```  
AccountTypeKey = "volunteer" | "foreign";
ForeignUserTypeKey = "coach" | "skater" | "official";
SkateTestDisciplineKey = string;
```


## Form Options

### FormOption
This object represents a form element option. It serves as the basis for various concrete implementations
```  
label: string;            - String representation of the option. Name of the option that displays to the user.
value: string;            - Value associated with the option. Value used in subsequent calculations and data submissions 
```

### CountryFormOption (extends FormOption) 
This object represents a form option for a country.  It contains `is_usa` and `is_canada` boolean values to inform downstream logic
```  
label: string;            - String representation of the option. Name of the option that displays to the user.
value: string;            - Value associated with the option. Value used in subsequent calculations and data submissions
is_usa: boolean;          - Whether the country is the United States.  Used to trigger state requirement and zip code requirement/format validation
is_canada: boolean;       - Whether the country is Canada.  Used to trigger province requirement and postal code requirement/format validation
```

### SkateTestDiscipline
This object represents a testable discipline.  Displays as a category on Skate Test Equivalency
```  
label: string;
key: SkateTestDisciplineKey
```

### SkateTestFormOption (extends FormOption) 
This object represents a form option for a Skate Test Equivalency discipline test. It contains a level property to inform downstream logic
```
label: string;            - String representation of the option. Name of the option that displays to the user.
value: string;            - Value associated with the option. Value used in subsequent calculations and data submissions  
level_id: number;         - "Level" of test.  Used in calculations to ensure users can progress in test levels but not regress.
```

### CategorizedSkateTestOptions
This object contains appropriate `SkateTestFormOption` objects grouped by the `SkateTestDisciplineKey` of the discipline 
to which they belong. 
```  
[key:SkateTestDisciplineKey]: SkateTestSelectOption[] - Array of SkateTestFormOption objects specific to this discipline
```

### CreateAccountFormOptions
This object contains the complete set of configurations including `FormOption` necessary for the create account forms.
 Note: It's important that the `skate_tests` object has a key for every object in `skate_test_disciplines`.
```  
states: FormOption[],                                  - Options for state select input on address form
countries: CountryFormOption[],                        - Options for country select input on address form
provinces: FormOption[],                               - Options for province select input on address form
federations: FormOption[],                             - Options for federation select input on federation info form
skate_tests: CategorizedSkateTestOptions,              - Options for tests on Skate Test Equivalency, categorized by discipline
skate_test_disciplines: SkateTestDiscipline[]          - Testable disciplines for Skate Test Equivalency
```


## Form Data Structures
This section outlines data structures related to the data for various forms

### PersonalInformationData
This object represents data from the personal information form.
```  
first_name: string;                - First name of the user
last_name: string;                 - Last name of the user
date_of_birth: string;             - Birth date of the user.  Formatted as "MM/DD/YYYY"
gender: string;                    - Gender of the user.  Either "male" or "female"
phone: string;                     - Phone number of the user
email: string;                     - Email address of the user
captcha_value: string;             - The value reported from the user solving the captcha          
```

### AddressData
This object represents data from the address form.
```  
country: string;          - The value from the country FormOption selected by the user
street: string;           - The street address entered by the user
street_2: string;         - The second line street address entered by the user.  Might be empty string.
city: string;             - The city entered by the user
state: string;            - The value from the state FormOption selected by the user. Might be empty string.
province: string;         - The value from the province FormOption selected by the user. Might be empty string.
zip: string;              - The zip/postal code entered by the user
```

### EmergencyContactData
This object represents data from the emergency contact form.
```  
name: string;             - The name entered by the user 
relationship: string      - The "relationship to you" entered by the user 
phone: string             - The phone entered by the user 
```

### FederationInfoData
This object represents data from the federation information form.
```  
federation: string;                   - The value of the federation FormOption selected by the user
user_type: ForeignUserTypeKey[]       - An array of ForeignUserTypeKeys selected by the user
```

### ExportedSkateTestEquivalencyDisciplineData
This object represents data for a single discipline from the skate test equivalency form
```  
test: string;                   - The value of the test FormOption selected by the user
club: string;                   - The club name entered by the user
club_id: string|number|null;    - If club autosuggest is active, and user selects an option, this will be the ID of the selected option.
                                  In all other cases, this will be null
date: string;                   - The date (in MM/DD/YYYY format) entered by the user
```

### SkateTestEquivalencyData
This object represents data from a completed skate test equivalency form.  Object will be keyed based on `SkateTestDiscipline` keys present
in the `skate_test_disciplines` property of the  `CreateAccountFormOptions` returned by the GetCreateAccountOptions endpoint
```  
 [key: string]: ExportedSkateTestEquivalencyDisciplineData | null;
```

### PasswordFormData
This object represents data from the password form.
```  
password: string;
password_confirm: string
```


## API Payloads
This section outlines data structures related to API payloads

### CreateAccountPersonalInformationAPIPayload
```  
personal_information_data: PersonalInformationData;         - The data from the personal information form
account_type: AccountTypeKey                                - The type of account being created (volunteer or foreign)
```

### CreateAccountAddressAPIPayload
```  
account_id: string;            - The account ID of the submitting user
address_data: AddressData      - The data from the address form
```

### CreateAccountEmergencyContactAPIPayload
```  
account_id: string;                            - The account ID of the submitting user
emergency_contact_data: EmergencyContactData   - The data from the emergency contact form                       
```

### CreateAccountFederationInfoAPIPayload
```  
account_id: string;                               - The account ID of the submitting user
federation_information_data: FederationInfoData;  - The data from the federation information form
```

### CreateAccountSkateTestEquivalencyAPIPayload
```  
account_id: string;                              - The account ID of the submitting user 
skate_test_data: SkateTestEquivalencyData        - The data from the skate test equivalency form 
```

### CreateAccountPasswordAPIPayload
```  
account_id: string;                         - The account ID of the submitting user
password_data: PasswordFormData             - The data from the password form
```


## API Responses
This section outlines data structures related to expected API responses.

### SubmissionResponse
This object represents an abstract API response when submitting data.  It serves as the basis for various concrete implementations.
```  
success: boolean;         - Whether the submission was successful
error: string;            - If the submission was unsuccessful, error message associated with the failure. 
```

### PersonalInformationSubmissionResponse (extends SubmissionResponse)
Expected API response when submitting personal information during account creation
```  
success: boolean;             - Whether the submission was successful
error: string;                - If the submission was unsuccessful, error message associated with the failure.
is_duplicate_account: boolean - Whether an account already exists for the user.  Should always be false when success=true.
data: {
	member_number: string;    - The member number associated with the created account.  Displays to user in subsequent step(s).
	account_id: number;       - The member number associated with the created account.  Used in subsequent submissions. 
} 
```

### PasswordSubmissionResponse (extends SubmissionResponse)
Expected API response when submitting password information during account creation
```  
success: boolean;             - Whether the submission was successful
error: string;                - If the submission was unsuccessful, error message associated with the failure.
redirect_url: string;         - URL to which the user will be redirected.  Ideally the members home page.
```