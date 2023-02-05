export const Color = {
  GREEN: "#17B169",
  YELLOW: "#FFD700",
  RED: "#CC0000",
  WHITE: "#FFFFFF",
};

export function add_entered_word_to_display(word) {
  let button = document.createElement("button");
  button.className = "entered_word";
  button.appendChild(document.createTextNode(word));
  document.getElementById("entered_words").appendChild(button);
}

export function clear_all_words_from_display() {
  let display = document.getElementById("entered_words");
  let child = display.lastElementChild;
  while (child) {
    display.removeChild(child);
    child = display.lastElementChild;
  }
}
