import { Timer } from "./timer.js";
import { TextBox } from "./text_box.js";
import { clear_all_words_from_display } from "./utility.js";

function set_letters(text) {
  document.getElementById("letters").innerHTML = text;
}

function on_time_limit_reached(cb) {
  cb();
  let restart_button = document.getElementById("restart_button");
  console.log("button: ", restart_button);
  restart_button.style.visibility = "visible";
  restart_button.onclick = () => {
    restart_button.style.visibility = "hidden";
    start();
  };
}

function scramble(word) {
  return [...word].sort(() => Math.random() - 0.5).join("");
}

// const word = "playmakers";
// const result = await get_dict_url(word);
// console.log(word, result);

let timer = new Timer(30);
let text_box = new TextBox(timer.flash_warning.bind(timer));

function start() {
  let entered_words = {};
  let word = "PLAYMAKER";
  word = word.toUpperCase();
  let letters = scramble(word);
  set_letters(letters);

  clear_all_words_from_display();
  text_box.unlock_text_box();
  timer.restart();
  text_box.reset(letters, entered_words);

  const on_time_limit_reached_cb = on_time_limit_reached.bind(
    this,
    text_box.lock_text_box.bind(text_box)
  );
  timer.set_on_timer_finished_cb(on_time_limit_reached_cb);
}

start();
