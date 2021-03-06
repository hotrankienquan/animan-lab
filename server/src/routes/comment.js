const router = require("express-promise-router")();
const CommentController = require("../controllers/comment");
const { verifyAccessToken } = require("../helper/jwtService");
const {
  validateBody,
  validateParams,
  schemas,
} = require("../helper/validateRouter");

/*
/v1/comments
*/
router
  .route("/")
  .get(CommentController.index)
  .post(validateBody(schemas.reportSchema), CommentController.reportComment);

/*
/v1/comments/like
*/
router.post(
  "/like",
  validateBody(schemas.objectIdRequiredSchema),
  verifyAccessToken,
  CommentController.likeComment
);

/*
/v1/comments/unlike
*/
router.post(
  "/unlike",
  validateBody(schemas.objectIdRequiredSchema),
  verifyAccessToken,
  CommentController.unlikeComment
);

/*
/v1/comments/create-comment
*/
router.post(
  "/create-comment",
  validateBody(schemas.commentSchema),
  verifyAccessToken,
  CommentController.createComment
);

/*
/v1/comments/delete-comment/:id
*/
router.delete(
  "/delete-comment/:id",
  validateParams(schemas.objectIdSchema, "id"),
  verifyAccessToken,
  CommentController.deleteComment
);

/*
/v1/comments/update-comment/:id
*/
router.patch(
  "/update-comment/:id",
  validateParams(schemas.objectIdSchema, "id"),
  validateBody(schemas.updateCommentSchema),
  verifyAccessToken,
  CommentController.updateComment
);

module.exports = router;
