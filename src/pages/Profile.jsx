import { 
	Typography, 
	Box, 
	Avatar, 
	Card, 
	CardContent,
	Divider,
	Chip,
	Button,
	Paper,
	CircularProgress,
	Alert,
} from "@mui/material";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";
import Post from "../components/Post";
import { Person as PersonIcon, Edit as EditIcon } from "@mui/icons-material";

const api = "http://localhost:8800/users";
const followApi = "http://localhost:8800/follows";

export default function Profile() {
	const { username } = useParams();
	const { auth, mode } = useApp();
	const queryClient = useQueryClient();
	
	// If no username in params, show current user's profile
	const profileUsername = username || auth?.username;
	const isOwnProfile = !username || username === auth?.username;

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user", profileUsername],
		queryFn: async () => {
			if (!profileUsername) return null;
			const res = await fetch(`${api}/${profileUsername}`);
			if (!res.ok) {
				throw new Error("User not found");
			}
			return res.json();
		},
		enabled: !!profileUsername
	});

	// Get follow status for other users' profiles
	const { data: followStatus } = useQuery({
		queryKey: ["followStatus", user?.id],
		queryFn: async () => {
			if (!user?.id || !auth) return null;
			const token = localStorage.getItem("token");
			if (!token) return null;
			const res = await fetch(`${followApi}/${user.id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (!res.ok) return null;
			return res.json();
		},
		enabled: !!user?.id && !!auth && !isOwnProfile
	});

	// Follow/unfollow mutation
	const followMutation = useMutation({
		mutationFn: async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("Not authenticated");
			}
			const res = await fetch(followApi, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ followingId: user.id })
			});
			if (!res.ok) {
				throw new Error("Failed to toggle follow");
			}
			return res.json();
		},
		onSuccess: () => {
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ["followStatus", user?.id] });
			queryClient.invalidateQueries({ queryKey: ["user", profileUsername] });
		}
	});

	if (!profileUsername && !auth) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
				<Paper
					elevation={2}
					sx={{
						p: 4,
						maxWidth: 400,
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
					<PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
					<Typography variant="h6" color="text.secondary">
						Please log in to view your profile
					</Typography>
				</Paper>
			</Box>
		);
	}

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
					{error.message || 'Failed to load profile'}
				</Alert>
			</Box>
		);
	}

	if (!user) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
				<Paper
					elevation={2}
					sx={{
						p: 4,
						maxWidth: 400,
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
					<PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
					<Typography variant="h6" color="text.secondary">
						User not found
					</Typography>
				</Paper>
			</Box>
		);
	}

	return (
		<Box sx={{ py: 2 }}>
			{/* Profile Header */}
			<Paper
				elevation={3}
				sx={{
					p: 4,
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
				<CardContent sx={{ p: 0 }}>
					<Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
						<Avatar
							sx={{ 
								width: 100, 
								height: 100, 
								bgcolor: 'primary.main',
								fontSize: "2rem",
								fontWeight: 600,
								boxShadow: mode === 'dark'
									? '0 8px 24px rgba(99, 102, 241, 0.3)'
									: '0 8px 24px rgba(79, 70, 229, 0.2)',
								border: mode === 'dark'
									? '3px solid rgba(255, 255, 255, 0.1)'
									: '3px solid rgba(79, 70, 229, 0.1)',
							}}
						>
							{user.name.charAt(0).toUpperCase()}
						</Avatar>
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<Typography 
								variant="h3" 
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
								{user.name}
							</Typography>
							<Typography 
								variant="h6" 
								sx={{ 
									color: 'primary.main', 
									mb: 2,
									fontWeight: 500,
								}}
							>
								@{user.username}
							</Typography>
							<Typography 
								variant="body1" 
								sx={{ 
									mb: 3,
									lineHeight: 1.6,
									color: 'text.primary',
								}}
							>
								{user.bio}
							</Typography>
							<Box sx={{ display: "flex", flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
								<Chip 
									label={`${user._count.posts} Posts`} 
									variant="filled" 
									color="primary"
									sx={{
										fontWeight: 500,
										borderRadius: 2,
									}}
								/>
								<Chip 
									label={`${user._count.comments} Comments`} 
									variant="filled" 
									color="secondary"
									sx={{
										fontWeight: 500,
										borderRadius: 2,
									}}
								/>
								<Chip 
									label={`${user._count.likes} Likes Given`} 
									variant="filled" 
									color="success"
									sx={{
										fontWeight: 500,
										borderRadius: 2,
									}}
								/>
								<Chip 
									label={`${user._count.followers} Followers`} 
									variant="filled" 
									color="info"
									sx={{
										fontWeight: 500,
										borderRadius: 2,
									}}
								/>
								<Chip 
									label={`${user._count.following} Following`} 
									variant="filled" 
									color="warning"
									sx={{
										fontWeight: 500,
										borderRadius: 2,
									}}
								/>
							</Box>
							
							{/* Follow/Unfollow Button */}
							<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
								{!isOwnProfile && auth && (
									<Button
										variant={followStatus?.following ? "outlined" : "contained"}
										color="primary"
										onClick={() => followMutation.mutate()}
										disabled={followMutation.isPending}
										sx={{
											py: 1.5,
											px: 3,
											borderRadius: 2,
											fontWeight: 600,
											textTransform: 'none',
											...(followStatus?.following ? {} : {
												background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												'&:hover': {
													background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
												},
											})
										}}
									>
										{followMutation.isPending 
											? "Loading..." 
											: followStatus?.following 
												? "Unfollow" 
												: "Follow"
										}
									</Button>
								)}
								{isOwnProfile && (
									<Button
										variant="outlined"
										color="primary"
										startIcon={<EditIcon />}
										sx={{
											py: 1.5,
											px: 3,
											borderRadius: 2,
											fontWeight: 600,
											textTransform: 'none',
										}}
									>
										Edit Profile
									</Button>
								)}
							</Box>
						</Box>
					</Box>
				</CardContent>
			</Paper>

			<Divider sx={{ mb: 4 }} />

			{/* User's Posts */}
			<Typography 
				variant="h4" 
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
				Posts by {user.name}
			</Typography>

			{user.posts.length === 0 ? (
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
						{isOwnProfile ? 'Share your first post with the community!' : 'This user hasn\'t posted anything yet.'}
					</Typography>
				</Paper>
			) : (
				user.posts.map(post => (
					<Post key={post.id} post={post} />
				))
			)}
		</Box>
	);
}
