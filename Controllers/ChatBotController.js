const { SingletonChatBot } = require('../LangchainLLm/index.js');
const router = require('express').Router();

const chatBot = new SingletonChatBot().getInstance();

router.post('/askQuestion', async (req, res) => {
    const question = req.body.question;
    const chatHistory = req.body.chatHistory;
    const prompt = question;
    const response = await chatBot.askQuestion(prompt, chatHistory);
    res.json(response);
});

module.exports = router;
