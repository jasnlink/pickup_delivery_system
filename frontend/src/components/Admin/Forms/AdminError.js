import { 
	Dialog,
	Box,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Button
 } from '@mui/material';

import ErrorIcon from '@mui/icons-material/Error';

import '../styles/Admin.css';

function AdminError({ error, setError, message }) {


	return (
	<>

		<Dialog classes={{ paper: "error-dialog", }} open={error} maxWidth="xs" fullWidth onClose={() => setError(false)}>
			<Box style={{ padding: '16px 8px' }}>
				<DialogTitle style={{display:'flex', justifyContent:'center', paddingBottom: 24}}>
					<ErrorIcon color="error" style={{fontSize:108}} />
				</DialogTitle>
				<DialogContent style={{display:'flex', justifyContent:'center'}}>
					<Typography align="center" variant="h5">{message}</Typography>
				</DialogContent>
				<DialogActions style={{display:'flex', justifyContent:'center', paddingTop: 8}}>
					<Button className="btn" variant="contained" size="large" fullWidth onClick={() => setError(false)}>
						OK
					</Button>
				</DialogActions>
			</Box>
		</Dialog>

	</>
	)

}
export default AdminError;

	