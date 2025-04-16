const suits = ["♥", "♠", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let deck = [];
let scorePlayer = 0;
let scoreCp1 = 0;
let scoreCp2 = 0;
let handPlayer = 0;
let handCp1 = 0;
let handCp2 = 0;
let lastSuit = "JOKER";
let lastRank = "None";
let count = 0;
let turn = 0;
let isPlayerTurn = true;
let isJackPlayer = false;
let isJackCpu1 = false;
let isJackCpu2 = false;
let isQueen = false;
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

      if (turn < 3 || isQueen){
        cardEl.classList.remove("face-down");
        cardEl.classList.add("face-up-H");
        cardEl.textContent = card.label;
        cardEl.style.left = `${handPlayer*100+170}px`;
        cardEl.style.top = `500px`;
        handPlayer++;
        isQueen = false;
        setTimeout(() => {
          computerTurn(1);
          if (turn < 3) computerTurn(2);
          else isPlayerTurn = false;
          turn++;
          if (turn === 3) {
            document.getElementById("turn-indicator").textContent = "あなたのターン";
            document.getElementById("card-count").textContent = `出すカードを選ぼう`;
          }
        }, 500); 
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

function nextTurn(logtext) {
  if (logtext != "skip"){
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
  }
  turn++;
  if (turn % 3 === 0) {
    document.getElementById("turn-indicator").textContent = "あなたのターン";
    if (isQueen) document.getElementById("turn-indicator").textContent = "Qドロー：手札選択";
    isPlayerTurn = true;
  }
  else {
    document.getElementById("turn-indicator").textContent = `CPU${turn % 3}のターン`;
    if (isQueen) document.getElementById("turn-indicator").textContent = "Qドロー：手札選択中...";
    isPlayerTurn = false;
    setTimeout(() => {
      computerTurn(turn % 3);
    }, 2500);
  }
  const allCards = document.querySelectorAll(".card");
  const available = Array.from(allCards).filter(c => c.classList.contains("face-down"));
  if (available.length === 0) {
    const effectEl = document.getElementById("suit-effect");
    if (scorePlayer <= scoreCp1 && scorePlayer <= scoreCp2) effectEl.textContent = "WIN";
    else effectEl.textContent = "LOSE";
    effectEl.classList.add("show");
    effectEl.classList.remove("hidden");
  }
}

function showEffect(text, logtext) {
  const effectEl = document.getElementById("suit-effect");
  effectEl.textContent = text;
  effectEl.classList.add("show");
  effectEl.classList.remove("hidden");
  setTimeout(() => {
    effectEl.classList.remove("show");
    setTimeout(() => {
      effectEl.classList.add("hidden");
      nextTurn(logtext);
    }, 500);
  }, 1000);
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
  if (isJackPlayer && (turn % 3 === 0)) {
    isJackPlayer = false;
    const jackB = document.querySelectorAll(".j-skip");
    jackB[0].remove();
  }
  if (lastSuit === card.suit || lastRank === card.rank || lastSuit === "JOKER" || card.suit === "JOKER") {
    if (count > 1) {
      if (card.rank === "A") {
        turn--;
        showEffect("ワンモアA", logtext);
      }
      else if (card.rank === "J") {
        if (turn % 3 === 0) {
          isJackPlayer = true;
          jackPlace();
        }
        else if (turn % 3 === 1) isJackCpu1 = true;
        else isJackCpu2 = true;
        showEffect("Jスキップ", logtext);
      }
      else if (card.rank === "Q") {
        turn--;
        isQueen = true;
        showEffect("Qドロー", logtext);
      }
      else if (card.rank === "K") {
        if (turn % 3 === 0) {
          scorePlayer -= count;
          document.getElementById("scorePlayer").textContent = scorePlayer;
        }
        else if (turn % 3 === 1) {
          scoreCp1 -= count;
          document.getElementById("scoreCp1").textContent = scoreCp1;
        }
        else {
          scoreCp2 -= count;
          document.getElementById("scoreCp2").textContent = scoreCp2;
        }
        turn--;
        count = 0;
        showEffect("Kルール", logtext);
      }
      else showEffect("Safe", logtext);
    }
    else showEffect("Safe", logtext);
    lastSuit = card.suit;
    lastRank = card.rank;
    if (count === 0) {
      lastSuit = "JOKER"
      lastRank = "None"
    }
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
    nextTurn(logtext);
  }
  cardEl.onclick = null;
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

function jackPlace() {
  const container = document.getElementById("card-ring");
  const jackEl = document.createElement("div");
  jackEl.id = "j-skip";
  jackEl.className = "j-skip";
  jackEl.textContent = "スキップ"
  jackEl.style.left = `10px`;
  jackEl.style.top = `510px`;
  jackEl.style.zIndex = 0;
  jackEl.onclick = () => {
    if (!isPlayerTurn) return;
    jackEl.remove();
    turn++;
    document.getElementById("turn-indicator").textContent = `CPU${turn % 3}のターン`;
    isPlayerTurn = false;
    isJackPlayer = false;
    setTimeout(() => {
      computerTurn(turn % 3);
    }, 2000);
  }
  container.appendChild(jackEl);
}

function computerTurn(cpu) {
  const allCards = document.querySelectorAll(".card");
  if (turn < 3 || isQueen) {
    const x = 650;
    let y = 150;
    if (cpu === 2) y += 150;
    const available = Array.from(allCards).filter(c => c.classList.contains("face-down"));
    if (available.length === 0) return;
    const choice = available[Math.floor(Math.random() * available.length)];
    choice.classList.remove("face-down");
    choice.classList.add(`face-down-H${cpu}`);
    if (cpu === 1) {
      choice.style.left = `${handCp1*20+x}px`;
      handCp1++;
    }
    else {
      choice.style.left = `${handCp2*20+x}px`;
      handCp2++;
    }
    choice.style.top = `${y}px`;
    choice.style.zIndex = turn;
    if (isQueen) {
      isQueen = false;
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
  }
  else {
    let skip = false;
    if (cpu === 1) {
      if (isJackCpu1) {
        isJackCpu1 = false;
        if (count > 0) skip = true;
      }
    }
    else {
      if (isJackCpu2) {
        isJackCpu2 = false;
        if (count > 0) skip = true;
      }
    }
    if (skip) {
      skip = false;
      showEffect(`CPU${cpu}：スキップ`, "skip");
    }
    else {
      let exist = true;
      const allhands = Array.from(allCards).filter(c => c.classList.contains(`face-down-H${cpu}`));
      if (allhands.length > 0 && count > 0) {
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
}

document.getElementById("rule-button").onclick = () => {
  const popup = document.getElementById("rule-popup");
  popup.classList.toggle("hidden");
};

createDeck();
renderDeck();
