import UserService, { CreateUserPayload } from "../../services/user"

const queries = {
    getUserToken: async (_: any,payload: {email: string, password: string}) => {
    const token = await UserService.getUsertoken({
        email: payload.email,
        password: payload.password,
    })
    return token;
  },

  getCurrentLoggedInUser: async (_:any, parameters: any, context: any) => {
    if(context && context.user){
        const id = context.user.id;
        const user = await UserService.getUserBYId(id);
        return user

    }
    throw new Error("i dont Know who are you ")
  }

}

const mutations = {
    createUser: async(_:any, payload: CreateUserPayload) =>{
        const res = await UserService.createUser(payload);
        return res.id;
    }
}

export const resolvers = { queries, mutations }