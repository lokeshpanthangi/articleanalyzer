import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Clock, Target } from 'lucide-react';
import { ClassificationResult } from '@/pages/Index';

interface ModelResultsProps {
  result: ClassificationResult;
  isLoading: boolean;
}

const modelConfigs = {
  word2vec: {
    name: 'Word2Vec/GloVe',
    color: 'word2vec',
    description: 'Traditional word embeddings'
  },
  bert: {
    name: 'BERT',
    color: 'bert',
    description: 'Bidirectional transformer'
  },
  sentence_bert: {
    name: 'Sentence-BERT',
    color: 'sentence-bert',
    description: 'Sentence-level embeddings'
  },
  openai: {
    name: 'OpenAI Embeddings',
    color: 'openai',
    description: 'Large language model embeddings'
  }
};

const categoryIcons = {
  Tech: '💻',
  Finance: '💰',
  Healthcare: '🏥',
  Sports: '⚽',
  Politics: '🏛️',
  Entertainment: '🎬'
};

export const ModelResults = ({ result, isLoading }: ModelResultsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(modelConfigs).map((modelKey) => (
          <Card key={modelKey} className="bg-card/50 backdrop-blur-sm border-border/50 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Find the model with highest confidence
  const winnerModel = Object.entries(result.models).reduce((a, b) => 
    a[1].confidence > b[1].confidence ? a : b
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Classification Results</h2>
        <p className="text-muted-foreground">AI models have analyzed your article</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(result.models).map(([modelKey, modelResult]) => {
          const config = modelConfigs[modelKey as keyof typeof modelConfigs];
          const isWinner = modelKey === winnerModel[0];
          
          return (
            <Card 
              key={modelKey} 
              className={`relative bg-card/50 backdrop-blur-sm border-border/50 shadow-card hover:shadow-ai transition-all duration-300 ${
                isWinner ? 'ring-2 ring-primary/50' : ''
              }`}
            >
              {isWinner && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-gradient-primary text-primary-foreground flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Winner</span>
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-foreground">
                      {config.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {config.description}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full bg-${config.color}`}></div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Category Result */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {categoryIcons[modelResult.category as keyof typeof categoryIcons]}
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">
                        {modelResult.category}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Category
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {(modelResult.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="text-foreground font-medium">
                      {(modelResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={modelResult.confidence * 100} 
                    className="h-2"
                  />
                </div>

                {/* Processing Time */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Processing time</span>
                  </div>
                  <span className="text-foreground font-medium">
                    {modelResult.time}ms
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};