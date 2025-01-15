import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";

export const createUser = async (data: IUser) => {
    const result = await UserSchema.create({ ...data, active: true });
    return result;
};

export const updateUser = async (id: string, data: IUser) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return result;
};

export const updateUserByEmail = async (email: string, data: IUser) => {
    const result = await UserSchema.findOneAndUpdate({ email: email }, data, {
        new: true,
    });
    return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
    return result;
};

export const deleteUser = async (id: string) => {
    const result = await UserSchema.deleteOne({ _id: id });
    return result;
};

export const getUserById = async (id: string) => {
    const result = await UserSchema.findById(id).lean();
    return result;
};

export const getAllUser = async () => {
    const result = await UserSchema.find({}).lean();
    return result;
}
;export const getPendingUser = async (filter: {}) => {
    const result = await UserSchema.find(filter).lean();
    return result;
};
export const getAllActiveUser = async () => {
    const result = await UserSchema.find({active: true}).lean();
    return result;
};
export const getUserByEmail = async (email: string) => {
    const result = await UserSchema.findOne({ email }).lean();
    return result;
}
export const getUseByDateFilterr = async (start: Date, end: Date) => {
    const result = await UserSchema.find({
        createdAt: {
          $gte: start, // Greater than or equal to start date
          $lte: end,   // Less than or equal to end date
        },
      }).lean();
    return result;
}

