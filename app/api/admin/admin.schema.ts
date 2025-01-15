
import mongoose from "mongoose";
import { type IAdmin } from "./admin.dto";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const hashPassword = async (password: string) => {
        const hash = await bcrypt.hash(password, 12);
        return hash;
};

const AdminSchema = new Schema<IAdmin>({
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
}, { timestamps: true });

AdminSchema.pre("save", async function (next) {
        if (this.password) {
                this.password = await hashPassword(this.password);
        }
        next();
});

export default mongoose.model<IAdmin>("admin", AdminSchema);
