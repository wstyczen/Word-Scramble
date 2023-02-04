import { Timer } from "./timer.js";
import { TextBox } from "./text_box.js";

let timer = new Timer(10, on_time_limit_reached.bind(this));

function set_letters(text) {
  document.getElementById("letters").innerHTML = text;
}

function on_time_limit_reached() {
  return;
}

function scramble(word) {
  return [...word].sort(() => Math.random() - 0.5).join("");
}

let entered_words = [];
let word = "PLAYMAKER";
let letters = scramble(word);
let text_box = new TextBox(
  letters,
  entered_words,
  timer.flash_warning.bind(timer)
);

set_letters(letters);
