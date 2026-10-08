/* ============ shared dashboard logic ============ */

// ---- mobile sidebar ----
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');
function toggleSide(force) {
  const open = force !== undefined ? force : !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', open);
  scrim.classList.toggle('show', open);
}
if (scrim) scrim.addEventListener('click', () => toggleSide(false));
addEventListener('keydown', e => { if (e.key === 'Escape') toggleSide(false); });

// ---- toast ----
let toastTimer;
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast'; t.setAttribute('role','status');
    document.body.appendChild(t);
  }
  t.innerHTML = '<span class="tk">✓</span> ' + msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ---- greeting ----
function greeting() {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('greeting');
  if (el) el.textContent = g + ' 👋';
}

// ---- copy helper ----
function copyText(text, label) {
  const done = () => toast((label || 'Copied') + ' to clipboard');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else fallbackCopy(text, done);
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch(e) {}
  document.body.removeChild(ta);
}

// ============ mock campaign generator ============
const CAMPAIGNS = {
  headphones: {
    name: 'Sound Without Limits',
    audience: 'Young professionals, commuters, and remote workers.',
    strategy: 'Position the headphones around focused work, commuting, and premium everyday audio.',
    message: 'Premium audio designed for focused work and everyday movement.',
    content: 'Meet your everyday audio companion. Designed for deep focus, busy commutes, and everything between.',
    creative: 'Minimal urban lifestyle photography, premium product lighting, modern city environment.',
    cta: 'Experience the difference.'
  },
  speaker: {
    name: 'Take the Party Anywhere',
    audience: 'Outdoor enthusiasts, hosts, and music lovers aged 20–35.',
    strategy: 'Own the outdoor-gathering moment: portability, battery, and bass that carries.',
    message: 'Big sound that goes wherever you go.',
    content: 'From rooftop sunsets to beach mornings — one speaker, endless soundtrack.',
    creative: 'Golden-hour outdoor scenes, friends gathered, product hero in natural light.',
    cta: 'Bring the sound.'
  },
  backpack: {
    name: 'Carry Everything Forward',
    audience: 'Commuters, students, and frequent travelers.',
    strategy: 'Sell organization and durability: every pocket has a purpose.',
    message: 'The last backpack you will need to buy.',
    content: 'Laptop, gym kit, lunch, chargers — one bag, zero compromise.',
    creative: 'Clean studio shots plus real commute photography, motion and energy.',
    cta: 'Pack smarter.'
  },
  generic: {
    name: 'Made to Be Noticed',
    audience: 'Early adopters and quality-conscious shoppers.',
    strategy: 'Lead with the core benefit, prove it with specifics, close with social proof.',
    message: 'The smarter choice, clearly explained.',
    content: 'Discover what makes this product different — designed around how you actually live.',
    creative: 'Bright, confident product photography with lifestyle context.',
    cta: 'See why it matters.'
  }
};
function pickCampaign(prompt) {
  const t = (prompt || '').toLowerCase();
  if (/headphone|earbud|audio|sound/.test(t)) return CAMPAIGNS.headphones;
  if (/speaker/.test(t)) return CAMPAIGNS.speaker;
  if (/backpack|bag/.test(t)) return CAMPAIGNS.backpack;
  return CAMPAIGNS.generic;
}

