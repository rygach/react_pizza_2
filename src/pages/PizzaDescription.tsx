import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router-dom';

const PizzaDescription: React.FC = () => {
  const [pizza, setPizza] = React.useState<{
    imageUrl: string;
    title: string;
    price: number;
  }>();
  const { id } = useParams();

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get('https://62afefe0b0a980a2ef469e0b.mockapi.io/items/' + id);
        setPizza(data);
      } catch (error) {
        alert('Ошибка, при получении пиццы');
        console.log(error);
      }
    }
    fetchPizza();
  }, []);

  if (!pizza)
    return (
      <div className="container">
        <h3>
          <span>😬</span>
          <br />
          Скоро пицца загрузится
        </h3>
      </div>
    );

  return (
    <div className="container">
      <img className="pizza-block__image" src={pizza.imageUrl} alt="pizza_image" />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} ₽</h4>
    </div>
  );
};

export default PizzaDescription;
