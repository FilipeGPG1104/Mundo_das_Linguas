document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('billingToggle');
  const badgeSave = document.querySelector('.badge-save');

  function atualizarPrecos(isAnnual) {
    document.querySelectorAll('.plan-card').forEach(function (card) {
      const monthlyEl = card.querySelector('.price-value.monthly');
      const annualEl = card.querySelector('.price-value.annual');
      const noteEl = card.querySelector('.price-annual-note');

      if (monthlyEl && annualEl) {
        monthlyEl.style.display = isAnnual ? 'none' : '';
        annualEl.style.display = isAnnual ? '' : 'none';
      }

      if (noteEl) {
        noteEl.style.display = isAnnual ? 'block' : 'none';
      }
    });

    if (badgeSave) {
      badgeSave.textContent = isAnnual ? 'Cobrança anual' : 'Economize até 20%';
    }
  }

  if (toggle) {
    toggle.addEventListener('change', function () {
      atualizarPrecos(this.checked);
    });

    atualizarPrecos(toggle.checked);
  }

  document.getElementById('btn-login-planos')?.addEventListener('click', function () {
    window.location.href = '../login/login.html?mode=login';
  });

  document.getElementById('btn-register-planos')?.addEventListener('click', function () {
    window.location.href = '../login/login.html?mode=register';
  });

  document.querySelectorAll('.btn-plan, .compare-link').forEach(function (botao) {
    botao.addEventListener('click', function () {
      window.location.href = '../login/login.html?mode=register';
    });
  });

  document.querySelectorAll('.faq-q').forEach(function (botao) {
    botao.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const answer = document.getElementById(targetId);
      const chevron = this.querySelector('.chevron');
      const isOpen = answer?.classList.contains('open');

      document.querySelectorAll('.faq-a').forEach(function (item) {
        item.classList.remove('open');
      });

      document.querySelectorAll('.chevron').forEach(function (icon) {
        icon.classList.remove('open');
      });

      if (!isOpen && answer && chevron) {
        answer.classList.add('open');
        chevron.classList.add('open');
      }
    });
  });
});