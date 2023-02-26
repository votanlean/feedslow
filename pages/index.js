import React from "react";
import { useState } from "react";
const HomePage = () => {
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiOutput, setApiOutput] = useState(null);
  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    console.log("calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });
    const data = await response.json();
    const { output } = data;
    setApiOutput(output);
    console.log("output", output);
    setUserInput("");
    setIsGenerating(false);
  };

  // const apiOutput = [
  //   {
  //     question: "Who gave Rachel her teddy bear",
  //     choices: ["Rachel", "Tom", "Rachel's Father"],
  //     answer: "2",
  //   },
  //   {
  //     question: "What color is the teddy bear",
  //     choices: ["Green", "Grey", "Brown"],
  //     answer: "2",
  //   },
  //   {
  //     question: "What does Rachel do with the teddy bear",
  //     choices: ["Sleeps", "Eats", "Plays"],
  //     answer: "2",
  //   },
  // ];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleChange = (questionIndex, choiceIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: choiceIndex,
    });
    console.log("selectedAnswers", selectedAnswers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    let correct = 0;
    for (let i = 0; i < apiOutput.length; i++) {
      if (selectedAnswers[i] === parseInt(apiOutput[i].answer)) {
        correct++;
      }
    }

    setCorrectAnswers(correct);
  };

  return (
    <>
      <div>
        <div className="md:grid md:gap-6">
          <div className="mt-5 md:col-span-2 md:mt-0">
            {!apiOutput && (
              <form action="#" method="POST">
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div>
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Input the news and it will generate the questions to
                        answer
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="about"
                          name="about"
                          rows={10}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Input content..."
                          defaultValue={""}
                          // value={userInput}
                          onChange={onUserChangedText}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={callGenerateEndpoint}
                      className="inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-indigo-400"
                    >
                      {isGenerating && (
                        <svg
                          class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      {isGenerating ? "Generating..." : "Generate"}
                    </button>
                  </div>
                </div>
              </form>
            )}
            {apiOutput && (
              <form action="#" method="POST">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    {apiOutput.map((question, questionIndex) => (
                      <fieldset key={questionIndex}>
                        <legend className="contents text-sm font-semibold text-gray-900">
                          {questionIndex + 1}. {question.question}
                        </legend>

                        <div className="mt-4 space-y-4">
                          {question.choices.map((choice, choiceIndex) => (
                            <div
                              key={choiceIndex}
                              className="flex items-center"
                            >
                              <input
                                name={`question-${questionIndex}`}
                                value={choiceIndex}
                                checked={
                                  selectedAnswers[questionIndex] === choiceIndex
                                }
                                onChange={() =>
                                  handleChange(questionIndex, choiceIndex)
                                }
                                disabled={isSubmitted}
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`choice-${questionIndex}-${choiceIndex}`}
                                className={`ml-3 block text-sm font-medium text-gray-700 ${
                                  isSubmitted &&
                                  // selectedAnswers[questionIndex] === choiceIndex &&
                                  parseInt(question.answer) === choiceIndex
                                    ? "text-green-700"
                                    : ""
                                }`}
                              >
                                {choice}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Answer
                    </button>
                  </div>
                  <div>
                    {isSubmitted && (
                      <div className="flex flex-col justify-center text-center">
                        <h3 className="text-green-700">Result:</h3>
                        <p>
                          You got {correctAnswers} out of {apiOutput.length}{" "}
                          questions correct.
                        </p>
                        <p>
                          {correctAnswers / apiOutput.length >= 0.5
                            ? "You pass the test!"
                            : "You failed the test."}
                        </p>
                        <div>
                          <button
                            className="mb-5 rounded-full bg-purple-700 p-2 text-white"
                            onClick={() => {
                              setIsSubmitted(false);
                              setCorrectAnswers(0);
                              setSelectedAnswers([]);
                              setApiOutput(null);
                            }}
                          >
                            Finish
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
