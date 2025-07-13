import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import {
  ArrowLeft,
  Info,
  LifeBuoy,
  Upload,
  X,
  Plus,
  Package,
  DollarSign,
} from "feather-icons-react/build/IconComponents";
import RefreshIcon from "../../core/common/tooltip-content/refresh";
import CollapesIcon from "../../core/common/tooltip-content/collapes";
import AddVariant from "../../core/modals/inventory/addvariant";
import AddVarientNew from "../../core/modals/inventory/addVarientNew";
import CommonTagsInput from "../../core/common/Taginput";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { 
  useCreateProductMutation, 
  useCreateProductVariantMutation,
  useCreateProductVariantSpecMutation,
  useGetCategoriesQuery, 
  useGetStoresQuery 
} from "../../core/redux/api";
import toast from "react-hot-toast";

// Validation schema for the complete product creation
const ProductSchema = Yup.object().shape({
  // Product Information
  name: Yup.string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be less than 100 characters")
    .required("Product name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .required("Description is required"),
  category_id: Yup.string().required("Category is required"),
  store_id: Yup.string().required("Store is required"),
  estimated_delivery_duration: Yup.number()
    .min(1, "Delivery duration must be at least 1 day")
    .max(365, "Delivery duration must be less than 365 days")
    .required("Delivery duration is required"),
  
  // Product Variant Information
  color: Yup.string().required("Color is required"),
  video_url: Yup.string().url("Please enter a valid URL").optional(),
  
  // Product Variant Spec Information
  size: Yup.string().required("Size is required"),
  quantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  amount: Yup.number()
    .min(0.01, "Price must be greater than 0")
    .required("Price is required"),
});

const AddProduct = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);

  // RTK Query hooks
  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation();
  const [createProductVariant, { isLoading: isCreatingVariant }] = useCreateProductVariantMutation();
  const [createProductVariantSpec, { isLoading: isCreatingSpec }] = useCreateProductVariantSpecMutation();
  const { data: categoriesResponse, isLoading: isLoadingCategories, error: categoriesError } = useGetCategoriesQuery();
  const { data: storesResponse, isLoading: isLoadingStores, error: storesError } = useGetStoresQuery();

  // Extract data from response and provide fallback
  const categories = categoriesResponse?.data || [];
  const stores = storesResponse?.data || [];

  // Transform data for react-select with null checks
  const categoryOptions = Array.isArray(categories) ? categories.map(cat => ({
    value: cat.id,
    label: cat.category
  })) : [];

  const storeOptions = Array.isArray(stores) ? stores.map(store => ({
    value: store.id,
    label: store.brand_name
  })) : [];

  // Predefined options for colors and sizes
  const colorOptions = [
    { value: "Red", label: "Red" },
    { value: "Blue", label: "Blue" },
    { value: "Green", label: "Green" },
    { value: "Yellow", label: "Yellow" },
    { value: "Black", label: "Black" },
    { value: "White", label: "White" },
    { value: "Gray", label: "Gray" },
    { value: "Purple", label: "Purple" },
    { value: "Orange", label: "Orange" },
    { value: "Pink", label: "Pink" },
    { value: "Brown", label: "Brown" },
    { value: "Multi-color", label: "Multi-color" },
  ];

  const sizeOptions = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
    { value: "One Size", label: "One Size" },
    { value: "Custom", label: "Custom" },
  ];

  // Debug: Log size options
  console.log("Size options:", sizeOptions);

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (productImages.length + files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} images`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setProductImages(prev => [...prev, ...newImages]);
  };

  // Remove image
  const removeImage = (index) => {
    setProductImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages;
    });
  };

  // Handle form submission - 3-step process
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setIsUploading(true);

      // Validate that at least one image is uploaded
      if (productImages.length === 0) {
        toast.error("Please upload at least one product image");
        return;
      }

      // Step 1: Create Product
      const productData = {
        name: values.name,
        description: values.description,
        category_id: values.category_id,
        store_id: values.store_id,
        estimated_delivery_duration: parseInt(values.estimated_delivery_duration)
      };

      const productResult = await createProduct(productData).unwrap();
      console.log("Product creation result:", productResult);
      
      // Extract product ID from response (handle both direct and wrapped responses)
      const productId = productResult?.data?.id || productResult?.id;
      
      if (!productId) {
        throw new Error("Failed to get product ID from response");
      }
      
      toast.success("Product created successfully!");

      // Step 2: Create Product Variant
      // TODO: Convert blob URLs to base64 or implement proper file upload
      // For testing, we'll use placeholder URLs
      const placeholderImageUrls = ["https://via.placeholder.com/300x300?text=Product+Image"];
      
      const variantData = {
        color: values.color,
        img_urls: placeholderImageUrls, // Using placeholder URLs for now
        video_url: values.video_url || undefined,
        product_id: productId
      };

      console.log("Creating variant with data:", variantData);
      const variantResult = await createProductVariant(variantData).unwrap();
      console.log("Variant creation result:", variantResult);
      
      // Extract variant ID from response
      const variantId = variantResult?.data?.id || variantResult?.id;
      
      if (!variantId) {
        throw new Error("Failed to get variant ID from response");
      }
      
      toast.success("Product variant created successfully!");

      // Step 3: Create Product Variant Spec
      const specData = {
        size: values.size,
        quantity: parseInt(values.quantity),
        amount: parseFloat(values.amount),
        product_variant_id: variantId
      };

      await createProductVariantSpec(specData).unwrap();
      
      toast.success("Product variant specification created successfully!");
      toast.success("Product creation completed successfully!");
      
      // Reset form and navigate
      resetForm();
      setTags([]);
      setProductImages([]);
      setCurrentStep(1);
      navigate(route.productlist);
    } catch (error) {
      console.error("Error creating product:", error);
      
      // Handle specific error cases
      if (error?.status === 401) {
        toast.error("Authentication required. Please log in again.");
        navigate('/login');
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.error) {
        toast.error(error.error);
      } else {
        toast.error("Failed to create product. Please try again.");
      }
    } finally {
      setSubmitting(false);
      setIsUploading(false);
    }
  };

  const initialValues = {
    name: "",
    description: "",
    category_id: "",
    store_id: "",
    estimated_delivery_duration: "",
    color: "",
    video_url: "",
    size: "",
    quantity: "",
    amount: ""
  };

  // Show error state if data fetching failed
  if (categoriesError || storesError) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
            <div className="text-center">
              <div className="text-danger mb-3">
                <i className="ti ti-alert-circle fs-48"></i>
              </div>
              <h5 className="text-danger">Failed to load data</h5>
              <p className="text-muted">Please refresh the page or try again later.</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while data is being fetched
  if (isLoadingCategories || isLoadingStores) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Create Product</h4>
                <h6>Add a new product to your store (3-step process)</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <RefreshIcon />
              <CollapesIcon />
              <li>
                <div className="page-btn">
                  <Link to={route.productlist} className="btn btn-secondary">
                    <ArrowLeft className="me-2" />
                    Back to Products
                  </Link>
                </div>
              </li>
            </ul>
          </div>

          {/* Progress Steps */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="progress-steps d-flex justify-content-center">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Product Info</div>
                </div>
                <div className={`step-connector ${currentStep >= 2 ? 'active' : ''}`}></div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Variant</div>
                </div>
                <div className={`step-connector ${currentStep >= 3 ? 'active' : ''}`}></div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <div className="step-label">Specifications</div>
                </div>
              </div>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={ProductSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form className="add-product-form">
                <div className="add-product">
                  <div className="accordions-items-seperate" id="accordionSpacingExample">
                    {/* Step 1: Product Information Section */}
                    <div className="accordion-item border mb-4">
                      <h2 className="accordion-header" id="headingSpacingOne">
                        <div
                          className="accordion-button collapsed bg-white"
                          data-bs-toggle="collapse"
                          data-bs-target="#SpacingOne"
                          aria-expanded="true"
                          aria-controls="SpacingOne"
                          onClick={() => setCurrentStep(1)}
                        >
                          <div className="d-flex align-items-center justify-content-between flex-fill">
                            <h5 className="d-flex align-items-center">
                              <Info className="text-primary me-2"/>
                              <span>Step 1: Product Information</span>
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
                                  Store<span className="text-danger ms-1">*</span>
                                </label>
                                <Select
                                  classNamePrefix="react-select"
                                  options={storeOptions}
                                  placeholder={isLoadingStores ? "Loading..." : "Choose Store"}
                                  isLoading={isLoadingStores}
                                  value={Array.isArray(storeOptions) ? storeOptions.find(option => option.value === values.store_id) : null}
                                  onChange={(option) => setFieldValue('store_id', option?.value || '')}
                                  isDisabled={isLoadingStores}
                                  isSearchable={true}
                                  isClearable={true}
                                  menuPosition="fixed"
                                  menuPlacement="auto"
                                />
                                {errors.store_id && touched.store_id && (
                                  <div className="text-danger mt-1">{errors.store_id}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Category<span className="text-danger ms-1">*</span>
                                </label>
                                <Select
                                  classNamePrefix="react-select"
                                  options={categoryOptions}
                                  placeholder={isLoadingCategories ? "Loading..." : "Choose Category"}
                                  isLoading={isLoadingCategories}
                                  value={Array.isArray(categoryOptions) ? categoryOptions.find(option => option.value === values.category_id) : null}
                                  onChange={(option) => setFieldValue('category_id', option?.value || '')}
                                  isDisabled={isLoadingCategories}
                                  isSearchable={true}
                                  isClearable={true}
                                  menuPosition="fixed"
                                  menuPlacement="auto"
                                />
                                {errors.category_id && touched.category_id && (
                                  <div className="text-danger mt-1">{errors.category_id}</div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Product Name<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="name"
                                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                                  placeholder="Enter product name"
                                />
                                <ErrorMessage name="name" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Estimated Delivery Duration (days)<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="number"
                                  name="estimated_delivery_duration"
                                  className={`form-control ${errors.estimated_delivery_duration && touched.estimated_delivery_duration ? 'is-invalid' : ''}`}
                                  placeholder="Enter delivery duration in days"
                                  min="1"
                                  max="365"
                                />
                                <ErrorMessage name="estimated_delivery_duration" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <div className="col-lg-12">
                            <div className="summer-description-box">
                              <label className="form-label">Description<span className="text-danger ms-1">*</span></label>
                              <Field
                                as="textarea"
                                name="description"
                                className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                                placeholder="Enter detailed product description..."
                                rows="4"
                              />
                              <ErrorMessage name="description" component="div" className="text-danger mt-1" />
                              <p className="fs-14 mt-1">Maximum 1000 characters</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Product Variant Section */}
                    <div className="accordion-item border mb-4">
                      <h2 className="accordion-header" id="headingVariant">
                        <div
                          className="accordion-button collapsed bg-white"
                          data-bs-toggle="collapse"
                          data-bs-target="#Variant"
                          aria-expanded="true"
                          aria-controls="Variant"
                          onClick={() => setCurrentStep(2)}
                        >
                          <div className="d-flex align-items-center justify-content-between flex-fill">
                            <h5 className="d-flex align-items-center">
                              <Package className="text-primary me-2" />
                              <span>Step 2: Product Variant</span>
                            </h5>
                          </div>
                        </div>
                      </h2>
                      <div
                        id="Variant"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingVariant"
                      >
                        <div className="accordion-body border-top">
                          <div className="row">
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Color<span className="text-danger ms-1">*</span>
                                </label>
                                <Select
                                  classNamePrefix="react-select"
                                  options={colorOptions}
                                  placeholder="Choose color"
                                  value={colorOptions.find(option => option.value === values.color) || null}
                                  onChange={(option) => setFieldValue('color', option?.value || '')}
                                  isSearchable={true}
                                  isClearable={true}
                                  menuPosition="fixed"
                                  menuPlacement="auto"
                                />
                                {errors.color && touched.color && (
                                  <div className="text-danger mt-1">{errors.color}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-sm-6 col-12">
                              <div className="mb-3">
                                <label className="form-label">Video URL (Optional)</label>
                                <Field
                                  type="url"
                                  name="video_url"
                                  className={`form-control ${errors.video_url && touched.video_url ? 'is-invalid' : ''}`}
                                  placeholder="Enter product video URL"
                                />
                                <ErrorMessage name="video_url" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                          </div>

                          {/* Product Images */}
                          <div className="row">
                            <div className="col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Product Images<span className="text-danger ms-1">*</span>
                                </label>
                                <div className="upload-area border-2 border-dashed border-gray-300 rounded p-4 text-center">
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="d-none"
                                    onChange={handleImageUpload}
                                  />
                                  <div className="mb-3">
                                    <Upload className="text-muted mb-2" size={48} />
                                    <h6>Upload Product Images</h6>
                                    <p className="text-muted mb-3">
                                      Drag and drop images here or click to browse. 
                                      Maximum 5 images, 5MB each.
                                    </p>
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary"
                                      onClick={() => fileInputRef.current?.click()}
                                    >
                                      <Plus className="me-2" size={16} />
                                      Choose Images
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Image Preview */}
                                {productImages.length > 0 && (
                                  <div className="mt-3">
                                    <h6>Selected Images:</h6>
                                    <div className="row">
                                      {productImages.map((image, index) => (
                                        <div key={index} className="col-md-3 col-sm-4 col-6 mb-3">
                                          <div className="position-relative">
                                            <img
                                              src={image.preview}
                                              alt={image.name}
                                              className="img-fluid rounded border"
                                              style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                                            />
                                            <button
                                              type="button"
                                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                              onClick={() => removeImage(index)}
                                            >
                                              <X size={12} />
                                            </button>
                                            <small className="d-block text-muted mt-1 text-truncate">
                                              {image.name}
                                            </small>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Product Variant Spec Section */}
                    <div className="accordion-item border mb-4">
                      <h2 className="accordion-header" id="headingSpec">
                        <div
                          className="accordion-button bg-white"
                          data-bs-toggle="collapse"
                          data-bs-target="#Spec"
                          aria-expanded="true"
                          aria-controls="Spec"
                          onClick={() => setCurrentStep(3)}
                        >
                          <div className="d-flex align-items-center justify-content-between flex-fill">
                            <h5 className="d-flex align-items-center">
                              <DollarSign className="text-primary me-2" />
                              <span>Step 3: Specifications & Pricing</span>
                            </h5>
                          </div>
                        </div>
                      </h2>
                      <div
                        id="Spec"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingSpec"
                      >
                        <div className="accordion-body border-top">
                          <div className="row">
                            <div className="col-sm-4 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Size<span className="text-danger ms-1">*</span>
                                </label>
                                <Select
                                  classNamePrefix="react-select"
                                  options={sizeOptions}
                                  placeholder="Choose size"
                                  value={sizeOptions.find(option => option.value === values.size) || null}
                                  onChange={(option) => setFieldValue('size', option?.value || '')}
                                  isSearchable={true}
                                  isClearable={true}
                                  menuPosition="fixed"
                                  menuPlacement="auto"
                                />
                                <small className="text-muted">Available sizes: {sizeOptions.map(opt => opt.label).join(', ')}</small>
                                <small className="d-block text-info">Debug: {sizeOptions.length} size options loaded</small>
                                {errors.size && touched.size && (
                                  <div className="text-danger mt-1">{errors.size}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-sm-4 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Quantity<span className="text-danger ms-1">*</span>
                                </label>
                                <Field
                                  type="number"
                                  name="quantity"
                                  className={`form-control ${errors.quantity && touched.quantity ? 'is-invalid' : ''}`}
                                  placeholder="Enter quantity"
                                  min="1"
                                />
                                <ErrorMessage name="quantity" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                            <div className="col-sm-4 col-12">
                              <div className="mb-3">
                                <label className="form-label">
                                  Price<span className="text-danger ms-1">*</span>
                                </label>
                                <div className="input-group">
                                  <span className="input-group-text">$</span>
                                  <Field
                                    type="number"
                                    name="amount"
                                    className={`form-control ${errors.amount && touched.amount ? 'is-invalid' : ''}`}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                  />
                                </div>
                                <ErrorMessage name="amount" component="div" className="text-danger mt-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information Section */}
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
                              <LifeBuoy className="text-primary me-2" />
                              <span>Additional Information</span>
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
                            <div className="col-12">
                              <div className="mb-3">
                                <label className="form-label">Tags</label>
                                <CommonTagsInput
                                  value={tags}
                                  onChange={setTags}
                                  placeholder="Add tags to help customers find your product..."
                                />
                                <small className="text-muted">Add relevant tags separated by commas</small>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="col-lg-12">
                  <div className="d-flex align-items-center justify-content-end mb-4">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2"
                      onClick={() => navigate(route.productlist)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting || isCreatingProduct || isCreatingVariant || isCreatingSpec || isUploading}
                    >
                      {isSubmitting || isCreatingProduct || isCreatingVariant || isCreatingSpec || isUploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {isCreatingProduct ? "Creating Product..." : 
                           isCreatingVariant ? "Creating Variant..." : 
                           isCreatingSpec ? "Creating Specifications..." : 
                           "Processing..."}
                        </>
                      ) : (
                        "Create Complete Product"
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
      
      <Addunits />
      <AddCategory />
      <AddVariant />
      <AddBrand />
      <AddVarientNew />
      
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content p-5 px-3 text-center">
                <span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2">
                  <i className="ti ti-trash fs-24 text-danger"></i>
                </span>
                <h4 className="fs-20 fw-bold mb-2 mt-1">Delete Attribute</h4>
                <p className="mb-0 fs-16">Are you sure you want to delete Attribute?</p>
                <div className="modal-footer-btn mt-3 d-flex justify-content-center">
                  <button type="button" className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-primary fs-13 fw-medium p-2 px-3">Yes Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .progress-steps {
          margin-bottom: 2rem;
        }
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 1rem;
        }
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .step.active .step-number {
          background-color: #007bff;
          color: white;
        }
        .step-label {
          font-size: 0.875rem;
          color: #6c757d;
          text-align: center;
        }
        .step.active .step-label {
          color: #007bff;
          font-weight: 500;
        }
        .step-connector {
          width: 60px;
          height: 2px;
          background-color: #e9ecef;
          margin: 20px 0;
        }
        .step-connector.active {
          background-color: #007bff;
        }
        
        /* Fix react-select dropdown visibility */
        .react-select__menu {
          z-index: 9999 !important;
          max-height: 200px !important;
          overflow-y: auto !important;
        }
        
        .react-select__menu-list {
          max-height: 200px !important;
          overflow-y: auto !important;
        }
        
        .react-select__option {
          padding: 8px 12px !important;
          cursor: pointer !important;
        }
        
        .react-select__option:hover {
          background-color: #f8f9fa !important;
        }
        
        .react-select__option--is-focused {
          background-color: #e3f2fd !important;
        }
        
        .react-select__option--is-selected {
          background-color: #007bff !important;
          color: white !important;
        }
        
        /* Ensure dropdown appears above other elements */
        .react-select__menu-portal {
          z-index: 9999 !important;
        }
        
        /* Fix accordion overflow issues */
        .accordion-collapse {
          overflow: visible !important;
        }
        
        .accordion-body {
          overflow: visible !important;
        }
        
        /* Ensure form controls don't clip dropdowns */
        .form-control, .react-select__control {
          overflow: visible !important;
        }
      `}</style>
    </>
  );
};

export default AddProduct;
