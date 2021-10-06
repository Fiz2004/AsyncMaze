// Не забудьте перед отправкой изменить в module.exports = function main(game, start) {
// Не деструктурируйте game, ваше решение не будет проходить тесты.

export default async function main(game, start) {
    console.time("start");

    let points = [{ ...start }];
    let promices;
    let finish = { x: undefined, y: undefined, where: undefined };
    let Obj = {
        "right": { x: 1, y: 0, where: "left", exception: "right", metod: game.right },
        "left": { x: -1, y: 0, where: "right", exception: "left", metod: game.left },
        "top": { x: 0, y: -1, where: "bottom", exception: "top", metod: game.up },
        "bottom": { x: 0, y: 1, where: "top", exception: "bottom", metod: game.down },
    }

    function getMetod(direction, ...args) {
        if (direction === "right") return game.right(...args);
        if (direction === "left") return game.left(...args);
        if (direction === "top") return game.up(...args);
        if (direction === "bottom") return game.down(...args);
    }

    do {
        promices = points.map(point => game.state(point.x, point.y));
        let states = await Promise.allSettled(promices);

        let isFinish = states.filter(state => state.value.finish).length !== 0;
        if (isFinish) {
            let finishIndex = states.findIndex(state => state.value.finish);
            finish = { x: points[finishIndex].x, y: points[finishIndex].y }
            break;
        }

        promices = [];
        let newPoints = [];
        for (let index = 0; index < points.length; index++)
            for (let direct of Object.keys(Obj)) {
                let isCanMove = states[index].value[direct] && points[index].where !== Obj[direct].exception;
                if (isCanMove) {
                    promices.push(getMetod(direct, points[index].x, points[index].y));
                    newPoints.push(
                        {
                            x: points[index].x + Obj[direct].x,
                            y: points[index].y + Obj[direct].y,
                            where: Obj[direct].where
                        }
                    );
                }
            }
        let resultMove = await Promise.allSettled(promices);

        points = [...newPoints];

    } while (true)
    console.timeEnd("start");
    return await (finish)
}

