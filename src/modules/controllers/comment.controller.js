const Comment = require('../../db/models/comment-schema/index');
const User = require('../../db/models/user-schema/index');

module.exports.addComment = async (req, res) => {
    try {
        const userId = await req.payload.id;

        const { commentText, taskId } = req.body;

        if (commentText && userId && taskId) {
            let login;
            await User.find({ _id: userId })
            .then(result => {
                login = result[0].login;
            })

            const comment = new Comment({...req.body, author: login});
            await comment.save()
            .then((result) => {
                res.send(result);
            })
            .catch((e) => {
                res.status(500).send(e.message);
            });
        }
    } catch(e) {
        res.status(400).send('Incorrect data');
    }
}

module.exports.getTaskComments = async (req, res) => {
    try {
        const { taskId } = req.query;
        await Comment.find({ taskId }).then((result) => {
          res.send(result);
        });
    } catch(e) {
        return res.status(404).json({message: 'Comments are not found'});
    }
}

module.exports.changeCommentText = async (req, res) => {
    try {
        const { _id } = req.body;
        await Comment.findOneAndUpdate({_id}, req.body, {new: true})
        .then(result => {
            res.send(result);
        })
        .catch(() => {
            res.status(404).send({message: 'Comment is not found'});
        });
    } catch(e) {
        res.status(400).send({message: e.message});
    }
}

module.exports.deleteComment = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            res.status(400).send("Data is incorrect, error!");
        } else {
            await Comment.deleteOne({ _id })
            .then(() => {
                res.send("Succesfully deleted");
            })
            .catch(() => {
                res.status(500).send({ message: "Internal server error" });
            });
        }
    } catch(e) {
        res.status(400).send({ message: e.message });
    }
}