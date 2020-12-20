const {
  User,
  Grade,
  UserDeliverable,
  Project,
  Deliverable,
} = require("../models");

const controller = {
  createProject: async (req, res) => {
    try {
      const { name, description } = req.body;
      const { id } = req.session;

      const project = await Project.create({
        name,
        description,
      });

      const user = await User.findOne({ where: { id } });
      user.update({ ...user, project });

      res.status(201).send({
        message: `Project was sucessfull created`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const projects = await Project.findALl({ raw: true });
      res.status(200).send(projects);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  addToProject: async (req, res) => {
    try {
      const { projectId } = req.body;

      const { id } = req.session;

      const project = await Project.findOne({
        raw: true,
        where: { id: projectId },
      });

      if (!project) {
        res.status(404).send({
          message: "Project not found",
        });
      } else {
        const user = await User.findOne({ where: { id } });
        user.update({ ...user, project });
        res.status(200).send({
          message: `You have been atached to the project`,
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  createDeliverable: async (req, res) => {
    try {
      const { projectId, source } = req.body;

      const project = await Project.findOne({
        raw: true,
        where: { id: projectId },
      });

      if (!project) {
        res.status(404).send({
          message: "Project not found",
        });
      } else {
        const deliverable = await Deliverable.create({
          source,
          projectId,
        });

        res.status(201).send({
          message: `Deliverable created`,
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getDeliverables: async (req, res) => {
    try {
      const { id } = req.session;

      const user = await User.findOne({ where: { id } });

      if (!user.projectId) {
        res.status(404).send({
          message: `No project found`,
        });
      }
      const deliverables = await Project.findALl({
        raw: true,
        where: { projectId: user.projectId },
      });

      res.status(200).send(deliverables);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getAllAsProf: async (req, res) => {
    try {
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
};

module.exports = controller;
