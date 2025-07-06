# AI Article Analyzer - Real Implementation Setup

This document explains how to set up and use the real AI embedding and classification functionality in the Article Analyzer project.

## Overview

The project now implements **real AI classification** using four different approaches:

1. **Word2Vec/GloVe Simulation** - Custom word embedding implementation
2. **BERT** - Using Hugging Face API with BERT models
3. **Sentence-BERT** - Using Hugging Face API with Sentence Transformers
4. **OpenAI** - Using OpenAI's embedding and GPT models

## Setup Instructions

### 1. Environment Configuration

Copy the `.env` file and configure your API keys:

```bash
# Required for OpenAI functionality
VITE_OPENAI_API_KEY=your_actual_openai_api_key

# Required for BERT and Sentence-BERT
VITE_HUGGINGFACE_API_KEY=your_actual_huggingface_api_key
```

### 2. Getting API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Add credits to your account (minimum $5 recommended)

#### Hugging Face API Key
1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in
3. Go to Settings → Access Tokens
4. Create a new token with 'Read' permissions
5. The free tier includes generous limits for testing

### 3. Fallback Behavior

If API keys are not configured, the system automatically falls back to:
- **Keyword-based classification** using predefined category keywords
- **Simulated embeddings** for Word2Vec functionality
- **Confidence scoring** based on keyword matching

This ensures the application works even without API keys for testing purposes.

## How It Works

### Classification Process

1. **Parallel Processing**: All four models run simultaneously for faster results
2. **Real API Calls**: When configured, makes actual calls to OpenAI and Hugging Face
3. **Intelligent Fallbacks**: Gracefully handles API failures or missing keys
4. **Performance Tracking**: Measures actual response times for each model

### Model Implementations

#### Word2Vec/GloVe
- Generates 100-dimensional word embeddings
- Uses cosine similarity for classification
- Combines with keyword matching for accuracy
- **No API required** - runs locally

#### BERT (via Hugging Face)
- Uses `facebook/bart-large-mnli` model
- Zero-shot classification approach
- Real-time inference via Hugging Face API
- **Requires**: Hugging Face API key

#### Sentence-BERT (via Hugging Face)
- Uses `sentence-transformers/all-MiniLM-L6-v2`
- Optimized for sentence-level understanding
- Better context awareness than traditional BERT
- **Requires**: Hugging Face API key

#### OpenAI
- Uses `text-embedding-3-small` for embeddings
- Uses `gpt-3.5-turbo` for classification
- Highest accuracy and context understanding
- **Requires**: OpenAI API key with credits

### Categories

The system classifies articles into these categories:
- **Tech**: Technology, AI, software, startups
- **Finance**: Banking, investments, economy, cryptocurrency
- **Healthcare**: Medical, pharmaceutical, wellness
- **Sports**: All sports, competitions, athletes
- **Politics**: Government, elections, policy
- **Entertainment**: Movies, music, celebrities, culture

## Testing the Implementation

### 1. Without API Keys (Keyword-based)
- Start the application: `npm run dev`
- Try the sample articles or input custom text
- Results will be based on keyword matching
- Confidence scores will be lower but realistic

### 2. With API Keys (Full AI)
- Configure your `.env` file with real API keys
- Restart the application
- Test with various article types
- Compare results across different models
- Notice improved accuracy and confidence scores

### 3. Performance Comparison
- **Word2Vec**: Fastest (~100-200ms)
- **Sentence-BERT**: Fast (~200-500ms)
- **BERT**: Medium (~400-800ms)
- **OpenAI**: Slower but most accurate (~800-2000ms)

## Cost Considerations

### OpenAI Costs (Approximate)
- Embeddings: ~$0.0001 per 1K tokens
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- **Estimated cost per classification**: $0.001-0.005

### Hugging Face
- Free tier: 30,000 characters/month
- Pro tier: $9/month for higher limits
- **Estimated cost**: Free for testing, minimal for production

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify keys are correctly set in `.env`
   - Check API key permissions and credits
   - Restart the development server after changes

2. **Rate Limiting**
   - OpenAI: 3 requests/minute on free tier
   - Hugging Face: Varies by model
   - Solution: Implement request queuing or upgrade plans

3. **CORS Issues**
   - All API calls are made from the frontend
   - Some browsers may block requests
   - Consider implementing a backend proxy for production

### Debug Mode

Check browser console for detailed logs:
- API response times
- Error messages
- Fallback activations
- Classification confidence scores

## Production Recommendations

1. **Backend Implementation**: Move API calls to a backend service
2. **Caching**: Implement result caching for repeated articles
3. **Rate Limiting**: Add request queuing and retry logic
4. **Monitoring**: Track API usage and costs
5. **Security**: Never expose API keys in frontend code

## File Structure

```
src/
├── services/
│   └── aiService.ts          # Main AI classification logic
├── pages/
│   └── Index.tsx             # Updated to use real AI service
└── components/
    ├── ModelResults.tsx      # Displays classification results
    ├── ArticleInput.tsx      # Article input interface
    └── VisualizationCharts.tsx # Results visualization
```

## Next Steps

1. **Configure API Keys**: Set up your OpenAI and Hugging Face accounts
2. **Test Functionality**: Try different article types and compare results
3. **Monitor Performance**: Check response times and accuracy
4. **Optimize**: Fine-tune models or add custom training data
5. **Scale**: Consider backend implementation for production use

The system is now ready for real AI-powered article classification!