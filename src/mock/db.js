// Mock Database using localStorage to persist state across refreshes

const INITIAL_USERS = [
  {
    id: "user-client-1",
    email: "client@example.com",
    password: "Password123",
    role: "client",
    name: "Alex Rivera",
    company: "Apex Tech Solutions",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    title: "Product Director",
    bio: "Building enterprise scalable web applications. Always looking for talented developers.",
    skills: ["React", "Node.js", "Java Spring Boot", "PostgreSQL"],
    rating: 4.9,
    reviewsCount: 12,
    walletBalance: 8500.00
  },
  {
    id: "user-free-1",
    email: "freelancer@example.com",
    password: "Password123",
    role: "freelancer",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    title: "Senior Full Stack Engineer",
    bio: "Specializing in React, Tailwind, and Node.js. 6+ years of experience delivering high quality web interfaces.",
    skills: ["React", "JavaScript", "Tailwind CSS", "Framer Motion", "TypeScript", "Node.js"],
    rating: 4.8,
    reviewsCount: 24,
    hourlyRate: 65,
    walletBalance: 1240.00,
    portfolio: [
      { id: "p1", title: "E-Commerce Frontend", desc: "A gorgeous modern web shop dashboard built in React", link: "https://github.com", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300" },
      { id: "p2", title: "SaaS Analytics Dashboard", desc: "Interactive visualization using Recharts and Framer Motion", link: "https://github.com", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300" }
    ],
    experience: [
      { role: "Senior Web Developer", company: "PixelCraft Studios", duration: "2022 - Present", desc: "Built interactive web platforms using React and Tailwind." }
    ],
    education: [
      { degree: "B.S. in Computer Science", school: "Stanford University", duration: "2015 - 2019" }
    ],
    certificates: [
      { name: "AWS Certified Developer", issuer: "Amazon Web Services", year: "2023" }
    ]
  },
  {
    id: "user-free-2",
    email: "freelancer2@example.com",
    password: "Password123",
    role: "freelancer",
    name: "Marcus Aurelius",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    title: "Java Spring Boot Specialist",
    bio: "Enterprise architect focused on building highly secure, multi-threaded Spring Boot REST APIs and PostgreSQL databases.",
    skills: ["Java", "Spring Boot", "Spring Security", "PostgreSQL", "Docker"],
    rating: 5.0,
    reviewsCount: 32,
    hourlyRate: 80,
    walletBalance: 3200.00,
    portfolio: [
      { id: "p3", title: "Microservices Gateway", desc: "Configured API gateway and discovery services in Spring Cloud", link: "https://github.com", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300" }
    ],
    experience: [
      { role: "Backend Architect", company: "FinTech Corp", duration: "2020 - 2024", desc: "Designed payment architectures and high-performance databases." }
    ],
    education: [
      { degree: "M.S. in Software Engineering", school: "MIT", duration: "2017 - 2019" }
    ],
    certificates: [
      { name: "Oracle Certified Professional Java EE", issuer: "Oracle", year: "2021" }
    ]
  },
  {
    id: "user-admin-1",
    email: "admin@example.com",
    password: "Password123",
    role: "admin",
    name: "System Director",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    title: "Platform Administrator",
    bio: "Supervising system activities, resolving disputes, and maintaining marketplace integrity.",
    walletBalance: 250000.00
  }
];

const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "Enterprise Dashboard Redesign in Tailwind",
    description: "We are looking for a Senior React developer to rebuild our legacy dashboard with modern visual design, glassmorphism, Framer Motion animations, and interactive charts. Must be highly responsive and use clean component modularity.",
    category: "Development",
    subcategory: "Web Development",
    budget: 4500,
    deadline: "2026-08-30",
    skills: ["React", "Tailwind CSS", "Framer Motion", "JavaScript"],
    clientId: "user-client-1",
    clientName: "Alex Rivera",
    clientRating: 4.9,
    status: "open", // open, ongoing, review, completed, archived
    attachments: ["Dashboard_Mockup.pdf", "API_Specs.md"],
    createdAt: "2026-07-15T10:00:00.000Z",
    bidsCount: 2
  },
  {
    id: "proj-2",
    title: "Java Spring Boot REST API for E-Commerce",
    description: "Need a robust, scalable Spring Boot microservices backend supporting JWT OAuth2 authentication, PostgreSQL database, Hibernating ORM, and Spring Security. The project requires high coverage JUnit testing and Swagger/OpenAPI documentation.",
    category: "Development",
    subcategory: "Backend APIs",
    budget: 6200,
    deadline: "2026-09-15",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Spring Security"],
    clientId: "user-client-1",
    clientName: "Alex Rivera",
    clientRating: 4.9,
    status: "open",
    attachments: ["DB_Schema.png"],
    createdAt: "2026-07-16T14:30:00.000Z",
    bidsCount: 1
  },
  {
    id: "proj-3",
    title: "Mobile App Figma to Flutter Frontend",
    description: "Translate our beautifully polished SaaS mobile layouts (Figma) into pixel-perfect Flutter components. Standard layout transitions, offline support using SQLite, and integration with dynamic web sockets.",
    category: "Design & Mobile",
    subcategory: "Mobile App Development",
    budget: 3200,
    deadline: "2026-08-25",
    skills: ["Flutter", "Dart", "Figma", "WebSockets"],
    clientId: "user-client-1",
    clientName: "Alex Rivera",
    clientRating: 4.9,
    status: "completed",
    attachments: [],
    createdAt: "2026-07-10T08:15:00.000Z",
    bidsCount: 3
  }
];

const INITIAL_BIDS = [
  {
    id: "bid-1",
    projectId: "proj-1",
    freelancerId: "user-free-1",
    freelancerName: "Sarah Chen",
    freelancerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    freelancerTitle: "Senior Full Stack Engineer",
    freelancerRating: 4.8,
    proposal: "I have 6 years of experience building premium React portals and dashboard systems. I will implement a custom layout utilizing Tailwind CSS, responsive designs, and Framer Motion micro-interactions as specified. I provide structured code, reusable component architecture, and high coverage testing.",
    amount: 4200,
    duration: 21, // days
    status: "pending", // pending, accepted, rejected
    createdAt: "2026-07-16T12:00:00.000Z"
  },
  {
    id: "bid-2",
    projectId: "proj-1",
    freelancerId: "user-free-2",
    freelancerName: "Marcus Aurelius",
    freelancerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    freelancerTitle: "Java Spring Boot Specialist",
    freelancerRating: 5.0,
    proposal: "Although I specialize in backend architecture, I can construct the React components and orchestrate the clean layout. I can help bridge the frontend design and future Spring Boot integration smoothly.",
    amount: 4500,
    duration: 25,
    status: "pending",
    createdAt: "2026-07-17T09:15:00.000Z"
  },
  {
    id: "bid-3",
    projectId: "proj-2",
    freelancerId: "user-free-2",
    freelancerName: "Marcus Aurelius",
    freelancerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    freelancerTitle: "Java Spring Boot Specialist",
    freelancerRating: 5.0,
    proposal: "This aligns perfectly with my professional experience. I have built secure backends for three banking platforms using Java 17, Spring Boot, JPA/Hibernate, and PostgreSQL. I will design a scalable REST structure and set up OAuth2 JWT flow.",
    amount: 6000,
    duration: 30,
    status: "pending",
    createdAt: "2026-07-17T11:45:00.000Z"
  }
];

const INITIAL_CONTRACTS = [
  {
    id: "cont-1",
    projectId: "proj-3",
    projectTitle: "Mobile App Figma to Flutter Frontend",
    clientId: "user-client-1",
    clientName: "Alex Rivera",
    freelancerId: "user-free-1",
    freelancerName: "Sarah Chen",
    amount: 3200,
    duration: 15,
    status: "completed", // active, review, completed, disputed
    escrowPaid: true,
    workSubmitted: true,
    workGithub: "https://github.com/example/flutter-figma-app",
    workDemo: "https://demo.example.com",
    workDesc: "Completed all 12 layouts, interactive map features, and SQLite storage logic.",
    reviewFromClient: {
      rating: 5,
      comment: "Outstanding developer! Delivered clean, modular Flutter code that matched our Figma designs exactly. Highly responsive and professional."
    },
    reviewFromFreelancer: {
      rating: 5,
      comment: "Alex is an excellent client. Gave very clear specs, quick feedback, and paid on time. Highly recommended!"
    },
    createdAt: "2026-07-11T10:00:00.000Z"
  }
];

const INITIAL_MESSAGES = [
  {
    id: "m1",
    senderId: "user-client-1",
    recipientId: "user-free-1",
    content: "Hi Sarah, I saw your proposal on the Dashboard Redesign project. Do you have any examples of glassmorphic UIs you've built?",
    timestamp: "2026-07-16T15:00:00.000Z"
  },
  {
    id: "m2",
    senderId: "user-free-1",
    recipientId: "user-client-1",
    content: "Hello Alex! Yes, my SaaS Analytics Dashboard portfolio piece features a customizable blur backdrop. I've sent a link in my bio.",
    timestamp: "2026-07-16T15:05:00.000Z"
  },
  {
    id: "m3",
    senderId: "user-client-1",
    recipientId: "user-free-1",
    content: "Looks fantastic. Let's schedule a call tomorrow to finalize details.",
    timestamp: "2026-07-16T15:10:00.000Z"
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "not-1",
    userId: "user-client-1",
    title: "New Bid Submitted",
    message: "Sarah Chen submitted a bid of $4,200 on 'Enterprise Dashboard Redesign in Tailwind'.",
    type: "bid", // bid, system, payment, contract, chat
    read: false,
    timestamp: "2026-07-16T12:00:00.000Z"
  },
  {
    id: "not-2",
    userId: "user-client-1",
    title: "New Bid Submitted",
    message: "Marcus Aurelius submitted a bid of $4,500 on 'Enterprise Dashboard Redesign in Tailwind'.",
    type: "bid",
    read: true,
    timestamp: "2026-07-17T09:15:00.000Z"
  },
  {
    id: "not-3",
    userId: "user-free-1",
    title: "Milestone Paid",
    message: "Alex Rivera funded the $3,200 escrow for project 'Mobile App Figma to Flutter Frontend'.",
    type: "payment",
    read: true,
    timestamp: "2026-07-11T10:05:00.000Z"
  }
];

const getLocalStorage = (key, fallback) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const setLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize database
export const db = {
  getUsers: () => getLocalStorage("marketplace_users", INITIAL_USERS),
  setUsers: (users) => setLocalStorage("marketplace_users", users),

  getProjects: () => getLocalStorage("marketplace_projects", INITIAL_PROJECTS),
  setProjects: (projects) => setLocalStorage("marketplace_projects", projects),

  getBids: () => getLocalStorage("marketplace_bids", INITIAL_BIDS),
  setBids: (bids) => setLocalStorage("marketplace_bids", bids),

  getContracts: () => getLocalStorage("marketplace_contracts", INITIAL_CONTRACTS),
  setContracts: (contracts) => setLocalStorage("marketplace_contracts", contracts),

  getMessages: () => getLocalStorage("marketplace_messages", INITIAL_MESSAGES),
  setMessages: (messages) => setLocalStorage("marketplace_messages", messages),

  getNotifications: () => getLocalStorage("marketplace_notifications", INITIAL_NOTIFICATIONS),
  setNotifications: (notifications) => setLocalStorage("marketplace_notifications", notifications),

  resetDB: () => {
    localStorage.removeItem("marketplace_users");
    localStorage.removeItem("marketplace_projects");
    localStorage.removeItem("marketplace_bids");
    localStorage.removeItem("marketplace_contracts");
    localStorage.removeItem("marketplace_messages");
    localStorage.removeItem("marketplace_notifications");
  }
};
