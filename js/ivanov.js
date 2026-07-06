const gameActions = [
    { id:'intro', text:"👋 Знакомство", category:'intro', duration:20, cap:1, maxStart:90,
      dE:+5, dK:+2, dT:+5,
      reply:"Группа представилась, Иванов почувствовал, что он не один такой.",
      method:{ why:'Знакомство — это не "формальность на 5 минут", а инвестиция в безопасность группы на весь день.', do:'Закладывай 20 мин минимум. Задай 2–3 фокусных вопроса по теме дня.' } },

    { id:'micro_lecture', text:"📖 Мини-лекция 20 мин", category:'theory', duration:20,
      dE:-6, dK:+8, dT:+2,
      reply:"Иванов слушает, делает пару заметок.",
      method:{ why:'Короткая подача удерживает внимание.', do:'Сразу после — короткое применение (пара/вопрос).' } },
    { id:'theory_block', text:"📚 Блок теории 40 мин", category:'theory', duration:40,
      dE:-15, dK:+10, dT:+1,
      reply:"Иванов держится, но к концу зевает.",
      method:{ why:'Длинная подача — риск перегрузки.', do:'Бей на 2×20 мин с микропрактикой между.' } },
    { id:'long_instruction', text:"📋 Инструкция 15 страниц", category:'theory', duration:25,
      dE:-12, dK:+3, dT:-2,
      reply:"Иванов уснул.",
      method:{ why:'Большие инструкции не читают.', do:'Чеклист 1 стр. + walkthrough.' } },

    { id:'case', text:"🧩 Кейс 25 мин", category:'practice', duration:25,
      dE:-8, dK:+7, dT:+4,
      prereq:{ knowledge: 8 },
      reply:"Иванов разбирает ситуацию, выписывает варианты решения.",
      method:{ why:'Кейс активирует знание, но без разбора критерии не оседают.', do:'Сразу после кейса дай де-бриф.' } },
    { id:'role_play', text:"🎭 Ролевая игра 25 мин", category:'practice', duration:25,
      dE:-7, dK:+5, dT:+8,
      prereq:{ knowledge: 10 },
      reply:"Иванов включился, попробовал на себе.",
      method:{ why:'Ролевая = опыт + фидбек → высокий перенос.', do:'Закрой де-брифом с критериями.' } },
    { id:'pairwork', text:"🤝 Работа в парах 15 мин", category:'practice', duration:15, cap:3,
      dE:-3, dK:+6, dT:+6,
      reply:"Иванов оживился, обсудил с соседом.",
      method:{ why:'Парная работа — быстрый фидбек, снижает тревогу.', do:'Не злоупотребляй (≤3/день).' } },

    { id:'debrief', text:"🔍 Де-бриф 15 мин", category:'practice', duration:15,
      dE:-3, dK:+3, dT:+5,
      reply:"Иванов проговорил, что сработало и почему.",
      requiresDebriefable:true,
      method:{ why:'Де-бриф закрепляет критерии после практики.', do:'Делай сразу после кейса/ролевой/симуляции.' } },

    { id:'discussion_managed', text:"💬 Фасилитируемая дискуссия 10 мин", category:'discussion', duration:10, cap:2,
      dE:-3, dK:+3, dT:+3,
      reply:"Группа обсудила по фокус-вопросу, Иванов услышал чужой опыт.",
      method:{ why:'Управляемая дискуссия даёт осмысление и перенос.', do:'10 минут — оптимально.' } },
    { id:'discussion_free', text:"🗣 Свободная дискуссия 10 мин", category:'discussion', duration:10, cap:2,
      dE:-5, dK:+1, dT:-2,
      reply:"Группа поговорила обо всём, Иванов потерял нить.",
      method:{ why:'Без фокус-вопроса дискуссия превращается в болтовню.', do:'Добавь фокус-вопрос и временной лимит.' } },

    { id:'test_short', text:"✅ Формативный тест 5 мин", category:'test', duration:5,
      dE:-2, dK:+4, dT:+3,
      reply:"Иванов проверил себя, увидел пробел.",
      method:{ why:'Короткая проверка закрепляет знание.', do:'Ставь перед перерывом, дай мгновенный фидбек.' } },
    { id:'test_long', text:"📊 Итоговый тест 25 мин", category:'test', duration:25,
      dE:-12, dK:+3, dT:+1,
      reply:"Иванов отвечает наугад — устал.",
      method:{ why:'Итоговый тест бьёт по мотивации к концу дня.', do:'Сократи до 15–20 вопросов, ставь не последним блоком.' } },

    { id:'coffee', text:"☕ Кофе-брейк 15 мин", category:'break', duration:15, cap:2, minGap:90,
      dE:+15, dK:0, dT:0,
      reply:"Иванов ожил, размялся, поболтал.",
      method:{ why:'Пауза восстанавливает внимание.', do:'Макс 2 за день, ≥ 90 мин между ними.' } },
    { id:'lunch', text:"🍽 Обед 60 мин (12:30–14:00)", category:'meal', duration:60, cap:1, windowStart:210, windowEnd:300,
      dE:+25, dK:0, dT:+2,
      reply:"Иванов поел и выдохнул.",
      method:{ why:'Обед в правильное окно поддерживает работоспособность.', do:'Окно 12:30–14:00.' } },
    { id:'energizer', text:"⚡ Разминка", category:'energizer', duration:10, cap:1, minStart:270,
      dE:+10, dK:0, dT:+2,
      reply:"Группа размялась, сонливость ушла.",
      method:{ why:'После обеда падает внимание.', do:'Проводи в первые 30 мин после обеда.' } },

    { id:'reflection', text:"📝 Рефлексия дня 10 мин", category:'reflect', duration:10, cap:1, minStart:420,
      dE:-2, dK:+3, dT:+12,
      prereq:{ knowledge: 20 },
      reply:"Иванов записал, что унесёт и что сделает завтра.",
      method:{ why:'Рефлексия → план действий → высокий перенос.', do:'Используй в конце дня.' } }
];

