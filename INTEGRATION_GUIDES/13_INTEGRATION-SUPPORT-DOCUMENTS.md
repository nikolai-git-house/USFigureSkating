# Support Documents Integration
## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Support Documents component.

## Changelog
A changelog has been added as part of this release.  This file documents changes for this release and onward.  

### Data Structure Documentation
In line with the previous release, this release utilizes a "documentation in place" strategy to document data structures.

# General
## Inline Integration Notes
As with previous releases, various templates contain `@integration` comments highlighting points relevant to integration.

## Changes to Existing Files
* `src/views/layouts/partials/footer.php`
	- "Contact Us" wording change to "Contact Member Services"
* `src/views/layouts/partials/header.php`
	- Add link to Support Documents ("Help & Resources")
	- Change wording of EMS Support link from "Support
* `src/views/pages/J.1_create_account.php`
	- Add create account instruction link and copy.  This link will need a target added

## Configuration
By default, support document links will open in a new tab. This behavior can be changed to open document links
in the current tab by changing the `:new_tab` attribute on the `<support-documents>` element to false.
This tag is located around `src/views/pages/L.0_SupportDocuments.php:6`

# API
API endpoints and data structures are outlined in `INTEGRATION_GUIDES/Release3/r3.2.0_INTEGRATION_SupportDocumentsAPI.md`