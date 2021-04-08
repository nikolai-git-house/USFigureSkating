### [Updated] Fetch Cart

**Request Payload:** `none` (unchanged)

**Response:** `FetchCartAPIResponse` (unchanged, properties extended)
```
{
  "sessions": [],
  "credits": [],
  "packages": [],
  "registration_items": [
    {
      "name": "Singles",
      "cost": 30,
      "description_lines": [
        "Senior Ladies Combined",
        "NQ-SERIES APPLICATION FEE"
      ],
      "cart_item_type_key": "series_registration_fee",
      "id": 1
    },
    {
      "name": "Dance",
      "cost": 35,
      "description_lines": [
        "Juvenile Combined Dance",
        "NQ-SERIES APPLICATION FEE"
      ],
      "cart_item_type_key": "series_registration_fee",
      "id": 2
    }
  ],
  "additional_fees": [
    {
      "name": "Processing Fee",
      "amount": 5
    }
  ],
  "subtotal": 65,
  "total": 70
}
```

### [Updated] Remove Cart Registration Item

**Request Payload:** `CartRemoveRegistrationItemAPIPayload` (extended)
```
{
  "registration_item_id": 1,
  "cart_item_type_key": "series_registration_fee"
}
```

**Response:** `CartRemoveRegistrationItemAPIResponse` (unchanged)
```
{
  "success": true,
  "cart": {
    "sessions": [],
    "credits": [],
    "packages": [],
    "registration_items": [
      {
        "name": "Dance",
        "cost": 35,
        "description_lines": [
          "Juvenile Combined Dance",
          "NQ-SERIES APPLICATION FEE"
        ],
        "cart_item_type_key": "series_registration_fee",
        "id": 2
      }
    ],
    "additional_fees": [
      {
        "name": "Processing Fee",
        "amount": 5
      }
    ],
    "subtotal": 35,
    "total": 40
  }
}
```

### [New] Fetch Series Registration Series Application

**Request Payload:** `none`

