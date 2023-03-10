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

        expressAppInstance.listen(3000, ()=>{
            console.log('Server started listening at the following url http://localhost:3000/')
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
    cricket_team`;
    const playersArray = await dataBaseConnectionObject.all(getPlayersQuery)
       
    const playersArrayWithCamelCaseProperties = []
    playersArray.forEach((eachPlayerObject, len, arr)=>{ 
        let tempPlayerObject = {
            playerId : eachPlayerObject["player_id"],
            playerName: eachPlayerObject["player_name"],
            jerseyNumber: eachPlayerObject["jersey_number"],
            role: eachPlayerObject["role"]
        }
        playersArrayWithCamelCaseProperties.push(tempPlayerObject)
    })

    response.send(playersArrayWithCamelCaseProperties)
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
        response.send('Player Added to Team')
    }catch(e){
        console.log(`SQL error ${e.message}`)
    }
})

//successfully added addPlayer API


//getPlayer API

expressAppInstance.get('/players/:requiredPlayerToBeDisplayed/', async(request, response)=>{
    const{requiredPlayerToBeDisplayed} = request.params;
    const getPlayerQuery = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${requiredPlayerToBeDisplayed}
    `
   try{
    const responseObject =  await dataBaseConnectionObject.get(getPlayerQuery)
    
    let PlayerObject = {
        playerId : responseObject["player_id"],
        playerName: responseObject["player_name"],
        jerseyNumber: responseObject["jersey_number"],
        role: responseObject["role"]
    }

    response.send(PlayerObject)
   }
   catch(e){
       console.log(`SQL error ${e.message}`)
   }
})

//Successfully Defined getPlayers API


//updatePlayerList API

expressAppInstance.put('/players/:playerIdToBeUpdated/', async(request, response)=>{
    const {playerIdToBeUpdated} = request.params;
    const updatedPlayerDetails = request.body;
    const{playerName,jerseyNumber,role} = updatedPlayerDetails;

    const updatePlayerQuery = `
    UPDATE cricket_team
    SET player_name = '${playerName}', 
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE player_id = ${playerIdToBeUpdated}
    `
    try{
        await dataBaseConnectionObject.run(updatePlayerQuery)
        response.send('Player Details Updated')
    }catch(e){
        console.log(`SQL Error ${e.message}`)
    }    
})


//successfully added the API updatePlayer


//DeletePlayer API

expressAppInstance.delete('/players/:playerIdToBEDeleted/', async(request, response)=>{
    const {playerIdToBEDeleted} = request.params;
    const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerIdToBEDeleted}
    `
    try{
        await dataBaseConnectionObject.run(deletePlayerQuery)
        response.send('Player Removed')    
    }catch(e){
        console.log(`SQL Error ${e.message}`)
    }
    
})

//successfully defined all the APIs


module.exports = expressAppInstance

