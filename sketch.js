let g = 9.81; // m/s^2
let k = 8.99e9; // Nm^2/C^2
let Q = 1e-6; // C -- charge of the pendulum
let q = 1e-6; // C -- charge of the magnets
let m = 0.5669905; // kg
let l = 1; // m
let c = 0.01; // m
let theta_c = 0.174532925199; // rad
let a = (l + c) * 0.173648177667; // m
let h0 = (l + c) * 0.984807753012 - l; // m
let n = 4; // number of magnets (charges)

let dt = 0.01;

var mouseWasPressed = false;

let colors = ["#000000", "#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66", "#006401", "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00", "#90FB92", "#0076FF", "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900", "#7A4782", "#7E2DD2", "#85A900", "#FF0056", "#A42400", "#00AE7E", "#683D3B", "#BDC6FF", "#263400", "#BDD393", "#00B917", "#9E008E", "#001544", "#C28C9F", "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231", "#0E4CA1", "#91D0CB", "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6", "#FFE502", "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#00FF78", "#FF6E41", "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#A5FFD2", "#FFB167", "#009BFF", "#E85EBE"];

let lm, cm, am, h0m;

let theta, phi, theta_vel, phi_vel, theta_acc, phi_acc;

function setup() {
  createCanvas(600, 600, WEBGL);
  easycam = createEasyCam();
  easycam.setDistance(650)
  // Initial conditions
  // theta = random(-HALF_PI, HALF_PI);
  // phi = random(0, TWO_PI);
  // theta = PI / 6;
  // theta = 0.1;
  theta = theta_c;
  phi = 0;
  theta_vel = 0;
  phi_vel = 0;
  theta_acc = 0;
  phi_acc = 0;
}

function draw() {
  background(255);
  // Set the camera angle for better visibility
  rotateX(2 * PI / 5)
  rotateZ(HALF_PI + QUARTER_PI)
  push()

  // Drawing the axes
  strokeWeight(2);

  // X-axis (Red)
  stroke(255, 0, 0);
  line(0, 0, 0, 300, 0, 0); // Positive X
  line(0, 0, 0, -300, 0, 0); // Negative X

  // Y-axis (Green)
  stroke(0, 255, 0);
  line(0, 0, 0, 0, 300, 0); // Positive Y
  line(0, 0, 0, 0, -300, 0); // Negative Y

  // Z-axis (Blue)
  stroke(0, 0, 255);
  line(0, 0, 0, 0, 0, 300); // Positive Z
  line(0, 0, 0, 0, 0, -300); // Negative Z
  pop()

  let posn = createVector(l * sin(theta) * cos(phi), l * sin(theta) * sin(phi), h0 + l - l * cos(theta));
  // we need to map this to the screen coordinates
  let pos = createVector(map(posn.x, -l, l, -width / 2, width / 2), map(posn.y, -l, l, -height / 2, height / 2), map(posn.z, 0, l + h0, 0, height / 2));

  // Draw the magnets
  for (let i = 0; i < n; i++) {
    push();
    translate(map(a * cos(TWO_PI * i / n), -l, l, -width / 2, width / 2), map(a * sin(TWO_PI * i / n), -l, l, -height / 2, height / 2), 0);
    fill(colors[i % colors.length]);
    noStroke();
    sphere(4);

    pop();
    //     debug -- draw the line from the magnet to the pendulum
    stroke(0, 255, 255); // cyan
    line(map(a * cos(TWO_PI * i / n), -l, l, -width / 2, width / 2), map(a * sin(TWO_PI * i / n), -l, l, -height / 2, height / 2), 0, pos.x, pos.y, pos.z);


  }

  // Update and draw the pendulum and magnets here
  // ... (animation logic)



  push()
  stroke(51);
  line(0, 0, map(l + h0, 0, l + h0, 0, height / 2), pos.x, pos.y, pos.z);
  pop()

  push()
  // Translate to the position where the sphere should be drawn
  translate(0, 0, map(l + h0, 0, l + h0, 0, height / 2));

  // Draw the sphere
  fill(150); // Set the color of the sphere
  noStroke(); // No border for the sphere
  sphere(4); // Draw a sphere with a radius of 10 (you can adjust the size)
  pop()


  push()
  translate(pos.x, pos.y, pos.z)

  fill(0);
  noStroke();
  sphere(8);
  pop()

  // Update the pendulum's angle
  // print(abs(get_mag_force(0)))
  // print(abs(get_grav_force()))

  if (!mouseWasPressed && is_done() == -1) {
    rk4_update();
  }
}

