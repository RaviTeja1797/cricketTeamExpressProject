const express = require("express")   //imported express package which is a server side web frame work based on JavaScrip
const {open} = require("sqlite")    //imported open method from sqlite third party NPM Package
const sqlite3 = require("sqlite3") //imported sqlite3 third party NPM package
const path = require('path')       //imported inbuilt package path

const expressAppInstance = express();       //Created express instance
expressAppInstance.use(express.json())     //if we are receiving any JSON object, we are making express app instance to understand and parse it dynamically


const dbPath = path.join(__dirname, 'cricketTeam.db') //Defined a variable for storing the path of cricketTeam Database
let dataBaseConnectionObject = null       //Defined a variable for storing the dataBaseConnection object. We used let because we are going to reassign it

//lets now define a function that gets Database connection object and initializes server 
//We are performing the operation on the database it is an asynchronous operation. Hence we are using asynchronous function 
const initializeDBAndServer = async() =>{
        try{
            dataBaseConnectionObject = await  dataBaseConnectionObject.open({
                filename : dbPath,
                driver : sqlite3.Database
            })
        }catch(e){
            console.log(`Database Error ${e.message}`)
        }

        expressAppInstance.listen(3010, ()=>{
            console.log('Server started listening at the following url http://localhost:3010/')
        })
        
}

initializeDBAndServer() //called the function to get datebase connection object and initilize server