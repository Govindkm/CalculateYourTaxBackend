const path = require("path");
const { OpenAI } = require("langchain/llms");
const dotenv = require("dotenv");
const { OpenAIEmbeddings } = require("langchain/embeddings");
const { HNSWLib } = require("langchain/vectorstores");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { TextLoader } = require("langchain/document_loaders");
const {
  loadQAStuffChain,
  loadQARefineChain,
  ConversationalRetrievalQAChain,
} = require("langchain/chains");
const { BufferMemory } = require("langchain/memory");
const fs = require("fs/promises");
const logger = require("../Middlewares/logging");

class GPTChatBot {
  #model;
  #chainA;
  #object;
  #vectorStore;

  CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`
Our customer use this tool to query details. Provided the context and standalone question give correct answer to the user query based on context provided.
Use the following pieces of context to answer the users question.
If you are not able to find answer then ask for more details, don't try to make up an answer.
----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;

  constructor() {
    if (process.env.NODE_ENV !== "production") {
      dotenv.config({ path: "../../.env" });
    } else {
      dotenv.config({ path: "./environments/production.env" });
    }
    this.#model = new OpenAI({
      openAIApiKey: process.env.OPEN_API_KEY,
      temperature: 0.7,
      verbose: true,
    });
    this.#chainA = loadQAStuffChain(this.#model);
    this.directory = path.join(__dirname, "data");
    this.#vectorStore = HNSWLib.load(
      this.directory,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_API_KEY })
    ).then((vector) => {
      this.#vectorStore = vector;
      this.chainA = ConversationalRetrievalQAChain.fromLLM(
        this.#model,
        this.#vectorStore.asRetriever(),
        {
          verbose: true,
          memory: new BufferMemory({
            memoryKey: "chat_history",
            returnMessages: true,
          }),
          questionGeneratorTemplate: this.CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT
        }
      );
    });
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
    const vectorStore = await HNSWLib.fromDocuments(
      splittedDocs,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_API_KEY })
    );
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

  async askQuestion(question, chat_history = null) {
    try {
      if (await this.pathExists(this.directory)) {
        var vectorStore = await this.loadVectorEmbeddings();
      } else {
        var vectorStore = await this.createVectorEmbeddings();
      }
      const resp = await this.chainA.call({
        question,
        chat_history,
      });
      console.log(resp);
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

module.exports = { SingletonChatBot };
