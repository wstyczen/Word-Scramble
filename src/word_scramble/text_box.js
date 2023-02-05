import { Color, get_dict_url } from "./utility.js";
import { add_entered_word_to_display } from "./utility.js";

export class TextBox {
  constructor(flash_warning_cb) {
    this.flash_warning_cb_ = flash_warning_cb;
  }

  reset(letters, entered_words) {
    // To remove listeners - removeEventListener does not work with anything but
    // named, free functions
    let text_box = this.get_text_box();
    let new_text_box = text_box.cloneNode(true);
    text_box.parentNode.replaceChild(new_text_box, text_box);

    this.get_text_box().addEventListener(
      "input",
      this.filter_contents.bind(this, letters)
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

  async on_key_press(entered_words, event) {
    const word = this.get_text_box().value;
    if (event.key === "Enter") {
      console.log("in on_key_press: ", entered_words);
      if (!this.is_part_anagram(entered_words, word)) {
        this.flash_text_box(Color.RED);
        return;
      }
      const dict_url = await get_dict_url(word);
      if (!dict_url) {
        this.flash_text_box(Color.RED);
        return;
      }
      entered_words[word] = dict_url;
      add_entered_word_to_display(word, dict_url);
      const clear_contents_cb = this.clear_contents.bind(this);
      this.flash_text_box(Color.GREEN, function () {
        clear_contents_cb();
      });
      console.log(entered_words);
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
