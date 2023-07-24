// perfect place to handle UPDATE and DELETE
import {NextApiHandler} from 'next';
import Posts from '../../../../models/Post';
import {readFile} from '../../../../lib/utils';
import {postValidationSchema, validateSchema} from '../../../../lib/validator';
import cloudinary from '../../../../lib/cloudinary';
import formidable from 'formidable';

export const config = {
    api: { bodyParser: false },
};

const handler: NextApiHandler = (req,res) => {
    const { method } = req;
    switch (method) {
        case 'PATCH': return updatePost(req,res);
        default: res.status(404).send('Not Found');
    }
}

interface IncomingPost {
    title: string;
    content: string;
    meta: string;
    slug: string;
    tags: string;
}

const updatePost: NextApiHandler = async (req,res) => {
    const postId = req.query.postId as string;
    const post = await Posts.findById(postId);
    if(!post) return res.status(404).send({ error: 'Post not found!'});
    const { files, body } = await readFile<IncomingPost>(req);

    let tags = [];
    if(body.tags) tags = JSON.parse(body.tags as string)

    const error = validateSchema(postValidationSchema, { ...body, tags });
    if(error) return res.status(400).json({ error });

    const { title, content, meta, slug } = body;
    post.title = title;
    post.content = content;
    post.meta = meta;
    post.tags = tags;
    post.slug = slug;

    // update thumbnail only if there is any
    const thumbnail = files.thumbnail as formidable.File;
    if(thumbnail) {
        const { secure_url: url, public_id} = await cloudinary.uploader
            .upload(
                thumbnail.filepath, {
                    folder: 'dev-blogs',
            });
        // #1-cond. => the post can already have thumbnail
        // so remove old, upload new image and the update record inside DB.
        const publicId = post.thumbnail?.public_id;
        if(publicId) await cloudinary.uploader.destroy(publicId);
        // #2.cond. => the post can be without thumbnail
        // just upload image and update record inside DB
        post.thumbnail = {url, public_id};
    }
    await post.save();
    res.json( { post })
}

export default handler;
