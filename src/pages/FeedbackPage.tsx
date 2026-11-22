import { useState, useMemo } from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ScrollArea } from '../components/ui/ScrollArea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Separator } from '../components/ui/Separator';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  Star,
  Trash2,
  Edit,
  Copy,
  MoreVertical,
} from 'lucide-react';
import { ALL_DEMO_FEEDBACK } from '../data/demoFeedback';
import { THEME_LABELS, SENTIMENT_LABELS, SOURCE_LABELS, FEEDBACK_SOURCE_OPTIONS } from '../types';
import { getThemeColor, getPriorityColor } from '../lib/utils';

const SENTIMENT_OPTIONS = [
  { value: 'very_negative', label: 'Very Negative' },
  { value: 'negative', label: 'Negative' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'positive', label: 'Positive' },
  { value: 'very_positive', label: 'Very Positive' },
];

const THEME_OPTIONS = Object.entries(THEME_LABELS).map(([value, label]) => ({ value, label }));

export function FeedbackPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    text: '',
    source: 'support_ticket' as const,
    sentiment: 'negative' as const,
    themes: [] as string[],
    customerName: '',
    customerTier: 'pro' as const,
  });

  const filteredFeedback = useMemo(() => {
    return ALL_DEMO_FEEDBACK.filter(item => {
      const matchesSearch = !searchQuery || 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSentiment = selectedSentiments.length === 0 || selectedSentiments.includes(item.sentiment);
      const matchesTheme = selectedThemes.length === 0 || item.themes.some(t => selectedThemes.includes(t));
      const matchesSource = selectedSources.length === 0 || selectedSources.includes(item.source);
      
      return matchesSearch && matchesSentiment && matchesTheme && matchesSource;
    });
  }, [searchQuery, selectedSentiments, selectedThemes, selectedSources]);

  const handleAddFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newItem = {
      id: `fb_${Date.now()}`,
      text: newFeedback.text,
      source: newFeedback.source,
      customerId: `cust_new_${Date.now()}`,
      customerName: newFeedback.customerName || 'Anonymous',
      customerTier: newFeedback.customerTier,
      companySize: 'smb' as const,
      industry: 'Unknown',
      sentiment: newFeedback.sentiment,
      sentimentScore: (() => {
        const map: Record<string, number> = { very_negative: -0.9, negative: -0.6, neutral: 0, positive: 0.6, very_positive: 0.9 };
        return map[newFeedback.sentiment as string] ?? 0;
      })(),
      themes: newFeedback.themes as any[],
      createdAt: new Date().toISOString(),
      upvotes: 0,
      isDemo: true,
      metadata: { demoNote: 'USER ADDED - Demo data' },
    };
    
    ALL_DEMO_FEEDBACK.unshift(newItem);
    setIsAddDialogOpen(false);
    setNewFeedback({ text: '', source: 'support_ticket', sentiment: 'negative', themes: [], customerName: '', customerTier: 'pro' });
  };

  const activeFilterCount = selectedSentiments.length + selectedThemes.length + selectedSources.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Feedback Inbox</h1>
          <p className="text-secondary-500 text-sm mt-1">Manage and analyze customer feedback</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Add Feedback</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Feedback</DialogTitle>
                <DialogDescription>Paste or type customer feedback to analyze</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddFeedback} className="space-y-4">
                <Textarea
                  label="Feedback Text"
                  placeholder="Paste customer feedback here..."
                  value={newFeedback.text}
                  onChange={e => setNewFeedback(prev => ({ ...prev, text: e.target.value }))}
                  required
                  rows={4}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Source"
                    options={FEEDBACK_SOURCE_OPTIONS}
                    value={newFeedback.source}
                    onChange={v => setNewFeedback(prev => ({ ...prev, source: v as any }))}
                  />
                  <Select
                    label="Sentiment"
                    options={SENTIMENT_OPTIONS}
                    value={newFeedback.sentiment}
                    onChange={v => setNewFeedback(prev => ({ ...prev, sentiment: v as any }))}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Customer Tier"
                    options={[
                      { value: 'free', label: 'Free' },
                      { value: 'pro', label: 'Pro' },
                      { value: 'enterprise', label: 'Enterprise' },
                    ]}
                    value={newFeedback.customerTier}
                    onChange={v => setNewFeedback(prev => ({ ...prev, customerTier: v as any }))}
                  />
                  <Input
                    label="Customer Name (optional)"
                    placeholder="John Doe"
                    value={newFeedback.customerName}
                    onChange={e => setNewFeedback(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Themes</label>
                  <div className="flex flex-wrap gap-2">
                    {THEME_OPTIONS.slice(0, 8).map(theme => (
                      <Badge
                        key={theme.value}
                        variant={newFeedback.themes.includes(theme.value) ? 'primary' : 'outline'}
                        className={cn(getThemeColor(theme.value as any), 'cursor-pointer')}
                        onClick={() => setNewFeedback(prev => ({
                          ...prev,
                          themes: prev.themes.includes(theme.value)
                            ? prev.themes.filter(t => t !== theme.value)
                            : [...prev.themes, theme.value]
                        }))}
                      >
                        {THEME_LABELS[theme.value as any]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!newFeedback.text.trim()}>
                    Add Feedback
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b border-secondary-200">
            <Tabs defaultValue="all" className="border-b border-secondary-200">
              <TabsList className="grid w-full grid-cols-4 p-1 bg-secondary-50">
                <TabsTrigger value="all">All ({ALL_DEMO_FEEDBACK.length})</TabsTrigger>
                <TabsTrigger value="negative">Negative ({ALL_DEMO_FEEDBACK.filter(f => f.sentimentScore < -0.3).length})</TabsTrigger>
                <TabsTrigger value="positive">Positive ({ALL_DEMO_FEEDBACK.filter(f => f.sentimentScore > 0.3).length})</TabsTrigger>
                <TabsTrigger value="demo">Demo ({ALL_DEMO_FEEDBACK.filter(f => f.isDemo).length})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-4 border-b border-secondary-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" aria-hidden="true" />
                <Input
                  placeholder="Search feedback, customers, themes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(showFilters && 'bg-primary-50 text-primary-700 border-primary-200')}
                >
                  <Filter className="h-4 w-4 mr-1" aria-hidden="true" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1">{activeFilterCount}</Badge>
                  )}
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 flex flex-wrap gap-4">
                <div>
                  <label className="label">Sentiment</label>
                  <div className="flex flex-wrap gap-2">
                    {SENTIMENT_OPTIONS.map(opt => (
                      <Badge
                        key={opt.value}
                        variant={selectedSentiments.includes(opt.value) ? 'primary' : 'outline'}
                        className={cn(getPriorityColor(opt.value as any), 'cursor-pointer')}
                        onClick={() => setSelectedSentiments(prev =>
                          prev.includes(opt.value)
                            ? prev.filter(v => v !== opt.value)
                            : [...prev, opt.value]
                        )}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Themes</label>
                  <div className="flex flex-wrap gap-2">
                    {THEME_OPTIONS.map(opt => (
                      <Badge
                        key={opt.value}
                        variant={selectedThemes.includes(opt.value) ? 'primary' : 'outline'}
                        className={cn(getThemeColor(opt.value as any), 'cursor-pointer')}
                        onClick={() => setSelectedThemes(prev =>
                          prev.includes(opt.value)
                            ? prev.filter(v => v !== opt.value)
                            : [...prev, opt.value]
                        )}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Sources</label>
                  <div className="flex flex-wrap gap-2">
                    {FEEDBACK_SOURCE_OPTIONS.map(opt => (
                      <Badge
                        key={opt.value}
                        variant={selectedSources.includes(opt.value) ? 'primary' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSelectedSources(prev =>
                          prev.includes(opt.value)
                            ? prev.filter(v => v !== opt.value)
                            : [...prev, opt.value]
                        )}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            <p className="text-sm text-secondary-500 mb-4">
              Showing {filteredFeedback.length} of {ALL_DEMO_FEEDBACK.length} feedback items
            </p>
            <ScrollArea className="max-h-[600px]">
              <div className="space-y-3">
                {filteredFeedback.length === 0 ? (
                  <div className="empty-state py-12">
                    <Search className="empty-state-icon h-12 w-12" aria-hidden="true" />
                    <h3 className="empty-state-title">No feedback found</h3>
                    <p className="empty-state-description">Try adjusting your filters or search query</p>
                  </div>
                ) : (
                  filteredFeedback.map(item => (
                    <FeedbackCard key={item.id} item={item} />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackCard({ item }: { item: typeof ALL_DEMO_FEEDBACK[number] }) {
  return (
    <Card variant="hover" className="relative">
      <div className="flex gap-4">
        <Avatar fallback={item.customerName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-secondary-900">{item.customerName}</span>
                <Badge variant="outline" size="sm" className="capitalize">{item.customerTier}</Badge>
                <Badge variant="outline" size="sm">{SOURCE_LABELS[item.source]}</Badge>
                {item.isDemo && (
                  <Badge variant="outline" size="sm" className="bg-warning-50 text-warning-700">DEMO</Badge>
                )}
              </div>
              <p className="text-secondary-700 mb-2">{item.text}</p>
              <div className="flex flex-wrap gap-1">
                {item.themes.map(theme => (
                  <Badge key={theme} variant="outline" size="sm" className={getThemeColor(theme)}>
                    {THEME_LABELS[theme]}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" size="sm" className={getPriorityColor(item.sentiment)}>
                {SENTIMENT_LABELS[item.sentiment]}
              </Badge>
              <span className="text-xs text-secondary-500 whitespace-nowrap">{formatDate(item.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-secondary-100">
            <div className="flex items-center gap-3 text-sm text-secondary-500">
              <span>Company: {item.companySize}</span>
              <span>Industry: {item.industry}</span>
              <span>Upvotes: {item.upvotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-secondary-100 text-secondary-500 hover:text-secondary-700" aria-label="Copy feedback">
                <Copy className="h-4 w-4" aria-hidden="true" />
              </button>
              <button className="p-1.5 rounded hover:bg-secondary-100 text-secondary-500 hover:text-secondary-700" aria-label="Edit feedback">
                <Edit className="h-4 w-4" aria-hidden="true" />
              </button>
              <button className="p-1.5 rounded hover:bg-danger-50 text-danger-500 hover:text-danger-700" aria-label="Delete feedback">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}