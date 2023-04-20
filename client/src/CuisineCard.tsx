type CuisineCardProps = {
  cuisineId: number;
  cuisineName: string;
  cuisineRegion: string;
  cuisineDescription: string;
  handleDelete: React.MouseEventHandler<HTMLButtonElement>;
  handleEdit: React.MouseEventHandler<HTMLButtonElement>;
}

export default function CuisineCard ({ cuisineId, cuisineName, cuisineRegion, cuisineDescription, handleDelete, handleEdit }: CuisineCardProps) {
  return (
    <>
      <div>
        <span className="cuisinecard__name">{cuisineName}</span>
        <br/>
        <span className="cuisinecard__region">Region: {cuisineRegion}</span>
        <br />
        <span className="cuisinecard__description">{cuisineDescription}</span>
      </div>
      <button className="editbutton" value={`${cuisineId}`} onClick={handleEdit}>Edit</button>
      <button className="deletebutton" value={`${cuisineId}`} onClick={handleDelete}>Delete</button>
    </>
  )
}