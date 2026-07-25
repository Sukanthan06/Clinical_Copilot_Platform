import { HiOutlineSparkles } from "react-icons/hi2";

function ChatBubble({ role, content }) {
  const isAssistant = role === "assistant";

  return (
    <div className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isAssistant ? "bg-teal-500/15" : "bg-ink-100"
        }`}
      >
        {isAssistant ? (
          <HiOutlineSparkles className="h-4 w-4 text-teal-600" />
        ) : (
          <span className="font-mono text-[11px] font-semibold text-ink-600">SW</span>
        )}
      </div>

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? "rounded-tl-sm bg-white text-ink-700 shadow-soft"
            : "rounded-tr-sm bg-teal-500 text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default ChatBubble;
