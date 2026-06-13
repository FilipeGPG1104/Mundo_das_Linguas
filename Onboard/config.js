var currentStep = 1;
var selectedPlan = 'pro';
var selectedLangs = [];
var selectedSched = null;
var password = '';
var userName = '';

function aplicarTransicao(destino) {
  var overlay = document.createElement('div');
  overlay.id = 'page-transition-overlay';
  overlay.style.cssText = 'position:fixed; inset:0; background:#07111f; opacity:0; z-index:9999; pointer-events:none; transition:opacity 0.35s ease;';
  document.body.appendChild(overlay);

  requestAnimationFrame(function () {
    overlay.style.opacity = '1';
  });

  setTimeout(function () {
    window.location.href = destino;
  }, 350);
}

var planLimits = { basico: 1, pro: 2, premium: 99 };

var planNames = { basico: 'Básico', pro: 'Pro', premium: 'Premium' };

var allLangs = [
  {id:'en', flag:'🇺🇸', name:'Inglês', level:'Básico ao Avançado'},
  {id:'es', flag:'🇪🇸', name:'Espanhol', level:'Básico ao Avançado'},
  {id:'fr', flag:'🇫🇷', name:'Francês', level:'Básico ao Intermediário'},
  {id:'de', flag:'🇩🇪', name:'Alemão', level:'Básico'},
  {id:'it', flag:'🇮🇹', name:'Italiano', level:'Básico'},
  {id:'zh', flag:'🇨🇳', name:'Mandarim', level:'Básico'},
  {id:'jp', flag:'🇯🇵', name:'Japonês', level:'Básico'},
  {id:'pt', flag:'🇧🇷', name:'Português', level:'Negócios'}
];

var schedules = [
  {id:'seg-qua', day:'Seg / Qua', time:'19:00h — 21:00h'},
  {id:'ter-qui', day:'Ter / Qui', time:'19:00h — 21:00h'},
  {id:'sab', day:'Sábado', time:'08:00h — 10:00h'},
  {id:'sab2', day:'Sábado', time:'10:00h — 12:00h'},
  {id:'dom', day:'Domingo', time:'09:00h — 11:00h'},
  {id:'livre', day:'Livre', time:'A definir com prof.'}
];

var stepLabels = ['Senha','Plano','Idiomas','Horário','Pronto!'];
var stepDescs = [
  'Configuração inicial',
  'Escolha de plano',
  'Seleção de idiomas',
  'Horário das aulas',
  'Tudo configurado'
];

function updateProgress(step) {
  for (var i = 1; i <= 5; i++) {
    var d = document.getElementById('d' + i);
    var lbl = document.getElementById('lbl' + i);
    if (i < step) {
      d.className = 'step-dot done';
      if (i < 5) d.innerHTML = '<i class="ti ti-check" style="font-size:13px"></i>';
      lbl.className = 'step-lbl done';
    } else if (i === step) {
      d.className = 'step-dot active';
      d.innerHTML = i < 5 ? i : '<i class="ti ti-check" style="font-size:14px"></i>';
      lbl.className = 'step-lbl active';
    } else {
      d.className = 'step-dot pending';
      d.innerHTML = i < 5 ? i : '<i class="ti ti-check" style="font-size:14px"></i>';
      lbl.className = 'step-lbl pending';
    }
    if (i < 5) {
      var l = document.getElementById('l' + i);
      l.className = 'step-line ' + (i < step ? 'done' : 'pending');
    }
  }
  document.getElementById('topStepLabel').textContent = 'Passo ' + step + ' de 5 — ' + stepDescs[step - 1];
}

function renderStep(step) {
  updateProgress(step);
  var c = document.getElementById('stepCard');
  if (step === 1) renderStep1(c);
  else if (step === 2) renderStep2(c);
  else if (step === 3) renderStep3(c);
  else if (step === 4) renderStep4(c);
  else if (step === 5) renderStep5(c);
}

