const suits = ["♥", "♠", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let deck = [];
let scorePlayer = 0;
let scoreCp1 = 0;
let scoreCp2 = 0;
let lastSuit = "JOKER";
let lastRank = "None";
let count = 0;
let turn = 0;
let isPlayerTurn = true;
let centerZ = 0;
let logtext = "sample"

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank, label: `${suit}${rank}` });
    }
  }
  deck.push({ suit: "JOKER", rank: "JOKER", label: "JOKER" });
  deck.push({ suit: "JOKER", rank: "JOKER", label: "JOKER" });

  shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i+1));
    [array[i], array[r]] = [array[r], array[i]];
  }
}

function renderDeck() {
  const container = document.getElementById("card-ring");
  const center = document.getElementById("center-area");
  container.innerHTML = "";

  const radius = 200;
  const centerX = 300;
  const centerY = 230;

  deck.forEach((card, index) => {
    const angle = (2 * Math.PI / deck.length) * index;
    const x = centerX + radius * Math.cos(angle) - 30;
    const y = centerY + radius * Math.sin(angle) - 45;

    const cardEl = document.createElement("div");
    cardEl.className = "card face-down";
    cardEl.style.left = `${x}px`;
    cardEl.style.top = `${y}px`;
    cardEl.style.zIndex = 1;
    cardEl.dataset.index = index;
    cardEl.textContent = " ";

    cardEl.onclick = () => {
      if (!isPlayerTurn || cardEl.classList.contains("face-up-F") || cardEl.classList.contains("face-down-H1") || cardEl.classList.contains("face-down-H2")) return;

      if (turn < 3){
        cardEl.classList.remove("face-down");
        cardEl.classList.add("face-up-H");
        cardEl.textContent = card.label;
        cardEl.style.left = `${turn*100+170}px`;
        cardEl.style.top = `500px`;
        computerTurn(1);
        computerTurn(2);
        turn++;
        if (turn === 3) {
          document.getElementById("turn-indicator").textContent = "あなたのターン";
          document.getElementById("card-count").textContent = `出すカードを選ぼう`
        }
      }
      else revealCard(cardEl, card);
      if (card.suit === "♥") cardEl.style.color = "red";
      else if (card.suit === "♠") cardEl.style.color = "blue";
      else if (card.suit === "♦") cardEl.style.color = "orange";
      else if (card.suit === "♣") cardEl.style.color = "green";
      else cardEl.style.color = "black";
    };
    container.appendChild(cardEl);
  });
}

function revealCard(cardEl, card) {
  count++;
  centerZ++;
  document.getElementById("card-count").textContent = `積み重なっているカード：${count}`
  if (cardEl.classList.contains("face-up-H")) cardEl.classList.remove("face-up-H");
  else if (cardEl.classList.contains("face-down-H1")) cardEl.classList.remove("face-down-H1");
  else if (cardEl.classList.contains("face-down-H2")) cardEl.classList.remove("face-down-H2");
  else cardEl.classList.remove("face-down");
  cardEl.classList.add("face-up-F");
  cardEl.textContent = card.label;
  cardEl.style.left = `270px`;
  cardEl.style.top = `200px`;
  cardEl.style.zIndex = centerZ;
  if (card.suit === "♥") cardEl.style.color = "red";
  else if (card.suit === "♠") cardEl.style.color = "blue";
  else if (card.suit === "♦") cardEl.style.color = "orange";
  else if (card.suit === "♣") cardEl.style.color = "green";
  else cardEl.style.color = "black";

  if (lastRank === "None") logtext = "None";
  else if (lastRank === "JOKER") logtext = "JOKER";
  else logtext = `${lastSuit}${lastRank}`;
  if (lastSuit === card.suit || lastRank === card.rank || lastSuit === "JOKER" || card.suit === "JOKER") {
    if (count > 1) {
      if (card.rank === "A") {
        turn--;
      }
      if (card.rank === "J") {
        turn--;
      }
      if (card.rank === "Q") {
        turn--;
      }
      if (card.rank === "K") {
        turn--;
      }
    }
    lastSuit = card.suit;
    lastRank = card.rank;
  }
  else {
    if (turn % 3 === 0) {
      scorePlayer += count;
      document.getElementById("scorePlayer").textContent = scorePlayer;
    }
    else if (turn % 3 === 1) {
      scoreCp1 += count;
      document.getElementById("scoreCp1").textContent = scoreCp1;
    }
    else {
      scoreCp2 += count;
      document.getElementById("scoreCp2").textContent = scoreCp2;
    }
    lastSuit = "JOKER"
    lastRank = "None"
    count = 0;
  }

  cardEl.onclick = null;
  // 次のターン
  if (lastRank === "None") {
    document.getElementById("card-count").textContent = `積み重なっているカード：${count}枚　　ログ：${logtext} → None`
    setTimeout(centerPlace, 1000);
  }
  else if (lastRank === "JOKER") {
    document.getElementById("card-count").textContent = `積み重なっているカード：${count}枚　　ログ：${logtext} → JOKER`
  }
  else {
    document.getElementById("card-count").textContent = `積み重なっているカード：${count}枚　　ログ：${logtext} → ${lastSuit}${lastRank}`
  }
  turn++;
  if (turn % 3 === 0) {
    document.getElementById("turn-indicator").textContent = "あなたのターン";
    isPlayerTurn = true;
  }
  else {
    document.getElementById("turn-indicator").textContent = `CPU${turn % 3}のターン`;
    isPlayerTurn = false;
    setTimeout(() => {
      computerTurn(turn % 3);
    }, 2000);
  }
}

function centerPlace() {
  centerZ++;
  const container = document.getElementById("card-ring");
  const placeEl = document.createElement("div");
  placeEl.id = "center-place";
  placeEl.className = "center-place";
  placeEl.style.left = `270px`;
  placeEl.style.top = `200px`;
  placeEl.style.zIndex = centerZ;
  container.appendChild(placeEl);
}

function computerTurn(cpu) {
  const allCards = document.querySelectorAll(".card");
  if (turn < 3) {
    const x = 650;
    let y = 150;
    if (cpu === 2) y += 150;
    const available = Array.from(allCards).filter(c => c.classList.contains("face-down"));
    if (available.length === 0) return;
    const choice = available[Math.floor(Math.random() * available.length)];
    choice.classList.remove("face-down");
    choice.classList.add(`face-down-H${cpu}`);
    choice.style.left = `${turn*20+x}px`;
    choice.style.top = `${y}px`;
    choice.style.zIndex = turn;
  }
  else {
    let exist = true;
    const allhands = Array.from(allCards).filter(c => c.classList.contains(`face-down-H${cpu}`));
    if (allhands.length > 0) {
      for (let cardEl of allhands) {
        const index = parseInt(cardEl.dataset.index);
        const card = deck[index];
        if (lastSuit === card.suit || lastRank === card.rank || lastSuit === "JOKER" || card.suit === "JOKER") {
          revealCard(cardEl, card);
          return;
        }
      }
    }
    if (exist) {
      const available = Array.from(allCards).filter(c => c.classList.contains("face-down"));
      if (available.length === 0) return;
      const choice = available[Math.floor(Math.random() * available.length)];
      const index = parseInt(choice.dataset.index);
      const card = deck[index];
      revealCard(choice, card);
    }
  }
}

document.getElementById("rule-button").onclick = () => {
  const popup = document.getElementById("rule-popup");
  popup.classList.toggle("hidden");
};

createDeck();
renderDeck();