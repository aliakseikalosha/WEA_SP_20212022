const express = require('express');
const router = express.Router();
const db = require('../database');
const dayjs = require('dayjs');
const bandCharsInUsernameRegex =  /([^a-zA-Z\S\.]|[0-9])/gm;

function checkNameForBannedChars(name){
    if(name.match(bandCharsInUsernameRegex)){
        return false;
    }
    return true;
}

async function hasUser(name, password) {
    if(checkNameForBannedChars(name)){
        let user = await db.getUser(name, password);
        if(user){
            return true;
        }
    }
    return false;
}

/* GET tasks page. */
router.get('/', function (req, res, next) {
    if(req.cookies.authorized){
        res.redirect('/tasks');
        return;
    }
    res.render('login', {titles:"Login", scriptPath:"/javascripts/loginController.js"});
});

router.post('/',async function (req, res, next) {
    if(await hasUser(req.body.username, req.body.password)){
        let token =  await db.updateToken(req.body.username);
        let options = {
            secure: true,
            httpOnly: true,
            expires: dayjs().add(1, "days").toDate(),
            sameSite: 'strict',
        };
        res.cookie('token', token,options).cookie('authorized', 'true',options).redirect("/tasks");
    }
    console.log(req.body);
    res.render('login', {titles:"Login", scriptPath:"/javascripts/loginController.js"});
});

module.exports = router;