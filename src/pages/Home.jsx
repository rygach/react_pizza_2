import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import qs from 'qs';

import '../scss/app.scss';
import { SearchContext } from '../App';

import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import Categories from '../Components/Categories';
import Sort from '../Components/Sort';
import PizzaBlock from '../Components/PizzaBlock';
import Skeleton from '../Components/PizzaBlock/Skeleton';
import Pagination from '../Components/Pagination';
import { popupList } from '../Components/Sort';

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);
  // вот эти две переменные насколько я понял используются как две переменные
  // для отслеживания состояния поиска и рендера. используется именно реф, потому что он сохраняет состояние, в котором его могли оставить в прошлый рендер
  // то есть это по сути переменная вне функции Home, но переменные вне функции home- зашквар, а это типо React хотя бы
  // так чище и понятнее код
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);
  console.log(isMounted.current);

  // https://62afefe0b0a980a2ef469e0b.mockapi.io/items
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { searchValue } = React.useContext(SearchContext);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  const pizzas = items.map((obj) => <PizzaBlock key={obj.id} image={obj.imageUrl} {...obj} />);

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  // это функция, куда мы просто засунули наш запрос пицц.
  // вынесли эту функцию для более читаемого кода,
  // эту функцию мы юзаем только в одном useEffect
  const fetchPizzas = () => {
    setIsLoading(true);

    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : ``;
    const search = searchValue ? `&search=${searchValue}` : '';

    axios
      .get(
        `https://62afefe0b0a980a2ef469e0b.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
      )
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      });
  };

  // этот useEffect тупо вшивает параметры в URL, но делает это по-умному
  // сначала он проверяет, был ли у нас хотя бы один рендер ? (в этом нам помогает useRef - isMounted)
  // если не было, то будет хуевой идеей вставлять при первом рендере(перезагрузке приложения) в URL какие - либо параметры
  // а вот если мы уже зарендерились хотя бы разок, то там уже чекаем че лежит в редаксе и от туда суем это говно в URL

  // всё! в этом useEffect больше ничего не делается. считывание URL параметров и загрузка по ним данных происходит в другом useEffect
  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });

      navigate(`?${queryString}`);
    }

    isMounted.current = true;
  }, [categoryId, sort.sortProperty, currentPage]);

  // при первом рендере, проверяем URL-параметры и сохраняем их в редакс
  // это на случай, если кто - то ввёл URL параметры прямо в адресную строку и хочет сразу получить сортированные пиццы

  // всё! в данном useEffect больше ничего не происходит. запрос в бд отправляется в другом useEffect
  React.useEffect(() => {
    if (
      window.location.search &&
      // костыльное решение, потому что если строку ниже убрать - будет баг при обновлении и выбранных пиццах всех
      window.location.search !== '?sortProperty=rating&categoryId=0&currentPage=1'
    ) {
      const params = qs.parse(window.location.search.substring(1));

      const sort = popupList.find((obj) => obj.sortProperty === params.sortProperty);

      dispatch(
        setFilters({
          ...params,
          sort,
        }),
      );

      // вот этот реф тут нужен тупо, чтобы обхитрить логику useEffect, чтобы у нас не происходило при первом рендере два запроса.
      isSearch.current = true;
    }
  }, []);

  // данный useEffect мы обернули в проверку useRef'a, потому что если бы мы не меняли этот ref, то у нас бы этот юсэф отработал бы два раза - первый раз по умолчанию, а второй раз когда изменились параметры, за которыми он следит. то есть по своим обязанностям бы перерендер вызвал бы
  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      fetchPizzas();
    }

    isSearch.current = false;
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
        <Pagination currentPage={currentPage} onChangePage={onChangePage} />
      </div>
    </>
  );
};
