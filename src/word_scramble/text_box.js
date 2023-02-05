import {
  Color,
  get_dict_url,
  get_letter_frequency,
  set_letters,
} from "./utility.js";
import { add_entered_word_to_display } from "./utility.js";

export class TextBox {
  constructor(flash_warning_cb) {
    this.flash_warning_cb_ = flash_warning_cb;
  }

  reset(letters, entered_words) {
    this.letters_ = letters;
    set_letters(letters, "");
    // To remove listeners - removeEventListener does not work with anything but
    // named, free functions
    let text_box = this.get_text_box();
    let new_text_box = text_box.cloneNode(true);
    text_box.parentNode.replaceChild(new_text_box, text_box);

    this.get_text_box().addEventListener(
      "input",
      this.filter_contents.bind(this)
    );
    this.get_text_box().addEventListener(
      "keypress",
      async (e) => await this.on_key_press.bind(this, entered_words)(e)
    );
  }

  get_text_box() {
    return document.getElementById("text_box");
  }

  clear_contents() {
    this.get_text_box().value = "";
    set_letters(this.letters_, "");
  }

  lock_text_box() {
    this.get_text_box().placeholder = "time has run out";
    this.clear_contents();
    this.get_text_box().disabled = true;
  }

  unlock_text_box() {
    this.get_text_box().placeholder = "enter your solution";
    this.get_text_box().disabled = false;
  }

  flash_text_box(color, callback = null) {
    this.get_text_box().style.backgroundColor = color;
    const get_text_box_cb = this.get_text_box.bind(this);
    setTimeout(function () {
      get_text_box_cb().style.backgroundColor = Color.WHITE;
      if (callback) callback();
    }, 100);
  }

  get_input_text() {
    return this.get_text_box().text;
  }

  filter_contents(e) {
    let t = e.target;
    const starting_value = t.value;

    // Remove any non letters
    t.value = t.value.replace(/[^a-zA-Z]/gi, "");
    // Switch to upper case
    t.value = t.value.toUpperCase();

    // Check if using only available letters
    let letter_frequency = get_letter_frequency(this.letters_);
    for (const c of t.value) {
      if (!letter_frequency[c] || letter_frequency[c] == 0) {
        t.value = t.value.slice(0, -1);
        continue;
      }
      letter_frequency[c]--;
    }

    if (t.value.length != starting_value.length) {
      this.flash_warning_cb_("Invalid letter!");
      this.flash_text_box(Color.RED);
    }
    set_letters(this.letters_, t.value);
  }

  async on_key_press(entered_words, event) {
    const word = this.get_text_box().value;
    if (event.key === "Enter") {
      if (!this.is_part_anagram(entered_words, word)) {
        this.flash_text_box(Color.RED);
        return;
      }
      const dict_url = await get_dict_url(word);
      if (!dict_url) {
        this.flash_warning_cb_("Not an english word!");
        this.flash_text_box(Color.RED);
        return;
      }
      entered_words[word] = dict_url;
      add_entered_word_to_display(word, dict_url);
      const clear_contents_cb = this.clear_contents.bind(this);
      this.flash_text_box(Color.GREEN, function () {
        clear_contents_cb();
      });
      set_letters(this.letters_, "");
    }
  }

  is_part_anagram(entered_words, word) {
    if (word.length == 0) {
      this.flash_warning_cb_("No solution!");
      return false;
    }
    if (word in entered_words) {
      this.flash_warning_cb_("Word already entered!");
      return false;
    }
    return true;
  }
}
