import {DataNavigationLinkComponent} from '../CompetitionPortal/_components/DataNavigationLink/_contracts';

export const DATA_NAVIGATION_LINK_ITEMS:DataNavigationLinkComponent.DataNavigationLink[] = [
    {
        label: 'Content Types',
        url: '#',
        data: [
            {
                content: 'Standard'
            },
            {
                status_type: 'success',
                content: 'Happy text'
            },
            {
                status_type: 'alert',
                content: 'Sad text'
            },
            {
                icon: 'warning',
                content: 'Warning alert'
            },
            {
                icon: 'scheduled',
                content: 'Scheduled notice'
            },
            {
                icon: 'pending',
                content: 'Pending notice'
            },
            {
                icon: 'incomplete',
                content: 'Incomplete Item'
            },
            {
                icon: 'complete',
                content: 'Complete Item'
            },
            {
                icon: 'new',
                content: 'New Item'
            },
            {

                content: [
                    {
                        type_key: 'success',
                        text: 'Happy text'
                    },
                    {
                        type_key: 'alert',
                        text: 'With Sad Text'
                    }
                ]
            }

        ]
    },
    {
        label: 'Can Be Complete',
        url: '#',
        is_complete: true
    },
    {
        label: 'Can Be Incomplete',
        url: '#',
        is_complete: false
    },
    {
        label: 'Can Be Disabled',
        url: '#',
        is_disabled: true
    },
    {
        label: 'Competition Information',
        url: '#',
        data: [
            {
                content: '2 Registered Events.'
            }
        ]
    },
    {
        label: 'Competition Documents',
        url: '#',
        data: [
            {
                icon: 'warning',
                content: 'Need to Check an action document'
            }
        ]
    },
    {
        label: 'Competition Documents',
        url: '#',
        data: [
            {
                icon: 'new',
                content: 'Reference Document Added (5 days ago)'
            }
        ]
    },
    {
        label: 'Practice Ice / Schedule',
        url: '#',
        data: [
            {
                content: 'Pre-Purchase Begins: 6 days'
            },
            {
                icon: 'warning',
                content: 'No Credits Purchased'
            }
        ]
    },
    {
        label: 'Practice Ice / Schedule',
        url: '#',
        data: [
            {
                status_type: 'alert',
                content: 'Pre-Purchase Closes: 5 hours'
            },
            {
                icon: 'warning',
                content: 'No Credits Purchased'
            }
        ]
    },
    {
        label: 'Practice Ice / Schedule',
        url: '#',
        data: [
            {
                status_type: 'alert',
                content: 'Pre-Purchase Closes: 12 hours'
            },
            {
                icon: 'warning',
                content: 'No Credits Purchased'
            }
        ]
    },
    {
        label: 'Practice Ice / Schedule',
        url: '#',
        data: [
            {
                status_type: 'alert',
                content: 'Pre-Purchase Closes: 12 hours'
            },
            {
                content: 'Purchased: UPI: 4 / OPI: 3 / WU: 5'
            },
            {
                content: 'Unscheduled: UPI: 4 / OPI: 3 / WU: 5'
            }
        ]
    },
    {
        label: 'Practice Ice / Schedule',
        url: '#',
        is_disabled: true,
        data: [
            {

                content: 'Practice Ice is not offered through EMS for this competition.'
            }
        ]
    },
    {
        label: 'Practice Ice / Schedule',
        url: '#',
        is_disabled: true,
        data: [
            {

                content: 'The schedule has not been posted yet. Try again later.'
            }
        ]
    },
    {
        label: 'Practice Ice / Schedule',
        url: '#',
        is_disabled: true,
        data: [
            {

                content: 'Practice Ice sales have not started yet. Try again later.'
            }
        ]
    },
    {
        label: 'Competition Roster',
        url: '#',
        is_complete: false,
        data: [
            {
                content: [
                    {
                        type_key: 'alert',
                        text: 'Skaters:12'
                    },
                    {
                        type_key: 'alert',
                        text: 'Deadline: 8 hours'
                    }
                ]
            }

        ]
    },
    {
        label: 'Competition Roster',
        url: '#',
        is_complete: true,
        data: [

            {
                content: [
                    {
                        type_key: 'success',
                        text: 'Skaters:12'
                    },
                    {
                        type_key: 'success',
                        text: 'Deadline: 12/8/2020 11:59 PM ET'
                    }
                ]
            }

        ]
    },
    {
        label: 'Competition Roster',
        url: '#',
        is_complete: false,
        data: [

            {
                content: [
                    {
                        type_key: 'alert',
                        text: 'Skaters:12'
                    },
                    {
                        type_key: 'success',
                        text: 'Deadline: 12/8/2020 11:59 PM ET'
                    }
                ]
            }

        ]
    },
    {
        label: 'Competition Roster',
        url: '#',
        is_complete: true,
        data: [

            {
                content: [
                    {
                        type_key: 'success',
                        text: 'Skaters:12'
                    },
                    {
                        type_key: 'alert',
                        text: 'Deadline: 5 hours'
                    }
                ]
            }

        ]
    },
    {
        label: 'Competition Team Personnel',
        url: '#',
        is_complete: true,
        data: [
            {
                icon: 'warning',
                content: 'No Team Personnel Selected'
            }
        ]
    },
    {
        label: 'Competition Team Personnel',
        url: '#',
        is_complete: true,
        data: [
            {
                content: 'Coaches:2'
            },
            {
                content: 'Team Service Personnel: 4'
            },
            {
                content: 'Prop Crew: 3'
            }
        ]
    },
    {
        label: 'Competition Team Personnel',
        url: '#',
        is_complete: false,
        data: [
            {
                status_type: 'alert',
                content: 'Coaches:2'
            },
            {
                content: 'Team Service Personnel: 4'
            },
            {
                content: 'Prop Crew: 3'
            }
        ]
    },
    {
        label: 'Music & Program Content',
        url: '#',
        is_complete: false,
        data: [
            {
                icon: 'incomplete',
                content: 'Music Deadline: 5 hours'
            },
            {

                icon: 'incomplete',
                content: 'PPC Deadline: 5 hours'
            }
        ]

    },
    {
        label: 'Music & Program Content',
        url: '#',
        is_complete: true,
        data: [
            {
                icon: 'complete',
                content: 'Music Deadline: 20 days'
            },
            {
                icon: 'complete',
                content: 'PPC Deadline: 20 days'
            }
        ]

    },
    {
        label: 'Competition Contacts',
        url: '#'
    },
    {
        label: 'Shift Selection',
        url: '#',
        is_disabled: true,
        data: [
            {
                content: 'Schedule Coming Soon. Try again later.'
            }
        ]
    },
    {
        label: 'Shift Selection',
        url: '#',
        data: [
            {
                status_type: 'success',
                content: 'Selection Opening: 9/10/2020 11:59 PM ET'
            }
        ]
    },
    {
        label: 'Shift Selection',
        url: '#',
        data: [
            {
                status_type: 'success',
                content: 'Selection Closes: 12/10/2020 11:59 PM ET'
            }
        ]
    },
    {
        label: 'Shift Selection',
        url: '#',
        data: [
            {
                status_type: 'alert',
                content: 'Selection Closes: 12 hours'
            }
        ]
    },
    {
        label: 'My Volunteer Schedule',
        url: '#',
        is_disabled: true,
        data: [
            {
                content: 'No shifts selected yet.'
            }
        ]
    },
    {
        label: 'My Volunteer Schedule',
        url: '#',
        data: [
            {
                icon: 'scheduled',
                content: '2 Approved'
            },
            {
                icon: 'pending',
                content: '1 Pending'
            }
        ]
    }
];