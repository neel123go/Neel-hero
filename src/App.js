import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Card } from 'react-bootstrap';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const auth = getAuth(app);

function App() {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [userName, setUserName] = useState({ value: '', error: '' });
  const [signUp, setSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        setUser(result.user);
      }).catch(error => {
        console.error(error);
      })
  }

  const handleSignUpSingIn = (event) => {
    setSignUp(event.target.checked);
  }

  const handlePassword = (event) => {
    if (/(?=.*\d)(?=.*[A-Z])/.test(event.target.value)) {
      setPassword({ value: event.target.value, error: '' });
    } else {
      setPassword({ value: '', error: 'Your password contains at least one digit & one uppercase character' });
    }
  }

  const handleEmail = (event) => {
    setEmail({ value: event.target.value, error: '' });
  }

  const handleUserName = (event) => {
    if (/^[a-zA-Z\-]+$/.test(event.target.value)) {
      setUserName({ value: event.target.value, error: '' });
    } else {
      setUserName({ value: '', error: 'Invalid user name' });
    }
  }

  const handleSignUp = event => {
    event.preventDefault();
    if (email.value === '') {
      setEmail({ value: '', error: 'Email is required' });
    }

    if (password.value === '') {
      setPassword({ value: '', error: 'Password is required' });
    }

    if (email.value && password.value) {
      if (!signUp) {
        createUserWithEmailAndPassword(auth, email.value, password.value)
          .then(result => {
            setUser(result.user);
            setEmail('');
            setPassword('');
            toast.success('User created successfully', { id: 'success' });
            console.log(result.user);
          }).catch(error => {
            if (error.message.includes('email-already-in-use')) {
              toast.error('User already exist', { id: 'error' });
            }
          })
      } else {
        signInWithEmailAndPassword(auth, email.value, password.value)
          .then(result => {
            setUser(result.user);
            setEmail('');
            setPassword('');
          }).catch(() => {
            setErrorMsg('Your Email or Password was not matched');
          })
      }
      event.preventDefault();
    }
  }

  const handleLogOut = () => {
    setUser({});
    toast.success('User logout successfully', { id: 'logout' });
  }


  return (
    <div className="d-flex">
      <Toaster />
      <div className='w-100'>
        <h2 className='mt-5 pt-5 text-primary text-center'>The original Hero <span className='text-danger'>Neel</span></h2>
        <Form onSubmit={handleSignUp} className='w-75 mx-auto border border-danger p-5 mt-5 rounded-3'>
          <h5 className='text-center mb-5 text-danger'>{errorMsg}</h5>
          {
            !signUp ? <Form.Group className="mb-3">
              <Form.Label className='fs-5'>User Name</Form.Label>
              <Form.Control onBlur={handleUserName} autoComplete='off' type="text" placeholder="Enter your user name" />
            </Form.Group> : ''
          }

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className='fs-5'>Email address</Form.Label>
            <Form.Control onBlur={handleEmail} autoComplete='off' type="email" placeholder="Enter your email" />
          </Form.Group>
          {
            email?.error && <p className='text-danger' style={{ marginTop: '-10px' }}>{email.error}</p>
          }
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className='fs-5'>Password</Form.Label>
            <Form.Control onBlur={handlePassword} autoComplete='off' type="password" placeholder="Enter your Password" />
          </Form.Group>
          {
            password?.error && <p className='text-danger' style={{ marginTop: '-10px' }}>{password.error}</p>
          }
          <Form.Group className="my-4" controlId="formBasicCheckbox">
            <Form.Check onClick={handleSignUpSingIn} type="checkbox" label="Already SignUp?" />
          </Form.Group>
          <Button type="submit">{signUp ? 'Log In' : 'Sign Up'}</Button>
          <Button onClick={handleGoogleSignIn} className='ms-2'>Sign in with Google</Button>
        </Form>
      </div>
      {
        user.uid ? <div className='w-50' style={{ marginTop: '8em' }}>
          <Card style={{ width: '20rem' }}>
            <Card.Img className='w-75 mx-auto px-3 py-5' src={user.photoURL ? user.photoURL : 'not found'} alt="picture not found" />
            <Card.Body>
              <Card.Title>{user.displayName ? user.displayName : 'User name not found'}</Card.Title>
              <Card.Text className='mt-2'>{user.email ? user.email : 'User email not found'}</Card.Text>
              <Button onClick={handleLogOut} variant="primary">Log Out</Button>
            </Card.Body>
          </Card>
        </div> : ''
      }
    </div>
  );
}

export default App;
