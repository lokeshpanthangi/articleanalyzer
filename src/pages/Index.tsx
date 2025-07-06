import { useState } from 'react';
import { ArticleInput } from '@/components/ArticleInput';
import { ModelResults } from '@/components/ModelResults';
import { Header } from '@/components/Header';
import { VisualizationCharts } from '@/components/VisualizationCharts';
import { SampleArticles } from '@/components/SampleArticles';
import heroBackground from '@/assets/hero-bg.jpg';

export interface ClassificationResult {
  article_text: string;
  models: {
    word2vec: { category: string; confidence: number; time: number };
    bert: { category: string; confidence: number; time: number };
    sentence_bert: { category: string; confidence: number; time: number };
    openai: { category: string; confidence: number; time: number };
  };
  timestamp: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'classify' | 'comparison'>('classify');
  const [articleText, setArticleText] = useState('');
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClassify = async (text: string) => {
    setIsLoading(true);
    setArticleText(text);
    
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResult: ClassificationResult = {
      article_text: text,
      models: {
        word2vec: { category: "Tech", confidence: 0.85, time: 120 },
        bert: { category: "Tech", confidence: 0.92, time: 450 },
        sentence_bert: { category: "Tech", confidence: 0.88, time: 200 },
        openai: { category: "Tech", confidence: 0.95, time: 800 }
      },
      timestamp: new Date().toISOString()
    };
    
    setClassificationResult(mockResult);
    setIsLoading(false);
  };

  const handleSampleArticle = (article: string) => {
    setArticleText(article);
    handleClassify(article);
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div 
        className="relative min-h-screen"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        
        <div className="relative z-10">
          <Header currentView={currentView} onViewChange={setCurrentView} />
          
          <main className="container mx-auto px-4 py-8 space-y-8">
            {currentView === 'classify' ? (
              <>
                {/* Hero Section */}
                <div className="text-center space-y-4 mb-12">
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Smart Article Categorizer
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Powered by 4 Advanced AI Embedding Models for Precise News Classification
                  </p>
                </div>

                {/* Sample Articles */}
                <SampleArticles onSelectArticle={handleSampleArticle} />

                {/* Article Input */}
                <ArticleInput 
                  value={articleText}
                  onChange={setArticleText}
                  onClassify={handleClassify}
                  isLoading={isLoading}
                />

                {/* Results */}
                {classificationResult && (
                  <div className="space-y-8">
                    <ModelResults 
                      result={classificationResult}
                      isLoading={isLoading}
                    />
                    <VisualizationCharts 
                      result={classificationResult}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Model Comparison Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Coming soon - Advanced model performance analytics and comparison tools
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;