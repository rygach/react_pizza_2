import React from 'react';

type CategoriesProps = {
  valueCategory: number;
  onChangeCategory: (idx: number) => void;
};

const Categories: React.FC<CategoriesProps> = ({ valueCategory, onChangeCategory }) => {
  const categories = ['Все', 'Мясныe', 'Вегетерианские', 'Гриль', 'Острые', 'Закрытые'];

  return (
    <div className="categories">
      <ul>
        {categories.map((categoryName, i) => (
          <li
            key={i}
            onClick={() => onChangeCategory(i)}
            className={valueCategory === i ? 'active' : ''}>
            {categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
