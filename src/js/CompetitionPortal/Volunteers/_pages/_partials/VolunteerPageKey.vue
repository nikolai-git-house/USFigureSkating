<template>
    <div class="volunteer-page-key ada-text">
        <ul class="volunteer-page-key__list">
            <li class="volunteer-page-key__list__item volunteer-page-key__list__item--approved">
                <span class="text--success">Approved</span>
            </li>
            <li class="volunteer-page-key__list__item  volunteer-page-key__list__item--pending">
                <span><span class="text--warning">Pending</span>:</span>
                Some shifts require approval before they can be added to your schedule. Once you’ve
                been approved, the status will automatically be updated.
            </li>
            <li class="volunteer-page-key__list__item">
                <span><span class="text--highlight text--underline">Compliance Required</span>:</span>
                Some shifts require you to be compliant. You can select a shift, but you will need
                to be compliant before the shift.
            </li>
            <li class="volunteer-page-key__list__item  volunteer-page-key__list__item--compliant">
                <span class="text--success text--underline">Compliant</span>
            </li>
            <li class="volunteer-page-key__list__item  volunteer-page-key__list__item--noncompliant">
                <span><span class="text--alert text--underline">Not Compliant</span>:</span>
                You are approved for the shift, but are currently not compliant. You must be
                compliant before the shift.
            </li>
        </ul>
    </div>
</template>