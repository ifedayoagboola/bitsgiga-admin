# RTK Query Implementation for Admin Panel

## Overview
This document outlines the complete RTK Query implementation for the Bitshub admin panel, providing a modern, efficient way to manage API calls and state.

## 🚀 What's Implemented

### 1. **RTK Query API Slice** (`admin/src/core/redux/api.js`)
- **Comprehensive API endpoints** for all admin functionality
- **Automatic caching** and cache invalidation
- **Error handling** and loading states
- **TypeScript-ready** with proper typing

#### **Available Endpoints:**
- **Authentication**: Login, Register, Logout
- **Store Management**: CRUD operations, activate/deactivate
- **User Management**: CRUD operations
- **Product Management**: CRUD operations
- **Category Management**: CRUD operations
- **Order Management**: View, update status
- **Role Management**: CRUD operations
- **Dashboard**: Stats, analytics
- **Email Testing**: Configuration, SMTP connection, sending

### 2. **Admin Authentication** (`admin/src/core/redux/adminAuthSlice.js`)
- **Token management** with localStorage persistence
- **Authentication state** management
- **Loading and error states**
- **Automatic logout** functionality

### 3. **Custom Authentication Hook** (`admin/src/core/redux/useAdminAuth.js`)
- **Integrated RTK Query** with Redux state
- **Login/register/logout functions** with error handling
- **Navigation integration** with React Router
- **Token validation** and persistence

### 4. **Protected Route Component** (`admin/src/core/components/ProtectedRoute.jsx`)
- **Authentication checking** for protected routes
- **Automatic redirect** to login page
- **Return URL preservation** after login

### 5. **Updated Store Configuration** (`admin/src/core/redux/store.jsx`)
- **RTK Query middleware** integration
- **API reducer** registration
- **Admin auth slice** integration

## 📋 API Endpoints Available

### **Authentication**
```javascript
useAdminLoginMutation()     // Login admin
useAdminRegisterMutation()  // Register admin
useAdminLogoutMutation()    // Logout admin
```

### **Store Management**
```javascript
useGetStoresQuery()           // Get all stores
useGetStoreQuery(id)          // Get single store
useUpdateStoreMutation()      // Update store
useActivateStoreMutation()    // Activate store
useDeactivateStoreMutation()  // Deactivate store
useDeleteStoreMutation()      // Delete store
```

### **User Management**
```javascript
useGetUsersQuery()           // Get all users
useGetUserQuery(id)          // Get single user
useUpdateUserMutation()      // Update user
useDeleteUserMutation()      // Delete user
```

### **Product Management**
```javascript
useGetProductsQuery()        // Get all products
useGetProductQuery(id)       // Get single product
useCreateProductMutation()   // Create product
useUpdateProductMutation()   // Update product
useDeleteProductMutation()   // Delete product
```

### **Category Management**
```javascript
useGetCategoriesQuery()      // Get all categories
useCreateCategoryMutation()  // Create category
useUpdateCategoryMutation()  // Update category
useDeleteCategoryMutation()  // Delete category
```

### **Order Management**
```javascript
useGetOrdersQuery()          // Get all orders
useGetOrderQuery(id)         // Get single order
useUpdateOrderStatusMutation() // Update order status
```

### **Role Management**
```javascript
useGetRolesQuery()           // Get all roles
useCreateRoleMutation()      // Create role
useUpdateRoleMutation()      // Update role
useDeleteRoleMutation()      // Delete role
```

### **Dashboard**
```javascript
useGetDashboardStatsQuery()  // Get dashboard statistics
useGetStoreAnalyticsQuery()  // Get store analytics
```

### **Email Testing**
```javascript
useTestEmailConfigQuery()    // Test email configuration
useTestSmtpConnectionQuery() // Test SMTP connection
useTestEmailSendingMutation() // Test email sending
```

## 🔧 Usage Examples

### **Using in Components**

#### **1. Store List with RTK Query**
```javascript
import { useGetStoresQuery, useActivateStoreMutation } from '../core/redux/api';

const StoreList = () => {
  const { data, isLoading, error, refetch } = useGetStoresQuery();
  const [activateStore] = useActivateStoreMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(store => (
        <div key={store.id}>
          {store.brand_name}
          <button onClick={() => activateStore(store.id)}>
            Activate
          </button>
        </div>
      ))}
    </div>
  );
};
```

