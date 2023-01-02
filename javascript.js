const start = async () => {
  const bigData = await fetch("https://api.tvmaze.com/shows/5/episodes");

  const data = await bigData.json();
  return data;
};
start()
  .then((element) => {
    preTagSorter();

    cardAndOptionCreator(element);

    searchFilter(element);
  })
  .catch(
    console.log(
      "sorry, some err! detected, call to your hero for repair this! :)"
    )
  );

function preTagSorter() {
  const main = document.createElement("main");
  document.body.append(main);

  const sectionInput = document.createElement("section");
  main.append(sectionInput);
  sectionInput.className = "input";

  const searchLabel = document.createElement("label");
  searchLabel.textContent = "Search Here!";
  searchLabel.setAttribute("for", "search");
  sectionInput.append(searchLabel);

  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "search");
  searchInput.setAttribute("id", "search");
  sectionInput.append(searchInput);

  const select = document.createElement("select");
  sectionInput.append(select);

  const sectionContainer = document.createElement("section");
  main.append(sectionContainer);
  sectionContainer.className = "container";
}

function cardAndOptionCreator(data) {
  const container = document.querySelector(".container");
  const select = document.querySelector("select");
  const option = document.createElement("option");
  option.setAttribute("for", "search");
  option.textContent = "none";
  select.append(option);
  data.forEach((e) => {
    const card = document.createElement("section");
    card.className = "card";
    container.append(card);
    const h3 = document.createElement("h3");
    h3.textContent = e.name;
    card.append(h3);

    const p = document.createElement("p");
    const firstDigitOfSeason = e.season < 10 ? 0 : "";
    const firstDigitOfEpisodes = e.number < 10 ? 0 : "";
    p.textContent = `S${firstDigitOfSeason}${e.season}E${firstDigitOfEpisodes}${e.number}`;
    card.append(p);

    const img = document.createElement("img");
    img.setAttribute("src", e.image.medium);
    img.setAttribute("alt", `picture of ${p.textContent}`);
    card.append(img);

    const summary = document.createElement("p");
    // cuz of security considerations we dont use innerHTML
    summary.textContent = e.summary.slice(3, -4);
    summary.className = "summary";
    card.append(summary);

    const a = document.createElement("a");
    a.setAttribute("target", "_blank");
    a.setAttribute("href", e.url);
    a.textContent = `See More`;
    card.append(a);

    const option = document.createElement("option");
    option.setAttribute("for", "search");
    option.textContent = p.textContent + "-" + e.name;
    select.append(option);
  });
}

function searchFilter(element) {
  const searchInput = document.querySelector("#search");
  const cards = document.querySelectorAll(".card");

  let counter = 0;
  const numberOfMatchItem = document.createElement("h4");
  numberOfMatchItem.className = "zeroOpacity";
  searchInput.parentElement.append(numberOfMatchItem);

  searchInput.addEventListener("input", (e) => {
    counter = 0;

    numberOfMatchItem.className = "fullOpacity";
    const value = e.target.value.toLowerCase();
    cards.forEach((e) => {
      const isVisible =
        e.childNodes[0].textContent.toLowerCase().includes(value) ||
        e.childNodes[3].textContent.toLowerCase().includes(value);
      if (isVisible) {
        counter += 1;
      }
      numberOfMatchItem.textContent = `Number Of Match Item : ${counter}`;
      e.classList.toggle("none", !isVisible);
    });
  });
  const episodesSelector = document.querySelector("select");
  episodesSelector.addEventListener("change", (e) => {
    cards.forEach((element) => {
      const isOptionMatch =
        e.target.value != "none" &&
        e.target.value.slice(0, 6) != element.childNodes[1].textContent;

      element.classList.toggle("none", isOptionMatch);
    });
  });
}
