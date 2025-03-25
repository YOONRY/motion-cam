// sketch.js
let video;
let handposeModel;
let predictions = [];

let reactionButtons = [];
let drawButtons = [];

let showHello = false;
let helloTimer = 0;

let showMosaic = false;
let mosaicTimer = 0;

let showHeart = false;
let heartY = 0;

let showClap = false;
let clapY = 0;

let drawing = false;
let drawingPoints = [];

let smoothX = 0;
let smoothY = 0;
let smoothingFactor = 0.7;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handposeModel = ml5.handpose(video, () => {
    console.log("Handpose model ready!");
  });
  handposeModel.on("predict", results => predictions = results);

  reactionButtons = [
    new ReactionButton(20, 30, 100, 60, "인사"),
    new ReactionButton(130, 30, 100, 60, "모자이크"),
    new ReactionButton(240, 30, 100, 60, "박수"),
    new ReactionButton(350, 30, 100, 60, "하트")
  ];

  // 오른쪽 상단에 가까운 위치로 조정
  drawButtons = [
    new ReactionButton(width - 120, 100, 100, 60, "그리기"),
    new ReactionButton(width - 120, 180, 100, 60, "그리기 종료"),
    new ReactionButton(width - 120, 260, 100, 60, "지우기")
  ];
}

function draw() {
  background(0);

  push();
  translate(width, 0);
  scale(-1, 1);

  if (showMosaic && millis() - mosaicTimer < 2000) {
    mosaicEffect(video);
  } else {
    image(video, 0, 0, width, height);
  }

  for (let btn of reactionButtons) {
    btn.displayMirrored();
  }
  for (let btn of drawButtons) {
    btn.displayMirrored();
  }

  drawKeypointsMirrored();

  if (showHeart) {
    textSize(64);
    textAlign(CENTER, CENTER);
    text("❤️", width / 2, heartY);
    heartY -= 2;
    if (heartY < -50) showHeart = false;
  }

  if (showClap) {
    textSize(64);
    textAlign(CENTER, CENTER);
    text("👏", width / 2, clapY);
    clapY -= 2;
    if (clapY < -50) showClap = false;
  }

  if (showHello && millis() - helloTimer < 2000) {
    push();
    translate(width, 0);
    scale(-1, 1);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("안녕하세요", width / 2, height / 2);
    pop();
  }

  pop();

  push();
  translate(width, 0);
  scale(-1, 1);
  stroke(0);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let pt of drawingPoints) {
    vertex(pt.x, pt.y);
  }
  endShape();
  pop();
}

function drawKeypointsMirrored() {
  if (predictions.length > 0 && predictions[0].handInViewConfidence > 0.8) {
    let landmarks = predictions[0].landmarks;
    let index = landmarks[8];

    let x = index[0];
    let y = index[1];

    smoothX = lerp(smoothX, x, smoothingFactor);
    smoothY = lerp(smoothY, y, smoothingFactor);

    fill(255, 0, 0);
    noStroke();
    ellipse(smoothX, smoothY, 12, 12);

    if (drawing) {
      drawingPoints.push({ x: smoothX, y: smoothY });
    }

    for (let btn of [...reactionButtons, ...drawButtons]) {
      if (btn.isInside(smoothX, smoothY)) {
        btn.trigger();
      }
    }
  }
}

class ReactionButton {
  constructor(x, y, w, h, label) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.active = false;
  }

  displayMirrored() {
    let mirroredX = width - this.x - this.w;
    fill(this.active ? "yellow" : 255);
    stroke(0);
    rect(mirroredX, this.y, this.w, this.h, 10);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    push();
    translate(width, 0);
    scale(-1, 1);
    text(this.label, width - (mirroredX + this.w / 2), this.y + this.h / 2);
    pop();
    this.active = false;
  }

  isInside(px, py) {
    const margin = 10;
    let mirroredX = width - this.x - this.w;
    return (
      px > mirroredX - margin &&
      px < mirroredX + this.w + margin &&
      py > this.y - margin &&
      py < this.y + this.h + margin
    );
  }

  trigger() {
    this.active = true;
    if (this.label === "인사") {
      showHello = true;
      helloTimer = millis();
    } else if (this.label === "모자이크") {
      showMosaic = true;
      mosaicTimer = millis();
    } else if (this.label === "하트") {
      showHeart = true;
      heartY = height;
    } else if (this.label === "박수") {
      showClap = true;
      clapY = height;
    } else if (this.label === "그리기") {
      drawing = true;
    } else if (this.label === "그리기 종료") {
      drawing = false;
    } else if (this.label === "지우기") {
      drawingPoints = [];
    }
  }
}

function mosaicEffect(videoSource) {
  let step = 20;
  for (let y = 0; y < video.height; y += step) {
    for (let x = 0; x < video.width; x += step) {
      let c = video.get(x, y);
      fill(c);
      noStroke();
      rect(x, y, step, step);
    }
  }
}