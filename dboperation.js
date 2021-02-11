var config = require('./dbconfig');
const sql = require('mssql');

async function getUsers(){
    try{
        let pool =await sql.connect(config);
        let users =await pool.request().query('SELECT userId,userName,CONVERT (varchar,dob,103) AS dob,gender FROM userTable');
        return users.recordsets;
    }catch(error){
        console.log(error);
    }
}

module.exports={
    getUsers:getUsers
}