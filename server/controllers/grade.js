const { User, Grade, Project, Deliverable } = require("../models");
const { timeToGrade } = require("../../configuration").dev;

const controller = {
  giveGrade: async (req, res) => {
    try {
      const { value, deliverableId } = req.body;
      const { id } = req.session;
      console.log(value, id, deliverableId);
      const grade = await Grade.findOne({
        where: { userId: id, deliverableId },
      });

      if (!grade) {
        res.status(404).send({
          message: "Can't grade",
        });
      } else if (value < 1 || value > 10) {
        res.status(400).send({
          message: "Invalid grade",
        });
      } else {
        grade.update({ ...grade, value });
        res.status(201).send({
          message: `Grade given`,
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getGrades: async (req, res) => {
    try {
      const { id } = req.session;
      const grades = await Grade.findAll({ where: { userId: id }, raw: true });

      const deliverables = await Promise.all(
        grades.map(async (item) => {
          const deliverable = await Deliverable.findOne({
            where: { id: item.deliverableId },
            order: [["createdAt", "DESC"]],
            raw: true,
          });
          const project = await Project.findOne({
            where: { id: deliverable.projectId },
            raw: true,
          });
          const users = await User.findAll({
            attributes: ["firstName", "lastName", "email"],
            where: { projectId: project.id },
            raw: true,
          });
          const expireAt = new Date( //////           min    sec  milisec
            Date.parse(deliverable.createdAt) + timeToGrade * 60 * 1000
          );

          return {
            ...item,
            deliverable,
            project: { ...project, users },
            grade: item.value == -1 ? null : item.value,
            expireAt,
            status: expireAt > Date.now() ? "ACTIVE" : "EXPIRED",
          };
        })
      );

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
      const projectsRaw = await Project.findAll({ raw: true });

      const projects = await Promise.all(
        projectsRaw.map(async (project) => {
          const deliverableRaw = await Deliverable.findAll({
            where: { projectId: project.id },
            order: [["createdAt", "DESC"]],
            raw: true,
          });
          const users = await User.findAll({
            attributes: ["firstName", "lastName", "email"],
            where: { projectId: project.id },
            raw: true,
          });

          const deliverables = await Promise.all(
            deliverableRaw.map(async (deliverable) => {
              const gradesRaw = await Grade.findAll({
                where: { deliverableId: deliverable.id },
                raw: true,
              });
              const available = gradesRaw.length;
              const grades = gradesRaw
                .filter((item) => item.value != -1)
                .map(
                  (item) =>
                    Math.round((item.value + Number.EPSILON) * 100) / 100
                );

              let total;
              if (grades.length == 0) {
                total = -1;
              } else if (grades.length < 3) {
                total =
                  grades.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  ) / grades.length;
              } else {
                const min = Math.min(...grades);
                const max = Math.max(...grades);
                const over = grades.reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                );
                total = (over - min - max) / (grades.length - 2);
              }

              return {
                ...deliverable,
                grades,
                available,
                total: Math.round((total + Number.EPSILON) * 100) / 100,
              };
            })
          );

          const grades = deliverables
            .filter((item) => item.total != -1)
            .map(
              (item) => Math.round((item.total + Number.EPSILON) * 100) / 100
            );

          let total;
          if (grades.length == 0) {
            total = -1;
          } else if (grades.length < 3) {
            total =
              grades.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              ) / grades.length;
          } else {
            const min = Math.min(...grades);
            const max = Math.max(...grades);
            const over = grades.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            );
            total = (over - min - max) / (grades.length - 2);
          }

          return {
            ...project,
            total: Math.round((total + Number.EPSILON) * 100) / 100,
            deliverables,
            users,
          };
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
  getTotalGrade: async (req, res) => {
    try {
      const { id } = req.session;
      const user = await User.findOne({ where: { id }, raw: true });
      const deliverableRaw = await Deliverable.findAll({
        where: { projectId: user.projectId },
        raw: true,
      });

      const deliverables = await Promise.all(
        deliverableRaw.map(async (deliverable) => {
          const gradesRaw = await Grade.findAll({
            where: { deliverableId: deliverable.id },
            raw: true,
          });
          const grades = gradesRaw
            .filter((item) => item.value != -1)
            .map(
              (item) => Math.round((item.value + Number.EPSILON) * 100) / 100
            );

          let total;
          if (grades.length == 0) {
            total = -1;
          } else if (grades.length < 3) {
            total =
              grades.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              ) / grades.length;
          } else {
            const min = Math.min(...grades);
            const max = Math.max(...grades);
            const over = grades.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            );
            total = (over - min - max) / (grades.length - 2);
          }

          return {
            ...deliverable,
            grades,
            total: Math.round((total + Number.EPSILON) * 100) / 100,
          };
        })
      );

      const grades = deliverables
        .filter((item) => item.total != -1)
        .map((item) => Math.round((item.total + Number.EPSILON) * 100) / 100);

      let total;
      if (grades.length == 0) {
        total = -1;
      } else if (grades.length < 3) {
        total =
          grades.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          ) / grades.length;
      } else {
        const min = Math.min(...grades);
        const max = Math.max(...grades);
        const over = grades.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        total = (over - min - max) / grades.length - 2;
      }

      res.status(200).send({
        total: Math.round((total + Number.EPSILON) * 100) / 100,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
};

module.exports = controller;
