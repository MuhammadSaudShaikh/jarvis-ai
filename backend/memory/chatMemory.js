let conversation = [
  {
    role: "system",
    content: "You are Jarvis, a smart AI assistant. You speak in Roman Urdu and English mix. Be helpful and friendly."
  }
];

function getMemory() {
  return conversation;
}

function addMessage(msg) {
  conversation.push(msg);

  // Keep last 15 messages (excluding system prompt)
  if (conversation.length > 16) {
    conversation.splice(1, 1);
  }
}

function resetMemory() {
  conversation = [
    {
      role: "system",
      content: "You are Jarvis, a smart AI assistant. You speak in Roman Urdu and English mix. Be helpful and friendly."
    }
  ];
}

module.exports = {
  getMemory,
  addMessage,
  resetMemory
};
