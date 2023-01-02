# Used mongodb commands:
>     show dbs
> returning list of not empty databases

>     use nosql_db
> connecting to exist database or creating new empty database (new database will be hidden in the list of databases)

>     db.{collection}.insertOne({...})
> creating new document in some collection content should be written in JSON format

>     db
> shows selected database

>     db.createUser(
>         {
>             user: "readWriteUser",
>             pwd: "somepassword",
>             roles: [
>                 {
>                     role: "readWrite",
>                     db: "nosql_db"
>                 }
>             ]
>         }    
>     )
> creating user with some roles. All roles should be attached to database. Role definitions described in https://www.mongodb.com/docs/manual/reference/built-in-roles/
> 
> For password recommended to use **passwordPrompt()** function. It prompts you to enter the password.

>     db.{collection}.find({criteria})
> finding documents in collection by same criteria. Pass empty criteria to fetch all documents

>     db.{collection}.updateOne({criteria}, {$set: {updatedFields}})
> updating some document fields. In criteria, you should set which documents need to update. Updated fields should contain only fields what should be updated

>     db.{collection}.deleteOne({criteria})
> deleting documents by some criteria



