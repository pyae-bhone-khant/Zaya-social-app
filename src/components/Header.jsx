import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Box,
	Avatar,
} from "@mui/material";

import {
	Menu as MenuIcon,
	LightMode as LightModeIcon,
	DarkMode as DarkModeIcon,
    ArrowBack as BackIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider";
import { useLocation, useNavigate } from "react-router";

export default function Header() {
	const { mode, setMode, setShowDrawer, auth } = useApp();

    const { pathname } = useLocation();
    const navigate = useNavigate();

	return (
		<AppBar 
			position="sticky" 
			elevation={0}
			sx={{
				backdropFilter: 'blur(10px)',
				background: mode === 'dark'
					? 'rgba(30, 30, 46, 0.9)'
					: 'rgba(255, 255, 255, 0.9)',
			}}
		>
			<Toolbar sx={{ minHeight: 72 }}>
				{pathname == "/" ? (
					<IconButton
						color="primary"
						sx={{ 
							mr: 2,
							bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
							'&:hover': {
								bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)',
							}
						}}
						onClick={() => setShowDrawer(true)}>
						<MenuIcon />
					</IconButton>
				) : (
					<IconButton
						color="primary"
						sx={{ 
							mr: 2,
							bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
							'&:hover': {
								bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)',
							}
						}}
						onClick={() => navigate("/")}>
						<BackIcon />
					</IconButton>
				)}

				<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography 
						variant="h5" 
						component="h1"
						sx={{
							fontWeight: 700,
							background: mode === 'dark'
								? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
								: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							letterSpacing: '-0.5px',
						}}
					>
						Social Hub
					</Typography>
					{auth && (
						<Box
							sx={{
								width: 8,
								height: 8,
								borderRadius: '50%',
								bgcolor: 'success.main',
								animation: 'pulse 2s infinite',
								'@keyframes pulse': {
									'0%': { transform: 'scale(1)', opacity: 1 },
									'50%': { transform: 'scale(1.2)', opacity: 0.7 },
									'100%': { transform: 'scale(1)', opacity: 1 },
								}
							}}
						/>
					)}
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{auth && (
						<Avatar
							sx={{ 
								width: 36, 
								height: 36,
								bgcolor: 'primary.main',
								fontSize: '0.875rem',
								fontWeight: 600,
								mr: 1,
								boxShadow: mode === 'dark'
									? '0 2px 8px rgba(99, 102, 241, 0.3)'
									: '0 2px 8px rgba(79, 70, 229, 0.2)',
							}}
						>
							{auth.username ? auth.username.charAt(0).toUpperCase() : 'U'}
						</Avatar>
					)}
					
					<IconButton
						color="primary"
						sx={{
							bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
							'&:hover': {
								bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)',
								transform: 'rotate(20deg)',
							},
							transition: 'all 0.3s ease',
						}}
						onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
						{mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
