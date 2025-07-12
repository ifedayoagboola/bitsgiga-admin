import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { useAdminAuth } from "../../../core/redux/useAdminAuth";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const Register = () => {
  const route = all_routes;
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { register, isLoading, clearError } = useAdminAuth();
  const navigate = useNavigate();

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    // Clear any previous errors
    clearError();
  }, [clearError]);

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirmPassword) {
      MySwal.fire({
        title: "Error!",
        text: "Please fill in all required fields",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      MySwal.fire({
        title: "Error!",
        text: "Passwords do not match",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (formData.password.length < 8) {
      MySwal.fire({
        title: "Error!",
        text: "Password must be at least 8 characters long",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (!agreeToTerms) {
      MySwal.fire({
        title: "Error!",
        text: "You must agree to the Terms & Privacy",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Transform form data to match API format
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone_number: formData.phone_number || undefined,
      };

      const result = await register(userData);
      if (result.success) {
        MySwal.fire({
          title: "Success!",
          text: "Account created successfully! Welcome to Bitshub!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(route.dashboard);
        });
      } else {
        MySwal.fire({
          title: "Error!",
          text: result.error || "Registration failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      MySwal.fire({
        title: "Error!",
        text: "An unexpected error occurred",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        <div className="account-content">
          <div className="login-wrapper login-new">
            <div className="row w-100">
              <div className="col-lg-5 mx-auto">
                <div className="login-content user-login">
                  <div className="login-logo">
                    <ImageWithBasePath src="assets/img/logo.png" alt="img" />
                    <Link to={route.dashboard} className="login-logo logo-white">
                      <ImageWithBasePath src="assets/img/logo-white.png" alt="Img" />
                    </Link>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="card">
                      <div className="card-body p-5">
                        <div className="login-userheading">
                          <h3>Register</h3>
                          <h4>Create New Bitshub Account</h4>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            First Name <span className="text-danger"> *</span>
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="form-control border-end-0"
                              placeholder="Enter your first name"
                              required
                            />
                            <span className="input-group-text border-start-0">
                              <i className="ti ti-user" />
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Last Name <span className="text-danger"> *</span>
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className="form-control border-end-0"
                              placeholder="Enter your last name"
                              required
                            />
                            <span className="input-group-text border-start-0">
                              <i className="ti ti-user" />
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Email <span className="text-danger"> *</span>
                          </label>
                          <div className="input-group">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="form-control border-end-0"
                              placeholder="Enter your email"
                              required
                            />
                            <span className="input-group-text border-start-0">
                              <i className="ti ti-mail" />
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Phone Number
                          </label>
                          <div className="input-group">
                            <input
                              type="tel"
                              name="phone_number"
                              value={formData.phone_number}
                              onChange={handleInputChange}
                              className="form-control border-end-0"
                              placeholder="Enter your phone number"
                            />
                            <span className="input-group-text border-start-0">
                              <i className="ti ti-phone" />
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Password <span className="text-danger"> *</span>
                          </label>
                          <div className="pass-group">
                            <input
                              type={passwordVisibility.password ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="pass-input form-control"
                              placeholder="Enter your password"
                              required
                            />
                            <span
                              className={`ti toggle-password ${passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                                }`}
                              onClick={() => togglePasswordVisibility('password')}
                            ></span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Confirm Password <span className="text-danger"> *</span>
                          </label>
                          <div className="pass-group">
                            <input
                              type={passwordVisibility.confirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="pass-input form-control"
                              placeholder="Confirm your password"
                              required
                            />
                            <span
                              className={`ti toggle-password ${passwordVisibility.confirmPassword ? "ti-eye" : "ti-eye-off"
                                }`}
                              onClick={() => togglePasswordVisibility('confirmPassword')}
                            ></span>
                          </div>
                        </div>
                        <div className="form-login authentication-check">
                          <div className="row">
                            <div className="col-sm-8">
                              <div className="custom-control custom-checkbox justify-content-start">
                                <div className="custom-control custom-checkbox">
                                  <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                                    <input 
                                      type="checkbox" 
                                      checked={agreeToTerms}
                                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    />
                                    <span className="checkmarks" />I agree to the{" "}
                                    <Link to="#" className="text-primary">
                                      Terms &amp; Privacy
                                    </Link>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-login">
                          <button 
                            type="submit" 
                            className="btn btn-login w-100"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Creating Account...
                              </>
                            ) : (
                              "Sign Up"
                            )}
                          </button>
                        </div>
                        <div className="signinform">
                          <h4>
                            Already have an account ?{" "}
                            <Link to={route.signin} className="hover-a">
                              Sign In Instead
                            </Link>
                          </h4>
                        </div>
                        <div className="form-setlogin or-text">
                          <h4>OR</h4>
                        </div>
                        <div className="mt-2">
                          <div className="d-flex align-items-center justify-content-center flex-wrap">
                            <div className="text-center me-2 flex-fill">
                              <Link
                                to="#"
                                className="br-10 p-2 btn btn-info d-flex align-items-center justify-content-center"
                              >
                                <ImageWithBasePath
                                  className="img-fluid m-1"
                                  src="assets/img/icons/facebook-logo.svg"
                                  alt="Facebook"
                                />
                              </Link>
                            </div>
                            <div className="text-center me-2 flex-fill">
                              <Link
                                to="#"
                                className="btn btn-white br-10 p-2  border d-flex align-items-center justify-content-center"
                              >
                                <ImageWithBasePath
                                  className="img-fluid m-1"
                                  src="assets/img/icons/google-logo.svg"
                                  alt="Facebook"
                                />
                              </Link>
                            </div>
                            <div className="text-center flex-fill">
                              <Link
                                to="#"
                                className="bg-dark br-10 p-2 btn btn-dark d-flex align-items-center justify-content-center"
                              >
                                <ImageWithBasePath
                                  className="img-fluid m-1"
                                  src="assets/img/icons/apple-logo.svg"
                                  alt="Apple"
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                  <p>Copyright © 2025 Bitshub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Main Wrapper */}
    </>
  );
};

export default Register;
