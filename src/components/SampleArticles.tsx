import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SampleArticlesProps {
  onSelectArticle: (article: string) => void;
}

const sampleArticles = [
  {
    category: 'Tech',
    title: 'AI Revolution in Healthcare',
    preview: 'Artificial intelligence is transforming medical diagnosis...',
    content: 'Artificial intelligence is transforming medical diagnosis and treatment planning across hospitals worldwide. Machine learning algorithms can now analyze medical images with unprecedented accuracy, detecting early-stage diseases that human radiologists might miss. Recent studies show that AI-powered diagnostic tools have achieved 95% accuracy in identifying certain types of cancer from CT scans and MRIs. Major tech companies are investing billions in healthcare AI, with Google, Microsoft, and IBM leading the charge in developing next-generation medical AI systems.',
    icon: '💻'
  },
  {
    category: 'Finance',
    title: 'Cryptocurrency Market Surge',
    preview: 'Bitcoin reaches new all-time highs as institutional adoption...',
    content: 'Bitcoin reaches new all-time highs as institutional adoption accelerates across global financial markets. Major investment firms and corporations are adding cryptocurrency to their balance sheets, driving unprecedented demand. The Federal Reserve\'s monetary policy and inflation concerns have pushed investors toward digital assets as a hedge against traditional market volatility. Trading volumes have increased by 300% compared to last year, with retail and institutional investors both contributing to the surge.',
    icon: '💰'
  },
  {
    category: 'Healthcare',
    title: 'Breakthrough Cancer Treatment',
    preview: 'Scientists develop revolutionary immunotherapy approach...',
    content: 'Scientists develop revolutionary immunotherapy approach that shows remarkable success in treating aggressive forms of cancer. The new treatment method harnesses the body\'s immune system to target cancer cells more effectively than traditional chemotherapy. Clinical trials involving 500 patients showed a 78% improvement in survival rates compared to conventional treatments. The therapy has received fast-track approval from the FDA and is expected to be available in major hospitals within the next six months.',
    icon: '🏥'
  },
  {
    category: 'Sports',
    title: 'World Cup Final Drama',
    preview: 'In a thrilling finale that went to penalty shootouts...',
    content: 'In a thrilling finale that went to penalty shootouts, the World Cup concluded with one of the most dramatic matches in football history. Both teams displayed exceptional skill and determination throughout the 120-minute match, with the score tied 2-2 after extra time. The penalty shootout saw incredible saves from both goalkeepers, with the winning goal scored in the final kick. Over 1.5 billion viewers worldwide watched the historic match, making it the most-watched sporting event of the year.',
    icon: '⚽'
  },
  {
    category: 'Politics',
    title: 'Climate Policy Summit',
    preview: 'World leaders gather for emergency climate summit...',
    content: 'World leaders gather for emergency climate summit as global temperatures reach record highs. Representatives from 195 countries are negotiating new binding agreements to reduce greenhouse gas emissions by 50% within the next decade. The summit comes as scientists warn that current climate policies are insufficient to prevent catastrophic global warming. Key discussions focus on renewable energy investments, carbon pricing mechanisms, and support for developing nations transitioning to clean energy.',
    icon: '🏛️'
  },
  {
    category: 'Entertainment',
    title: 'Blockbuster Movie Success',
    preview: 'The latest superhero franchise installment breaks box office records...',
    content: 'The latest superhero franchise installment breaks box office records, earning $500 million worldwide in its opening weekend. The film features cutting-edge visual effects and an all-star cast that has captivated audiences across all demographics. Critics praise the movie\'s innovative storytelling and spectacular action sequences. The success has already prompted the studio to announce three more sequels, with production scheduled to begin next year.',
    icon: '🎬'
  }
];

export const SampleArticles = ({ onSelectArticle }: SampleArticlesProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-center">Try Sample Articles</CardTitle>
        <p className="text-center text-muted-foreground">
          Test the classifier with these pre-written articles from different categories
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleArticles.map((article, index) => (
            <div
              key={index}
              className="group relative bg-background/50 rounded-lg p-4 border border-border/50 hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-ai"
              onClick={() => onSelectArticle(article.content)}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{article.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {article.preview}
                  </p>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-200" />
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Click any article above to instantly classify it with all 4 AI models
          </p>
        </div>
      </CardContent>
    </Card>
  );
};