import { Brain, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import aiIcon from '@/assets/ai-brain-icon.png';

interface HeaderProps {
  currentView: 'classify' | 'comparison' | 'training';
  onViewChange: (view: 'classify' | 'comparison' | 'training') => void;
}

export const Header = ({ currentView, onViewChange }: HeaderProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary p-2 shadow-ai">
              <img 
                src={aiIcon} 
                alt="AI Brain" 
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Smart Article Categorizer
              </h1>
              <p className="text-sm text-muted-foreground">
                Powered by 4 AI Embedding Models
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <nav className="flex bg-muted/50 rounded-lg p-1">
              <Button
                variant={currentView === 'classify' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('classify')}
                className="transition-all duration-200"
              >
                Classify
              </Button>
              <Button
                variant={currentView === 'comparison' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('comparison')}
                className="transition-all duration-200"
              >
                Compare Models
              </Button>
              <Button
                variant={currentView === 'training' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('training')}
                className="transition-all duration-200"
              >
                🧠 ML Training
              </Button>
            </nav>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="transition-all duration-200 hover:shadow-glow"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};