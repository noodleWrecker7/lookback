/*
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 20/12/12 22:10
 *
 * Everything on this page, and other pages on the website, is subject to the copyright of Adam Hodgkinson, it may be freely used, copied, distributed and/or modified, however, full credit must be given
 * to me and any derived works should be released under the same license. I am not held liable for any claim, this software is provided as-is and without any warranty.
 *
 * I do not own any of the following content and is used under their respective licenses:
 *     Fontawesome
 *     Photonstorm's phaser.js
 */

var APP;

class App {

    constructor() {
        this.level = new Level();
        this.preload();
        this.create();
        this.mode = "draw";
    }

    preload() {
        this.cvs = document.getElementById("builderCanvas");
        this.ctx = this.cvs.getContext("2d");
    }

    create() {
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("mousemove", this.handleMouseMove);
    }

    update() {
        for (let i = 0; i < this.level.blocks.length; i++) {
            this.ctx.fillStyle = "black";
            let b = this.level.blocks[i];
            this.ctx.fillRect(b.x, b.y, b.width, b.height);
        }
    }

    handleMouseDown(e) {
        let pos = getMousePos(APP.cvs, e)
        console.log("out here");
        if (APP.mode == "draw") {
            console.log("here");
            APP.drawFirstPos = pos;
        }
    }

    handleMouseUp(e) {
        let pos = getMousePos(APP.cvs, e)
        if (APP.mode == "draw" && APP.drawFirstPos) {
            APP.drawSecondPos = pos;
            //APP.level.add
            console.log("BLOCK ADDED")
            APP.drawFirstPos = null;
        }
    }

    handleMouseMove(e) {
        let pos = getMousePos(APP.cvs, e);
        if (APP.mode == "draw" && APP.drawFirstPos) {
            let fp = APP.drawFirstPos;
            APP.ctx.clearRect(0, 0, APP.cvs.width, APP.cvs.height);
            APP.update();
            APP.ctx.fillStyle = "black";
            APP.ctx.fillRect(fp.x, fp.y, pos.x - fp.x, pos.y - fp.y);
        } else {
            APP.drawFirstPos = null;
        }
    }
}

class Level {

    constructor(w, h) {
        this.width = w || 900; // default
        this.height = h || 600; //
        this.blocks = [];

    }

    add(x, y, w, h) {
        this.blocks.push({x: x, y: y, width: w, height: h});
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

window.onload = function () {
    APP = new App();
};