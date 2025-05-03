import argon2 from "argon2";

const hashPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,  
        });
        return hashedPassword;
    }catch(error) {
        throw new Error("Error hashing password: " + error);
    }
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const isValid = await argon2.verify(hashedPassword, password);
        return isValid;
    }catch(error) {
        throw new Error("Error verifying password: " + error);
    }
};
  
export {
    hashPassword,
    verifyPassword
}