function renderStep1(c) {
  c.innerHTML = '<div class="setup-icon blue" style="margin:0 auto 20px"><i class="ti ti-lock" style="font-size:30px;color:#185fa5" aria-hidden="true"></i></div>'
    + '<div class="setup-title">Crie sua senha de acesso</div>'
    + '<div class="setup-sub">Bem-vindo(a) ao Mundo das Línguas! Antes de começar,<br>configure sua senha pessoal.</div>'
    + '<div class="form-group"><label class="form-label">Seu nome</label><input class="form-input" id="inp-name" placeholder="Como podemos te chamar?" type="text"></div>'
    + '<div class="form-group"><label class="form-label">Nova senha</label><div class="pass-wrap"><input class="form-input" id="inp-pass" placeholder="Mínimo 8 caracteres" type="password" oninput="checkStrength(this.value)"><button class="pass-toggle" type="button" onclick="togglePass()"><i class="ti ti-eye" id="eye-icon" aria-label="Mostrar senha"></i></button></div>'
    + '<div class="strength-bar"><div class="sbar" id="sb1"></div><div class="sbar" id="sb2"></div><div class="sbar" id="sb3"></div><div class="sbar" id="sb4"></div></div>'
    + '<div class="strength-label" id="strength-lbl">Digite uma senha</div></div>'
    + '<div class="form-group"><label class="form-label">Confirmar senha</label><div class="pass-wrap"><input class="form-input" id="inp-pass2" placeholder="Repita a senha" type="password"></div></div>'
    + '<button class="btn-next" onclick="goStep1()"><i class="ti ti-arrow-right" aria-hidden="true"></i> Continuar</button>';
}

function togglePass() {
  var inp = document.getElementById('inp-pass');
  var icon = document.getElementById('eye-icon');
  if (inp.type === 'password') { inp.type = 'text'; icon.className = 'ti ti-eye-off'; }
  else { inp.type = 'password'; icon.className = 'ti ti-eye'; }
}

function checkStrength(v) {
  var bars = [document.getElementById('sb1'),document.getElementById('sb2'),document.getElementById('sb3'),document.getElementById('sb4')];
  var lbl = document.getElementById('strength-lbl');
  var colors = ['#e24b4a','#ef9f27','#4da8ff','#1d9e75'];
  var labels = ['Muito fraca','Fraca','Boa','Forte'];
  var score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  bars.forEach(function(b, i){ b.style.background = i < score ? colors[Math.min(score-1,3)] : '#e4e8f0'; });
  lbl.textContent = v.length === 0 ? 'Digite uma senha' : labels[Math.min(score-1,3)] || 'Muito fraca';
  lbl.style.color = v.length === 0 ? '#9ba8c0' : colors[Math.min(score-1,3)];
}

function goStep1() {
  var n = document.getElementById('inp-name').value.trim();
  var p = document.getElementById('inp-pass').value;
  var p2 = document.getElementById('inp-pass2').value;
  if (!n) { alert('Por favor, informe seu nome.'); return; }
  if (p.length < 8) { alert('A senha precisa ter pelo menos 8 caracteres.'); return; }
  if (p !== p2) { alert('As senhas não coincidem.'); return; }
  userName = n;
  password = p;
  currentStep = 2; renderStep(2);
}

function renderStep2(c) {
  c.innerHTML = '<div class="setup-icon purple" style="margin:0 auto 20px"><i class="ti ti-diamond" style="font-size:30px;color:#534ab7" aria-hidden="true"></i></div>'
    + '<div class="setup-title">Seu plano</div>'
    + '<div class="setup-sub">Confirme ou altere o plano que você assinou.<br>Isso define quantos idiomas você pode escolher.</div>'
    + '<div class="plan-chips" id="planChips">'
    + makePlanChip('basico','Básico','R$ 149/mês','1 idioma')
    + makePlanChip('pro','Pro','R$ 299/mês','Até 2 idiomas')
    + makePlanChip('premium','Premium','R$ 549/mês','Idiomas ilimitados')
    + '</div>'
    + '<div style="background:#faeeda;border-radius:10px;padding:12px 16px;font-size:12px;color:#633806;display:flex;align-items:flex-start;gap:8px;margin-bottom:24px;">'
    + '<i class="ti ti-info-circle" style="font-size:16px;flex-shrink:0;margin-top:1px" aria-hidden="true"></i>'
    + '<span>Seu plano atual foi definido na assinatura. Para trocar de plano, acesse as configurações após concluir o setup.</span></div>'
    + '<button class="btn-next" onclick="goStep2()"><i class="ti ti-arrow-right" aria-hidden="true"></i> Confirmar plano e continuar</button>'
    + '<button class="btn-back" onclick="currentStep=1;renderStep(1)"><i class="ti ti-arrow-left" aria-hidden="true"></i> Voltar</button>';
  setTimeout(function(){
    document.querySelectorAll('.plan-chip').forEach(function(el){
      el.addEventListener('click',function(){
        document.querySelectorAll('.plan-chip').forEach(function(x){x.classList.remove('selected');});
        el.classList.add('selected');
        selectedPlan = el.dataset.plan;
      });
    });
    var active = document.querySelector('[data-plan="'+selectedPlan+'"]');
    if (active) active.classList.add('selected');
  },50);
}

