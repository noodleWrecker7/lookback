/*******************************************************************************
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 19/08/2019, 14:57
 ******************************************************************************/
var offScreenCanvas;
var offScreenContext;

var GAME;
var PLAYER_HEIGHT = 45;
var PLAYER_WIDTH = 45;

class Game {

    constructor() {
        console.log("play")
        this.preload();
        this.create();

    }

    preload() {
        this.cvs = document.getElementById("gameCanvas");
        this.ctx = this.cvs.getContext("2d");
    }

    create() {
        this.map = new Map("mapData/map1.json", this.cvs.width, this.cvs.height);
    }

    update(d) {


        this.render();
    }

    render() { // draws offScreen to main screen
        offScreenContext.drawImage(this.map.cvs, 0, 0);

        this.ctx.drawImage(offScreenCanvas, 0, 0);
    }
}

class Map {
    constructor(url, w, h) {
        this.data = null;
        this.loadMap(url).then(value => {
            this.drawMap(value);
        });
        this.cvs = document.createElement("canvas");
        this.cvs.width = w;
        this.cvs.height = h;
        this.ctx = this.cvs.getContext("2d");

    }

    drawMap(map) {
        console.log(map)
        for (let item of map) {
            this.ctx.fillStyle = item.colour;
            this.ctx.fillRect(item.x, item.y, item.width, item.height)
        }
    }

    async loadMap(url) {
        return new Promise(((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open("GET", url);
            req.onload = () => resolve(JSON.parse(req.responseText));
            req.onerror = () => reject(req.statusText);
            req.send();
        }))
    }
}


class Player {
    constructor() {
        this.height = PLAYER_HEIGHT;
        this.width = PLAYER_WIDTH;
        this.x = 100;
        this.y = 100;
        this.pastPath = {};
    }

    draw() {

    }

    calculatePosition(time) {

        return {x: 0, y: 0};
    }
}

window.onload = function () {
    GAME = new Game();
    offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = GAME.cvs.width;
    offScreenCanvas.height = GAME.cvs.height;
    offScreenContext = offScreenCanvas.getContext('2d');
    globalDraw();
};

var fps = 100;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;
var calc;

function globalDraw() {
    //await sleep(4);
    requestAnimationFrame(globalDraw);

    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        // update time stuffs

        // Just `then = now` is not enough.
        // Lets say we set fps at 10 which means
        // each frame must take 100ms
        // Now frame executes in 16ms (60fps) so
        // the loop iterates 7 times (16*7 = 112ms) until
        // delta > interval === true
        // Eventually this lowers down the FPS as
        // 112*10 = 1120ms (NOT 1000ms).
        // So we have to get rid of that extra 12ms
        // by subtracting delta (112) % interval (100).
        // Hope that makes sense.

        then = now - (delta % interval);

        // ... Code for Drawing the Frame ...
        calc = delta / 1000;
        //console.log("delta " + delta)
        GAME.update(calc);
    }
}