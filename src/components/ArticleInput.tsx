import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, FileText } from 'lucide-react';

interface ArticleInputProps {
  value: string;
  onChange: (value: string) => void;
  onClassify: (text: string) => void;
  isLoading: boolean;
}

export const ArticleInput = ({ value, onChange, onClassify, isLoading }: ArticleInputProps) => {
  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onClassify(value);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Article Input</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Paste your news article here for AI-powered classification..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[200px] max-h-[400px] resize-y bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 rounded px-2 py-1">
            {value.length} characters
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {value.length === 0 && "Enter an article to get started"}
            {value.length > 0 && value.length < 50 && "Article seems short - add more content for better classification"}
            {value.length >= 50 && "Ready for classification"}
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={value.trim().length === 0 || isLoading}
            className="bg-gradient-primary hover:shadow-ai transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Classifying...
              </>
            ) : (
              'Classify Article'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};