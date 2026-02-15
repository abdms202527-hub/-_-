
import { AppState } from './types';

export const INITIAL_DATA: AppState = {
  homepage: {
    mainHeading: "श्री गुरुदत्त विठ्ठल मन्दिर",
    heroTitle: "जय विठ्ठल, जय हरी",
    scrollingMessage: "मंदिर के पट सुबह 5 बजे खुलते हैं। सभी श्रद्धालुओं का स्वागत है। कृपया शांति बनाए रखें।",
    welcomeMessage: "हमारे मंदिर के आधिकारिक पोर्टल पर स्वागत है। विठ्ठल और गुरुदत्त महाराज की कृपा आप पर सदा बनी रहे।",
    heroImage: "https://images.unsplash.com/photo-1544027072-a482177bc543?q=80&w=1200",
    dailyThought: "प्रेम ही ईश्वर है और ईश्वर ही प्रेम है।",
    footerLeftImage: "https://cdn-icons-png.flaticon.com/512/1045/1045934.png",
    footerRightImage: "https://cdn-icons-png.flaticon.com/512/1045/1045934.png",
    footerTitle: "श्री गुरुदत्त विठ्ठल मन्दिर",
    footerDescription: "भगवान विठ्ठल के चरणों में समर्पित एक पावन धाम। यहाँ शांति और भक्ति का संगम होता है।",
    footerEmail: "contact@gurudattmandir.org",
    footerPhone: "+91 98765 43210",
    footerAddress: "मुख्य मार्ग, पावन नगर, महाराष्ट्र",
    footerMorningTime: "05:00 AM - 12:00 PM",
    footerEveningTime: "04:00 PM - 09:30 PM",
    todaysDarshanImage: "https://images.unsplash.com/photo-1544027072-a482177bc543?q=80&w=800"
  },
  aartiTimings: [
    { id: '1', name: 'काकड आरती', time: '05:30 AM' },
    { id: '2', name: 'मध्यान्ह आरती', time: '12:00 PM' },
    { id: '3', name: 'धूप आरती', time: '06:30 PM' },
    { id: '4', name: 'शेज आरती', time: '09:00 PM' }
  ],
  gallery: [
    { id: 'g1', url: 'https://images.unsplash.com/photo-1544027072-a482177bc543?q=80&w=800', caption: 'मंदिर परिसर' },
    { id: 'g2', url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=800', caption: 'मुख्य मूर्ति' },
    { id: 'g3', url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800', caption: 'महोत्सव दर्शन' }
  ],
  events: [
    { id: 'e1', title: 'आषाढी एकादशी उत्सव', date: '2025-07-15', description: 'विठ्ठल नामाचा जयघोष और भजन संध्या।' },
    { id: 'e2', title: 'दत्त जयंती', date: '2025-12-10', description: 'विशेष महापूजा और पालखी समारोह।' }
  ],
  donation: {
    bankName: "State Bank of India",
    accountNumber: "123456789012",
    ifscCode: "SBIN0001234",
    upiId: "temple@upi",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=temple@upi&pn=ShreeGurudattVitthal"
  }
};
