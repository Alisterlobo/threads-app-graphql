import {createHmac,randomBytes} from 'node:crypto'
import JWT from 'jsonwebtoken';
import { prismaClient } from "../lib/db"

const JWT_SECRET = 'Batman@123'

export interface CreateUserPayload{
    firstName: string
    lastName?: string
    email: string
    password: string
}

export interface GetUserTokeyPayload{
    email: string;
    password: string;
}

class UserService{

    private static generateHash(salt: string, password: string){
        const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
        return hashedPassword;
    }

    public static createUser(payload:CreateUserPayload){
        const {firstName, lastName, email, password} = payload;

        
        const salt = randomBytes(32).toString('hex');
        const hashedPassword = UserService.generateHash(salt,password)

        return prismaClient.user.create({
            data: {
                firstName,
                lastName: lastName as string,
                email,
                password: hashedPassword,
                salt,
    
            },
        })
    }

    private static getUserEmail(email:string){
        return prismaClient.user.findUnique({ where:{ email}})

    }

    public static async getUsertoken(payload:GetUserTokeyPayload){
        const {email,password} = payload;
        const user = await UserService.getUserEmail(email)
        if(!user) throw new Error('User not found')
        
        const userSalt = user.salt;
        const userHashedPassword = UserService.generateHash(userSalt,password)

        if(userHashedPassword !== user.password)
            throw new Error('Invalid password')

        //Generate Token
        const token = JWT.sign({ id: user.id, email: user.email}, JWT_SECRET)
        return token;
    }
}


export default UserService;