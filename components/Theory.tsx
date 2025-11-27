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
      return <strong key={i} className="font-bold text-white bg-white/10 px-1 rounded">{part.slice(2, -2)}</strong>;
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
          <span className={`mr-3 mt-2 w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-r ${config.gradient} shadow-sm group-hover:scale-125 transition-transform`}></span>
          <span className="leading-relaxed">{listContent}</span>
        </li>
      );
      return;
    }
    
    // Flush list if we encounter non-list line
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${index}`} className="my-6 ml-2 bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 shadow-inner">
          {currentList}
        </ul>
      );
      currentList = [];
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key} className={`text-xl font-bold mt-8 mb-4 flex items-center gap-3 ${config.color}`}>
          <span className="h-px flex-1 bg-slate-700/50"></span>
          <span>{parseInlineStyles(line.substring(4))}</span>
          <span className="h-px flex-1 bg-slate-700/50"></span>
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <div key={key} className="mt-12 mb-6">
            <h2 className="text-2xl font-bold text-white relative inline-block">
                {parseInlineStyles(line.substring(3))}
                <div className={`absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r ${config.gradient} rounded-full`}></div>
            </h2>
        </div>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <div key={key} className="mb-10 pb-6 border-b border-slate-700/50">
             <h1 className={`text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient} leading-tight`}>
                {parseInlineStyles(line.substring(2))}
             </h1>
        </div>
      );
    } 
    // Blockquotes (Example/Analogies)
    else if (trimmed.startsWith('> ')) {
       elements.push(
         <blockquote key={key} className="my-8 relative p-6 bg-slate-800/60 rounded-r-xl border-l-4 border-l-indigo-500 shadow-md">
            <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 rounded-full p-2 border border-slate-700">
                <span className="text-2xl">💡</span>
            </div>
            <p className="italic text-indigo-100/90 text-lg leading-relaxed">
                {parseInlineStyles(trimmed.substring(2))}
            </p>
         </blockquote>
       );
    }
    // Paragraphs
    else if (trimmed !== '') {
      elements.push(
        <p key={key} className="mb-5 text-slate-300 leading-8 text-lg font-light tracking-wide">
          {parseInlineStyles(line)}
        </p>
      );
    }
  });

  // Flush remaining list at the end
  if (currentList.length > 0) {
      elements.push(<ul key={`list-end`} className="my-6 ml-2 bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 shadow-inner">{currentList}</ul>);
  }

  return <div className="animate-fade-in max-w-none">{elements}</div>;
};

const Theory: React.FC<TheoryProps> = ({ subject }) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(true);

  const config = SUBJECT_CONFIGS[subject];

  useEffect(() => {
    // We only fetch topics if they change or haven't been loaded for this subject view instance
    setLoadingTopics(true);
    // Reset selection only if the subject actually changed significantly (handled by parent usually)
    setContent('');
    setSelectedTopic(null);

    suggestTopics(subject).then(fetchedTopics => {
        setTopics(fetchedTopics);
        setLoadingTopics(false);
    });
  }, [subject]);

  const handleTopicClick = async (topic: string) => {
    if (selectedTopic === topic && content) return; // Don't reload if already showing
    
    setSelectedTopic(topic);
    setLoading(true);
    setContent(''); // Clear previous content while loading new one
    
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
    <div className="flex flex-col md:flex-row h-full gap-6">
      {/* Topics Sidebar */}
      <div className="w-full md:w-80 bg-slate-900/80 rounded-2xl border border-slate-700/50 p-5 flex flex-col overflow-hidden shadow-xl backdrop-blur-md">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 px-2 border-b border-slate-800 pb-4">
            Índice de Temas
        </h3>
        {loadingTopics ? (
             <div className="flex justify-center py-10 opacity-50"><LoadingSpinner /></div>
        ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {topics.map((topic, idx) => (
                <button
                key={idx}
                onClick={() => handleTopicClick(topic)}
                className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 text-sm group ${
                    selectedTopic === topic
                    ? `bg-slate-800 border border-slate-600 text-white shadow-lg`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
                >
                  <div className="flex items-start gap-3">
                     <span className={`text-xs font-mono mt-0.5 ${selectedTopic === topic ? config.color : 'text-slate-600 group-hover:text-slate-500'}`}>
                        {(idx + 1).toString().padStart(2, '0')}
                     </span>
                     <span className="font-medium leading-tight">{topic}</span>
                  </div>
                </button>
            ))}
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-slate-900/80 rounded-2xl border border-slate-700/50 overflow-y-auto relative min-h-[500px] shadow-2xl backdrop-blur-md scrollbar-hide">
        {!selectedTopic ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
            <div className={`w-32 h-32 rounded-full bg-slate-800/50 flex items-center justify-center mb-8 text-7xl opacity-30 animate-pulse ring-1 ring-slate-700`}>
                {config.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-3">Comienza tu aprendizaje</h3>
            <p className="max-w-md mx-auto text-slate-400 leading-relaxed">
                Selecciona un tema del menú lateral para ver una lección teórica detallada generada por IA en tiempo real.
            </p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className={`p-6 rounded-full bg-slate-800/50 ring-1 ring-slate-700 shadow-xl`}>
                <LoadingSpinner />
            </div>
            <p className="text-slate-400 animate-pulse font-medium tracking-wide">Preparando lección maestra...</p>
          </div>
        ) : (
          <div className="p-8 md:p-16 max-w-5xl mx-auto">
            <MarkdownRenderer content={content} config={config} />
            
            <div className="mt-20 pt-10 border-t border-slate-800 text-center text-slate-500 text-sm">
                <p>Contenido generado por IA. Revisa fuentes oficiales para confirmación académica.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Theory;