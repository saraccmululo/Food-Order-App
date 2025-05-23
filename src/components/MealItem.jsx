import { useContext } from "react";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import CartContext from "../store/CartContext";

const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://food-order-app-madm.onrender.com';

const MealItem = ({meal}) => {
  const cartCtx = useContext(CartContext);
  
  const handleAddMealToCart = () => {
    cartCtx.addItem(meal);
  }

  return (
    <li className='meal-item'> 
     <article>
       <img src={`${BASE_URL}/${meal.image}`} alt={meal.name} />
       <div>
         <h3>{meal.name}</h3>
         <p className="meal-item-price">{currencyFormatter.format(meal.price)}</p>
         <p className="meal-item-description">{meal.description}</p>
       </div>
       <p className="meal-item-actions">
        <Button onClick={handleAddMealToCart}>Add to Cart</Button>
       </p>
     </article>
    </li>
  )
}

export default MealItem