**Response:** `SeriesApplicationApi.FetchApplicationAPIResponse`
```
{
  "series": {
    "application_deadline_formatted": {
      "date": "6\/6\/2020",
      "time": "11:59 ET"
    },
    "links": {
      "overview": "\/pages\/series-registration\/1"
    },
    "application_configuration": {
      "disciplines": [
        {
          "id": 1,
          "coach_limit": 2,
          "partner_configuration": {
            "is_partnered": false,
            "partner_rules": []
          },
          "name": "Singles"
        },
        {
          "id": 2,
          "coach_limit": 3,
          "partner_configuration": {
            "is_partnered": true,
            "partner_rules": [
              "opposite_gender",
              "compatible_levels"
            ]
          },
          "name": "Dance"
        },
        {
          "id": 3,
          "coach_limit": 3,
          "partner_configuration": {
            "is_partnered": true,
            "partner_rules": [
              "compatible_levels",
              "opposite_gender"
            ]
          },
          "name": "Pairs"
        }
      ],
      "levels_information": "Series participants may skate at their current test level, and\/or \"skate up\" one level for the series. Note: if athletes register for two levels within the NQS Series (i.e. current test level and \"skate up\"), they can only compete in one level at a time at each series competition.",
      "eligibility_documents": [
        {
          "name": "Singles Eligibility (PDF)",
          "link": "https:\/\/placehold.it\/500x500&text=Singles+Eligibility+(PDF)"
        },
        {
          "name": "Dance Eligibility (PDF)",
          "link": "https:\/\/placehold.it\/500x500&text=Dance+Eligibility+(PDF)"
        },
        {
          "name": "Pairs Eligibility (PDF)",
          "link": "https:\/\/placehold.it\/500x500&text=Pairs+Eligibility+(PDF)"
        }
      ]
    },
    "refund_email_address": "productsupport@usfigureskating.org",
    "icon": "\/images\/series-icon.png",
    "id": 1,
    "name": "Applications Open - Incomplete"
  },
  "user_application_profile": {
    "skate_test_history": {
      "disciplines": [
        {
          "label": "Moves",
          "key": "moves",
          "available_tests": [
            {
              "label": "Moves Test 3",
              "value": "moves_3",
              "level_id": 3
            },
            {
              "label": "Moves Test 4",
              "value": "moves_4",
              "level_id": 4
            },
            {
              "label": "Moves Test 5",
              "value": "moves_5",
              "level_id": 5
            },
            {
              "label": "Moves Test 6",
              "value": "moves_6",
              "level_id": 6
            },
            {
              "label": "Moves Test 7",
              "value": "moves_7",
              "level_id": 7
            },
            {
              "label": "Moves Test 8",
              "value": "moves_8",
              "level_id": 8
            },
            {
              "label": "Moves Test 9",
              "value": "moves_9",
              "level_id": 9
            },
            {
              "label": "Moves Test 10",
              "value": "moves_10",
              "level_id": 10
            }
          ],
          "key_test": [
            {
              "id": "moves_2",
              "name": "Senior Moves in the Field",
              "is_self_reported": true,
              "level_id": 2
            }
          ],
          "self_reported_tests": [
            {
              "id": "moves_2",
              "name": "Senior Moves in the Field",
              "is_self_reported": true,
              "level_id": 2
            }
          ],
          "test_history": [
            {
              "id": "moves_2",
              "name": "Senior Moves in the Field",
              "is_self_reported": true,
              "level_id": 2
            },
            {
              "id": "moves_1",
              "name": "Junior Moves in the Field",
              "is_self_reported": false,
              "level_id": 1
            }
          ]
        },
        {
          "label": "Free Skating",
          "key": "free_skating",
          "available_tests": [
            {
              "label": "Free Skating Test 3",
              "value": "free_skating_3",
              "level_id": 3
            },
            {
              "label": "Free Skating Test 4",
              "value": "free_skating_4",
              "level_id": 4
            },
            {
              "label": "Free Skating Test 5",
              "value": "free_skating_5",
              "level_id": 5
            },
            {
              "label": "Free Skating Test 6",
              "value": "free_skating_6",
              "level_id": 6
            },
            {
              "label": "Free Skating Test 7",
              "value": "free_skating_7",
              "level_id": 7
            },
            {
              "label": "Free Skating Test 8",
              "value": "free_skating_8",
              "level_id": 8
            },
            {
              "label": "Free Skating Test 9",
              "value": "free_skating_9",
              "level_id": 9
            },
            {
              "label": "Free Skating Test 10",
              "value": "free_skating_10",
              "level_id": 10
            }
          ],
          "key_test": [
            {
              "id": "free_skating_2",
              "name": "Junior Free Skate",
              "is_self_reported": false,
              "level_id": 2
            }
          ],
          "self_reported_tests": [],
          "test_history": [
            {
              "id": "free_skating_2",
              "name": "Junior Free Skate",
              "is_self_reported": false,
              "level_id": 2
            }
          ]
        },
        {
          "label": "Pair",
          "key": "pair",
          "available_tests": [
            {
              "label": "Pair Test 1",
              "value": "pair_1",
              "level_id": 1
            },
            {
              "label": "Pair Test 2",
              "value": "pair_2",
              "level_id": 2
            },
            {
              "label": "Pair Test 3",
              "value": "pair_3",
              "level_id": 3
            },
            {
              "label": "Pair Test 4",
              "value": "pair_4",
              "level_id": 4
            },
            {
              "label": "Pair Test 5",
              "value": "pair_5",
              "level_id": 5
            },
            {
              "label": "Pair Test 6",
              "value": "pair_6",
              "level_id": 6
            },
            {
              "label": "Pair Test 7",
              "value": "pair_7",
              "level_id": 7
            },
            {
              "label": "Pair Test 8",
              "value": "pair_8",
              "level_id": 8
            },
            {
              "label": "Pair Test 9",
              "value": "pair_9",
              "level_id": 9
            },
            {
              "label": "Pair Test 10",
              "value": "pair_10",
              "level_id": 10
            }
          ],
          "key_test": [],
          "self_reported_tests": [],
          "test_history": []
        },
        {
          "label": "Dance",
          "key": "dance",
          "available_tests": [
            {
              "label": "Fourteenstep",
              "value": "dance_3",
              "level_id": 3
            },
            {
              "label": "Dance Test 4",
              "value": "dance_4",
              "level_id": 4
            },
            {
              "label": "Dance Test 5",
              "value": "dance_5",
              "level_id": 5
            },
            {
              "label": "Dance Test 6",
              "value": "dance_6",
              "level_id": 6
            },
            {
              "label": "Dance Test 7",
              "value": "dance_7",
              "level_id": 7
            },
            {
              "label": "Dance Test 8",
              "value": "dance_8",
              "level_id": 8
            },
            {
              "label": "Dance Test 9",
              "value": "dance_9",
              "level_id": 9
            },
            {
              "label": "Dance Test 10",
              "value": "dance_10",
              "level_id": 10
            }
          ],
          "key_test": [
            {
              "id": "dance_2",
              "name": "Foxtrot",
              "is_self_reported": false,
              "level_id": 2
            },
            {
              "id": "dance_3",
              "name": "Fourteenstep",
              "is_self_reported": false,
              "level_id": 3
            }
          ],
          "self_reported_tests": [],
          "test_history": [
            {
              "id": "dance_2",
              "name": "Foxtrot",
              "is_self_reported": false,
              "level_id": 2
            },
            {
              "id": "dance_3",
              "name": "Fourteenstep",
              "is_self_reported": false,
              "level_id": 3
            }
          ]
        },
        {
          "label": "Free Dance",
          "key": "free_dance",
          "available_tests": [
            {
              "label": "Free Dance Test 1",
              "value": "free_dance_1",
              "level_id": 1
            },
            {
              "label": "Free Dance Test 2",
              "value": "free_dance_2",
              "level_id": 2
            },
            {
              "label": "Free Dance Test 3",
              "value": "free_dance_3",
              "level_id": 3
            },
            {
              "label": "Free Dance Test 4",
              "value": "free_dance_4",
              "level_id": 4
            },
            {
              "label": "Free Dance Test 5",
              "value": "free_dance_5",
              "level_id": 5
            },
            {
              "label": "Free Dance Test 6",
              "value": "free_dance_6",
              "level_id": 6
            },
            {
              "label": "Free Dance Test 7",
              "value": "free_dance_7",
              "level_id": 7
            },
            {
              "label": "Free Dance Test 8",
              "value": "free_dance_8",
              "level_id": 8
            },
            {
              "label": "Free Dance Test 9",
              "value": "free_dance_9",
              "level_id": 9
            },
            {
              "label": "Free Dance Test 10",
              "value": "free_dance_10",
              "level_id": 10
            }
          ],
          "key_test": [],
          "self_reported_tests": [],
          "test_history": []
        },
        {
          "label": "Figure",
          "key": "figure",
          "available_tests": [
            {
              "label": "Figure Test 1",
              "value": "figure_1",
              "level_id": 1
            },
            {
              "label": "Figure Test 2",
              "value": "figure_2",
              "level_id": 2
            },
            {
              "label": "Figure Test 3",
              "value": "figure_3",
              "level_id": 3
            },
            {
              "label": "Figure Test 4",
              "value": "figure_4",
              "level_id": 4
            },
            {
              "label": "Figure Test 5",
              "value": "figure_5",
              "level_id": 5
            },
            {
              "label": "Figure Test 6",
              "value": "figure_6",
              "level_id": 6
            },
            {
              "label": "Figure Test 7",
              "value": "figure_7",
              "level_id": 7
            },
            {
              "label": "Figure Test 8",
              "value": "figure_8",
              "level_id": 8
            },
            {
              "label": "Figure Test 9",
              "value": "figure_9",
              "level_id": 9
            },
            {
              "label": "Figure Test 10",
              "value": "figure_10",
              "level_id": 10
            }
          ],
          "key_test": [],
          "self_reported_tests": [],
          "test_history": []
        },
        {
          "label": "Testable Discipline 7",
          "key": "testable_discipline_7",
          "available_tests": [
            {
              "label": "Testable Discipline 7 Test 1",
              "value": "testable_discipline_7_1",
              "level_id": 1
            },
            {
              "label": "Testable Discipline 7 Test 2",
              "value": "testable_discipline_7_2",
              "level_id": 2
            },
            {
              "label": "Testable Discipline 7 Test 3",
              "value": "testable_discipline_7_3",
              "level_id": 3
            },
            {
              "label": "Testable Discipline 7 Test 4",
              "value": "testable_discipline_7_4",
              "level_id": 4
            },
            {
              "label": "Testable Discipline 7 Test 5",
              "value": "testable_discipline_7_5",
              "level_id": 5
            },
            {
              "label": "Testable Discipline 7 Test 6",
              "value": "testable_discipline_7_6",
              "level_id": 6
            },
            {
              "label": "Testable Discipline 7 Test 7",
              "value": "testable_discipline_7_7",
              "level_id": 7
            },
            {
              "label": "Testable Discipline 7 Test 8",
              "value": "testable_discipline_7_8",
              "level_id": 8
            },
            {
              "label": "Testable Discipline 7 Test 9",
              "value": "testable_discipline_7_9",
              "level_id": 9
            },
            {
              "label": "Testable Discipline 7 Test 10",
              "value": "testable_discipline_7_10",
              "level_id": 10
            }
          ],
          "key_test": [],
          "self_reported_tests": [],
          "test_history": []
        }
      ]
    },
    "series_level_eligibility": [
      {
        "discipline_id": 1,
        "eligible_levels": [
          {
            "name": "Singles Level 1",
            "level_id": 1,
            "id": 1,
            "price": 30
          },
          {
            "name": "Singles Level 2",
            "level_id": 2,
            "id": 2,
            "price": 31
          },
          {
            "name": "Singles Level 3",
            "level_id": 3,
            "id": 3,
            "price": 32
          },
          {
            "name": "Singles Level 4",
            "level_id": 4,
            "id": 4,
            "price": 33
          },
          {
            "name": "Singles Level 5",
            "level_id": 5,
            "id": 5,
            "price": 34
          }
        ]
      },
      {
        "discipline_id": 2,
        "eligible_levels": [
          {
            "name": "Dance Level 1",
            "level_id": 1,
            "id": 1,
            "price": 30
          },
          {
            "name": "Dance Level 2",
            "level_id": 2,
            "id": 2,
            "price": 31
          },
          {
            "name": "Dance Level 3",
            "level_id": 3,
            "id": 3,
            "price": 32
          },
          {
            "name": "Dance Level 4",
            "level_id": 4,
            "id": 4,
            "price": 33
          },
          {
            "name": "Dance Level 5",
            "level_id": 5,
            "id": 5,
            "price": 34
          }
        ]
      },
      {
        "discipline_id": 3,
        "eligible_levels": [
          {
            "name": "Pairs Level 1",
            "level_id": 1,
            "id": 1,
            "price": 30
          },
          {
            "name": "Pairs Level 2",
            "level_id": 2,
            "id": 2,
            "price": 31
          },
          {
            "name": "Pairs Level 3",
            "level_id": 3,
            "id": 3,
            "price": 32
          },
          {
            "name": "Pairs Level 4",
            "level_id": 4,
            "id": 4,
            "price": 33
          },
          {
            "name": "Pairs Level 5",
            "level_id": 5,
            "id": 5,
            "price": 34
          }
        ]
      }
    ],
    "is_series_citizenship_ineligible": false,
    "full_name": "Cassy Papajohn",
    "email": "2222222541374@simba.usfs",
    "member_number": "541374",
    "birth_date": {
      "formatted": "6\/28\/1979",
      "timestamp": 299376000
    },
    "home_club": {
      "name": "Denver FSC",
      "membership_validity_formatted": "6\/30\/2019"
    },
    "region_name": "Southwestern",
    "section_name": "Midwestern",
    "gender": "female"
  },
  "user_application": {
    "disciplines": [
      {
        "discipline_id": 1,
        "coaches": [
          {
            "id": 1,
            "first_name": "Jennifer",
            "last_name": "Bralick",
            "ineligible": false
          },
          {
            "id": 3,
            "first_name": "Jennifer",
            "last_name": "Guest",
            "ineligible": false
          }
        ],
        "levels": [
          {
            "name": "Singles Level 2",
            "level_id": 2,
            "id": 2,
            "price": 31,
            "is_paid": false
          },
          {
            "name": "Singles Level 4",
            "level_id": 4,
            "id": 4,
            "price": 33,
            "is_paid": true
          }
        ],
        "partner": null
      },
      {
        "discipline_id": 2,
        "coach_limit": 3,
        "coaches": [
          {
            "id": 4,
            "first_name": "Jennifer",
            "last_name": "Heavner",
            "ineligible": false
          },
          {
            "id": 9,
            "first_name": "Hester",
            "last_name": "Crona",
            "ineligible": false
          }
        ],
        "levels": [
          {
            "name": "Dance Level 1",
            "level_id": 1,
            "id": 1,
            "price": 30,
            "is_paid": false
          },
          {
            "name": "Dance Level 3",
            "level_id": 3,
            "id": 3,
            "price": 32,
            "is_paid": false
          }
        ],
        "partner": {
          "id": 8,
          "first_name": "Marlon",
          "last_name": "Roob",
          "ineligible": false,
          "gender": "male",
          "eligible_levels": [
            {
              "name": "Partner Compatible Level 1",
              "level_id": 1,
              "id": 1,
              "price": 30
            },
            {
              "name": "Partner Compatible Level 3",
              "level_id": 3,
              "id": 3,
              "price": 32
            },
            {
              "name": "Partner Compatible Level 5",
              "level_id": 5,
              "id": 5,
              "price": 34
            }
          ]
        }
      },
      {
        "discipline_id": 3,
        "coach_limit": 3,
        "coaches": [
          {
            "id": 121,
            "first_name": "Isabelle",
            "last_name": "Sauer",
            "ineligible": false
          }
        ],
        "levels": [
          {
            "name": "Pairs Level 2",
            "level_id": 2,
            "id": 2,
            "price": 31,
            "is_paid": true
          },
          {
            "name": "Pairs Level 4",
            "level_id": 4,
            "id": 4,
            "price": 33,
            "is_paid": false
          }
        ],
        "partner": {
          "id": 97,
          "first_name": "Matteo",
          "last_name": "Rogahn",
          "gender": "male",
          "ineligible": false,
          "eligible_levels": [
            {
              "name": "Partner Compatible Level 2",
              "level_id": 2,
              "id": 2,
              "price": 31
            },
            {
              "name": "Partner Compatible Level 4",
              "level_id": 4,
              "id": 4,
              "price": 33
            }
          ]
        }
      }
    ]
  }
}
```

