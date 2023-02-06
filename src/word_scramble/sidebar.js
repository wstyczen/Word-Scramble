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
  constructor(element_name, starting_value, on_entered_cb) {
    this.element_name_ = element_name;
    this.get_input().placeholder = starting_value;
    this.get_input().addEventListener("keypress", (e) =>
      this.on_key_press.bind(this, on_entered_cb)(e)
    );
  }

  get_input() {
    return document.getElementById(this.element_name_);
  }

  on_key_press(on_entered_cb, event) {
    console.log("In on_key_press");
    if (event.key === "Enter") {
      const time_limit = parseInt(this.get_input().value);
      this.get_input().value = "";
      this.get_input().placeholder = time_limit;
      on_entered_cb(time_limit);
    }
  }
}
