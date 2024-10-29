const Showtime = require("../../models/Showtime");

// Function to add a new showtime to the database
const addShowtimeToDb = async (showtimeData) => {
  const newShowtime = new Showtime(showtimeData);
  return await newShowtime.save();
};

// Function to get all showtimes with populated movie and theatre details
const getAllShowtimes = async () => {
  return await Showtime.find({})
    .populate("movie", "title")
    .populate("theatre", "name");
};

// Function to delete a showtime by its ID
const deleteShowtimeFromDb = async (showtimeId) => {
  return await Showtime.findByIdAndDelete(showtimeId);
};

module.exports = {
  addShowtimeToDb,
  getAllShowtimes,
  deleteShowtimeFromDb,
};
