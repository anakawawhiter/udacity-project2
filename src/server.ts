import express from 'express';
import bodyParser from 'body-parser';
import fetch from "node-fetch";
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    try {
  //    1. validate the image_url query
      const image_url: string = req.query.image_url as string;
      if (!image_url) {
        throw Error();
      }
      const fetch_res = await fetch(image_url.toString(), { method: 'GET' });
      if(fetch_res.status !== 200) {
        throw Error();
      }
  //     2. call filterImageFromURL(image_url) to filter the image
      const image_path: string = await filterImageFromURL(image_url);
      console.log( `Img path: ` + image_path );
  //    3. send the resulting file in the response
      res.sendFile(image_path);
      console.log( `Img files was sent!` );
  //    4. deletes any files on the server on finish of the response
      setTimeout(() => {
        deleteLocalFiles([image_path]);
        console.log( `Deleted img files!` );
      }, 10000);
    } catch {
        res.status(400).send({ 'msg': "The input URL is invalid!"});
    }
  });
  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();