### [New] Update Series Registration User Profile

**Request Payload:** `SeriesApplicationApi.UpdateProfileAPIPayload`
```
{
  "email": "dymalycyqe@mailinator.net"
}
```

**Response:** `APISubmissionResponse`
```
{
  "success": true,
  "error": ""
}
```

### [New] Fetch Series Application Coach Search Form Options

**Request Payload:** `none`

**Response:** `SeriesApplicationApi.CoachSearchFormOptionsAPIResponse`
```
{
  "states": [
    {
      "label": "AL",
      "value": "AL"
    },
    [...]
  ]
}
```

### [New] Run Series Application Coach Search

**Request Payload:** `MemberSearchAPIParameters` (existing)
```
{
  "member_number": "386",
  "first_name": "Unity",
  "last_name": "Higgins",
  "state": "WV"
}
```

**Response:** `SeriesApplicationApi.CoachSearchAPIResponse` (extension of existing)
```
{
  "results": [
    {
      "id": 43,
      "first_name": "Della",
      "last_name": "Stoltenberg",
      "ineligible": false,
      "active": true,
      "state_abbreviation": "WV",
      "city": "West Mateo",
      "club_name": "Synchronised optimizing strategy",
      "member_number": 8875854
    },
    [...]
  ]
}
```

### [New] Fetch Series Application Partner Search Form Options

