import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { local_transport } from "./local_transport";
import { runBraveServer } from "./brave_server";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { OpenAI } from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Put this in your .env file
});
// const serverLocalTransport = new local_transport();
// const clientLocalTransport = new local_transport();

// serverLocalTransport.addTwin(clientLocalTransport);
// clientLocalTransport.addTwin(serverLocalTransport);

const transports = InMemoryTransport.createLinkedPair()
const serverLocalTransport = transports[0];
const clientLocalTransport = transports[1];

const server = runBraveServer(serverLocalTransport);

const client = new Client(
  { name: "example-client", version: "1.0.0" },
  { capabilities: { prompts: {}, tools: {}, resources: {} } }
);


await client.connect(clientLocalTransport);
const tools = await client.listTools();
console.log(tools);

const openAI = new OpenAI();

const openaiTools = tools.tools.map(tool => convertTool(tool, openAI));

const response = await openAI.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "What is the capital of France?" }],
  tools: openaiTools,
});

const responseText = response.choices[0].message.content;
console.log(responseText);
