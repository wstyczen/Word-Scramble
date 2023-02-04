import { Color } from "./utility.js";
import { add_entered_word_to_display } from "./utility.js";

export class TextBox {
  constructor(letters, entered_words, flash_warning_cb) {
    this.on_input_cb_ = this.filter_contents.bind(this, letters);
    this.get_text_box().addEventListener("input", this.on_input_cb_);

    this.on_keypress_cb_ = this.on_key_press.bind(this, entered_words);
    this.get_text_box().addEventListener("keypress", (e) =>
      this.on_keypress_cb_(e)
    );

    this.flash_warning_cb_ = flash_warning_cb;
  }

  get_text_box() {
    return document.getElementById("text_box");
  }

  clear_contents() {
    this.get_text_box().value = "";
  }

  lock_text_box() {
    this.clear_contents();
    this.get_text_box().placeholder = "TIME HAS RUN OUT";
    this.get_text_box().style.backgroundColor = Color.RED;
    this.get_text_box().style.color = Color.WHITE;
    this.get_text_box().disabled = true;
  }

  flash_text_box(color, callback = null) {
    this.get_text_box().style.backgroundColor = color;
    const get_text_box_cb = this.get_text_box.bind(this);
    setTimeout(function () {
      get_text_box_cb().style.backgroundColor = Color.WHITE;
      if (callback) callback();
    }, 100);
  }

  filter_contents(letters, e) {
    let t = e.target;
    const starting_value = t.value;

    // Remove any non letters
    t.value = t.value.replace(/[^a-zA-Z]/gi, "");
    // Switch to upper case
    t.value = t.value.toUpperCase();

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

    if (t.value.length != starting_value.length) this.flash_text_box(Color.RED);
  }

  on_key_press(entered_words, event) {
    if (event.key === "Enter") {
      if (!this.is_valid_word(entered_words, this.get_text_box().value)) {
        this.flash_text_box(Color.RED);
        return;
      }
      entered_words.push(this.get_text_box().value);
      add_entered_word_to_display(this.get_text_box().value);
      const clear_contents_cb = this.clear_contents.bind(this);
      this.flash_text_box(Color.GREEN, function () {
        clear_contents_cb();
      });
      console.log(entered_words);
    }
  }

  is_valid_word(entered_words, word) {
    if (word.length == 0) {
      this.flash_warning_cb_("No solution!");
      return false;
    }
    if (entered_words.includes(word)) {
      this.flash_warning_cb_("Word already entered!");
      return false;
    }
    return true;
  }
}
