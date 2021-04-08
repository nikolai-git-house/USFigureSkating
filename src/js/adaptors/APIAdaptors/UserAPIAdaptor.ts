import {UserWaiver} from "../../contracts/app/CompetitionRegistrationContracts";
import {EditProfileFormState} from "../../models/Forms/EditProfileFormState";
import {
    EditUserProfileFormData,
    UserProfileData,
    UserWaiverData,
    UserWaiverSaveData
} from "../../contracts/release3/data/CompetitionRegistrationDataContracts";
import {FormOptionDataValue} from "../../contracts/release3/data/CommonDataContracts";
import {UserProfile} from '../../contracts/app/UserContracts';


export class UserAPIAdaptor {
    static adaptUserProfileDataToUserProfile(profile_data: UserProfileData): UserProfile {
        return {
            ...profile_data,
            birth_date: {
                formatted: profile_data.birth_date.formatted,
                timestamp: profile_data.birth_date.timestamp * 1000
            }
        } as UserProfile
    }

    static adaptEditProfileFormStateToUserProfileData(profile_data: EditProfileFormState): EditUserProfileFormData {
        /**
         * At this point, profile_data has been validated to ensure required properties are provided. Null coalescing is
         * here solely for type-safeness
         */
        return {
            ...profile_data,
            first_name: profile_data.first_name || "",
            last_name: profile_data.last_name || "",
            birth_date: profile_data.birth_date || "",
        }
    }

    static adaptUserWaiversToUserWaiverSaveData(user_waiver: UserWaiver): UserWaiverSaveData {
        return {
            id: user_waiver.id,
            name: user_waiver.status.name as string,
            relationship: user_waiver.status.relationship as FormOptionDataValue
        }
    }

    static adaptUserWaiverDataToUserWaiver(user_waiver: UserWaiverData): UserWaiver {
        return {
            ...user_waiver
        };
    }
}