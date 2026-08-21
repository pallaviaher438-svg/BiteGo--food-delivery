import { Restaurant, Coupon, DeliveryAddress, Order } from '../types';

export const INITIAL_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    addressLine: '42, Tech Park Avenue, Block C, Silicon Valley Sector, Nashik 422005',
    phone: '+91 9876543210',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    addressLine: 'Plot 15, IT Park, MIDC Ambad, Nashik 422010',
    phone: '+91 9876543210',
  },
  {
    id: 'addr-3',
    label: 'Other',
    addressLine: 'Flat 302, Green View Heights, College Road, Nashik 422005',
    phone: '+91 9876543210',
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'BITE50',
    discountType: 'percentage',
    discountValue: 50,
    maxDiscount: 100,
    minOrder: 199,
    description: '50% OFF up to ₹100 on your first order'
  },
  {
    code: 'NASHIKFEAST',
    discountType: 'flat',
    discountValue: 150,
    minOrder: 499,
    description: 'Flat ₹150 OFF on orders above ₹499'
  },
  {
    code: 'FREEDEL',
    discountType: 'flat',
    discountValue: 40,
    minOrder: 299,
    description: 'Free delivery on orders above ₹299'
  }
];

export const RESTAURANTS_DATA: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Burger King',
    tagline: 'Flame-grilled burgers & crispy fries',
    cuisine: ['Burgers', 'American', 'Fast Food'],
    rating: 4.5,
    reviewsCount: '3.4k+',
    deliveryTime: '20-30 mins',
    priceForOne: 200,
    discountBadge: '50% OFF up to ₹100',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBiK2wWQKblhCitDbsKB9jp7OqhztNWK1mM6E566haWNZkKd67a0hTld_f9ZSy4VL0KAKJDR__ZXUifgC1WK1RtSHw5yuHqzBEYTvoz5QYqMQR_wA_M_L-bIaU8gqgxuzcL97WA7CZqxCu67PcNzYNXnv09t0lgt9TT6G2XAo4WzVwA8B3u5tVM48NF4cZwxd6NVRnYsXCKRBrv_zbpzQFbSoySAixXd-YpcoTED7OHnVBz_nDnZA',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArSPGeAo_Jb-nFzS7llRPQzc17Oxv6pQbVsdhfSUxgNU4pn3eVGw50eHLgTT6ilaFJUGzj_AGUyjYS4mvJrfIyWlVnaJBc9JOtqFKFoEwECwIQ4M5SaP4jJrHS752CxAOANz9GirLTNSc5xq1pNDG8TX9bl5SdENWBEF-7yp0bWUaz7W4Erk34x-RrdwY054RiqXJDbsu9K-k1B0Po0yz8tyXrOyRwrNY-EZpnz3UIqbcYDzD_dBw',
    distance: '1.8 km away',
    address: 'City Centre Mall, Untwadi, Nashik',
    isOpen: true,
    featured: true,
    menu: [
      {
        id: 'bk-1',
        name: 'Classic Cheeseburger',
        description: 'Flame grilled juicy patty, melted cheddar cheese, fresh lettuce and tangy secret sauce.',
        price: 225,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx4ei_PyuMpYH5prRYFMlrrTQhv9s7qEqlwjHIW1Hhhp1-COI4L5wxk8zfLZ7ovX96dU4GOzMPwTcJYJYFPOPRN7_0zDu4yYYYWgdxu7ZcyzIURyCO9suTcDSc10xCNqOSYEURND6W6jGER6N7iak6zw29KtF0isYf-Wvvr_tfUEaHeUoCyX3keJTNszrb1KswqoYRwTpvviHY2pocuBYT-ZG1HJtJFaLD_x_f1JLlI26_kw4xi_g',
        category: 'Burgers',
        isVeg: false,
        isBestseller: true,
        isAvailable: true,
        rating: 4.6
      },
      {
        id: 'bk-2',
        name: 'Crispy Veg Whopper',
        description: 'Signature crispy vegetable patty, crisp lettuce, juicy tomatoes, creamy mayo, sesame seed bun.',
        price: 180,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAStwwGbpgSJPP6v62lz3B1NaU39mMfrZC6qTDqhb5ZUZlk8ZVm8xx3E0kV0ceQ5SeFkxhFEvqPUh1SUvoRiPsNyroasRG5ZVZW41WQlHM19fdYB_qNuRI0KW49eWlOXF9fMX3z2j88Vi8rWaxkAiwiRBzzP4NbE1KWuGZhgFvcaT7aJBXrAOjoHmD6HDISqu46lg7AwBpwvYBvmSRnf9Wa8QTCVrVNyg76QvXixI2VoL6Pm77MB5U',
        category: 'Burgers',
        isVeg: true,
        isBestseller: true,
        isAvailable: true,
        rating: 4.5
      },
      {
        id: 'bk-3',
        name: 'Peri Peri Crispy Fries',
        description: 'Golden fried crispy potato fries tossed in zesty peri-peri spice mix.',
        price: 110,
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80',
        category: 'Sides',
        isVeg: true,
        isAvailable: true,
        rating: 4.3
      },
      {
        id: 'bk-4',
        name: 'Chilled Chocolate Shake',
        description: 'Rich creamy chocolate shake blended with premium cocoa and ice cream.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80',
        category: 'Beverages',
        isVeg: true,
        isAvailable: true,
        rating: 4.7
      }
    ]
  },
  {
    id: 'rest-2',
    name: "La Pino'z Pizza",
    tagline: 'Giant slices, authentic Italian toppings',
    cuisine: ['Pizza', 'Italian', 'Beverages'],
    rating: 4.8,
    reviewsCount: '2.1k+',
    deliveryTime: '35-40 mins',
    priceForOne: 400,
    discountBadge: 'Flat ₹150 OFF',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDEPwqAU4iQ2O4xPRxDQMzXzUyMt6Ev34c_9wrWzwfYqdeQY6dThsWfuy6-RdaAkmhJOTN-8reXmFIP0W-6snz-gAlhWpF_ixrh1YnPGL6JDpN6zo1N2jFrRKJ1XOIE--QQJr3J7EPgqDKq87bFI4kINXV7wN8Uq27zKex-2g0DDzGjHW_PKIVbtRsYHeDDX9xiYXaBnoSHg8ayza9p_KDAWq0uoOirkOO8skLDlN8p2emfTvIJpY',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArSPGeAo_Jb-nFzS7llRPQzc17Oxv6pQbVsdhfSUxgNU4pn3eVGw50eHLgTT6ilaFJUGzj_AGUyjYS4mvJrfIyWlVnaJBc9JOtqFKFoEwECwIQ4M5SaP4jJrHS752CxAOANz9GirLTNSc5xq1pNDG8TX9bl5SdENWBEF-7yp0bWUaz7W4Erk34x-RrdwY054RiqXJDbsu9K-k1B0Po0yz8tyXrOyRwrNY-EZpnz3UIqbcYDzD_dBw',
    distance: '3.1 km away',
    address: 'College Road, Near Thatte Nagar, Nashik',
    isOpen: true,
    featured: true,
    menu: [
      {
        id: 'lp-1',
        name: 'Pepperoni Pizza (Large)',
        description: 'Hand-tossed crust, rich Italian marinara, loaded with mozzarella and spicy beef pepperoni slices.',
        price: 650,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy32mBAt5JwkqN_yv3X5rv8eXyBW4dYzRk91ojw9BTU4QpdM74NyvS7prGDK8P4SeKk9ieXS4zUzjkHZilgun9xNJZvUE2jcy4g6GptIaCmZdckR8G0rFW7mIPSY_Io_zkYj0OHTFHAH4xpM0hDF9k37xrB5ItxX7YN5-HRjo4W1eodmngZyQYHBUmKMdZwpeWwmgw9-KJtWYSfGhoGWPh8Q3KSKyYeKLbipXtApUbmh20dtqZ5Ig',
        category: 'Pizzas',
        isVeg: false,
        isBestseller: true,
        isAvailable: true,
        rating: 4.8
      },
      {
        id: 'lp-2',
        name: 'Wood-fired Rocket & Mozzarella',
        description: 'Authentic thin crust with fresh buffalo mozzarella, cherry tomatoes, and garden rocket leaves.',
        price: 480,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoCxB_0iR8kL790aTTvF98xIRbqBG2NBO-N1BfcCQx67Gil5j3Yht7BThtB6TyRqh3hAUn2EzFPqrxweiUYYuYFDDHappLR7Em9YXV_00LjnEByj-8uMgTNO4FNFpsGfKCPqnPJ-sUHtNgcatGZiSkQVTNaLkGqTJnxM-PjvUccTyJEXDk80ibUQNIL7_H4uOpzL_GmIcfVUKJHrTKofTBc2RWYb4pNeKzm8dEm3weDjLJoxKakuE',
        category: 'Pizzas',
        isVeg: true,
        isBestseller: true,
        isAvailable: true,
        rating: 4.9
      },
      {
        id: 'lp-3',
        name: 'Cheesy Garlic Breadsticks',
        description: 'Freshly baked buttery garlic dough sticks filled with mozzarella and oregano herb drizzle.',
        price: 190,
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=500&q=80',
        category: 'Appetizers',
        isVeg: true,
        isAvailable: true,
        rating: 4.6
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'The Spice Route',
    tagline: 'Authentic Indian Cuisine • North Indian',
    cuisine: ['Indian', 'North Indian', 'Biryani', 'Mughlai'],
    rating: 4.8,
    reviewsCount: '1k+ reviews',
    deliveryTime: '30-40 min',
    priceForOne: 350,
    discountBadge: '40% OFF Special',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5ov_RtwdgXuYzskx4OB4VbpIvqpbCqyn3781WFwQoIFzQPS5xQlA8SHdFk7SFtRPhAUjKqeK0eo23YsaIx89KIFA5gAUWn9t7wAMn272tCNR0pDBIQ9Csuuz7rSw9D62XDShHiTQOitWKAER7TCGryEZxPvwg7tuHOdvTPT14fLDqforAXgV-7y-6s2hEIKXwAznQ8LBEHHHNw6dZlWTk6Jwks5CGlZerXWOVAMiFfcqOYxaKp-k',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArSPGeAo_Jb-nFzS7llRPQzc17Oxv6pQbVsdhfSUxgNU4pn3eVGw50eHLgTT6ilaFJUGzj_AGUyjYS4mvJrfIyWlVnaJBc9JOtqFKFoEwECwIQ4M5SaP4jJrHS752CxAOANz9GirLTNSc5xq1pNDG8TX9bl5SdENWBEF-7yp0bWUaz7W4Erk34x-RrdwY054RiqXJDbsu9K-k1B0Po0yz8tyXrOyRwrNY-EZpnz3UIqbcYDzD_dBw',
    distance: '2.5 km away',
    address: 'Gangapur Road, Near Old Gangapur Naka, Nashik',
    isOpen: true,
    featured: true,
    menu: [
      {
        id: 'sr-1',
        name: 'Samosa Chaat',
        description: 'Crispy samosas crushed and topped with yogurt, tamarind chutney, mint and aromatic spices.',
        price: 180,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOme2k_euA1EaTMM8ut9Up2jLbh3-E8F0N91Qz5NsMjV1U6D63FvmseavHhtbmNS0GQ73C5ekkIpEKLifxmzGvvcDA8nhNLHzGNVl8UjXSghmM_uNo9az5WQGUyxDMIdvnA4THnI4BuQs0v0H5FKPs4TSXj2XXv7FUrsFvXZS94t6vaXb9eUqv0JDbV186vuk3BqyX-F71-XFskkqJCAiMx3NjsDstbY9_y8fVhv2xpHUoeQpsBng',
        category: 'Appetizers',
        isVeg: true,
        isAvailable: true,
        rating: 4.7
      },
      {
        id: 'sr-2',
        name: 'Paneer Tikka',
        description: 'Cottage cheese marinated in spiced hung yogurt, chargrilled in a traditional clay tandoor with capsicum.',
        price: 250,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQGUKzNoW7XsCai46H0idqYliG4K5qxNG55Z4U9eIHFOD9dUBfdTztxRedoX28_D_74P9BJh9tflMdM8pwadqio-ku1n5ZkjpbFgAquq7D9Q0s5qNgjRrlcE9yov3P97Ne-jxHFq6J-Ut_yV5vwBcnNxsB685-3qIehj4Fgep_NbJxDxv-crgtYPMNfq-vbjO9pIfKYKssE3SC7R862boj6BlvvkRAv3a0MblZJlE3ooEklTdDgUE',
        category: 'Appetizers',
        isVeg: true,
        isBestseller: true,
        isAvailable: true,
        rating: 4.9
      },
      {
        id: 'sr-3',
        name: 'Butter Chicken',
        description: 'Tender chicken cooked in a rich, slow-simmered velvety tomato, cashew and butter gravy.',
        price: 450,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXPdD1ETYzhlTYnfYdv87kREXcOT3Tptnw19DXuQ9OXMgKZa9ZESwoJeBlpbQtRwyVy80hjDdCmvF4FaDvzNpQbF2g91-7kfRp-ouMGvGrjt0SnNT3_PjQ3Y2-P4Ccam6oBzqnc2SOkRxBLV6viwith7ip5b4fWpDuh7m26ttK1UWKBMnUopK4UzUkL2HcBoMGkdX2wfqp4S2H4syL0ARd3HRw4U67qc610_lfdKaj_mOOzQ39nls',
        category: 'Main Course',
        isVeg: false,
        isBestseller: true,
        isAvailable: true,
        rating: 4.9
      },
      {
        id: 'sr-4',
        name: 'Dal Makhani Heritage',
        description: 'Black lentils slow-cooked overnight with creamy butter, aromatic spices and fenugreek garnish.',
        price: 320,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEenwV7Kh9q142quNXSmvcGmkNw9nzO2C21Bs_kvZzYjncQPpToI9dTj5cCeT7iMEqj680OKlFv0ChOcHbDI3SBNNA3OgZQviwcBi5LbiNqrmmB8qeIuT5vUJOdmO7f5dB37sWBFzMZg87zEA7LR44LWXgjUzUMVi19R_CvMcr82l6irx86L-Pqz1X19BHWyczLhQAOly-khbeWn7Xj7rLQKdegfIghyLpuSEbCQHrJID0OB9CN20',
        category: 'Main Course',
        isVeg: true,
        isBestseller: true,
        isAvailable: true,
        rating: 4.8
      },
      {
        id: 'sr-5',
        name: 'Butter Garlic Naan',
        description: 'Tandoor-baked leavened flatbread brushed with garlic butter and fresh coriander.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
        category: 'Breads',
        isVeg: true,
        isAvailable: true,
        rating: 4.7
      },
      {
        id: 'sr-6',
        name: 'Royal Mango Lassi',
        description: 'Thick creamy churned yogurt blended with Alphonso mango pulp and cardamom.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80',
        category: 'Beverages',
        isVeg: true,
        isAvailable: true,
        rating: 4.8
      },
      {
        id: 'sr-7',
        name: 'Gulab Jamun (2 pcs)',
        description: 'Soft milk-solid dumplings soaked in rose and saffron infused warm sugar syrup.',
        price: 90,
        image: 'https://images.unsplash.com/photo-1605197584547-c93ee1a34244?auto=format&fit=crop&w=500&q=80',
        category: 'Desserts',
        isVeg: true,
        isAvailable: true,
        rating: 4.9
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'Gourmet Burger Joint',
    tagline: 'Artisanal brioche buns, craft smash burgers',
    cuisine: ['Burgers', 'American', 'Gourmet Fast Food'],
    rating: 4.7,
    reviewsCount: '890 reviews',
    deliveryTime: '25-35 mins',
    priceForOne: 280,
    discountBadge: '20% OFF on ₹300',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBiK2wWQKblhCitDbsKB9jp7OqhztNWK1mM6E566haWNZkKd67a0hTld_f9ZSy4VL0KAKJDR__ZXUifgC1WK1RtSHw5yuHqzBEYTvoz5QYqMQR_wA_M_L-bIaU8gqgxuzcL97WA7CZqxCu67PcNzYNXnv09t0lgt9TT6G2XAo4WzVwA8B3u5tVM48NF4cZwxd6NVRnYsXCKRBrv_zbpzQFbSoySAixXd-YpcoTED7OHnVBz_nDnZA',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArSPGeAo_Jb-nFzS7llRPQzc17Oxv6pQbVsdhfSUxgNU4pn3eVGw50eHLgTT6ilaFJUGzj_AGUyjYS4mvJrfIyWlVnaJBc9JOtqFKFoEwECwIQ4M5SaP4jJrHS752CxAOANz9GirLTNSc5xq1pNDG8TX9bl5SdENWBEF-7yp0bWUaz7W4Erk34x-RrdwY054RiqXJDbsu9K-k1B0Po0yz8tyXrOyRwrNY-EZpnz3UIqbcYDzD_dBw',
    distance: '3.4 km away',
    address: 'Mahatma Nagar, Nashik',
    isOpen: true,
    featured: false,
    menu: [
      {
        id: 'gb-1',
        name: 'Truffle Smash Burger',
        description: 'Double smash patty with truffle aioli, caramelized onions and smoked gouda cheese on brioche.',
        price: 340,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx4ei_PyuMpYH5prRYFMlrrTQhv9s7qEqlwjHIW1Hhhp1-COI4L5wxk8zfLZ7ovX96dU4GOzMPwTcJYJYFPOPRN7_0zDu4yYYYWgdxu7ZcyzIURyCO9suTcDSc10xCNqOSYEURND6W6jGER6N7iak6zw29KtF0isYf-Wvvr_tfUEaHeUoCyX3keJTNszrb1KswqoYRwTpvviHY2pocuBYT-ZG1HJtJFaLD_x_f1JLlI26_kw4xi_g',
        category: 'Burgers',
        isVeg: false,
        isBestseller: true,
        isAvailable: true,
        rating: 4.8
      }
    ]
  },
  {
    id: 'rest-5',
    name: 'Nashik Mithai Sweets & Farsan',
    tagline: 'Traditional pure ghee sweets and snacks',
    cuisine: ['Sweets', 'Desserts', 'Street Food'],
    rating: 4.9,
    reviewsCount: '4.2k+',
    deliveryTime: '15-25 mins',
    priceForOne: 150,
    discountBadge: 'Free Delivery',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd0HrKjR_oO13M1mStQ34j5OYd5VxThnKe_jYdwdo9AS-BwfjcOSA7eHbLGq6UuOtu333aZOAry-Yeok2aiwUfPsyEyRbCN-hD0-DV68ZCOlmx3ShydHQcULGGaeEEjwvAOqForCDEplRuGpHLI-em1l-8RUISuDzhBWzuy349N1T2Zz3mJLOtgHsizHydOw8BEmsSCkRbT1wG2gi7MiG8zvlJOJxF6iFVVLzJGTo0NietmO79QiI',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArSPGeAo_Jb-nFzS7llRPQzc17Oxv6pQbVsdhfSUxgNU4pn3eVGw50eHLgTT6ilaFJUGzj_AGUyjYS4mvJrfIyWlVnaJBc9JOtqFKFoEwECwIQ4M5SaP4jJrHS752CxAOANz9GirLTNSc5xq1pNDG8TX9bl5SdENWBEF-7yp0bWUaz7W4Erk34x-RrdwY054RiqXJDbsu9K-k1B0Po0yz8tyXrOyRwrNY-EZpnz3UIqbcYDzD_dBw',
    distance: '1.2 km away',
    address: 'Main Road, Raviwar Peth, Nashik',
    isOpen: true,
    featured: false,
    menu: [
      {
        id: 'ms-1',
        name: 'Assorted Kaju Sweets Box (250g)',
        description: 'Finest hand-crafted cashewnut sweets including Kaju Katli, Kaju Pista Roll, and Kesar Bites.',
        price: 320,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd0HrKjR_oO13M1mStQ34j5OYd5VxThnKe_jYdwdo9AS-BwfjcOSA7eHbLGq6UuOtu333aZOAry-Yeok2aiwUfPsyEyRbCN-hD0-DV68ZCOlmx3ShydHQcULGGaeEEjwvAOqForCDEplRuGpHLI-em1l-8RUISuDzhBWzuy349N1T2Zz3mJLOtgHsizHydOw8BEmsSCkRbT1wG2gi7MiG8zvlJOJxF6iFVVLzJGTo0NietmO79QiI',
        category: 'Desserts',
        isVeg: true,
        isBestseller: true,
        isAvailable: true,
        rating: 4.9
      }
    ]
  },
  {
    id: 'rest-6',
    name: 'Green Bowl & Healthy Life',
    tagline: 'Farm fresh salads, keto bowls and detox juices',
    cuisine: ['Healthy', 'Salads', 'Continental'],
    rating: 4.6,
    reviewsCount: '650 reviews',
    deliveryTime: '20-30 mins',
    priceForOne: 250,
    discountBadge: '15% OFF Healthy',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-K3XaqlaRF1NB9IARRO_kSLs4_XhyhpqtmEAbIMkPT-WMu3er_RcNHn9gpTeShYOWSHh10oXEgfYFmaviohnL5C3-ZWYQMRZGM4rDCvhGAYEqVchKxDeiOACISKh551xPiNt19GYOn6PLOlcqqgTLu9t10wPQYqRurfWqy-ZzvpB0TsBwhrnVEWrsPgfsfmB1UUOR_r-Uzyrlf3pkWDj71MwJA-gGYfLQ-TFULuLRaewXpqwUqcM',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArSPGeAo_Jb-nFzS7llRPQzc17Oxv6pQbVsdhfSUxgNU4pn3eVGw50eHLgTT6ilaFJUGzj_AGUyjYS4mvJrfIyWlVnaJBc9JOtqFKFoEwECwIQ4M5SaP4jJrHS752CxAOANz9GirLTNSc5xq1pNDG8TX9bl5SdENWBEF-7yp0bWUaz7W4Erk34x-RrdwY054RiqXJDbsu9K-k1B0Po0yz8tyXrOyRwrNY-EZpnz3UIqbcYDzD_dBw',
    distance: '2.1 km away',
    address: 'Near City Centre, Nashik',
    isOpen: true,
    featured: false,
    menu: [
      {
        id: 'gbh-1',
        name: 'Avocado Greek Harvest Salad',
        description: 'Hass avocados, cherry tomatoes, cucumbers, kalamata olives, feta cheese, and lemon herb dressing.',
        price: 280,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-K3XaqlaRF1NB9IARRO_kSLs4_XhyhpqtmEAbIMkPT-WMu3er_RcNHn9gpTeShYOWSHh10oXEgfYFmaviohnL5C3-ZWYQMRZGM4rDCvhGAYEqVchKxDeiOACISKh551xPiNt19GYOn6PLOlcqqgTLu9t10wPQYqRurfWqy-ZzvpB0TsBwhrnVEWrsPgfsfmB1UUOR_r-Uzyrlf3pkWDj71MwJA-gGYfLQ-TFULuLRaewXpqwUqcM',
        category: 'Appetizers',
        isVeg: true,
        isBestseller: true,
        isAvailable: true,
        rating: 4.7
      }
    ]
  }
];

export const CUISINE_CATEGORIES = [
  {
    name: 'Pizza',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoCxB_0iR8kL790aTTvF98xIRbqBG2NBO-N1BfcCQx67Gil5j3Yht7BThtB6TyRqh3hAUn2EzFPqrxweiUYYuYFDDHappLR7Em9YXV_00LjnEByj-8uMgTNO4FNFpsGfKCPqnPJ-sUHtNgcatGZiSkQVTNaLkGqTJnxM-PjvUccTyJEXDk80ibUQNIL7_H4uOpzL_GmIcfVUKJHrTKofTBc2RWYb4pNeKzm8dEm3weDjLJoxKakuE'
  },
  {
    name: 'Burgers',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAStwwGbpgSJPP6v62lz3B1NaU39mMfrZC6qTDqhb5ZUZlk8ZVm8xx3E0kV0ceQ5SeFkxhFEvqPUh1SUvoRiPsNyroasRG5ZVZW41WQlHM19fdYB_qNuRI0KW49eWlOXF9fMX3z2j88Vi8rWaxkAiwiRBzzP4NbE1KWuGZhgFvcaT7aJBXrAOjoHmD6HDISqu46lg7AwBpwvYBvmSRnf9Wa8QTCVrVNyg76QvXixI2VoL6Pm77MB5U'
  },
  {
    name: 'Indian',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEenwV7Kh9q142quNXSmvcGmkNw9nzO2C21Bs_kvZzYjncQPpToI9dTj5cCeT7iMEqj680OKlFv0ChOcHbDI3SBNNA3OgZQviwcBi5LbiNqrmmB8qeIuT5vUJOdmO7f5dB37sWBFzMZg87zEA7LR44LWXgjUzUMVi19R_CvMcr82l6irx86L-Pqz1X19BHWyczLhQAOly-khbeWn7Xj7rLQKdegfIghyLpuSEbCQHrJID0OB9CN20'
  },
  {
    name: 'Sweets',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd0HrKjR_oO13M1mStQ34j5OYd5VxThnKe_jYdwdo9AS-BwfjcOSA7eHbLGq6UuOtu333aZOAry-Yeok2aiwUfPsyEyRbCN-hD0-DV68ZCOlmx3ShydHQcULGGaeEEjwvAOqForCDEplRuGpHLI-em1l-8RUISuDzhBWzuy349N1T2Zz3mJLOtgHsizHydOw8BEmsSCkRbT1wG2gi7MiG8zvlJOJxF6iFVVLzJGTo0NietmO79QiI'
  },
  {
    name: 'Healthy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-K3XaqlaRF1NB9IARRO_kSLs4_XhyhpqtmEAbIMkPT-WMu3er_RcNHn9gpTeShYOWSHh10oXEgfYFmaviohnL5C3-ZWYQMRZGM4rDCvhGAYEqVchKxDeiOACISKh551xPiNt19GYOn6PLOlcqqgTLu9t10wPQYqRurfWqy-ZzvpB0TsBwhrnVEWrsPgfsfmB1UUOR_r-Uzyrlf3pkWDj71MwJA-gGYfLQ-TFULuLRaewXpqwUqcM'
  },
  {
    name: 'Sushi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuWgjaehL5MHb-NGZtxkb7ykIDo1wh_J2iLg-1aRC9oxo7EZDfXcu4MMbzSRXP9Vapl6JKucDe6uOYl3E9zcPzatE3HzhvgPs7hN_iDXIzLjgWYNsi-QFBme1quEy08ajw0_3NVylIPdsuCP_DDpd5on8dRv0d7mhz0R1Iw2P6PYkq6dYEuAwF9x7RdFtlqHBrSHJoOjAvuTxMeymhgTxRqIjhtcjP6wP7Z4K51RX7T1s-CNgSLek'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-new-1',
    orderNumber: 'BG-9102',
    restaurantId: 'rest-3',
    restaurantName: 'The Spice Route',
    items: [
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 1,
        item: {
          id: 'sr-3',
          name: 'Butter Chicken',
          description: 'Tender chicken cooked in a rich, slow-simmered velvety tomato, cashew and butter gravy.',
          price: 450,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXPdD1ETYzhlTYnfYdv87kREXcOT3Tptnw19DXuQ9OXMgKZa9ZESwoJeBlpbQtRwyVy80hjDdCmvF4FaDvzNpQbF2g91-7kfRp-ouMGvGrjt0SnNT3_PjQ3Y2-P4Ccam6oBzqnc2SOkRxBLV6viwith7ip5b4fWpDuh7m26ttK1UWKBMnUopK4UzUkL2HcBoMGkdX2wfqp4S2H4syL0ARd3HRw4U67qc610_lfdKaj_mOOzQ39nls',
          category: 'Main Course',
          isVeg: false,
          isAvailable: true
        }
      },
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 2,
        item: {
          id: 'sr-5',
          name: 'Butter Garlic Naan',
          description: 'Tandoor-baked leavened flatbread brushed with garlic butter and fresh coriander.',
          price: 60,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
          category: 'Breads',
          isVeg: true,
          isAvailable: true
        }
      },
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 1,
        item: {
          id: 'sr-6',
          name: 'Royal Mango Lassi',
          description: 'Thick creamy churned yogurt blended with Alphonso mango pulp and cardamom.',
          price: 120,
          image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80',
          category: 'Beverages',
          isVeg: true,
          isAvailable: true
        }
      }
    ],
    itemTotal: 690,
    deliveryFee: 30,
    taxes: 35,
    discount: 50,
    couponApplied: 'BITE50',
    total: 705,
    status: 'confirmed',
    estimatedArrival: '30-35 mins',
    estimatedMinutes: 25,
    placedAt: 'Just now (1 min ago)',
    address: INITIAL_ADDRESSES[1],
    customerName: 'Rahul Deshmukh',
    customerPhone: '+91 98230 45678',
    specialInstructions: 'Make gravy medium spicy. Please include extra mint chutney and fresh cut onions.',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    deliveryPartner: {
      name: 'Santosh G.',
      phone: '+91 98231 11223',
      rating: 4.9,
      deliveriesCount: 940,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      vehicleNumber: 'MH 15 EV 8890'
    }
  },
  {
    id: 'ord-new-2',
    orderNumber: 'BG-9108',
    restaurantId: 'rest-3',
    restaurantName: 'The Spice Route',
    items: [
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 1,
        item: {
          id: 'sr-2',
          name: 'Paneer Tikka',
          description: 'Cottage cheese marinated in spiced hung yogurt, chargrilled in a traditional clay tandoor with capsicum.',
          price: 250,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQGUKzNoW7XsCai46H0idqYliG4K5qxNG55Z4U9eIHFOD9dUBfdTztxRedoX28_D_74P9BJh9tflMdM8pwadqio-ku1n5ZkjpbFgAquq7D9Q0s5qNgjRrlcE9yov3P97Ne-jxHFq6J-Ut_yV5vwBcnNxsB685-3qIehj4Fgep_NbJxDxv-crgtYPMNfq-vbjO9pIfKYKssE3SC7R862boj6BlvvkRAv3a0MblZJlE3ooEklTdDgUE',
          category: 'Appetizers',
          isVeg: true,
          isAvailable: true
        }
      },
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 1,
        item: {
          id: 'sr-4',
          name: 'Dal Makhani Heritage',
          description: 'Black lentils slow-cooked overnight with creamy butter, aromatic spices and fenugreek garnish.',
          price: 320,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEenwV7Kh9q142quNXSmvcGmkNw9nzO2C21Bs_kvZzYjncQPpToI9dTj5cCeT7iMEqj680OKlFv0ChOcHbDI3SBNNA3OgZQviwcBi5LbiNqrmmB8qeIuT5vUJOdmO7f5dB37sWBFzMZg87zEA7LR44LWXgjUzUMVi19R_CvMcr82l6irx86L-Pqz1X19BHWyczLhQAOly-khbeWn7Xj7rLQKdegfIghyLpuSEbCQHrJID0OB9CN20',
          category: 'Main Course',
          isVeg: true,
          isAvailable: true
        }
      },
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 3,
        item: {
          id: 'sr-5',
          name: 'Butter Garlic Naan',
          description: 'Tandoor-baked leavened flatbread brushed with garlic butter and fresh coriander.',
          price: 60,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
          category: 'Breads',
          isVeg: true,
          isAvailable: true
        }
      }
    ],
    itemTotal: 750,
    deliveryFee: 35,
    taxes: 38,
    discount: 0,
    total: 823,
    status: 'confirmed',
    estimatedArrival: '25-30 mins',
    estimatedMinutes: 20,
    placedAt: '3 mins ago',
    address: INITIAL_ADDRESSES[2],
    customerName: 'Sneha Kulkarni',
    customerPhone: '+91 97654 32109',
    specialInstructions: 'Pure Veg food preparation only. Please do not add coriander garnish on Dal Makhani.',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    deliveryPartner: {
      name: 'Mayur Thorat',
      phone: '+91 98224 55667',
      rating: 4.8,
      deliveriesCount: 650,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      vehicleNumber: 'MH 15 CS 4120'
    }
  },
  {
    id: 'ord-new-3',
    orderNumber: 'BG-9115',
    restaurantId: 'rest-3',
    restaurantName: 'The Spice Route',
    items: [
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 2,
        item: {
          id: 'sr-1',
          name: 'Samosa Chaat',
          description: 'Crispy samosas crushed and topped with yogurt, tamarind chutney, mint and aromatic spices.',
          price: 180,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOme2k_euA1EaTMM8ut9Up2jLbh3-E8F0N91Qz5NsMjV1U6D63FvmseavHhtbmNS0GQ73C5ekkIpEKLifxmzGvvcDA8nhNLHzGNVl8UjXSghmM_uNo9az5WQGUyxDMIdvnA4THnI4BuQs0v0H5FKPs4TSXj2XXv7FUrsFvXZS94t6vaXb9eUqv0JDbV186vuk3BqyX-F71-XFskkqJCAiMx3NjsDstbY9_y8fVhv2xpHUoeQpsBng',
          category: 'Appetizers',
          isVeg: true,
          isAvailable: true
        }
      },
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 2,
        item: {
          id: 'sr-6',
          name: 'Royal Mango Lassi',
          description: 'Thick creamy churned yogurt blended with Alphonso mango pulp and cardamom.',
          price: 120,
          image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80',
          category: 'Beverages',
          isVeg: true,
          isAvailable: true
        }
      }
    ],
    itemTotal: 600,
    deliveryFee: 40,
    taxes: 30,
    discount: 0,
    total: 670,
    status: 'confirmed',
    estimatedArrival: '20-25 mins',
    estimatedMinutes: 18,
    placedAt: '5 mins ago',
    address: INITIAL_ADDRESSES[0],
    customerName: 'Amit Patil',
    customerPhone: '+91 94231 88990',
    specialInstructions: 'Pack curd and chutneys separately so samosas stay hot & crunchy.',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    deliveryPartner: {
      name: 'Anand Shinde',
      phone: '+91 98901 23456',
      rating: 4.7,
      deliveriesCount: 420,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      vehicleNumber: 'MH 15 BK 1902'
    }
  },
  {
    id: 'ord-prep-1',
    orderNumber: 'BG-8930',
    restaurantId: 'rest-3',
    restaurantName: 'The Spice Route',
    items: [
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 1,
        item: {
          id: 'sr-3',
          name: 'Butter Chicken',
          description: 'Tender chicken cooked in rich tomato butter gravy.',
          price: 450,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXPdD1ETYzhlTYnfYdv87kREXcOT3Tptnw19DXuQ9OXMgKZa9ZESwoJeBlpbQtRwyVy80hjDdCmvF4FaDvzNpQbF2g91-7kfRp-ouMGvGrjt0SnNT3_PjQ3Y2-P4Ccam6oBzqnc2SOkRxBLV6viwith7ip5b4fWpDuh7m26ttK1UWKBMnUopK4UzUkL2HcBoMGkdX2wfqp4S2H4syL0ARd3HRw4U67qc610_lfdKaj_mOOzQ39nls',
          category: 'Main Course',
          isVeg: false,
          isAvailable: true
        }
      },
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 2,
        item: {
          id: 'sr-5',
          name: 'Butter Garlic Naan',
          description: 'Tandoor baked flatbread.',
          price: 60,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
          category: 'Breads',
          isVeg: true,
          isAvailable: true
        }
      }
    ],
    itemTotal: 570,
    deliveryFee: 30,
    taxes: 28,
    discount: 0,
    total: 628,
    status: 'preparing',
    estimatedArrival: '7:55 PM',
    estimatedMinutes: 14,
    placedAt: '12 mins ago',
    address: INITIAL_ADDRESSES[1],
    customerName: 'Priya Sharma',
    customerPhone: '+91 98812 34567',
    specialInstructions: 'Make it extra spicy and pack spoon/fork.',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    deliveryPartner: {
      name: 'Vikram Jadhav',
      phone: '+91 98220 77889',
      rating: 4.9,
      deliveriesCount: 1100,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      vehicleNumber: 'MH 15 AZ 7711'
    }
  },
  {
    id: 'ord-active-1',
    orderNumber: 'BG-8924',
    restaurantId: 'rest-4',
    restaurantName: 'Gourmet Burger Joint',
    items: [
      {
        restaurantId: 'rest-4',
        restaurantName: 'Gourmet Burger Joint',
        quantity: 2,
        item: {
          id: 'bk-1',
          name: 'Classic Cheeseburger',
          description: 'Flame grilled juicy patty, melted cheddar cheese.',
          price: 225,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx4ei_PyuMpYH5prRYFMlrrTQhv9s7qEqlwjHIW1Hhhp1-COI4L5wxk8zfLZ7ovX96dU4GOzMPwTcJYJYFPOPRN7_0zDu4yYYYWgdxu7ZcyzIURyCO9suTcDSc10xCNqOSYEURND6W6jGER6N7iak6zw29KtF0isYf-Wvvr_tfUEaHeUoCyX3keJTNszrb1KswqoYRwTpvviHY2pocuBYT-ZG1HJtJFaLD_x_f1JLlI26_kw4xi_g',
          category: 'Burgers',
          isVeg: false,
          isAvailable: true
        }
      },
      {
        restaurantId: 'rest-4',
        restaurantName: 'Gourmet Burger Joint',
        quantity: 1,
        item: {
          id: 'lp-1',
          name: 'Pepperoni Pizza (Large)',
          description: 'Hand-tossed crust, loaded with mozzarella and pepperoni.',
          price: 650,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy32mBAt5JwkqN_yv3X5rv8eXyBW4dYzRk91ojw9BTU4QpdM74NyvS7prGDK8P4SeKk9ieXS4zUzjkHZilgun9xNJZvUE2jcy4g6GptIaCmZdckR8G0rFW7mIPSY_Io_zkYj0OHTFHAH4xpM0hDF9k37xrB5ItxX7YN5-HRjo4W1eodmngZyQYHBUmKMdZwpeWwmgw9-KJtWYSfGhoGWPh8Q3KSKyYeKLbipXtApUbmh20dtqZ5Ig',
          category: 'Pizzas',
          isVeg: false,
          isAvailable: true
        }
      }
    ],
    itemTotal: 1100,
    deliveryFee: 40,
    taxes: 55,
    discount: 0,
    total: 1195,
    status: 'on_the_way',
    estimatedArrival: '7:45 PM',
    estimatedMinutes: 12,
    placedAt: '20 mins ago',
    address: INITIAL_ADDRESSES[0],
    customerName: 'Kunal Deshmukh',
    customerPhone: '+91 98221 99887',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    deliveryPartner: {
      name: 'Alex M.',
      phone: '+91 9823012345',
      rating: 4.9,
      deliveriesCount: 1204,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWv-MffSDYcdDAFBFZOOSPs7j0dQ5p1fWfo4VEj-QD4l5y-CvJTKm2z8wpUFkt-iypQg1JrfUkF5k1sGQh3yDkYY44ejU4aRWayO68cD0MHPITJpxqE_nwCmauFU2vCqOYs27QAzkeJtJdBINN9DsTEasIVTVdLagkq8PnXrg9MZ2xuANWqHqnlGsc-41-7hwGkt3gz4opMEqDIPWHMP2hvbyMQK3Y5Bk05sYMocyrY5n1_MUPSbg',
      vehicleNumber: 'MH 15 AB 4592'
    }
  },
  {
    id: 'ord-past-1',
    orderNumber: 'BG-7821',
    restaurantId: 'rest-3',
    restaurantName: 'The Spice Route',
    items: [
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 1,
        item: {
          id: 'sr-3',
          name: 'Butter Chicken',
          description: 'Tender chicken cooked in rich tomato butter gravy.',
          price: 450,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXPdD1ETYzhlTYnfYdv87kREXcOT3Tptnw19DXuQ9OXMgKZa9ZESwoJeBlpbQtRwyVy80hjDdCmvF4FaDvzNpQbF2g91-7kfRp-ouMGvGrjt0SnNT3_PjQ3Y2-P4Ccam6oBzqnc2SOkRxBLV6viwith7ip5b4fWpDuh7m26ttK1UWKBMnUopK4UzUkL2HcBoMGkdX2wfqp4S2H4syL0ARd3HRw4U67qc610_lfdKaj_mOOzQ39nls',
          category: 'Main Course',
          isVeg: false,
          isAvailable: true
        }
      },
      {
        restaurantId: 'rest-3',
        restaurantName: 'The Spice Route',
        quantity: 2,
        item: {
          id: 'sr-5',
          name: 'Butter Garlic Naan',
          description: 'Tandoor baked flatbread.',
          price: 60,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
          category: 'Breads',
          isVeg: true,
          isAvailable: true
        }
      }
    ],
    itemTotal: 570,
    deliveryFee: 0,
    taxes: 28,
    discount: 50,
    couponApplied: 'BITE50',
    total: 548,
    status: 'delivered',
    estimatedArrival: 'Delivered',
    estimatedMinutes: 0,
    placedAt: '2026-08-18 20:30',
    address: INITIAL_ADDRESSES[0],
    customerName: 'Rahul Deshmukh',
    customerPhone: '+91 98230 45678',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    deliveryPartner: {
      name: 'Rohan Sharma',
      phone: '+91 9823098765',
      rating: 4.8,
      deliveriesCount: 840,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      vehicleNumber: 'MH 15 CZ 1122'
    },
    review: {
      rating: 5,
      comment: 'Food was blazing hot and super delicious! Packaging was 10/10.',
      createdAt: '2026-08-18 21:20'
    }
  }
];
