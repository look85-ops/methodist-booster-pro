const VISION_MIN_CHARS = 20;
const visionLabels = ['Боль', 'Пользователь и заказчик', 'Job-to-be-done', 'Альтернативы / конкуренты', 'Решение и сценарии', 'MVP (и что НЕ входит)', 'Критерий успеха'];

function nextStep(current) {
    const val = document.getElementById('vision' + current).value.trim();
    if (val.length < VISION_MIN_CHARS) {
        alert(`Слишком коротко. Минимум ${VISION_MIN_CHARS} символов. Сейчас: ${val.length}.`);
        return;
    }
    document.getElementById('step' + current).style.display = 'none';
    document.getElementById('step' + (current + 1)).style.display = 'block';
}

function auditVision(answers) {
    const issues = [];
    const wins = [];

    const pain = answers[0].toLowerCase();
    if (pain.length < 60) issues.push('Боль описана коротко. Конкретная ситуация — это люди, контекст, последствия.');
    if (!/(\d|часа?|недел|месяц|раз|процент|%|штук)/i.test(answers[0])) {
        issues.push('В описании боли нет цифр или конкретики.');
    } else {
        wins.push('Боль описана с конкретикой.');
    }

    const user = answers[1].toLowerCase();
    if (!/(заказчик|плати|руководител|клиент|спонсор)/.test(user)) {
        issues.push('Не назван заказчик/тот, кто платит.');
    } else {
        wins.push('Различены пользователь и заказчик.');
    }

    const job = answers[2].toLowerCase();
    const hasJobFormat = /когда/.test(job) && /(хочу|нужно)/.test(job) && /чтобы/.test(job);
    if (!hasJobFormat) {
        issues.push('JTBD не в каноническом формате.');
    } else {
        wins.push('JTBD сформулирован в каноническом формате.');
    }

    const alt = answers[3].toLowerCase();
    if (alt.length < 40 || (/(нет|никак|никто)/.test(alt) && alt.length < 80)) {
        issues.push('Альтернатив мало или никак нет.');
    } else {
        wins.push('Альтернативы описаны.');
    }

    const scenarios = answers[4].toLowerCase();
    const hasMultiple = /(1\.|сценарий 1|первый|сначала|потом|во-первых)/.test(scenarios) || (scenarios.match(/\./g) || []).length >= 3;
    if (!hasMultiple) {
        issues.push('Сценарии описаны общо. Нужно 2–3 разных.');
    } else {
        wins.push('Сценарии описаны достаточно.');
    }

    const mvp = answers[5].toLowerCase();
    const hasNotIn = /(не вход|не дела|исключ|вне scope|откладыв)/.test(mvp);
    if (!hasNotIn) {
        issues.push('MVP без списка «что НЕ входит» — типичная ловушка.');
    } else {
        wins.push('MVP с границей.');
    }

    const success = answers[6];
    const hasMetric = /(\d|%|процент|раз|штук)/i.test(success);
    const hasTimeframe = /(к |через |за |в течение)/i.test(success.toLowerCase());
    if (!hasMetric) issues.push('В критерии нет числа.');
    if (!hasTimeframe) issues.push('В критерии нет срока.');
    if (hasMetric && hasTimeframe) wins.push('Критерий измерим и со сроком.');

    return { issues, wins };
}

function visionFallbackSuggestions(answers) {
    const all = answers.join(' ').toLowerCase();
    const suggestions = [];

    if (/совещ|митин|встреч|приоритет|перегруж|выгоран/.test(all)) {
        suggestions.push({ title: 'Тренинг по делегированию', detail: 'Матрица Эйзенхауэра, принципы делегирования.' });
        suggestions.push({ title: 'Аудит календаря встреч', detail: 'Воркшоп 1–2 дня.' });
        suggestions.push({ title: 'AI-планировщик', detail: 'Инструмент защиты фокус-блоков.' });
    }
    if (/онбординг|адаптац|нов(ые|ого) сотрудник/.test(all)) {
        suggestions.push({ title: 'Структурированная адаптация', detail: 'Чек-лист + наставник.' });
        suggestions.push({ title: 'База знаний с поиском', detail: 'Внутренняя wiki.' });
    }
    if (/мотивац|не хотят|выгоран|признан/.test(all)) {
        suggestions.push({ title: 'Сессия с руководителями', detail: 'Договорённости по признанию.' });
        suggestions.push({ title: 'Пересборка системы признания', detail: 'С HR.' });
    }
    if (/ошибк|качеств|медленн|не умеют|навык/.test(all)) {
        suggestions.push({ title: 'Практикум с де-брифом', detail: 'Реальные кейсы.' });
        suggestions.push({ title: 'Чек-лист + наставник', detail: 'На рабочее место.' });
    }
    if (!suggestions.length) {
        suggestions.push({ title: 'Точечный учебный продукт', detail: 'Практикум с де-брифом.' });
        suggestions.push({ title: 'Инструмент / сервис', detail: 'Цифровой инструмент.' });
        suggestions.push({ title: 'Изменение процесса', detail: 'Воркшоп с владельцем.' });
        suggestions.push({ title: 'Стратегическая сессия', detail: 'С топ-менеджментом.' });
    }
    return suggestions.slice(0, 4);
}

