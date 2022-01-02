const express = require('express');
const router = express.Router();

function getTasks(req) {
    let tasks = [];
    for (let i = 0; i < 2 + Math.random() * 10; i++) {
        tasks.push({
            text: "bla bla",
            id:i,
            done: false,
        });
    }
    return tasks
}

/* GET tasks page. */
router.get('/', function (req, res, next) {
    res.render('tasks', {titles:"Your tasks", scriptPath:"/javascripts/tasksController.js",tasks:getTasks(req)});
});

router.post('/',function (req, res, next) {
    console.log(req.body)
    res.end("OK");
});

module.exports = router;