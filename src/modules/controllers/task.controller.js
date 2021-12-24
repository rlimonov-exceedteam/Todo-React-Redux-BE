const Task = require('../../db/models/task-schema/index');

module.exports.getAllTasks = async (req, res) => {
  try {
    const userId = await req.payload.id;
    
    await Task.find({userId}).then(result => {
      res.send(result);
    });
  } catch (error) {
    return res.status(404).json({message: 'Tasks are not found'});
  }
}

module.exports.addTask = async (req, res) => {
  try {
    const {
      taskText,
      stage
    } = req.body;

    const userId = await req.payload.id;

    if (taskText && stage) {
      const task = new Task({...req.body, userId});
      await task.save()
      .then(result => {
        res.send(result);
      })
      .catch(() => {
        res.status(500).send({message: 'Internal server error'});
      });
    } else {
      res.status(422).send({message: 'Data is incorrect, error'});
    }
  } catch(e) {
    res.status(401).send({message: 'Autentification error'});
  }
}

module.exports.updateTask = async (req, res) => {
  const body = req.body;
  const { _id } = body;

  await Task.findOneAndUpdate({_id}, body, {new: true})
  .then(result => {
    res.send(result);
  })
  .catch(() => {
    res.status(400).send({message: 'Task is not found'});
  });
}

module.exports.changeTaskStage = async (req, res) => {
  const body = req.body;
  const { _id } = body;

  await Task.findOneAndUpdate({_id}, body, {new: true})
  .then(result => {
    res.send(result);
  })
  .catch(() => {
    res.status(404).send({message: 'Task is not found'});
  });
}

module.exports.deleteTask = async (req, res) => {
  const { _id } = req.query;
  
  if (!_id) {
    res.status(400).send('Data is incorrect, error!');
  } else {
    Task.deleteOne({_id})
    .then(() => {
      res.send('Succesfully deleted');
    })
    .catch(() => {
      res.status(500).send({message: 'Internal server error'});
    });
  }
}