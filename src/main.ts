import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAT1uC7_Zf40kl0dC4XyL6XldlIoFdh4fM",
  authDomain: "twistec-db.firebaseapp.com",
  databaseURL: "https://twistec-db-default-rtdb.firebaseio.com",
  projectId: "twistec-db",
  storageBucket: "twistec-db.firebasestorage.app",
  messagingSenderId: "136685067698",
  appId: "1:136685067698:web:9d132689170b7a343b18ab"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elementos del DOM
const twistInput = document.getElementById('twistInput') as HTMLTextAreaElement;
const publishBtn = document.getElementById('publishBtn') as HTMLButtonElement;
const twistsContainer = document.getElementById('twistsContainer') as HTMLElement;

let username = localStorage.getItem("username");
const loginModal = document.getElementById("loginModal") as HTMLDivElement;
const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;

// Mostrar login si no hay nombre guardado
if (!username) loginModal.style.display = "flex";

// Registrar nombre
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

// Publicar twist o respuesta
function publishTwist(content: string, parentId: number | null = null): void {
  const twist = {
    id: Date.now(),
    parentId,
    content: content.trim(),
    author: username ?? "Anónimo"
  };
  push(ref(db, "twists"), twist);
}

// Escuchar cambios y renderizar
onValue(ref(db, "twists"), (snapshot) => {
  const data = snapshot.val();
  twistsContainer.innerHTML = '';
  if (data) {
    const twists = Object.values(data);
    renderTwists(twists);
  }
});

// Renderizar lista de twists
function renderTwists(twists: any[]) {
  twists.forEach(t => {
    if (!t.parentId) {
      const twistElem = createTwistElement(t, twists, 0);
      twistsContainer.appendChild(twistElem);
    }
  });
}

// Crear elemento HTML de un twist (con hilos)
function createTwistElement(twist: any, all: any[], depth: number): HTMLDivElement {
  const div = document.createElement('div');
  div.classList.add('twist');
  if (twist.parentId !== null) div.classList.add('threaded');
  div.innerHTML = `<strong>${twist.author}:</strong> ${twist.content}`;

  // Mostrar botón "Responder" solo si está en nivel 0 o 1
  if (depth < 2) {
    const replyBtn = document.createElement('button');
    replyBtn.textContent = 'Responder';
    replyBtn.className = 'reply-btn';
    replyBtn.addEventListener('click', () => openReplyInput(div, twist.id));
    div.appendChild(replyBtn);
  }

  const children = all.filter(child => child.parentId === twist.id);
  for (const child of children) {
    const childElem = createTwistElement(child, all, depth + 1);
    div.appendChild(childElem);
  }

  return div;
}

// Mostrar caja de respuesta
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

// Evento para publicar twist principal
publishBtn.addEventListener('click', () => {
  const content = twistInput.value;
  if (content.trim().length === 0) {
    alert("Escribe un twist antes de publicar.");
    return;
  }
  publishTwist(content);
  twistInput.value = '';
});
