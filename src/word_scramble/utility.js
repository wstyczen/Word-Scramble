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

export async function get_dict_url(word) {
  const api_url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  let response = await fetch(api_url + word);
  if (!response.ok) return null;
  let data = await response.json();
  if (data.length == 0) return null;
  return data[0]["sourceUrls"][0];
}
