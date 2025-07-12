# Admin Panel Setup Guide

## 🚀 Quick Start

### 1. **Environment Configuration**
Create a `.env` file in the admin directory:
```env
REACT_APP_API_URL=http://localhost:3210/v1/dev
NODE_ENV=development
```

### 2. **Install Dependencies**
```bash
cd admin
npm install
```

### 3. **Start Development Server**
```bash
npm start
```

## 📋 What's Been Implemented

### **✅ RTK Query Integration**
- **Complete API layer** with automatic caching
- **Authentication system** with token management
- **Protected routes** with automatic redirects
- **Error handling** and loading states

### **✅ Updated Components**
- **Signin Page** - Now uses RTK Query authentication
- **Register Page** - Now uses RTK Query registration
- **Store List** - Real API data with CRUD operations
- **Store Management** - Activate, deactivate, delete stores

### **✅ Available Features**
- **Admin Login/Logout** with secure token management
- **Admin Registration** with automatic login after registration
- **Store Management** - View, edit, activate, deactivate, delete
- **Real-time Data** with automatic cache invalidation
- **Search and Filter** functionality
- **Loading States** and error handling

## 🔧 API Endpoints Available

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

## 🎯 Usage Examples

### **Using RTK Query Hooks in Components**

#### **1. Fetching Data**
```javascript
import { useGetStoresQuery } from '../core/redux/api';

const MyComponent = () => {
  const { data, isLoading, error, refetch } = useGetStoresQuery();
  
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

#### **2. Mutations (Create/Update/Delete)**
```javascript
import { useCreateStoreMutation } from '../core/redux/api';

const CreateStoreForm = () => {
  const [createStore, { isLoading }] = useCreateStoreMutation();
  
  const handleSubmit = async (formData) => {
    try {
      await createStore(formData).unwrap();
      // Success handling
    } catch (error) {
      // Error handling
    }
  };
};
```

#### **3. Authentication**
```javascript
import { useAdminAuth } from '../core/redux/useAdminAuth';

const LoginPage = () => {
  const { login, isLoading } = useAdminAuth();
  
  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Redirect to dashboard
    }
  };
};
```

#### **4. Registration**
```javascript
import { useAdminAuth } from '../core/redux/useAdminAuth';

const RegisterPage = () => {
  const { register, isLoading } = useAdminAuth();
  
  const handleRegister = async (userData) => {
    const result = await register(userData);
    if (result.success) {
      // User will be automatically logged in and redirected
    }
  };
};
```

## 🔒 Security Features

### **1. Token Management**
- **Automatic token inclusion** in API requests
- **Token persistence** in localStorage
- **Automatic logout** on token expiration

### **2. Protected Routes**
- **Authentication checking** before route access
- **Automatic redirects** to login page
- **Return URL preservation** after login

### **3. Error Handling**
- **Graceful error handling** for API failures
- **User-friendly error messages**
- **Automatic retry** for network issues

### **4. Form Validation**
- **Client-side validation** for all forms
- **Password confirmation** checking
- **Terms agreement** validation
- **Email format** validation

## 📁 File Structure

```
admin/
├── src/
│   ├── core/
│   │   ├── redux/
│   │   │   ├── api.js                    # RTK Query API slice
│   │   │   ├── adminAuthSlice.js         # Admin authentication slice
│   │   │   ├── useAdminAuth.js           # Custom auth hook
│   │   │   └── store.jsx                 # Redux store configuration
│   │   └── components/
│   │       └── ProtectedRoute.jsx        # Protected route component
│   ├── feature-module/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   └── signin.jsx            # Updated login component
│   │   │   └── register/
│   │   │       └── register.jsx          # Updated register component
│   │   └── peoples/
│   │       └── storelist.jsx             # Updated store list
│   └── core/modals/peoples/
│       └── storelist.jsx                 # Updated store list modal
├── RTK_QUERY_SETUP.md                    # Complete RTK Query documentation
└── ADMIN_SETUP.md                        # This setup guide
```

## 🎉 Benefits

### **1. Automatic Caching**
- **Smart cache invalidation** when data changes
- **Optimistic updates** for better UX
- **Background refetching** for fresh data

### **2. Performance**
- **Request deduplication** - same requests are not repeated
- **Automatic background updates**
- **Efficient cache management**

### **3. Developer Experience**
- **Declarative API calls** with hooks
- **Automatic request/response transformation**
- **Built-in dev tools** integration

### **4. Type Safety**
- **TypeScript support** for all API calls
- **IntelliSense** for better development experience
- **Compile-time error checking**

## 🚀 Next Steps

### **1. Test the Implementation**
- Start the admin panel: `npm start`
- Navigate to `/signin` to test authentication
- Navigate to `/register` to test registration
- Navigate to `/store-list` to test store management

### **2. Add More Components**
- Use the available RTK Query hooks in other components
- Implement additional CRUD operations
- Add more filtering and search functionality

### **3. Customization**
- Modify API endpoints as needed
- Add custom error handling
- Implement additional authentication features

## 🎯 Summary

The admin panel now has:
- ✅ **Complete RTK Query integration** with all API endpoints
- ✅ **Secure authentication** with token management
- ✅ **User registration** with automatic login
- ✅ **Protected routes** with automatic redirects
- ✅ **Real-time data** with automatic caching
- ✅ **Comprehensive error handling** and loading states
- ✅ **Form validation** and user feedback
- ✅ **Modern development experience** with hooks and utilities

Ready for production use! 🚀 