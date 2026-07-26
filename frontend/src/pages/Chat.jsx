import { useEffect, useRef, useState } from "react";
import { HiOutlinePaperAirplane, HiOutlineSparkles } from "react-icons/hi2";
import ChatBubble from "../components/chat/ChatBubble.jsx";
import { sendMessage as apiSendMessage } from "../services/assistantService.js";

const suggestedPrompts = [
  "Summarize my recent lab results",
  "What do my latest vitals suggest?",
  "Am I eligible for any clinical trials?",
  "Explain my hypertension diagnosis",
];

function Chat() {
  const patientName = localStorage.getItem("userName") || "Patient";
  
  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "assistant",
      content: `Hi ${patientName.split(" ")[0]}, I'm your Clinical Copilot AI Assistant. I can help explain your reports, track symptoms, or find relevant clinical trials. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: trimmed }]);
    setInput("");
    setIsThinking(true);

    try {
      const patientId = localStorage.getItem("patientId") || "PAT001";
      const response = await apiSendMessage(patientId, trimmed);
      
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: response.answer || "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("Error calling assistant:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error connecting to the backend.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-5">
        <p className="label-eyebrow">Step 5 of 6</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-800">AI Assistant</h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Ask questions about your reports, medications, or care plan.
        </p>
      </div>

      <div ref={scrollRef} className="card flex-1 space-y-5 overflow-y-auto p-6">
        {messages.map((m) => (
          <ChatBubble key={m.id} role={m.role} content={m.content} />
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-ink-400">
            <HiOutlineSparkles className="h-4 w-4 animate-pulse text-teal-500" />
            Thinking...
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="rounded-full border border-mist-300 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:border-teal-300 hover:bg-teal-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="mt-4 flex items-center gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your health record..."
          className="flex-1 rounded-xl border border-mist-300 bg-white px-4 py-3 text-sm text-ink-800 outline-none transition-colors focus:border-teal-400"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send message"
          className="btn-primary h-11 w-11 shrink-0 !px-0"
        >
          <HiOutlinePaperAirplane className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export default Chat;
