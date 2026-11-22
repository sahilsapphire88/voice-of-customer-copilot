import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ScrollArea } from '../components/ui/ScrollArea';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { generateAIResponse, generateSuggestedQuestions } from '../lib/aiAssistant';
import { ALL_DEMO_FEEDBACK } from '../data/demoFeedback';
import { formatRelativeTime } from '../lib/utils';
import {
  Bot,
  Send,
  Sparkles,
  MessageSquare,
  Search,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export function AssistantPage() {
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string; sources?: typeof ALL_DEMO_FEEDBACK; timestamp: string }>>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to the Voice of Customer Copilot! 🎯 I'm your AI assistant for analyzing customer feedback.

I can help you with:
• **Theme analysis** — "What are the top pain points?" or "Show me feedback about performance"
• **Customer quotes** — "Give me quotes about pricing concerns"
• **Metrics** — "What's the sentiment distribution?" or "Show me NPS feedback"
• **Prioritization** — "What should we prioritize for Q1?"
• **Segment analysis** — "What do Enterprise customers complain about?"

Try one of the suggested questions below or ask me anything!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = generateSuggestedQuestions();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setShowSuggestions(false);

    const userMsg = {
      id: `msg_${Date.now()}`,
      role: 'user' as const,
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const { response, sources } = generateAIResponse(userMessage, messages);
      const assistantMsg = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant' as const,
        content: response,
        sources,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 800);
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
  };

  return (
    <div className="h-[calc(100vh-200px)] min-h-[500px] flex flex-col animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900 tracking-tight flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary-600" aria-hidden="true" />
          AI Product Assistant
        </h1>
        <p className="text-secondary-500 text-sm mt-1">Ask questions about your customer feedback data</p>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Chat</CardTitle>
              <CardDescription className="text-xs">
                {ALL_DEMO_FEEDBACK.length} feedback items • {new Set(ALL_DEMO_FEEDBACK.map(f => f.customerId)).size} customers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success-500" aria-hidden="true" />
                Demo Mode
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0">
            <div className="p-4 space-y-4">
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar fallback="AI" size="sm" className="bg-primary-100 text-primary-600" />
                  <div className="flex-1">
                    <div className="bg-secondary-100 rounded-xl rounded-tl-sm p-4 animate-pulse">
                      <div className="flex gap-1">
                        <div className="h-4 w-12 bg-secondary-200 rounded" />
                        <div className="h-4 w-20 bg-secondary-200 rounded" />
                        <div className="h-4 w-16 bg-secondary-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {showSuggestions && messages.length === 1 && (
            <div className="border-t border-secondary-200 p-4">
              <p className="text-xs font-medium text-secondary-500 mb-3">Suggested questions</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 6).map(q => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="text-left w-auto"
                    onClick={() => handleSuggestionClick(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t border-secondary-200 p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Ask about feedback, themes, priorities..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="pr-12"
                  onKeyDown={e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
  }
}}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="sm"
                className="h-10"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-secondary-500 mt-2 text-center">
              Powered by synthetic demo data • Responses are generated from the feedback dataset
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function MessageBubble({ message }: { message: { id: string; role: 'user' | 'assistant'; content: string; sources?: typeof ALL_DEMO_FEEDBACK; timestamp: string } }) {
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('flex gap-3', message.role === 'user' && 'justify-end')}>
      {message.role === 'assistant' && (
        <Avatar fallback="AI" size="sm" className="bg-primary-100 text-primary-600 flex-shrink-0" />
      )}
      <div className={cn('flex-1 max-w-[80%]', message.role === 'user' && 'text-right')}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5',
          message.role === 'user'
            ? 'bg-primary-600 text-white rounded-br-sm'
            : 'bg-secondary-100 text-secondary-900 rounded-bl-sm'
        )}>
          <div className={cn('prose prose-sm max-w-none', message.role === 'user' ? 'text-white' : 'text-secondary-900')}>
            {message.content.split('\n').map((line, i) => (
              <p key={i} className="whitespace-pre-wrap">{line}</p>
            ))}
          </div>
          
          {message.sources && message.sources.length > 0 && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => setShowSources(!showSources)}
              >
                <Search className="h-3 w-3 mr-1" aria-hidden="true" />
                {showSources ? 'Hide' : 'Show'} {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
              </Button>
              {showSources && (
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {message.sources.slice(0, 5).map(source => (
                    <div key={source.id} className="p-2 bg-white rounded border text-xs">
                      <p className="font-medium text-secondary-900">{source.customerName}</p>
                      <p className="text-secondary-600 line-clamp-1">{source.text}</p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" size="sm" className={cn(
                          source.sentimentScore < -0.3 && 'bg-danger-50 text-danger-700',
                          source.sentimentScore > 0.3 && 'bg-success-50 text-success-700',
                          'bg-secondary-50 text-secondary-700'
                        )}>
                          {source.sentiment}
                        </Badge>
                        {source.themes.slice(0, 2).map(t => (
                          <Badge key={t} variant="outline" size="sm" className="bg-secondary-50 text-secondary-700">
                            {t.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 gap-2">
            <span className="text-xs text-secondary-400">{formatRelativeTime(message.timestamp)}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCopy} aria-label={copied ? 'Copied' : 'Copy'}>
                {copied ? <CheckCircle className="h-3 w-3 text-success-500" /> : <Copy className="h-3 w-3" />}
              </Button>
              {message.role === 'assistant' && (
                <>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" aria-label="Helpful">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" aria-label="Not helpful">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {message.role === 'user' && (
        <Avatar fallback="PM" size="sm" className="bg-secondary-100 text-secondary-600 flex-shrink-0" />
      )}
    </div>
  );
}