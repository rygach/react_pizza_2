import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import qs from 'qs';

import '../scss/app.scss';

import {
  FilterSliceState,
  selectFilter,
  setCategoryId,
  setCurrentPage,
  setFilters,
} from '../redux/slices/filterSlice';
import { fetchPizzas, SearchPizzaParams, selectPizzaData } from '../redux/slices/pizzaSlice';
import Categories from '../Components/Categories';
import Sort from '../Components/Sort';
import PizzaBlock from '../Components/PizzaBlock/index';
import Skeleton from '../Components/PizzaBlock/Skeleton';
import Pagination from '../Components/Pagination/index';
import { popupList } from '../Components/Sort';
import { useAppDispatch } from '../redux/store';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // вот эти две переменные насколько я понял используются как две переменные
  // для отслеживания состояния поиска и рендера. используется именно реф, потому что он сохраняет состояние, в котором его могли оставить в прошлый рендер
  // то есть это по сути переменная вне функции Home, но переменные вне функции home- зашквар, а это типо React хотя бы
  // так чище и понятнее код
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);

  const onChangeCategory = (idx: number) => {
    dispatch(setCategoryId(idx));
  };

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} image={obj.imageUrl} {...obj} />);

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  // после рефакторинга fetch теперь делается в асинхронном экшене редакс-тулкита
  // здесь мы просто засовываем в стор данные, которые получили с поисковой строки, а дальше приложуха уже отслеживая useEffect'ы делает перерисовку
  const getPizzas = async () => {
    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : ``;
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );
  };

  // этот useEffect тупо вшивает параметры в URL, но делает это по-умному
  // сначала он проверяет, был ли у нас хотя бы один рендер ? (в этом нам помогает useRef - isMounted)
  // если не было, то будет хуевой идеей вставлять при первом рендере(перезагрузке приложения) в URL какие - либо параметры
  // а вот если мы уже зарендерились хотя бы разок, то там уже чекаем че лежит в редаксе и от туда суем это говно в URL

  // всё! в этом useEffect больше ничего не делается. считывание URL параметров и загрузка по ним данных происходит в другом useEffect
  // React.useEffect(() => {
  //   if (isMounted.current) {
  //     const params = qs.stringify({
  //       sortProperty: sort.sortProperty,
  //       categoryId,
  //       currentPage,
  //     });

  //     // 17.08 это я добавил после того, как увидел её у Арчакова, без неё все работало + в условии сверху было не params, а queryString
  //     const queryString = qs.stringify(params, { skipNulls: true });

  //     navigate(`?${queryString}`);
  //   }
  //   // это условие я добавил после того, как увидел её у Арчакова, без неё все работало
  //   if (!window.location.search) {
  //     dispatch(fetchPizzas({} as SearchPizzaParams));
  //   }

  //   isMounted.current = true;
  // }, [categoryId, sort.sortProperty, currentPage]);

  // при первом рендере, проверяем URL-параметры и сохраняем их в редакс
  // это на случай, если кто - то ввёл URL параметры прямо в адресную строку и хочет сразу получить сортированные пиццы

  // всё! в данном useEffect больше ничего не происходит. запрос в бд отправляется в другом useEffect
  // React.useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
  //     const sort = popupList.find((obj) => obj.sortProperty === params.sortBy);
  //     dispatch(
  //       setFilters({
  //         categoryId: Number(params.category),
  //         currentPage: Number(params.currentPage),
  //         sort: sort || popupList[0],
  //         searchValue: params.search,
  //       }),
  //     );

  //     // вот этот реф тут нужен тупо, чтобы обхитрить логику useEffect, чтобы у нас не происходило при первом рендере два запроса.
  //     isSearch.current = true;
  //   }
  // }, []);

  // данный useEffect мы обернули в проверку useRef'a, потому что если бы мы не меняли этот ref, то у нас бы этот юсэф отработал бы два раза - первый раз по умолчанию, а второй раз когда изменились параметры, за которыми он следит. то есть по своим обязанностям бы перерендер вызвал бы
  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
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
        {status === 'error' ? (
          <div className="content__error-info">
            <h2>FFFFFFFFF KZZZZZZZ 😕</h2>
            <p>К сожалению, произошла ошибка</p>
            <p>Советуем найти в себе силы дописать бэкенд</p>
          </div>
        ) : (
          <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
        )}

        <Pagination currentPage={currentPage} onChangePage={onChangePage} />
      </div>
    </>
  );
};
