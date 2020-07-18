# strong-box (MyDrive)
A simple cloud drive to store your files over the cloud privately and publically. <br/> 
Access API docs [here](https://strong-box.herokuapp.com/api-docs). <br/>
What does strong-box mean you ask ? Check [this](https://www.merriam-webster.com/thesaurus/strongbox) out!

#TODO
1. Unit tests, use mocha
2. Save security configs to a separate config server or secret server, and do not commit to github.
3. Add logger, log all incoming request details, save all logs to files along with log-rotate.
4. Save files in a separate file server
5. **Cron job to clear off hanging assets after 7 days.**
6. Refactor controllers and services.
7. Add folder structure to all files `[enhancement]`
8. Add file streaming capabilities to upload heavy files.
9. Dockerise !!, start using node v13 completely.

## FAQs

### How to start the server
Run `npm install` and then run `npm run start` to start the server at port 8000

### User creation flow ?
Use the `POST /v1/signup` url to register a new user with the system (Refer [docs](https://strong-box.herokuapp.com/api-docs)) <br/>
Once registered, the `POST /v1/generate_token` url can be used with the Basic auth to generate a new token, that will be valid for a year.
Use the generated token against the header `Authorization` key for the following API calls.

###  File creation flow ?
First, create a temporary asset using the api - `POST /api/v1/assets`, the API returns an asset id, which will required to link the asset to the file. 
The temporary asset has an expiry of 7 days, and a separate worker will clean up loosely hanging assets.<br/> 
Once the asset id is retrieved, a file can be created with the asset id using the api `POST /api/v1/files`.
Once the file is created, it can be retrieved using the api `GET /api/v1/files/{id}/assets`. <br/>
Currently, as file streaming is not made available, the file size that can be uploaded is defaulted to 2MB, but streaming capabilities are in the roadmap.

### What db is used in the backend ?
Mongo db is used in the backend, and is rented from https://mongodb.com.
The db basically has 3 collections:
1. users - to store the user credentials, and basic user details
2. files - to store all the file related data.
3. assets - to store the temporary asset data. Once the asset is linked to a file, the entry from the table is cleared.

### How/Where are the assets stored and managed ?
On server start up, if not already present, the server creates `$HOME/file/tmp` and a `$HOME/file/approved` dir. The temporary assets are stored inside 
`$HOME/files/tmp` directory, and moved to `$HOME/files/approved` directory once the asset is linked to a file for more safety. <br/>
The `$HOME/files/tmp` is cleaned up on a regular basis (once a day) using a worker/cron job, and it is ensured that there are no hanging assets left for more that 7 days.  
 
### Where is the service hosted ?
The service is hosted in a free dyno provided by [heroku](https://heroku.com)
