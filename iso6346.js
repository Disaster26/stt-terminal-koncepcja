/* Walidacja numeru kontenera wg ISO 6346:
   3 litery kodu wlasciciela + litera kategorii (U, J lub Z) + 6 cyfr numeru seryjnego + cyfra kontrolna.
   Cyfra kontrolna: litery maja wartosci 10..38 z pominieciem wielokrotnosci 11 (11, 22, 33),
   kazdy z 10 znakow mnozony przez 2^pozycja (0..9), suma mod 11, wynik 10 zapisuje sie jako 0. */
(function (g) {
  var WART = {};
  var v = 10;
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (c) {
    if (v % 11 === 0) v++;
    WART[c] = v++;
  });

  function normalizuj(s) {
    return String(s || '').toUpperCase().replace(/[\s\-\.\/]/g, '');
  }

  function cyfraKontrolna(dziesiec) {
    var suma = 0;
    for (var i = 0; i < 10; i++) {
      var c = dziesiec.charAt(i);
      var w = /[A-Z]/.test(c) ? WART[c] : parseInt(c, 10);
      suma += w * Math.pow(2, i);
    }
    return (suma % 11) % 10;
  }

  function sprawdz(wejscie) {
    var s = normalizuj(wejscie);
    if (!s) return { ok: false, blad: 'Wpisz numer kontenera.' };
    if (s.length !== 11) return { ok: false, nr: s, blad: 'Numer kontenera ma 11 znaków: 4 litery i 7 cyfr (wpisano ' + s.length + ').' };
    if (!/^[A-Z]{4}/.test(s)) return { ok: false, nr: s, blad: 'Pierwsze 4 znaki to litery: kod właściciela i kategoria (np. STTU).' };
    if (!/^[A-Z]{3}[UJZ]/.test(s)) return { ok: false, nr: s, blad: 'Czwarta litera to kategoria: U (kontener), J (wyposażenie odłączalne) lub Z (podwozie, naczepa).' };
    if (!/^[A-Z]{4}\d{7}$/.test(s)) return { ok: false, nr: s, blad: 'Po literach powinno być 7 cyfr: 6 cyfr numeru i cyfra kontrolna.' };
    var oczek = cyfraKontrolna(s.slice(0, 10));
    var podana = parseInt(s.charAt(10), 10);
    if (oczek !== podana) return { ok: false, nr: s, blad: 'Niepoprawna cyfra kontrolna. Dla ' + s.slice(0, 10) + ' powinna wynosić ' + oczek + ', a wpisano ' + podana + '. Sprawdź, czy numer jest przepisany bez pomyłki.' };
    return { ok: true, nr: s };
  }

  function formatuj(s) {
    s = normalizuj(s);
    return s.length === 11 ? s.slice(0, 4) + ' ' + s.slice(4, 10) + ' ' + s.slice(10) : s;
  }

  g.ISO6346 = { sprawdz: sprawdz, cyfraKontrolna: cyfraKontrolna, formatuj: formatuj, normalizuj: normalizuj };
})(window);
