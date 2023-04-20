type DishCardProps = {
  dishId: number;
  dishName: string;
  dishDescription: string;
  cuisineId: number;
  findCuisine: Function;
  handleEdit: React.MouseEventHandler<HTMLButtonElement>;
  handleDelete: React.MouseEventHandler<HTMLButtonElement>;
}

export default function DishCard({ dishId, dishName, dishDescription, cuisineId, findCuisine, handleDelete, handleEdit }: DishCardProps) {
  
  const { name, region } = findCuisine(cuisineId);

  return (
    <>
      <div>
        <span className="dishcard__name">{dishName}</span>
        <br/>
        <span className="dishcard__cuisine">Region: {name} - {region}</span>
        <br/>
        <span className="dishcard__description">{dishDescription}</span>
      </div>
      <button className="editbutton" value={`${dishId}`} onClick={handleEdit}>Edit</button>
      <button className="deletebutton" value={`${dishId}`} onClick={handleDelete}>Delete</button>
    </>
  )
}