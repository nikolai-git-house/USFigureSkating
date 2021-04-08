# BATCH 4
Along with new additions, various updates have been made to data structures and API endpoints.
Review the new INTEGRATION-API.md guide for full API documentation. 

# API Updates
The API objects and endpoints have been collected and updated in INTEGRATION-API.md. 
Notable updates from Batch 4 include:

* Addition of Credit Package data structure
* Addition of active_sales_window property to Competitions
* Addition of competition_id to CompetitionInformation
* Addition of competition_id to SkatingEvents and CompleteSkatingEvents
* Addition of credit_packages to CompleteSkatingEvents
* Addition of required success confirmation to the following endpoints:
* Addition of pricing_message data point to CompetitionInformation (see INTEGRATION-API.md for usage).
* Add cart credits endpoint updated to new structure including

Additionally, the following endpoints require success confirmation as outlined in INTEGRATON-API.md
- Remove session from cart
- Remove credit package from cart
- add session to cart
- add credits to cart
- remove credits from cart
- add session to schedule
- remove session from schedule
- update skater address
