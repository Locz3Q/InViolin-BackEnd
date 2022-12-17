const express = require('express');
const router = express.Router();
const StudentModel = require('../models/student');
const { registerStudent, loginStudent, getMe } = require('../../controllers/studentController');
const { protect } = require('../../middleware/authMiddleware')

router.get('/offGet', async (req, res) => {
  try {
    res.json({"users": ["Blazej", "Biskup"]})
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

router.post('/signup', registerStudent);

router.post('/signin', loginStudent);

router.get('/me', protect, getMe);

//Post Method
router.post('/post', async (req, res) => {
  const data = new StudentModel({
    name: req.body.name,
    subject: req.body.subject
  })
  try{
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
})

//Get all Method
router.get('/getAll', async (req, res) => {
  try {
    const data = await StudentModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
  try {
    const data = await StudentModel.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = {new: true};

    const result = await StudentModel.findByIdAndUpdate(
      id, updatedData, options
    )
    res.send(result)
  } catch (error) {
    res.status(400).json({message: error.message});
  }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const dataToDelete = await StudentModel.findByIdAndDelete(id);
    res.send(`Document with ${dataToDelete.name} has been deleted..`)
  } catch(error) {
    res.status(400).json({message: error.message});
  }
})

module.exports = router;