import { Timer } from "./timer.js";
import { TextBox } from "./text_box.js";
import { LettersInput, NumberInput } from "./sidebar.js";
import {
  clear_all_words_from_display,
  close_sidebar,
  get_random_word,
  open_sidebar,
  scramble,
} from "./utility.js";

let settings = {
  time_limit: 30,
  provided_letters: null,
  random_word_length: 8,
  must_use_letters: 0,
};

function on_time_limit_reached(cb) {
  cb();
  let restart_button = document.getElementById("restart_button");
  restart_button.style.visibility = "visible";
  restart_button.onclick = async () => {
    restart_button.style.visibility = "hidden";
    await start(settings);
  };
}

let timer = new Timer();
let text_box = new TextBox(timer.flash_warning.bind(timer));

let letters_input = new LettersInput(async function (word) {
  settings.provided_letters = word;
  await start(settings);
});
let time_limit_input = new NumberInput(
  "time_limit_input",
  settings.time_limit,
  function (value) {
    settings.time_limit = value;
  }
);
let word_length_input = new NumberInput(
  "word_length_input",
  settings.random_word_length,
  function (value) {
    settings.random_word_length = value;
  }
);

let sidebar_button = document.getElementById("sidebar_button");
sidebar_button.onclick = open_sidebar;

document
  .getElementById("main_container")
  .addEventListener("click", close_sidebar);

async function start(settings) {
  let word = null;
  if (settings.provided_letters) {
    word = settings.provided_letters.toUpperCase();
    settings.provided_letters = null; // Should only use those once
    console.log("Provided word: ", word);
  } else {
    word = (await get_random_word(settings.random_word_length)).toUpperCase();
    console.log("Random word: ", word);
  }
  let letters = scramble(word);

  let entered_words = {};
  clear_all_words_from_display();
  timer.start(settings.time_limit);
  text_box.reset(letters, entered_words);

  const on_time_limit_reached_cb = on_time_limit_reached.bind(
    this,
    text_box.lock_text_box.bind(text_box)
  );
  timer.set_on_timer_finished_cb(on_time_limit_reached_cb);
}

await start(settings);
