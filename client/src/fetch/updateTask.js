import getTasks from "./getTasks";
import date from "date-and-time";
import useStore from "../store/useStore";

const setTasks = useStore.getState().setTasks;

const updateTask = async ({ id, taskInputValue, selectedDate, pickedTime, pickedProjectId }) => {
    try {
        const body = {
            description: taskInputValue,
            date: selectedDate ? date.format(selectedDate, "YYYY-MM-DD HH:mm:ss") : undefined,
            time: pickedTime,
            folder_id: pickedProjectId
        }
        const editTask = await fetch(`/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const message = await editTask.json();
        console.log(message);
        getTasks().then(data => setTasks(data));
    } catch (error) {
        console.error(error.message);
    }
}

export default updateTask;