**Request Payload:** `none`

**Response:** `SeriesApplicationApi.PartnerSearchFormOptionsAPIResponse`
```
{
  "states": [
    {
      "label": "AL",
      "value": "AL"
    },
    [...]
  ]
}
```

### [New] Run Series Application Partner Search

**Request Payload:** `MemberSearchAPIParameters` (existing)
```
{
  "member_number": "988",
  "first_name": "Hermione",
  "last_name": "Velasquez",
  "state": "ME"
}
```

**Response:** `SeriesApplicationApi.PartnerSearchAPIResponse` (extension of existing)
```
{
  "results": [
    {
      "id": 75,
      "first_name": "Arvilla",
      "last_name": "Haley",
      "gender": "female",
      "ineligible": false,
      "active": true,
      "state_abbreviation": "ME",
      "city": "Uptonfort",
      "club_name": "Business-focused zerotolerance approach",
      "member_number": 9651135,
      "eligible_levels": [
        {
          "name": "Partner Compatible Level 1",
          "level_id": 1,
          "id": 1,
          "price": 30
        },
        {
          "name": "Partner Compatible Level 3",
          "level_id": 3,
          "id": 3,
          "price": 32
        },
        {
          "name": "Partner Compatible Level 5",
          "level_id": 5,
          "id": 5,
          "price": 34
        }
      ]
    },
    [...]
  ]
}
```

### [New] Add Series Application Skate Test

**Request Payload:** `UserAddSkateTestAPIPayload` (existing)
```
{
  "test_data": {
    "test": "moves_7",
    "club": "Qui eiusmod quae inv",
    "date": "08/24/1973",
    "club_id": null
  },
  "discipline_key": "moves"
}
```

