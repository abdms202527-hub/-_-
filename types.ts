
export interface AartiTiming {
  id: string;
  name: string;
  time: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface TempleEvent {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface HomepageContent {
  mainHeading: string;
  heroTitle: string;
  scrollingMessage: string;
  welcomeMessage: string;
  heroImage: string;
  dailyThought: string;
  footerLeftImage: string;
  footerRightImage: string;
  footerTitle: string;
  footerDescription: string;
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  footerMorningTime: string;
  footerEveningTime: string;
  todaysDarshanImage: string;
}

export interface DonationInfo {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  qrCodeUrl: string;
}

export interface AppState {
  homepage: HomepageContent;
  aartiTimings: AartiTiming[];
  gallery: GalleryImage[];
  events: TempleEvent[];
  donation: DonationInfo;
}
