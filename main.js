var twists = [];
var twistIdCounter = 1;
var twistInput = document.getElementById('twistInput');
var publishBtn = document.getElementById('publishBtn');
var twistsContainer = document.getElementById('twistsContainer');
// Inicio de sesión con nombre
var username = localStorage.getItem("username");
var loginModal = document.getElementById("loginModal");
var usernameInput = document.getElementById("usernameInput");
var loginBtn = document.getElementById("loginBtn");
if (!username) {
    loginModal.style.display = "flex";
}
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
// Publicar twist
function publishTwist(content, parentId) {
    if (parentId === void 0) { parentId = null; }
    var newTwist = {
        id: twistIdCounter++,
        parentId: parentId,
        content: content.trim(),
        author: username !== null && username !== void 0 ? username : "Anónimo",
        children: [],
    };
    if (parentId === null) {
        twists.push(newTwist);
    }
    else {
        var parentTwist = findTwistById(parentId, twists);
        if (parentTwist)
            parentTwist.children.push(newTwist);
    }
    renderTwists();
}
// Buscar twist por ID
function findTwistById(id, list) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var twist = list_1[_i];
        if (twist.id === id)
            return twist;
        var found = findTwistById(id, twist.children);
        if (found)
            return found;
    }
    return null;
}
// Mostrar twists
function renderTwists() {
    twistsContainer.innerHTML = '';
    for (var _i = 0, twists_1 = twists; _i < twists_1.length; _i++) {
        var twist = twists_1[_i];
        var twistElem = createTwistElement(twist);
        twistsContainer.appendChild(twistElem);
    }
}
// Crear twist + hijos con profundidad limitada
function createTwistElement(twist, depth) {
    if (depth === void 0) { depth = 0; }
    var div = document.createElement('div');
    div.classList.add('twist');
    if (twist.parentId !== null)
        div.classList.add('threaded');
    div.innerHTML = "<strong>".concat(twist.author, ":</strong> ").concat(twist.content);
    // Solo permitir responder si profundidad < 2
    if (depth < 2) {
        var replyBtn = document.createElement('button');
        replyBtn.textContent = 'Responder';
        replyBtn.className = 'reply-btn';
        replyBtn.addEventListener('click', function () { return openReplyInput(div, twist.id); });
        div.appendChild(replyBtn);
    }
    for (var _i = 0, _a = twist.children; _i < _a.length; _i++) {
        var child = _a[_i];
        var childElem = createTwistElement(child, depth + 1);
        div.appendChild(childElem);
    }
    return div;
}
// Caja de respuesta
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
// Publicar principal
publishBtn.addEventListener('click', function () {
    var content = twistInput.value;
    if (content.trim().length === 0) {
        alert('Escribe un twist antes de publicar');
        return;
    }
    publishTwist(content);
    twistInput.value = '';
});
renderTwists();
