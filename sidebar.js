import { Color } from "./utility.js";

export class LettersInput {
  constructor(on_entered_cb) {
    this.get_text_box().addEventListener(
      "input",
      this.filter_contents.bind(this)
    );
    this.get_text_box().addEventListener("keypress", (e) =>
      this.on_key_press.bind(this, on_entered_cb)(e)
    );
  }

  get_text_box() {
    return document.getElementById("letters_input");
  }

  clear_contents() {
    this.get_text_box().value = "";
  }

  flash_text_box(color, callback = null) {
    this.get_text_box().style.backgroundColor = color;
    const get_text_box_cb = this.get_text_box.bind(this);
    setTimeout(function () {
      get_text_box_cb().style.backgroundColor = Color.WHITE;
      if (callback) callback();
    }, 100);
  }

  filter_contents(e) {
    let t = e.target;
    const starting_value = t.value;
    // Remove any non letters
    t.value = t.value.replace(/[^a-zA-Z]/gi, "").toUpperCase();
    if (t.value.size !== starting_value.size) this.flash_text_box(Color.RED);
  }

  on_key_press(on_entered_cb, event) {
    const word = this.get_text_box().value;
    if (event.key === "Enter") {
      const clear_contents_cb = this.clear_contents.bind(this);
      this.flash_text_box(Color.GREEN, function () {
        clear_contents_cb();
        on_entered_cb(word);
      });
    }
  }
}

export class NumberInput {
  constructor(
    element_name,
    starting_value,
    min_value,
    max_value,
    on_entered_cb
  ) {
    this.element_name_ = element_name;
    this.min_value = min_value;
    this.max_value = max_value;
    this.get_input().placeholder = starting_value;
    this.get_input().addEventListener("keypress", (e) =>
      this.on_key_press.bind(this, on_entered_cb)(e)
    );
  }

  set_max_value(value) {
    self.max_value = value;
  }

  get_input() {
    return document.getElementById(this.element_name_);
  }

  flash_text_box(color, callback = null) {
    this.get_input().style.backgroundColor = color;
    const get_get_input_cb = this.get_input.bind(this);
    setTimeout(function () {
      get_get_input_cb().style.backgroundColor = Color.WHITE;
      if (callback) callback();
    }, 100);
  }

  on_key_press(on_entered_cb, event) {
    if (event.key === "Enter") {
      const input_value = parseInt(this.get_input().value);
      this.get_input().value = "";
      if (input_value < this.min_value || input_value > this.max_value) {
        this.flash_text_box(Color.RED);
        return;
      }
      this.flash_text_box(Color.GREEN);
      this.get_input().placeholder = input_value;
      on_entered_cb(input_value);
    }
  }
}
