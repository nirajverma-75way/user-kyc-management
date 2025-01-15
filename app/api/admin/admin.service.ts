
import { type IAdmin } from "./admin.dto";
import AdminSchema from "./admin.schema";

export const createAdmin = async (data: IAdmin) => {
    const result = await AdminSchema.create({ ...data, active: true });
    return result;
};

export const updateAdmin = async (id: string, data: IAdmin) => {
    const result = await AdminSchema.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return result;
};

export const editAdmin = async (id: string, data: Partial<IAdmin>) => {
    const result = await AdminSchema.findOneAndUpdate({ _id: id }, data);
    return result;
};

export const deleteAdmin = async (id: string) => {
    const result = await AdminSchema.deleteOne({ _id: id });
    return result;
};

export const getAdminById = async (id: string) => {
    const result = await AdminSchema.findById(id).lean();
    return result;
};

export const getAllAdmin = async () => {
    const result = await AdminSchema.find({}).lean();
    return result;
};
export const getAdminByEmail = async (email: string) => {
    const result = await AdminSchema.findOne({ email }).lean();
    return result;
}

