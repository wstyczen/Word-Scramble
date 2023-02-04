export const Color = {
  GREEN: "#17B169",
  RED: "#CC0000",
  WHITE: "#FFFFFF",
};

export function add_entered_word_to_display(word) {
  let button = document.createElement("button");
  button.className = "entered_word";
  button.appendChild(document.createTextNode(word));
  document.getElementById("entered_words").appendChild(button);
}
