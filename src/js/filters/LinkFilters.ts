import {LinkConfiguration} from '../contracts/AppContracts';

const LinkFilters = {
    /**
     * Get an anchor target attribute from a link configuration
     */
    target: function (value: LinkConfiguration): string | null {
        if (value.is_new_tab) {
            return '_blank';
        }

        return null;
    },
    /**
     * Get an anchor rel attribute from a link configuration
     */
    rel: function (value: LinkConfiguration): string | null {
        if (value.is_new_tab) {
            return 'noreferrer noopener';
        }

        return null;
    }
};

export default LinkFilters;