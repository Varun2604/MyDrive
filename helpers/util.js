module.exports = class Utils{
    static CheckMandatoryFields(obj = null, mandatory_keys = []){
        if(obj == null || mandatory_keys.length === 0){
            return [];
        }
        for(let k in obj){
            if(obj.hasOwnProperty(k)){
                let idx = mandatory_keys.indexOf(k);
                if(idx !== -1){
                    mandatory_keys.splice(idx, 1)
                }
            }
        }
        return mandatory_keys;
    }
}
