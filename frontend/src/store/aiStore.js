import { create } from 'zustand';

export const useAIStore = create((set, get) => ({
  messages: [
    { id: 1, sender: 'ai', text: 'Hello Sarah! I am your HR AI Assistant. How can I help you today? You can ask me about employee attendance, probation endings, recruitment bottlenecks, or generate job descriptions.' }
  ],
  isThinking: false,

  sendMessage: (text) => {
    const userMsg = { id: Date.now(), sender: 'user', text };
    set((state) => ({ messages: [...state.messages, userMsg], isThinking: true }));

    setTimeout(() => {
      let aiReply = "I have analyzed your request across the enterprise HR database. Here is what I found:";
      const lower = text.toLowerCase();
      
      if (lower.includes('absent') || lower.includes('attendance')) {
        aiReply = "Based on today's logs: 1 employee is on approved leave (Sophia Martinez), and 2 employees checked in late (Alex Vance & Daniel Kim). Overall present rate is 92%.";
      } else if (lower.includes('probation')) {
        aiReply = "Michael Chang (DevOps Architect) is currently in probation ending on September 15, 2026. His performance rating is currently 4.5/5.";
      } else if (lower.includes('job') || lower.includes('jd')) {
        aiReply = "I can auto-generate a comprehensive Job Description with required skills, responsibilities, and compensation bands. Click 'Generate Job Description' above!";
      } else {
        aiReply = `AI Analysis Completed for: "${text}". All parameters are compliant with organizational HR policy.`;
      }

      set((state) => ({
        messages: [...state.messages, { id: Date.now() + 1, sender: 'ai', text: aiReply }],
        isThinking: false
      }));
    }, 1000);
  }
}));
