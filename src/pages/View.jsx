import { Box, Button, OutlinedInput, Paper, Typography, CircularProgress, Alert } from "@mui/material";
import { Comment as CommentIcon } from "@mui/icons-material";

import Post from "../components/Post";
import Comment from "../components/Comment";

import { useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useApp } from "../AppProvider";

const api = "http://localhost:8800/posts";
const commentApi = "http://localhost:8800/comments";

export default function View() {
	const { id } = useParams();
	const commentRef = useRef(null);
	const queryClient = useQueryClient();
	const { auth, mode } = useApp();

	const {
		data: post,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["post", id],
		queryFn: async () => {
			const res = await fetch(`${api}/${id}`);
			return res.json();
		},
	});

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
				<CircularProgress size={48} sx={{ color: 'primary.main' }} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
				<Alert severity="error" sx={{ borderRadius: 2 }}>
					{error.message || 'Failed to load post'}
				</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ py: 2 }}>
			<Post post={post} />

			{auth && (
				<Paper
					elevation={2}
					sx={{
						p: 3,
						mt: 3,
						mb: 3,
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
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
						<Avatar
							sx={{
								width: 32,
								height: 32,
								bgcolor: 'primary.main',
								fontWeight: 600,
								fontSize: '0.875rem',
							}}
						>
							{auth.username ? auth.username.charAt(0).toUpperCase() : 'U'}
						</Avatar>
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							Add a comment
						</Typography>
					</Box>
					<form
						onSubmit={async e => {
							e.preventDefault();
							const content = commentRef.current.value;
							if (!content) return false;

							const token = localStorage.getItem('token');

							const res = await fetch(commentApi, {
								method: 'POST',
								body: JSON.stringify({ content, postId: id }),
								headers: {
									'Content-Type': 'application/json',
									'Authorization': `Bearer ${token}`,
								},
							});

							if (res.ok) {
								queryClient.invalidateQueries({ queryKey: ['post', id] });
								e.currentTarget.reset();
							}
						}}>
						<OutlinedInput
							placeholder="Share your thoughts..."
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
							inputRef={commentRef}
						/>
						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								type="submit"
								variant="contained"
								startIcon={<CommentIcon />}
								sx={{
									py: 1.5,
									px: 3,
									borderRadius: 2,
									fontWeight: 600,
									textTransform: 'none',
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									'&:hover': {
										background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
									},
								}}
							>
								Post Comment
							</Button>
						</Box>
					</form>
				</Paper>
			)}

			{post.comments && post.comments.length > 0 && (
				<Box sx={{ mt: 3 }}>
					<Typography 
						variant="h5" 
						sx={{ 
							mb: 3, 
							fontWeight: 700,
							background: mode === 'dark'
								? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
								: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}
					>
						Comments ({post.comments.length})
					</Typography>
					{post.comments.map(comment => (
						<Comment
							key={comment.id}
							comment={comment}
						/>
					))}
				</Box>
			)}
		</Box>
	);
}
