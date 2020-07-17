const mime = require('mime-types');
const fs = require('fs');
const path = require('path'),
      os = require('os');
const { COPYFILE_EXCL } = fs.constants;

class FileHandler{
    constructor(){
        //
    }
    saveTmpAs(file, system_file_name){
        let save_to = this.__getAbsTempFileDirPath(system_file_name);
        return this.__saveFile(file, save_to)
    }
    copyFromTmpToApproved(tmp_name, approved_name){
        let self = this;
        return new Promise((resolve, reject)=>{
            try{
                fs.copyFile(self.__getAbsTempFileDirPath(tmp_name), self.__getAbsApprovedFileDirPath(approved_name), COPYFILE_EXCL, () =>{
                    resolve(true);
                });
            }catch(e) {
                reject(e);
            }
        })
    }
    deleteTmp(tmp_file, throw_error=true){          //files will be deleted from the tmp dir anyway while cleanup
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
    deleteApproved(approved_file, throw_error=true){          //files will be deleted from the tmp dir anyway while cleanup
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
    __saveFile(file, path){
        return new Promise((resolve, reject)=>{
            file.pipe(fs.createWriteStream(path)).on("error", e =>{
                return reject(e);
            }).on('close',()=>{
                resolve(true);
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
        return path.join(os.homedir(), "files", "tmp", path.basename(system_file_name));            //TODO push the base path to config
    }
    __getAbsApprovedFileDirPath(system_file_name){
        return path.join(os.homedir(), "files", "approved", path.basename(system_file_name));            //TODO push the base path to config
    }
    getExtension(file_name){
        return path.extname(file_name);
    }
    fetchExtensionFor(mime_type){
        let ext = mime.extension(mime_type);
        if(!ext){
            //log error when unable to find proper extensions,
            // the logs can be later parsed and all files with the mime_type can be later updated in the db
            console.error("Unable to find extension for mime_type - ", mime_type);
            return '';
        }
        return ext;
    }
    getSize(file){
        return fs.sta
    }
};

module.exports = new FileHandler();
