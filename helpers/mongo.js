const { MongoClient } = require("mongodb");
const config = require("../config");

const mongoURI = `mongodb+srv://${config.mongo.user}:${config.mongo.password}@${config.mongo.host}/${config.mongo.db_name}?retryWrites=true&w=majority`;
class MongoHandler{
    Init(){
        let self = this;
        return new Promise(async (resolve, reject)=>{
            try{
                console.log("constructing a new mongo connection");
                let client = new MongoClient(mongoURI, {
                    sslValidate:false, //TODO get the cert and turn it to true
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                client.connect((err, client) => {
                    if(err != null){
                        reject(err);
                    }else {
                        self.client = client;
                        self.db = client.db();
                        resolve(true);
                    }
                });

            }catch (e){
                reject(e);
            }
        })
    }
    Insert(collection, document){
        return this.db.collection(collection).insertOne(document);
    }
    Find(collection = null, search_by = null){
        return this.db.collection(collection).find(search_by).toArray();
    }
    Update(collection, document){

    }
    Delete(collection, document){

    }
};

// let instance =;
//
// (async () => {
//     instance.Init().then(()=>{          //handle resolve
//         console.log("Initialised mongo db instance");
//     }, ()=>{
//         console.log("Error while mongo db instance");
//     }).catch(()=>{
//
//     })
// })();

// let mongocli = {
//
//     // the client connection
//     client : null ,
//
//     // the default strong-box db
//     db : null,
//
//     /*
//      * Mongo Utility: Connect to client */
//
//     clientConnect: async () => (
//
//         client = await (() => (new Promise((resolve, reject) => (
//
//                 MongoClient.connect('mongodb+srv://mongo-admin:Mnbv@1234@cluster0.ocafy.mongodb.net/strong-box?retryWrites=true&w=majority', {
//                         sslValidate:false, //TODO get the cert and turn it to true
//                         useNewUrlParser: true,
//                         useUnifiedTopology: true,
//                         replicaSet: 'repl-set-name'
//                     },
//                     (err, client) => {
//                         if(err != null ) {
//                             console.error("Error while fetching mongo connection pool", err);
//                             reject(err);
//                         }else{
//                             console.log("starting mongo connection pool");
//                             mongocli.client = client;
//                             mongocli.db = client.db();
//                             resolve(true);
//                         }
//
//                     })
//             )
//         )))()),
//
//
//     /*
//      * Mongo Utility: Close client */
//
//     clientClose: async () => {
//         this.client.close();
//         return true;
//     }
// };

module.exports =  new MongoHandler();
