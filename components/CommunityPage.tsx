import React, { useState, useEffect, useCallback } from 'react';
import { CommunityPost, CommunityTopic, User, CommunityComment, Author } from '../types';
import { communityService } from '../services/communityService';

const TOPICS: CommunityTopic[] = ["Academic Stress", "Friendships & Relationships", "Anxiety & Mental Health", "Daily Motivation"];
const ANONYMOUS_AVATAR = `https://api.dicebear.com/8.x/initials/svg?seed=Anonymous`;

// --- Reusable Sub-Components ---

const AuthorDisplay: React.FC<{ author: Author | null }> = React.memo(({ author }) => {
    const displayName = author?.displayName || 'Anonymous';
    const photoURL = author?.photoURL || ANONYMOUS_AVATAR;
    return (
        <div className="flex items-center gap-2">
            <img src={photoURL} alt={displayName} className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{displayName}</span>
        </div>
    );
});

const SupportButton: React.FC<{
    target: { type: 'post' | 'comment'; id: string; };
    supporters: string[];
    user: User;
}> = ({ target, supporters, user }) => {
    const [isSupported, setIsSupported] = useState(supporters.includes(user.id));
    const [supportCount, setSupportCount] = useState(supporters.length);

    const handleSupport = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const originalSupportState = isSupported;
        const originalCount = supportCount;

        setIsSupported(!originalSupportState);
        setSupportCount(originalCount + (!originalSupportState ? 1 : -1));

        try {
            await communityService.toggleSupport(target, user.id);
        } catch {
            setIsSupported(originalSupportState);
            setSupportCount(originalCount);
        }
    };

    return (
        <button
            onClick={handleSupport}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full transition-colors ${isSupported ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50'}`}
        >
            <i className={`fas fa-hands-helping ${isSupported ? 'text-purple-600' : ''}`}></i>
            <span>{supportCount} Support</span>
        </button>
    );
};

const PostCard: React.FC<{ post: CommunityPost; onClick: () => void }> = ({ post, onClick }) => {
    return (
        <div onClick={onClick} className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-lg shadow-sm border border-white/20 dark:border-gray-700/50 hover:shadow-md hover:border-purple-400/50 dark:hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">{post.title}</h3>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <AuthorDisplay author={post.author} />
                <div className="flex items-center gap-3">
                    <span><i className="fas fa-comment-alt mr-1"></i> {post.comments.length}</span>
                    <span><i className="fas fa-hands-helping mr-1"></i> {post.supports.length}</span>
                </div>
            </div>
        </div>
    );
};

