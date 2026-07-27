// ================== CONFIG ==================
const API_URL = "http://localhost:3000/chat";

// ================== PERSONA / CHAT DATA ==================
// Each persona is its own independent chat: own history, own theme, own dp, own memory snapshot.
const PERSONAS = {
    boyfriend: {
        name: "Bae",
        theme: "",
        dp: { type: "emoji", value: "❤️" },
        history: [],
        lastMsg: "Aaja idhar 🥺",
        nickname: "Shrutu ❤️",
        mood: { label: "Happy", emoji: "😊" },
        promises: ["Movie Sunday", "Chocolate"],
        topics: ["College", "Gym", "Presentation"],
    },
    bestfriend: {
        name: "Yaar",
        theme: "rosewood",
        dp: { type: "emoji", value: "🤝" },
        history: [],
        lastMsg: "Bhai kal free hai?",
        nickname: "Boss",
        mood: { label: "Chill", emoji: "😎" },
        promises: ["Trip planning"],
        topics: ["Cricket", "Memes"],
    },
    studymate: {
        name: "Study Buddy",
        theme: "sky",
        dp: { type: "emoji", value: "📚" },
        history: [],
        lastMsg: "Aaj DBMS revise karein?",
        nickname: "Topper",
        mood: { label: "Focused", emoji: "🧠" },
        promises: ["Mock test Friday"],
        topics: ["DSA", "OS", "DBMS"],
    },
    teacher: {
        name: "Teacher",
        theme: "cream",
        dp: { type: "emoji", value: "🎓" },
        history: [],
        lastMsg: "Homework complete hua?",
        nickname: "Shruti",
        mood: { label: "Encouraging", emoji: "🙂" },
        promises: [],
        topics: ["Concepts", "Practice"],
    },
    therapist: {
        name: "Therapist",
        theme: "sky",
        dp: { type: "emoji", value: "🌿" },
        history: [],
        lastMsg: "Aaj kaisa mehsoos ho raha hai?",
        nickname: "Shruti",
        mood: { label: "Calm", emoji: "🌿" },
        promises: [],
        topics: ["Wellbeing"],
    },
    motivator: {
        name: "Motivator",
        theme: "",
        dp: { type: "emoji", value: "🔥" },
        history: [],
        lastMsg: "Uth ja champion, kaam bacha hai!",
        nickname: "Champion",
        mood: { label: "Pumped", emoji: "🔥" },
        promises: [],
        topics: ["Goals", "Discipline"],
    },
};

const PERSONA_ORDER = ["boyfriend", "bestfriend", "studymate", "teacher", "therapist", "motivator"];

const DP_OPTIONS = ["❤️", "😊", "😎", "🤝", "📚", "🎓", "🌿", "🐱", "🐶", "🦋", "🌸", "⭐", "🔥", "👑", "🍫", "🌙", "🎨", "🥰"];

const EMOJI_LIST = [
    "😀", "😁", "😂", "🤣", "😊", "😍", "🥰", "😘", "😉", "😎",
    "🤩", "😇", "🙂", "🙃", "😅", "😢", "😭", "🥺", "😡", "😴",
    "🤔", "😳", "🫣", "😱", "🤗", "🤭", "😏", "🙄", "😤", "🥳",
    "👍", "👎", "👏", "🙏", "💪", "✌️", "🤞", "👋", "🤝", "💯",
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💔", "💕",
    "🔥", "✨", "🎉", "🎂", "🍫", "☕", "🍕", "🌸", "🌙", "⭐",
];

let activeKey = "boyfriend";

