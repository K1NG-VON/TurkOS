const firebaseConfig = {
    apiKey: "AIzaSyCk5-mjTHQHcFMKaR6qVKijlaaldQ53Fjs",
    authDomain: "turkos-622ad.firebaseapp.com",
    databaseURL: "https://turkos-622ad-default-rtdb.firebaseio.com",
    projectId: "turkos-622ad",
    storageBucket: "turkos-622ad.firebasestorage.app",
    messagingSenderId: "240168437171",
    appId: "1:240168437171:web:2751c54b7928c5a35a37c6"
};

let db;

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    db = firebase.database();

} catch (e) {
    console.log("Firebase bağlantı hatası:", e);
}

// Saat ve pil
function updateSystem() {

    const now = new Date();

    const trTime = now.toLocaleTimeString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById("clock").innerText = trTime;

    const start = new Date().setHours(0,0,0,0);
    const passed = now - start;

    const total = 23 * 60 * 60 * 1000;

    const level = Math.max(
        0,
        Math.floor(100 - (passed / total * 100))
    );

    document.getElementById("battery-level").innerText = level + "%";
    document.getElementById("battery-bar").style.width = level + "%";
}

// Uygulama açma kapatma
function openApp(id) {
    document.getElementById(id).style.display = "block";
}

function closeApp(id) {
    document.getElementById(id).style.display = "none";
}

// Duvar kağıdı
function changeWallpaper(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        document.body.style.backgroundImage = `url('${e.target.result}');
    };

    reader.readAsDataURL(file);
}

// Online mesaj sistemi
let activeRoom = "";

function joinOnlineRoom() {

    activeRoom = document.getElementById("room-code").value;

    const name = document.getElementById("username").value;

    if (!activeRoom || !name) {
        alert("İsim ve oda kodu gir.");
        return;
    }

    document.getElementById("msg-auth").style.display = "none";
    document.getElementById("chat-area").style.display = "flex";

    db.ref("odalar/" + activeRoom).on("child_added", (snap) => {

        const d = snap.val();

        document.getElementById("chat-box").innerHTML += `
            <div class="ai-msg">
                <b>${d.u}:</b> ${d.m}
            </div>
        `;
    });
}

function sendOnlineMsg() {

    const input = document.getElementById("chat-input");

    if (!input.value.trim()) return;

    db.ref("odalar/" + activeRoom).push({
        u: document.getElementById("username").value,
        m: input.value
    });

    input.value = "";
}

// TurkAI
function askRealAI() {

    const input = document.getElementById("ai-input");
    const chat = document.getElementById("ai-chat");

    if (!input.value.trim()) return;

    const text = input.value;

    chat.innerHTML += `
        <div class="user-msg">
            Sen: ${text}
        </div>
    `;

    let answer = `Şu an saat ${document.getElementById("clock").innerText}. Pil seviyen ${document.getElementById("battery-level").innerText}.`;

    if (text.toLowerCase().includes("selam")) {
        answer = "Selam! Ben TurkAI. Sana yardımcı olmaya hazırım.";
    }

    setTimeout(() => {

        chat.innerHTML += `
            <div class="ai-msg">
                TurkAI: ${answer}
            </div>
        `;

        chat.scrollTop = chat.scrollHeight;

    }, 1000);

    input.value = "";
}

// Başlat
window.onload = () => {

    updateSystem();

    setInterval(updateSystem, 1000);

    setTimeout(() => {

        document.getElementById("boot").style.display = "none";

        document.getElementById("desktop").style.display = "block";
                                       
    }, 1200);
};