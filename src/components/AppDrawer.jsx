import {
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	Avatar,
	Chip,
} from "@mui/material";

import {
	Home as HomeIcon,
	PersonAdd as RegisterIcon,
	Login as LoginIcon,
	Logout as LogoutIcon,
	Person as ProfileIcon,
	Dashboard as DashboardIcon,
	Settings as SettingsIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";

export default function AppDrawer() {
	const { showDrawer, setShowDrawer, auth, setAuth, mode } = useApp();
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		setAuth(undefined);
		navigate("/");
	};

	return (
		<Drawer
			anchor="left"
			open={showDrawer}
			onClose={() => setShowDrawer(false)}
			onClick={() => setShowDrawer(false)}
			PaperProps={{
				sx: {
					width: 280,
					border: 'none',
				}
			}}
		>
			<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				{/* Header Section */}
				<Box
					sx={{
						p: 3,
						background: mode === 'dark'
							? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
							: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						color: 'white',
						position: 'relative',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
						},
					}}
				>
					<Box sx={{ position: 'relative', zIndex: 1 }}>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
							Social Hub
						</Typography>
						{auth ? (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Avatar
									sx={{
										width: 40,
										height: 40,
										bgcolor: 'rgba(255, 255, 255, 0.2)',
										color: 'white',
										fontWeight: 600,
									}}
								>
									{auth.username ? auth.username.charAt(0).toUpperCase() : 'U'}
								</Avatar>
								<Box>
									<Typography variant="body2" sx={{ fontWeight: 600 }}>
										{auth.username || 'User'}
									</Typography>
									<Chip
										label="Online"
										size="small"
										sx={{
											bgcolor: 'rgba(16, 185, 129, 0.2)',
											color: 'white',
											fontSize: '0.7rem',
											height: 20,
										}}
									/>
								</Box>
							</Box>
						) : (
							<Typography variant="body2" sx={{ opacity: 0.9 }}>
								Welcome! Please login or register
							</Typography>
						)}
					</Box>
				</Box>

				{/* Navigation List */}
				<Box sx={{ flexGrow: 1, py: 2 }}>
					<List sx={{ px: 2 }}>
						<ListItem sx={{ p: 0, mb: 1 }}>
							<ListItemButton
								onClick={() => navigate("/")}
								sx={{
									borderRadius: 2,
									px: 2,
									py: 1.5,
									transition: 'all 0.2s ease',
									'&:hover': {
										bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
									},
								}}
							>
								<ListItemIcon>
									<HomeIcon sx={{ color: 'primary.main' }} />
								</ListItemIcon>
								<ListItemText 
									primary="Home" 
									primaryTypographyProps={{
										fontWeight: 500,
									}}
								/>
							</ListItemButton>
						</ListItem>

						{auth && (
							<>
								<ListItem sx={{ p: 0, mb: 1 }}>
									<ListItemButton
										onClick={() => navigate("/profile")}
										sx={{
											borderRadius: 2,
											px: 2,
											py: 1.5,
											transition: 'all 0.2s ease',
											'&:hover': {
												bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
											},
										}}
									>
										<ListItemIcon>
											<ProfileIcon sx={{ color: 'primary.main' }} />
										</ListItemIcon>
										<ListItemText 
											primary="Profile" 
											primaryTypographyProps={{
												fontWeight: 500,
											}}
										/>
									</ListItemButton>
								</ListItem>

								<ListItem sx={{ p: 0, mb: 1 }}>
									<ListItemButton
										onClick={() => navigate("/dashboard")}
										sx={{
											borderRadius: 2,
											px: 2,
											py: 1.5,
											transition: 'all 0.2s ease',
											'&:hover': {
												bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
											},
										}}
									>
										<ListItemIcon>
											<DashboardIcon sx={{ color: 'primary.main' }} />
										</ListItemIcon>
										<ListItemText 
											primary="Dashboard" 
											primaryTypographyProps={{
												fontWeight: 500,
											}}
										/>
									</ListItemButton>
								</ListItem>

								<Divider sx={{ my: 2 }} />

								<ListItem sx={{ p: 0, mb: 1 }}>
									<ListItemButton
										onClick={handleLogout}
										sx={{
											borderRadius: 2,
											px: 2,
											py: 1.5,
											transition: 'all 0.2s ease',
											'&:hover': {
												bgcolor: mode === 'dark' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(225, 29, 72, 0.1)',
											},
										}}
									>
										<ListItemIcon>
											<LogoutIcon sx={{ color: 'error.main' }} />
										</ListItemIcon>
										<ListItemText 
											primary="Logout" 
											primaryTypographyProps={{
												fontWeight: 500,
												color: 'error.main',
											}}
										/>
									</ListItemButton>
								</ListItem>
							</>
						)}

						{!auth && (
							<>
								<Divider sx={{ my: 2 }} />

								<ListItem sx={{ p: 0, mb: 1 }}>
									<ListItemButton
										onClick={() => navigate("/login")}
										sx={{
											borderRadius: 2,
											px: 2,
											py: 1.5,
											transition: 'all 0.2s ease',
											'&:hover': {
												bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
											},
										}}
									>
										<ListItemIcon>
											<LoginIcon sx={{ color: 'primary.main' }} />
										</ListItemIcon>
										<ListItemText 
											primary="Login" 
											primaryTypographyProps={{
												fontWeight: 500,
											}}
										/>
									</ListItemButton>
								</ListItem>

								<ListItem sx={{ p: 0, mb: 1 }}>
									<ListItemButton
										onClick={() => navigate("/register")}
										sx={{
											borderRadius: 2,
											px: 2,
											py: 1.5,
											transition: 'all 0.2s ease',
											'&:hover': {
												bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
											},
										}}
									>
										<ListItemIcon>
											<RegisterIcon sx={{ color: 'primary.main' }} />
										</ListItemIcon>
										<ListItemText 
											primary="Register" 
											primaryTypographyProps={{
												fontWeight: 500,
											}}
										/>
									</ListItemButton>
								</ListItem>
							</>
						)}
					</List>
				</Box>

				{/* Footer */}
				<Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
					<Typography variant="caption" sx={{ textAlign: 'center', display: 'block', opacity: 0.6 }}>
						Social Hub © 2024
					</Typography>
				</Box>
			</Box>
		</Drawer>
	);
}
