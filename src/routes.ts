import {Router} from 'express'
import {createPost,deletePost,getAllPosts,getPost,updatePost} from './controller/Job_posts'

const router = Router()

//----------- COMPANY --------------

router.get('/vagas', getAllPosts)
router.get('/vaga/:id', getPost)
// PRIVATE ROUTES
router.post('/criar-vaga', createPost)
router.get('/delete', deletePost)
router.patch('/atualizar-vaga/:id', updatePost)

export default router
