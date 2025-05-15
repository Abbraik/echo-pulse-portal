
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the document direction and language based on stored preferences
const initializeLanguageSettings = () => {
  const storedLanguage = localStorage.getItem('pds-language');
  if (storedLanguage === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.body.classList.add('rtl');
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    document.body.classList.remove('rtl');
  }
};

// Run initialization before app is rendered
initializeLanguageSettings();

createRoot(document.getElementById("root")!).render(<App />);
