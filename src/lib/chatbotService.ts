import { tripService, Trip } from './dataService';

export type ChatStep = 'initial' | 'browse_categories' | 'show_trips' | 'faqs' | 'contact' | 'search_results';

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  text: string;
  timestamp: Date;
  options?: string[];
  trips?: Trip[];
}

export const CHAT_KEYWORDS: Record<string, ChatStep> = {
  'price': 'browse_categories',
  'cost': 'browse_categories',
  'trek': 'browse_categories',
  'trip': 'browse_categories',
  'adventure': 'browse_categories',
  'himachal': 'show_trips',
  'weekend': 'show_trips',
  'backpack': 'show_trips',
  'camp': 'show_trips',
  'faq': 'faqs',
  'help': 'faqs',
  'cancel': 'faqs',
  'policy': 'faqs',
  'contact': 'contact',
  'whatsapp': 'contact',
  'call': 'contact',
  'phone': 'contact',
  'booking': 'browse_categories',
};

export const chatbotService = {
  // Simple keyword matcher
  findStepByKeyword(input: string): ChatStep | null {
    const lowerInput = input.toLowerCase();
    for (const [keyword, step] of Object.entries(CHAT_KEYWORDS)) {
      if (lowerInput.includes(keyword)) return step;
    }
    return null;
  },

  getInitialMessage(): ChatMessage {
    return {
      id: 'init-' + Date.now(),
      type: 'bot',
      text: "Hi! 👋 Welcome to TrekATour. I'm Riya, your travel coordinator. How can I help you today?",
      timestamp: new Date(),
      options: ['🏔️ Browse Trips', '❓ FAQs', '📞 Contact Support']
    };
  },

  async handleUserChoice(choice: string | ChatStep): Promise<ChatMessage> {
    const step = typeof choice === 'string' ? this.mapChoiceToStep(choice) : choice;
    
    switch (step) {
      case 'browse_categories':
        return {
          id: 'cat-' + Date.now(),
          type: 'bot',
          text: "What kind of adventure are you looking for?",
          timestamp: new Date(),
          options: ['Himachal Trips', 'Weekend Getaway', 'Backpacking Trips', 'Camping Escapes']
        };

      case 'faqs':
        return {
          id: 'faq-' + Date.now(),
          type: 'bot',
          text: "What would you like to know about our bookings?",
          timestamp: new Date(),
          options: ['Group Discounts', '🏠 Main Menu']
        };

      case 'contact':
        return {
          id: 'cont-' + Date.now(),
          type: 'bot',
          text: "We'd love to help you personally! You can reach us on WhatsApp or call our team directly at +91 8248107567.",
          timestamp: new Date(),
          options: ['💬 Chat on WhatsApp', '🏠 Main Menu']
        };

      default:
        return this.getInitialMessage();
    }
  },

  mapChoiceToStep(choice: string): ChatStep {
    if (choice.includes('Browse') || choice.includes('Main Menu')) return 'browse_categories';
    if (choice.includes('FAQ')) return 'faqs';
    if (choice.includes('Contact') || choice.includes('Support')) return 'contact';
    return 'initial';
  }
};
