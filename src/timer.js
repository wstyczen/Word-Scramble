import { Color } from "./utility.js";

export class Timer {
  constructor(time_limit, on_timer_finished_cb) {
    this.time_ = time_limit;
    this.timer_ = this.init_timer();
    this.on_timer_finished_cb_ = on_timer_finished_cb;
  }

  init_timer() {
    this.set_time_limit(this.time_);
    return setInterval(() => {
      if (this.time_ > 0) {
        this.time_--;
        this.set_time_limit(this.time_);
        return;
      }
      clearInterval(this.time_);
      this.set_time_text("Time has run out!");
    }, 1000);
  }

  get_time_display_text() {
    return document.getElementById("time_display");
  }

  get_time_limit_text() {
    return document.getElementById("time_limit");
  }

  set_time_text(text) {
    this.get_time_display_text().innerHTML = text;
    this.get_time_display_text().style.color = Color.RED;
  }

  set_time_limit(seconds) {
    this.get_time_display_text().innerHTML = `Time left: <b id="time_limit">${seconds}</b>s`;
    this.get_time_display_text().style.color = Color.WHITE;
  }

  flash_warning(text) {
    let previous_time = parseInt(this.get_time_limit_text().innerHTML);
    const set_time_limit_bound = this.set_time_limit.bind(this, previous_time);
    this.set_time_text(text);
    setTimeout(function () {
      set_time_limit_bound();
    }, 200);
  }
}
