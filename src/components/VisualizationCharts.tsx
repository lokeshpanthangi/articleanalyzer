import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';
import { ClassificationResult } from '@/pages/Index';

interface VisualizationChartsProps {
  result: ClassificationResult;
}

const categories = ['Tech', 'Finance', 'Healthcare', 'Sports', 'Politics', 'Entertainment'];
const categoryColors = {
  Tech: 'bg-blue-500',
  Finance: 'bg-green-500',
  Healthcare: 'bg-red-500',
  Sports: 'bg-orange-500',
  Politics: 'bg-purple-500',
  Entertainment: 'bg-pink-500'
};

export const VisualizationCharts = ({ result }: VisualizationChartsProps) => {
  // Calculate average confidence per category
  const categoryConfidences = categories.map(category => {
    const modelResults = Object.values(result.models).filter(model => model.category === category);
    const avgConfidence = modelResults.length > 0 
      ? modelResults.reduce((sum, model) => sum + model.confidence, 0) / modelResults.length
      : 0;
    return { category, confidence: avgConfidence, count: modelResults.length };
  });

  // Sort by confidence for better visualization
  const sortedCategories = [...categoryConfidences].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Detailed Analysis</h2>
        <p className="text-muted-foreground">Visual breakdown of classification results</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Comparison Chart */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5 text-primary" />
              <span>Model Performance Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(result.models).map(([modelKey, modelResult]) => (
              <div key={modelKey} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground capitalize">
                    {modelKey.replace('_', '-')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground text-xs">
                      {modelResult.category}
                    </span>
                    <span className="font-bold text-foreground">
                      {(modelResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={modelResult.confidence * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Processing: {modelResult.time}ms</span>
                  <span>Confidence: {(modelResult.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-primary" />
              <span>Category Confidence Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedCategories.map((item, index) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[item.category as keyof typeof categoryColors]}`}></div>
                    <span className="font-medium text-foreground">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {item.count} model{item.count !== 1 ? 's' : ''}
                    </span>
                    <span className="font-bold text-foreground">
                      {(item.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={item.confidence * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Classification Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {Object.values(result.models).reduce((sum, model) => sum + model.confidence, 0) / 4 * 100}%
              </div>
              <div className="text-sm text-muted-foreground">Average Confidence</div>
            </div>
            
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {Math.max(...Object.values(result.models).map(m => m.confidence)) * 100}%
              </div>
              <div className="text-sm text-muted-foreground">Highest Confidence</div>
            </div>
            
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {Object.values(result.models).reduce((sum, model) => sum + model.time, 0)}ms
              </div>
              <div className="text-sm text-muted-foreground">Total Processing Time</div>
            </div>
            
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {new Set(Object.values(result.models).map(m => m.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Unique Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};