const DAY_BUDGET = 540;
const DAY_START_MIN = 9 * 60;
const WIN = { energy: 30, knowledge: 70, transfer: 60 };

let state = null;
function initState() {
    state = {
        energy: 80, knowledge: 0, transfer: 0,
        elapsed: 0, timeline: [], counts: {},
        lastBreakAt: -999,
        pendingDebrief: null,
        practiceWithoutDebrief: 0,
        active: true
    };
}
initState();

function fmtClock(mins) {
    const total = DAY_START_MIN + mins;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
}

function setMessage(msg) {
    document.getElementById('messageBox').innerHTML = "💬 " + msg;
}

function setMethodBox(html) {
    const box = document.getElementById('methodBox');
    if (!html) { box.style.display='none'; box.innerHTML=''; return; }
    box.style.display = 'block';
    box.innerHTML = html;
}

function updateMood() {
    const e = state.energy;
    const mood = document.getElementById('moodIcon');
    if (e >= 80) mood.textContent = '😄';
    else if (e >= 60) mood.textContent = '🙂';
    else if (e >= 40) mood.textContent = '😕';
    else if (e >= 20) mood.textContent = '😫';
    else mood.textContent = '😵‍💫';
}

function updateResourcesUI() {
    const set = (key, valueEl, fillEl) => {
        const v = Math.max(0, Math.min(100, state[key]));
        document.getElementById(valueEl).textContent = Math.round(v);
        document.getElementById(fillEl).style.width = v + '%';
    };
    set('energy', 'energyValue', 'energyFill');
    set('knowledge', 'knowledgeValue', 'knowledgeFill');
    set('transfer', 'transferValue', 'transferFill');
    document.getElementById('dayClock').textContent = fmtClock(state.elapsed);
    document.getElementById('dayRemain').textContent = Math.max(0, DAY_BUDGET - state.elapsed);
    renderLimits();
    renderTimeline();
    updateMood();
    renderActions();
}

