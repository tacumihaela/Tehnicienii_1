const { User, Grade, Project, Deliverable } = require("../models");
const { Op } = require("sequelize");
const { timeToEditDeliverable } = require("../../configuration").dev;

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const controller = {
  createProject: async (req, res) => {
    try {
      const { name, description } = req.body;
      const { id } = req.session;
      const user = await User.findOne({ where: { id } });

      if (!user.projectId) {
        const project = await Project.create({
          name,
          description,
        });

        user.update({ ...user, projectId: project.id });

        res.status(201).send({
          message: `Project was sucessfull created`,
          project,
        });
      } else {
        res.status(400).send({
          message: `Already asigned to a project`,
          project,
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const projectsRaw = await Project.findAll({ raw: true });

      const projects = await Promise.all(
        projectsRaw.map(async (project) => {
          const users = await User.findAll({
            attributes: ["firstName", "lastName", "email"],
            where: { projectId: project.id },
            raw: true,
          });
          return { ...project, users };
        })
      );
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
        user.update({ ...user, projectId: project.id });
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

  updateDeliverable: async (req, res) => {
    try {
      let { projectId, source } = req.body;
      const { id } = req.session;

      const user = await User.findOne({ where: { id }, raw: true });
      if (!projectId) projectId = user.projectId;

      const project = await Project.findOne({
        raw: true,
        where: { id: projectId },
      });

      if (!project) {
        res.status(404).send({
          message: "Project not found",
        });
      } else {
        const found = await Deliverable.findOne({
          where: {
            projectId: project.id,
            createdAt: {
              [Op.gte]: new Date(
                Date.now() - timeToEditDeliverable * 60 * 1000
              ),
            },
          },
        });
        if (!found) {
          const deliverable = await Deliverable.create({
            source,
            projectId,
          });
          const users = await User.findAll({
            attributes: ["id", "projectId", "type"],
            raw: true,
            where: {
              projectId: { [Op.ne]: project.id },
              type: "student",
            },
          });
          await Promise.all(
            users.map(async (item) => {
              const n = randomIntFromInterval(1, 5);

              if (n == 4) {
                await Grade.create({
                  deliverableId: deliverable.id,
                  userId: item.id,
                  value: -1,
                });
              }
            })
          );

          res.status(201).send({
            message: `Deliverable created`,
          });
        } else {
          await found.update({ ...found, source, projectId });
          res.status(200).send({
            message: `Deliverable updated`,
          });
        }
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
      const deliverables = await Deliverable.findAll({
        raw: true,
        where: { projectId: user.projectId },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).send(deliverables);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
};

module.exports = controller;
