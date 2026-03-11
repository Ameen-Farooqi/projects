import express from 'express';
import { createAuthor, loginAuthor } from './controllers/authorController.mjs';
import { createBlog, deleteBlog, deleteBlogWithQuery, getBlogs, publishedBlog, updateBlog } from './controllers/blogController.mjs';
import { authentication,authorisation } from './auth/authentication.mjs';
const router= express.Router();
router.get('/api',(req,res)=>{
    return res.status(200).send({message:"ok"})
})
router.post('/authors',createAuthor)
router.post('/blogs',authentication,authorisation,createBlog)
router.get('/blogs',getBlogs)
router.put('/blogs/:blogId',authentication,authorisation,updateBlog)
router.delete('/blogs/:blogId',authentication,authorisation,deleteBlog)
router.delete('/blogs',authentication,authorisation,deleteBlogWithQuery)
router.get('/blogs/published',publishedBlog)
router.post('/login',loginAuthor)
export default router;