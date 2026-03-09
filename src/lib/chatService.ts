import { resumeData } from "../data/resumeContext";

// In the future, this function will check for an API URL
// and call the Vercel backend using fetch()
export async function generateChatResponse(message: string): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1000));

    const lowerMsg = message.toLowerCase();

    // Basic greeting
    if (lowerMsg.match(/\b(hi|hello|hey|greetings|howdy)\b/)) {
        return `Hello! I'm Dharaneeshwar's AI Assistant. How can I help you? I can answer questions about his experience, skills, projects, or education.`;
    }

    // Experience queries
    if (lowerMsg.includes("experience") || lowerMsg.includes("work") || lowerMsg.includes("optum")) {
        const optumExp = resumeData.experience.find(e => e.company.includes("Optum"));
        return `Dharaneeshwar has over 3 years of industry experience. He worked as a Software Engineer at Optum (UnitedHealth Group) from 2022-2024, where he optimized backend performance by 40% and migrated systems to AWS serverless. He will also be interning at The Advisory Board Company in 2025!`;
    }

    // Skills queries
    if (lowerMsg.includes("skill") || lowerMsg.includes("tech") || lowerMsg.includes("stack")) {
        return `Dharaneeshwar is highly skilled in: ${resumeData.skills.slice(0, 10).join(", ")} and more. He specializes in backend architecture, cloud systems (AWS), and AI integrations!`;
    }

    // Education queries
    if (lowerMsg.includes("education") || lowerMsg.includes("study") || lowerMsg.includes("college") || lowerMsg.includes("degree")) {
        return `He is currently pursuing his Master's in Computer Science at the University at Buffalo, SUNY (Expected Dec 2025). Prior to that, he earned his Bachelor's degree from the prestigious National Institute of Technology, Tiruchirappalli (NIT Trichy).`;
    }

    // Projects queries
    if (lowerMsg.includes("project") || lowerMsg.includes("build") || lowerMsg.includes("portfolio")) {
        return `Some of his top projects include an "AI Summarization Pipeline" built with PyTorch and FastAPI, and a full-stack "Discord Automation Bot" deployed on AWS using Docker. You can see more details in the Projects section above!`;
    }

    // Contact / Hire
    if (lowerMsg.includes("contact") || lowerMsg.includes("email") || lowerMsg.includes("hire") || lowerMsg.includes("reach")) {
        return `You can reach out to Dharaneeshwar at ${resumeData.personal.email} or connect with him on LinkedIn here: ${resumeData.personal.linkedin}. He is actively looking for full-time roles starting early 2026!`;
    }

    // Default fallback
    return `That's a great question! While my current context is limited in this Demo Mode, you can find a lot of information in the sections above, or reach out to Dharaneeshwar directly at ${resumeData.personal.email}.`;
}
