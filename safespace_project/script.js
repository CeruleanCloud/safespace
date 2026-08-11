document.addEventListener('DOMContentLoaded', function() {
  // ==========================================================
  // 1. Custom Cursor Movement
  // ==========================================================
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    window.addEventListener('mousemove', function(e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }

  // ==========================================================
  // 2. Theme Persistence & Switching
  // ==========================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('safespace_theme');

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = 'Dark Mode';
  } else if (themeToggleBtn) {
    themeToggleBtn.textContent = 'Light Mode';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('safespace_theme', isLight ? 'light' : 'dark');
      themeToggleBtn.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    });
  }

  // ==========================================================
  // 3. Landing Page CTA Navigation
  // ==========================================================
  const checkInBtn = document.getElementById('checkInBtn');
  if (checkInBtn) {
    checkInBtn.addEventListener('click', function() {
      window.location.href = 'check-in.html';
    });
  }

  // ==========================================================
  // 4. Check-In Selection & Redirection to Activities Page
  // ==========================================================
  const emotionCards = document.querySelectorAll('.emotion-card');
  const submitBtn = document.getElementById('submitCheckInBtn');
  const skipBtn = document.getElementById('skipCheckInBtn');
  let selectedEmotion = null;

  if (emotionCards.length > 0) {
    emotionCards.forEach(card => {
      card.addEventListener('click', function() {
        emotionCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedEmotion = this.getAttribute('data-emotion');

        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      if (selectedEmotion) {
        localStorage.setItem('safespace_selected_mood', selectedEmotion);
      }
      window.location.href = 'activities.html';
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', function() {
      localStorage.removeItem('safespace_selected_mood');
      window.location.href = 'activities.html';
    });
  }

  // ==========================================================
  // 5. Activities Page Dynamic Tailoring
  // ==========================================================
  const moodGreeting = document.getElementById('moodGreeting');
  const moodSubtext = document.getElementById('moodSubtext');
  const currentMood = localStorage.getItem('safespace_selected_mood');

  if (moodGreeting) {
    if (currentMood) {
      const moodMap = {
        bright: { title: "Feeling Bright", text: "Let's channel that positive energy with music, expression, and joy.", recommend: "music-section" },
        steady: { title: "Feeling Steady", text: "A balanced space to reflect, write, and stay grounded.", recommend: "journal-section" },
        heavy: { title: "Feeling Heavy", text: "Take things slow. Soft soundscapes and breathing are here for you.", recommend: "breathing-section" },
        overloaded: { title: "Feeling Overloaded", text: "Let's pause together. Unwind with box breathing or a focus game.", recommend: "breathing-section" }
      };

      const config = moodMap[currentMood];
      if (config) {
        moodGreeting.textContent = config.title;
        moodSubtext.textContent = config.text;

        const recCard = document.getElementById(config.recommend);
        if (recCard) recCard.classList.add('recommended');
      }
    } else {
      moodGreeting.textContent = "Welcome to Activities";
      moodSubtext.textContent = "Take your time exploring breathing exercises, music, journaling, and games.";
    }
  }

  // ==========================================================
  // 6. Box Breathing Logic
  // ==========================================================
  const startBreathingBtn = document.getElementById('startBreathingBtn');
  const breathingCircle = document.getElementById('breathingCircle');
  const breathInstruction = document.getElementById('breathInstruction');
  let breathingInterval = null;

  if (startBreathingBtn && breathingCircle && breathInstruction) {
    startBreathingBtn.addEventListener('click', function() {
      if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
        breathingCircle.className = 'breathing-circle-inner';
        breathInstruction.textContent = 'Press start to begin';
        startBreathingBtn.textContent = 'Start Breathing';
        return;
      }

      startBreathingBtn.textContent = 'Stop';
      let step = 0;

      function runPhase() {
        if (step === 0) {
          breathInstruction.textContent = 'Inhale... (4s)';
          breathingCircle.className = 'breathing-circle-inner inhale';
        } else if (step === 1) {
          breathInstruction.textContent = 'Hold... (4s)';
        } else if (step === 2) {
          breathInstruction.textContent = 'Exhale... (4s)';
          breathingCircle.className = 'breathing-circle-inner exhale';
        } else if (step === 3) {
          breathInstruction.textContent = 'Hold... (4s)';
        }
        step = (step + 1) % 4;
      }

      runPhase();
      breathingInterval = setInterval(runPhase, 4000);
    });
  }

  // ==========================================================
  // 7. Auto-Saving Journal
  // ==========================================================
  const journalInput = document.getElementById('journalInput');
  const journalStatus = document.getElementById('journalStatus');

  if (journalInput) {
    journalInput.value = localStorage.getItem('safespace_journal_entry') || '';

    journalInput.addEventListener('input', function() {
      localStorage.setItem('safespace_journal_entry', this.value);
      if (journalStatus) {
        journalStatus.textContent = 'Saving...';
        setTimeout(() => { journalStatus.textContent = 'Saved locally'; }, 600);
      }
    });
  }

  // ==========================================================
  // 8. Positive Affirmation Generator
  // ==========================================================
  const affirmations = [
    "You are capable of handling whatever comes your way today.",
    "Resting is productive. Give yourself permission to pause.",
    "Your feelings are valid, and you don't have to figure everything out right now.",
    "Small steps still move you forward.",
    "You are worthy of kindness, peace, and patience."
  ];

  const affirmationText = document.getElementById('affirmationText');
  const nextAffirmationBtn = document.getElementById('nextAffirmationBtn');

  if (nextAffirmationBtn && affirmationText) {
    nextAffirmationBtn.addEventListener('click', function() {
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      affirmationText.textContent = `"${affirmations[randomIndex]}"`;
    });
  }
});

