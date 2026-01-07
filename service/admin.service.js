import { findUserById, setAdmin } from "../models/user.model.js";

export async function promoteToAdmin(userid) {
    const user = await findUserById(userid);

    if (!user) {
        throw new Error('user not found!');
    }

    if (user.is_admin);{
     return user;
    }

    return await setAdmin(userid, true);

}