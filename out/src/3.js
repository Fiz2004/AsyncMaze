// Не забудьте перед отправкой изменить в module.exports = function main(game, start) {
// Не деструктурируйте game, ваше решение не будет проходить тесты.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default function main(game, start) {
    return __awaiter(this, void 0, void 0, function* () {
        function getState(point) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield game.state(point.x, point.y);
                //console.log(`x=${point.x},y=${point.y},state=${JSON.stringify(result)}`);
                return result;
            });
        }
        function run(point, state) {
            return __awaiter(this, void 0, void 0, function* () {
                let promices = [];
                if (state.right && point.where !== "right") {
                    promices.push(game.right(point.x, point.y));
                }
                if (state.left && point.where !== "left") {
                    promices.push(game.left(point.x, point.y));
                }
                if (state.top && point.where !== "top") {
                    promices.push(game.up(point.x, point.y));
                }
                if (state.bottom && point.where !== "bottom") {
                    promices.push(game.down(point.x, point.y));
                }
                let results = yield Promise.allSettled(promices);
                return results;
            });
        }
        let nextPoints = [{ x: start.x, y: start.y, where: null }];
        let count = 0;
        let state;
        do {
            let directions;
            let points1 = [];
            for (let nextPoint of nextPoints) {
                state = yield getState(Object.assign({}, nextPoint));
                directions = yield run(Object.assign({}, nextPoint), state);
                if (state.right && nextPoint.where !== "right") {
                    points1.push({ x: nextPoint.x + 1, y: nextPoint.y, where: "left" });
                }
                if (state.left && nextPoint.where !== "left") {
                    points1.push({ x: nextPoint.x - 1, y: nextPoint.y, where: "right" });
                }
                if (state.top && nextPoint.where !== "top") {
                    points1.push({ x: nextPoint.x, y: nextPoint.y - 1, where: "bottom" });
                }
                if (state.bottom && nextPoint.where !== "bottom") {
                    points1.push({ x: nextPoint.x, y: nextPoint.y + 1, where: "top" });
                }
            }
            nextPoints = [...points1];
            console.log(`points=${JSON.stringify(nextPoints)}`);
            count++;
        } while (!state.finish);
        return yield ({ x: start.x, y: start.y });
    });
}
// export default function main(game, start) {
//     return game.right(start.x, start.y)
//         .then(() =>  game.right(start.x + 1, start.y))
//         .then(() => game.right(start.x + 2, start.y))
//         .then(() => game.right(start.x + 3, start.y))
//         .then(() => ({ x: start.x + 4, y: start.y }));
// }
