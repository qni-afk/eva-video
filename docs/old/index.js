document.getElementById("yesButton").onclick = function() {
  document.getElementById("question").textContent = "Я тебя тоже очень сильно люблю!";
  document.querySelector(".buttons").innerHTML = "❤️❤️❤️";
};

document.getElementById("noButton").onmouseover = function() {
  const button = this;
  const buttonWidth = button.offsetWidth;
  const buttonHeight = button.offsetHeight;

  // Ширина и высота видимой области окна
  const maxX = window.innerWidth - buttonWidth;
  const maxY = window.innerHeight - buttonHeight;

  // Случайные координаты в пределах видимой области
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  button.style.position = 'absolute';
  button.style.left = `${randomX}px`;
  button.style.top = `${randomY}px`;}