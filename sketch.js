let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

let engine, world, render, runner, pendulum;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');

    engine = Engine.create();
    world = engine.world;
    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
        }
    });

    runner = Runner.create();
    Runner.run(runner, engine);

    // Create pendulum
    pendulum = createPendulum(width / 2, 100, 200);

    // Create mouse constraint
    let mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.8,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // Keep the pendulum in place initially
    Composite.add(world, Constraint.create({
        bodyA: pendulum.bodies[0],
        pointB: { x: width / 2, y: 100 },
        stiffness: 0.5,
    }));

    // Setup button events
    document.getElementById('startButton').addEventListener('click', startPendulum);
    document.getElementById('stopButton').addEventListener('click', stopPendulum);
}

function draw() {
    background(255);
    Engine.update(engine);

    // Display pendulum
    stroke(0);
    strokeWeight(2);
    line(pendulum.bodies[0].position.x, pendulum.bodies[0].position.y, pendulum.bodies[1].position.x, pendulum.bodies[1].position.y);
    fill(127);
    ellipse(pendulum.bodies[1].position.x, pendulum.bodies[1].position.y, 40);

    line(pendulum.bodies[1].position.x, pendulum.bodies[1].position.y, pendulum.bodies[2].position.x, pendulum.bodies[2].position.y);
    fill(127);
    ellipse(pendulum.bodies[2].position.x, pendulum.bodies[2].position.y, 40);
}

function createPendulum(x, y, length) {
    let pendulum = Composite.create();

    // Create pendulum bodies
    let arm1 = Bodies.rectangle(x, y, 10, length, { isStatic: true });
    let bob1 = Bodies.circle(x, y + length, 20, { restitution: 0.8 });
    let constraint1 = Constraint.create({
        pointA: { x: x, y: y },
        bodyB: bob1,
        stiffness: 0.8,
        length: length,
    });

    let arm2 = Bodies.rectangle(x, y + length, 10, length, { isStatic: true });
    let bob2 = Bodies.circle(x, y + 2 * length, 20, { restitution: 0.8 });
    let constraint2 = Constraint.create({
        pointA: { x: x, y: y + length },
        bodyB: bob2,
        stiffness: 0.8,
        length: length,
    });

    Composite.add(pendulum, [arm1, bob1, constraint1, arm2, bob2, constraint2]);

    return pendulum;
}

function startPendulum() {
    pendulum.bodies[0].isStatic = false;  // Release the first arm
    pendulum.bodies[1].isStatic = false;  // Release the first bob
    pendulum.bodies[2].isStatic = false;  // Release the second arm
    pendulum.bodies[3].isStatic = false;  // Release the second bob
}

function stopPendulum() {
    pendulum.bodies[0].isStatic = true;  // Lock the first arm
    pendulum.bodies[1].isStatic = true;  // Lock the first bob
    pendulum.bodies[2].isStatic = true;  // Lock the second arm
    pendulum.bodies[3].isStatic = true;  // Lock the second bob
}
