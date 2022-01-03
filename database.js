const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    }
)

function initDB() {
    let hasUsers = false;
    all(`SELECT name
         FROM sqlite_master
         WHERE name = 'users'`, (err, row) => {
        if (err) {
            throw err;
        }
        console.log(row);
        hasUsers = true;
    }).then((rows) => {
        if (rows.length > 0) {
            return;
        }
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users
                (
                    username        TEXT PRIMARY KEY,
                    password        TEXT NOT NULL,
                    token           TEXT,
                    expiration_date TEXT
                );
            `).run(`
                INSERT INTO users(username, password)
                VALUES ('test', 'test'),
                       ('test.one', 'test1'),
                       ('test.two', 'test2');
            `).run(
                `
                    CREATE TABLE IF NOT EXISTS tasks
                    (
                        task_text  TEXT    NOT NULL,
                        task_state INTEGER NOT NULL,
                        username   TEXT    NOT NULL,
                        task_id    INTEGER PRIMARY KEY AUTOINCREMENT,
                        FOREIGN KEY (username)
                            REFERENCES users (username)
                            ON DELETE CASCADE
                            ON UPDATE CASCADE
                    );
                `
            );
        });
    });
}

async function getUser(username, password) {
    const sql = `
        SELECT *
        FROM users
        WHERE username == (?)
          AND password == (?)
    `;
    let user = await all(sql, [username, password]);
    return user.length === 1 ? user[0] : null;
}

async function validateToken(token){
    let user = await getUserByToken(token);
    if(user){
        return true;
    }
    return false;
}

async function getUserByToken(token) {
    const sql = `
        SELECT *
        FROM users
        WHERE token == (?)
    `;
    let user = await all(sql, [token]);
    return user.length === 1 ? user[0] : null;
}

async function updateToken(username) {
    //https://learnersbucket.com/examples/javascript/unique-id-generator-in-javascript/
    const guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    let token = guid();
    let sql = `
        UPDATE users
        SET token           = (?),
            expiration_date = datetime('now', '+1 day')
        WHERE username = (?)
    `
    let res = await run(sql, [token, username]);
    return token;
}

async function addNewTask(token, taskText) {
    let user = await getUserByToken(token);
    const sql = `
        INSERT INTO tasks(username, task_text, task_state)
        VALUES ((?), (?), 0)
    `
    let res = await run(sql, [user.username, taskText]);
    console.log("addNewTask", res);
}


async function updateTask(token, taskId, taskText, taskState) {
    let task = await getTask(token, taskId);
    if(!task){
        return;
    }
    if (!taskText) {
        taskText = task.task_text;
    }
    if (!taskState) {
        taskState = !task.task_state;
    }else{
        taskState = task.task_state;
    }
    taskState = taskState ? 0 : 1;
    const sql = `
        UPDATE tasks
        SET task_state = (?),
            task_text  = (?)
        WHERE task_id = (?)
    `
    let res = await run(sql,[taskState, taskText, taskId]);
    console.log("updateTask", res);
}

async function deleteTask(token, taskId) {
    let task = await getTask(token, taskId);
    if(!task){
        return;
    }
    const sql = `
        DELETE FROM tasks
        WHERE task_id = (?)
    `
    let res = await run(sql,[taskId]);
    console.log("deleteTask", res);
}

async function getTask(token, taskId) {
    let sql = `
        SELECT *
        FROM tasks
        WHERE username IN (SELECT username FROM users WHERE token == (?))
          AND task_id == (?)
    `;
    let res = await all(sql, [token, taskId]);
    console.log(res);
    return res.length === 1 ? res[0] : null;
}

async function getAllTasks(token) {
    let sql = `
        SELECT *
        FROM tasks
        WHERE username IN (SELECT username FROM users WHERE token == (?))
    `;
    let res = await all(sql, [token]);
    console.log(res);
    return res;
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.log('Error running sql ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.log('Error running sql: ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


module.exports = {initDB, addNewTask, updateTask, deleteTask, getAllTasks, getUser, updateToken, validateToken};