import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Copy, 
  Check, 
  Menu, 
  X, 
  Sparkles, 
  Volume2, 
  Heart, 
  Users, 
  Compass, 
  Search,
  Gem,
  Award
} from 'lucide-react';
import { VENUES, GALLERY_ITEMS, TESTIMONIALS, PACKAGES, INITIAL_BOOKINGS, HERO_BG_IMAGE, ABOUT_IMAGE, MAP_IMAGE } from './data';
import { BookingStatus, PackageItem } from './types';

export default function App() {
  // Navigation & View States
  const [currentTab, setCurrentTab] = useState<'palaces' | 'galleries' | 'planner' | 'concierge'>('palaces');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stats Counters
  const [yearsCount, setYearsCount] = useState(0);
  const [weddingsCount, setWeddingsCount] = useState(0);

  // Interactive Testimonial Slider
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Gallery Filters & Lightbox
  const [galleryFilter, setGalleryFilter] = useState<'ALL' | 'INDOOR' | 'GARDEN' | 'STAGE'>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Booking & Calendar States
  const [calendarYear, setCalendarYear] = useState(2424); // Year 2024 mapping for mockup context
  const [calendarMonth, setCalendarMonth] = useState(9); // defaults to October (0-indexed 9)
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-14');
  const [selectedPackage, setSelectedPackage] = useState<PackageItem>(PACKAGES[1]); // Defaults to featured Royal Durbar
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'evening'>('evening');
  const [estimatedGuests, setEstimatedGuests] = useState<number>(350);
  const [eventType, setEventType] = useState<string>('Wedding Reception');
  
  // Contacts & Forms
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Custom prefilled flags from planning tool to form
  const [plannerPrefilled, setPlannerPrefilled] = useState(false);

  // Form Field States
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [enquiryDate, setEnquiryDate] = useState('2024-11-15');
  const [enquirySlot, setEnquirySlot] = useState('evening');
  const [venueInterests, setVenueInterests] = useState<string[]>(['undecided']);
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Royal AI Scriptorium States
  const [plannerSubTab, setPlannerSubTab] = useState<'calendar' | 'ai'>('calendar');
  const [aiThemeInput, setAiThemeInput] = useState('Maharajas Gilded Banquet');
  const [aiGuestsInput, setAiGuestsInput] = useState(300);
  const [aiTraditionsInput, setAiTraditionsInput] = useState('Sabre guard, live Ghoomar dancers, and slow-burn rosewater lanterns');
  const [aiAdditionalInput, setAiAdditionalInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoadingStep, setAiLoadingStep] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Touch swiping & quick action states for enhanced mobile interactivity
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [testimonialTouchStartX, setTestimonialTouchStartX] = useState<number | null>(null);
  const [testimonialTouchEndX, setTestimonialTouchEndX] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle active highlighting based on actual day of week
  const [todayDayName, setTodayDayName] = useState('');

  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];
    setTodayDayName(currentDay);
  }, []);

  // Listen to scrolls for sticky navbar frosted effect and floating CTA visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset scroll position to top of screen immediately on tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  // Soft increment layout counter stimulation when the tab is accessed
  useEffect(() => {
    if (currentTab === 'palaces') {
      let yc = 0;
      let wc = 0;
      const intervalY = setInterval(() => {
        if (yc < 150) {
          yc += 3;
          setYearsCount(yc);
        } else {
          setYearsCount(150);
          clearInterval(intervalY);
        }
      }, 20);

      const intervalW = setInterval(() => {
        if (wc < 500) {
          wc += 10;
          setWeddingsCount(wc);
        } else {
          setWeddingsCount(500);
          clearInterval(intervalW);
        }
      }, 20);

      return () => {
        clearInterval(intervalY);
        clearInterval(intervalW);
      };
    }
  }, [currentTab]);

  // Dynamic pricing multipliers
  const computePrice = () => {
    let basePrice = selectedPackage.price;
    // Morning slot discount
    if (selectedTimeSlot === 'morning') {
      basePrice = basePrice * 0.85; // 15% off for morning slot
    }
    // High-capacity markup for massive crowds
    if (estimatedGuests > 600) {
      basePrice = basePrice * 1.15; // 15% additional crowd setup
    }
    return Math.round(basePrice);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // Note: mockup uses 2024 as preset base for clean timeline representations
    return new Date(year === 2424 ? 2024 : year, month, 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMonthPrev = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      // cycle down if needed
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleMonthNext = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Trigger copy address indicator
  const handleCopyAddress = () => {
    navigator.clipboard.writeText('Lake Pichola Road, Udaipur, Rajasthan 313001, India');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Switch to contact tab and pre-fill planner values
  const handleRequestProposal = () => {
    setEnquiryDate(selectedDate);
    setEnquirySlot(selectedTimeSlot);
    setVenueInterests([selectedPackage.id === 'package-1' ? 'durbar' : selectedPackage.id === 'package-2' ? 'durbar' : 'gardens']);
    setAdditionalDetails(`Automated booking proposal inquiry from planning board. Details: Selected Package Theme "${selectedPackage.name}", Estimated Guests: ${estimatedGuests}, Event Type: ${eventType}, Scheduled Slot: ${selectedTimeSlot === 'morning' ? 'Morning / Day' : 'Evening / Gala'}.`);
    setPlannerPrefilled(true);
    setCurrentTab('concierge');
    
    // Scroll smoothly to form
    setTimeout(() => {
      const f = document.getElementById('appointment-booking-form');
      if (f) f.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGenerateAIPlan = async (themeName: string, guestCount: number, traditions: string, additional: string) => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    
    const steps = [
      "Unlocking the Mewar Court archives...",
      "Researching 19th-century Sandstone decor arrangements...",
      "Curating authentic historical Mewari spices and menus...",
      "Engraving your custom timeline parchment...",
      "Sealing with the royal Heritage Estates wax stamp..."
    ];
    
    let stepIndex = 0;
    setAiLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setAiLoadingStep(steps[stepIndex]);
    }, 2000);

    try {
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: themeName,
          guests: guestCount,
          traditions: traditions,
          additionalNotes: additional
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to convene the Royal Scribes.");
      }

      const data = await res.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Something went wrong while consulting the Scribes.");
    } finally {
      clearInterval(stepInterval);
      setAiLoading(false);
    }
  };

  // Form Submit Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName || !clientEmail || !clientPhone) {
      setFormError('Please fulfill all marked required parameters (*).');
      return;
    }
    setFormError(null);
    setFormSubmitted(true);
    // Auto erase submission modal helper after some period
    setTimeout(() => {
      setFormSubmitted(false);
      setBrideName('');
      setGroomName('');
      setClientEmail('');
      setClientPhone('');
      setAdditionalDetails('');
      setPlannerPrefilled(false);
    }, 6000);
  };

  // Filtered gallery items list matching the tag
  const filteredGallery = GALLERY_ITEMS.filter(it => galleryFilter === 'ALL' || it.category === galleryFilter);

  const isHeroTransparent = !scrolled && currentTab === 'palaces';

  return (
    <div className="font-sans bg-background text-on-background min-h-screen flex flex-col antialiased">
      
      {/* Frosted / Transparent Main Navigation Header */}
      <nav id="navbar" className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isHeroTransparent
          ? 'bg-transparent border-b border-white/10 py-3 md:py-3.5' 
          : 'bg-surface/95 border-b border-outline-variant/30 shadow-sm backdrop-blur-xl py-2 md:py-2.5'
      }`}>
        <div className="max-w-[1440px] mx-auto pl-4 pr-6 md:pl-6 md:pr-12 flex justify-between items-center w-full">
          
          {/* Brand Logo - Left Aligned */}
          <button 
            onClick={() => { setCurrentTab('palaces'); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            className={`font-cinzel text-base md:text-md font-extrabold tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              isHeroTransparent ? 'text-white hover:text-secondary-fixed-dim' : 'text-primary hover:text-secondary'
            }`}
          >
            Heritage Estates
          </button>

          {/* Navigation Links & CTA - Right Aligned (Desktop) */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6 xl:space-x-8 pl-[10px]">
            <button 
              onClick={() => setCurrentTab('palaces')}
              className={`font-cinzel text-[11px] lg:text-xs tracking-widest font-bold transition-all duration-300 cursor-pointer relative py-1.5 ${
                isHeroTransparent 
                  ? (currentTab === 'palaces' ? 'text-white font-black' : 'text-white/70 hover:text-white') 
                  : (currentTab === 'palaces' ? 'text-primary font-black' : 'text-on-surface-variant hover:text-primary')
              }`}
            >
              Palaces
              {currentTab === 'palaces' && (
                <span className={`absolute -bottom-1.5 left-0 right-0 h-[2px] transition-all duration-300 ${
                  isHeroTransparent ? 'bg-white' : 'bg-secondary'
                }`} />
              )}
            </button>

            <button 
              onClick={() => setCurrentTab('galleries')}
              className={`font-cinzel text-[11px] lg:text-xs tracking-widest font-bold transition-all duration-300 cursor-pointer relative py-1.5 ${
                isHeroTransparent 
                  ? (currentTab === 'galleries' ? 'text-white font-black' : 'text-white/70 hover:text-white') 
                  : (currentTab === 'galleries' ? 'text-primary font-black' : 'text-on-surface-variant hover:text-primary')
              }`}
            >
              Courts & Galleries
              {currentTab === 'galleries' && (
                <span className={`absolute -bottom-1.5 left-0 right-0 h-[2px] transition-all duration-300 ${
                  isHeroTransparent ? 'bg-white' : 'bg-secondary'
                }`} />
              )}
            </button>

            <button 
              onClick={() => setCurrentTab('planner')}
              className={`font-cinzel text-[11px] lg:text-xs tracking-widest font-bold transition-all duration-300 cursor-pointer relative py-1.5 ${
                isHeroTransparent 
                  ? (currentTab === 'planner' ? 'text-white font-black' : 'text-white/70 hover:text-white') 
                  : (currentTab === 'planner' ? 'text-primary font-black' : 'text-on-surface-variant hover:text-primary')
              }`}
            >
              Palace Planner
              {currentTab === 'planner' && (
                <span className={`absolute -bottom-1.5 left-0 right-0 h-[2px] transition-all duration-300 ${
                  isHeroTransparent ? 'bg-white' : 'bg-secondary'
                }`} />
              )}
            </button>

            <button 
              onClick={() => setCurrentTab('concierge')}
              className={`font-cinzel text-[11px] lg:text-xs tracking-widest font-bold transition-all duration-300 cursor-pointer relative py-1.5 ${
                isHeroTransparent 
                  ? (currentTab === 'concierge' ? 'text-white font-black' : 'text-white/70 hover:text-white') 
                  : (currentTab === 'concierge' ? 'text-primary font-black' : 'text-on-surface-variant hover:text-primary')
              }`}
            >
              Chronicles & Concierge
              {currentTab === 'concierge' && (
                <span className={`absolute -bottom-1.5 left-0 right-0 h-[2px] transition-all duration-300 ${
                  isHeroTransparent ? 'bg-white' : 'bg-secondary'
                }`} />
              )}
            </button>

            <button 
              id="book-now-header-btn"
              onClick={() => { setCurrentTab('planner'); }}
              className={`font-cinzel text-[11px] lg:text-xs font-bold tracking-widest uppercase px-6 py-2.5 ml-2 hover:opacity-95 transition-all duration-300 cursor-pointer shadow-sm ${
                isHeroTransparent 
                  ? 'bg-white text-primary hover:bg-transparent hover:text-white hover:ring-1 hover:ring-white/50' 
                  : 'bg-primary text-on-primary'
              }`}
            >
              Book Now
            </button>
          </div>

          {/* Mobile Hamburguer Toggle Wrapper - Right Aligned (Mobile) */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className={`p-2 focus:outline-none transition-colors duration-300 ${
                isHeroTransparent ? 'text-white hover:text-secondary-fixed-dim' : 'text-primary hover:text-secondary'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Fullscreen Nav Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/40 shadow-xl flex flex-col p-6 space-y-4 animate-fade-in z-50">
            <button 
              onClick={() => { setCurrentTab('palaces'); setMobileMenuOpen(false); }}
              className={`text-left font-cinzel text-sm tracking-widest py-2 border-b border-outline-variant/10 ${currentTab === 'palaces' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
            >
              Palaces
            </button>
            <button 
              onClick={() => { setCurrentTab('galleries'); setMobileMenuOpen(false); }}
              className={`text-left font-cinzel text-sm tracking-widest py-2 border-b border-outline-variant/10 ${currentTab === 'galleries' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
            >
              Courts & Galleries
            </button>
            <button 
              onClick={() => { setCurrentTab('planner'); setMobileMenuOpen(false); }}
              className={`text-left font-cinzel text-sm tracking-widest py-2 border-b border-outline-variant/10 ${currentTab === 'planner' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
            >
              Palace Planner
            </button>
            <button 
              onClick={() => { setCurrentTab('concierge'); setMobileMenuOpen(false); }}
              className={`text-left font-cinzel text-sm tracking-widest py-2 border-b border-outline-variant/10 ${currentTab === 'concierge' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
            >
              Chronicles & Concierge
            </button>
            <button 
              onClick={() => { setCurrentTab('planner'); setMobileMenuOpen(false); }}
              className="w-full text-center bg-primary text-on-primary font-cinzel text-xs py-3 uppercase tracking-widest font-bold"
            >
              Book Now
            </button>
          </div>
        )}
      </nav>

      {/* Main Tab content wrapper */}
      <main className="flex-grow">
        
        {/* VIEW 1: PALACES & MAIN LANDING PORTAL */}
        {currentTab === 'palaces' && (
          <div>
            
            {/* Cinematic Hero Segment with Full-Screen Height and Elegant Image Contrast */}
            <section 
              className="relative h-screen min-h-[600px] flex flex-col items-center justify-center bg-[#1c120c] bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url(${HERO_BG_IMAGE})` }}
            >
              {/* Premium cinematic vignettes to guarantee text legibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/30 pointer-events-none" />
              
              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-5">
                <span className="font-cinzel text-xs md:text-sm text-white/95 tracking-[0.25em] uppercase font-bold block animate-fade-in">
                  Est. 1874 · Udaipur, Rajasthan
                </span>
                <h1 className="font-serif text-5xl md:text-7xl text-white italic tracking-tight font-bold drop-shadow-sm leading-tight transition-all">
                  Where Heritage Meets Forever
                </h1>
                <p className="font-cinzel text-xs md:text-sm text-white/95 tracking-[0.2em] max-w-2xl mx-auto">
                  A PRINCELY DESTINATION FOR UNFORGETTABLE UNIONS
                </p>
                <div className="pt-6">
                  <button 
                    onClick={() => { setCurrentTab('planner'); }}
                    className="bg-transparent rose-gold-border font-cinzel text-[11px] font-bold tracking-widest text-white px-8 py-4 hover:bg-white/10 active:scale-95 transition-all text-label-caps uppercase cursor-pointer animate-fade-in"
                  >
                    Explore The Estate
                  </button>
                </div>
              </div>

              {/* Scroll anchor indicators */}
              <div className="absolute bottom-8 flex flex-col items-center space-y-1.5 opacity-80 animate-pulse text-white pointer-events-none z-10">
                <span className="font-cinzel text-[10px] tracking-widest uppercase">Scroll to Discover</span>
                <div className="w-[1px] h-10 bg-white/65" />
              </div>
            </section>

            {/* About / A Legacy of Grandeur */}
            <section className="py-24 md:py-32 px-6 md:px-20 max-w-[1440px] mx-auto">
              <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
                
                {/* Images column left */}
                <div className="relative group">
                  <div className="absolute inset-0 border border-secondary translate-x-4 translate-y-4 transition-transform group-hover:translate-x-3 group-hover:translate-y-3 duration-300" />
                  <img 
                    src={ABOUT_IMAGE} 
                    alt="Estate Interior" 
                    className="relative z-10 w-full h-[550px] object-cover shadow-2xl transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Text explanation column right */}
                <div className="space-y-8 pl-0 lg:pl-10">
                  <span className="text-secondary font-cinzel text-xs font-bold tracking-widest uppercase block">The Mewar Chronicle</span>
                  <h2 className="font-serif text-4xl md:text-5xl text-primary leading-tight font-semibold">
                    A Dynasty of Grandeur
                  </h2>
                  <p className="font-sans text-gray-700 text-lg leading-relaxed mix-blend-multiply">
                    Erected in 1874 on the pristine shores of Udaipur, Heritage Estates serves as a living chronicle of Mewari sovereignty. Originally design-commissioned as a private fortress retreat, every hand-carved sandstone jharokha, scalloped marble archway, and intricate ceiling stucco tells tales of spectacular royal alliances and multi-generational celebrations.
                  </p>
                  <p className="font-sans text-gray-600 text-md leading-relaxed">
                    Today, this heritage sanctuary seamlessly preserves authentic 19th-century Rajput architectural majesty alongside modern five-star hospitality—combining ancient culinary manuscripts, regal court welcomes, and absolute estate exclusivity.
                  </p>

                  {/* Staggered entry numerical statistics */}
                  <div className="grid grid-cols-2 gap-8 border-t border-outline-variant/40 pt-8 mt-10">
                    <div>
                      <div className="font-serif text-4xl font-bold text-secondary mb-1">
                        {yearsCount}+
                      </div>
                      <div className="font-cinzel text-[11px] tracking-wider text-on-surface-variant font-bold uppercase">
                        Years of Celebration
                      </div>
                    </div>
                    <div>
                      <div className="font-serif text-4xl font-bold text-secondary mb-1">
                        {weddingsCount}+
                      </div>
                      <div className="font-cinzel text-[11px] tracking-wider text-on-surface-variant font-bold uppercase">
                        Grand Alliances Sealed
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Imperial Ceremonials & Customs Section */}
            <section className="bg-surface-container py-24 md:py-32 px-6 md:px-20 relative overflow-hidden">
              <div className="max-w-[1440px] mx-auto space-y-16">
                
                {/* Headers */}
                <div className="text-center space-y-3">
                  <h2 className="font-serif text-3xl md:text-5xl text-primary font-bold">
                    Imperial Ceremonials
                  </h2>
                  <p className="font-cinzel text-xs md:text-sm text-secondary tracking-widest font-bold uppercase">
                    Bespoke Customs of the Mewar Dynasty
                  </p>
                  <div className="w-16 h-[1px] bg-secondary mx-auto mt-4" />
                </div>

                {/* 3 columns showcasing core packages/elements */}
                <div className="grid md:grid-cols-3 gap-8">
                  
                  {/* Experience 1 */}
                  <div className="bg-surface-container-lowest p-8 md:p-10 text-center transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 relative group border border-outline-variant/20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-full bg-[#fdf5f1] text-[#B8823A] flex items-center justify-center mx-auto mb-8">
                      <Award className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl text-on-background font-bold mb-4">The Mewar Procession</h3>
                    <p className="font-sans text-on-surface-variant text-sm leading-relaxed">
                      Enter the fortress gates greeted by a traditional military parade with towering horses, dynamic Rajasthani brass ensembles, and ceremonial personal guards leading your party.
                    </p>
                  </div>

                  {/* Experience 2 */}
                  <div className="bg-surface-container-lowest p-8 md:p-10 text-center transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 relative group border border-outline-variant/20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-full bg-[#fdf5f1] text-[#B8823A] flex items-center justify-center mx-auto mb-8">
                      <Gem className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl text-on-background font-bold mb-4">Culinary Archives</h3>
                    <p className="font-sans text-on-surface-variant text-sm leading-relaxed">
                      Indulge in a magnificent feast curated by hereditary chefs, recreating 19th-century family court recipes and slow-cooked charcoal delicacies.
                    </p>
                  </div>

                  {/* Experience 3 */}
                  <div className="bg-surface-container-lowest p-8 md:p-10 text-center transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2 relative group border border-outline-variant/20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-full bg-[#fdf5f1] text-[#B8823A] flex items-center justify-center mx-auto mb-8">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-2xl text-on-background font-bold mb-4">Baradari Recitals</h3>
                    <p className="font-sans text-on-surface-variant text-sm leading-relaxed">
                      Immerse your guests in sunset rāgas, classical sitar, and theatrical Ghoomar dance circles unfolding around candle-illumined white marble fountains.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* Echoes of Eternity: Testimonial & Review slider carousel */}
            <section className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto overflow-hidden">
              <div className="max-w-4xl mx-auto space-y-12 text-center">
                <div className="space-y-4">
                  <h2 className="font-serif text-3xl md:text-4xl text-primary font-semibold">
                    Echoes of Eternity
                  </h2>
                  <div className="w-16 h-[1px] bg-secondary mx-auto" />
                </div>

                {/* Quote block with organic touch swipe gestures for mobile patroons */}
                <div 
                  id="testimonial-touch-card"
                  className="min-h-[220px] flex flex-col justify-center items-center px-4 cursor-grab active:cursor-grabbing select-none"
                  onTouchStart={(e) => {
                    setTestimonialTouchStartX(e.targetTouches[0].clientX);
                    setTestimonialTouchEndX(e.targetTouches[0].clientX);
                  }}
                  onTouchMove={(e) => {
                    setTestimonialTouchEndX(e.targetTouches[0].clientX);
                  }}
                  onTouchEnd={() => {
                    if (testimonialTouchStartX === null || testimonialTouchEndX === null) return;
                    const diff = testimonialTouchStartX - testimonialTouchEndX;
                    if (diff > 50) {
                      // next
                      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
                    } else if (diff < -50) {
                      // prev
                      setActiveTestimonial((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
                    }
                    setTestimonialTouchStartX(null);
                    setTestimonialTouchEndX(null);
                  }}
                >
                  
                  {/* Stars counter */}
                  <div className="flex justify-center space-x-1 text-secondary mb-6">
                    {[...Array(TESTIMONIALS[activeTestimonial].stars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="font-serif text-xl md:text-2xl text-on-surface-variant italic leading-relaxed mb-6">
                    {TESTIMONIALS[activeTestimonial].quote}
                  </p>

                  {/* Testimonial Author */}
                  <span className="font-cinzel text-xs tracking-[0.2em] text-primary font-bold block uppercase">
                    {TESTIMONIALS[activeTestimonial].author}
                  </span>

                  <span className="font-cinzel text-[8px] text-secondary/50 tracking-[0.16em] uppercase mt-4 block md:hidden">
                    ← Swipe left or right to explore →
                  </span>
                </div>

                {/* Slider Navigation Dots */}
                <div className="flex justify-center space-x-3 pt-6">
                  {TESTIMONIALS.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveTestimonial(i)}
                      className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                        activeTestimonial === i ? 'w-8 bg-primary' : 'w-2 bg-outline-variant/80'
                      }`}
                      aria-label={`Go to testimonial index ${i + 1}`}
                    />
                  ))}
                </div>

              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: SIGNATURE VENUES & CURATED ART GALLERIES */}
        {currentTab === 'galleries' && (
          <div className="py-24 min-h-screen">
            
            {/* Header */}
            <section className="px-6 md:px-20 max-w-[1440px] mx-auto mt-12 text-center space-y-4">
              <h1 className="font-serif text-4xl md:text-6xl text-primary italic font-semibold">
                Ceremonial Courts &amp; Galleries
              </h1>
              <p className="font-sans text-gray-600 text-lg max-w-2xl mx-auto">
                Explore the legendary architectural chambers and archival lounges of Udaipur&#39;s royal history. Choose a magnificent theater for your historic union.
              </p>
              <div className="w-24 h-[1px] bg-secondary mx-auto pt-2" />
            </section>

            {/* Venues grid */}
            <section className="py-16 px-6 md:px-20 max-w-[1440px] mx-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold">The Ceremonial Courts</h2>
                <div className="h-px bg-outline-variant flex-grow ml-8 max-w-xs relative hidden md:block">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#B8823A]" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {VENUES.map((venue) => (
                  <div key={venue.id} className="bg-surface-container-lowest plinth-shadow group relative flex flex-col justify-between">
                    
                    {/* Image display */}
                    <div className="h-[280px] w-full relative overflow-hidden bg-surface-dim">
                      <img 
                        src={venue.image} 
                        alt={venue.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Availability Tag */}
                      <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 border border-[#B8823A] font-cinzel text-[11px] font-bold text-primary flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${venue.status === 'Available' ? 'bg-green-600' : 'bg-rose-600'}`}></span> 
                        {venue.status}
                      </div>
                    </div>

                    {/* Meta info & Action */}
                    <div className="p-6 md:p-8 border border-t-0 border-outline-variant/30 flex flex-col justify-between flex-grow min-h-[220px]">
                      <div>
                        {/* Tags */}
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <span className="px-2 py-0.5 border border-[#B8823A] font-cinzel text-[9px] text-secondary font-semibold">
                            {venue.type === 'INDOOR' ? 'ROYAL INDOOR COURT' : venue.type === 'OUTDOOR' ? 'LAKESIDE STEPWELL' : 'TERRACED GARDEN'}
                          </span>
                          <span className="px-2 py-0.5 border border-[#B8823A] font-cinzel text-[9px] text-secondary font-semibold">CAPACITY: {venue.capacity}</span>
                        </div>
                        <h3 className="font-serif text-2xl text-primary font-bold mb-2">{venue.name}</h3>
                        <p className="font-sans text-on-surface-variant text-xs leading-relaxed line-clamp-3 mb-6">
                          {venue.description}
                        </p>
                      </div>

                      {/* View Details hooks planner tool directly with selection setting */}
                      <button 
                        onClick={() => {
                          const targetPkgNum = venue.id === 'venue-1' ? 1 : venue.id === 'venue-2' ? 0 : 2;
                          setSelectedPackage(PACKAGES[targetPkgNum]);
                          setCurrentTab('planner');
                        }}
                        className="text-left font-cinzel text-xs tracking-wider text-secondary hover:text-primary transition-all flex items-center gap-2 w-max font-bold cursor-pointer"
                      >
                        Book This Venue <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </section>

            {/* Ornate Divider banner with diamond symbol */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-8">
              <div className="h-px bg-outline-variant w-full relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-[#fff8f5] text-secondary flex items-center">
                  <span className="material-symbols-outlined text-[18px]">diamond</span>
                </div>
              </div>
            </div>

            {/* Archival Gallery Masonry Grid Section */}
            <section className="py-8 px-6 md:px-20 max-w-[1440px] mx-auto space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 dark:border-outline-variant/20">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-primary">Archival Collections</h2>
                  <p className="font-sans text-gray-500 text-sm max-w-lg mt-1">
                    Visions of Rajput architectural splendor, fine table configurations, and pristine sandstone carvings captured on the estate grounds.
                  </p>
                </div>

                {/* Categories Filter tab list */}
                <div className="flex flex-wrap gap-4 md:gap-6 font-cinzel text-xs font-bold text-on-surface-variant">
                  {(['ALL', 'INDOOR', 'GARDEN', 'STAGE'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setGalleryFilter(filter)}
                      className={`pb-1 cursor-pointer transition-all ${
                        galleryFilter === filter 
                          ? 'border-b-2 border-secondary text-primary font-bold' 
                          : 'opacity-70 hover:opacity-100 hover:text-primary'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mansory gallery catalog */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((item, index) => (
                  <div 
                    key={item.id}
                    onClick={() => setLightboxIndex(index)} 
                    className="relative group cursor-pointer overflow-hidden border border-outline-variant/20 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-surface-dim h-[350px]"
                  >
                    <img 
                      src={item.image} 
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover search indicator overlay */}
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center space-y-2">
                      <span className="material-symbols-outlined text-4xl font-light">zoom_in</span>
                      <p className="font-serif text-base italic">{item.alt}</p>
                      <span className="font-cinzel text-[10px] tracking-widest uppercase opacity-75">{item.category} VIEW</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Custom Lightbox Component when active with horizontal finger swipe gestures on mobile */}
            {lightboxIndex !== null && (
              <div 
                className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 transition-all duration-300 select-none"
                onClick={() => setLightboxIndex(null)}
                onTouchStart={(e) => {
                  setTouchStartX(e.targetTouches[0].clientX);
                  setTouchEndX(e.targetTouches[0].clientX);
                }}
                onTouchMove={(e) => {
                  setTouchEndX(e.targetTouches[0].clientX);
                }}
                onTouchEnd={() => {
                  if (touchStartX === null || touchEndX === null) return;
                  const diff = touchStartX - touchEndX;
                  if (diff > 50) {
                    // next item
                    const nextIdx = lightboxIndex === filteredGallery.length - 1 ? 0 : lightboxIndex + 1;
                    setLightboxIndex(nextIdx);
                  } else if (diff < -50) {
                    // previous item
                    const prevIdx = lightboxIndex === 0 ? filteredGallery.length - 1 : lightboxIndex - 1;
                    setLightboxIndex(prevIdx);
                  }
                  setTouchStartX(null);
                  setTouchEndX(null);
                }}
              >
                {/* Close Button overlay */}
                <button 
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-6 right-6 text-white hover:text-secondary-fixed-dim transition-all cursor-pointer p-2 z-[60]"
                  aria-label="Close image lightbox"
                >
                  <X className="w-8 h-8" />
                </button>

                {/* Left Trailing arrow navigation */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const prevIdx = lightboxIndex === 0 ? filteredGallery.length - 1 : lightboxIndex - 1;
                    setLightboxIndex(prevIdx);
                  }}
                  className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-all cursor-pointer p-4 z-[60]"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>

                {/* Middle Image frame layout */}
                <div 
                  className="max-w-[1024px] max-h-[750px] relative flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={filteredGallery[lightboxIndex].image} 
                    alt={filteredGallery[lightboxIndex].alt} 
                    className="max-w-full max-h-[70vh] object-contain shadow-2xl rose-gold-border p-1 bg-surface-dim"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Caption below */}
                  <div className="text-center text-white mt-6 space-y-2">
                    <p className="font-serif text-xl italic font-medium leading-relaxed">
                      {filteredGallery[lightboxIndex].alt}
                    </p>
                    <span className="font-cinzel text-xs text-secondary-fixed-dim tracking-[0.15em] uppercase font-bold block">
                      {filteredGallery[lightboxIndex].category} · Heritage Estates Photo Portal
                    </span>
                  </div>
                </div>

                {/* Right Trailing arrow navigation */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextIdx = lightboxIndex === filteredGallery.length - 1 ? 0 : lightboxIndex + 1;
                    setLightboxIndex(nextIdx);
                  }}
                  className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-all cursor-pointer p-4 z-[60]"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* VIEW 3: EXPERIENCE PLANNER & ROYAL CALENDAR */}
        {currentTab === 'planner' && (
          <div className="py-24 min-h-screen">
            
            {/* Header */}
            <section className="px-6 md:px-20 max-w-[1440px] mx-auto mt-12 text-center space-y-4">
              <h1 className="font-serif text-4xl md:text-6xl text-primary font-semibold">
                Plan Your Royal Affair
              </h1>
              <p className="font-sans text-gray-600 text-lg max-w-3xl mx-auto">
                Select your preferred dates to begin crafting a bespoke, majestic celebration at Udaipur&#39;s premier heritage property. Daily schedules are carefully curated to guarantee absolute, master-level privacy.
              </p>
              <div className="w-24 h-[1px] bg-secondary mx-auto mt-2" />
            </section>

            {/* Sub-tab Selection */}
            <div className="flex justify-center gap-4 mt-8 mb-12 max-w-lg mx-auto px-4">
              <button 
                onClick={() => setPlannerSubTab('calendar')}
                className={`flex-1 text-center font-cinzel text-[10px] md:text-xs font-bold tracking-widest py-3.5 px-4 border transition-all cursor-pointer select-none rounded shadow-sm ${
                  plannerSubTab === 'calendar'
                    ? 'bg-primary text-[#fff] border-[#4d0216] font-black'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-secondary hover:text-primary'
                }`}
              >
                🏰 Imperial Calendar & Budget
              </button>
              <button 
                onClick={() => setPlannerSubTab('ai')}
                className={`flex-1 text-center font-cinzel text-[10px] md:text-xs font-bold tracking-widest py-3.5 px-4 border transition-all cursor-pointer flex items-center justify-center gap-2 select-none rounded shadow-sm ${
                  plannerSubTab === 'ai'
                    ? 'bg-primary text-[#fff] border-[#4d0216] font-black'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-secondary hover:text-primary'
                }`}
              >
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" /> Royal AI Scriptorium
              </button>
            </div>

            {plannerSubTab === 'calendar' ? (
              <>
                {/* Main Interactive Planner Interface */}
                <section className="py-12 px-6 md:px-20 max-w-[1440px] mx-auto">
                  
                  {/* Grid split for Calendar vs Booking calculation detail panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
                    
                    {/* 1. Left/Main Trailing Calendar Box */}
                    <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 plinth-shadow p-6 md:p-10 space-y-6">
                      
                      {/* Traversal Controls Header */}
                      <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
                        <button 
                          onClick={handleMonthPrev}
                          className="text-secondary hover:text-primary transition-colors p-2 cursor-pointer focus:outline-none"
                          aria-label="Previous Month"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        
                        <h2 className="font-serif text-2xl md:text-3xl text-primary font-extrabold tracking-tight">
                          {monthNames[calendarMonth]} {calendarYear === 2424 ? '2024' : calendarYear}
                        </h2>
                        
                        <button 
                          onClick={handleMonthNext}
                          className="text-secondary hover:text-primary transition-all p-2 cursor-pointer focus:outline-none"
                          aria-label="Next Month"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Calendar Matrix Layout Day Names */}
                      <div className="grid grid-cols-7 text-center gap-1 font-cinzel text-[11px] font-bold text-on-surface-variant uppercase tracking-wider py-2">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                      </div>

                      {/* Calendar Matrix Layout Cells dynamically generated */}
                      <div className="grid grid-cols-7 gap-2">
                        {/* Fill empty buffer cells first based on the first day index */}
                        {[...Array(getFirstDayOfMonth(calendarYear, calendarMonth))].map((_, i) => (
                          <div key={`empty-${i}`} className="aspect-square opacity-0 pointer-events-none" />
                        ))}

                        {/* Rendering Days in Month */}
                        {[...Array(getDaysInMonth(calendarYear, calendarMonth))].map((_, i) => {
                          const dayNumber = i + 1;
                          const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                          
                          // Check blockage status in initial prefilled catalog
                          const record = INITIAL_BOOKINGS[dateString];
                          const isBooked = record?.status === 'booked';
                          const isPartial = record?.status === 'partial';
                          const isSelected = selectedDate === dateString;

                          return (
                            <div
                              key={`day-${dayNumber}`}
                              onClick={() => {
                                if (!isBooked) {
                                  setSelectedDate(dateString);
                                  // Adjust selector values depending on available timings
                                  if (isPartial && record.morningBooked) {
                                    setSelectedTimeSlot('evening');
                                  } else if (isPartial && record.eveningBooked) {
                                    setSelectedTimeSlot('morning');
                                  } else {
                                    setSelectedTimeSlot('evening');
                                  }
                                }
                              }}
                              className={`cal-day relative group border flex flex-col justify-between p-1 md:p-1.5 min-h-[46px] md:min-h-[56px] transition-all outline-none select-none rounded-[3px] ${
                                isBooked 
                                  ? 'bg-outline-variant/10 cursor-not-allowed border-outline-variant/20 opacity-40 line-through' 
                                  : isSelected
                                    ? 'bg-primary border-secondary text-on-primary ring-1 ring-secondary z-10'
                                    : 'bg-surface-container-lowest border-outline-variant/20 hover:border-secondary hover:shadow-sm'
                              }`}
                            >
                              {/* Inner day index */}
                              <span className={`text-sm tracking-tighter block font-bold ${
                                isSelected ? 'text-on-primary' : 'text-on-background'
                              }`}>
                                {dayNumber}
                              </span>

                              {/* Decorative indicators matching LOGIC.md */}
                              <div className="flex justify-center items-center mt-auto">
                                {isBooked ? (
                                  <div className="w-1.5 h-1.5 rounded-full bg-rose-600" title="Fully Booked" />
                                ) : isPartial ? (
                                  <div className="w-3 h-1.5 rounded-t-full bg-amber-500" title="Half Booked (One Slot Available)" />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-600" title="Available" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Legend representation matching LOGIC.md */}
                      <div className="flex flex-wrap gap-6 items-center justify-center pt-6 border-t border-outline-variant/30 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                          <span className="font-cinzel text-[10px] tracking-widest text-on-surface-variant uppercase">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-2 rounded-t-full bg-amber-500" />
                          <span className="font-cinzel text-[10px] tracking-widest text-on-surface-variant uppercase font-bold">Partially Booked</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 bg-rose-600 opacity-50" />
                          <span className="font-cinzel text-[10px] tracking-widest text-on-surface-variant uppercase line-through">Fully Booked</span>
                        </div>
                      </div>

                    </div>

                    {/* 2. Right Booking Sidebar detailing parameters & automatic calculations */}
                    <div id="booking-panel" className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/30 plinth-shadow flex flex-col justify-between w-full h-full min-h-[500px]">
                      
                      {/* Top Header */}
                      <div className="p-6 md:p-8 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-block border border-[#B8823A] px-2.5 py-1 mb-2 font-cinzel text-[10px] font-bold text-secondary uppercase tracking-widest bg-amber-50/50">
                              Selected Schedule
                            </span>
                            <h3 className="font-serif text-2xl md:text-3xl text-primary font-bold">
                              {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              }) : 'Select a date'}
                            </h3>
                          </div>
                          <Gem className="w-5 h-5 text-secondary" />
                        </div>

                        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                          Please customize your bespoke setup options below. Available slots, estimated capacity, and custom tiered frameworks are combined to calculate a live estimated budget overview.
                        </p>

                        {/* Tier selector */}
                        <div className="space-y-2 mt-4">
                          <label className="block font-cinzel text-[10px] font-bold tracking-widest text-[#B8823A] uppercase">
                            Palace Experience Tier
                          </label>
                          <select 
                            value={selectedPackage.id}
                            onChange={(e) => {
                              const p = PACKAGES.find(pkg => pkg.id === e.target.value);
                              if (p) setSelectedPackage(p);
                            }}
                            className="w-full bg-surface-container/30 border border-outline-variant/40 px-3 py-2 text-sm font-serif font-bold text-primary focus:outline-none focus:ring-1 focus:ring-secondary rounded-none"
                          >
                            {PACKAGES.map((pkg) => (
                              <option key={pkg.id} value={pkg.id}>
                                {pkg.name} ({pkg.priceDisplay})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Timing Buttons morning/evening slider representation */}
                        <div className="space-y-3">
                          <label className="block font-cinzel text-[10px] tracking-widest text-on-surface uppercase font-bold">Event Timing Slot</label>
                          
                          {/* Check if timing slot is restricted by the date status */}
                          {(() => {
                            const rec = INITIAL_BOOKINGS[selectedDate];
                            const isMorningRestricted = rec?.status === 'partial' && rec.morningBooked;
                            const isEveningRestricted = rec?.status === 'partial' && rec.eveningBooked;

                            return (
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  disabled={isMorningRestricted}
                                  onClick={() => setSelectedTimeSlot('morning')}
                                  className={`py-3 px-1 text-center font-serif text-xs font-bold uppercase tracking-wider border cursor-pointer select-none transition-all ${
                                    isMorningRestricted
                                      ? 'bg-outline-variant/10 text-outline border-outline-variant/20 line-through opacity-30 cursor-not-allowed'
                                      : selectedTimeSlot === 'morning'
                                        ? 'bg-primary text-on-primary border-primary font-bold'
                                        : 'bg-surface-container-lowest text-primary border-outline hover:bg-surface-container/20'
                                  }`}
                                >
                                  🌅 Morning / Day
                                </button>
                                <button
                                  disabled={isEveningRestricted}
                                  onClick={() => setSelectedTimeSlot('evening')}
                                  className={`py-3 px-1 text-center font-serif text-xs font-bold uppercase tracking-wider border cursor-pointer select-none transition-all ${
                                    isEveningRestricted
                                      ? 'bg-outline-variant/10 text-outline border-outline-variant/20 line-through opacity-30 cursor-not-allowed'
                                      : selectedTimeSlot === 'evening'
                                        ? 'bg-primary text-[#fff] border-[#4d0216] font-bold'
                                        : 'bg-surface-container-lowest text-[#4d0216] border-outline hover:bg-surface-container/20'
                                  }`}
                                >
                                  🌙 Evening / Gala
                                </button>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Guest counter and Event input details panel layout */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <label className="block font-cinzel text-[10px] tracking-widest text-on-surface-variant uppercase font-bold">Estimated Guests</label>
                            <input 
                              type="number"
                              value={estimatedGuests} 
                              onChange={(e) => setEstimatedGuests(Math.max(1, parseInt(e.target.value) || 0))}
                              className="w-full bg-transparent border-b-2 border-outline focus:border-secondary focus:ring-0 p-1 font-serif text-base text-primary font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block font-cinzel text-[10px] tracking-widest text-on-surface-variant uppercase font-bold">Event Category</label>
                            <input 
                              type="text" 
                              value={eventType}
                              onChange={(e) => setEventType(e.target.value)}
                              className="w-full bg-transparent border-b-2 border-outline focus:border-secondary focus:ring-0 p-1 font-serif text-base text-primary font-bold"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Sticky Footer for calculation overview details */}
                      <div className="p-6 md:p-8 bg-surface-container border-t border-outline-variant/30 flex flex-col justify-end space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-cinzel text-[10px] tracking-widest text-on-surface-variant uppercase font-bold">Estimated Live Budget</span>
                          <span className="font-serif text-2xl font-bold text-primary">
                            {formatCurrency(computePrice())}
                          </span>
                        </div>

                        <button 
                          onClick={handleRequestProposal}
                          className="w-full bg-primary text-on-primary font-cinzel text-xs font-bold tracking-widest py-4 uppercase hover:opacity-95 transition-all text-center select-none block cursor-pointer"
                        >
                          Request Royal Proposal
                        </button>
                      </div>

                    </div>

                  </div>
                </section>

                {/* Pricing tiered list representation cards underneath the bento layout */}
                <section className="py-16 px-6 md:px-20 max-w-[1440px] mx-auto space-y-12">
                  <h2 className="text-center font-serif text-3xl md:text-4xl text-primary font-bold">Palace Sovereignties &amp; Estate Tiers</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-6">
                    {PACKAGES.map((pkg) => (
                      <div 
                        key={pkg.id} 
                        className={`bg-surface-container-lowest plinth-shadow p-8 flex flex-col justify-between border-t-4 transition-all duration-300 relative ${
                          pkg.featured 
                            ? 'border-[#B8823A] md:scale-105 z-10 shadow-lg' 
                            : 'border-outline-variant h-[95%] align-middle self-center'
                        }`}
                      >
                        {/* Featured label tag */}
                        {pkg.featured && (
                          <div className="absolute top-0 right-8 -translate-y-1/2 bg-secondary text-on-secondary px-3 py-1 font-cinzel text-[10px] uppercase tracking-widest font-bold">
                            Most Requested
                          </div>
                        )}

                        <div className="space-y-6">
                          <div>
                            <h3 className="font-serif text-2xl font-bold text-on-surface leading-tight">{pkg.name}</h3>
                            <p className="font-sans text-xs text-on-surface-variant mt-2">{pkg.tagline}</p>
                          </div>

                          {/* Display pricing rate tags */}
                          <div className="py-2 border-y border-outline-variant/30">
                            <span className="font-serif text-3xl font-extrabold text-primary">{pkg.priceDisplay}</span>
                            <span className="font-sans text-xs text-on-surface-variant ml-2">base booking</span>
                          </div>

                          {/* Bullet inclusions */}
                          <ul className="space-y-3 font-sans text-xs text-on-surface">
                            {pkg.inclusions.map((inc, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <span className="text-[#B8823A] material-symbols-outlined text-[14px]">done</span>
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-8">
                          <button 
                            onClick={() => {
                              setSelectedPackage(pkg);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className={`w-full font-cinzel text-[10px] font-bold py-3.5 uppercase tracking-widest transition-colors cursor-pointer ${
                              pkg.featured 
                                ? 'bg-primary text-on-primary hover:opacity-95' 
                                : 'bg-transparent text-secondary border border-secondary hover:bg-[#83550e]/5'
                            }`}
                          >
                            Select Tier
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                </section>
              </>
            ) : (
              <div className="px-6 md:px-20 max-w-[1440px] mx-auto space-y-12">
                {/* Intro Card */}
                <div id="ai-planner-intro" className="bg-surface-container-lowest border border-[#B8823A]/20 p-8 text-center space-y-4 max-w-4xl mx-auto rounded-lg">
                  <span className="font-cinzel text-xs text-[#B8823A] font-bold tracking-widest block uppercase">
                    ✨ Sovereign Co-Creation Protocol
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-primary font-semibold">
                    Consult the Court Scribes
                  </h2>
                  <p className="font-sans text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
                    Collaborate with the Heritage Estates Royal AI Scriptorium (powered by Gemini) to craft a customized 19th-century Rajasthani wedding theme. Choose a majestic pre-researched preset below or enter your vision details to receive custom sensory profiles, Mewari dining menus, and ceremonially synchronized timelines.
                  </p>
                </div>

                {/* Preset Themes Row */}
                <div className="space-y-4">
                  <h3 className="font-cinzel text-xs font-bold tracking-widest text-[#B8823A] text-center uppercase">
                    Explore Royal Presets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Preset 1 */}
                    <button
                      onClick={() => {
                        setAiThemeInput("The Maharaja's Sabre Guard Feast");
                        setAiGuestsInput(450);
                        setAiTraditionsInput("Sabre guard escort, midnight torchlights, live Ghoomar warrior dancers, ancestral battle drum rolls");
                        setAiAdditionalInput("Prefers traditional wood-fired barbecued Mewari delicacies.");
                      }}
                      className="bg-[#FAF7F2] border border-[#B8823A]/20 p-6 text-left space-y-3 cursor-pointer hover:border-secondary hover:shadow-md transition-all group rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-lg font-bold text-primary group-hover:text-secondary transition-colors">👑 Maharaja Dynasty</span>
                        <Gem className="w-5 h-5 text-secondary" />
                      </div>
                      <p className="font-sans text-xs text-gray-600 leading-relaxed">
                        A massive, high-ceremony affair showcasing Rajput fortress defense standards, military bands, and rich crimson silk canopies.
                      </p>
                      <div className="pt-2 flex items-center justify-between font-cinzel text-[10px] tracking-widest font-black text-secondary">
                        <span>450 Guests</span>
                        <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Apply Preset <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </button>

                    {/* Preset 2 */}
                    <button
                      onClick={() => {
                        setAiThemeInput("The Rajkumari Saffron & Jasmine Sangeet");
                        setAiGuestsInput(150);
                        setAiTraditionsInput("Fresh marigold and jasmine arches, traditional swing court, slow classical sitar, organic clay tumbler hospitality");
                        setAiAdditionalInput("Vegetarian dining, floral-forward visual arrangements, and rose petal showers.");
                      }}
                      className="bg-[#FAF7F2] border border-[#B8823A]/20 p-6 text-left space-y-3 cursor-pointer hover:border-secondary hover:shadow-md transition-all group rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-lg font-bold text-primary group-hover:text-secondary transition-colors">🌸 Jasmine Sangeet</span>
                        <Sparkles className="w-5 h-5 text-secondary" />
                      </div>
                      <p className="font-sans text-xs text-gray-600 leading-relaxed">
                        An intimate, sensorially vibrant celebration focusing on Udaipur's natural floral yields, classical strings, and refreshing heritage drinks.
                      </p>
                      <div className="pt-2 flex items-center justify-between font-cinzel text-[10px] tracking-widest font-black text-secondary">
                        <span>150 Guests</span>
                        <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Apply Preset <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </button>

                    {/* Preset 3 */}
                    <button
                      onClick={() => {
                        setAiThemeInput("The Moonlight Sufi stepwell Jugalbandi");
                        setAiGuestsInput(250);
                        setAiTraditionsInput("Qawwali performances on water-floating stages, slow ghee lanterns, warm incense scents of sandalwood and cedarwood");
                        setAiAdditionalInput("Sunset lake shore gathering, evening candle-glow reflections.");
                      }}
                      className="bg-[#FAF7F2] border border-[#B8823A]/20 p-6 text-left space-y-3 cursor-pointer hover:border-secondary hover:shadow-md transition-all group rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-lg font-bold text-primary group-hover:text-secondary transition-colors">🌅 Moonlight Sufi</span>
                        <Volume2 className="w-5 h-5 text-secondary" />
                      </div>
                      <p className="font-sans text-xs text-gray-600 leading-relaxed">
                        A deeply spiritual and artistic musical evening centered around candlelight stepwell pools, warm scents, and poetry recitations.
                      </p>
                      <div className="pt-2 flex items-center justify-between font-cinzel text-[10px] tracking-widest font-black text-secondary">
                        <span>250 Guests</span>
                        <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Apply Preset <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Scriptorium Custom Form (The Amber Parchment Card) */}
                <div className="bg-[#FAF7F2] border border-outline-variant p-8 md:p-12 max-w-4xl mx-auto plinth-shadow relative space-y-8 rounded-lg">
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-secondary text-on-secondary px-3 py-1 font-cinzel text-[10px] uppercase tracking-widest font-bold">
                    Scriptorium Quill
                  </div>

                  <h3 className="font-serif text-2xl text-primary font-semibold border-b border-outline-variant/30 pb-4 flex items-center gap-2">
                    🖋️ Bespoke Custom Plan
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left fields */}
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="block font-cinzel text-[10px] tracking-widest text-[#B8823A] font-bold uppercase">
                          Dream Title / Theme Idea
                        </label>
                        <input
                          type="text"
                          value={aiThemeInput}
                          onChange={(e) => setAiThemeInput(e.target.value)}
                          placeholder="e.g. Amber sunset desert oasis"
                          className="w-full bg-white border border-outline-variant px-3 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-secondary rounded-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block font-cinzel text-[10px] tracking-widest text-[#B8823A] font-bold uppercase flex justify-between">
                          <span>Guest Count Volume</span>
                          <span className="font-mono text-xs">{aiGuestsInput} guests</span>
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="1200"
                          step="25"
                          value={aiGuestsInput}
                          onChange={(e) => setAiGuestsInput(parseInt(e.target.value))}
                          className="w-full accent-secondary"
                        />
                        <div className="flex justify-between font-mono text-[9px] text-gray-500">
                          <span>50 (Intimate)</span>
                          <span>600 (Grand)</span>
                          <span>1200+ (Imperial)</span>
                        </div>
                      </div>
                    </div>

                    {/* Right fields */}
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="block font-cinzel text-[10px] tracking-widest text-[#B8823A] font-bold uppercase">
                          Ceremonially Resonant Traditions
                        </label>
                        <textarea
                          rows={3}
                          value={aiTraditionsInput}
                          onChange={(e) => setAiTraditionsInput(e.target.value)}
                          placeholder="e.g., horse processions, Ghoomar dancers, traditional oil lamp alignments"
                          className="w-full bg-white border border-outline-variant px-3 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-secondary rounded-none resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block font-cinzel text-[10px] tracking-widest text-[#B8823A] font-bold uppercase">
                          Special Scribe Instructions
                        </label>
                        <textarea
                          rows={2}
                          value={aiAdditionalInput}
                          onChange={(e) => setAiAdditionalInput(e.target.value)}
                          placeholder="e.g., focus on spicy Mewar dishes, keep sunset timing strictly Lakeside"
                          className="w-full bg-white border border-outline-variant px-3 py-2.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-secondary rounded-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions Submit */}
                  <div className="pt-4 flex flex-col items-center space-y-4">
                    <button
                      disabled={aiLoading}
                      onClick={() => handleGenerateAIPlan(aiThemeInput, aiGuestsInput, aiTraditionsInput, aiAdditionalInput)}
                      className="bg-primary text-[#fff] font-cinzel text-xs font-bold tracking-widest py-4 px-10 uppercase hover:opacity-95 transition-all select-none block cursor-pointer border border-[#4d0216] disabled:opacity-50"
                    >
                      {aiLoading ? "✨ Reading Parchments..." : "✨ Convene the Royal Scribes"}
                    </button>

                    {/* Highly Interactive Scribe Loader with rotating messages and glowing effect */}
                    {aiLoading && (
                      <div className="w-full max-w-md p-6 bg-[#FAF7F2] border border-[#B8823A]/30 text-center space-y-3 animate-pulse rounded-md">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
                        </div>
                        <p className="font-serif italic text-sm text-primary animate-fade-in font-medium">
                          &ldquo;{aiLoadingStep}&rdquo;
                        </p>
                        <p className="font-sans text-[10px] text-gray-500 uppercase tracking-widest">
                          Consulting Udaipur Historical Registries &amp; archives
                        </p>
                      </div>
                    )}

                    {aiError && (
                      <div className="w-full max-w-lg p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm text-center rounded-md font-sans">
                        ⚠️ {aiError}
                      </div>
                    )}
                  </div>
                </div>

                {/* Scribe Outcome Output (The Double-Gilded Gilded Frame) */}
                {aiResult && (
                  <div id="ai-outcome-pinnacle" className="border-4 border-double border-[#B8823A] bg-[#FAF7F2] p-8 md:p-12 max-w-4xl mx-auto shadow-2xl relative space-y-10 rounded-lg animate-fade-in">
                    
                    {/* Top Imperial Crest Header */}
                    <div className="text-center space-y-3 border-b-2 border-dashed border-[#B8823A]/30 pb-8">
                      <div className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center mx-auto text-secondary font-serif text-lg font-bold">
                        MEWAR
                      </div>
                      <span className="font-cinzel text-[10px] tracking-[0.2em] text-secondary font-black uppercase block">
                        Heritage Historical Scribe Curation
                      </span>
                      <h4 className="font-serif text-3xl md:text-4xl text-primary font-bold italic tracking-tight leading-tight">
                        &ldquo;{aiResult.themeTitle}&rdquo;
                      </h4>
                      <p className="font-cinzel text-[11px] tracking-widest text-[#B8823A] font-bold">
                        PROVISIONALLY ALIGNED TO: <strong className="font-black text-primary">{aiResult.alignedPackage}</strong>
                      </p>
                    </div>

                    {/* Vibe Overview */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <h5 className="font-cinzel text-[10px] tracking-[0.15em] text-[#B8823A] font-bold uppercase">
                        Atmospheric Vibe &amp; Sensory Curation
                      </h5>
                      <p className="font-serif text-md text-gray-800 leading-relaxed italic">
                        &ldquo;{aiResult.palaceVibeOverview}&rdquo;
                      </p>
                    </div>

                    {/* Double Split Grid: Dining Curation vs Milestones Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                      
                      {/* Left: Royal Dining Menu scroll representation */}
                      <div className="space-y-6 bg-white p-6 border border-[#B8823A]/10 shadow-sm relative rounded-md">
                        <div className="absolute top-3 right-4 font-mono text-[9px] text-[#B8823A] uppercase tracking-widest">
                          Mewar Curation
                        </div>
                        <h5 className="font-serif text-xl font-bold text-primary border-b border-outline-variant pb-2 flex items-center gap-2 font-semibold">
                          🍽️ Sovereign Cuisine Curation
                        </h5>
                        <div className="space-y-6">
                          {aiResult.culinaryCuration?.map((dish: any, idx: number) => (
                            <div key={idx} className="space-y-1">
                              <span className="font-cinzel text-[9px] tracking-widest font-bold text-secondary uppercase block">
                                {dish.course}
                              </span>
                              <h6 className="font-serif text-base font-bold text-primary">
                                {dish.name}
                              </h6>
                              <p className="font-sans text-xs text-gray-600 leading-relaxed">
                                {dish.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Milestone Timeline */}
                      <div className="space-y-6 bg-white p-6 border border-[#B8823A]/10 shadow-sm relative rounded-md">
                        <div className="absolute top-3 right-4 font-mono text-[9px] text-[#B8823A] uppercase tracking-widest">
                          Itinerary Map
                        </div>
                        <h5 className="font-serif text-xl font-bold text-primary border-b border-outline-variant pb-2 flex items-center gap-2 font-semibold">
                          ⏳ Ceremonial Milestones
                        </h5>
                        <div className="space-y-6 relative border-l-2 border-[#B8823A]/20 pl-4 ml-2">
                          {aiResult.ceremonialItinerary?.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-1 relative">
                              {/* Dot marker */}
                              <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-secondary" />
                              <span className="font-mono text-[10px] text-secondary font-bold font-semibold">
                                {item.time}
                              </span>
                              <h6 className="font-serif text-sm font-bold text-primary">
                                {item.title}
                              </h6>
                              <span className="font-cinzel text-[9px] font-bold text-[#B8823A] tracking-wider block">
                                📍 {item.venueSpot}
                              </span>
                              <p className="font-sans text-xs text-gray-600 leading-relaxed">
                                {item.highlights}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Master Adviser Corner */}
                    <div className="bg-[#FAF7F2] p-6 border-l-4 border-secondary space-y-2 rounded-r-md">
                      <span className="font-cinzel text-[9px] tracking-widest font-black text-secondary uppercase block">
                        Scribe Advisory Scroll
                      </span>
                      <p className="font-sans text-xs text-primary leading-relaxed">
                        {aiResult.royalConsultAdvice}
                      </p>
                    </div>

                    {/* Dynamic Action Seal -> Lock into Scheduler */}
                    <div className="pt-6 border-t border-[#B8823A]/20 text-center space-y-4">
                      <p className="font-sans text-xs text-gray-500">
                        Sealing this plan will lock in your guest count and pre-fill your inquiry form details.
                      </p>
                      
                      <button
                        onClick={() => {
                          // Map aligned Package
                          const pkgLower = (aiResult.alignedPackage || "").toLowerCase();
                          if (pkgLower.includes("rajkumari") || pkgLower.includes("set")) {
                            setSelectedPackage(PACKAGES[0]);
                          } else if (pkgLower.includes("grandeur") || pkgLower.includes("maharana") || pkgLower.includes("takeover")) {
                            setSelectedPackage(PACKAGES[2]);
                          } else {
                            setSelectedPackage(PACKAGES[1]);
                          }

                          // Lock in details
                          setEstimatedGuests(aiGuestsInput);
                          setEventType(aiThemeInput || "Royal Alliance Reception");
                          
                          // Pre-fill details
                          setAdditionalDetails(`AI Crafted Theme Proposal: "${aiResult.themeTitle}". Pre-filled package recommendation: ${aiResult.alignedPackage}. Vibe atmosphere description: ${aiResult.palaceVibeOverview}. Traditions configured: ${aiTraditionsInput}`);
                          
                          // Back to calendar subtab
                          setPlannerSubTab('calendar');
                          
                          // Pop indicator toast
                          const notification = document.createElement('div');
                          notification.className = 'fixed bottom-10 right-10 bg-primary border-2 border-secondary text-white font-cinzel text-xs py-3 px-6 z-50 shadow-2xl animate-fade-in uppercase tracking-wider font-bold border-double border-4';
                          notification.innerText = '🌸 Scriptorium Plan Locked into Budget Desk!';
                          document.body.appendChild(notification);
                          setTimeout(() => notification.remove(), 4000);

                          window.scrollTo({ top: 350, behavior: 'smooth' });
                        }}
                        className="bg-secondary text-[#fff] font-cinzel text-xs font-bold tracking-widest py-4 px-12 uppercase hover:opacity-95 transition-all select-none cursor-pointer inline-flex items-center gap-2 shadow-lg"
                      >
                        🔮 Seal &amp; Lock Into Budget Desk
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* VIEW 4: CONTACT, CONCIERGETimings, ADDRESS COPY & RESERVATION BOOKINGS */}
        {currentTab === 'concierge' && (
          <div className="py-24 min-h-screen">
            
            {/* Header */}
            <section className="px-6 md:px-20 max-w-[1440px] mx-auto mt-12 text-center space-y-4">
              <h1 className="font-serif text-4xl md:text-6xl text-primary font-semibold">
                Contact Concierge
              </h1>
              
              <div className="flex justify-center items-center gap-4 py-2">
                <div className="h-px w-16 bg-[#B8823A]" />
                <span className="material-symbols-outlined text-[#B8823A] text-sm leading-none">diamond</span>
                <div className="h-px w-16 bg-[#B8823A]" />
              </div>

              <p className="font-sans text-gray-600 text-lg max-w-2xl mx-auto">
                Begin planning your majestic heritage celebration. Our dedicated personal palace concierge curators stand ready round-the-clock.
              </p>
            </section>

            {/* Concierge details, Schedule times highlighted & Form reservations Layout */}
            <section className="py-12 px-6 md:px-20 max-w-[1440px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left/trailing Column details info */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                  
                  {/* Estate Details */}
                  <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 plinth-shadow relative">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#B8823A] to-transparent opacity-80" />
                    <h2 className="font-serif text-2xl text-primary mb-6 font-bold">Estate Details</h2>
                    
                    <div className="space-y-6">
                      
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-cinzel text-[10px] tracking-widest text-on-surface font-bold uppercase mb-1">
                            The Royal Palace
                          </p>
                          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                            Lake Pichola Road, Udaipur, Rajasthan 3130001, India
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Phone className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-cinzel text-[10px] tracking-widest text-on-surface font-bold uppercase mb-1">
                            Direct Line
                          </p>
                          <p className="font-sans text-sm text-on-surface-variant font-bold">
                            +91 294 252 8000
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Mail className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-cinzel text-[10px] tracking-widest text-on-surface font-bold uppercase mb-1">
                            Royal Enquiries
                          </p>
                          <p className="font-sans text-sm text-on-surface-variant font-bold underline">
                            concierge@heritageestates.in
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Concierge Timings with Dynamic Today Highlight tag */}
                  <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 plinth-shadow">
                    <h2 className="font-serif text-2xl text-primary mb-6 font-bold">Concierge Timings</h2>
                    
                    <ul className="font-sans text-sm text-on-surface-variant space-y-4">
                      <li className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                        <span className={todayDayName === 'Monday' || todayDayName === 'Tuesday' || todayDayName === 'Wednesday' || todayDayName === 'Thursday' || todayDayName === 'Friday' ? 'font-bold text-primary': ''}>Monday - Friday</span>
                        <span>09:00 - 20:00</span>
                      </li>
                      <li className={`flex justify-between items-center py-2.5 px-3 rounded-sm ${
                        todayDayName === 'Saturday' ? 'bg-[#ffeadb] text-primary font-bold' : ''
                      }`} id="today-highlight">
                        <span className="flex items-center gap-1.5">
                          Saturday {todayDayName === 'Saturday' && <span className="bg-primary text-on-primary text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">TODAY</span>}
                        </span>
                        <span>10:00 - 18:00</span>
                      </li>
                      <li className={`flex justify-between items-center py-2.5 px-3 rounded-sm ${
                        todayDayName === 'Sunday' ? 'bg-[#ffeadb] text-primary font-bold' : ''
                      }`}>
                        <span className="flex items-center gap-1.5">
                          Sunday {todayDayName === 'Sunday' && <span className="bg-primary text-on-primary text-[8px] font-bold px-1.5 py-0.5 rounded uppercase font-bold">TODAY</span>}
                        </span>
                        <span className="font-serif italic font-bold text-xs text-secondary">By Appointment</span>
                      </li>
                    </ul>

                    {/* Socials IG FB X as rendered in screenshots layout with Cinzel font */}
                    <div className="mt-8 pt-6 border-t border-outline-variant/30 flex gap-4">
                      <a href="#" className="w-10 h-10 rounded-full border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all font-cinzel text-xs font-bold">
                        IG
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all font-cinzel text-xs font-bold">
                        FB
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all font-cinzel text-xs font-bold">
                        X
                      </a>
                    </div>
                  </div>

                  {/* Udaipur Illustrated Map graphic area */}
                  <div className="relative plinth-shadow border border-[#B8823A] bg-surface-container-lowest p-2">
                    <div className="w-full h-64 bg-surface-dim relative flex items-center justify-center overflow-hidden">
                      <img 
                        src={MAP_IMAGE} 
                        alt="Illustrated Map of Udaipur" 
                        className="w-full h-full object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Floating pin overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-2xl border-2 border-[#B8823A] animate-bounce">
                          <MapPin className="w-6 h-6 text-secondary fill-secondary" />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleCopyAddress}
                      className="w-full mt-2 py-3 border border-[#B8823A] text-on-surface font-cinzel text-[10px] tracking-widest font-bold uppercase hover:bg-surface-container/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-secondary" /> Address Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Palace Address
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Right Column: Appointment Reservation Form */}
                <div className="lg:col-span-7" id="appointment-booking-form">
                  <div className="bg-surface-container-lowest p-8 md:p-12 plinth-shadow border border-outline-variant/30 h-full relative">
                    
                    <h2 className="font-serif text-3xl font-bold text-primary mb-2">Request an Appointment</h2>
                    <p className="font-sans text-sm text-on-surface-variant mb-8 leading-relaxed">
                      Please submit the specifications regarding your prospective event. Our curators will evaluate current timelines and respond within 24 hours.
                    </p>

                    {/* Preloaded success flag notifications */}
                    {plannerPrefilled && !formSubmitted && (
                      <div className="mb-6 p-4 bg-amber-50 border border-[#B8823A]/30 text-xs text-primary font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#B8823A]" /> Layout preloaded with setup from your Experience Planner sidebar.
                      </div>
                    )}

                    {/* Overall Validation Error message bar */}
                    {formError && (
                      <div className="mb-6 p-3 bg-rose-50 border border-rose-600/30 text-xs text-rose-700 font-bold">
                        {formError}
                      </div>
                    )}

                    {/* Form Submission Success Segment overlay inside card */}
                    {formSubmitted ? (
                      <div className="py-16 text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                          <Check className="w-10 h-10" />
                        </div>
                        <h3 className="font-serif text-3xl font-bold text-[#4d0216]">Proposal Received</h3>
                        <p className="font-sans text-on-surface-variant text-md max-w-md mx-auto leading-relaxed">
                          Thank you, {brideName || 'Royal Patron'}. We have securely received your wedding reservation request regarding the scheduled date. A Palace Curator will contact your direct line within 24 hours to confirm.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="space-y-6 text-sm">
                        
                        {/* Bride & Groom names spacing block */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="block font-cinzel text-[10px] font-bold tracking-widest text-on-surface-variant uppercase" htmlFor="bride">
                              Bride/Partner Name *
                            </label>
                            <input 
                              id="bride"
                              type="text" 
                              required
                              value={brideName}
                              onChange={(e) => setBrideName(e.target.value)}
                              placeholder="e.g. Ananya"
                              className="w-full bg-transparent border-b border-outline focus:border-primary focus:outline-none p-2 font-serif text-base text-primary font-bold placeholder:text-outline-variant"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block font-cinzel text-[10px] font-bold tracking-widest text-on-surface-variant uppercase" htmlFor="groom">
                              Groom/Partner Name
                            </label>
                            <input 
                              id="groom"
                              type="text" 
                              value={groomName}
                              onChange={(e) => setGroomName(e.target.value)}
                              placeholder="e.g. Vikram"
                              className="w-full bg-transparent border-b border-outline focus:border-primary focus:outline-none p-2 font-serif text-base text-primary font-bold placeholder:text-outline-variant"
                            />
                          </div>
                        </div>

                        {/* Email & Phone numbers block */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="block font-cinzel text-[10px] font-bold tracking-widest text-on-surface-variant uppercase" htmlFor="email">
                              Email Address *
                            </label>
                            <input 
                              id="email"
                              type="email" 
                              required
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              placeholder="contact@example.com"
                              className="w-full bg-transparent border-b border-outline focus:border-primary focus:outline-none p-2 font-serif text-base text-primary font-bold placeholder:text-outline-variant"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block font-cinzel text-[10px] font-bold tracking-widest text-on-surface-variant uppercase" htmlFor="phone">
                              Phone Number *
                            </label>
                            <input 
                              id="phone"
                              type="tel" 
                              required
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="+91 XXXXX XXXXX"
                              className="w-full bg-transparent border-b border-outline focus:border-primary focus:outline-none p-2 font-serif text-base text-primary font-bold placeholder:text-outline-variant"
                            />
                          </div>
                        </div>

                        {/* Schedule & Timing parameters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="block font-cinzel text-[10px] font-bold tracking-widest text-on-surface-variant uppercase" htmlFor="enq-date">
                              Preferred Date
                            </label>
                            <input 
                              id="enq-date"
                              type="date" 
                              value={enquiryDate}
                              onChange={(e) => setEnquiryDate(e.target.value)}
                              className="w-full bg-transparent border-b border-outline focus:border-primary focus:outline-none p-2 font-serif text-base text-primary font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block font-cinzel text-[10px] font-bold tracking-widest text-[#554243] uppercase" htmlFor="enq-slot">
                              Time Slot
                            </label>
                            <select 
                              id="enq-slot"
                              value={enquirySlot}
                              onChange={(e) => setEnquirySlot(e.target.value)}
                              className="w-full bg-transparent border-b border-outline focus:border-primary focus:outline-none p-2 font-serif text-base text-[#4d0216] font-bold rounded-none"
                            >
                              <option value="morning">Morning (10:00 - 13:00)</option>
                              <option value="afternoon">Afternoon (14:00 - 17:00)</option>
                              <option value="evening">Evening (18:00 - 20:00)</option>
                            </select>
                          </div>
                        </div>

                        {/* Venue of Interest Checkboxes */}
                        <div className="space-y-3">
                          <label className="block font-cinzel text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                            Venue Space of Interest
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {[
                              { label: 'SABHA NIWAS', val: 'durbar' },
                              { label: 'ZENANA KUND', val: 'poolside' },
                              { label: 'BADI MAHAL BAGH', val: 'gardens' },
                              { label: 'UNDECIDED', val: 'undecided' }
                            ].map((space) => {
                              const included = venueInterests.includes(space.val);
                              return (
                                <button
                                  key={space.val}
                                  type="button"
                                  onClick={() => {
                                    if (space.val === 'undecided') {
                                      setVenueInterests(['undecided']);
                                    } else {
                                      let updated = venueInterests.filter(v => v !== 'undecided');
                                      if (included) {
                                        updated = updated.filter(v => v !== space.val);
                                        if (updated.length === 0) updated = ['undecided'];
                                      } else {
                                        updated.push(space.val);
                                      }
                                      setVenueInterests(updated);
                                    }
                                  }}
                                  className={`px-4 py-2 border border-[#B8823A] font-cinzel text-[10px] font-bold uppercase transition-colors tracking-widest cursor-pointer select-none ${
                                    included 
                                      ? 'bg-primary text-on-primary border-[#4d0216]' 
                                      : 'bg-transparent text-on-surface hover:bg-[#83550e]/5'
                                  }`}
                                >
                                  {space.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Message field */}
                        <div className="space-y-1 pt-2">
                          <label className="block font-cinzel text-[10px] font-bold tracking-widest text-on-surface-variant uppercase" htmlFor="details">
                            Additional Details
                          </label>
                          <textarea 
                            id="details"
                            rows={3}
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.target.value)}
                            placeholder="Approximate guest count, unique catering request, sound or lighting requirements..."
                            className="w-full bg-transparent border-b border-outline focus:border-primary focus:outline-none p-2 font-serif text-base text-primary font-bold placeholder:text-outline-variant resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                          <button 
                            type="submit"
                            className="w-full bg-primary text-[#fff] font-cinzel text-xs font-bold tracking-widest py-4 uppercase hover:opacity-95 text-center cursor-pointer shadow-lg outline-none"
                          >
                            Submit Royal Enquiry
                          </button>
                        </div>

                      </form>
                    )}

                  </div>
                </div>

              </div>
            </section>

          </div>
        )}

      </main>

      {/* Footer component matching visual rules */}
      <footer className="bg-inverse-surface text-surface py-20 border-t-2 border-secondary select-none">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 font-sans">
          
          {/* Logo Name & Slogan */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="font-serif text-3xl font-extrabold text-secondary-container text-secondary">
              Heritage Estates
            </h4>
            <p className="text-sm text-surface-variant opacity-80 leading-relaxed max-w-xs">
              Curating timeless visual memories, royal architecture and ultimate weddings in the heart of Udaipur, Rajasthan.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h5 className="font-cinzel text-xs tracking-widest font-bold text-white uppercase">Explore</h5>
            <div className="flex flex-col space-y-3 text-sm text-surface-variant opacity-80">
              <button onClick={() => { setCurrentTab('palaces'); }} className="text-left hover:text-white cursor-pointer hover:opacity-100">The Durbar Hall</button>
              <button onClick={() => { setCurrentTab('palaces'); }} className="text-left hover:text-white cursor-pointer hover:opacity-100">Poolside Pavilions</button>
              <button onClick={() => { setCurrentTab('palaces'); }} className="text-left hover:text-white cursor-pointer hover:opacity-100">Royal Suites</button>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h5 className="font-cinzel text-xs tracking-widest font-bold text-white uppercase">Connect</h5>
            <div className="flex flex-col space-y-3 text-sm text-surface-variant opacity-80">
              <button onClick={() => { setCurrentTab('concierge'); }} className="text-left hover:text-white cursor-pointer hover:opacity-100">Contact Concierge</button>
              <button onClick={() => { setCurrentTab('planner'); }} className="text-left hover:text-white cursor-pointer hover:opacity-100">Book an Appointment</button>
            </div>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h5 className="font-cinzel text-xs tracking-widest font-bold text-white uppercase">Legal</h5>
            <div className="flex flex-col space-y-3 text-sm text-surface-variant opacity-80">
              <a href="#" className="hover:text-white hover:opacity-100">Privacy Policy</a>
              <a href="#" className="hover:text-white hover:opacity-100">Terms of Service</a>
            </div>
          </div>

        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-20 mt-16 pt-8 border-t border-outline/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wide text-surface-variant opacity-60">
          <p>© 2026 Heritage Estates Rajasthan. All Rights Reserved.</p>
          <div className="font-cinzel font-bold">UDAIPUR · RAJASTHAN</div>
        </div>
      </footer>

      {/* Interactive Bottom Navigation Bar for Mobile Devices */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-surface/90 backdrop-blur-xl border border-outline-variant/30 rounded-full py-2 px-3 flex justify-around items-center shadow-lg">
        <button 
          onClick={() => setCurrentTab('palaces')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-300 ${
            currentTab === 'palaces' ? 'text-primary scale-105 font-bold' : 'text-on-surface-variant/60'
          }`}
          aria-label="Palaces section"
        >
          <Compass className={`w-[20px] h-[20px] transition-transform ${currentTab === 'palaces' ? 'text-primary' : 'text-on-surface-variant/65'}`} />
          <span className="text-[10px] font-cinzel tracking-wider mt-0.5 uppercase">Palaces</span>
        </button>

        <button 
          onClick={() => setCurrentTab('galleries')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-300 ${
            currentTab === 'galleries' ? 'text-primary scale-105 font-bold' : 'text-on-surface-variant/60'
          }`}
          aria-label="Galleries section"
        >
          <Gem className={`w-[20px] h-[20px] transition-transform ${currentTab === 'galleries' ? 'text-primary' : 'text-on-surface-variant/65'}`} />
          <span className="text-[10px] font-cinzel tracking-wider mt-0.5 uppercase">Courts</span>
        </button>

        <button 
          onClick={() => setCurrentTab('planner')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-300 ${
            currentTab === 'planner' ? 'text-primary scale-105 font-bold' : 'text-on-surface-variant/60'
          }`}
          aria-label="Planner section"
        >
          <CalendarIcon className={`w-[20px] h-[20px] transition-transform ${currentTab === 'planner' ? 'text-primary' : 'text-on-surface-variant/65'}`} />
          <span className="text-[10px] font-cinzel tracking-wider mt-0.5 uppercase">Planner</span>
        </button>

        <button 
          onClick={() => setCurrentTab('concierge')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-300 ${
            currentTab === 'concierge' ? 'text-primary scale-105 font-bold' : 'text-on-surface-variant/60'
          }`}
          aria-label="Concierge section"
        >
          <Phone className={`w-[20px] h-[20px] transition-transform ${currentTab === 'concierge' ? 'text-primary' : 'text-on-surface-variant/65'}`} />
          <span className="text-[10px] font-cinzel tracking-wider mt-0.5 uppercase">Concierge</span>
        </button>
      </div>

      {/* Tactile Floating Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-40 bg-primary text-white p-3 rounded-full shadow-xl border border-secondary transition-all hover:bg-secondary cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Scroll back to top"
        >
          <ArrowRight className="w-5 h-5 -rotate-90 text-on-primary" />
        </button>
      )}

    </div>
  );
}
