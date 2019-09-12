var transparentDemo = true;
var fixedTop = false;

$(window).scroll(function(e) {
    oVal = ($(window).scrollTop() / 170);
    $(".blur").css("opacity", oVal);
    
});

const canvas = document.getElementById("canvas"),
      context = canvas.getContext("2d"),
      width = canvas.width = window.innerWidth * 2,
      height = canvas.height = window.innerHeight * 2,
      densityX = 110,
      densityY = 100,
      devideX = Math.floor(width / densityX),
      devideY = Math.floor(height / densityY),
      largeSize = [24, 18, 16],
      middleSize = [14, 13],
      smallSize = [12, 8],
      colorPallet_1 = ["#ba9217", "#a11e5d", "#fcc335", "#23a5b8"],
      colorPallet_2 = ["#755812", "#66133B", "#004959"],
      colorPallet_3 = ["#3b2c09", "#003a47"],
      originSpeed = .4,
      speed2 = 4.8;

var largeParticles = [],
    middleParticles = [],
    smallParticles = [],
    collision = false;

class Particle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.r = size;
        this.angle = Math.random() * Math.PI * 2;
        this.vx = originSpeed * Math.cos(this.angle);
        this.vy = originSpeed * Math.sin(this.angle);
        this.color = color;
    }

    update() {
        if (this.x - this.r < 0 || this.x + this.r > width) {
            this.vx *= -1;
        } else if (this.y - this.r < 0 || this.y + this.r > height) {
            this.vy *= -1;
        }

        if (!collision) {
            //current velocity
            var cv = { s: this.currentSpeed(), a: this.currentAngle() };

            //easing
            if (originSpeed < cv.s) {
                this.vx -= Math.cos(cv.a) * (cv.s - originSpeed) * .1;
                this.vy -= Math.sin(cv.a) * (cv.s - originSpeed) * .1;
            }
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    currentSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    currentAngle() {
        return Math.atan2(this.vy, this.vx);
    }
}

//set particles
for (var h = 0; h < devideY; h += 1) {
    for (var w = 0; w < devideX; w += 1) {
        //avoid collision
        var x = densityX * w + 80 + (densityX - 160) * Math.random(),
            y = densityY * h + 80 + (densityY - 160) * Math.random(),
            randomNum = Math.floor(Math.random() * 3.5);
        if (randomNum === 0 || randomNum === 2) {
            largeParticles.push(
              new Particle(x, y, largeSize[Math.floor(Math.random() * largeSize.length)],
                          colorPallet_1[Math.floor(Math.random() * colorPallet_1.length)])
              );
        }
        if (randomNum === 0 || randomNum === 1) {
            middleParticles.push(
              new Particle(x, y, middleSize[Math.floor(Math.random() * middleSize.length)],
                          colorPallet_2[Math.floor(Math.random() * colorPallet_2.length)])
              );
        }
        if (randomNum === 1 || randomNum === 2) {
            smallParticles.push(
              new Particle(x, y, smallSize[Math.floor(Math.random() * smallSize.length)],
                          colorPallet_3[Math.floor(Math.random() * colorPallet_3.length)])
            );
        }
    }
}

function checkDistance(array) {
    for (var i = 0, len = array.length; i < len - 1; i++) {
        for (var j = i + 1; j < len; j++) {
            var p0 = array[i],
                p1 = array[j],
                pDistance = (p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y),
                pAngle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

            if ((pDistance < 20000 && array === largeParticles) ||
               (pDistance < 15000 && array === middleParticles) ||
               (pDistance < 9000 && array === smallParticles)
              ) {
                context.globalAlpha = .6;

                if (array === largeParticles) {
                    context.strokeStyle = "#fff";
                } else if (array === middleParticles) {
                    context.strokeStyle = "#666";
                } else if (array === smallParticles) {
                    context.strokeStyle = "#333";
                }


                context.beginPath();
                context.moveTo(p0.x, p0.y);
                context.lineTo(p1.x, p1.y);
                context.stroke();
            }

            if (pDistance < (p0.r + p1.r) * (p0.r + p1.r)) {
                collision = true;
                p1.vx = Math.cos(pAngle) * speed2;
                p1.vy = Math.sin(pAngle) * speed2;
                p0.vx = -Math.cos(pAngle) * speed2;
                p0.vy = -Math.sin(pAngle) * speed2;
            } else {
                collision = false;
            }
        }
    }
}

function draw(array) {
    checkDistance(array);
    for (var i = 0, len = array.length; i < len; i++) {
        var p = array[i];
        p.update();
        context.globalAlpha = 1;
        context.fillStyle = p.color;
        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
        context.fill();
    }
}

render();
function render() {
    context.clearRect(0, 0, width, height);
    draw(smallParticles);
    draw(middleParticles);
    draw(largeParticles);
    requestAnimationFrame(render);
}
$(document).ready(function () {

    // Even when the window is resized, run this code.
    $(window).resize(function () {

        // Variables
        var windowHeight = $(window).height();

        // Find the value of 90% of the viewport height
        var ninetypercent = .9 * windowHeight;

        // When the document is scrolled ninety percent, toggle the classes
        // Does not work in iOS 7 or below
        // Hasn't been tested in iOS 8
        $(document).scroll(function () {

            // Store the document scroll function in a variable
            var y = $(this).scrollTop();

            // If the document is scrolled 90%
            if (y > ninetypercent) {

                // Add the "sticky" class
                $('nav').addClass('sticky');
            } else {
                // Else remove it.
                $('nav').removeClass('sticky');
            }
        });

        // Call it on resize.
    }).resize();

}); // jQuery