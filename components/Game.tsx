import React, { useState } from 'react';
import { Subject, QuizQuestion } from '../types';
import { SUBJECT_CONFIGS, LoadingSpinner } from '../constants';
import { generateQuiz } from '../services/geminiService';

interface GameProps {
  subject: Subject;
}

const Game: React.FC<GameProps> = ({ subject }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const config = SUBJECT_CONFIGS[subject];

  const startGame = async (difficulty: 'Fácil' | 'Medio' | 'Difícil') => {
    setLoading(true);
    setQuestions([]);
    try {
      const quiz = await generateQuiz(subject, difficulty);
      setQuestions(quiz);
      setScore(0);
      setCurrentQIndex(0);
      setGameState('playing');
      setSelectedOption(null);
      setShowExplanation(false);
    } catch (e) {
      alert("Error al generar el juego. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === questions[currentQIndex].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameState('finished');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900/50 rounded-xl border border-slate-700">
        <LoadingSpinner />
        <p className="mt-4 text-slate-400">Generando desafío con IA...</p>
      </div>
    );
  }

  if (gameState === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900/50 rounded-xl border border-slate-700 p-8 overflow-y-auto scrollbar-hide">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Desafío de {subject}</h2>
            <p className="text-slate-400 mb-8">Pon a prueba tus conocimientos</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {(['Fácil', 'Medio', 'Difícil'] as const).map((level) => (
            <button
              key={level}
              onClick={() => startGame(level)}
              className={`p-6 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 transition-all hover:scale-105 group`}
            >
              <div className={`text-xl font-bold mb-2 group-hover:${config.color}`}>{level}</div>
              <div className="text-sm text-slate-500">5 Preguntas</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900/50 rounded-xl border border-slate-700 text-center overflow-y-auto p-4 scrollbar-hide">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold text-white mb-4">¡Juego Terminado!</h2>
        <p className="text-xl text-slate-300 mb-8">
          Tu puntuación: <span className={`font-bold ${config.color}`}>{score}</span> / {questions.length}
        </p>
        <button
          onClick={() => setGameState('menu')}
          className={`px-8 py-3 rounded-full bg-gradient-to-r ${config.gradient} text-white font-bold shadow-lg hover:shadow-xl transition-all`}
        >
          Jugar de Nuevo
        </button>
      </div>
    );
  }

  const question = questions[currentQIndex];

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700 p-4 md:p-6 max-w-4xl mx-auto w-full overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 text-sm">Pregunta {currentQIndex + 1} de {questions.length}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.color.replace('text-', 'border-')} ${config.color}`}>
                Puntos: {score}
            </span>
        </div>

        <h3 className="text-lg md:text-2xl font-semibold text-white mb-6 leading-relaxed">
            {question.question}
        </h3>

        <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6">
            {question.options.map((option, idx) => {
                let btnClass = "bg-slate-800 border-slate-600 hover:bg-slate-700";
                if (selectedOption !== null) {
                    if (idx === question.correctIndex) btnClass = "bg-green-600/20 border-green-500 text-green-200";
                    else if (idx === selectedOption) btnClass = "bg-red-600/20 border-red-500 text-red-200";
                    else btnClass = "bg-slate-800/50 border-slate-700 opacity-50";
                }

                return (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={selectedOption !== null}
                        className={`p-3 md:p-4 rounded-lg border text-left transition-all ${btnClass}`}
                    >
                        <span className="mr-3 font-mono opacity-50">{String.fromCharCode(65 + idx)}.</span>
                        <span className="text-sm md:text-base">{option}</span>
                    </button>
                )
            })}
        </div>

        {showExplanation && (
            <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg mb-6 text-blue-200 text-sm md:text-base">
                <strong>Explicación:</strong> {question.explanation}
            </div>
        )}

        <div className="mt-auto flex justify-end pb-4">
            <button
                onClick={nextQuestion}
                disabled={selectedOption === null}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    selectedOption !== null 
                    ? `bg-gradient-to-r ${config.gradient} text-white` 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
            >
                {currentQIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
        </div>
    </div>
  );
};

export default Game;