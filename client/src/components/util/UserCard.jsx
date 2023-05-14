import {
  Grid,
  Typography,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserCard = (props) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate(`/profile/${props.user.id}`);
  };

  return (
    <Card variant="outlined" sx={{ mt: 2.5 }}>
      <CardActionArea>
        <CardContent sx={{ pt: 1, pb: 1 }} onClick={handleUserClick}>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <Avatar
                sx={{
                  height: 50,
                  width: 50,
                }}
                alt="User Profile Image"
                // src={require('../../assets/sample_avatar.png')}
              >
                {props.user.username[0].toUpperCase()}
              </Avatar>
            </Grid>

            <Grid
              item
              xs={0}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography>{props.user.username}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default UserCard;
