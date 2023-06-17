const ball = document.getElementById("ball");

let xPosition = 0;

function moveBallInfinitely() {
    if (xPosition == 0) {
        xPosition = 100;
        ball.style.left = `${xPosition}%`;
        // make sure the ball stay at the end of the screen.
        ball.style.transform = "translateX(-100%) rotate(360deg)";
    } else {
        xPosition = 0;
        ball.style.left = `${xPosition}%`;
        ball.style.transform = "translateX(0%) rotate(0deg)";
    }
}

setInterval(moveBallInfinitely, 2000);;
