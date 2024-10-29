const Theatre = require("../../models/Theatre");
const Showtime = require("../../models/Showtime");
const Booking = require("../../models/Booking");

// Add a new theatre to the database
const addTheatreToDb = async (theatreData) => {
  const newTheatre = new Theatre(theatreData);
  return await newTheatre.save();
};

// Get all theatres from the database
const getAllTheatres = async () => {
  return await Theatre.find({});
};

// Delete a theatre by its ID and remove associated shows and bookings
const deleteTheatreFromDb = async (theatreId) => {
  // Find and delete the theatre
  const deletedTheatre = await Theatre.findByIdAndDelete(theatreId);
  
  // Find and delete the related shows
  const deletedShows = await Showtime.find({ theatre: theatreId });
  const showIds = deletedShows.map((show) => show._id);
  
  await Showtime.deleteMany({ theatre: theatreId });

  // Remove or nullify references to the deleted shows in bookings
  await Booking.updateMany(
    { showId: { $in: showIds } },
    { $unset: { showId: "" } }
  );

  return deletedTheatre;
};

module.exports = {
  addTheatreToDb,
  getAllTheatres,
  deleteTheatreFromDb,
};
