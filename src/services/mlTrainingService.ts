import { ClassificationResult } from '@/pages/Index';
import { generateWordEmbedding, classifyByKeywords } from './aiService';

// Types for ML training and evaluation
export interface TrainingData {
  text: string;
  category: string;
  embeddings: {
    word2vec: number[];
    bert: number[];
    sentence_bert: number[];
    openai: number[];
  };
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: { [key: string]: { [key: string]: number } };
}

export interface ModelComparison {
  word2vec: ModelMetrics;
  bert: ModelMetrics;
  sentence_bert: ModelMetrics;
  openai: ModelMetrics;
  bestModel: string;
  summary: string;
}

// Logistic Regression implementation
class LogisticRegression {
  private weights: number[];
  private bias: number;
  private learningRate: number;
  private iterations: number;
  private categories: string[];
  private categoryToIndex: { [key: string]: number };

  constructor(learningRate = 0.01, iterations = 1000) {
    this.weights = [];
    this.bias = 0;
    this.learningRate = learningRate;
    this.iterations = iterations;
    this.categories = ['Tech', 'Finance', 'Healthcare', 'Sports', 'Politics', 'Entertainment'];
    this.categoryToIndex = {};
    this.categories.forEach((cat, idx) => {
      this.categoryToIndex[cat] = idx;
    });
  }

  // Sigmoid activation function
  private sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-Math.max(-250, Math.min(250, z))));
  }

  // One-vs-rest training for multiclass classification
  train(X: number[][], y: string[]): void {
    const numFeatures = X[0].length;
    const numClasses = this.categories.length;
    
    // Initialize weights for each class
    this.weights = new Array(numClasses * numFeatures).fill(0);
    
    // Convert labels to one-hot encoding
    const yOneHot = y.map(label => {
      const oneHot = new Array(numClasses).fill(0);
      oneHot[this.categoryToIndex[label]] = 1;
      return oneHot;
    });

    // Training loop
    for (let iter = 0; iter < this.iterations; iter++) {
      for (let classIdx = 0; classIdx < numClasses; classIdx++) {
        // Extract weights for current class
        const classWeights = this.weights.slice(
          classIdx * numFeatures,
          (classIdx + 1) * numFeatures
        );

        // Forward pass
        const predictions = X.map(sample => {
          const z = sample.reduce((sum, feature, idx) => sum + feature * classWeights[idx], 0);
          return this.sigmoid(z);
        });

        // Backward pass (gradient descent)
        const gradients = new Array(numFeatures).fill(0);
        for (let i = 0; i < X.length; i++) {
          const error = predictions[i] - yOneHot[i][classIdx];
          for (let j = 0; j < numFeatures; j++) {
            gradients[j] += error * X[i][j];
          }
        }

        // Update weights
        for (let j = 0; j < numFeatures; j++) {
          this.weights[classIdx * numFeatures + j] -= 
            (this.learningRate * gradients[j]) / X.length;
        }
      }
    }
  }

  // Predict probabilities for all classes
  predictProba(X: number[][]): number[][] {
    const numFeatures = X[0].length;
    const numClasses = this.categories.length;
    
    return X.map(sample => {
      const classScores = [];
      
      for (let classIdx = 0; classIdx < numClasses; classIdx++) {
        const classWeights = this.weights.slice(
          classIdx * numFeatures,
          (classIdx + 1) * numFeatures
        );
        
        const z = sample.reduce((sum, feature, idx) => sum + feature * classWeights[idx], 0);
        classScores.push(this.sigmoid(z));
      }
      
      // Normalize to probabilities
      const sum = classScores.reduce((a, b) => a + b, 0);
      return classScores.map(score => score / (sum || 1));
    });
  }

  // Predict class labels
  predict(X: number[][]): string[] {
    const probabilities = this.predictProba(X);
    return probabilities.map(probs => {
      const maxIdx = probs.indexOf(Math.max(...probs));
      return this.categories[maxIdx];
    });
  }
}