// ==========================================================
// 9. p5.js Game Instance (Mounted in #p5-canvas-container)
// ==========================================================
if (document.getElementById('p5-canvas-container')) {
  new p5(function(p) {
    let rockX = 250;
    let rockY = 800;

    let startX = 250;
    let startY = 800;

    let people = 1;
    let speed = 3.5;

    let pushing = false;
    let won = false;

    let canAddPerson = false;

    let resets = 0;

    // Try Again
    let showTryAgain = false;
    let tryAgainTimer = 0;

    // Falling rock
    let fallingRockX = 0;
    let fallingRockY = 0;
    let fallingRockSpeedX = 0;
    let fallingRockSpeedY = 0;
    let fallingRockActive = false;

    p.setup = function() {
      const container = document.getElementById('p5-canvas-container');
      const canvas = p.createCanvas(1000, 1000);
      canvas.parent(container);
      p.frameRate(120);
    };

    p.draw = function() {
      let dayAmount = 0;

      if (people == 5) {
        dayAmount = p.constrain((rockX - 250) / 750, 0, 1);
        dayAmount = dayAmount * dayAmount * (3 - 2 * dayAmount);
      }

      let skyR = p.lerp(8, 100, dayAmount);
      let skyG = p.lerp(12, 180, dayAmount);
      let skyB = p.lerp(40, 240, dayAmount);

      p.background(skyR, skyG, skyB);

      // Stars
      let starAlpha = 255 * (1 - dayAmount);
      p.fill(255, starAlpha);
      p.noStroke();

      p.ellipse(80, 100, 3, 3);
      p.ellipse(150, 180, 4, 4);
      p.ellipse(230, 80, 3, 3);
      p.ellipse(310, 150, 3, 3);
      p.ellipse(390, 60, 4, 4);
      p.ellipse(470, 130, 3, 3);
      p.ellipse(550, 75, 3, 3);
      p.ellipse(630, 180, 4, 4);
      p.ellipse(710, 90, 3, 3);
      p.ellipse(780, 160, 3, 3);
      p.ellipse(860, 70, 4, 4);
      p.ellipse(930, 140, 3, 3);

      p.ellipse(120, 300, 3, 3);
      p.ellipse(200, 250, 4, 4);
      p.ellipse(300, 320, 3, 3);
      p.ellipse(450, 250, 3, 3);
      p.ellipse(600, 300, 3, 3);
      p.ellipse(750, 260, 4, 4);
      p.ellipse(900, 320, 3, 3);

      // Moon
      let moonAlpha = 255 * (1 - dayAmount);
      p.fill(255, 250, 210, moonAlpha);
      p.ellipse(820, 130, 100, 100);

      p.fill(skyR, skyG, skyB, moonAlpha);
      p.ellipse(850, 105, 90, 90);

      // Sun
      let sunAlpha = 255 * dayAmount;
      p.fill(255, 235, 120, sunAlpha * 0.2);
      p.ellipse(820, 130, 190, 190);

      p.fill(255, 220, 70, sunAlpha);
      p.ellipse(820, 130, 100, 100);

      // Distant Mountains
      p.fill(
        p.lerp(18, 70, dayAmount),
        p.lerp(25, 90, dayAmount),
        p.lerp(50, 125, dayAmount)
      );
      p.noStroke();

      p.beginShape();
      p.vertex(0, 650);
      p.vertex(120, 560);
      p.vertex(230, 630);
      p.vertex(350, 500);
      p.vertex(470, 620);
      p.vertex(600, 450);
      p.vertex(730, 590);
      p.vertex(850, 460);
      p.vertex(1000, 580);
      p.vertex(1000, 900);
      p.vertex(0, 900);
      p.endShape(p.CLOSE);

      // Mountain Highlights
      p.fill(
        p.lerp(35, 130, dayAmount),
        p.lerp(40, 145, dayAmount),
        p.lerp(65, 170, dayAmount)
      );

      p.beginShape();
      p.vertex(120, 560);
      p.vertex(230, 630);
      p.vertex(350, 500);
      p.vertex(470, 620);
      p.vertex(600, 450);
      p.vertex(730, 590);
      p.vertex(850, 460);
      p.vertex(1000, 580);
      p.vertex(950, 610);
      p.vertex(850, 500);
      p.vertex(730, 630);
      p.vertex(600, 490);
      p.vertex(470, 660);
      p.vertex(350, 540);
      p.vertex(230, 670);
      p.endShape(p.CLOSE);

      // Dark Cliff
      p.fill(65, 38, 25);
      p.noStroke();

      p.beginShape();
      p.vertex(0, 900);
      p.vertex(130, 895);
      p.vertex(250, 830);
      p.vertex(380, 750);
      p.vertex(510, 670);
      p.vertex(640, 590);
      p.vertex(770, 510);
      p.vertex(900, 420);
      p.vertex(1000, 350);
      p.vertex(1000, 1000);
      p.vertex(0, 1000);
      p.endShape(p.CLOSE);

      // Light Cliff Surface
      p.fill(125, 72, 38);
      p.beginShape();
      p.vertex(0, 900);
      p.vertex(130, 895);
      p.vertex(250, 830);
      p.vertex(380, 750);
      p.vertex(510, 670);
      p.vertex(640, 590);
      p.vertex(770, 510);
      p.vertex(900, 420);
      p.vertex(1000, 350);
      p.vertex(1000, 395);
      p.vertex(900, 465);
      p.vertex(770, 555);
      p.vertex(640, 635);
      p.vertex(510, 715);
      p.vertex(380, 795);
      p.vertex(250, 875);
      p.vertex(130, 930);
      p.vertex(0, 940);
      p.endShape(p.CLOSE);

      // Cliff Shadow
      p.fill(75, 43, 26);
      p.beginShape();
      p.vertex(0, 940);
      p.vertex(130, 930);
      p.vertex(250, 875);
      p.vertex(380, 795);
      p.vertex(510, 715);
      p.vertex(640, 635);
      p.vertex(770, 555);
      p.vertex(900, 465);
      p.vertex(1000, 395);
      p.vertex(1000, 1000);
      p.vertex(0, 1000);
      p.endShape(p.CLOSE);

      // Cliff Top
      p.fill(150, 88, 45);
      p.beginShape();
      p.vertex(0, 900);
      p.vertex(130, 895);
      p.vertex(250, 830);
      p.vertex(380, 750);
      p.vertex(510, 670);
      p.vertex(640, 590);
      p.vertex(770, 510);
      p.vertex(900, 420);
      p.vertex(1000, 350);
      p.vertex(990, 370);
      p.vertex(900, 440);
      p.vertex(770, 530);
      p.vertex(640, 610);
      p.vertex(510, 690);
      p.vertex(380, 770);
      p.vertex(250, 850);
      p.vertex(130, 915);
      p.vertex(0, 920);
      p.endShape(p.CLOSE);

      // Rock Movement
      if (pushing && !won && !fallingRockActive) {
        let groupSpeed = speed + (people - 1) * 2.5;
        rockX += groupSpeed * 0.12;
        rockY -= groupSpeed * 0.09;
      }

      // Progress Points
      let fallPoint;
      if (people == 1) fallPoint = 250 + 750 * (1 / 5);
      else if (people == 2) fallPoint = 250 + 750 * (2 / 5);
      else if (people == 3) fallPoint = 250 + 750 * (3 / 5);
      else if (people == 4) fallPoint = 250 + 750 * (4 / 5);
      else fallPoint = 1000;

      // Start Falling
      if (rockX > fallPoint && people < 5 && !fallingRockActive) {
        fallingRockX = rockX;
        fallingRockY = rockY;
        fallingRockSpeedX = -2;
        fallingRockSpeedY = 1;
        fallingRockActive = true;
        pushing = false;
        resets++;
        canAddPerson = false;
        showTryAgain = true;
        tryAgainTimer = 120;
      }

      // Falling Rock Physics
      if (fallingRockActive) {
        fallingRockX += fallingRockSpeedX;
        fallingRockY += fallingRockSpeedY;
        fallingRockSpeedY += 0.18;
        fallingRockSpeedX -= 0.01;

        if (fallingRockY > 900) {
          fallingRockActive = false;
          rockX = startX;
          rockY = startY;
          canAddPerson = true;
          tryAgainTimer = 70;
        }
      }

      if (showTryAgain) {
        tryAgainTimer--;
        if (tryAgainTimer <= 0) showTryAgain = false;
      }

      if (people == 5 && rockX >= 1000) {
        won = true;
        pushing = false;
      }

      if (!fallingRockActive) drawRock(rockX, rockY);
      else drawFallingRock(fallingRockX, fallingRockY);

      if (!fallingRockActive) {
        for (let i = 0; i < people; i++) {
          let personX = rockX - 50 - i * 28;
          let personY = rockY + 25 + i * 20;
          drawPerson(personX, personY, dayAmount);
        }
      }

      // Instructions UI
      p.fill(255);
      p.textSize(20);

      if (people > 1) p.text("People helping: " + people, 30, 40);
      p.text("Hold RIGHT ARROW to push", 30, 70);

      if (canAddPerson && people < 5) {
        p.text("Press SPACE to add a helper", 30, 100);
      }

      if (showTryAgain) {
        p.textAlign(p.CENTER);
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(7);
        p.textSize(42);
        p.text("TRY AGAIN!", p.width / 2, 300);

        p.textSize(20);
        p.text("The rock slipped, but you can try again!", p.width / 2, 335);
        p.noStroke();
        p.textAlign(p.LEFT);
      }

      if (won) {
        p.textAlign(p.CENTER);
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(5);
        p.textSize(25);
        p.text(
          "With the right peers, your problems will become weightless\nand you will be able to push through all difficulties.",
          p.width / 2,
          150
        );

        p.textSize(20);
        p.text("Press ENTER to help someone else start pushing.", p.width / 2, 220);
        p.noStroke();
        p.textAlign(p.LEFT);
      }
    };

    function drawRock(x, y) {
      p.fill(35, 25, 25, 100);
      p.ellipse(x + 8, y + 43, 90, 25);
      p.fill(75, 73, 70);
      p.ellipse(x, y, 90, 90);
      p.fill(105, 103, 98);
      p.ellipse(x - 15, y - 15, 55, 50);
      p.fill(50, 48, 45);
      p.arc(x + 12, y, 65, 78, -p.HALF_PI, p.HALF_PI);
      p.fill(130, 127, 120, 100);
      p.ellipse(x - 22, y - 24, 12, 8);
    }

    function drawFallingRock(x, y) {
      p.push();
      p.translate(x, y);
      p.rotate(p.frameCount * 0.12);
      p.fill(35, 25, 25, 100);
      p.ellipse(8, 43, 90, 25);
      p.fill(75, 73, 70);
      p.ellipse(0, 0, 90, 90);
      p.fill(105, 103, 98);
      p.ellipse(-15, -15, 55, 50);
      p.fill(50, 48, 45);
      p.arc(12, 0, 65, 78, -p.HALF_PI, p.HALF_PI);
      p.fill(130, 127, 120, 100);
      p.ellipse(-22, -24, 12, 8);
      p.pop();
    }

    function drawPerson(x, y, sunlight) {
      let sunlightStrength = 0;
      if (people == 5) {
        sunlightStrength = p.constrain((rockX - 650) / 350, 0, 1);
      }

      let skinR = p.lerp(160, 215, sunlightStrength);
      let skinG = p.lerp(160, 195, sunlightStrength);
      let skinB = p.lerp(160, 135, sunlightStrength);

      let shirtR = p.lerp(55, 135, sunlightStrength);
      let shirtG = p.lerp(75, 105, sunlightStrength);
      let shirtB = p.lerp(120, 145, sunlightStrength);

      p.stroke(40);
      p.strokeWeight(6);
      p.line(x - 6, y + 42, x - 9, y + 57);
      p.line(x + 6, y + 42, x + 9, y + 57);

      p.stroke(25);
      p.strokeWeight(5);
      p.line(x - 9, y + 57, x - 15, y + 57);
      p.line(x + 9, y + 57, x + 15, y + 57);

      p.noStroke();
      p.fill(shirtR, shirtG, shirtB);
      p.ellipse(x, y + 27, 25, 30);

      p.stroke(skinR, skinG, skinB);
      p.strokeWeight(6);
      p.line(x - 7, y + 22, x + 17, y + 29);
      p.line(x + 7, y + 24, x + 27, y + 32);

      p.noStroke();
      p.fill(skinR, skinG, skinB);
      p.ellipse(x + 19, y + 30, 8, 8);
      p.ellipse(x + 29, y + 33, 8, 8);

      p.fill(skinR, skinG, skinB);
      p.ellipse(x, y, 30, 30);

      p.fill(35);
      p.arc(x, y - 3, 30, 25, p.PI, p.TWO_PI);

      if (sunlightStrength > 0) {
        p.fill(255, 220, 120, 80 * sunlightStrength);
        p.ellipse(x - 6, y - 5, 10, 7);
        p.ellipse(x - 8, y + 20, 7, 12);

        p.stroke(255, 220, 120, 100 * sunlightStrength);
        p.strokeWeight(3);
        p.line(x + 9, y + 23, x + 25, y + 30);
        p.noStroke();
      }
    }

    p.keyPressed = function() {
      if (p.keyCode == p.RIGHT_ARROW && !fallingRockActive) {
        pushing = true;
      }

      if (p.key == " " && canAddPerson && !fallingRockActive && people < 5) {
        people++;
        canAddPerson = false;
      }

      if (p.keyCode == p.ENTER && won) {
        people = 1;
        rockX = startX;
        rockY = startY;
        won = false;
        canAddPerson = false;
        pushing = false;
        resets = 0;
        showTryAgain = false;
        fallingRockActive = false;
      }
    };

    p.keyReleased = function() {
      if (p.keyCode == p.RIGHT_ARROW) {
        pushing = false;
      }
    };
  });
}