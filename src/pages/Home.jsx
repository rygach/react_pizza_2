import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../scss/app.scss';
import { SearchContext } from '../App';

import { setCategoryId } from '../redux/slices/filterSlice';
import Categories from '../Components/Categories';
import Sort from '../Components/Sort';
import PizzaBlock from '../Components/PizzaBlock';
import Skeleton from '../Components/PizzaBlock/Skeleton';
import Pagination from '../Components/Pagination';

export const Home = () => {
  const dispatch = useDispatch();

  const { categoryId, sort } = useSelector((state) => state.filter);

  console.log('id category', categoryId);

  // https://62afefe0b0a980a2ef469e0b.mockapi.io/items
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onChangeCategory = (id) => {
    console.log(id);
    dispatch(setCategoryId(id));
  };

  // скрыл стейт, который раньше использовался в фильтрации
  // const [categoryId, setCategoryId] = React.useState(0);
  // захордкодили количество страниц для реализации пагинации. так пришлось сделать из-за отсутствия нормального бэка
  const [currentPage, setCurrentPage] = React.useState(1);
  const { searchValue } = React.useContext(SearchContext);

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

    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
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
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  return (
    <>
      <div className="container">
        <div className="content__top">
          <Categories valueCategory={categoryId} onChangeCategory={onChangeCategory} />
          <Sort />
        </div>
        <h2 className="content__title">Все пиццы</h2>
        <div className="content__items">{isLoading ? skeletons : pizzas}</div>
        <Pagination onChangePage={(numberPage) => setCurrentPage(numberPage)} />
      </div>
    </>
  );
};
