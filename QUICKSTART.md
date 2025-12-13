# Quick Start Guide

## 🚀 Getting Started with NoCap

### Option 1: Automated Setup (Windows)
```bash
# Run the installation script
install.bat
```

### Option 2: Manual Setup

#### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

#### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
```

### Step 3: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see: `Server running on port 5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

Browser will open at `http://localhost:3000`

---

## 📝 How to Use

1. **Paste Content**: Enter an article title and/or full article text
2. **Click Analyze**: Submit the content for analysis
3. **Review Results**: Get an instant credibility score and verdict

### Example Test Cases

**Test LIKELY REAL:**
```
Title: Latest Research Shows Benefits of Exercise Study

Content: According to researchers at Harvard University, a recent study indicates 
that regular physical activity can reduce the risk of heart disease by up to 35%. 
The findings were verified by the American Heart Association and published in a 
peer-reviewed journal. Experts recommend at least 150 minutes of moderate exercise per week.
```

**Test LIKELY FAKE:**
```
Title: SHOCKING! They Don't Want You to Know This!!!

Content: You won't believe what doctors are hiding from you! A secret study found 
that a miracle cure exists but big pharma is covering it up! This is absolutely 
unbelievable and could change your life forever. Exposed by anonymous sources!
```

---

## 🎨 Features

✅ Dark/Light Theme Toggle  
✅ Real-time Analysis  
✅ Credibility Score (0-100%)  
✅ Detailed Indicators  
✅ Source Analysis  
✅ Mobile Responsive  
✅ Professional shadcn/ui Design  

---

## 🔧 Troubleshooting

### Frontend can't connect to backend?
- Ensure backend is running on port 5000
- Check if `http://localhost:5000/health` works in browser
- Clear browser cache and reload

### npm install fails?
- Delete `node_modules` folder: `rm -r node_modules`
- Delete lock file: `rm package-lock.json`
- Run `npm install` again

### Port 5000 already in use?
- Edit `backend/.env` and change PORT to another number
- Update `frontend/src/components/DetectionForm.js` API URL accordingly

---

## 📚 Project Structure

```
nocap/
├── backend/
│   ├── server.js (Main Express server)
│   ├── package.json
│   └── .env (Configuration)
├── frontend/
│   ├── src/
│   │   ├── components/ (React components)
│   │   ├── App.js (Main app)
│   │   └── index.js (Entry point)
│   ├── package.json
│   ├── tailwind.config.js
│   └── public/
├── README.md (Full documentation)
└── install.bat (Windows setup script)
```

---

## 🚀 Next Steps

1. **Customize**: Edit analysis rules in `backend/server.js`
2. **Deploy**: Set up on Vercel (frontend) and Heroku (backend)
3. **Enhance**: Add database, user authentication, history
4. **Integrate**: Connect to real fact-checking APIs

---

## 📖 More Info

See `README.md` for full documentation, API details, and customization guide.

Happy fact-checking! 🔍
