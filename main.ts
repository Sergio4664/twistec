type Twist = {
  id: number;
  parentId: number | null;
  content: string;
  author: string;
  children: Twist[];
};

let twists: Twist[] = [];
let twistIdCounter = 1;

const twistInput = document.getElementById('twistInput') as HTMLTextAreaElement;
const publishBtn = document.getElementById('publishBtn') as HTMLButtonElement;
const twistsContainer = document.getElementById('twistsContainer') as HTMLElement;

// Inicio de sesión con nombre
let username = localStorage.getItem("username");
const loginModal = document.getElementById("loginModal") as HTMLDivElement;
const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;

if (!username) {
  loginModal.style.display = "flex";
}

loginBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (name.length === 0) {
    alert("Por favor, ingresa tu nombre.");
    return;
  }
  localStorage.setItem("username", name);
  username = name;
  loginModal.style.display = "none";
});

// Publicar twist
function publishTwist(content: string, parentId: number | null = null): void {
  const newTwist: Twist = {
    id: twistIdCounter++,
    parentId: parentId,
    content: content.trim(),
    author: username ?? "Anónimo",
    children: [],
  };

  if (parentId === null) {
    twists.push(newTwist);
  } else {
    const parentTwist = findTwistById(parentId, twists);
    if (parentTwist) parentTwist.children.push(newTwist);
  }

  renderTwists();
}

// Buscar twist por ID
function findTwistById(id: number, list: Twist[]): Twist | null {
  for (const twist of list) {
    if (twist.id === id) return twist;
    const found = findTwistById(id, twist.children);
    if (found) return found;
  }
  return null;
}

// Mostrar twists
function renderTwists(): void {
  twistsContainer.innerHTML = '';
  for (const twist of twists) {
    const twistElem = createTwistElement(twist);
    twistsContainer.appendChild(twistElem);
  }
}

// Crear twist + hijos con profundidad limitada
function createTwistElement(twist: Twist, depth: number = 0): HTMLDivElement {
  const div = document.createElement('div');
  div.classList.add('twist');
  if (twist.parentId !== null) div.classList.add('threaded');
  div.innerHTML = `<strong>${twist.author}:</strong> ${twist.content}`;

  // Solo permitir responder si profundidad < 2
  if (depth < 2) {
    const replyBtn = document.createElement('button');
    replyBtn.textContent = 'Responder';
    replyBtn.className = 'reply-btn';
    replyBtn.addEventListener('click', () => openReplyInput(div, twist.id));
    div.appendChild(replyBtn);
  }

  for (const child of twist.children) {
    const childElem = createTwistElement(child, depth + 1);
    div.appendChild(childElem);
  }

  return div;
}

// Caja de respuesta
function openReplyInput(parentElem: HTMLElement, parentId: number): void {
  if (parentElem.querySelector('.reply-input')) return;

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

// Publicar principal
publishBtn.addEventListener('click', () => {
  const content = twistInput.value;
  if (content.trim().length === 0) {
    alert('Escribe un twist antes de publicar');
    return;
  }
  publishTwist(content);
  twistInput.value = '';
});

renderTwists();
