import React from "react";

const PurchaserWishlistStats = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  // Destructure data to access the nested fields directly
  const { top_age_group, top_income_range, top_education_level, top_employment_status, top_sector } = data;

  return (
    <div>
      <h2>Purchaser Wishlist Stats</h2>
      <div>
        <p><strong>Top Age Group:</strong> {top_age_group?.age_group} with {top_age_group?.wishlists} wishlists</p>
        <p><strong>Top Income Range:</strong> {top_income_range?.income_range} with {top_income_range?.wishlists} wishlists</p>
        <p><strong>Top Education Level:</strong> {top_education_level?.education_level} with {top_education_level?.wishlists} wishlists</p>
        <p><strong>Top Employment Status:</strong> {top_employment_status?.employment_status} with {top_employment_status?.wishlists} wishlists</p>
        <p><strong>Top Sector:</strong> {top_sector?.sector} with {top_sector?.wishlists} wishlists</p>
      </div>
    </div>
  );
};

export default PurchaserWishlistStats;
