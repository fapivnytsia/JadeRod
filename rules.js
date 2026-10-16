// The jade rod rules, shared by the server and the page: one file, copied as is next to the page.
// No outside code here: plain numbers and functions, so it runs on the game server and in a browser alike.

export const STROKES_PER_COIN = 10; // strokes in tempo for one coin (times the shop multiplier)
export const TEMPO_MIN = 1.5;       // strokes per second needed for coins to drip
export const TEMPO_MAX = 7;         // faster than this looks like a macro and is not counted
export const DRAIN_BASE = 0.7;      // seconds per bead lost while out of tempo

// When the page sends: every SYNC_COINS new coins, when it closes, and, if strokes wait, at least every
// SYNC_IDLE_SEC, so the server does not take a slow player for gone (it closes a session after IDLE_SEC without news)
export const SYNC_COINS = 10;
export const SYNC_IDLE_SEC = 300;
export const IDLE_SEC = 600;

// What the server accepts: from the start of a session strokes and full bead rows add up at these rates,
// whatever comes is taken from that, so a macro gets no more than a hand in tempo could rub in the same time.
// What was not used is kept for up to ROOM_MAX_SEC worth.
export const STROKES_PER_SEC = 10;                              // strokes of any tempo
export const FILLS_PER_SEC = TEMPO_MAX / STROKES_PER_COIN;      // full bead rows, one row = one coin before the multiplier
export const ROOM_MAX_SEC = 3600;

// The shop. lv is { silk, oil, emp, goldCloth, whiteJade }: how many of each are bought.
// cost of the next one = base * k^level, max is the most one can buy.
export const ITEMS = [
  { id: "silk", base: 150, k: 2.2, max: 5 },        // +10% coins per level
  { id: "oil", base: 120, k: 2.6, max: 3 },         // tempo floor -0.2, beads burn slower
  { id: "emp", base: 1500, k: 3, max: 3 },          // +25% coins per seal
  { id: "goldCloth", base: 400, k: 1, max: 1 },     // looks only
  { id: "whiteJade", base: 1000, k: 1, max: 1 },    // looks only
];

export const freshLevels = () => Object.fromEntries(ITEMS.map(it => [it.id, 0]));

// Levels from anything: missing or broken ones are 0, too high ones are capped
export function levels(raw) {
  const lv = freshLevels();
  for (const it of ITEMS) {
    const n = Math.floor(Number(raw?.[it.id]) || 0);
    lv[it.id] = Math.max(0, Math.min(it.max, n));
  }
  return lv;
}

export const mult = lv => (1 + 0.1 * lv.silk) * (1 + 0.25 * lv.emp);
export const tempoMin = lv => TEMPO_MIN - 0.2 * lv.oil;
export const drainSec = lv => DRAIN_BASE * (1 + 0.6 * lv.oil);
export const cost = (it, lv) => Math.round(it.base * Math.pow(it.k, lv[it.id]));
export const maxed = (it, lv) => lv[it.id] >= it.max;

export const STAGES = ["Двор храма", "Внутренний двор", "Путь ци", "Горная обитель", "Нефритовый орден", "Столица", "Небесные пути", "Пять стихий", "Легенда", "Вершина"];

// [strokes in all to reach it, name, stage 1-10]. The rank number is the place in this list, from 1.
export const RANKS = [
  [0, "Новичок с тряпочкой", 1],
  [50, "Послушник", 1],
  [190, "Подметальщик храма", 1],
  [430, "Носитель платка", 1],
  [750, "Младший полировщик", 1],
  [1150, "Ученик", 1],
  [1650, "Старательный ученик", 1],
  [2200, "Ученик с мозолями", 1],
  [2900, "Подмастерье", 2],
  [3650, "Хранитель масла", 2],
  [4450, "Знаток бусин", 2],
  [5350, "Полировщик второго круга", 2],
  [6350, "Страж нефритовой кладовой", 2],
  [7450, "Мастер утреннего мазка", 2],
  [8600, "Мастер вечернего мазка", 2],
  [9850, "Мастер", 2],
  [11000, "Пробудивший ци", 3],
  [12500, "Ведающий ритм", 3],
  [14000, "Ровный, как река", 3],
  [15500, "Бесшумная ладонь", 3],
  [17000, "Шёлковая рука", 3],
  [19000, "Неутомимое запястье", 3],
  [20500, "Наставник", 3],
  [22500, "Старший наставник", 3],
  [24500, "Отшельник бамбуковой рощи", 4],
  [26500, "Странник туманных гор", 4],
  [28500, "Хранитель горного источника", 4],
  [31000, "Полировщик лунного света", 4],
  [33000, "Мастер журавлиного шага", 4],
  [35500, "Мастер тигриной хватки", 4],
  [38000, "Мастер змеиного изгиба", 4],
  [40500, "Мудрец", 4],
  [43000, "Посвящённый ордена", 5],
  [45500, "Брат зелёного камня", 5],
  [48500, "Страж белого нефрита", 5],
  [51500, "Хранитель печати", 5],
  [54000, "Знаток девяти мазков", 5],
  [57000, "Мастер тысячи мазков", 5],
  [60000, "Мастер десяти тысяч мазков", 5],
  [63500, "Старейшина ордена", 5],
  [66500, "Придворный полировщик", 6],
  [70000, "Советник по блеску", 6],
  [73000, "Смотритель императорской кладовой", 6],
  [76500, "Министр нефритовых дел", 6],
  [80000, "Великий казначей", 6],
  [83500, "Хранитель золотого платка", 6],
  [87500, "Правая рука императора", 6],
  [91000, "Канцлер ци", 6],
  [95000, "Ступивший на облако", 7],
  [99000, "Оседлавший ветер", 7],
  [103000, "Собеседник журавлей", 7],
  [107000, "Друг дракона", 7],
  [111000, "Ученик Небесного мастера", 7],
  [115000, "Носитель грозовой ци", 7],
  [119000, "Полирующий звёзды", 7],
  [124000, "Бессмертный", 7],
  [128000, "Повелитель Дерева", 8],
  [133000, "Повелитель Огня", 8],
  [137000, "Повелитель Земли", 8],
  [142000, "Повелитель Металла", 8],
  [147000, "Повелитель Воды", 8],
  [151000, "Владыка пяти стихий", 8],
  [156000, "Небесный полировщик", 8],
  [161000, "Нефритовый бессмертный", 8],
  [166000, "Тот, о ком шепчут в чайных", 9],
  [171000, "Герой свитков", 9],
  [177000, "Легенда девяти провинций", 9],
  [182000, "Тень, натирающая во тьме", 9],
  [187000, "Рука, не знающая усталости", 9],
  [193000, "Сияющий стержень", 9],
  [198000, "Мастер без пределов", 9],
  [204000, "Великий мудрец", 9],
  [209000, "Нефритовый князь", 10],
  [215000, "Нефритовый ван", 10],
  [221000, "Сын Неба", 10],
  [227000, "Нефритовый император", 10],
  [233000, "Император десяти тысяч лет", 10],
  [239000, "Вечное сияние", 10],
  [245000, "Сам Нефрит", 10],
  [251000, "Тот, кто натёр всё", 10]
];

// Index in RANKS for this many strokes in all
export function rankIdx(strokes) {
  let r = 0;
  RANKS.forEach((x, i) => { if (strokes >= x[0]) r = i; });
  return r;
}

// The rank number 1-80, as kept in the database
export const rankNo = strokes => rankIdx(strokes) + 1;
