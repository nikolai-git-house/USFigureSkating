# Integration Guide
## Overview
This document aids in the process of integration isolated frontend development assets with a backend environment.

## Inline Notes
Various comments related to integration in code have been annotated with an `@integration` flag.

## HTML
### Option 1 -  Master Layout
If you are using a backend framework that allows master layouts, integration should be straight forward and simple. 

Create 2 master layouts from `src/views/layouts/main.php` (Logged In Layout)  and `src/views/layouts/blank.php` (Not Logged In Layout).
Within these files, you can either include the respective header and footer partials, or you can simply copy their contents
into the proper locations. 

For example, in `src/views/layouts/main.php` replace


``` php 
  <?php include( __DIR__ . '/partials/header.php' ); ?>
```

With the contents of `src/views/layouts/partials/header.php`.

Additionally, replace the content yield section of each layout with the proper format of your framework:


``` php 
 <?php
	if (isset($content)) {
		echo $content;
	}
?>s
```

### Option 2 - Complete Files
If the backend architecture does not accommodate master layouts, you will need to copy
the markup for each view file and integrate it with the markup from its respective layout file. 

### Additional Information
Please see `README.md` for further descriptions of the View architecture.

## Stylesheets
No complicated stylesheet integration should be necessary. If you ensure the stylesheet calls in each layout file 
reference the proper path to their built assets, stylesheet integration should be completed. 

Any modifications to existing stylesheet source files will require a build as described in the README. 
## Javascript
As of this writing, JavaScript has been written to not require backend API calls to function. 

Additional frontend development or consultation will likely be necessary to complete backend integration.

Any modifications to existing JavaScript source files will require a build as described in the README. 
   