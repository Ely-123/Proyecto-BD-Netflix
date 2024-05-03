const oracledb = require('oracledb');

// Función para obtener las películas que le gustan al usuario
module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    let connection = await oracledb.getConnection({
      user: 'tu_usuario',
      password: 'tu_contraseña',
      connectString: 'tu_cadena_de_conexión',
    });

    const result = await connection.execute(
      `SELECT LIKEDMOVIES FROM USERS WHERE EMAIL = :email`,
      [email]
    );

    await connection.close();

    if (result.rows.length > 0) {
      const movies = result.rows[0][0];
      return res.json({ msg: "success", movies: movies });
    } else {
      return res.json({ msg: "User with given email not found." });
    }
  } catch (error) {
    console.error(error);
    return res.json({ msg: "Error fetching movies." });
  }
};

// Función para añadir una película a la lista de películas que le gustan al usuario
module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    let connection = await oracledb.getConnection({
      user: 'tu_usuario',
      password: 'tu_contraseña',
      connectString: 'tu_cadena_de_conexión',
    });

    const result = await connection.execute(
      `SELECT LIKEDMOVIES FROM USERS WHERE EMAIL = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    let likedMovies = result.rows.length > 0 ? result.rows[0].LIKEDMOVIES : [];

    if (!likedMovies.some(movie => movie.id === data.id)) {
      likedMovies.push(data);
      await connection.execute(
        `UPDATE USERS SET LIKEDMOVIES = :likedMovies WHERE EMAIL = :email`,
        [likedMovies, email]
      );
      await connection.commit();
      await connection.close();
      return res.json({ msg: "Movie successfully added to liked list." });
    } else {
      await connection.close();
      return res.json({ msg: "Movie already added to the liked list." });
    }
  } catch (error) {
    console.error(error);
    return res.json({ msg: "Error adding movie to the liked list" });
  }
};

// Función para eliminar una película de la lista de películas que le gustan al usuario
module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    let connection = await oracledb.getConnection({
      user: 'tu_usuario',
      password: 'tu_contraseña',
      connectString: 'tu_cadena_de_conexión',
    });

    const result = await connection.execute(
      `SELECT LIKEDMOVIES FROM USERS WHERE EMAIL = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    let likedMovies = result.rows.length > 0 ? result.rows[0].LIKEDMOVIES : [];

    const index = likedMovies.findIndex(movie => movie.id === movieId);
    if (index !== -1) {
      likedMovies.splice(index, 1);
      await connection.execute(
        `UPDATE USERS SET LIKEDMOVIES = :likedMovies WHERE EMAIL = :email`,
        [likedMovies, email]
      );
      await connection.commit();
      await connection.close();
      return res.json({ msg: "Movie successfully removed.", movies: likedMovies });
    } else {
      await connection.close();
      return res.json({ msg: "Movie not found." });
    }
  } catch (error) {
    console.error(error);
    return res.json({ msg: "Error removing movie from the liked list" });
  }
};
