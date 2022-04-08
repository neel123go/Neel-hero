import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import app from './firebase.init';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Card } from 'react-bootstrap';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [user, setUser] = useState({});
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        setUser(result.user);
      }).catch(error => {
        console.error(error);
      })
  }

  const handleLogOut = () => {
    setUser({});
  }

  return (
    <div className="d-flex">
      <div className='w-100'>
        <h2 className='mt-5 text-primary text-center'>The original Hero <span className='text-danger'>Neel</span></h2>
        <Form className='w-75 mx-auto border border-danger p-5 mt-5 rounded-3'>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control autoComplete='off' type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control autoComplete='off' type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">Register</Button>
          <Button onClick={handleGoogleSignIn} className='ms-2'>Sign in with Google</Button>
        </Form>
      </div>
      {
        user.uid ? <div className='w-50' style={{ marginTop: '8em' }}>
          <Card style={{ width: '16rem' }}>
            <Card.Img className='w-50 mx-auto py-5' src={user.photoURL} />
            <Card.Body>
              <Card.Title>{user.displayName}</Card.Title>
              <Card.Text className='mt-2'>{user.email}</Card.Text>
              <Button onClick={handleLogOut} variant="primary">Log Out</Button>
            </Card.Body>
          </Card>
        </div> : ''
      }
    </div>
  );
}

export default App;
