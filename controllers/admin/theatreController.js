
const { addTheatreToDb, getAllTheatres, deleteTheatreFromDb } = require("../../repositories/admin/theatreRepository");


//Adding a theatre to database--

const addTheatre = async (req, res) => {
  try {
    const { name, location, seatingCapacity } = req.body;

    if (!name || !location || !seatingCapacity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const theatreData = { name, location, seatingCapacity };
    const newTheatre = await addTheatreToDb(theatreData);

    res.status(201).json({ message: "Theatre added successfully" , newTheatre});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Reading details of a theatre from database----

const showTheatre = async (req, res) => {
  try {
    const theatres = await getAllTheatres();
    res.json(theatres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Deleting a theatre---

const deleteTheatre = async (req, res) => {
  if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      const result = await deleteTheatreFromDb(id);

      if (!result) {
        return res.status(404).json({ error: "Theatre not found" });
      }

      res.status(200).json({ message: "Theatre deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete Theatre", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

module.exports = {
  addTheatre,
  showTheatre,
  deleteTheatre,
};
