const router = require("express").Router();
const pool = require("../db");
const logger = require("../utils/logger");

// Get all tasks
router.get("/", async (req, res) => {
    try {
        const userId = req.session?.user?.userId;
        // logger.info(userId);
        const allTasks = await pool.query(`
            SELECT 
                task.id as id, 
                description, 
                is_completed, 
                time_of_creation,
                date, 
                time, 
                folder.name as folder_name,
                folder.id as folder_id 
            FROM task
                LEFT JOIN folder ON folder.id = task.folder_id
            WHERE task.user_id = $1
            ORDER BY 
                time_of_creation DESC;
            `, [userId]);
        // Feedback to client
        res.json(allTasks.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// Update task:
// Check or uncheck
// Edit description, dates and etc.
router.put("/:id", async (req, res) => {
    try {
        const userId = req.session?.user?.userId;
        const id = req.params.id;
        const { description, date, time, folder_id } = req.body;
        if (!description) {
            const changeTaskStatus = await pool.query(`
            UPDATE
                task
            SET
                is_completed = NOT task.is_completed
            WHERE
                id = $1 AND user_id = $2;
            `,
                [id, userId]
            );
            const isUpdateSuccessful = changeTaskStatus.rowCount > 0;
            if (!isUpdateSuccessful) return res.status(404).json({ messageToUser: "No such task related to this user" });
        } else {
            const editTask = await pool.query(`
            UPDATE
                task
            SET
                description = $2,
                date = $3,
                time = $4,
                folder_id = $5
            WHERE
                id = $1 AND user_id = $6;
            `,
                [id, description, date, time, folder_id, userId]);
            const isUpdateSuccessful = editTask.rowCount > 0;
            if (!isUpdateSuccessful) return res.status(404).json({ messageToUser: "No such task related to this user" });
        }
        res.json({ messageToUser: "Task has been successfully updated!" });
    } catch (error) {
        console.error(error.message);
    }
})


// Create a task

router.post("/", async (req, res) => {
    try {
        const { description, date, time, folder_id } = req.body;
        const userId = req.session?.user?.userId;
        const newTodo = await pool.query(`
            INSERT INTO
                task (description, date, time, folder_id, user_id)
            VALUES
                ($1, $2, $3, $4, $5);
            `, [description, date, time, folder_id, userId]);
        if (newTodo.rowCount !== 1) return res.status(400).json("Failed to create new task");
        res.json({ messageToUser: "New task has been created" });
    } catch (error) {
        console.error(error.message);
    }
});

// Delete task

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.session?.user?.userId;
        const delTask = await pool.query(`
        DELETE FROM
            task
        WHERE
            id = $1 AND user_id = $2;
        `, [id, userId]);
        if (delTask.rowCount === 0) return res.status(404).json({ messageToUser: "No such task related to this user" });
        res.json({ messageToUser: "Task has been successfully deleted!" });
    } catch (error) {
        console.error(error.message);
    }
});


module.exports = router;