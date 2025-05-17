interface Twist {
  id: number;
  parentId: number | null;
  content: string;
  children: Twist[];
}

let twists: Twist[] = [];
let twistIdCounter = 1;

const twistInput = document.getElementById('twistInput') as HTMLTextAreaElement;
const publishBtn = document.getElementById('publishBtn') as HTMLButtonElement;
const twistsContainer = document.getElementById('twistsContainer') as HTMLDivElement;

// Publicar twist nuevo o respuesta a un hilo
function publishTwist(content: string, parentId: number | null = null) {
  const newTwist: Twist = {
    id: twistIdCounter++,
    parentId: parentId,
    content: content.trim(),
    children: [],
  };

  if (parentId === null) {
    twists.push(newTwist);
  } else {
    // Buscar el padre y agregar como hijo
    const parentTwist = findTwistById(parentId, twists);
    if (parentTwist) {
      parentTwist.children.push(newTwist);
    }
  }
  renderTwists();
}

// Buscar twist por id recursivamente
function findTwistById(id: number, list: Twist[]): Twist | null {
  for (const twist of list) {
    if (twist.id === id) return twist;
    const foundInChildren = findTwistById(id, twist.children);
    if (foundInChildren) return foundInChildren;
  }
  return null;
}

// Renderizar twists y hilos
function renderTwists() {
  twistsContainer.innerHTML = '';
  for (const twist of twists) {
    const twistElem = createTwistElement(twist);
    twistsContainer.appendChild(twistElem);
  }
}

// Crear elemento HTML de twist recursivamente con hilos
function createTwistElement(twist: Twist): HTMLElement {
  const div = document.createElement('div');
  div.classList.add('twist');
  if (twist.parentId !== null) div.classList.add('threaded');
  div.textContent = twist.content;

  // Botón para responder
  const replyBtn = document.createElement('button');
  replyBtn.textContent = 'Responder';
  replyBtn.className = 'reply-btn';
  replyBtn.addEventListener('click', () => openReplyInput(div, twist.id));
  div.appendChild(replyBtn);

  // Renderizar respuestas hijas
  if (twist.children.length > 0) {
    twist.children.forEach(childTwist => {
      const childElem = createTwistElement(childTwist);
      div.appendChild(childElem);
    });
  }

  return div;
}

// Mostrar área para responder dentro del hilo
function openReplyInput(parentElem, parentId) {
  if (parentElem.querySelector('.reply-input'))
    return;

  const textarea = document.createElement('textarea');
  textarea.className = 'reply-input';
  textarea.placeholder = 'Escribe tu respuesta...';
  textarea.rows = 2;

  const sendBtn = document.createElement('button');
  sendBtn.textContent = 'Publicar';
  sendBtn.className = 'reply-send-btn';

  sendBtn.addEventListener('click', () => {
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
publishBtn.addEventListener('click', () => {
  const content = twistInput.value;
  if (content.trim().length === 0) {
    alert('Escribe un twist antes de publicar');
    return;
  }
  publishTwist(content, null);
  twistInput.value = '';
});

// Render inicial (vacío)
renderTwists();
