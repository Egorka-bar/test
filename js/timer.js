document.addEventListener('DOMContentLoaded', function() {
  // Упрощённый FlipDown (только светлая тема, русские подписи)
  (function() {
    class FlipDown {
      constructor(uts, el = "flipdown", opt = {}) {
        if (typeof uts !== "number") throw new Error("FlipDown: ожидается timestamp");
        if (typeof el === "object") { opt = el; el = "flipdown"; }
        
        this.epoch = uts;
        this.element = document.getElementById(el);
        this.rotors = [];
        this.rotorLeafFront = [];
        this.rotorLeafRear = [];
        this.rotorTop = [];
        this.rotorBottom = [];
        this.clockValues = {};
        this.clockStrings = {};
        this.clockValuesAsString = [];
        this.prevClockValuesAsString = [];
        this.initialised = false;
        this.countdown = null;
        this.hasEndedCallback = null;
        
        this.opts = {
          theme: opt.theme || "light",
          headings: opt.headings || ["Дней", "Часов", "Минут", "Секунд"]
        };
        
        this.element.classList.add(`flipdown__theme-${this.opts.theme}`);
      }
      
      start() {
        if (!this.initialised) this._init();
        this.countdown = setInterval(() => this._tick(), 1000);
        return this;
      }
      
      ifEnded(cb) {
        this.hasEndedCallback = cb;
        return this;
      }
      
      _getTime() { return new Date().getTime() / 1000; }
      
      _init() {
        this.initialised = true;
        this.now = this._getTime();
        const diff = Math.max(0, this.epoch - this.now);
        const dayCount = Math.floor(diff / 86400);
        // Определяем сколько цифр в количестве дней
        const dayDigits = String(dayCount).length;
        // Минимум 2 цифры для дней (если меньше 10, то добавляем ведущий ноль)
        this.daysRemaining = Math.max(2, dayDigits);
        // Всего роторов: дни (2 или 3) + 6 (часы, минуты, секунды)
        const rotorCount = this.daysRemaining + 6;
        
        for (let i = 0; i < rotorCount; i++) {
          this.rotors.push(this._createRotor(0));
        }
        
        let idx = 0;
        // Группа дней
        const dayRotors = this.rotors.slice(0, this.daysRemaining);
        this.element.appendChild(this._createGroup(dayRotors, 0));
        idx += this.daysRemaining;
        
        // Остальные группы: часы, минуты, секунды - по 2 ротора
        for (let g = 1; g <= 3; g++) {
          const group = this.rotors.slice(idx, idx + 2);
          this.element.appendChild(this._createGroup(group, g));
          idx += 2;
        }
        
        this.rotorLeafFront = [...this.element.getElementsByClassName("rotor-leaf-front")];
        this.rotorLeafRear = [...this.element.getElementsByClassName("rotor-leaf-rear")];
        this.rotorTop = [...this.element.getElementsByClassName("rotor-top")];
        this.rotorBottom = [...this.element.getElementsByClassName("rotor-bottom")];
        
        this._tick();
        this._updateClockValues(true);
        return this;
      }
      
      _createGroup(rotors, index) {
        const group = document.createElement("div");
        group.className = "rotor-group";
        const heading = document.createElement("div");
        heading.className = "rotor-group-heading";
        heading.setAttribute("data-before", this.opts.headings[index]);
        group.appendChild(heading);
        rotors.forEach(r => group.appendChild(r));
        return group;
      }
      
      _createRotor(v = 0) {
        const rotor = document.createElement("div");
        rotor.className = "rotor";
        const leaf = document.createElement("div");
        leaf.className = "rotor-leaf";
        const rear = document.createElement("figure");
        rear.className = "rotor-leaf-rear";
        rear.textContent = v;
        const front = document.createElement("figure");
        front.className = "rotor-leaf-front";
        const top = document.createElement("div");
        top.className = "rotor-top";
        top.textContent = v;
        const bottom = document.createElement("div");
        bottom.className = "rotor-bottom";
        bottom.textContent = v;
        
        leaf.append(rear, front);
        rotor.append(leaf, top, bottom);
        return rotor;
      }
      
      _tick() {
        this.now = this._getTime();
        let diff = Math.max(0, this.epoch - this.now);
        this.clockValues.d = Math.floor(diff / 86400);
        diff -= this.clockValues.d * 86400;
        this.clockValues.h = Math.floor(diff / 3600);
        diff -= this.clockValues.h * 3600;
        this.clockValues.m = Math.floor(diff / 60);
        diff -= this.clockValues.m * 60;
        this.clockValues.s = Math.floor(diff);
        this._updateClockValues();
        if (this.epoch - this.now < 0 && this.hasEndedCallback) {
          this.hasEndedCallback();
          this.hasEndedCallback = null;
        }
      }
      
      _updateClockValues(init = false) {
        const pad = (n) => String(n).padStart(2, '0');
        // Дни — без паддинга, чтобы отображалось точное количество
        this.clockStrings.d = String(this.clockValues.d);
        this.clockStrings.h = pad(this.clockValues.h);
        this.clockStrings.m = pad(this.clockValues.m);
        this.clockStrings.s = pad(this.clockValues.s);
        
        // Собираем все цифры в один массив
        this.clockValuesAsString = (this.clockStrings.d + this.clockStrings.h + this.clockStrings.m + this.clockStrings.s).split('');
        
        this.rotorLeafFront.forEach((el, i) => el.textContent = this.prevClockValuesAsString[i] || '0');
        this.rotorBottom.forEach((el, i) => el.textContent = this.prevClockValuesAsString[i] || '0');
        
        const flipTop = () => {
          this.rotorTop.forEach((el, i) => {
            if (el.textContent !== this.clockValuesAsString[i]) {
              el.textContent = this.clockValuesAsString[i];
            }
          });
        };
        
        const flipRear = () => {
          this.rotorLeafRear.forEach((el, i) => {
            if (el.textContent !== this.clockValuesAsString[i]) {
              el.textContent = this.clockValuesAsString[i];
              el.parentElement.classList.add("flipped");
              setTimeout(() => {
                el.parentElement.classList.remove("flipped");
              }, 500);
            }
          });
        };
        
        if (init) {
          flipTop();
          flipRear();
        } else {
          setTimeout(flipTop, 500);
          setTimeout(flipRear, 500);
        }
        
        this.prevClockValuesAsString = [...this.clockValuesAsString];
      }
    }
    
    window.FlipDown = FlipDown;
  })();

  // ===== ЗАПУСК ТАЙМЕРА НА 7 НОЯБРЯ 2026 ГОДА =====
  const targetDate = new Date('2026-11-07T00:00:00').getTime() / 1000;
  
  new FlipDown(targetDate, 'flipdown', { 
    theme: 'light',
    headings: ["Дней", "Часов", "Минут", "Секунд"]
  })
    .start()
    .ifEnded(() => {
      console.log('🎉 С днём свадьбы, Матвей и Елена! 🎉');
      const timerLabel = document.querySelector('.cal-timer-label');
      if (timerLabel) {
        timerLabel.textContent = '🎉 Сегодня наш день! 🎉';
        timerLabel.style.color = '#C9A84C';
        timerLabel.style.fontSize = '1.6rem';
      }
    });
});