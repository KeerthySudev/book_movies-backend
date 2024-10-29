
const multer = require("multer");
const path = require("path");
const { addMovieToDb, getAllMovies, deleteMovieAndRelatedData } = require("../../repositories/admin/movieRepository");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/posters");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("poster");

//Adding a movie to database-------------------------

const addMovie = async (req, res) => {
  try {
    // Use Multer to handle file upload
    console.log(req.body);
    console.log(req.file);
    upload(req, res, async (err) => {
      if (err) {
        console.error("Upload error:", err.message);
        return res.status(500).json({ error: err.message });
      }

      const { title, genre, language, director, cast, synopsis } = req.body;
      console.log(req.body);
      console.log(req.file);

      if (!req.file) {
        return res.status(400).json({ error: "Poster is required" });
      }

      const posterUrl = `/uploads/posters/${req.file.filename}`;
      const movieData = {
        title,
        genre,
        language,
        director,
        cast: cast.split(",").map((c) => c.trim()),
        synopsis,
        posterUrl,
      };

      try {
        const newMovie = await addMovieToDb(movieData);
        res
          .status(201)
          .json({ message: "Movie added successfully", movie: newMovie });
      } catch (error) {
        console.error("Database save error:", error.message);
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Reading movie details from database-----

const showMovie = async (req, res) => {
  try {
    const movies = await getAllMovies();

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Deleting a movie-------------------

const deleteMovie = async (req, res) => {
  if (req.method === "DELETE") {
    const { movieId } = req.query;

    try {
      const result = await deleteMovieAndRelatedData(movieId);

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

module.exports = {
  addMovie,
  showMovie,
  deleteMovie,
};
