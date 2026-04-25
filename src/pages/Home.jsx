import { 
	Box, 
	OutlinedInput, 
	Button, 
	Typography, 
	Avatar,
	Paper,
	LinearProgress,
	Alert,
	CircularProgress,
} from "@mui/material";

import Post from "../components/Post";
import { useRef } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";

const api = "http://localhost:8800/posts";

export default function Home() {
	const contentRef = useRef(null);
	const queryClient = useQueryClient();
	const { auth, mode } = useApp();

	const {
		data: posts,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const res = await fetch(api);
			return res.json();
		},
	});

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
				<Box sx={{ textAlign: 'center' }}>
					<CircularProgress size={48} sx={{ mb: 2, color: 'primary.main' }} />
					<Typography variant="h6" color="text.secondary">
						Loading posts...
					</Typography>
				</Box>
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ mt: 4 }}>
				<Alert severity="error" sx={{ borderRadius: 2 }}>
					{error.message || 'Failed to load posts. Please try again later.'}
				</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ py: 2 }}>
			{/* Page Header */}
			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<Typography 
					variant="h4" 
					component="h1"
					sx={{
						fontWeight: 700,
						mb: 1,
						background: mode === 'dark'
							? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
							: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}
				>
					Welcome to Social Hub
				</Typography>
				<Typography variant="body1" color="text.secondary">
					{auth ? 'Share your thoughts with the community' : 'Join the conversation by signing in'}
				</Typography>
			</Box>

			{/* Post Creation Area */}
			{auth && (
				<Paper
					elevation={2}
					sx={{
						p: 3,
						mb: 4,
						borderRadius: 3,
						background: mode === 'dark'
							? 'linear-gradient(135deg, rgba(30, 30, 46, 0.9) 0%, rgba(45, 45, 68, 0.9) 100%)'
							: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
						backdropFilter: 'blur(10px)',
						border: mode === 'dark'
							? '1px solid rgba(255, 255, 255, 0.1)'
							: '1px solid rgba(0, 0, 0, 0.05)',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
						<Avatar
							sx={{
								width: 40,
								height: 40,
								bgcolor: 'primary.main',
								fontWeight: 600,
								boxShadow: mode === 'dark'
									? '0 4px 12px rgba(99, 102, 241, 0.3)'
									: '0 4px 12px rgba(79, 70, 229, 0.2)',
							}}
						>
							{auth.username ? auth.username.charAt(0).toUpperCase() : 'U'}
						</Avatar>
						<Box sx={{ flex: 1 }}>
							<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
								Create a post
							</Typography>
						</Box>
					</Box>

					<form
						onSubmit={async e => {
							e.preventDefault();
							const content = contentRef.current.value;
							if(!content) return false;

							const token = localStorage.getItem('token');

							const res = await fetch(api, {
								method: 'POST',
								body: JSON.stringify({ content }),
								headers: {
									'Content-Type': 'application/json',
									'Authorization': `Bearer ${token}`,
								},
							});

							if(res.ok) {
								queryClient.invalidateQueries({ queryKey: ['posts'] });
								e.currentTarget.reset();
							}
						}}>
						<OutlinedInput
							placeholder="What's on your mind?"
							fullWidth
							multiline
							minRows={3}
							maxRows={6}
							sx={{ 
								mb: 2,
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
								},
								'&:hover .MuiOutlinedInput-notchedOutline': {
									borderColor: mode === 'dark' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.5)',
								},
								'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
									borderColor: mode === 'dark' ? '#6366f1' : '#4f46e5',
									borderWidth: 2,
								},
							}}
							inputRef={contentRef}
						/>
						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								type="submit"
								variant="contained"
								sx={{
									px: 4,
									py: 1.5,
									borderRadius: 2,
									fontWeight: 600,
									textTransform: 'none',
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									'&:hover': {
										background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
									},
								}}
							>
								Share Post
							</Button>
						</Box>
					</form>
				</Paper>
			)}

			{/* Posts Feed */}
			<Box>
				{posts && posts.length > 0 ? (
					<>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
							Recent Posts
						</Typography>
						{posts.map(post => (
							<Post
								key={post.id}
								post={post}
							/>
						))}
					</>
				) : (
					<Paper
						sx={{
							p: 6,
							textAlign: 'center',
							borderRadius: 3,
							background: mode === 'dark'
								? 'linear-gradient(135deg, rgba(30, 30, 46, 0.9) 0%, rgba(45, 45, 68, 0.9) 100%)'
								: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
							backdropFilter: 'blur(10px)',
							border: mode === 'dark'
								? '1px solid rgba(255, 255, 255, 0.1)'
								: '1px solid rgba(0, 0, 0, 0.05)',
						}}
					>
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No posts yet
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{auth 
								? 'Be the first to share something with the community!' 
								: 'Sign in to see posts from the community'
							}
						</Typography>
					</Paper>
				)}
			</Box>
		</Box>
	);
}
