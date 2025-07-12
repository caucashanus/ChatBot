document.addEventListener("DOMContentLoaded", function () {
  const hour = new Date().getHours();
  let greeting = "Vítej v Real Barber!";
  if (hour < 11) greeting = "Dobré ráno! ☀️";
  else if (hour < 18) greeting = "Dobrý den! 👋";
  else greeting = "Krásný večer! 🌙";

  const container = document.createElement("div");
  container.id = "chatbot-container";

  container.innerHTML = `
    <button id="chatbot-toggle">💬</button>
    <div id="chatbot-box">
      <h4>${greeting}</h4>
      <div id="chatbot-content">
        <button class="chatbot-button" id="btn-rezervace">💈 Chci se objednat</button>
        <button class="chatbot-button" id="btn-cenik">💵 Chci znát ceny</button>
        <button class="chatbot-button" id="btn-uces">💡 Chci poradit účes</button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const toggle = document.getElementById("chatbot-toggle");
  const box = document.getElementById("chatbot-box");
  const content = document.getElementById("chatbot-content");

  toggle.addEventListener("click", () => {
    const isVisible = box.style.display === "block";
    box.style.display = isVisible ? "none" : "block";
    toggle.textContent = isVisible ? "💬" : "❌";
  });

  setTimeout(() => {
    const maskot = document.createElement("img");
    maskot.src = "https://rb-chat-bot.netlify.app/anim.gif";
    maskot.className = "chatbot-maskot show";
    maskot.id = "chatbot-maskot";
    document.body.appendChild(maskot);

    maskot.onclick = () => {
      maskot.classList.remove("show");
      maskot.classList.add("hide");

      setTimeout(() => {
        maskot.remove();
        toggle.style.display = "block";
        box.style.display = "block";
        toggle.textContent = "❌";
      }, 500);
    };
  }, 3000);

  content.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.classList.contains("chatbot-button")) return;

    if (target.id === "btn-rezervace") {
      renderRezervace();
    } else if (target.id === "btn-cenik") {
      window.location.href = 'https://realbarber.cz/cenik/';
    } else if (target.id === "btn-uces") {
      renderUcesOptions();
    } else if (target.dataset.faceShape) {
      renderHaircutSuggestions(target.dataset.faceShape);
    } else if (target.id === "back-to-start") {
      resetChat();
    } else if (target.id === "faq-button") {
      showFAQ();
    } else if (target.id === "show-face-shapes") {
      renderFaceShapesOverlay();
    }
  });

  function renderRezervace() {
    content.innerHTML = `
      <p>S čím ti můžeme pomoci?</p>
      <button class="chatbot-button" onclick="window.location.href='tel:+420608332881'">📞 Zavolat a objednat se</button>
      <button class="chatbot-button" onclick="window.location.href='https://realbarber.cz/rezervace/'">🌐 Objednat se online</button>
      <button class="chatbot-button" id="faq-button">💬 Potřebuju poradit</button>
      <button class="chatbot-button" id="back-to-start">↩️ Zpět</button>
    `;
  }

  function renderUcesOptions() {
    content.innerHTML = `
      <p>Jak ti mám poradit účes?</p>
      <button class="chatbot-button" onclick="window.location.href='https://realbarber.cz/inspirace/'">📸 Chci si prohlédnout katalog všech účesů</button>
      <button class="chatbot-button" id="show-face-shapes">🧠 Vybrat mi účes dle mého tvaru obličeje</button>
      <button class="chatbot-button" id="back-to-start">↩️ Zpět</button>
    `;
  }

  function showInfoOverlay() {
    const infoOverlay = document.createElement("div");
    infoOverlay.style.position = "fixed";
    infoOverlay.style.top = "0";
    infoOverlay.style.left = "0";
    infoOverlay.style.width = "100vw";
    infoOverlay.style.height = "100vh";
    infoOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    infoOverlay.style.zIndex = "10001";
    infoOverlay.style.display = "flex";
    infoOverlay.style.justifyContent = "center";
    infoOverlay.style.alignItems = "center";
    infoOverlay.style.padding = "20px";
    infoOverlay.style.boxSizing = "border-box";

    const box = document.createElement("div");
    box.style.maxWidth = "600px";
    box.style.backgroundColor = "#111";
    box.style.color = "#fff";
    box.style.padding = "20px";
    box.style.borderRadius = "10px";
    box.style.textAlign = "left";
    box.style.position = "relative";

    const close = document.createElement("span");
    close.textContent = "×";
    close.style.position = "absolute";
    close.style.top = "10px";
    close.style.right = "15px";
    close.style.cursor = "pointer";
    close.style.fontSize = "20px";
    close.style.fontWeight = "bold";

    close.onclick = () => infoOverlay.remove();

    const paragraph = document.createElement("p");
    paragraph.innerHTML = `
      Na základě tvaru Vašeho obličeje Vám nabízíme inspiraci v podobě vhodných účesů.<br><br>
      To však neznamená, že by Vám neslušely i jiné styly – každý člověk je jedinečný. Součástí každé naší služby je osobní konzultace, během které s Vámi náš stylista probere Vaše představy a zároveň nabídne svůj odborný pohled.<br><br>
      Naším cílem je splnit Vaše přání, nebo Vám naopak pomoci najít ideální střih přímo na míru.<br><br>
    `;

    const katalogBtn = document.createElement("a");
    katalogBtn.href = "https://realbarber.cz/inspirace/";
    katalogBtn.target = "_blank";
    katalogBtn.textContent = "Katalog účesů";
    katalogBtn.style.display = "inline-block";
    katalogBtn.style.marginTop = "10px";
    katalogBtn.style.padding = "10px 20px";
    katalogBtn.style.backgroundColor = "#333";
    katalogBtn.style.color = "#fff";
    katalogBtn.style.borderRadius = "5px";
    katalogBtn.style.textDecoration = "none";

    box.appendChild(close);
    box.appendChild(paragraph);
    box.appendChild(katalogBtn);
    infoOverlay.appendChild(box);
    document.body.appendChild(infoOverlay);
  }

  window.showInfoOverlay = showInfoOverlay;
});
