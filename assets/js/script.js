  // ===== VIDÉO ÉDITION 2025 =====
  function playVideo(wrapper) {
    const vimeoId = 'XXXXXXXXX'; // ⚠️ À remplacer par le vrai ID Vimeo
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`;
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
    wrapper.innerHTML = '';
    wrapper.appendChild(iframe);
    wrapper.style.cursor = 'default';
  }

  // ===== PROGRAMME : changement de jour =====
  function switchDay(btn, day) {
    document.querySelectorAll('.programme-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.programme-day').forEach(d => d.classList.remove('active'));
    document.querySelector(`.programme-day[data-day="${day}"]`).classList.add('active');
    // Reset filtre
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('.filter-chip').classList.add('active');
    document.querySelectorAll('.programme-event').forEach(e => e.style.display = '');
  }

  // ===== PROGRAMME : filtres =====
  function filterEvents(btn, type) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const activeDay = document.querySelector('.programme-day.active');
    activeDay.querySelectorAll('.programme-event').forEach(event => {
      if (type === 'all' || event.dataset.type === type) {
        event.style.display = '';
      } else {
        event.style.display = 'none';
      }
    });
  }

  // ===== ACCRÉDITATION : navigation entre étapes =====
  let currentStep = 1;
  const totalSteps = 4;

  function showStep(step) {
    document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.step-content[data-step="${step}"]`).classList.add('active');

    document.querySelectorAll('.step-progress-item').forEach((item, i) => {
      item.classList.remove('active', 'completed');
      if (i + 1 < step) item.classList.add('completed');
      else if (i + 1 === step) item.classList.add('active');
    });

    // Mise à jour de la barre de progression
    const progressFill = document.getElementById('progressFill');
    const progress = ((step - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = progress + '%';

    // Scroll vers le haut de la section
    document.getElementById('accreditation').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function nextStep() {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  }

  function selectOption(btn, group) {
    btn.parentElement.querySelectorAll('.step-option').forEach(o => o.classList.remove('selected'));
    btn.classList.add('selected');
  }

  function submitAccreditation() {
    alert('Votre demande d\'accréditation a été enregistrée ! Vous recevrez une réponse par email sous 5 jours ouvrés.');
  }
