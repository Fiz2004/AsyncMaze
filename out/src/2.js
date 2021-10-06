// Не забудьте перед отправкой изменить в module.exports = function main(game, start) {
// Не деструктурируйте game, ваше решение не будет проходить тесты.
export default function main(game, start) {
    function next(getStateAndMove) {
        function handleNextInput(finish) {
            if (finish.f) {
                return (finish);
            }
            else {
                let nextinput = memory[memory.findIndex(el => el.d.length !== 0)];
                return getStateAndMove(nextinput)
                    .then(handleNextInput);
            }
        }
        return Promise.resolve([]).then(handleNextInput);
    }
    function getStateAndMove(point) {
        return game.state(point.x, point.y)
            .then(state => {
            if (state.finish) {
                finish = { x: point.x, y: point.y };
                console.log("Finish");
                return ({ finish, f: "y" });
            }
            let dir = [];
            let promices = [];
            let indexD = memory.findIndex(el => el.x === point.x && el.y === point.y + 1);
            let indexT = memory.findIndex(el => el.x === point.x && el.y === point.y - 1);
            let indexL = memory.findIndex(el => el.x === point.x - 1 && el.y === point.y);
            let indexR = memory.findIndex(el => el.x === point.x + 1 && el.y === point.y);
            if (state.bottom && indexD === -1) {
                dir.push("D");
            }
            if (state.top && indexT === -1) {
                dir.push("U");
            }
            if (state.left && indexL === -1) {
                dir.push("L");
            }
            if (state.right && indexR === -1) {
                dir.push("R");
            }
            let index = memory.findIndex(el => el.x === point.x && el.y === point.y);
            memory[index].d = [...dir];
            if (memory[index].d.length !== 0) {
                if (dir.includes("D")) {
                    memory[index].d = memory[index].d.filter(el => el !== "D");
                    memory.push({ x: point.x, y: point.y + 1, d: ["L", "D", "R"] });
                    promices.push(game.down(point.x, point.y));
                }
                if (dir.includes("U")) {
                    memory[index].d = memory[index].d.filter(el => el !== "U");
                    memory.push({ x: point.x, y: point.y - 1, d: ["L", "U", "R"] });
                    promices.push(game.up(point.x, point.y));
                }
                if (dir.includes("L")) {
                    memory[index].d = memory[index].d.filter(el => el !== "L");
                    memory.push({ x: point.x - 1, y: point.y, d: ["U", "D", "L"] });
                    promices.push(game.left(point.x, point.y));
                }
                if (dir.includes("R")) {
                    memory[index].d = memory[index].d.filter(el => el !== "R");
                    memory.push({ x: point.x + 1, y: point.y, d: ["R", "D", "U"] });
                    promices.push(game.right(point.x, point.y));
                }
            }
            return Promise.allSettled(promices);
        });
    }
    let memory = [{ x: 0, y: 0, d: ["L", "D", "R", "U"] }];
    let finish = null;
    return next(getStateAndMove)
        .then(() => ({ x: finish.x, y: finish.y }));
}
// export default function main(game, start) {
//     return game.right(start.x, start.y)
//         .then(() =>  game.right(start.x + 1, start.y))
//         .then(() => game.right(start.x + 2, start.y))
//         .then(() => game.right(start.x + 3, start.y))
//         .then(() => ({ x: start.x + 4, y: start.y }));
// }
