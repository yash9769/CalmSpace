import { CommunityPost, CommunityComment, CommunityTopic, User, Author } from '../types';

const COMMUNITY_DATA_KEY = 'community_posts_data';

// --- Initial Mock Data ---
const initialPosts: CommunityPost[] = [
    {
        id: 'post-1',
        topic: 'Academic Stress',
        title: 'Overwhelmed with exam prep',
        content: "I have three major exams next week and I feel like I can't possibly study enough for all of them. The pressure is immense. How do you guys cope when you feel like this?",
        author: { id: 'mock_user_67890', displayName: 'Priya Singh', photoURL: 'https://api.dicebear.com/8.x/initials/svg?seed=Priya%20Singh' },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        supports: ['mock_user_12345'],
        comments: [
            {
                id: 'comment-1-1',
                postId: 'post-1',
                author: null, // Anonymous
                content: "I totally get this. The most important thing is to make a schedule and stick to it, but also schedule short breaks! Don't burn yourself out.",
                createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
                supports: ['mock_user_67890']
            },
            {
                id: 'comment-1-2',
                postId: 'post-1',
                author: { id: 'mock_user_abcde', displayName: 'Sam Chen', photoURL: 'https://api.dicebear.com/8.x/initials/svg?seed=Sam%20Chen' },
                content: "The Pomodoro Technique really helps me. 25 minutes of focused study, then a 5-minute break. It makes the task feel less daunting.",
                createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
                supports: ['mock_user_12345', 'mock_user_67890']
            }
        ]
    },
    {
        id: 'post-2',
        topic: 'Anxiety & Mental Health',
        title: 'Feeling anxious about the future',
        content: "Lately, I've been feeling a lot of anxiety about what comes after graduation. It feels like everyone else has a plan and I'm just lost. It's scary.",
        author: null, // Anonymous
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        supports: ['mock_user_12345', 'mock_user_67890', 'mock_user_abcde'],
        comments: []
    },
    {
        id: 'post-3',
        topic: 'Friendships & Relationships',
        title: 'Feeling lonely at college...',
        content: "I moved to a new city for college and I'm finding it really hard to make friends. I feel so isolated, especially on weekends. Any advice?",
        author: { id: 'mock_user_12345', displayName: 'Alex Doe', photoURL: 'https://api.dicebear.com/8.x/initials/svg?seed=Alex%20Doe' },
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        supports: ['mock_user_67890'],
        comments: [
            {
                id: 'comment-3-1',
                postId: 'post-3',
                author: null,
                content: "Have you tried joining any clubs or societies? It's a great way to meet people with similar interests. It's tough at first but worth it!",
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                supports: ['mock_user_12345']
            }
        ]
    },
    {
        id: 'post-4',
        topic: 'Daily Motivation',
        title: "What's one small win you had today?",
        content: "Let's share some positivity! It can be anything, big or small. For me, I finally finished a difficult assignment I was procrastinating on.",
        author: null,
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
        supports: ['mock_user_12345', 'mock_user_abcde'],
        comments: [
             {
                id: 'comment-4-1',
                postId: 'post-4',
                author: { id: 'mock_user_abcde', displayName: 'Sam Chen', photoURL: 'https://api.dicebear.com/8.x/initials/svg?seed=Sam%20Chen' },
                content: "I went for a run this morning even though I didn't feel like it. Feeling good now!",
                createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
                supports: []
            },
             {
                id: 'comment-4-2',
                postId: 'post-4',
                author: { id: 'mock_user_67890', displayName: 'Priya Singh', photoURL: 'https://api.dicebear.com/8.x/initials/svg?seed=Priya%20Singh' },
                content: "That's awesome! My win was calling my parents today. We had a really nice chat.",
                createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
                supports: ['mock_user_abcde']
            }
        ]
    },
    {
        id: 'post-5',
        topic: 'Academic Stress',
        title: 'I can\'t stop procrastinating',
        content: "I have a huge project due in two weeks and I just can't bring myself to start. I just scroll on my phone or watch videos instead. The guilt is eating me up. Why am I like this?",
        author: null,
        createdAt: new Date(Date.now() - 3600000 * 22).toISOString(), // 22 hours ago
        supports: ['mock_user_12345'],
        comments: []
    }
];


class CommunityService {
    private posts: CommunityPost[] = [];

    constructor() {
        this.loadPosts();
    }

    private loadPosts() {
        try {
            const storedData = localStorage.getItem(COMMUNITY_DATA_KEY);
            if (storedData) {
                this.posts = JSON.parse(storedData);
            } else {
                this.posts = initialPosts;
                this.savePosts();
            }
        } catch (error) {
            console.error("Failed to load community posts from localStorage", error);
            this.posts = initialPosts;
        }
    }

    private savePosts() {
        try {
            localStorage.setItem(COMMUNITY_DATA_KEY, JSON.stringify(this.posts));
        } catch (error) {
            console.error("Failed to save community posts to localStorage", error);
        }
    }

    async getPosts(topic: CommunityTopic): Promise<CommunityPost[]> {
        await new Promise(res => setTimeout(res, 300)); // Simulate network delay
        return this.posts
            .filter(p => p.topic === topic)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async getPost(postId: string): Promise<CommunityPost | undefined> {
        await new Promise(res => setTimeout(res, 200));
        return this.posts.find(p => p.id === postId);
    }

    async createPost(data: { title: string; content: string; topic: CommunityTopic; author: User; isAnonymous: boolean }): Promise<CommunityPost> {
        const author: Author | null = data.isAnonymous ? null : {
            id: data.author.id,
            displayName: data.author.displayName,
            photoURL: data.author.photoURL,
        };
        
        const newPost: CommunityPost = {
            id: `post-${Date.now()}`,
            title: data.title,
            content: data.content,
            topic: data.topic,
            author,
            createdAt: new Date().toISOString(),
            supports: [],
            comments: [],
        };
        
        this.posts.unshift(newPost);
        this.savePosts();
        
        await new Promise(res => setTimeout(res, 400));
        return newPost;
    }
    
    async createComment(data: { postId: string; content: string; author: User; isAnonymous: boolean }): Promise<CommunityComment> {
        const post = this.posts.find(p => p.id === data.postId);
        if (!post) throw new Error("Post not found");

        const author: Author | null = data.isAnonymous ? null : {
            id: data.author.id,
            displayName: data.author.displayName,
            photoURL: data.author.photoURL,
        };

        const newComment: CommunityComment = {
            id: `comment-${Date.now()}`,
            postId: data.postId,
            author,
            content: data.content,
            createdAt: new Date().toISOString(),
            supports: [],
        };

        post.comments.push(newComment);
        this.savePosts();
        
        await new Promise(res => setTimeout(res, 400));
        return newComment;
    }
    
    async toggleSupport(target: { type: 'post' | 'comment'; id: string; }, userId: string): Promise<boolean> {
        let supportArray: string[] | undefined;
        
        if (target.type === 'post') {
            const post = this.posts.find(p => p.id === target.id);
            supportArray = post?.supports;
        } else {
            for (const post of this.posts) {
                const comment = post.comments.find(c => c.id === target.id);
                if (comment) {
                    supportArray = comment.supports;
                    break;
                }
            }
        }
        
        if (!supportArray) return false;

        const userIndex = supportArray.indexOf(userId);
        if (userIndex > -1) {
            supportArray.splice(userIndex, 1);
        } else {
            supportArray.push(userId);
        }

        this.savePosts();
        await new Promise(res => setTimeout(res, 100));
        return true;
    }
}

export const communityService = new CommunityService();