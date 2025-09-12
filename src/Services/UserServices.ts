import { Firestore, addDoc, collection} from "firebase/firestore"
import { adminDb as db } from "@/lib/firebase-admin";
import InternalServerError from "@/exceptions/InternalServerError";
import NotFoundError from "@/exceptions/NotFoundError";
import BaseError from "@/exceptions/BaseError";

export default class UserServices {
    _db: typeof db
    constructor(database: any) {
        this._db = db
    }

    async createUser (payload: any) {
        try {
           const docRef = await this._db.collection('users').add({
                ...payload,
                createdAt: new Date()
            });

            return docRef.id
        } 
        catch (error) {
            if (!(error instanceof BaseError)) {
                throw new InternalServerError(`Internal Server Error: ${error}`);
            }
            throw error
        }
    }

    async getUser (email?: string) {
        try {
            if (email) {
                const snapshot = await this._db.collection('users')
                    .where('email', '==', email)
                    .limit(1)
                    .get();
                if (snapshot.empty) {
                    throw new NotFoundError (`Not found Error : Data(${email}) not found`)
                }
    
                const doc = snapshot.docs[0];
                return {
                    ...doc.data()
                }
            }
            else {
                const snapshot = await this._db.collection('users').get();
                if (snapshot.empty) {
                    throw new NotFoundError (`Not found Error : Data(${email}) not found`)
                }
    
                const users = snapshot.docs.map((doc) => ({
                    ...doc.data()
                }))

                return users
            }
        } 
        catch (error) {
            if (!(error instanceof BaseError)) {
                throw new InternalServerError(`Internal Server Error: ${error}`);
            }
            throw error
        }
    }
}