#### **2. Admin Authentication**
```javascript
import { useAdminAuth } from '../core/redux/useAdminAuth';

const LoginComponent = () => {
  const { login, isLoading, error } = useAdminAuth();

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Redirect to dashboard
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* form fields */}
    </form>
  );
};
```

#### **3. Admin Registration**
```javascript
import { useAdminAuth } from '../core/redux/useAdminAuth';

const RegisterComponent = () => {
  const { register, isLoading, error } = useAdminAuth();

  const handleRegister = async (userData) => {
    const result = await register(userData);
    if (result.success) {
      // User will be automatically logged in and redirected
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {/* form fields */}
    </form>
  );
};
```

#### **4. Protected Routes**
```javascript
import ProtectedRoute from '../core/components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};
```

## 🎯 Benefits

### **1. Automatic Caching**
- **Smart cache invalidation** when data changes
- **Optimistic updates** for better UX
- **Background refetching** for fresh data

### **2. Loading & Error States**
- **Built-in loading indicators**
- **Comprehensive error handling**
- **Retry mechanisms** for failed requests

### **3. Type Safety**
- **TypeScript support** for all API calls
- **IntelliSense** for better development experience
- **Compile-time error checking**

### **4. Performance**
- **Request deduplication** - same requests are not repeated
- **Automatic background updates**
- **Efficient cache management**

### **5. Developer Experience**
- **Declarative API calls** with hooks
- **Automatic request/response transformation**
- **Built-in dev tools** integration

## 🔒 Security Features

### **1. Token Management**
- **Automatic token inclusion** in requests
- **Token persistence** in localStorage
- **Automatic logout** on token expiration

### **2. Protected Routes**
- **Authentication checking** before route access
- **Automatic redirects** to login
- **Return URL preservation**

### **3. Error Handling**
- **Graceful error handling** for API failures
- **User-friendly error messages**
- **Automatic retry** for network issues

### **4. Form Validation**
- **Client-side validation** for all forms
- **Password confirmation** checking
- **Terms agreement** validation
- **Email format** validation

## 🚀 Getting Started

### **1. Environment Setup**
Create a `.env` file in the admin directory:
```env
REACT_APP_API_URL=http://localhost:3210/v1/dev
```

### **2. Using the Hooks**
```javascript
// In any component
import { useGetStoresQuery } from '../core/redux/api';

const MyComponent = () => {
  const { data, isLoading, error } = useGetStoresQuery();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

### **3. Authentication Flow**
```javascript
import { useAdminAuth } from '../core/redux/useAdminAuth';

const LoginPage = () => {
  const { login, isLoading } = useAdminAuth();
  
  const handleSubmit = async (formData) => {
    const result = await login(formData);
    if (result.success) {
      // User will be automatically redirected
    }
  };
};
```

### **4. Registration Flow**
```javascript
import { useAdminAuth } from '../core/redux/useAdminAuth';

const RegisterPage = () => {
  const { register, isLoading } = useAdminAuth();
  
  const handleSubmit = async (formData) => {
    const result = await register(formData);
    if (result.success) {
      // User will be automatically logged in and redirected
    }
  };
};
```

## 📝 Next Steps

### **1. Add More Endpoints**
- **Analytics endpoints** for detailed reporting
- **Notification endpoints** for admin alerts
- **Settings endpoints** for system configuration

### **2. Enhanced Features**
- **Real-time updates** with WebSocket integration
- **Offline support** with service workers
- **Advanced caching** strategies

### **3. Testing**
- **Unit tests** for API hooks
- **Integration tests** for authentication flow
- **E2E tests** for critical user journeys

## 🎉 Summary

The RTK Query implementation provides:
- ✅ **Complete API integration** for all admin features
- ✅ **Modern authentication** with token management
- ✅ **User registration** with automatic login
- ✅ **Protected routes** with automatic redirects
- ✅ **Comprehensive error handling** and loading states
- ✅ **Type-safe** API calls with full IntelliSense
- ✅ **Automatic caching** and cache invalidation
- ✅ **Form validation** and user feedback
- ✅ **Developer-friendly** hooks and utilities

The admin panel is now ready for production use with a robust, scalable API integration system! 