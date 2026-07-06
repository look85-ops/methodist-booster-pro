const cards = [
    { cat:'start', text:"Что в этой теме для меня сейчас самое важное и почему?", listen:"Через ответы — приоритеты группы." },
    { cat:'start', text:"С каким ожиданием я пришёл на эту встречу?", listen:"Скрытые цели всплывают на старте." },
    { cat:'start', text:"Что я уже знаю об этой задаче и где границы моего знания?", listen:"Калибровка экспертизы." },
    { cat:'start', text:"Если бы мы не обсуждали это сейчас — чем бы я занимался полезным?", listen:"Сигнал ценности встречи." },
    { cat:'start', text:"Какой вопрос я хочу задать, но не решаюсь?", listen:"Часто самый ценный вопрос." },

    { cat:'review', text:"Что в нашей работе очевидно для всех, но мы молчим?", listen:"Слон в комнате." },
    { cat:'review', text:"Какое решение мы откладываем, хотя оно неизбежно?", listen:"Отложенные решения." },
    { cat:'review', text:"Где в процессе лишнее напряжение и кто его держит?", listen:"Ищите системную причину." },
    { cat:'review', text:"Что в нашей работе мы делаем по инерции?", listen:"Кандидаты на отмену." },
    { cat:'review', text:"За последний месяц — где мы потеряли больше всего времени?", listen:"Источники потерь." },
    { cat:'review', text:"Что у нас получается лучше, чем мы сами думаем?", listen:"Сильные стороны." },
    { cat:'review', text:"Если бы я начинал проект с нуля — что сделал бы по-другому?", listen:"Дистанция от текущих решений." },

    { cat:'action', text:"Какое одно действие я сделаю на этой неделе?", listen:"Конкретность + критерий." },
    { cat:'action', text:"Что я перестану делать после этой встречи?", listen:"Стоп-лист." },
    { cat:'action', text:"Кто из коллег должен узнать о нашем решении?", listen:"Коммуникационный план." },
    { cat:'action', text:"Что мне нужно от группы/руководителя?", listen:"Ресурсная карта." },
    { cat:'action', text:"Какой первый маленький шаг я могу сделать сегодня?", listen:"Минимизация порога." },
    { cat:'action', text:"Через 3 месяца — что я хочу сказать о себе/команде?", listen:"Образ результата." },

    { cat:'tension', text:"Что я сейчас не говорю, потому что это кажется неуместным?", listen:"Создайте безопасность." },
    { cat:'tension', text:"Какое допущение мы все принимаем — а оно может быть неверным?", listen:"Расшатывает groupthink." },
    { cat:'tension', text:"Где я устал и что мне нужно для восстановления?", listen:"Личное состояние." },
    { cat:'tension', text:"О чём мы спорим на самом деле?", listen:"Ценностный конфликт." },
    { cat:'tension', text:"Что в моей работе даёт силы, а что отнимает?", listen:"Баланс." },

    { cat:'stakeholder', text:"Чего заказчик ждёт от нас на самом деле?", listen:"Запрос ≠ потребность." },
    { cat:'stakeholder', text:"Если бы заказчик слышал нашу встречу — что бы его удивило?", listen:"Зеркало внешнего взгляда." },
    { cat:'stakeholder', text:"Кого из участников проекта мы давно не слышали?", listen:"Риск." },
    { cat:'stakeholder', text:"Что мы обещали и пока не сделали?", listen:"Долги." },
    { cat:'stakeholder', text:"Что я могу сделать для коллеги без чьего-либо разрешения?", listen:"Зона ответственности." },
    { cat:'stakeholder', text:"Какой обратной связи мне не хватает?", listen:"Запрос на ОС." }
];

const cardCategories = [
    { id:'all',         label:'Все' },
    { id:'start',       label:'Старт обсуждения' },
    { id:'review',      label:'Разбор работы' },
    { id:'action',      label:'Перенос в действие' },
    { id:'tension',     label:'Снятие напряжения' },
    { id:'stakeholder', label:'Заказчик / команда' }
];

const cardGroupSizes = [
    { id:'solo',  label:'1 человек',  procedure:'Запиши ответ за 3 мин. Через день перечитай.' },
    { id:'pair',  label:'Пара',       procedure:'Каждый отвечает 2 мин. Партнёр слушает, потом задаёт 1 вопрос.' },
    { id:'small', label:'3–6 человек', procedure:'1 мин тишины. Круг по 1–2 предложения. Ведущий собирает.' },
    { id:'large', label:'7+ человек',  procedure:'1 мин тишины. Обсуждение в малых группах 5–7 мин.' }
];

let cardFilterCat = 'all';
let cardGroupSize = 'pair';
const cardHistory = [];

function renderCardChips() {
    const catBox = document.getElementById('cardCategoryChips');
    catBox.innerHTML = cardCategories.map(c =>
        `<button class="filter-chip ${cardFilterCat===c.id?'active':''}" onclick="setCardCategory('${c.id}')">${c.label}</button>`
    ).join('');
    const groupBox = document.getElementById('cardGroupChips');
    groupBox.innerHTML = cardGroupSizes.map(g =>
        `<button class="filter-chip ${cardGroupSize===g.id?'active':''}" onclick="setCardGroup('${g.id}')">${g.label}</button>`
    ).join('');
}
function setCardCategory(id) { cardFilterCat = id; renderCardChips(); }
function setCardGroup(id)    { cardGroupSize = id; renderCardChips(); }

function drawCard() {
    let pool = (cardFilterCat === 'all') ? cards.slice() : cards.filter(c => c.cat === cardFilterCat);
    let fresh = pool.filter(c => !cardHistory.includes(c.text));
    if (!fresh.length) { fresh = pool; cardHistory.length = 0; }
    const pick = fresh[Math.floor(Math.random() * fresh.length)];
    cardHistory.push(pick.text);

    const group = cardGroupSizes.find(g => g.id === cardGroupSize) || cardGroupSizes[1];
    const catLabel = (cardCategories.find(c => c.id === pick.cat) || {}).label || '';

    const result = document.getElementById('cardResult');
    result.style.display = 'block';
    result.innerHTML = `
        <div class="card-face">
            <div class="card-meta">${catLabel} · ${group.label}</div>
            <div class="card-text">${pick.text}</div>
        </div>
        <div class="card-guide">
            <div><strong>Как провести:</strong> ${group.procedure}</div>
            <div style="margin-top:var(--s-2)"><strong>Что слушать:</strong> ${pick.listen}</div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderCardChips();
    document.getElementById('genCardBtn').onclick = drawCard;
});