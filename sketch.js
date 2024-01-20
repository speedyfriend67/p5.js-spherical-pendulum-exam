let sigma = 10;
let rho = 28;
let beta = 8 / 3;

let x = 0.01;
let y = 0.01;
let z = 0.01;

let dt = 0.005;

let dx, dy, dz;

// dx/dt = sigma * (y - x)
// dy/dt = x * (rho - z) - y
// dz/dt = x * y - beta * z

// show history
let history = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    colorMode(RGB);
    background(0);
    colorMode(HSB);
    translate(width / 2, height / 2);

    // calculate the next point
    dx = sigma * (y - x);
    dy = x * (rho - z) - y;
    dz = x * y - beta * z;

    x += dx * dt;
    y += dy * dt;
    z += dz * dt;

    // show the history as a line that changes color based on i
    // the color should wrap from red to orange to yellow to green to blue to indigo to violet to red to orange...
    history.push(createVector(x, y, z));
    for (let i = 1; i < history.length; i++) {
        let v = history[i].copy().mult(1/60 * min(width,height));
        let p = history[i - 1].copy().mult(1/60 * min(width,height));
        let c = color(map(i, 0, history.length, 0, 360), 100, 100);

        stroke(c);
        // point(v.x, v.y);
        line(p.x, p.y, v.x, v.y);
    }

}