async function generateVisionSuggestions(answers) {
    const system = `Ты — старший продакт-методист. На основе видения продукта предложи 3–5 конкретных направлений решения проблемы. Это могут быть РАЗНЫЕ типы решений: обучающий продукт, цифровой инструмент, изменение процесса, организационная мера, гибрид.

ТРЕБОВАНИЯ:
— Не выдумывай новую проблему.
— Не предлагай одни тренинги.
— Каждое направление с конкретикой.

ФОРМАТ (строго):
Направление: <название>
Что это: <1–2 предложения>
Почему сработает: <привязка к боли>`;
    const user = `Боль: ${answers[0]}\nПользователь: ${answers[1]}\nJTBD: ${answers[2]}\nАльтернативы: ${answers[3]}\nРешение: ${answers[4]}\nMVP: ${answers[5]}\nКритерий: ${answers[6]}`;
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'system', content: system }, { role: 'user', content: user }] })
        });
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (!text) throw new Error('No AI');
        return { source: 'ai', text };
    } catch (e) {
        return { source: 'fallback', items: visionFallbackSuggestions(answers) };
    }
}

function renderSuggestions(result) {
    if (result.source === 'ai') {
        const html = result.text.replace(/(Направление|Что это|Почему сработает)\s*:/gi, '<strong>$1:</strong>').replace(/\n/g, '<br>');
        return `<div>${html}</div><div class="activity-source">🤖 Сгенерировано AI</div>`;
    }
    const items = result.items.map(s => `<li style="margin-bottom:0.5rem"><strong>${s.title}.</strong> ${s.detail}</li>`).join('');
    return `<ul style="margin:0 0 0 16px">${items}</ul><div class="activity-source">📋 Из базы</div>`;
}

async function finishVision() {
    const val = document.getElementById('vision7').value.trim();
    if (val.length < VISION_MIN_CHARS) { alert(`Слишком коротко.`); return; }

    const answers = [];
    for (let i = 1; i <= 7; i++) answers.push(document.getElementById('vision' + i).value.trim());

    const { issues, wins } = auditVision(answers);
    const items = answers.map((a, i) => `<li><strong>${visionLabels[i]}:</strong> ${a}</li>`).join('');
    const winsBlock = wins.length ? `<div class="verdict-section"><strong style="color:var(--success)">✓ Что хорошо:</strong><ul style="margin:4px 0 0 16px">${wins.map(w=>`<li>${w}</li>`).join('')}</ul></div>` : '';
    const issuesBlock = issues.length
        ? `<div class="verdict-section"><strong style="color:var(--warning)">⚠ Что доработать:</strong><ul style="margin:4px 0 0 16px">${issues.map(w=>`<li>${w}</li>`).join('')}</ul></div>`
        : '<div class="verdict-section" style="color:var(--success)"><strong>Видение крепкое.</strong></div>';

    const resultDiv = document.getElementById('visionResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="verdict-header" style="background: var(--tool-color-soft); color: var(--tool-color-deep)"><strong>🎯 Видение продукта</strong></div>
        <ul class="vision-summary">${items}</ul>
        ${winsBlock}
        ${issuesBlock}
        <div class="verdict-section"><strong>💡 Возможные направления:</strong><div id="visionSuggestions" style="margin-top:0.4rem"><em style="color:var(--text-soft)">⏳ Подбираю...</em></div></div>
        <div style="display:flex;gap:8px;margin-top:var(--s-3);flex-wrap:wrap">
            <button class="wizard-btn" onclick="copyVision()">📋 Скопировать</button>
            <button class="wizard-btn" style="background: var(--text-soft)" onclick="resetVision()">🔄 Заново</button>
        </div>
        <div class="tool-links" style="margin-top: var(--s-4); padding-top: var(--s-3); border-top: 1px solid var(--border); font-size: var(--fs-small)">
            <strong style="color: var(--text-muted)">Другие инструменты:</strong>
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: var(--s-2)">
                <a class="action-btn" href="ivanov.html">🎭 Иванов</a>
                <a class="action-btn" href="activities.html">⚡ Активности</a>
                <a class="action-btn" href="cards.html">🎴 Карты</a>
                <a class="action-btn" href="audit.html">🔍 Аудит</a>
                <a class="action-btn" href="index.html">🏠 На главную</a>
            </div>
        </div>`;
    document.getElementById('step7').style.display = 'none';

    const result = await generateVisionSuggestions(answers);
    const box = document.getElementById('visionSuggestions');
    if (box) box.innerHTML = renderSuggestions(result);
}

function resetVision() {
    for (let i = 1; i <= 7; i++) {
        const el = document.getElementById('vision' + i);
        if (el) el.value = '';
        const step = document.getElementById('step' + i);
        if (step) step.style.display = (i === 1) ? 'block' : 'none';
    }
    document.getElementById('visionResult').style.display = 'none';
    document.getElementById('visionResult').innerHTML = '';
}

function copyVision() {
    navigator.clipboard.writeText(document.getElementById('visionResult').innerText);
}