function makePlanChip(id, name, price, limit) {
  return '<div class="plan-chip" data-plan="'+id+'">'
    + '<div class="plan-chip-name">'+name+'</div>'
    + '<div class="plan-chip-price">'+price+'</div>'
    + '<div class="plan-chip-limit"><i class="ti ti-check" style="font-size:10px" aria-hidden="true"></i> '+limit+'</div>'
    + '</div>';
}

function goStep2() {
  selectedLangs = [];
  currentStep = 3; renderStep(3);
}

function renderStep3(c) {
  var limit = planLimits[selectedPlan];
  var limitText = selectedPlan === 'premium' ? 'Escolha quantos idiomas quiser!' : 'Escolha até <b>' + limit + ' idioma' + (limit > 1 ? 's' : '') + '</b> com seu plano ' + planNames[selectedPlan] + '.';
  var html = '<div class="setup-icon green" style="margin:0 auto 20px"><i class="ti ti-language" style="font-size:30px;color:#0f6e56" aria-hidden="true"></i></div>'
    + '<div class="setup-title">Escolha seus idiomas</div>'
    + '<div class="setup-sub">Selecione os idiomas que você quer aprender.</div>'
    + '<div class="lang-limit-info"><i class="ti ti-info-circle" style="font-size:16px" aria-hidden="true"></i><span>' + limitText + '</span></div>'
    + '<div class="langs-grid">';
  allLangs.forEach(function(l){
    html += '<div class="lang-card" id="lc-'+l.id+'" data-id="'+l.id+'" onclick="toggleLang(\''+l.id+'\')">'
      + '<div class="lang-flag">'+l.flag+'</div>'
      + '<div class="lang-name">'+l.name+'</div>'
      + '<div class="lang-level">'+l.level+'</div>'
      + '</div>';
  });
  html += '</div>'
    + '<div class="selected-count" id="selCount">0 selecionado(s)</div>'
    + '<button class="btn-next" id="btnLangNext" disabled onclick="goStep3()"><i class="ti ti-arrow-right" aria-hidden="true"></i> Confirmar idiomas</button>'
    + '<button class="btn-back" onclick="currentStep=2;renderStep(2)"><i class="ti ti-arrow-left" aria-hidden="true"></i> Voltar</button>';
  c.innerHTML = html;
}

function toggleLang(id) {
  var limit = planLimits[selectedPlan];
  var idx = selectedLangs.indexOf(id);
  if (idx > -1) {
    selectedLangs.splice(idx,1);
  } else {
    if (selectedLangs.length >= limit) {
      if (limit === 1) { selectedLangs = [id]; }
      else { return; }
    } else {
      selectedLangs.push(id);
    }
  }
  allLangs.forEach(function(l){
    var el = document.getElementById('lc-'+l.id);
    if (!el) return;
    var isSel = selectedLangs.indexOf(l.id) > -1;
    el.classList.toggle('selected', isSel);
    var chk = el.querySelector('.lang-check');
    if (isSel && !chk) {
      var span = document.createElement('div');
      span.className = 'lang-check';
      span.innerHTML = '<i class="ti ti-check" style="font-size:10px"></i>';
      el.appendChild(span);
    } else if (!isSel && chk) {
      chk.remove();
    }
    var atLimit = selectedLangs.length >= limit;
    if (!isSel && atLimit && limit < 99) el.classList.add('disabled');
    else el.classList.remove('disabled');
  });
  var cnt = document.getElementById('selCount');
  if (cnt) cnt.textContent = selectedLangs.length + ' selecionado(s)';
  var btn = document.getElementById('btnLangNext');
  if (btn) btn.disabled = selectedLangs.length === 0;
}