// ---- dashboard demo ----
function initDashboardDemo() {
  const input = document.getElementById('ai-input');
  const btn = document.getElementById('create-btn');
  const procBox = document.getElementById('proc-box');
  const result = document.getElementById('result');
  if (!input || !btn) return;
  const steps = ['Understanding product...','Analyzing audience...','Building campaign strategy...','Generating content...'];

  btn.addEventListener('click', () => {
    const prompt = input.value.trim();
    if (!prompt) { toast('Describe what you want to build first'); input.focus(); return; }
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Creating...';
    result.classList.remove('show');
    procBox.classList.add('show');
    procBox.innerHTML = steps.map(s =>
      '<div class="proc-step"><span class="spinner"></span>' + s + '</div>').join('');
    const els = [...procBox.querySelectorAll('.proc-step')];
    let i = 0;
    const next = () => {
      if (i > 0) els[i-1].classList.add('done');
      if (i < els.length) { els[i].classList.add('on'); i++; setTimeout(next, 1000); }
      else {
        els[els.length-1].classList.add('done');
        setTimeout(() => {
          renderCampaign(pickCampaign(prompt));
          procBox.classList.remove('show');
          result.classList.add('show');
          result.scrollIntoView({behavior:'smooth', block:'nearest'});
          btn.disabled = false; btn.textContent = 'Create with AI';
          toast('Campaign generated');
        }, 500);
      }
    };
    next();
  });

  document.getElementById('btn-regen').addEventListener('click', () => {
    toast('Regenerating with a fresh angle...');
    setTimeout(() => { renderCampaign(pickCampaign(input.value + ' v2')); toast('New variant ready'); }, 1200);
  });
  document.getElementById('btn-copy').addEventListener('click', () => {
    copyText(document.getElementById('result-text').innerText, 'Campaign');
  });
  document.getElementById('btn-export').addEventListener('click', () => {
    const blob = new Blob([document.getElementById('result-text').innerText], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'campaign.txt'; a.click();
    URL.revokeObjectURL(a.href);
    toast('Exported as campaign.txt');
  });
  document.getElementById('btn-edit').addEventListener('click', () => {
    toast('Edit mode — refine the brief and regenerate');
    input.focus();
  });
}

function renderCampaign(c) {
  document.getElementById('result-text').innerHTML =
    '<div class="res-grid">' +
    '<div class="res-field"><p class="dlabel">CAMPAIGN</p><p class="big">' + c.name + '</p></div>' +
    '<div class="res-field"><p class="dlabel">TARGET AUDIENCE</p><p>' + c.audience + '</p></div>' +
    '<div class="res-field full"><p class="dlabel">CAMPAIGN STRATEGY</p><p>' + c.strategy + '</p></div>' +
    '<div class="res-field"><p class="dlabel">KEY MESSAGE</p><p>' + c.message + '</p></div>' +
    '<div class="res-field"><p class="dlabel">CTA</p><p>' + c.cta + '</p></div>' +
    '<div class="res-field full"><p class="dlabel">CONTENT</p><p>"' + c.content + '"</p></div>' +
    '<div class="res-field full"><p class="dlabel">CREATIVE DIRECTION</p><p>"' + c.creative + '"</p></div>' +
    '</div>';
}

// ============ content studio ============
function initContentStudio() {
  const typeBtns = document.querySelectorAll('.type-btn');
  const input = document.getElementById('cs-input');
  const btn = document.getElementById('cs-generate');
  const out = document.getElementById('cs-output');
  if (!btn) return;
  let type = 'Product Description';
  typeBtns.forEach(b => b.addEventListener('click', () => {
    typeBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active'); type = b.dataset.type;
  }));
  btn.addEventListener('click', () => {
    const topic = input.value.trim();
    if (!topic) { toast('Describe what you want to create'); return; }
    btn.disabled = true; btn.textContent = 'Generating...';
    out.innerHTML = '<div class="output-empty"><span class="spinner" style="display:inline-block;vertical-align:middle"></span> Generating ' + type.toLowerCase() + '...</div>';
    setTimeout(() => {
      out.innerHTML =
        '<div class="output-head"><span class="dlabel" style="margin:0">' + type.toUpperCase() + '</span>' +
        '<button class="chip-btn" id="cs-copy">Copy</button></div>' +
        '<div class="output-body" id="cs-body">' + mockContent(type, topic) + '</div>';
      document.getElementById('cs-copy').addEventListener('click', () =>
        copyText(document.getElementById('cs-body').innerText, type));
      btn.disabled = false; btn.textContent = 'Generate';
      toast(type + ' generated');
    }, 1400);
  });
}
function mockContent(type, topic) {
  const T = topic.length > 60 ? topic.slice(0, 60) + '…' : topic;
  const map = {
    'Product Description': '<h4>' + T + '</h4>Designed for how you actually live. Every detail — from materials to finish — was chosen for durability, comfort, and everyday performance. This is the upgrade you will notice from day one.',
    'Instagram Post': '✨ ' + T + '\n\nYour everyday, elevated. Tap the link in bio to shop the drop. #NewArrival #MustHave',
    'X Post': T + ' — built for the way you live. Out now. 🔗',
    'Ad Copy': '<h4>Headline</h4>Meet ' + T + '.\n<h4>Body</h4>Stop settling. Premium quality, honest price, delivered to your door.',
    'Email': '<h4>Subject: Introducing ' + T + '</h4>Hi there,\n\nWe built something we think you will love. ' + T + ' is here — designed around your everyday needs. Shop now and see the difference.',
    'FAQ': '<h4>What is ' + T + '?</h4>A product designed for everyday use, built to last.\n<h4>How do I get started?</h4>Order online — setup takes minutes.\n<h4>What if I need help?</h4>Our support team replies within one business day.',
    'Creative Brief': '<h4>Objective</h4>Launch ' + T + ' with a clear, memorable visual identity.\n<h4>Audience</h4>Quality-conscious shoppers, 22–40.\n<h4>Direction</h4>Clean, confident photography; lifestyle context; premium lighting.'
  };
  return map[type] || map['Product Description'];
}

// ============ assistant chat ============
function initAssistant() {
  const body = document.getElementById('chat-body');
  const input = document.getElementById('chat-input-field');
  const btn = document.getElementById('chat-send');
  if (!body || !btn) return;
  const push = (text, who) => {
    const d = document.createElement('div');
    d.className = 'msg ' + who; d.textContent = text;
    body.appendChild(d); body.scrollTop = body.scrollHeight;
  };
  const reply = q => {
    const t = q.toLowerCase();
    if (/position|angle/.test(t)) return 'Based on the product positioning, I recommend focusing on three angles: focused work, everyday mobility, and premium audio experience. Lead with the commute use-case — it is the most emotionally resonant.';
    if (/audience|customer|target/.test(t)) return 'Your core audience is young professionals (22–35) who commute and work remotely. Secondary: students and frequent travelers who value battery life.';
    if (/price|pricing/.test(t)) return 'Position on value, not cheapness: "flagship sound, half the price." Avoid discount-first messaging — it erodes the premium perception you are building.';
    if (/campaign/.test(t)) return 'A strong launch runs in three phases: tease with UGC seeding, launch with a hero video, then retarget with reviews. I can draft the full plan in Campaigns.';
    return 'Good question. From your workspace data, I would frame this around your core strengths: premium experience at an accessible price, aimed at young professionals. Want me to draft content around it?';
  };
  const send = () => {
    const v = input.value.trim();
    if (!v) return;
    push(v, 'user'); input.value = '';
    const tp = document.createElement('div');
    tp.className = 'typing'; tp.textContent = 'Thinking...';
    body.appendChild(tp); body.scrollTop = body.scrollHeight;
    setTimeout(() => { tp.remove(); push(reply(v), 'bot'); }, 1100);
  };
  btn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
}

// ============ products modal ============
function initProducts() {
  const back = document.getElementById('modal-back');
  if (!back) return;
  document.querySelectorAll('[data-analyze]').forEach(b => b.addEventListener('click', () => {
    const p = JSON.parse(b.dataset.analyze);
    document.getElementById('modal-title').textContent = 'AI Analysis — ' + p.name;
    document.getElementById('modal-body').innerHTML =
      '<div class="analysis-sec"><p class="dlabel">POSITIONING</p><p>' + p.positioning + '</p></div>' +
      '<div class="analysis-sec"><p class="dlabel">STRONGEST ANGLE</p><p>' + p.angle + '</p></div>' +
      '<div class="analysis-sec"><p class="dlabel">WATCH OUT</p><p>' + p.risk + '</p></div>';
    back.classList.add('show');
  }));
  back.addEventListener('click', e => { if (e.target === back) back.classList.remove('show'); });
  document.getElementById('modal-close').addEventListener('click', () => back.classList.remove('show'));
  const add = document.getElementById('add-product');
  if (add) add.addEventListener('click', () => toast('Demo: product creation opens in the full version'));
}

// ============ workflows ============
function initWorkflows() {
  document.querySelectorAll('[data-run]').forEach(b => b.addEventListener('click', () => {
    const card = b.closest('.wf-card');
    const nodes = [...card.querySelectorAll('.wf-node')];
    b.disabled = true; b.textContent = 'Running...';
    nodes.forEach(n => n.classList.remove('lit'));
    let i = 0;
    const tick = () => {
      if (i < nodes.length) { nodes[i++].classList.add('lit'); setTimeout(tick, 700); }
      else { b.disabled = false; b.textContent = 'Run'; toast('Workflow "' + b.dataset.run + '" completed'); }
    };
    tick();
  }));
}

// ============ contact form ============
function initContact() {
  const f = document.getElementById('contact-form');
  if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    toast('Thanks! Demo form — connect a backend to receive messages.');
    f.reset();
  });
}

// ---- boot ----
document.addEventListener('DOMContentLoaded', () => {
  greeting();
  initDashboardDemo();
  initContentStudio();
  initAssistant();
  initProducts();
  initWorkflows();
  initContact();
});