// ================== DOM REFS ==================
const chatList = document.getElementById("chatList");
const chatBody = document.getElementById("chatBody");
const chatScrollOuter = document.getElementById("chatScrollOuter");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const statusLine = document.getElementById("statusLine");
const pulseRing = document.getElementById("pulseRing");
const themeSwitch = document.getElementById("themeSwitch");
const rightToggle = document.getElementById("rightToggle");
const sideRight = document.getElementById("sideRight");
const hdrName = document.getElementById("hdrName");
const headerAvatar = document.getElementById("headerAvatar");
const avatarWrap = document.getElementById("avatarWrap");
const dpDotsBtn = document.getElementById("dpDotsBtn");
const dpPopup = document.getElementById("dpPopup");
const dpGrid = document.getElementById("dpGrid");
const dpFileInput = document.getElementById("dpFileInput");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPanel = document.getElementById("emojiPanel");
const videoCallBtn = document.getElementById("videoCallBtn");
const voiceCallBtn = document.getElementById("voiceCallBtn");
const callOverlay = document.getElementById("callOverlay");
const callAvatar = document.getElementById("callAvatar");
const callName = document.getElementById("callName");
const callStatus = document.getElementById("callStatus");
const callEndBtn = document.getElementById("callEndBtn");

// memory panel refs
const memPersonaName = document.getElementById("memPersonaName");
const memNickname = document.getElementById("memNickname");
const memMood = document.getElementById("memMood");
const memMoodEmoji = document.getElementById("memMoodEmoji");
const memPromises = document.getElementById("memPromises");
const memTopics = document.getElementById("memTopics");

// ================== HELPERS ==================
function timeNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function setAvatarContent(el, dp, fontSize) {
    el.innerHTML = "";
    if (dp && dp.type === "image") {
        const img = document.createElement("img");
        img.src = dp.value;
        el.appendChild(img);
    } else {
        el.textContent = (dp && dp.value) || "?";
        if (fontSize) el.style.fontSize = fontSize;
    }
}

// ================== SIDEBAR (all chats) ==================
function renderSidebar() {
    chatList.innerHTML = "";
    PERSONA_ORDER.forEach((key) => {
        const p = PERSONAS[key];
        const item = document.createElement("button");
        item.onclick = async () => {
            activeKey = key;
            await switchPersona(key);
            renderSidebar();
            renderChat();
            updateMemoryPanelFromPersona(
                PERSONAS[key]
            );
        };
        item.className = "chat-item" + (key === activeKey ? " active" : "");
        item.dataset.key = key;

        const avatar = document.createElement("div");
        avatar.className = "mini-avatar";
        setAvatarContent(avatar, p.dp);

        const textWrap = document.createElement("div");
        textWrap.className = "ci-text";
        const nameEl = document.createElement("div");
        nameEl.className = "ci-name";
        nameEl.textContent = p.name;
        const subEl = document.createElement("div");
        subEl.className = "ci-sub";
        subEl.textContent = p.lastMsg || "";
        textWrap.appendChild(nameEl);
        textWrap.appendChild(subEl);

        item.appendChild(avatar);
        item.appendChild(textWrap);
        item.addEventListener("click", () => selectPersona(key));
        chatList.appendChild(item);
    });
}

// ================== SWITCHING PERSONAS / CHATS ==================
function selectPersona(key) {
    if (!PERSONAS[key]) return;
    activeKey = key;
    const p = PERSONAS[key];

    // theme + UI change per persona
    if (p.theme) document.documentElement.setAttribute("data-theme", p.theme);
    else document.documentElement.removeAttribute("data-theme");
    document.querySelectorAll(".theme-dot").forEach((d) => {
        d.classList.toggle("active", (d.dataset.theme || "") === p.theme);
    });

    // header
    hdrName.textContent = p.name;
    setAvatarContent(headerAvatar, p.dp, "19px");
    statusLine.textContent = "online";
    statusLine.classList.remove("typing");

    // rebuild chat body from this persona's own history
    chatBody.innerHTML = '<div class="day-chip">Today</div>';
    p.history.forEach((m) => renderBubble(m.content, m.role === "user" ? "user" : "bot", false));
    chatScrollOuter.scrollTop = chatScrollOuter.scrollHeight;

    // memory panel reflects the active chat only
    updateMemoryPanelFromPersona(p);

    // close any open popups
    dpPopup.classList.remove("open");
    emojiPanel.classList.remove("open");
    emojiBtn.classList.remove("on");

    renderSidebar();
}

