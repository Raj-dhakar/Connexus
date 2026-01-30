import { useState, useEffect } from 'react';
import postApi from '../../api/postApi';
import userApi from '../../api/userApi';
import useAuth from '../auth/useAuth';

const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth(); // Get current user to filter

    const fetchPosts = async (currentPage) => {
        try {
            setLoading(true);
            const size = 10; // Default page size for infinite scroll

            // Call API with pagination parameters
            const response = await postApi.getAllPosts({ page: currentPage, size, paginated: true });
            console.log(`Fetching page ${currentPage}:`, response);
            console.log(`Response data:`, response.data + " \n" + response.data.content);

            let newPosts = [];
            // Handle pagination wrapper from backend
            // Structure seems to be response.data (Axios) -> data (Wrapper) -> content (Page)
            if (response.data && response.data.data && Array.isArray(response.data.data.content)) {
                console.log("Parsing nested paginated response");
                newPosts = response.data.data.content;
                setHasMore(!response.data.data.last);
            } else if (response.data && response.data.content) {
                // Direct Page object
                console.log("Parsing direct paginated response");
                newPosts = response.data.content;
                setHasMore(!response.data.last);
            } else if (Array.isArray(response.data)) {
                // Fallback for list
                newPosts = response.data;
                setHasMore(false);
            } else if (response.data && Array.isArray(response.data.data)) {
                // Fallback for wrapped list logic (if any)
                newPosts = response.data.data;
                setHasMore(false);
            }

            if (newPosts.length === 0) {
                console.warn("API returned 0 posts.");
                if (currentPage === 0) setPosts([]);
                setLoading(false);
                return;
            }

            // Enrich posts with user data
            const userIds = [...new Set(newPosts.map(p => p.userId).filter(id => id))];
            const userPromises = userIds.map(id =>
                userApi.getProfile(id).catch(err => {
                    return null; // Return null on error
                })
            );

            const usersResponses = await Promise.all(userPromises);

            const usersMap = {};
            usersResponses.forEach(res => {
                if (res && res.data && res.data.data) {
                    const u = res.data.data;
                    usersMap[u.id] = u;
                } else if (res && res.data) {
                    const u = res.data;
                    usersMap[u.id] = u;
                }
            });

            const mappedPosts = newPosts.map(post => {
                const author = usersMap[post.userId] || {};
                return {
                    id: post.postId,
                    userId: post.userId,
                    username: author.username || author.firstName || `User ${post.userId}`,
                    designation: author.designation || 'Member',
                    profile_image: author.profileImage,
                    title: post.title,
                    description: post.description,
                    mediaUrl: post.mediaUrl,
                    textPost: post.description || post.title, // Fallback/Compat
                    filePost: post.mediaUrl // Map mediaUrl to filePost for existing compatibility
                };
            });

            console.log(`Raw posts fetched: ${newPosts.length}`);

            const filteredPosts = mappedPosts.filter(post => {
                const currentUserId = user?.user_id || user?.id;
                // Strict comparison - Filter out own posts
                return !(currentUserId && post.userId && String(currentUserId) === String(post.userId));
            });
            console.log(`Posts after filtering: ${filteredPosts.length}`);

            setPosts(prev => currentPage === 0 ? filteredPosts : [...prev, ...filteredPosts]);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (user) {
            setPage(0);
            setHasMore(true);
            fetchPosts(0);
        }
    }, [user]);

    // Load more function
    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage);
        }
    };

    return { posts, loading, error, hasMore, loadMore };
};

export default usePosts;
