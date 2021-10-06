// Не забудьте перед отправкой изменить в module.exports = function main(game, start) {
// Не деструктурируйте game, ваше решение не будет проходить тесты.
export default function main(game, start) {
    function getDir(state) {
        let dir;
        if (memory.filter(el => el.x === X && el.y === Y).length === 0) {
            dir = [];
            if (state.bottom && lastDir !== "U") {
                dir.push("D");
            }
            if (state.right && lastDir !== "L") {
                dir.push("R");
            }
            if (state.top && lastDir !== "D") {
                dir.push("U");
            }
            if (state.left && lastDir !== "R") {
                dir.push("L");
            }
            memory.push({ x: start.x + X, y: start.y + Y, d: dir });
        }
        else {
            let vr = memory.filter(el => el.x === X && el.y === Y);
            dir = vr[vr.length - 1].d;
        }
        // console.log(`CREATE: cash=${JSON.stringify(memory)}`);
        return dir;
    }
    function deleteCash(value) {
        let index = memory.findIndex(el => el.x === X && el.y === Y);
        memory[index].d = memory[index].d.filter(el => el !== value);
        // console.log(`DELETE: cash=${JSON.stringify(memory)}`);
    }
    function runMove(dir) {
        if (dir.includes("D")) {
            deleteCash("D");
            Y += 1;
            lastDir = "D";
            return game.down(start.x + X, start.y + Y - 1);
        }
        if (dir.includes("R")) {
            deleteCash("R");
            X += 1;
            lastDir = "R";
            return game.right(start.x + X - 1, start.y + Y);
        }
        if (dir.includes("U")) {
            deleteCash("U");
            Y -= 1;
            lastDir = "U";
            return game.up(start.x + X, start.y + Y + 1);
        }
        if (dir.includes("L")) {
            deleteCash("L");
            X -= 1;
            lastDir = "L";
            return game.left(start.x + X + 1, start.y + Y);
        }
        let last = memory.filter(el => el.d.length !== 0);
        let index = memory.findIndex(el => el.x === last[last.length - 1].x && el.y === last[last.length - 1].y);
        console.log(`!!!Перемещаемся=${JSON.stringify(memory[index])}`);
        X = memory[index].x;
        Y = memory[index].y;
        lastDir = null;
    }
    function getState() {
        return game.state(start.x + X, start.y + Y);
    }
    function move(p) {
        return function (args) {
            if (!finish)
                return p.then(getState).then(moveOne);
        };
    }
    function moveOne(state) {
        //console.log(`state(moveOne)=`, state);
        if (state.finish) {
            {
                console.log(`finish=${state} pX = ${X} pY = ${Y}`);
                finish = true;
                return ({ x: start.x + X, y: start.y + Y });
            }
            ;
        }
        let dir = getDir(state);
        console.log(`X=${X},Y=${Y},lastDir=${lastDir},dir=${dir}`);
        return runMove(dir);
    }
    ;
    let X = 0;
    let Y = 0;
    let memory = [];
    let lastDir = null;
    let finish = false;
    let p = Promise.resolve(undefined);
    for (let i = 0; i < 2500; i++) {
        p = p.then(move(p));
    }
    ;
    return p;
}
// export default function main(game, start) {
//     return game.right(start.x, start.y)
//         .then(() =>  game.right(start.x + 1, start.y))
//         .then(() => game.right(start.x + 2, start.y))
//         .then(() => game.right(start.x + 3, start.y))
//         .then(() => ({ x: start.x + 4, y: start.y }));
// }
