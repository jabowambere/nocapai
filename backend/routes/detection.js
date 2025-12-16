const express = require('express');
const { protect } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// MongoDB Schema for Analysis Results
const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  text: String,
  credibilityScore: Number,
  verdict: String,
  analysis: String,
  indicators: [String],
  sources: [String],
  contentLength: Number,
  createdAt: { type: Date, default: Date.now },
});

const Analysis = mongoose.model('Analysis', analysisSchema);

// Fake news detection data and logic
const newsDatabase = {
  keywords: {
    reliable: ['study shows', 'according to', 'researchers found', 'data indicates', 'evidence suggests', 'verified by', 'confirmed by'],
    unreliable: ['shocking', 'unbelievable', 'you won\'t believe', 'doctors hate', 'they don\'t want you to know', 'secret', 'exposed', 'coverup']
  },
  sources: {
    trusted: ['BBC', 'Reuters', 'AP News', 'NPR', 'The Guardian', 'Associated Press', 'Bloomberg', 'Financial Times'],
    untrusted: ['unknown source', 'anonymous source', 'viral posts', 'social media claims']
  }
};

// Detection route (public)
router.post('/analyze', async (req, res) => {
  const { text, sourceUrl } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Please provide content to analyze' });
  }

  const content = text.toLowerCase();

  // Calculate reliability score (0-100)
  let score = 50; // neutral starting point
  let indicators = [];
  let sources = [];
  let analysis = '';

  // Check for unreliable keywords
  newsDatabase.keywords.unreliable.forEach(keyword => {
    if (content.includes(keyword)) {
      score -= 8;
      indicators.push(`Contains sensationalist language: "${keyword}"`);
    }
  });

  // Check for reliable keywords
  newsDatabase.keywords.reliable.forEach(keyword => {
    if (content.includes(keyword)) {
      score += 5;
      indicators.push(`Contains credible language: "${keyword}"`);
    }
  });

  // Check for source mentions
  newsDatabase.sources.trusted.forEach(source => {
    if (content.includes(source.toLowerCase())) {
      score += 10;
      sources.push(`Mentions trusted source: ${source}`);
    }
  });

  newsDatabase.sources.untrusted.forEach(source => {
    if (content.includes(source.toLowerCase())) {
      score -= 10;
      sources.push(`Relies on unverified source: ${source}`);
    }
  });

  // Check for all caps (often fake news indicator)
  const allCapsWords = content.split(' ').filter(word => word === word.toUpperCase() && word.length > 1);
  if (allCapsWords.length > 2) {
    score -= 5;
    indicators.push('Contains excessive capitalization');
  }

  // Check for punctuation spam
  const punctuationCount = (content.match(/[!?]{2,}/g) || []).length;
  if (punctuationCount > 2) {
    score -= 8;
    indicators.push('Contains excessive punctuation');
  }

  // Check URL patterns
  const urlCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
  if (urlCount > 3) {
    score -= 5;
    indicators.push('Contains multiple links (common in clickbait)');
  }

  // Check for emotional language
  const emotionalWords = ['angry', 'furious', 'devastated', 'shocking', 'heartbreaking', 'amazing'];
  const emotionalCount = emotionalWords.filter(word => content.includes(word)).length;
  if (emotionalCount > 1) {
    score -= 6;
    indicators.push('Contains excessive emotional language');
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine verdict
  let verdict = 'MODERATE';
  if (score >= 70) {
    verdict = 'LIKELY REAL';
    analysis = 'This content appears to be from credible sources with factual language. Verify with official sources.';
  } else if (score >= 50) {
    verdict = 'UNCERTAIN';
    analysis = 'This content has mixed indicators. Cross-reference with multiple sources before sharing.';
  } else {
    verdict = 'LIKELY FAKE';
    analysis = 'This content shows patterns common in misinformation. Be cautious about sharing.';
  }

  // Check source URL credibility if provided
  if (sourceUrl) {
    const url = sourceUrl.toLowerCase();
    const trustedDomains = ['bbc.com', 'reuters.com', 'apnews.com', 'npr.org', 'theguardian.com', 'bloomberg.com'];
    const untrustedDomains = ['clickbait.com', 'fakenews.com', 'conspiracy.com'];
    
    if (trustedDomains.some(domain => url.includes(domain))) {
      score += 15;
      sources.push(`Source from trusted domain: ${sourceUrl}`);
    } else if (untrustedDomains.some(domain => url.includes(domain))) {
      score -= 15;
      sources.push(`Source from questionable domain: ${sourceUrl}`);
    }
  }

  // Clamp score again after URL check
  score = Math.max(0, Math.min(100, score));

  const result = {
    credibilityScore: score,
    verdict,
    analysis,
    indicators,
    sources,
    contentLength: content.length,
    sourceUrl: sourceUrl || null
  };

  // Don't save to database for public access
  // Only admin dashboard will show saved analyses

  res.json(result);
});

// Get all analyses for admin (protected)
router.get('/history', protect, async (req, res) => {
  // Ensure only admin can view history
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const analyses = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history: ' + error.message });
  }
});

// Get analysis by ID (admin only)
router.get('/history/:id', protect, async (req, res) => {
  // Ensure only admin can view analysis
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this analysis' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analysis: ' + error.message });
  }
});

// Delete analysis by ID (admin only)
router.delete('/history/:id', protect, async (req, res) => {
  // Ensure only admin can delete
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this analysis' });
    }

    await Analysis.findByIdAndDelete(req.params.id);
    res.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete analysis: ' + error.message });
  }
});

// Get statistics for admin (protected)
router.get('/stats', protect, async (req, res) => {
  // Ensure only admin can view stats
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const total = await Analysis.countDocuments({ userId: req.user.id });
    const realNews = await Analysis.countDocuments({ userId: req.user.id, verdict: 'LIKELY REAL' });
    const fakeNews = await Analysis.countDocuments({ userId: req.user.id, verdict: 'LIKELY FAKE' });
    const uncertain = await Analysis.countDocuments({ userId: req.user.id, verdict: 'UNCERTAIN' });

    const avgScore = await Analysis.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: null, average: { $avg: '$credibilityScore' } } }
    ]);

    res.json({
      total,
      realNews,
      fakeNews,
      uncertain,
      averageScore: avgScore[0]?.average || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats: ' + error.message });
  }
});

module.exports = { router, Analysis };
