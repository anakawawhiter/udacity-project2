"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const util_1 = require("./util/util");
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
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
    app.get("/filteredimage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //    1. validate the image_url query
            const image_url = req.query.image_url;
            if (!image_url) {
                throw Error();
            }
            const fetch_res = yield node_fetch_1.default(image_url.toString(), { method: 'GET' });
            if (fetch_res.status !== 200) {
                throw Error();
            }
            //     2. call filterImageFromURL(image_url) to filter the image
            const image_path = yield util_1.filterImageFromURL(image_url);
            console.log(`Img path: ` + image_path);
            //    3. send the resulting file in the response
            res.sendFile(image_path);
            console.log(`Img files was sent!`);
            //    4. deletes any files on the server on finish of the response
            setTimeout(() => {
                util_1.deleteLocalFiles([image_path]);
                console.log(`Deleted img files!`);
            }, 10000);
        }
        catch (_a) {
            res.status(400).send({ 'msg': "The input URL is invalid!" });
        }
    }));
    /**************************************************************************** */
    //! END @TODO1
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send("try GET /filteredimage?image_url={{}}");
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map