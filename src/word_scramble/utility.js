export const Color = {
  GREEN: "#17B169",
  YELLOW: "#FFD700",
  RED: "#CC0000",
  WHITE: "#FFFFFF",
};

function get_entered_words() {
  return document.getElementById("entered_words");
}

export function add_entered_word_to_display(word, url) {
  let button = document.createElement("button");
  button.className = "entered_word";
  button.appendChild(document.createTextNode(word));
  button.onclick = window.open.bind(this, url);
  get_entered_words().appendChild(button);
}

export function clear_all_words_from_display() {
  let display = get_entered_words();
  let child = display.lastElementChild;
  while (child) {
    display.removeChild(child);
    child = display.lastElementChild;
  }
}

function get_sidebar() {
  return document.getElementById("sidebar");
}

export function open_sidebar() {
  console.log("open sidebar");
  get_sidebar().style.width = "150px";
}

export function close_sidebar() {
  console.log("close sidebar");
  get_sidebar().style.width = "0";
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

export function get_letter_frequency(word) {
  return [...word].reduce((letter_frequency, c) => {
    letter_frequency[c] = letter_frequency[c] ? letter_frequency[c] + 1 : 1;
    return letter_frequency;
  }, {});
}

export function set_letters(letters, input_text) {
  console.log("in set_letters: ", input_text);
  let used_letters_frequency = get_letter_frequency(input_text);
  let html = "";
  for (const c of letters) {
    if (used_letters_frequency[c] && used_letters_frequency[c] != 0) {
      html += '<span style="color:#282828;">' + c + "</span>";
      used_letters_frequency[c]--;
      continue;
    }
    html += `<span style="color:white;">${c}</span>`;
  }
  document.getElementById("letters").innerHTML = html;
}
