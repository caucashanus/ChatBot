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
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "20px";
    overlay.style.boxSizing = "border-box";

    const controls = document.createElement("div");
    controls.style.position = "absolute";
    controls.style.top = "10px";
    controls.style.right = "10px";
    controls.style.display = "flex";
    controls.style.gap = "10px";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.fontSize = "24px";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "white";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => overlay.remove();

    const infoBtn = document.createElement("button");
    infoBtn.textContent = "ℹ️ Info";
    infoBtn.style.fontSize = "16px";
    infoBtn.style.background = "#1A1A1A";
    infoBtn.style.color = "#fff";
    infoBtn.style.border = "1px solid #fff";
    infoBtn.style.borderRadius = "5px";
    infoBtn.style.cursor = "pointer";
    infoBtn.onclick = () => showInfoOverlay();

    controls.appendChild(infoBtn);
    controls.appendChild(closeBtn);
    overlay.appendChild(controls);

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexWrap = "wrap";
    wrapper.style.justifyContent = "center";
    wrapper.style.gap = "20px";
    wrapper.style.maxWidth = "100%"

    const faceShapes = [
      { src: "https://rb-chat-bot.netlify.app/oval.gif", class: "gif-oval", label: "Oválný" },
      { src: "https://rb-chat-bot.netlify.app/kulaty.gif", class: "gif-kulaty", label: "Kulatý" },
      { src: "https://rb-chat-bot.netlify.app/hranaty.gif", class: "gif-hranaty", label: "Hranatý" }
    ];

    faceShapes.forEach(({ src, class: className, label: labelText }) => {
      const container = document.createElement("div");
      container.style.textAlign = "center";
      container.style.width = "100px";

      const img = document.createElement("img");
      img.src = src;
      img.dataset.faceShape = labelText.toLowerCase();
      img.classList.add("face-gif", className);
      img.style.cursor = "pointer";
      img.style.width = "100%";

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
  function showInfoOverlay() {
      const infoOverlay = document.createElement("div");
      infoOverlay.style.position = "fixed";
      infoOverlay.style.top = "0";
      infoOverlay.style.left = "0";
      infoOverlay.style.width = "100vw";
      infoOverlay.style.height = "100vh";
      infoOverlay.style.backgroundColor = "rgba(0,0,0,0.95)";
      infoOverlay.style.zIndex = "10001";
      infoOverlay.style.display = "flex";
      infoOverlay.style.flexDirection = "column";
      infoOverlay.style.alignItems = "center";
      infoOverlay.style.justifyContent = "center";
      infoOverlay.style.padding = "20px";
      infoOverlay.style.boxSizing = "border-box";
      infoOverlay.style.color = "#fff";

      const close = document.createElement("button");
      close.textContent = "Zavřít";
      close.style.marginTop = "20px";
      close.style.padding = "10px 20px";
      close.style.fontSize = "16px";
      close.style.cursor = "pointer";
      close.style.background = "#1A1A1A";
      close.style.color = "#fff";
      close.style.border = "1px solid #fff";
      close.style.borderRadius = "5px";
      close.onclick = () => infoOverlay.remove();

      const text = document.createElement("div");
      text.style.maxWidth = "600px";
      text.style.textAlign = "center";
      text.style.fontSize = "16px";
      text.style.lineHeight = "1.6";
      text.innerHTML = `
        <p>Na základě tvaru Vašeho obličeje Vám nabízíme inspiraci v podobě vhodných účesů.</p>
        <p>To však neznamená, že by Vám neslušely i jiné styly – každý člověk je jedinečný. Součástí každé naší služby je osobní konzultace, během které s Vámi náš stylista probere Vaše představy a zároveň nabídne svůj odborný pohled.</p>
        <p>Naším cílem je splnit Vaše přání, nebo Vám naopak pomoci najít ideální střih přímo na míru.</p>
        <a href="https://realbarber.cz/inspirace/" target="_blank" style="color: #fff; text-decoration: underline; font-weight: bold; display: inline-block; margin-top: 10px;">Katalog</a>
      `;

      infoOverlay.appendChild(text);
      infoOverlay.appendChild(close);
      document.body.appendChild(infoOverlay);
    }
  }
});

  function renderHaircutSuggestions(type, wrapper) {
    const haircutSets = {
      "oválný": [
        { src: "https://rb-chat-bot.netlify.app/oldmoney.jpg", url: "https://realbarber.cz/sluzby/old-money-haircut/", label: "Old Money" },
        { src: "https://rb-chat-bot.netlify.app/frenchcrop.jpg", url: "https://realbarber.cz/sluzby/french-crop/", label: "French Crop" },
        { src: "https://rb-chat-bot.netlify.app/ucesmcgrergor.jpg", url: "https://realbarber.cz/sluzby/uces-conor-mcgregor/", label: "Conor Mcgregor" },
        { src: "https://rb-chat-bot.netlify.app/slickback.jpg", url: "https://realbarber.cz/sluzby/slick-back/", label: "Slickback" },
        { src: "https://rb-chat-bot.netlify.app/elegantni.png", url: "https://realbarber.cz/sluzby/elegantne-nacesane-vlasy-dozadu-s-vytratem-na-krku/", label: "Classic" }
      ],
      "kulatý": [
        { src: "https://rb-chat-bot.netlify.app/yzouces.jpg", url: "https://realbarber.cz/sluzby/uces-yzomandias-crop/", label: "Účes Yzomandias" },
        { src: "https://rb-chat-bot.netlify.app/undercut.jpg", url: "https://realbarber.cz/sluzby/undercut-se-skin-fade/", label: "Under Cut" },
        { src: "https://rb-chat-bot.netlify.app/sergeiuces.jpg", url: "https://realbarber.cz/sluzby/uces-sergei-barracuda/", label: "Účes Sergei Barracuda" },
        { src: "https://rb-chat-bot.netlify.app/fringeup.jpg", url: "https://realbarber.cz/sluzby/fringe-up-upravene-vousy/", label: "Fringe Up" },
        { src: "https://rb-chat-bot.netlify.app/quiff.jpg", url: "https://realbarber.cz/sluzby/faux-hawk-2/", label: "Faux Hawk" },
      ],
      "hranatý": [
        { src: "https://rb-chat-bot.netlify.app/taperfade.jpg", url: "https://realbarber.cz/sluzby/taper-fade-na-afro-vlasech/", label: "Taper Fade" },
        { src: "https://rb-chat-bot.netlify.app/wavytop.jpg", url: "https://realbarber.cz/sluzby/wavy-top-s-taper-fadem/", label: "Wavy Top" },
        { src: "https://rb-chat-bot.netlify.app/fluffy.jpg", url: "https://realbarber.cz/sluzby/fluffy-uces/", label: "Fluffy účes" },
        { src: "https://rb-chat-bot.netlify.app/pushedback.jpg", url: "https://realbarber.cz/sluzby/pushed-back/", label: "Pushed Back" },
        { src: "https://rb-chat-bot.netlify.app/vlasydopredu.jpg", url: "https://realbarber.cz/sluzby/rozcuchane-vlasy-dopredu/", label: "Rozcuchané vlasy" }
      ]
    };

    wrapper.style.display = "flex";
    wrapper.style.flexWrap = "wrap";
    wrapper.style.justifyContent = "center";
    wrapper.style.gap = "20px";

    const selected = haircutSets[type];
    selected.forEach(({ src, url, label }) => {
      const container = document.createElement("div");
      container.style.textAlign = "center";
      container.style.width = "150px";
      container.style.boxSizing = "border-box";

      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";

      const img = document.createElement("img");
      img.src = src;
      img.style.width = "100%";
      img.style.borderRadius = "10px";
      img.style.marginBottom = "5px";
      img.style.display = "block";
      a.appendChild(img);

      const caption = document.createElement("div");
      caption.textContent = label;
      caption.style.color = "#fff";
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
