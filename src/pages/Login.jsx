import { Alert, Button, OutlinedInput, Typography, Paper, Box, Link } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";
import { Login as LoginIcon, Person as PersonIcon } from "@mui/icons-material";

const api = "http://localhost:8800/users/login";

export default function Login() {
	const [error, setError] = useState(false);
	const navigate = useNavigate();

    const { setAuth, mode } = useApp();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const login = async data => {
		const res = await fetch(api, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
		

        if(res.ok) {
            const { user, token } = await res.json();
            setAuth(user);
            localStorage.setItem("token", token);
            navigate("/");
        } else {
            setError(true);
        }
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', py: 4 }}>
			<Paper
				elevation={3}
				sx={{
					p: 4,
					width: '100%',
					maxWidth: 400,
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
				{/* Header */}
				<Box sx={{ textAlign: 'center', mb: 4 }}>
					<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
						<Box
							sx={{
								width: 64,
								height: 64,
								borderRadius: '50%',
								bgcolor: 'primary.main',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: mode === 'dark'
									? '0 8px 24px rgba(99, 102, 241, 0.3)'
									: '0 8px 24px rgba(79, 70, 229, 0.2)',
							}}
						>
							<LoginIcon sx={{ fontSize: 32, color: 'white' }} />
						</Box>
					</Box>
					<Typography
						variant="h4"
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
						Welcome Back
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Sign in to your account
					</Typography>
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
						Unable to login. Please check your credentials.
					</Alert>
				)}

				<form onSubmit={handleSubmit(login)}>
					<OutlinedInput
						{...register("username", { required: true })}
						sx={{ mt: 2, mb: 1 }}
						placeholder="Username"
						fullWidth
						startAdornment={<PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />}
					/>
					{errors.username && (
						<Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
							Username is required
						</Typography>
					)}

					<OutlinedInput
						{...register("password", { required: true })}
						type="password"
						sx={{ mt: 2, mb: 1 }}
						placeholder="Password"
						fullWidth
					/>
					{errors.password && (
						<Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
							Password is required
						</Typography>
					)}

					<Button
						type="submit"
						variant="contained"
						fullWidth
						sx={{
							mt: 3,
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
						Sign In
					</Button>

					<Box sx={{ textAlign: 'center', mt: 3 }}>
						<Typography variant="body2" color="text.secondary">
							Don't have an account?{' '}
							<Link
								href="/register"
								sx={{
									color: 'primary.main',
									textDecoration: 'none',
									fontWeight: 500,
									'&:hover': {
										textDecoration: 'underline',
									},
								}}
								onClick={(e) => {
									e.preventDefault();
									navigate('/register');
								}}
							>
								Sign up
							</Link>
						</Typography>
					</Box>
				</form>
			</Paper>
		</Box>
	);
}
