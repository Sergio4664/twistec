"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var database_1 = require("firebase/database");
var firebaseConfig = {
    apiKey: "AIzaSyAT1uC7_Zf40kl0dC4XyL6XldlIoFdh4fM",
    authDomain: "twistec-db.firebaseapp.com",
    databaseURL: "https://twistec-db-default-rtdb.firebaseio.com",
    projectId: "twistec-db",
    storageBucket: "twistec-db.firebasestorage.app",
    messagingSenderId: "136685067698",
    appId: "1:136685067698:web:9d132689170b7a343b18ab"
};
var app = (0, app_1.initializeApp)(firebaseConfig);
var db = (0, database_1.getDatabase)(app);
var twistInput = document.getElementById('twistInput');
var publishBtn = document.getElementById('publishBtn');
var twistsContainer = document.getElementById('twistsContainer');
var username = localStorage.getItem("username");
var loginModal = document.getElementById("loginModal");
var usernameInput = document.getElementById("usernameInput");
var loginBtn = document.getElementById("loginBtn");
if (!username)
    loginModal.style.display = "flex";
loginBtn.addEventListener("click", function () {
    var name = usernameInput.value.trim();
    if (name.length === 0) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }
    localStorage.setItem("username", name);
    username = name;
    loginModal.style.display = "none";
});
function publishTwist(content, parentId) {
    if (parentId === void 0) { parentId = null; }
    var twist = {
        id: Date.now(),
        parentId: parentId,
        content: content.trim(),
        author: username !== null && username !== void 0 ? username : "Anónimo"
    };
    (0, database_1.push)((0, database_1.ref)(db, "twists"), twist);
}
(0, database_1.onValue)((0, database_1.ref)(db, "twists"), function (snapshot) {
    var data = snapshot.val();
    twistsContainer.innerHTML = '';
    if (data) {
        var twists = Object.values(data);
        renderTwists(twists);
    }
});
function renderTwists(twists) {
    twists.forEach(function (t) {
        if (!t.parentId) {
            var twistElem = createTwistElement(t, twists, 0);
            twistsContainer.appendChild(twistElem);
        }
    });
}
function createTwistElement(twist, all, depth) {
    var div = document.createElement('div');
    div.classList.add('twist');
    if (twist.parentId !== null)
        div.classList.add('threaded');
    div.innerHTML = "<strong>".concat(twist.author, ":</strong> ").concat(twist.content);
    if (depth < 2) {
        var replyBtn = document.createElement('button');
        replyBtn.textContent = 'Responder';
        replyBtn.className = 'reply-btn';
        replyBtn.addEventListener('click', function () { return openReplyInput(div, twist.id); });
        div.appendChild(replyBtn);
    }
    var children = all.filter(function (child) { return child.parentId === twist.id; });
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        var childElem = createTwistElement(child, all, depth + 1);
        div.appendChild(childElem);
    }
    return div;
}
function openReplyInput(parentElem, parentId) {
    if (parentElem.querySelector('.reply-input'))
        return;
    var textarea = document.createElement('textarea');
    textarea.className = 'reply-input';
    textarea.placeholder = 'Escribe tu respuesta...';
    textarea.rows = 2;
    var sendBtn = document.createElement('button');
    sendBtn.textContent = 'Publicar';
    sendBtn.className = 'reply-send-btn';
    sendBtn.addEventListener('click', function () {
        if (textarea.value.trim().length === 0) {
            alert('El mensaje no puede estar vacío.');
            return;
        }
        publishTwist(textarea.value, parentId);
    });
    parentElem.appendChild(textarea);
    parentElem.appendChild(sendBtn);
}
publishBtn.addEventListener('click', function () {
    var content = twistInput.value;
    if (content.trim().length === 0) {
        alert("Escribe un twist antes de publicar.");
        return;
    }
    publishTwist(content);
    twistInput.value = '';
});
