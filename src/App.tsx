/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcher } from './components/RoleSwitcher';
import { HomeView } from './views/HomeView';
import { RestaurantView } from './views/RestaurantView';
import { CheckoutView } from './views/CheckoutView';
import { TrackOrderView } from './views/TrackOrderView';
import { OrdersView } from './views/OrdersView';
import { SearchView } from './views/SearchView';
import { ProfileView } from './views/ProfileView';
import { RestaurantPortalView } from './views/RestaurantPortalView';
import { DeliveryPartnerView } from './views/DeliveryPartnerView';
import { AdminPortalView } from './views/AdminPortalView';
import { AuthView } from './views/AuthView';

function AppContent() {
  const { currentScreen, role } = useApp();

  // If role is swapped directly, render corresponding portal
  if (role === 'restaurant') return <RestaurantPortalView />;
  if (role === 'delivery') return <DeliveryPartnerView />;
  if (role === 'admin') return <AdminPortalView />;

  switch (currentScreen) {
    case 'home':
      return <HomeView />;
    case 'restaurant':
      return <RestaurantView />;
    case 'cart':
      return <CheckoutView />;
    case 'track':
      return <TrackOrderView />;
    case 'orders':
      return <OrdersView />;
    case 'search':
      return <SearchView />;
    case 'profile':
      return <ProfileView />;
    case 'auth':
      return <AuthView />;
    case 'restaurant_portal':
      return <RestaurantPortalView />;
    case 'delivery_portal':
      return <DeliveryPartnerView />;
    case 'admin_portal':
      return <AdminPortalView />;
    default:
      return <HomeView />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="relative min-h-screen bg-[#fbf9f8] font-sans antialiased text-[#1b1c1c]">
        <RoleSwitcher />
        <AppContent />
      </div>
    </AppProvider>
  );
}

