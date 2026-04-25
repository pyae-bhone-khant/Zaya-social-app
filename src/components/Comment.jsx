import {
    Avatar,
    Box, 
    Typography,
    IconButton
} from "@mui/material";
import { DeleteOutline as DeleteIcon } from "@mui/icons-material";

import { green } from "@mui/material/colors";
import { useApp } from "../AppProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";

const commentApi = "http://localhost:8800/comments";

export default function Comment({ comment }) {
	const { auth } = useApp();
	const queryClient = useQueryClient();
	const { id: postId } = useParams();
	const navigate = useNavigate();

	const handleDelete = async () => {
		const token = localStorage.getItem('token');
		
		const res = await fetch(`${commentApi}/${comment.id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`,
			},
		});

		if (res.ok) {
			queryClient.invalidateQueries({ queryKey: ['post', postId] });
		}
	};
	return (
		<Box sx={{ mb: 2, p: 3, border: "1px solid #99999930" }}>
			<Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
				<Box sx={{ display: "flex", gap: 2 }}>
					<Box>
						<Avatar
							sx={{ width: 48, height: 48, background: "gray" }}
						/>
					</Box>
					<Box>
						<Typography 
							sx={{ 
								fontWeight: "bold",
								cursor: 'pointer',
								'&:hover': {
									textDecoration: 'underline'
								}
							}}
							onClick={() => navigate(`/profile/${comment.user.username}`)}
						>
							{comment.user.name}
						</Typography>
						<Typography sx={{ color: green[500] }}>
							{comment.createAt}
						</Typography>
						<Typography>
							{comment.content}
						</Typography>
					</Box>
				</Box>
				{auth && auth.id === comment.userId && (
					<Box>
						<IconButton 
							onClick={handleDelete}
							color="error"
							size="small"
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				)}
			</Box>
		</Box>
	);
}
