const auditCauses = [
    { id:'no_knowledge', label:'Не знают / не умеют',
      hint:'Если бы от этого зависела их зарплата на 100% — они всё равно бы не справились. Нет навыка или знания, как делать.', learning:true },
    { id:'no_practice', label:'Знают, но не отработано',
      hint:'Слышали, читали, проходили — но в реальной ситуации не делают. Нет тренировки в безопасной среде или нет фидбека.', learning:true },
    { id:'no_resources', label:'Знают, но не могут (среда не даёт)',
      hint:'Нет полномочий, инструментов, времени, доступа к данным; правила процесса противоречат нужному поведению.', learning:false, kind:'environment' },
    { id:'no_motivation', label:'Знают и могут, но не хотят',
      hint:'Нет ясных целей или метрик; нет признания за правильное поведение; неправильное поведение не имеет последствий; нет смысла лично для них.', learning:'partial', kind:'motivation' },
    { id:'no_feedback', label:'Делают вслепую — нет обратной связи',
      hint:'Не получают сигналов «сработало / не сработало»; узнают об ошибках поздно или случайно. Корректировать поведение нечем.', learning:'partial', kind:'feedback' },
    { id:'system', label:'Системная / культурная причина',
      hint:'Проблема массовая, в разных подразделениях, повторяется годами. Симптомы у людей — причины в системе/культуре/стратегии.', learning:false, kind:'culture' }
];

function changeOwnerBy(causeId) {
    return ({
        no_knowledge:  'для руководителя функции и владельца обучения',
        no_practice:   'для руководителя и наставников',
        no_resources:  'для владельца процесса и руководителя функции',
        no_motivation: 'для руководителя команды и HR',
        no_feedback:   'для руководителя команды',
        system:        'для топ-менеджмента и держателей функций'
    })[causeId] || '';
}

function audienceAdjustments(audience, causeId) {
    const adj = [];
    if (audience === 'experts') {
        if (causeId === 'no_knowledge' || causeId === 'no_practice') {
            adj.push({ title:'Формат экспертного обмена, не обучение сверху', detail:'Эксперты учатся у других экспертов, не у тренера. Формат: мастермайнд, peer-learning, разбор кейсов друг друга.' });
        } else if (causeId === 'no_motivation') {
            adj.push({ title:'Работа через лидеров мнений и систему признания', detail:'Симуляции «о последствиях» для экспертов неуместны.' });
        } else if (causeId === 'no_feedback') {
            adj.push({ title:'Peer-ревью между экспертами', detail:'ОС от руководителя экспертам часто «не считается».' });
        } else {
            adj.push({ title:'Учёт зрелости аудитории', detail:'Эксперты — равноправные участники процесса изменений.' });
        }
    }
    if (audience === 'new') {
        if (causeId === 'no_knowledge' || causeId === 'no_practice') {
            adj.push({ title:'Адаптационная программа + buddy/наставник', detail:'Для новых работает связка: 1-2 базовых блока обучения + наставник на 1–3 месяца.' });
            adj.push({ title:'Welcome-инструктаж и чек-листы первого месяца', detail:'Структурированные ожидания по неделям.' });
        } else if (causeId === 'no_resources' || causeId === 'system') {
            adj.push({ title:'Внимание: новый сотрудник = индикатор', detail:'Если новые не могут в среде, где старые могут — это сигнал.' });
        }
    }
    if (audience === 'cross') {
        adj.push({ title:'Формат для кросс-функциональной команды', detail:'Учить только одну роль бесполезно — нужен общий язык.' });
        if (causeId === 'no_resources' || causeId === 'system') {
            adj.push({ title:'Воркшоп по стыкам ролей', detail:'Соберите все роли в одной комнате.' });
        }
    }
    if (audience === 'trainers') {
        adj.push({ title:'T3 — train-the-trainer', detail:'Учим не теме, а как её передавать.' });
        if (causeId === 'no_knowledge' || causeId === 'no_practice') {
            adj.push({ title:'+ Содержательный модуль', detail:'Сначала закрываем тему, затем учим её передавать.' });
        }
    }
    if (audience === 'executives') {
        if (causeId !== 'system') {
            adj.push({ title:'Учёт уровня: формат для топ-менеджмента', detail:'Лекции топ-менеджмент игнорирует. Работают: стратсессия, мастермайнд.' });
        }
    }
    return adj;
}

