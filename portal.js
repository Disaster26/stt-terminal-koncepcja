(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- czas wzgledny (dane przykladowe zawsze "biezace") ---------- */
  var TERAZ = new Date(); TERAZ.setSeconds(0, 0);
  var DNI = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
  function czas(h) { var d = new Date(TERAZ.getTime() + h * 3600e3); d.setMinutes(Math.round(d.getMinutes() / 5) * 5); return d; }
  function dd(n) { return (n < 10 ? '0' : '') + n; }
  function fmt(h) { var d = czas(h); return DNI[d.getDay()] + ' ' + dd(d.getDate()) + '.' + dd(d.getMonth() + 1) + ', ' + dd(d.getHours()) + ':' + dd(d.getMinutes()); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- dane przykladowe ---------- */
  var STATKI = [
    { nazwa: 'BALTIC MERIDIAN', rejs: '046E', nab: 'N1', eta: -30, etd: 8, cut: -6, status: 'Przy nabrzeżu, operacje', st: 'st-in' },
    { nazwa: 'NORDIC CORMORANT', rejs: '112W', nab: 'N2', eta: 9, etd: 31, cut: -2, status: 'W drodze, ETA wg AIS', st: 'st-ok' },
    { nazwa: 'AMBER CREST', rejs: '018N', nab: 'N3', eta: 38, etd: 60, cut: 20, status: 'W drodze, opóźnienie 2 h', st: 'st-uw' },
    { nazwa: 'POMERANIA STAR', rejs: '233E', nab: 'N1', eta: 70, etd: 94, cut: 52, status: 'Planowany', st: 'st-in' },
    { nazwa: 'SKAGEN BAY', rejs: '090S', nab: 'N2', eta: 101, etd: 118, cut: 84, status: 'Planowany', st: 'st-in' }
  ];

  var K = {
    STTU1234569: {
      typ: '40HC', iso: '45G1', opisTyp: 'kontener 40 stóp, podwyższony (High Cube)', kier: 'Import',
      status: 'Gotowy do wydania', st: 'st-ok', blok: 'A3', lok: { blok: 'A3', rzad: '12', pietro: '3' },
      statek: 'BALTIC MERIDIAN', rejs: '046E', eta: -30, etd: 8, waga: '24 310 kg', plomba: 'PL 0458812', armator: 'Armator przykładowy A',
      blokady: [{ ok: true, t: 'Odprawa celna zakończona, kontener zwolniony.' }, { ok: true, t: 'Opłaty terminalowe uregulowane.' }],
      wolneDo: 52, awizacja: true,
      os: [
        { h: -50, t: 'Zgłoszenie od armatora', s: 'Plan ładunkowy statku (BAPLIE) i zlecenie (COPARN) przyjęte do systemu terminalu.' },
        { h: -30, t: 'Przypłynięcie statku', s: 'BALTIC MERIDIAN 046E przy nabrzeżu N1.' },
        { h: -27.5, t: 'Rozładunek ze statku', s: 'Suwnica nabrzeżowa STS-02, potwierdzenie rozładunku (COARRI).' },
        { h: -27, t: 'Składowanie na placu', s: 'Blok A3, rząd 12, piętro 3.' },
        { h: -9, t: 'Odprawa celna', s: 'Zgłoszenie celne przyjęte, kontener zwolniony.' },
        { h: 6, t: 'Przyjazd ciężarówki na bramę', s: 'Odczyt OCR: numer kontenera, plomba, tablica rejestracyjna.', plan: true },
        { h: 6.5, t: 'Wydanie z terminalu', s: 'Potwierdzenie wyjazdu przez bramę (CODECO).', plan: true }
      ]
    },
    BALU7654328: {
      typ: '40RH', iso: '45R1', opisTyp: 'kontener chłodzony 40 stóp, High Cube', kier: 'Import', reefer: { zad: -18.0, akt: -17.6, zas: 'podłączony do zasilania' },
      status: 'Wstrzymany: blokada celna', st: 'st-bl', blok: 'R1', lok: { blok: 'R1', rzad: '04', pietro: '2' },
      statek: 'BALTIC MERIDIAN', rejs: '046E', eta: -30, etd: 8, waga: '28 940 kg', plomba: 'PL 0461207', armator: 'Armator przykładowy B',
      blokady: [{ ok: false, t: 'Blokada celna: kontener wytypowany do kontroli. Termin kontroli zostanie podany przez służbę celną.' }, { ok: false, t: 'Opłata za podłączenie do zasilania (2 doby) czeka na płatność.' }],
      wolneDo: 20, awizacja: false,
      os: [
        { h: -52, t: 'Zgłoszenie od armatora', s: 'Plan ładunkowy (BAPLIE): kontener chłodzony, nastawa -18,0 °C.' },
        { h: -30, t: 'Przypłynięcie statku', s: 'BALTIC MERIDIAN 046E przy nabrzeżu N1.' },
        { h: -26, t: 'Rozładunek ze statku', s: 'Suwnica nabrzeżowa STS-01, odczyt temperatury przy rozładunku -17,8 °C.' },
        { h: -25.5, t: 'Składowanie na placu', s: 'Blok chłodniczy R1, rząd 04, piętro 2, podłączenie do zasilania.' },
        { h: -4, t: 'Odprawa celna', s: 'Wytypowany do kontroli, blokada założona.' },
        { h: 24, t: 'Kontrola celna', s: 'Przewiezienie do strefy kontroli celnej.', plan: true },
        { h: 30, t: 'Załadunek na pociąg', s: 'Planowany skład do terminalu lądowego (przykład).', plan: true }
      ]
    },
    PMRU3011221: {
      typ: '20GP', iso: '22G1', opisTyp: 'kontener 20 stóp, standardowy', kier: 'Eksport',
      status: 'Na placu, czeka na załadunek', st: 'st-in', blok: 'B5', lok: { blok: 'B5', rzad: '07', pietro: '1' },
      statek: 'NORDIC CORMORANT', rejs: '112W', eta: 9, etd: 31, waga: '18 220 kg', plomba: 'PL 0470033', armator: 'Armator przykładowy A',
      blokady: [{ ok: true, t: 'Odprawa eksportowa zakończona.' }, { ok: true, t: 'Opłaty terminalowe uregulowane.' }],
      awizacja: false, eksport: true,
      os: [
        { h: -40, t: 'Zgłoszenie od armatora', s: 'Rezerwacja i zlecenie przyjęcia kontenera (COPARN).' },
        { h: -20, t: 'Przyjazd na bramę', s: 'Odczyt OCR: numer PMRU 301122 1, plomba PL 0470033, tablica ZS 12345 (przykład). Potwierdzenie wjazdu (CODECO).' },
        { h: -19.5, t: 'Składowanie na placu', s: 'Blok B5, rząd 07, piętro 1.' },
        { h: -12, t: 'Odprawa celna', s: 'Zgłoszenie wywozowe przyjęte.' },
        { h: 9, t: 'Przypłynięcie statku', s: 'NORDIC CORMORANT 112W, nabrzeże N2, ETA wg AIS.', plan: true },
        { h: 14, t: 'Załadunek na statek', s: 'Potwierdzenie załadunku (COARRI).', plan: true },
        { h: 31, t: 'Wypłynięcie statku', s: 'ETD.', plan: true }
      ]
    },
    STTU4500111: {
      typ: '40GP', iso: '42G1', opisTyp: 'kontener 40 stóp, standardowy', kier: 'Import',
      status: 'Na statku, przed rozładunkiem', st: 'st-in', blok: null, lok: null,
      statek: 'NORDIC CORMORANT', rejs: '112W', eta: 9, etd: 31, waga: '21 050 kg', plomba: 'PL 0466190', armator: 'Armator przykładowy C',
      blokady: [{ ok: false, t: 'Zgłoszenie celne jeszcze nie złożone.' }], awizacja: false,
      os: [
        { h: -20, t: 'Zgłoszenie od armatora', s: 'Plan ładunkowy statku (BAPLIE) przyjęty.' },
        { h: 9, t: 'Przypłynięcie statku', s: 'ETA wg AIS, nabrzeże N2.', plan: true },
        { h: 12, t: 'Rozładunek ze statku', s: 'Planowany.', plan: true }
      ]
    },
    BALU1122009: {
      typ: '20GP', iso: '22G1', opisTyp: 'kontener 20 stóp, standardowy', kier: 'Import',
      status: 'Wydany (pociąg)', st: 'st-ok', blok: null, lok: null,
      statek: 'BALTIC MERIDIAN', rejs: '046E', eta: -30, etd: 8, waga: '16 480 kg', plomba: 'PL 0457720', armator: 'Armator przykładowy B',
      blokady: [{ ok: true, t: 'Brak blokad.' }], awizacja: false,
      os: [
        { h: -50, t: 'Zgłoszenie od armatora', s: 'BAPLIE, COPARN.' },
        { h: -28, t: 'Rozładunek ze statku', s: 'Suwnica STS-02.' },
        { h: -27.5, t: 'Składowanie na placu', s: 'Blok A1, rząd 03, piętro 2.' },
        { h: -20, t: 'Odprawa celna', s: 'Zwolniony.' },
        { h: -6, t: 'Załadunek na pociąg', s: 'Terminal kolejowy, tor 2, wagon 14.' },
        { h: -3, t: 'Wydanie z terminalu', s: 'Wyjazd składu z terminalu.' }
      ]
    },
    PMRU9080702: {
      typ: '40HC', iso: '45G1', opisTyp: 'kontener 40 stóp, podwyższony (High Cube)', kier: 'Eksport',
      status: 'Awizowany, przed przyjazdem', st: 'st-uw', blok: null, lok: null,
      statek: 'AMBER CREST', rejs: '018N', eta: 38, etd: 60, waga: 'zgłoszona 26 000 kg', plomba: 'zostanie odczytana na bramie', armator: 'Armator przykładowy C',
      blokady: [{ ok: true, t: 'Brak blokad.' }], awizacja: false, eksport: true,
      os: [
        { h: -5, t: 'Zgłoszenie od armatora', s: 'Zlecenie przyjęcia kontenera (COPARN).' },
        { h: 4, t: 'Przyjazd na bramę', s: 'Awizacja: okno 10:00-12:00 (przykład).', plan: true },
        { h: 20, t: 'Zamknięcie przyjęć na statek', s: 'AMBER CREST 018N.', plan: true }
      ]
    }
  };

  /* ---------- logowanie (atrapa) ---------- */
  function zapisz(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function czytaj(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function usun(k) { try { sessionStorage.removeItem(k); } catch (e) {} }

  var nrZAdresu = null;
  try { nrZAdresu = new URLSearchParams(location.search).get('nr'); } catch (e) {}

  function pokazPortal() {
    $('#ekran-log').hidden = true;
    $('#ekran-portal').hidden = false;
    $('#wyloguj-menu').hidden = false;
    if (nrZAdresu) { $('#nr').value = nrZAdresu; szukaj(nrZAdresu); nrZAdresu = null; }
  }
  function pokazLogowanie() {
    $('#ekran-log').hidden = false;
    $('#ekran-portal').hidden = true;
    $('#wyloguj-menu').hidden = true;
  }

  $('#log-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var l = $('#login').value.trim().toLowerCase(), h = $('#haslo').value.trim();
    var kom = $('#log-kom');
    if (l === 'demo' && h === 'demo') {
      zapisz('stt_demo', '1'); kom.textContent = ''; pokazPortal(); scrollTo(0, 0);
    } else {
      kom.textContent = 'Nieprawidłowy login lub hasło. W wersji demonstracyjnej wpisz demo / demo.';
      kom.className = 'komunikat zle';
    }
  });
  function wyloguj(e) { if (e) e.preventDefault(); usun('stt_demo'); pokazLogowanie(); scrollTo(0, 0); }
  $('#wyloguj').addEventListener('click', wyloguj);
  $('#wyloguj-menu').addEventListener('click', wyloguj);

  /* ---------- zakladki ---------- */
  function zakladka(p) {
    $$('.zakl button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.p === p ? 'true' : 'false'); });
    $$('.panel').forEach(function (el) { el.hidden = el.id !== 'p-' + p; });
    var akt = $('.zakl button[data-p="' + p + '"]');
    if (akt && akt.scrollIntoView && innerWidth < 900) akt.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  $$('.zakl button').forEach(function (b) { b.addEventListener('click', function () { zakladka(b.dataset.p); }); });

  /* ---------- plan placu (SVG) ---------- */
  var BLOKI = [];
  ['A', 'B'].forEach(function (r, ri) { for (var i = 1; i <= 6; i++) BLOKI.push({ id: r + i, x: 40 + (i - 1) * 136, y: 112 + ri * 88, w: 120, h: 70, kol: '#c9d7e3', opis: 'Blok kontenerów pełnych, 6 rzędów, do 5 pięter. Obsługa suwnicami placowymi.' }); });
  BLOKI.push({ id: 'R1', x: 40, y: 288, w: 120, h: 70, kol: '#cfe7d8', opis: 'Blok kontenerów chłodzonych z gniazdami zasilania i zdalnym odczytem temperatury.' });
  BLOKI.push({ id: 'R2', x: 176, y: 288, w: 120, h: 70, kol: '#cfe7d8', opis: 'Blok kontenerów chłodzonych z gniazdami zasilania i zdalnym odczytem temperatury.' });
  BLOKI.push({ id: 'E1', x: 312, y: 288, w: 120, h: 70, kol: '#ece3d2', opis: 'Skład kontenerów pustych.' });
  BLOKI.push({ id: 'E2', x: 448, y: 288, w: 120, h: 70, kol: '#ece3d2', opis: 'Skład kontenerów pustych.' });
  BLOKI.push({ id: 'KC', x: 584, y: 288, w: 256, h: 70, kol: '#f3d9a8', nazwa: 'Kontrola celna', opis: 'Strefa kontroli celnej i skanera kontenerów.' });
  BLOKI.push({ id: 'KOL', x: 40, y: 392, w: 584, h: 92, kol: '#e3e8ee', nazwa: 'Terminal kolejowy', opis: 'Tory załadunkowe, formowanie składów do terminali lądowych.' });
  BLOKI.push({ id: 'BR', x: 648, y: 392, w: 192, h: 92, kol: '#e3e8ee', nazwa: 'Brama (OCR)', opis: 'Pasy bramowe z kamerami: odczyt numeru kontenera, plomby i tablicy rejestracyjnej.' });

  function kontWBloku(id) { return Object.keys(K).filter(function (n) { return K[n].blok === id; }); }

  function mapaSVG(zazn, mini) {
    var s = '<svg viewBox="0 0 880 560" role="img" aria-label="Schematyczny plan placu terminalu (poglądowy)" font-family="IBM Plex Sans, sans-serif">';
    s += '<rect x="0" y="0" width="880" height="62" fill="#cfe3ee"/>';
    s += '<text x="16" y="24" font-size="13" fill="#0a4f66">Basen portowy</text>';
    s += '<path d="M60 52 L300 52 L318 40 L300 30 L60 30 Z" fill="#13315c"/><text x="80" y="45" font-size="11" fill="#fff">BALTIC MERIDIAN</text>';
    s += '<rect x="0" y="62" width="880" height="14" fill="#8797a6"/>';
    ['N1', 'N2', 'N3'].forEach(function (n, i) { s += '<text x="' + (330 + i * 190) + '" y="24" font-size="12" fill="#0a4f66">nabrzeże ' + n + '</text>'; });
    for (var c = 0; c < 6; c++) { var cx = 80 + c * 140; s += '<rect x="' + cx + '" y="56" width="26" height="26" fill="none" stroke="#b3261e" stroke-width="2.5"/><line x1="' + (cx + 13) + '" y1="30" x2="' + (cx + 13) + '" y2="82" stroke="#b3261e" stroke-width="2.5"/>'; }
    s += '<text x="16" y="98" font-size="11" fill="#5a6876">suwnice nabrzeżowe STS i droga technologiczna</text>';
    BLOKI.forEach(function (b) {
      var moj = kontWBloku(b.id).length > 0;
      var akt = zazn === b.id;
      var fill = akt ? '#0b6e8f' : (moj && !mini ? '#7fbad0' : b.kol);
      var tc = akt ? '#fff' : '#0b2545';
      s += '<g class="blk" data-b="' + b.id + '" tabindex="' + (mini ? -1 : 0) + '" role="button" aria-label="' + (b.nazwa || 'Blok ' + b.id) + '">';
      s += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" rx="3" fill="' + fill + '" stroke="#9fb0c0"/>';
      if (b.id === 'KOL') { for (var t = 0; t < 3; t++) s += '<line x1="' + (b.x + 10) + '" y1="' + (b.y + 26 + t * 22) + '" x2="' + (b.x + b.w - 10) + '" y2="' + (b.y + 26 + t * 22) + '" stroke="#8797a6" stroke-width="2" stroke-dasharray="6 4"/>'; for (var w = 0; w < 9; w++) s += '<rect x="' + (b.x + 30 + w * 52) + '" y="' + (b.y + 40) + '" width="46" height="12" fill="#13315c" opacity=".75"/>'; }
      if (b.id === 'BR') { for (var p = 0; p < 4; p++) s += '<rect x="' + (b.x + 22 + p * 40) + '" y="' + (b.y + 30) + '" width="22" height="46" fill="#fff" stroke="#9fb0c0"/>'; }
      if (/^[ABRE]\d$/.test(b.id)) { for (var r = 1; r < 6; r++) s += '<line x1="' + (b.x + r * b.w / 6) + '" y1="' + (b.y + 6) + '" x2="' + (b.x + r * b.w / 6) + '" y2="' + (b.y + b.h - 6) + '" stroke="' + (akt ? '#ffffff55' : '#ffffff') + '" stroke-width="1.5"/>'; }
      s += '<text x="' + (b.x + 8) + '" y="' + (b.y + 18) + '" font-size="' + (mini ? 15 : 13) + '" font-weight="600" fill="' + tc + '">' + (b.nazwa || b.id) + '</text>';
      s += '</g>';
    });
    s += '<rect x="0" y="500" width="880" height="60" fill="#dfe5eb"/><text x="16" y="535" font-size="12" fill="#5a6876">droga dojazdowa i parking buforowy dla ciężarówek</text>';
    s += '</svg>';
    return s;
  }

  function rysujMape(zazn) {
    $('#mapa-svg').innerHTML = mapaSVG(zazn, false);
    $$('#mapa-svg .blk').forEach(function (g) {
      var f = function () { rysujMape(g.dataset.b); infoBloku(g.dataset.b); };
      g.addEventListener('click', f);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } });
    });
  }
  function infoBloku(id) {
    var b = BLOKI.filter(function (x) { return x.id === id; })[0];
    var k = kontWBloku(id);
    var h = '<h3>' + esc(b.nazwa || 'Blok ' + b.id) + '</h3><p style="margin:0 0 10px">' + esc(b.opis) + '</p>';
    if (k.length) {
      h += '<p style="margin:0 0 6px;font-weight:600;color:#0b2545">Twoje kontenery:</p>';
      k.forEach(function (n) { h += '<button type="button" class="btn btn-o btn-s num" data-nr="' + n + '" style="margin:0 6px 6px 0">' + ISO6346.formatuj(n) + '</button>'; });
    } else h += '<p class="przypis" style="margin:0">Brak Twoich kontenerów w tym miejscu.</p>';
    $('#mapa-info').innerHTML = h;
    $$('#mapa-info [data-nr]').forEach(function (b) { b.addEventListener('click', function () { otworzKontener(b.dataset.nr); }); });
  }

  /* ---------- sledzenie ---------- */
  var IKON_OK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5 9-10"/></svg>';
  var IKON_BL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var aktualny = null;

  function szukaj(wej) {
    var kom = $('#szuk-kom'), pole = $('#nr'), w = $('#wynik');
    var r = ISO6346.sprawdz(wej);
    if (!r.ok) {
      kom.textContent = r.blad; kom.className = 'komunikat zle'; pole.classList.add('zle'); w.hidden = true; w.innerHTML = '';
      return false;
    }
    pole.classList.remove('zle');
    pole.value = ISO6346.formatuj(r.nr);
    var k = K[r.nr];
    if (!k) {
      kom.className = 'komunikat dobrze';
      kom.textContent = 'Numer ' + ISO6346.formatuj(r.nr) + ' jest poprawny (cyfra kontrolna się zgadza), ale nie ma go w przykładowej bazie. Wybierz jeden z przykładowych numerów.';
      w.hidden = true; w.innerHTML = '';
      return true;
    }
    kom.textContent = ''; kom.className = 'komunikat';
    aktualny = r.nr;
    w.innerHTML = renderWynik(r.nr, k);
    w.hidden = false;
    var bAw = $('#btn-aw'); if (bAw) bAw.addEventListener('click', function () { otworzAwizacje(r.nr); });
    var bPl = $('#btn-plan'); if (bPl) bPl.addEventListener('click', function () { zakladka('mapa'); rysujMape(k.blok); infoBloku(k.blok); });
    $$('#wynik .sw input').forEach(function (i) { i.addEventListener('change', function () { toast(i.checked ? 'Powiadomienie włączone (demo, nic nie zostanie wysłane).' : 'Powiadomienie wyłączone.'); }); });
    return true;
  }

  function renderWynik(nr, k) {
    var h = '<div class="wynik-gora"><div><h2>' + ISO6346.formatuj(nr) + '</h2><div class="typ">' + esc(k.typ) + ' (ISO ' + esc(k.iso) + '), ' + esc(k.opisTyp) + ' · ' + esc(k.kier) + '</div></div><span class="status ' + k.st + '">' + esc(k.status) + '</span></div>';
    h += '<div class="blokady">' + k.blokady.map(function (b) { return '<div class="blokada ' + (b.ok ? 'ok' : 'bl') + '">' + (b.ok ? IKON_OK : IKON_BL) + '<span>' + esc(b.t) + '</span></div>'; }).join('') + '</div>';
    var lok = k.lok ? 'Blok ' + k.lok.blok + ', rząd ' + k.lok.rzad + ', piętro ' + k.lok.pietro : (/Wydany/.test(k.status) ? 'poza terminalem' : (k.eksport ? 'jeszcze poza terminalem' : 'na statku'));
    h += '<dl class="fakty">';
    h += '<div><dt>Lokalizacja w terminalu</dt><dd>' + esc(lok) + '</dd></div>';
    h += '<div><dt>Statek i rejs</dt><dd>' + esc(k.statek) + ' <small>rejs ' + esc(k.rejs) + ', ' + esc(k.armator) + '</small></dd></div>';
    h += '<div><dt>ETA / ETD</dt><dd class="num">' + fmt(k.eta) + '<small>wypłynięcie: ' + fmt(k.etd) + '</small></dd></div>';
    if (k.reefer) h += '<div><dt>Temperatura (reefer)</dt><dd class="num">' + String(k.reefer.akt).replace('.', ',') + ' °C <small>nastawa ' + String(k.reefer.zad.toFixed(1)).replace('.', ',') + ' °C, ' + esc(k.reefer.zas) + ', odczyt sprzed 10 min</small></dd></div>';
    else h += '<div><dt>Waga brutto i plomba</dt><dd class="num">' + esc(k.waga) + '<small>plomba: ' + esc(k.plomba) + '</small></dd></div>';
    if (k.wolneDo) h += '<div><dt>Bezpłatne składowanie do</dt><dd class="num">' + fmt(k.wolneDo) + '</dd></div>';
    if (k.reefer) h += '<div><dt>Waga brutto i plomba</dt><dd class="num">' + esc(k.waga) + '<small>plomba: ' + esc(k.plomba) + '</small></dd></div>';
    h += '</dl>';

    h += '<div class="wynik-dol"><div><h3>Historia zdarzeń</h3><ol class="os">';
    k.os.forEach(function (z) { h += '<li class="' + (z.plan ? 'plan' : 'zrob') + '"><span class="kiedy">' + fmt(z.h) + (z.plan ? ' (planowane)' : '') + '</span><b>' + esc(z.t) + '</b><span class="szcz">' + esc(z.s) + '</span></li>'; });
    h += '</ol></div><div>';

    h += '<div class="boks"><h3>Odbiór kontenera</h3>';
    if (k.awizacja) h += '<p style="margin:0 0 12px">Kontener jest zwolniony. Zamów okno odbioru dla ciężarówki.</p><button class="btn btn-g" type="button" id="btn-aw" style="width:100%">Zamów awizację odbioru</button>';
    else if (k.eksport) h += '<p style="margin:0">Kontener eksportowy: odbiór nie dotyczy. Załadunek na statek planuje terminal.</p>';
    else if (/Wydany/.test(k.status)) h += '<p style="margin:0">Kontener został wydany z terminalu.</p>';
    else h += '<p style="margin:0 0 12px">Awizacja będzie możliwa po zdjęciu blokad.</p><button class="btn btn-o" type="button" disabled style="width:100%;opacity:.55;cursor:not-allowed">Zamów awizację odbioru</button>';
    h += '</div>';

    if (k.lok) h += '<div class="boks mini-mapa"><h3>Miejsce na placu</h3>' + mapaSVG(k.blok, true) + '<p style="margin:10px 0 0"><button class="link" type="button" id="btn-plan" style="background:none;border:0;padding:0;font:inherit;cursor:pointer">Pokaż na planie placu</button></p></div>';

    h += '<div class="boks"><h3>Powiadomienia o tym kontenerze</h3>';
    h += '<label class="przel"><span>E-mail przy każdej zmianie statusu</span><span class="sw"><input type="checkbox" checked aria-label="Powiadomienia e-mail"><span></span></span></label>';
    h += '<label class="przel"><span>SMS, gdy kontener będzie gotowy do odbioru</span><span class="sw"><input type="checkbox" aria-label="Powiadomienia SMS"><span></span></span></label>';
    if (k.reefer) h += '<label class="przel"><span>SMS przy odchyleniu temperatury</span><span class="sw"><input type="checkbox" checked aria-label="Alarm temperatury SMS"><span></span></span></label>';
    h += '</div>';

    h += '<div class="boks awaria"><h3>Pilna sprawa z kontenerem?</h3><p style="margin:0">Dyżur 24/7: <span class="tel">+48 91 000 00 00</span><br><span class="przypis" style="color:#c9d6e3">numer przykładowy</span></p></div>';
    h += '</div></div>';
    return h;
  }

  $('#szuk-form').addEventListener('submit', function (e) { e.preventDefault(); szukaj($('#nr').value); });
  $('#nr').addEventListener('input', function () { $('#nr').classList.remove('zle'); });
  $$('.przyklady button').forEach(function (b) { b.addEventListener('click', function () { $('#nr').value = b.dataset.nr; szukaj(b.dataset.nr); }); });

  function otworzKontener(nr) { zakladka('sledz'); $('#nr').value = nr; szukaj(nr); var t = $('#p-sledz'); if (t) scrollTo({ top: 0, behavior: 'smooth' }); }

  /* ---------- moje kontenery ---------- */
  var tb = $('#tab-moje tbody');
  Object.keys(K).forEach(function (n) {
    var k = K[n];
    var lok = k.lok ? k.lok.blok + ' / ' + k.lok.rzad + ' / ' + k.lok.pietro : '-';
    var tr = document.createElement('tr');
    tr.tabIndex = 0;
    tr.innerHTML = '<td class="nr" data-k="Numer"><span>' + ISO6346.formatuj(n) + '</span></td><td data-k="Typ"><span>' + esc(k.typ) + (k.reefer ? ' (' + String(k.reefer.zad.toFixed(1)).replace('.', ',') + ' °C)' : '') + '</span></td><td data-k="Kierunek"><span>' + esc(k.kier) + '</span></td><td data-k="Statek"><span>' + esc(k.statek) + '</span></td><td data-k="Status"><span class="status ' + k.st + '">' + esc(k.status) + '</span></td><td data-k="Blok / rząd / piętro"><span>' + lok + '</span></td>';
    tr.addEventListener('click', function () { otworzKontener(n); });
    tr.addEventListener('keydown', function (e) { if (e.key === 'Enter') otworzKontener(n); });
    tb.appendChild(tr);
  });

  /* ---------- statki ---------- */
  var ts = $('#tab-statki tbody');
  STATKI.forEach(function (s) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td data-k="Statek"><b style="color:#0b2545">' + s.nazwa + '</b></td><td data-k="Rejs"><span>' + s.rejs + '</span></td><td data-k="Nabrzeże"><span>' + s.nab + '</span></td><td data-k="ETA" class="num"><span>' + fmt(s.eta) + '</span></td><td data-k="ETD" class="num"><span>' + fmt(s.etd) + '</span></td><td data-k="Zamknięcie przyjęć" class="num"><span>' + (s.cut < 0 ? 'zamknięte' : fmt(s.cut)) + '</span></td><td data-k="Status"><span class="status ' + s.st + '">' + s.status + '</span></td>';
    ts.appendChild(tr);
  });

  /* ---------- powiadomienia ---------- */
  var ZDARZ = [['Przypłynięcie statku z moim kontenerem', 1, 0], ['Rozładunek ze statku', 1, 0], ['Zwolnienie lub blokada celna', 1, 1], ['Kontener gotowy do odbioru', 1, 1], ['Odchylenie temperatury kontenera chłodzonego', 1, 1], ['Zmiana ETA statku o ponad 2 godziny', 1, 0]];
  var pl = '<h3>Zdarzenia</h3><div style="display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:6px 14px;align-items:center;font-size:.95rem"><span></span><span class="przypis">e-mail</span><span class="przypis">SMS</span>';
  ZDARZ.forEach(function (z, i) { pl += '<span>' + z[0] + '</span><span class="sw"><input type="checkbox"' + (z[1] ? ' checked' : '') + ' aria-label="' + z[0] + ' e-mail"><span></span></span><span class="sw"><input type="checkbox"' + (z[2] ? ' checked' : '') + ' aria-label="' + z[0] + ' SMS"><span></span></span>'; });
  pl += '</div>';
  $('#pw-lista').innerHTML = pl;
  $('#pw-zapisz').addEventListener('click', function () { toast('Ustawienia zapisane w wersji demo. Żadna wiadomość nie zostanie wysłana.'); });

  /* ---------- zgloszenie pilne ---------- */
  $('#zgl-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var kom = $('#zgl-kom'), nr = $('#zgl-nr').value.trim();
    if (nr) { var r = ISO6346.sprawdz(nr); if (!r.ok) { kom.textContent = r.blad; kom.className = 'komunikat zle'; return; } }
    if ($('#zgl-opis').value.trim().length < 5) { kom.textContent = 'Opisz krótko, co się stało.'; kom.className = 'komunikat zle'; return; }
    kom.textContent = 'Wersja demo: zgłoszenie nie zostało wysłane. W systemie docelowym trafi do dyżurnego, a numer sprawy przyjdzie e-mailem i SMS.'; kom.className = 'komunikat dobrze';
  });

  /* ---------- awizacja ---------- */
  var okno = $('#okno-aw');
  function otworzAwizacje(nr) {
    $('#aw-kont').textContent = 'Kontener ' + ISO6346.formatuj(nr) + ', blok ' + K[nr].lok.blok + '. Wersja demo: zamówienie nie zostanie wysłane.';
    var sel = $('#aw-dzien'); sel.innerHTML = '';
    for (var i = 0; i < 3; i++) { var d = czas(24 * i); var o = document.createElement('option'); o.textContent = (i === 0 ? 'dziś, ' : i === 1 ? 'jutro, ' : '') + DNI[d.getDay()] + ' ' + dd(d.getDate()) + '.' + dd(d.getMonth() + 1); sel.appendChild(o); }
    $('#aw-potw').innerHTML = ''; $('#aw-kom').textContent = ''; $('#aw-wyslij').hidden = false;
    okno.hidden = false; $('#aw-rej').focus();
  }
  function zamknij() { okno.hidden = true; var b = $('#btn-aw'); if (b) b.focus(); }
  $('#aw-zamknij').addEventListener('click', zamknij);
  okno.addEventListener('click', function (e) { if (e.target === okno) zamknij(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !okno.hidden) zamknij(); });
  $('#aw-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var rej = $('#aw-rej').value.trim(), kier = $('#aw-kier').value.trim(), kom = $('#aw-kom');
    if (rej.length < 4 || kier.length < 3) { kom.textContent = 'Podaj numer rejestracyjny ciągnika i kierowcę.'; kom.className = 'komunikat zle'; return; }
    kom.textContent = '';
    var num = 'AW-' + String(TERAZ.getFullYear()).slice(2) + dd(TERAZ.getMonth() + 1) + '-' + (1000 + Math.floor(Math.random() * 9000));
    $('#aw-potw').innerHTML = '<div class="potw"><b>Awizacja przyjęta (demo): ' + num + '</b><br>' + esc($('#aw-dzien').value) + ', ' + esc($('#aw-okno').value) + ', pojazd ' + esc(rej.toUpperCase()) + '. Na bramie kamery odczytają tablicę i numer kontenera, a system porówna je z tą awizacją.</div>';
    $('#aw-wyslij').hidden = true;
  });

  /* ---------- toast ---------- */
  var tId;
  function toast(t) { var el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(tId); tId = setTimeout(function () { el.hidden = true; }, 2800); }

  /* ---------- start ---------- */
  rysujMape(null);
  if (czytaj('stt_demo') === '1') pokazPortal(); else pokazLogowanie();
})();
