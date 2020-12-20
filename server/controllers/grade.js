const {
  User,
  Grade,
  UserDeliverable,
  Projects,
  Deliverable,
} = require("../models");

const controller = {
  giveGrade: async (req, res) => {
    try {
      const { value, deliverableId } = req.body;
      const { id } = req.session;

      const grade = await Grade.find({ where: { userId: id, deliverableId } });

      if (!grade) {
        res.status(404).send({
          message: "Deliverable not found",
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
      const grades = await Grade.findAll({ where: { userId: id } });

      res.status(200).send(grades);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
};

module.exports = controller;
