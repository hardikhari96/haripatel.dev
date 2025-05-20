export interface Project {
  id: string;
  name: string;
  description: string;
  github: string;
  live?: string;
  tech: string[];
  image?: string;
  category: string;
}

export const projects: Project[] = [
  {
    id: "trading-platform",
    name: "Trading Platform",
    description: "Real-time trading platform with MCP integration, SSE-based updates, and Zerodha Kite API integration. Built with TypeScript, Node.js, and EJS templates.",
    github: "https://github.com/haripatel/trading-platform",
    live: "https://trading.mcp-hub.site",
    tech: ["TypeScript", "Node.js", "EJS", "Zerodha Kite API", "SSE", "MCP"],
    category: "Finance"
  },
  {
    id: "investment-platform",
    name: "Investment Platform",
    description: "Web app for investment product management with cross-functional workflow, vendor integration, and scalable architecture.",
    github: "https://github.com/haripatel/investment-platform",
    tech: ["Angular", "Node.js", "CentOs", "MariaDb"],
    category: "Finance"
  },
  {
    id: "badminton-tournament",
    name: "Badminton Tournament System",
    description: "Automated scoring and tournament management with custom backend, real-time stats, and secure user authentication.",
    github: "https://github.com/haripatel/badminton-tournament",
    tech: ["Angular", "Node.js", "Socket.io", "MySQL", "Ubuntu"],
    category: "Sports"
  }
];
