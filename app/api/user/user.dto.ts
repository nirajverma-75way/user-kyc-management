
import { type BaseSchema } from "../../common/dto/base.dto";

export interface IUser extends BaseSchema {
        name: string;
        age?: number;
        email: string;
        phone?: number;
        active: boolean;
        password?: string;
        qualification?: string;
        kycDocument?: string;
        factorAuthenticate: boolean;
        accessToken?: string;
        refToken?: string;
}
