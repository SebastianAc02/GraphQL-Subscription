const {gql} = require('apollo-server')


module.exports = gql`

enum YesNo{
    YES
    NO
  }

  type Address{
    street: String!,
    city : String!
  }

  type Person{
    name: String!,
    phone: String,
    address: Address!,
    id: ID!
  },

  type User{
    username: String!,
    friends: [Person]!,
    id:ID!
  },

  type Token {
    value:String!
  },

  type Query{
    personCount: Int!,
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person,
    me: User
  }

  type Mutation{
    addPerson(
        name: String !
        phone : String
        street: String!
        city : String !
    ): Person

    editNumber(
        name: String!
        phone:String!

    ):Person

    createUser(
        username: String!
    ): User

    login(
        username: String!
        password: String!
    ):Token

    addFriend(
        name: String!
    ): User
  }

  type Subscription{
    personAdded: Person!

  }

`


/*
module.exports =  gql`
type Message{
    text : String,
    createdBy: String
}

input MessageInput{
    text: String,
    username : String 
}

type Query{
    message(id: ID!):Message
}

type Mutation {
    createMessage(messageInput: MessageInput):Message

}

type Subscription{
    messageCreated: Message
}


`*/

