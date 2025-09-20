
// This is a mocked service to simulate Gemini API interaction for the frontend.
// It provides a realistic streaming experience without needing a real API key.

// Mocked empathetic responses tailored for Indian youth
const responses = [
  "I understand that dealing with academic pressure can be really tough. Many students in India feel this way. It's okay to feel overwhelmed. Remember to take small breaks and be kind to yourself. We can talk through some simple relaxation techniques if you'd like.",
  "That sounds really challenging. It takes a lot of courage to talk about relationship issues. In India, family and social expectations can add another layer of complexity. I'm here to listen without judgment. What's on your mind?",
  "It's completely normal to feel uncertain about the future, especially with so much competition. Let's break it down. What's one small thing that you enjoy doing? Sometimes, focusing on our interests can bring clarity.",
  "Thank you for sharing that with me. It sounds like you're carrying a heavy weight. Remember, your feelings are valid. You are not alone in this. Many people experience similar thoughts. There are ways to navigate these feelings, and I'm here to help you explore them.",
  "I hear you. Balancing personal aspirations with family expectations is a common struggle. It's important to find a middle path where you can honour your family while also being true to yourself. Have you thought about what a small step in that direction might look like?"
];

// A helper function to simulate network delay and streaming
// FIX: The stream now yields objects with a `text` property to match the Gemini API response shape.
async function* streamResponse(text: string) {
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
    yield { text: words.slice(0, i + 1).join(' ') };
  }
}

class MockChat {
  // FIX: Updated the return type to reflect the new stream chunk shape.
  async sendMessageStream(params: { message: string }): Promise<AsyncIterable<{ text: string }>> {
    console.log(`Mock AI received message: ${params.message}`);
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return streamResponse(randomResponse);
  }
}

class MockGoogleGenAI {
  chats = {
    create: (config: any) => {
      console.log('Mock Chat created with config:', config);
      return new MockChat();
    }
  };
}

// Export a singleton instance of our mocked service
export const ai = new MockGoogleGenAI();