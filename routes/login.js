const express = require('express');
const router = express.Router();
const bandCharsInUsernameRegex =  /([^a-zA-Z\S\.]|[0-9])/gm
function checkNameForBannedChars(name){
    if(name.match(bandCharsInUsernameRegex)){
        return false;
    }
    return true;
}

function tryLogin(name, password) {
    return false;
}

function hasUser(name, password) {
    if(checkNameForBannedChars(name)){
        if(tryLogin(name, password)){
            return true;
        }
    }
    return false;
}

/* GET tasks page. */
router.get('/', function (req, res, next) {
    res.render('login', {titles:"Login", scriptPath:"/javascripts/loginController.js"});
});

router.post('/',function (req, res, next) {
    if(hasUser(req.body.name, req.body.password)){
        res.cookie('authorized', 'true').redirect("/tasks");
    }
    console.log(req.body);
    res.end("OK");
});

module.exports = router;