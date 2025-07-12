import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash2, CheckCircle, XCircle } from "react-feather";
import Table from "../../../core/pagination/datatable";
import TooltipIcons from "../../common/tooltip-content/tooltipIcons";
import RefreshIcon from "../../common/tooltip-content/refresh";
import CollapesIcon from "../../common/tooltip-content/collapes";
import { PlusCircle } from "feather-icons-react/build/IconComponents";
import { 
  useGetStoresQuery, 
  useActivateStoreMutation, 
  useDeactivateStoreMutation, 
  useDeleteStoreMutation 
} from "../../../core/redux/api";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const StoreList = () => {
  const [filters, setFilters] = useState({});
  
  // RTK Query hooks
  const { data: storesData, isLoading, error, refetch } = useGetStoresQuery(filters);
  const [activateStore, { isLoading: isActivating }] = useActivateStoreMutation();
  const [deactivateStore, { isLoading: isDeactivating }] = useDeactivateStoreMutation();
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();

  const MySwal = withReactContent(Swal);

  // Transform API data to match table format
  const data = storesData?.data || [];

  const handleActivateStore = async (storeId) => {
    try {
      await activateStore(storeId).unwrap();
      MySwal.fire({
        title: "Success!",
        text: "Store activated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      MySwal.fire({
        title: "Error!",
        text: error.data?.message || "Failed to activate store",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeactivateStore = async (storeId) => {
    try {
      await deactivateStore(storeId).unwrap();
      MySwal.fire({
        title: "Success!",
        text: "Store deactivated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      MySwal.fire({
        title: "Error!",
        text: error.data?.message || "Failed to deactivate store",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteStore = async (storeId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteStore(storeId).unwrap();
          MySwal.fire("Deleted!", "Store has been deleted.", "success");
        } catch (error) {
          MySwal.fire({
            title: "Error!",
            text: error.data?.message || "Failed to delete store",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const columns = [
    {
      title: "Store Name",
      dataIndex: "brand_name",
      sorter: (a, b) => a.brand_name.length - b.brand_name.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => text?.substring(0, 50) + (text?.length > 50 ? "..." : ""),
      sorter: (a, b) => (a.description?.length || 0) - (b.description?.length || 0),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      sorter: (a, b) => a.slug.length - b.slug.length,
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span className={`badge ${text === 'ACTIVE' ? 'badge-success' : 'badge-warning'} d-inline-flex align-items-center badge-xs`}>
          <i className={`ti ti-point-filled me-1 ${text === 'ACTIVE' ? 'text-success' : 'text-warning'}`} />
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <div className="input-block add-lists"></div>

            <Link className="me-2 p-2" to={`/store-details/${record.id}`}>
              <Eye className="feather-view" />
            </Link>

            <Link
              className="me-2 p-2"
              to={`/edit-store/${record.id}`}
            >
              <Edit className="feather-edit" />
            </Link>

            {record.status === 'ACTIVE' ? (
              <button
                className="me-2 p-2 d-flex align-items-center border rounded bg-warning text-white"
                onClick={() => handleDeactivateStore(record.id)}
                disabled={isDeactivating}
                title="Deactivate Store"
              >
                <XCircle className="feather-x-circle" size={16} />
              </button>
            ) : (
              <button
                className="me-2 p-2 d-flex align-items-center border rounded bg-success text-white"
                onClick={() => handleActivateStore(record.id)}
                disabled={isActivating}
                title="Activate Store"
              >
                <CheckCircle className="feather-check-circle" size={16} />
              </button>
            )}

            <button
              className="p-2 d-flex align-items-center border rounded bg-danger text-white"
              onClick={() => handleDeleteStore(record.id)}
              disabled={isDeleting}
              title="Delete Store"
            >
              <Trash2 className="feather-trash-2" size={16} />
            </button>
          </div>
        </div>
      ),
    },
  ];

  if (isLoading) {
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

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>Failed to load stores. Please try again.</p>
            <button className="btn btn-primary" onClick={() => refetch()}>
              Retry
            </button>
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
                <h4>Stores</h4>
                <h6>Manage your Store ({data.length} stores)</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <TooltipIcons />
              <RefreshIcon />
              <CollapesIcon />
            </ul>
            <div className="page-btn">
              <Link to="/add-store" className="btn btn-primary">
                <PlusCircle data-feather="plus-circle" className=" me-2" />
                Add Store
              </Link>
            </div>
          </div>

          {/* /store list */}
          <div className="card table-list-card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="search-set">
                <div className="search-path">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search stores..."
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="dropdown me-2">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Select Status
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-3">
                    <li>
                      <button 
                        className="dropdown-item rounded-1"
                        onClick={() => setFilters({ ...filters, status: 'ACTIVE' })}
                      >
                        Active
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item rounded-1"
                        onClick={() => setFilters({ ...filters, status: 'INACTIVE' })}
                      >
                        Inactive
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item rounded-1"
                        onClick={() => setFilters({})}
                      >
                        All
                      </button>
                    </li>
                  </ul>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                  ) : (
                    <i className="ti ti-refresh me-2" />
                  )}
                  Refresh
                </button>
              </div>
            </div>
            <div className="card-body pb-0">
              <div className="table-responsive">
                <Table columns={columns} dataSource={data} />
              </div>
            </div>
          </div>
        </div>
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">2014-2025 © Bitshub. All Right Reserved</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Bitshub
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default StoreList;
