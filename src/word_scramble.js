const KeyType = {
  BLOCKED: 0,
  CONTROL: 0,
  LETTER: 0,
};

const Color = {
  GREEN: "#17B169",
  RED: "#CC0000",
  WHITE: "#FFFFFF",
};

function get_text_box() {
  return document.getElementById("text_box");
}

function flash_text_box(color, callback = null) {
  get_text_box().style.backgroundColor = color;
  setTimeout(function () {
    get_text_box().style.backgroundColor = Color.WHITE;
    if (callback) callback();
  }, 100);
}

function set_letters(text) {
  document.getElementById("letters").innerHTML = text;
}

function set_time_limit(seconds) {
  document.getElementById("time_limit").innerHTML = seconds;
}

function filter_text_box_contents(letters, e) {
  let t = e.target;
  const starting_value = t.value;

  // Remove any non letters
  t.value = t.value.replace(/[^a-zA-Z]/gi, "");

  // Check if using only available letters
  let letter_frequency = [...letters].reduce((letter_frequency, c) => {
    letter_frequency[c] = letter_frequency[c] ? letter_frequency[c] + 1 : 1;
    return letter_frequency;
  }, {});
  for (const c of t.value) {
    if (!letter_frequency[c] || letter_frequency[c] == 0) {
      t.value = t.value.slice(0, -1);
      continue;
    }
    letter_frequency[c]--;
  }

  if (t.value != starting_value) flash_text_box(Color.RED);
}

function is_valid_word(entered_words, word) {
  if (entered_words.includes(word)) return false;
  return true;
}

function add_entered_word_to_display(word) {
  let button = document.createElement("button");
  button.className = "entered_word";
  button.appendChild(document.createTextNode(word));
  document.getElementById("entered_words").appendChild(button);
}

function on_text_box_key_press(entered_words, event) {
  if (event.key === "Enter") {
    if (!is_valid_word(entered_words, get_text_box().value)) {
      flash_text_box(Color.RED);
      return;
    }
    entered_words.push(get_text_box().value);
    add_entered_word_to_display(get_text_box().value);
    flash_text_box(Color.GREEN, function () {
      get_text_box().value = "";
    });
    console.log(entered_words);
  }
}

function scramble(word) {
  return [...word].sort(() => Math.random() - 0.5).join("");
}

entered_words = [];
word = "PLAYMAKER";
letters = scramble(word);
console.log(letters);

get_text_box().addEventListener(
  "input",
  filter_text_box_contents.bind(this, letters)
);
get_text_box().addEventListener("keypress", (e) =>
  on_text_box_key_press.bind(this, entered_words)(e)
);

set_letters(letters);
set_time_limit(50);
