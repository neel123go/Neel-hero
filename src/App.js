import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Card } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
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
    setPassword(event.target.value);
  }

  const handleEmail = (event) => {
    setEmail(event.target.value);
  }

  const handleSignUp = event => {
    event.preventDefault();
    if (!signUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          setUser(result.user);
          setEmail('');
          setPassword('');
          console.log(result.user);
        }).catch(error => {
          setErrorMsg(error.message);
        })
    } else {
      signInWithEmailAndPassword(auth, email, password)
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

  const handleLogOut = () => {
    setUser({});
  }


  return (
    <div className="d-flex">
      <div className='w-100'>
        <h2 className='mt-5 text-primary text-center'>The original Hero <span className='text-danger'>Neel</span></h2>
        <Form onSubmit={handleSignUp} className='w-75 mx-auto border border-danger p-5 mt-5 rounded-3'>
          <h5 className='text-center mb-5 text-danger'>{errorMsg}</h5>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmail} autoComplete='off' type="email" placeholder="Enter your email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePassword} autoComplete='off' type="password" placeholder="Enter your Password" />
          </Form.Group>
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
