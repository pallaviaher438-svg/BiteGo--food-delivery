import { getStore } from '../data/store';
import { Restaurant, MenuItem, MenuCategory } from '../types';
import { AppError } from '../utils/AppError';
import { generateId } from '../utils/authUtils';

export class RestaurantService {
  async listRestaurants(query: {
    search?: string;
    category?: string;
    cuisine?: string;
    isVeg?: string;
    isOpen?: string;
    sort?: string;
  }): Promise<Restaurant[]> {
    const store = await getStore();
    let results = [...store.restaurants];

    if (query.search) {
      const q = query.search.toLowerCase();
      results = results.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          r.tagline.toLowerCase().includes(q) ||
          r.cuisine.some(c => c.toLowerCase().includes(q))
      );
    }

    if (query.cuisine) {
      const c = query.cuisine.toLowerCase();
      results = results.filter(r => r.cuisine.some(cu => cu.toLowerCase().includes(c)));
    }

    if (query.category) {
      const cat = query.category.toLowerCase();
      results = results.filter(r => r.cuisine.some(c => c.toLowerCase().includes(cat)));
    }

    if (query.isVeg === 'true') {
      results = results.filter(r => r.menu.some(item => item.isVeg && item.isAvailable));
    }

    if (query.isOpen === 'true') {
      results = results.filter(r => r.isOpen);
    } else if (query.isOpen === 'false') {
      results = results.filter(r => !r.isOpen);
    }

    if (query.sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (query.sort === 'deliveryTime') {
      results.sort((a, b) => {
        const aMin = parseInt(a.deliveryTime.split('-')[0]);
        const bMin = parseInt(b.deliveryTime.split('-')[0]);
        return aMin - bMin;
      });
    } else if (query.sort === 'price') {
      results.sort((a, b) => a.priceForOne - b.priceForOne);
    } else {
      // default: featured first, then by rating
      results.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
    }

    return results;
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    const store = await getStore();
    const restaurant = store.restaurants.find(r => r.id === id);
    if (!restaurant) throw AppError.notFound('Restaurant');
    return restaurant;
  }

  async createRestaurant(data: Omit<Restaurant, 'id' | 'menu' | 'rating' | 'reviewsCount' | 'createdAt' | 'updatedAt'>): Promise<Restaurant> {
    const store = await getStore();
    const restaurant: Restaurant = {
      id: generateId('rest-'),
      name: data.name,
      tagline: data.tagline || '',
      cuisine: data.cuisine,
      rating: 0,
      reviewsCount: '0',
      deliveryTime: data.deliveryTime,
      priceForOne: data.priceForOne,
      discountBadge: data.discountBadge,
      coverImage: data.coverImage || '',
      logoImage: data.logoImage || '',
      distance: data.distance || 'N/A',
      address: data.address,
      isOpen: data.isOpen ?? true,
      featured: data.featured ?? false,
      menu: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.restaurants.push(restaurant);
    return restaurant;
  }

  async toggleStatus(restaurantId: string, isOpen: boolean, requestingUser: { role: string; restaurantId?: string }): Promise<Restaurant> {
    const store = await getStore();
    const idx = store.restaurants.findIndex(r => r.id === restaurantId);
    if (idx === -1) throw AppError.notFound('Restaurant');

    // Restaurant partners can only toggle their own restaurant
    if (requestingUser.role === 'restaurant' && requestingUser.restaurantId !== restaurantId) {
      throw AppError.forbidden('You can only manage your own restaurant');
    }

    store.restaurants[idx].isOpen = isOpen;
    store.restaurants[idx].updatedAt = new Date().toISOString();
    return store.restaurants[idx];
  }

  async addMenuItem(restaurantId: string, data: Omit<MenuItem, 'id'>, requestingUser: { role: string; restaurantId?: string }): Promise<MenuItem> {
    const store = await getStore();
    const idx = store.restaurants.findIndex(r => r.id === restaurantId);
    if (idx === -1) throw AppError.notFound('Restaurant');

    if (requestingUser.role === 'restaurant' && requestingUser.restaurantId !== restaurantId) {
      throw AppError.forbidden('You can only manage your own restaurant');
    }

    const item: MenuItem = {
      id: generateId('item-'),
      name: data.name,
      description: data.description || '',
      price: data.price,
      image: data.image || '',
      category: data.category,
      isVeg: data.isVeg ?? true,
      isBestseller: data.isBestseller ?? false,
      isAvailable: data.isAvailable ?? true,
      rating: data.rating,
    };

    store.restaurants[idx].menu.push(item);
    store.restaurants[idx].updatedAt = new Date().toISOString();
    return item;
  }

  async updateMenuItemPrice(restaurantId: string, itemId: string, price: number, requestingUser: { role: string; restaurantId?: string }): Promise<MenuItem> {
    const store = await getStore();
    const restaurantIdx = store.restaurants.findIndex(r => r.id === restaurantId);
    if (restaurantIdx === -1) throw AppError.notFound('Restaurant');

    if (requestingUser.role === 'restaurant' && requestingUser.restaurantId !== restaurantId) {
      throw AppError.forbidden('You can only manage your own restaurant');
    }

    const itemIdx = store.restaurants[restaurantIdx].menu.findIndex(m => m.id === itemId);
    if (itemIdx === -1) throw AppError.notFound('Menu item');

    store.restaurants[restaurantIdx].menu[itemIdx].price = price;
    store.restaurants[restaurantIdx].updatedAt = new Date().toISOString();
    return store.restaurants[restaurantIdx].menu[itemIdx];
  }

  async toggleItemAvailability(restaurantId: string, itemId: string, requestingUser: { role: string; restaurantId?: string }): Promise<MenuItem> {
    const store = await getStore();
    const restaurantIdx = store.restaurants.findIndex(r => r.id === restaurantId);
    if (restaurantIdx === -1) throw AppError.notFound('Restaurant');

    if (requestingUser.role === 'restaurant' && requestingUser.restaurantId !== restaurantId) {
      throw AppError.forbidden('You can only manage your own restaurant');
    }

    const itemIdx = store.restaurants[restaurantIdx].menu.findIndex(m => m.id === itemId);
    if (itemIdx === -1) throw AppError.notFound('Menu item');

    store.restaurants[restaurantIdx].menu[itemIdx].isAvailable = !store.restaurants[restaurantIdx].menu[itemIdx].isAvailable;
    store.restaurants[restaurantIdx].updatedAt = new Date().toISOString();
    return store.restaurants[restaurantIdx].menu[itemIdx];
  }

  async deleteMenuItem(restaurantId: string, itemId: string, requestingUser: { role: string; restaurantId?: string }): Promise<void> {
    const store = await getStore();
    const restaurantIdx = store.restaurants.findIndex(r => r.id === restaurantId);
    if (restaurantIdx === -1) throw AppError.notFound('Restaurant');

    if (requestingUser.role === 'restaurant' && requestingUser.restaurantId !== restaurantId) {
      throw AppError.forbidden('You can only manage your own restaurant');
    }

    const itemIdx = store.restaurants[restaurantIdx].menu.findIndex(m => m.id === itemId);
    if (itemIdx === -1) throw AppError.notFound('Menu item');

    store.restaurants[restaurantIdx].menu.splice(itemIdx, 1);
    store.restaurants[restaurantIdx].updatedAt = new Date().toISOString();
  }
}

export const restaurantService = new RestaurantService();
