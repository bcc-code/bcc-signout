import express from 'express';


const router = express.Router()

router.route("/:userId")
    .post()

export { router as logoutRouter };