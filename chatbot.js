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

  // === MASKOT S CHOVÁNÍM ===
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

  // === JEDINÝ LISTENER NA OBSAH ===
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
      showHairAdvice(target.dataset.faceShape);
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

  function renderFaceShapesOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "face-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
    overlay.style.zIndex = "10000";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.gap = "20px";

    const faceShapes = [
      { src: "oval.gif", class: "gif-oval" },
      { src: "kulaty.gif", class: "gif-kulaty" },
      { src: "hranaty.gif", class: "gif-hranaty" }
    ];

    faceShapes.forEach(({ src, class: className }) => {
      const img = document.createElement("img");
      img.src = src;
      img.dataset.faceShape = src.split(".")[0];
      img.classList.add("face-gif", className);
      img.style.cursor = "pointer";
      wrapper.appendChild(img);
    });

    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", escHandler);
      }
    });

    wrapper.querySelectorAll(".face-gif").forEach((gif) => {
      gif.addEventListener("click", () => {
        overlay.remove();
        showHairAdvice(gif.dataset.faceShape);
      });
    });
  }

  function showHairAdvice(type) {
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
      <button class="chatbot-button" id="back-to-start">↩️ Zpět na začátek</button>
    `;
  }

  function resetChat() {
    content.innerHTML = `
      <button class="chatbot-button" id="btn-rezervace">💈 Chci se objednat</button>
      <button class="chatbot-button" id="btn-cenik">💵 Chci znát ceny</button>
      <button class="chatbot-button" id="btn-uces">💡 Chci poradit účes</button>
      <button class="chatbot-button" id="faq-button">💬 Potřebuju poradit</button>
    `;
  }

  function showFAQ() {
    content.innerHTML = `
      <p>Často kladené otázky:</p>
      <div class="faq-item">
        <button class="faq-question">❓ Jak se mohu objednat?</button>
        <div class="faq-answer">
          Můžeš nám <a href="tel:+420608332881">zavolat</a> nebo použít online rezervaci na stránce
          <a href="https://realbarber.cz/rezervace/">Rezervace</a>.
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question">❓ Jak dlouho trvá střihání?</button>
        <div class="faq-answer">
          <p><strong>Obvyklá délka jednotlivých služeb:</strong></p>
          <ul>
            <li><a href="https://realbarber.cz/sluzby/barber-klasicke-moderni-strihani-vlasu/">💇‍♂️ Stříhání vlasů</a>: 30–50 minut</li>
            <li><a href="https://realbarber.cz/sluzby/uprava-vousu/">🧔 Úprava vousů</a>: 25–35 minut</li>
            <li><a href="https://realbarber.cz/sluzby/kompletni-pece-real-barber/">💈 Stříhání + vousy</a>: 50–80 minut</li>
            <li><a href="https://realbarber.cz/sluzby/detske-strihani-do-12-let/">👦 Dětské stříhání</a>: 20–35 minut</li>
          </ul>
        </div>
      </div>
      <div class="faq-item">
        <button class="faq-question">❓ Můžu platit kartou?</button>
        <div class="faq-answer">Ano, na všech našich pobočkách máme platební terminály.</div>
      </div>
      <button class="chatbot-button" id="back-to-start">↩️ Zpět</button>
    `;

    const questions = content.querySelectorAll('.faq-question');
    const answers = content.querySelectorAll('.faq-answer');

    answers.forEach((a) => (a.style.display = 'none'));

    questions.forEach((btn) => {
      btn.addEventListener('click', function () {
        const thisAnswer = this.nextElementSibling;
        answers.forEach((a) => {
          if (a !== thisAnswer) a.style.display = 'none';
        });
        thisAnswer.style.display = thisAnswer.style.display === 'block' ? 'none' : 'block';
      });
    });
  }
});
