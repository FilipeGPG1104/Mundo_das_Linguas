  function getProfileData() {
    try {
      const saved = JSON.parse(localStorage.getItem('mundoLinguasConfig') || '{}');
      return {
        name: saved.name || 'Usuário',
        plan: saved.plan || 'pro',
        password: saved.password || '',
        langs: Array.isArray(saved.langs) ? saved.langs : [],
        schedule: saved.schedule || null
      };
    } catch (error) {
      return {
        name: 'Usuário',
        plan: 'pro',
        password: '',
        langs: [],
        schedule: null
      };
    }
  }

  function getInitials(name) {
    const parts = (name || 'Usuário').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getSelectedLanguages() {
    return getProfileData().langs;
  }

  function shouldShowCard(card, selectedLangs, searchValue) {
    const cardLang = (card.dataset.lang || '').trim();
    const matchesLang = selectedLangs.length === 0 || selectedLangs.includes(cardLang);
    const name = (card.dataset.name || '').toLowerCase();
    const matchesSearch = name.includes(searchValue.toLowerCase());
    return matchesLang && matchesSearch;
  }

  function updateCoursesVisibility(searchValue = '') {
    const selectedLangs = getSelectedLanguages();
    const cards = document.querySelectorAll('.course-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const shouldShow = shouldShowCard(card, selectedLangs, searchValue);
      card.style.display = shouldShow ? '' : 'none';
      if (shouldShow) visibleCount += 1;
    });

    const emptyState = document.getElementById('courses-empty');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  function switchTab(name, el) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('tab-em').style.display  = name === 'em'   ? '' : 'none';
    document.getElementById('tab-con').style.display = name === 'con'  ? '' : 'none';
    document.getElementById('tab-cert').style.display= name === 'cert' ? '' : 'none';
  }

  function filterCourses(val) {
    updateCoursesVisibility(val);
  }

  function applyProfileToUI() {
    const profile = getProfileData();
    const name = profile.name || 'Usuário';
    const initials = getInitials(name);
    const planLabel = profile.plan === 'premium' ? 'Premium' : profile.plan === 'basico' ? 'Básico' : 'Pro';

    const avatar = document.getElementById('profileAvatar');
    const topName = document.getElementById('profileName');
    const heroAvatar = document.getElementById('heroAvatar');
    const greeting = document.getElementById('heroGreeting');
    const userTag = document.getElementById('heroUserTag');
    const planTag = document.getElementById('heroPlanTag');

    if (avatar) avatar.textContent = initials;
    if (heroAvatar) heroAvatar.textContent = initials;
    if (topName) topName.textContent = name.toUpperCase();
    if (greeting) greeting.textContent = 'Seja bem-vindo(a), ' + name + '!';
    if (userTag) userTag.textContent = name.toLowerCase().replace(/\s+/g, '');
    if (planTag) planTag.innerHTML = '<i class="ti ti-diamond" style="font-size:12px"></i> Plano ' + planLabel;
  }

  function openProfileModal() {
    const profile = getProfileData();
    const existing = document.getElementById('profileModal');
    if (existing) {
      existing.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'profile-backdrop';
    modal.innerHTML = [
      '<div class="profile-modal">',
      '<h3>Editar perfil</h3>',
      '<p>Atualize seu nome, plano, senha e cursos preferidos.</p>',
      '<form class="profile-form" id="profileForm">',
      '<label>',
      'Nome',
      '<input type="text" name="name" value="' + (profile.name || '') + '" required>',
      '</label>',
      '<label>',
      'Plano',
      '<select name="plan">',
      '<option value="basico" ' + (profile.plan === 'basico' ? 'selected' : '') + '>Básico</option>',
      '<option value="pro" ' + (profile.plan === 'pro' ? 'selected' : '') + '>Pro</option>',
      '<option value="premium" ' + (profile.plan === 'premium' ? 'selected' : '') + '>Premium</option>',
      '</select>',
      '</label>',
      '<label>',
      'Nova senha',
      '<input type="password" name="password" placeholder="Deixe em branco para manter a atual">',
      '</label>',
      '<label>',
      'Cursos',
      '<div class="profile-options">',
      '<label><input type="checkbox" name="langs" value="en" ' + (profile.langs.includes('en') ? 'checked' : '') + '> Inglês</label>',
      '<label><input type="checkbox" name="langs" value="es" ' + (profile.langs.includes('es') ? 'checked' : '') + '> Espanhol</label>',
      '<label><input type="checkbox" name="langs" value="fr" ' + (profile.langs.includes('fr') ? 'checked' : '') + '> Francês</label>',
      '<label><input type="checkbox" name="langs" value="de" ' + (profile.langs.includes('de') ? 'checked' : '') + '> Alemão</label>',
      '<label><input type="checkbox" name="langs" value="it" ' + (profile.langs.includes('it') ? 'checked' : '') + '> Italiano</label>',
      '<label><input type="checkbox" name="langs" value="zh" ' + (profile.langs.includes('zh') ? 'checked' : '') + '> Mandarim</label>',
      '</div>',
      '</label>',
      '<div class="profile-actions">',
      '<button type="button" class="btn-cancel" onclick="closeProfileModal()">Cancelar</button>',
      '<button type="button" class="btn-cancel" onclick="window.location.href=\'../Onboard/config.html\'">Mudar plano e cursos</button>',
      '<button type="submit" class="btn-save">Salvar</button>',
      '</div>',
      '</form>',
      '</div>'
    ].join('');

    document.body.appendChild(modal);
    const form = document.getElementById('profileForm');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(form);
        const selectedLangs = Array.from(document.querySelectorAll('input[name="langs"]:checked')).map(item => item.value);
        const updatedProfile = {
          name: (data.get('name') || '').toString().trim() || 'Usuário',
          plan: (data.get('plan') || 'pro').toString(),
          password: (data.get('password') || '').toString().trim() || profile.password,
          langs: selectedLangs,
          schedule: profile.schedule
        };

        localStorage.setItem('mundoLinguasConfig', JSON.stringify(updatedProfile));
        applyProfileToUI();
        updateCoursesVisibility();
        closeProfileModal();
      });
    }
  }

  function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
      modal.remove();
    }
  }

  function sairDashboard() {
    localStorage.removeItem('mundoLinguasConfig');
    window.location.href = '../login/login.html';
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyProfileToUI();
    updateCoursesVisibility();
  });