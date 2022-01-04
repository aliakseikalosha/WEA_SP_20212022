const express = require('express');
const router = express.Router();
const db = require('../database');
const {validateToken} = require("../database");


/* GET tasks page. */
router.get('/',  async function (req, res, next) {
    if(req.cookies.authorized){
        if(await validateToken(req.cookies.token)){
            res.render('tasks', {titles:"Your tasks", scriptPath:"/javascripts/tasksController.js",tasks: await db.getAllTasks(req.cookies.token)});
            return;
        }
    }
    res.clearCookie('authorized').clearCookie('token').redirect("/login");
});

/*POST task update create*/
router.post('/',async function (req, res, next) {
    if(!(req.cookies.authorized && await validateToken(req.cookies.token))){
        res.clearCookie('authorized').clearCookie('token').redirect("/login");
        return;
    }
    if(req.body.task === "add"){
        await db.addNewTask(req.cookies.token, req.body.text);
    }
    if(req.body.task === "updateText" && parseInt(req.body.id)){
        await db.updateTask(req.cookies.token, parseInt(req.body.id), req.body.text,false);
    }
    if(req.body.task === "updateStatus" && parseInt(req.body.id)){
        await db.updateTask(req.cookies.token, parseInt(req.body.id), null, true);
    }
    if(req.body.task === "delete" && parseInt(req.body.id)){
        await db.deleteTask(req.cookies.token, parseInt(req.body.id));
    }
    res.redirect("/tasks");
});

/*API GET TASK JSON*/
router.get('/api', async function (req, res, next) {
    if(req.query.username && req.query.password){
        let user = await db.getUser(req.query.username, req.query.password);
        if(user){
            res.json({task: await db.getAllTasks(user.token)});
            return;
        }
    }
    res.json({error:"bad password or username"});
});

module.exports = router;