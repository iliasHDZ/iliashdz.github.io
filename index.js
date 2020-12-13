let canvas;
let gl;

let canvast;
let ctxt;

const util = {
    createShader: function(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success)
            return shader;
    
        gl.deleteShader(shader);
    },
    createProgram: function(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success)
            return program;
        
        gl.deleteProgram(program);
    },
    createBuffer: function(gl, values) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
        return buffer;
    },
    enableBuffer: function(gl, buffer, attr, size) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(attr, size, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attr);
    },
    capingToPos: function(rects, far) {
        let SCALING = 0.125;

        let ret = [];
        function addPos(x, y, z) {
            ret.push(x);
            ret.push(y);
            ret.push(z);
        }

        for (let rect of rects) {
            let left = rect[0] * SCALING;
            let right = (rect[0] + rect[2]) * SCALING;
            let top = rect[1] * -SCALING;
            let bottom = (rect[1] + rect[3]) * -SCALING;

            addPos(right, top, 0);
            addPos(right, top, -far);
            addPos(right, bottom, 0);

            addPos(right, top, 0);
            addPos(right, bottom, -far);
            addPos(right, bottom, 0);
        }

        return ret;
    },
    turnToPos: function(rects) {
        let SCALING = 0.125;

        let ret = [];
        function addPos(x, y, z) {
            ret.push(x);
            ret.push(y);
            ret.push(z);
        }

        for (let rect of rects) {
            addPos(rect[0] * SCALING, rect[1] * -SCALING, 0);
            addPos((rect[0] + rect[2]) * SCALING, rect[1] * -SCALING, 0);
            addPos((rect[0] + rect[2]) * SCALING, (rect[1] + rect[3]) * -SCALING, 0);

            addPos(rect[0] * SCALING, rect[1] * -SCALING, 0);
            addPos((rect[0] + rect[2]) * SCALING, (rect[1] + rect[3]) * -SCALING, 0);
            addPos(rect[0] * SCALING, (rect[1] + rect[3]) * -SCALING, 0);
        }

        return ret;
    }
}

let homeHTML = null;
let portfolioHTML = null;
let contactHTML = null;

function bigCanvas(anim) {
    if (state != "close")
        return;

    state = "open";

    if (!anim) {
        canvas.height = CAN_HEIGHT;

        document.getElementsByClassName("title-name")[0].style.opacity = "";
        document.getElementsByClassName("subtitle-name")[0].style.opacity = "";
        document.getElementsByClassName("title-name")[0].style.display = "";
        document.getElementsByClassName("subtitle-name")[0].style.display = "";

        if (inter)
            clearInterval(inter);

        return;
    }

    if (inter != null)
        clearInterval(inter);
    inter = setInterval(frame, 5);

    let prog = 0;
    
    const RATE = 8;
 
    document.getElementsByClassName("title-name")[0].style.display = "";
    document.getElementsByClassName("subtitle-name")[0].style.display = "";

    function frame() {
        prog += (1 - prog) / RATE;

        canvas.height = interpolate(CAN_HEIGHT, CAN_HEIGHT_CLOSE, prog);

        ctxt.fillStyle = "#6c90da";
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
    
        ctxt.beginPath();
        ctxt.moveTo(0, 0);
        ctxt.lineTo(canvast.width, 0);
        ctxt.lineTo(0, canvast.height);
        ctxt.fill();

        document.getElementsByClassName("title-name")[0].style.opacity = prog * 100 + "%";
        document.getElementsByClassName("subtitle-name")[0].style.opacity = prog * 100 + "%";

        if (prog >= 0.999) {
            canvas.height = CAN_HEIGHT;

            document.getElementsByClassName("title-name")[0].style.opacity = "";
            document.getElementsByClassName("subtitle-name")[0].style.opacity = "";
            document.getElementsByClassName("title-name")[0].style.display = "";
            document.getElementsByClassName("subtitle-name")[0].style.display = "";

            clearInterval(inter);
        }
    }
}