function updateMemoryPanelFromPersona(p) {
    memPersonaName.textContent = p.name;
    memNickname.textContent = p.nickname || "—";
    memMood.textContent = (p.mood && p.mood.label) || "—";
    memMoodEmoji.textContent = (p.mood && p.mood.emoji) || "🙂";
    memPromises.innerHTML = (p.promises || []).map((x) => `<span class="tag promise">${x}</span>`).join("") || '<span class="mem-value" style="opacity:.5">None yet</span>';
    memTopics.innerHTML = (p.topics || []).map((x) => `<span class="tag topic">${x}</span>`).join("") || '<span class="mem-value" style="opacity:.5">None yet</span>';
}

// ================== MESSAGE BUBBLES ==================
function renderBubble(text, sender, animate = true) {
    const row = document.createElement("div");
    row.className = "row " + (sender === "user" ? "out" : "in");
    if (!animate) row.style.animation = "none", row.style.opacity = "1", row.style.transform = "none";

    const group = document.createElement("div");
    group.className = "bubble-group";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    const meta = document.createElement("span");
    meta.className = "meta";
    meta.innerHTML = timeNow() + (sender === "user" ? ' <span class="ticks seen">✓✓</span>' : "");
    bubble.appendChild(meta);

    const reactions = document.createElement("div");
    reactions.className = "reactions";
    reactions.innerHTML = ["❤️", "😂", "😭", "👍", "😡"].map((e) => `<span>${e}</span>`).join("");
    reactions.addEventListener("click", (e) => {
        if (e.target.tagName === "SPAN") {
            let pill = group.querySelector(".reaction-pill");
            if (!pill) {
                pill = document.createElement("div");
                pill.className = "reaction-pill";
                group.appendChild(pill);
            }
            pill.textContent = e.target.textContent;
        }
    });

    group.appendChild(bubble);
    group.appendChild(reactions);
    row.appendChild(group);
    chatBody.appendChild(row);
    chatScrollOuter.scrollTop = chatScrollOuter.scrollHeight;
}

function addBubble(text, sender) {
    renderBubble(text, sender, true);
    const p = PERSONAS[activeKey];
    p.history.push({ role: sender === "user" ? "user" : "assistant", content: text });
    p.lastMsg = text;
    renderSidebar();
}

function showTyping() {
    const row = document.createElement("div");
    row.className = "row in typing-row";
    row.id = "typingRow";
    row.innerHTML = `<div class="bubble-group"><div class="bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div></div>`;
    chatBody.appendChild(row);
    chatScrollOuter.scrollTop = chatScrollOuter.scrollHeight;
    statusLine.textContent = "typing...";
    statusLine.classList.add("typing");
    pulseRing.classList.add("active");
}

function hideTyping() {
    const row = document.getElementById("typingRow");
    if (row) row.remove();
    statusLine.textContent = "online";
    statusLine.classList.remove("typing");
    pulseRing.classList.remove("active");
}

function replyDelay(text) {
    const lines = text.split("\n").length;
    return Math.min(3500, Math.max(1000, lines * 700 + text.length * 8));
}

// ================== SEND MESSAGE ==================
async function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;

    addBubble(text, "user");
    msgInput.value = "";
    sendBtn.disabled = true;
    showTyping();

    const p = PERSONAS[activeKey];

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, history: p.history, persona: activeKey }),
        });

        if (!res.ok) throw new Error("Server error: " + res.status);
        const data = await res.json();

        const delay = replyDelay(data.reply || "");
        await new Promise((r) => setTimeout(r, delay));

        hideTyping();
        addBubble(data.reply, "bot");

        if (data.memory) updateMemoryFromServer(data.memory);
    } catch (err) {
        hideTyping();
        addBubble("baby network thoda weak lag raha hai tumhare taraf se, ek baar phir bhejo na 🥺", "bot");
    } finally {
        sendBtn.disabled = false;
    }
}