function renderLimits() {
    const coffees = state.counts['coffee'] || 0;
    const chips = [
        { label: `👋 Знакомство ${state.counts['intro']?1:0}/1`, cls: state.counts['intro'] ? 'cap' : '' },
        { label: `☕ Кофе ${coffees}/2`, cls: coffees >= 2 ? 'cap' : (coffees > 0 ? 'used' : '') },
        { label: `🍽 Обед ${(state.counts['lunch']||0)}/1`,  cls: (state.counts['lunch']||0) >= 1 ? 'cap' : '' },
        { label: `⚡ Разминка ${(state.counts['energizer']||0)}/1`, cls: (state.counts['energizer']||0) >= 1 ? 'cap' : '' },
        { label: `📝 Рефлексия ${(state.counts['reflection']||0)}/1`, cls: (state.counts['reflection']||0) >= 1 ? 'cap' : '' }
    ];
    document.getElementById('dayLimits').innerHTML =
        chips.map(c => `<span class="chip ${c.cls}">${c.label}</span>`).join('');
}

function renderTimeline() {
    const track = document.getElementById('timelineTrack');
    const segs = state.timeline.map(s => {
        const left = (s.start / DAY_BUDGET) * 100;
        const width = (s.duration / DAY_BUDGET) * 100;
        const label = s.duration >= 25 ? s.short : '';
        return `<div class="seg ${s.category}" style="left:${left}%;width:${width}%" title="${s.title}">${label}</div>`;
    }).join('');
    track.innerHTML = segs;
}

function shortLabel(category) {
    return ({ intro:'Знаком.', theory:'Теория', practice:'Практ.', debrief:'Де-бриф',
        discussion:'Дискус.', test:'Тест', break:'Кофе', meal:'Обед',
        energizer:'Раз.', reflect:'Рефл.' })[category] || '';
}

function effectiveDeltas(a) {
    const used = state.counts[a.id] || 0;
    const factor = Math.pow(0.7, used);
    const noDiminish = ['coffee','lunch','energizer','intro','reflection','debrief'];
    const f = noDiminish.includes(a.id) ? 1 : factor;
    return {
        dE: Math.round(a.dE * (a.dE > 0 ? 1 : f)),
        dK: Math.round(a.dK * f),
        dT: Math.round(a.dT * f),
        factor: f
    };
}

function canDo(a) {
    if (!state.active) return { ok:false, reason:'День завершён' };
    if (state.elapsed + a.duration > DAY_BUDGET) return { ok:false, reason:'Не хватит времени до 18:00' };
    if (a.cap && (state.counts[a.id] || 0) >= a.cap) return { ok:false, reason:`Лимит ${a.cap}/день` };
    if (a.id === 'coffee') {
        if (state.elapsed - state.lastBreakAt < 90 && state.lastBreakAt > -999) {
            return { ok:false, reason:'Слишком близко к прошлому кофе (нужно ≥ 90 мин)' };
        }
    }
    if (a.windowStart != null && state.elapsed < a.windowStart) return { ok:false, reason:`Окно с ${fmtClock(a.windowStart)}` };
    if (a.windowEnd != null && state.elapsed > a.windowEnd) return { ok:false, reason:`Окно закрыто после ${fmtClock(a.windowEnd)}` };
    if (a.minStart != null && state.elapsed < a.minStart) return { ok:false, reason:`Не раньше ${fmtClock(a.minStart)}` };
    if (a.maxStart != null && state.elapsed > a.maxStart) return { ok:false, reason:`Уже поздно (до ${fmtClock(a.maxStart)})` };
    if (a.prereq && a.prereq.knowledge != null && state.knowledge < a.prereq.knowledge) {
        return { ok:false, reason:`Нужно ≥ ${a.prereq.knowledge} знаний (сейчас ${Math.round(state.knowledge)})` };
    }
    if (a.requiresDebriefable && !state.pendingDebrief) {
        return { ok:false, reason:'Де-бриф нужен сразу после практики (кейс/ролевая/пары)' };
    }
    return { ok:true };
}

