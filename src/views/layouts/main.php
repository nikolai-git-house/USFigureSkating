<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<!--	@integration - If you have dynamically assigned page titles, they can be set here-->
	<title>U.S. Figure Skating EMS</title>
	<!-- @integration - this call will need to be replaced to reference the path of the main css file on your server.
		the PHP function is merely for cache busting and can be removed without issue.
		ex:
		<link rel="stylesheet" href="/css/main.css"/>
	-->
	<link rel="stylesheet" href="<?php echo mix('/css/main.css') ?>"/>
	<link rel="manifest" href="/manifest.webmanifest">
	<meta name="theme-color" content="#0055A5">
	<meta name="msapplication-TileImage" content="/app-icons/app-icon-144x144.png">
	<meta name="msapplication-TileColor" content="#0055A5">
	<meta name="apple-mobile-web-app-title" content="U.S. Figure Skating EMS">
	<link rel="apple-touch-icon" sizes="36x36" href="/app-icons/app-icon-36x36.png">
	<link rel="apple-touch-icon" sizes="48x48" href="/app-icons/app-icon-48x48.png">
	<link rel="apple-touch-icon" sizes="96x96" href="/app-icons/app-icon-96x96.png">
	<link rel="apple-touch-icon" sizes="144x144" href="/app-icons/app-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="168x168" href="/app-icons/app-icon-168x168.png">
	<link rel="apple-touch-icon" sizes="192x192" href="/app-icons/app-icon-192x192.png">
	<link rel="icon" href="/favicon.ico">
</head>
<body>
<div id="app" class="app app--header-pad">
	<!--	@integration -
          this will need to be replaced with the proper backend method for importing this file, or
          its contents can be copy/pasted here.
  -->
    <?php include( __DIR__ . '/partials/header.php' ); ?>
	<main>
		<!-- @integration
           This is where the content yield of the page should be rendered.  If master layouts/content yields are not
           possible with your backend templating methodology, each page will need to be wrapped with the markup from this file
        -->
        <?php
        if (isset($content)) {
            echo $content;
        }
        ?>
    </main>
    <confirm-action-overlay></confirm-action-overlay>
    <app-notice></app-notice>
</div>
<!-- @integration -
	[04/30/2019] - The following two scripts must now be included prior to the inclusion of any app scripts.

	See note below on script inclusion methodologies
-->
<script src="<?php echo mix('/js/manifest.js') ?>"></script>
<script src="<?php echo mix('/js/vendor.js') ?>"></script>

<!-- @integration -
	[04/30/2019] - On competition registration related pages, the following script needs to be included.

	This script can be removed on non-related pages to reduce transfer sizes, but leaving it will not cause any issues.
-->
<script src="<?php echo mix('/js/competition-registration.js') ?>"></script>

<!-- @integration -
	[09/18/2019] - On admin portal related pages, the following script needs to be included.

	This script can be removed on non-related pages to reduce transfer sizes, but leaving it will not cause any issues.
-->
<script src="<?php echo mix('/js/admin-portal.js') ?>"></script>

<!-- @integration -
	[2020-03-06] - On series-registration related pages, the following script needs to be included.

	This script can be removed on non-related pages to reduce transfer sizes, but leaving it will not cause any issues.
-->
<script src="<?php echo mix('/js/series-registration.js') ?>"></script>

<!-- @integration -
	[2020-04-23] - On team competition registration related pages, the following script needs to be included.

	This script can be removed on non-related pages to reduce transfer sizes, but leaving it will not cause any issues.
-->
<script src="<?php echo mix('/js/competition-registration-teams.js') ?>"></script>


<!-- @integration - this call will need to be replaced to reference the path of the js file on your server.
		the PHP function is merely for cache busting and can be removed without issue.
		ex:
		<script src="/js/main.js"></script>
-->
<script src="<?php echo mix('/js/main.js') ?>"></script>
</body>
</html>