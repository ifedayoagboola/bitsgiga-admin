import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetStoresQuery } from '../redux/api';
import { all_routes } from '../../Router/all_routes';

const StoreCheck = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.adminAuth.isAuthenticated);
  
  const { data: storesResponse, isLoading, error } = useGetStoresQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const stores = storesResponse?.data || [];
      // Only redirect if not already on create store page
      if ((error || stores.length === 0) && location.pathname !== all_routes.createStore) {
        navigate(all_routes.createStore);
      }
    }
  }, [isAuthenticated, isLoading, error, storesResponse, navigate, location.pathname]);

  // Show loading while checking
  if (isAuthenticated && isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return children;
};

StoreCheck.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreCheck;