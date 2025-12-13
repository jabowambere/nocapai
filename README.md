# NoCap - Fake News Detector

A modern MERN stack application for detecting fake news and misinformation. Features a sleek shadcn/ui-inspired dark/light theme with professional styling using Tailwind CSS.

## Features

- **AI-Powered Analysis**: Analyzes articles and headlines for credibility indicators
- **Dark/Light Theme**: Toggle between dark and light modes for comfortable viewing
- **Real-time Results**: Instant analysis with detailed breakdown
- **Credibility Score**: 0-100% score based on multiple indicators
- **Pattern Detection**: Identifies sensationalist language, emotional manipulation, and unreliable sources
- **Modern UI**: Professional design with shadcn/ui aesthetic
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Lucide React (Icons)
- Axios (HTTP Client)

**Backend:**
- Node.js
- Express.js
- CORS enabled
- REST API

## Project Structure

```
nocap/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Hero.js
│   │   │   ├── DetectionForm.js
│   │   │   └── ResultCard.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── backend/
    ├── server.js
    ├── package.json
    └── .env
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Install additional dependencies for styling:
```bash
npm install -D tailwindcss postcss autoprefixer
```

4. Start the development server:
```bash
npm start
```

Application opens at `http://localhost:3000`

## Analysis Indicators

The system analyzes content based on:

### Credibility Factors ✓
- Mentions of credible sources (BBC, Reuters, AP News, etc.)
- Use of factual language ("study shows", "research found")
- Proper citations and verification

### Misinformation Flags ✗
- Sensationalist language ("shocking", "you won't believe")
- Emotional manipulation tactics
- Excessive punctuation (!!!)
- All-caps words
- Multiple links (clickbait pattern)
- Unverified sources

## Usage

1. **Enter Title** (optional): Paste a headline or article title
2. **Enter Content**: Paste the full article or news text
3. **Analyze**: Click the "Analyze Content" button
4. **Review Results**: 
   - See credibility score (0-100%)
   - Check verdict (LIKELY REAL / UNCERTAIN / LIKELY FAKE)
   - Review identified indicators
   - Check source analysis

## Verdict Definitions

- **LIKELY REAL (70-100%)**: Content appears credible with factual language and trusted sources
- **UNCERTAIN (50-69%)**: Mixed indicators - cross-reference with multiple sources
- **LIKELY FAKE (0-49%)**: Shows patterns common in misinformation - be cautious

## Customization

### Change Colors
Edit `frontend/tailwind.config.js` to modify the slate color palette

### Add Analysis Rules
Modify the `newsDatabase` object in `backend/server.js` to add:
- New keywords to detect
- Additional trusted/untrusted sources
- Custom analysis logic

### Adjust Theme
Toggle dark/light mode in the header - preference persists during session

## API Endpoint

### POST /api/detection/analyze

**Request:**
```json
{
  "title": "Article headline",
  "text": "Full article content"
}
```

**Response:**
```json
{
  "credibilityScore": 75,
  "verdict": "LIKELY REAL",
  "analysis": "This content appears credible...",
  "indicators": ["Contains credible language", "..."],
  "sources": ["Mentions trusted source: Reuters"],
  "contentLength": 1234
}
```

## Error Handling

- If backend is not running: Error message guides you to start it on port 5000
- If content is empty: Validation ensures at least title or text is provided
- Network errors: User-friendly error messages

## Future Enhancements

- Database integration for storing analysis history
- User authentication and saved results
- Advanced NLP sentiment analysis
- Real-time fact-checking API integration
- Bias detection algorithm
- Claim verification system
- Share results feature

## Notes

- The analysis is based on pattern recognition and heuristics
- For critical news verification, always cross-check with multiple reliable sources
- This tool is meant to supplement human judgment, not replace it

## License

MIT

## Contributing

Feel free to fork, modify, and improve this project!
