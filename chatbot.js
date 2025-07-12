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
      { src: "https://rb-chat-bot.netlify.app/oval.gif", class: "gif-oval", label: "Oválný" },
      { src: "https://rb-chat-bot.netlify.app/kulaty.gif", class: "gif-kulaty", label: "Kulatý" },
      { src: "https://rb-chat-bot.netlify.app/hranaty.gif", class: "gif-hranaty", label: "Hranatý" }
    ];

    faceShapes.forEach(({ src, class: className, label: labelText }) => {
      const container = document.createElement("div");
      container.style.textAlign = "center";

      const img = document.createElement("img");
      img.src = src;
      img.dataset.faceShape = labelText.toLowerCase();
      img.classList.add("face-gif", className);
      img.style.cursor = "pointer";

      const label = document.createElement("div");
      label.textContent = labelText;
      label.style.color = "#fff";
      label.style.marginTop = "8px";
      label.style.fontWeight = "bold";
      label.style.fontSize = "14px";

      container.appendChild(img);
      container.appendChild(label);
      wrapper.appendChild(container);
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
        wrapper.innerHTML = "";
        renderHaircutSuggestions(gif.dataset.faceShape, wrapper);
      });
    });
  }

  function renderHaircutSuggestions(type, wrapper) {
    const haircutSets = {
      "oválný": [
        { src: "buzzcut.jpg", url: "https://realbarber.cz/sluzby/buzz-cut/", label: "Buzzcut" },
        { src: "fade.jpg", url: "https://realbarber.cz/sluzby/fade/", label: "Fade" },
        { src: "pompadour.jpg", url: "https://realbarber.cz/sluzby/pompadour/", label: "Pompadour" },
        { src: "quiff.jpg", url: "https://realbarber.cz/sluzby/quiff/", label: "Quiff" },
        { src: "undercut.jpg", url: "https://realbarber.cz/sluzby/undercut/", label: "Undercut" },
        { src: "classic.jpg", url: "https://realbarber.cz/sluzby/classic/", label: "Classic" }
      ],
      "kulatý": [
        { src: "textured.jpg", url: "https://realbarber.cz/sluzby/textured/", label: "Textured" },
        { src: "sidepart.jpg", url: "https://realbarber.cz/sluzby/side-part/", label: "Side Part" },
        { src: "messy.jpg", url: "https://realbarber.cz/sluzby/messy/", label: "Messy" },
        { src: "spiky.jpg", url: "https://realbarber.cz/sluzby/spiky/", label: "Spiky" },
        { src: "layered.jpg", url: "https://realbarber.cz/sluzby/layered/", label: "Layered" },
        { src: "angular.jpg", url: "https://realbarber.cz/sluzby/angular/", label: "Angular" }
      ],
      "hranatý": [
        { src: "https://rb-chat-bot.netlify.app/taperfade.jpg", url: "https://realbarber.cz/sluzby/taper-fade-na-afro-vlasech/", label: "Taper Fade" },
        { src: "wavy.jpg", url: "https://realbarber.cz/sluzby/wavy/", label: "Wavy" },
        { src: "curved.jpg", url: "https://realbarber.cz/sluzby/curved/", label: "Curved" },
        { src: "rounded.jpg", url: "https://realbarber.cz/sluzby/rounded/", label: "Rounded" },
        { src: "flowing.jpg", url: "https://realbarber.cz/sluzby/flowing/", label: "Flowing" },
        { src: "smooth.jpg", url: "https://realbarber.cz/sluzby/smooth/", label: "Smooth" }
      ]
    };

    const selected = haircutSets[type];
    selected.forEach(({ src, url, label }) => {
      const container = document.createElement("div");
      container.style.textAlign = "center";

      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";

      const img = document.createElement("img");
      img.src = src;
      img.style.width = "100px";
      img.style.borderRadius = "10px";
      img.style.margin = "10px";
      img.style.display = "block";
      a.appendChild(img);

      const caption = document.createElement("div");
      caption.textContent = label;
      caption.style.color = "#fff";
      caption.style.marginTop = "5px";
      caption.style.fontSize = "14px";
      caption.style.fontWeight = "bold";

      container.appendChild(a);
      container.appendChild(caption);
      wrapper.appendChild(container);
    });
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
