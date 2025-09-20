import React, { useState, useEffect, useMemo } from 'react';
import { Professional, User, Review, Resource } from '../types';
import professionalService from '../services/professionalService';
import resourceService from '../services/resourceService';


// --- Helper & Sub-Components ---

const EmergencyHelpSection: React.FC<{ helplines: Resource[] }> = ({ helplines }) => {
    if (helplines.length === 0) return null;
    return (
        <div className="p-4 bg-orange-100/80 dark:bg-orange-900/40 border-b border-white/20 dark:border-gray-700/50">
            <div className="max-w-4xl mx-auto text-center">
                <h3 className="font-bold text-orange-800 dark:text-orange-200"><i className="fas fa-exclamation-triangle mr-2"></i>In Crisis? Immediate Help is Available.</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">If you or someone you know is in distress, please reach out to these 24/7 helplines.</p>
                <div className="flex flex-wrap justify-center gap-4 mt-3">
                    {helplines.map(line => (
                        <a key={line.id} href={line.link} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold text-sm">
                            <i className="fas fa-phone-alt mr-2"></i>{line.title}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AIRecommendationsSection: React.FC<{ 
    professionals: Professional[]; 
    isLoading: boolean; 
    onBook: (prof: Professional) => void;
    onViewReviews: (prof: Professional) => void;
}> = ({ professionals, isLoading, onBook, onViewReviews }) => {
    return (
        <section className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Personalized Suggestions For You</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Based on common wellness goals, these professionals may be a good fit.</p>
            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white/20 dark:bg-gray-800/20 p-4 rounded-lg animate-pulse h-48 flex items-center justify-center">
                           <div className="w-10 h-10 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     {professionals.map(prof => (
                        <ProfessionalCard 
                            key={prof.id} 
                            professional={prof}
                            onBook={() => onBook(prof)}
                            onViewReviews={() => onViewReviews(prof)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

const PrivacyTrustSection: React.FC = () => (
    <div className="mt-6 pt-4 border-t border-white/20 dark:border-gray-700/50 text-center">
        <i className="fas fa-shield-alt text-green-500 text-2xl mb-2"></i>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Trust is Our Priority</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All professionals are verified. Your data is private & secure.</p>
    </div>
);


const StarRating: React.FC<{ rating: number, className?: string }> = ({ rating, className = '' }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className={`flex items-center text-yellow-400 ${className}`}>
            {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
            {halfStar && <i className="fas fa-star-half-alt"></i>}
            {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
        </div>
    );
};


const ReviewsModal: React.FC<{ professional: Professional; onClose: () => void; }> = ({ professional, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/50 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{professional.name}'s Reviews</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={professional.rating} />
                        <span className="font-bold text-gray-700 dark:text-gray-300">{professional.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">({professional.reviewCount} reviews)</span>
                    </div>
                </div>
                <button onClick={onClose} className="text-2xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {professional.reviews.length > 0 ? professional.reviews.map(review => (
                    <div key={review.id} className="p-3 bg-black/5 dark:bg-black/20 rounded-lg">
                        <div className="flex items-center mb-1">
                            <StarRating rating={review.rating} />
                            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">"{review.comment}"</p>
                    </div>
                )) : <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">No reviews yet.</p>}
            </div>
        </div>
    </div>
);


const BookingModal: React.FC<{ professional: Professional; onClose: () => void; }> = ({ professional, onClose }) => {
    type Step = 'date' | 'type' | 'payment' | 'confirmed';
    const [step, setStep] = useState<Step>('date');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const availableDates = Object.keys(professional.availability).filter(date => professional.availability[date].length > 0);

    const renderStep = () => {
        switch (step) {
            case 'date':
                return (
                    <div>
                        <h4 className="font-semibold mb-3 text-center">1. Select a Date & Time</h4>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {availableDates.map(date => (
                                <button key={date} onClick={() => { setSelectedDate(date); setSelectedTime(null); }} className={`p-2 rounded-lg text-sm text-center transition ${selectedDate === date ? 'bg-purple-600 text-white font-bold' : 'bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50'}`}>
                                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                                </button>
                            ))}
                        </div>
                        {selectedDate && (
                            <div className="grid grid-cols-4 gap-2">
                                {professional.availability[selectedDate].map(time => (
                                    <button key={time} onClick={() => setSelectedTime(time)} className={`p-2 rounded-lg text-sm transition ${selectedTime === time ? 'bg-purple-600 text-white font-bold' : 'bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50'}`}>
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end mt-6">
                            <button onClick={() => setStep('type')} disabled={!selectedDate || !selectedTime} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50">Next</button>
                        </div>
                    </div>
                );
            case 'type':
                 return (
                    <div>
                        <h4 className="font-semibold mb-3 text-center">2. Choose Session Type</h4>
                        <div className="space-y-3">
                            {professional.sessionTypes.map(type => (
                                <button key={type} onClick={() => setSelectedType(type)} className={`w-full p-3 rounded-lg border-2 transition ${selectedType === type ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-500' : 'bg-gray-50/50 dark:bg-gray-700/50 border-transparent hover:border-purple-300'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                         <div className="flex justify-between mt-6">
                             <button onClick={() => setStep('date')} className="px-4 py-2 text-gray-700 dark:text-gray-300">Back</button>
                            <button onClick={() => setStep('payment')} disabled={!selectedType} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50">Next</button>
                        </div>
                    </div>
                );
             case 'payment':
                const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                return (
                    <div>
                         <h4 className="font-semibold mb-3 text-center">3. Confirm & Pay</h4>
                         <div className="p-3 rounded-lg bg-black/5 dark:bg-black/20 text-sm space-y-1">
                            <p><strong>Professional:</strong> {professional.name}</p>
                            <p><strong>Date:</strong> {formattedDate} at {selectedTime}</p>
                            <p><strong>Type:</strong> {selectedType}</p>
                         </div>
                         <p className="text-xs text-center my-4 text-gray-500 dark:text-gray-400">This is a simulation. No real payment will be processed.</p>
                         <div className="flex justify-center gap-4">
                            <button className="p-2 bg-blue-500 text-white rounded-lg text-sm">Pay with Stripe</button>
                            <button className="p-2 bg-green-500 text-white rounded-lg text-sm">Pay with Google Pay</button>
                         </div>
                         <div className="flex justify-between mt-6">
                             <button onClick={() => setStep('type')} className="px-4 py-2 text-gray-700 dark:text-gray-300">Back</button>
                            <button onClick={() => setStep('confirmed')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Confirm Booking</button>
                        </div>
                    </div>
                );
             case 'confirmed':
                 return (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-500 text-3xl mb-4">
                            <i className="fas fa-check"></i>
                        </div>
                        <h4 className="font-semibold text-lg">Appointment Confirmed!</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Your appointment with {professional.name} is scheduled. You will receive a confirmation email shortly.</p>
                        <button onClick={onClose} className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Done</button>
                    </div>
                )
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Book with {professional.name}</h3>
                    <button onClick={onClose} className="text-2xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">&times;</button>
                </div>
                {renderStep()}
            </div>
        </div>
    )
}

const ProfessionalCard: React.FC<{ professional: Professional; onBook: () => void; onViewReviews: () => void; }> = ({ professional, onBook, onViewReviews }) => {
  return (
    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-lg shadow-sm border border-white/20 dark:border-gray-700/50 p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 transition-all duration-300 hover:shadow-lg hover:border-purple-400/50">
      <img src={professional.photoUrl} alt={professional.name} className="w-24 h-24 rounded-full flex-shrink-0 border-4 border-white/50 dark:border-gray-700/50" />
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{professional.name}</h3>
          {professional.verified && (
            <div className="flex items-center gap-1 text-blue-500" title="Verified Professional">
              <i className="fas fa-check-circle text-sm"></i>
              <span className="text-xs font-semibold">Verified</span>
            </div>
          )}
        </div>
        <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">{professional.specialty}</p>
        <button onClick={onViewReviews} className="flex items-center justify-center sm:justify-start gap-1 mb-3 group">
            <StarRating rating={professional.rating} />
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 group-hover:underline">({professional.reviewCount} reviews)</span>
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{professional.description}</p>
        <button
          onClick={onBook}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 text-sm font-semibold"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};


// --- Main Page Component ---

const ProfessionalsPage: React.FC<{ user: User }> = ({ user }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommended, setRecommended] = useState<Professional[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);
  const [helplines, setHelplines] = useState<Resource[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Modal State
  const [viewingReviewsFor, setViewingReviewsFor] = useState<Professional | null>(null);
  const [bookingWith, setBookingWith] = useState<Professional | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setIsLoadingRecs(true);
        try {
            const [profsData, recsData, resourcesData] = await Promise.all([
                professionalService.getProfessionals(),
                professionalService.getRecommendedProfessionals(),
                resourceService.getResources()
            ]);

            setProfessionals(profsData);
            setRecommended(recsData);
            
            const immediateHelp = resourcesData.find(cat => cat.category === 'Immediate Help');
            if (immediateHelp) {
                setHelplines(immediateHelp.resources.slice(0, 2)); // Take top 2 for the banner
            }
        } catch (err) {
            console.error("Failed to load professional data", err);
        } finally {
            setIsLoading(false);
            setIsLoadingRecs(false);
        }
    };
    fetchData();
  }, []);

  const specialties = useMemo(() => {
    const allSpecialties = professionals.map(p => p.specialty);
    return ['All', ...Array.from(new Set(allSpecialties))];
  }, [professionals]);
  
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const specialtyMatch = selectedSpecialty === 'All' || p.specialty === selectedSpecialty;
        const verifiedMatch = !showVerifiedOnly || p.verified;
        return nameMatch && specialtyMatch && verifiedMatch;
    });
  }, [professionals, searchTerm, selectedSpecialty, showVerifiedOnly]);

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
      {viewingReviewsFor && <ReviewsModal professional={viewingReviewsFor} onClose={() => setViewingReviewsFor(null)} />}
      {bookingWith && <BookingModal professional={bookingWith} onClose={() => setBookingWith(null)} />}
        
      <header className="p-4 border-b border-white/20 dark:border-gray-700/50 text-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Connect with Professionals</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Find trusted, verified experts for confidential support.</p>
      </header>

      <EmergencyHelpSection helplines={helplines} />
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <aside className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r border-white/20 dark:border-gray-700/50 space-y-4 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Filters</h2>
            
            <div>
                <label htmlFor="search-prof" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Search by Name</label>
                <input 
                    type="text"
                    id="search-prof"
                    placeholder="e.g., Dr. Anjali Sharma"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                />
            </div>
            
            <div>
                <label htmlFor="specialty-filter" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Specialty</label>
                <select 
                    id="specialty-filter"
                    value={selectedSpecialty}
                    onChange={e => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                >
                    {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                </select>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
                 <input 
                    type="checkbox"
                    id="verified-toggle"
                    checked={showVerifiedOnly}
                    onChange={e => setShowVerifiedOnly(e.target.checked)}
                    className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label htmlFor="verified-toggle" className="text-sm font-medium text-gray-600 dark:text-gray-400">Show Verified Only</label>
            </div>
            <PrivacyTrustSection />
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <AIRecommendationsSection professionals={recommended} isLoading={isLoadingRecs} onBook={setBookingWith} onViewReviews={setViewingReviewsFor} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pt-6 border-t border-white/20 dark:border-gray-700/50">All Professionals</h2>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
            ) : filteredProfessionals.length > 0 ? (
                 <div className="space-y-4">
                    {filteredProfessionals.map(prof => (
                        <ProfessionalCard 
                            key={prof.id} 
                            professional={prof}
                            onBook={() => setBookingWith(prof)}
                            onViewReviews={() => setViewingReviewsFor(prof)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                    <p className="font-semibold">No professionals found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalsPage;