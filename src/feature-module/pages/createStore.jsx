import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { all_routes } from "../../Router/all_routes";
import { useCreateStoreMutation } from "../../core/redux/api";
import {
  ArrowLeft,
  Info,
  Home,
} from "feather-icons-react/build/IconComponents";

// Validation schema
const StoreSchema = Yup.object().shape({
  brand_name: Yup.string()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name must be less than 100 characters")
    .required("Store name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  phone_number: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  street: Yup.string().required("Street address is required"),
});

const CreateStore = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const [storeImage, setStoreImage] = useState(null);

  // RTK Query hooks
  const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoreImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const storeData = {
        brand_name: values.brand_name,
        description: values.description,
        phone_number: values.phone_number,
        state: values.state,
        city: values.city,
        street: values.street,
        img_url: storeImage,
      };

      await createStore(storeData).unwrap();
      
      toast.success("Store created successfully! Your application is under review.");
      resetForm();
      setStoreImage(null);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate(route.index);
      }, 2000);
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error(error?.data?.message || "Failed to create store");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    brand_name: "",
    description: "",
    phone_number: "",
    state: "",
    city: "",
    street: "",
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Create Your First Store</h4>
                <h6>Set up your store to start selling products</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <div className="page-btn">
                  <Link to={route.index} className="btn btn-secondary">
                    <ArrowLeft className="me-2" />
                    Back to Dashboard
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={StoreSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="create-store-form">
                <div className="create-store">
                  <div className="accordions-items-seperate" id="accordionSpacingExample">
                    <div className="accordion-item border mb-4">
                      <h2 className="accordion-header" id="headingSpacingOne">
                        <div
                          className="accordion-button collapsed bg-white"
                          data-bs-toggle="collapse"
                          data-bs-target="#SpacingOne"
                          aria-expanded="true"
                          aria-controls="SpacingOne"
                        >
                          <div className="d-flex align-items-center justify-content-between flex-fill">
                            <h5 className="d-flex align-items-center">
                              <Home className="text-primary me-2"/>
                              <span>Store Information</span>
                            </h5>
                          </div>
                        </div>
                      </h2>
                      <div
                        id="SpacingOne"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingSpacingOne"
                      >
                        <div className="accordion-body border-top">
                          <div className="row">
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Store Name<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="brand_name"
                                  className={`form-control ${errors.brand_name && touched.brand_name ? 'is-invalid' : ''}`}
                                  placeholder="Enter store name"
                                />
                                <ErrorMessage name="brand_name" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Phone Number<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="tel"
                                  name="phone_number"
                                  className={`form-control ${errors.phone_number && touched.phone_number ? 'is-invalid' : ''}`}
                                  placeholder="Enter phone number"
                                />
                                <ErrorMessage name="phone_number" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <div className="col-lg-12">
                            <div className="summer-description-box">
                              <label className="form-label">Store Description<span className="text-danger ms-1">*</span></label>
                              <Field
                                as="textarea"
                                name="description"
                                className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                                placeholder="Describe your store and what you sell"
                                rows="4"
                              />
                              <ErrorMessage name="description" component="div" className="text-danger mt-1" />
                              <p className="fs-14 mt-1">Maximum 500 characters</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item border mb-4">
                      <h2 className="accordion-header" id="headingSpacingTwo">
                        <div
                          className="accordion-button collapsed bg-white"
                          data-bs-toggle="collapse"
                          data-bs-target="#SpacingTwo"
                          aria-expanded="true"
                          aria-controls="SpacingTwo"
                        >
                          <div className="d-flex align-items-center justify-content-between flex-fill">
                            <h5 className="d-flex align-items-center">
                              <Info className="text-primary me-2" />
                              <span>Store Address</span>
                            </h5>
                          </div>
                        </div>
                      </h2>
                      <div
                        id="SpacingTwo"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingSpacingTwo"
                      >
                        <div className="accordion-body border-top">
                          <div className="row">
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  State<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="state"
                                  className={`form-control ${errors.state && touched.state ? 'is-invalid' : ''}`}
                                  placeholder="Enter state"
                                />
                                <ErrorMessage name="state" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  City<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="city"
                                  className={`form-control ${errors.city && touched.city ? 'is-invalid' : ''}`}
                                  placeholder="Enter city"
                                />
                                <ErrorMessage name="city" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Street Address<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="street"
                                  className={`form-control ${errors.street && touched.street ? 'is-invalid' : ''}`}
                                  placeholder="Enter street address"
                                />
                                <ErrorMessage name="street" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item border mb-4">
                      <h2 className="accordion-header" id="headingSpacingThree">
                        <div
                          className="accordion-button collapsed bg-white"
                          data-bs-toggle="collapse"
                          data-bs-target="#SpacingThree"
                          aria-expanded="true"
                          aria-controls="SpacingThree"
                        >
                          <div className="d-flex align-items-center justify-content-between flex-fill">
                            <h5 className="d-flex align-items-center">
                              <Info className="text-primary me-2" />
                              <span>Store Image</span>
                            </h5>
                          </div>
                        </div>
                      </h2>
                      <div
                        id="SpacingThree"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingSpacingThree"
                      >
                        <div className="accordion-body border-top">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mb-3">
                                <label className="form-label">Store Logo/Image</label>
                                <div className="upload-area">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleImageChange}
                                  />
                                  <p className="fs-14 mt-1 text-muted">
                                    Recommended size: 300x300 pixels. Max file size: 5MB
                                  </p>
                                </div>
                                {storeImage && (
                                  <div className="mt-3">
                                    <img
                                      src={storeImage}
                                      alt="Store preview"
                                      className="img-thumbnail"
                                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-12">
                  <div className="d-flex align-items-center justify-content-end mb-4">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2"
                      onClick={() => navigate(route.index)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting || isCreating}
                    >
                      {isSubmitting || isCreating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Store...
                        </>
                      ) : (
                        "Create Store"
                      )}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0 text-gray-9">
            2019 - 2025 © Bitshub. All Right Reserved
          </p>
          <p>
            Designed &amp; Developed by{" "}
            <Link to="#" className="text-primary">
              Bitshub
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default CreateStore; 