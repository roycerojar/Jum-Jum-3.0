// Food data with placeholder images
const foods = [
    {
        name: "Parippuvada",
        desc: "Crispy outside, soft inside. Like your ex.",
        img: "./pictures for tinder/Parippuvada.jpg"
    },
    {
        name: "Unniyappam",
        desc: "Sweet, round, and judges you silently.",
        img: "./pictures for tinder/Unniyappam.jpg"
    },
    {
        name: "Beef Fry",
        desc: "Controversial. Swipe right if you're brave.",
        img: "./pictures for tinder/Beef fry.jpg"
    },
    {
        name: "Puttu-Kadala",
        desc: "Basic but dependable. Unlike you.",
        img: "./pictures for tinder/Puttu kadala.jpg"
    }
];

let currentIndex = 0;
const activeCard = document.getElementById('active-card');
let isDragging = false;
let startX, startY, moveX;

// Initialize first card
loadCard(currentIndex);

// Touch/mouse events
activeCard.addEventListener('mousedown', startDrag);
activeCard.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('mousemove', dragCard);
document.addEventListener('touchmove', dragCard, { passive: false });
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function loadCard(index) {
    const food = foods[index];
    const header = activeCard.querySelector('.card-header');
    const name = activeCard.querySelector('.food-name');
    const desc = activeCard.querySelector('.food-desc');
    
    header.style.backgroundImage = `url('${food.img}')`;
    name.textContent = food.name;
    desc.textContent = food.desc;
    
    // Reset card position
    activeCard.style.transform = 'none';
    activeCard.style.transition = 'none';
}

function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    const clientX = e.clientX || e.touches[0].clientX;
    startX = clientX;
    activeCard.style.transition = 'none';
}

function dragCard(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.clientX || e.touches[0].clientX;
    moveX = clientX - startX;
    
    // Move card with cursor/finger
    activeCard.style.transform = `translateX(${moveX}px) rotate(${moveX / 20}deg)`;
}

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const threshold = 100; // Minimum swipe distance
    
    if (Math.abs(moveX) > threshold) {
        if (moveX > 0) {
            swipeRight();
        } else {
            swipeLeft();
        }
    } else {
        // Return to center if not swiped enough
        activeCard.style.transform = 'none';
        activeCard.style.transition = 'transform 0.3s';
    }
}

function swipeRight() {
    activeCard.classList.add('swipe-right');
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % foods.length;
        activeCard.classList.remove('swipe-right');
        loadCard(currentIndex);
    }, 500);
}

function swipeLeft() {
    activeCard.classList.add('swipe-left');
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % foods.length;
        activeCard.classList.remove('swipe-left');
        loadCard(currentIndex);
    }, 500);
}

// Button controls
document.getElementById('like').addEventListener('click', swipeRight);
document.getElementById('dislike').addEventListener('click', swipeLeft);
document.getElementById('super-like').addEventListener('click', () => {
    alert(`Super Liked ${foods[currentIndex].name}! ഇത് പൊളി!`);
    swipeRight();
});