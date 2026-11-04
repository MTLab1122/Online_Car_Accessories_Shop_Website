/**
 * AUTOX Privacy-Conscious E-Commerce Event Tracker (GA4 / GTM Standard)
 * Strictly zero Customer PII: NEVER logs or sends customer names, emails, phones, or addresses.
 */

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params,
      timestamp: new Date().toISOString()
    });

    // In development mode, log structured analytics event for verification
    if (import.meta.env.DEV) {
      console.log(`[AUTOX Analytics Event: ${eventName}]`, params);
    }
  }
};

export const analytics = {
  viewItem: (product) => {
    if (!product) return;
    trackEvent('view_item', {
      currency: 'PKR',
      value: product.price,
      items: [
        {
          item_id: product.SKU || product._id,
          item_name: product.name,
          item_brand: product.brand,
          item_category: product.category?.name || 'Car Accessories',
          price: product.price
        }
      ]
    });
  },

  viewItemList: (items = [], listName = 'Catalog Grid') => {
    trackEvent('view_item_list', {
      item_list_name: listName,
      items: items.slice(0, 10).map((p, index) => ({
        item_id: p.SKU || p._id,
        item_name: p.name,
        item_brand: p.brand,
        item_category: p.category?.name || 'Car Accessories',
        index: index + 1,
        price: p.price
      }))
    });
  },

  addToCart: (product, quantity = 1) => {
    if (!product) return;
    trackEvent('add_to_cart', {
      currency: 'PKR',
      value: product.price * quantity,
      items: [
        {
          item_id: product.SKU || product._id,
          item_name: product.name,
          item_brand: product.brand,
          price: product.price,
          quantity
        }
      ]
    });
  },

  removeFromCart: (product, quantity = 1) => {
    if (!product) return;
    trackEvent('remove_from_cart', {
      currency: 'PKR',
      value: product.price * quantity,
      items: [
        {
          item_id: product.SKU || product._id,
          item_name: product.name,
          price: product.price,
          quantity
        }
      ]
    });
  },

  viewCart: (cart) => {
    if (!cart) return;
    trackEvent('view_cart', {
      currency: 'PKR',
      value: cart.total,
      items: (cart.items || []).map(item => ({
        item_id: item.product?.SKU || item.product?._id,
        item_name: item.product?.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  },

  beginCheckout: (cart) => {
    if (!cart) return;
    trackEvent('begin_checkout', {
      currency: 'PKR',
      value: cart.total,
      coupon: cart.coupon?.code || undefined,
      items: (cart.items || []).map(item => ({
        item_id: item.product?.SKU || item.product?._id,
        item_name: item.product?.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  },

  purchase: (order) => {
    if (!order) return;
    trackEvent('purchase', {
      transaction_id: order.orderNumber || order._id,
      currency: 'PKR',
      value: order.total || order.totalPrice,
      shipping: order.shippingPrice || 0,
      payment_type: order.paymentMethod,
      items: (order.orderItems || []).map(item => ({
        item_id: item.product?._id || item.product,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
};
