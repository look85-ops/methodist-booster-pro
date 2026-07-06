const BOOSTY = {
  url: 'https://boosty.to/natalialnd',
  dailyLimit: 3,
  priceLabel: '390\u20BD/\u043C\u0435\u0441',

  get todayKey() {
    return new Date().toISOString().slice(0, 10);
  },

  _load() {
    const raw = localStorage.getItem('mb_usage');
    if (!raw) return { date: this.todayKey, count: 0 };
    try { return JSON.parse(raw); } catch { return { date: this.todayKey, count: 0 }; }
  },

  _save(data) {
    localStorage.setItem('mb_usage', JSON.stringify(data));
  },

  getUsage() {
    const d = this._load();
    if (d.date !== this.todayKey) { d.date = this.todayKey; d.count = 0; this._save(d); }
    return d.count;
  },

  incrementUsage() {
    const d = this._load();
    if (d.date !== this.todayKey) { d.date = this.todayKey; d.count = 0; }
    d.count++;
    this._save(d);
  },

  canUse() {
    if (this.isUnlocked()) return true;
    return this.getUsage() < this.dailyLimit;
  },

  isUnlocked() {
    try {
      const val = localStorage.getItem('mb_unlocked');
      if (val === 'true') return true;
      if (val && val.length > 8) return true;
    } catch {}
    return false;
  },

  getRemaining() {
    if (this.isUnlocked()) return Infinity;
    return Math.max(0, this.dailyLimit - this.getUsage());
  },

  unlockWithCode(code) {
    if (code && code.length >= 6) {
      localStorage.setItem('mb_unlocked', code);
      return true;
    }
    return false;
  },

  lock() {
    localStorage.removeItem('mb_unlocked');
  },

  showLimitModal() {
    const existing = document.getElementById('boosty-overlay');
    if (existing) return;

    const overlay = document.createElement('div');
    overlay.id = 'boosty-overlay';
    overlay.innerHTML =
'<div class="boosty-modal">' +
'<button class="boosty-close" onclick="this.closest(\'#boosty-overlay\').remove()" aria-label="Закрыть">&times;</button>' +
'<h3>\u0414\u043D\u0435\u0432\u043D\u043E\u0439 \u043B\u0438\u043C\u0438\u0442 \u0438\u0441\u0447\u0435\u0440\u043F\u0430\u043D</h3>' +
'<p>\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E: <strong>' + this.dailyLimit + ' ' + this.pluralize(this.dailyLimit, '\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F', '\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438', '\u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0439') + '</strong> \u0432 \u0434\u0435\u043D\u044C. \u0425\u043E\u0442\u0438\u0442\u0435 \u0431\u043E\u043B\u044C\u0448\u0435?</p>' +
'<div class="boosty-benefits">' +
'  <div class="boosty-benefit">\u2713 \u0411\u0435\u0437\u043B\u0438\u043C\u0438\u0442\u043D\u044B\u0439 AI-\u0434\u043E\u0441\u0442\u0443\u043F</div>' +
'  <div class="boosty-benefit">\u2713 \u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u043D\u044B\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F</div>' +
'  <div class="boosty-benefit">\u2713 \u0418\u043C\u044F \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0438\u043A\u043E\u0432</div>' +
'</div>' +
'<a class="boosty-btn" href="' + this.url + '" target="_blank" rel="noopener">\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043E\u0442 ' + this.priceLabel + '</a>' +
'<div class="boosty-code-section">' +
'  <p class="boosty-code-hint">\u0423\u0436\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0430\u043B\u0438? \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434 \u0438\u0437 \u043F\u0438\u0441\u044C\u043C\u0430 \u043D\u0430 Boosty:</p>' +
'  <div class="boosty-code-input-row">' +
'    <input type="text" id="boostyUnlockInput" placeholder="\u041A\u043E\u0434 \u0434\u043E\u0441\u0442\u0443\u043F\u0430" maxlength="20">' +
'    <button onclick="var c=document.getElementById(\'boostyUnlockInput\').value;if(BOOSTY.unlockWithCode(c)){alert(\'\u0414\u043E\u0441\u0442\u0443\u043F \u0440\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D!\');document.getElementById(\'boosty-overlay\').remove();location.reload()}else{alert(\'\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434\')}">\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>' +
'  </div>' +
'</div>' +
'<button class="boosty-later" onclick="this.closest(\'#boosty-overlay\').remove()">\u041D\u0435 \u0441\u0435\u0439\u0447\u0430\u0441</button>' +
'</div>';
    document.body.appendChild(overlay);
  },

  pluralize(n, one, few, many) {
    n = Math.abs(n) % 100;
    if (n > 10 && n < 20) return many;
    n = n % 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return few;
    return many;
  }
};

(function() {
  window.BOOSTY = BOOSTY;
})();
