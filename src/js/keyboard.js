
import keyset from "./keyset.js";

class Keyboard {
  constructor(keyboard, textarea) {
    this.keyboard = keyboard;
    this.textarea = textarea;
    this.keyboardRows = [];
    this.isUpperRegister = false;
    this.isShiftDown = false;
    this.isCaps = false;
  }

  renderKeyboard() {
    for (let i = 0; i < keyset.length; i++) {
      let keyboardRow = document.createElement("div");
      keyboardRow.classList.add("keyboard__row");
      this.keyboard.append(keyboardRow);
      this.keyboardRows.push([]);
      let keyboardRowKeys = Object.keys(keyset[i]);
      let count = 0;

      for (let key in keyset[i]) {
        let keyboardButton = document.createElement("button");
        keyboardButton.classList.add("keyboard__key");
        keyboardButton.dataset.code = keyboardRowKeys[count];
        keyboardButton.innerHTML = keyset[i][key]["en"]["lower"];
        keyboardRow.append(keyboardButton);
        this.keyboardRows[i].push(keyboardButton);
        count++;
      }
    }
  }

  pasteSymbol(text, keyCode) {
    if (keyCode === "Backspace") {
      if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
        this.textarea.setRangeText("", this.textarea.selectionStart, this.textarea.selectionEnd);
      } else {
        if (this.textarea.selectionStart === 0) {
          this.textarea.setRangeText("");
        } else {
          this.textarea.setRangeText("", (this.textarea.selectionStart - 1), this.textarea.selectionEnd);
        }
      }
    } else if (keyCode === "Delete") {
      if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
        this.textarea.setRangeText("", this.textarea.selectionStart, this.textarea.selectionEnd);
      } else {
        this.textarea.setRangeText("", this.textarea.selectionStart, (this.textarea.selectionEnd + 1));
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
      needRegister = "lower";
      this.isUpperRegister = false;
    } else {
      needRegister = "upper";
      this.isUpperRegister = true;
    }
    this.keyboardRows.map((row, i) => {
      row.map((button) => {
        if (button.dataset.code.indexOf("Key") !== -1) {
          button.innerHTML = keyset[i][button.dataset.code]["en"][needRegister];
        } else {
          if (key === "ShiftLeft" || key === "ShiftRight") {
            if (this.isShiftDown) {
              button.innerHTML = keyset[i][button.dataset.code]["en"]["upper"];
            } else {
              button.innerHTML = keyset[i][button.dataset.code]["en"]["lower"];
            }
          }
        }
      })
    })
  }

  setHandlers() {
    document.addEventListener("keydown", (ev) => {
      const keyboardButton = document.querySelector(`[data-code="${ev.code}"]`);
      if (keyboardButton) {
        keyboardButton.classList.add("keyboard__key--pressed");
        ev.preventDefault();
        if (ev.code === "Backspace") {
          this.pasteSymbol("", ev.code);
        } else if (ev.code === "Tab") {
          this.pasteSymbol("    ");
        } else if (ev.code === "Delete") {
          this.pasteSymbol("", ev.code);
        } else if (ev.code === "CapsLock") {
          this.switchRegister(ev.code);
        } else if (ev.code === "Enter") {
          this.pasteSymbol("\n");
        } else if (ev.code === "ShiftLeft" || ev.code === "ShiftRight") {
          if (this.isShiftDown) return;
          this.isShiftDown = true;
          this.switchRegister(ev.code);
        } else {
          this.pasteSymbol(keyboardButton.textContent);
        }
      }
    })

    document.addEventListener("keyup", (ev) => {
      const keyboardButton = document.querySelector(`[data-code="${ev.code}"]`);
      if (keyboardButton) {
        if (ev.code !== 'CapsLock') {
          keyboardButton.classList.remove("keyboard__key--pressed");
        } else {
          if (this.isCaps) {
            keyboardButton.classList.remove("keyboard__key--pressed");
          }
          this.isCaps ? this.isCaps = false : this.isCaps = true;
        }
        if (ev.code === "ShiftLeft" || ev.code === "ShiftRight") {
          this.isShiftDown = false;
          this.switchRegister(ev.code);
        }
      }
    });

    this.keyboard.addEventListener("mousedown", (ev) => {
      const keyDownEvent = new KeyboardEvent("keydown", {
        code: ev.target.dataset.code,
      });
      document.dispatchEvent(keyDownEvent);
    });

    this.keyboard.addEventListener("mouseup", (ev) => {
      const keyUpEvent = new KeyboardEvent("keyup", { 
        code: ev.target.dataset.code,
      });
      document.dispatchEvent(keyUpEvent);
    });
  }
}

export default Keyboard;