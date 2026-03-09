import { useState, useRef, useEffect } from "react";
import { generateChatResponse, resumeData } from "../../lib/chatService";
import { Send, X, Bot, User, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    isTyping?: boolean;
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi! I'm an AI assistant trained on Dharaneeshwar's resume. Ask me anything about his experience, projects, or skills!",
            sender: "ai",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input.trim(),
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const responseText = await generateChatResponse(userMessage.text);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: "ai",
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I encountered an issue connecting to my knowledge base. Please try reaching out via email directly!",
                sender: "ai",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: "1",
                text: "Chat cleared! How can I help you learn more about Dharaneeshwar?",
                sender: "ai",
            },
        ]);
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
                        onClick={() => setIsOpen(true)}
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
                        className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-background/80 border border-border"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 bg-primary/10 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary rounded-full text-primary-foreground shadow-sm">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Portfolio AI (Demo)</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Chat" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Trash2 size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <X size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                            {messages.map((message) => {
                                const isUser = message.sender === "user";
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={message.id}
                                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex gap-2 max-w-[85%] inline-flex ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                                                {isUser ? <User size={14} /> : <Bot size={14} />}
                                            </div>
                                            <div
                                                className={`px-4 py-2.5 text-sm leading-relaxed ${isUser
                                                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                                        : "bg-muted border border-border/50 rounded-2xl rounded-tl-sm"
                                                    }`}
                                            >
                                                {message.text}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {isTyping && (
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

                        {/* Input Area */}
                        <div className="p-4 bg-background border-t border-border/50">
                            <div className="flex items-end gap-2 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about my experience..."
                                    className="flex-1 max-h-32 min-h-[44px] w-full resize-none rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={1}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    size="icon"
                                    className="h-11 w-11 rounded-xl shrink-0 transition-transform active:scale-95"
                                >
                                    <Send size={18} />
                                </Button>
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                    Running in local Demo mode
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