**Response:** `SeriesApplicationApi.AddSkateTestAPIResponse` (includes existing property)
```
{
  "success": true,
  "error": "",
  "skate_test_history": {
    "disciplines": [
      {
        "label": "Moves",
        "key": "moves",
        "available_tests": [
          {
            "label": "Moves Test 8",
            "value": "moves_8",
            "level_id": 8
          },
          {
            "label": "Moves Test 9",
            "value": "moves_9",
            "level_id": 9
          },
          {
            "label": "Moves Test 10",
            "value": "moves_10",
            "level_id": 10
          }
        ],
        "key_test": [
          {
            "id": "moves_7",
            "name": "Moves Test 7",
            "is_self_reported": true,
            "level_id": 7
          }
        ],
        "self_reported_tests": [
          {
            "id": "moves_7",
            "name": "Moves Test 7",
            "is_self_reported": true,
            "level_id": 7
          },
          {
            "id": "moves_2",
            "name": "Senior Moves in the Field",
            "is_self_reported": true,
            "level_id": 2
          }
        ]
      },
      {
        "label": "Free Skating",
        "key": "free_skating",
        "available_tests": [
          {
            "label": "Free Skating Test 3",
            "value": "free_skating_3",
            "level_id": 3
          },
          {
            "label": "Free Skating Test 4",
            "value": "free_skating_4",
            "level_id": 4
          },
          {
            "label": "Free Skating Test 5",
            "value": "free_skating_5",
            "level_id": 5
          },
          {
            "label": "Free Skating Test 6",
            "value": "free_skating_6",
            "level_id": 6
          },
          {
            "label": "Free Skating Test 7",
            "value": "free_skating_7",
            "level_id": 7
          },
          {
            "label": "Free Skating Test 8",
            "value": "free_skating_8",
            "level_id": 8
          },
          {
            "label": "Free Skating Test 9",
            "value": "free_skating_9",
            "level_id": 9
          },
          {
            "label": "Free Skating Test 10",
            "value": "free_skating_10",
            "level_id": 10
          }
        ],
        "key_test": [
          {
            "id": "free_skating_2",
            "name": "Junior Free Skate",
            "is_self_reported": false,
            "level_id": 2
          }
        ],
        "self_reported_tests": []
      },
      {
        "label": "Pair",
        "key": "pair",
        "available_tests": [
          {
            "label": "Pair Test 1",
            "value": "pair_1",
            "level_id": 1
          },
          {
            "label": "Pair Test 2",
            "value": "pair_2",
            "level_id": 2
          },
          {
            "label": "Pair Test 3",
            "value": "pair_3",
            "level_id": 3
          },
          {
            "label": "Pair Test 4",
            "value": "pair_4",
            "level_id": 4
          },
          {
            "label": "Pair Test 5",
            "value": "pair_5",
            "level_id": 5
          },
          {
            "label": "Pair Test 6",
            "value": "pair_6",
            "level_id": 6
          },
          {
            "label": "Pair Test 7",
            "value": "pair_7",
            "level_id": 7
          },
          {
            "label": "Pair Test 8",
            "value": "pair_8",
            "level_id": 8
          },
          {
            "label": "Pair Test 9",
            "value": "pair_9",
            "level_id": 9
          },
          {
            "label": "Pair Test 10",
            "value": "pair_10",
            "level_id": 10
          }
        ],
        "key_test": [],
        "self_reported_tests": []
      },
      {
        "label": "Dance",
        "key": "dance",
        "available_tests": [
          {
            "label": "Fourteenstep",
            "value": "dance_3",
            "level_id": 3
          },
          {
            "label": "Dance Test 4",
            "value": "dance_4",
            "level_id": 4
          },
          {
            "label": "Dance Test 5",
            "value": "dance_5",
            "level_id": 5
          },
          {
            "label": "Dance Test 6",
            "value": "dance_6",
            "level_id": 6
          },
          {
            "label": "Dance Test 7",
            "value": "dance_7",
            "level_id": 7
          },
          {
            "label": "Dance Test 8",
            "value": "dance_8",
            "level_id": 8
          },
          {
            "label": "Dance Test 9",
            "value": "dance_9",
            "level_id": 9
          },
          {
            "label": "Dance Test 10",
            "value": "dance_10",
            "level_id": 10
          }
        ],
        "key_test": [
          {
            "id": "dance_2",
            "name": "Foxtrot",
            "is_self_reported": false,
            "level_id": 2
          },
          {
            "id": "dance_3",
            "name": "Fourteenstep",
            "is_self_reported": false,
            "level_id": 3
          }
        ],
        "self_reported_tests": []
      },
      {
        "label": "Free Dance",
        "key": "free_dance",
        "available_tests": [
          {
            "label": "Free Dance Test 1",
            "value": "free_dance_1",
            "level_id": 1
          },
          {
            "label": "Free Dance Test 2",
            "value": "free_dance_2",
            "level_id": 2
          },
          {
            "label": "Free Dance Test 3",
            "value": "free_dance_3",
            "level_id": 3
          },
          {
            "label": "Free Dance Test 4",
            "value": "free_dance_4",
            "level_id": 4
          },
          {
            "label": "Free Dance Test 5",
            "value": "free_dance_5",
            "level_id": 5
          },
          {
            "label": "Free Dance Test 6",
            "value": "free_dance_6",
            "level_id": 6
          },
          {
            "label": "Free Dance Test 7",
            "value": "free_dance_7",
            "level_id": 7
          },
          {
            "label": "Free Dance Test 8",
            "value": "free_dance_8",
            "level_id": 8
          },
          {
            "label": "Free Dance Test 9",
            "value": "free_dance_9",
            "level_id": 9
          },
          {
            "label": "Free Dance Test 10",
            "value": "free_dance_10",
            "level_id": 10
          }
        ],
        "key_test": [],
        "self_reported_tests": []
      },
      {
        "label": "Figure",
        "key": "figure",
        "available_tests": [
          {
            "label": "Figure Test 1",
            "value": "figure_1",
            "level_id": 1
          },
          {
            "label": "Figure Test 2",
            "value": "figure_2",
            "level_id": 2
          },
          {
            "label": "Figure Test 3",
            "value": "figure_3",
            "level_id": 3
          },
          {
            "label": "Figure Test 4",
            "value": "figure_4",
            "level_id": 4
          },
          {
            "label": "Figure Test 5",
            "value": "figure_5",
            "level_id": 5
          },
          {
            "label": "Figure Test 6",
            "value": "figure_6",
            "level_id": 6
          },
          {
            "label": "Figure Test 7",
            "value": "figure_7",
            "level_id": 7
          },
          {
            "label": "Figure Test 8",
            "value": "figure_8",
            "level_id": 8
          },
          {
            "label": "Figure Test 9",
            "value": "figure_9",
            "level_id": 9
          },
          {
            "label": "Figure Test 10",
            "value": "figure_10",
            "level_id": 10
          }
        ],
        "key_test": [],
        "self_reported_tests": []
      },
      {
        "label": "Testable Discipline 7",
        "key": "testable_discipline_7",
        "available_tests": [
          {
            "label": "Testable Discipline 7 Test 1",
            "value": "testable_discipline_7_1",
            "level_id": 1
          },
          {
            "label": "Testable Discipline 7 Test 2",
            "value": "testable_discipline_7_2",
            "level_id": 2
          },
          {
            "label": "Testable Discipline 7 Test 3",
            "value": "testable_discipline_7_3",
            "level_id": 3
          },
          {
            "label": "Testable Discipline 7 Test 4",
            "value": "testable_discipline_7_4",
            "level_id": 4
          },
          {
            "label": "Testable Discipline 7 Test 5",
            "value": "testable_discipline_7_5",
            "level_id": 5
          },
          {
            "label": "Testable Discipline 7 Test 6",
            "value": "testable_discipline_7_6",
            "level_id": 6
          },
          {
            "label": "Testable Discipline 7 Test 7",
            "value": "testable_discipline_7_7",
            "level_id": 7
          },
          {
            "label": "Testable Discipline 7 Test 8",
            "value": "testable_discipline_7_8",
            "level_id": 8
          },
          {
            "label": "Testable Discipline 7 Test 9",
            "value": "testable_discipline_7_9",
            "level_id": 9
          },
          {
            "label": "Testable Discipline 7 Test 10",
            "value": "testable_discipline_7_10",
            "level_id": 10
          }
        ],
        "key_test": [],
        "self_reported_tests": []
      }
    ]
  },
  "user_discipline_eligibility_update": [
    {
      "discipline_id": 1,
      "eligible_levels": [
        {
          "name": "STA Moves Level 1",
          "level_id": 1,
          "id": 200,
          "price": 30
        },
        {
          "name": "STA Moves Level 2",
          "level_id": 2,
          "id": 201,
          "price": 31
        },
        {
          "name": "STA Moves Level 3",
          "level_id": 3,
          "id": 202,
          "price": 32
        },
        {
          "name": "Singles Level 3",
          "level_id": 3,
          "id": 3,
          "price": 32
        },
        {
          "name": "STA Moves Level 4",
          "level_id": 4,
          "id": 203,
          "price": 33
        },
        {
          "name": "STA Moves Level 5",
          "level_id": 5,
          "id": 204,
          "price": 34
        }
      ]
    }
  ]
}
```

### [New] Remove Series Application Skate Test

**Request Payload:** `UserRemoveSkateTestAPIPayload` (existing)
```
{
  "discipline_key": "moves",
  "test_id": "moves_7"
}
```

