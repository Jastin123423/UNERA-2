

import { Post, User } from '../types';

/**
 * UNERA FEED RANKING ALGORITHM
 * 
 * Scores posts based on:
 * 1. Freshness (Time Decay)
 * 2. Affinity (Relationship)
 * 3. Local Relevance (Geo-location)
 * 4. New User Boost (Growth Multiplier)
 * 5. Engagement (Likes, Comments, Shares)
 * 6. Watch Time (Simulated via Views)
 * 7. Interest Clustering (Tags/Categories)
 */

interface ScoredPost {
    post: Post;
    score: number;
    debugReason?: string;
}

const CONSTANTS = {
    // Weight Multipliers
    WEIGHT_FRESHNESS: 1000,
    WEIGHT_AFFINITY: 250,
    WEIGHT_LOCAL: 150,
    WEIGHT_ENGAGEMENT: 10,
    WEIGHT_INTEREST: 200,
    
    // Engagement Values
    VAL_LIKE: 1,
    VAL_COMMENT: 3,
    VAL_SHARE: 5,
    VAL_VIEW: 0.1,

    // Time Decay
    DECAY_FACTOR: 1.5, // Higher means faster decay

    // Boosts
    NEW_USER_BOOST: 1.4, // 40% boost for new users
    NEW_USER_DAYS: 60,
    VIRAL_THRESHOLD: 50, // Engagement score to trigger viral booster
    VIRAL_MULTIPLIER: 1.3
};

/**
 * Calculates the score for a single post relative to a viewer
 */
export const calculatePostScore = (post: Post, viewer: User | null, author: User): number => {
    const now = Date.now();
    const postTime = post.createdAt || Date.now();
    
    // --- 1. FRESHNESS SCORE (Exponential Decay) ---
    // Posts lose value over time. 
    // Formula: e^(-(hours_old / 24) * decay_factor)
    const hoursOld = Math.max(0, (now - postTime) / (1000 * 60 * 60));
    const freshnessScore = Math.exp(-(hoursOld / 48) * CONSTANTS.DECAY_FACTOR) * CONSTANTS.WEIGHT_FRESHNESS;

    // --- 2. AFFINITY SCORE (Relationship) ---
    let affinityScore = 0;
    if (viewer) {
        const isFollowing = viewer.following.includes(author.id);
        const isFollower = author.following.includes(viewer.id); // They follow me
        const isMe = viewer.id === author.id;

        if (isMe) affinityScore = 0; // Don't boost own posts artificially in feed
        else if (isFollowing && isFollower) affinityScore = 2.0; // Mutual Friend
        else if (isFollowing) affinityScore = 1.5; // I follow them
        else if (isFollower) affinityScore = 1.1; // They follow me
        else affinityScore = 1.0; // Stranger
    }
    const finalAffinity = affinityScore * CONSTANTS.WEIGHT_AFFINITY;

    // --- 3. LOCAL-FIRST FEED ---
    let localScore = 0;
    if (viewer?.location && author.location) {
        // Simple string matching for simulation
        // e.g., "Arusha, Tanzania" matches "Tanzania"
        const viewerLoc = viewer.location.toLowerCase();
        const authorLoc = author.location.toLowerCase();
        
        // Extract country/city
        const viewerParts = viewerLoc.split(',').map(s => s.trim());
        const authorParts = authorLoc.split(',').map(s => s.trim());
        
        const hasMatch = viewerParts.some(vp => authorParts.some(ap => ap.includes(vp) || vp.includes(ap)));
        
        if (hasMatch) localScore = 1.0 * CONSTANTS.WEIGHT_LOCAL;
    }

    // --- 4. NEW USER BOOST ---
    let userBoost = 1.0;
    if (author.joinedDate) {
        const joinDate = new Date(author.joinedDate).getTime();
        const daysSinceJoin = (now - joinDate) / (1000 * 60 * 60 * 24);
        if (daysSinceJoin <= CONSTANTS.NEW_USER_DAYS) {
            userBoost = CONSTANTS.NEW_USER_BOOST;
        }
    }

    // --- 5. ENGAGEMENT & VIRALITY ---
    const rawEngagement = 
        (post.reactions.length * CONSTANTS.VAL_LIKE) + 
        (post.comments.length * CONSTANTS.VAL_COMMENT) + 
        (post.shares * CONSTANTS.VAL_SHARE);
    
    let viralMultiplier = 1.0;
    if (rawEngagement > CONSTANTS.VIRAL_THRESHOLD) {
        viralMultiplier = CONSTANTS.VIRAL_MULTIPLIER;
    }

    // Engagement Speed (Mocked): High engagement on recent post gets huge boost
    let velocityMultiplier = 1.0;
    if (hoursOld < 2 && rawEngagement > 10) velocityMultiplier = 1.5;

    const finalEngagement = rawEngagement * CONSTANTS.WEIGHT_ENGAGEMENT * viralMultiplier * velocityMultiplier;

    // --- 6. WATCH TIME (Views) ---
    const viewScore = (post.views || 0) * CONSTANTS.VAL_VIEW;

    // --- 7. INTEREST CLUSTERING ---
    let interestScore = 0;
    if (viewer?.interests && (post.category || post.tags)) {
        let matches = 0;
        // Check category
        if (post.category && viewer.interests.includes(post.category.toLowerCase())) matches += 2;
        // Check tags
        if (post.tags) {
            post.tags.forEach(tag => {
                if (viewer.interests!.includes(tag.toLowerCase())) matches += 1;
            });
        }
        interestScore = matches * CONSTANTS.WEIGHT_INTEREST;
    }

    // --- 8. FINAL FORMULA ---
    const totalScore = (
        freshnessScore +
        finalAffinity +
        localScore +
        finalEngagement +
        viewScore +
        interestScore
    ) * userBoost;

    return totalScore;
};

/**
 * Main function to sort the feed
 */
export const rankFeed = (posts: Post[], viewer: User | null, users: User[]): Post[] => {
    // 1. Create a map for fast user lookup
    const userMap = new Map<number, User>();
    users.forEach(u => userMap.set(u.id, u));

    // 2. Score each post
    const scoredPosts: ScoredPost[] = posts.map(post => {
        const author = userMap.get(post.authorId);
        if (!author) return { post, score: 0 };

        const score = calculatePostScore(post, viewer, author);
        return { post, score };
    });

    // 3. Sort by score descending
    scoredPosts.sort((a, b) => b.score - a.score);

    // 4. Return sorted posts
    return scoredPosts.map(sp => sp.post);
};
