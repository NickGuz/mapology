import { useContext } from 'react'
import AuthContext from '../../auth/AuthContextProvider';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';

export default function CreateAccountErrorModal() {
    
    const { auth } = useContext(AuthContext);
    const handleClose = () => {
        auth.hideModal();
    }
    console.log(auth.shortPass);
    let msg = 
    <div>

    </div>
    if (auth.acctEmpt){
        msg =
        <Dialog
        open={auth.acctEmpt}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        backdrop = 'static'

      >
        <DialogTitle id="alert-dialog-title">
          {"Missing Required Field(s)"}
        </DialogTitle>
        <DialogContent>
          <Alert severity = "warning" id="alert-dialog-description">
            Please make sure you have entered ALL required information to create the account.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    }
    else if (auth.shortPass){
        msg =
        <Dialog
        open={auth.shortPass}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        backdrop = 'static'

      >
        <DialogTitle id="alert-dialog-title">
          {"Password Too Short"}
        </DialogTitle>
        <DialogContent>
        <Alert severity = "warning" id="alert-dialog-description">
            The password you have entered is too short. Password must be at least 8 characters.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    }
    else if (auth.notSamePass){
        msg =
        <Dialog
        open={auth.notSamePass}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        backdrop = 'static'

      >
        <DialogTitle id="alert-dialog-title">
          {"Failed to Verify Password"}
        </DialogTitle>
        <DialogContent>
          <Alert severity = "warning" id="alert-dialog-description">
            The verify password you have entered does not match with your password. Please try again.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    }
    else if (auth.registered){
        msg =
        <Dialog
        open={auth.registered}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        backdrop = 'static'

      >
        <DialogTitle id="alert-dialog-title">
          {"Registered Email"}
        </DialogTitle>
        <DialogContent>
          <Alert severity = "warning" id="alert-dialog-description">
            The email or username you have enter is already associated with an account. Please try again with a different email/username.
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