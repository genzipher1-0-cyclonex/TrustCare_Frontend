import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../validators/auth.validators';
import { getErrorMessage } from '../utils/apiClient';

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await forgotPassword(data);
      setSuccess(
        'If the email exists in our system, a password reset token has been sent. Please check your email.'
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-4">
              <h1 className="h2 text-primary fw-bold">TrustCare</h1>
              <p className="text-muted">Hospital Management System</p>
            </div>

            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '64px', height: '64px' }}>
                    <i className="bi bi-key fs-2 text-primary"></i>
                  </div>
                  <h2 className="h4 mb-2">Forgot Password?</h2>
                  <p className="text-muted small">
                    Enter your email address and we'll send you a reset token
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && (
                  <Alert variant="success">
                    {success}
                    <hr />
                    <div className="d-flex justify-content-center">
                      <Link to="/reset-password" className="btn btn-success btn-sm">
                        Enter Reset Token
                      </Link>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      isInvalid={!!errors.email}
                      {...register('email')}
                      disabled={isLoading}
                      autoFocus
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
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
                        Sending...
                      </>
                    ) : (
                      'Send Reset Token'
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="small text-muted mb-2">Remember your password?</p>
                  <Link to="/login" className="btn btn-outline-secondary btn-sm">
                    Back to Login
                  </Link>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="small text-muted">
                For security, the reset token expires in 1 hour
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