function goStep3() {
  currentStep = 4; renderStep(4);
}

function renderStep4(c) {
  var html = '<div class="setup-icon gold" style="margin:0 auto 20px"><i class="ti ti-calendar-event" style="font-size:30px;color:#854f0b" aria-hidden="true"></i></div>'
    + '<div class="setup-title">Escolha seu horário</div>'
    + '<div class="setup-sub">Selecione o melhor dia e horário para as suas aulas ao vivo.<br>Você poderá ajustar depois com seu professor.</div>'
    + '<div class="schedule-grid">';
  schedules.forEach(function(s){
    html += '<div class="sched-card" id="sc-'+s.id+'" data-id="'+s.id+'" onclick="selectSched(\''+s.id+'\')">'
      + '<div class="sched-day">'+s.day+'</div>'
      + '<div class="sched-time">'+s.time+'</div>'
      + '</div>';
  });
  html += '</div>'
    + '<button class="btn-next" id="btnSchedNext" disabled onclick="goStep4()"><i class="ti ti-arrow-right" aria-hidden="true"></i> Confirmar horário</button>'
    + '<button class="btn-back" onclick="currentStep=3;renderStep(3)"><i class="ti ti-arrow-left" aria-hidden="true"></i> Voltar</button>';
  c.innerHTML = html;
  if (selectedSched) selectSched(selectedSched);
}

function selectSched(id) {
  selectedSched = id;
  document.querySelectorAll('.sched-card').forEach(function(el){
    el.classList.toggle('selected', el.dataset.id === id);
  });
  var btn = document.getElementById('btnSchedNext');
  if (btn) btn.disabled = false;
}

function goStep4() {
  currentStep = 5; renderStep(5);
}

function salvarConfiguracao() {
  var dados = {
    name: userName,
    plan: selectedPlan,
    langs: selectedLangs,
    schedule: selectedSched,
    password: password
  };

  localStorage.setItem('mundoLinguasConfig', JSON.stringify(dados));
}

function finalizarConfiguracao() {
  salvarConfiguracao();
  aplicarTransicao('../dashboard/dashboard.html');
}

function renderStep5(c) {
  var schedObj = schedules.find(function(s){ return s.id === selectedSched; }) || {};
  var langNames = selectedLangs.map(function(id){
    var l = allLangs.find(function(x){ return x.id === id; });
    return l ? l.flag + ' ' + l.name : id;
  }).join(', ');
  c.innerHTML = '<div class="success-wrap">'
    + '<div class="confetti-row">🎉🌍🎓</div>'
    + '<div class="setup-title">Tudo configurado!</div>'
    + '<div class="setup-sub">Seu perfil está pronto. Confira o resumo abaixo<br>e comece a aprender agora mesmo!</div>'
    + '<div class="course-summary">'
    + '<div class="summary-row"><span class="summary-key"><i class="ti ti-diamond" style="font-size:13px;margin-right:4px" aria-hidden="true"></i>Plano</span><span class="summary-val">'+planNames[selectedPlan]+'</span></div>'
    + '<div class="summary-row"><span class="summary-key"><i class="ti ti-language" style="font-size:13px;margin-right:4px" aria-hidden="true"></i>Idiomas</span><span class="summary-val">'+(langNames||'—')+'</span></div>'
    + '<div class="summary-row"><span class="summary-key"><i class="ti ti-calendar" style="font-size:13px;margin-right:4px" aria-hidden="true"></i>Aulas</span><span class="summary-val">'+(schedObj.day ? schedObj.day + ' · ' + schedObj.time : '—')+'</span></div>'
    + '<div class="summary-row"><span class="summary-key"><i class="ti ti-lock" style="font-size:13px;margin-right:4px" aria-hidden="true"></i>Senha</span><span class="summary-val" style="color:#1d9e75"><i class="ti ti-check" style="font-size:13px" aria-hidden="true"></i> Configurada</span></div>'
    + '</div>'
    + '<button class="btn-go" onclick="finalizarConfiguracao()"><i class="ti ti-rocket" aria-hidden="true"></i> Ir para meu painel de cursos!</button>'
    + '</div>';
}

document.addEventListener('DOMContentLoaded', function () {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.35s ease';

  requestAnimationFrame(function () {
    document.body.style.opacity = '1';
  });
});

renderStep(1);