function applyAction(actionId) {
    const a = gameActions.find(x => x.id === actionId);
    if (!a) return;
    const check = canDo(a);
    if (!check.ok) { setMessage('⛔ ' + check.reason); return; }

    const eff = effectiveDeltas(a);

    let debriefBonus = 0;
    if (a.id === 'debrief' && state.pendingDebrief) debriefBonus = 3;

    let undebriefedPenalty = 0;
    const isPractice = (a.category === 'practice' && a.id !== 'debrief');
    if (isPractice && state.pendingDebrief && state.pendingDebrief.elapsedAt != null) {
        if (state.elapsed - state.pendingDebrief.elapsedAt > 30) {
            undebriefedPenalty = -3;
            state.practiceWithoutDebrief += 1;
            state.pendingDebrief = null;
        }
    }

    state.elapsed += a.duration;
    state.energy = Math.max(0, Math.min(100, state.energy + eff.dE));
    state.knowledge = Math.max(0, Math.min(100, state.knowledge + eff.dK));
    state.transfer = Math.max(0, Math.min(100, state.transfer + eff.dT + debriefBonus + undebriefedPenalty));
    state.counts[a.id] = (state.counts[a.id] || 0) + 1;

    if (a.id === 'coffee') state.lastBreakAt = state.elapsed;
    if (isPractice) state.pendingDebrief = { id: a.id, elapsedAt: state.elapsed };
    else if (a.id === 'debrief') state.pendingDebrief = null;

    state.timeline.push({
        id: a.id, category: a.category,
        start: state.elapsed - a.duration, duration: a.duration,
        short: shortLabel(a.category),
        title: `${a.text} · ${fmtClock(state.elapsed - a.duration)}–${fmtClock(state.elapsed)}`
    });

    let msg = `[${fmtClock(state.elapsed - a.duration)}–${fmtClock(state.elapsed)}] ` + a.reply;
    if (eff.factor < 1) msg += ` <em style="color:#94a3b8">(повтор: эффект × ${eff.factor.toFixed(2)})</em>`;
    if (debriefBonus) msg += ` <em style="color:#15803d">+3 переноса (закрыли практику де-брифом)</em>`;
    if (undebriefedPenalty) msg += ` <em style="color:#b34e4e">−3 переноса (предыдущая практика без де-брифа)</em>`;
    setMessage(msg);

    let extra = '';
    if (eff.factor < 1) extra += `<div style="margin-top:6px"><strong>Повтор формата:</strong> отдача снижается.</div>`;
    if (isPractice) extra += `<div style="margin-top:6px"><strong>Совет:</strong> в течение 30 мин закрой практику де-брифом.</div>`;
    if (state.elapsed >= 300 && !(state.counts['lunch'])) extra += `<div style="margin-top:6px"><strong>⚠️ Обед пропущен:</strong> окно 12:30–14:00 закрылось.</div>`;
    if (a.id === 'lunch' && !state.counts['energizer']) extra += `<div style="margin-top:6px"><strong>Подсказка:</strong> после обеда поставь разминку.</div>`;

    setMethodBox(getMethodicalFeedback(a) + extra);

    if (state.energy <= 0) return endDay('burnout');
    if (state.elapsed >= DAY_BUDGET) return endDay('time');
    updateResourcesUI();
}

function getMethodicalFeedback(action) {
    const f = action.method;
    if (!f) return '';
    return `<div><strong>Почему:</strong> ${f.why}</div><div style="margin-top:6px"><strong>Что сделать:</strong> ${f.do}</div>`;
}

function finishDayManually() {
    if (!state.active) return;
    endDay('manual');
}

