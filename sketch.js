let sigma = 10;
let rho = 28;
let beta = 8 / 3;

let x = 0.01;
let y = 0.01;
let z = 0.01;

let dt = 0.005;
let speedSlider;

let dx, dy, dz;

// show history
let history = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // Create a slider for controlling the speed
    speedSlider = createSlider(0.001, 0.02, dt, 0.001);
    speedSlider.position(10, 10);
}

function draw() {
    // Set dt based on the slider value
    dt = speedSlider.value();
    
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
        line(p.x, p.y, v.x, v.y);
    }
}
