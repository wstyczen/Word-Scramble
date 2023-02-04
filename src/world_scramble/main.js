import { Timer } from "./timer.js";
import { TextBox } from "./text_box.js";

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

set_letters(letters);
let timer = new Timer(10);
let text_box = new TextBox(
  letters,
  entered_words,
  timer.flash_warning.bind(timer)
);
timer.set_on_timer_finished_cb(text_box.lock_text_box.bind(text_box));