**Response:** `SeriesApplicationApi.RemoveSkateTestAPIResponse` (includes existing property)
```
{
  "success": true,
  "error": "",
  "skate_test_history": {
    "disciplines": [
      {
        "label": "Moves",
        "key": "moves",
        "available_tests": [
          {
            "label": "Moves Test 3",
            "value": "moves_3",
            "level_id": 3
          },
          {
            "label": "Moves Test 4",
            "value": "moves_4",
            "level_id": 4
          },
          {
            "label": "Moves Test 5",
            "value": "moves_5",
            "level_id": 5
          },
          {
            "label": "Moves Test 6",
            "value": "moves_6",
            "level_id": 6
          },
          {
            "label": "Moves Test 7",
            "value": "moves_7",
            "level_id": 7
          },
          {
            "label": "Moves Test 8",
            "value": "moves_8",
            "level_id": 8
          },
          {
            "label": "Moves Test 9",
            "value": "moves_9",
            "level_id": 9
          },
          {
            "label": "Moves Test 10",
            "value": "moves_10",
            "level_id": 10
          }
        ],
        "key_test": [
          {
            "id": "moves_2",
            "name": "Senior Moves in the Field",
            "is_self_reported": true,
            "level_id": 2
          }
        ],
        "self_reported_tests": [
          {
            "id": "moves_2",
            "name": "Senior Moves in the Field",
            "is_self_reported": true,
            "level_id": 2
          }
        ]
      },
      {
        "label": "Free Skating",
        "key": "free_skating",
        "available_tests": [
          {
            "label": "Free Skating Test 3",
            "value": "free_skating_3",
            "level_id": 3
          },
          {
            "label": "Free Skating Test 4",
            "value": "free_skating_4",
            "level_id": 4
          },
          {
            "label": "Free Skating Test 5",
            "value": "free_skating_5",
            "level_id": 5
          },
          {
            "label": "Free Skating Test 6",
            "value": "free_skating_6",
            "level_id": 6
          },
          {
            "label": "Free Skating Test 7",
            "value": "free_skating_7",
            "level_id": 7
          },
          {
            "label": "Free Skating Test 8",
            "value": "free_skating_8",
            "level_id": 8
          },
          {
            "label": "Free Skating Test 9",
            "value": "free_skating_9",
            "level_id": 9
          },
          {
            "label": "Free Skating Test 10",
            "value": "free_skating_10",
            "level_id": 10
          }
        ],
        "key_test": [
          {
            "id": "free_skating_2",
            "name": "Junior Free Skate",
            "is_self_reported": false,
            "level_id": 2
          }
        ],
        "self_reported_tests": []
      },
      {
        "label": "Pair",
        "key": "pair",
        "available_tests": [
          {
            "label": "Pair Test 1",
            "value": "pair_1",
            "level_id": 1
          },
          {
            "label": "Pair Test 2",
            "value": "pair_2",
            "level_id": 2
          },
          {
            "label": "Pair Test 3",
            "value": "pair_3",
            "level_id": 3
          },
          {
            "label": "Pair Test 4",
            "value": "pair_4",
            "level_id": 4
          },
          {
            "label": "Pair Test 5",
            "value": "pair_5",
            "level_id": 5
          },
          {
            "label": "Pair Test 6",
            "value": "pair_6",
            "level_id": 6
          },
          {
            "label": "Pair Test 7",
            "value": "pair_7",
            "level_id": 7
          },
          {
            "label": "Pair Test 8",
            "value": "pair_8",
            "level_id": 8
          },
          {
            "label": "Pair Test 9",
            "value": "pair_9",
            "level_id": 9
          },
          {
            "label": "Pair Test 10",
            "value": "pair_10",
            "level_id": 10
          }
        ],
        "key_test": [],
        "self_reported_tests": []
      },
      {
        "label": "Dance",
        "key": "dance",
        "available_tests": [
          {
            "label": "Fourteenstep",
            "value": "dance_3",
            "level_id": 3
          },
          {
            "label": "Dance Test 4",
            "value": "dance_4",
            "level_id": 4
          },
          {
            "label": "Dance Test 5",
            "value": "dance_5",
            "level_id": 5
          },
          {
            "label": "Dance Test 6",
            "value": "dance_6",
            "level_id": 6
          },
          {
            "label": "Dance Test 7",
            "value": "dance_7",
            "level_id": 7
          },
          {
            "label": "Dance Test 8",
            "value": "dance_8",
            "level_id": 8
          },
          {
            "label": "Dance Test 9",
            "value": "dance_9",
            "level_id": 9
          },
          {
            "label": "Dance Test 10",
            "value": "dance_10",
            "level_id": 10
          }
        ],
        "key_test": [
          {
            "id": "dance_2",
            "name": "Foxtrot",
            "is_self_reported": false,
            "level_id": 2
          },
          {
            "id": "dance_3",
            "name": "Fourteenstep",
            "is_self_reported": false,
            "level_id": 3
          }
        ],
        "self_reported_tests": []
      },
      {
        "label": "Free Dance",
        "key": "free_dance",
        "available_tests": [
          {
            "label": "Free Dance Test 1",
            "value": "free_dance_1",
            "level_id": 1
          },
          {
            "label": "Free Dance Test 2",
            "value": "free_dance_2",
            "level_id": 2
          },
          {
            "label": "Free Dance Test 3",
            "value": "free_dance_3",
            "level_id": 3
          },
          {
            "label": "Free Dance Test 4",
            "value": "free_dance_4",
            "level_id": 4
          },
          {
            "label": "Free Dance Test 5",
            "value": "free_dance_5",
            "level_id": 5
          },
          {
            "label": "Free Dance Test 6",
            "value": "free_dance_6",
            "level_id": 6
          },
          {
            "label": "Free Dance Test 7",
            "value": "free_dance_7",
            "level_id": 7
          },
          {
            "label": "Free Dance Test 8",
            "value": "free_dance_8",
            "level_id": 8
          },
          {
            "label": "Free Dance Test 9",
            "value": "free_dance_9",
            "level_id": 9
          },
          {
            "label": "Free Dance Test 10",
            "value": "free_dance_10",
            "level_id": 10
          }
        ],
        "key_test": [],
        "self_reported_tests": []
      },
      {
        "label": "Figure",
        "key": "figure",
        "available_tests": [
          {
            "label": "Figure Test 1",
            "value": "figure_1",
            "level_id": 1
          },
          {
            "label": "Figure Test 2",
            "value": "figure_2",
            "level_id": 2
          },
          {
            "label": "Figure Test 3",
            "value": "figure_3",
            "level_id": 3
          },
          {
            "label": "Figure Test 4",
            "value": "figure_4",
            "level_id": 4
          },
          {
            "label": "Figure Test 5",
            "value": "figure_5",
            "level_id": 5
          },
          {
            "label": "Figure Test 6",
            "value": "figure_6",
            "level_id": 6
          },
          {
            "label": "Figure Test 7",
            "value": "figure_7",
            "level_id": 7
          },
          {
            "label": "Figure Test 8",
            "value": "figure_8",
            "level_id": 8
          },
          {
            "label": "Figure Test 9",
            "value": "figure_9",
            "level_id": 9
          },
          {
            "label": "Figure Test 10",
            "value": "figure_10",
            "level_id": 10
          }
        ],
        "key_test": [],
        "self_reported_tests": []
      },
      {
        "label": "Testable Discipline 7",
        "key": "testable_discipline_7",
        "available_tests": [
          {
            "label": "Testable Discipline 7 Test 1",
            "value": "testable_discipline_7_1",
            "level_id": 1
          },
          {
            "label": "Testable Discipline 7 Test 2",
            "value": "testable_discipline_7_2",
            "level_id": 2
          },
          {
            "label": "Testable Discipline 7 Test 3",
            "value": "testable_discipline_7_3",
            "level_id": 3
          },
          {
            "label": "Testable Discipline 7 Test 4",
            "value": "testable_discipline_7_4",
            "level_id": 4
          },
          {
            "label": "Testable Discipline 7 Test 5",
            "value": "testable_discipline_7_5",
            "level_id": 5
          },
          {
            "label": "Testable Discipline 7 Test 6",
            "value": "testable_discipline_7_6",
            "level_id": 6
          },
          {
            "label": "Testable Discipline 7 Test 7",
            "value": "testable_discipline_7_7",
            "level_id": 7
          },
          {
            "label": "Testable Discipline 7 Test 8",
            "value": "testable_discipline_7_8",
            "level_id": 8
          },
          {
            "label": "Testable Discipline 7 Test 9",
            "value": "testable_discipline_7_9",
            "level_id": 9
          },
          {
            "label": "Testable Discipline 7 Test 10",
            "value": "testable_discipline_7_10",
            "level_id": 10
          }
        ],
        "key_test": [],
        "self_reported_tests": []
      }
    ]
  },
  "user_discipline_eligibility_update": [
    {
      "discipline_id": 1,
      "eligible_levels": [
        {
          "name": "STR Moves Level 1",
          "level_id": 1,
          "id": 100,
          "price": 30
        },
        {
          "name": "STR Moves Level 2",
          "level_id": 2,
          "id": 101,
          "price": 31
        },
        {
          "name": "STR Moves Level 3",
          "level_id": 3,
          "id": 102,
          "price": 32
        },
        {
          "name": "Singles Level 3",
          "level_id": 3,
          "id": 3,
          "price": 32
        },
        {
          "name": "STR Moves Level 4",
          "level_id": 4,
          "id": 103,
          "price": 33
        },
        {
          "name": "STR Moves Level 5",
          "level_id": 5,
          "id": 104,
          "price": 34
        }
      ]
    }
  ]
}
```