function updateMemoryFromServer(memory) {
    const p = PERSONAS[activeKey];
    if (memory.nickname) p.nickname = memory.nickname;
    if (memory.mood) p.mood = { label: memory.mood.label || memory.mood, emoji: memory.mood.emoji || p.mood.emoji };
    if (Array.isArray(memory.promises)) p.promises = memory.promises;
    if (Array.isArray(memory.topics)) p.topics = memory.topics;
    updateMemoryPanelFromPersona(p);
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });

// ================== PERSONA SWITCH ==================
async function switchPersona(persona) {
    try {
        const response = await fetch(
            "http://localhost:3000/persona",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    persona
                })
            }
        );
        const data = await response.json();
        console.log(data);
    }
    catch (err) {
        console.error(err);
    }
}

// ================== THEME SWITCH ==================
themeSwitch.addEventListener("click", (e) => {
    const dot = e.target.closest(".theme-dot");
    if (!dot) return;
    const theme = dot.dataset.theme || "";
    document.querySelectorAll(".theme-dot").forEach((d) => d.classList.remove("active"));
    dot.classList.add("active");
    if (theme) document.documentElement.setAttribute("data-theme", theme);
    else document.documentElement.removeAttribute("data-theme");
    // theme choice is saved per-persona, so switching chats keeps each chat's own look
    PERSONAS[activeKey].theme = theme;
});

rightToggle.addEventListener("click", () => sideRight.classList.toggle("open"));

// ================== DP (PHOTO) CHANGE POPUP ==================
dpGrid.innerHTML = DP_OPTIONS.map((e) => `<button type="button">${e}</button>`).join("");

dpDotsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dpPopup.classList.toggle("open");
});

dpGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const p = PERSONAS[activeKey];
    p.dp = { type: "emoji", value: btn.textContent };
    setAvatarContent(headerAvatar, p.dp, "19px");
    renderSidebar();
    dpPopup.classList.remove("open");
});

dpFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        const p = PERSONAS[activeKey];
        p.dp = { type: "image", value: reader.result };
        setAvatarContent(headerAvatar, p.dp);
        renderSidebar();
        dpPopup.classList.remove("open");
    };
    reader.readAsDataURL(file);
});

document.addEventListener("click", (e) => {
    if (!dpPopup.contains(e.target) && e.target !== dpDotsBtn) {
        dpPopup.classList.remove("open");
    }
});

// ================== EMOJI PICKER ==================
emojiPanel.innerHTML = EMOJI_LIST.map((e) => `<button type="button">${e}</button>`).join("");

emojiBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    emojiPanel.classList.toggle("open");
    emojiBtn.classList.toggle("on");
});

emojiPanel.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    msgInput.value += btn.textContent;
    msgInput.focus();
});

document.addEventListener("click", (e) => {
    if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) {
        emojiPanel.classList.remove("open");
        emojiBtn.classList.remove("on");
    }
});

// ================== CALL MODAL (front-end only, no real telephony yet) ==================
function openCall(kind) {
    const p = PERSONAS[activeKey];
    callName.textContent = p.name;
    setAvatarContent(callAvatar, p.dp, "30px");
    callStatus.textContent = kind === "video" ? "Video calling..." : "Calling...";
    callOverlay.classList.add("open");
}

videoCallBtn.addEventListener("click", () => openCall("video"));
voiceCallBtn.addEventListener("click", () => openCall("voice"));
callEndBtn.addEventListener("click", () => callOverlay.classList.remove("open"));
callOverlay.addEventListener("click", (e) => {
    if (e.target === callOverlay) callOverlay.classList.remove("open");
});

// ================== INIT ==================
renderSidebar();
selectPersona(activeKey);