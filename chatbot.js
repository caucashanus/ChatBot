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

  // Přidám vstupní gif ihned po načtení stránky
  const vstupniGif = document.createElement("img");
  vstupniGif.src = "https://rb-chat-bot.netlify.app/vstupnigif.gif";
  vstupniGif.className = "chatbot-maskot show";
  vstupniGif.id = "vstupni-gif";
  document.body.appendChild(vstupniGif);

  // Po 5 sekundách odstraním vstupní gif a zobrazím anim.gif
  setTimeout(() => {
    vstupniGif.classList.remove("show");
    vstupniGif.classList.add("hide");
    setTimeout(() => {
      vstupniGif.remove();
      // Zobrazím anim.gif (původní maskot)
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
    }, 500); // Krátké zpoždění pro plynulý přechod
  }, 5000);

  content.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.classList.contains("chatbot-button")) return;

    if (target.id === "btn-rezervace") {
      renderRezervace();
    } else if (target.id === "btn-cenik") {
      showCenikInfoModal();
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
    overlay.style.padding = "20px";
    overlay.style.boxSizing = "border-box";

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "row";
    wrapper.style.flexWrap = "wrap";
    wrapper.style.justifyContent = "center";
    wrapper.style.gap = "20px";
    wrapper.style.maxWidth = "100%";

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

    // Odstraním nadpis a místo něj přidám topBar s tlačítky X a Info centrovaně nad obrázky
    wrapper.innerHTML = '';
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'center';
    topBar.style.alignItems = 'center';
    topBar.style.gap = '10px';
    topBar.style.marginBottom = '18px';
    topBar.style.width = '100%';

    // Zavírací tlačítko
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Zavřít';
    closeBtn.className = 'face-overlay-close-btn';
    closeBtn.onclick = () => {
      const overlay = document.getElementById('face-overlay');
      if (overlay) overlay.remove();
    };
    topBar.appendChild(closeBtn);

    // Info tlačítko
    const infoBtn = document.createElement('button');
    infoBtn.innerHTML = '<span style="color:#fff;font-weight:bold;font-size:18px;">i</span>';
    infoBtn.title = 'Zobrazit informace';
    infoBtn.className = 'face-overlay-info-btn';
    infoBtn.onclick = (e) => {
      e.stopPropagation();
      showFaceInfoModal();
    };
    topBar.appendChild(infoBtn);

    wrapper.appendChild(topBar);

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

    // Přidání horní lišty s tlačítky (X a Info)
    // const topBar = document.createElement('div'); // This line is removed as per the new_code
    // topBar.style.position = 'absolute'; // This line is removed as per the new_code
    // topBar.style.top = '20px'; // This line is removed as per the new_code
    // topBar.style.right = '30px'; // This line is removed as per the new_code
    // topBar.style.display = 'flex'; // This line is removed as per the new_code
    // topBar.style.gap = '10px'; // This line is removed as per the new_code
    // topBar.style.zIndex = '10001'; // This line is removed as per the new_code

    // // Zavírací tlačítko // This block is removed as per the new_code
    // const closeBtn = document.createElement('button'); // This line is removed as per the new_code
    // closeBtn.innerHTML = '×'; // This line is removed as per the new_code
    // closeBtn.title = 'Zavřít'; // This line is removed as per the new_code
    // closeBtn.className = 'face-overlay-close-btn'; // This line is removed as per the new_code
    // closeBtn.onclick = () => { // This line is removed as per the new_code
    //   // Najdi a odstraň overlay // This line is removed as per the new_code
    //   const overlay = document.getElementById('face-overlay'); // This line is removed as per the new_code
    //   if (overlay) overlay.remove(); // This line is removed as per the new_code
    // }; // This line is removed as per the new_code

    // // Info tlačítko // This block is removed as per the new_code
    // const infoBtn = document.createElement('button'); // This line is removed as per the new_code
    // infoBtn.innerHTML = '<span style="color:#fff;font-weight:bold;font-size:18px;">i</span> Info'; // This line is removed as per the new_code
    // infoBtn.title = 'Zobrazit informace'; // This line is removed as per the new_code
    // infoBtn.className = 'face-overlay-info-btn'; // This line is removed as per the new_code
    // infoBtn.onclick = (e) => { // This line is removed as per the new_code
    //   e.stopPropagation(); // This line is removed as per the new_code
    //   showFaceInfoModal(); // This line is removed as per the new_code
    // }; // This line is removed as per the new_code

    // // Přidej topBar do wrapper.parentNode (tedy do overlayu) // This line is removed as per the new_code
    // if (wrapper.parentNode) { // This line is removed as per the new_code
    //   wrapper.parentNode.appendChild(topBar); // This line is removed as per the new_code
    // } // This line is removed as per the new_code
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

  // Funkce pro zobrazení info modalu
  function showFaceInfoModal() {
    const infoOverlay = document.createElement('div');
    infoOverlay.className = 'face-info-overlay';
    infoOverlay.style.position = 'fixed';
    infoOverlay.style.top = '0';
    infoOverlay.style.left = '0';
    infoOverlay.style.width = '100vw';
    infoOverlay.style.height = '100vh';
    infoOverlay.style.backgroundColor = 'rgba(0,0,0,0.92)';
    infoOverlay.style.zIndex = '11000';
    infoOverlay.style.display = 'flex';
    infoOverlay.style.alignItems = 'center';
    infoOverlay.style.justifyContent = 'center';
    infoOverlay.style.padding = '20px';
    infoOverlay.style.boxSizing = 'border-box';

    const infoBox = document.createElement('div');
    infoBox.className = 'face-info-box';
    infoBox.style.background = '#181818';
    infoBox.style.color = '#fff';
    infoBox.style.borderRadius = '12px';
    infoBox.style.maxWidth = '400px';
    infoBox.style.width = '100%';
    infoBox.style.padding = '30px 20px 20px 20px';
    infoBox.style.position = 'relative';
    infoBox.style.boxShadow = '0 4px 32px rgba(0,0,0,0.5)';
    infoBox.style.textAlign = 'left';

    // Zavírací tlačítko pro info box
    const infoClose = document.createElement('button');
    infoClose.innerHTML = '×';
    infoClose.title = 'Zavřít';
    infoClose.className = 'face-info-close-btn';
    infoClose.style.position = 'absolute';
    infoClose.style.top = '10px';
    infoClose.style.right = '15px';
    infoClose.onclick = () => infoOverlay.remove();
    infoBox.appendChild(infoClose);

    // Text info boxu
    const infoText = document.createElement('div');
    infoText.innerHTML = `Na základě tvaru Vašeho obličeje Vám nabízíme inspiraci v podobě vhodných účesů.<br><br>
    To však neznamená, že by Vám neslušely i jiné styly – každý člověk je jedinečný. Součástí každé naší služby je osobní konzultace, během které s Vámi náš stylista probere Vaše představy a zároveň nabídne svůj odborný pohled.<br><br>
    Naším cílem je splnit Vaše přání, nebo Vám naopak pomoci najít ideální střih přímo na míru.<br><br>
    Doporučujeme Vám také navštívit náš katalog účesů pro další inspiraci.`;
    infoBox.appendChild(infoText);

    // Katalog tlačítko
    const katalogBtn = document.createElement('button');
    katalogBtn.innerText = 'Katalog';
    katalogBtn.className = 'face-info-katalog-btn';
    katalogBtn.style.marginTop = '20px';
    katalogBtn.style.width = '100%';
    katalogBtn.style.padding = '12px';
    katalogBtn.style.background = '#F1F1F1';
    katalogBtn.style.color = '#0F0F0F';
    katalogBtn.style.border = 'none';
    katalogBtn.style.borderRadius = '6px';
    katalogBtn.style.fontSize = '16px';
    katalogBtn.style.cursor = 'pointer';
    katalogBtn.onclick = () => window.open('https://realbarber.cz/inspirace/', '_blank');
    infoBox.appendChild(katalogBtn);

    infoOverlay.appendChild(infoBox);
    document.body.appendChild(infoOverlay);

    // Zavření ESC
    document.addEventListener('keydown', function escInfoHandler(e) {
      if (e.key === 'Escape') {
        infoOverlay.remove();
        document.removeEventListener('keydown', escInfoHandler);
      }
    });
  }

  // Funkce pro zobrazení ceníkového info baru
  function showCenikInfoModal() {
    const infoOverlay = document.createElement('div');
    infoOverlay.className = 'face-info-overlay';
    infoOverlay.style.position = 'fixed';
    infoOverlay.style.top = '0';
    infoOverlay.style.left = '0';
    infoOverlay.style.width = '100vw';
    infoOverlay.style.height = '100vh';
    infoOverlay.style.backgroundColor = 'rgba(0,0,0,0.92)';
    infoOverlay.style.zIndex = '11000';
    infoOverlay.style.display = 'flex';
    infoOverlay.style.alignItems = 'center';
    infoOverlay.style.justifyContent = 'center';
    infoOverlay.style.padding = '20px';
    infoOverlay.style.boxSizing = 'border-box';

    const infoBox = document.createElement('div');
    infoBox.className = 'face-info-box cenik-info-box';
    infoBox.style.background = '#181818';
    infoBox.style.color = '#fff';
    infoBox.style.borderRadius = '12px';
    infoBox.style.maxWidth = '700px';
    infoBox.style.width = '100%';
    infoBox.style.padding = '30px 20px 20px 20px';
    infoBox.style.position = 'relative';
    infoBox.style.boxShadow = '0 4px 32px rgba(0,0,0,0.5)';
    infoBox.style.textAlign = 'left';
    infoBox.style.overflowY = 'auto';
    infoBox.style.maxHeight = '90vh';

    infoBox.innerHTML = `
      <button class="face-info-close-btn" id="cenik-close-btn" title="Zavřít" style="position:absolute;top:10px;right:15px;">×</button>
      <div class="selector-container">
        <div class="selector">
          <label>Vyberte pobočku:</label>
          <button class="branch-kacerov" id="cenik-kacerov">RB Kačerov</button>
          <button class="branch-modrany" id="cenik-modrany">RB Modřany</button>
          <button class="branch-strasnice" id="cenik-strasnice">RB Strašnice</button>
        </div>
        <div class="selector">
          <label>Vyberte úroveň holiče:</label>
          <button id="cenik-junior">Junior</button>
          <button id="cenik-senior">Senior</button>
          <button id="cenik-real">Real</button>
        </div>
        <div class="selector" id="cenik-beauty-selector">
          <label>Chcete něco z RB beauty? <span class="tooltip-icon">i<div class="tooltip">Služby z kategorie RB beauty jsou momentálně dostupné pouze na pobočce Kačerov.</div></span></label>
          <button id="cenik-yes">Ano</button>
          <button id="cenik-no">Ne</button>
        </div>
      </div>
      <table class="pricing-table">
        <thead><tr><th>Služba</th><th class="price-header">Cena</th></tr></thead>
        <tbody>
          <tr><td>Vlasy + vousy</td><td class="price" data-kacerov-junior="1000" data-kacerov-senior="1150" data-kacerov-real="1390" data-modrany-junior="1000" data-modrany-senior="1150" data-modrany-real="1390" data-strasnice-junior="1000" data-strasnice-senior="1150" data-strasnice-real="1390">1000 Kč</td></tr>
          <tr><td>Vlasy</td><td class="price" data-kacerov-junior="590" data-kacerov-senior="650" data-kacerov-real="790" data-modrany-junior="590" data-modrany-senior="650" data-modrany-real="790" data-strasnice-junior="590" data-strasnice-senior="650" data-strasnice-real="790">590 Kč</td></tr>
          <tr><td>Vousy</td><td class="price" data-kacerov-junior="490" data-kacerov-senior="550" data-kacerov-real="650" data-modrany-junior="490" data-modrany-senior="550" data-modrany-real="650" data-strasnice-junior="490" data-strasnice-senior="550" data-strasnice-real="650">490 Kč</td></tr>
          <tr><td>Vlasy do 12 let</td><td class="price" data-kacerov-junior="500" data-kacerov-senior="550" data-kacerov-real="690" data-modrany-junior="500" data-modrany-senior="550" data-modrany-real="690" data-strasnice-junior="500" data-strasnice-senior="550" data-strasnice-real="690">500 Kč</td></tr>
          <tr><td>Rychlé stříhání vlasů</td><td class="price" data-kacerov-junior="490" data-kacerov-senior="590" data-kacerov-real="650" data-modrany-junior="490" data-modrany-senior="590" data-modrany-real="650" data-strasnice-junior="490" data-strasnice-senior="590" data-strasnice-real="650">490 Kč</td></tr>
        </tbody>
      </table>
      <table class="pricing-table" id="cenik-beauty-pricing">
        <thead><tr><th>RB beauty</th><th class="price-header">Cena</th></tr></thead>
        <tbody>
          <tr><td>Kosmetika</td><td class="price">750 Kč</td></tr>
          <tr><td>Masáž celého těla</td><td class="price">990 Kč</td></tr>
          <tr><td>Antistresová masáž</td><td class="price">590 Kč</td></tr>
          <tr><td>Masáž šíje a rukou</td><td class="price">590 Kč</td></tr>
          <tr><td>Masáž celých zad</td><td class="price">590 Kč</td></tr>
          <tr><td>Masáž obličeje</td><td class="price">490 Kč</td></tr>
          <tr><td>Masáž 60minut</td><td class="price">990 Kč</td></tr>
          <tr><td>Masáž 85minut</td><td class="price">1290 Kč</td></tr>
        </tbody>
      </table>
      <table class="pricing-table" id="cenik-additional-services">
        <thead><tr><th>Doplňkové služby</th><th class="price-header">Cena</th></tr></thead>
        <tbody>
          <tr><td>Barvení vlasů <span class="tooltip-icon">i<div class="tooltip">Cena je pouze orientační, může být upravena podle techniky, délky a hustoty vlasů, či případných speciálních požadavků zákazníka. Pro detailní konzultaci přesnější cenu a rezervaci termínu nás prosím kontaktujte předem.</div></span></td><td class="price" data-kacerov-junior="2000" data-kacerov-senior="2500" data-kacerov-real="3000" data-modrany-junior="2000" data-modrany-senior="2500" data-modrany-real="3000" data-strasnice-junior="2000" data-strasnice-senior="2500" data-strasnice-real="3000">2000 Kč</td></tr>
          <tr><td>Barvení vousů</td><td class="price" data-kacerov-junior="350" data-kacerov-senior="490" data-kacerov-real="550" data-modrany-junior="350" data-modrany-senior="490" data-modrany-real="550" data-strasnice-junior="350" data-strasnice-senior="490" data-strasnice-real="550">350 Kč</td></tr>
          <tr><td>Epilace horkým voskem</td><td class="price" data-kacerov-junior="0" data-kacerov-senior="0" data-kacerov-real="0" data-modrany-junior="0" data-modrany-senior="0" data-modrany-real="0" data-strasnice-junior="0" data-strasnice-senior="0" data-strasnice-real="0">0</td></tr>
        </tbody>
      </table>
      <table class="pricing-table" id="cenik-home-services">
        <thead><tr><th>Služby k Vám domů <span class="tooltip-icon">i<div class="tooltip">Cestovné po Praze je již v ceně.</div></span></th><th class="price-header">Cena</th></tr></thead>
        <tbody>
          <tr><td>Vlasy + vousy</td><td class="price" data-kacerov-junior="2000" data-kacerov-senior="2000" data-kacerov-real="2000" data-modrany-junior="2000" data-modrany-senior="2000" data-modrany-real="2000" data-strasnice-junior="2000" data-strasnice-senior="2000" data-strasnice-real="1500">2000 Kč</td></tr>
          <tr><td>Vlasy</td><td class="price" data-kacerov-junior="1500" data-kacerov-senior="1500" data-kacerov-real="1500" data-modrany-junior="1500" data-modrany-senior="1500" data-modrany-real="1500" data-strasnice-junior="1500" data-strasnice-senior="1500" data-strasnice-real="1500">1500 Kč</td></tr>
          <tr><td>Vousy</td><td class="price" data-kacerov-junior="1000" data-kacerov-senior="1000" data-kacerov-real="1000" data-modrany-junior="1000" data-modrany-senior="1000" data-modrany-real="1000" data-strasnice-junior="1000" data-strasnice-senior="1000" data-strasnice-real="1000">1000 Kč</td></tr>
        </tbody>
      </table>
      <table class="pricing-table" id="cenik-video-services">
        <thead><tr><th>Video na míru</th><th class="price-header">Cena</th></tr></thead>
        <tbody>
          <tr><td>Video do 15 sekund</td><td class="price" data-kacerov-junior="1500" data-kacerov-senior="1500" data-kacerov-real="1500" data-modrany-junior="1500" data-modrany-senior="1500" data-modrany-real="1500" data-strasnice-junior="1500" data-strasnice-senior="1500" data-strasnice-real="1500">1500 Kč</td></tr>
          <tr><td>Video do 30 sekund</td><td class="price" data-kacerov-junior="2200" data-kacerov-senior="2200" data-kacerov-real="2200" data-modrany-junior="2200" data-modrany-senior="2200" data-modrany-real="2200" data-strasnice-junior="2200" data-strasnice-senior="2200" data-strasnice-real="2200">2200 Kč</td></tr>
          <tr><td>Video do 1 minuty</td><td class="price" data-kacerov-junior="3900" data-kacerov-senior="3900" data-kacerov-real="3900" data-modrany-junior="3900" data-modrany-senior="3900" data-modrany-real="3900" data-strasnice-junior="3900" data-strasnice-senior="3900" data-strasnice-real="3900">3900 Kč</td></tr>
        </tbody>
      </table>
      <div class="selected-branch" id="cenik-selected-branch">Ceník platný na pobočce: RB Kačerov</div>
      <div class="beauty-warning" id="cenik-beauty-warning">Služby z kategorie RB beauty jsou momentálně dostupné pouze na pobočce Kačerov</div>
    `;

    infoOverlay.appendChild(infoBox);
    document.body.appendChild(infoOverlay);

    // Logika ceníku v modalu
    let selectedBranch = 'kacerov';
    let selectedSpecialist = 'junior';
    let beautySelected = 'yes';

    function updatePrices() {
      var prices = infoBox.querySelectorAll('.price');
      prices.forEach(function(price) {
        const dataAttr = `data-${selectedBranch}-${selectedSpecialist}`;
        if (price.hasAttribute(dataAttr)) {
          price.textContent = price.getAttribute(dataAttr) + ' Kč';
        }
      });
    }
    function updateSelectedBranch() {
      const branchNames = {
        'kacerov': 'RB Kačerov',
        'modrany': 'RB Modřany',
        'strasnice': 'RB Strašnice'
      };
      infoBox.querySelector('#cenik-selected-branch').textContent = 'Ceník platný na pobočce: ' + branchNames[selectedBranch];
    }
    function updateBeautyVisibility() {
      const isBeautyVisible = selectedBranch === 'kacerov' && beautySelected === 'yes';
      infoBox.querySelector('#cenik-beauty-pricing').style.display = isBeautyVisible ? '' : 'none';
      infoBox.querySelector('#cenik-beauty-warning').style.display = isBeautyVisible ? '' : 'none';
      infoBox.querySelector('#cenik-beauty-selector').style.display = selectedBranch === 'kacerov' ? '' : 'none';
    }
    // Eventy pro výběr pobočky
    infoBox.querySelector('#cenik-kacerov').onclick = function() {
      selectedBranch = 'kacerov';
      infoBox.querySelectorAll('.branch-kacerov, .branch-modrany, .branch-strasnice').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updatePrices();
      updateSelectedBranch();
      updateBeautyVisibility();
    };
    infoBox.querySelector('#cenik-modrany').onclick = function() {
      selectedBranch = 'modrany';
      infoBox.querySelectorAll('.branch-kacerov, .branch-modrany, .branch-strasnice').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updatePrices();
      updateSelectedBranch();
      updateBeautyVisibility();
    };
    infoBox.querySelector('#cenik-strasnice').onclick = function() {
      selectedBranch = 'strasnice';
      infoBox.querySelectorAll('.branch-kacerov, .branch-modrany, .branch-strasnice').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updatePrices();
      updateSelectedBranch();
      updateBeautyVisibility();
    };
    // Eventy pro výběr specialisty
    infoBox.querySelector('#cenik-junior').onclick = function() {
      selectedSpecialist = 'junior';
      infoBox.querySelectorAll('#cenik-junior, #cenik-senior, #cenik-real').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updatePrices();
    };
    infoBox.querySelector('#cenik-senior').onclick = function() {
      selectedSpecialist = 'senior';
      infoBox.querySelectorAll('#cenik-junior, #cenik-senior, #cenik-real').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updatePrices();
    };
    infoBox.querySelector('#cenik-real').onclick = function() {
      selectedSpecialist = 'real';
      infoBox.querySelectorAll('#cenik-junior, #cenik-senior, #cenik-real').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updatePrices();
    };
    // Eventy pro beauty
    infoBox.querySelector('#cenik-yes').onclick = function() {
      beautySelected = 'yes';
      infoBox.querySelectorAll('#cenik-yes, #cenik-no').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updateBeautyVisibility();
    };
    infoBox.querySelector('#cenik-no').onclick = function() {
      beautySelected = 'no';
      infoBox.querySelectorAll('#cenik-yes, #cenik-no').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updateBeautyVisibility();
    };
    // Tooltipy
    infoBox.querySelectorAll('.tooltip-icon').forEach(icon => {
      icon.onmouseenter = () => icon.querySelector('.tooltip').style.display = 'block';
      icon.onmouseleave = () => icon.querySelector('.tooltip').style.display = 'none';
      icon.onfocus = () => icon.querySelector('.tooltip').style.display = 'block';
      icon.onblur = () => icon.querySelector('.tooltip').style.display = 'none';
    });
    // Funkčnost zavíracího tlačítka X
    infoBox.querySelector('#cenik-close-btn').onclick = () => infoOverlay.remove();
    // Inicializace
    infoBox.querySelector('#cenik-kacerov').classList.add('active');
    infoBox.querySelector('#cenik-junior').classList.add('active');
    infoBox.querySelector('#cenik-yes').classList.add('active');
    updatePrices();
    updateSelectedBranch();
    updateBeautyVisibility();

    // Zavření ESC
    document.addEventListener('keydown', function escInfoHandler(e) {
      if (e.key === 'Escape') {
        infoOverlay.remove();
        document.removeEventListener('keydown', escInfoHandler);
      }
    });
  }

  // Přidám input pole a tlačítko pro dotaz uživatele
  const userInputWrapper = document.createElement('div');
  userInputWrapper.style.display = 'flex';
  userInputWrapper.style.gap = '8px';
  userInputWrapper.style.marginTop = '16px';

  const userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.placeholder = 'Zeptejte se na cokoliv...';
  userInput.id = 'chatbot-user-input';
  userInput.style.flex = '1';
  userInput.style.padding = '8px';
  userInput.style.borderRadius = '6px';
  userInput.style.border = '1px solid #444';
  userInput.style.background = '#181818';
  userInput.style.color = '#fff';

  const sendBtn = document.createElement('button');
  sendBtn.textContent = 'Odeslat';
  sendBtn.id = 'chatbot-send-btn';
  sendBtn.style.padding = '8px 16px';
  sendBtn.style.borderRadius = '6px';
  sendBtn.style.border = 'none';
  sendBtn.style.background = '#1A1A1A';
  sendBtn.style.color = '#F1F1F1';
  sendBtn.style.cursor = 'pointer';
  sendBtn.style.fontWeight = 'bold';

  userInputWrapper.appendChild(userInput);
  userInputWrapper.appendChild(sendBtn);
  content.appendChild(userInputWrapper);

  // Funkce pro zpracování dotazu
  async function processUserQuery() {
    const dotaz = userInput.value.trim();
    if (!dotaz) return;
    userInput.value = '';

    // Zobraz dotaz uživatele v chatu
    const userMsg = document.createElement('div');
    userMsg.className = 'chatbot-user-msg';
    userMsg.style.margin = '12px 0 4px 0';
    userMsg.style.textAlign = 'right';
    userMsg.style.color = '#F1F1F1';
    userMsg.textContent = dotaz;
    content.appendChild(userMsg);

    // Zobraz loading
    const odpoved = document.createElement('div');
    odpoved.className = 'chatbot-answer';
    odpoved.style.margin = '4px 0 16px 0';
    odpoved.style.color = '#F1F1F1';
    odpoved.textContent = 'Hledám odpověď...';
    content.appendChild(odpoved);
    content.scrollTop = content.scrollHeight;

    // Stáhni články a stránky z WordPressu
    let posts = [];
    let pages = [];
    try {
      const [postsRes, pagesRes] = await Promise.all([
        fetch('https://realbarber.cz/wp-json/wp/v2/posts?per_page=100'),
        fetch('https://realbarber.cz/wp-json/wp/v2/pages?per_page=100')
      ]);
      posts = await postsRes.json();
      pages = await pagesRes.json();
    } catch (e) {
      odpoved.textContent = 'Chyba při načítání dat.';
      return;
    }
    // Spojíme články a stránky
    const all = [...posts, ...pages];
    // Najdi relevantní článek/stránku (titulek nebo obsah)
    const nalezeny = all.find(post =>
      (post.title && post.title.rendered && post.title.rendered.toLowerCase().includes(dotaz.toLowerCase())) ||
      (post.content && post.content.rendered && post.content.rendered.toLowerCase().includes(dotaz.toLowerCase()))
    );
    if (nalezeny) {
      // Vytvoř shrnutí (prvních 200 znaků bez HTML)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = nalezeny.content.rendered || '';
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      const shrnuti = plainText.length > 200 ? plainText.slice(0, 200) + '…' : plainText;
      odpoved.innerHTML = `<strong>${nalezeny.title.rendered}</strong><br>${shrnuti}<br><a href="${nalezeny.link}" target="_blank" style="color:#F1F1F1;text-decoration:underline;">Celý článek</a>`;
    } else {
      odpoved.textContent = 'Na tuto otázku nemám odpověď.';
    }
    content.scrollTop = content.scrollHeight;
  }

  // Odeslání dotazu klikem nebo Enterem
  sendBtn.onclick = processUserQuery;
  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') processUserQuery();
  });
});