const CreatePostModal: React.FC<{
    user: User;
    onClose: () => void;
    onPostCreated: (newPost: CommunityPost) => void;
}> = ({ user, onClose, onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState<CommunityTopic>('Academic Stress');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsSubmitting(true);
        try {
            const newPost = await communityService.createPost({ title, content, topic, author: user, isAnonymous });
            onPostCreated(newPost);
            onClose();
        } catch (error) {
            console.error("Failed to create post", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">Create a New Post</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post Title" className="w-full p-2 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" required/>
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Share your thoughts..." rows={5} className="w-full p-2 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" required/>
                    <select value={topic} onChange={e => setTopic(e.target.value as CommunityTopic)} className="w-full p-2 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                     <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                        <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="rounded text-purple-600 focus:ring-purple-500" />
                        Post Anonymously
                    </label>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-600/50 hover:bg-gray-300/50 dark:hover:bg-gray-500/50 transition">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition disabled:bg-purple-400">
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PostDetailView: React.FC<{
    postId: string;
    user: User;
    onBack: () => void;
}> = ({ postId, user, onBack }) => {
    const [post, setPost] = useState<CommunityPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [isAnonymousComment, setIsAnonymousComment] = useState(false);
    
    const fetchPost = useCallback(async () => {
        const fetchedPost = await communityService.getPost(postId);
        setPost(fetchedPost || null);
        setIsLoading(false);
    }, [postId]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        
        await communityService.createComment({ postId, content: comment, author: user, isAnonymous: isAnonymousComment });
        setComment('');
        fetchPost(); // Re-fetch to show new comment
    };

    if (isLoading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div></div>;
    if (!post) return <div className="text-center p-4">Post not found.</div>;
    
    return (
        <div className="h-full flex flex-col">
            <header className="p-3 border-b border-white/20 dark:border-gray-700/50 flex items-center gap-4">
                <button onClick={onBack} className="text-lg hover:text-purple-600 dark:hover:text-purple-400"><i className="fas fa-arrow-left"></i></button>
                <h2 className="font-bold text-gray-800 dark:text-gray-100 truncate">{post.title}</h2>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 bg-black/5 dark:bg-black/20 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <AuthorDisplay author={post.author} />
                         <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
                    <div className="mt-4">
                        <SupportButton target={{ type: 'post', id: post.id }} supporters={post.supports} user={user} />
                    </div>
                </div>

                <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-t border-white/20 dark:border-gray-700/50 pt-4">Comments ({post.comments.length})</h3>
                <div className="space-y-3">
                    {post.comments.map(c => (
                        <div key={c.id} className="p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <AuthorDisplay author={c.author} />
                                <SupportButton target={{type: 'comment', id: c.id}} supporters={c.supports} user={user} />
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{c.content}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-3 border-t border-white/20 dark:border-gray-700/50">
                <form onSubmit={handleCommentSubmit} className="space-y-2">
                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add your supportive comment..." rows={2} className="w-full p-2 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" required />
                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-300">
                           <input type="checkbox" checked={isAnonymousComment} onChange={e => setIsAnonymousComment(e.target.checked)} className="rounded text-purple-600 focus:ring-purple-500" />
                            Post Anonymously
                        </label>
                        <button type="submit" className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">Comment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const CommunityPage: React.FC<{ user: User }> = ({ user }) => {
    const [activeTopic, setActiveTopic] = useState<CommunityTopic>('Academic Stress');
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewingPostId, setViewingPostId] = useState<string | null>(null);
    const [isCreatingPost, setIsCreatingPost] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            const fetchedPosts = await communityService.getPosts(activeTopic);
            setPosts(fetchedPosts);
            setIsLoading(false);
        };
        fetchPosts();
    }, [activeTopic]);

    const handlePostCreated = (newPost: CommunityPost) => {
        if (newPost.topic === activeTopic) {
            setPosts(prev => [newPost, ...prev]);
        }
    };

    return (
        <div className="flex h-full max-w-6xl mx-auto bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
             {isCreatingPost && <CreatePostModal user={user} onClose={() => setIsCreatingPost(false)} onPostCreated={handlePostCreated}/>}
            
            {/* Sidebar for topics */}
            <aside className="w-1/4 p-4 border-r border-white/20 dark:border-gray-700/50 hidden md:block">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Topics</h2>
                <nav className="space-y-2">
                    {TOPICS.map(topic => (
                        <button
                            key={topic}
                            onClick={() => { setActiveTopic(topic); setViewingPostId(null); }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTopic === topic && !viewingPostId ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 font-semibold' : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
                        >
                            {topic}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col">
                {viewingPostId ? (
                    <PostDetailView postId={viewingPostId} user={user} onBack={() => setViewingPostId(null)} />
                ) : (
                    <>
                        <header className="p-4 flex justify-between items-center border-b border-white/20 dark:border-gray-700/50">
                            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{activeTopic}</h1>
                            <button onClick={() => setIsCreatingPost(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
                                <i className="fas fa-plus"></i>
                                <span className="hidden sm:inline">New Post</span>
                            </button>
                        </header>
                        <div className="flex-1 p-4 overflow-y-auto">
                            {isLoading ? (
                                <div className="text-center py-10"><div className="w-8 h-8 mx-auto border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div></div>
                            ) : posts.length > 0 ? (
                                <div className="space-y-4">
                                    {posts.map(post => <PostCard key={post.id} post={post} onClick={() => setViewingPostId(post.id)} />)}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500 dark:text-gray-400">No posts in this topic yet. Be the first to share!</div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default CommunityPage;