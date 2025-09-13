# The Dhamma Path 🧘‍♀️

A mindful morning routine app that combines meditation, journaling, exercise, and practice sessions to help you start your day with intention and purpose.

## 🌟 Features

### 🧘 Meditation Timer
- Customizable meditation sessions (5, 10, 15, 20, 30 minutes)
- Beautiful, calming interface
- Progress tracking and session history
- Guided meditation prompts

### ✍️ Daily Journal
- Private, secure journaling
- Prompts for reflection and gratitude
- Local storage (your data stays on your device)
- Export/import functionality

### 💪 7-Minute Workout
- Science-based circuit training
- 12 exercises, 30 seconds each
- Forward/backward navigation
- Progress tracking with visual feedback
- Customizable sound options

### 🎤 Interview Practice
- Mock interview questions
- Timer-based practice sessions
- Performance tracking
- Multiple difficulty levels

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/williamDalston/dhamma-path.git
   cd dhamma-path
   ```

2. **Open in browser**
   ```bash
   # Simple HTTP server
   python3 -m http.server 8000
   # Or use any local server
   ```

3. **Visit** `http://localhost:8000`

### Production Deployment

The app is automatically deployed to GitHub Pages at: https://williamdalston.github.io/dhamma-path/

## 🛠️ Technical Details

### Architecture
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: TailwindCSS
- **Storage**: LocalStorage (client-side only)
- **Deployment**: GitHub Pages

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📁 Project Structure

```
the-dhamma-path/
├── index.html          # Main application file
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── robots.txt         # SEO robots file
├── sitemap.xml        # SEO sitemap
├── README.md          # This file
├── CHANGELOG.md       # Version history
└── package.json       # Dependencies
```

## 🔧 Development Workflow

### Branch Strategy
- `master` - Production branch
- `feature/*` - New features
- `hotfix/*` - Critical bug fixes
- `backup/*` - Backup branches

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

### Testing
- Manual testing on multiple devices
- Browser compatibility testing
- Performance monitoring

## 🐛 Troubleshooting

### Common Issues

1. **Workout buttons not working**
   - Check browser console for JavaScript errors
   - Ensure you're on the latest version
   - Try refreshing the page

2. **Data not saving**
   - Check if localStorage is enabled
   - Ensure you're not in private/incognito mode
   - Check browser storage limits

3. **Timer not starting**
   - Check browser permissions
   - Ensure JavaScript is enabled
   - Try a different browser

### Getting Help

- Check the [Issues](https://github.com/williamDalston/dhamma-path/issues) page
- Create a new issue with detailed information
- Include browser version and error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the 7-Minute Workout scientific study
- Built with mindfulness and intention
- Designed for simplicity and focus

---

**Built with ❤️ and ☕ in the early morning hours**
