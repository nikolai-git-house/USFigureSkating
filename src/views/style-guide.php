<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Page Title</title>
	<link rel="stylesheet" href="<?php echo mix('/css/style-guide.css') ?>"/>
</head>
<body>
<div id="app">
	<div class="style-guide">
		<div class="style-guide__page-heading">
			<h1>Style Guide</h1>
		</div>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Colors</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="swatch-container">
					<div class="swatch" style="background-color:#0055A5">
						$USFSA-blue: #0055A5;
					</div>
					<div class="swatch" style="background-color:#138DF4">
						$USFSA-blue-light: #138DF4;
					</div>
					<div class="swatch" style="background-color:#00a4e4">
						$blue-light-alt: #00a4e4;
					</div>
					<div class="swatch" style="background-color:#2599F2">
						$blue-light-alt2: #2599F2;
					</div>
					<div class="swatch" style="background-color:#39b54a">
						$state-green: #39b54a;
					</div>
					<div class="swatch" style="background-color:#e03c31">
						$state-red: #e03c31;
					</div>
					<div class="swatch" style="background-color:#DADADA">
						$gray-dark: #DADADA;
					</div>
					<div class="swatch" style="background-color:#F3F3F3">
						$gray-light: #F3F3F3;
					</div>
					<div class="swatch" style="background-color:#E2E2E2">
						$gray-med: #E2E2E2;
					</div>
					<div class="swatch" style="background-color:#c2c2c2">
						$gray-76: #c2c2c2;
					</div>
					<div class="swatch" style="background-color:#969696">
						$gray-58: #969696;
					</div>
					<div class="swatch" style="background-color:#551a8b">
						$purple: #551a8b;
					</div>
					<div class="swatch" style="background-color:#929292">
						$light-gray-text: #929292;
					</div>
					<div class="swatch" style="background-color:#e1161f">
						$alert-red: #e1161f;
					</div>
				</div>

				<ul>
					<li>$brand-primary: $USFSA-blue;</li>
					<li>$divider-color: $gray-dark;</li>
					<li>$secondary-divider-color: $gray-light;</li>
					<li>$headings-color: $USFSA-blue;</li>
					<li>$panel-link-border-color: $divider-color;</li>
					<li>$panel-list-border-color: $divider-color;</li>
					<li>$accordion-content-border-color: $divider-color;</li>
					<li>$link-visited-color: $purple;</li>
					<li>$session-border-color: $divider-color;</li>
				</ul>
			</div>
		</section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Icons</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="style-guide-icon-list">
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-attachment"></i>
                        <p class="style-guide-icon__text">icon-attachment</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-circle-left"></i>
                        <p class="style-guide-icon__text">icon-chevron-circle-left</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-circle-right"></i>
                        <p class="style-guide-icon__text">icon-chevron-circle-right</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-down"></i>
                        <p class="style-guide-icon__text">icon-chevron-down</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-blue-large-down"></i>
                        <p class="style-guide-icon__text">icon-chevron-blue-large-down</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-down--gray"></i>
                        <p class="style-guide-icon__text">icon-chevron-down--gray</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-right"></i>
                        <p class="style-guide-icon__text">icon-chevron-right</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-right-gray"></i>
                        <p class="style-guide-icon__text">icon-chevron-right-gray</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-left"></i>
                        <p class="style-guide-icon__text">icon-chevron-left</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-up"></i>
                        <p class="style-guide-icon__text">icon-chevron-up</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-chevron-blue-large-up"></i>
                        <p class="style-guide-icon__text">icon-chevron-blue-large-up</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-chevron-down-white"></i>
                        <p class="style-guide-icon__text">icon-chevron-down-white</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-chevron-up-white"></i>
                        <p class="style-guide-icon__text">icon-chevron-up-white</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-close-white"></i>
                        <p class="style-guide-icon__text">icon-close-white</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-menu-close"></i>
                        <p class="style-guide-icon__text">icon-menu-close</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-menu-standard"></i>
                        <p class="style-guide-icon__text">icon-menu-standard</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-nav-open"></i>
                        <p class="style-guide-icon__text">icon-nav-open</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-nav-close"></i>
                        <p class="style-guide-icon__text">icon-nav-close</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-accordion-open"></i>
                        <p class="style-guide-icon__text">icon-accordion-open</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-accordion-close"></i>
                        <p class="style-guide-icon__text">icon-accordion-close</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-panel-link"></i>
                        <p class="style-guide-icon__text">icon-panel-link</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-dollar-sign"></i>
                        <p class="style-guide-icon__text">icon-dollar-sign</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-bookmark"></i>
                        <p class="style-guide-icon__text">icon-bookmark</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-x"></i>
                        <p class="style-guide-icon__text">icon-x</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-x--red"></i>
                        <p class="style-guide-icon__text">icon-x--red</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-x--blue"></i>
                        <p class="style-guide-icon__text">icon-x--blue</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-checkmark"></i>
                        <p class="style-guide-icon__text">icon-checkmark</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-minus"></i>
                        <p class="style-guide-icon__text">icon-minus</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-plus"></i>
                        <p class="style-guide-icon__text">icon-plus</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-cart"></i>
                        <p class="style-guide-icon__text">icon-cart</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-amex"></i>
                        <p class="style-guide-icon__text">icon-amex</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-discover"></i>
                        <p class="style-guide-icon__text">icon-discover</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-mastercard"></i>
                        <p class="style-guide-icon__text">icon-mastercard</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-visa"></i>
                        <p class="style-guide-icon__text">icon-visa</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-card-amex"></i>
                        <p class="style-guide-icon__text">icon-card-amex</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-card-discover"></i>
                        <p class="style-guide-icon__text">icon-card-discover</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-card-mastercard"></i>
                        <p class="style-guide-icon__text">icon-card-mastercard</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-card-visa"></i>
                        <p class="style-guide-icon__text">icon-card-visa</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-status-check"></i>
                        <p class="style-guide-icon__text">icon-status-check</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-status-x"></i>
                        <p class="style-guide-icon__text">icon-status-x</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-add"></i>
                        <p class="style-guide-icon__text">icon-add</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-add--disabled"></i>
                        <p class="style-guide-icon__text">icon-add--disabled</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-edit"></i>
                        <p class="style-guide-icon__text">icon-edit</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-edit--disabled"></i>
                        <p class="style-guide-icon__text">icon-edit--disabled</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-alert-red"></i>
                        <p class="style-guide-icon__text">icon-alert-red</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-alert-white"></i>
                        <p class="style-guide-icon__text">icon-alert-white</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-check-tag"></i>
                        <p class="style-guide-icon__text">icon-check-tag</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-info"></i>
                        <p class="style-guide-icon__text">icon-info</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-info--red"></i>
                        <p class="style-guide-icon__text">icon-info--red</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-info-muted"></i>
                        <p class="style-guide-icon__text">icon-info-muted</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-info-white"></i>
                        <p class="style-guide-icon__text">icon-info-white</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-delete"></i>
                        <p class="style-guide-icon__text">icon-delete</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-delete--disabled"></i>
                        <p class="style-guide-icon__text">icon-delete--disabled</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-restore"></i>
                        <p class="style-guide-icon__text">icon-restore</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-triangle-right-blue"></i>
                        <p class="style-guide-icon__text">icon-triangle-right-blue</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-pause-blue"></i>
                        <p class="style-guide-icon__text">icon-pause-blue</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-more"></i>
                        <p class="style-guide-icon__text">icon-more</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-loading"></i>
                        <p class="style-guide-icon__text">icon-loading</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-time"></i>
                        <p class="style-guide-icon__text">icon-time</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-phone"></i>
                        <p class="style-guide-icon__text">icon-phone</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-email"></i>
                        <p class="style-guide-icon__text">icon-email</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-profile"></i>
                        <p class="style-guide-icon__text">icon-profile</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-registered-badge--white"></i>
                        <p class="style-guide-icon__text">icon-registered-badge--white</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-badge--blue-narrow"></i>
                        <p class="style-guide-icon__text">icon-badge--blue-narrow</p>
                    </div>
                    <div class="style-guide-icon style-guide-icon--white">
                        <i class="style-guide-icon__icon icon-star--white"></i>
                        <p class="style-guide-icon__text">icon-star--white</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-star--blue"></i>
                        <p class="style-guide-icon__text">icon-star--blue</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-star--black"></i>
                        <p class="style-guide-icon__text">icon-star--black</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-search--blue"></i>
                        <p class="style-guide-icon__text">icon-search--blue</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-checkbox"></i>
                        <p class="style-guide-icon__text">icon-checkbox</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-checkmark-checkbox"></i>
                        <p class="style-guide-icon__text">icon-checkmark-checkbox</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-checkbox-red"></i>
                        <p class="style-guide-icon__text">icon-checkbox-red</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-checkmark-checkbox-red"></i>
                        <p class="style-guide-icon__text">icon-checkmark-checkbox-red</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-radio"></i>
                        <p class="style-guide-icon__text">icon-radio</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-radio--checked"></i>
                        <p class="style-guide-icon__text">icon-radio--checked</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-download"></i>
                        <p class="style-guide-icon__text">icon-download</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-document"></i>
                        <p class="style-guide-icon__text">icon-document</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-external"></i>
                        <p class="style-guide-icon__text">icon-external</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-status-primary-error"></i>
                        <p class="style-guide-icon__text">icon-status-primary-error</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-status-primary-error-ada"></i>
                        <p class="style-guide-icon__text">icon-status-primary-error-ada</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-status-primary-success"></i>
                        <p class="style-guide-icon__text">icon-status-primary-success</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-status-primary-success-ada"></i>
                        <p class="style-guide-icon__text">icon-status-primary-success-ada</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-comments"></i>
                        <p class="style-guide-icon__text">icon-comments</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-mail"></i>
                        <p class="style-guide-icon__text">icon-mail</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-close-minus"></i>
                        <p class="style-guide-icon__text">icon-close-minus</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-open-plus"></i>
                        <p class="style-guide-icon__text">icon-open-plus</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-warning"></i>
                        <p class="style-guide-icon__text">icon-warning</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-warning-alt"></i>
                        <p class="style-guide-icon__text">icon-warning-alt</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-danger"></i>
                        <p class="style-guide-icon__text">icon-danger</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-danger-alt"></i>
                        <p class="style-guide-icon__text">icon-danger-alt</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-pending"></i>
                        <p class="style-guide-icon__text">icon-pending</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-pending-thin"></i>
                        <p class="style-guide-icon__text">icon-pending-thin</p>
                    </div>
                    <div class="style-guide-icon">
                        <i class="style-guide-icon__icon icon-scheduled"></i>
                        <p class="style-guide-icon__text">icon-scheduled</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Animated Icons</h2>
            </div>
            <div class="style-guide__section-content">
                <h2>Animated Check Icon</h2>
                <admin-animated-icon>
                    <div slot-scope="{show_icon}">
                        <animated-check-icon v-if="show_icon"></animated-check-icon>
                    </div>
                </admin-animated-icon>
                <h2>Animated Saving Icon</h2>
                <animated-saving-icon></animated-saving-icon>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Text</h2>
            </div>
            <div class="style-guide__section-content">
                <h3>Text Variants</h3>
                <p class="text--highlight">Highlight text (.text--highlight)</p>
                <p class="text--warning">Warning text (.text--warning)</p>
                <p class="text--success">Success text (.text--success)</p>
                <p class="text--error">Error text (.text--error)</p>
                <p class="text--muted">Muted text (.text--muted)</p>
                <div>
                    <a href="#" class="text--highlight">Highlight text (.text--highlight) (link)</a>
                    <br><a href="#" class="text--warning">Warning text (.text--warning) (link)</a>
                    <br><a href="#" class="text--success">Success text (.text--success) (link)</a>
                    <br><a href="#" class="text--error">Error text (.text--error) (link)</a>
                    <br><a href="#" class="text--muted">Muted text (.text--muted) (link)</a>
                </div>
                <p class="text--underline">Underline text (.text--underline)</p>
                <p class="text--icon-warning">Icon warning text (.text--icon-warning)</p>
                <p class="text--icon-danger">Icon danger text (.text--icon-danger)</p>
                <p class="text--icon-danger-alt">Alternate icon danger text (.text--icon-danger-alt)</p>
                <p class="warning-notice">
                    <i class="inline-icon icon-warning-alt">&nbsp;</i>
                    Multiline warning text
                    <br>
                    that handles two lines
                </p>
                <p class="warning-notice">
                    <i class="inline-icon icon-danger-alt">&nbsp;</i>
                    Multiline danger text
                    <br>
                    that handles two lines
                </p>
                <h3>List Variants</h3>
                <ul class="list list--light">
                    <li>
                        <span class="list__text">Light Text List</span>
                    </li>
                    <li>
                        <span class="list__text">ul.list.list--light > li > span.list__text</span>
                    </li>
                </ul>
            </div>
        </section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Music Items</h2>
			</div>
			<div class="style-guide__section-content" style="background: #F3F3F3; padding:4rem 0;">
				<div class="music-path-selection music-path-selection--card">
					<button type="button" class="button button--block">
						Upload Music
					</button>
					<button type="button" class="button button--block button--info">
						Previous Uploads
					</button>
				</div>
				<div class="music-item-list">
					<music-item :music="music_item"></music-item>
					<div class="music-item music-item--hide-actions">
						<div class="music-item__content">
							<div class="music-item__status">
								<div class="upload-status">
									<svg class="upload-status__indicator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
										<circle cx="26" cy="26" r="25" stroke="#dadada" fill="none" stroke-width="2"/>
										<circle cx="26" cy="26" r="25" stroke="#138df4" fill="none" stroke-linecap="round" stroke-width="2" stroke-dasharray="157.079632679" stroke-dashoffset="57.079632679"/>
									</svg>
									<span class="upload-status__value">60%</span>
								</div>
							</div>
							<div class="music-item__description">
								<span class="music-item__name">Maid with the Flaxen Hair</span>
							</div>
							<div class="music-item__actions">
								<button class="icon-button icon-button--edit">Edit</button>
							</div>
						</div>
					</div>
					<div class="music-item">
						<div class="music-item__content music-item--hide-actions">
							<div class="music-item__status">
								<div class="upload-status upload-status--error">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" class="upload-status__indicator">
										<circle cx="26" cy="26" r="25" stroke="#dadada" fill="none" stroke-width="2"/>
										<circle cx="26" cy="26" r="25" stroke="#e1161f" fill="none" stroke-linecap="round" stroke-width="2" stroke-dasharray="157.079632679" stroke-dashoffset="0"/>
									</svg>
									<span class="upload-status__value">
									60%
								</span>
								</div>
							</div>
							<div class="music-item__description">
								<span class="music-item__name">Maid with the Flaxen Hair</span>
							</div>
							<div class="music-item__actions music-item__actions--inline">
								<button class="icon-button icon-button--edit">Edit</button>
							</div>
						</div>
					</div>
					<div class="music-item">
						<div class="music-item__content">
							<div class="music-item__status">
								<button class="play-button">Play</button>
							</div>
							<div class="music-item__description">
								<span class="music-item__name">Maid with the Flaxen Hair</span>
								<!--<span class="music-item__duration">3:35</span>-->
							</div>
							<div class="music-item__actions music-item__actions--inline">
								<button class="icon-button icon-button--edit">Edit</button>
							</div>
						</div>
					</div>
					<div class="music-item music-item--hide-actions">
						<div class="music-item__content">
							<div class="music-item__status">
								<button class="play-button">Play</button>
							</div>
							<div class="music-item__description music-item__description--editor-active">
								<div class="form-group">
									<label for="music-item-song-name" class="field-label sr-only">Name</label>
									<input type="text" id="music-item-song-name" class="form-field" value="Maid with the Flaxen Hair">
								</div>
							</div>
							<div class="music-item__actions music-item__actions--inline">
								<button class="icon-button icon-button--edit">Edit</button>
							</div>
						</div>
					</div>
					<div class="music-item">
						<div class="music-item__content">
							<div class="music-item__status">
								<button class="play-button">Play</button>
							</div>
							<div class="music-item__description">
								<span class="music-item__name">Maid with the Flaxen Hair</span>
								<span class="music-item__duration">3:35</span>
							</div>
							<div class="music-item__actions">
								<button class="icon-button icon-button--more">Expand Actions</button>
							</div>
						</div>
					</div>
					<div class="music-item">
						<div class="music-item__content">
							<div class="music-item__status">
								<button class="play-button">Play</button>
							</div>
							<div class="music-item__description">
								<span class="music-item__name">Maid with the Flaxen Hair</span>
								<span class="music-item__duration">3:35</span>
							</div>
							<div class="music-item__actions">
								<button class="icon-button icon-button--close">Collapse Actions</button>
							</div>
							<div class="music-item__overlay">
								<div class="action-overlay">
									<div class="action-overlay__item">
										<button class="icon-button icon-button--add icon-button--labeled">Add
										</button>
									</div>
									<div class="action-overlay__item">
										<button class="icon-button icon-button--delete icon-button--labeled">Delete
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="music-item music-item--hide-actions">
						<div class="music-item__content">
							<div class="music-item__status">
								<button class="play-button  play-button--is-playing">Pause</button>
							</div>
							<div class="music-item__description">
								<span class="music-item__name">This song is playing</span>
								<span class="music-item__duration">2:55 / 3:35</span>
							</div>
							<div class="music-item__actions">
								<button class="icon-button icon-button--close">Expand Actions</button>
							</div>
						</div>
					</div>


				</div>
				<div class="music-copyright-list">
					<div class="music-copyright">
						<div class="music-copyright__content">
							<div class="music-copyright__data">
								<ul class="music-copyright__list label-list">
									<li class="music-copyright-summary__field">
										<span class="label-list__label">Title:</span>
										Maid with the Flaxen Hair
									</li>
									<li class="music-copyright-summary__field">
										<span class="label-list__label">Artist:</span>
										Metallica
									</li>
									<li class="music-copyright-summary__field">
										<span class="label-list__label">Arrangement:</span>
										John Williams
									</li>
									<li class="music-copyright-summary__field music-copyright-summary__field--incomplete">
										<span class="label-list__label">Record Label:</span>
										Not complete
									</li>
									<li class="music-copyright-summary__field">
										<span class="label-list__label">Duration:</span>
										3:25
									</li>
								</ul>
							</div>
							<div class="music-copyright__actions">
								<button class="icon-button icon-button--more">Collapse Actions</button>
							</div>
						</div>
					</div>
					<div class="music-copyright">
						<div class="music-copyright__content">
							<div class="music-copyright__data">
								<ul class="music-copyright__list label-list">
									<li class="music-copyright-summary__field">
										<span class="label-list__label">Title:</span>
										Value
									</li>
									<li class="music-copyright-summary__field">
										<span class="label-list__label">Artist:</span>
										Value
									</li>
									<li class="music-copyright-summary__field">
										<span class="label-list__label">Arrangement:</span>
										Value
									</li>
									<li class="music-copyright-summary__field music-copyright-summary__field--incomplete">
										<span class="label-list__label">Record Label:</span>
										Incomplete
									</li>
									<li class="music-copyright-summary__field">
										<span class="label-list__label">Duration:</span>
										Value
									</li>
								</ul>
							</div>
							<div class="music-copyright__actions">
								<button class="icon-button icon-button--close">Collapse Actions</button>
							</div>
							<div class="music-copyright__overlay">
								<div class="action-overlay">
									<div class="action-overlay__item">
										<button class="icon-button icon-button--edit icon-button--labeled">Edit
										</button>
									</div>
									<div class="action-overlay__item">
										<button class="icon-button icon-button--delete icon-button--labeled">Remove
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
                <div>
                    <h3>Standalone</h3>
                    <music-item class="music-item--standalone"
                                :music="music_item"
                    ></music-item>
                </div>
			</div>


		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Typography</h2>
			</div>
			<div class="style-guide__section-content">
				<h1>Heading 1</h1>
				<h2>Heading 2</h2>
				<h3>Heading 3</h3>
				<h4>Heading 4</h4>
				<h5>Heading 5</h5>
				<h6>Heading 6</h6>
				<p class="lead">
					Lead paragraph - Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum
					maxime mollitia nisi quis quos rem repellat reprehenderit ullam voluptates? Beatae cupiditate
					doloremque eaque in inventore magni mollitia natus? Aperiam, explicabo?
				</p>
				<p>
					<a href="#" class="download-link">
						U.S. Download Link
					</a>
				</p>
				<p>
					<a href="#" class="standard-link">
						Standard Link
					</a>
				</p>
				<p>
					<a href="#" class="standard-link standard-link--no-underline">
						Standard Link (No Underline)
					</a>
				</p>
				<p>
					<a href="#" class="standard-link standard-link--no-visited">
						Standard Link (No Visited)
					</a>
				</p>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Header</h2>
			</div>
			<div class="style-guide__section-content--bleed">
                <?php include( __DIR__ . '/layouts/partials/header.php' ); ?>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Footer</h2>
			</div>
			<div class="style-guide__section-content">
                <?php include( __DIR__ . '/layouts/partials/footer.php' ); ?>
			</div>
		</section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Page Heading</h2>
            </div>
            <div class="style-guide__section-content">
                <h2>Standard</h2>
                <div style="background-color:#333;padding:3rem;">
                    <div class="page-heading">
                        <h1 class="page-heading__title">Page Title</h1>
                        <p class="page-heading__lead">
                            Page lead
                        </p>
                    </div>
                </div>
            </div>
        </section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Forms</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="form-group">
					<label class="field-label" for="">Text Input</label>
					<input class="form-field" type="text">
					<p class="help-text">With help text</p>
				</div>
				<div class="form-group">
					<label class="field-label" for="">Select Input</label>
					<select class="form-field" name="" id="">
						<option value="">Option 1</option>
						<option value="">Option 2</option>
						<option value="">Option 3</option>
					</select>
				</div>
				<div class="form-group">
					<label class="field-label" for="">Select Input (reduced icon spacing)</label>
					<select class="form-field form-field--reduced-right" name="" id="">
						<option value="">Option 1</option>
						<option value="">Option 2</option>
						<option value="">Option 3</option>
					</select>
				</div>
				<div class="form-group">
					<label class="field-label" for="">Search Input</label>
					<input class="form-field form-field--search">
				</div>
                <div class="form-group">
                    <label class="field-label" for="example-extended-date">Extended Date Input</label>
                    <date-input-extended id="example-extended-date" class="form-field"></date-input-extended>
                </div>
                <div class="form-group">
                    <label class="field-label" for="">Search Input (reduced icon spacing)</label>
                    <input class="form-field form-field--search form-field--reduced-right">
                </div>
				<div class="form-group">
					<label class="field-label" for="">Unrestricted AutoSuggest</label>
					<auto-suggest :restricted="false"
								  :options="autosuggest_options"
								  :input_attrs="{class:['form-field'],type:'text'}"></auto-suggest>
				</div>
				<div class="form-group">
					<label class="field-label" for="">Restricted AutoSuggest</label>
					<auto-suggest :restricted="true"
								  :options="autosuggest_options"
								  :input_attrs="{class:['form-field'],type:'text'}"></auto-suggest>
				</div>
				<div class="form-group">
					<label class="field-label" for="primary_email">Form Group With Options</label>
					<input type="text" class="form-field">
					<div class="form-group-options">
						<div class="form-group-options__option">
							<label for="publish_primary_email" class="usfsa-checkbox">
								<input type="checkbox">
								<span class="usfsa-checkbox__text">Publish in directory</span>
							</label>
						</div>
						<div class="form-group-options__option">
							<label for="opt_out_primary_email" class="usfsa-checkbox">
								<input type="checkbox">
								<span class="usfsa-checkbox__text">Opt Out</span>
							</label>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="field-label" for="">Input Style Accordion</label>
					<accordion class="accordion--select">
						<span slot="trigger_text">Toggle Trigger</span>
						<div slot="expand_content" class="">
							this is the expand content
						</div>
					</accordion>
				</div>
				<div class="form-group">
					<label class="field-label" for="">Increment Input</label>
					<!--	include :min="" or :initial="" attributes to configure minimum and starting values -->
					<increment-input inline-template>
						<div class="increment-input">
							<div class="increment-input__block">
								<button class="button increment-input__remove" v-on:click.prevent="decrement" :disabled="value<=min" type="button">
									-
								</button>
							</div>
							<div class="increment-input__block">
								<input v-number-input class="form-field" type="text" v-bind="attrs" v-model="value">
							</div>
							<div class="increment-input__block">
								<button class="button increment-input__add" v-on:click.prevent="increment" type="button">
									+
								</button>
							</div>
						</div>
					</increment-input>
				</div>
				<div class="form-group">
					<label class="field-label" for="">Increment Input --Small</label>
					<!--	include :min="" or :initial="" attributes to configure minimum and starting values -->
					<increment-input inline-template>
						<div class="increment-input increment-input--small">
							<div class="increment-input__block">
								<button class="button increment-input__remove" v-on:click.prevent="decrement" :disabled="value<=min" type="button">
									-
								</button>
							</div>
							<div class="increment-input__block">
								<input v-number-input class="form-field" type="text" v-bind="attrs" v-model="value">
							</div>
							<div class="increment-input__block">
								<button class="button increment-input__add" v-on:click.prevent="increment" type="button">
									+
								</button>
							</div>
						</div>
					</increment-input>
				</div>
				<div class="form-group">
					<label class="field-label" for="">Visa Input</label>
					<input type="tel" id="card_number" class="form-field form-field--card card-input card-input--visa">
				</div>
				<div class="form-group">
					<label class="field-label" for="">Amex Input</label>
					<input type="tel" id="card_number" class="form-field form-field--card card-input card-input--american-express">
				</div>
				<div class="form-group">
					<label class="field-label" for="">Mastercard Input</label>
					<input type="tel" id="card_number" class="form-field form-field--card card-input card-input--mastercard">
				</div>
				<div class="form-group">
					<label class="field-label" for="">Discover Input</label>
					<input type="tel" id="card_number" class="form-field form-field--card card-input card-input--discover">
				</div>

                <div class="form-row">
                    <div class="form-column">
                        <div class="form-group">
                            <label class="field-label" for="">Form Row Input</label>
                            <input class="form-field" type="text">
                            <p class="help-text">With help text</p>
                        </div>
                    </div>
                    <div class="form-column">
                        <div class="form-group">
                            <label class="field-label" for="">Form Row Input</label>
                            <input class="form-field" type="text">
                            <p class="help-text">With help text</p>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-row form-row--range">
                        <div class="form-column">
                            <div class="form-group">
                                <label class="field-label sr-only" for="">Range Input</label>
                                <input class="form-field" type="text">
                            </div>
                        </div>
                        <div class="form-row--range__separator">
                            to
                        </div>
                        <div class="form-column">
                            <div class="form-group">
                                <label class="field-label sr-only" for="">Range Input</label>
                                <input class="form-field" type="text">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-row form-row--range form-row--range--pre-labeled">
                        <div class="form-row--range__pre-label">
                            From
                        </div>
                        <div class="form-column">
                            <div class="form-group">
                                <label class="field-label sr-only"
                                       for="">Range Input
                                </label>
                                <input class="form-field"
                                       type="text">
                            </div>
                        </div>
                        <div class="form-row--range__separator">
                            to
                        </div>
                        <div class="form-column">
                            <div class="form-group">
                                <label class="field-label sr-only"
                                       for="">Range Input
                                </label>
                                <input class="form-field"
                                       type="text">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="checktest" class="usfsa-checkbox">
                        <input type="checkbox" id="checktest">
                        <span class="usfsa-checkbox__text">I have read and understand the above overview of the U.S. Figure Skating online registration process.</span>
                    </label>
                </div>
				<div class="form-group">
					<label for="checktest_invalid" class="usfsa-checkbox usfsa-checkbox--invalid">
						<input type="checkbox" id="checktest_invalid">
						<span class="usfsa-checkbox__text">Invalid checkbox.</span>
					</label>
				</div>
                <div class="form-group">
                    <label for="checktest" class="usfsa-checkbox usfsa-checkbox--required">
                        <input type="checkbox" id="checktest">
                        <span class="usfsa-checkbox__text">Required Checkbox.</span>
                    </label>
                </div>
                <div class="form-group">
                    <label for="checktestasdf" class="usfsa-status-checkbox">
                        <input type="checkbox" id="checktestasdf">
                        <span class="usfsa-status-checkbox__check">&nbsp;</span>
                    </label>
                    Status Checkbox
                </div>
                <div class="form-group">
                    <label for="checktestasdf" class="usfsa-status-checkbox" disabled>
                        <input type="checkbox" id="checktestasdf" disabled>
                        <span class="usfsa-status-checkbox__check">&nbsp;</span>
                    </label>
                    Disabled Status Checkbox
                </div>
                <div class="form-group">
                    <label for="checktestasdf" class="usfsa-status-checkbox" disabled>
                        <input type="checkbox" id="checktestasdf" checked disabled>
                        <span class="usfsa-status-checkbox__check">&nbsp;</span>
                    </label>
                    Disabled Checked Status Checkbox
                </div>
				<div class="form-group">
					<label for="radiotest" class="usfsa-radio">
						<input type="radio" id="radiotest" name="radiotest" value="true">
						<span class="usfsa-radio__text">North Dallas Club</span>
					</label>
					<label for="radiotest2" class="usfsa-radio">
						<input type="radio" id="radiotest2" name="radiotest" value="false">
						<span class="usfsa-radio__text">Text label</span>
					</label>
				</div>
				<div class="form-group">
					<label for="radiotestx" class="usfsa-radio usfsa-radio--small">
						<input type="radio" id="radiotestx" name="radiotestx" value="true">
						<span class="usfsa-radio__text">North Dallas Club</span>
					</label>
					<label for="radiotest2y" class="usfsa-radio usfsa-radio--small">
						<input type="radio" id="radiotest2y" name="radiotestx" value="false">
						<span class="usfsa-radio__text">Text label</span>
					</label>
				</div>


				<h3>Radio List</h3>
				<div class="form-group">
					<ul class="radio-list">
						<li>
							<label for="radiotest3" class="usfsa-radio">
								<input type="radio" id="radiotest3" name="radiotest" value="true">
								<span class="usfsa-radio__text">North Dallas Club</span>
							</label>
						</li>
						<li>
							<label for="radiotest4" class="usfsa-radio">
								<input type="radio" id="radiotest4" name="radiotest" value="true">
								<span class="usfsa-radio__text">North Dallas Club</span>
							</label>
						</li>
						<li>
							<label for="radiotest5" class="usfsa-radio">
								<input type="radio" id="radiotest5" name="radiotest" value="true">
								<span class="usfsa-radio__text">North Dallas Club</span>
							</label>
						</li>
					</ul>
				</div>
				<div class="form-group">
					<ul class="check-list">
						<li>
							<label for="checktest2" class="usfsa-checkbox">
								<input type="checkbox" id="checktest2">
								<span class="usfsa-checkbox__text">I have read and understand the above overview of the U.S. Figure Skating online registration process.</span>
							</label>
						</li>
						<li>
							<label for="checktest3" class="usfsa-checkbox">
								<input type="checkbox" id="checktest3">
								<span class="usfsa-checkbox__text">I have read and understand the above overview of the U.S. Figure Skating online registration process.</span>
							</label>
						</li>
						<li>
							<label for="checktest4" class="usfsa-checkbox">
								<input type="checkbox" id="checktest4">
								<span class="usfsa-checkbox__text">I have read and understand the above overview of the U.S. Figure Skating online registration process.</span>
							</label>
						</li>
					</ul>
                    <ul class="check-list check-list--extended">
                        <li>
                            <label for="checktest2" class="usfsa-checkbox">
                                <input type="checkbox" id="checktestalt2">
                                <span class="usfsa-checkbox__text">--extended variant.</span>
                            </label>
                        </li>
                        <li>
                            <label for="checktest3" class="usfsa-checkbox">
                                <input type="checkbox" id="checktestalt3">
                                <span class="usfsa-checkbox__text">I have read and understand the above overview of the U.S. Figure Skating online registration process.</span>
                            </label>
                        </li>
                        <li>
                            <label for="checktest4" class="usfsa-checkbox">
                                <input type="checkbox" id="checktestalt4">
                                <span class="usfsa-checkbox__text">I have read and understand the above overview of the U.S. Figure Skating online registration process.</span>
                            </label>
                        </li>
                    </ul>
				</div>
                <div class="form-group">
                    <h3>[Component] Parented Checkbox Group</h3>
                    <parented-checkbox-group :options="[
                        {
                            label:'Label 1',
                            value:'value1'
                        },
                        {
                            label:'Label 2',
                            value:'value2'
                        },
                        {
                            label:'Label 3',
                            value:'value3'
                        }
                    ]">
                    </parented-checkbox-group>
                    <h3>[Component] Parented Checkbox Group
                        <small>With Configured All Suffix</small>
                    </h3>
                    <parented-checkbox-group all_suffix="Options" :options="[
                        {
                            label:'Label 1',
                            value:'value1'
                        },
                        {
                            label:'Label 2',
                            value:'value2'
                        },
                        {
                            label:'Label 3',
                            value:'value3'
                        }
                    ]">
                    </parented-checkbox-group>
                    <h3>[Component] Parented Checkbox Group
                        <small>--small variant</small>
                    </h3>
                    <parented-checkbox-group class="parented-checkbox-group--small" :options="[
                        {
                            label:'Label 1',
                            value:'value1'
                        },
                        {
                            label:'Label 2',
                            value:'value2'
                        },
                        {
                            label:'Label 3',
                            value:'value3'
                        }
                    ]">
                </div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Input States</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="form-group">
					<label class="field-label" for="">With Focus</label>
					<input class="form-field has-focus" value="Text in input..." type="text">
				</div>
				<div class="form-group">
					<label class="field-label" for="">With Success</label>
					<input class="form-field has-success" value="Text in input..." type="text">
				</div>
				<div class="form-group">
					<label class="field-label" for="">With Error</label>
					<input class="form-field has-error" value="Text in input..." type="text">
					<p class="input-error">*Field error message</p>
				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Buttons</h2>
			</div>
			<div class="style-guide__section-content">
				<h3>Button Types</h3>
				<a href="#" class="button">Inline Button</a>
				<a href="#" class="button button--block">Block Button</a>
				<h3>Button Sizes</h3>
				<button type="button" class="button">Standard Button</button>
				<button type="button" class="button button--large">Large Button</button>
				<button type="button" class="button button--medium">Medium Button</button>
                <button type="button" class="button button--small">Small Button</button>
				<h3>Button Variants</h3>
				<button type="button" class="button">Standard Button</button>
				<button type="button" class="button button--info">Info Button</button>
				<button type="button" class="button button--action">Action Button</button>
                <button type="button" class="button button--action-ghosted">Ghost Action Button</button>
				<button type="button" class="button button--muted">Muted Button</button>
				<h3>Disabled State</h3>
				<button type="button" disabled="disabled" class="button">Standard Button</button>
				<button type="button" disabled="disabled" class="button button--info">Info Button</button>
				<button type="button" disabled="disabled" class="button button--action">Action Button</button>
                <button type="button" disabled="disabled" class="button button--action-ghosted">Ghost Action Button</button>
				<button type="button" disabled="disabled" class="button button--muted">Muted Button</button>
				<h3>Labeled Action Button</h3>
                <div>
                    <button class="labeled-action-button labeled-action-button--add">
                        Add Skaters
                    </button>
                </div>
                <div>
                    <button class="labeled-action-button labeled-action-button--edit">
                        Edit Skaters
                    </button>
                </div>
                <h3>Icon Buttons</h3>
				<div>
					<button class="icon-button icon-button--edit icon-button--lg">
						<span class="sr-only">Edit Icon Button</span>
					</button>
					<p>icon-button.icon-button--edit.icon-button--lg
						<br>
						icon size 19x19
					</p>
				</div>
				<div>
					<button class="icon-button icon-button--edit">
						<span class="sr-only">Edit Icon Button</span>
					</button>
					<p>icon-button.icon-button--edit
						<br>
						icon size 15x15
					</p>
				</div>
				<div>
					<button class="icon-button icon-button--edit icon-button--md">
						<span class="sr-only">Edit Icon Button</span>
					</button>
					<p>icon-button.icon-button--edit.icon-button--md
						<br>
						icon size 12x12
					</p>
				</div>
				<div>
					<button class="icon-button icon-button--edit icon-button--labeled">Edit
					</button>
					<p>icon-button.icon-button--edit.icon-button--labeled
					</p>
				</div>
				<div>
					<button class="icon-button icon-button--delete icon-button--labeled-inline">Remove
					</button>
					<p>icon-button.icon-button--delete.icon-button--labeled-inline
					</p>
				</div>
                <div>
                    <button class="icon-button icon-button--delete">&nbsp;
                    </button>
                    <p>icon-button.icon-button--delete
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--sm icon-button--delete">&nbsp;
                    </button>
                    <p>icon-button.icon-button--delete.icon-button--sm
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--md icon-button--delete">&nbsp;
                    </button>
                    <p>icon-button.icon-button--delete.icon-button--md
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--add">&nbsp;
                    </button>
                    <p>icon-button.icon-button--add
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--lg icon-button--add">&nbsp;
                    </button>
                    <p>icon-button.icon-button--add.icon-button--lg
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--info">&nbsp;
                    </button>
                    <p>
                        icon-button.icon-button--info
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--info icon-button--info--red">&nbsp;
                    </button>
                    <p>
                        icon-button.icon-button--info.icon-button--info--red
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--plus">&nbsp;
                    </button>
                    <p>
                        icon-button.icon-button--plus
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--minus">&nbsp;
                    </button>
                    <p>
                        icon-button.icon-button--minus
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--down">&nbsp;
                    </button>
                    <p>
                        icon-button.icon-button--down
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--up">&nbsp;
                    </button>
                    <p>
                        icon-button.icon-button--up
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--sm icon-button--down">&nbsp;
                    </button>
                    <p>
                        icon-button.icon-button--sm.icon-button--down
                    </p>
                </div>
                <div>
                    <button class="icon-button icon-button--sm icon-button--up">&nbsp;
                    </button>
                    <p>
                        icon-button.icon-button--sm.icon-button--up
                    </p>
                </div>
                <h3>Filter Button</h3>
                <div>
                    <a href="#"
                       class="filter-button">Filters (3)</a>
                </div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Icon Link</h2>
			</div>
			<div class="style-guide__section-content">
				<p>
					<a href="#" class="icon-link">Plain</a>
				</p>
				<p>
					<a href="#" class="icon-link icon-link--profile">Create New Account (icon-link icon-link--profile)</a>
				</p>
				<p>
					<a href="#" class="icon-link icon-link--document">EMS: Competition Setup (icon-link icon-link--document)</a>
				</p>
				<p>
					<a href="#" class="icon-link icon-link--back">Help &amp; Resources (icon-link icon-link--document)</a>
				</p>
				<p>
					<button class="icon-link icon-link--back">Help &amp; Resources (icon-link icon-link--document)</button>
				</p>
                <p>
                    <a href="#" class="icon-link icon-link--search">Search (icon-link icon-link--search)</a>
                </p>
                <p>
                    <a style="font-size:1.2rem" href="#" class="icon-link icon-link--external">PRINT SCHEDULE</a>
                </p>
                <p>
                    <a style="font-size:1.2rem" href="#" class="icon-link icon-link--download">Announcement</a>
                </p>
                <p>
                    <a href="#" class="icon-link icon-link--lg icon-link--download">Check-In Report</a>
                </p>
                <p>
                    <a style="font-size:1.2rem" href="#" class="icon-link icon-link--email">Email</a>
                </p>
                <p>
                    <a  href="#" class="icon-link icon-link--lg icon-link--email">Email</a>
                </p>
                <p>
                    <a style="font-size:1.4rem" href="#" class="icon-link icon-link--attachment">Attach File</a>
                </p>
                <p>
                    <a  href="#" class="icon-link icon-link--edit">Edit</a>
                </p>
			</div>
		</section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Add Link</h2>
            </div>
            <div class="style-guide__section-content">
                <h3>Link Versions</h3>
                <div style="padding-left:3rem;">
                    <p>
                        <a href="#" class="add-link">Add Link</a>
                    </p>
                    <p>
                        <a href="#" class="add-link add-link--reverse">Reverse</a>
                    </p>
                    <p>
                        <a href="#" class="add-link add-link--muted">Muted</a>
                    </p>
                    <p>
                        <a href="#" class="add-link add-link--sm">Add Contact</a>
                    </p>
                </div>
                <hr>
                <h3>Button Versions</h3>
                <div style="padding-left:3rem;">
                    <p>
                        <button class="add-link">Add Button</button>
                    </p>
                    <p>
                        <button class="add-link add-link--reverse">Reverse</button>
                    </p>
                    <p>
                        <button class="add-link add-link--muted">Muted</button>
                    </p>
                    <p>
                        <button class="add-link add-link--sm">Add Contact</button>
                    </p>
                </div>
            </div>
        </section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Tabs</h2>
			</div>
			<div class="style-guide__section-content">
				<tabs>
					<tab name="Tab Name 1" :selected="true">
						tab content 1
					</tab>
					<tab name="Tab Name 2">
						tab content 2
					</tab>
				</tabs>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Tabs - Reduced</h2>
			</div>
			<div class="style-guide__section-content">
				<tabs class="tabs--reduced">
					<tab name="Tab Name 1" :selected="true">
						tab content 1
					</tab>
					<tab name="Tab Name 2">
						tab content 2
					</tab>
				</tabs>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Tabs - Justified</h2>
			</div>
			<div class="style-guide__section-content">
				<tabs class="tabs--justified">
					<tab name="Tab Name 1" :selected="true">
						tab content 1
					</tab>
					<tab name="Tab Name 2">
						tab content 2
					</tab>
				</tabs>
			</div>
		</section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Toggle</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="toggle">
					<input type="checkbox" id="check" class="toggle__input">
					<label for="check" class="toggle__user-input"></label>
				</div>

                <div>
                    <div class="toggle toggle--sm">
                        <input type="checkbox" id="toggle-sm-input" class="toggle__input">
                        <label for="toggle-sm-input" class="toggle__user-input"></label>
                    </div>
                </div>

                <div>
                    <div class="labeled-toggle">
                        <span class="labeled-toggle__label">
                            Show more/less things
                        </span>
                        <div class="labeled-toggle__toggle toggle" >
                            <input type="checkbox" id="reorder-toggle"  class="toggle__input">
                            <label for="reorder-toggle" class="toggle__user-input"></label>
                        </div>
                    </div>
                </div>

				<div class="toggle toggle--block">
					<input type="checkbox" id="check2" class="toggle__input">
					<label for="check2" class="toggle__user-input"></label>
				</div>

				<div class="toggle toggle--block">
					<input type="checkbox" id="check3" disabled class="toggle__input">
					<label for="check3" class="toggle__user-input"></label>
				</div>
			</div>
		</section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Accordion</h2>
			</div>
			<div class="style-guide__section-content">
				<accordion>
					<span slot="trigger_text">Trigger Text</span>
					<div slot="expand_content">
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur beatae cupiditate
							dolorum error harum libero nihil optio velit! Ab esse hic iure molestias quo ut? Dolore
							labore laboriosam quas temporibus?
						</p>
					</div>
				</accordion>

                <accordion class="accordion--info accordion--info--large">
                    <span slot="trigger_text">Juvenile Combined Dance</span>
                    <div slot="expand_content">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur beatae cupiditate
                            dolorum error harum libero nihil optio velit! Ab esse hic iure molestias quo ut? Dolore
                            labore laboriosam quas temporibus?
                        </p>
                    </div>
                </accordion>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Status Accordions</h2>
			</div>
			<div class="style-guide__section-content">
				<accordion>
					<span slot="trigger_text" class="accordion-status-trigger accordion-status-trigger--yes">Status Accordion</span>
					<div slot="expand_content">
						<div class="waiver-accordion-content">
							content
						</div>
					</div>
				</accordion>
				<accordion>
					<span slot="trigger_text" class="accordion-status-trigger accordion-status-trigger--no">Status Accordion</span>
					<div slot="expand_content">
						<div class="waiver-accordion-content">
							content
						</div>
					</div>
				</accordion>
                <accordion class="accordion--larger-trigger">
                    <span slot="trigger_text" class="accordion-status-trigger accordion-status-trigger--yes">Status Accordion Larger Trigger</span>
                    <div slot="expand_content">
                        content
                    </div>
                </accordion>
                <accordion class="accordion--larger-trigger">
                    <span slot="trigger_text" class="accordion-status-trigger accordion-status-trigger--no">Status Accordion Larger Trigger</span>
                    <div slot="expand_content">
                        content
                    </div>
                </accordion>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Accordion Group</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="accordion-group">
					<accordion>
						<span slot="trigger_text">2018 Midwestern Adult Sectional Figure Skating Championship</span>
						<div slot="expand_content">
							<p>accordion content</p>
						</div>
					</accordion>
					<accordion>
						<span slot="trigger_text">2018 U.S. Adult Figure Skating Championship</span>
						<div slot="expand_content">
							<p>accordion content</p>
						</div>
					</accordion>
					<accordion>
						<span slot="trigger_text">Madison Open</span>
						<div slot="expand_content">
							<ul class="nav-list nav-list--small">
								<li>
									<a href="/pages/my-schedule">My Schedule</a>
								</li>
								<li>
									<a href="/pages/practice-ice-schedule">Practice Ice / Schedule</a>
								</li>
								<li>
									<a href="#">Competition Information</a>
								</li>
							</ul>
						</div>
					</accordion>
				</div>
			</div>
		</section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Card</h2>
            </div>
            <div class="style-guide__section-content" style="background-color:#333;padding-top:3rem; padding-bottom:3rem;">
                <div class="card">
                    <div class="card__content">
                        <h3 class="card__heading">
                            Card Heading
                        </h3>
                        <div class="card__section">
                            <p class="card__text">
                                Card text content
                            </p>
                            <ul class="card__list">
                                <li>Card list</li>
                                <li>Item</li>
                            </ul>
                        </div>
                        <div class="card__section">
                            <p class="card__text">
                               Second card section creates border and inter-section padding
                            </p>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card__content">
                        <div class="card__section">
                            <p class="card__text">
                                Cards don't need headings.  Second card in group creates inter-card spacing
                            </p>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card__content">
                        <div class="card__section">
                            <p class="card__text">
                                Cards have flexible content orders
                            </p>
                        </div>
                        <div class="card__section">
                            <h3 class="card__heading">
                                Card Heading
                            </h3>
                            <p class="card__text">
                               Card headings can be included on subsequent sections
                            </p>
                        </div>
                    </div>
                </div>
                <div class="card card--equal">
                   <div class="card__content card__content--equal">
                       <h3 class="card__title">
                            Card with Equal Content
                       </h3>
                       equal padding on all sides of content block
                   </div>
                </div>
                <div class="card">
                    <div class="card__banners">
                        <div class="competition-tile-banner competition-tile-banner--registered" v-if="true || isRegistered(competition)">
                            Registered
                        </div>
                    </div>
                    <div class="card__content card__content--equal">
                        <h3 class="card__title">
                            For Skaters
                        </h3>
                        <div class="competition-registration-cta">
                            <div class="competition-registration-cta__cta">
                                <button class="button button--block button--info">
                                    Add Event
                                </button>
                            </div>
                            <p class="competition-registration-cta__deadline">
                                Registration deadline: 04/16, 3:00 AM ET
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Accordion Group --No Bottom Border</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="accordion-group accordion-group--no-bottom">
					<accordion>
						<span slot="trigger_text">2018 Midwestern Adult Sectional Figure Skating Championship</span>
						<div slot="expand_content">
							<p>accordion content</p>
						</div>
					</accordion>
					<accordion>
						<span slot="trigger_text">2018 U.S. Adult Figure Skating Championship</span>
						<div slot="expand_content">
							<p>accordion content</p>
						</div>
					</accordion>
					<accordion>
						<span slot="trigger_text">Madison Open</span>
						<div slot="expand_content">
							<ul class="nav-list nav-list--small">
								<li>
									<a href="/pages/my-schedule">My Schedule</a>
								</li>
								<li>
									<a href="/pages/practice-ice-schedule">Practice Ice / Schedule</a>
								</li>
								<li>
									<a href="#">Competition Information</a>
								</li>
							</ul>
						</div>
					</accordion>
				</div>
			</div>
		</section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Accordion Group --Data Triggers</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="accordion-group accordion-group--up-down">
                    <accordion class="accordion--data">
                    <span class="accordion-data-trigger" slot="trigger_text">
                        <span class="accordion-data-trigger__name">Competition Information</span>
                        <span class="accordion-data-trigger__data">
                            <span class="accordion-data-trigger__datum">Registered:140</span>
                            <span class="accordion-data-trigger__data__divider">|</span>
                            <span class="accordion-data-trigger__datum">Entries: 325</span>
                        </span>
                    </span>
                        <div slot="expand_content">
                            <span>accordion content</span>
                        </div>
                    </accordion>
                    <accordion class="accordion--data">
                    <span class="accordion-data-trigger" slot="trigger_text">
                        <span class="accordion-data-trigger__name">Registration</span>
                        <span class="accordion-data-trigger__data">
                            <span class="accordion-data-trigger__datum accordion-data-trigger__datum--error">Closed</span>
                        </span>
                    </span>
                        <div slot="expand_content">
                            <span>accordion content</span>
                        </div>
                    </accordion>
                    <accordion class="accordion--data">
                    <span class="accordion-data-trigger" slot="trigger_text">
                        <span class="accordion-data-trigger__name">Deadlines</span>
                        <span class="accordion-data-trigger__data accordion-data-trigger__data--small">
                            <span class="accordion-data-trigger__datum accordion-data-trigger__datum--success">Music: 2 days</span>
                            <span class="accordion-data-trigger__data__divider">|</span>
                            <span class="accordion-data-trigger__datum accordion-data-trigger__datum--success">PPC: 3 days</span>
                            <span class="accordion-data-trigger__data__divider">|</span>
                            <span class="accordion-data-trigger__datum accordion-data-trigger__datum--error">Roster: 12 hours</span>
                        </span>
                    </span>
                        <div slot="expand_content">
                            <span>accordion content</span>
                        </div>
                    </accordion>
                    <accordion class="accordion--data">
                    <span class="accordion-data-trigger" slot="trigger_text">
                        <span class="accordion-data-trigger__name">Practice Ice</span>
                        <span class="accordion-data-trigger__data">
                            <span class="accordion-data-trigger__datum accordion-data-trigger__datum--warning">Upcoming - Open Sales</span>
                        </span>
                    </span>
                        <div slot="expand_content">
                            <span>accordion content</span>
                        </div>
                    </accordion>
                    <accordion class="accordion--data">
                    <span class="accordion-data-trigger" slot="trigger_text">
                        <span class="accordion-data-trigger__name">Volunteer Timeline</span>
                    </span>
                        <div slot="expand_content">
                            <span>accordion content</span>
                        </div>
                    </accordion>
                </div>
            </div>
        </section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Accordion Group --Up-down icons</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="accordion-group accordion-group--up-down">
					<accordion>
						<span slot="trigger_text">2018 Midwestern Adult Sectional Figure Skating Championship</span>
						<div slot="expand_content">
							<p>accordion content</p>
						</div>
					</accordion>
					<accordion>
						<span slot="trigger_text">2018 U.S. Adult Figure Skating Championship</span>
						<div slot="expand_content">
							<p>accordion content</p>
						</div>
					</accordion>
					<accordion>
						<span slot="trigger_text">Madison Open</span>
						<div slot="expand_content">
							<ul class="nav-list nav-list--small">
								<li>
									<a href="/pages/my-schedule">My Schedule</a>
								</li>
								<li>
									<a href="/pages/practice-ice-schedule">Practice Ice / Schedule</a>
								</li>
								<li>
									<a href="#">Competition Information</a>
								</li>
							</ul>
						</div>
					</accordion>
				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Panel Link</h2>
			</div>
			<div class="style-guide__section-content">
				<a href="#" class="panel-link">
					<div class="panel-link__content">
						<div class="panel-link__icon">
							<img src="/images/EMS_tile.png" alt="">
						</div>
						<div class="panel-link__text">
							Event Management System
						</div>
					</div>
				</a>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Panel Link - Competition</h2>
			</div>
			<div class="style-guide__section-content">
				<a href="#" class="panel-link">
					<div class="panel-link__content">
						<div class="competition-summary">
							<div class="competition-summary__icon">
								<img src="http://placehold.it/70x50&text=EMS" alt="">
							</div>
							<div class="competition-summary__details">
								<p class="competition-summary__details-primary">Madison Open</p>
								<p class="competition-summary__details-secondary">
									Dates: 5/11/2018 - 5/14/2018
								</p>
							</div>
						</div>
					</div>
				</a>
			</div>
		</section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Panel Link - Competition Management Competition</h2>
            </div>
            <div class="style-guide__section-content">
                <a href="#" class="panel-link">
                    <div class="panel-link__content">
                        <div class="competition-management-competition-summary">
                            <div class="competition-management-competition-summary__column--icon">
                                <div class="competition-management-competition-summary__icon">
                                    <img src="/images/2018-MW-Adult.png" alt="Icon for 2018 Test Competition">
                                </div>
                            </div>
                            <div class="competition-management-competition-summary__column--data">
                                <p class="competition-management-competition-summary__competition-name">2018 Test
                                    Competition
                                </p>
                                <p class="competition-management-competition-summary__datum">New York, NY</p>
                                <p class="competition-management-competition-summary__datum">Dates: 9/20/2019 -
                                    9/22/2019
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Panel Link Group</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="panel-link-group">
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/EMS_tile.png" srcset="/images/EMS_tile@2x.png 2x" alt="Event Management System Icon">
							</div>
							<div class="panel-link__text">
								Event Management System
							</div>
						</div>
					</a>
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/Learn_tile.png" srcset="/images/Learn_tile@2x.png 2x" alt="Learn to Skate USA Icon">
							</div>
							<div class="panel-link__text">
								Learn to Skate USA
							</div>
						</div>
					</a>
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/Safesport_tile.png" srcset="/images/Safesport_tile@2x.png 2x" alt="US Figure Skating Safesport Icon">
							</div>
							<div class="panel-link__text">
								US Figure Skating Safesport
							</div>
						</div>
					</a>
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/Getup_tile.png" srcset="/images/Getup_tile@2x.png 2x" alt="Get Up US Figure Skating Icon">
							</div>
							<div class="panel-link__text">
								Get Up US Figure Skating
							</div>
						</div>
					</a>
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/Skating_tile.png" srcset="/images/Skating_tile@2x.png 2x" alt="Skating Magazine Archives Icon">
							</div>
							<div class="panel-link__text">
								Skating Magazine Archives
							</div>
						</div>
					</a>
				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Panel Link Group -- No Bottom Border</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="panel-link-group panel-link-group--no-bottom">
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/EMS_tile.png" srcset="/images/EMS_tile@2x.png 2x" alt="Event Management System Icon">
							</div>
							<div class="panel-link__text">
								Event Management System
							</div>
						</div>
					</a>
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/Learn_tile.png" srcset="/images/Learn_tile@2x.png 2x" alt="Learn to Skate USA Icon">
							</div>
							<div class="panel-link__text">
								Learn to Skate USA
							</div>
						</div>
					</a>
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/Safesport_tile.png" srcset="/images/Safesport_tile@2x.png 2x" alt="US Figure Skating Safesport Icon">
							</div>
							<div class="panel-link__text">
								US Figure Skating Safesport
							</div>
						</div>
					</a>
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/Getup_tile.png" srcset="/images/Getup_tile@2x.png 2x" alt="Get Up US Figure Skating Icon">
							</div>
							<div class="panel-link__text">
								Get Up US Figure Skating
							</div>
						</div>
					</a>
					<a href="#" class="panel-link" target="_blank" rel="noopener">
						<div class="panel-link__content">
							<div class="panel-link__icon">
								<img src="/images/Skating_tile.png" srcset="/images/Skating_tile@2x.png 2x" alt="Skating Magazine Archives Icon">
							</div>
							<div class="panel-link__text">
								Skating Magazine Archives
							</div>
						</div>
					</a>
				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Panel Link - Simple</h2>
			</div>
			<div class="style-guide__section-content">
				<a href="#" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							This is the simple version
						</div>
					</div>
				</a>
			</div>
		</section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Panel Link - Status</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="panel-link-group">
                    <a href="#" class="panel-link panel-link--status">
                        <div class="panel-link__content">
                            <div class="panel-link__status">
                                <i class="inline-icon icon-status-primary-success"></i>
                            </div>
                            <div class="panel-link__text">
                                Events
                            </div>
                        </div>
                    </a>
                    <a href="#" class="panel-link panel-link--status">
                        <div class="panel-link__content">
                            <div class="panel-link__status">
                                <i class="inline-icon icon-status-primary-error"></i>
                            </div>
                            <div class="panel-link__text">
                                Events
                            </div>
                        </div>
                    </a>
                    <a href="#" class="panel-link panel-link--status">
                        <div class="panel-link__content">
                            <div class="panel-link__status">
                                <div class="count-badge">
                                    <div class="count-badge__content">
                                        15
                                    </div>
                                </div>
                            </div>
                            <div class="panel-link__text">
                                Roster
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Competition Detail</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="competition-summary">
					<div class="competition-summary__icon">
						<img src="http://placehold.it/80x60&text=EMS" alt="">
					</div>
					<div class="competition-summary__details">
						<p class="competition-summary__details-primary">Madison Open</p>
						<p class="competition-summary__details-secondary">
							Dates: 5/11/2018 - 5/14/2018
						</p>
					</div>
				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Navbar</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="navbar">
					<a class="navbar__brand" href="/Members/MemberHome">
						<img class="navbar__logo" src="/images/USFSA_LOGO.png" srcset="/images/USFSA_LOGO@2x.png 2x,/images/USFSA_LOGO@3x.png 3x " alt="US Figure Skating Logo"/>
					</a>
					<button type="button" class="nav-toggle" onclick="this.classList.contains('active')?this.classList.remove('active'):this.classList.add('active')">
						<span class="nav-toggle__line nav-toggle__line--top"></span>
						<span class="nav-toggle__line nav-toggle__line--middle"></span>
						<span class="nav-toggle__line nav-toggle__line--bottom"></span>
					</button>
				</div>
			</div>
		</section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Nav List</h2>
			</div>
			<div class="style-guide__section-content">
				<ul class="nav-list">
					<li>
						<a href="/Members/MemberHome">Members Only Home</a>
					</li>
					<li>
						<a href="/pages/my-competitions">My Competitions</a>
					</li>
					<li>
						<a href="">Support</a>
					</li>
					<li>
						<a href="/">Sign Out</a>
					</li>
				</ul>
			</div>
		</section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Nav List --Small</h2>
			</div>
			<div class="style-guide__section-content">
				<ul class="nav-list nav-list--small">
					<li>
						<a href="/pages/my-schedule">My Schedule</a>
					</li>
					<li>
						<a href="/pages/practice-ice-schedule">Practice Ice / Schedule</a>
					</li>
					<li>
						<a href="#">Competition Information</a>
					</li>
				</ul>
			</div>
		</section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Site Menu</h2>
			</div>
			<div class="site-menu">
				<div class="site-menu__content">
					<div class="site-menu__tabs">
						<tabs>
							<tab name="Main Menu" :selected="true">
								<ul class="site-menu__links nav-list">
									<li>
										<a href="/Members/MemberHome">Members Only Home</a>
									</li>
									<li>
										<a href="/pages/my-competitions">My Competitions</a>
									</li>
									<li>
										<a href="">Support</a>
									</li>
									<li>
										<a href="/">Sign Out</a>
									</li>
								</ul>
							</tab>
							<tab name="Competitions">
								<div class="site-menu__competitions">
									<div class="accordion-group">
										<accordion>
											<span slot="trigger_text">2018 Midwestern Adult Sectional Figure Skating Championship</span>
											<div slot="expand_content">
												<ul class="nav-list nav-list--small">
													<li>
														<a href="#">My Schedule</a>
													</li>
													<li>
														<a href="#">Practice Ice / Schedule</a>
													</li>
													<li>
														<a href="#">Competition Information</a>
													</li>
												</ul>
											</div>
										</accordion>
										<accordion>
											<span slot="trigger_text">2018 U.S. Adult Figure Skating Championship</span>
											<div slot="expand_content">
												<ul class="nav-list nav-list--small">
													<li>
														<a href="#">My Schedule</a>
													</li>
													<li>
														<a href="#">Practice Ice / Schedule</a>
													</li>
													<li>
														<a href="#">Competition Information</a>
													</li>
												</ul>
											</div>
										</accordion>
										<accordion>
											<span slot="trigger_text">Madison Open</span>
											<div slot="expand_content">
												<ul class="nav-list nav-list--small">
													<li>
														<a href="#">My Schedule</a>
													</li>
													<li>
														<a href="#">Practice Ice / Schedule</a>
													</li>
													<li>
														<a href="#">Competition Information</a>
													</li>
												</ul>
											</div>
										</accordion>
									</div>
								</div>
							</tab>
						</tabs>
					</div>
					<div class="site-menu__footer">
                        <?php include( __DIR__ . '/layouts/partials/footer.php' ); ?>
					</div>
				</div>
			</div>
		</section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Data Table</h2>
            </div>
            <div class="style-guide__section-content">
                <table class="data-table">
                    <tr>
                        <td class="data-table__label">Name:</td>
                        <td class="data-table__value">Aaron Matthews</td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Birthday:</td>
                        <td class="data-table__value">9/12/1983</td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Gender:</td>
                        <td class="data-table__value">Female</td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Country:</td>
                        <td class="data-table__value">Venezuela</td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Address:</td>
                        <td class="data-table__value">7866 S Jackson Ctr<br>Centennial, CO 80122</td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Cell Phone:</td>
                        <td class="data-table__value">555-555-5555</td>
                    </tr>
                    <tr>
                        <td class="data-table__label">Email:</td>
                        <td class="data-table__value">First_last@email.com</td>
                    </tr>
                </table>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Pricing Group/Deadline Group</h2>
            </div>
            <div class="style-guide__section-content" >

                <div class="pricing-group">
                    <p class="pricing-group__name">
                        Discipline: Intermediate Ladies
                    </p>
                    <ul class="pricing-group__list">
                        <li>
                            <span>OPI $35</span>
                        </li>
                        <li>
                            <span>UPI $30</span>
                        </li>
                    </ul>
                </div>
                <div class="competition-date">
                    <p class="competition-date__name">
                        Registration Open:
                    </p>
                    <p class="competition-date__value">
                        09/15/2020 07:00 PM EST
                    </p>
                </div>
                <div class="competition-date">
                    <p class="competition-date__name">
                       Music Deadline:
                    </p>
                    <p class="competition-date__value">
                        09/15/2020 07:00 PM EST
                    </p>
                    <p class="competition-date__fee">
                        Music Late Fee: <span class="competition-date__fee__value">$10</span>
                    </p>
                </div>
            </div>
        </section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Session</h2>
			</div>
			<div class="style-guide__section-content" style="background-color:#333;padding-top:3rem; padding-bottom:3rem;">
				<div :key="index" v-for="(session,index) in individual_sessions">
					<standard-session style="background-color:white" :session="session" :class="{'session--scheduled':session.scheduled,'session--in-cart':session.in_cart}"></standard-session>
					<hr>
				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Session Feedback</h2>
			</div>
			<div class="style-guide__section-content">
				<h3>Isolated</h3>
				<div class="session-feedback session-feedback--success">
					<div class="session-feedback__content">
						<div class="session-feedback__text">
							Added to Schedule
						</div>
					</div>
				</div>
				<hr>
				<div class="session-feedback session-feedback--error">
					<div class="session-feedback__content">
						<div class="session-feedback__text">
							You cannot schedule this
							session type. Please purchase
							WU credit.
						</div>
					</div>
				</div>
				<hr>
				<div class="session-feedback session-feedback--error session-feedback--small">
					<div class="session-feedback__content">
						<div class="session-feedback__text">
							Small Variant
						</div>
					</div>
				</div>
				<hr>

				<div class="session-feedback session-feedback--error session-feedback--input">
					<div class="session-feedback__content">
						<div class="session-feedback__text">
							Error State
						</div>
						<div class="session-feedback-inputs">
							<a href="#" class="session-feedback-inputs__input">
								<span>Adult Gold Dramatic Entertainment</span>
							</a>
							<a href="#" class="session-feedback-inputs__input">
								<span>Senior Ladies Combined</span>
							</a>
							<a href="#" class="session-feedback-inputs__input">
								<span>Adult Gold Dramatic Entertainment</span>
							</a>
							<a href="#" class="session-feedback-inputs__input">
								<span>Senior Ladies Combined</span>
							</a>
							<a href="#" class="session-feedback-inputs__input">
								<span>Senior Ladies Combined</span>
							</a>
						</div>
					</div>
				</div>
				<h3>With Sessions</h3>
				<div class="session-list">
					<standard-session :session="individual_sessions[0]">
						<div class="session-feedback session-feedback--error">
							<div class="session-feedback__content">
								<div class="session-feedback__text">
									You cannot schedule this
									session type. Please purchase
									WU credit.
								</div>
							</div>
						</div>
					</standard-session>
					<standard-session :session="individual_sessions[1]">
						<div class="session-feedback session-feedback--success">
							<div class="session-feedback__content">
								<div class="session-feedback__text">
									Added to Schedule
								</div>
							</div>
						</div>
					</standard-session>
					<standard-session :session="individual_sessions[1]">
						<div class="session-feedback session-feedback--input">
							<div class="session-feedback__content">
								<div class="session-feedback__text">
									Error State
								</div>
								<div class="session-feedback-inputs">
									<a href="#" class="session-feedback-inputs__input">
										<span>Adult Gold Dramatic Entertainment</span>
									</a>
									<a href="#" class="session-feedback-inputs__input">
										<span>Senior Ladies Combined</span>
									</a>
									<a href="#" class="session-feedback-inputs__input">
										<span>Adult Gold Dramatic Entertainment</span>
									</a>
									<a href="#" class="session-feedback-inputs__input">
										<span>Senior Ladies Combined</span>
									</a>
									<a href="#" class="session-feedback-inputs__input">
										<span>Senior Ladies Combined</span>
									</a>
								</div>
							</div>
						</div>
					</standard-session>

				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Session List</h2>
			</div>
			<div class="style-guide__section-content" style="background-color:#333;padding-top:3rem; padding-bottom:3rem;">
				<div class="session-list">
					<standard-session v-for="(session,index) in list_sessions" :key="index" :session="session" :class="{'session--scheduled':session.scheduled,'session--in-cart':session.in_cart}"></standard-session>
				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Session Variants</h2>
			</div>
			<div class="style-guide__section-content" style="background-color:#333;padding-top:3rem; padding-bottom:3rem;">
				<div class="session-list">
					<standard-session :session="individual_sessions[0]" class="session--scheduled"></standard-session>
					<standard-session :session="individual_sessions[2]" class="session--in-cart"></standard-session>
				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Session --Extended</h2>
			</div>
			<div class="style-guide__section-content">
				<extended-session :scheduled_session="extended_session" :session="extended_session.session"></extended-session>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Schedule Card</h2>
			</div>
			<div class="style-guide__section-content" style="background-color: rgb(51, 51, 51); padding-top: 3rem; padding-bottom: 3rem;">
				<div v-cloak class="schedule-card">
					<h3 class="schedule-card__heading">Wed 8/3</h3>
					<div class="schedule-card__content">
						<div class="session-list">
							<extended-session :scheduled_session="extended_session" :session="extended_session.session"></extended-session>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Cart Item</h2>
			</div>
			<div class="style-guide__section-content" style="background-color: rgb(51, 51, 51); padding-top: 3rem; padding-bottom: 3rem;">
				<cart-item :show_remove="true" :item="cart_session"></cart-item>
				<div class="cart-item" style="margin-top:1.5rem;">
					<div class="cart-item__info">
						<div class="cart-item__heading">
							<div class="cart-item__competition-name">
								2018 Test Competition
							</div>
							<div class="cart-item__cost">
								$30
							</div>
						</div>
						<div class="cart-item__event-name">
							Intermediate Ladies
						</div>
						<div class="cart-item__details">
							<div class="cart-item__type-description">
								OPI
							</div>
							<ul class="cart-item__session-description">
								<li>
									<span class="cart-item__time">7/22/2019 7:15 AM</span>
								</li>
								<li>
									<span>OLY</span>
								</li>
							</ul>
						</div>
					</div>
					<button type="button" class="cart-item__remove">
						<span class="cart-item__remove__text">REMOVE</span>
					</button>
				</div>
			</div>
			<h3>Alternate</h3>
			<div class="style-guide__section-content" style="background-color: rgb(51, 51, 51); padding-top: 3rem; padding-bottom: 3rem;">
				<div class="alternate-cart-item" style="margin-top:1.5rem;">
					<div class="alternate-cart-item__info">
						<div class="alternate-cart-item__header">
							<div class="alternate-cart-item__name">
								Junior Ladies Short Program
							</div>
							<div class="alternate-cart-item__cost">
								$20
							</div>
						</div>
						<div class="alternate-cart-item__description">
							<p>2019 Skate Austin Bluebonnet</p>
							<p>NQ-ENTRY FEE</p>
						</div>
					</div>
					<button type="button" class="alternate-cart-item__remove">
						<span class="alternate-cart-item__remove__text">REMOVE</span>
					</button>
				</div>
				<div class="alternate-cart-item alternate-cart-item--static" style="margin-top:1.5rem;">
					<div class="alternate-cart-item__info">
						<div class="alternate-cart-item__header">
							<div class="alternate-cart-item__name">
								Admin Fee
							</div>
							<div class="alternate-cart-item__cost">
								$20
							</div>
						</div>
					</div>
				</div>
			</div>

		</section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Cart Overview</h2>
			</div>
			<div class="style-guide__section-content" style="background-color: #e3e3e3;">
				<cart-overview></cart-overview>
			</div>
		</section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Cart Summary</h2>
			</div>
			<div class="style-guide__section-content" style="background-color: #e3e3e3; padding-top: 3rem; padding-bottom: 3rem;">
				<cart-summary :show_remove_item="true"></cart-summary>
			</div>
		</section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Cart Summary List</h2>
			</div>
			<div class="style-guide__section-content">
				<cart-summary class="cart-summary--list" :show_remove_item="false" :show_remove_item="true"></cart-summary>
			</div>
		</section>

		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Selected Card</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="selected-card">
					<p class="selected-card__info">
						<span class="selected-card__type selected-card__type--visa">&nbsp;</span>
						<span class="selected-card__number"><span class="selected-card__number__mask">****</span> 4242</span>
						<span class="selected-card__expiration">Exp 06/22</span>
					</p>
				</div>
				<div class="selected-card">
					<p class="selected-card__info">
						<span class="selected-card__type selected-card__type--discover">&nbsp;</span>
						<span class="selected-card__number"><span class="selected-card__number__mask">****</span> 4242</span>
						<span class="selected-card__expiration">Exp 06/22</span>
					</p>
				</div>
				<div class="selected-card">
					<p class="selected-card__info">
						<span class="selected-card__type selected-card__type--mastercard">&nbsp;</span>
						<span class="selected-card__number"><span class="selected-card__number__mask">****</span> 4242</span>
						<span class="selected-card__expiration">Exp 06/22</span>
					</p>
				</div>
				<div class="selected-card">
					<p class="selected-card__info">
						<span class="selected-card__type selected-card__type--american-express">&nbsp;</span>
						<span class="selected-card__number"><span class="selected-card__number__mask">****</span> 42422</span>
						<span class="selected-card__expiration">Exp 06/22</span>
					</p>
				</div>
			</div>
		</section>


		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Checkout Steps (General)</h2>
			</div>
			<div class="style-guide__section-content" style="background-color: rgb(51, 51, 51); padding-top: 3rem; padding-bottom: 3rem;">
				<section class="checkout-steps">
					<div class="checkout-step" :class="{'inactive':index>0}" v-for="(name,index) in ['Billing Address','Payment','Review & Submit']">
						<h3 class="checkout-step__heading">
							<span class="checkout-step__step-number">{{index+1}} of 3</span>
							<span class="checkout-step__step-name">{{name}}</span>
						</h3>
						<div class="checkout-step__content" v-if="index===0">
							<div>
								this is content
							</div>
						</div>
					</div>
				</section>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Steps Indicator</h2>
			</div>
			<div class="style-guide__section-content">
				<steps-indicator :available_step_count="4" :active_step_number="2"></steps-indicator>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Progress Bar</h2>
			</div>
			<div class="style-guide__section-content">
				<progress-bar :available_step_count="7" :active_step_number="3"></progress-bar>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Page Alerts</h2>
			</div>
			<div class="style-guide__section-content">
				<page-alert style="margin-top:2.5rem" class="page-alert">
					<div slot="trigger_text">
						Generic Page Alert
					</div>
					<div slot="expand_content">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
							beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
							quaerat quod repellat sapiente sit?
						</p>
					</div>
				</page-alert>
				<page-alert style="margin-top:2.5rem" class="page-alert page-alert--notice">
					<div slot="trigger_text">
						Notice
					</div>
					<div slot="expand_content">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
							beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
							quaerat quod repellat sapiente sit?
						</p>
					</div>
				</page-alert>
				<page-alert style="margin-top:2.5rem" class="page-alert page-alert--medium">
					<div slot="trigger_text">
						Medium
					</div>
					<div slot="expand_content">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
							beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
							quaerat quod repellat sapiente sit?
						</p>
					</div>
				</page-alert>
				<page-alert style="margin-top:2.5rem" class="page-alert page-alert--no-icon">
					<div slot="trigger_text">
						No Icon
					</div>
					<div slot="expand_content">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
							beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
							quaerat quod repellat sapiente sit?
						</p>
					</div>
				</page-alert>
				<page-alert style="margin-top:2.5rem" class="page-alert page-alert--bleed">
					<div slot="trigger_text">
						Bleed (alert toggle bleeds to width of parent)
					</div>
					<div slot="expand_content">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
							beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
							quaerat quod repellat sapiente sit?
						</p>
					</div>
				</page-alert>
				<page-alert style="margin-top:2.5rem" class="page-alert">
					<div slot="trigger_text">
						Content
					</div>
					<div slot="expand_content">
						<ul class="page-alert__content__list">
							<li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea enim ex facilis
								incidunt numquam officiis placeat quos, sapiente veritatis voluptatem. Accusantium
								atque deserunt eaque ex maiores nisi quaerat tempore temporibus!
							</li>
							<li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea enim ex facilis
								incidunt numquam officiis placeat quos, sapiente veritatis voluptatem. Accusantium
								atque deserunt eaque ex maiores nisi quaerat tempore temporibus!
							</li>
							<li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea enim ex facilis
								incidunt numquam officiis placeat quos, sapiente veritatis voluptatem. Accusantium
								atque deserunt eaque ex maiores nisi quaerat tempore temporibus!
							</li>
							<li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea enim ex facilis
								incidunt numquam officiis placeat quos, sapiente veritatis voluptatem. Accusantium
								atque deserunt eaque ex maiores nisi quaerat tempore temporibus!
							</li>
						</ul>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid architecto aut
							beatae blanditiis, cumque dolor earum est eum hic inventore ipsam iusto maiores perspiciatis
							quaerat quod repellat sapiente sit?
						</p>
					</div>
				</page-alert>
			</div>
		</section>


		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Competition Tile (in .competition-tile-list)</h2>
			</div>
			<div class="style-guide__section-content" style="background-color: rgb(51, 51, 51); padding-top: 3rem; padding-bottom: 3rem;">
                <div class="competition-tile-list">
                    <competition-tile :competition="{
				name:'Competition Name',
				icon: '/images/2018-MW-Adult.png',
                start_date:'7/2',
                end_date:'7/6',
                city:'North Shore',
                state:'OH',
                club:'Silver Blades of OH',
                series:null
				}"></competition-tile>
                    <competition-tile :competition="{
				name:'Competition Name',
				icon: '/images/2018-MW-Adult.png',
                start_date:'7/2',
                end_date:'7/6',
                city:'North Shore',
                state:'OH',
                club:'Silver Blades of OH',
                series:[{name:'SDS'}]
				}">
                        <div slot="banners" class="competition-tile__banners">
                            <div class="competition-tile-banner competition-tile-banner--registered">
                                Registered
                            </div>
                            <div class="competition-tile-banner competition-tile-banner--series">
                                SDS
                            </div>
                        </div>
                    </competition-tile>
                    <competition-tile :competition="{
				name:'Competition Name',
				icon: '/images/2018-MW-Adult.png',
                start_date:'7/2',
                end_date:'7/6',
                city:'North Shore',
                state:'OH',
                club:'Silver Blades of OH',
                series:[{name:'SDS'}]
				}">
                        <div slot="drawer" class="competition-tile__drawer">
                            <div class="competition-tile__cta">
                                <a href="#" class="button button--block">
                                    Register Now
                                </a>
                            </div>
                            <p class="competition-tile__text competition-tile__text--secondary competition-tile__text--alert">
                                Registration deadline: 04/12, 3:00 am
                            </p>
                        </div>
                    </competition-tile>
                </div>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Label list</h2>
			</div>
			<div class="style-guide__section-content">
				<ul class="label-list">
					<li>
						<span class="label-list__label">Primary Email:</span>
						<span class="label-list__value">541374@simba.usfs</span>
					</li>
					<li>
						<span class="label-list__label">Primary Phone:</span>
						<span class="label-list__value">303-919-0303</span>
					</li>
				</ul>
			</div>
		</section>
		<section class="style-guide__section">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Event Card</h2>
			</div>
			<div class="style-guide__section-content">
				<div class="event-card">
					<div class="event-card__content">
						<div class="event-card__details">
							<p class="event-card__event-name">Junior Ladies Short Program</p>
							<p class="event-card__event-details">Judging System:
								<span class="ijs-fix">IJS</span>
							</p>
						</div>
						<div class="event-card__actions">
							<button class="button--medium-text button button--block button--info button--medium button--medium--text">
								Add
							</button>
						</div>
					</div>
				</div>

				<div class="event-card event-card--selected">
					<div class="event-card__content">
						<div class="event-card__details">
							<p class="event-card__event-name">Junior Ladies Short Program</p>
							<p class="event-card__event-details">Judging System:
								<span class="ijs-fix">IJS</span>
							</p>
						</div>
						<div class="event-card__actions">
							<button class="icon-button--md-text icon-button icon-button--delete icon-button--labeled-inline">
								Remove
							</button>
						</div>
					</div>
				</div>
				<div class="event-card event-card--registered">
					<div class="event-card__content">
						<div class="event-card__details">
							<p class="event-card__event-name">Junior Ladies Short Program</p>
							<p class="event-card__event-details">Judging System:
								<span class="ijs-fix">IJS</span>
							</p>
						</div>
						<div class="event-card__actions">
							<button disabled="true" class="button--medium-text button button--block button--medium button--medium--text">
								Registered
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="style-guide__section" style="background-color: #f3f3f3; padding-top: 3rem; padding-bottom: 3rem;">
			<div class="style-guide__section-heading">
				<h2 class="style-guide__section-heading-text">Member Search Result</h2>
			</div>
			<div class="style-guide__section-content" style="padding-left:15px; padding-right:15px;">
				<div class="member-search-results__result-list">
					<div class="member-search-result">
						<div class="member-search-result__content">
							<div class="member-search-result__info">
								<p class="member-search-result__primary">Peter Solmssen - 998594895</p>
								<p class="member-search-result__secondary">Aarhus</p>
								<p class="member-search-result__secondary">Dallas, TX</p>
							</div>
							<div class="member-search-result__actions">
								<button type="button" class="button button--info button--medium button--block">Add
								</button>
							</div>
						</div>
					</div>
					<div class="member-search-result">
						<div class="member-search-result__content">
							<div class="member-search-result__info">
								<p class="member-search-result__primary">Leilani Konospelski - 998594895</p>
								<p class="member-search-result__secondary">Denver FSC</p>
								<p class="member-search-result__secondary">Miami, Florida</p>
							</div>
							<div class="member-search-result__actions">
								<a href="#" class="member-result-notice member-result-notice--ineligible">
									<span class="member-result-notice__icon">&nbsp;</span>
									<span class="member-result-notice__text">Ineligible to participate</span>
								</a>
							</div>
						</div>
					</div>
					<div class="member-search-result">
						<div class="member-search-result__content">
							<div class="member-search-result__info">
								<p class="member-search-result__primary">Peter Solmssen - 998594895</p>
								<p class="member-search-result__secondary">Aarhus</p>
								<p class="member-search-result__secondary">Dallas, TX</p>
							</div>
							<div class="member-search-result__actions">
								<span class="member-result-notice member-result-notice--alert"><span class="member-result-notice__icon">&nbsp;</span> <span class="member-result-notice__text">Must be opposite gender</span></span>
							</div>
						</div>
					</div>
					<div class="member-search-result">
						<div class="member-search-result__content">
							<div class="member-search-result__info">
								<p class="member-search-result__primary">Peter Solmssen - 998594895</p>
								<p class="member-search-result__secondary">Aarhus</p>
								<p class="member-search-result__secondary">Dallas, TX</p>
							</div>
							<div class="member-search-result__actions">
								<span class="member-result-notice member-result-notice--selected"><span class="member-result-notice__icon">&nbsp;</span> <span class="member-result-notice__text">Already Selected</span></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Element] Count Badge</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="count-badge">
                   <div class="count-badge__content">
                       120
                   </div>
                </div>
                <div class="count-badge count-badge--large">
                    <div class="count-badge__content">
                        12
                    </div>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Element] New Badge</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="new-badge">
                    New
                </div>
                <div>
                    <i class="icon-new-badge"></i>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Component] Entity Compliance Requirements Summary</h2>
            </div>
            <div class="style-guide__section-content">
                <entity-compliance-requirements-summary
                        :compliance_items="[
                    {
                    complete:true,
                    overridden:false,
                    name:'Coach Code of Ethics'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Background Check'},
                    {
                    complete:true,
                    overridden:false,
                    name:'Membership'},
                    {
                    complete:true,
                    overridden:false,
                    name:'CER'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Liability Insurance'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'PSA'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'SafeSport'
                    }
                    ]"></entity-compliance-requirements-summary>
                <h3>Small</h3>
                <entity-compliance-requirements-summary
                        :override_permitted="false"
                        class="entity-compliance-requirements-summary--small"
                        :compliance_items="[
                    {
                    complete:true,
                    overridden:false,
                    name:'Coach Code of Ethics'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Background Check'},
                    {
                    complete:true,
                    overridden:false,
                    name:'Membership'},
                    {
                    complete:true,
                    overridden:false,
                    name:'CER'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Liability Insurance'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'PSA'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'SafeSport'
                    }
                    ]"></entity-compliance-requirements-summary>
                <h3>Small With Columns</h3>
                <entity-compliance-requirements-summary
                        :override_permitted="false"
                        class="entity-compliance-requirements-summary--small entity-compliance-requirements-summary--with-columns"
                        :compliance_items="[
                    {
                    complete:true,
                    overridden:false,
                    name:'Coach Code of Ethics'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Background Check'},
                    {
                    complete:true,
                    overridden:false,
                    name:'Membership'},
                    {
                    complete:true,
                    overridden:false,
                    name:'CER'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Liability Insurance'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'PSA'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'SafeSport'
                    }
                    ]"></entity-compliance-requirements-summary>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Component] Status Entity Card</h2>
            </div>
            <div class="style-guide__section-content">
                <h3>Roster Skater (Check-In Subentity)</h3>
                <div style="background-color:#333;padding:3rem;">
                    <status-entity-card
                            class="status-entity-card--centered-actions"
                            :is_success="true">
                        <div slot="primary-content">
                            1. Lastname, Firstname
                            <span class="text--muted">(12345678)</span>
                        </div>
                        <span slot="secondary-content" class="text--muted">Age: 10</span>
                        <button slot="actions"
                                title="Open Skater Info"
                                class="icon-button icon-button--lg icon-button--info icon-button--pseudo"
                        >
                            <span class="sr-only">Open Skater Info</span>
                        </button>
                    </status-entity-card>
                </div>
                <h3>Team Service Person (Check-In Subentity)</h3>
                <div style="background-color:#333;padding:3rem;">
                    <status-entity-card
                            class="status-entity-card--compliance"
                            :is_success="true">
                        <div slot="primary-content">
                            Lastname, Firstname
                            <span class="text--muted">(12345678)</span>
                        </div>
                        <div slot="secondary-content">
                            <p class="status-entity-card__secondary status-entity-card__secondary--highlight">
                                Team Trainer
                            </p>
                            <ul class="status-entity-card__secondary-list">
                                <li>
                                    <a class="standard-link" :href="'mailto:test@test.com'">
                                        test@test.com
                                    </a>
                                </li>
                                <li>
                                    <a class="standard-link" :href="'tel:555-555-5555'">
                                        555-555-5555
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <entity-compliance-requirements-summary slot="expand-content"
                                                                class="entity-compliance-requirements-summary--small"
                                                                :compliance_items="[
                                                                {
                                                                complete:false,
                                                                overridden:false,
                                                                name:'Background Check'},
                                                                 {
                                                                complete:false,
                                                                overridden:false,
                                                                name:'SafeSport'
                                                                }
                                                            ]"
                                                                :override_permitted="false"></entity-compliance-requirements-summary>
                    </status-entity-card>
                </div>
                <h3>Coach (Check-In Subentity)</h3>
                <div style="background-color:#333;padding:3rem;">
                    <status-entity-card
                            class="status-entity-card--compliance"
                            :is_success="true">
                        <div slot="primary-content">
                            Lastname, Firstname
                            <span class="text--muted">(12345678)</span>
                        </div>
                        <ul slot="secondary-content" class="status-entity-card__secondary-list">
                            <li>
                                <a class="standard-link" :href="'mailto:test@test.com'">
                                    test@test.com
                                </a>
                            </li>
                            <li>
                                <a class="standard-link" :href="'tel:555-555-5555'">
                                    555-555-5555
                                </a>
                            </li>
                        </ul>
                        <entity-compliance-requirements-summary slot="expand-content"
                                                                class="entity-compliance-requirements-summary--small entity-compliance-requirements-summary--with-columns"
                                                                :compliance_items="[
                    {
                    complete:true,
                    overridden:false,
                    name:'Coach Code of Ethics'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Background Check'},
                    {
                    complete:true,
                    overridden:false,
                    name:'Membership'},
                    {
                    complete:true,
                    overridden:false,
                    name:'CER'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Liability Insurance'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'PSA'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'SafeSport'
                    }
                    ]"
                                                                :override_permitted="false"></entity-compliance-requirements-summary>
                    </status-entity-card>
                </div>

            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Component] Status Entity Card</h2>
            </div>
            <div class="style-guide__section-content">
                <h3>Roster Skater (Check-In Subentity)</h3>
                <div style="background-color:#333;padding:3rem;">
                    <status-entity-card
                            class="status-entity-card--centered-actions"
                            :is_success="true">
                        <div slot="primary-content">
                            1. Lastname, Firstname
                            <span class="text--muted">(12345678)</span>
                        </div>
                        <span slot="secondary-content" class="text--muted">Age: 10</span>
                        <button slot="actions"
                                title="Open Skater Info"
                                class="icon-button icon-button--lg icon-button--info icon-button--pseudo"
                        >
                            <span class="sr-only">Open Skater Info</span>
                        </button>
                    </status-entity-card>
                </div>
                <h3>Team Service Person (Check-In Subentity)</h3>
                <div style="background-color:#333;padding:3rem;">
                    <status-entity-card
                            class="status-entity-card--compliance"
                            :is_success="true">
                        <div slot="primary-content">
                            Lastname, Firstname
                            <span class="text--muted">(12345678)</span>
                        </div>
                        <div slot="secondary-content">
                            <p class="status-entity-card__secondary status-entity-card__secondary--highlight">
                                Team Trainer
                            </p>
                            <ul class="status-entity-card__secondary-list">
                                <li>
                                    <a class="standard-link" :href="'mailto:test@test.com'">
                                        test@test.com
                                    </a>
                                </li>
                                <li>
                                    <a class="standard-link" :href="'tel:555-555-5555'">
                                        555-555-5555
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <entity-compliance-requirements-summary slot="expand-content"
                                                                class="entity-compliance-requirements-summary--small"
                                                                :compliance_items="[
                                                                {
                                                                complete:false,
                                                                overridden:false,
                                                                name:'Background Check'},
                                                                 {
                                                                complete:false,
                                                                overridden:false,
                                                                name:'SafeSport'
                                                                }
                                                            ]"
                                                                :override_permitted="false"></entity-compliance-requirements-summary>
                    </status-entity-card>
                </div>
                <h3>Coach (Check-In Subentity)</h3>
                <div style="background-color:#333;padding:3rem;">
                    <status-entity-card
                            class="status-entity-card--compliance"
                            :is_success="true">
                        <div slot="primary-content">
                            Lastname, Firstname
                            <span class="text--muted">(12345678)</span>
                        </div>
                        <ul slot="secondary-content" class="status-entity-card__secondary-list">
                            <li>
                                <a class="standard-link" :href="'mailto:test@test.com'">
                                    test@test.com
                                </a>
                            </li>
                            <li>
                                <a class="standard-link" :href="'tel:555-555-5555'">
                                    555-555-5555
                                </a>
                            </li>
                        </ul>
                        <entity-compliance-requirements-summary slot="expand-content"
                                                                class="entity-compliance-requirements-summary--small entity-compliance-requirements-summary--with-columns"
                                                                :compliance_items="[
                    {
                    complete:true,
                    overridden:false,
                    name:'Coach Code of Ethics'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Background Check'},
                    {
                    complete:true,
                    overridden:false,
                    name:'Membership'},
                    {
                    complete:true,
                    overridden:false,
                    name:'CER'},
                    {
                    complete:false,
                    overridden:false,
                    name:'Liability Insurance'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'PSA'
                    },
                     {
                    complete:false,
                    overridden:false,
                    name:'SafeSport'
                    }
                    ]"
                                                                :override_permitted="false"></entity-compliance-requirements-summary>
                    </status-entity-card>
                </div>

            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Element] Parented Checkbox List</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="parented-checkbox-group">
                    <div class="parented-checkbox-group__parent">
                        <label for="category_pcgc12" class="usfsa-checkbox">
                            <input id="category_pcgc12"
                                   type="checkbox">
                            <span class="usfsa-checkbox__text">Parent Checkbox</span>
                        </label>
                    </div>
                    <ul class="parented-checkbox-group__children">
                        <li v-for="(item,item_index) in [1,2,3,4,5]"
                            :key="item_index"
                            class="parented-checkbox-group__children__child">
                            <label :for="'category__item_'+item_index" class="usfsa-checkbox">
                                <input :id="'category__item_'+item_index"
                                       type="checkbox">
                                <span class="usfsa-checkbox__text">Option {{item}}</span>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Component] Competition Registration CTA</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="card">
                    <competition-registration-cta :competition="{
                        competition_registration_status: 'open',
                        has_registration_deadline_warning: false,
                        registration_deadline: '04/12, 3:00 am',
                        user_registration_link: 'https://placehold.it/320x240&text=text',
                        user_registration_status: 'new'
                }">
                    </competition-registration-cta>
                </div>

                <div class="card">
                    <competition-registration-cta :competition="{
                        competition_registration_status: 'late',
                        has_registration_deadline_warning: true,
                        registration_deadline: '04/12, 3:00 am',
                        user_registration_link: 'https://placehold.it/320x240&text=text',
                        user_registration_status: 'new'
                }">
                    </competition-registration-cta>
                </div>
                <div class="card">
                    <competition-registration-cta :competition="{
                        competition_registration_status: 'open',
                        has_registration_deadline_warning: false,
                        registration_deadline: '04/12, 3:00 am',
                        user_registration_link: 'https://placehold.it/320x240&text=text',
                        user_registration_status: 'registered'
                }">
                    </competition-registration-cta>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Component] Competition Volunteer CTA</h2>
            </div>
            <div class="style-guide__section-content">
                <competition-volunteer-cta :source="{
                    actions: {
                        request: {
                            visible: true,
                            enabled: true
                        },
                        select_shifts: {
                            visible: false,
                            enabled: false,
                            url: ''
                        }
                    },
                    phase_message: {
                        text: 'Example Phase Message',
                        type: 'success'
                    },
                    status_message: {
                        text: 'Example status message',
                        type_key: 'alert'
                    }
                }">
                </competition-volunteer-cta>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Component] Carousel</h2>
            </div>
            <div class="style-guide__section-content">
                <carousel>
                    <div class="swiper-slide">
                        <div style="height:150px; background-color:darkgray; display:flex; align-items:center;justify-content:center">Slide 1</div>
                    </div>
                    <div class="swiper-slide">
                        <div style="height:150px; background-color:darkgray; display:flex; align-items:center;justify-content:center">Slide 2</div>
                    </div>
                </carousel>
                <h3>With Navigation</h3>
                <carousel :show_navigation="true">
                    <div class="swiper-slide">
                        <div style="height:150px; background-color:darkgray; display:flex; align-items:center;justify-content:center">Slide 1</div>
                    </div>
                    <div class="swiper-slide">
                        <div style="height:150px; background-color:darkgray; display:flex; align-items:center;justify-content:center">Slide 2</div>
                    </div>
                </carousel>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Component] Competition User Navigation</h2>
            </div>
            <div class="style-guide__section-content">
               <competition-user-navigation :links="[
                    {
                        label: 'Inactive Item',
                        url: 'http://google.com',
                        is_active: false,
                        inactive_message: 'Inactive message'
                    },
                    {
                        label: 'Active Item',
                        url: 'http://google.com',
                        is_active: true
                    },
               ]">

               </competition-user-navigation>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Series Summary</h2>
            </div>
            <div class="style-guide__section-content">
                <div class="series-summary">
                    <div class="series-summary__icon">
                        <img src="http://placehold.it/59x42&text=SI"
                             alt="">
                    </div>
                    <div class="series-summary__details">
                        <p class="series-summary__primary">2021 National Qualifying Series</p>
                        <p class="series-summary__secondary">
                            Application Deadline: 5/28/2019
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">Cost Display</h2>
            </div>
            <div class="style-guide__section-content">
                <span class="cost-display">
                    <span class="cost-display__label">Total:</span>
                    <span class="cost-display__value">$30</span>
                </span>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Component] Series Page Header</h2>
            </div>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <series-page-header
                :series="{
                    name:'2020 National Qualifying Series',
                    icon:'/images/series-icon-1.png',
                    application_deadline_formatted:'5/28/2019 11:59 PM ET'
                }"></series-page-header>
            </div>
        </section>
        <section class="style-guide__section">
            <div class="style-guide__section-heading">
                <h2 class="style-guide__section-heading-text">[Component] Page Entity Header</h2>
            </div>
            <div class="style-guide__section-content style-guide__section-content--bleed">
                <page-entity-header slot="pre-header" entity_name="Denver Synchronicity - Synchro Skills">

                </page-entity-header>
            </div>
        </section>
    </div>
</div>

<script src="<?php echo mix('/js/manifest.js') ?>"></script>
<script src="<?php echo mix('/js/vendor.js') ?>"></script>
<script src="<?php echo mix('/js/competition-registration.js') ?>"></script>
<script src="<?php echo mix('/js/style-guide.js') ?>"></script>
</body>
</html>