// Countdown
const newYear = new Date("January 1, 2026 00:00:00").getTime();

setInterval(() => {
    let now = new Date().getTime();
    let diff = newYear - now;

    let d = Math.floor(diff / (1000 * 60 * 60 * 24));
    let h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    let m = Math.floor((diff / (1000 * 60)) % 60);
    let s = Math.floor((diff / 1000) % 60);

    document.getElementById("countdown").innerHTML =
        `⏳ ${d}d ${h}h ${m}m ${s}s to go`;
}, 1000);

// Love Wish
function showWish() {
    document.getElementById("wish").innerHTML =
        "❤️ Every year gives me 365 chances to love you more… but this year, I want to make it official. Happy New Year, my love Ankit❤️";
}

// Heart Generator
const heartsContainer = document.querySelector('.hearts');

setInterval(() => {
    const heart = document.createElement('span');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (Math.random() * 3 + 3) + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}, 300);
