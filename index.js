document.addEventListener("DOMContentLoaded", function () {
  insertLyrics();
  syncLyrics();
});

function insertLyrics() {
  const fragment = document.createDocumentFragment();
  const lyricsList = document.querySelector(".lyrics-list");

  lyrics.forEach((lyric) => {
    const item = document.createElement("li");
    item.classList.add("lyrics-item");
    item.setAttribute("data-time", lyric.time);
    item.textContent = lyric.text;
    fragment.appendChild(item);
  });

  lyricsList.appendChild(fragment);
}

function syncLyrics() {
  const audio = document.querySelector("audio");
  const lyricsItems = document.querySelectorAll(".lyrics-item");
  let lastActiveIndex = -1; // Track last active index for scrolling

  audio.addEventListener(
    "timeupdate",
    debounce(() => {
      const currentTime = audio.currentTime;
      updateActiveLyrics(lyricsItems, currentTime, lastActiveIndex);
    }, 100)
  ); // Debounce with 100ms delay
}

function updateActiveLyrics(lyricsItems, currentTime, lastActiveIndex) {
  let newActiveIndex = -1;

  lyricsItems.forEach((item, index) => {
    const itemTime = parseFloat(item.getAttribute("data-time"));

    const diff = currentTime - itemTime;

    if (diff >= 0 && diff < 6) {
      item.classList.add("active");
      newActiveIndex = index; // Track the new active index
    } else {
      item.classList.remove("active");
    }
  });

  // Scroll only if the active index has changed
  if (newActiveIndex !== lastActiveIndex && newActiveIndex !== -1) {
    // Scroll to the active item
    lyricsItems[newActiveIndex].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    lastActiveIndex = newActiveIndex;
  }
}

// Debounce function to limit the rate of function execution
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