### [New] Save Series Application

**Request Payload:** `SeriesApplicationApi.SaveApplicationAPIPayload`
```
{
  "disciplines": [
    {
      "discipline_id": 1,
      "partner_id": null,
      "level_ids": [
        4
      ],
      "coach_ids": [
        3
      ]
    },
    {
      "discipline_id": 2,
      "partner_id": null,
      "level_ids": [],
      "coach_ids": []
    },
    {
      "discipline_id": 3,
      "partner_id": 97,
      "level_ids": [
        2,
        4
      ],
      "coach_ids": [
        121
      ]
    }
  ]
}
```

**Response:** `SeriesApplicationApi.SaveApplicationAPIResponse`
```
{
  "success": true,
  "error": "",
  "cart_link": "\/pages\/series-registration\/1\/cart"
}
```

### [New] Fetch Series Overview

**Request Payload:** `none`

**Response:** `SeriesOverviewApi.FetchSeriesOverviewApiResponse`
```
{
  "series": {
    "application_deadline_formatted": {
      "date": "6\/6\/2020",
      "time": "11:59 ET"
    },
    "links": {
      "application": "\/pages\/series-registration\/1\/application",
      "checkout": "\/pages\/series-registration\/1\/cart",
      "standings": "\/pages\/series-registration\/1\/standings",
      "series_list": "\/pages\/series-registration"
    },
    "application_configuration": {
      "disciplines": [
        {
          "id": 1,
          "coach_limit": 2,
          "partner_configuration": {
            "is_partnered": false,
            "partner_rules": []
          },
          "name": "Singles"
        },
        {
          "id": 2,
          "coach_limit": 3,
          "partner_configuration": {
            "is_partnered": true,
            "partner_rules": [
              "opposite_gender",
              "compatible_levels"
            ]
          },
          "name": "Dance"
        },
        {
          "id": 3,
          "coach_limit": 3,
          "partner_configuration": {
            "is_partnered": true,
            "partner_rules": [
              "compatible_levels",
              "opposite_gender"
            ]
          },
          "name": "Pairs"
        }
      ],
      "levels_information": "Series participants may skate at their current test level, and\/or \"skate up\" one level for the series. Note: if athletes register for two levels within the NQS Series (i.e. current test level and \"skate up\"), they can only compete in one level at a time at each series competition.",
      "eligibility_documents": [
        {
          "name": "Singles Eligibility (PDF)",
          "link": "https:\/\/placehold.it\/500x500&text=Singles+Eligibility+(PDF)"
        },
        {
          "name": "Dance Eligibility (PDF)",
          "link": "https:\/\/placehold.it\/500x500&text=Dance+Eligibility+(PDF)"
        },
        {
          "name": "Pairs Eligibility (PDF)",
          "link": "https:\/\/placehold.it\/500x500&text=Pairs+Eligibility+(PDF)"
        }
      ]
    },
    "status": {
      "message": {
        "type_key": "info",
        "text": "You have already applied. Tap\n \"Update My Application\" to make changes."
      },
      "applications_open": true,
      "standings_available": false
    },
    "contact_email_address": "NQS@usfigureskating.org",
    "refund_email_address": "productsupport@usfigureskating.org",
    "statement": "The National Qualifying Series (NQS) is a series of official U.S. Figure Skating approved\n                            competitions hosted individually by member clubs nationwide that are held in a standard\n                            format and in which athletes earn official scores towards a sectional and national rank. The\n                            competitions are held between June 1 - September 15 and serve juvenile - senior competitors\n                            in singles, dance and pairs. Athletes must register to participate in the series no later\n                            than May 28th and then must register for each series competition separately through EMS.",
    "reports": [
      {
        "name": "Series Results Report",
        "link": "https:\/\/placehold.it\/500x500&text=Series+Results+Report"
      },
      {
        "name": "Series Application Report",
        "link": "https:\/\/placehold.it\/500x500&text=Series+Application+Report"
      }
    ],
    "resource_documents": [
      {
        "name": "Resources (PDF)",
        "link": "https:\/\/placehold.it\/500x500&text=Singles+Resources",
        "discipline_id": 1
      },
      {
        "name": "Resources (PDF)",
        "link": "https:\/\/placehold.it\/500x500&text=Dance+Resources",
        "discipline_id": 2
      },
      {
        "name": "Resources (PDF)",
        "link": "https:\/\/placehold.it\/500x500&text=Pairs+Resources",
        "discipline_id": 3
      }
    ],
    "icon": "\/images\/series-icon.png",
    "id": 1,
    "name": "Applications Open - Incomplete"
  },
  "user_application": {
    "disciplines": [
      {
        "discipline_id": 1,
        "coaches": [
          {
            "id": 1,
            "first_name": "Jennifer",
            "last_name": "Bralick",
            "ineligible": false
          },
          {
            "id": 3,
            "first_name": "Jennifer",
            "last_name": "Guest",
            "ineligible": false
          }
        ],
        "levels": [
          {
            "name": "Singles Level 2",
            "level_id": 2,
            "id": 2,
            "price": 31,
            "is_paid": false
          },
          {
            "name": "Singles Level 4",
            "level_id": 4,
            "id": 4,
            "price": 33,
            "is_paid": true
          }
        ],
        "partner": null
      },
      {
        "discipline_id": 2,
        "coach_limit": 3,
        "coaches": [
          {
            "id": 4,
            "first_name": "Jennifer",
            "last_name": "Heavner",
            "ineligible": false
          },
          {
            "id": 9,
            "first_name": "Hester",
            "last_name": "Crona",
            "ineligible": false
          }
        ],
        "levels": [
          {
            "name": "Dance Level 1",
            "level_id": 1,
            "id": 1,
            "price": 30,
            "is_paid": false
          },
          {
            "name": "Dance Level 3",
            "level_id": 3,
            "id": 3,
            "price": 32,
            "is_paid": false
          }
        ],
        "partner": {
          "id": 8,
          "first_name": "Marlon",
          "last_name": "Roob",
          "ineligible": false,
          "gender": "male",
          "eligible_levels": [
            {
              "name": "Partner Compatible Level 1",
              "level_id": 1,
              "id": 1,
              "price": 30
            },
            {
              "name": "Partner Compatible Level 3",
              "level_id": 3,
              "id": 3,
              "price": 32
            },
            {
              "name": "Partner Compatible Level 5",
              "level_id": 5,
              "id": 5,
              "price": 34
            }
          ]
        }
      },
      {
        "discipline_id": 3,
        "coach_limit": 3,
        "coaches": [
          {
            "id": 121,
            "first_name": "Isabelle",
            "last_name": "Sauer",
            "ineligible": false
          }
        ],
        "levels": [
          {
            "name": "Pairs Level 2",
            "level_id": 2,
            "id": 2,
            "price": 31,
            "is_paid": true
          },
          {
            "name": "Pairs Level 4",
            "level_id": 4,
            "id": 4,
            "price": 33,
            "is_paid": false
          }
        ],
        "partner": {
          "id": 97,
          "first_name": "Matteo",
          "last_name": "Rogahn",
          "gender": "male",
          "ineligible": false,
          "eligible_levels": [
            {
              "name": "Partner Compatible Level 2",
              "level_id": 2,
              "id": 2,
              "price": 31
            },
            {
              "name": "Partner Compatible Level 4",
              "level_id": 4,
              "id": 4,
              "price": 33
            }
          ]
        }
      }
    ]
  }
}
```

