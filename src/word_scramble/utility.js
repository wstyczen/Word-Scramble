export const Color = {
  GREEN: "#17B169",
  YELLOW: "#FFD700",
  RED: "#CC0000",
  WHITE: "#FFFFFF",
};

export function add_entered_word_to_display(word, url) {
  let button = document.createElement("button");
  button.className = "entered_word";
  button.appendChild(document.createTextNode(word));
  button.onclick = window.open.bind(this, url);
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

export async function get_random_word(length) {
  const api_url = "http://random-word-api.herokuapp.com/";
  let response = await fetch(api_url + "word?length=" + length);
  if (!response.ok) return null;
  let data = await response.json();
  if (data.length == 0) return null;
  return data[0];
}
