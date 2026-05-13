import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPollService } from "../services/poll.services";
import { createQuestionService } from "../services/question.services";


interface QuestionForm {
  questionText: string;
  isRequired: boolean;
  options: string[];
}


function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}


const defaultQuestion = (): QuestionForm => ({
  questionText: "",
  isRequired: true,
  options: ["", ""],
});

export default function CreatePoll() {
  const navigate = useNavigate();


  const [pollForm, setPollForm] = useState({
    title: "",
    desc: "",
    isAnonymous: true,
    expiresAt: "",
  });


  const [questions, setQuestions] = useState<QuestionForm[]>([defaultQuestion()]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"details" | "questions">("details");


  const handlePollChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPollForm({ ...pollForm, [e.target.name]: e.target.value });
  };


  const addQuestion = () => {
    setQuestions([...questions, defaultQuestion()]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };


  const addOption = (qIndex: number) => {
    if (questions[qIndex].options.length >= 10) return;
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    if (questions[qIndex].options.length <= 2) return;
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };


  const handleNextStep = () => {
    if (!pollForm.title.trim()) {
      setError("Poll title is required");
      return;
    }
    if (!pollForm.expiresAt) {
      setError("Expiry date is required");
      return;
    }
    if (new Date(pollForm.expiresAt) <= new Date()) {
      setError("Expiry date must be in the future");
      return;
    }
    setError(null);
    setStep("questions");
  };


  const handleSubmit = async () => {

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      const filledOptions = q.options.filter((o) => o.trim());
      if (filledOptions.length < 2) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return;
      }
    }

    setError(null);
    setLoading(true);

    try {

      const pollRes = await createPollService({
        title: pollForm.title,
        desc: pollForm.desc || undefined,
        isAnonymous: pollForm.isAnonymous,
        expiresAt: new Date(pollForm.expiresAt),
      });

      const pollId = pollRes.data._id;

   
      for (const q of questions) {
        await createQuestionService(pollId, {
          questionText: q.questionText,
          isRequired: q.isRequired,
          options: q.options.filter((o) => o.trim()),
        });
      }

      // ✅ Dashboard pe redirect
      navigate("/dashboard");

    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div className="bg-[#fbf9f9] text-black min-h-screen flex flex-col">

   
        <nav className="border-b-2 border-black sticky top-0 bg-[#fbf9f9] z-50">
          <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Icon name="ballot" className="text-3xl" />
              <span className="text-2xl font-bold tracking-tight">PollPulse</span>
            </Link>
            <Link
              to="/dashboard"
              className="font-mono text-xs uppercase flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
            >
              <Icon name="arrow_back" className="text-sm" />
              Back to Dashboard
            </Link>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-16 space-y-12">

     
          <header className="border-b-2 border-black pb-8">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">
              New Poll
            </p>
            <h1 className="text-5xl font-extrabold tracking-tighter">
              Create Poll
            </h1>
          </header>

   
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-mono text-xs uppercase ${step === "details" ? "text-black font-bold" : "text-gray-400"}`}>
              <div className={`w-6 h-6 border-2 flex items-center justify-center text-xs font-bold ${step === "details" ? "bg-black text-white border-black" : "border-gray-400 text-gray-400"}`}>
                1
              </div>
              Poll Details
            </div>
            <div className="flex-1 h-px bg-gray-300" />
            <div className={`flex items-center gap-2 font-mono text-xs uppercase ${step === "questions" ? "text-black font-bold" : "text-gray-400"}`}>
              <div className={`w-6 h-6 border-2 flex items-center justify-center text-xs font-bold ${step === "questions" ? "bg-black text-white border-black" : "border-gray-400 text-gray-400"}`}>
                2
              </div>
              Questions
            </div>
          </div>

      
          {error && (
            <div className="p-4 border-2 border-red-500 bg-red-50 text-red-600 font-mono text-sm">
              {error}
            </div>
          )}

      
          {step === "details" && (
            <section className="space-y-8">
              <div className="border-2 border-black bg-white p-8 space-y-6">

                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase tracking-widest font-bold">
                    Poll Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Favourite Frontend Framework?"
                    value={pollForm.title}
                    onChange={handlePollChange}
                    className="w-full p-4 border-2 border-black outline-none placeholder:text-gray-400 text-base"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase tracking-widest font-bold">
                    Description <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    name="desc"
                    placeholder="Brief description about this poll..."
                    value={pollForm.desc}
                    onChange={handlePollChange}
                    rows={3}
                    className="w-full p-4 border-2 border-black outline-none placeholder:text-gray-400 text-base resize-none"
                  />
                </div>

                {/* Expiry */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase tracking-widest font-bold">
                    Expiry Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={pollForm.expiresAt}
                    onChange={handlePollChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full p-4 border-2 border-black outline-none text-base"
                  />
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 border-2 border-black">
                  <div>
                    <p className="font-bold text-sm">Anonymous Responses</p>
                    <p className="text-gray-500 text-xs mt-1 font-mono">
                      {pollForm.isAnonymous
                        ? "Anyone can respond — no login required"
                        : "Only logged-in users can respond"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPollForm({ ...pollForm, isAnonymous: !pollForm.isAnonymous })}
                    className={`w-14 h-7 border-2 border-black relative transition-colors ${pollForm.isAnonymous ? "bg-black" : "bg-white"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 border-2 border-black transition-all ${pollForm.isAnonymous ? "left-7 bg-white" : "left-0.5 bg-black"}`}
                    />
                  </button>
                </div>

              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-black text-white py-4 border-2 border-black hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2"
              >
                Next — Add Questions
                <Icon name="arrow_forward" />
              </button>
            </section>
          )}

      
          {step === "questions" && (
            <section className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border-2 border-black bg-white p-8 space-y-6">

                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
                      Question {qIndex + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 font-mono text-xs uppercase"
                      >
                        <Icon name="delete" className="text-sm" />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-xs uppercase tracking-widest font-bold">
                      Question Text <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Which option do you prefer?"
                      value={q.questionText}
                      onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                      className="w-full p-4 border-2 border-black outline-none placeholder:text-gray-400"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="font-mono text-xs uppercase tracking-widest font-bold">
                      Options <span className="text-gray-400">(Min 2, Max 10)</span>
                    </label>

                    {q.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <span className="font-mono text-xs text-gray-400 w-6">
                          {String.fromCharCode(65 + oIndex)}
                        </span>
                        <input
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className="flex-1 p-3 border-2 border-black outline-none placeholder:text-gray-400"
                        />
                        {q.options.length > 2 && (
                          <button
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Icon name="close" className="text-sm" />
                          </button>
                        )}
                      </div>
                    ))}

                    {q.options.length < 10 && (
                      <button
                        onClick={() => addOption(qIndex)}
                        className="flex items-center gap-2 font-mono text-xs uppercase text-gray-500 hover:text-black transition-colors mt-2"
                      >
                        <Icon name="add" className="text-sm" />
                        Add Option
                      </button>
                    )}
                  </div>

                  {/* Required Toggle */}
                  <div className="flex items-center justify-between p-4 border border-gray-200">
                    <div>
                      <p className="font-bold text-sm">Required Question</p>
                      <p className="text-gray-500 text-xs font-mono mt-1">
                        {q.isRequired ? "Respondent must answer this" : "Respondent can skip this"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateQuestion(qIndex, "isRequired", !q.isRequired)}
                      className={`w-14 h-7 border-2 border-black relative transition-colors ${q.isRequired ? "bg-black" : "bg-white"}`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 border-2 border-black transition-all ${q.isRequired ? "left-7 bg-white" : "left-0.5 bg-black"}`}
                      />
                    </button>
                  </div>

                </div>
              ))}

              {/* Add Question Button */}
              <button
                onClick={addQuestion}
                className="w-full py-4 border-2 border-black border-dashed hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wide flex items-center justify-center gap-2 text-gray-500 hover:text-white"
              >
                <Icon name="add_box" />
                Add Question
              </button>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => { setStep("details"); setError(null); }}
                  className="flex-1 py-4 border-2 border-black hover:bg-black hover:text-white transition-colors font-bold uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <Icon name="arrow_back" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-black text-white py-4 border-2 border-black hover:bg-white hover:text-black transition-colors font-bold uppercase tracking-wide text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Icon name="sync" className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Icon name="check_circle" />
                      Create Poll
                    </>
                  )}
                </button>
              </div>

            </section>
          )}

        </main>
      </div>
    </>
  );
}