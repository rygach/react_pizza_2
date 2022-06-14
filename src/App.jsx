import logo from './logo.svg';
import './scss/app.scss';

import Header from './Components/Header';
import Categories from './Components/Categories';
import Sort from './Components/Sort';
import Pizza from './Components/Pizza';

import pizzas from './assets/pizzas.json';

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <Header />
        <div className="content">
          <div className="container">
            <div className="content__top">
              <Categories />
              <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
              {pizzas.map((obj) => (
                <Pizza key={obj.id} image={obj.imageUrl} {...obj} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
