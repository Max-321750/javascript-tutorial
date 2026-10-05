// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2DSsGhEIxTe1PsoGaMuQxhoqSYZqba2Y",
  authDomain: "firstfirebaselesson-845ec.firebaseapp.com",
  databaseURL: "https://firstfirebaselesson-845ec-default-rtdb.firebaseio.com",
  projectId: "firstfirebaselesson-845ec",
  storageBucket: "firstfirebaselesson-845ec.firebasestorage.app",
  messagingSenderId: "147201561974",
  appId: "1:147201561974:web:7be8905a4aa37c7b421657"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

const userName = document.getElementById("userName");
const username = document.getElementById("username");
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");


let scrollToLatestMessage = true; 

function scrollChatToBottom() {
  requestAnimationFrame(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}


function authenticateUser() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      const displayName = user.displayName || user.email || "User";
      userName.textContent = displayName.split(" ")[0];
      username.textContent = displayName;
      displayMessages(user);
    } else {
      window.location.href = "login.html";
    }
  });
}

authenticateUser();

function logOutBtn() {
  if (!confirm("Are you sure you want to log out?")) return;

  auth.signOut()
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

function displayMessages(user) {
  database.ref("chats").orderByChild("createdAt").on("value", (snapshot) => {
    chatMessages.innerHTML = "";

    snapshot.forEach((messageSnapshot) => {
      const chat = messageSnapshot.val();
      if (!chat || chat.isDeleted) return;

      const messageKey = messageSnapshot.key;
      const isMine = chat.senderUid
        ? chat.senderUid === user.uid
        : (user.displayName || user.email || "User") === chat.sender;

      const messageElement = document.createElement("div");
      messageElement.className = `message ${isMine ? "mine" : ""}`;
      messageElement.dataset.key = messageKey;

      const senderElement = document.createElement("div");
      senderElement.className = "sender";
      senderElement.textContent = isMine
        ? "You"
        : (chat.sender || "User").split(" ")[0];

      const textElement = document.createElement("div");
      textElement.className = "text";
      textElement.textContent = chat.message || "";

      const timeElement = document.createElement("span");
      timeElement.className = "time";
      timeElement.textContent = chat.time || "";

      messageElement.append(senderElement, textElement, timeElement);
      chatMessages.appendChild(messageElement);

    });

    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
 

     if (scrollToLatestMessage) {
        scrollChatToBottom();
        scrollToLatestMessage = false;
      }
  });
}

// Click your own message to show Edit and Delete choices.
chatMessages.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-action]");
  const messageElement = event.target.closest(".message");

  if (actionButton && messageElement) {
    if (!messageElement.classList.contains("mine")) return;

    const messageKey = messageElement.dataset.key;

    if (actionButton.dataset.action === "edit") {
      const currentMessage = messageElement.querySelector(".text").textContent;
      const editedMessage = prompt("Edit your message:", currentMessage);

      if (editedMessage === null || !editedMessage.trim()) return;

      try {
        await database.ref(`chats/${messageKey}`).update({
          message: editedMessage.trim(),
          editedAt: firebase.database.ServerValue.TIMESTAMP
        });
      } catch (error) {
        alert(`Could not edit message: ${error.message}`);
      }

      return;
    }

    if (actionButton.dataset.action === "delete") {
      if (!confirm("Are you sure you want to delete this message?")) return;

      try {
        await database.ref(`chats/${messageKey}`).update({
          isDeleted: true,
          deletedAt: firebase.database.ServerValue.TIMESTAMP
        });
      } catch (error) {
        alert(`Could not delete message: ${error.message}`);
      }

      return;
    }
  }

  document.querySelectorAll(".message-actions").forEach((menu) => menu.remove());

  const ownMessage = event.target.closest(".message.mine");
  if (!ownMessage) return;

  const actions = document.createElement("div");
  actions.className = "message-actions";
  actions.innerHTML = `
    <button type="button" data-action="edit">Edit</button>
    <button type="button" data-action="delete">Delete</button>
  `;

  ownMessage.appendChild(actions);
});

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  const user = auth.currentUser;
  if (!user) return;

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";
  scrollToLatestMessage = true

  try {
    await database.ref("chats").push().set({
      sender: user.displayName || user.email || "User",
      senderUid: user.uid,
      message,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }),
      isDeleted: false
    });

    messageInput.value = "";
  } catch (error) {
    alert(`Could not send message: ${error.message}`);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
  }
}