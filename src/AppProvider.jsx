import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState, createContext, useContext, useMemo, useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Router from "./Router";

const AppContext = createContext();
const queryClient = new QueryClient();

const api = "http://localhost:8800/users/verify";
const token = localStorage.getItem("token");

export default function AppProvider() {
	const [mode, setMode] = useState("dark");
	const [showDrawer, setShowDrawer] = useState(false);
	const [auth, setAuth] = useState();

    useEffect(() => {
        if(token) {
            fetch(api, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then(async res => {
                if(res.ok) {
                    const user = await res.json();
                    setAuth(user);
                } else {
                    localStorage.removeItem("token");
                }
            });
        }
    }, []);

	const theme = useMemo(() => {
		return createTheme({
			palette: {
				mode,
				primary: {
					main: mode === 'dark' ? '#6366f1' : '#4f46e5',
					light: mode === 'dark' ? '#818cf8' : '#6366f1',
					dark: mode === 'dark' ? '#4f46e5' : '#3730a3',
					contrastText: '#ffffff',
				},
				secondary: {
					main: mode === 'dark' ? '#f43f5e' : '#e11d48',
					light: mode === 'dark' ? '#fb7185' : '#f43f5e',
					dark: mode === 'dark' ? '#e11d48' : '#be123c',
					contrastText: '#ffffff',
				},
				background: {
					default: mode === 'dark' ? '#0f0f23' : '#f8fafc',
					paper: mode === 'dark' ? '#1e1e2e' : '#ffffff',
				},
				text: {
					primary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
					secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
				},
				divider: mode === 'dark' ? '#334155' : '#e2e8f0',
				error: {
					main: '#ef4444',
				},
				warning: {
					main: '#f59e0b',
				},
				success: {
					main: '#10b981',
				},
				info: {
					main: '#06b6d4',
				},
			},
			typography: {
				fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
				h1: {
					fontWeight: 700,
					fontSize: '2.5rem',
					lineHeight: 1.2,
					background: mode === 'dark' 
						? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
						: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					backgroundClip: 'text',
				},
				h2: {
					fontWeight: 600,
					fontSize: '2rem',
					lineHeight: 1.3,
				},
				h3: {
					fontWeight: 600,
					fontSize: '1.5rem',
					lineHeight: 1.4,
				},
				h4: {
					fontWeight: 600,
					fontSize: '1.25rem',
					lineHeight: 1.4,
				},
				body1: {
					fontSize: '1rem',
					lineHeight: 1.6,
				},
				body2: {
					fontSize: '0.875rem',
					lineHeight: 1.5,
				},
				button: {
					textTransform: 'none',
					fontWeight: 500,
				},
			},
			shape: {
				borderRadius: 12,
			},
			components: {
				MuiButton: {
					styleOverrides: {
						root: {
							borderRadius: 12,
							padding: '10px 24px',
							fontWeight: 500,
							textTransform: 'none',
							boxShadow: 'none',
							'&:hover': {
								boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
							},
						},
						contained: {
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							'&:hover': {
								background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
							},
						},
					},
				},
				MuiPaper: {
					styleOverrides: {
						root: {
							backgroundImage: 'none',
							border: mode === 'dark' 
								? '1px solid rgba(255, 255, 255, 0.1)' 
								: '1px solid rgba(0, 0, 0, 0.05)',
						},
						elevation1: {
							boxShadow: mode === 'dark'
								? '0 2px 8px rgba(0, 0, 0, 0.3)'
								: '0 2px 8px rgba(0, 0, 0, 0.1)',
						},
						elevation2: {
							boxShadow: mode === 'dark'
								? '0 4px 16px rgba(0, 0, 0, 0.4)'
								: '0 4px 16px rgba(0, 0, 0, 0.15)',
						},
						elevation3: {
							boxShadow: mode === 'dark'
								? '0 8px 24px rgba(0, 0, 0, 0.5)'
								: '0 8px 24px rgba(0, 0, 0, 0.2)',
						},
					},
				},
				MuiAppBar: {
					styleOverrides: {
						root: {
							background: mode === 'dark'
								? 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)'
								: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
							borderBottom: mode === 'dark'
								? '1px solid rgba(255, 255, 255, 0.1)'
								: '1px solid rgba(0, 0, 0, 0.05)',
							boxShadow: mode === 'dark'
								? '0 2px 8px rgba(0, 0, 0, 0.3)'
								: '0 2px 8px rgba(0, 0, 0, 0.1)',
						},
					},
				},
				MuiDrawer: {
					styleOverrides: {
						paper: {
							background: mode === 'dark'
								? 'linear-gradient(180deg, #1e1e2e 0%, #2d2d44 100%)'
								: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
							borderRight: mode === 'dark'
								? '1px solid rgba(255, 255, 255, 0.1)'
								: '1px solid rgba(0, 0, 0, 0.05)',
						},
					},
				},
				MuiOutlinedInput: {
					styleOverrides: {
						root: {
							borderRadius: 12,
							'&:hover .MuiOutlinedInput-notchedOutline': {
								borderColor: mode === 'dark' ? '#6366f1' : '#4f46e5',
							},
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
								borderColor: mode === 'dark' ? '#6366f1' : '#4f46e5',
								borderWidth: 2,
							},
						},
					},
				},
				MuiCard: {
					styleOverrides: {
						root: {
							borderRadius: 16,
							overflow: 'hidden',
						},
					},
				},
			},
		});
	}, [mode]);

	return (
		<AppContext.Provider
			value={{ mode, setMode, showDrawer, setShowDrawer, auth, setAuth }}>
			<ThemeProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<Router />
					<CssBaseline />
				</QueryClientProvider>
			</ThemeProvider>
		</AppContext.Provider>
	);
}

export function useApp() {
	return useContext(AppContext);
}
