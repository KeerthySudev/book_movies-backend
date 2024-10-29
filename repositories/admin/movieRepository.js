const Movie = require("../../models/Movie");
const Showtime = require("../../models/Showtime");
const Booking = require("../../models/Booking");

// Function to add a new movie to the database
const addMovieToDb = async (movieData) => {
  const newMovie = new Movie(movieData);
  return await newMovie.save();
};

// Function to get all movies from the database
const getAllMovies = async () => {
  return await Movie.find({});
};

// Function to delete a movie and its associated showtimes/bookings
const deleteMovieAndRelatedData = async (movieId) => {
  const result = await Movie.findByIdAndDelete(movieId);
  const deletedShows = await Showtime.find({ movie: movieId });

  const showIds = deletedShows.map((show) => show._id);
  await Showtime.deleteMany({ movie: movieId });

  await Booking.updateMany(
    { showId: { $in: showIds } },
    { $unset: { showId: "" } }
  );

  return result;
};

module.exports = {
  addMovieToDb,
  getAllMovies,
  deleteMovieAndRelatedData,
};
