import React, { useState, useEffect } from 'react';
import { Subject } from '../types';
import { SUBJECT_CONFIGS, LoadingSpinner } from '../constants';
import { getTheoryExplanation, suggestTopics } from '../services/geminiService';

interface TheoryProps {
  subject: Subject;
}

// Utility to parse inline styles (bold)
const parseInlineStyles = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white bg-white/10 px-1 rounded shadow-sm">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Component to render specific Markdown elements prettily
const MarkdownRenderer = ({ content, config }: { content: string, config: any }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const key = `line-${index}`;
    const trimmed = line.trim();
    
    // Handle Lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listContent = parseInlineStyles(trimmed.substring(2));
      currentList.push(
        <li key={key} className="mb-3 text-slate-300 pl-2 relative flex items-start group">
          <span className={`mr-3 mt-2 w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-r ${config.gradient} shadow-lg shadow-current group-hover:scale-125 transition-transform`}></span>
          <span className="leading-relaxed">{listContent}</span>
        </li>
      );
      return;
    }
    
    // Flush list if we encounter non-list line
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${index}`} className="my-6 ml-2 bg-slate-800/40 p-4 md:p-6 rounded-xl border border-slate-700/50 shadow-inner">
          {currentList}
        </ul>
      );
      currentList = [];
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key} className={`text-lg md:text-xl font-bold mt-8 mb-4 flex items-center gap-3 ${config.color}`}>
          <span className="h-px flex-1 bg-slate-700/50"></span>
          <span>{parseInlineStyles(line.substring(4))}</span>
          <span className="h-px flex-1 bg-slate-700/50"></span>
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <div key={key} className="mt-10 mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-white relative inline-block">
                {parseInlineStyles(line.substring(3))}
                <div className={`absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r ${config.gradient} rounded-full`}></div>
            </h2>
        </div>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <div key={key} className="mb-8 pb-4 border-b border-slate-700/50">
             <h1 className={`text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient} leading-tight drop-shadow-sm`}>
                {parseInlineStyles(line.substring(2))}
             </h1>
        </div>
      );
    } 
    // Blockquotes (Example/Analogies)
    else if (trimmed.startsWith('> ')) {
       elements.push(
         <blockquote key={key} className="my-6 relative p-5 bg-slate-800/60 rounded-r-xl border-l-4 border-l-indigo-500 shadow-md">
            <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 rounded-full p-2 border border-slate-700">
                <span className="text-xl md:text-2xl">💡</span>
            </div>
            <p className="italic text-indigo-100/90 text-base md:text-lg leading-relaxed">
                {parseInlineStyles(trimmed.substring(2))}
            </p>
         </blockquote>
       );
    }
    // Paragraphs
    else if (trimmed !== '') {
      elements.push(
        <p key={key} className="mb-4 text-slate-300 leading-7 md:leading-8 text-base md:text-lg font-light tracking-wide">
          {parseInlineStyles(line)}
        </p>
      );
    }
  });

  // Flush remaining list at the end
  if (currentList.length > 0) {
      elements.push(<ul key={`list-end`} className="my-6 ml-2 bg-slate-800/40 p-4 md:p-6 rounded-xl border border-slate-700/50 shadow-inner">{currentList}</ul>);
  }

  return <div className="animate-fade-in max-w-none pb-10">{elements}</div>;
};

const Theory: React.FC<TheoryProps> = ({ subject }) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const config = SUBJECT_CONFIGS[subject];

  useEffect(() => {
    setContent('');
    setSelectedTopic(null);
    setIsMenuOpen(true); // Auto open menu on subject change

    suggestTopics(subject).then(fetchedTopics => {
        setTopics(fetchedTopics);
    });
  }, [subject]);

  const handleTopicClick = async (topic: string) => {
    if (selectedTopic === topic && content) {
        setIsMenuOpen(false);
        return;
    }
    
    setSelectedTopic(topic);
    setIsMenuOpen(false); // Close menu on selection
    setLoading(true);
    setContent('');
    
    try {
      const explanation = await getTheoryExplanation(subject, topic);
      setContent(explanation);
    } catch (err) {
      setContent("# Error\nNo pudimos cargar la lección. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-md overflow-hidden relative">
      
      {/* Top Navigation Bar / Dropdown Trigger */}
      {/* IMPORTANT: 'relative' is required here so the 'absolute' dropdown positions correctly relative to THIS container */}
      <div className="relative z-20 bg-slate-900 border-b border-slate-700/50 flex flex-col flex-shrink-0">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-4 md:px-6 hover:bg-slate-800/50 transition-colors"
          >
              <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800 border border-slate-700 text-lg ${config.color}`}>
                      {config.icon}
                  </div>
                  <div className="flex flex-col items-start text-left overflow-hidden">
                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                          Tema Actual
                      </span>
                      <span className={`font-semibold truncate w-full ${selectedTopic ? 'text-white' : 'text-slate-400 italic'}`}>
                          {selectedTopic || "Selecciona un tema para comenzar"}
                      </span>
                  </div>
              </div>
              
              <div className={`p-2 rounded-full bg-slate-800 border border-slate-700 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
              </div>
          </button>

          {/* Collapsible Topics List */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-slate-900/95 backdrop-blur absolute top-full left-0 w-full shadow-2xl border-b border-slate-700/50 z-50 ${isMenuOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto max-h-[65vh] scrollbar-hide">
                {topics.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-slate-500">
                        <LoadingSpinner />
                        <span className="ml-2">Cargando índice...</span>
                    </div>
                ) : (
                    topics.map((topic, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleTopicClick(topic)}
                            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                                selectedTopic === topic
                                ? `bg-slate-800 border-slate-600 ${config.color} ring-1 ring-white/10`
                                : 'bg-slate-800/30 border-transparent hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                            }`}
                        >
                            <span className="text-xs font-mono opacity-50 w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                            <span className="text-sm font-medium">{topic}</span>
                        </button>
                    ))
                )}
              </div>
              <div className="h-4 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none absolute bottom-0 left-0 w-full"></div>
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto relative bg-slate-900/50">
        <div className="p-4 md:p-8 md:max-w-4xl md:mx-auto">
            {!selectedTopic ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center opacity-60">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    <p className="text-lg">Abre el índice arriba para seleccionar una lección</p>
                </div>
            ) : loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <div className={`p-4 rounded-full bg-slate-800 ring-1 ring-slate-700 shadow-xl`}>
                        <LoadingSpinner />
                    </div>
                    <p className="text-slate-400 animate-pulse font-medium tracking-wide">Preparando lección...</p>
                </div>
            ) : (
                <>
                   <MarkdownRenderer content={content} config={config} />
                   <div className="h-20"></div> {/* Bottom spacer */}
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Theory;