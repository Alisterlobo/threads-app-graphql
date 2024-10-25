import { ApolloServer } from '@apollo/server';
import {User} from './user'

async function createApolloGraphqlServer(){
    const gqlServer = new ApolloServer({
        typeDefs: `
            ${User.typeDefs}
            type Query {
             ${User.queries}
            
            }
    
            type Mutation{
                 ${User.mutations}
            }
        
        `,  //schema


        resolvers: {     //actual code
            Query: {
                ...User.resolvers.queries,
              
            }, 
           
            Mutation: {
                ...User.resolvers.mutations,
             
            }
        }  
        
    })
    
    //start the gql server
    await gqlServer.start()
    
    return gqlServer;
}

export default createApolloGraphqlServer;