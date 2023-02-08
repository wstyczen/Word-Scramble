import {
  Color,
  get_dict_url,
  get_letter_frequency,
  set_letters_text,
} from "./utility.js";
import { add_entered_word_to_display } from "./utility.js";

export class TextBox {
  constructor(flash_warning_cb) {
    this.flash_warning_cb_ = flash_warning_cb;
    this.can_handle_enter_ = true;
    this.must_use_letters_ = 0;
  }

  reset(letters, entered_words, must_use_letters) {
    this.letters_ = letters;
    this.must_use_letters_ = must_use_letters;
    set_letters_text(letters, "", must_use_letters);
    this.unlock_text_box();
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

  set_must_use_letters(nr) {
    this.must_use_letters_ = nr;
    set_letters_text(this.letters_, "", this.must_use_letters_);
  }

  clear_contents() {
    this.get_text_box().value = "";
    set_letters_text(this.letters_, "", this.must_use_letters_);
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
    set_letters_text(this.letters_, t.value, this.must_use_letters_);
  }

  satisfies_must_use_letters(text) {
    for (const [i, c] of [...this.letters_].entries()) {
      if (i >= this.must_use_letters_) return true;
      if (!text.includes(c)) return false;
    }
    return false;
  }

  async on_key_press(entered_words, event) {
    const word = this.get_text_box().value;
    if (event.key === "Enter") {
      // To prevent multiple entries when enter is clicked rapidly
      if (!this.can_handle_enter_) return;
      this.can_handle_enter_ = false;
      if (!this.is_part_anagram(entered_words, word)) {
        this.flash_text_box(Color.RED);
        this.can_handle_enter_ = true;
        return;
      }
      console.log("in enter");
      const dict_url = await get_dict_url(word);
      if (!dict_url) {
        this.flash_warning_cb_("Not an english word!");
        this.flash_text_box(Color.RED);
        this.can_handle_enter_ = true;
        return;
      }
      if (!this.satisfies_must_use_letters(word)) {
        this.flash_warning_cb_("Unsatisfied must-use letters!");
        this.flash_text_box(Color.RED);
        this.can_handle_enter_ = true;
        return;
      }
      entered_words[word] = dict_url;
      add_entered_word_to_display(word, dict_url);
      const clear_contents_cb = this.clear_contents.bind(this);
      this.flash_text_box(Color.GREEN, function () {
        clear_contents_cb();
      });
      set_letters_text(this.letters_, "", this.must_use_letters_);
      this.can_handle_enter_ = true;
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