### [New] Fetch Series Registration Series List

**Request Payload:** `none`

**Response:** `FetchSeriesRegistrationSeriesListApiResponse`
```
{
  "series": [
    {
      "icon": "\/images\/series-icon-1.png",
      "id": 8,
      "name": "Participant Standings Available",
      "application_deadline_date_formatted": "3\/14\/2020",
      "links": {
        "overview": "\/pages\/series-registration\/8"
      }
    },
    [...]
  ]
}
```
### [New] Fetch Series Standings

**Request Payload:** `none`

**Response:** `SeriesStandingsApi.FetchSeriesStandingsApiResponse`

```
{
  "series": {
    "application_deadline_formatted": {
      "date": "3/21/2020",
      "time": "11:59 ET"
    },
    "links": {
      "overview": "/pages/series-registration/8"
    },
    "resource_documents": [
      {
        "name": "Dance",
        "link": "https://placehold.it/500x500&text=Dance"
      },
      {
        "name": "Singles",
        "link": "https://placehold.it/500x500&text=Singles"
      },
      {
        "name": "Pairs",
        "link": "https://placehold.it/500x500&text=Pairs"
      }
    ],
    "icon": "/images/series-icon.png",
    "id": 8,
    "name": "Participant Standings Available"
  },
  "standings": {
    "meta": {
      "last_updated_datetime_formatted": "4/9/2020 11:14 AM ET",
      "available_filters": {
        "section_keys": [
          "midwestern",
          "eastern",
          "pacific"
        ],
        "discipline_names": [
          "Dance",
          "Pairs",
          "Singles"
        ],
        "level_names": [
          "Juvenile",
          "Intermediate",
          "Novice",
          "Junior",
          "Senior"
        ]
      }
    },
    "events": [
      {
        "name": "Juvenile Combined Dance",
        "discipline_name": "Dance",
        "level_name": "Juvenile",
        "standings": [
          {
            "id": 2929902636,
            "participant_name": "Crystal Hackett",
            "home_club": "Jamesriver FSC",
            "competition_earned": "Multi-tiered scalable processimprovement",
            "highest_score": "100.23",
            "section_key": "midwestern",
            "sectional_rank": "1",
            "national_rank": "1"
          },
          [...]
          {
            "id": 267173313,
            "participant_name": "Shannon Price",
            "home_club": "University of Colorado",
            "competition_earned": "Progressive interactive encoding",
            "highest_score": "FNR",
            "section_key": "eastern",
            "sectional_rank": "FNR",
            "national_rank": "FNR"
          },
          [...]
          {
            "id": 2202761872,
            "participant_name": "Leonel Smitham V",
            "home_club": "The Bourne SC, Inc.",
            "competition_earned": null,
            "highest_score": null,
            "section_key": "eastern",
            "sectional_rank": null,
            "national_rank": null
          },
          [...]
        ]
      },
      [...]
    ]
  }
}
```