import React, { useState } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAIStore } from '../../../store/aiStore';
import { Bot, Send, Sparkles, User, AlertCircle } from 'lucide-react';

export const HRAIAssistant = () => {
  const { messages, isThinking, sendMessage } = useAIStore();
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const quickPrompts = [
    "How many employees are absent today?",
    "Show employees whose probation ends this month.",
    "Generate Job Description for Senior React Developer",
    "Analyze Q3 recruitment bottlenecks"
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <PageHeader
        title="AI HR Insights Assistant"
        subtitle="Conversational AI trained on enterprise workforce data, policy compliance, and ATS analytics."
        breadcrumbs={['AI Suite', 'HR AI Assistant']}
      />

      {/* Advisory Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3 font-medium">
        <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
        <span>
          AI recommendations serve as decision assistance. Final HR actions (hirings, promotions, terminations) require human HR Admin approval.
        </span>
      </div>

      <Card className="flex flex-col h-[550px] p-0 overflow-hidden border border-slate-200 bg-white">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-medium ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-blue-600 font-bold p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing workforce metrics & generating recommendations...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase shrink-0">Prompts:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(p)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-xs text-slate-700 hover:text-blue-600 font-medium whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI HR Assistant anything..."
            className="flex-1 bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" variant="primary" icon={Send}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
};
