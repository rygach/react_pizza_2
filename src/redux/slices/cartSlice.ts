import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type CartItemType = {
  id: string;
  title: string;
  price: number;
  image: string;
  sizes: number;
  types: string;
  count: number;
};

interface CartSliceState {
  totalPrice: number;
  items: CartItemType[];
}

const initialState: CartSliceState = {
  totalPrice: 0,
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // редьюсер, который сначала проверяет, еслть ли такая пицца в массиве уже или нет, если есть, то он тупо увеличивает ей свойсво count и это отображается на сайте
    // если же такую пиццу еще не добавляли, то он в массив через push кидает новую пиццу и ставит значение счётчика в 1
    // тут же и обновляем общую стоимость, чтобы выводить в хедер и низ корзины
    // для работы с условием помогает переменная, которая в себе содержит текущую пиццу, с которой работаем. находим мы её через метод массива find
    addItem(state, action: PayloadAction<CartItemType>) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);

      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }

      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
    },
    // сначала делаем проверку, если у нас уже осталась одна пицца такого вида в корзине, то сразу удаляем её, чтобы не висела со значением 0 или вообще минусовым, если же условие проходит, то мы уменьшаем свойство count в данной пицце и уменьшаем стоимость
    // для работы с условием помогает переменная, которая в себе содержит текущую пиццу, с которой работаем. находим мы её через метод массива find
    minusItem(state, action: PayloadAction<string>) {
      const findItem = state.items.find((obj) => obj.id === action.payload);
      // if (findItem.count <= 1) state.items = state.items.filter((obj) => obj.id !== action.payload);

      if (findItem) {
        findItem.count--;
        state.totalPrice -= findItem.price;
      }
    },
    // здесь мы изменяем массив через метод filter - возвращаем в него всё, кроме той пиццы, айди которой мы получили (то есть с которой пиццы был нажат крестик)
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((obj) => obj.id !== action.payload);
    },
    // самое простое - если нажали кнопку очистки - обнуляем массив и общую стоимость
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const selectCart = (state: RootState) => state.cart;
export const selectCartItemById = (id: string) => (state: RootState) =>
  state.cart.items.find((obj) => obj.id === id);

export const { addItem, minusItem, removeItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
