let rooms = {};
let currentRoom = null;
let playerNames = [];
let themes = {
    'อนิเมะ': ['นารูโตะ', 'ลูฟี่', 'ซาสึเกะ', 'ซากุระ'],
    'ภาพยนตร์': ['แฮรี่ พอตเตอร์', 'ไอรอนแมน', 'แฮมเมอร์', 'โรมิโอ']
};
let selectedTheme = "";
let totalSharedCoins = 0; // จำนวนเหรียญในกระปุกกองกลาง

// สร้างห้อง
function createRoom() {
    const roomName = document.getElementById("room-name").value;
    if (roomName) {
        rooms[roomName] = { players: [] };
        currentRoom = roomName;
        document.getElementById("room-section").style.display = "none";
        document.getElementById("join-section").style.display = "block";
        alert(`สร้างห้อง "${roomName}" สำเร็จ!`);
    } else {
        alert("กรุณากรอกชื่อห้อง");
    }
}

// เข้าร่วมเกม
function joinRoom() {
    const playerName = document.getElementById("player-name").value;
    if (playerName && currentRoom) {
        rooms[currentRoom].players.push({ name: playerName, personalCoins: 10, contributedCoins: 0 });
        document.getElementById("join-section").style.display = "none";
        document.getElementById("game-section").style.display = "block";
        renderPlayers();
        alert(`คุณเข้าร่วม "${currentRoom}" สำเร็จ!`);
    } else {
        alert("กรุณากรอกชื่อของคุณ");
    }
}

// แสดงรายชื่อผู้เล่น
function renderPlayers() {
    const playerList = document.getElementById("player-list");
    playerList.innerHTML = "";
    rooms[currentRoom].players.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.className = "player";
        playerDiv.textContent = `${player.name} - เหรียญส่วนตัว: ${player.personalCoins}`;
        playerList.appendChild(playerDiv);
    });
}

// เริ่มเกม
function startGame() {
    if (rooms[currentRoom].players.length === 0) {
        alert("กรุณาเพิ่มผู้เล่นก่อนเริ่มเกม!");
        return;
    }

    // สุ่มธีม
    const themeKeys = Object.keys(themes);
    selectedTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    
    // สุ่มชื่อจากธีม
    playerNames = themes[selectedTheme].sort(() => 0.5 - Math.random()).slice(0, rooms[currentRoom].players.length);
    
    rooms[currentRoom].players.forEach((player, index) => {
        player.name = playerNames[index];
    });

    renderPlayers();
    alert(`ธีมที่สุ่มได้: ${selectedTheme}`);
}

// ส่งข้อความในแชท
function sendMessage() {
    const messageInput = document.getElementById("chat-input");
    const message = messageInput.value;
    if (message) {
        const chatMessages = document.getElementById("chat-messages");
        const messageDiv = document.createElement("div");
        const playerIndex = rooms[currentRoom].players.indexOf(rooms[currentRoom].players.find(p => p.name === playerNames[rooms[currentRoom].players.indexOf(p)]));
        messageDiv.textContent = `${playerNames[playerIndex]}: ${message}`;
        chatMessages.appendChild(messageDiv);
        messageInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }
}

// ฟังก์ชันสำหรับหยอดเหรียญ
function submitCoins() {
    const personalCoinsInput = document.getElementById("personal-coins").value;
    const sharedCoinsInput = document.getElementById("shared-coins").value;
    
    const personalCoins = parseInt(personalCoinsInput) || 0;
    const sharedCoins = parseInt(sharedCoinsInput) || 0;

    const currentPlayer = rooms[currentRoom].players.find(player => player.name === playerNames[rooms[currentRoom].players.indexOf(player)]);
    
    if (personalCoins + sharedCoins > currentPlayer.personalCoins) {
        alert("คุณไม่มีเหรียญพอสำหรับการหยอด!");
        return;
    }

    // อัปเดตจำนวนเหรียญส่วนตัวและเหรียญกองกลาง
    currentPlayer.personalCoins -= (personalCoins + sharedCoins);
    currentPlayer.contributedCoins += sharedCoins;
    totalSharedCoins += sharedCoins;

    alert(`คุณหยอดเหรียญส่วนตัว ${personalCoins} และเหรียญกองกลาง ${sharedCoins}`);
    
    renderPlayers();
}

// จบรอบ
function endRound() {
    const numPlayers = rooms[currentRoom].players.length;
    const coinsPerPlayer = Math.floor(totalSharedCoins / numPlayers); // แบ่งเหรียญกองกลางให้ผู้เล่นอย่างเท่าเทียม
    
    rooms[currentRoom].players.forEach(player => {
        player.personalCoins += coinsPerPlayer;
    });

    alert(`จบรอบ! ทุกคนได้รับ ${coinsPerPlayer} เหรียญจากกองกลาง`);
    
    // รีเซ็ตจำนวนเหรียญกองกลาง
    totalSharedCoins = 0;
    renderPlayers();
}
