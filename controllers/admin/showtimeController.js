
const { addShowtimeToDb, getAllShowtimes, deleteShowtimeFromDb } = require("../../repositories/admin/showtimeRepository");


//Generating seats wih rows and columns------

const generateSeats = (rows, cols) => {
  const seats = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let row = 0; row < rows; row++) {
    for (let col = 1; col <= cols; col++) {
      seats.push({
        seatId: `${alphabet[row]}${col}`,
        isAvailable: true,
        bookedBy: null,
      });
    }
  }

  return seats;
};

//Add a showtime to the database----------

const addShow = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { movie, theatre, showdate, showtime, price, rows, seatPerRows } =
      req.body;
    if (
      !movie ||
      !theatre ||
      !showdate ||
      !showtime ||
      !price ||
      !rows ||
      !seatPerRows
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const seats = generateSeats(rows, seatPerRows);
    const showtimeData = { movie, theatre, showdate, showtime, price, seats };
    const newShowtime = await addShowtimeToDb(showtimeData);;
    res
      .status(201)
      .json({ message: "Showtime added successfully", newShowtime });
  } catch (error) {
    console.error("Error saving showtime:", error);
    res.status(500).json({ error: error.message });
  }
};

//Read showtimes from the database--------

const showTimes = async (req, res) => {
  try {
    const shows = await getAllShowtimes();
    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete a showtime-------

const deleteShow = async (req, res) => {
  if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      const result =  await deleteShowtimeFromDb(id);

      if (!result) {
        return res.status(404).json({ error: "Movie not found" });
      }

      res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete movie", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

module.exports = { showTimes, addShow, deleteShow };
