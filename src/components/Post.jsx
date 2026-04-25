import {
	Avatar,
	Box,
	Button,
	Card,
	IconButton,
	Typography,
	Chip,
	Tooltip,
} from "@mui/material";

import {
	FavoriteBorderOutlined as LikeIcon,
	Favorite as LikedIcon,
	ChatBubbleOutline as CommentIcon,
	DeleteOutline as DeleteIcon,
	Share as ShareIcon,
	BookmarkBorder as BookmarkIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const postApi = "http://localhost:8800/posts";
const likesApi = "http://localhost:8800/likes";

export default function Post({ post }) {
	const navigate = useNavigate();
	const { auth, mode } = useApp();
	const queryClient = useQueryClient();
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

	// Check if current user has liked this post
	useEffect(() => {
		if (auth && post.likes) {
			const userLike = post.likes.find(like => like.userId === auth.id);
			setIsLiked(!!userLike);
		}
	}, [auth, post.likes]);

	const handleLike = async () => {
		if (!auth) return;

		const token = localStorage.getItem('token');
		
		const res = await fetch(likesApi, {
			method: 'POST',
			body: JSON.stringify({ postId: post.id }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		});

		if (res.ok) {
			const data = await res.json();
			setIsLiked(data.liked);
			setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		}
	};

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this post?')) return;
		
		const token = localStorage.getItem('token');
		
		const res = await fetch(`${postApi}/${post.id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`,
			},
		});

		if (res.ok) {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		}
	};

	const formatTimeAgo = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) {
			const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
			if (diffHours === 0) {
				const diffMins = Math.floor(diffTime / (1000 * 60));
				return diffMins === 0 ? 'just now' : `${diffMins}m ago`;
			}
			return `${diffHours}h ago`;
		}
		return `${diffDays}d ago`;
	};

	return (
		<Card 
			elevation={2}
			sx={{
				mb: 3,
				borderRadius: 3,
				overflow: 'hidden',
				transition: 'all 0.3s ease',
				'&:hover': {
					transform: 'translateY(-2px)',
					boxShadow: mode === 'dark'
						? '0 12px 24px rgba(0, 0, 0, 0.4)'
						: '0 12px 24px rgba(0, 0, 0, 0.15)',
				},
				background: mode === 'dark'
					? 'linear-gradient(135deg, rgba(30, 30, 46, 0.9) 0%, rgba(45, 45, 68, 0.9) 100%)'
					: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
				backdropFilter: 'blur(10px)',
				border: mode === 'dark'
					? '1px solid rgba(255, 255, 255, 0.1)'
					: '1px solid rgba(0, 0, 0, 0.05)',
			}}
		>
			{/* Post Header */}
			<Box sx={{ p: 3, pb: 2 }}>
				<Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
					<Box sx={{ display: "flex", gap: 2, flex: 1 }}>
						<Avatar
							sx={{ 
								width: 48, 
								height: 48,
								bgcolor: 'primary.main',
								fontWeight: 600,
								boxShadow: mode === 'dark'
									? '0 4px 12px rgba(99, 102, 241, 0.3)'
									: '0 4px 12px rgba(79, 70, 229, 0.2)',
								cursor: 'pointer',
								transition: 'all 0.2s ease',
								'&:hover': {
									transform: 'scale(1.05)',
								}
							}}
							onClick={() => navigate(`/profile/${post.user.username}`)}
						>
							{post.user.name ? post.user.name.charAt(0).toUpperCase() : 'U'}
						</Avatar>
						
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
								<Typography 
									variant="subtitle1"
									sx={{ 
										fontWeight: 600,
										cursor: 'pointer',
										color: 'text.primary',
										'&:hover': {
											color: 'primary.main',
										}
									}}
									onClick={() => navigate(`/profile/${post.user.username}`)}
								>
									{post.user.name}
								</Typography>
								<Typography variant="body2" sx={{ color: 'text.secondary' }}>
									@{post.user.username}
								</Typography>
							</Box>
							
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Typography variant="caption" sx={{ color: 'text.secondary' }}>
									{formatTimeAgo(post.createAt)}
								</Typography>
								{auth && auth.id === post.userId && (
									<Chip
										label="Author"
										size="small"
										sx={{
											height: 20,
											fontSize: '0.65rem',
											bgcolor: 'primary.main',
											color: 'white',
										}}
									/>
								)}
							</Box>
						</Box>
					</Box>
					
					{auth && auth.id === post.userId && (
						<Tooltip title="Delete post">
							<IconButton 
								onClick={handleDelete}
								sx={{
									color: 'text.secondary',
									'&:hover': {
										color: 'error.main',
										bgcolor: mode === 'dark' 
											? 'rgba(244, 63, 94, 0.1)' 
											: 'rgba(225, 29, 72, 0.1)',
									},
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					)}
				</Box>
			</Box>

			{/* Post Content */}
			<Box sx={{ px: 3, pb: 2 }}>
				<Typography 
					variant="body1"
					sx={{ 
						lineHeight: 1.6,
						cursor: 'pointer',
						color: 'text.primary',
						'&:hover': {
							color: 'primary.main',
						}
					}}
					onClick={() => navigate(`/view/${post.id}`)}
				>
					{post.content}
				</Typography>
			</Box>

			{/* Post Actions */}
			<Box sx={{ px: 3, pb: 3 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{/* Like Button */}
					<Button
						startIcon={isLiked ? <LikedIcon /> : <LikeIcon />}
						onClick={handleLike}
						disabled={!auth}
						sx={{
							textTransform: 'none',
							color: isLiked ? 'error.main' : 'text.secondary',
							fontWeight: 500,
							px: 2,
							py: 1,
							borderRadius: 2,
							'&:hover': {
								bgcolor: isLiked 
									? mode === 'dark' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(225, 29, 72, 0.1)'
									: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
							},
							'&:disabled': {
								color: 'text.disabled',
							}
						}}
					>
						{likesCount > 0 && likesCount}
					</Button>

					{/* Comment Button */}
					<Button
						startIcon={<CommentIcon />}
						onClick={() => navigate(`/view/${post.id}`)}
						sx={{
							textTransform: 'none',
							color: 'text.secondary',
							fontWeight: 500,
							px: 2,
							py: 1,
							borderRadius: 2,
							'&:hover': {
								bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
							},
						}}
					>
						{post.comments?.length > 0 && post.comments.length}
					</Button>

					{/* Share Button */}
					<Tooltip title="Share post">
						<IconButton
							sx={{
								color: 'text.secondary',
								'&:hover': {
									color: 'primary.main',
									bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
								},
							}}
						>
							<ShareIcon />
						</IconButton>
					</Tooltip>

					{/* Bookmark Button */}
					<Tooltip title="Save post">
						<IconButton
							sx={{
								color: 'text.secondary',
								'&:hover': {
									color: 'primary.main',
									bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
								},
							}}
						>
							<BookmarkIcon />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>
		</Card>
	);
}
