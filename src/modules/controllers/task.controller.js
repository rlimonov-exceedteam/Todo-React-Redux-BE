const Task = require('../../db/models/task-schema/index');
const User = require('../../db/models/user-schema/index');
const jwt = require('jsonwebtoken');

const verify = async (req, res) => {
  const token = req.headers.authorization;
  let id;

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      id = payload.id;
    } catch (e) {
      return res.status(401).send('token is not sended or is incorrect');
    }

    const someone = await User.findOne({_id: id});

    if (!someone) {
      res.send('unauthorized');
    }
    
    return id;
}

module.exports.getAllTasks = async (req, res) => {
  try {
    const userId = await verify(req, res);
    
    await Task.find({userId}).then(result => {
      res.send(result);
    });
  } catch (error) {
    return null;
  }
}

module.exports.addTask = async (req, res) => {
  try {
    const {
      taskText,
      stage
    } = req.body;

    const userId = await verify(req, res);

    if (taskText && stage) {
      const task = new Task({...req.body, userId});
      await task.save().then(result => {
        res.send(result);
      });
    } else {
      res.status(422).send('Data is incorrect, error!');
    }
  } catch(e) {
    console.log(e)
  }
}

module.exports.updateTask = async (req, res) => {
  const body = req.body;
  const { _id } = body;

  try {
    await verify(req, res);
  } catch(e) {
    console.log(e);
  }

  await Task.findOneAndUpdate({_id}, body, {new: true}).then(result => {
    res.send(result);
  });
}

module.exports.changeTaskStage = async (req, res) => {
  const body = req.body;
  const { _id } = body;

  try {
    await verify(req, res);
  } catch(e) {
    console.log(e);
  }

  await Task.findOneAndUpdate({_id}, body, {new: true}).then(result => {
    res.send(result);
  });
}

module.exports.deleteTask = async (req, res) => {
  try {
    await verify(req, res);
  } catch(e) {
    console.log(e);
  }

  const { _id } = req.query;
  
  if (!_id) {
    return res.status(422).send('Data is incorrect, error!');
  } else {
    Task.deleteOne({_id}).then(() => {
      res.send('Succesfully deleted');
    });
  }
}