import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const translations: Translations = {
  // Brand & Taglines
  brandName: { en: 'RozgaarSetu', hi: 'रोज़गारसेतु', mr: 'रोजगारसेतू' },
  taglinePrimary: { en: 'A Bridge to Employment', hi: 'रोज़गार का सेतु', mr: 'रोजगाराचा सेतू' },
  taglineSecondary: { en: 'Rozgaar Ka Naya Raasta', hi: 'रोज़गार का नया रास्ता', mr: 'रोजगाराचा नवा मार्ग' },
  heroHeadline: { en: 'Real People. Real Work. Better Opportunities.', hi: 'सच्चे लोग। सच्चा काम। बेहतर अवसर।', mr: 'खरी माणसं। खरं काम। उत्तम संधी।' },
  heroSubheadline: {
    en: 'Connecting skilled service professionals, verified gig workers, and employers across the Mumbai Metropolitan Region.',
    hi: 'मुंबई परिसरातील कुशल सेवा व्यावसायिक, पडताळणी केलेले गिग कामगार आणि नियोक्त्यांना जोडणारा विश्वासू मंच.',
    mr: 'मुंबई महानगर क्षेत्रातील कुशल सेवा कारागीर, पडताळलेले गिग कामगार आणि नियोक्त्यांना जोडणारा विश्वासार्ह मंच.'
  },

  // Navigation
  navHome: { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  navServices: { en: 'Services', hi: 'सेवाएं', mr: 'सेवा' },
  navGigs: { en: 'Gigs', hi: 'गिग्स', mr: 'गिग्स' },
  navJobs: { en: 'Jobs', hi: 'नौकरियां', mr: 'नोकऱ्या' },
  navForWorkers: { en: 'For Workers', hi: 'कामगारों के लिए', mr: 'कामगारांसाठी' },
  navForEmployers: { en: 'For Employers', hi: 'नियोक्ताओं के लिए', mr: 'नियोक्त्यांसाठी' },
  navLogin: { en: 'Log In', hi: 'लॉग इन', mr: 'लॉग इन' },
  navRegister: { en: 'Sign Up', hi: 'साइन अप', mr: 'नोंदणी करा' },
  navDashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
  navLogout: { en: 'Log Out', hi: 'लॉग आउट', mr: 'लॉग आउट' },
  navBookings: { en: 'Bookings', hi: 'बुकिंग्स', mr: 'बुकिंग' },
  navApplications: { en: 'Applications', hi: 'आवेदन', mr: 'अर्ज' },
  navProfile: { en: 'Profile', hi: 'प्रोफाइल', mr: 'प्रोफाइल' },

  // Search & Filters
  searchPlaceholder: { en: 'Search electrician, cleaner, driver, plumber...', hi: 'इलेक्ट्रीशियन, सफाई, ड्रायव्हर, प्लंबर शोधा...', mr: 'इलेक्ट्रीशियन, स्वच्छता, चालक, प्लंबर शोधा...' },
  allLocalities: { en: 'All Mumbai Localities', hi: 'सभी मुंबई इलाके', mr: 'सर्व मुंबई भाग' },
  searchButton: { en: 'Search', hi: 'खोजें', mr: 'शोधा' },
  findServiceTab: { en: 'Find a Service', hi: 'सेवा खोजें', mr: 'सेवा शोधा' },
  findJobTab: { en: 'Find a Job / Gig', hi: 'काम / नौकरी खोजें', mr: 'काम / नोकरी शोधा' },

  // Roles
  roleWorker: { en: 'Worker / Technician', hi: 'कामगार / तंत्रज्ञ', mr: 'कामगार / तंत्रज्ञ' },
  roleCustomer: { en: 'Customer / Household', hi: 'ग्राहक / कुटुंब', mr: 'ग्राहक / कुटुंब' },
  roleEmployer: { en: 'Employer / Business', hi: 'नियोक्ता / व्यावसायिक', mr: 'नियोक्ता / व्यावसायिक' },

  // Action Buttons
  bookNow: { en: 'Book Service', hi: 'सेवा बुक करें', mr: 'सेवा बुक करा' },
  applyNow: { en: 'Apply Now', hi: 'आवेदन करें', mr: 'अर्ज करा' },
  viewDetails: { en: 'View Details', hi: 'विवरण देखें', mr: 'सविस्तर पहा' },
  saveListing: { en: 'Save', hi: 'सुरक्षित करें', mr: 'जतन करा' },
  submit: { en: 'Submit', hi: 'जमा करें', mr: 'सादर करा' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', mr: 'रद्द करा' },

  // Categories
  cleaning: { en: 'Home Cleaning', hi: 'घर की सफाई', mr: 'घराची स्वच्छता' },
  plumbing: { en: 'Plumbing', hi: 'प्लंबिंग', mr: 'प्लंबिंग' },
  electrical: { en: 'Electrical Work', hi: 'इलेक्ट्रिकल काम', mr: 'इलेक्ट्रिकल काम' },
  appliances: { en: 'Appliance Repair', hi: 'उपकरण मरम्मत', mr: 'उपकरणे दुरुस्ती' },
  cooking: { en: 'Cooking Help', hi: 'रसोई सहाय्य', mr: 'स्वयंपाक सहाय्य' },
  beauty: { en: 'Beauty & Personal Care', hi: 'सौंदर्य व काळजी', mr: 'सौंदर्य व निगा' },
  moving: { en: 'Moving & Loading', hi: 'मालवाहतूक व लोडिंग', mr: 'मालवाहतूक व लोडिंग' },
  carpentry: { en: 'Carpentry & Handyman', hi: 'सुतारकाम व इतर', mr: 'सुतारकाम व इतर' },

  // Statuses
  statusPending: { en: 'Pending', hi: 'प्रलंबित', mr: 'प्रलंबित' },
  statusRequested: { en: 'Requested', hi: 'अनुरोधित', mr: 'मागणी केली' },
  statusConfirmed: { en: 'Confirmed', hi: 'पुष्टीकृत', mr: 'निश्चित केले' },
  statusInProgress: { en: 'In Progress', hi: 'सुरू आहे', mr: 'सुरू आहे' },
  statusCompleted: { en: 'Completed', hi: 'पूर्ण', mr: 'पूर्ण' },
  statusCancelled: { en: 'Cancelled', hi: 'रद्द', mr: 'रद्द' },
  statusApplied: { en: 'Applied', hi: 'अर्ज केला', mr: 'अर्ज केला' },
  statusUnderReview: { en: 'Under Review', hi: 'तपासणी अंतर्गत', mr: 'पडताळणी अंतर्गत' },
  statusShortlisted: { en: 'Shortlisted', hi: 'शॉर्टलिस्ट', mr: 'शॉर्टलिस्ट केले' },
  statusSelected: { en: 'Selected', hi: 'निवड झाली', mr: 'निवड झाली' },
  statusRejected: { en: 'Rejected', hi: 'नाकारले', mr: 'नाकारले' },

  // Sections
  featuredProviders: { en: 'Verified Mumbai Service Professionals', hi: 'पडताळलेले मुंबई सेवा कारागीर', mr: 'पडताळलेले मुंबई सेवा कारागीर' },
  popularCategories: { en: 'Browse by Service Category', hi: 'सेवा वर्गवारीनुसार शोधा', mr: 'सेवा वर्गवारीनुसार शोधा' },
  recentGigs: { en: 'Immediate Shifts & Flexible Gigs', hi: 'तातडीचे गिग्स व शिफ्ट काम', mr: 'तातडीचे गिग्स व शिफ्ट काम' },
  recentJobs: { en: 'Long-Term Job Openings', hi: 'दीर्घकालीन नोकऱ्या', mr: 'दीर्घकालीन नोकऱ्या' },

  // Footer
  footerAbout: {
    en: 'RozgaarSetu is Mumbai’s dedicated workforce marketplace connecting verified technicians, gig workers, and jobseekers with households and employers.',
    hi: 'रोज़गारसेतु हा मुंबईचा समर्पित कार्यबल मंच आहे जो पडताळणी केलेले कारागीर, गिग कामगार आणि नोकरी शोधणाऱ्यांना कुटुंब आणि नियोक्त्यांशी जोडतो.',
    mr: 'रोजगारसेतू हा मुंबईचा समर्पित कार्यबल मंच आहे जो पडताळणी केलेले कारागीर, गिग कामगार आणि नोकरी शोधणाऱ्यांना कुटुंबे आणि नियोक्त्यांशी जोडतो.'
  },
  copyright: {
    en: '© 2026 RozgaarSetu. A Bridge to Employment. All rights reserved.',
    hi: '© २०२६ रोज़गारसेतु. रोज़गार का सेतु. सर्व हक्क सुरक्षित.',
    mr: '© २०२६ रोजगारसेतू. रोजगाराचा सेतू. सर्व हक्क राखीव.'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('rozgaarsetu_language') as Language;
    return saved === 'hi' || saved === 'mr' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rozgaarsetu_language', lang);
    document.documentElement.setAttribute('lang', lang);
    if (lang === 'hi' || lang === 'mr') {
      document.body.classList.add('font-devanagari');
    } else {
      document.body.classList.remove('font-devanagari');
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    if (language === 'hi' || language === 'mr') {
      document.body.classList.add('font-devanagari');
    }
  }, [language]);

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    if (translations[key] && translations[key].en) {
      return translations[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
