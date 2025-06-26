import e from "express";
import {
	handleAddItem,
	handleAllDataRetrieval,
	handleConnectionCheck,
	handleDeleteItem,
	handleEditItem,
	handleEmptyTrash,
	handleMarkTrash,
} from "../controllers/app.controllers.js";

const router = e.Router();

// Check Connection & Auth Status
router.route("/connect").get(handleConnectionCheck);

// Retrieve all the passwd list
router.route("/all").get(handleAllDataRetrieval);

// Empty the trash bin
router.route("/all/del").delete(handleEmptyTrash);

// Insert, edit, move to trash, del from trash
router
	// route where individual CRUD op is done
	.route("/item/:itemID")
	// insert passwd
	.post(handleAddItem)
	// remove passwd from trash bin
	.delete(handleDeleteItem)
	// move to trash bin (mark trash to enable or disable)
	.patch(handleMarkTrash)
	// replace the whole passwd item with new edited one
	.put(handleEditItem);

export const appRouter = router;
