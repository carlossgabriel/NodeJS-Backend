const express = require("express");

const { uuid } = require("uuidv4");

const app = express();

// Para que o express utilize jsons para interpretar o que eh recebido
// Eh necessário passar para a instancia do app o <app.use.(express.json())>

app.use(express.json());

const projects = [];

app.get("/projects", (request, response) => {
  // Query params: filter and paginate
  // Parametros de querys, sao passados em formato de query
  // const { title, owner } = request.query;

  // console.log(title);
  // console.log(owner);

  return response.json(projects);
});

app.post("/projects", (request, response) => {
  // Request body
  // const body = request.body;
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

app.put("/projects/:id", (request, response) => {
  // Route Params: identify resources to delete, or update
  // Parametros de rotas: verifica na rota se foi passada alguma infomacao como identificador
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.status(200).json(project);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  projects.splice(projectIndex, 1);

  return response.status(204);
});

app.listen(3333, () => {
  console.log("Back-end started");
});
