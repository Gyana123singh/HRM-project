import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAIStore } from '../../../store/aiStore';
import {
  Bot, Send, Sparkles, User, AlertCircle, Copy, Check,
  Activity, Users, FileText, CheckCircle2, RefreshCw, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

export const HRAIAssistant = () => {
  const { messages, isThinking, insights, loadingInsights, fetchInsights, sendMessage } = useAIStore();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim() || isThinking) return;
    sendMessage(input);
    setInput('');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    "How many employees are absent today?",
    "Show employees whose probation ends this month.",
    "Generate Job Description for Senior React Developer",
    "Analyze Q3 recruitment bottlenecks in ATS pipeline",
    "Summarize open HR support tickets"
  ];

  // Helper to render basic markdown text cleanly
  const renderFormattedMessage = (content) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="font-extrabold text-sm sm:text-base text-slate-800 mt-2 mb-1">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="font-bold text-xs sm:text-sm text-slate-700 mt-1.5 mb-1">{line.replace('#### ', '')}</h4>;
      }
      if (line.startsWith('- ')) {
        const parts = line.replace('- ', '').split('**');
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 my-0.5">
            {parts.map((p, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-900">{p}</strong> : p))}
          </li>
        );
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={idx} className="my-1">
            {parts.map((p, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-900">{p}</strong> : p))}
          </p>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return <p key={idx} className="my-0.5 text-slate-700">{line}</p>;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header */}
      <PageHeader
        title="Real-Time AI HR Insights Assistant"
        subtitle="Conversational Generative AI connected live to workforce database, attendance logs, and recruitment pipeline."
        breadcrumbs={['AI Suite', 'HR AI Assistant']}
        actions={
          <Button onClick={() => fetchInsights()} variant="outline" size="sm" icon={RefreshCw}>
            Refresh Live Analytics
          </Button>
        }
      />

      {/* Real-time Executive Insights KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Health"
          value={insights?.attendanceHealth || '94.2%'}
          description="Punctuality Rate Today"
          icon={Activity}
          variant="cyan"
        />
        <StatCard
          title="Recruitment Pipeline"
          value={insights?.recruitmentVelocity || '6 Candidates'}
          description="Active ATS Requisitions"
          icon={Users}
          variant="mint"
        />
        <StatCard
          title="Probation Reviews"
          value={`${insights?.probationCount || 2} Pending`}
          description="Upcoming Confirmations"
          icon={FileText}
          variant="peach"
        />
        <StatCard
          title="Policy Compliance"
          value={insights?.complianceScore || '98.5%'}
          description="Zero Critical Audits"
          icon={CheckCircle2}
          variant="cyan"
        />
      </div>

      {/* Advisory Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 font-medium">
        <div className="flex items-center gap-2.5">
          <Zap className="w-4.5 h-4.5 text-amber-600 shrink-0" />
          <span>
            <strong>Generative AI Enabled:</strong> SmartHRM AI uses live RAG (Retrieval-Augmented Generation) context directly from MongoDB models.
          </span>
        </div>
        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg border border-amber-300">
          Live MongoDB Sync
        </span>
      </div>

      {/* Main Chat Interface */}
      <Card className="flex flex-col h-[600px] p-0 overflow-hidden border border-slate-200 bg-white shadow-xs">
        {/* Chat Messages Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-xl bg-[#534675] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#534675]/20">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className="relative group max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-normal shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#534675] text-white rounded-br-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.sender === 'ai' ? renderFormattedMessage(msg.text) : msg.text}
                </div>

                {msg.sender === 'ai' && (
                  <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 text-[#534675]">
                      <Sparkles className="w-3 h-3 text-[#e95f87]" />
                      {msg.provider || 'Generative AI Engine'}
                    </span>
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-slate-700 flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 w-fit text-xs text-[#534675] font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-[#e95f87] animate-spin" />
              <span>Querying live MongoDB records & generating AI insights...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-100/80 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase shrink-0 px-1">Suggested:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              disabled={isThinking}
              onClick={() => sendMessage(p)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0edf7] border border-slate-200 text-xs text-slate-700 hover:text-[#534675] font-semibold whitespace-nowrap transition-all shadow-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isThinking}
            placeholder="Ask AI HR Assistant about attendance, probation, job descriptions, or ATS metrics..."
            className="flex-1 bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
          />
          <Button type="submit" disabled={isThinking || !input.trim()} variant="primary" icon={Send}>
            {isThinking ? 'Thinking...' : 'Send Query'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
