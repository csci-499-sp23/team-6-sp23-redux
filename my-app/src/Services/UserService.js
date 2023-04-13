import { db } from '../firebase';
import { doc, getDoc} from "firebase/firestore";

export async function getUserData() {
    const id = localStorage.getItem("userId");
    const userId = JSON.parse(id) !== null ? JSON.parse(id) : "";
    const userRef = doc(db, 'users', userId);

    try {
        const userData = await getDoc(userRef).then((response) => {
            return response.data()
        })
        return userData
    }
    catch(error) {
        console.log(`Fetch user data error: ${error}`)
        return []
    }
}

