"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStartSunday = exports.getNextSaturday = void 0;
function getNextSaturday() {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const delta = 6 - day;
    const resultDate = new Date(currentDate.getTime() + delta * 86400000);
    const date = resultDate.getDate().toString().padStart(2, "0");
    const month = (resultDate.getMonth() + 1).toString().padStart(2, "0");
    const year = resultDate.getFullYear();
    return `${year}-${month}-${date}`;
}
exports.getNextSaturday = getNextSaturday;
function getStartSunday() {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const delta = 7 - day;
    const resultDate = new Date(currentDate.getTime() + delta * 86400000 - 53 * 7 * 86400000);
    const date = resultDate.getDate().toString().padStart(2, "0");
    const month = (resultDate.getMonth() + 1).toString().padStart(2, "0");
    const year = resultDate.getFullYear();
    return `${year}-${month}-${date}`;
}
exports.getStartSunday = getStartSunday;
//# sourceMappingURL=weekday.js.map