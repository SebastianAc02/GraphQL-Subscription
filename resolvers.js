const { PubSub } = require('graphql-subscriptions')
const Message = require('./models/Message')
const User = require('./models/User')
const Person = require('./models/Person')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'Diablo_que_dura_la_chamaquita'
//SUBSCRIPTIONS.CREATED_MESSAGE



const SUBSCRIPTION_EVENTS = {
    PERSON_ADDED : "PERSON_ADDED"
}

const pubsub = new PubSub()



module.exports = {
    Query:{
        /*
        queryName: () => {
            const ans = await fetch(restApi)
            const ans2 = await fetch(restapi2)
            
            const personInfo = {
                name: ans, 
                properties : ans2
            }
            return personinfo 
        }
        */ 
        personCount:()=> {
          
           return  Person.collection.countDocuments},
        allPersons : async(root, args) => 
        {
           
          if(!args.phone)
       return await  Person.find({})

      return Person.find({phone: { $exists: args.phone === 'YES'}})
      
       //return persons.filter(person => args.phone ==="YES"? person.phone:
       //!person.phone )
    
    },
        findPerson: async   (root, args) => {
            const {name} = args
           
            return await Person.findOne({name:name})
        },
        me: async (root, args, context)=>{
            if(!context.currentUser)
            throw new  AuthenticationError('new error')
            if(context.currentUser)
            return await context.currentUser
           
            
        }
       
    },
    Mutation:{

        addPerson: async(root, args, context) =>{ 

           const {currentUser}  =  context

           if(!currentUser) throw new AuthenticationError("not authenticated ")
            
            const person = new Person({...args})

            try{
            await person.save()
            currentUser.friends =  currentUser.friends.concat(person)
            await currentUser.save()
            }catch(e)
            {
                throw new UserInputError(e.message,{
                    invalidArgs: args
                })
            }
            //subscription created in the mutator 
            pubsub.publish(SUBSCRIPTION_EVENTS.PERSON_ADDED, {personAdded: person})
            return person
        },
        editNumber:async (root, args)=>{
            const {name, phone} = args
           const findPerson = await Person.findOne({name:name})
           if(!findPerson) return 
           findPerson.phone = phone 

           try{
        await findPerson.save()
           }catch(e)
           {
            throw new UserInputError(e.message,{
                invalidArgs: args 
            })
           }
           return findPerson

        },
        createUser: (root, args)=> {
            const user = new User({username: args.username})

            return user.save()
            .catch(error=>{
                throw new UserInputError(error.message,{
                    invalidArgs: args 
                })
            })
        },
        login: async (root, args )=> {
            const user = await User.findOne({username: args.username})
            if(!user|| args.password !== 'laneverita'){
                throw new UserInputError('wrong credentials')
            }

            const userfortoken = {
                username : args.username,
                id: user._id
            }

            return {
                value: jwt.sign(userfortoken, JWT_SECRET)
            }
        },
        addFriend: async (root, args, context ) => {
            const {currentUser } = context

            if(!currentUser) throw new AuthenticationError('Error auth')

            const newFriend = await Person.findOne({name: args.name})

            //checar si ya somos amigos 

            const nonFriendsAlready = (newFriend) => 
             !currentUser.friends.map(p => p._id).includes(newFriend._id)

            if(nonFriendsAlready(newFriend)){
                currentUser.friends = currentUser.friends.concat(newFriend)
                await  currentUser.save()
               
            }
            return currentUser

           




        }

    },
    Person:{
        address: (root)=> {
            return {
                street: root.street,
                city: root.city 
            }
        }
    },
    Subscription:{
        personAdded: {
            subscribe : () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.PERSON_ADDED) //just added a name
        }
    }
}




/*{
    Query: {
        message : (_, {ID})=> Message.findById(ID)
    },
    Mutation: {
        async createMessage(_, {messageInput: {text, username}})
        {
            const newmessage = new Message({
                text: text,
                createdBy: username
            })

            const res = await newmessage.save()

            pubsub.publish(SUBSCRIPTIONS.CREATED_MESSAGE, {
                messageCreated:{
                    text:text,
                    createdBy:username
                }
            })

            return {
                id: res._id,
                ...res._doc

            }
        }
    },
    Subscription:{
        messageCreated: {
            subscribe: ()=>  pubsub.asyncIterator(SUBSCRIPTIONS.CREATED_MESSAGE) 
        }
    }
}
*/
