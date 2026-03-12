import { useState, useRef, useEffect } from "react";
import { Send, X, Bot, User, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";



export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");
    const SUGGESTED_QUESTIONS = [
        "Tell me about Dharaneeshwar's background",
        "What are his core technical skills?",
        "Show me his top projects",
        "How can I contact him?"
    ];

    const { messages, setMessages, sendMessage, status, error } = useChat({
        transport: new DefaultChatTransport({
            // api: "http://localhost:3002/api/chat",
            api: "https://portfolio-chatbot-api-two.vercel.app/api/chat",
            // 10-second timeout implementation
            fetch: async (url, options) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                try {
                    const res = await fetch(url, {
                        ...options,
                        signal: controller.signal,
                    });
                    return res;
                } finally {
                    clearTimeout(timeoutId);
                }
            }
        }),
        onError: (err) => {
            // Append a user-friendly error message to the chat
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    parts: [{
                        type: "text",
                        text: "I'm sorry, I'm having trouble connecting to my brain. Please check your connection or try again in a moment."
                    }]
                }
            ]);
        },
    });

    const handleSuggestionClick = async (suggestion: string) => {
        if (isLoading) return;
        try {
            await sendMessage({ text: suggestion });
        } catch (err) {
        }
    };

    const isLoading = status === "submitted" || status === "streaming";

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
    }, [status]);

    useEffect(() => {
    }, [error]);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!input.trim() || isLoading) {
            return;
        }

        const userInput = input.trim();
        setInput(""); // Clear immediately to avoid jitter

        try {
            await sendMessage({ text: userInput });
        } catch (err) {
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (!input.trim() || isLoading) {
                return;
            }

            const userInput = input.trim();
            setInput(""); // Clear immediately to avoid jitter

            try {
                await sendMessage({ text: userInput });
            } catch (err) {
            }
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setIsOpen(true);
                        }}
                        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                        aria-label="Open AI Chatbot"
                    >
                        <Bot size={28} />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 right-6 z-50 w-[400px] sm:w-[450px] h-[550px] max-h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-background/80 border border-border"
                    >
                        <div className="flex items-center justify-between p-4 bg-primary/10 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary rounded-full text-primary-foreground shadow-sm">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">AI Assistant</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={clearChat}
                                    title="Clear Chat"
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                    <Trash2 size={16} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setIsOpen(false);
                                    }}
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                    <X size={18} />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                            {messages.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full px-6 text-center space-y-6"
                                >
                                    <div className="p-4 bg-primary/10 rounded-3xl">
                                        <Bot size={48} className="text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">Hello!</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Yo! This is Dharaneeshwar's AI assistant. Ask me anything about his work, projects, or background!
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 w-full pt-4">
                                        {SUGGESTED_QUESTIONS.map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => handleSuggestionClick(q)}
                                                className="text-left px-4 py-2.5 text-xs font-medium rounded-xl border border-border bg-background hover:bg-primary/5 hover:border-primary/50 transition-all active:scale-[0.98] text-foreground/80 hover:text-primary"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            {messages.map((message) => {
                                const isUser = message.role === "user";
                                const textContent =
                                    message.parts
                                        ?.filter((part) => part.type === "text")
                                        .map((part) => part.text)
                                        .join("") || "";

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={message.id}
                                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`flex gap-2 max-w-[90%] inline-flex ${isUser ? "flex-row-reverse" : "flex-row"}`}
                                        >
                                            <div
                                                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-foreground"
                                                    }`}
                                            >
                                                {isUser ? <User size={14} /> : <Bot size={14} />}
                                            </div>
                                            <div
                                                className={`px-4 py-2.5 text-[13px] leading-relaxed break-words ${isUser
                                                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                                    : "bg-muted border border-border/50 rounded-2xl rounded-tl-sm"
                                                    }`}
                                            >
                                                {isUser ? (
                                                    <div className="whitespace-pre-wrap break-words">
                                                        {textContent}
                                                    </div>
                                                ) : (
                                                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:mb-1 prose-headings:mt-2 first:prose-headings:mt-0 text-[13px]">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {textContent}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex gap-2 max-w-[85%] flex-row inline-flex">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted text-foreground flex items-center justify-center">
                                            <Bot size={14} />
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl bg-muted border border-border/50 rounded-tl-sm flex gap-1 items-center">
                                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-background border-t border-border/50">
                            <form className="flex items-end gap-2 relative" onSubmit={handleFormSubmit}>
                                <textarea
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about my experience..."
                                    className="flex-1 max-h-32 min-h-[44px] w-full resize-none rounded-xl border border-input bg-transparent px-4 py-3 text-[13px] shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={1}
                                />
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    size="icon"
                                    className="h-11 w-11 rounded-xl shrink-0 transition-transform active:scale-95"
                                >
                                    <Send size={18} />
                                </Button>
                            </form>
                            <div className="text-center mt-2">
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                    Powered by Gemini
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}