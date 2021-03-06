const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

// Para que o express utilize jsons para interpretar o que eh recebido
// Eh necessário passar para a instancia do app o <app.use.(express.json())>
app.use(cors());
app.use(express.json());

const projects = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }

  return next();
}

app.use(logRequest);
app.use("/projects/:id", validateProjectId);

app.get("/projects", (request, response) => {
  // Query params: filter and paginate
  // Parametros de querys, sao passados em formato de query
  const { title } = request.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;

  // console.log(title);
  // console.log(owner);

  return response.json(results);
});

app.post("/projects", (request, response) => {
  // Request body
  // const body = request.body;
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

/**
 * PUT method
 * Update an object by the ID informed on the @route
 */
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

  return response.status(204).json({ message: "Deleted" });
});

app.listen(3333, () => {
  console.log("Back-end started");
});
