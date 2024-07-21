require("dotenv").config();
const path = require("path");
const express = require("express");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { ChatOpenAI } = require("@langchain/openai");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { ChromaClient } = require("chromadb");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { BufferMemory } = require("langchain/memory");
const session = require("express-session");

const app = express();
const PORT = 8001;
const client = new ChromaClient();
const { Document } = require("langchain/document");

const model = new ChatOpenAI({
  model: "gpt-4o",
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
function parseJSONtoDocs(jsonData) {
  return jsonData.map((item) => ({
    pageContent: item.text,
    metadata: item.metadata,
  }));
}
async function initDB() {
  // Load PDF
  // const loader = new PDFLoader(path.join(__dirname, "public", "3M_10K.pdf"));
  // const docs = await loader.load();
  const docs = parseJSONtoDocs(tempData).map((item) => new Document(item));
  //Uncomment this block if something fails!
  // Create Vector Embeddings
  // const textSplitter = new RecursiveCharacterTextSplitter({
  //   chunkSize: 1000,
  //   chunkOverlap: 200,
  // });

  // const splits = await textSplitter.splitDocuments(docs);

  const vectorstore = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
    collectionName: "documents",
    collectionMetadata: {
      "hnsw:space": "cosine",
    },
  });
  //   // Build Retreiver Logic
  //   const retriever = vectorstore.asRetriever((kOrFields = 10));

  //   // Create Retrieval Chain
  //   const systemTemplate = `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, say that you don't know. Use three sentences maximum and keep the answer concise.

  // {context}

  // Current conversation:
  // {chat_history}
  // Human: {input}
  // AI: `;

  //   const prompt = ChatPromptTemplate.fromTemplate(systemTemplate);

  //   const questionAnswerChain = await createStuffDocumentsChain({
  //     llm: model,
  //     prompt,
  //   });

  //   return { retriever, questionAnswerChain };
  return vectorstore;
}

async function buildRetriever(vectorstore) {
  const retriever = vectorstore.asRetriever((kOrFields = 7));

  // Create Retrieval Chain
  const systemTemplate = `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, say that you don't know. Use three sentences maximum and keep the answer concise.

{context}

Current conversation:
{chat_history}
Human: {input}
AI: `;

  const prompt = ChatPromptTemplate.fromTemplate(systemTemplate);

  const questionAnswerChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });
  return { retriever, questionAnswerChain };
}

let chainComponents;
let vectorstore;
const tempData = require("./public/3M_10K.json");
app.listen(PORT, async (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});

app.get("/", async (req, res) => {
  try {
    // res.json(parseJSONtoDocs(tempData));
    const docs = parseJSONtoDocs(tempData).map((item) => new Document(item));
    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 1000,
    //   chunkOverlap: 200,
    // });

    // const splits = await textSplitter.splitDocuments(docs);
    // res.json(splits);
    res.json(docs);
    // res.status(200).json({ message: "Server Success" });
  } catch (e) {
    res.status(500).json({ message: "Error ", error: e.message });
  }
});

app.get("/initialise", async (req, res) => {
  try {
    vectorstore = await initDB();
    res.status(200).json({ message: "DB Created successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error initializing chain", error: e.message });
  }
});

app.get("/build", async (req, res) => {
  try {
    chainComponents = await buildRetriever(vectorstore);
    res.status(200).json({ message: "Chain initialized successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error initializing chain", error: e.message });
  }
});
const responses = require("./public/sampleQuestions.json");
app.get("/responses", async (req, res) => {
  try {
    res.status(200).json(responses);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error executing query", error: e.message });
  }
});
app.get("/check-session", (req, res) => {
  if (req.session.viewCount) {
    req.session.viewCount++;
  } else {
    req.session.viewCount = 1;
  }
  res.json({ sessionId: req.sessionID, viewCount: req.session.viewCount });
});

app.get("/query", async (req, res) => {
  const query = req.query.question;
  // console.log(query);
  try {
    if (!req.session.memory) {
      req.session.memory = new BufferMemory({
        memoryKey: "chat_history",
        inputKey: "input",
        outputKey: "output",
        returnMessages: true,
      });
    }
    const ragChain = await createRetrievalChain({
      retriever: chainComponents.retriever,
      combineDocsChain: chainComponents.questionAnswerChain,
      memory: req.session.memory,
    });
    const results = await ragChain.invoke({
      input: query,
    });
    // results.context.forEach((doc) => {
    //   console.log(doc.metadata);
    // });
    res.status(200).json(results);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error executing query", error: e.message });
  }
});
