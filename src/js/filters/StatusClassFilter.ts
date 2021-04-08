import {StatusMessageTypeKey} from '../contracts/AppContracts';

/**
 * Get the CSS class associated with a status type key
 */
const StatusClassFilter = function (value: StatusMessageTypeKey | undefined) {
    if (!value || value === 'default') {
        return null;
    }

    return `text--${value.replace('alert', 'error')
        .replace('info', 'highlight')}`;
};

export default StatusClassFilter;