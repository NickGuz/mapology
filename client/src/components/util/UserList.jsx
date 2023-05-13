import { useContext } from 'react';
import AuthContext from '../../auth/AuthContextProvider';
import UserCard from './UserCard';
import { Stack } from '@mui/material';

const UserList = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div>
      <Stack spacing={2}>
        {auth.displayedUsers.map((user, i) => (
          <UserCard key={i} user={user} />
        ))}
      </Stack>
    </div>
  );
};

export default UserList;
