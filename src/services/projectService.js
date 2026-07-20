import { db } from "../mock/db";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  getProjects: async (filters = {}) => {
    await delay();
    let projects = db.getProjects();

    const { search, category, minBudget, maxBudget, skills, status } = filters;

    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== "All") {
      projects = projects.filter(p => p.category === category);
    }

    if (status) {
      projects = projects.filter(p => p.status === status);
    } else {
      // By default, exclude archived projects for general browsings
      projects = projects.filter(p => p.status !== "archived");
    }

    if (minBudget) {
      projects = projects.filter(p => p.budget >= Number(minBudget));
    }

    if (maxBudget) {
      projects = projects.filter(p => p.budget <= Number(maxBudget));
    }

    if (skills && skills.length > 0) {
      projects = projects.filter(p => 
        skills.some(skill => p.skills.includes(skill))
      );
    }

    return projects;
  },

  getProjectById: async (id) => {
    await delay();
    const projects = db.getProjects();
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  },

  createProject: async (projectData, clientId, clientName) => {
    await delay();
    const projects = db.getProjects();
    const newProject = {
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      title: projectData.title,
      description: projectData.description,
      category: projectData.category,
      subcategory: projectData.subcategory || "General",
      budget: Number(projectData.budget),
      deadline: projectData.deadline,
      skills: projectData.skills || [],
      clientId,
      clientName,
      clientRating: 5.0,
      status: "open",
      attachments: projectData.attachments || [],
      createdAt: new Date().toISOString(),
      bidsCount: 0
    };

    projects.unshift(newProject);
    db.setProjects(projects);
    return newProject;
  },

  updateProject: async (id, projectData) => {
    await delay();
    const projects = db.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }

    const updatedProject = { ...projects[index], ...projectData };
    projects[index] = updatedProject;
    db.setProjects(projects);
    return updatedProject;
  },

  deleteProject: async (id) => {
    await delay();
    const projects = db.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    db.setProjects(filtered);

    // Also delete associated bids
    const bids = db.getBids();
    const filteredBids = bids.filter(b => b.projectId !== id);
    db.setBids(filteredBids);
    
    return true;
  },

  archiveProject: async (id) => {
    return projectService.updateProject(id, { status: "archived" });
  },

  duplicateProject: async (id) => {
    await delay();
    const project = await projectService.getProjectById(id);
    const projects = db.getProjects();
    
    const duplicated = {
      ...project,
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      title: `${project.title} (Copy)`,
      status: "open",
      bidsCount: 0,
      createdAt: new Date().toISOString()
    };

    projects.unshift(duplicated);
    db.setProjects(projects);
    return duplicated;
  },

  getClientProjects: async (clientId) => {
    await delay();
    const projects = db.getProjects();
    return projects.filter(p => p.clientId === clientId);
  }
};
