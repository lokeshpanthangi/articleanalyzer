import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Brain, TrendingUp, Award, Play, CheckCircle } from 'lucide-react';
import { trainAndEvaluateModels, ModelComparison, ModelMetrics } from '@/services/mlTrainingService';

interface MLTrainingProps {
  onTrainingComplete?: (results: ModelComparison) => void;
}

const MetricsCard = ({ title, metrics, isWinner }: { 
  title: string; 
  metrics: ModelMetrics; 
  isWinner: boolean;
}) => {
  return (
    <Card className={`relative ${isWinner ? 'ring-2 ring-primary border-primary' : ''}`}>
      {isWinner && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-primary text-primary-foreground">
            <Award className="h-3 w-3 mr-1" />
            Best
          </Badge>
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="font-medium">{(metrics.accuracy * 100).toFixed(2)}%</span>
            </div>
            <Progress value={metrics.accuracy * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precision</span>
              <span className="font-medium">{(metrics.precision * 100).toFixed(2)}%</span>
            </div>
            <Progress value={metrics.precision * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Recall</span>
              <span className="font-medium">{(metrics.recall * 100).toFixed(2)}%</span>
            </div>
            <Progress value={metrics.recall * 100} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">F1-Score</span>
              <span className="font-medium">{(metrics.f1Score * 100).toFixed(2)}%</span>
            </div>
            <Progress value={metrics.f1Score * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ConfusionMatrix = ({ matrix, title }: { matrix: { [key: string]: { [key: string]: number } }; title: string }) => {
  const categories = Object.keys(matrix);
  const maxValue = Math.max(...categories.flatMap(cat => Object.values(matrix[cat])));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title} - Confusion Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Actual \ Predicted</th>
                {categories.map(cat => (
                  <th key={cat} className="p-2 text-center font-medium">{cat}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(actualCat => (
                <tr key={actualCat}>
                  <td className="p-2 font-medium">{actualCat}</td>
                  {categories.map(predCat => {
                    const value = matrix[actualCat][predCat];
                    const intensity = value / maxValue;
                    const isCorrect = actualCat === predCat;
                    return (
                      <td 
                        key={predCat} 
                        className={`p-2 text-center relative ${
                          isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-50 dark:bg-red-950'
                        }`}
                        style={{
                          backgroundColor: isCorrect 
                            ? `rgba(34, 197, 94, ${0.1 + intensity * 0.4})` 
                            : `rgba(239, 68, 68, ${intensity * 0.3})`
                        }}
                      >
                        <span className="relative z-10 font-medium">{value}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const ComparisonChart = ({ results }: { results: ModelComparison }) => {
  const models = ['word2vec', 'bert', 'sentence_bert', 'openai'] as const;
  const metrics = ['accuracy', 'precision', 'recall', 'f1Score'] as const;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span>Model Performance Comparison</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map(metric => (
            <div key={metric} className="space-y-2">
              <h4 className="font-medium capitalize">{metric.replace('f1Score', 'F1-Score')}</h4>
              <div className="grid grid-cols-4 gap-4">
                {models.map(model => {
                  const value = results[model][metric] * 100;
                  const isWinner = models.every(m => results[m][metric] <= results[model][metric]);
                  return (
                    <div key={model} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={`capitalize ${isWinner ? 'font-bold text-primary' : ''}`}>
                          {model.replace('_', '-')}
                        </span>
                        <span className={isWinner ? 'font-bold text-primary' : ''}>
                          {value.toFixed(2)}%
                        </span>
                      </div>
                      <Progress 
                        value={value} 
                        className={`h-2 ${isWinner ? 'bg-primary/20' : ''}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const MLTraining = ({ onTrainingComplete }: MLTrainingProps) => {
  const [isTraining, setIsTraining] = useState(false);
  const [results, setResults] = useState<ModelComparison | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const handleTraining = async () => {
    setIsTraining(true);
    setProgress(0);
    setCurrentStep('Initializing training data...');
    
    try {
      // Simulate progress updates
      const progressSteps = [
        { step: 'Generating synthetic training data...', progress: 20 },
        { step: 'Training Word2Vec model...', progress: 40 },
        { step: 'Training BERT model...', progress: 60 },
        { step: 'Training Sentence-BERT model...', progress: 80 },
        { step: 'Training OpenAI model...', progress: 90 },
        { step: 'Evaluating models and calculating metrics...', progress: 95 },
        { step: 'Generating comparison results...', progress: 100 }
      ];
      
      for (const { step, progress: stepProgress } of progressSteps) {
        setCurrentStep(step);
        setProgress(stepProgress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      const trainingResults = await trainAndEvaluateModels();
      setResults(trainingResults);
      onTrainingComplete?.(trainingResults);
      setCurrentStep('Training completed successfully!');
      
    } catch (error) {
      console.error('Training failed:', error);
      setCurrentStep('Training failed. Please try again.');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span>ML Model Training & Evaluation</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Train Logistic Regression classifiers on different embedding types and compare their performance
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isTraining && !results && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                This will train 4 different models using Word2Vec, BERT, Sentence-BERT, and OpenAI embeddings,
                then evaluate their accuracy, precision, recall, and F1-score.
              </p>
              <Button onClick={handleTraining} size="lg" className="px-8">
                <Play className="h-4 w-4 mr-2" />
                Start Training
              </Button>
            </div>
          )}
          
          {isTraining && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{currentStep}</p>
                <Progress value={progress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">{progress}% Complete</p>
              </div>
            </div>
          )}
          
          {results && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Training Completed Successfully!</span>
              </div>
              <Button 
                onClick={handleTraining} 
                variant="outline" 
                size="sm"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Retrain Models
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Model Metrics</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricsCard 
                title="Word2Vec" 
                metrics={results.word2vec} 
                isWinner={results.bestModel === 'word2vec'}
              />
              <MetricsCard 
                title="BERT" 
                metrics={results.bert} 
                isWinner={results.bestModel === 'bert'}
              />
              <MetricsCard 
                title="Sentence-BERT" 
                metrics={results.sentence_bert} 
                isWinner={results.bestModel === 'sentence_bert'}
              />
              <MetricsCard 
                title="OpenAI" 
                metrics={results.openai} 
                isWinner={results.bestModel === 'openai'}
              />
            </div>
            
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Training Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {results.summary}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison">
            <ComparisonChart results={results} />
          </TabsContent>
          
          <TabsContent value="confusion" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ConfusionMatrix 
                matrix={results.word2vec.confusionMatrix} 
                title="Word2Vec"
              />
              <ConfusionMatrix 
                matrix={results.bert.confusionMatrix} 
                title="BERT"
              />
              <ConfusionMatrix 
                matrix={results.sentence_bert.confusionMatrix} 
                title="Sentence-BERT"
              />
              <ConfusionMatrix 
                matrix={results.openai.confusionMatrix} 
                title="OpenAI"
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};