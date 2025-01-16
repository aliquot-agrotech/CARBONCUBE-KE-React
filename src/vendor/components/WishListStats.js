import React from 'react';

const WishListStats = ({ data }) => {
  if (!data) return <div>No wishlist stats available</div>;

  const { top_wishlisted_products, wishlist_conversion_rate, wishlist_trends } = data;

  return (
    <div>
      <h3>Top 3 Wishlisted Products</h3>
      <ul>
        {top_wishlisted_products.map((product, index) => (
          <li key={index}>
            {product.ad_title}: {product.wishlist_count} wishes
          </li>
        ))}
      </ul>

      <h3>Wishlist Conversion Rate</h3>
      <ul>
        {wishlist_conversion_rate.map((product, index) => (
          <li key={index}>
            {product.ad_title}: {product.wishlist_count === 0 
              ? '0% conversion rate' 
              : ((product.purchase_count / product.wishlist_count) * 100).toFixed(2) + '%'}
          </li>
        ))}
      </ul>

      <h3>Wishlist Trends (Last 6 Months)</h3>
      <ul>
        {Array.isArray(wishlist_trends) && wishlist_trends.length > 0 ? (
          wishlist_trends.map((trend, index) => (
            <li key={index}>
              {trend.month} - {trend.ad_title}: {trend.count} wishlists
            </li>
          ))
        ) : (
          <li>No trends available</li>
        )}
      </ul>
    </div>
  );
};

export default WishListStats;
