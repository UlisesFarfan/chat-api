// index.ts
import 'dotenv/config';

// application with express
import app from './src/app';

// database connection
import connectionDb from './src/config/database';

// if the connection to the database is successful, we start the server
connectionDb.then(() => {
  app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT);
  })
})