function rk4_update() {
  // RK4 for theta
  let k1_theta_vel = theta_vel;
  let k1_theta_acc = get_theta_acc(theta, phi, theta_vel, phi_vel);

  let k2_theta_vel = theta_vel + 0.5 * k1_theta_acc * dt;
  let k2_theta_acc = get_theta_acc(theta + 0.5 * k1_theta_vel * dt, phi, k2_theta_vel, phi_vel);

  let k3_theta_vel = theta_vel + 0.5 * k2_theta_acc * dt;
  let k3_theta_acc = get_theta_acc(theta + 0.5 * k3_theta_vel * dt, phi, k3_theta_vel, phi_vel);

  let k4_theta_vel = theta_vel + k3_theta_acc * dt;
  let k4_theta_acc = get_theta_acc(theta + k3_theta_vel * dt, phi, k4_theta_vel, phi_vel);

  // RK4 for phi
  let k1_phi_vel = phi_vel;
  let k1_phi_acc = get_phi_acc(theta, phi, theta_vel, phi_vel);

  let k2_phi_vel = phi_vel + 0.5 * k1_phi_acc * dt;
  let k2_phi_acc = get_phi_acc(theta, phi, k2_phi_vel, phi_vel);

  let k3_phi_vel = phi_vel + 0.5 * k2_phi_acc * dt;
  let k3_phi_acc = get_phi_acc(theta, phi, k3_phi_vel, phi_vel);

  let k4_phi_vel = phi_vel + k3_phi_acc * dt;
  let k4_phi_acc = get_phi_acc(theta, phi, k4_phi_vel, phi_vel);


  theta += (k1_theta_vel + 2 * k2_theta_vel + 2 * k3_theta_vel + k4_theta_vel) * dt / 6;
  theta_vel += (k1_theta_acc + 2 * k2_theta_acc + 2 * k3_theta_acc + k4_theta_acc) * dt / 6;
  phi += (k1_phi_vel + 2 * k2_phi_vel + 2 * k3_phi_vel + k4_phi_vel) * dt / 6;
  phi_vel += (k1_phi_acc + 2 * k2_phi_acc + 2 * k3_phi_acc + k4_phi_acc) * dt / 6;

  // bring theta back to the range [-pi, pi]
  theta = theta % TWO_PI;
  if (theta > PI) {
    theta -= TWO_PI;
  }
  // bring phi back to the range [0, 2pi]
  phi = phi % TWO_PI;
}

function get_theta_acc(theta, phi, theta_vel, phi_vel) {
  let U = 0;
  for (let i = 0; i < n; i++) {
    U += ((h0 + l) * sin(theta) - a * cos(phi - TWO_PI * i / n) * cos(theta)) / pow(calculate_r(i), 3);
  }

  return 1 / (m * l * l) * (m * l * l * phi_vel * phi_vel * sin(theta) * cos(theta) - m * g * l * sin(theta) - k * Q * q * l * U);
}

function get_phi_acc(theta, phi, theta_vel, phi_vel) {
  let U = 0;
  for (let i = 0; i < n; i++) {
    U += sin(phi - TWO_PI * i / n) / pow(calculate_r(i), 3);
  }
  return abs(sin(theta)) <= 0.0001 ? 0 : -1 / (m * l * sin(theta)) * (2 * m * l * theta_vel * phi_vel * cos(theta) - k * Q * q * a * U);
}

function mousePressed() {
  mouseWasPressed = !mouseWasPressed;
}

function is_done() {
  for (let i = 0; i < n; i++) {
    if (abs(get_mag_force(i)) > abs(get_grav_force() * 15)) {
      //       magnet has taken over
      return i;
    }
  }
  return -1;
}

function get_grav_potential() {
  return m * g * l * cos(theta);
}

function get_mag_potential(i) {
  return k * Q * q / calculate_r(i);
}

function get_kin_energy() {
  return 0.5 * m * get_tan_vel().dot(get_tan_vel());
}

function get_tan_vel() {
  //  returns the tangential velocity of the pendulum
  return createVector(-phi_vel * sin(theta) * sin(phi) + theta_vel * cos(theta) * cos(phi), phi_vel * sin(theta) * cos(phi) + theta_vel * cos(theta) * sin(phi), theta_vel * sin(theta)).mult(l);
}

