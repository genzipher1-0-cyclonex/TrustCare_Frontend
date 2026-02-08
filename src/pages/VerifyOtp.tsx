import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { otpSchema, OtpFormData } from '../validators/auth.validators';
import { getErrorMessage } from '../utils/apiClient';

interface LocationState {
  username?: string;
  maskedEmail?: string;
}

const VerifyOtp: React.FC = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const state = location.state as LocationState;
  const username = state?.username;
  const maskedEmail = state?.maskedEmail;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Redirect if no username in state
  if (!username) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (data: OtpFormData): Promise<void> => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await verifyOtp({
        username,
        otp: data.otp,
      });
      // Navigation is handled by AuthContext after successful verification
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    setError('');
    setSuccess('');
    setIsResending(true);

    try {
      await resendOtp(username);
      setSuccess('A new OTP has been sent to your email');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsResending(false);
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
                    <i className="bi bi-shield-lock fs-2 text-primary"></i>
                  </div>
                  <h2 className="h4 mb-2">Verify OTP</h2>
                  <p className="text-muted small mb-0">
                    We've sent a 6-digit code to
                  </p>
                  <p className="text-primary fw-semibold mb-0">{maskedEmail}</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      className="text-center fs-4 fw-semibold"
                      style={{ letterSpacing: '0.5rem' }}
                      isInvalid={!!errors.otp}
                      {...register('otp')}
                      disabled={isLoading}
                      autoFocus
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.otp?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      The code expires in 5 minutes
                    </Form.Text>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={isLoading || isResending}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="small text-muted mb-2">Didn't receive the code?</p>
                    <Button
                      variant="link"
                      className="text-decoration-none p-0"
                      onClick={handleResendOtp}
                      disabled={isLoading || isResending}
                    >
                      {isResending ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Resending...
                        </>
                      ) : (
                        'Resend OTP'
                      )}
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />

                <div className="text-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VerifyOtp;
