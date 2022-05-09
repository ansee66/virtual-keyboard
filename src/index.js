import './style.css';
import Keyboard from './js/keyboard.js';

const main = document.createElement('main');
const container = document.createElement('div');
const title = document.createElement('h1');
const textarea = document.createElement('textarea');
const keyboardWrapper = document.createElement('div');
const info = document.createElement('div');

container.classList.add('container');
textarea.classList.add('textarea');
keyboardWrapper.classList.add('keyboard');
info.classList.add('info');

document.body.prepend(main);
main.append(container);
container.append(title, textarea, keyboardWrapper, info);

title.textContent = 'Виртуальная клавиатура';
info.innerHTML = '<p>Клавиатура создана в ОС Windows.</p><p>Комбинация для переключения языка: левыe shift + alt.</p>';

const keyboard = new Keyboard(keyboardWrapper, textarea);
keyboard.renderKeyboard();
keyboard.setHandlers();

textarea.focus();
textarea.addEventListener('blur', () => textarea.focus());
