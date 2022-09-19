
const mongoose = require('mongoose')

MONGO_URI = "mongodb+srv://SebasGecko:nzrWrmCWgb8D1Q5p@backendcluster.l86reoj.mongodb.net/graphql?retryWrites=true&w=majority";


mongoose.connect(MONGO_URI).then(() => {
    console.log("connected to mongo db ");
  });

