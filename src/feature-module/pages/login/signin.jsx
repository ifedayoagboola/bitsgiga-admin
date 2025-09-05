import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { all_routes } from "../../../Router/all_routes";
import { useAdminAuth } from "../../../core/redux/useAdminAuth";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const Signin = () => {
  const route = all_routes;
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoading, clearError } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const MySwal = withReactContent(Swal);

  // Get the return URL from location state
  const from = location.state?.from?.pathname || route.dashboard;

  useEffect(() => {
    // Clear any previous errors
    clearError();
  }, [clearError]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      MySwal.fire({
        title: "Error!",
        text: "Please fill in all fields",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const result = await login(formData);
      if (result.success) {
        MySwal.fire({
          title: "Success!",
          text: "Login successful",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(from, { replace: true });
        });
      } else {
        MySwal.fire({
          title: "Error!",
          text: result.error || "Login failed",
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
                          <h3>Sign In</h3>
                          <h4>
                            Access the Bitshub panel using your email and
                            password. (Dev branch)
                          </h4>
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
                            Password <span className="text-danger"> *</span>
                          </label>
                          <div className="pass-group">
                            <input
                              type={isPasswordVisible ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="pass-input form-control"
                              placeholder="Enter your password"
                              required
                            />
                            <span
                              className={`ti toggle-password ${isPasswordVisible ? "ti-eye" : "ti-eye-off"
                                }`}
                              onClick={togglePasswordVisibility}
                            ></span>
                          </div>
                        </div>
                        <div className="form-login authentication-check">
                          <div className="row">
                            <div className="col-12 d-flex align-items-center justify-content-between">
                              <div className="custom-control custom-checkbox">
                                <label className="checkboxs ps-4 mb-0 pb-0 line-height-1 fs-16 text-gray-6">
                                  <input 
                                    type="checkbox" 
                                    className="form-control"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                  />
                                  <span className="checkmarks" />
                                  Remember me
                                </label>
                              </div>
                              <div className="text-end">
                                <Link
                                  className="text-orange fs-16 fw-medium"
                                  to={route.forgotPassword}
                                >
                                  Forgot Password?
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-login">
                          <button 
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Signing In...
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </button>
                        </div>
                        <div className="signinform">
                          <h4>
                            New on our platform?
                            <Link to={route.register} className="hover-a">
                              {" "}
                              Create an account
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

export default Signin;
