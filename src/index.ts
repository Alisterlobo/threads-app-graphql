import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

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
    
    `,  //schema
    resolvers: {     //actual code
        Query: {
            hello: () => `Hey there, I am graphql server`,
            say: (_, {name}: {name: String},) => `Hey ${name}, How are you`
        }, 
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