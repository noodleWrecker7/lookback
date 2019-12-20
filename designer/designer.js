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
        this.preload()
        this.create()
    }

    preload() {
        this.cvs = document.getElementById("builderCanvas");
        this.ctx = this.cvs.getContext("2d");
    }

    create() {
        document.addEventListener("onmousedown", this.handleMouseDown);
        document.addEventListener("onmousedown", this.handleMouseUp);
    }

    update() {

    }

    handleMouseDown(e) {
        let pos = getMousePos(APP.cvs)
    }

    handleMouseUp(e) {

    }
}

class Level {

    constructor(w, h) {
        this.width = w || 900; // default
        this.height = h || 600; //
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