let conversation = [
  {
    role: "system",
    content: "You are Jarvis, a smart AI assistant."
  }
];

function getMemory() {
  return conversation;
}

function addMessage(msg) {
  conversation.push(msg);

  if (conversation.length > 15) {
    conversation.splice(1, 1);
  }
}

function resetMemory() {
  conversation = [
    {
      role: "system",
      content: "You are Jarvis, a smart AI assistant."
    }
  ];
}

module.exports = {
  getMemory,
  addMessage,
  resetMemory
};
