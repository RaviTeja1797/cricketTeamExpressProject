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
            dataBaseConnectionObject = await open({
                filename : dbPath,
                driver : sqlite3.Database
            })
        }catch(e){
            console.log(`Database Error ${e.message}`)
            process.exit(1)
        }

        expressAppInstance.listen(3011, ()=>{
            console.log('Server started listening at the following url http://localhost:3011/')
        })
        
}

initializeDBAndServer() //called the function to get database connection object and initialize server

//lets check if we are properly getting the database connection object and initializing the server correctly
//As per my verification the code is working as intended

//Lets now define the APIs


//getPlayersList API

expressAppInstance.get('/players/', async (request, response)=>{
    const getPlayersQuery = `
    SELECT 
    * 
    FROM 
    cricket_team 
    ORDER BY player_id;`;
    const playersArray = await dataBaseConnectionObject.all(getPlayersQuery)
    console.log(playersArray)
    response.send(playersArray);
})

//Successfully defined the api getPlayers


//addPlayer API

expressAppInstance.post('/players/', async(request, response)=>{
    const playerDetails = request.body;
    const {playerName,jerseyNumber,role} = playerDetails;
    const addPlayerQuery = `
        INSERT INTO cricket_team(player_name,jersey_number,role)
        VALUES('${playerName}',${jerseyNumber},'${role}')`;
    try{    
        await dataBaseConnectionObject.run(addPlayerQuery)
        response.send('Player added to team')
    }catch(e){
        console.log(`SQL error ${e.message}`)
    }
})

//successfully added addPlayer API


//getPlayer API

expressAppInstance.get('/players/:playerId/', async(request, response)=>{
    const{playerId} = request.params;
    const getPlayerQuery = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId}
    `
   try{
    const responseObject =  await dataBaseConnectionObject.get(getPlayerQuery)
    response.send(responseObject)
   }
   catch(e){
       console.log(`SQL error ${e.message}`)
   }

})

//Successfully Defined getPlayers API


//


