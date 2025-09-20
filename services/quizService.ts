import { Quiz } from '../types';

const stressQuiz: Quiz = {
    id: 'stress-quiz-1',
    title: 'Stress Level Assessment',
    questions: [
        {
            id: 'q1',
            question: 'Over the last week, how often have you felt nervous or "on-edge"?',
            options: [
                { text: 'Not at all', score: 0 },
                { text: 'Several days', score: 1 },
                { text: 'More than half the days', score: 2 },
                { text: 'Nearly every day', score: 3 },
            ]
        },
        {
            id: 'q2',
            question: 'How often have you been unable to stop or control worrying?',
            options: [
                { text: 'Not at all', score: 0 },
                { text: 'Several days', score: 1 },
                { text: 'More than half the days', score: 2 },
                { text: 'Nearly every day', score: 3 },
            ]
        },
        {
            id: 'q3',
            question: 'How often have you had trouble relaxing?',
            options: [
                { text: 'Not at all', score: 0 },
                { text: 'Several days', score: 1 },
                { text: 'More than half the days', score: 2 },
                { text: 'Nearly every day', score: 3 },
            ]
        },
        {
            id: 'q4',
            question: 'How often have you felt so restless that it is hard to sit still?',
            options: [
                { text: 'Not at all', score: 0 },
                { text: 'Several days', score: 1 },
                { text: 'More than half the days', score: 2 },
                { text: 'Nearly every day', score: 3 },
            ]
        },
        {
            id: 'q5',
            question: 'How often have you felt easily annoyed or irritable?',
            options: [
                { text: 'Not at all', score: 0 },
                { text: 'Several days', score: 1 },
                { text: 'More than half the days', score: 2 },
                { text: 'Nearly every day', score: 3 },
            ]
        },
        {
            id: 'q6',
            question: 'How often have you had trouble with your sleep (falling asleep, staying asleep, or sleeping too much)?',
            options: [
                { text: 'Not at all', score: 0 },
                { text: 'Several days', score: 1 },
                { text: 'More than half the days', score: 2 },
                { text: 'Nearly every day', score: 3 },
            ]
        },
        {
            id: 'q7',
            question: 'How often have you felt down, depressed, or hopeless?',
            options: [
                { text: 'Not at all', score: 0 },
                { text: 'Several days', score: 1 },
                { text: 'More than half the days', score: 2 },
                { text: 'Nearly every day', score: 3 },
            ]
        }
    ]
};

const quizService = {
    getQuiz: (): Quiz => {
        return stressQuiz;
    },
    getResults: (score: number): { level: string, description: string, recommendedResourceIds: string[] } => {
        // Adjusted scoring thresholds for 7 questions (max score 21)
        if (score <= 6) { // Low
            return {
                level: 'Low',
                description: "It seems you're managing your stress well right now. These resources can help you maintain this balance and continue building resilience.",
                recommendedResourceIds: ['article-healthy-friendships', 'video-mindfulness-10min']
            };
        } else if (score <= 13) { // Moderate
            return {
                level: 'Moderate',
                description: "It looks like you're dealing with a noticeable level of stress. That's completely okay. Here are some targeted tools that can help you find calm and regain control.",
                recommendedResourceIds: ['box-breathing', 'video-understanding-anxiety', 'article-grounding-technique']
            };
        } else { // High
            return {
                level: 'High',
                description: "It appears you're under a high level of stress, and it's brave of you to acknowledge it. Please consider these immediate support resources. You are not alone.",
                recommendedResourceIds: ['hotline-vandrevala', 'box-breathing', 'website-tipp-skill']
            };
        }
    }
};

export default quizService;