import CuisineSelector from "./CuisineSelector";

type EditDishProps = {
  dish: object;
  isOpen: boolean;
  cuisineList: any[];
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  closeModal: React.MouseEventHandler<HTMLButtonElement>;
}

export default function EditDish({ dish, isOpen, cuisineList, handleSubmit, closeModal }: EditDishProps) {

  if (!isOpen) return null;

  const { name, description, cuisineId } = dish;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Edit Dish</h2>
        <form onSubmit={handleSubmit} id="editDishForm">
          <label htmlFor="dishName">Dish Name: </label>
          <br />
          <input type="text" name="dishName" id="edit__dishName" defaultValue={name} />
          <br />
          <label htmlFor="dishCuisine">Dish Cuisine: </label>
          <br />
          <CuisineSelector cuisineList={cuisineList} handleSelect={() => {}} editMode={true} />
          <br />
          <label htmlFor="dishDescription">Dish Description: </label>
          <br />
          <textarea name="dishDescription" id="edit__dishDescription" defaultValue={description} rows={5} cols={45} />
          <br />
          <button className="editbutton" type="submit">Submit</button>
          <button className="deletebutton" type="button" onClick={closeModal}>Close</button>
        </form>
      </div>
    </div>
  )
}