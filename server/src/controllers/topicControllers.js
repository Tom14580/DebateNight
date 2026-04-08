const debateTopics = require('../data/topics');

function getTopics (req, res) {
    try {
        res.status(200).send(debateTopics);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {getTopics};