function get_grav_force() {
  return - m * g
}

function get_mag_force(i) {
  return -k * Q * q / pow(calculate_r(i), 2);
}

function get_r(i) {
  return createVector(a * cos(2 * PI * i / n) - l * sin(theta) * cos(phi), a * sin(2 * PI * i / n) - l * sin(theta) * sin(phi), -l - h0 + l * cos(theta));
}

function calculate_r(i) {
  return get_r(i).mag();
}

function get_theta_acc(theta, phi, theta_vel, phi_vel) {
  let U = 0;
  for (let i = 0; i < n; i++) {
    U += ((h0 + l) * sin(theta) - a * cos(phi - TWO_PI * i / n) * cos(theta)) / pow(calculate_r(i), 3);
  }

  return 1 / (m * l * l) * (m * l * l * phi_vel * phi_vel * sin(theta) * cos(theta) - m * g * l * sin(theta) - k * Q * q * l * U);
}

function get_phi_acc(theta, phi, theta_vel, phi_vel) {
  let U = 0;
  for (let i = 0; i < n; i++) {
    U += sin(phi - TWO_PI * i / n) / pow(calculate_r(i), 3);
  }
  return abs(sin(theta)) <= 1e-6 ? 0 : -1 / (m * l * sin(theta)) * (2 * m * l * theta_vel * phi_vel * cos(theta) - k * Q * q * a * U);
}

function mousePressed() {
  mouseWasPressed = !mouseWasPressed;
}

function is_done() {
  for (let i = 0; i < n; i++) {
    // print("PE_m", get_mag_potential(i));
    // print("KE",get_kin_energy());
    // print("PE_g",get_grav_potential())
    // let v = get_tan_vel();
    // // escape velocity :
    // // 1/2 m v^2 = k Q q / r - m g l cos(theta)
    // // v^2 = 2 k Q q / (m r) - 2 g l cos(theta)
    // print("v^2", v.dot(v));
    // print("RHS",2 * (get_mag_potential(i) - get_grav_potential()) / m)
    if (abs(get_mag_force(i)) > abs(get_grav_force() * 15)) {
      //       magnet has taken over
      return i;
    }
  }
  return -1;
}

function get_grav_potential() {
  return m * g * l * cos(theta);
}

function get_mag_potential(i) {
  return k * Q * q / calculate_r(i);
}

function get_kin_energy() {
  return 0.5 * m * get_tan_vel().dot(get_tan_vel());
}

function get_tan_vel() {
  //  returns the tangential velocity of the pendulum
  return createVector(-phi_vel * sin(theta) * sin(phi) + theta_vel * cos(theta) * cos(phi), phi_vel * sin(theta) * cos(phi) + theta_vel * cos(theta) * sin(phi), theta_vel * sin(theta)).mult(l);
}

function get_grav_force() {
  return - m * g
}

function get_mag_force(i) {
  return -k * Q * q / pow(calculate_r(i), 2);
}

function get_r(i) {
  return createVector(a * cos(2 * PI * i / n) - l * sin(theta) * cos(phi), a * sin(2 * PI * i / n) - l * sin(theta) * sin(phi), -l - h0 + l * cos(theta));
}

function calculate_r(i) {
  return sqrt(a * a + l * l + (h0 + l) * (h0 + l) - 2 * (h0 + l) * l * cos(theta) - 2 * a * l * sin(theta) * cos(phi - 2 * PI * i / n));
}


function update_theta_acc() {
  let U = 0;
  for (let i = 0; i < n; i++) {
    U += ((h0 + l) * sin(theta) - a * cos(phi - TWO_PI * i / n) * cos(theta)) / pow(calculate_r(i), 3);
  }

  theta_acc = 1 / (m * l * l) * (m * l * l * phi_vel * phi_vel * sin(theta) * cos(theta) - m * g * l * sin(theta) - k * Q * q * l * U);
}

function update_phi_acc() {
  let U = 0;
  for (let i = 0; i < n; i++) {
    U += sin(phi - TWO_PI * i / n) / pow(calculate_r(i), 3);
  }
  phi_acc = abs(sin(theta)) <= 0.0001 ? 0 : -1 / (m * l * sin(theta)) * (2 * m * l * theta_vel * phi_vel * cos(theta) - k * Q * q * a * U);
}

