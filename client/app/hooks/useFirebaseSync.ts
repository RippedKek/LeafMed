import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-expo'
import { getFirestore, doc, setDoc, getDoc } from '@firebase/firestore'
import { app } from '../../firebase'

const db = getFirestore(app)

export const useFirebaseSync = () => {
  const { user } = useUser()

  useEffect(() => {
    const syncUserWithFirebase = async () => {
      if (!user) return

      try {
        const userRef = doc(db, 'users', user.id)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          const userData = {
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            fullName: user.firstName + ' ' + user.lastName,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            createdAt: new Date().toISOString(),
            lastSignInAt: new Date().toISOString(),
          }

          await setDoc(userRef, userData)
        } else {
          await setDoc(
            userRef,
            {
              lastSignInAt: new Date().toISOString(),
            },
            { merge: true }
          )
        }
      } catch (error) {
        console.error('Error syncing user with Firebase:', error)
      }
    }

    syncUserWithFirebase()
  }, [user])
}
