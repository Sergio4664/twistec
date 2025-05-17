var twists = [];
var twistIdCounter = 1;
var twistInput = document.getElementById('twistInput');
var publishBtn = document.getElementById('publishBtn');
var twistsContainer = document.getElementById('twistsContainer');
// Publicar twist nuevo o respuesta a un hilo
function publishTwist(content, parentId) {
    if (parentId === void 0) { parentId = null; }
    var newTwist = {
        id: twistIdCounter++,
        parentId: parentId,
        content: content.trim(),
        children: [],
    };
    if (parentId === null) {
        twists.push(newTwist);
    }
    else {
        // Buscar el padre y agregar como hijo
        var parentTwist = findTwistById(parentId, twists);
        if (parentTwist) {
            parentTwist.children.push(newTwist);
        }
    }
    renderTwists();
}
// Buscar twist por id recursivamente
function findTwistById(id, list) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var twist = list_1[_i];
        if (twist.id === id)
            return twist;
        var foundInChildren = findTwistById(id, twist.children);
        if (foundInChildren)
            return foundInChildren;
    }
    return null;
}
// Renderizar twists y hilos
function renderTwists() {
    twistsContainer.innerHTML = '';
    for (var _i = 0, twists_1 = twists; _i < twists_1.length; _i++) {
        var twist = twists_1[_i];
        var twistElem = createTwistElement(twist);
        twistsContainer.appendChild(twistElem);
    }
}
// Crear elemento HTML de twist recursivamente con hilos
function createTwistElement(twist) {
    var div = document.createElement('div');
    div.classList.add('twist');
    if (twist.parentId !== null)
        div.classList.add('threaded');
    div.textContent = twist.content;
    // Botón para responder
    var replyBtn = document.createElement('button');
    replyBtn.textContent = 'Responder';
    replyBtn.className = 'reply-btn';
    replyBtn.addEventListener('click', function () { return openReplyInput(div, twist.id); });
    div.appendChild(replyBtn);
    // Renderizar respuestas hijas
    if (twist.children.length > 0) {
        twist.children.forEach(function (childTwist) {
            var childElem = createTwistElement(childTwist);
            div.appendChild(childElem);
        });
    }
    return div;
}
// Mostrar área para responder dentro del hilo
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
// Evento click para publicar twist principal
publishBtn.addEventListener('click', function () {
    var content = twistInput.value;
    if (content.trim().length === 0) {
        alert('Escribe un twist antes de publicar');
        return;
    }
    publishTwist(content, null);
    twistInput.value = '';
});
// Render inicial (vacío)
renderTwists();
