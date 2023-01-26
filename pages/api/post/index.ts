import clientPromise from "../../../lib/mongodb";
const ObjectId = require('mongodb').ObjectId;
import type { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';

type Output = {
    message: any;
};

type Handler = (
    req: NextApiRequest,
    res: NextApiResponse<Output>
) => Promise<void>;

const addPost: Handler = async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("posts");
        const { title, content } = req.body;
        const post = await db.collection("posts").insertOne({
            title,
            content,
        });
        res.status(StatusCodes.CREATED).json({ message: post })
    } catch (e: any) {
        console.error(e);
        throw new Error(e).message;
    }
}

const getPosts: Handler = async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("posts");
        const posts = await db.collection("posts").find({}).limit(20).toArray();
        res.status(StatusCodes.CREATED).json({ message: posts })
    } catch (e: any) {
        console.error(e);
        throw new Error(e).message;
    }
}

const updatePost: Handler = async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("posts");
        const { id } = req.query;
        const { title, content } = req.body;
        const post = await db.collection("posts").updateOne(
            {
                _id: ObjectId(id),
            },
            {
                $set: {
                    title: title,
                    content: content,
                },
            }
        );
        res.status(StatusCodes.CREATED).json({ message: post })
    } catch (e: any) {
        console.error(e);
        throw new Error(e).message;
    }
}

const deletePost: Handler = async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("posts");
        const { id } = req.query;
        const post = await db.collection("posts").deleteOne({
            _id: ObjectId(id),
        });
        res.status(StatusCodes.CREATED).json({ message: post })
    } catch (e: any) {
        console.error(e);
        throw new Error(e).message;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Output>
) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getPosts(req, res);
        }
        case 'POST': {
            return addPost(req, res);
        }
        case 'PUT': {
            return updatePost(req, res);
        }
        case 'DELETE': {
            return deletePost(req, res);
        }
    }
}