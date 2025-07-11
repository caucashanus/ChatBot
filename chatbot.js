
document.addEventListener("DOMContentLoaded", function () {
  const container = document.createElement("div");
  container.id = "chatbot-container";

  container.innerHTML = `
    <button id="chatbot-toggle">💬</button>
    <div id="chatbot-box">
      <h4>Vítej v Real Barber!</h4>
      <button class="chatbot-button" onclick="window.location.href='https://realbarber.cz/rezervace/'">💈 Chci se objednat</button>
      <button class="chatbot-button" onclick="window.location.href='https://realbarber.cz/cenik/'">💵 Chci znát ceny</button>
      <button class="chatbot-button" onclick="window.location.href='https://realbarber.cz/inspirace/'">💡 Chci poradit účes</button>
    </div>
  `;

  document.body.appendChild(container);

  const toggle = document.getElementById("chatbot-toggle");
  const box = document.getElementById("chatbot-box");

  toggle.addEventListener("click", () => {
    box.style.display = box.style.display === "block" ? "none" : "block";
  });
});
