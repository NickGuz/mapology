import { useContext } from 'react'
import AuthContext from '../../auth/AuthContextProvider';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';


export default function IncorrectLoginModal() {
    
    const { auth } = useContext(AuthContext);
    const handleClose = () => {
        auth.hideLoginModal();
    }
    let msg = 
    <div>

    </div>
    if (auth.incorrectInfo){
        msg =
        <Dialog
        open={auth.incorrectInfo}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        backdrop = 'static'

      >
        <DialogTitle id="alert-dialog-title">
          {"Invalid Email or Password"}
        </DialogTitle>
        <DialogContent>
          <Alert severity = "warning" id="alert-dialog-description">
            Please make sure you have entered the correct email and password.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    }
    else if (auth.emptyInfo){
        msg =
        <Dialog
        open={auth.emptyInfo}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        backdrop = 'static'

      >
        <DialogTitle id="alert-dialog-title">
          {"Empty Email or Password"}
        </DialogTitle>
        <DialogContent>
          <Alert severity = "warning" id="alert-dialog-description">
            Please make sure to enter both an email and a password.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    }
    return (
        msg
    );
}