const { SingletonChatBot } = require('../LangchainLLm/index.js');
const router = require('express').Router();

const chatBot = new SingletonChatBot().getInstance();

router.post('/askQuestion', async (req, res) => {
    const question = req.body.question;
    const response = await chatBot.askQuestion(question);
    res.json(response);
});

module.exports = router;
