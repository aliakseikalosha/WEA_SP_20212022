const express = require('express');
const router = express.Router();
const db = require('../database');
const bandCharsInUsernameRegex =  /([^a-zA-Z\S\.]|[0-9])/gm

function checkNameForBannedChars(name){
    if(name.match(bandCharsInUsernameRegex)){
        return false;
    }
    return true;
}

function getUser(name, password) {
    return db.getUser(name, password);
}

async function hasUser(name, password) {
    if(checkNameForBannedChars(name)){
        let user = await db.getUser(name,password);
        if(user){
            return true;
        }
    }
    return false;
}

/* GET tasks page. */
router.get('/', function (req, res, next) {
    res.render('login', {titles:"Login", scriptPath:"/javascripts/loginController.js"});
});

router.post('/',async function (req, res, next) {
    if(await hasUser(req.body.username, req.body.password)){
        let token =  await db.updateToken(req.body.username);
        res.cookie('token', token).cookie('authorized', 'true').redirect("/tasks");
    }
    console.log(req.body);
    res.render('login', {titles:"Login", scriptPath:"/javascripts/loginController.js"});
});

module.exports = router;