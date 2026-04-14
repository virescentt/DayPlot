import { fetchFreeSlots } from "../services/algorithm";
import { autoDistribute } from "./autoDistributeAlgorithm";

export async function runAutoDistribute(token, tempTasks, startDate, endDate) {
    const freeSlots = await fetchFreeSlots(token, startDate, endDate);

    return autoDistribute(tempTasks, startDate, endDate, freeSlots);
}