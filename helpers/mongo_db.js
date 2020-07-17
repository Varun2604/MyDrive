const { MongoClient, ObjectID } = require("mongodb");
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
    DeleteById(collection, id){
        return this.db.collection(collection).deleteOne({ '_id': id });
    }
    DeleteByCategory(collection, filter_by=null){
        return this.db.collection(collection).deleteMany(filter_by);
    }
    ObjectIDOf(id){
        return new ObjectID(id);
    }
};

module.exports =  new MongoHandler();
