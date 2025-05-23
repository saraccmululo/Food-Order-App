import useHttp from "../hooks/useHTTP";
import MealItem from "./MealItem";
import Error from "./Error.jsx";

const requestConfig = {};

const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://food-order-app-madm.onrender.com'; 

const Meals =  () => {
  const {data: loadedMeals, isLoading, error} = useHttp(`${BASE_URL}/meals`, requestConfig, []);

 if(isLoading) {
  return <p className="center">Fetching meals...</p>
 }
  if(error){
    return <Error title='Failed to fetch meals' message={error} />
  }
  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem 
         key={meal.id} 
         meal={meal}
        />))}
    </ul>
  )
}

export default Meals