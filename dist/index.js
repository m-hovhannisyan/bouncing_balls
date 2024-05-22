"use strict";
// Increased Gravity:
// Increased the gravity to 0.2 to give a more noticeable downward force.
// Friction Adjustments:
// Applied friction to both horizontal and vertical velocities (dx and dy) using a factor of 0.98 to gradually reduce their speed.
// Applied a stronger ground friction of 0.8 when the ball hits the ground to ensure they slow down faster upon impact.
// Stop Threshold:
// Introduced a stopThreshold of 0.197 to define the minimum velocity below which the ball will stop moving.
// Velocity Check:
// If the absolute value of dx or dy falls below the stopThreshold and ball close to ground, the velocity is set to zero. This effectively stops the ball from moving further.
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 10;
});
class BouncingBall {
    constructor(x, y, radius, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update(canvas, balls) {
        const gravity = 0.2;
        const friction = 0.98;
        const groundFriction = 0.8;
        const stopThreshold = 0.197; // Threshold to stop the ball's motion
        // Check for collision with other balls
        for (let i = 0; i < balls.length; i++) {
            if (this === balls[i])
                continue;
            const dist = Math.hypot(this.x - balls[i].x, this.y - balls[i].y);
            if (dist - this.radius - balls[i].radius < 0) {
                this.dx = -this.dx;
                this.dy = -this.dy;
                balls[i].dx = -balls[i].dx;
                balls[i].dy = -balls[i].dy;
            }
        }
        // Check for collision with walls and floor/ceiling
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx * groundFriction;
        }
        if (this.y + this.radius > canvas.height) {
            this.dy = -this.dy * groundFriction;
            this.dx *= groundFriction;
            this.y = canvas.height - this.radius;
        }
        else {
            this.dy += gravity;
        }
        // Apply friction
        this.dx *= friction;
        this.dy *= friction;
        // Stop the ball if its velocity is below the threshold
        if (Math.abs(this.dx) < stopThreshold)
            this.dx = 0;
        if (Math.abs(this.dy) < stopThreshold &&
            this.y + this.radius >= canvas.height - 1)
            this.dy = 0;
        this.x += this.dx;
        this.y += this.dy;
        this.draw(ctx);
    }
}
const balls = [];
const colors = [
    "#FF0000",
    "#0AA900",
    "#000000",
    "#D0C600",
    "#0404D0",
];
canvas.addEventListener("click", (event) => {
    if (balls.length > 14) {
        balls.shift();
    }
    const radius = Math.random() * 20 + 10;
    const x = event.clientX;
    const y = event.clientY;
    const dx = (Math.random() - 0.5) * 4;
    const dy = (Math.random() - 0.5) * 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    balls.push(new BouncingBall(x, y, radius, dx, dy, color));
});
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => {
        ball.update(canvas, balls);
    });
    requestAnimationFrame(animate);
}
animate();
