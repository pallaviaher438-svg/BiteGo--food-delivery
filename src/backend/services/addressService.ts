import { getStore } from '../data/store';
import { DeliveryAddress } from '../types';
import { AppError } from '../utils/AppError';
import { generateId } from '../utils/authUtils';

export class AddressService {
  async getAddresses(userId: string): Promise<DeliveryAddress[]> {
    const store = await getStore();
    return store.addresses.filter(a => a.userId === userId);
  }

  async createAddress(userId: string, data: Omit<DeliveryAddress, 'id' | 'userId' | 'createdAt'>): Promise<DeliveryAddress> {
    const store = await getStore();

    // If isDefault is true, unset all existing defaults for this user
    if (data.isDefault) {
      store.addresses
        .filter(a => a.userId === userId)
        .forEach(a => { a.isDefault = false; });
    }

    const address: DeliveryAddress = {
      id: generateId('addr-'),
      userId,
      label: data.label,
      addressLine: data.addressLine,
      phone: data.phone,
      isDefault: data.isDefault ?? false,
      createdAt: new Date().toISOString(),
    };

    // If this is the first address, make it default automatically
    const existing = store.addresses.filter(a => a.userId === userId);
    if (existing.length === 0) address.isDefault = true;

    store.addresses.push(address);
    return address;
  }

  async updateAddress(addressId: string, userId: string, data: Partial<Omit<DeliveryAddress, 'id' | 'userId' | 'createdAt'>>): Promise<DeliveryAddress> {
    const store = await getStore();
    const idx = store.addresses.findIndex(a => a.id === addressId);
    if (idx === -1) throw AppError.notFound('Address');

    // Object-level authorization: address must belong to requesting user
    if (store.addresses[idx].userId !== userId) {
      throw AppError.forbidden('You do not have access to this address');
    }

    if (data.isDefault) {
      store.addresses
        .filter(a => a.userId === userId)
        .forEach(a => { a.isDefault = false; });
    }

    if (data.label !== undefined) store.addresses[idx].label = data.label;
    if (data.addressLine !== undefined) store.addresses[idx].addressLine = data.addressLine;
    if (data.phone !== undefined) store.addresses[idx].phone = data.phone;
    if (data.isDefault !== undefined) store.addresses[idx].isDefault = data.isDefault;

    return store.addresses[idx];
  }

  async deleteAddress(addressId: string, userId: string): Promise<void> {
    const store = await getStore();
    const idx = store.addresses.findIndex(a => a.id === addressId);
    if (idx === -1) throw AppError.notFound('Address');

    if (store.addresses[idx].userId !== userId) {
      throw AppError.forbidden('You do not have access to this address');
    }

    store.addresses.splice(idx, 1);
  }

  async getAddressById(addressId: string, userId: string): Promise<DeliveryAddress> {
    const store = await getStore();
    const address = store.addresses.find(a => a.id === addressId && a.userId === userId);
    if (!address) throw AppError.notFound('Address');
    return address;
  }
}

export const addressService = new AddressService();
