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
  const [storeImageFile, setStoreImageFile] = useState(null);

  // RTK Query hooks
  const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();

  // Helper: upload a single file to R2 using presigned PUT with fallback to base64
  const presignAndUpload = async (file) => {
    const apiBase = process.env.REACT_APP_API_URL;
    const safeName = String(file.name || 'file').trim().replace(/\s+/g, '-');
    const key = `media-dev/${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}-${safeName}`;
    const contentType = file.type || 'application/octet-stream';

    try {
      // Try to get presigned upload URL
      const presignRes = await fetch(`${apiBase}/uploads/presign?key=${encodeURIComponent(key)}&contentType=${encodeURIComponent(contentType)}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      // If upload service is not available (404), fall back to base64
      if (presignRes.status === 404) {
        console.warn('Upload service not available, falling back to base64');
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        });
      }
      
      if (!presignRes.ok) throw new Error('Failed to presign upload');
      
      const { data, url } = await presignRes.json();
      const uploadUrl = data?.url || url;
      if (!uploadUrl) throw new Error('Invalid presign response');

      // Upload file to R2
      const putRes = await fetch(uploadUrl, { 
        method: 'PUT', 
        headers: { 'Content-Type': contentType }, 
        body: file 
      });
      if (!putRes.ok) throw new Error('Upload failed');

      // Get viewable URL
      const viewRes = await fetch(`${apiBase}/uploads/view-url?key=${encodeURIComponent(key)}`, { 
        credentials: 'include' 
      });
      if (!viewRes.ok) throw new Error('Failed to presign view url');
      
      const { data: viewData, url: viewUrl } = await viewRes.json();
      return viewData?.url || viewUrl;
    } catch (error) {
      // If R2 upload fails, fall back to base64
      console.warn('R2 upload failed, falling back to base64:', error);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreImageFile(file);
      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (event) => {
        setStoreImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let imgUrl = null;
      
      // Upload image to R2 if provided (with fallback to base64)
      if (storeImageFile) {
        try {
          imgUrl = await presignAndUpload(storeImageFile);
          console.log('Image uploaded successfully:', imgUrl ? 'R2 URL' : 'Base64');
        } catch (e) {
          console.error('Image upload failed:', e);
          toast.error('Failed to upload store image');
          throw e;
        }
      }

      const storeData = {
        brand_name: values.brand_name,
        description: values.description,
        phone_number: values.phone_number,
        state: values.state,
        city: values.city,
        street: values.street,
        img_url: imgUrl || '',
      };

      await createStore(storeData).unwrap();
      
      toast.success("Store created successfully! Your application is under review.");
      
      // Reset form and state
      resetForm();
      setStoreImage(null);
      setStoreImageFile(null);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate(route.index);
      }, 2000);
    } catch (error) {
      console.error("Error creating store:", error);
      
      // Handle specific error cases (consistent with addproduct.jsx)
      if (error?.status === 401) {
        toast.error("Authentication required. Please log in again.");
        navigate('/signin');
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.error) {
        toast.error(error.error);
      } else {
        toast.error("Failed to create store. Please try again.");
      }
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
      <div className="d-flex flex-column min-vh-100">
        <div className="container-fluid py-5 flex-grow-1">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
                <div className="page-header text-center mb-4">
                  <div className="add-item d-flex flex-column align-items-center">
                    <div className="page-title">
                      <h4>Create Your First Store</h4>
                      <h6>Set up your store to start selling products</h6>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link to={route.index} className="btn btn-secondary">
                      <ArrowLeft className="me-2" />
                      Back to Dashboard
                    </Link>
                  </div>
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
                                  className={`form-control ${
                                    errors.brand_name && touched.brand_name ? "is-invalid" : ""
                                  }`}
                                  placeholder="Enter Store Name"
                                />
                                <ErrorMessage
                                  name="brand_name"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Phone Number<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="phone_number"
                                  className={`form-control ${
                                    errors.phone_number && touched.phone_number ? "is-invalid" : ""
                                  }`}
                                  placeholder="Enter Phone Number"
                                />
                                <ErrorMessage
                                  name="phone_number"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Description<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  as="textarea"
                                  name="description"
                                  className={`form-control ${
                                    errors.description && touched.description ? "is-invalid" : ""
                                  }`}
                                  rows="3"
                                  placeholder="Enter Store Description"
                                />
                                <ErrorMessage
                                  name="description"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="mb-3">
                                <label className="form-label">Store Image</label>
                                <input
                                  type="file"
                                  className="form-control"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                                {storeImage && (
                                  <div className="mt-2">
                                    <img
                                      src={storeImage}
                                      alt="Store Preview"
                                      className="img-thumbnail"
                                      style={{ maxWidth: "150px" }}
                                    />
                                  </div>
                                )}
                              </div>
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
                          aria-expanded="false"
                          aria-controls="SpacingTwo"
                        >
                          <div className="d-flex align-items-center justify-content-between flex-fill">
                            <h5 className="d-flex align-items-center">
                              <Info className="text-primary me-2"/>
                              <span>Address Information</span>
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
                                  className={`form-control ${
                                    errors.state && touched.state ? "is-invalid" : ""
                                  }`}
                                  placeholder="Enter State"
                                />
                                <ErrorMessage
                                  name="state"
                                  component="div"
                                  className="text-danger"
                                />
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
                                  className={`form-control ${
                                    errors.city && touched.city ? "is-invalid" : ""
                                  }`}
                                  placeholder="Enter City"
                                />
                                <ErrorMessage
                                  name="city"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Street Address<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="street"
                                  className={`form-control ${
                                    errors.street && touched.street ? "is-invalid" : ""
                                  }`}
                                  placeholder="Enter Street Address"
                                />
                                <ErrorMessage
                                  name="street"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || isCreating}
                  >
                    {isCreating ? "Creating Store..." : "Create Store"}
                  </button>
                </div>
              </Form>
            )}
                </Formik>
            </div>
          </div>
        </div>
        
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3 mt-auto">
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
