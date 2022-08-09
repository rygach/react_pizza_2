import React from 'react';
import ContentLoader from 'react-content-loader';

const Skeleton: React.FC = () => (
  <ContentLoader
    className="pizza-block"
    speed={2}
    width={280}
    height={468}
    viewBox="0 0 280 468"
    backgroundColor="#ededed"
    foregroundColor="#ffd6d6">
    <rect x="0" y="280" rx="10" ry="10" width="280" height="25" />
    <rect x="0" y="324" rx="10" ry="10" width="280" height="90" />
    <rect x="0" y="420" rx="10" ry="10" width="91" height="46" />
    <rect x="125" y="420" rx="10" ry="10" width="153" height="46" />
    <circle cx="140" cy="141" r="125" />
  </ContentLoader>
);

export default Skeleton;
