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
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
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
        <li key={key} className="mb-2 text-slate-300 pl-2 relative flex items-start group">
          <span className={`mr-2 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-r ${config.gradient}`}></span>
          <span>{listContent}</span>
        </li>
      );
      return;
    }
    
    // Flush list if we encounter non-list line
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${index}`} className="my-4 ml-2 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
          {currentList}
        </ul>
      );
      currentList = [];
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key} className={`text-xl font-bold mt-8 mb-4 flex items-center gap-2 ${config.color}`}>
          <span className="text-sm opacity-50">►</span> {parseInlineStyles(line.substring(4))}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key} className="text-2xl font-bold mt-10 mb-4 text-white pb-2 border-b border-slate-700/60">
          {parseInlineStyles(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <div key={key} className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-lg">
             <h1 className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                {parseInlineStyles(line.substring(2))}
             </h1>
        </div>
      );
    } 
    // Paragraphs
    else if (trimmed !== '') {
      elements.push(
        <p key={key} className="mb-4 text-slate-300 leading-7 text-lg">
          {parseInlineStyles(line)}
        </p>
      );
    }
  });

  // Flush remaining list at the end
  if (currentList.length > 0) {
      elements.push(<ul key={`list-end`} className="my-4 ml-2 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">{currentList}</ul>);
  }

  return <div className="animate-fade-in">{elements}</div>;
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
    // Since we use a service cache, this is cheap to call again.
    setLoadingTopics(true);
    // Reset selection only if the subject actually changed significantly (handled by parent usually)
    // But here we want to clear previous content to avoid confusion
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
    <div className="flex flex-col md:flex-row h-full gap-4">
      {/* Topics Sidebar */}
      <div className="w-full md:w-1/4 bg-slate-900/80 rounded-xl border border-slate-700 p-4 flex flex-col overflow-hidden shadow-lg backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 px-2">
            Índice de Temas
        </h3>
        {loadingTopics ? (
             <div className="flex justify-center py-10 opacity-50"><LoadingSpinner /></div>
        ) : (
            <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
            {topics.map((topic, idx) => (
                <button
                key={idx}
                onClick={() => handleTopicClick(topic)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    selectedTopic === topic
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-md transform scale-[1.02]`
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
                >
                  <div className="flex items-center gap-3">
                     <span className={`text-xs opacity-50 ${selectedTopic === topic ? 'text-white' : ''}`}>{idx + 1}.</span>
                     {topic}
                  </div>
                </button>
            ))}
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-slate-900/80 rounded-xl border border-slate-700 overflow-y-auto relative min-h-[500px] shadow-2xl backdrop-blur-sm scrollbar-hide">
        {!selectedTopic ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
            <div className={`w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-6xl opacity-20 animate-pulse`}>
                {config.icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Comienza tu aprendizaje</h3>
            <p className="max-w-md mx-auto">Selecciona un tema del menú lateral para ver una lección detallada generada por IA.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className={`p-4 rounded-full bg-slate-800/50`}>
                <LoadingSpinner />
            </div>
            <p className="text-slate-400 animate-pulse">Generando lección detallada...</p>
          </div>
        ) : (
          <div className="p-8 md:p-12 max-w-4xl mx-auto">
            <MarkdownRenderer content={content} config={config} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Theory;