import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resetPasswordSchema, ResetPasswordFormData } from '../validators/auth.validators';
import { getErrorMessage } from '../utils/apiClient';

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { confirmPassword, ...resetData } = data;
      await resetPassword(resetData);
      setSuccess('Password has been reset successfully! Redirecting to login...');
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
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '64px', height: '64px' }}>
                    <i className="bi bi-shield-lock fs-2 text-primary"></i>
                  </div>
                  <h2 className="h4 mb-2">Reset Password</h2>
                  <p className="text-muted small">
                    Enter the reset token from your email and create a new password
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Reset Token</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter 8-character reset token"
                      maxLength={8}
                      className="text-uppercase"
                      isInvalid={!!errors.token}
                      {...register('token')}
                      disabled={isLoading}
                      autoFocus={!tokenFromUrl}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.token?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Check your email for the reset token
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Create a strong password"
                      isInvalid={!!errors.newPassword}
                      {...register('newPassword')}
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.newPassword?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {newPassword && (
                    <div className="mb-3">
                      <div className="small">
                        <p className="mb-2 text-muted">Password Requirements:</p>
                        <ul className="list-unstyled mb-0">
                          <li className={newPassword.length >= 8 ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${newPassword.length >= 8 ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            At least 8 characters
                          </li>
                          <li className={/[A-Z]/.test(newPassword) ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${/[A-Z]/.test(newPassword) ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            One uppercase letter
                          </li>
                          <li className={/[a-z]/.test(newPassword) ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${/[a-z]/.test(newPassword) ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            One lowercase letter
                          </li>
                          <li className={/[0-9]/.test(newPassword) ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${/[0-9]/.test(newPassword) ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            One number
                          </li>
                          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-success' : 'text-muted'}>
                            <i className={`bi bi-${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'check-circle-fill' : 'circle'} me-2`}></i>
                            One special character
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm your new password"
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
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;
