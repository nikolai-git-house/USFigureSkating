import {AddressData, AddressFormState} from '../CreateAccount/AddressFormState';
import {EmergencyContact} from '../../contracts/AppContracts';
import {UserProfile} from '../../contracts/app/UserContracts';
import {VolunteerRequestGeneralInformationFormData} from '../../contracts/app/VolunteerOpportunitiesContracts';

export class VolunteerRequestGeneralInformationFormState extends AddressFormState {
    cell_phone: string | null = null;
    email: string | null = null;
    emergency_contact_name: string | null = null;
    emergency_contact_phone: string | null = null;
    emergency_contact_relationship: string | null = null;

    /**
     * Export the data
     */
    export(): VolunteerRequestGeneralInformationFormData {
        const base: AddressData = super.export();

        return {
            ...base,
            cell_phone: this.cell_phone ? this.cell_phone : '',
            email: this.email ? this.email : '',
            emergency_contact: {
                name: this.emergency_contact_name || '',
                relationship: this.emergency_contact_relationship || '',
                phone: this.emergency_contact_phone || ''
            }
        };
    }

    /**
     * Import and set state from initial data
     */
    import(profile: UserProfile | null, emergency_contact: EmergencyContact | null) {
        if (emergency_contact) {
            this.emergency_contact_name = emergency_contact.name || null;
            this.emergency_contact_phone = emergency_contact.phone || null;
            this.emergency_contact_relationship = emergency_contact.relationship || null;
        }
        if (profile) {
            this.country = profile.address.country;
            this.street = profile.address.street;
            this.street_2 = profile.address.street_2;
            this.city = profile.address.city;
            this.state = profile.address.state;
            this.province = profile.address.province;
            this.zip = profile.address.zip_code ? String(profile.address.zip_code) : null;
            if (profile.primary_email) {
                this.email = profile.primary_email.value;
            } else if (profile.secondary_email) {
                this.email = profile.secondary_email.value;
            }
            if (profile.primary_phone) {
                this.cell_phone = profile.primary_phone.value;
            }
        }
    }
}