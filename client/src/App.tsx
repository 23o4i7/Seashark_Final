import React, { useEffect, useState } from "react";

import useSignalR from "./useSignalR";
import axios from "axios";

import "./App.css";

import DishCard from "./DishCard";
import CuisineCard from "./CuisineCard";
import CuisineSelector from "./CuisineSelector";
import EditCuisine from "./EditCuisine";
import EditDish from "./EditDish";


export default function App() {
  const { connection } = useSignalR("/r/sharehub");

  const [cuisine, setCuisine] = useState("");
  const [cuisineDescription, setCuisineDescription] = useState("");
  const [cuisineRegion, setCuisineRegion] = useState("");
  const [cuisineList, setCuisineList] = useState<any[]>([]);
  const [dish, setDish] = useState("");
  const [dishDescription, setDishDescription] = useState("");
  const [dishCuisine, setDishCuisine] = useState(1);
  const [dishList, setDishList] = useState<any[]>([]);
  const [cuisineToEdit, setCuisineToEdit] = useState({});
  const [editCuisineModal, setEditCuisineModal] = useState(false);
  const [dishToEdit, setDishToEdit] = useState({});
  const [editDishModal, setEditDishModal] = useState(false);

  // Modal functions
  const openEditCuisineModal = () => setEditCuisineModal(true);
  const closeEditCuisineModal = () => setEditCuisineModal(false);
  const openEditDishModal = () => setEditDishModal(true);
  const closeEditDishModal = () => setEditDishModal(false);

  // Cuisine functions
  const addCuisine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      name: cuisine,
      description: cuisineDescription,
      region: cuisineRegion,
      dishes: [],
    }
    setCuisine("");
    setCuisineDescription("");
    setCuisineRegion("");
    await axios.post("/api/cuisines", data);
  };

  const updateCuisineList = async () => {
    const response = await axios.get("/api/cuisines");
    const orderedData = response.data.sort((a: any, b: any) => a.id - b.id);
    setCuisineList(orderedData);
  };

  const deleteCuisine = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const cuisineId = e.currentTarget.value;
    await axios.delete(`/api/cuisines/${cuisineId}`);
  };

  const editCuisine = (e: React.MouseEvent<HTMLButtonElement>) => {
    const cuisineId = Number(e.currentTarget.value);
    const cuisine = getCuisineById(cuisineId);
    setCuisineToEdit(cuisine);
    openEditCuisineModal();
    console.log("Edit cuisine:", cuisineId)
  };
  
  const submitEditCuisineForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newCuisineName = e.currentTarget.cuisineName.value;
    const newCuisineRegion = e.currentTarget.cuisineRegion.value;
    const newCuisineDescription = e.currentTarget.cuisineDescription.value;
    const id = Number(cuisineToEdit.id);
    const data = {
      id,
      name: newCuisineName,
      region: newCuisineRegion,
      description: newCuisineDescription,
    }
    closeEditCuisineModal();
    await axios.put(`/api/cuisines/${id}`, data);
  }

  // TEMP: the other thing won't work
  const getCuisineById = (id: number) => {
    return cuisineList.find((cuisine) => cuisine.id === id);
  };


  // Dish functions
  const addDish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      name: dish,
      description: dishDescription,
      cuisineId: dishCuisine,
    }
    setDish("");
    setDishDescription("");
    await axios.post("/api/dishes", data);
  };

  const updateDishList = async () => {
    const response = await axios.get("/api/dishes");
    const orderedData = response.data.sort((a: any, b: any) => a.id - b.id);
    setDishList(orderedData);
  };

  const deleteDish = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const dishId = e.currentTarget.value;
    await axios.delete(`/api/dishes/${dishId}`);
  };

  const editDish = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dishId = Number(e.currentTarget.value);
    const dish = getDishById(dishId);
    const data = {
      id: dishId,
      name: dish.name,
      description: dish.description,
      cuisineId: dish.cuisineId,
    }
    setDishToEdit(dish);
    openEditDishModal();
    console.log("Edit dish:", data)
  };

  const submitEditDishForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newDishName = e.currentTarget.dishName.value;
    const newDishDescription = e.currentTarget.dishDescription.value;
    const newDishCuisine = (document.getElementById("cuisineSelector__edit") as HTMLSelectElement).value;
    const id = Number(dishToEdit.id);
    const data = {
      id,
      name: newDishName,
      description: newDishDescription,
      cuisineId: newDishCuisine,
    }
    console.log(data)
    closeEditDishModal();
    await axios.put(`/api/dishes/${id}`, data);
  }
  
  const getDishById = async (id: number) => {
    return dishList.find((dish) => dish.id === id);
  }

  useEffect(() => {
    if (!connection) {
      return
    };

    // Initial load
    updateCuisineList();
    updateDishList();

    // Listen
    connection.on("CreatedCuisine", (cuisine) => {
      console.log("Created cuisine:", cuisine)
      updateCuisineList();
    });

    connection.on("UpdatedCuisine", (cuisine) => {
      console.log("Updated cuisine:", cuisine)
      updateCuisineList();
    });

    connection.on("DeletedCuisine", (cuisine) => {
      console.log("Deleted cuisine:", cuisine)
      updateCuisineList();
    });
    
    connection.on("CreatedDish", (dish) => {
      console.log("Created dish:", dish)
      updateDishList();
    });

    connection.on("UpdatedDish", (dish) => {
      console.log("Updated dish:", dish)
      updateDishList();
    });

    connection.on("DeletedDish", (dish) => {
      console.log("Deleted dish:", dish)
      updateDishList();
    });
  
    // Disconnect
    return () => {
      connection.off("")
    };
  }, [connection])

  return (
    <div className="App">
      <h1>Some Food</h1>

      <div className="content">
        <div className="cuisineSection">
          <h2>Cuisines</h2>
          <form onSubmit={addCuisine} id="addCuisineForm">
            <label htmlFor="cuisineName">Cuisine Name: </label>
            <input name="cuisineName" type="text" value={cuisine} onChange={e => setCuisine(e.target.value)} required />
            <br/>
            <label htmlFor="cuisineRegion">Cuisine Region: </label>
            <input name="cuisineRegion" type="text" value={cuisineRegion} onChange={e => setCuisineRegion(e.target.value)} required />
            <br/>
            <label htmlFor="cuisineDescription">Cuisine Description: </label>
            <br/>
            <textarea name="cuisineDescription" value={cuisineDescription} onChange={e => setCuisineDescription(e.target.value)} rows={5} cols={32} required />
            <br/>
            <button className="addButton" type="submit">Add Cuisine</button>
          </form>
          {cuisineList.map(cuisine => (
            <div className="cuisinecard">
              <CuisineCard
                key={cuisine.id}
                cuisineId={cuisine.id}
                cuisineName={cuisine.name}
                cuisineRegion={cuisine.region}
                cuisineDescription={cuisine.description}
                handleDelete={deleteCuisine}
                handleEdit={editCuisine}
              />
            </div>
          ))}
        </div>

        <div className="foodSection">
          <h2>Recently Added Foods</h2>
          <form onSubmit={addDish} id="addDishForm">
            <label htmlFor="dishName">Dish Name: </label>
            <input name="dishName" type="text" value={dish} onChange={e => setDish(e.target.value)} required />
            <br/>
            <label htmlFor="dishCuisine">Dish Cuisine: </label>
            <CuisineSelector 
              cuisineList={cuisineList}
              handleSelect={e => setDishCuisine(Number(e.target.value))} 
            />
            <br/>
            <label htmlFor="dishDescription">Dish Description: </label>
            <br/>
            <textarea name="dishDescription" value={dishDescription} onChange={e => setDishDescription(e.target.value)} rows={5} cols={45} required />
            <br/>
            <button className="addButton" type="submit">Add Dish</button>
          </form>
          {dishList.map(dish => (
            <div className="dishcard">
              <DishCard 
                key={dish.id} 
                dishId={dish.id} 
                dishName={dish.name} 
                dishDescription={dish.description}
                cuisineId={dish.cuisineId}
                findCuisine={getCuisineById} 
                handleDelete={deleteDish}
                handleEdit={editDish}
              />
            </div>
          ))}
        </div>
      </div>
    
    <EditCuisine 
      cuisine={cuisineToEdit}
      isOpen={editCuisineModal}
      handleSubmit={submitEditCuisineForm}
      closeModal={closeEditCuisineModal}
    />
    <EditDish
      dish={dishToEdit}
      isOpen={editDishModal}
      cuisineList={cuisineList}
      handleSubmit={submitEditDishForm}
      closeModal={closeEditDishModal}
    />
    </div>
  );
}