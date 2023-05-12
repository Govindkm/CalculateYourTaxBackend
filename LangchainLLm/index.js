const path = require('path');
const { OpenAI } = require('langchain/llms');
const dotenv = require('dotenv');
const { OpenAIEmbeddings } = require('langchain/embeddings');
const { HNSWLib } = require('langchain/vectorstores');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { TextLoader } = require('langchain/document_loaders');
const { loadQAStuffChain } = require('langchain/chains');
const fs = require('fs/promises');
const logger = require('../Middlewares/logging');


class GPTChatBot {
    #model;
    #chainA;
    #object;
    constructor() {
        if (process.env.NODE_ENV !== 'production') {
            dotenv.config({ path: '../../.env' });
        }
        else {
            dotenv.config({ path: './environments/production.env' });
        }
        this.#model = new OpenAI({ openAIApiKey: process.env.OPEN_API_KEY, temperature: 0.7, model_name: "gpt-3.5-turbo" });
        this.#chainA = loadQAStuffChain(this.#model);
        this.directory = path.join(__dirname, 'data');
        this.chainA = loadQAStuffChain(this.#model);

    }

    async createVectorEmbeddings() {

        console.log("Loading text files...");
        const loader = new TextLoader("./textfiles/Text1.txt");
        const docs = await loader.load();
        console.log("Text files loaded.");

        console.log("SPlitting text files...");
        const textSplietter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunckOverlap: 100,
        });

        const splittedDocs = await textSplietter.splitDocuments(docs);
        console.log("Text files splitted.");
        // console.log({splittedDocs});

        console.log("Creating vector store...");
        const vectorStore = await HNSWLib.fromDocuments(splittedDocs, new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_API_KEY }));
        await vectorStore.save(this.directory);
        console.log("Vector store created.");
        return vectorStore;
    }

    async pathExists(path) {
        try {
            await fs.access(path);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async loadVectorEmbeddings() {
        console.log("Loading vector store...");

        const loadedVectorStore = await HNSWLib.load(
            this.directory,
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_API_KEY })
        );
        console.log("Vector store loaded.");
        return loadedVectorStore;
    }

    async askQuestion(question) {

        try {
            if (await this.pathExists(this.directory)) {
                var vectorStore = await this.loadVectorEmbeddings();
            } else {
                var vectorStore = await this.createVectorEmbeddings();
            }

            const docs = await vectorStore.similaritySearch(question, 5);
            console.log({ docs });
            const resp = await this.chainA.call({
                input_documents: docs,
                question: question,
            });

            return resp;
        } catch (err) {
            logger.error(err);

            return "Error occured while processing your request. Please try again later.";
        }

    }
}


// const chainA = loadQAStuffChain(model);

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });



// async function main() {
//     if (await pathExists(directory)) {
//         var vectorStore = await loadVectorEmbeddings();
//     } else {
//         var vectorStore = await createVectorEmbeddings();
//     }


//     let question = "When was new regime announced prior to budget 2023?";




//     const docs = await vectorStore.similaritySearch(question, 5);
//     console.log({ docs });
//     const resp = await chainA.call({
//         input_documents: docs,
//         question: question,
//     });

//     console.log(resp);

//     // console.log("Press any key to exit.");
// }

class SingletonChatBot {
    constructor() {
        if (!SingletonChatBot.instance) {
            SingletonChatBot.instance = new GPTChatBot();
        }
    }

    getInstance() {
        return SingletonChatBot.instance;
    }
}

module.exports = { SingletonChatBot }



