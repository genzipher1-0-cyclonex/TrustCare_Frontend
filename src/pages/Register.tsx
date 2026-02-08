import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerSchema, RegisterFormData } from '../validators/auth.validators';
import { getErrorMessage } from '../utils/apiClient';

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { confirmPassword, ...formData } = data;
      // Always register as PATIENT
      const registerData = {
        ...formData,
        roleName: 'PATIENT'
      };
      await registerUser(registerData);
      setSuccess('Registration successful! Please login with OTP verification.');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      
      // Handle validation errors from backend
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="text-center mb-4">
              <h1 className="h2 text-primary fw-bold">TrustCare</h1>
              <p className="text-muted">Hospital Management System</p>
            </div>

            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <h2 className="h4 mb-4 text-center">Create Account</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      isInvalid={!!errors.username}
                      {...register('username')}
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Letters, numbers, and underscores only
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      isInvalid={!!errors.email}
                      {...register('email')}
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Create a strong password"
                      isInvalid={!!errors.password}
                      {...register('password')}
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {password && (
                    <div className="mb-3">
                      <div className="small">
                        <p className="mb-2 text-muted">Password Requirements:</p>
                        <ul className="list-unstyled mb-0">
                          <li className={password.length >= 8 ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${password.length >= 8 ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            At least 8 characters
                          </li>
                          <li className={/[A-Z]/.test(password) ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${/[A-Z]/.test(password) ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            One uppercase letter
                          </li>
                          <li className={/[a-z]/.test(password) ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${/[a-z]/.test(password) ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            One lowercase letter
                          </li>
                          <li className={/[0-9]/.test(password) ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${/[0-9]/.test(password) ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            One number
                          </li>
                          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            One special character
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm your password"
                      isInvalid={!!errors.confirmPassword}
                      {...register('confirmPassword')}
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-0 small text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="small text-muted">
                By registering, you agree to comply with HIPAA regulations
                <br />
                Registering as a Patient
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