function endDay(reason) {
    state.active = false;
    updateResourcesUI();

    const e = Math.round(state.energy);
    const k = Math.round(state.knowledge);
    const t = Math.round(state.transfer);
    const hasLunch = (state.counts['lunch'] || 0) >= 1;

    const cell = (label, val, target) => {
        const cls = val >= target ? 'ok' : (val >= target * 0.7 ? 'warn' : 'bad');
        return `<div class="verdict-cell ${cls}">${label}<span class="num">${val}</span><span style="font-size:11px;color:var(--text-soft)">цель ≥ ${target}</span></div>`;
    };

    let title, quote;
    if (reason === 'burnout') {
        title = '😵‍💫 Иванов сгорел до конца дня';
        quote = '«Я больше так не выдержу. На завтра возьму отгул.»';
    } else if (!hasLunch) {
        title = '🍽 День без обеда — Иванов измотан';
        quote = '«Голодный, злой, ничего толком не помню.»';
    } else if (k < 40) {
        title = '🫥 День прошёл — Иванов уходит пустой';
        quote = '«Посидел, поел, поговорили. А что я унесу в работу — не понял.»';
    } else if (e >= WIN.energy && k >= WIN.knowledge && t >= WIN.transfer) {
        title = '🎉 Победа: Иванов живой, научился, готов применить';
        quote = '«Усталость хорошая. Завтра попробую разбор кейса.»';
    } else {
        title = '🟡 День прошёл, но цель не достигнута';
        quote = '«Что-то было полезно, что-то — нет. Осадок неровный.»';
    }

    const tips = [];
    if (!state.counts['intro']) tips.push('Не было знакомства: группа не прогрелась.');
    if (e < WIN.energy) tips.push('Энергия низкая: ставь больше микро-форматов.');
    if (k < WIN.knowledge) tips.push('Знаний мало: добавь практику с де-брифом.');
    if (t < WIN.transfer) tips.push('Перенос низкий: ролевая + де-бриф + рефлексия.');
    if (state.practiceWithoutDebrief) tips.push(`Практика без де-брифа (×${state.practiceWithoutDebrief}).`);
    if (!hasLunch) tips.push('Обед обязателен в окне 12:30–14:00.');
    if ((state.counts['coffee']||0) === 0) tips.push('Хотя бы 1 кофе-брейк нужен.');
    if (hasLunch && !(state.counts['energizer'])) tips.push('После обеда — разминка.');

    document.getElementById('adviceBox').innerHTML = `
        <div class="dashboard">
            <h3>${title}</h3>
            <div class="verdict-row">
                ${cell('⚡ Энергия', e, WIN.energy)}
                ${cell('🧠 Знания', k, WIN.knowledge)}
                ${cell('🎯 Перенос', t, WIN.transfer)}
            </div>
            <div class="quote">${quote}</div>
            ${tips.length ? `<div style="margin-top:var(--s-3)"><strong>Что поправить:</strong><ul style="margin:6px 0 0 16px">${tips.map(x=>`<li>${x}</li>`).join('')}</ul></div>` : ''}
        </div>`;
}

function resetGame() {
    initState();
    setMessage("🔄 Новый день начался. 09:00, Иванов вошёл в аудиторию.");
    setMethodBox('');
    document.getElementById('adviceBox').innerHTML = '';
    updateResourcesUI();
}

function renderActions() {
    const grid = document.getElementById('actionsGrid');
    const groups = [
        { title:'Открытие',     cats:['intro'] },
        { title:'Теория',       cats:['theory'] },
        { title:'Практика',     cats:['practice'] },
        { title:'Дискуссия',    cats:['discussion'] },
        { title:'Проверка',     cats:['test'] },
        { title:'Паузы',        cats:['break','meal','energizer'] },
        { title:'Закрытие дня', cats:['reflect'] }
    ];
    const hasLunch = (state.counts['lunch'] || 0) >= 1;
    const lateEnough = state.elapsed >= 480;
    const canFinish = state.active && lateEnough && hasLunch;
    const finishReason = !state.active ? 'День уже завершён'
                      : !lateEnough ? 'Активно с 17:00'
                      : !hasLunch ? 'Не было обеда'
                      : '';

    const html = groups.map(g => {
        const list = gameActions.filter(a => g.cats.includes(a.category));
        if (!list.length) return '';
        const btns = list.map(a => {
            const check = canDo(a);
            const cls = (a.dT < 0) ? 'bad'
                      : (a.category === 'theory' || a.id === 'test_long') ? 'bad'
                      : (a.dK >= 6 && a.dT >= 5) ? 'good' : '';
            const title = check.ok ? '' : `title="${check.reason}"`;
            return `<button class="action-btn ${cls}" ${check.ok?'':'disabled'} ${title} onclick="applyAction('${a.id}')">${a.text}</button>`;
        }).join('');

        let extraBtn = '';
        if (g.title === 'Закрытие дня') {
            extraBtn = `<button class="action-btn good" ${canFinish ? '' : 'disabled'} title="${finishReason}" onclick="finishDayManually()">🏁 Завершить день</button>`;
        }
        return `<div class="group-title">${g.title}</div><div class="group-row">${btns}${extraBtn}</div>`;
    }).join('');

    grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    updateResourcesUI();
    document.getElementById('resetBtn').onclick = resetGame;
});