import { filterByDateRange } from "../utils/tasks";
import { scheduleTasks } from "./scheduleTasks";
import { calcTaskScore } from "./taskScore";

export function autoDistribute(tempTasks, startDate, endDate, freeSlots) {

    tempTasks = filterByDateRange(tempTasks, startDate);
    console.log("TEMPTASKS AFTER FILTRATION: ");
    console.log(tempTasks);
    tempTasks.sort((a, b) => {
        return calcTaskScore(b) - calcTaskScore(a)
    });
    for (let task of tempTasks) {
        console.log(task.deadline, calcTaskScore(task));
    }
    console.log("TEMPTASKS AFTER SORTING: ");
    console.log(tempTasks);
    console.log("FREESLOTS: ")
    console.log(freeSlots)
    const result = scheduleTasks(tempTasks, freeSlots);
    console.log("SCHEDULED TASKS: ")
    console.log(result)
}