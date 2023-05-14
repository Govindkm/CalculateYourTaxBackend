const { SingletonChatBot } = require('../LangchainLLm/index.js');
const router = require('express').Router();

const chatBot = new SingletonChatBot().getInstance();

router.post('/askQuestion', async (req, res) => {
    const question = req.body.question;
    const prompt = " Based on given context answer the question, if you don't find anything relevant, appologize and ask for another question. Provide resolutions but don't copy paste confedential data and do not mix two different triage cases. Question: "+question;
    const response = await chatBot.askQuestion(prompt);
    res.json(response);
});

module.exports = router;