function resolveScopeConflict(scope, urgency) {
    const heavy = ['day','week','long'].includes(scope);
    if (heavy && urgency === 'now') {
        return { title:'Разрешение конфликта объёма и срочности', detail:'Запрошен объём ≥ 1 дня, но срок на этой неделе. Предлагаем двухходовку.' };
    }
    if (scope === 'long' && urgency === 'month') {
        return { title:'Разрешение конфликта длительности и срочности', detail:'Программа от месяца — договоритесь о промежуточных метриках.' };
    }
    return null;
}

function relevantConstraints(input, causeId) {
    const c = [];
    const learningPath = (causeId === 'no_knowledge' || causeId === 'no_practice');
    if (input.budget === 'none') {
        c.push(learningPath
            ? 'Бюджет = 0: фокус на внутренних ресурсах.'
            : 'Бюджет = 0: внешнего консультанта нанять не получится.');
    }
    if (input.urgency === 'now' && learningPath) {
        c.push('Срочность на этой неделе: реалистичны только короткие форматы.');
    } else if (input.urgency === 'now' && !learningPath) {
        c.push('Срочность на этой неделе: системные изменения за неделю не делаются.');
    }
    if ((input.format === 'distributed' || input.format === 'online') && learningPath) {
        c.push('Распределённая аудитория: выбирайте форматы, не теряющие качества онлайн.');
    }
    if (input.people === 'xlarge' && learningPath) {
        c.push('500+ человек: личная фасилитация невозможна.');
    } else if (input.people === 'xlarge' && !learningPath) {
        c.push('500+ человек: системные изменения идут через каскад.');
    }
    if (input.goalType === 'culture' && causeId !== 'system') {
        c.push('Тип результата культура: без работы со средой результат не закрепится.');
    }
    if (causeId === 'no_knowledge' && input.goalType === 'culture') {
        c.push('Проверьте связку: тип результата культура, а причина — не знают.');
    }
    const conflict = resolveScopeConflict(input.scope, input.urgency);
    if (conflict) c.push(`<strong>${conflict.title}:</strong> ${conflict.detail}`);
    return c;
}

