type EditCuisineProps = {
  cuisine: object;
  isOpen: boolean;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  closeModal: React.MouseEventHandler<HTMLButtonElement>;
}

export default function EditCuisine({ cuisine, isOpen, handleSubmit, closeModal }: EditCuisineProps) {

  if (!isOpen) return null;

  const { name, region, description } = cuisine;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Edit Cuisine</h2>
        <form onSubmit={handleSubmit} id="editCuisineForm">
          <label htmlFor="cuisineName">Cuisine Name: </label>
          <br />
          <input type="text" name="cuisineName" id="edit__cuisineName" defaultValue={name} />
          <br />
          <label htmlFor="cuisineRegion">Cuisine Region: </label>
          <br />
          <input type="text" name="cuisineRegion" id="edit__cuisineRegion" defaultValue={region} />
          <br />
          <label htmlFor="cuisineDescription">Cuisine Description: </label>
          <br />
          <textarea name="cuisineDescription" id="edit__cuisineDescription" defaultValue={description} rows={5} cols={45} />
          <br />
          <button className="editbutton" type="submit">Submit</button>
          <button className="deletebutton" type="button" onClick={closeModal}>Close</button>
        </form>
      </div>
    </div>
  )
}