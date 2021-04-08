import {UserData} from "../contracts/data/DataContracts";
import {User, UserParams} from "../models/User";
import {UserRole} from "../contracts/AppContracts";

export class UserAdaptor {
    static adaptUser(raw_data: UserData): User {
        let required_props = ['roles', 'upload_file_capability', 'member_number', 'email'];
        for (let i = 0; i < required_props.length; i++) {
            let prop = required_props[i];
            if (!(prop in raw_data)) {
                throw "Invalid user data";
            }
        }
        let sub_props = ["can_upload", "error_message"];
        for (let i = 0; i < sub_props.length; i++) {
            let prop = sub_props[i];
            if (!(prop in raw_data.upload_file_capability)) {
                throw "Invalid user data";
            }
        }


        if (typeof raw_data.upload_file_capability.can_upload === "string") {
            raw_data.upload_file_capability.can_upload = raw_data.upload_file_capability.can_upload === "true";
        }

        let valid_user_roles: UserRole[] = ["skater", "coach", 'team_manager'];
        let user_roles: UserRole[] = [];
        for (let i = 0; i < raw_data.roles.length; i++) {
            let data_type = raw_data.roles[i] as UserRole;
            if (valid_user_roles.indexOf(data_type) !== -1) {
                user_roles.push(data_type);
            }
        }

        let args: UserParams = {
            roles: user_roles,
            upload_file_capability: {
                can_upload: raw_data.upload_file_capability.can_upload,
                error_message: raw_data.upload_file_capability.error_message
            },
            member_number: typeof raw_data.member_number !== 'number' ? parseInt(raw_data.member_number) : raw_data.member_number,
            email: raw_data.email
        };
        return new User(args);
    }
}