const express = require('express');
const router = express.Router();
const db = require('../database');


/* GET tasks page. */
router.get('/',  async function (req, res, next) {
    if(!req.cookies.authorized){
        res.redirect("/login");
        return;
    }
    res.render('tasks', {titles:"Your tasks", scriptPath:"/javascripts/tasksController.js",tasks: await db.getAllTasks(req.cookies.token)});
});

router.post('/',async function (req, res, next) {
    console.log(req.body)
    if(!req.cookies.authorized){
        res.redirect("/login");
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
    res.end("OK");
});

module.exports = router;