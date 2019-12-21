/*
 * Copyright (c) 2019.
 * Developed by Adam Hodgkinson
 * Last modified 21/12/12 16:43
 *
 * Everything on this page, and other pages on the website, is subject to the copyright of Adam Hodgkinson, it may be freely used, copied, distributed and/or modified, however, full credit must be given
 * to me and any derived works should be released under the same license. I am not held liable for any claim, this software is provided as-is and without any warranty.
 *
 * I do not own any of the following content and is used under their respective licenses:
 *     Fontawesome
 *     Photonstorm's phaser.js
 */

//TODO view coords
//TODO allow play testing
//TODO add config options
//TODO add win box

var APP;

class App {

    constructor() {
        this.level = new Level(900, 600);
        this.preload();
        this.create();
        this.mode = "draw";
        this.selected = null;
        this.tempRect = {x: 0, y: 0, w: 0, h: 0};
        this.selectedOffSet = {};
    }

    preload() {
        this.cvs = document.getElementById("builderCanvas");
        this.ctx = this.cvs.getContext("2d");
    }

    create() {
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("keydown", this.handleKeyDown)
    }

    update() {
        console.log("update")
        this.ctx.clearRect(0, 0, APP.cvs.width, APP.cvs.height);
        for (let i = 0; i < this.level.blocks.length; i++) {
            let b = this.level.blocks[i];
            this.ctx.lineWidth = 2; // border to see blocks
            if (i == this.selected) this.ctx.lineWidth = 4; // selected block border

            this.drawBlock(b.x, b.y, b.width, b.height);
        }
        this.ctx.fillStyle = "black";
        let c = this.tempRect; //
        this.ctx.fillRect(c.x, c.y, c.w, c.h);
    }

    drawBlock(x, y, w, h) {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(x, y, w, h);
        this.ctx.strokeStyle = "rgba(80, 255, 235, 0.5)";
        this.ctx.strokeRect(x, y, w, h)
    }

    handleKeyDown(e) {
        let key = e.code;
        console.log(key);

        switch (key) {
            case "Delete":
                APP.level.blocks.splice(APP.selected, 1);
                APP.selected = null;
                APP.update();
        }
    }

    handleMouseDown(e) {
        let pos = getMousePos(APP.cvs, e)
        if (APP.mode == "draw") {
            APP.drawFirstPos = pos;
        }
        if (APP.mode == "select") {
            APP.selected = null;
            for (let i = 0; i < APP.level.blocks.length; i++) {
                let b = APP.level.blocks[i];
                if (pos.x > b.x && pos.x < b.x + b.width && pos.y > b.y && pos.y < b.y + b.height) {
                    APP.selected = i;
                    APP.movingSelected = true;
                    APP.selectedOffSet.x = pos.x - b.x;
                    APP.selectedOffSet.y = pos.y - b.y;
                    console.log("selected new block")
                    APP.update();
                    break;
                }
            }
        }
        APP.update();
    }

    handleMouseUp(e) {
        let pos = getMousePos(APP.cvs, e)
        if (APP.mode == "draw" && APP.drawFirstPos) {
            APP.drawSecondPos = pos;
            APP.level.add(APP.drawFirstPos.x, APP.drawFirstPos.y, pos.x - APP.drawFirstPos.x, pos.y - APP.drawFirstPos.y);
            APP.drawFirstPos = null;
            APP.tempRect = {};
            APP.update();
        }
        APP.movingSelected = false;
    }

    handleMouseMove(e) {
        console.log("mouse move")
        let pos = getMousePos(APP.cvs, e);
        if (APP.mode == "draw" && APP.drawFirstPos) {
            let fp = APP.drawFirstPos;
            APP.tempRect = {x: fp.x, y: fp.y, w: pos.x - fp.x, h: pos.y - fp.y};
            APP.update();
        }
        if (APP.mode == "select" && APP.selected != null && APP.movingSelected) {
            console.log("selected move")
            APP.level.blocks[APP.selected].x = e.x - APP.selectedOffSet.x;
            APP.level.blocks[APP.selected].y = e.y - APP.selectedOffSet.y;
            APP.update();
        }
    }
}

class Level {

    constructor(w, h) {
        this.width = w || 900; // default
        this.height = h || 600; //
        this.blocks = [];
        this.startX = 100;
        this.startY = 400;
    }

    add(x, y, w, h) {
        this.blocks.push({x: x, y: y, width: w, height: h});
    }

    exportAsJSONString() {
        let obj = [];
        // config
        obj.push({
            "config": true,
            "timeLimit": 60,
            "startX": this.startX,
            "startY": this.startY
        });
        obj.push({ // left side
            "x": 0,
            "y": 0,
            "width": 0,
            "height": this.height,
            "color": "black"
        });
        obj.push({ // floor
            "x": 0,
            "y": 600,
            "width": this.width,
            "height": 0,
            "color": "black",
            "deadly": true
        });
        obj.push({
            "x": this.width,
            "y": 0,
            "width": 0,
            "height": this.height,
            "color": "black"
        });
        obj.push({
            "x": 0,
            "y": 0,
            "width": this.width,
            "height": 0,
            "color": "black"
        });

        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].color = "black";
            obj.push(this.blocks[i]);
        }

        return JSON.stringify(obj);
    }
}

function swapMode() {
    if (APP.mode == "draw") {
        APP.mode = "select";
        document.getElementById("mode-selected").innerText = "Select Mode"
    } else {
        APP.mode = "draw";
        document.getElementById("mode-selected").innerText = "Draw Mode"
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