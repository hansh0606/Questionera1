"use client";
import { useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Title } from "@components/title";
import { ErrorMessage } from '../components/error';

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);

  const onSubmit = async () => {
    try {
      setError("");
      setLoading(true);

      // Call your Flask backend API to generate interview questions
      const response = await fetch("/", {
        method: "POST",
        body: text
      });

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      setQuestions(data.questions);

    } catch (e) {
      console.error(e);
      setError("this error i scaused ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-8 mx-auto mt-16 lg:mt-32">
      {error ? <div className="text-red-500">{error}</div> : null}

      {questions.length > 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-full mt-8 md:mt-16 xl:mt-32">
           <Title >Here are Your Questions</Title>
           <textarea
              id="text"
              name="text"
              value={questions.join("\n")}
              readOnly // Make the textarea read-only
              rows={Math.max(5, questions.length)}
              className="w-full p-4 border border-zinc-600 rounded-lg text-base bg-transparent resize-none hover:resize text-zinc-100 placeholder-zinc-500 focus:ring-0 sm:text-sm"
              style={{ width: 'calc(100% - 2rem)' }} // Adjust width as needed
            />
        </div>
      ) : (
        <form
          className="max-w-3xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            if (text.length <= 0) return;
            onSubmit();
          }}
        >
          <Title>Share Your Resume</Title>

          <div className="flex flex-col items-center justify-center w-full gap-4 mt-4 sm:flex-row">
            <div className="w-full p-0 text-base bg-transparent">
              <label
                className="flex  items-center justify-center h-16 px-3 py-2 text-sm whitespace-no-wrap duration-150 border rounded hover:border-zinc-100/80 border-zinc-600 focus:border-zinc-100/80 focus:ring-0 text-zinc-100 hover:text-white hover:cursor-pointer w-full "
                htmlFor="file_input"
              >
                Upload a file
              </label>
              <input
                className="hidden"
                id="file_input"
                type="file"
                accept=".pdf,.docx,.txt" // Only accept PDF files
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) {
                    // No files selected, handle this case if necessary
                    return;
                  }

                  const file = files[0];
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const content = e.target?.result?.toString() || " ";
                    setText(content);
                  };
                  reader.readAsText(file);
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || text.length <= 0}
            className={`mt-6 w-full h-12 inline-flex justify-center items-center  transition-all  rounded px-4 py-1.5 md:py-2 text-base font-semibold leading-7    bg-zinc-200 ring-1 ring-transparent duration-150   ${
              text.length <= 0
                ? "text-zinc-400 cursor-not-allowed"
                : "text-zinc-900 hover:text-zinc-100 hover:ring-zinc-600/80  hover:bg-zinc-900/20"
            } ${loading ? "animate-pulse" : ""}`}
          >
            <span>{loading ? <Cog6ToothIcon className="w-5 h-5 animate-spin" /> : "Share"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