function clickHome(anim) {
    window.scrollTo(0, 0);

    document.getElementById("content").innerHTML = homeHTML;
    bigCanvas(anim);
}

function clickPortfolio(anim) {
    window.scrollTo(0, 0);

    document.getElementById("content").innerHTML = portfolioHTML;
    smallCanvas(anim);
}

function clickContact(anim) {
    window.scrollTo(0, 0);

    document.getElementById("content").innerHTML = contactHTML;
    smallCanvas(anim);
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        homeHTML = this.responseText;
        if (window.location.hash == "#home" || !window.location.hash)
            clickHome(false);
    }
};
xhttp.open("GET", "home.html", true);
xhttp.send();

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       portfolioHTML = this.responseText;
       if (window.location.hash == "#portfolio")
           clickPortfolio(false);
    }
};
xhttp.open("GET", "portfolio.html", true);
xhttp.send();

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       contactHTML = this.responseText;
       if (window.location.hash == "#contact")
           clickContact(false);
    }
};
xhttp.open("GET", "contact.html", true);
xhttp.send();

const CAN_HEIGHT = 680;
const CAN_HEIGHT_CLOSE = 60;

const CANT_RAT = 8;
const CANT_RAT_SM = 14;

let cant_ratio = 8;

function interpolate(v1, v2, a) {
    return v1 * a + v2 * (1 - a);
}

let state = "open";

let inter = null;

function smallCanvas(anim) {
    if (state != "open")
        return;

    state = "close";

    if (!anim) {
        canvas.height = CAN_HEIGHT_CLOSE;

        inter = null;

        document.getElementsByClassName("title-name")[0].style.display = "none";
        document.getElementsByClassName("subtitle-name")[0].style.display = "none";

        if (inter)
            clearInterval(inter);
        return;
    }

    if (inter != null)
        clearInterval(inter);
    inter = setInterval(frame, 5);

    let prog = 0;
    
    const RATE = 8;

    function frame() {
        prog += (1 - prog) / RATE;

        canvas.height = interpolate(CAN_HEIGHT_CLOSE, CAN_HEIGHT, prog);

        ctxt.fillStyle = "#6c90da";
        ctxt.clearRect(0, 0, canvas.width, canvas.height);
    
        ctxt.beginPath();
        ctxt.moveTo(0, 0);
        ctxt.lineTo(canvast.width, 0);
        ctxt.lineTo(0, canvast.height);
        ctxt.fill();

        document.getElementsByClassName("title-name")[0].style.opacity = (1 - prog) * 100 + "%";
        document.getElementsByClassName("subtitle-name")[0].style.opacity = (1 - prog) * 100 + "%";

        if (prog >= 0.999) {
            clearInterval(inter);
            canvas.height = CAN_HEIGHT_CLOSE;

            inter = null;

            document.getElementsByClassName("title-name")[0].style.display = "none";
            document.getElementsByClassName("subtitle-name")[0].style.display = "none";
        }
    }
}

const VERT_SRC = `
attribute vec3 a_pos;

uniform mat4 model;
uniform mat4 proje;

void main(void) {
    gl_Position = proje * model * vec4(a_pos, 1);
}`;

const FRAG_SRC = `
precision mediump float;

uniform int state;

void main(void) {
    if (state == 0)
        gl_FragColor = vec4(1, 1, 1, 1);
    else {
        vec4 col1 = vec4(0.294, 0.635, 0.875, 1);
        vec4 col2 = vec4(0.427, 0.568, 0.858, 1);
        gl_FragColor = mix(col1, col2, 0.3);
    }
}`;

let glVars = {}

let rotOffX = 0;
const ROT_OFFX = 6;

let rotOffY = 0;
const ROT_OFFY = 6;

