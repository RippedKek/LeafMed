import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-expo'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from '@firebase/firestore'
import { app } from '../../firebase'
import { create } from 'zustand'

export interface PinnedRemedy {
  disease: string
  dateAdded: string
  ingredients: Array<{
    name: string
    usage: string
  }>
}

interface UserStore {
  pinnedRemedies: PinnedRemedy[]
  setPinnedRemedies: (remedies: PinnedRemedy[]) => void
  addPinnedRemedy: (userId: string, remedy: PinnedRemedy) => Promise<void>
  removePinnedRemedy: (userId: string, remedy: PinnedRemedy) => Promise<void>
}

export type State = {
  pinnedRemedies: PinnedRemedy[]
}

export type Action = {
  setPinnedRemedies: (remedies: PinnedRemedy[]) => void
  addPinnedRemedy: (userId: string, remedy: PinnedRemedy) => Promise<void>
  removePinnedRemedy: (userId: string, remedy: PinnedRemedy) => Promise<void>
}

const db = getFirestore(app)

export const useUserStore = create<State & Action>((set) => ({
  pinnedRemedies: [],
  setPinnedRemedies: (remedies: PinnedRemedy[]) =>
    set({ pinnedRemedies: remedies }),
  addPinnedRemedy: async (userId: string, remedy: PinnedRemedy) => {
    if (!userId) return

    const userRef = doc(db, 'users', userId)
    await setDoc(
      userRef,
      {
        pinnedRemedies: arrayUnion(remedy),
      },
      { merge: true }
    )
    set((state: State) => ({
      pinnedRemedies: [...state.pinnedRemedies, remedy],
    }))
  },
  removePinnedRemedy: async (userId: string, remedy: PinnedRemedy) => {
    if (!userId) return

    const userRef = doc(db, 'users', userId)
    await setDoc(
      userRef,
      {
        pinnedRemedies: arrayRemove(remedy),
      },
      { merge: true }
    )
    set((state: State) => ({
      pinnedRemedies: state.pinnedRemedies.filter(
        (r) => r.dateAdded !== remedy.dateAdded
      ),
    }))
  },
}))

export const useFirebaseSync = () => {
  const { user } = useUser()
  const setPinnedRemedies = useUserStore(
    (state: State & Action) => state.setPinnedRemedies
  )

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
            pinnedRemedies: [],
          }

          await setDoc(userRef, userData)
          setPinnedRemedies([])
        } else {
          const userData = userDoc.data()
          setPinnedRemedies(userData.pinnedRemedies || [])

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
  }, [user, setPinnedRemedies])
}

export default useFirebaseSync
