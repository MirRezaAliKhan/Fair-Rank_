'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import ProgressBar from '@/app/components/ProgressBar';
import axios from 'axios';

const ASSESSMENTS = [
  {
    id: 'react',
    name: 'React.js',
    description: 'Test your React knowledge with 10 questions',
    icon: '⚛️',
    questions: [
      {
        question: 'What is the purpose of React hooks?',
        options: ['To manage state in functional components', 'To replace classes entirely', 'To improve performance only', 'None of the above'],
        correctAnswer: 0,
      },
      {
        question: 'Which hook is used for side effects?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 1,
      },
      {
        question: 'What does the virtual DOM do?',
        options: ['Stores data', 'Optimizes rendering performance', 'Replaces the real DOM', 'None of the above'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Assess your JavaScript fundamentals',
    icon: '📜',
    questions: [
      {
        question: 'What is the difference between let and var?',
        options: ['No difference', 'let is block-scoped, var is function-scoped', 'var is better', 'let is deprecated'],
        correctAnswer: 1,
      },
      {
        question: 'What is a closure?',
        options: ['A function that closes something', 'A function that has access to outer function variables', 'A loop control', 'None of the above'],
        correctAnswer: 1,
      },
      {
        question: 'What is async/await?',
        options: ['Synchronous functions', 'Ways to handle promises', 'File operations', 'None of the above'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Test your Python programming skills',
    icon: '🐍',
    questions: [
      {
        question: 'What is a list in Python?',
        options: ['A string', 'An ordered, mutable collection', 'Immutable', 'None of the above'],
        correctAnswer: 1,
      },
      {
        question: 'What is a dictionary in Python?',
        options: ['A book of words', 'An unordered collection of key-value pairs', 'A list', 'None of the above'],
        correctAnswer: 1,
      },
      {
        question: 'What does the *args parameter do?',
        options: ['Declares arguments', 'Allows multiple positional arguments', 'Fixed arguments only', 'None of the above'],
        correctAnswer: 1,
      },
    ],
  },
];

export default function AssessmentsPage() {
  const [currentAssessment, setCurrentAssessment] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const startAssessment = (assessment: any) => {
    setCurrentAssessment(assessment);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < currentAssessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = async () => {
    const correctAnswers = answers.filter(
      (answer, idx) => answer === currentAssessment.questions[idx].correctAnswer
    ).length;

    const score = Math.round((correctAnswers / currentAssessment.questions.length) * 100);

    // Save assessment to backend
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData!);

      await axios.post(
        '/api/students/assessments',
        {
          studentId: user.id,
          skillName: currentAssessment.name,
          score,
          questions: currentAssessment.questions.map((q: any, idx: number) => ({
            ...q,
            userAnswer: answers[idx],
            correct: answers[idx] === q.correctAnswer,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompleted([...completed, currentAssessment.id]);
    } catch (error) {
      console.error('Error saving assessment:', error);
    }

    setShowResults(true);
  };

  const correctAnswers = answers.filter(
    (answer, idx) => answer === currentAssessment?.questions[idx]?.correctAnswer
  ).length;

  const score = currentAssessment
    ? Math.round((correctAnswers / currentAssessment.questions.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn userRole="student" />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar isLoggedIn userRole="student" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard/student" className="text-cyan-600 hover:text-cyan-700 font-medium mb-6 inline-flex">
          ← Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Skill Assessments</h1>
          <p className="text-gray-600">
            Verify your skills by taking assessments. Your scores will boost your USS.
          </p>
        </div>

        {!currentAssessment ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ASSESSMENTS.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{assessment.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {assessment.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6">{assessment.description}</p>

                {completed.includes(assessment.id) ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-700 font-semibold text-sm">✓ Completed</p>
                  </div>
                ) : (
                  <button
                    onClick={() => startAssessment(assessment)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Start Assessment
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : showResults ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Assessment Complete! 🎉
            </h2>

            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text mb-2">
                {score}%
              </div>
              <p className="text-gray-600">
                You got {correctAnswers} out of {currentAssessment.questions.length} questions correct
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900">Review Your Answers:</h3>
              {currentAssessment.questions.map((question: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${
                    answers[idx] === question.correctAnswer
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <p className="font-medium text-gray-900 mb-2">
                    {idx + 1}. {question.question}
                  </p>
                  <p className="text-sm text-gray-700">
                    Your answer:{' '}
                    <span className="font-semibold">
                      {question.options[answers[idx]]}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentAssessment(null)}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition"
              >
                Back to Assessments
              </button>
              <Link
                href="/dashboard/student"
                className="flex-1 text-center px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentAssessment.name} Assessment
              </h2>
              <ProgressBar
                label={`Question ${currentQuestion + 1} of ${currentAssessment.questions.length}`}
                value={currentQuestion + 1}
                maxValue={currentAssessment.questions.length}
                showPercent={false}
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {currentAssessment.questions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {currentAssessment.questions[currentQuestion].options.map(
                  (option: string, idx: number) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        answers[currentQuestion] === idx
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        checked={answers[currentQuestion] === idx}
                        onChange={() => handleAnswer(idx)}
                        className="w-5 h-5 text-cyan-600"
                      />
                      <span className="ml-3 text-gray-900">{option}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <button
              onClick={goToNextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {currentQuestion === currentAssessment.questions.length - 1
                ? 'Submit Assessment'
                : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
