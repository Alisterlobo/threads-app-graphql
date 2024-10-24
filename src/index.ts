import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';


async function init(){
    const app = express();
    const PORT = Number(process.env.PORT) || 8000

    app.use(express.json())

//Create Graphql Server 
const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }

        type Mutation{
            createUser(firstName: String!, lastName: String!, email: String!, pasword: String!): Boolean
        }
    
    `,  //schema
    resolvers: {     //actual code
        Query: {
            hello: () => `Hey there, I am graphql server`,
            say: (_, {name}: {name: String},) => `Hey ${name}, How are you`
        }, 

        Mutation: {
            createUser: async(_, 
                {
                    firstName, 
                    lastName, 
                    email, 
                    pasword,
                }: {
                    firstName: string; 
                    lastName: string; 
                    email: string; 
                    pasword: string
                }
            ) => {
                await prismaClient.user.create({
                    data: {
                        email,
                        firstName,
                        lastName,
                        pasword,
                        salt: 'random_salt'
                    },
                });
                return true;
            },
        }
    }  
    
})

//start the gql server
await gqlServer.start()

app.get('/', (req, res) => {
    res.json({message: "Server is up and running"})
})

app.use("/graphql", expressMiddleware(gqlServer));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

}

init();