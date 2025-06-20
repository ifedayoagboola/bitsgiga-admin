import { all_routes } from "../../Router/all_routes"

const route = all_routes;

export const SidebarData = [

  {
    label: "Main",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Dashboard",
        link: "/index",
        icon: 'layout-grid',
        submenu: false,
        showSubRoute: false,
      },
     
    ],
  },
  {
    label: "Inventory",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",
    submenuItems: [
      {
        label: "Products",
        link: "/product-list",
        icon: 'box',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Create Product",
        link: "/add-product",
        icon: 'table-plus',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Low Stocks",
        link: "/low-stocks",
        icon: 'trending-up-2',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Category",
        link: "/category-list",
        icon: 'list-details',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Sub Category",
        link: "/sub-categories",
        icon: 'carousel-vertical',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Brands",
        link: "/brand-list",
        icon: 'triangles',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Units",
        link: "/units",
        icon: 'brand-unity',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Variant Attributes",
        link: "/variant-attributes",
        icon: 'checklist',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Warranties",
        link: "/warranty",
        icon: 'certificate',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Print Barcode",
        link: "/barcode",
        icon: 'barcode',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Print QR Code",
        link: "/qrcode",
        icon: 'qrcode',
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
  {
    label: "Sales",
    submenuOpen: true,
    submenuHdr: "Sales",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Orders",
        icon: 'layout-grid',
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          { label: "Online Orders", link: route.onlineorder, showSubRoute: false },
          { label: "POS Orders", link: route.posorder, showSubRoute: false },
        ],
      },
      {
        label: "Invoices",
        link: route.invoice,
        icon: 'file-invoice',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Sales Return",
        link: "/sales-returns",
        icon: 'receipt-refund',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Quotation",
        link: "/quotation-list",
        icon: 'files',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "POS",
        icon: 'device-laptop',
        link: "/pos",
        showSubRoute: false,
        submenu: false,
       
      },
    ],
  },
  {
    label: "Promo",
    submenuOpen: true,
    submenuHdr: "Promo",
    showSubRoute: false,
    submenuItems: [
      {
        label: "Coupons",
        link: "/coupons",
        icon: 'ticket',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Gift Cards",
        link: route.GiftCard,
        icon: 'cards',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Discount",
        icon: 'file-percent',
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          { label: "Discount Plan", link: route.discountPlan, showSubRoute: false },
          { label: "Discount", link: route.discount, showSubRoute: false },
        ]
      },
    ],
  },

  {
    label: "People",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "People",

    submenuItems: [
      {
        label: "Customers",
        link: route.customers,
        icon: 'users-group',
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Stores",
        link: "/store-list",
        icon: 'home-bolt',
        showSubRoute: false,
        submenu: false,
      },
   
    ],
  },


  {
    label: "Content (CMS)",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Content (CMS)",
    submenuItems: [
      {
        label: "Blog",
        icon: 'wallpaper',
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          { label: "All Blog", link: all_routes.allBlogs },
          { label: "Blog Tags", link: all_routes.blogTag },
          { label: "Categories", link:all_routes.blogCategories },
          { label: "Blog Comments", link: all_routes.blogComments },
        ],
      },
      {
        label: "Testimonials",
        icon: 'star',
        link: all_routes.testimonial,
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "FAQ",
        icon: 'help-circle',
        link: all_routes.faq,
        showSubRoute: false,
        submenu: false,
      },

    ],
  },
  {
    label: "User Management",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "User Management",
    submenuItems: [
    
      {
        label: "Users",
        link: "/users",
        icon: 'shield-up',
        showSubRoute: false,
      },
      {
        label: "Roles & Permissions",
        link: "/roles-permissions",
        icon: 'jump-rope',
        showSubRoute: false,
      },
      {
        label: "Delete Account Request",
        link: "/delete-account",
        icon: 'trash-x',
        showSubRoute: false,
      },
    ],
  },

  {
    label: "Settings",
    submenu: true,
    showSubRoute: false,
    submenuHdr: "Settings",
    submenuItems: [
      {
        label: "Profile",
        link: "/profile",
        icon: 'user-circle',
        showSubRoute: false,
      },
     
      {
        label: "Financial Settings",
        showSubRoute: false,
        icon: 'settings-dollar',
        link: "/bank-settings-grid",
       
      },
     
      {
        label: "Logout",
        link: "/signin",
        icon: 'logout',
        showSubRoute: false,
      },
    ],
  },

  {
    label: "Help",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Help",
    submenuItems: [
      {
        label: "Support",
        link: "#",
        icon: 'file-text',
        showSubRoute: false,
      },
      {
        label: "App v2.0.7",
        link: "#",
        icon: 'exchange',
        showSubRoute: false,
      },
      {
        label: "Multi Level",
        showSubRoute: false,
        submenu: true,
        icon: 'menu-2',
        submenuItems: [
          { label: "Level 1.1", link: "#", showSubRoute: false },
          {
            label: "Level 1.2",
            submenu: true,
            showSubRoute: false,
            submenuItems: [
              { label: "Level 2.1", link: "#", showSubRoute: false },
              {
                label: "Level 2.2",
                submenu: true,
                showSubRoute: false,
                submenuItems: [
                  { label: "Level 3.1", link: "#", showSubRoute: false },
                  { label: "Level 3.2", link: "#", showSubRoute: false },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
