import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3210/v1/dev',
  prepareHeaders: (headers) => {
    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    
    // If we have a token, add it to the headers
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Set content type
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
});

// Create the API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Store', 'User', 'Product', 'Order', 'Category', 'Role', 'Dashboard'],
  
  endpoints: (builder) => ({
    // ===== AUTHENTICATION ENDPOINTS =====
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    adminRegister: builder.mutation({
      query: (userData) => ({
        url: '/auth',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    adminLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Store', 'User', 'Product', 'Order', 'Category', 'Role', 'Dashboard'],
    }),

    // ===== STORE MANAGEMENT ENDPOINTS =====
    getStores: builder.query({
      query: (params = {}) => ({
        url: '/store',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Store', id })),
              { type: 'Store', id: 'LIST' },
            ]
          : [{ type: 'Store', id: 'LIST' }],
    }),

    getStore: builder.query({
      query: (id) => `/store/${id}`,
      providesTags: (result, error, id) => [{ type: 'Store', id }],
    }),

    updateStore: builder.mutation({
      query: ({ id, ...storeData }) => ({
        url: `/store/update`,
        method: 'POST',
        body: { store_id: id, ...storeData },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Store', id },
        { type: 'Store', id: 'LIST' },
      ],
    }),

    activateStore: builder.mutation({
      query: (id) => ({
        url: `/store/activate`,
        method: 'POST',
        params: { store_id: id },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Store', id },
        { type: 'Store', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
    }),

    deactivateStore: builder.mutation({
      query: (id) => ({
        url: `/store/deactivate`,
        method: 'POST',
        params: { store_id: id },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Store', id },
        { type: 'Store', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
    }),

    deleteStore: builder.mutation({
      query: (id) => ({
        url: `/store/delete`,
        method: 'DELETE',
        params: { store_id: id },
      }),
      invalidatesTags: [{ type: 'Store', id: 'LIST' }],
    }),

    // ===== USER MANAGEMENT ENDPOINTS =====
    getUsers: builder.query({
      query: (params = {}) => ({
        url: '/auth/users',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User', id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUser: builder.query({
      query: (id) => `/auth/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/auth/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // ===== PRODUCT MANAGEMENT ENDPOINTS =====
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/product',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProduct: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/product/create',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/product/update`,
        method: 'POST',
        body: { product_id: id, ...productData },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete`,
        method: 'DELETE',
        params: { product_id: id },
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // ===== CATEGORY MANAGEMENT ENDPOINTS =====
    getCategories: builder.query({
      query: (params = {}) => ({
        url: '/category',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category', id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/category/create',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/category/update`,
        method: 'POST',
        body: { category_id: id, ...categoryData },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/delete`,
        method: 'DELETE',
        params: { category_id: id },
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    // ===== ORDER MANAGEMENT ENDPOINTS =====
    getOrders: builder.query({
      query: (params = {}) => ({
        url: '/order',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order', id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrder: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/order/update-status`,
        method: 'POST',
        body: { order_id: id, status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'Dashboard', id: 'LIST' },
      ],
    }),

    // ===== ROLE MANAGEMENT ENDPOINTS =====
    getRoles: builder.query({
      query: (params = {}) => ({
        url: '/role',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Role', id })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),

    createRole: builder.mutation({
      query: (roleData) => ({
        url: '/role/create',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),

    updateRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `/role/update`,
        method: 'POST',
        body: { role_id: id, ...roleData },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Role', id },
        { type: 'Role', id: 'LIST' },
      ],
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/role/delete`,
        method: 'DELETE',
        params: { role_id: id },
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),

    // ===== DASHBOARD ENDPOINTS =====
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: [{ type: 'Dashboard', id: 'LIST' }],
    }),

    getStoreAnalytics: builder.query({
      query: (params = {}) => ({
        url: '/dashboard/store_analysis',
        params,
      }),
      providesTags: [{ type: 'Dashboard', id: 'LIST' }],
    }),

    // ===== EMAIL TEST ENDPOINTS =====
    testEmailConfig: builder.query({
      query: () => '/store/test-email-config',
    }),

    testSmtpConnection: builder.query({
      query: () => '/store/test-smtp-connection',
    }),

    testEmailSending: builder.mutation({
      query: () => ({
        url: '/store/test-email-sending',
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Auth
  useAdminLoginMutation,
  useAdminRegisterMutation,
  useAdminLogoutMutation,
  
  // Stores
  useGetStoresQuery,
  useGetStoreQuery,
  useUpdateStoreMutation,
  useActivateStoreMutation,
  useDeactivateStoreMutation,
  useDeleteStoreMutation,
  
  // Users
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  
  // Products
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  
  // Categories
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  
  // Orders
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  
  // Roles
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  
  // Dashboard
  useGetDashboardStatsQuery,
  useGetStoreAnalyticsQuery,
  
  // Email Tests
  useTestEmailConfigQuery,
  useTestSmtpConnectionQuery,
  useTestEmailSendingMutation,
} = api; 