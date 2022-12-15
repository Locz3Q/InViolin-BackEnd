const LessonModel = require('../server/models/lessons');

const getLessons = async (req, res) => {
  try {
    const data = await LessonModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}