import React from 'react';

import '../scss/app.scss';

import Categories from '../Components/Categories';
import Sort from '../Components/Sort';
import PizzaBlock from '../Components/PizzaBlock';
import Skeleton from '../Components/PizzaBlock/Skeleton';
import Pagination from '../Components/Pagination';

export const Home = ({ searchValue }) => {
  // https://62afefe0b0a980a2ef469e0b.mockapi.io/items
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sortType, setSortType] = React.useState({
    name: 'популярности',
    sortProperty: 'rating',
  });
  const [categoryId, setCategoryId] = React.useState(0);
  // захордкодили количество страниц для реализации пагинации. так пришлось сделать из-за отсутствия нормального бэка
  const [currentPage, setCurrentPage] = React.useState(1);

  const pizzas = items
    // фильтрация оффлайн, по статчиным данным. не использую, потому что есть фильтрация по бэку
    // .filter((obj) => {
    //   if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
    //     return true;
    //   }
    //   return false;
    // })
    .map((obj) => <PizzaBlock key={obj.id} image={obj.imageUrl} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  React.useEffect(() => {
    setIsLoading(true);

    const sortBy = sortType.sortProperty.replace('-', '');
    const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : ``;
    const search = searchValue ? `&search=${searchValue}` : '';

    fetch(
      `https://62afefe0b0a980a2ef469e0b.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
    )
      .then((res) => {
        return res.json();
      })
      .then((arr) => {
        setItems(arr);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  return (
    <>
      <div className="container">
        <div className="content__top">
          <Categories valueCategory={categoryId} onChangeCategory={(id) => setCategoryId(id)} />
          <Sort valueSort={sortType} onChangeSort={(id) => setSortType(id)} />
        </div>
        <h2 className="content__title">Все пиццы</h2>
        <div className="content__items">{isLoading ? skeletons : pizzas}</div>
        <Pagination onChangePage={(numberPage) => setCurrentPage(numberPage)} />
      </div>
    </>
  );
};
