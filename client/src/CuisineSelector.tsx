type CuisineSelectorProps = {
  cuisineList: any[];
  editMode?: boolean;
  handleSelect: React.ChangeEventHandler<HTMLSelectElement>;
}

export default function CuisineSelector({ cuisineList, editMode, handleSelect }: CuisineSelectorProps) {

  return (
    <div className="selectCuisine">
      <select name="dishCuisine" id={editMode ? "cuisineSelector__edit" : "cuisineSelector"} form="addDishForm" onChange={handleSelect}>
        {cuisineList.map(cuisine => (
          <option key={cuisine.id} value={cuisine.id}>{cuisine.name}</option>
        ))}
      </select>
    </div>
  )
}