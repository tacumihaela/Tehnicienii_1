import Axios from "axios";

export async function loadProjects({ commit }) {
  const response = await Axios.get("/api/projects");

  commit("SET_PROJECTS", response.data);
}
export async function loadDeliverables({ commit }) {
  const response = await Axios.get("/api/projects/deliverables");

  commit("SET_DELIVERABLES", response.data);
}
export async function loadGrades({ commit }) {
  const response = await Axios.get("/api/grades");

  commit("SET_GRADES", response.data);
}
export async function loadAll({ commit }) {
  const response = await Axios.get("/api/grades/prof");

  commit("SET_ALL", response.data);
}
