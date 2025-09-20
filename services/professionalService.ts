import { Professional } from '../types';

const generateAvailability = (): { [date: string]: string[] } => {
    const availability: { [date: string]: string[] } = {};
    const today = new Date();
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        // Randomly assign some time slots for each day
        availability[dateString] = times.filter(() => Math.random() > 0.5);
    }
    return availability;
};

const mockProfessionals: Professional[] = [
  {
    id: 'prof-1',
    name: 'Dr. Anjali Sharma',
    specialty: 'Cognitive Behavioral Therapy (CBT)',
    location: 'Mumbai, India',
    photoUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Anjali%20Sharma',
    description: 'Specializes in helping young adults with anxiety and stress management using evidence-based CBT techniques.',
    verified: true,
    rating: 4.8,
    reviewCount: 32,
    sessionTypes: ['Video Call', 'Chat Session'],
    availability: generateAvailability(),
    reviews: [
        { id: 'r1-1', rating: 5, comment: 'Dr. Sharma is incredibly insightful and helped me develop practical coping strategies. Highly recommend!', date: '2024-07-15' },
        { id: 'r1-2', rating: 4, comment: 'A very good listener. The sessions were helpful, though sometimes scheduling was a bit tricky.', date: '2024-06-28' },
    ]
  },
  {
    id: 'prof-2',
    name: 'Rohan Kumar',
    specialty: 'Mindfulness & Stress Reduction',
    location: 'Delhi, India',
    photoUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Rohan%20Kumar',
    description: 'Certified mindfulness coach focusing on stress reduction and improving mental well-being for students and professionals.',
    verified: true,
    rating: 4.9,
    reviewCount: 45,
    sessionTypes: ['Video Call', 'In-person'],
    availability: generateAvailability(),
    reviews: [
        { id: 'r2-1', rating: 5, comment: 'Rohan\'s mindfulness techniques have been life-changing for my anxiety.', date: '2024-07-20' },
        { id: 'r2-2', rating: 5, comment: 'Patient, calm, and very effective. I feel much more centered after our sessions.', date: '2024-07-11' },
    ]
  },
  {
    id: 'prof-3',
    name: 'Dr. Meera Desai',
    specialty: 'Relationship Counseling',
    location: 'Bangalore, India',
    photoUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Meera%20Desai',
    description: 'Helps individuals and couples navigate relationship challenges, communication issues, and family dynamics.',
    verified: false,
    rating: 4.6,
    reviewCount: 18,
    sessionTypes: ['Video Call', 'Chat Session', 'In-person'],
    availability: generateAvailability(),
    reviews: [
       { id: 'r3-1', rating: 5, comment: 'Dr. Desai helped us improve our communication skills immensely.', date: '2024-07-05' },
       { id: 'r3-2', rating: 4, comment: 'Provided a safe space to discuss difficult topics. Very professional.', date: '2024-06-19' },
    ]
  },
   {
    id: 'prof-4',
    name: 'Sameer Gupta',
    specialty: 'Career Counseling',
    location: 'Pune, India',
    photoUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Sameer%20Gupta',
    description: 'Provides guidance on career choices, academic pathfinding, and coping with workplace stress.',
    verified: true,
    rating: 4.7,
    reviewCount: 25,
    sessionTypes: ['Video Call'],
    availability: generateAvailability(),
    reviews: [
        { id: 'r4-1', rating: 5, comment: 'Sameer gave me so much clarity on my career path. I feel much more confident now.', date: '2024-07-18' },
    ]
  },
  {
    id: 'prof-5',
    name: 'Dr. Priya Nair',
    specialty: 'Adolescent & Youth Psychology',
    location: 'Chennai, India',
    photoUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Priya%20Nair',
    description: 'Expert in addressing the unique psychological challenges faced by teenagers and young adults, including peer pressure and identity.',
    verified: true,
    rating: 4.9,
    reviewCount: 52,
    sessionTypes: ['Video Call', 'Chat Session'],
    availability: generateAvailability(),
    reviews: [
        { id: 'r5-1', rating: 5, comment: 'Dr. Nair is amazing with teenagers. She really connects with them.', date: '2024-07-21' },
        { id: 'r5-2', rating: 5, comment: 'A true professional who is dedicated to youth mental health.', date: '2024-07-10' },
    ]
  },
   {
    id: 'prof-6',
    name: 'Aisha Khan',
    specialty: 'Mindfulness & Stress Reduction',
    location: 'Hyderabad, India',
    photoUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Aisha%20Khan',
    description: 'Works with clients to develop coping strategies for anxiety through mindfulness and relaxation exercises.',
    verified: false,
    rating: 4.5,
    reviewCount: 15,
    sessionTypes: ['Video Call', 'In-person'],
    availability: generateAvailability(),
    reviews: [
         { id: 'r6-1', rating: 4, comment: 'Helpful sessions, but sometimes it felt a bit repetitive.', date: '2024-07-02' },
    ]
  },
];

const professionalService = {
  getProfessionals: async (): Promise<Professional[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProfessionals;
  },
  getRecommendedProfessionals: async (): Promise<Professional[]> => {
    // Simulate AI analysis and network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    // Mock logic: Recommend professionals for common issues like stress and anxiety
    const recommendedSpecialties = ['Mindfulness & Stress Reduction', 'Cognitive Behavioral Therapy (CBT)'];
    const recommendations = mockProfessionals.filter(p => recommendedSpecialties.includes(p.specialty));
    // Return a consistent subset
    return recommendations.slice(0, 2);
  },
};

export default professionalService;