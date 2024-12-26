import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";
import { z } from "zod";
import { Document } from "langchain/document";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe("the mood of the preson who wrote the journal entry."),
    summary: z.string().describe("quick summary of the entire entry."),
    subject: z.string().describe("the subject of the journal entry"),
    negative: z
      .boolean()
      .describe(
        "is the journal entry negative ? (i.e does it contain negative emotions?).",
      ),
    color: z
      .string()
      .describe(
        "a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.",
      ),
  }),
);

const getPrompt = async (content) => {
  const format_intructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template:
      "Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n {format_intructions} \n {entry}",
    inputVariables: ["entry"],
    partialVariables: { format_intructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyze = async (content) => {
  const model = new ChatOpenAI({
    temperature: 0,
    model: "gpt-3.5-turbo",
  });
  const input = await getPrompt(content);
  const result = await model.invoke(input);

  try {
    return parser.parse(result.content);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" }),
      parser,
    );
    const fix = await fixParser.parse(result.content);
    return fix;
  }
};

export const qa = async (question, entries) => {
  const docs = entries.map(
    (entry) =>
      new Document({
        pageContent: entry.content,
        metadata: {
          id: entry.id,
          createdAt: entry.createdAt,
        },
      }),
  );

  const model = new ChatOpenAI({
    temperature: 0,
    model: "gpt-3.5-turbo",
  });

  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relaventDocs = await store.similaritySearch(question);

  const res = await chain.call({
    input_documents: relaventDocs,
    question,
  });

  return res.output_text;
};
