const db = require('../db')
const argon2 = require('argon2')
var jwt = require('jsonwebtoken')
require('dotenv').config();

const date = new Date();

today = `${day}/${month}/${year}`


const UserRegister = async(req, res) => {
    const body = req.body;

    let select = "SELECT * FROM user WHERE email = ?;"
    let connect = db.connection()

    const hash = await argon2.hash(body.password);

    try {
        // on lui demande de promesse afin de savoir si il va bien renvoyer les données
        await new Promise((resolve, reject) => {
            // si l'execution a bien eu lieu 
            let result = connect.execute(select,[body.email],  function(err, results, fields) {
                // si lemail existe déjà on renvoi erreur dans le catch
                if (results.length > 0) {
                    return reject(true)
                }
                // sinon il continue son bout de chemin
                return resolve(false)
            })
    
        })
    } catch (error) {
        return res.status(409).json({
            error: true,
            message: ["L'utilisateur a déjà un compte"]
        })
    } 

    let sql = "INSERT INTO user (firstname, lastname, email, phone, password, CreatedAt, UpdatedAt, IsVerify, role) VALUES (?,?,?,?,?,?;?,?,?);"
    let array = [body.firstname, body.lastname, body.email, body.phone, hash,today, today, false, 'customer' ]
    let requete = userModel.select(sql, array, connect)
    db.disconnect(connect)

    // rechercher les emails correspondant et mettre une erreur qui dit que l'email existe déjà 
    
    return res.status(200).json({
        error: true,
        message: ['']
    })
}



const UserLogin = async(req, res) => {
    const body = req.body;

    let select = "SELECT * FROM user WHERE email = ?;"
    let connect = db.connection();

    try {
        // on lui demande de promesse afin de savoir si il va bien renvoyer les données
        const resultat = await new Promise((resolve, reject) => {
            // si l'execution a bien eu lieu 
            
            let result = connect.execute(select,[body.email],  function(err, results, fields) {
                // si lemail existe déjà on renvoi erreur dans le catch
                // console.log(results)
                if (results.length > 0) {
                    return resolve(results)
                }
                // sinon il continue son bout de chemin
                return reject(true)
            })
    
        })
        // console.log(resultat)
        if (!await argon2.verify(resultat[0].password, body.password)) {
            return res.status(409).json({
                error: true,
                message: ["Password/User incorrecte"]
            })
        } 

        var token = jwt.sign({ email: resultat[0].email }, process.env.JWT_SECRET_KEY);
    } catch (error) {
        return res.status(409).json({
            error: true,
            message: ["Password/User incorrecte"],
        })
    } 


    // rechercher les emails correspondant et mettre une erreur qui dit que l'email existe déjà 
    
    return res.status(200).json({
        error: true,
        message: [''],
        jwt : token

    })
}
module.exports = {UserLogin, UserRegister}