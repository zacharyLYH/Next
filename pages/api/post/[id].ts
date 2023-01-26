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

const getPost: Handler = async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("posts");
        const { id } = req.query;

        const post = await db.collection("posts").findOne({
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
            return getPost(req, res);
        }
    }
}