// Calculate evaluation metrics
function calculateMetrics(yTrue: string[], yPred: string[], categories: string[]): ModelMetrics {
  const confusionMatrix: { [key: string]: { [key: string]: number } } = {};
  
  // Initialize confusion matrix
  categories.forEach(cat1 => {
    confusionMatrix[cat1] = {};
    categories.forEach(cat2 => {
      confusionMatrix[cat1][cat2] = 0;
    });
  });

  // Fill confusion matrix
  for (let i = 0; i < yTrue.length; i++) {
    confusionMatrix[yTrue[i]][yPred[i]]++;
  }

  // Calculate metrics for each class
  const classMetrics: { [key: string]: { precision: number; recall: number; f1: number } } = {};
  let totalCorrect = 0;
  
  categories.forEach(category => {
    const tp = confusionMatrix[category][category];
    const fp = categories.reduce((sum, cat) => 
      cat !== category ? sum + confusionMatrix[cat][category] : sum, 0);
    const fn = categories.reduce((sum, cat) => 
      cat !== category ? sum + confusionMatrix[category][cat] : sum, 0);
    
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1 = 2 * (precision * recall) / (precision + recall) || 0;
    
    classMetrics[category] = { precision, recall, f1 };
    totalCorrect += tp;
  });

  // Calculate overall metrics
  const accuracy = totalCorrect / yTrue.length;
  const avgPrecision = Object.values(classMetrics).reduce((sum, m) => sum + m.precision, 0) / categories.length;
  const avgRecall = Object.values(classMetrics).reduce((sum, m) => sum + m.recall, 0) / categories.length;
  const avgF1 = Object.values(classMetrics).reduce((sum, m) => sum + m.f1, 0) / categories.length;

  return {
    accuracy,
    precision: avgPrecision,
    recall: avgRecall,
    f1Score: avgF1,
    confusionMatrix
  };
}

// Generate synthetic training data
function generateTrainingData(numSamples = 300): TrainingData[] {
  const categories = ['Tech', 'Finance', 'Healthcare', 'Sports', 'Politics', 'Entertainment'];
  const trainingData: TrainingData[] = [];

  const sampleTexts = {
    Tech: [
      'Artificial intelligence breakthrough in machine learning algorithms revolutionizes data processing capabilities.',
      'New smartphone technology features advanced processors and innovative software applications.',
      'Cybersecurity experts develop cutting-edge encryption methods to protect digital infrastructure.',
      'Software engineers create revolutionary programming frameworks for web development.',
      'Tech startup launches innovative cloud computing platform with AI integration.'
    ],
    Finance: [
      'Stock market analysis reveals significant investment opportunities in emerging markets.',
      'Banking sector implements new financial regulations to improve economic stability.',
      'Cryptocurrency trading reaches new heights as digital currency adoption increases.',
      'Investment portfolio diversification strategies help minimize financial risk exposure.',
      'Economic indicators suggest positive growth trends in global financial markets.'
    ],
    Healthcare: [
      'Medical researchers discover breakthrough treatment for chronic disease management.',
      'Healthcare professionals implement telemedicine solutions to improve patient care.',
      'Pharmaceutical companies develop innovative vaccines for infectious disease prevention.',
      'Clinical trials demonstrate effectiveness of new therapeutic interventions.',
      'Mental health awareness campaigns promote wellness and psychological support services.'
    ],
    Sports: [
      'Professional athletes compete in championship tournament with record-breaking performances.',
      'Olympic games showcase international sporting excellence and athletic achievements.',
      'Football team wins league championship after intense playoff competition.',
      'Basketball players demonstrate exceptional skills in professional league matches.',
      'Tennis tournament features world-class athletes competing for prestigious titles.'
    ],
    Politics: [
      'Government officials announce new policy initiatives to address social issues.',
      'Election campaign focuses on economic reform and healthcare improvements.',
      'Political leaders engage in diplomatic negotiations for international cooperation.',
      'Legislative assembly debates important bills affecting citizen welfare.',
      'Democratic processes ensure fair representation in government decision-making.'
    ],
    Entertainment: [
      'Hollywood movie premieres feature acclaimed actors and directors.',
      'Music festival showcases diverse artists and cultural performances.',
      'Television series receives critical acclaim for outstanding storytelling.',
      'Celebrity interviews reveal insights into entertainment industry trends.',
      'Theater productions demonstrate artistic excellence and creative expression.'
    ]
  };

  // Generate samples for each category
  categories.forEach(category => {
    const samplesPerCategory = Math.floor(numSamples / categories.length);
    const texts = sampleTexts[category as keyof typeof sampleTexts];
    
    for (let i = 0; i < samplesPerCategory; i++) {
      const text = texts[i % texts.length];
      
      // Generate embeddings (simplified for demo)
      const word2vecEmbedding = generateWordEmbedding(text);
      const bertEmbedding = new Array(768).fill(0).map(() => Math.random() * 2 - 1);
      const sentenceBertEmbedding = new Array(384).fill(0).map(() => Math.random() * 2 - 1);
      const openaiEmbedding = new Array(1536).fill(0).map(() => Math.random() * 2 - 1);
      
      trainingData.push({
        text,
        category,
        embeddings: {
          word2vec: word2vecEmbedding,
          bert: bertEmbedding,
          sentence_bert: sentenceBertEmbedding,
          openai: openaiEmbedding
        }
      });
    }
  });

  // Shuffle the data
  for (let i = trainingData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trainingData[i], trainingData[j]] = [trainingData[j], trainingData[i]];
  }

  return trainingData;
}

