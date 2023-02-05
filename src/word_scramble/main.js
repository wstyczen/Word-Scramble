import { Timer } from "./timer.js";
import { TextBox } from "./text_box.js";
import { clear_all_words_from_display, get_random_word } from "./utility.js";

function set_letters(text) {
  document.getElementById("letters").innerHTML = text;
}

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

let timer = new Timer(90);
let text_box = new TextBox(timer.flash_warning.bind(timer));

async function start() {
  let entered_words = {};

  const word_length = 8;
  let word = await get_random_word(word_length);
  word = word.toUpperCase();
  console.log("Random word: ", word);

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

await start();
