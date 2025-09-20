import { ResourceCategory } from '../types';

const resourcesData: ResourceCategory[] = [
  {
    category: 'Immediate Help',
    description: 'If you are in a crisis or any other person may be in danger, please use these resources.',
    resources: [
      {
        id: 'hotline-nsl-india',
        title: 'National Suicide Prevention Lifeline (India)',
        description: 'Provides 24/7, free and confidential support for people in distress.',
        link: 'tel:91-9820466726',
        type: 'Hotline',
      },
      {
        id: 'hotline-vandrevala',
        title: 'Vandrevala Foundation',
        description: 'A 24x7 mental health helpline with trained counselors.',
        link: 'tel:91-9999666555',
        type: 'Hotline',
      },
    ],
  },
  {
    category: 'Multimedia Library',
    description: 'Guided exercises, videos, and visual guides to support your wellness journey.',
    resources: [
        {
            id: 'audio-meditation-calm',
            title: '5-Minute Guided Meditation for Calm',
            description: 'A short audio guide to help you find your center and reduce stress.',
            link: 'https://www.youtube.com/watch?v=inpok4MKVLM', // Placeholder link
            type: 'Audio',
            duration: '5 min'
        },
        {
            id: 'video-understanding-anxiety',
            title: 'Understanding Anxiety (Video)',
            description: 'An animated video explaining what anxiety is and how it affects you.',
            link: 'https://www.youtube.com/watch?v=R_va-Of_v_w', // Placeholder link
            type: 'Video',
            duration: '3:45',
            imageUrl: 'https://img.youtube.com/vi/R_va-Of_v_w/mqdefault.jpg'
        },
        {
            id: 'box-breathing',
            title: 'Box Breathing Technique',
            description: 'A simple visual guide to a powerful breathing exercise for immediate calm.',
            type: 'Infographic',
            imageUrl: `https://api.dicebear.com/8.x/shapes/svg?seed=BoxBreathing&backgroundType=gradientLinear&shapeColor=8B5CF6,10B981`
        },
        {
            id: 'audio-deep-sleep',
            title: 'Deep Sleep Guided Relaxation',
            description: 'An audio track designed to help you relax your body and mind for a restful sleep.',
            link: 'https://www.youtube.com/watch?v=1sgcz_N8-gI', // Placeholder
            type: 'Audio',
            duration: '15 min'
        },
        {
            id: 'video-mindfulness-10min',
            title: '10-Minute Mindfulness Meditation',
            description: 'A slightly longer session to practice mindfulness and awareness.',
            link: 'https://www.youtube.com/watch?v=O-6f5wQXSu8', // Placeholder
            type: 'Video',
            duration: '10:00',
            imageUrl: 'https://img.youtube.com/vi/O-6f5wQXSu8/mqdefault.jpg'
        },
        {
            id: 'pdf-sleep-hygiene',
            title: 'Sleep Hygiene Checklist (PDF)',
            description: 'Download and print this checklist to improve your sleep habits.',
            link: 'https://www.sleepfoundation.org/sites/default/files/2022-09/SF-Sleep-Hygiene-Checklist.pdf', // Placeholder link
            type: 'PDF'
        }
    ]
  },
  {
    category: 'Stress & Anxiety',
    description: 'Learn more about managing stress and anxiety in your daily life.',
    resources: [
      {
        id: 'article-grounding-technique',
        title: 'The 5-4-3-2-1 Grounding Technique',
        description: 'A simple but effective method to ground yourself during moments of high anxiety or panic.',
        link: 'https://www.urmc.rochester.edu/behavioral-health-partners/bhp-blog/april-2018/5-4-3-2-1-coping-technique-for-anxiety.aspx',
        type: 'Article'
      },
      {
        id: 'website-tipp-skill',
        title: 'The TIPP Skill for Emotional Crisis',
        description: 'A quick technique to manage overwhelming emotions using temperature, exercise, and breathing.',
        link: 'https://dbt.tools/distress_tolerance/tipp.php',
        type: 'Website',
      },
    ]
  },
  {
    category: 'Student Life',
    description: 'Resources tailored for the challenges and opportunities of student life.',
    resources: [
      {
        id: 'article-exam-stress',
        title: 'Managing Exam Stress',
        description: 'Tips and strategies to handle the pressure of exams and perform your best.',
        link: 'https://www.nhs.uk/mental-health/children-and-young-adults/help-for-teenagers-young-adults-and-students/coping-with-exam-stress/',
        type: 'Article'
      },
      {
        id: 'article-healthy-friendships',
        title: 'Building Healthy Friendships',
        description: 'An article on how to create and maintain supportive and healthy friendships in college.',
        link: 'https://www.jedfoundation.org/resource/how-to-build-healthy-relationships-in-college/',
        type: 'Article'
      },
    ]
  }
];

const resourceService = {
  getResources: async (): Promise<ResourceCategory[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return resourcesData;
  },
};

export default resourceService;