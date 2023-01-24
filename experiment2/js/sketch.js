// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let canvasContainer;
let screenDivisions = 200;
var field;
console.log("← →   Decrease/Increase x complexity");
console.log("↑ ↓   Increase/decrease vertical line spacing");
console.log("- +   Decrease/Increase line length");
console.log("< >   Decrease/Increase line offset");
console.log("Space New seed")

class Line {
  constructor(xNoiseFreq, activeSegments, segmentOffset, xIncrement, yOffset){
    this.xNoiseFreq = xNoiseFreq;
    this.points = Array();
    this.xIncrement = xIncrement;
    this.activeSegments = activeSegments;
    this.currentSegment = segmentOffset % screenDivisions;
    this.yOffset = yOffset;
    
    
    // For loop ensures points are drawn past left and right edges of screen
    for (let i = -1; i < screenDivisions + 1; i++) {
      this.points.push(new Point( i * this.xIncrement, noise((i * this.xIncrement) * this.xNoiseFreq) * height + this.yOffset ))
    }
  }

  Draw() {
    let segmentTail = this.currentSegment - this.activeSegments < 0 ? 0 : this.currentSegment - this.activeSegments;
    let segmentHead = this.currentSegment > screenDivisions + 1 ? screenDivisions + 1 : this.currentSegment
    beginShape();
    for (let i = segmentTail; i < segmentHead; i++) {
      curveVertex(this.points[i].x, this.points[i].y);
    }
    endShape();
    if(segmentTail >= screenDivisions) {
      this.currentSegment = 0
    } else {
      this.currentSegment += 1;
    }
    
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Field {
  constructor(screenDivisions) {
    this.verticalLineSpacing = 50;
    
    this.activeSegments = 50;
    this.startingOffset = 1;
    this.xFreq = 0.01;
    this.xFreqStep = 1.1
    this.lineSet = Array();
    this.screenDivisions = screenDivisions
    this.inc = width/this.screenDivisions;
    }
  
  GenerateNewLines(newSeed){
    if(newSeed)
      noiseSeed(frameCount);
    
    // Clear array
    this.lineSet = [];
    for (let i = 0; i < 4*height/this.verticalLineSpacing; i++) {
    this.lineSet.push(new Line(this.xFreq, this.activeSegments, this.startingOffset * i ,this.inc, (width * -1) + i * this.verticalLineSpacing));
    }
  }
  
  changeParams(key) {
    if (key === 'ArrowUp') {
      this.verticalLineSpacing++;
      this.GenerateNewLines(false);
    } else if (key === 'ArrowDown') {
      if(this.verticalLineSpacing > 1) {
        this.verticalLineSpacing--;
        this.GenerateNewLines(false);
      }
    } else if (key === 'ArrowLeft') {
      this.xFreq /= this.xFreqStep;
      this.GenerateNewLines(false);
    } else if (key === 'ArrowRight') {
      this.xFreq *= this.xFreqStep;
      this.GenerateNewLines(false);
    } else if (key === " ") {
      this.GenerateNewLines(true);
    } else if (key === '+' || key === '=') {
      if(this.activeSegments < this.screenDivisions) {
        this.activeSegments++;
        this.lineSet.forEach(line => (line.activeSegments++))
      }
    } else if (key === '-' || key === '_') {
      if(this.activeSegments > 1) {
        this.activeSegments--;
        this.lineSet.forEach(line => (line.activeSegments--))
      }
    } else if(key === '.' || key === '>') {
      if(this.startingOffset < this.screenDivisions) {
        this.startingOffset++
        this.GenerateNewLines(false)
      }
    } else if(key === ',' || key === '<') {
        if(this.startingOffset > -this.screenDivisions) {
          this.startingOffset--
          this.GenerateNewLines(false)
        }
    }
  }
  
  Draw() {
    background(0);
    this.lineSet.forEach(line => {
      line.Draw(); 
    })
  }
  
}

// setup() function is called once when the program starts
function setup() {
    // place our canvas, making it fit our container
    canvasContainer = $("#canvas-container");
    let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
    canvas.parent("canvas-container");
    // resize canvas is the page is resized
    $(window).resize(function() {
        console.log("Resizing...");
        resizeCanvas(canvasContainer.width(), canvasContainer.height());
    });

    noFill();
    stroke(255);
    field = new Field(screenDivisions);
    field.GenerateNewLines(false);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
    field.Draw();
}

function keyPressed()
{
    field.changeParams(key);
}