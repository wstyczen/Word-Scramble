import { Color } from "./utility.js";

export class Timer {
  constructor(on_timer_finished_cb = null) {
    this.on_timer_finished_cb_ = on_timer_finished_cb;
  }

  start(time_limit) {
    this.starting_time_ = time_limit;
    this.time_ = time_limit;
    if (this.timer_) clearInterval(this.timer_);
    this.timer_ = this.init_timer();
  }

  init_timer() {
    this.set_time_limit_text(this.time_);
    return setInterval(() => {
      if (this.time_ > 0) {
        this.time_--;
        this.set_time_limit_text(this.time_);
        return;
      }
      clearInterval(this.timer_);
      this.set_time_text("Time has run out!");
      this.on_timer_finished_cb_();
    }, 1000);
  }

  set_on_timer_finished_cb(on_timer_finished_cb) {
    this.on_timer_finished_cb_ = on_timer_finished_cb;
  }

  get_time_display_text() {
    return document.getElementById("time_display");
  }

  get_time_limit_text() {
    return document.getElementById("time_limit");
  }

  get_time_coloring() {
    if (this.time_ / this.starting_time_ > 0.5) return Color.GREEN;
    if (this.time_ / this.starting_time_ > 0.2) return Color.YELLOW;
    return Color.RED;
  }

  set_time_text(text) {
    this.get_time_display_text().innerHTML = text;
    this.get_time_display_text().style.color = Color.RED;
  }

  set_time_limit_text(seconds) {
    this.get_time_display_text().innerHTML = `Time left: <b id="time_limit">${seconds}</b>s`;
    this.get_time_display_text().style.color = Color.WHITE;
    this.get_time_limit_text().style.color = this.get_time_coloring();
  }

  flash_warning(text) {
    let time_limit = this.get_time_limit_text();
    if (!time_limit) return;
    let previous_time = parseInt(time_limit.innerHTML);
    const set_time_limit_text_bound = this.set_time_limit_text.bind(
      this,
      previous_time
    );
    this.set_time_text(text);
    setTimeout(function () {
      set_time_limit_text_bound();
    }, 200);
  }
}
