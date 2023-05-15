import { db } from '../firebase';
import { doc , getDoc } from "firebase/firestore";

export async function getNumLikes(hangoutID) {
    const hangoutRef = doc(db, 'hangouts', hangoutID);
    const hangoutSnap = await getDoc(hangoutRef);

    if(hangoutSnap.exists()) {
      let likes = hangoutSnap.data().likedUsers
      let numLikes = likes.length
      return numLikes
    }
    else {
      console.log("Document for hangout does not exist")
      return 0
    }
  }