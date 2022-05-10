import keyset from './keyset';

class Keyboard {
  constructor(keyboard, textarea) {
    this.keyboard = keyboard;
    this.textarea = textarea;
    this.lang = localStorage.getItem('lang') === 'en' ? 'en' : 'ru';
    this.keyboardRows = [];
    this.isUpperRegister = false;
    this.isDown = false;
    this.isShiftDown = false;
    this.isCaps = false;
  }

  renderKeyboard() {
    for (let i = 0; i < keyset.length; i += 1) {
      const keyboardRow = document.createElement('div');
      keyboardRow.classList.add('keyboard__row');
      this.keyboard.append(keyboardRow);
      this.keyboardRows.push([]);
      const keyboardRowKeys = Object.keys(keyset[i]);
      let count = 0;

      keyboardRowKeys.forEach((key) => {
        const keyboardButton = document.createElement('button');
        keyboardButton.classList.add('keyboard__key');
        keyboardButton.dataset.code = keyboardRowKeys[count];
        keyboardButton.innerHTML = keyset[i][key][this.lang].lower;
        keyboardRow.append(keyboardButton);
        this.keyboardRows[i].push(keyboardButton);
        count += 1;
      });
    }
  }

  pasteSymbol(text, keyCode) {
    if (keyCode === 'Backspace') {
      if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
        this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd);
      } else if (this.textarea.selectionStart === 0) {
        this.textarea.setRangeText('');
      } else {
        this.textarea.setRangeText('', (this.textarea.selectionStart - 1), this.textarea.selectionEnd);
      }
    } else if (keyCode === 'Delete') {
      if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
        this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd);
      } else {
        this.textarea.setRangeText('', this.textarea.selectionStart, (this.textarea.selectionEnd + 1));
      }
    } else {
      this.textarea.setRangeText(text);
      this.textarea.selectionStart += text.length;
      this.textarea.selectionEnd = this.textarea.selectionStart;
    }
  }

  switchRegister(key) {
    let needRegister;
    if (this.isUpperRegister) {
      needRegister = 'lower';
      this.isUpperRegister = false;
    } else {
      needRegister = 'upper';
      this.isUpperRegister = true;
    }
    this.keyboardRows.forEach((row, i) => {
      row.forEach((button) => {
        const currentButton = button;
        const extraRuLetters = ['Comma', 'Period', 'Semicolon', 'Quote', 'BracketLeft', 'BracketRight', 'Backquote'];
        if ((this.lang === 'en' && button.dataset.code.indexOf('Key') !== -1) || (this.lang === 'ru' && (button.dataset.code.indexOf('Key') !== -1 || extraRuLetters.includes(button.dataset.code)))) {
          currentButton.innerHTML = keyset[i][button.dataset.code][this.lang][needRegister];
        } else if (key === 'ShiftLeft' || key === 'ShiftRight') {
          if (this.isShiftDown) {
            currentButton.innerHTML = keyset[i][button.dataset.code][this.lang].upper;
          } else {
            currentButton.innerHTML = keyset[i][button.dataset.code][this.lang].lower;
          }
        }
      });
    });
  }

  setHandlers() {
    document.addEventListener('keydown', (ev) => {
      const keyboardButton = document.querySelector(`[data-code="${ev.code}"]`);
      if (keyboardButton) {
        keyboardButton.classList.add('keyboard__key--pressed');
        ev.preventDefault();
        if (ev.code === 'Backspace') {
          this.pasteSymbol('', ev.code);
        } else if (ev.code === 'Tab') {
          this.pasteSymbol('    ');
        } else if (ev.code === 'Delete') {
          this.pasteSymbol('', ev.code);
        } else if (ev.code === 'CapsLock') {
          this.switchRegister(ev.code);
        } else if (ev.code === 'Enter') {
          this.pasteSymbol('\n');
        } else if (ev.code === 'ShiftLeft' || ev.code === 'ShiftRight') {
          if (this.isShiftDown) return;
          this.isShiftDown = true;
          this.switchRegister(ev.code);
        } else if (ev.shiftKey && ev.altKey) {
          this.lang = this.lang === 'en' ? 'ru' : 'en';
          localStorage.setItem('lang', this.lang);
          let register;
          if (this.isUpperRegister) {
            register = 'upper';
          } else {
            register = 'lower';
          }
          this.keyboardRows.forEach((row, i) => {
            row.forEach((button) => {
              const currentButton = button;
              currentButton.innerHTML = keyset[i][button.dataset.code][this.lang][register];
            });
          });
        } else if (ev.code !== 'ControlLeft' && ev.code !== 'ControlRight' && ev.code !== 'AltRight' && ev.code !== 'AltLeft' && ev.code !== 'MetaLeft') {
          this.pasteSymbol(keyboardButton.textContent);
        }
      }
    });

    document.addEventListener('keyup', (ev) => {
      const keyboardButton = document.querySelector(`[data-code="${ev.code}"]`);
      if (keyboardButton) {
        if (ev.code !== 'CapsLock') {
          keyboardButton.classList.remove('keyboard__key--pressed');
        } else if (this.isCaps) {
          keyboardButton.classList.remove('keyboard__key--pressed');
          this.isCaps = false;
        } else {
          this.isCaps = true;
        }
        if (ev.code === 'ShiftLeft' || ev.code === 'ShiftRight') {
          this.isShiftDown = false;
          this.switchRegister(ev.code);
        }
      }
    });

    this.keyboard.addEventListener('mousedown', (ev) => {
      const keyDownEvent = new KeyboardEvent('keydown', {
        code: ev.target.dataset.code,
      });
      document.dispatchEvent(keyDownEvent);
      this.isDown = true;
    });

    this.keyboard.addEventListener('mouseup', (ev) => {
      const keyUpEvent = new KeyboardEvent('keyup', {
        code: ev.target.dataset.code,
      });
      document.dispatchEvent(keyUpEvent);
      this.isDown = false;
    });

    this.keyboard.addEventListener('mouseout', (ev) => {
      if (this.isDown) {
        const keyUpEvent = new KeyboardEvent('keyup', {
          code: ev.target.dataset.code,
        });
        document.dispatchEvent(keyUpEvent);
      }
    });
  }
}

export default Keyboard;
