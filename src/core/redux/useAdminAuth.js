import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  useAdminLoginMutation, 
  useAdminRegisterMutation,
  useAdminLogoutMutation 
} from './api';
import { 
  setCredentials, 
  logout, 
  setLoading, 
  setError, 
  clearError,
  selectAdmin,
  selectToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectError
} from './adminAuthSlice';

export const useAdminAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // RTK Query hooks
  const [loginMutation, loginResult] = useAdminLoginMutation();
  const [registerMutation, registerResult] = useAdminRegisterMutation();
  const [logoutMutation, logoutResult] = useAdminLogoutMutation();
  
  // Redux state
  const admin = useSelector(selectAdmin);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const result = await loginMutation(credentials).unwrap();
      
      if (result.data) {
        dispatch(setCredentials({
          admin: result.data.user,
          token: result.data.accessToken
        }));
        
        // Redirect to dashboard
        navigate('/index');
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.data?.message || err.error || 'Login failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const result = await registerMutation(userData).unwrap();
      
      if (result.data) {
        // After successful registration, automatically log in
        dispatch(setCredentials({
          admin: result.data,
          token: result.data.accessToken
        }));
        
        // Redirect to dashboard
        navigate('/index');
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.data?.message || err.error || 'Registration failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Logout function
  const logoutAdmin = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      dispatch(logout());
      navigate('/signin');
    }
  };

  // Check if user is authenticated
  const checkAuth = () => {
    return isAuthenticated && token;
  };

  // Clear error
  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    // State
    admin,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout: logoutAdmin,
    checkAuth,
    clearError: clearAuthError,
    
    // RTK Query results
    loginResult,
    registerResult,
    logoutResult,
  };
}; 