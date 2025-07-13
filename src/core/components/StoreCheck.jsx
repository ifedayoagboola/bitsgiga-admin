import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetStoresQuery } from '../redux/api';
import { all_routes } from '../../Router/all_routes';

const StoreCheck = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.adminAuth.isAuthenticated);
  
  // Get user's stores
  const { data: storesResponse, isLoading, error } = useGetStoresQuery(
    undefined, // No parameters needed for user's stores
    {
      skip: !isAuthenticated, // Skip if not authenticated
    }
  );

  useEffect(() => {
    // Only check if user is authenticated and data has loaded
    if (isAuthenticated && !isLoading && !error) {
      const stores = storesResponse?.data || [];
      
      // If user has no stores, redirect to create store page
      if (stores.length === 0) {
        navigate(all_routes.createStore);
      }
    }
  }, [isAuthenticated, isLoading, error, storesResponse, navigate]);

  // Show loading while checking
  if (isAuthenticated && isLoading) {
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

  // If not authenticated, just render children
  if (!isAuthenticated) {
    return children;
  }

  // If user has stores, render children
  const stores = storesResponse?.data || [];
  if (stores.length > 0) {
    return children;
  }

  // If user has no stores, show loading (will redirect)
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Redirecting...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

StoreCheck.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreCheck; 