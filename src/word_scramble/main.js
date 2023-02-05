import { Timer } from "./timer.js";
import { TextBox } from "./text_box.js";
import {
  clear_all_words_from_display,
  close_sidebar,
  get_random_word,
  open_sidebar,
} from "./utility.js";

function on_time_limit_reached(cb) {
  cb();
  let restart_button = document.getElementById("restart_button");
  restart_button.style.visibility = "visible";
  restart_button.onclick = async () => {
    restart_button.style.visibility = "hidden";
    await start();
  };
}

function scramble(word) {
  return [...word].sort(() => Math.random() - 0.5).join("");
}

let time_limit = 90;
let word_length = 10;

let timer = new Timer(time_limit);
let text_box = new TextBox(timer.flash_warning.bind(timer));

let sidebar_button = document.getElementById("sidebar_button");
sidebar_button.onclick = open_sidebar;

document
  .getElementById("main_container")
  .addEventListener("click", close_sidebar);

async function start() {
  let entered_words = {};

  let word = await get_random_word(word_length);
  word = word.toUpperCase();
  console.log("Random word: ", word);

  let letters = scramble(word);

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

await start();