function buildVerdict(input) {
    const cause = auditCauses.find(c => c.id === input.causeId);
    const recommendations = [];
    let header = {}, why = '', questions = [], phrases = [], risks = [];
    const owner = changeOwnerBy(input.causeId);

    if (cause.id === 'no_knowledge') {
        header = { cls:'ok', label:'✅ Обучение уместно: нужен навык' };
        why = `У аудитории «${input.audienceLabel}» действительно нет нужного знания или навыка.`;

        if (input.scope === 'short') recommendations.push({ title:'Микро-инструктаж + чек-лист', detail:'1–4 часа, фокус на 1 навыке.' });
        else if (input.scope === 'halfday') recommendations.push({ title:'Мини-практикум 4 часа', detail:'Короткая теория + 2 кейса.' });
        else if (input.scope === 'day') recommendations.push({ title:'Однодневный тренинг с практикой', detail:'Полный цикл: теория → практика → де-бриф.' });
        else if (input.scope === 'week') recommendations.push({ title:'Программа из 3–5 модулей', detail:'Модули с разрывом в 1–2 дня.' });
        else recommendations.push({ title:'Программа развития', detail:'Модули + практика + наставничество.' });

        if (input.people === 'xlarge') recommendations.push({ title:'+ Тиражируемый формат', detail:'Коробочное решение для масштабирования.' });

        questions = ['Какие конкретные ошибки/дефициты видны чаще всего?', 'Кто сейчас умеет делать это хорошо?', 'Как измерим успех и через какой срок?', 'Кто будет сопровождать перенос?'];
        phrases = [`Предлагаю ${input.scopeLabel.toLowerCase()} в формате практикума.`, 'Зафиксируем критерии качества на старте.'];
        risks = ['Без де-брифа практика не закрепится', 'Без поддержки руководителя навык быстро откатится'];
    }
    else if (cause.id === 'no_practice') {
        header = { cls:'ok', label:'✅ Обучение уместно: нужна тренировка, не теория' };
        why = `Аудитория знает как надо, но не делает устойчиво.`;
        recommendations.push({ title:'Симуляция / тренажёр / ролевые с де-брифом', detail:'Минимум теории. Многократные повторы.' });
        recommendations.push({ title:'Разбор реальных кейсов из практики', detail:'Кейсы от участников.' });
        if (input.audience === 'managers' || input.audience === 'executives') {
            recommendations.push({ title:'+ Коучинг / индивидуальное сопровождение', detail:'Для руководителей.' });
        }
        questions = ['Где сейчас люди могут потренироваться безопасно?', 'Кто даёт обратную связь?', 'Какие кейсы можно взять?'];
        phrases = ['Предлагаю тренировку с многократным повтором.', 'Замерим переносимость.'];
        risks = ['Без многократного повтора навык не закрепится', 'Без безопасной среды люди не будут пробовать'];
    }
    else if (cause.id === 'no_resources') {
        header = { cls:'warn', label:'⚙️ Обучение не лечит. Нужно править среду' };
        why = `Люди знают, что делать — но не могут. Тренинг даст обратный эффект.`;
        recommendations.push({ title:'Аудит процесса / снятие барьеров', detail:'Работа с владельцем процесса.' });
        recommendations.push({ title:'Воркшоп по пересборке процесса', detail:'1–2 дня с владельцами функций.' });
        recommendations.push({ title:'Поддержка владельца изменений', detail:'Помогаем руководителю.' });
        recommendations.push({ title:'Обучение — после правок среды', detail:'Короткий инструктаж.' });
        questions = ['Какие правила/инструменты мешают?', 'Кто владелец процесса?', 'Что произойдёт, если проведём обучение без правок?'];
        phrases = ['Мы можем начать обучение, но есть риск.', `Рекомендуем ${owner}: воркшоп по пересборке.`];
        risks = ['Если провести обучение без правок — потеряем доверие', 'Симптом вернётся через 2–4 недели'];
    }
    else if (cause.id === 'no_motivation') {
        header = { cls:'warn', label:'⚙️ Обучение лечит частично. Нужны управленческие действия' };
        why = `Люди знают и могут — но не делают из-за отсутствия смысла.`;
        if (input.audience === 'managers' || input.audience === 'executives') {
            recommendations.push({ title:'Управленческая сессия / стратсессия', detail:'Для руководителей.' });
        } else {
            recommendations.push({ title:'Симуляция с разбором последствий', detail:'Но без руководителя эффект не сохранится.' });
        }
        recommendations.push({ title:'Управленческие инструменты', detail:'Помогаем руководителям.' });
        recommendations.push({ title:'Пересборка системы мотивации', detail:'Совместно с HR.' });
        questions = ['Какие барьеры мотивации?', 'Какие сигналы от руководителей?', 'Что происходит при правильном/неправильном поведении?'];
        phrases = ['Мы можем сделать обучение, но есть риск.', `Рекомендуем ${owner}.`];
        risks = ['Без участия руководителей эффект краткосрочный', 'Сотрудники воспримут обучение как наказание'];
    }
    else if (cause.id === 'no_feedback') {
        header = { cls:'warn', label:'⚙️ Обучение лечит частично. Нужна система обратной связи' };
        why = `Люди не получают сигналов «сработало или нет».`;
        recommendations.push({ title:'Настройка системы фидбека', detail:'С руководителем.' });
        recommendations.push({ title:'Регулярные ретроспективы команды', detail:'Раз в 2 недели.' });
        recommendations.push({ title:'Метрики, видимые сотрудникам', detail:'Дашборды.' });
        if (input.audience === 'managers' || input.audience === 'executives') {
            recommendations.push({ title:'+ Обучение руководителей навыкам ОС', detail:'Практикум с ролевыми.' });
        }
        questions = ['Кто даёт обратную связь?', 'Как часто сотрудник узнаёт результат?', 'Готовы ли руководители выделить время?'];
        phrases = ['Мы можем провести тренинг, но есть риск.', `Рекомендуем ${owner}.`];
        risks = ['Без ОС любое обучение забывается за 2–4 недели'];
    }
    else if (cause.id === 'system') {
        header = { cls:'bad', label:'🚫 Обучение не лечит. Это системная задача' };
        why = `Проблема массовая, причина в системе или культуре.`;
        recommendations.push({ title:'Стратегическая сессия с топ-менеджментом', detail:'2–3 дня с фасилитатором.' });
        recommendations.push({ title:'Хакатон по пересборке процессов', detail:'1–3 дня.' });
        recommendations.push({ title:'Change-management программа', detail:'На 3–6 месяцев.' });
        recommendations.push({ title:'OD-диагностика', detail:'Если не уверены.' });
        questions = ['Когда проблема появилась?', 'Что уже пробовали?', 'Кто из топ-менеджмента готов?', 'Готовы к решению на 3–6 месяцев?'];
        phrases = ['Мы можем сделать обучение, но есть риск.', `Рекомендуем ${owner}.`, 'Если не уверены — OD-диагностика.'];
        risks = ['Если возьмёмся за обучение — потратим бюджет', 'Заказчик потеряет доверие к L&D'];
    }

    audienceAdjustments(input.audience, input.causeId).forEach(a => recommendations.push(a));
    const constraints = relevantConstraints(input, input.causeId);

    const list = arr => arr.length ? `<ul style="margin:6px 0 0 16px">${arr.map(x=>`<li>${x}</li>`).join('')}</ul>` : '<em style="color:var(--text-soft)">—</em>';
    const recList = recommendations.length
        ? `<ul style="margin:6px 0 0 16px">${recommendations.map(r=>`<li><strong>${r.title}.</strong> ${r.detail}</li>`).join('')}</ul>`
        : '<em style="color:var(--text-soft)">—</em>';

    const headerHtml = `<div class="verdict-header ${header.cls}"><strong>${header.label}</strong></div>`;
    const sumCard = `
        <div class="verdict-summary">
            <strong>Краткое саммари:</strong><br>
            ${input.desc}<br>
            <em>Цель (${input.goalTypeLabel}):</em> ${input.goal}<br>
            <em>Аудитория:</em> ${input.audienceLabel}<br>
            <em>Объём · бюджет · людей · срочность · формат:</em> ${input.scopeLabel} · ${input.budgetLabel} · ${input.peopleLabel} · ${input.urgencyLabel} · ${input.formatLabel}<br>
            <em>Системный эффект:</em> ${input.systemImpactLabel}${input.systemNote ? ' — ' + input.systemNote : ''}
        </div>`;

    return `
        ${headerHtml}
        ${sumCard}
        <div class="verdict-section"><strong>Почему такой вердикт:</strong> ${why}</div>
        <div class="verdict-section"><strong>Рекомендованные форматы:</strong>${recList}</div>
        ${constraints.length ? `<div class="verdict-section"><strong>Учёт ограничений:</strong>${list(constraints)}</div>` : ''}
        <div class="verdict-section"><strong>Вопросы заказчику:</strong>${list(questions)}</div>
        <div class="verdict-section"><strong>Репетиция формулировок:</strong>${list(phrases)}</div>
        <div class="verdict-section"><strong>Риски:</strong>${list(risks)}</div>
        <div style="margin-top:var(--s-3)"><button class="action-btn" onclick="copyAudit()">📋 Скопировать сводку</button></div>
        <div class="tool-links" style="margin-top: var(--s-4); padding-top: var(--s-3); border-top: 1px solid var(--border); font-size: var(--fs-small)">
            <strong style="color: var(--text-muted)">Другие инструменты:</strong>
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: var(--s-2)">
                <a class="action-btn" href="ivanov.html">🎭 Иванов</a>
                <a class="action-btn" href="activities.html">⚡ Активности</a>
                <a class="action-btn" href="cards.html">🎴 Карты</a>
                <a class="action-btn" href="vision.html">🎯 Видение</a>
                <a class="action-btn" href="prompts.html">🧩 Промпты</a>
                <a class="action-btn" href="index.html">🏠 На главную</a>
            </div>
        </div>
    `;
}

