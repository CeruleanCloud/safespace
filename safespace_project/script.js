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
  // 3. Landing Page Navigation (index.html)
  // ==========================================================
  const checkInBtn = document.getElementById('checkInBtn');
  if (checkInBtn) {
    checkInBtn.addEventListener('click', function() {
      window.location.href = 'check-in.html';
    });
  }

  // ==========================================================
  // 4. Check-In Selection & Navigation (check-in.html)
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
        window.location.href = 'activities.html';
      }
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', function() {
      localStorage.removeItem('safespace_selected_mood');
      window.location.href = 'activities.html';
    });
  }
});