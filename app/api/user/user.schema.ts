
import mongoose from "mongoose";
import { type IUser } from "./user.dto";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const hashPassword = async (password: string) => {
        const hash = await bcrypt.hash(password, 12);
        return hash;
};

const UserSchema = new Schema<IUser>({
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: {type: Number},
        age: {type: Number},
        qualification: { type: String},
        kycDocument: { type: String },
        accessToken: { type: String },
        refToken: { type: String },
        active: { type: Boolean, required: true, default: true },
        factorAuthenticate: { type: Boolean, required: true, default: true },
        password: { type: String },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
        if (this.password) {
                this.password = await hashPassword(this.password);
        }
        next();
});

export default mongoose.model<IUser>("user", UserSchema);
