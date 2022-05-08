
import keyset from "./keyset.js";

class Keyboard {
  constructor(keyboard, textarea) {
    this.keyboard = keyboard;
    this.textarea = textarea;
  }

  renderKeyboard() {
    for (let i = 0; i < keyset.length; i++) {
      let keyboardRow = document.createElement("div");
      keyboardRow.classList.add("keyboard__row");
      this.keyboard.append(keyboardRow);
      let keyboardRowKeys = Object.keys(keyset[i]);
      let count = 0;

      for (let key in keyset[i]) {
        let keyboardButton = document.createElement("button");
        keyboardButton.classList.add("keyboard__key");
        keyboardButton.dataset.code = keyboardRowKeys[count];
        keyboardButton.innerHTML = keyset[i][key]["en"]["lower"];
        keyboardRow.append(keyboardButton);
        count++;
      }
    }    
  }

  pasteSymbol(text) {
    this.textarea.value += text;
  }

  setHandlers() {
    document.addEventListener("keydown", (ev) => {
      const keyboardButton = document.querySelector(`[data-code="${ev.code}"]`);
      if (keyboardButton) {
        keyboardButton.classList.add("keyboard__key--pressed");
        ev.preventDefault();
        if (ev.code === "Tab") {
          this.pasteSymbol("    ");
        } else if (ev.code === "Enter") {
          this.pasteSymbol("\n");
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