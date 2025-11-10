//學習1程式碼所在
// --- 圓的設定 ---
let circles = [];
const COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
const NUM_CIRCLES = 20;

let particles = []; // 爆破用粒子陣列
// let popSound; // 已移除音效變數
let score = 0; // 得分

function preload() {
  // 已移除載入音效的程式碼
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 初始化圓
  circles = [];
  for (let i = 0; i < NUM_CIRCLES; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      r: random(50, 200),
      color: color(random(COLORS)),
      alpha: random(80, 255),
      speed: random(1, 5)
    });
  }
}

function draw() {
  background('#fcf6bd');
  noStroke();

  // 左上角固定文字
  push();
  textSize(32);
  fill('#eb6424');
  textAlign(LEFT, TOP);
  text('學號:414730803', 10, 10);
  pop();

  // 右上角顯示得分
  push();
  textSize(32);
  fill('#eb6424');
  textAlign(RIGHT, TOP);
  text(String(score), width - 10, 10);
  pop();

  // 畫並更新圓（移出頂端時僅重置，不自動爆破）
  for (let c of circles) {
    c.y -= c.speed;
    if (c.y + c.r / 2 < 0) { // 若移出畫面頂端 -> 直接重置（不爆破）
      c.y = height + c.r / 2;  // 從底部重新出現
      c.x = random(width);
      c.r = random(50, 200);
      c.color = color(random(COLORS));
      c.alpha = random(80, 255);
      c.speed = random(1, 5);
    }
    c.color.setAlpha(c.alpha); // 設定透明度
    fill(c.color); // 使用設定的顏色
    circle(c.x, c.y, c.r); // 畫圓

    // 在圓的右上方1/4圓的中間產生方形
    let squareSize = c.r / 6;
    let angle = -PI / 4; // 右上45度
    let distance = c.r / 2 * 0.65;
    let squareCenterX = c.x + cos(angle) * distance;
    let squareCenterY = c.y + sin(angle) * distance;
    fill(255, 255, 255, 120); // 白色透明
    noStroke();
    rectMode(CENTER);
    rect(squareCenterX, squareCenterY, squareSize, squareSize);
  }

  // 更新並畫出粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.vy += 0.12; // 重力
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    let alpha = map(p.life, 0, p.maxLife, 0, 255);
    fill(red(p.color), green(p.color), blue(p.color), alpha);
    noStroke();
    ellipse(p.x, p.y, p.r);

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function spawnParticles(x, y, baseColor, count = 30) {
  // 已移除音效播放相關程式碼

  // baseColor 可能是 p5.Color，取其 RGB 值
  const br = red(baseColor);
  const bg = green(baseColor);
  const bb = blue(baseColor);

  for (let i = 0; i < count; i++) {
    let ang = random(TWO_PI);
    let speed = random(1.5, map(count, 12, 60, 2.5, 8));
    let vx = cos(ang) * speed * random(0.5, 1.5);
    let vy = sin(ang) * speed * random(0.5, 1.5);
    let life = floor(random(40, 100));
    particles.push({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      r: random(2, 8),
      life: life,
      maxLife: life,
      color: color(br, bg, bb)
    });
  }
}

// 使用滑鼠點擊時，只有點中的氣球才會爆破並影響分數
function mousePressed() {
  // 已移除 userStartAudio() 呼叫（音效已移除）

  if (circles.length === 0) return;
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d <= c.r / 2) { // 點中該氣球（以半徑判定）
      // 判斷大小 > 150 加分，否則扣分
      if (c.r > 150) {
        score += 1;
      } else {
        score -= 1;
      }

      spawnParticles(c.x, c.y, c.color, floor(map(c.r, 50, 200, 20, 90)));

      // 重置該圓
      c.y = height + c.r / 2;
      c.x = random(width);
      c.r = random(50, 200);
      c.color = color(random(COLORS));
      c.alpha = random(80, 255);
      c.speed = random(1, 5);

      break; // 一次只處理一個氣球
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新分布圓的位置
  for (let c of circles) {
    c.x = random(width);
    c.y = random(height);
  }
}