function renderCauseOptions() {
    const box = document.getElementById('causeOptions');
    if (!box) return;
    box.innerHTML = auditCauses.map(c => `
        <label class="radio-card">
            <input type="radio" name="cause" value="${c.id}">
            <div>
                <strong>${c.label}</strong>
                <div class="radio-hint">${c.hint}</div>
            </div>
        </label>
    `).join('');
}

function showAuditStep(n) {
    if (n === 2) {
        if (!document.getElementById('auditDesc').value.trim()) { alert('Опиши ситуацию'); return; }
        document.getElementById('audit1').style.display = 'none';
        document.getElementById('audit2').style.display = 'block';
    } else if (n === 3) {
        if (!document.getElementById('auditAudience').value) { alert('Выбери аудиторию'); return; }
        document.getElementById('audit2').style.display = 'none';
        document.getElementById('audit3').style.display = 'block';
    } else if (n === 4) {
        if (!document.getElementById('auditGoal').value.trim()) { alert('Опиши цель'); return; }
        document.getElementById('audit3').style.display = 'none';
        document.getElementById('audit4').style.display = 'block';
    } else if (n === 5) {
        if (!document.querySelector('input[name="cause"]:checked')) { alert('Выбери причину'); return; }
        document.getElementById('audit4').style.display = 'none';
        document.getElementById('audit5').style.display = 'block';
    } else if (n === 6) {
        const audienceMap = { executives:'Топ-менеджмент', managers:'Руководители', employees:'Сотрудники', experts:'Эксперты', new:'Новые', cross:'Кросс-функц.', trainers:'Тренеры' };
        const scopeMap = { short:'1–4 часа', halfday:'Полдня', day:'1 день', week:'Неделя', long:'От месяца' };
        const budgetMap = { none:'Нет', small:'Малый', medium:'Средний', large:'Большой' };
        const peopleMap = { '1':'1', small:'2–10', medium:'10–50', large:'50–500', xlarge:'500+' };
        const urgencyMap = { now:'На этой неделе', month:'На месяц', quarter:'Квартал+' };
        const formatMap = { onsite:'Очно', distributed:'Очно в разных городах', hybrid:'Гибрид', online:'Онлайн' };
        const goalTypeMap = { behavior:'поведение', knowledge:'знания/навык', outcome:'бизнес-результат', culture:'культура' };
        const systemImpactMap = { positive:'Улучшит', neutral:'Нейтрально', negative:'Ухудшит', unknown:'Нужна диагностика' };

        const input = {
            desc: document.getElementById('auditDesc').value.trim(),
            audience: document.getElementById('auditAudience').value,
            audienceLabel: audienceMap[document.getElementById('auditAudience').value] || '',
            goal: document.getElementById('auditGoal').value.trim(),
            goalType: document.getElementById('auditGoalType').value,
            goalTypeLabel: goalTypeMap[document.getElementById('auditGoalType').value] || '',
            causeId: document.querySelector('input[name="cause"]:checked').value,
            scope: document.getElementById('auditScope').value,
            scopeLabel: scopeMap[document.getElementById('auditScope').value] || '',
            budget: document.getElementById('auditBudget').value,
            budgetLabel: budgetMap[document.getElementById('auditBudget').value] || '',
            people: document.getElementById('auditPeople').value,
            peopleLabel: peopleMap[document.getElementById('auditPeople').value] || '',
            urgency: document.getElementById('auditUrgency').value,
            urgencyLabel: urgencyMap[document.getElementById('auditUrgency').value] || '',
            format: document.getElementById('auditFormat').value,
            formatLabel: formatMap[document.getElementById('auditFormat').value] || '',
            systemImpact: document.getElementById('auditSystemImpact').value,
            systemImpactLabel: systemImpactMap[document.getElementById('auditSystemImpact').value] || '',
            systemNote: document.getElementById('auditSystemNote').value.trim()
        };

        document.getElementById('auditVerdict').innerHTML = buildVerdict(input);
        document.getElementById('audit5').style.display = 'none';
        document.getElementById('audit6').style.display = 'block';
    }
}

function resetAudit() {
    ['audit1','audit2','audit3','audit4','audit5','audit6'].forEach(id => {
        document.getElementById(id).style.display = (id === 'audit1') ? 'block' : 'none';
    });
    ['auditDesc','auditGoal'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const resetSelect = (id, value) => { const el = document.getElementById(id); if (el) el.value = value; };
    resetSelect('auditAudience', '');
    resetSelect('auditGoalType', 'behavior');
    resetSelect('auditScope', 'day');
    resetSelect('auditBudget', 'small');
    resetSelect('auditPeople', 'small');
    resetSelect('auditUrgency', 'month');
    resetSelect('auditFormat', 'hybrid');
    resetSelect('auditSystemImpact', '');
    document.getElementById('auditSystemNote').value = '';
    const checked = document.querySelector('input[name="cause"]:checked'); if (checked) checked.checked = false;
    document.getElementById('auditVerdict').innerHTML = '';
}

function copyAudit() {
    const el = document.getElementById('auditVerdict');
    navigator.clipboard.writeText(el.innerText);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCauseOptions();
});