// Train and evaluate all models
export async function trainAndEvaluateModels(): Promise<ModelComparison> {
  console.log('Generating training data...');
  const trainingData = generateTrainingData(300);
  
  // Split data into train/test (80/20)
  const splitIndex = Math.floor(trainingData.length * 0.8);
  const trainData = trainingData.slice(0, splitIndex);
  const testData = trainingData.slice(splitIndex);
  
  const categories = ['Tech', 'Finance', 'Healthcare', 'Sports', 'Politics', 'Entertainment'];
  const results: { [key: string]: ModelMetrics } = {};
  
  console.log('Training models...');
  
  // Train and evaluate each embedding type
  const embeddingTypes = ['word2vec', 'bert', 'sentence_bert', 'openai'] as const;
  
  for (const embeddingType of embeddingTypes) {
    console.log(`Training ${embeddingType} model...`);
    
    // Prepare training data
    const XTrain = trainData.map(sample => sample.embeddings[embeddingType]);
    const yTrain = trainData.map(sample => sample.category);
    
    // Prepare test data
    const XTest = testData.map(sample => sample.embeddings[embeddingType]);
    const yTest = testData.map(sample => sample.category);
    
    // Train logistic regression model
    const model = new LogisticRegression(0.01, 500);
    model.train(XTrain, yTrain);
    
    // Make predictions
    const predictions = model.predict(XTest);
    
    // Calculate metrics
    const metrics = calculateMetrics(yTest, predictions, categories);
    results[embeddingType] = metrics;
    
    console.log(`${embeddingType} - Accuracy: ${(metrics.accuracy * 100).toFixed(2)}%, F1: ${(metrics.f1Score * 100).toFixed(2)}%`);
  }
  
  // Determine best model
  const bestModel = Object.keys(results).reduce((best, current) => 
    results[current].f1Score > results[best].f1Score ? current : best
  );
  
  // Generate summary
  const summary = `
Model Performance Comparison:
${Object.entries(results).map(([model, metrics]) => 
    `${model}: Accuracy=${(metrics.accuracy * 100).toFixed(1)}%, F1=${(metrics.f1Score * 100).toFixed(1)}%`
  ).join('\n')}

Best performing model: ${bestModel} (F1-Score: ${(results[bestModel].f1Score * 100).toFixed(1)}%)`;
  
  return {
    word2vec: results.word2vec,
    bert: results.bert,
    sentence_bert: results.sentence_bert,
    openai: results.openai,
    bestModel,
    summary
  };
}

// Export for use in components
export { LogisticRegression, calculateMetrics, generateTrainingData };