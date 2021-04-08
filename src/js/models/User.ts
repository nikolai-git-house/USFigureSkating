import {UserRole} from "../contracts/AppContracts";

export type UserParams = {
    roles: UserRole[],
    upload_file_capability: UserFileUploadCapabilty,
    member_number: number;
    email: string;
};

type UserFileUploadCapabilty = {
    can_upload: boolean,
    error_message: string
}

export class User {
    private _roles: UserRole[];
    private _upload_file_capability: UserFileUploadCapabilty;
    private _member_number: number = 123456;
    private _email: string = "test@test.com";

    constructor(params: UserParams) {
        this._roles = params.roles;
        this._upload_file_capability = params.upload_file_capability;
        this._email = params.email;
        this._member_number = params.member_number;
    }

    get email(): string {
        return this._email;
    }

    get member_number(): number {
        return this._member_number;
    }

    get upload_file_capability(): UserFileUploadCapabilty {
        return this._upload_file_capability;
    }

    get roles(): UserRole[] {
        return this._roles;
    }

    static blank(): User {
        return new User({
            roles: ["skater"],
            upload_file_capability: {
                can_upload: true,
                error_message: ''
            },
            member_number: -1,
            email: ""
        })
    }
}