window.onresize = function() {
    canvas.width = document.body.clientWidth;
    gl.viewport(0, 0, canvas.width, 680);

    canvast.width = document.body.clientWidth;
    canvast.height = canvast.width / 14;

    ctxt.fillStyle = "#6c90da";
    ctxt.clearRect(0, 0, canvast.width, canvast.height);

    ctxt.beginPath();
    ctxt.moveTo(0, 0);
    ctxt.lineTo(canvast.width, 0);
    ctxt.lineTo(0, canvast.height);
    ctxt.fill();
}

document.onmousemove = function(e) {
    rotOffX = ((e.clientX / document.body.clientWidth) * ROT_OFFX) - ROT_OFFX/2;
    rotOffY = ((e.clientY / document.body.clientHeight) * ROT_OFFY) - ROT_OFFY/2;
}

function init() {
    canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");

    canvast = document.getElementById("canvas-t");
    ctxt = canvast.getContext("2d");

    canvast.width = window.innerWidth;
    canvast.height = canvast.width / 14;

    canvas.width = window.innerWidth;
    gl.viewport(0, 0, canvas.width, canvas.height);

    glVars.prog = util.createProgram(gl, 
        util.createShader(gl, gl.VERTEX_SHADER, VERT_SRC),
        util.createShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC));

    gl.useProgram(glVars.prog);

    let rects = [
        [-3, 2, 7, 1],
        [0,  -1, 1, 3],
        [-3, -2, 7, 1]
    ]

    for (let i = 0; i < rects.length; i++) {
        rects[i][0]-=0.5;
    }

    let positions = util.turnToPos(rects);
    let dposts = util.capingToPos(rects, 300);

    glVars.varCount = positions.length / 3;
    glVars.varCountC = dposts.length / 3;

    glVars.posBufferI = util.createBuffer(gl, positions);
    glVars.posBufferC = util.createBuffer(gl, dposts);
    glVars.attBufferI = gl.getAttribLocation(glVars.prog, "a_pos");

    glVars.attModelM = gl.getUniformLocation(glVars.prog, "model");
    glVars.attProjeM = gl.getUniformLocation(glVars.prog, "proje");

    glVars.state = gl.getUniformLocation(glVars.prog, "state");

    ctxt.fillStyle = "#6c90da";
    ctxt.clearRect(0, 0, canvas.width, canvas.height);

    ctxt.beginPath();
    ctxt.moveTo(0, 0);
    ctxt.lineTo(canvast.width, 0);
    ctxt.lineTo(0, canvast.height);
    ctxt.fill();

    window.requestAnimationFrame(render);
}

let FOV = 53.13;

let dist = -2;

let rot = -55;

function render() {
    gl.clearColor(108 / 255, 144 / 255, 218 / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let model = glMatrix.mat4.create();
    glMatrix.mat4.translate(model, model, [0, 0.2, dist]);
    glMatrix.mat4.rotate(model, model, (rot + rotOffX) / 360 * ( 2 * Math.PI ), [0, 1, 0]);
    glMatrix.mat4.rotate(model, model, rotOffY / 360 * ( 2 * Math.PI ), [0, 0, 1]);
    gl.uniformMatrix4fv(glVars.attModelM, false, model);

    let proj = glMatrix.mat4.create();
    glMatrix.mat4.perspective(proj, FOV / 360 * ( 2 * Math.PI ), canvas.width / canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(glVars.attProjeM, false, proj);

    util.enableBuffer(gl, glVars.posBufferC, glVars.attBufferI, 3);
    gl.uniform1i(glVars.state, 1);

    gl.drawArrays(gl.TRIANGLES, 0, glVars.varCountC);

    util.enableBuffer(gl, glVars.posBufferI, glVars.attBufferI, 3);
    gl.uniform1i(glVars.state, 0);

    gl.drawArrays(gl.TRIANGLES, 0, glVars.varCount);

    window.requestAnimationFrame(render);
}

window.onload = init;