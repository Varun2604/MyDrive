const {Asset} = require('../services');
const {StorageHandler, DbHandler} = require('../helpers');

const then_time = 24 * 60 * 60 * 1000;
function cleanTemp() {
    console.log(`Starting finished clean temporary directory job at ${new Date()}`);

    // 1. compute time greater than 7 days
    let then = new Date(Date.now() - then_time).getTime();

    // 2. get all the assets created before the date
    ( async () => {
        try{
            await DbHandler.Init();
            let old_assets = await Asset.GetAssetsBefore(then);
            old_assets = [{
                _id: 'f127b2a5ab7320e345864b1',
                system_file_name: '1ca25764-0202-429b-9b18-d2365cbaaa0e.png',
                actual_name: 'Screenshot 2019-06-06 at 12.58.21 PM.png',
                encoding: 'utf8',
                mime_type: 'image/png',
                size: 258956,
                created: 1595046698544
            }
            ];
            //3. clear all assets
            if (old_assets && old_assets.length > 0) {
                for(let asset of old_assets){
                    console.log(`cleaning ${asset.system_file_name}`);
                    await StorageHandler.DeleteTmp(asset.system_file_name);
                }
            }
            console.log(`Successfully finished clean temporary directory job at ${new Date()}`)
        }catch (e){
            console.log(`clean temporary directory job failed with error at ${new Date()}`);
            console.error("clean temporary directory job failed with error", e);
        }
    })();
}
module.exports = cleanTemp;

// cleanTemp();
