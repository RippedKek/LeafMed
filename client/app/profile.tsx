import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  ScrollView,
} from 'react-native'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useUser, useAuth } from '@clerk/clerk-expo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ProfileProCard from './components/ProfileProCard'
import {
  useUserStore,
  PinnedRemedy,
  State,
  Action,
} from './hooks/useFirebaseSync'

const ProfilePage = () => {
  const router = useRouter()
  const { signOut } = useAuth()
  const { user } = useUser()
  const insets = useSafeAreaInsets()
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false)
  const [selectedRemedy, setSelectedRemedy] = useState<PinnedRemedy | null>(
    null
  )
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const pinnedRemedies = useUserStore(
    (state: State & Action) => state.pinnedRemedies
  )
  const removePinnedRemedy = useUserStore(
    (state: State & Action) => state.removePinnedRemedy
  )

  const [username, setUsername] = useState<string>(
    user?.username || user?.firstName + ' ' + user?.lastName || ''
  )
  const [email] = useState<string>(user?.emailAddresses[0]?.emailAddress || '')

  const openRemedyModal = (remedy: PinnedRemedy) => {
    setSelectedRemedy(remedy)
    setModalVisible(true)
  }

  const closeRemedyModal = () => {
    setSelectedRemedy(null)
    setModalVisible(false)
  }

  const handleUnpin = async (remedy: PinnedRemedy) => {
    if (!user) {
      console.error('No user found')
      return
    }

    try {
      await removePinnedRemedy(user.id, remedy)
      closeRemedyModal()
    } catch (error) {
      console.error('Error unpinning remedy:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/sign-in')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  return (
    <ScrollView
      style={[
        styles.scrollView,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 130,
        },
      ]}
      contentContainerStyle={[styles.container, { flexGrow: 1 }]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.push('/')}
          style={styles.backButton}
        >
          <Feather name='arrow-left' size={24} color='#2F4F2D' />
        </TouchableOpacity>
        <View style={styles.profileIconContainerCentered}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.profileIcon} />
          ) : (
            <View style={styles.defaultAvatarContainer}>
              <Text style={styles.defaultAvatarText}>
                {user?.firstName?.[0] || user?.username?.[0] || '?'}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Username</Text>
        {isEditingUsername ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize='none'
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setIsEditingUsername(false)}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.editRow}>
            <Text style={styles.value}>{username || 'No username set'}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditingUsername(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.editRow}>
          <Text style={styles.value}>{email || 'No email set'}</Text>
        </View>
      </View>

      <View style={styles.pinnedContainer}>
        <Text style={styles.pinnedTitle}>Pinned Remedies</Text>
        {pinnedRemedies.length > 0 ? (
          <FlatList
            data={pinnedRemedies}
            keyExtractor={(item) => item.dateAdded}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pinnedList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.remedyItem}
                onPress={() => openRemedyModal(item)}
              >
                <Text style={styles.remedyName}>{item.disease}</Text>
                <Text style={styles.remedyDate}>
                  {new Date(item.dateAdded).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noRemediesText}>
            No pinned remedies yet. Chat with AI to get recommendations!
          </Text>
        )}
        <View style={styles.profileProCardContainerWithMargin}>
          <ProfileProCard />
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={closeRemedyModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedRemedy && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedRemedy.disease}
                  </Text>
                  <TouchableOpacity
                    style={styles.unpinButton}
                    onPress={() => handleUnpin(selectedRemedy)}
                  >
                    <MaterialCommunityIcons
                      name='pin-off'
                      size={24}
                      color='#ff6b6b'
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>Recommended Herbs:</Text>
                {selectedRemedy.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientContainer}>
                    <Text style={styles.ingredientName}>
                      • {ingredient.name}
                    </Text>
                    <Text style={styles.ingredientUsage}>
                      {ingredient.usage}
                    </Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeRemedyModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
    zIndex: 10,
  },
  profileIconContainerCentered: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#DCECDC',
  },
  defaultAvatarContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#DCECDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2F4F2D',
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2F4F2D',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#1B3B2D',
    flex: 1,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#2F4F2D',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
    color: '#1B3B2D',
  },
  editButton: {
    marginLeft: 10,
    backgroundColor: '#BFD9C4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#2F4F2D',
    fontWeight: 'bold',
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: '#2F4F2D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pinnedContainer: {
    marginTop: 10,
    paddingBottom: 40,
  },
  pinnedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F4F2D',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  pinnedList: {
    paddingLeft: 10,
  },
  remedyItem: {
    backgroundColor: '#DCECDC',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 150,
  },
  remedyName: {
    color: '#2F4F2D',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  remedyDate: {
    color: '#2F4F2D',
    fontSize: 12,
    opacity: 0.7,
  },
  noRemediesText: {
    color: '#2F4F2D',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F4F2D',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F4F2D',
    marginTop: 10,
    marginBottom: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  unpinButton: {
    padding: 4,
  },
  ingredientContainer: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F4F2D',
    marginBottom: 4,
  },
  ingredientUsage: {
    fontSize: 14,
    color: '#1B3B2D',
    fontStyle: 'italic',
    paddingLeft: 16,
  },
  closeButton: {
    backgroundColor: '#2F4F2D',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileProCardContainer: {
    alignItems: 'center',
  },
  profileProCardContainerWithMargin: {
    alignItems: 'center',
    marginTop: 30,
  },
  signOutButton: {
    backgroundColor: '#2F4F2D',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
})

export default ProfilePage
