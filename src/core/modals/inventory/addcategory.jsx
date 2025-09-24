import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { all_routes } from "../../../Router/all_routes";
import { useDispatch } from "react-redux";
import { api, useCreateCategoryMutation } from "../../redux/api";

const AddCategory = () => {
  // const route = all_routes;
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  // Helper: upload a single file to R2 using presigned PUT with fallback to base64
  const presignAndUpload = async (file) => {
    const apiBase = process.env.REACT_APP_API_URL;
    const safeName = String(file.name || 'file').trim().replace(/\s+/g, '-');
    const key = `media-dev/${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}-${safeName}`;
    const contentType = file.type || 'application/octet-stream';

    try {
      const presignRes = await fetch(`${apiBase}/uploads/presign?key=${encodeURIComponent(key)}&contentType=${encodeURIComponent(contentType)}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (presignRes.status === 404) {
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

      const putRes = await fetch(uploadUrl, { 
        method: 'PUT', 
        headers: { 'Content-Type': contentType }, 
        body: file 
      });
      if (!putRes.ok) throw new Error('Upload failed');

      const viewRes = await fetch(`${apiBase}/uploads/view-url?key=${encodeURIComponent(key)}`, { 
        credentials: 'include' 
      });
      if (!viewRes.ok) throw new Error('Failed to presign view url');

      const { data: viewData, url: viewUrl } = await viewRes.json();
      return viewData?.url || viewUrl;
    } catch (error) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setImagePreview(event.target.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    if (!imageFile) {
      setError("Image is required");
      return;
    }
    try {
      const imgUrl = await presignAndUpload(imageFile);
      await createCategory({ category: trimmed, img_url: imgUrl }).unwrap();
      dispatch(api.util.invalidateTags([{ type: 'Category', id: 'LIST' }]));
      setName("");
      setImagePreview("");
      setImageFile(null);
      const closeBtn = document.querySelector('#add-units-category .btn[data-bs-dismiss="modal"]');
      closeBtn?.click();
    } catch (err) {
      setError(err?.data?.message || "Failed to create category");
    }
  };
  return (
    <>
      {/* Add Category */}
      <div className="modal fade" id="add-units-category">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add New Category</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <form onSubmit={onSubmit}>
                  <div className="modal-body custom-modal-body">
                    <div className="mb-3">
                      <label className="form-label">Name<span className="text-danger ms-1">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Electronics"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category Image<span className="text-danger ms-1">*</span></label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={onFileChange}
                      />
                      {imagePreview ? (
                        <div className="mt-2">
                          <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxWidth: "150px" }} />
                        </div>
                      ) : null}
                    </div>
                    {error ? (
                      <div className="alert alert-danger py-2" role="alert">{error}</div>
                    ) : null}
                  </div>
                  <div className="modal-footer">
                      <Link
                        to="#"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-submit" disabled={isLoading || !name.trim() || !imageFile}>
                        {isLoading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Category */}
    </>
  );
};

export default AddCategory;
