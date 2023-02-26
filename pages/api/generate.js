import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Write 3 multiple-choice questions and answers for the content below. The questions should be paraphrased to not repeat the key words in the content. The answer should be in the json format. For example: [{"question":"what is it","choices": ["apple","balana"], "answer":"1"},{"question":"what is that","choices": ["shoes","food"], "answer":"0"}].
Content:
`;
const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) ?? 0.8,
    max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) ?? 3072,
  });
  const basePromptOutput = baseCompletion.data.choices.pop().text.replace(/\n/g, '');
  res.status(200).json({output: JSON.parse(basePromptOutput)});
}

export default generateAction;
