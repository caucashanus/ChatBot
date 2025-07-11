document.addEventListener("DOMContentLoaded", function () {
  const container = document.createElement("div");
  container.id = "chatbot-container";

    container.innerHTML = `
    <button id="chatbot-toggle">💬</button>
    <div id="chatbot-box">
      <h4>Vítej v Real Barber!</h4>
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
    box.style.display = box.style.display === "block" ? "none" : "block";
  });

  document.getElementById("btn-rezervace").onclick = function () {
  content.innerHTML = `
    <p>S čím ti můžeme pomoci?</p>
    <button class="chatbot-button" onclick="window.location.href='tel:+420608332881'">📞 Zavolat a objednat se</button>
    <button class="chatbot-button" onclick="window.location.href='https://realbarber.cz/rezervace/'">🌐 Objednat se online</button>
    <button class="chatbot-button" onclick="window.location.href='https://realbarber.cz/kontakt/'">💬 Potřebuju poradit</button>
    <button class="chatbot-button" onclick="resetChat()">↩️ Zpět</button>
  `;
};

  document.getElementById("btn-cenik").onclick = function () {
    window.location.href = 'https://realbarber.cz/cenik/';
  };

  document.getElementById("btn-uces").onclick = function () {
    content.innerHTML = `
      <p>Jak ti mám poradit účes?</p>
      <button class="chatbot-button" onclick="window.location.href='https://realbarber.cz/inspirace/'">📸 Vybrat si účes z katalogu</button>
      <button class="chatbot-button" onclick="showFaceShapeOptions()">🧠 Vybrat podle tvaru obličeje</button>
      <button class="chatbot-button" onclick="resetChat()">↩️ Zpět</button>
    `;
  };
  window.showFaceShapeOptions = function () {
    content.innerHTML = `
      <p>Jaký máš tvar obličeje?</p>
      <button class="chatbot-button" onclick="showHairAdvice('oval')">Oválný</button>
      <button class="chatbot-button" onclick="showHairAdvice('kulaty')">Kulatý</button>
      <button class="chatbot-button" onclick="showHairAdvice('hranaty')">Hranatý</button>
      <button class="chatbot-button" onclick="resetChat()">↩️ Zpět</button>
    `;
  };

  window.showHairAdvice = function (type) {
    let message = "";
    if (type === "oval") {
      message = "Máte ideální tvar obličeje – hodí se vám téměř každý střih. Doporučujeme fade nebo slick back.";
    } else if (type === "kulaty") {
      message = "Zkuste účesy, které prodlouží obličej – pompadour, high fade nebo undercut s objemem nahoře.";
    } else if (type === "hranaty") {
      message = "U hranatého obličeje skvěle fungují kratší boky a více textury nahoře – zkuste crop nebo quiff.";
    }

    content.innerHTML = `
      <p>${message}</p>
      <button class="chatbot-button" onclick="resetChat()">↩️ Zpět na začátek</button>
    `;
  };

  window.resetChat = function () {
    content.innerHTML = `
      <button class="chatbot-button" id="btn-rezervace">💈 Chci se objednat</button>
      <button class="chatbot-button" id="btn-cenik">💵 Chci znát ceny</button>
      <button class="chatbot-button" id="btn-uces">💡 Chci poradit účes</button>
    `;

    document.getElementById("btn-rezervace").onclick = function () {
      window.location.href = 'https://realbarber.cz/rezervace/';
    };

    document.getElementById("btn-cenik").onclick = function () {
      window.location.href = 'https://realbarber.cz/cenik/';
    };

    document.getElementById("btn-uces").onclick = function () {
      content.innerHTML = `
        <p>Jak ti mám poradit účes?</p>
        <button class="chatbot-button" onclick="window.location.href='https://realbarber.cz/inspirace/'">📸 Vybrat si účes z katalogu</button>
        <button class="chatbot-button" onclick="showFaceShapeOptions()">🧠 Vybrat podle tvaru obličeje</button>
        <button class="chatbot-button" onclick="resetChat()">↩️ Zpět</button>
      `;
    };
  };
});
