const mime = require('mime-types');
const fs = require('fs');
const path = require('path'), os = require('os');
const config = require('../config');

class FileHandler{
    constructor(){
        //
    }
    Init(){         // start connection to remove file storage server
        return new Promise((resolve, reject)=>{
            try{
                if(!fs.existsSync(path.join(os.homedir(), config.storage.location.base_dir))){
                    console.log('no base');
                    fs.mkdirSync(path.join(os.homedir(), config.storage.location.base_dir));
                }
                if(!fs.existsSync(path.join(os.homedir(), config.storage.location.base_dir, config.storage.location.temp_dir))){
                    console.log('no temp');
                    fs.mkdirSync(path.join(os.homedir(), config.storage.location.base_dir, config.storage.location.temp_dir));
                }
                if(!fs.existsSync(path.join(os.homedir(), config.storage.location.base_dir, config.storage.location.approved_dir))){
                    console.log('no approved');
                    fs.mkdirSync(path.join(os.homedir(), config.storage.location.base_dir, config.storage.location.approved_dir));
                }
                resolve();
            }catch(e){
                reject(e);
            }
        })
    }
    SaveTmpAs(reader, system_file_name){
        return this.__saveFile(reader, this.__getAbsTempFileDirPath(system_file_name))
    }
    MoveFromTmpToApproved(tmp_name, approved_name){
        let self = this;
        return new Promise((resolve, reject)=>{
            try{
                fs.rename(self.__getAbsTempFileDirPath(tmp_name), self.__getAbsApprovedFileDirPath(approved_name), () =>{
                    resolve(true);
                });
            }catch(e) {
                reject(e);
            }
        })
    }
    DeleteTmp(tmp_file, throw_error=true){          //files will be deleted from the tmp dir anyway while cleanup
        let self = this;
        return new Promise(async (resolve, reject)=>{
            try{
                await self.__unlinkFile(self.__getAbsTempFileDirPath(tmp_file));
                resolve(true);
            }catch (e){
                if(throw_error){
                    reject(e);
                }else{
                    resolve(true)
                }
            }
        })
    }
    DeleteApproved(approved_file, throw_error=true){          //files will be deleted from the tmp dir anyway while cleanup
        let self = this;
        return new Promise(async (resolve, reject)=>{
            try{
                await self.__unlinkFile(self.__getAbsApprovedFileDirPath(approved_file));
                resolve(true);
            }catch (e){
                if(throw_error){
                    reject(e);
                }else{
                    resolve(true)
                }
            }
        })
    }
    FetchApproved(approved_file, encoding='utf-8',flag='r'){
        let self = this;
        return new Promise((resolve, reject)=>{
            try{
                resolve(fs.readFileSync(self.__getAbsApprovedFileDirPath(approved_file), {flag}));
            }catch(e){
                reject(e);
            }
        });
    }
    __saveFile(reader, path){
        return new Promise((resolve, reject)=>{
            //TODO check if a cap can be put on read stream even when it is piped to write stream, manual streaming of read stream can be avoided.
            reader.on('error', e =>{
                return reject(e);
            });
            let size = 0;
            let data = [];
            reader.on('data', d => {
                size += d.length;
                if(size > config.storage.max_approved_size){            //max size of file that will be read is 2mb
                    let e = new Error('File size more than allowed.');
                    e.code = 'ERR_FS_FILE_TOO_LARGE';
                    file_stream.destroy(e);
                }
                data.push(d);
            });
            reader.on('end', () => {
                try{
                    let buf = Buffer.concat(data);
                    fs.writeFileSync(path, buf);
                    return resolve(size)
                }catch (e){
                    return reject(e);
                }
            });
        });
    }
    __unlinkFile(path){
        return new Promise((resolve, reject)=>{
            try{
                fs.unlinkSync(path);
                resolve(true);
            }catch (e){
                reject(e);
            }
        });
    }
    __getAbsTempFileDirPath(system_file_name){
        return path.join(os.homedir(), config.storage.location.base_dir, config.storage.location.temp_dir, path.basename(system_file_name));            //TODO push the base path to config
    }
    __getAbsApprovedFileDirPath(system_file_name){
        return path.join(os.homedir(),  config.storage.location.base_dir, config.storage.location.approved_dir, path.basename(system_file_name));            //TODO push the base path to config
    }
    GetExtension(file_name){
        return path.extname(file_name);
    }
    FetchExtensionFor(mime_type){
        let ext = mime.extension(mime_type);
        if(!ext){
            //log error when unable to find proper extensions,
            // the logs can be later parsed and all files with the mime_type can be later updated in the db
            console.error("Unable to find extension for mime_type - ", mime_type);
            return '';
        }
        return ext;
    }

};

module.exports = new FileHandler();
